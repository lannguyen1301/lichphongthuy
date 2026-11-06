// assets/js/year-calendar.js
// Chuyên trách duy nhất Trang Lịch Năm (year.html): Vẽ động 12 tháng (504 ô) bằng LunarEngine, Prev/Next Năm & Bộ lọc
(() => {
    let activeYear = 2026;

    const renderFullYearGrid = (yearNum) => {
        const app = document.getElementById("year-cal-app");
        const monthsGrid = document.getElementById("year-months-grid");
        if (!app || !monthsGrid || !window.LunarEngine) return;

        activeYear = Number(yearNum);
        app.dataset.activeYear = String(activeYear);
        app.setAttribute("aria-label", `Lịch tổng hợp 12 tháng năm ${activeYear}`);
        monthsGrid.setAttribute("aria-label", `12 tháng trong năm ${activeYear}`);

        // Cập nhật tiêu đề Năm, nút Prev/Next và Dropdown
        const mainYearNum = document.getElementById("year-main-number");
        const summaryText = document.getElementById("cal-year-label");
        const prevBtn = document.getElementById("cal-prev-year");
        const nextBtn = document.getElementById("cal-next-year");
        const yearDropdown = document.getElementById("cal-year-dropdown");

        if (mainYearNum) {
            mainYearNum.textContent = String(activeYear);
            mainYearNum.setAttribute("datetime", String(activeYear));
        }
        if (summaryText) summaryText.textContent = `Năm ${activeYear}`;
        if (prevBtn) {
            prevBtn.setAttribute("aria-label", `Xem năm trước (${activeYear - 1})`);
            prevBtn.title = `Chuyển sang năm ${activeYear - 1}`;
        }
        if (nextBtn) {
            nextBtn.setAttribute("aria-label", `Xem năm sau (${activeYear + 1})`);
            nextBtn.title = `Chuyển sang năm ${activeYear + 1}`;
        }

        if (yearDropdown) {
            const yearList = document.getElementById("year-dropdown-list");
            if (yearList && !yearList.querySelector(`[data-year="${activeYear}"]`)) {
                const li = document.createElement("li");
                li.innerHTML = `<button type="button" role="option" aria-selected="false" data-year="${activeYear}" class="month-cal__option" title="Xem lịch năm ${activeYear}">Năm ${activeYear}</button>`;
                yearList.appendChild(li);
            }
            yearDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                const isSelected = Number(opt.dataset.year) === activeYear;
                opt.classList.toggle("is-selected", isSelected);
                opt.setAttribute("aria-selected", String(isSelected));
            });
        }

        const realNow = new Date();
        const realDay = realNow.getDate();
        const realMonth = realNow.getMonth() + 1;
        const realYear = realNow.getFullYear();
        const pad = (n) => String(n).padStart(2, "0");

        const fragment = document.createDocumentFragment();
        let hasAssignedTabIndexZero = false;

        for (let m = 1; m <= 12; m++) {
            const article = document.createElement("article");
            article.className = "month-cal month-cal--mini";
            article.dataset.month = String(m);
            article.dataset.year = String(activeYear);
            article.setAttribute("aria-label", `Tháng ${m} năm ${activeYear}`);

            const firstDayJs = new Date(activeYear, m - 1, 1).getDay();
            const leadingMutedCount = (firstDayJs + 6) % 7;
            const daysInMonth = new Date(activeYear, m, 0).getDate();

            const prevMonth = m === 1 ? 12 : m - 1;
            const prevYear = m === 1 ? activeYear - 1 : activeYear;
            const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

            const nextMonth = m === 12 ? 1 : m + 1;
            const nextYear = m === 12 ? activeYear + 1 : activeYear;

            let cellsHtml = "";
            for (let i = 0; i < 42; i++) {
                let cDay;
                let cMonth;
                let cYear;
                let isMuted = false;

                if (i < leadingMutedCount) {
                    cDay = daysInPrevMonth - leadingMutedCount + 1 + i;
                    cMonth = prevMonth;
                    cYear = prevYear;
                    isMuted = true;
                } else if (i < leadingMutedCount + daysInMonth) {
                    cDay = i - leadingMutedCount + 1;
                    cMonth = m;
                    cYear = activeYear;
                } else {
                    cDay = i - (leadingMutedCount + daysInMonth) + 1;
                    cMonth = nextMonth;
                    cYear = nextYear;
                    isMuted = true;
                }

                const info = window.LunarEngine.getFullDayInfo(cDay, cMonth, cYear);
                const isToday = cDay === realDay && cMonth === realMonth && cYear === realYear;
                const isDefaultActive =
                    !isMuted &&
                    ((activeYear === realYear && isToday) || (activeYear !== realYear && m === 1 && cDay === 1));

                const statusTokens = [];
                if (info.fortuneStatus) statusTokens.push(info.fortuneStatus);
                if (info.isHoliday) statusTokens.push("holiday");
                if (isToday) statusTokens.push("today");

                let dotsHtml = "";
                if (!isMuted) {
                    let innerDots = "";
                    if (info.fortuneStatus === "good") {
                        innerDots += `<i class="month-cal__dot month-cal__dot--good"></i>`;
                    }
                    if (info.isHoliday) {
                        innerDots += `<i class="month-cal__dot month-cal__dot--holiday"></i>`;
                    }
                    if (innerDots) {
                        dotsHtml = `<span class="month-cal__dots" aria-hidden="true">${innerDots}</span>`;
                    }
                }

                const isoDate = `${cYear}-${pad(cMonth)}-${pad(cDay)}`;
                const titleParts = [`${pad(cDay)}/${pad(cMonth)}/${cYear} (${info.lunarDay}/${info.lunarMonth} ÂL)`];
                if (info.badgeText) titleParts.push(info.badgeText);
                else if (info.fortuneStatus === "good") titleParts.push("Hoàng Đạo");

                const tabIndexVal = isDefaultActive && !hasAssignedTabIndexZero ? "0" : "-1";
                if (tabIndexVal === "0") hasAssignedTabIndexZero = true;

                cellsHtml += `
                    <button
                        type="button"
                        class="month-cal__cell ${isMuted ? "month-cal__cell--muted" : ""} ${isToday ? "month-cal__cell--today" : ""} ${isDefaultActive ? "month-cal__cell--active" : ""}"
                        tabindex="${tabIndexVal}"
                        ${isDefaultActive ? 'aria-current="date"' : ""}
                        data-date="${isoDate}"
                        data-solar="${cDay}"
                        data-lunar="${info.lunarDay}/${info.lunarMonth}"
                        ${statusTokens.length ? `data-status="${statusTokens.join(" ")}"` : ""}
                        title="${titleParts.join(" - ")}"
                    >
                        <span class="month-cal__solar">${cDay}</span>${dotsHtml}
                    </button>
                `;
            }

            article.innerHTML = `
                <h2 class="month-cal__mini-title">Tháng ${m}</h2>
                <div class="month-cal__weekdays" role="row">
                    <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                    <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                    <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                    <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                    <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                    <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                    <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
                </div>
                <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng ${m}">
                    ${cellsHtml}
                </div>
            `;
            fragment.appendChild(article);
        }

        monthsGrid.innerHTML = "";
        monthsGrid.appendChild(fragment);

        bindYearCellEvents(app);
    };

    const bindYearCellEvents = (app) => {
        const allCells = Array.from(app.querySelectorAll(".month-cal__cell"));

        const selectYearCell = (targetCell, shouldFocus = false) => {
            if (!targetCell) return;
            allCells.forEach((item) => {
                const isSelected = item === targetCell;
                item.classList.toggle("month-cal__cell--active", isSelected);
                item.setAttribute("tabindex", isSelected ? "0" : "-1");
                if (isSelected) item.setAttribute("aria-current", "date");
                else item.removeAttribute("aria-current");
            });
            if (shouldFocus) targetCell.focus();
        };

        allCells.forEach((cell, idx) => {
            cell.onclick = () => selectYearCell(cell);

            cell.onkeydown = (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight") nextIdx = Math.min(allCells.length - 1, idx + 1);
                if (e.key === "ArrowLeft") nextIdx = Math.max(0, idx - 1);
                if (e.key === "ArrowDown") nextIdx = Math.min(allCells.length - 1, idx + 7);
                if (e.key === "ArrowUp") nextIdx = Math.max(0, idx - 7);

                if (nextIdx !== -1 && nextIdx !== idx) {
                    e.preventDefault();
                    selectYearCell(allCells[nextIdx], true);
                }
            };
        });
    };

    const initYearCalendar = () => {
        const rootEl = document.getElementById("year-calendar-root");
        const app = document.getElementById("year-cal-app");
        if (!app || !window.LunarEngine) return;

        if (rootEl) rootEl.setAttribute("aria-busy", "false");
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const prevYearBtn = app.querySelector("#cal-prev-year");
        const nextYearBtn = app.querySelector("#cal-next-year");
        const todayBtn = app.querySelector("#cal-current-year-btn");
        const yearDropdown = app.querySelector("#cal-year-dropdown");
        const legendPills = app.querySelectorAll(".month-cal__legend-pill");

        if (prevYearBtn) {
            prevYearBtn.onclick = () => renderFullYearGrid(activeYear - 1);
        }

        if (nextYearBtn) {
            nextYearBtn.onclick = () => renderFullYearGrid(activeYear + 1);
        }

        if (todayBtn) {
            todayBtn.onclick = () => {
                const currentRealYear = new Date().getFullYear();
                renderFullYearGrid(currentRealYear);
                const todayCell = app.querySelector(
                    ".month-cal__cell:not(.month-cal__cell--muted).month-cal__cell--today",
                );
                if (todayCell) {
                    todayCell.focus();
                    todayCell.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            };
        }

        if (yearDropdown) {
            const summary = yearDropdown.querySelector("summary");
            yearDropdown.ontoggle = () => {
                summary?.setAttribute("aria-expanded", String(yearDropdown.open));
            };

            yearDropdown.onclick = (e) => {
                const opt = e.target.closest(".month-cal__option");
                if (!opt) return;
                e.stopPropagation();
                yearDropdown.removeAttribute("open");
                renderFullYearGrid(Number(opt.dataset.year) || 2026);
            };
        }

        const highlightYearCells = (statusKey, activePill = null) => {
            legendPills.forEach((p) => {
                const isMatch = p === activePill && Boolean(statusKey);
                p.classList.toggle("is-active", isMatch);
                p.setAttribute("aria-pressed", String(isMatch));
            });

            app.querySelectorAll(".month-cal__cell").forEach((cell) => {
                if (!statusKey) {
                    cell.classList.remove("is-dimmed", "is-highlighted");
                    return;
                }
                const cellStatus = cell.dataset.status || "";
                const isMatch = cellStatus.split(" ").includes(statusKey);
                cell.classList.toggle("is-highlighted", isMatch);
                cell.classList.toggle("is-dimmed", !isMatch);
            });
        };

        legendPills.forEach((pill) => {
            const filterKey = pill.dataset.filter;
            pill.onmouseenter = () => highlightYearCells(filterKey, pill);
            pill.onmouseleave = () => highlightYearCells(null);
            pill.onfocus = () => highlightYearCells(filterKey, pill);
            pill.onblur = () => highlightYearCells(null);
        });

        renderFullYearGrid(Number(app.dataset.activeYear) || 2026);
    };

    document.addEventListener("DOMContentLoaded", initYearCalendar);
    window.addEventListener("template-loaded", initYearCalendar);
})();
