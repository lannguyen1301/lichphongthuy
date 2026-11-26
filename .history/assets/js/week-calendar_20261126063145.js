// assets/js/week-calendar.js
(() => {
    const renderActionChips = (listEl, rawCsv) => {
        if (!listEl) return;
        const items = String(rawCsv || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        listEl.innerHTML = items.map((text) => `<li class="fengshui-actions__chip">${text}</li>`).join("");
    };

    const initWeekCalendar = () => {
        const rootEl = document.getElementById("week-calendar-root");
        const app = document.getElementById("week-cal-app");
        if (!app) return;

        if (rootEl) rootEl.setAttribute("aria-busy", "false");
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const cards = Array.from(app.querySelectorAll(".week-cal__card"));
        const legendPills = app.querySelectorAll(".month-cal__legend-pill");
        const todayBtn = document.getElementById("week-today-btn");

        const selectDayCard = (targetCard, shouldFocus = false) => {
            if (!targetCard) return;

            // 1. Đọc dữ liệu từ data-* thông qua dataset
            const {
                date,
                solar,
                weekday,
                lunar,
                canchi,
                napam,
                truc,
                term,
                zodiac,
                fortune,
                fortuneLabel,
                goodHours,
                do: doCsv,
                dont: dontCsv,
            } = targetCard.dataset;

            // 2. Đồng bộ trạng thái Active (Nền màu theme mờ 9%) & Roving Tabindex
            cards.forEach((card) => {
                const isSelected = card === targetCard;
                card.classList.toggle("week-cal__card--active", isSelected);
                card.setAttribute("tabindex", isSelected ? "0" : "-1");
                if (isSelected) card.setAttribute("aria-current", "date");
                else card.removeAttribute("aria-current");
            });

            // 3. Cập nhật Thẻ Detail bên trái (Flat UI)
            app.dataset.activeDate = date;
            document.getElementById("hero-solar-display").textContent = solar;
            document.getElementById("hero-solar-display").setAttribute("datetime", date);
            document.getElementById("hero-weekday-display").textContent = weekday;
            document.getElementById("hero-lunar-display").innerHTML =
                `Ngày ${lunar} Âm lịch • <strong>${canchi}</strong> (${napam})`;

            const fortuneTextEl = document.getElementById("hero-day-fortune-text");
            if (fortuneTextEl) fortuneTextEl.textContent = fortuneLabel;
            document.getElementById("hero-day-fortune").dataset.fortune = fortune;

            // Cập nhật 2 badge ngang Tiết khí & Trực
            document.getElementById("hero-term-val").textContent = term;
            document.getElementById("hero-truc-val").textContent = truc;

            // Cập nhật Giờ tốt & Danh sách Chip Nên làm / Không nên làm
            document.getElementById("hero-good-hours").textContent = goodHours;
            renderActionChips(document.getElementById("hero-do-list"), doCsv);
            renderActionChips(document.getElementById("hero-dont-list"), dontCsv);

            document.getElementById("hero-detail-link").href = `./index.html?date=${date}`;
            document.getElementById("hero-zodiac-img").src = `./assets/icons/zodiac/${zodiac}.svg`;

            if (shouldFocus) targetCard.focus();
        };

        cards.forEach((card, idx) => {
            card.addEventListener("click", () => selectDayCard(card));

            card.addEventListener("keydown", (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % cards.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + cards.length) % cards.length;

                if (nextIdx !== -1) {
                    e.preventDefault();
                    selectDayCard(cards[nextIdx], true);
                }
            });
        });

        if (todayBtn) {
            todayBtn.addEventListener("click", () => {
                const todayCard = app.querySelector(".week-cal__card--today") || cards[4];
                if (todayCard) selectDayCard(todayCard, true);
            });
        }

        // Lọc sáng Hoàng Đạo / Hắc Đạo / Hôm Nay từ thanh Legend đồng bộ
        const highlightWeekCards = (statusKey, activePill = null) => {
            legendPills.forEach((p) => {
                const isMatch = p === activePill && Boolean(statusKey);
                p.classList.toggle("is-active", isMatch);
                p.setAttribute("aria-pressed", String(isMatch));
            });

            cards.forEach((card) => {
                if (!statusKey) {
                    card.classList.remove("is-dimmed", "is-highlighted");
                    return;
                }
                const cardStatus = card.dataset.status || "";
                const isMatch = cardStatus.split(" ").includes(statusKey);
                card.classList.toggle("is-highlighted", isMatch);
                card.classList.toggle("is-dimmed", !isMatch);
            });
        };

        legendPills.forEach((pill) => {
            const filterKey = pill.dataset.filter;
            pill.addEventListener("mouseenter", () => highlightWeekCards(filterKey, pill));
            pill.addEventListener("mouseleave", () => highlightWeekCards(null));
            pill.addEventListener("focus", () => highlightWeekCards(filterKey, pill));
            pill.addEventListener("blur", () => highlightWeekCards(null));
        });
    };

    document.addEventListener("DOMContentLoaded", initWeekCalendar);
    window.addEventListener("template-loaded", initWeekCalendar);
})();
