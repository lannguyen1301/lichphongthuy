// assets/js/month-calendar.js (Chỉ nhúng vào index.html)
(() => {
    const initMonthCalendar = () => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid || grid.dataset.bound === "true") return;
        grid.dataset.bound = "true";

        // Dán toàn bộ nội dung hàm initMonthCalendar() của bạn vào đây
    };

    document.addEventListener("DOMContentLoaded", initMonthCalendar);
    window.addEventListener("template-loaded", initMonthCalendar);
})();