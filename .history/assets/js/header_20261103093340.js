// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // 1. Khôi phục ngay lập tức Theme Ngũ hành đã lưu từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 2. Hàm đóng/mở Sidebar trên Mobile & Khóa cuộn trang (Body Scroll Lock)
    const toggleSidebar = (forceClose = false) => {
        const sidebar = document.getElementById("calendar-sidebar");
        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        if (!sidebar || !burgerBtn || !backdrop) return;

        const isOpen = sidebar.classList.contains("is-open");
        const nextState = forceClose ? false : !isOpen;

        sidebar.classList.toggle("is-open", nextState);
        burgerBtn.classList.toggle("is-active", nextState);
        backdrop.classList.toggle("is-active", nextState);
        burgerBtn.setAttribute("aria-expanded", String(nextState));

        // Chặn cuộn trang trên <body> khi mở menu mobile
        document.body.style.overflow = nextState ? "hidden" : "";
    };

    // 3. Hàm cập nhật Ngày & Giờ thực trên Header
    const updateClock = () => {
        const dateEl = document.getElementById("current-date");
        const timeEl = document.getElementById("current-time");
        if (!dateEl || !timeEl) return;

        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");

        const dd = pad(now.getDate());
        const mm = pad(now.getMonth() + 1);
        const yyyy = now.getFullYear();
        const hh = pad(now.getHours());
        const min = pad(now.getMinutes());
        const ss = pad(now.getSeconds());

        dateEl.textContent = `${dd}/${mm}/${yyyy}`;
        dateEl.setAttribute("datetime", `${yyyy}-${mm}-${dd}`);
        timeEl.textContent = `${hh}:${min}:${ss}`;
        timeEl.setAttribute("datetime", `${hh}:${min}:${ss}`);
    };

    // 4. Khởi tạo các phần tử bên trong Header (Chạy cả khi DOMContentLoaded và khi script.js bắn "template-loaded")
    const initHeaderElements = () => {
        const header = document.getElementById("site-header");
        if (!header) return;

        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        const dropdowns = document.querySelectorAll(".js-header-dropdown");
        const themeBtns = document.querySelectorAll(".header__theme-btn");

        // Đồng bộ trạng thái cuộn ngay khi render
        header.classList.toggle("header--scrolled", window.scrollY > 10);

        // Gắn sự kiện cho nút Hamburger & Backdrop (Dùng onclick để tránh nhân bản khi template-loaded gọi lại)
        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        // Đóng/mở độc lập giữa các thẻ <details> (Ngôn ngữ & Theme)
        dropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    dropdowns.forEach((other) => {
                        if (other !== current && other.open) {
                            other.removeAttribute("open");
                        }
                    });
                }
            };
        });

        // Đồng bộ nút Active theo Theme hiện tại & Gắn sự kiện đổi Theme Ngũ hành
        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";
        themeBtns.forEach((btn) => {
            const isCurrent = btn.dataset.theme === activeTheme;
            btn.classList.toggle("is-active", isCurrent);
            btn.setAttribute("aria-pressed", String(isCurrent));

            btn.onclick = () => {
                const selectedTheme = btn.dataset.theme;
                if (!selectedTheme) return;

                document.documentElement.setAttribute("data-theme", selectedTheme);
                localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

                themeBtns.forEach((item) => {
                    const isMatch = item === btn;
                    item.classList.toggle("is-active", isMatch);
                    item.setAttribute("aria-pressed", String(isMatch));
                });

                btn.closest("details")?.removeAttribute("open");
            };
        });

        // Khởi chạy bộ đếm thời gian thực
        updateClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateClock, 1000);
    };

    // 5. Các sự kiện toàn cục trên window/document (Chỉ gắn 1 lần duy nhất)
    const bindGlobalEvents = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

        // Hiệu ứng đổ bóng khi cuộn trang
        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("site-header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true },
        );

        // Tự động đóng Drawer và mở khóa cuộn khi kéo rộng màn hình qua mốc md (768px)
        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        // Click ra ngoài tự động đóng các Dropdown <details>
        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        // Nhấn phím Escape để đóng toàn bộ Dropdown và Mobile Sidebar
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    // Kích hoạt cho cả trường hợp HTML tĩnh lẫn trường hợp nạp động qua hàm load() của script.js
    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalEvents();
        initHeaderElements();
    });
    window.addEventListener("template-loaded", initHeaderElements);
})();
