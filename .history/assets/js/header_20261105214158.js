// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let isGlobalBound = false;
    let clockTimer = null;
    let currentMonthNumber = 11;
    const monthApiCache = new Map();

    // Trạng thái lưu danh sách sự kiện của ngày đang chọn để chuyển đổi khi bấm 2 nút chờ
    let activeDayVnEvents = [];
    let activeDayIntlEvents = [];
    let currentVnEventIndex = 0;
    let currentIntlEventIndex = 0;

    const WEEKDAY_LABELS = [
        "THỨ HAI • MONDAY",
        "THỨ BA • TUESDAY",
        "THỨ TƯ • WEDNESDAY",
        "THỨ NĂM • THURSDAY",
        "THỨ SÁU • FRIDAY",
        "THỨ BẢY • SATURDAY",
        "CHỦ NHẬT • SUNDAY",
    ];

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

    const applyTheme = (selectedTheme) => {
        if (!selectedTheme) return;
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

        document.querySelectorAll(".header__theme-btn").forEach((btn) => {
            const isMatch = btn.dataset.theme === selectedTheme;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(isCurrentBoolean(isMatch)));
        });

        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.classList.toggle("is-active", dot.dataset.quickTheme === selectedTheme);
        });
    };

    const isCurrentBoolean = (val) => Boolean(val);

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

    // 4. Tải dữ liệu JSON theo tháng từ ./api/thang-${month}.json (có hỗ trợ fallback "./api/thang-0${month}.json")
    const fetchMonthHistoryData = async (monthNum) => {
        const m = Number(monthNum) || 11;
        if (monthApiCache.has(m)) {
            return monthApiCache.get(m);
        }

        const paddedMonth = String(m).padStart(2, "0");
        const candidatePaths = [`./api/thang-${m}.json`, `./api/thang-${paddedMonth}.json`];

        for (const path of candidatePaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    const normalized = Array.isArray(data) ? data : data?.data || data?.events || [];
                    monthApiCache.set(m, normalized);
                    return normalized;
                }
            } catch (err) {
                // Chuyển sang đường dẫn dự phòng tiếp theo nếu chưa tìm thấy
            }
        }

        monthApiCache.set(m, []);
        return [];
    };

    // 5. Chuẩn hóa đường dẫn sang trang detail.html từ image_slug và category_id
    // Ví dụ: "nguyen-thi-minh-khai-01-11-1910-28-08-1941" -> folder "./assets/images/figures/nguyen-thi-minh-khai/"
    const buildDetailUrlFromItem = (item, monthNum) => {
        if (!item) return "./detail.html";
        const rawSlug = item.image_slug || item.slug || "";
        // Cắt bỏ cụm ngày tháng (-dd-mm-yyyy...) ở đuôi để lấy tên folder gốc của nhân vật/sự kiện
        const cleanActorFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
        const catStr = String(item.category_id || item.loai || "").toLowerCase();
        const typeFolder = catStr.includes("event") || catStr.includes("su-kien") ? "events" : "figures";

        const params = new URLSearchParams({
            type: typeFolder,
            folder: cleanActorFolder,
            slug: rawSlug,
            month: String(monthNum),
        });
        return `./detail.html?${params.toString()}`;
    };

    // 6. Nạp ảnh bìa 16:9: Ưu tiên .jpg hiện tại -> Tự động thử .webp (khi bạn nâng cấp SEO) -> Ảnh mặc định
    const setCoverImageWithFallback = (imgEl, monthNum, imageSlug, altText) => {
        if (!imgEl) return;
        if (altText) imgEl.alt = altText;

        if (!imageSlug) {
            imgEl.src = DEFAULT_COVER_IMG;
            return;
        }

        const cleanSlug = imageSlug.replace(/\.(jpg|jpeg|png|webp)$/i, "");
        const basePath = `./assets/images/calendar-covers/thang-${monthNum}/${cleanSlug}`;

        imgEl.onerror = () => {
            imgEl.onerror = () => {
                imgEl.onerror = null;
                imgEl.src = DEFAULT_COVER_IMG;
            };
            imgEl.src = `${basePath}.webp`;
        };

        imgEl.src = `${basePath}.jpg`;
    };

    // 7. Đổ 1 đối tượng sự kiện/nhân vật từ JSON lên Khung ảnh 16:9 & Khối Quote Cột Trái
    const renderHistoryItemToBloc = (item, monthNum, solarDay) => {
        const imgEl = document.getElementById("detail-history-img");
        const mediaLinkEl = document.getElementById("detail-history-link");
        const captionLinkEl = document.getElementById("detail-history-caption");
        const captionTextEl = document.getElementById("detail-history-caption-text");
        const quoteTextEl =
            document.getElementById("detail-quote-text") || document.querySelector(".fengshui-quote__text");
        const quoteAuthorEl =
            document.getElementById("detail-quote-author") || document.querySelector(".fengshui-quote__author");

        if (!item) {
            // Dữ liệu hiển thị mặc định khi ngày đó chưa có trong file JSON
            if (imgEl) {
                imgEl.onerror = null;
                imgEl.src = DEFAULT_COVER_IMG;
            }
            if (captionTextEl) {
                captionTextEl.textContent = `Sự kiện & Nhân vật lịch sử ngày ${String(solarDay).padStart(2, "0")}/${String(monthNum).padStart(2, "0")}`;
            }
            if (mediaLinkEl) mediaLinkEl.href = `./detail.html?day=${solarDay}&month=${monthNum}`;
            if (captionLinkEl) captionLinkEl.href = `./detail.html?day=${solarDay}&month=${monthNum}`;
            if (quoteTextEl) {
                quoteTextEl.textContent = '"Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."';
            }
            if (quoteAuthorEl) {
                quoteAuthorEl.textContent = "- Chủ tịch Hồ Chí Minh -";
            }
            return;
        }

        const occasionText =
            item.hien_thi_nhan_dip ||
            item.ten ||
            `Sự kiện lịch sử ngày ${String(solarDay).padStart(2, "0")}/${String(monthNum).padStart(2, "0")}`;
        const detailHref = buildDetailUrlFromItem(item, monthNum);

        setCoverImageWithFallback(imgEl, monthNum, item.image_slug, occasionText);

        if (captionTextEl) captionTextEl.textContent = occasionText;
        if (mediaLinkEl) mediaLinkEl.href = detailHref;
        if (captionLinkEl) captionLinkEl.href = detailHref;

        if (quoteTextEl) {
            const rawQuote = (item.quote || item.danh_ngon || "").trim();
            quoteTextEl.textContent = rawQuote
                ? rawQuote.startsWith('"')
                    ? rawQuote
                    : `"${rawQuote}"`
                : `"${occasionText}"`;
        }

        if (quoteAuthorEl) {
            const authorName = item.ten || item.tac_gia || "Lịch sử Việt Nam";
            quoteAuthorEl.textContent = `- ${authorName} -`;
        }
    };

    // 8. Lọc sự kiện trong ngày và tự động Bật / Tắt (hidden) 2 nút "Sự kiện cùng ngày" & "Sự kiện quốc tế"
    const updateHistoryForSelectedDate = async (solarDay, monthNum) => {
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const sameDayLabel = document.getElementById("label-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");
        const intlLabel = document.getElementById("label-intl-events");

        const paddedDay = String(solarDay).padStart(2, "0");
        const paddedMonth = String(monthNum).padStart(2, "0");
        const targetDatePrefix = `${paddedDay}/${paddedMonth}`;

        const allMonthItems = await fetchMonthHistoryData(monthNum);

        // Lọc các sự kiện khớp với ngày đang chọn
        const matchedItems = allMonthItems.filter((entry) => {
            const displayDate = String(entry.ngay_hien_thi || entry.ngay_duong || entry.date || "").trim();
            if (displayDate.startsWith(targetDatePrefix) || displayDate === String(solarDay)) {
                return true;
            }
            if (Number(entry.day) === Number(solarDay)) {
                return true;
            }
            return false;
        });

        // Tách sự kiện trong nước và sự kiện quốc tế
        activeDayIntlEvents = matchedItems.filter((entry) => {
            const scope = String(entry.pham_vi || entry.scope || entry.category_id || "").toLowerCase();
            return Boolean(entry.is_international) || scope.includes("quoc-te") || scope.includes("international");
        });

        activeDayVnEvents = matchedItems.filter((entry) => !activeDayIntlEvents.includes(entry));
        currentVnEventIndex = 0;
        currentIntlEventIndex = 0;

        // Chế độ Tự động Hiện / Ẩn (Off) cho nút "Sự kiện cùng ngày" (Chỉ hiện khi có từ 2 sự kiện trở lên)
        if (sameDayBtn) {
            if (activeDayVnEvents.length > 1) {
                sameDayBtn.hidden = false;
                sameDayBtn.classList.add("is-active");
                if (sameDayLabel) {
                    sameDayLabel.textContent = `Sự kiện cùng ngày (${activeDayVnEvents.length})`;
                }
            } else {
                sameDayBtn.hidden = true;
                sameDayBtn.classList.remove("is-active");
            }
        }

        // Chế độ Tự động Hiện / Ẩn (Off) cho nút "Sự kiện quốc tế" (Chỉ hiện khi có sự kiện quốc tế)
        if (intlBtn) {
            if (activeDayIntlEvents.length > 0) {
                intlBtn.hidden = false;
                intlBtn.classList.remove("is-active");
                if (intlLabel) {
                    intlLabel.textContent = `Sự kiện quốc tế (${activeDayIntlEvents.length})`;
                }
            } else {
                intlBtn.hidden = true;
                intlBtn.classList.remove("is-active");
            }
        }

        const primaryItem = activeDayVnEvents[0] || activeDayIntlEvents[0] || null;
        renderHistoryItemToBloc(primaryItem, monthNum, solarDay);
    };

    // 9. Đồng bộ toàn bộ thông tin từ ô ngày được chọn sang Tờ Lịch Bloc (Cột Trái)
    const syncCellToBlocCard = (cell, index) => {
        const solarDayEl = document.getElementById("detail-solar-day");
        const lunarDayEl = document.getElementById("detail-lunar-day");
        const lunarMonthEl = document.getElementById("detail-lunar-month");
        const weekdayEl = document.getElementById("detail-weekday");
        const statusEl = document.getElementById("detail-day-status");
        const canchiDayEl = document.getElementById("detail-canchi-day");
        const canchiMonthEl = document.getElementById("detail-canchi-month");

        const solarDay = cell.dataset.solar || "3";

        if (solarDayEl) {
            solarDayEl.textContent = solarDay;
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

        if (weekdayEl && typeof index === "number") {
            weekdayEl.textContent = WEEKDAY_LABELS[index % 7];
        }

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

        if (canchiDayEl) {
            const zodiacImg = cell.querySelector(".month-cal__zodiac-img");
            const src = zodiacImg?.getAttribute("src") || "";
            const match = src.match(/\/([a-z-]+)\.svg$/i);
            const animalKey = match ? match[1] : null;
            const diaChi = animalKey && ZODIAC_TO_CHI[animalKey] ? ZODIAC_TO_CHI[animalKey] : "Tỵ";
            const canIndex = (((index - 8 + 7) % 10) + 10) % 10;
            canchiDayEl.textContent = `Ngày ${THIEN_CAN[canIndex]} ${diaChi}`;
        }

        // Xác định tháng thực tế của ô ngày (nếu là ô muted đầu/cuối bảng thì lùi/tiến 1 tháng)
        let targetMonth = currentMonthNumber;
        if (cell.classList.contains("month-cal__cell--muted")) {
            targetMonth =
                Number(solarDay) > 15
                    ? currentMonthNumber === 1
                        ? 12
                        : currentMonthNumber - 1
                    : currentMonthNumber === 12
                      ? 1
                      : currentMonthNumber + 1;
        }

        updateHistoryForSelectedDate(solarDay, targetMonth);
    };

    // nháp

    // 10. Khởi tạo Lịch Tháng & Sự kiện cho 2 nút mở rộng trên ảnh 16:9
    const initMonthCalendar = () => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid) return;

        const cells = Array.from(grid.querySelectorAll(".month-cal__cell"));
        const calDropdowns = document.querySelectorAll(".js-cal-dropdown");
        const legendPills = document.querySelectorAll(".month-cal__legend-pill");
        const todayBtn = document.getElementById("cal-today-btn");
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");

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

        if (todayBtn) {
            todayBtn.onclick = () => {
                const todayCell = grid.querySelector(".month-cal__cell--today") || cells[9];
                if (todayCell) selectCell(todayCell);
            };
        }

        // Bấm nút "Sự kiện cùng ngày" -> xoay vòng qua các sự kiện Việt Nam trong cùng ngày đó
        if (sameDayBtn) {
            sameDayBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayVnEvents.length) return;

                currentVnEventIndex = (currentVnEventIndex + 1) % activeDayVnEvents.length;
                sameDayBtn.classList.add("is-active");
                intlBtn?.classList.remove("is-active");

                const activeCell = grid.querySelector(".month-cal__cell--active");
                const solarDay = activeCell?.dataset.solar || "3";
                renderHistoryItemToBloc(activeDayVnEvents[currentVnEventIndex], currentMonthNumber, solarDay);
            };
        }

        // Bấm nút "Sự kiện quốc tế" -> hiển thị / xoay vòng sự kiện quốc tế cùng ngày
        if (intlBtn) {
            intlBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayIntlEvents.length) return;

                const nextItem = activeDayIntlEvents[currentIntlEventIndex];
                currentIntlEventIndex = (currentIntlEventIndex + 1) % activeDayIntlEvents.length;
                intlBtn.classList.add("is-active");
                sameDayBtn?.classList.remove("is-active");

                const activeCell = grid.querySelector(".month-cal__cell--active");
                const solarDay = activeCell?.dataset.solar || "3";
                renderHistoryItemToBloc(nextItem, currentMonthNumber, solarDay);
            };
        }

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
                    if (opt.dataset.month) {
                        currentMonthNumber = Number(opt.dataset.month) || 11;
                    }
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

        // Đồng bộ ngay cho ô đang Active lúc mới tải trang
        const initialActiveCell = grid.querySelector(".month-cal__cell--active") || cells[8];
        if (initialActiveCell) {
            syncCellToBlocCard(initialActiveCell, cells.indexOf(initialActiveCell));
        }
    };

    // 11. Khởi tạo Header, Sidebar & Footer
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

    // 12. Sự kiện toàn cục
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
