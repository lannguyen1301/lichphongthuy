// assets/js/festival-calendar.js
// Chuyên trách Trang Lễ Tết (festival.html - Phương án 2):
// Lưới Bento Đại Lễ 2x2 + Lễ Thường 1x1, Nút Xem thêm chuẩn a11y, Lọc Tháng Roving Tabindex & Tự động quy đổi Âm-Dương khi đổi Năm
(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const viWeekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "long" });

    // 1. Tự động lấp đầy hàng cuối của Lưới Bento 4 cột (Không bao giờ để hở ô trống khi lọc)
    const syncBentoRowFill = (visibleTiles) => {
        visibleTiles.forEach((t) => t.removeAttribute("data-fill-span"));
        if (!visibleTiles.length) return;

        // Tính tổng số ô đơn vị trên lưới 4 cột (Ô Đại Lễ 2x2 = 4 đơn vị, Ô Lễ Thường 1x1 = 1 đơn vị)
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

        // 3. Hàm lọc tổng hợp theo Loại lịch + Tháng + Trạng thái "Xem thêm" (dùng thuộc tính hidden chuẩn HTML5)
        const applyGridFilters = () => {
            const activeFilter = app.dataset.activeFilter || "all";
            const activeMonth = app.dataset.activeMonth || "all";
            const isExpanded = app.dataset.expanded === "true";
            const todayIso = new Date().toISOString().slice(0, 10);

            // Khi người dùng đang lọc theo 1 tháng cụ thể hoặc lọc loại lễ, tự động bung hết sự kiện khớp bộ lọc
            const isFilteringSpecific = activeFilter !== "all" || activeMonth !== "all";

            const matchingAll = [];
            const visibleTiles = [];

            allTiles.forEach((tile) => {
                const { calendarType, month, date, extra } = tile.dataset;
                let matchesCriteria = true;

                if (activeFilter === "lunar" && calendarType !== "lunar") matchesCriteria = false;
                if (activeFilter === "solar" && calendarType !== "solar") matchesCriteria = false;
                if (activeFilter === "upcoming" && (date || "") < todayIso) matchesCriteria = false;
                if (activeMonth !== "all" && String(month) !== String(activeMonth)) matchesCriteria = false;

                if (matchesCriteria) matchingAll.push(tile);

                const shouldShow = matchesCriteria && (isFilteringSpecific || isExpanded || extra !== "true");
                tile.hidden = !shouldShow;
                if (shouldShow) visibleTiles.push(tile);
            });

            syncBentoRowFill(visibleTiles);

            const hiddenExtraCount = matchingAll.length - visibleTiles.length;
            if (moreBtn && moreLabel) {
                if (isFilteringSpecific) {
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

        // 6. Sự kiện thanh chọn Tháng (Cả năm, T1 -> T12) kèm Roving Tabindex (0 và -1)
        const selectMonthTab = (targetTab, shouldFocus = false) => {
            if (!targetTab) return;
            app.dataset.activeMonth = targetTab.dataset.monthFilter || "all";

            monthTabs.forEach((tab) => {
                const isSelected = tab === targetTab;
                tab.classList.toggle("is-active", isSelected);
                tab.setAttribute("aria-selected", String(isSelected));
                tab.setAttribute("tabindex", isSelected ? "0" : "-1");
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

        // 7. Tự động quy đổi lại ngày Dương/Âm cho toàn bộ 38 sự kiện khi đổi Năm (< Năm 2026 >)
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
                        // Tháng Chạp (12 ÂL) như Ông Công Ông Táo / Giao Thừa nằm ở đầu năm Dương lịch nên thuộc năm Âm lịch trước đó
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
            const firstVisible = allTiles.find((t) => !t.hidden);
            if (firstVisible) syncTileToHero(firstVisible);
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