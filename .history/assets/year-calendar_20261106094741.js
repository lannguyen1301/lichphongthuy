// assets/js/year-calendar.js
(() => {
    const initYearCalendar = () => {
        const rootEl = document.getElementById("year-calendar-root");
        const app = document.getElementById("year-cal-app");
        if (!app) return;

        // 1. Báo cho trình đọc màn hình biết template đã tải xong
        if (rootEl) rootEl.setAttribute("aria-busy", "false");

        // 2. Chốt chặn bằng dataset.bound: Tránh gắn trùng sự kiện khi template-loaded nổ nhiều lần
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const allCells = Array.from(app.querySelectorAll(".month-cal__cell"));
        const legendPills = app.querySelectorAll(".month-cal__legend-pill");
        const yearDropdown = app.querySelector("#cal-year-dropdown");
        const todayBtn = app.querySelector("#cal-current-year-btn");

        // 3. Hàm kích hoạt ô ngày (Cập nhật class active, Roving tabindex và aria-current)
        const selectYearCell = (targetCell, shouldFocus = false) => {
            if (!targetCell) return;
            const { date, solar, lunar, status } = targetCell.dataset;

            allCells.forEach((item) => {
                const isSelected = item === targetCell;
                item.classList.toggle("month-cal__cell--active", isSelected);
                item.setAttribute("tabindex", isSelected ? "0" : "-1");

                if (isSelected) {
                    item.setAttribute("aria-current", "date");
                } else {
                    item.removeAttribute("aria-current");
                }
            });

            if (shouldFocus) targetCell.focus();
            console.log(
                `[YearCalendar] Đang chọn: ${date} (Dương: ${solar}, Âm: ${lunar || ""}, Trạng thái: ${status || "normal"})`,
            );
        };

        // 4. Gắn sự kiện Click & Phím mũi tên cho 504 ô ngày
        allCells.forEach((cell, idx) => {
            cell.addEventListener("click", () => selectYearCell(cell));

            cell.addEventListener("keydown", (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight") nextIdx = Math.min(allCells.length - 1, idx + 1);
                if (e.key === "ArrowLeft") nextIdx = Math.max(0, idx - 1);
                if (e.key === "ArrowDown") nextIdx = Math.min(allCells.length - 1, idx + 7);
                if (e.key === "ArrowUp") nextIdx = Math.max(0, idx - 7);

                if (nextIdx !== -1 && nextIdx !== idx) {
                    e.preventDefault();
                    selectYearCell(allCells[nextIdx], true);
                }
            });
        });

        // 5. Nút "Về Năm Nay" -> Focus ngay về ô Hôm nay (05/11/2026)
        if (todayBtn) {
            todayBtn.addEventListener("click", () => {
                const todayCell = app.querySelector(".month-cal__cell--today");
                if (todayCell) {
                    selectYearCell(todayCell, true);
                    todayCell.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        }

        // 6. Bộ lọc Chú thích (Hoàng Đạo, Hắc Đạo, Ngày Lễ, Hôm Nay) trên toàn bộ 12 tháng
        const highlightYearCells = (statusKey, activePill = null) => {
            legendPills.forEach((p) => {
                const isMatch = p === activePill && Boolean(statusKey);
                p.classList.toggle("is-active", isMatch);
                p.setAttribute("aria-pressed", String(isMatch));
            });

            allCells.forEach((cell) => {
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
            pill.addEventListener("mouseenter", () => highlightYearCells(filterKey, pill));
            pill.addEventListener("mouseleave", () => highlightYearCells(null));
            pill.addEventListener("focus", () => highlightYearCells(filterKey, pill));
            pill.addEventListener("blur", () => highlightYearCells(null));
        });

        // 7. Dropdown chọn Năm (Đồng bộ aria-expanded & aria-selected qua dataset.year)
        if (yearDropdown) {
            const summary = yearDropdown.querySelector("summary");
            const summaryText = yearDropdown.querySelector(".month-cal__summary-text");
            const mainYearNum = document.getElementById("year-main-number");
            const options = yearDropdown.querySelectorAll(".month-cal__option");

            yearDropdown.addEventListener("toggle", () => {
                summary?.setAttribute("aria-expanded", String(yearDropdown.open));
            });

            options.forEach((opt) => {
                opt.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const selectedYear = opt.dataset.year;
                    app.dataset.activeYear = selectedYear;

                    options.forEach((o) => {
                        const isMatch = o === opt;
                        o.classList.toggle("is-selected", isMatch);
                        o.setAttribute("aria-selected", String(isMatch));
                    });

                    if (summaryText) summaryText.textContent = `Năm ${selectedYear}`;
                    if (mainYearNum) {
                        mainYearNum.textContent = selectedYear;
                        mainYearNum.setAttribute("datetime", selectedYear);
                    }
                    yearDropdown.removeAttribute("open");
                });
            });
        }
    };

    document.addEventListener("DOMContentLoaded", initYearCalendar);
    window.addEventListener("template-loaded", initYearCalendar);
})();
