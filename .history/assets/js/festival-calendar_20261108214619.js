// assets/js/festival-calendar.js
(() => {
    const initFestivalCalendar = () => {
        const rootEl = document.getElementById("festival-calendar-root");
        const app = document.getElementById("festival-cal-app");
        if (!app) return;

        if (rootEl) rootEl.setAttribute("aria-busy", "false");
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const filterBtns = Array.from(app.querySelectorAll("[data-festival-filter]"));
        const jumpBtns = Array.from(app.querySelectorAll("[data-jump-month]"));
        const monthCards = Array.from(app.querySelectorAll("[data-month-card]"));
        const eventItems = Array.from(app.querySelectorAll(".festival-item"));
        const totalCountEl = document.getElementById("festival-total-count");

        // 1. Đọc dataset của thẻ sự kiện khi hover/focus để cập nhật Thẻ Hero Tiêu Điểm bên trái
        const syncItemToHero = (item) => {
            if (!item) return;
            const { date, solar, lunar, weekday, calendarType, canchi, term, zodiac } = item.dataset;
            const titleText = item.querySelector(".festival-item__name")?.textContent || "";

            const todayMidnight = new Date();
            todayMidnight.setHours(0, 0, 0, 0);
            const targetDate = new Date(`${date}T00:00:00`);
            const diffDays = Math.round((targetDate - todayMidnight) / 86400000);

            let countdownText = "Hôm nay diễn ra";
            if (diffDays > 0) countdownText = `Sắp diễn ra • Còn ${diffDays} ngày`;
            else if (diffDays < 0) countdownText = `Đã qua ${Math.abs(diffDays)} ngày`;

            document.getElementById("festival-hero-countdown").textContent = countdownText;
            document.getElementById("festival-hero-type").dataset.calendarType = calendarType;
            document.getElementById("festival-hero-type-text").textContent =
                calendarType === "lunar" ? "Âm lịch" : "Dương lịch";
            document.getElementById("festival-hero-solar").textContent = solar;
            document.getElementById("festival-hero-solar").setAttribute("datetime", date);
            document.getElementById("festival-hero-weekday").textContent = weekday;
            document.getElementById("festival-hero-title").textContent = titleText;
            document.getElementById("festival-hero-lunar").innerHTML =
                `Nhằm ngày <strong>${lunar} Âm lịch</strong> • Ngày ${canchi}`;
            document.getElementById("festival-hero-term").textContent = `Tiết khí: ${term}`;
            document.getElementById("festival-hero-link").href = `./day.html?date=${date}`;
            document.getElementById("festival-hero-zodiac").src = `./assets/icons/zodiac/${zodiac || "horse"}.svg`;

            eventItems.forEach((el) => el.classList.toggle("is-active", el === item));
        };

        eventItems.forEach((item) => {
            item.addEventListener("mouseenter", () => syncItemToHero(item));
            item.addEventListener("focus", () => syncItemToHero(item));
        });

        // 2. Lọc sự kiện qua dataset.calendarType & thuộc tính hidden chuẩn HTML5
        const applyFestivalFilter = (filterKey) => {
            app.dataset.activeFilter = filterKey;
            const todayIso = new Date().toISOString().slice(0, 10);
            let visibleTotal = 0;

            filterBtns.forEach((btn) => {
                const isMatch = btn.dataset.festivalFilter === filterKey;
                btn.classList.toggle("is-active", isMatch);
                btn.setAttribute("aria-pressed", String(isMatch));
            });

            monthCards.forEach((mCard) => {
                const itemsInMonth = Array.from(mCard.querySelectorAll(".festival-item"));
                let visibleInMonth = 0;

                itemsInMonth.forEach((item) => {
                    const type = item.dataset.calendarType;
                    const dateStr = item.dataset.date || "";
                    let isShow = true;

                    if (filterKey === "lunar") isShow = type === "lunar";
                    else if (filterKey === "solar") isShow = type === "solar";
                    else if (filterKey === "upcoming") isShow = dateStr >= todayIso;

                    item.hidden = !isShow;
                    if (isShow) {
                        visibleInMonth++;
                        visibleTotal++;
                    }
                });

                // Ẩn hoàn toàn thẻ Tháng bằng thuộc tính hidden nếu tháng đó có 0 sự kiện khớp bộ lọc
                mCard.hidden = visibleInMonth === 0;
                const countBadge = mCard.querySelector("[data-month-count]");
                if (countBadge) countBadge.textContent = `${visibleInMonth} sự kiện`;
            });

            if (totalCountEl) {
                totalCountEl.textContent = `Đang hiển thị: ${visibleTotal} sự kiện`;
            }
        };

        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => applyFestivalFilter(btn.dataset.festivalFilter || "all"));
        });

        // 3. Nhảy nhanh tới Tháng kèm Roving Tabindex (0 và -1)
        const selectJumpMonth = (targetBtn, shouldScroll = true) => {
            if (!targetBtn) return;
            const monthNum = targetBtn.dataset.jumpMonth;

            jumpBtns.forEach((b) => {
                const isSelected = b === targetBtn;
                b.classList.toggle("is-active", isSelected);
                b.setAttribute("tabindex", isSelected ? "0" : "-1");
            });

            if (shouldScroll) {
                const targetCard = document.getElementById(`festival-month-${monthNum}`);
                if (targetCard && !targetCard.hidden) {
                    targetCard.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        };

        jumpBtns.forEach((btn, idx) => {
            btn.addEventListener("click", () => selectJumpMonth(btn, true));

            btn.addEventListener("keydown", (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % jumpBtns.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                    nextIdx = (idx - 1 + jumpBtns.length) % jumpBtns.length;

                if (nextIdx !== -1) {
                    e.preventDefault();
                    jumpBtns[nextIdx].focus();
                    selectJumpMonth(jumpBtns[nextIdx], false);
                }
            });
        });
    };

    document.addEventListener("DOMContentLoaded", initFestivalCalendar);
    window.addEventListener("template-loaded", initFestivalCalendar);
})();
