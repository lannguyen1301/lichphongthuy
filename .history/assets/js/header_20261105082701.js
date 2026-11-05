// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

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

        document.body.style.overflow = nextState ? "hidden" : "";
    };

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

    const initMonthCalendar = () => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid) return;

        const cells = grid.querySelectorAll(".month-cal__cell");
        const calDropdowns = document.querySelectorAll(".js-cal-dropdown");
        const legendPills = document.querySelectorAll(".month-cal__legend-pill");
        const solarDayEl = document.getElementById("detail-solar-day");
        const lunarDayEl = document.getElementById("detail-lunar-day");

        cells.forEach((cell) => {
            cell.onclick = () => {
                cells.forEach((item) => {
                    item.classList.remove("month-cal__cell--active");
                    item.removeAttribute("aria-current");
                });

                cell.classList.add("month-cal__cell--active");
                cell.setAttribute("aria-current", "date");

                if (solarDayEl && cell.dataset.solar) {
                    solarDayEl.textContent = cell.dataset.solar;
                }
                if (lunarDayEl && cell.dataset.lunar) {
                    lunarDayEl.textContent = cell.dataset.lunar.split("/")[0];
                }
            };
        });

        calDropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((other) => {
                        if (other !== current) {
                            other.removeAttribute("open");
                        }
                    });
                }
            };

            const summaryLabel = current.querySelector(".month-cal__summary-text");
            const options = current.querySelectorAll(".month-cal__option");

            options.forEach((opt) => {
                opt.onclick = (e) => {
                    e.stopPropagation();
                    options.forEach((o) => {
                        o.classList.remove("is-selected");
                        o.removeAttribute("aria-selected");
                    });
                    opt.classList.add("is-selected");
                    opt.setAttribute("aria-selected", "true");

                    if (summaryLabel) summaryLabel.textContent = opt.textContent;
                    current.removeAttribute("open");
                };
            });
        });

        const highlightCellsByStatus = (statusKey) => {
            cells.forEach((cell) => {
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
            pill.onmouseenter = () => highlightCellsByStatus(filterKey);
            pill.onmouseleave = () => highlightCellsByStatus(null);
            pill.onfocus = () => highlightCellsByStatus(filterKey);
            pill.onblur = () => highlightCellsByStatus(null);
        });
    };

    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header") || document.getElementById("site-header");
        if (header) {
            const burgerBtn = document.getElementById("burger-btn");
            const backdrop = document.getElementById("sidebar-backdrop");
            const widgetBtn = document.getElementById("widget-trigger-btn");
            const dropdowns = document.querySelectorAll(".js-header-dropdown");
            const themeBtns = document.querySelectorAll(".header__theme-btn");

            header.classList.toggle("header--scrolled", window.scrollY > 10);

            if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
            if (backdrop) backdrop.onclick = () => toggleSidebar(true);

            if (widgetBtn) {
                widgetBtn.onclick = () => {
                    const isExpanded = widgetBtn.getAttribute("aria-expanded") === "true";
                    const nextState = !isExpanded;
                    widgetBtn.classList.toggle("is-active", nextState);
                    widgetBtn.setAttribute("aria-expanded", String(nextState));
                };
            }

            dropdowns.forEach((current) => {
                current.ontoggle = () => {
                    if (current.open) {
                        document
                            .querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]")
                            .forEach((other) => {
                                if (other !== current) {
                                    other.removeAttribute("open");
                                }
                            });
                    }
                };
            });

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
        }

        initMonthCalendar();
    };

    const bindGlobalListeners = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

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

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalListeners();
        initHeaderAndSidebar();
    });

    window.addEventListener("template-loaded", initHeaderAndSidebar);
})();
