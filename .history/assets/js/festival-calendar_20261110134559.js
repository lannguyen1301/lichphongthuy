// assets/js/festival-calendar.js
// Chuyên trách Trang Lễ Tết (festival.html):
// 1. Custom Dropdown Kiểu A ([Tên sự kiện] bên trái — [Ngày diễn ra] sát phải) + Tìm kiếm nhanh & 3 Tabs + Khóa 365 ngày
// 2. Row Title 1 dòng & Row Subtitle 2 dòng tự động gán thuộc tính title khi cắt "..." (0 Layout Shift)
// 3. Singleton Countdown Timer (0 Memory Leak) & Khung cuộn Card độc lập
(() => {
    let countdownInterval = null;
    const pad = (n) => String(n).padStart(2, "0");
    const viWeekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "long" });

    // Tự động lấp đầy hàng cuối của Lưới Bento 3 cột
    const syncBentoRowFill = (visibleTiles) => {
        visibleTiles.forEach((t) => t.removeAttribute("data-fill-span"));
        if (!visibleTiles.length) return;

        const cols = window.innerWidth <= 991 ? 2 : 3;
        const totalUnits = visibleTiles.reduce((sum, tile) => sum + (tile.dataset.major === "true" ? 4 : 1), 0);
        const remainder = totalUnits % cols;
        if (remainder === 0) return;

        const neededExtraCols = cols - remainder;
        const normalTiles = visibleTiles.filter((t) => t.dataset.major !== "true");
        const lastNormal = normalTiles[normalTiles.length - 1];

        if (lastNormal && neededExtraCols <= 2) {
            lastNormal.dataset.fillSpan = String(1 + neededExtraCols);
        }
    };

    // Tính ngày mục tiêu trong cửa sổ 365 ngày tới (Nếu sự kiện năm nay đã qua, tự động tính kỳ lễ năm tiếp theo)
    const resolveSmartCountdownTarget = (tile) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [origY, origM, origD] = String(tile.dataset.date || "2026-11-20")
            .split("-")
            .map(Number);
        let targetDate = new Date(origY, origM - 1, origD, 0, 0, 0);
        let isRolloverNextYear = false;

        if (targetDate < todayStart) {
            isRolloverNextYear = true;
            const nextYear = now.getFullYear() + 1;

            if (tile.dataset.calendarType === "lunar" && window.LunarEngine && tile.dataset.lunarDay) {
                const lDay = Number(tile.dataset.lunarDay);
                const lMonth = Number(tile.dataset.lunarMonth);
                const lYearToConvert = lMonth === 12 ? nextYear - 1 : nextYear;
                const conv = window.LunarEngine.convertLunar2Solar(lDay, lMonth, lYearToConvert, 0);
                if (conv && conv.sDay > 0) {
                    targetDate = new Date(conv.sYear, conv.sMonth - 1, conv.sDay, 0, 0, 0);
                } else {
                    targetDate = new Date(nextYear, origM - 1, origD, 0, 0, 0);
                }
            } else {
                targetDate = new Date(nextYear, origM - 1, origD, 0, 0, 0);
            }
        }

        const diffDaysFromToday = Math.round((targetDate - todayStart) / 86400000);
        return { targetDate, isRolloverNextYear, diffDaysFromToday };
    };

    // Duy nhất 1 Singleton Interval cập nhật 4 ô Ngày : Giờ : Phút : Giây
    const tickMasterCountdown = () => {
        if (document.hidden) return;
        const timerEl = document.getElementById("festival-master-timer");
        if (!timerEl || !timerEl.dataset.targetIso) return;

        const targetMs = new Date(timerEl.dataset.targetIso).getTime();
        const diffSec = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));

        const days = Math.floor(diffSec / 86400);
        const hours = Math.floor((diffSec % 86400) / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;

        const dEl = timerEl.querySelector('[data-timer-part="days"]');
        const hEl = timerEl.querySelector('[data-timer-part="hours"]');
        const mEl = timerEl.querySelector('[data-timer-part="minutes"]');
        const sEl = timerEl.querySelector('[data-timer-part="seconds"]');

        if (dEl) dEl.textContent = pad(days);
        if (hEl) hEl.textContent = pad(hours);
        if (mEl) mEl.textContent = pad(minutes);
        if (sEl) sEl.textContent = pad(seconds);
    };

    const initFestivalCalendar = () => {
        const rootEl = document.getElementById("festival-calendar-root");
        const app = document.getElementById("festival-cal-app");
        if (!app) return;

        if (rootEl) rootEl.setAttribute("aria-busy", "false");
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const allTiles = Array.from(app.querySelectorAll(".festival-tile"));
        const filterBtns = Array.from(app.querySelectorAll("[data-festival-filter]"));
        const monthTabs = Array.from(app.querySelectorAll("[data-month-filter]"));
        const moreBtn = document.getElementById("festival-more-btn");
        const moreLabel = document.getElementById("festival-more-label");
        const totalCountEl = document.getElementById("festival-total-count");
        const yearDropdown = document.getElementById("festival-year-dropdown");
        const prevYearBtn = document.getElementById("festival-prev-year");
        const nextYearBtn = document.getElementById("festival-next-year");
        const scrollViewport = document.getElementById("festival-scroll-viewport");

        // Custom Dropdown chọn sự kiện đếm ngược (Kiểu A)
        const customDropdown = document.getElementById("festival-countdown-dropdown");
        const pickerListEl = document.getElementById("festival-picker-list");
        const pickerSearchInput = document.getElementById("festival-picker-search");
        const pickerTabs = Array.from(app.querySelectorAll("[data-picker-filter]"));
        const pickerFootEl = document.getElementById("festival-picker-foot");

        // 1. Render danh sách sự kiện vào Custom Dropdown Kiểu A (Khóa giới hạn trong vòng 365 ngày tới & sắp xếp gần nhất trước)
        const renderCustomPickerOptions = () => {
            if (!pickerListEl) return;
            const currentVal = app.dataset.activeEvent || "nha-giao-viet-nam";
            const activePickerTab = app.dataset.pickerTab || "upcoming";
            const query = (pickerSearchInput?.value || "").trim().toLowerCase();

            // Tính khoảng cách ngày thực tế trong vòng 365 ngày tới cho từng sự kiện
            const enrichedEvents = allTiles
                .map((tile) => {
                    const { targetDate, diffDaysFromToday } = resolveSmartCountdownTarget(tile);
                    const id = tile.dataset.eventId;
                    const name = tile.querySelector('[itemprop="name"]')?.textContent?.trim() || "";
                    const calType = tile.dataset.calendarType || "solar";
                    const isMajor = tile.dataset.major === "true";
                    const dispDate = `${pad(targetDate.getDate())}/${pad(targetDate.getMonth() + 1)}/${targetDate.getFullYear()}`;
                    const shortDate = `${pad(targetDate.getDate())}/${pad(targetDate.getMonth() + 1)}`;

                    return {
                        tile,
                        id,
                        name,
                        calType,
                        isMajor,
                        dispDate,
                        shortDate,
                        diffDaysFromToday,
                    };
                })
                // Khóa giới hạn thời gian: Chỉ lấy sự kiện trong vòng 370 ngày tới
                .filter((item) => item.diffDaysFromToday >= 0 && item.diffDaysFromToday <= 370)
                .sort((a, b) => a.diffDaysFromToday - b.diffDaysFromToday);

            let visibleCount = 0;

            pickerListEl.innerHTML = enrichedEvents
                .map((item, idx) => {
                    const isSelected = item.id === currentVal;

                    // Lọc theo Tab trong Popover hoặc theo từ khóa tìm kiếm
                    let matchesTab = true;
                    if (!query) {
                        if (activePickerTab === "upcoming") {
                            matchesTab = item.diffDaysFromToday <= 120 || item.isMajor || idx < 12;
                        } else if (activePickerTab === "lunar") {
                            matchesTab = item.calType === "lunar";
                        } else if (activePickerTab === "solar") {
                            matchesTab = item.calType === "solar";
                        }
                    } else {
                        const haystack = `${item.name} ${item.dispDate} ${item.shortDate}`.toLowerCase();
                        matchesTab = haystack.includes(query);
                    }

                    if (matchesTab) visibleCount++;

                    // Kiểu A: [Tên sự kiện] bên trái — [Ngày diễn ra] sát lề phải
                    return `
                        <li role="presentation" ${matchesTab ? "" : "hidden"}>
                            <button
                                type="button"
                                role="option"
                                aria-selected="${isSelected}"
                                class="festival-picker__option ${isSelected ? "is-selected" : ""}"
                                data-pick-event-id="${item.id}"
                                data-pick-date="${item.dispDate}"
                                title="${item.name} — Diễn ra ngày ${item.dispDate} (Còn ${item.diffDaysFromToday} ngày)"
                            >
                                <span class="festival-picker__opt-name">${item.name}</span>
                                <small class="festival-picker__opt-date">${item.dispDate}</small>
                            </button>
                        </li>
                    `;
                })
                .join("");

            if (pickerFootEl) {
                pickerFootEl.textContent = query
                    ? `Tìm thấy ${visibleCount} sự kiện khớp từ khóa`
                    : `Hiển thị ${visibleCount} sự kiện trong vòng 365 ngày tới`;
            }
        };

        // 2. Cập nhật Hàng Countdown trên cùng (Row Title 1 dòng + Row Subtitle 2 dòng + Tooltip title đầy đủ)
        const syncTileToMasterCountdown = (tile) => {
            if (!tile) return;
            const eventId = tile.dataset.eventId;
            const titleText = tile.querySelector('[itemprop="name"]')?.textContent?.trim() || "";
            app.dataset.activeEvent = eventId;

            const { targetDate, isRolloverNextYear, diffDaysFromToday } = resolveSmartCountdownTarget(tile);
            const tYear = targetDate.getFullYear();
            const tMonth = targetDate.getMonth() + 1;
            const tDay = targetDate.getDate();
            const isoTarget = `${tYear}-${pad(tMonth)}-${pad(tDay)}T00:00:00`;
            const dispDate = `${pad(tDay)}/${pad(tMonth)}/${tYear}`;

            // Cập nhật nút Summary của Custom Dropdown Kiểu A ([Tên sự kiện] trái — [Ngày] phải)
            const curNameEl = document.getElementById("festival-picker-current-name");
            const curDateEl = document.getElementById("festival-picker-current-date");
            if (curNameEl) curNameEl.textContent = titleText;
            if (curDateEl) curDateEl.textContent = dispDate;

            const timerEl = document.getElementById("festival-master-timer");
            if (timerEl) {
                timerEl.dataset.targetIso = isoTarget;
                timerEl.setAttribute("datetime", `${isoTarget}+07:00`);
            }

            const headingEl = document.getElementById("festival-countdown-heading");
            const nameEl = document.getElementById("festival-countdown-event-name");
            const rolloverTag = document.getElementById("festival-countdown-rollover-tag");
            const fullSolarEl = document.getElementById("festival-countdown-full-solar");
            const fullLunarEl = document.getElementById("festival-countdown-full-lunar");

            if (nameEl) nameEl.textContent = titleText;
            // Gán đầy đủ chuỗi vào thuộc tính title của Row Title để hiện tooltip khi bị cắt "..."
            if (headingEl) {
                headingEl.setAttribute("title", `Thời gian còn lại đến ${titleText} (${dispDate})`);
            }

            if (rolloverTag) {
                rolloverTag.textContent = isRolloverNextYear
                    ? `Kỳ lễ tiếp theo (${tYear}) • Còn ${diffDaysFromToday} ngày`
                    : `Sắp diễn ra • Còn ${diffDaysFromToday} ngày`;
            }

            // Row Subtitle Dòng 1 (Ngày Dương lịch) + thuộc tính title
            const weekdayStr = viWeekdayFormatter.format(targetDate);
            const solarLineStr = `📅 ${weekdayStr}, ngày ${pad(tDay)} tháng ${pad(tMonth)} năm ${tYear} Dương lịch`;
            if (fullSolarEl) {
                fullSolarEl.textContent = solarLineStr;
                fullSolarEl.setAttribute("title", solarLineStr);
            }

            // Row Subtitle Dòng 2 (Ngày Âm lịch & Can Chi) + thuộc tính title
            if (window.LunarEngine && fullLunarEl) {
                const lInfo = window.LunarEngine.getFullDayInfo(tDay, tMonth, tYear);
                const lunarLineStr = `🌙 Nhằm ngày ${pad(lInfo.lunarDay)}/${pad(lInfo.lunarMonth)} Âm lịch (Năm ${lInfo.yearCanChi} • Ngày ${lInfo.dayCanChi} - ${lInfo.dayNapAm})`;
                fullLunarEl.textContent = lunarLineStr;
                fullLunarEl.setAttribute("title", lunarLineStr);
            }

            renderCustomPickerOptions();
            tickMasterCountdown();
        };

        // 3. Cập nhật Thẻ Hero bên trái (Khóa chiều cao + Gán title đầy đủ cho các dòng cắt chữ)
        const syncTileToHero = (tile, alsoUpdateCountdown = false) => {
            if (!tile) return;
            const { date, solar, lunar, weekday, calendarType, zodiac, major, desc } = tile.dataset;
            const titleText = tile.querySelector('[itemprop="name"]')?.textContent?.trim() || "";
            const activeYear = app.dataset.activeYear || "2026";

            const [y, m, d] = String(date).split("-").map(Number);
            const eventDate = new Date(y, m - 1, d);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.round((eventDate - today) / 86400000);

            let subtlePrediction = `Hôm nay diễn ra ${titleText}`;
            if (diffDays > 0) {
                subtlePrediction = `Còn ${diffDays} ngày nữa là đến ${titleText}`;
            } else if (diffDays < 0) {
                const { diffDaysFromToday } = resolveSmartCountdownTarget(tile);
                subtlePrediction = `Đã qua ${Math.abs(diffDays)} ngày • Kỳ tới còn ${diffDaysFromToday} ngày`;
            }

            const heroPillEl = document.getElementById("festival-hero-countdown");
            if (heroPillEl) {
                heroPillEl.textContent = subtlePrediction;
                heroPillEl.setAttribute("title", subtlePrediction);
            }

            document.getElementById("festival-hero-type").dataset.calendarType = calendarType;
            document.getElementById("festival-hero-type-text").textContent =
                calendarType === "lunar"
                    ? major === "true"
                        ? "Đại lễ Âm lịch"
                        : "Lễ Âm lịch"
                    : major === "true"
                      ? "Đại lễ Dương lịch"
                      : "Lễ Dương lịch";

            const dotEl = document.querySelector("#festival-hero-type .festival-cal__dot");
            if (dotEl) {
                dotEl.className = `festival-cal__dot festival-cal__dot--${calendarType === "lunar" ? "lunar" : "solar"}`;
            }

            document.getElementById("festival-hero-solar").textContent = solar;
            document.getElementById("festival-hero-solar").setAttribute("datetime", date);
            document.getElementById("festival-hero-weekday").textContent = weekday;

            const descText =
                desc ||
                tile.querySelector(".festival-tile__desc")?.textContent?.trim() ||
                `Sự kiện ${titleText} diễn ra vào ngày ${solar}/${activeYear} Dương lịch (nhằm ngày ${lunar} Âm lịch).`;
            const heroDescEl = document.getElementById("festival-hero-desc");
            if (heroDescEl) {
                heroDescEl.textContent = descText;
                heroDescEl.setAttribute("title", descText);
            }

            const heroLunarEl = document.getElementById("festival-hero-lunar");
            const heroHoursEl = document.getElementById("festival-hero-hours");

            if (window.LunarEngine && y && m && d) {
                const info = window.LunarEngine.getFullDayInfo(d, m, y);
                document.getElementById("festival-hero-year").textContent = `Năm ${activeYear} (${info.yearCanChi})`;
                if (heroLunarEl) {
                    heroLunarEl.innerHTML = `Nhằm ngày <strong>${lunar} Âm lịch</strong> (Ngày ${info.dayCanChi} • ${info.dayNapAm})`;
                    heroLunarEl.setAttribute(
                        "title",
                        `Nhằm ngày ${lunar} Âm lịch (Ngày ${info.dayCanChi} • ${info.dayNapAm})`,
                    );
                }
                if (heroHoursEl) {
                    heroHoursEl.textContent = info.goodHoursStr;
                    heroHoursEl.setAttribute("title", info.goodHoursStr);
                }
            }

            const heroTitleEl = document.getElementById("festival-hero-title");
            if (heroTitleEl) {
                heroTitleEl.textContent = titleText;
                heroTitleEl.setAttribute("title", titleText);
            }

            document.getElementById("festival-hero-link").href = `./day.html?date=${date}`;
            document.getElementById("festival-hero-zodiac").src = `./assets/icons/zodiac/${zodiac || "horse"}.svg`;

            if (alsoUpdateCountdown) {
                allTiles.forEach((el) => {
                    const isSel = el === tile;
                    el.classList.toggle("is-active", isSel);
                    el.setAttribute("aria-pressed", String(isSel));
                    el.setAttribute("tabindex", isSel ? "0" : "-1");
                });
                syncTileToMasterCountdown(tile);
            }
        };

        // 4. Sự kiện Hover & Click trên 38 Card <button>
        allTiles.forEach((tile) => {
            tile.addEventListener("mouseenter", () => syncTileToHero(tile, false));
            tile.addEventListener("focus", () => syncTileToHero(tile, false));
            tile.addEventListener("click", () => syncTileToHero(tile, true));

            tile.addEventListener("keydown", (e) => {
                const visibleTiles = allTiles.filter((t) => !t.hidden);
                const curVisIdx = visibleTiles.indexOf(tile);
                if (curVisIdx === -1) return;

                let nextTile = null;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    nextTile = visibleTiles[(curVisIdx + 1) % visibleTiles.length];
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    nextTile = visibleTiles[(curVisIdx - 1 + visibleTiles.length) % visibleTiles.length];
                }

                if (nextTile) {
                    e.preventDefault();
                    syncTileToHero(nextTile, true);
                    nextTile.focus();
                }
            });
        });

        // 5. Sự kiện trên Custom Dropdown chọn sự kiện (Kiểu A + Search + 3 Tabs)
        if (customDropdown) {
            const summaryEl = customDropdown.querySelector("summary");
            customDropdown.addEventListener("toggle", () => {
                summaryEl?.setAttribute("aria-expanded", String(customDropdown.open));
                if (customDropdown.open) {
                    renderCustomPickerOptions();
                }
            });

            pickerSearchInput?.addEventListener("input", () => {
                renderCustomPickerOptions();
            });

            pickerTabs.forEach((tab) => {
                tab.addEventListener("click", (e) => {
                    e.stopPropagation();
                    app.dataset.pickerTab = tab.dataset.pickerFilter || "upcoming";
                    pickerTabs.forEach((t) => {
                        const isMatch = t === tab;
                        t.classList.toggle("is-active", isMatch);
                        t.setAttribute("aria-selected", String(isMatch));
                    });
                    renderCustomPickerOptions();
                });
            });

            pickerListEl?.addEventListener("click", (e) => {
                const optBtn = e.target.closest("[data-pick-event-id]");
                if (!optBtn) return;
                e.stopPropagation();

                const chosenId = optBtn.dataset.pickEventId;
                const targetTile = allTiles.find((t) => t.dataset.eventId === chosenId);
                customDropdown.removeAttribute("open");

                if (!targetTile) return;

                if (targetTile.hidden) {
                    app.dataset.expanded = "true";
                    app.dataset.activeFilter = "all";
                    app.dataset.activeMonth = "all";
                    applyGridFilters();
                }

                syncTileToHero(targetTile, true);

                if (scrollViewport) {
                    const topPos =
                        targetTile.offsetTop -
                        scrollViewport.offsetTop -
                        scrollViewport.clientHeight / 2 +
                        targetTile.clientHeight / 2;
                    scrollViewport.scrollTo({ top: Math.max(0, topPos), behavior: "smooth" });
                }
            });
        }

        // 6. Hàm lọc O(n) trong 1 vòng lặp duy nhất
        const applyGridFilters = () => {
            const { activeFilter = "all", activeMonth = "all", expanded } = app.dataset;
            const isExpanded = expanded === "true";

            const now = new Date();
            const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
            const isFilteringSpecific = activeFilter !== "all" || activeMonth !== "all";

            const matchingAll = [];
            const visibleTiles = [];

            let countMonthAll = 0;
            let countMonthLunar = 0;
            let countMonthSolar = 0;
            let countMonthUpcoming = 0;

            allTiles.forEach((tile) => {
                const { calendarType, month, date = "", extra } = tile.dataset;

                const isBelongToMonth = activeMonth === "all" || String(month) === String(activeMonth);
                if (isBelongToMonth) {
                    countMonthAll++;
                    if (calendarType === "lunar") countMonthLunar++;
                    if (calendarType === "solar") countMonthSolar++;
                    if (date >= todayIso) countMonthUpcoming++;
                }

                let matchesCriteria = isBelongToMonth;
                if (activeFilter === "lunar" && calendarType !== "lunar") matchesCriteria = false;
                if (activeFilter === "solar" && calendarType !== "solar") matchesCriteria = false;
                if (activeFilter === "upcoming" && date < todayIso) matchesCriteria = false;

                if (matchesCriteria) {
                    matchingAll.push(tile);
                    const shouldShow = isFilteringSpecific || isExpanded || extra !== "true";
                    tile.hidden = !shouldShow;
                    if (shouldShow) visibleTiles.push(tile);
                } else {
                    tile.hidden = true;
                }
            });

            document.getElementById("count-filter-all").textContent = String(countMonthAll);
            document.getElementById("count-filter-lunar").textContent = String(countMonthLunar);
            document.getElementById("count-filter-solar").textContent = String(countMonthSolar);
            document.getElementById("count-filter-upcoming").textContent = String(countMonthUpcoming);

            syncBentoRowFill(visibleTiles);

            const emptyStateEl = document.getElementById("festival-empty-state");
            if (emptyStateEl) emptyStateEl.hidden = visibleTiles.length > 0;

            const hasActiveVisible = visibleTiles.some((t) => t.classList.contains("is-active"));
            if (!hasActiveVisible && visibleTiles.length > 0) {
                syncTileToHero(visibleTiles[0], false);
            }

            const resetBtn = document.getElementById("festival-reset-btn");
            if (resetBtn) {
                resetBtn.hidden = activeMonth === "all" && activeFilter === "all";
                if (!resetBtn.dataset.hasListener) {
                    resetBtn.addEventListener("click", () => {
                        app.dataset.activeFilter = "all";
                        filterBtns.forEach((b) => {
                            const isAll = b.dataset.festivalFilter === "all";
                            b.classList.toggle("is-active", isAll);
                            b.setAttribute("aria-pressed", String(isAll));
                        });
                        selectMonthTab(app.querySelector('[data-month-filter="all"]'), false);
                    });
                    resetBtn.dataset.hasListener = "true";
                }
            }

            if (moreBtn && moreLabel) {
                const hiddenExtraCount = matchingAll.length - visibleTiles.length;
                if (isFilteringSpecific || (hiddenExtraCount === 0 && !isExpanded)) {
                    moreBtn.hidden = true;
                } else {
                    moreBtn.hidden = false;
                    moreBtn.setAttribute("aria-expanded", String(isExpanded));
                    moreLabel.textContent = isExpanded
                        ? "Thu gọn danh sách sự kiện"
                        : `+ Xem thêm ${hiddenExtraCount} sự kiện khác trong năm`;
                }
            }

            if (totalCountEl) {
                totalCountEl.textContent = `Đang hiển thị ${visibleTiles.length} / ${matchingAll.length} sự kiện`;
            }
        };

        if (moreBtn) {
            moreBtn.addEventListener("click", () => {
                const nextExpanded = app.dataset.expanded !== "true";
                app.dataset.expanded = String(nextExpanded);
                applyGridFilters();
            });
        }

        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                app.dataset.activeFilter = btn.dataset.festivalFilter || "all";
                filterBtns.forEach((b) => {
                    const isMatch = b === btn;
                    b.classList.toggle("is-active", isMatch);
                    b.setAttribute("aria-pressed", String(isMatch));
                });
                applyGridFilters();
                if (scrollViewport) scrollViewport.scrollTo({ top: 0, behavior: "smooth" });
            });
        });

        const selectMonthTab = (targetTab, shouldFocus = false) => {
            if (!targetTab) return;
            const { monthFilter = "all", quarter = "all" } = targetTab.dataset;
            app.dataset.activeMonth = monthFilter;
            app.dataset.activeQuarter = quarter;

            monthTabs.forEach((tab) => {
                const isSelected = tab === targetTab;
                tab.classList.toggle("is-active", isSelected);
                tab.setAttribute("aria-selected", String(isSelected));
                tab.setAttribute("tabindex", isSelected ? "0" : "-1");
            });

            app.querySelectorAll(".festival-seasons-bento__quarter").forEach((qBox) => {
                qBox.classList.toggle("is-quarter-active", qBox.dataset.quarter === quarter);
            });

            applyGridFilters();
            if (scrollViewport) scrollViewport.scrollTo({ top: 0, behavior: "smooth" });
            if (shouldFocus) targetTab.focus();
        };

        monthTabs.forEach((tab, idx) => {
            tab.addEventListener("click", () => selectMonthTab(tab, false));
            tab.addEventListener("keydown", (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % monthTabs.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                    nextIdx = (idx - 1 + monthTabs.length) % monthTabs.length;
                if (nextIdx !== -1) {
                    e.preventDefault();
                    selectMonthTab(monthTabs[nextIdx], true);
                }
            });
        });

        // 7. Giới hạn chọn Năm trong phạm vi hợp lý (2025 - 2027) để không đẩy số ngày đếm ngược vượt quá thực tế
        const updateFestivalYear = (newYear) => {
            const clampedYear = Math.min(2027, Math.max(2025, Number(newYear) || 2026));
            app.dataset.activeYear = String(clampedYear);

            document.getElementById("festival-heading-year").textContent = String(clampedYear);
            document.getElementById("festival-heading-year").setAttribute("datetime", String(clampedYear));
            document.getElementById("festival-year-label").textContent = `Năm ${clampedYear}`;

            if (yearDropdown) {
                yearDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                    const isSel = Number(opt.dataset.year) === clampedYear;
                    opt.classList.toggle("is-selected", isSel);
                    opt.setAttribute("aria-selected", String(isSel));
                });
            }

            if (window.LunarEngine) {
                allTiles.forEach((tile) => {
                    const calType = tile.dataset.calendarType;
                    let sDay;
                    let sMonth;
                    let sYear = clampedYear;

                    if (calType === "lunar" && tile.dataset.lunarDay && tile.dataset.lunarMonth) {
                        const lDay = Number(tile.dataset.lunarDay);
                        const lMonth = Number(tile.dataset.lunarMonth);
                        const lYearForConvert = lMonth === 12 ? clampedYear - 1 : clampedYear;
                        const converted = window.LunarEngine.convertLunar2Solar(lDay, lMonth, lYearForConvert, 0);
                        if (converted && converted.sDay > 0) {
                            sDay = converted.sDay;
                            sMonth = converted.sMonth;
                            sYear = converted.sYear;
                        }
                    } else {
                        const [origD, origM] = String(tile.dataset.solar || "01/01")
                            .split("/")
                            .map(Number);
                        sDay = origD;
                        sMonth = origM;
                    }

                    if (sDay && sMonth) {
                        const isoStr = `${sYear}-${pad(sMonth)}-${pad(sDay)}`;
                        const solarShort = `${pad(sDay)}/${pad(sMonth)}`;
                        const dateObj = new Date(sYear, sMonth - 1, sDay);
                        const weekdayStr = viWeekdayFormatter.format(dateObj);
                        const lunarObj = window.LunarEngine.convertSolar2Lunar(sDay, sMonth, sYear);
                        const lunarShort = `${pad(lunarObj.lunarDay)}/${pad(lunarObj.lunarMonth)}`;

                        tile.dataset.date = isoStr;
                        tile.dataset.solar = solarShort;
                        tile.dataset.lunar = lunarShort;
                        tile.dataset.weekday = weekdayStr;
                        tile.dataset.month = String(sMonth);

                        const linkTag = tile.querySelector("link[itemprop='url']");
                        if (linkTag) linkTag.setAttribute("href", `./day.html?date=${isoStr}`);

                        const badgeNum = tile.querySelector(".festival-tile__day-badge, .festival-tile__big-num");
                        if (badgeNum) badgeNum.textContent = solarShort;

                        const timeTag = tile.querySelector("time[itemprop='startDate']");
                        if (timeTag) timeTag.setAttribute("datetime", isoStr);
                    }
                });
            }

            renderCustomPickerOptions();
            applyGridFilters();

            const activeTile =
                allTiles.find((t) => t.dataset.eventId === app.dataset.activeEvent) || allTiles.find((t) => !t.hidden);
            if (activeTile) syncTileToHero(activeTile, true);
        };

        if (yearDropdown) {
            const summary = yearDropdown.querySelector("summary");
            yearDropdown.addEventListener("toggle", () => {
                summary?.setAttribute("aria-expanded", String(yearDropdown.open));
            });
            yearDropdown.addEventListener("click", (e) => {
                const opt = e.target.closest("[data-year]");
                if (!opt) return;
                e.stopPropagation();
                yearDropdown.removeAttribute("open");
                updateFestivalYear(Number(opt.dataset.year));
            });
        }

        if (prevYearBtn) {
            prevYearBtn.addEventListener("click", () => {
                updateFestivalYear(Number(app.dataset.activeYear || 2026) - 1);
            });
        }

        if (nextYearBtn) {
            nextYearBtn.addEventListener("click", () => {
                updateFestivalYear(Number(app.dataset.activeYear || 2026) + 1);
            });
        }

        renderCustomPickerOptions();
        applyGridFilters();

        const now = new Date();
        const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const upcomingDefaultTile =
            allTiles.find((t) => !t.hidden && (t.dataset.date || "") >= todayIso) ||
            allTiles.find((t) => t.dataset.eventId === "nha-giao-viet-nam") ||
            allTiles[0];

        if (upcomingDefaultTile) {
            syncTileToHero(upcomingDefaultTile, true);
        }
        // 8. ĐO CHIỀU CAO COUNTDOWN THỰC TẾ ĐỂ KHÓA GAP 2REM & VẬT LÝ DÂY THUN ĐÀN HỒI (ELASTIC STICKY)
        const countdownBarEl = document.getElementById("festival-countdown-bar");
        const stickyLeftEl = app.querySelector(".festival-cal__sticky-left");
        const controlsBoxEl = app.querySelector(".festival-controls");
        const bentoBoxEl = app.querySelector(".festival-bento-box");
        const quickTopFilterBtn = document.getElementById("festival-scroll-filters-btn");

        const syncStickyMetrics = () => {
            if (!countdownBarEl) return;
            const hRem = (countdownBarEl.offsetHeight / 10).toFixed(2);
            app.style.setProperty("--countdown-bar-h", `${hRem}rem`);
        };

        syncStickyMetrics();
        window.addEventListener("resize", syncStickyMetrics, { passive: true });

        // Hiệu ứng dây thun đàn hồi (Spring Physics) khi cuộn trang và kích hoạt data-sticky-state="stuck"
        let lastScrollY = window.scrollY;
        let springTimeout = null;

        window.addEventListener(
            "scroll",
            () => {
                if (window.innerWidth <= 991) return;
                const currentY = window.scrollY;
                const deltaY = currentY - lastScrollY;
                lastScrollY = currentY;

                // Tính độ co giãn dây thun tỷ lệ thuận với vận tốc cuộn chuột (Giới hạn -10px đến +10px)
                const springOffset = Math.max(-10, Math.min(10, -deltaY * 0.28));
                app.style.setProperty("--spring-y", `${springOffset.toFixed(1)}px`);

                clearTimeout(springTimeout);
                springTimeout = setTimeout(() => {
                    app.style.setProperty("--spring-y", "0px");
                }, 90);

                // Kiểm tra khi Bộ lọc Năm (.festival-controls) đã chạy lên trên ẩn sau Countdown
                if (countdownBarEl && controlsBoxEl && bentoBoxEl && stickyLeftEl) {
                    const cdRect = countdownBarEl.getBoundingClientRect();
                    const ctrlRect = controlsBoxEl.getBoundingClientRect();

                    const isCountdownStuck = cdRect.top <= 20;
                    const isWorkspaceStuck = ctrlRect.bottom <= cdRect.bottom + 24;

                    countdownBarEl.dataset.stickyState = isCountdownStuck ? "stuck" : "normal";
                    stickyLeftEl.dataset.stickyState = isWorkspaceStuck ? "stuck" : "normal";
                    bentoBoxEl.dataset.stickyState = isWorkspaceStuck ? "stuck" : "normal";

                    // Tự động hiện nút "↑ Bộ lọc & Chọn Năm" bằng thuộc tính hidden khi Bộ lọc đã cuộn khuất
                    if (quickTopFilterBtn) {
                        quickTopFilterBtn.hidden = !isWorkspaceStuck;
                    }
                }
            },
            { passive: true },
        );

        if (quickTopFilterBtn && controlsBoxEl) {
            quickTopFilterBtn.addEventListener("click", () => {
                window.scrollTo({
                    top: Math.max(0, controlsBoxEl.offsetTop - 180),
                    behavior: "smooth",
                });
            });
        }
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(tickMasterCountdown, 1000);
    };
    //

    //
    document.addEventListener("DOMContentLoaded", initFestivalCalendar);
    window.addEventListener("template-loaded", initFestivalCalendar);
})();
