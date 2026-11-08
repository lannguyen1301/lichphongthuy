// assets/js/header.js
// Chuyên trách duy nhất Header: Sticky Scroll, Đồng hồ thời gian thực, Dropdown Ngôn ngữ & Theme Ngũ hành
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isHeaderGlobalBound = false;
    let clockTimer = null;

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const applyTheme = (selectedTheme) => {
        if (!selectedTheme) return;
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

        document.querySelectorAll(".header__theme-btn").forEach((btn) => {
            const isMatch = btn.dataset.theme === selectedTheme;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(Boolean(isMatch)));
        });

        window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: selectedTheme } }));
    };

    window.setFengShuiTheme = applyTheme;

    const updateHeaderClock = () => {
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

    const initHeader = () => {
        const header = document.getElementById("header") || document.getElementById("site-header");
        if (!header) return;

        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";
        const dropdowns = header.querySelectorAll(".js-header-dropdown");
        const themeBtns = header.querySelectorAll(".header__theme-btn");

        header.classList.toggle("header--scrolled", window.scrollY > 10);

        dropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((other) => {
                        if (other !== current) other.removeAttribute("open");
                    });
                }
            };
        });

        themeBtns.forEach((btn) => {
            const isCurrent = btn.dataset.theme === activeTheme;
            btn.classList.toggle("is-active", isCurrent);
            btn.setAttribute("aria-pressed", String(isCurrent));

            btn.onclick = () => {
                applyTheme(btn.dataset.theme);
                btn.closest("details")?.removeAttribute("open");
            };
        });

        updateHeaderClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateHeaderClock, 1000);
    };

    const bindHeaderGlobalListeners = () => {
        if (isHeaderGlobalBound) return;
        isHeaderGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header") || document.getElementById("site-header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true },
        );

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) dropdown.removeAttribute("open");
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindHeaderGlobalListeners();
        initHeader();
    });

    window.addEventListener("template-loaded", initHeader);
})();

// nháp
// 1. assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isHeaderGlobalBound = false;
    let clockTimer = null;

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const applyTheme = (selectedTheme) => {
        if (!selectedTheme) return;
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

        document.querySelectorAll(".header__theme-btn").forEach((btn) => {
            const isMatch = btn.dataset.theme === selectedTheme;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(Boolean(isMatch)));
        });

        window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: selectedTheme } }));
    };

    window.setFengShuiTheme = applyTheme;

    const updateHeaderClock = () => {
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

    const initHeader = () => {
        const header = document.getElementById("header") || document.getElementById("site-header");
        if (!header) return;

        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";
        const dropdowns = header.querySelectorAll(".js-header-dropdown");
        const themeBtns = header.querySelectorAll(".header__theme-btn");

        header.classList.toggle("header--scrolled", window.scrollY > 10);

        dropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((other) => {
                        if (other !== current) other.removeAttribute("open");
                    });
                }
            };
        });

        themeBtns.forEach((btn) => {
            const isCurrent = btn.dataset.theme === activeTheme;
            btn.classList.toggle("is-active", isCurrent);
            btn.setAttribute("aria-pressed", String(isCurrent));

            btn.onclick = () => {
                applyTheme(btn.dataset.theme);
                btn.closest("details")?.removeAttribute("open");
            };
        });

        updateHeaderClock();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateHeaderClock, 1000);
    };

    const bindHeaderGlobalListeners = () => {
        if (isHeaderGlobalBound) return;
        isHeaderGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header") || document.getElementById("site-header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true },
        );

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) dropdown.removeAttribute("open");
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindHeaderGlobalListeners();
        initHeader();
    });

    window.addEventListener("template-loaded", initHeader);
})();