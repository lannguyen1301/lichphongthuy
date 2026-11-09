// assets/js/festival-calendar.js
(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const viWeekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "long" });

    // 1. Tự động lấp đầy hàng cuối của Lưới Bento 4 cột (Không để hở ô trống khi lọc)
    const syncBentoRowFill = (visibleTiles) => {
        visibleTiles.forEach((t) => t.removeAttribute("data-fill-span"));
        if (!visibleTiles.length) return;

        const totalUnits = visibleTiles.reduce((sum, tile) => sum + (tile.dataset.major === "true" ? 4 : 1), 0);
        const remainder = totalUnits % 4;
        if (remainder === 0) return;

        const neededExtraCols = 4 - remainder;
        const normalTiles = visibleTiles.filter((t) => t.dataset.major !== "true");
        const lastNormal = normalTiles[normalTiles.length - 1];

        if (lastNormal && neededExtraCols <= 3) {
            lastNormal.dataset.fillSpan = String(1 + neededExtraCols);
        }
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

        // 2. Đọc dataset từ Ô Bento đang chọn để đổ lên Thẻ Hero Đếm Ngược bên trái
        const syncTileToHero = (tile) => {
            if (!tile) return;
            const { date, solar, lunar, weekday, calendarType, zodiac, major } = tile.dataset;
            const titleText =
                tile.querySelector(".festival-tile__title, .festival-tile__name")?.textContent?.trim() || "";
            const activeYear = app.dataset.activeYear || "2026";

            const [y, m, d] = String(date).split("-").map(Number);
            const eventDate = new Date(y, m - 1, d);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.round((eventDate - today) / 86400000);

            let countdownText = "Diễn ra hôm nay";
            if (diffDays > 0) countdownText = `Sắp diễn ra • Còn ${diffDays} ngày`;
            else if (diffDays < 0) countdownText = `Đã qua ${Math.abs(diffDays)} ngày`;

            document.getElementById("festival-hero-countdown").textContent = countdownText;
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
            document.getElementById("festival-hero-year").textContent = `Năm ${activeYear}`;
            document.getElementById("festival-hero-title").textContent = titleText;
            document.getElementById("festival-hero-lunar").innerHTML =
                `Nhằm ngày <strong>${lunar} Âm lịch</strong> • Năm ${activeYear}`;
            document.getElementById("festival-hero-link").href = `./day.html?date=${date}`;
            document.getElementById("festival-hero-zodiac").src = `./assets/icons/zodiac/${zodiac || "horse"}.svg`;

            allTiles.forEach((el) => el.classList.toggle("is-active", el === tile));
        };

        allTiles.forEach((tile) => {
            tile.addEventListener("mouseenter", () => syncTileToHero(tile));
            tile.addEventListener("focus", () => syncTileToHero(tile));
        });

        // 3. Hàm lọc O(n) trong 1 vòng lặp duy nhất (Cập nhật số đếm theo tháng & trạng thái hidden)
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

                // Khối đếm động theo Tháng đang chọn
                const isBelongToMonth = activeMonth === "all" || String(month) === String(activeMonth);
                if (isBelongToMonth) {
                    countMonthAll++;
                    if (calendarType === "lunar") countMonthLunar++;
                    if (calendarType === "solar") countMonthSolar++;
                    if (date >= todayIso) countMonthUpcoming++;
                }

                // Khối lọc hiển thị chính
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

            // Cập nhật các bộ đếm lên giao diện HTML
            const countAllEl = document.getElementById("count-filter-all");
            const countLunarEl = document.getElementById("count-filter-lunar");
            const countSolarEl = document.getElementById("count-filter-solar");
            const countUpcomingEl = document.getElementById("count-filter-upcoming");

            if (countAllEl) countAllEl.textContent = String(countMonthAll);
            if (countLunarEl) countLunarEl.textContent = String(countMonthLunar);
            if (countSolarEl) countSolarEl.textContent = String(countMonthSolar);
            if (countUpcomingEl) countUpcomingEl.textContent = String(countMonthUpcoming);

            syncBentoRowFill(visibleTiles);

            const emptyStateEl = document.getElementById("festival-empty-state");
            if (emptyStateEl) {
                emptyStateEl.hidden = visibleTiles.length > 0;
            }

            // Tự động đồng bộ Thẻ Hero bên trái nếu thẻ đang active bị ẩn khi chuyển tháng
            const hasActiveVisible = visibleTiles.some((t) => t.classList.contains("is-active"));
            if (!hasActiveVisible && visibleTiles.length > 0) {
                syncTileToHero(visibleTiles[0]);
            }

            // Hiện/Ẩn nút "Xem cả năm" (Reset bộ lọc) dựa vào thuộc tính HTML5 hidden
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

            // Giao diện nút "Xem thêm / Thu gọn"
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

        // 4. Sự kiện nút "+ Xem thêm tất cả sự kiện" (Accordion a11y)
        if (moreBtn) {
            moreBtn.addEventListener("click", () => {
                const nextExpanded = app.dataset.expanded !== "true";
                app.dataset.expanded = String(nextExpanded);
                applyGridFilters();
            });
        }

        // 5. Sự kiện 4 nút lọc Loại sự kiện (Tất cả / Lễ Âm lịch / Lễ Dương lịch / Sắp diễn ra)
        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                app.dataset.activeFilter = btn.dataset.festivalFilter || "all";
                filterBtns.forEach((b) => {
                    const isMatch = b === btn;
                    b.classList.toggle("is-active", isMatch);
                    b.setAttribute("aria-pressed", String(isMatch));
                });
                applyGridFilters();
            });
        });

        // 6. ĐÂY CHÍNH LÀ HÀM Ở MỤC C: Đọc data-month-filter & data-quarter qua dataset trên Bento 4 Quý (Phương án 3)
        const selectMonthTab = (targetTab, shouldFocus = false) => {
            if (!targetTab) return;

            // Đọc data-month-filter và data-quarter từ thẻ <button> vừa bấm thông qua dataset
            const { monthFilter = "all", quarter = "all" } = targetTab.dataset;
            app.dataset.activeMonth = monthFilter;
            app.dataset.activeQuarter = quarter;

            // Đồng bộ Roving Tabindex (0 cho tab đang chọn, -1 cho 12 tab còn lại) & aria-selected
            monthTabs.forEach((tab) => {
                const isSelected = tab === targetTab;
                tab.classList.toggle("is-active", isSelected);
                tab.setAttribute("aria-selected", String(isSelected));
                tab.setAttribute("tabindex", isSelected ? "0" : "-1");
            });

            // Làm nổi bật Hộp Quý (Xuân / Hạ / Thu / Đông) đang chứa tháng được chọn
            app.querySelectorAll(".festival-seasons-bento__quarter").forEach((qBox) => {
                qBox.classList.toggle("is-quarter-active", qBox.dataset.quarter === quarter);
            });

            applyGridFilters();
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

        // 7. Tự động quy đổi lại ngày Dương/Âm cho toàn bộ sự kiện khi đổi Năm (< Năm 2026 >)
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
                        tile.href = `./day.html?date=${isoStr}`;

                        const badgeNum = tile.querySelector(".festival-tile__day-badge, .festival-tile__big-num");
                        if (badgeNum) badgeNum.textContent = solarShort;

                        const timeTag = tile.querySelector("time[itemprop='startDate']");
                        if (timeTag) timeTag.setAttribute("datetime", isoStr);
                    }
                });
            }

            applyGridFilters();
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

        applyGridFilters();
    };

    document.addEventListener("DOMContentLoaded", initFestivalCalendar);
    window.addEventListener("template-loaded", initFestivalCalendar);
})();
