// assets/js/festival-calendar.js
// Chuyên trách Trang Lễ Tết (festival.html):
// 1. Hàng Master Countdown riêng (Singleton Timer 0 Memory Leak + Smart Rollover sang năm sau nếu lễ đã qua)
// 2. Hero Sticky khóa chiều cao + Dự đoán số ngày tinh tế ("Còn X ngày nữa là đến...")
// 3. Card <button> tương tác Hover/Click tại chỗ + Khung cuộn độc lập
(() => {
    let countdownInterval = null;
    const pad = (n) => String(n).padStart(2, "0");
    const viWeekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "long" });

    // Tự động lấp đầy hàng cuối của Lưới Bento 3 cột trong khung cuộn
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

    // Tính ngày mục tiêu cho đồng hồ Countdown (Tự động chuyển sang kỳ lễ năm tiếp theo nếu ngày lễ năm nay đã qua)
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
            const nextYear = now.getFullYear() + (targetDate.getFullYear() <= now.getFullYear() ? 1 : 0);

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

        return { targetDate, isRolloverNextYear };
    };

    // Duy nhất 1 Singleton Interval cập nhật 4 ô Ngày : Giờ : Phút : Giây (Không bao giờ gây Memory Leak)
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
        const countdownSelect = document.getElementById("festival-countdown-select");
        const scrollViewport = document.getElementById("festival-scroll-viewport");

        // 1. Nạp danh sách 38 sự kiện vào thẻ <select id="festival-countdown-select"> trên Hàng Countdown
        const populateCountdownSelect = () => {
            if (!countdownSelect) return;
            const currentVal = app.dataset.activeEvent || "nha-giao-viet-nam";
            countdownSelect.innerHTML = allTiles
                .map((tile) => {
                    const id = tile.dataset.eventId;
                    const solar = tile.dataset.solar;
                    const name = tile.querySelector('[itemprop="name"]')?.textContent?.trim() || "";
                    const isSel = id === currentVal ? "selected" : "";
                    return `<option value="${id}" ${isSel}>${solar} — ${name}</option>`;
                })
                .join("");
        };

        // 2. Cập nhật Hàng Countdown trên cùng khi chọn sự kiện từ <select> hoặc Click vào Card
        const syncTileToMasterCountdown = (tile) => {
            if (!tile) return;
            const eventId = tile.dataset.eventId;
            const titleText = tile.querySelector('[itemprop="name"]')?.textContent?.trim() || "";
            app.dataset.activeEvent = eventId;

            if (countdownSelect && countdownSelect.value !== eventId) {
                countdownSelect.value = eventId;
            }

            const { targetDate, isRolloverNextYear } = resolveSmartCountdownTarget(tile);
            const tYear = targetDate.getFullYear();
            const tMonth = targetDate.getMonth() + 1;
            const tDay = targetDate.getDate();
            const isoTarget = `${tYear}-${pad(tMonth)}-${pad(tDay)}T00:00:00`;

            const timerEl = document.getElementById("festival-master-timer");
            if (timerEl) {
                timerEl.dataset.targetIso = isoTarget;
                timerEl.setAttribute("datetime", `${isoTarget}+07:00`);
            }

            const nameEl = document.getElementById("festival-countdown-event-name");
            const rolloverTag = document.getElementById("festival-countdown-rollover-tag");
            const fullSolarEl = document.getElementById("festival-countdown-full-solar");
            const fullLunarEl = document.getElementById("festival-countdown-full-lunar");

            if (nameEl) nameEl.textContent = titleText;
            if (rolloverTag) {
                rolloverTag.textContent = isRolloverNextYear
                    ? `Đếm ngược kỳ lễ tiếp theo (${tYear})`
                    : "Đếm ngược sự kiện sắp diễn ra";
            }

            const weekdayStr = viWeekdayFormatter.format(targetDate);
            if (fullSolarEl) {
                fullSolarEl.textContent = `${weekdayStr}, ngày ${pad(tDay)} tháng ${pad(tMonth)} năm ${tYear} Dương lịch`;
            }

            if (window.LunarEngine && fullLunarEl) {
                const lInfo = window.LunarEngine.getFullDayInfo(tDay, tMonth, tYear);
                fullLunarEl.textContent = `Nhằm ngày ${pad(lInfo.lunarDay)}/${pad(lInfo.lunarMonth)} Âm lịch (Năm ${lInfo.yearCanChi} • Ngày ${lInfo.dayCanChi})`;
            }

            tickMasterCountdown();
        };

        // 3. Cập nhật Thẻ Hero bên trái kèm dòng "Dự đoán/Đếm ngày tinh tế" (Chống Layout Shift 100%)
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

            // Dòng dự đoán tinh tế: "Còn X ngày nữa là đến [Tên sự kiện]"
            let subtlePrediction = `Hôm nay diễn ra ${titleText}`;
            if (diffDays > 0) {
                subtlePrediction = `Còn ${diffDays} ngày nữa là đến ${titleText}`;
            } else if (diffDays < 0) {
                const { targetDate } = resolveSmartCountdownTarget(tile);
                const nextDiffDays = Math.round((targetDate - today) / 86400000);
                subtlePrediction = `Đã qua ${Math.abs(diffDays)} ngày • Kỳ tới còn ${nextDiffDays} ngày`;
            }

            document.getElementById("festival-hero-countdown").textContent = subtlePrediction;
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
            document.getElementById("festival-hero-desc").textContent = descText;

            if (window.LunarEngine && y && m && d) {
                const info = window.LunarEngine.getFullDayInfo(d, m, y);
                document.getElementById("festival-hero-year").textContent = `Năm ${activeYear} (${info.yearCanChi})`;
                document.getElementById("festival-hero-lunar").innerHTML =
                    `Nhằm ngày <strong>${lunar} Âm lịch</strong> (Ngày ${info.dayCanChi} • ${info.dayNapAm})`;
                document.getElementById("festival-hero-hours").textContent = info.goodHoursStr;
            } else {
                document.getElementById("festival-hero-year").textContent = `Năm ${activeYear}`;
                document.getElementById("festival-hero-lunar").innerHTML =
                    `Nhằm ngày <strong>${lunar} Âm lịch</strong> • Năm ${activeYear}`;
            }

            document.getElementById("festival-hero-title").textContent = titleText;
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

        // 4. Sự kiện Hover & Click trên 38 Card <button> (Không nhảy sang day.html, cập nhật Dynamic UI tại chỗ)
        allTiles.forEach((tile, idx) => {
            // Hover: Cập nhật nhanh lên Hero trái (Preview)
            tile.addEventListener("mouseenter", () => syncTileToHero(tile, false));
            tile.addEventListener("focus", () => syncTileToHero(tile, false));

            // Click: Ghim luôn sự kiện đó lên cả Hero trái lẫn Đồng hồ Countdown ở Hàng 1
            tile.addEventListener("click", () => syncTileToHero(tile, true));

            // Điều hướng bàn phím Roving Tabindex giữa các Card
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

        // 5. Sự kiện khi người dùng chủ động chọn sự kiện từ thẻ <select> trên Hàng Countdown
        if (countdownSelect) {
            countdownSelect.addEventListener("change", () => {
                const chosenId = countdownSelect.value;
                const targetTile = allTiles.find((t) => t.dataset.eventId === chosenId);
                if (!targetTile) return;

                // Nếu sự kiện đang nằm trong nhóm ẩn (data-extra="true"), tự động mở rộng danh sách
                if (targetTile.hidden) {
                    app.dataset.expanded = "true";
                    app.dataset.activeFilter = "all";
                    app.dataset.activeMonth = "all";
                    applyGridFilters();
                }

                syncTileToHero(targetTile, true);

                // Cuộn mượt nội bộ trong khung #festival-scroll-viewport tới đúng card vừa chọn
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

        const updateFestivalYear = (newYear) => {
            const targetYear = Number(newYear) || 2026;
            app.dataset.activeYear = String(targetYear);

            document.getElementById("festival-heading-year").textContent = String(targetYear);
            document.getElementById("festival-heading-year").setAttribute("datetime", String(targetYear));
            document.getElementById("festival-year-label").textContent = `Năm ${targetYear}`;

            if (yearDropdown) {
                yearDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                    const isSel = Number(opt.dataset.year) === targetYear;
                    opt.classList.toggle("is-selected", isSel);
                    opt.setAttribute("aria-selected", String(isSel));
                });
            }

            if (window.LunarEngine) {
                allTiles.forEach((tile) => {
                    const calType = tile.dataset.calendarType;
                    let sDay;
                    let sMonth;
                    let sYear = targetYear;

                    if (calType === "lunar" && tile.dataset.lunarDay && tile.dataset.lunarMonth) {
                        const lDay = Number(tile.dataset.lunarDay);
                        const lMonth = Number(tile.dataset.lunarMonth);
                        const lYearForConvert = lMonth === 12 ? targetYear - 1 : targetYear;
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

            populateCountdownSelect();
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

        // Khởi tạo trạng thái ban đầu: Tự động tìm sự kiện gần nhất sắp diễn ra (ví dụ 20/11) để chạy Countdown
        populateCountdownSelect();
        applyGridFilters();

        const todayIso = new Date().toISOString().slice(0, 10);
        const upcomingDefaultTile =
            allTiles.find((t) => !t.hidden && (t.dataset.date || "") >= todayIso) ||
            allTiles.find((t) => t.dataset.eventId === "nha-giao-viet-nam") ||
            allTiles[0];

        if (upcomingDefaultTile) {
            syncTileToHero(upcomingDefaultTile, true);
        }

        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(tickMasterCountdown, 1000);
    };

    document.addEventListener("DOMContentLoaded", initFestivalCalendar);
    window.addEventListener("template-loaded", initFestivalCalendar);
})();
