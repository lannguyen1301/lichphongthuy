// assets/js/week-calendar.js
(() => {
    const initWeekCalendar = () => {
        const rootEl = document.getElementById("week-calendar-root");
        const app = document.getElementById("week-cal-app");
        if (!app) return;

        if (rootEl) rootEl.setAttribute("aria-busy", "false");
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const cards = Array.from(app.querySelectorAll(".week-cal__card"));

        const selectDayCard = (targetCard, shouldFocus = false) => {
            if (!targetCard) return;

            // 1. Lấy toàn bộ dữ liệu từ data-* của thẻ ngày thông qua dataset
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
                do: doText,
                dont: dontText,
            } = targetCard.dataset;

            // 2. Cập nhật Roving Tabindex & aria-current="date"
            cards.forEach((card) => {
                const isSelected = card === targetCard;
                card.classList.toggle("week-cal__card--active", isSelected);
                card.setAttribute("tabindex", isSelected ? "0" : "-1");
                if (isSelected) card.setAttribute("aria-current", "date");
                else card.removeAttribute("aria-current");
            });

            // 3. Đổ dữ liệu sang Thẻ Hero bên trái (aria-live="polite" sẽ tự động đọc cho Screen Reader)
            app.dataset.activeDate = date;
            document.getElementById("hero-solar-display").textContent = solar;
            document.getElementById("hero-solar-display").setAttribute("datetime", date);
            document.getElementById("hero-weekday-display").textContent = weekday;
            document.getElementById("hero-lunar-display").innerHTML =
                `Ngày ${lunar} Âm lịch • <strong>${canchi}</strong> (${napam})`;
            document.getElementById("hero-day-fortune").textContent = fortuneLabel;
            document.getElementById("hero-day-fortune").dataset.fortune = fortune;
            document.getElementById("hero-good-hours").textContent = goodHours;
            document.getElementById("hero-truc-term").textContent = `Tiết khí: ${term} • Trực: ${truc}`;
            document.getElementById("hero-do-text").textContent = doText;
            document.getElementById("hero-dont-text").textContent = dontText;
            document.getElementById("hero-detail-link").href = `./index.html?date=${date}`;
            document.getElementById("hero-zodiac-img").src = `./assets/icons/zodiac/${zodiac}.svg`;

            if (shouldFocus) targetCard.focus();
        };

        // 4. Lắng nghe Click & Điều hướng phím mũi tên chuẩn a11y
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
    };

    document.addEventListener("DOMContentLoaded", initWeekCalendar);
    window.addEventListener("template-loaded", initWeekCalendar);
})();
