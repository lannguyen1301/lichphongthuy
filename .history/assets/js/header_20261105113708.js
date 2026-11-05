// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // Bản đồ quy đổi Thứ trong tuần (theo vị trí cột 0 -> 6 trong lưới 7 cột)
    const WEEKDAY_LABELS = [
        "THỨ HAI • MONDAY",
        "THỨ BA • TUESDAY",
        "THỨ TƯ • WEDNESDAY",
        "THỨ NĂM • THURSDAY",
        "THỨ SÁU • FRIDAY",
        "THỨ BẢY • SATURDAY",
        "CHỦ NHẬT • SUNDAY",
    ];

    // Bản đồ quy đổi tên Tháng Âm lịch
    const LUNAR_MONTH_NAMES = {
        1: "THÁNG GIÊNG (Đ)",
        2: "THÁNG HAI (T)",
        3: "THÁNG BA (Đ)",
        4: "THÁNG TƯ (T)",
        5: "THÁNG NĂM (Đ)",
        6: "THÁNG SÁU (T)",
        7: "THÁNG BẢY (Đ)",
        8: "THÁNG TÁM (T)",
        9: "THÁNG CHÍN (Đ)",
        10: "THÁNG MƯỜI (Đ)",
        11: "THÁNG MƯỜI MỘT (T)",
        12: "THÁNG CHẠP (Đ)",
    };

    // Bản đồ quy đổi tên file SVG Con Giáp sang Địa Chi tiếng Việt
    const ZODIAC_TO_CHI = {
        mouse: "Tý",
        buffalo: "Sửu",
        tiger: "Dần",
        cat: "Mão",
        dragon: "Thìn",
        snake: "Tỵ",
        horse: "Ngọ",
        goat: "Mùi",
        monkey: "Thân",
        rooster: "Dậu",
        dog: "Tuất",
        pig: "Hợi",
    };

    const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

    // 1. Khôi phục Theme Ngũ hành từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Hàm dùng chung để đổi Theme Ngũ hành (từ cả Header và Footer)
    const applyTheme = (selectedTheme) => {
        if (!selectedTheme) return;
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

        document.querySelectorAll(".header__theme-btn").forEach((btn) => {
            const isMatch = btn.dataset.theme === selectedTheme;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(isMatch));
        });

        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.classList.toggle("is-active", dot.dataset.quickTheme === selectedTheme);
        });
    };

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

    // 4. Đồng bộ toàn bộ thông tin từ ô ngày được chọn sang Tờ Lịch Bloc (Cột Trái)
    const syncCellToBlocCard = (cell, index) => {
        const solarDayEl = document.getElementById("detail-solar-day");
        const lunarDayEl = document.getElementById("detail-lunar-day");
        const lunarMonthEl = document.getElementById("detail-lunar-month");
        const weekdayEl = document.getElementById("detail-weekday");
        const statusEl = document.getElementById("detail-day-status");
        const canchiDayEl = document.getElementById("detail-canchi-day");
        const canchiMonthEl = document.getElementById("detail-canchi-month");

        if (solarDayEl && cell.dataset.solar) {
            solarDayEl.textContent = cell.dataset.solar;
        }

        if (cell.dataset.lunar) {
            const [lDay, lMonth] = cell.dataset.lunar.split("/");
            if (lunarDayEl) lunarDayEl.textContent = lDay;
            if (lunarMonthEl && LUNAR_MONTH_NAMES[lMonth]) {
                lunarMonthEl.textContent = LUNAR_MONTH_NAMES[lMonth];
            }
            if (canchiMonthEl) {
                canchiMonthEl.textContent = lMonth === "10" ? "Tháng Kỷ Hợi" : "Tháng Mậu Tuất";
            }
        }

        // Cập nhật Thứ trong tuần theo vị trí cột (0 -> 6)
        if (weekdayEl && typeof index === "number") {
            weekdayEl.textContent = WEEKDAY_LABELS[index % 7];
        }

        // Cập nhật trạng thái Ngày Hoàng Đạo / Hắc Đạo / Ngày Lễ
        if (statusEl) {
            const statusStr = cell.dataset.status || "";
            const badgeEl = cell.querySelector(".month-cal__badge");
            if (badgeEl) {
                statusEl.textContent = `Ngày ${badgeEl.textContent.trim()}`;
            } else if (statusStr.includes("good")) {
                statusEl.textContent = "Ngày Hoàng Đạo";
            } else if (statusStr.includes("bad")) {
                statusEl.textContent = "Ngày Hắc Đạo";
            } else {
                statusEl.textContent = "Ngày bình thường";
            }
        }

        // Cập nhật Can Chi Ngày khớp với icon Con Giáp trong ô đó
        if (canchiDayEl) {
            const zodiacImg = cell.querySelector(".month-cal__zodiac-img");
            const src = zodiacImg?.getAttribute("src") || "";
            const match = src.match(/\/([a-z-]+)\.svg$/i);
            const animalKey = match ? match[1] : null;
            const diaChi = animalKey && ZODIAC_TO_CHI[animalKey] ? ZODIAC_TO_CHI[animalKey] : "Tỵ";
            // Ô index 8 (ngày 3/11) là Tân Tỵ (index 7 trong THIEN_CAN) -> suy ra Thiên Can của mọi ô
            const canIndex = (((index - 8 + 7) % 10) + 10) % 10;
            canchiDayEl.textContent = `Ngày ${THIEN_CAN[canIndex]} ${diaChi}`;
        }
    };

    // 5. Khởi tạo Lịch Tháng (Chọn ngày, nút Hôm nay, Dropdown Tháng/Năm & Bộ lọc Chú thích)
    const initMonthCalendar = () => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid) return;

        const cells = Array.from(grid.querySelectorAll(".month-cal__cell"));
        const calDropdowns = document.querySelectorAll(".js-cal-dropdown");
        const legendPills = document.querySelectorAll(".month-cal__legend-pill");
        const todayBtn = document.getElementById("cal-today-btn");

        const selectCell = (targetCell) => {
            const targetIndex = cells.indexOf(targetCell);
            if (targetIndex === -1) return;

            cells.forEach((item) => {
                item.classList.remove("month-cal__cell--active");
                item.removeAttribute("aria-current");
            });

            targetCell.classList.add("month-cal__cell--active");
            targetCell.setAttribute("aria-current", "date");
            syncCellToBlocCard(targetCell, targetIndex);
        };

        cells.forEach((cell) => {
            cell.onclick = () => selectCell(cell);
        });

        // Nút "Hôm nay": nhảy về ô có class .month-cal__cell--today và kích hoạt đồng bộ
        if (todayBtn) {
            todayBtn.onclick = () => {
                const todayCell = grid.querySelector(".month-cal__cell--today") || cells[9];
                if (todayCell) selectCell(todayCell);
            };
        }

        // Custom Dropdown Tháng / Năm
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

        // Hover / Focus vào nút Chú thích (Hoàng Đạo, Hắc Đạo, Ngày Lễ, Hôm Nay) -> Làm sáng các ngày tương ứng
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

    // 6. Khởi tạo Header, Sidebar & Footer Quick Actions
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header") || document.getElementById("site-header");
        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";

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

            themeBtns.forEach((btn) => {
                const isCurrent = btn.dataset.theme === activeTheme;
                btn.classList.toggle("is-active", isCurrent);
                btn.setAttribute("aria-pressed", String(isCurrent));

                btn.onclick = () => {
                    applyTheme(btn.dataset.theme);
                    btn.closest("details")?.removeAttribute("open");
                };
            });

            updateClock();
            if (clockTimer) clearInterval(clockTimer);
            clockTimer = setInterval(updateClock, 1000);
        }

        // Đồng bộ nút chọn nhanh bản mệnh và nút Lên đầu trang dưới Footer
        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.classList.toggle("is-active", dot.dataset.quickTheme === activeTheme);
            dot.onclick = () => applyTheme(dot.dataset.quickTheme);
        });

        const scrollTopBtn = document.querySelector('[data-footer-action="scroll-top"]');
        if (scrollTopBtn) {
            scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
        }

        initMonthCalendar();
    };

    // 7. Sự kiện toàn cục
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
