// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // 1. Khôi phục ngay bản mệnh Ngũ hành từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 2. Bật/tắt Sidebar Drawer trên Mobile & Khóa cuộn trang (Body Scroll Lock)
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

        // Chặn cuộn trang trên <body> khi menu mobile đang mở
        document.body.style.overflow = nextState ? "hidden" : "";
    };

    // 3. Cập nhật Ngày & Giờ thực trên Header
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

    // 4. Khởi tạo các phần tử sau khi load() nạp xong header.html & sidebar.html
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header");
        if (!header) return;

        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        const widgetBtn = document.getElementById("widget-trigger-btn");
        const dropdowns = document.querySelectorAll(".js-header-dropdown");
        const themeBtns = document.querySelectorAll(".header__theme-btn");

        // Đồng bộ trạng thái cuộn
        header.classList.toggle("header--scrolled", window.scrollY > 10);

        // Nút Hamburger & Backdrop trên Mobile
        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        // Nút Widget Trigger (Tra cứu nhanh / Đổi Âm Dương)
        if (widgetBtn) {
            widgetBtn.onclick = () => {
                const isExpanded = widgetBtn.getAttribute("aria-expanded") === "true";
                const nextState = !isExpanded;
                widgetBtn.classList.toggle("is-active", nextState);
                widgetBtn.setAttribute("aria-expanded", String(nextState));
                window.dispatchEvent(new CustomEvent("widget-trigger-toggle", { detail: { open: nextState } }));
            };
        }

        // Đóng/mở độc lập các Dropdown <details> (Ngôn ngữ & Theme)
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

        // Chuyển đổi Theme Ngũ hành & Lưu vào localStorage
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

        updateClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateClock, 1000);
    };

    // 5. Sự kiện toàn cục trên window/document (Chỉ gắn 1 lần duy nhất)
    const bindGlobalListeners = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true }
        );

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalListeners();
        initHeaderAndSidebar();
    });

    // Bắt sự kiện mỗi khi hàm load() trong script.js nạp xong template
    window.addEventListener("template-loaded", initHeaderAndSidebar);
})();// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // 1. Khôi phục ngay bản mệnh Ngũ hành từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 2. Bật/tắt Sidebar Drawer trên Mobile & Khóa cuộn trang (Body Scroll Lock)
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

        // Chặn cuộn trang trên <body> khi menu mobile đang mở
        document.body.style.overflow = nextState ? "hidden" : "";
    };

    // 3. Cập nhật Ngày & Giờ thực trên Header
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

    // 4. Khởi tạo các phần tử sau khi load() nạp xong header.html & sidebar.html
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header");
        if (!header) return;

        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        const widgetBtn = document.getElementById("widget-trigger-btn");
        const dropdowns = document.querySelectorAll(".js-header-dropdown");
        const themeBtns = document.querySelectorAll(".header__theme-btn");

        // Đồng bộ trạng thái cuộn
        header.classList.toggle("header--scrolled", window.scrollY > 10);

        // Nút Hamburger & Backdrop trên Mobile
        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        // Nút Widget Trigger (Tra cứu nhanh / Đổi Âm Dương)
        if (widgetBtn) {
            widgetBtn.onclick = () => {
                const isExpanded = widgetBtn.getAttribute("aria-expanded") === "true";
                const nextState = !isExpanded;
                widgetBtn.classList.toggle("is-active", nextState);
                widgetBtn.setAttribute("aria-expanded", String(nextState));
                window.dispatchEvent(new CustomEvent("widget-trigger-toggle", { detail: { open: nextState } }));
            };
        }

        // Đóng/mở độc lập các Dropdown <details> (Ngôn ngữ & Theme)
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

        // Chuyển đổi Theme Ngũ hành & Lưu vào localStorage
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

        updateClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateClock, 1000);
    };

    // 5. Sự kiện toàn cục trên window/document (Chỉ gắn 1 lần duy nhất)
    const bindGlobalListeners = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true }
        );

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalListeners();
        initHeaderAndSidebar();
    });

    // Bắt sự kiện mỗi khi hàm load() trong script.js nạp xong template
    window.addEventListener("template-loaded", initHeaderAndSidebar);
})();// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // 1. Khôi phục ngay bản mệnh Ngũ hành từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 2. Bật/tắt Sidebar Drawer trên Mobile & Khóa cuộn trang (Body Scroll Lock)
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

        // Chặn cuộn trang trên <body> khi menu mobile đang mở
        document.body.style.overflow = nextState ? "hidden" : "";
    };

    // 3. Cập nhật Ngày & Giờ thực trên Header
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

    // 4. Khởi tạo các phần tử sau khi load() nạp xong header.html & sidebar.html
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header");
        if (!header) return;

        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        const widgetBtn = document.getElementById("widget-trigger-btn");
        const dropdowns = document.querySelectorAll(".js-header-dropdown");
        const themeBtns = document.querySelectorAll(".header__theme-btn");

        // Đồng bộ trạng thái cuộn
        header.classList.toggle("header--scrolled", window.scrollY > 10);

        // Nút Hamburger & Backdrop trên Mobile
        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        // Nút Widget Trigger (Tra cứu nhanh / Đổi Âm Dương)
        if (widgetBtn) {
            widgetBtn.onclick = () => {
                const isExpanded = widgetBtn.getAttribute("aria-expanded") === "true";
                const nextState = !isExpanded;
                widgetBtn.classList.toggle("is-active", nextState);
                widgetBtn.setAttribute("aria-expanded", String(nextState));
                window.dispatchEvent(new CustomEvent("widget-trigger-toggle", { detail: { open: nextState } }));
            };
        }

        // Đóng/mở độc lập các Dropdown <details> (Ngôn ngữ & Theme)
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

        // Chuyển đổi Theme Ngũ hành & Lưu vào localStorage
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

        updateClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateClock, 1000);
    };

    // 5. Sự kiện toàn cục trên window/document (Chỉ gắn 1 lần duy nhất)
    const bindGlobalListeners = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true }
        );

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalListeners();
        initHeaderAndSidebar();
    });

    // Bắt sự kiện mỗi khi hàm load() trong script.js nạp xong template
    window.addEventListener("template-loaded", initHeaderAndSidebar);
})();// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // 1. Khôi phục ngay bản mệnh Ngũ hành từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 2. Bật/tắt Sidebar Drawer trên Mobile & Khóa cuộn trang (Body Scroll Lock)
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

        // Chặn cuộn trang trên <body> khi menu mobile đang mở
        document.body.style.overflow = nextState ? "hidden" : "";
    };

    // 3. Cập nhật Ngày & Giờ thực trên Header
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

    // 4. Khởi tạo các phần tử sau khi load() nạp xong header.html & sidebar.html
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header");
        if (!header) return;

        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        const widgetBtn = document.getElementById("widget-trigger-btn");
        const dropdowns = document.querySelectorAll(".js-header-dropdown");
        const themeBtns = document.querySelectorAll(".header__theme-btn");

        // Đồng bộ trạng thái cuộn
        header.classList.toggle("header--scrolled", window.scrollY > 10);

        // Nút Hamburger & Backdrop trên Mobile
        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        // Nút Widget Trigger (Tra cứu nhanh / Đổi Âm Dương)
        if (widgetBtn) {
            widgetBtn.onclick = () => {
                const isExpanded = widgetBtn.getAttribute("aria-expanded") === "true";
                const nextState = !isExpanded;
                widgetBtn.classList.toggle("is-active", nextState);
                widgetBtn.setAttribute("aria-expanded", String(nextState));
                window.dispatchEvent(new CustomEvent("widget-trigger-toggle", { detail: { open: nextState } }));
            };
        }

        // Đóng/mở độc lập các Dropdown <details> (Ngôn ngữ & Theme)
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

        // Chuyển đổi Theme Ngũ hành & Lưu vào localStorage
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

        updateClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateClock, 1000);
    };

    // 5. Sự kiện toàn cục trên window/document (Chỉ gắn 1 lần duy nhất)
    const bindGlobalListeners = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true }
        );

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalListeners();
        initHeaderAndSidebar();
    });

    // Bắt sự kiện mỗi khi hàm load() trong script.js nạp xong template
    window.addEventListener("template-loaded", initHeaderAndSidebar);
})();