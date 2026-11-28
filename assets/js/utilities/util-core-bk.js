// assets/js/utilities/util-core.js
// Lõi hệ thống Utilities: Cấu hình tập trung ảnh thẻ 800x1200 (.png -> .webp), Helpers, Web Audio,
// Singleton Modal, Bento Date Picker chuẩn a11y, Dual-Navbar đồng bộ URL #hash & Registry cô lập lỗi
(() => {
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    // Cấu hình tập trung cho 3 bộ thẻ bài 800x1200 (Sau này chuyển sang WebP chỉ cần đổi "png" -> "webp" tại đây)
    const CARD_IMG_EXT = "png";
    const CARD_IMG_WIDTH = 800;
    const CARD_IMG_HEIGHT = 1200;
    const TAROT_IMG_DIR = "./assets/images/tarot";
    const TAROT_IMG_EXT = CARD_IMG_EXT;
    const ICHING_IMG_DIR = "./assets/images/iching";
    const NUMEROLOGY_IMG_DIR = "./assets/images/numerology";
    const ICHING_ICON_DIR = "./assets/icons/iching";
    const HOROSCOPE_ICON_DIR = "./assets/icons/horoscope";

    const SUB_NAV_MAP = {
        clock: [
            { id: "stopwatch", label: "Đồng hồ bấm giờ" },
            { id: "timer", label: "Đồng hồ đếm ngược" },
            { id: "alarm", label: "Đồng hồ báo thức" },
        ],
        converter: [],
        solarterm: [],
        divination: [
            { id: "iching", label: "Rút Quẻ Kinh Dịch" },
            { id: "tarot", label: "Rút Bài Tarot" },
        ],
        history: [],
        horoscope: [],
        datediff: [
            { id: "diff", label: "Đếm số ngày" },
            { id: "add", label: "+ Cộng thêm ngày" },
            { id: "sub", label: "− Trừ ngày" },
        ],
        numerology: [
            { id: "num-personal", label: "Con Số Chủ Đạo & Biểu Đồ 3x3" },
            { id: "num-calendar", label: "Tính Con Số Năng Lượng Của Ngày" },
        ],
        biorhythm: [],
        fengshui: [
            { id: "fs-all", label: "Tất cả Từ điển" },
            { id: "fs-napam", label: "30 Nạp Âm" },
            { id: "fs-lucdieu", label: "Lục Diệu & Xuất Hành" },
            { id: "fs-bagua", label: "12 Trực & Bát Quái" },
        ],
    };

    const pad = (n) => String(n).padStart(2, "0");

    const escapeHtml = (str) =>
        String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    const setAttr = (id, attr, val) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, val);
    };

    const toSlug = (str) =>
        String(str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    const resolveCardImageUrl = (basePath, ext = CARD_IMG_EXT) => {
        if (!basePath) return "";
        const normalized = String(basePath).trim().startsWith("/")
            ? `.${String(basePath).trim()}`
            : String(basePath).trim();
        if (/\.(png|webp|jpe?g|svg)$/i.test(normalized)) return normalized;
        return `${normalized}.${ext}`;
    };

    const buildBentoTooltipHtml = (title, desc, tagLabel) => `
        <span class="bento-tooltip" role="tooltip">
            <strong class="bento-tooltip__title">✦ ${title}</strong>
            <span class="bento-tooltip__desc">${desc}</span>
            <span class="bento-tooltip__tag">${tagLabel} &#8594;</span>
        </span>
    `;

    const fetchJsonSafe = async (url, fallback) => {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.warn(`[UtilHub] Không thể nạp ${url} (HTTP ${res.status}), dùng dữ liệu dự phòng.`);
                return fallback;
            }
            const data = await res.json();
            return Array.isArray(data) && data.length ? data : fallback;
        } catch (err) {
            console.warn(`[UtilHub] Lỗi đọc/parse JSON tại ${url}:`, err.message);
            return fallback;
        }
    };

    const runSafe = (label, fn, ...args) => {
        try {
            return fn(...args);
        } catch (err) {
            console.error(`[UtilHub][${label}] Lỗi thực thi module:`, err);
            return undefined;
        }
    };

    // ==================== 1. HỆ THỐNG ÂM THANH (WEB AUDIO API + UPLOAD NHẠC TỪ MÁY) ====================
    let activeAudioPlayer = null;

    const stopCurrentAudio = () => {
        if (activeAudioPlayer) {
            activeAudioPlayer.pause();
            activeAudioPlayer.currentTime = 0;
            activeAudioPlayer = null;
        }
    };

    const playSynthesizedBell = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
                gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.14);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.48);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.14);
                osc.stop(ctx.currentTime + idx * 0.14 + 0.48);
            });
        } catch (e) {
            // Bỏ qua nếu trình duyệt chặn tự động phát
        }
    };

    const playSoundEffect = (customUrl = "") => {
        stopCurrentAudio();
        if (customUrl) {
            try {
                activeAudioPlayer = new Audio(customUrl);
                activeAudioPlayer.play().catch(() => playSynthesizedBell());
                return;
            } catch (e) {
                playSynthesizedBell();
                return;
            }
        }
        playSynthesizedBell();
    };

    // ==================== 2. SINGLETON MODAL DÙNG CHUNG (#util-detail-modal) ====================
    let modalSlideUrls = [];
    let modalSlideIdx = 0;
    let lastFocusedBeforeModal = null;

    const closeUtilModal = () => {
        const modal = document.getElementById("util-detail-modal");
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
        const mediaStage = document.getElementById("util-modal-media-stage");
        if (mediaStage) {
            mediaStage.innerHTML = "";
            mediaStage.hidden = true;
        }
        if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
            lastFocusedBeforeModal.focus();
            lastFocusedBeforeModal = null;
        }
    };

    const openUtilModal = ({
        category = "Tiện Ích Vạn Niên",
        title = "",
        visualHtml = "",
        isFilteredVisual = false,
        pills = [],
        box1Title = "Ý nghĩa & Nội dung chi tiết",
        desc = "",
        box2Title = "Lời khuyên ứng dụng & Ghi chú",
        advice = "",
        actionHref = "./day.html",
        actionLabel = "Xem thêm trên Lịch Ngày",
        actionTarget = "_self",
        mediaSlides = [],
        videoUrl = "",
    }) => {
        const modal = document.getElementById("util-detail-modal");
        if (!modal) return;

        lastFocusedBeforeModal = document.activeElement;

        setText("util-modal-category", category);
        setText("util-modal-title", title);
        setText("util-modal-box1-title", box1Title);
        setText("util-modal-desc", desc);
        setText("util-modal-box2-title", box2Title);
        setText("util-modal-advice", advice);
        setText("util-modal-action-label", actionLabel);

        const actionLink = document.getElementById("util-modal-action-link");
        if (actionLink) {
            actionLink.setAttribute("href", actionHref);
            actionLink.setAttribute("target", actionTarget);
            if (actionTarget === "_blank") actionLink.setAttribute("rel", "noopener noreferrer");
            else actionLink.removeAttribute("rel");
        }

        const visualEl = document.getElementById("util-modal-visual");
        if (visualEl) {
            visualEl.classList.toggle("is-zodiac-filtered", Boolean(isFilteredVisual));
            visualEl.innerHTML = visualHtml;
        }

        const pillsEl = document.getElementById("util-modal-pills");
        if (pillsEl) {
            pillsEl.innerHTML = pills
                .map(
                    (p, i) =>
                        `<span class="day-term-modal__pill ${i === 0 ? "day-term-modal__pill--highlight" : ""}">${p}</span>`,
                )
                .join("");
        }

        // Khung Smart Media (Video hoặc Slideshow Ảnh cho Ngày Này Năm Xưa)
        const mediaStage = document.getElementById("util-modal-media-stage");
        if (mediaStage) {
            if (videoUrl) {
                mediaStage.hidden = false;
                mediaStage.innerHTML = `<video src="${videoUrl}" controls autoplay muted playsinline></video>`;
            } else if (mediaSlides && mediaSlides.length > 0) {
                modalSlideUrls = mediaSlides;
                modalSlideIdx = 0;
                mediaStage.hidden = false;
                const renderSlide = () => {
                    mediaStage.innerHTML = `
                        <img src="${modalSlideUrls[modalSlideIdx]}" alt="${escapeHtml(title)}" onerror="this.src='${DEFAULT_COVER_IMG}'" />
                        ${
                            modalSlideUrls.length > 1
                                ? `
                            <div class="util-modal-media__controls">
                                <button type="button" class="util-modal-media__slide-btn" id="util-slide-prev">&#10094; Ảnh trước</button>
                                <span class="util-modal-media__slide-btn">${modalSlideIdx + 1} / ${modalSlideUrls.length}</span>
                                <button type="button" class="util-modal-media__slide-btn" id="util-slide-next">Ảnh tiếp &#10095;</button>
                            </div>
                        `
                                : ""
                        }
                    `;
                    document.getElementById("util-slide-prev")?.addEventListener("click", () => {
                        modalSlideIdx = (modalSlideIdx - 1 + modalSlideUrls.length) % modalSlideUrls.length;
                        renderSlide();
                    });
                    document.getElementById("util-slide-next")?.addEventListener("click", () => {
                        modalSlideIdx = (modalSlideIdx + 1) % modalSlideUrls.length;
                        renderSlide();
                    });
                };
                renderSlide();
            } else {
                mediaStage.hidden = true;
                mediaStage.innerHTML = "";
            }
        }

        modal.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("util-modal-close")?.focus();
    };

    // ==================== 3. ĐỒNG BỘ ARIA-EXPANDED & BENTO DATE PICKER ====================
    const syncDetailsAriaExpanded = (scopeEl) => {
        if (!scopeEl) return;
        scopeEl.querySelectorAll("details.bazi-picker").forEach((dd) => {
            if (dd.dataset.ariaSynced === "true") return;
            dd.dataset.ariaSynced = "true";

            const summary = dd.querySelector("summary");
            if (summary) summary.setAttribute("aria-expanded", String(dd.open));

            dd.addEventListener("toggle", () => {
                summary?.setAttribute("aria-expanded", String(dd.open));
                if (dd.open) {
                    document.querySelectorAll("details.bazi-picker[open]").forEach((other) => {
                        if (other !== dd) other.removeAttribute("open");
                    });
                }
            });
        });
    };

    const createBentoDatePicker = (containerId, initialDate, onChangeCallback) => {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const state = {
            day: initialDate.day || 15,
            month: initialDate.month || 11,
            year: initialDate.year || 2026,
            yearStart: Math.floor((initialDate.year || 2026) / 12) * 12 - 4,
        };

        const dayListId = `${containerId}-day-list`;
        const monthListId = `${containerId}-month-list`;
        const yearListId = `${containerId}-year-list`;

        const render = () => {
            const maxDays = new Date(state.year, state.month, 0).getDate();
            if (state.day > maxDays) state.day = maxDays;

            let daysHtml = "";
            for (let d = 1; d <= maxDays; d++) {
                const isSel = d === state.day;
                daysHtml += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-bp-day="${d}">${pad(d)}</button></li>`;
            }

            let monthsHtml = "";
            for (let m = 1; m <= 12; m++) {
                const isSel = m === state.month;
                monthsHtml += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-bp-month="${m}">Tháng ${pad(m)}</button></li>`;
            }

            let yearsHtml = "";
            for (let y = state.yearStart; y < state.yearStart + 12; y++) {
                const isSel = y === state.year;
                yearsHtml += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-bp-year="${y}">${y}</button></li>`;
            }

            container.innerHTML = `
                <details class="bazi-picker js-cal-dropdown">
                    <summary
                        class="bazi-picker__summary"
                        aria-label="Chọn ngày, hiện tại Ngày ${pad(state.day)}"
                        aria-expanded="false"
                        aria-controls="${dayListId}"
                    >
                        <span class="bazi-picker__summary-text">Ngày ${pad(state.day)}</span>
                        <img src="./assets/icons/arrow-down.svg" alt="" aria-hidden="true" class="bazi-picker__arrow icon" />
                    </summary>
                    <div class="bazi-picker__popover bazi-picker__popover--days">
                        <div class="bazi-picker__popover-head">Chọn Ngày</div>
                        <ul class="bazi-picker__grid bazi-picker__grid--days" id="${dayListId}" role="listbox" aria-label="Danh sách ngày">${daysHtml}</ul>
                    </div>
                </details>

                <details class="bazi-picker js-cal-dropdown">
                    <summary
                        class="bazi-picker__summary"
                        aria-label="Chọn tháng, hiện tại Tháng ${pad(state.month)}"
                        aria-expanded="false"
                        aria-controls="${monthListId}"
                    >
                        <span class="bazi-picker__summary-text">Tháng ${pad(state.month)}</span>
                        <img src="./assets/icons/arrow-down.svg" alt="" aria-hidden="true" class="bazi-picker__arrow icon" />
                    </summary>
                    <div class="bazi-picker__popover bazi-picker__popover--months">
                        <div class="bazi-picker__popover-head">Chọn Tháng</div>
                        <ul class="bazi-picker__grid bazi-picker__grid--months" id="${monthListId}" role="listbox" aria-label="Danh sách tháng">${monthsHtml}</ul>
                    </div>
                </details>

                <details class="bazi-picker js-cal-dropdown">
                    <summary
                        class="bazi-picker__summary"
                        aria-label="Chọn năm, hiện tại Năm ${state.year}"
                        aria-expanded="false"
                        aria-controls="${yearListId}"
                    >
                        <span class="bazi-picker__summary-text">Năm ${state.year}</span>
                        <img src="./assets/icons/arrow-down.svg" alt="" aria-hidden="true" class="bazi-picker__arrow icon" />
                    </summary>
                    <div class="bazi-picker__popover bazi-picker__popover--years">
                        <div class="bazi-picker__year-nav">
                            <button type="button" class="bazi-picker__year-step" data-bp-yrange="-12" aria-label="Lùi 12 năm">&#10094;</button>
                            <span class="bazi-picker__year-range">${state.yearStart} - ${state.yearStart + 11}</span>
                            <button type="button" class="bazi-picker__year-step" data-bp-yrange="12" aria-label="Tiến 12 năm">&#10095;</button>
                        </div>
                        <ul class="bazi-picker__grid bazi-picker__grid--years" id="${yearListId}" role="listbox" aria-label="Danh sách năm">${yearsHtml}</ul>
                    </div>
                </details>
            `;

            syncDetailsAriaExpanded(container);
        };

        container.addEventListener("click", (e) => {
            const dBtn = e.target.closest("[data-bp-day]");
            const mBtn = e.target.closest("[data-bp-month]");
            const yBtn = e.target.closest("[data-bp-year]");
            const rBtn = e.target.closest("[data-bp-yrange]");

            if (rBtn) {
                e.stopPropagation();
                state.yearStart += Number(rBtn.dataset.bpYrange);
                render();
                const yearPicker = container.querySelectorAll(".bazi-picker")[2];
                if (yearPicker) {
                    yearPicker.setAttribute("open", "");
                    yearPicker.querySelector("summary")?.setAttribute("aria-expanded", "true");
                }
                return;
            }

            if (dBtn) state.day = Number(dBtn.dataset.bpDay);
            else if (mBtn) state.month = Number(mBtn.dataset.bpMonth);
            else if (yBtn) state.year = Number(yBtn.dataset.bpYear);
            else return;

            e.stopPropagation();
            render();
            if (typeof onChangeCallback === "function") onChangeCallback({ ...state });
        });

        render();
        return {
            getState: () => ({ ...state }),
            setState: (next) => {
                if (next.day) state.day = next.day;
                if (next.month) state.month = next.month;
                if (next.year) {
                    state.year = next.year;
                    state.yearStart = Math.floor(next.year / 12) * 12 - 4;
                }
                render();
            },
        };
    };

    // ==================== 4. ĐIỀU HƯỚNG DUAL-NAVBAR 2 TẦNG & ĐỒNG BỘ URL HASH (FIX F5) ====================
    let isCoreBooted = false;
    let activeCat = "clock";
    let activeSub = "stopwatch";
    let currentRouteState = { cat: "clock", sub: "stopwatch", highlight: "" };

    const moduleInitCallbacks = [];
    const routeChangeListeners = [];
    const modalClickHandlers = [];

    const toggleMobileUtilMenu = (forceClose = false) => {
        const nav = document.getElementById("util-primary-nav");
        const burger = document.getElementById("util-burger-btn");
        const backdrop = document.getElementById("util-mobile-backdrop");
        if (!nav || !burger || !backdrop) return;

        const nextState = forceClose ? false : !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", nextState);
        burger.classList.toggle("is-active", nextState);
        backdrop.classList.toggle("is-active", nextState);
        burger.setAttribute("aria-expanded", String(nextState));
        document.body.style.overflow = nextState ? "hidden" : "";
    };

    const bindDragToScrollNav = () => {
        const slider = document.getElementById("util-primary-nav-list");
        const prevBtn = document.getElementById("util-nav-prev");
        const nextBtn = document.getElementById("util-nav-next");
        if (!slider) return;

        let isDown = false;
        let isDragged = false;
        let startX = 0;
        let scrollLeft = 0;

        slider.addEventListener("mousedown", (e) => {
            if (e.button !== 0) return;
            isDown = true;
            isDragged = false;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        const stopDrag = () => {
            isDown = false;
            setTimeout(() => slider.classList.remove("is-dragging"), 40);
        };

        slider.addEventListener("mouseleave", stopDrag);
        slider.addEventListener("mouseup", stopDrag);

        slider.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.6;
            if (Math.abs(walk) > 6) {
                isDragged = true;
                slider.classList.add("is-dragging");
                e.preventDefault();
                slider.scrollLeft = scrollLeft - walk;
            }
        });

        slider.addEventListener(
            "click",
            (e) => {
                if (isDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    isDragged = false;
                }
            },
            true,
        );

        prevBtn?.addEventListener("click", () => slider.scrollBy({ left: -260, behavior: "smooth" }));
        nextBtn?.addEventListener("click", () => slider.scrollBy({ left: 260, behavior: "smooth" }));
    };

    const switchCategoryAndSub = (catKey, subKey = "", { syncUrl = true, replace = false, highlight = "" } = {}) => {
        activeCat = SUB_NAV_MAP[catKey] ? catKey : "clock";
        const subItems = SUB_NAV_MAP[activeCat] || [];
        const hasValidSub = subItems.some((item) => item.id === subKey);
        activeSub = hasValidSub ? subKey : (subItems[0]?.id ?? "");
        currentRouteState = { cat: activeCat, sub: activeSub, highlight };

        const mainEl = document.getElementById("main");
        if (mainEl) {
            mainEl.dataset.activeCat = activeCat;
            mainEl.dataset.activeSub = activeSub;
        }

        // Ghi trạng thái Tab/Subtab lên URL Hash (#cat/sub hoặc #cat) để F5 giữ đúng vị trí đang xem
        if (syncUrl) {
            const nextHash = activeSub ? `#${activeCat}/${activeSub}` : `#${activeCat}`;
            if (window.location.hash !== nextHash) {
                const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
                if (replace) window.history.replaceState({ cat: activeCat, sub: activeSub }, "", nextUrl);
                else window.history.pushState({ cat: activeCat, sub: activeSub }, "", nextUrl);
            }
        }

        document.querySelectorAll("[data-util-cat]").forEach((link) => {
            const isMatch = link.dataset.utilCat === activeCat;
            link.classList.toggle("is-active", isMatch);
            if (isMatch) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });

        const subBar = document.getElementById("util-subnav-bar");
        const subList = document.getElementById("util-subnav-list");
        if (subBar && subList) {
            if (!subItems.length) {
                subBar.hidden = true;
            } else {
                subBar.hidden = false;
                subList.innerHTML = subItems
                    .map(
                        (item) => `
                            <li class="util-sub-nav__item">
                                <a
                                    href="#${activeCat}/${item.id}"
                                    class="util-sub-nav__link ${item.id === activeSub ? "is-active" : ""}"
                                    ${item.id === activeSub ? 'aria-current="page"' : ""}
                                    data-util-sub="${item.id}"
                                >
                                    ${item.label}
                                </a>
                            </li>
                        `,
                    )
                    .join("");
            }
        }

        document.querySelectorAll(".util-panel").forEach((panel) => {
            panel.hidden = panel.dataset.panelCat !== activeCat;
        });

        const currentPanel = document.querySelector(`.util-panel[data-panel-cat="${activeCat}"]`);
        if (currentPanel && activeCat !== "datediff" && activeCat !== "fengshui") {
            currentPanel.querySelectorAll(".util-subpanel").forEach((sp) => {
                sp.hidden = sp.dataset.subpanel !== activeSub;
            });
        }

        routeChangeListeners.forEach((fn, idx) => runSafe(`routeListener#${idx}`, fn, currentRouteState));
        toggleMobileUtilMenu(true);
    };

    const resolveRouteFromUrl = () => {
        // 1. Ưu tiên đọc URL Hash dạng #cat/sub hoặc #cat (Giữ nguyên trạng thái khi bấm F5 / Back / Forward)
        const rawHash = window.location.hash.replace(/^#/, "").trim();
        if (rawHash) {
            if (rawHash === "ic-catalog-section") {
                return { cat: "divination", sub: "iching", highlight: "" };
            }
            if (rawHash === "tr-catalog-section") {
                return { cat: "divination", sub: "tarot", highlight: "" };
            }
            const [hashCat, hashSub = ""] = rawHash.split("/");
            if (SUB_NAV_MAP[hashCat]) {
                return { cat: hashCat, sub: hashSub, highlight: "" };
            }
            // Hỗ trợ hash rút gọn chỉ ghi tên subtab (vd: #tarot, #iching, #alarm, #add)
            for (const [catKey, subs] of Object.entries(SUB_NAV_MAP)) {
                if (subs.some((s) => s.id === hashCat)) {
                    return { cat: catKey, sub: hashCat, highlight: "" };
                }
            }
        }

        // 2. Fallback đọc Query Deep-Link (?tab=, ?napam=, ?lucdieu=, ?bagua=, ?term=) từ day.html / footer.html
        const params = new URLSearchParams(window.location.search);
        const napamParam = params.get("napam");
        const lucdieuParam = params.get("lucdieu") || params.get("direction");
        const baguaParam = params.get("bagua");
        const termParam = params.get("term");
        const tabParam = params.get("tab");

        if (napamParam) return { cat: "fengshui", sub: "fs-napam", highlight: napamParam };
        if (lucdieuParam) return { cat: "fengshui", sub: "fs-lucdieu", highlight: lucdieuParam };
        if (baguaParam) return { cat: "fengshui", sub: "fs-bagua", highlight: baguaParam };
        if (termParam || tabParam === "solarterm") return { cat: "solarterm", sub: "", highlight: "" };
        if (tabParam === "tarot") return { cat: "divination", sub: "tarot", highlight: "" };
        if (tabParam === "iching") return { cat: "divination", sub: "iching", highlight: "" };
        if (tabParam === "horoscope") return { cat: "horoscope", sub: "", highlight: "" };
        if (tabParam === "napam" || tabParam === "lucdieu" || tabParam === "truc-sao") {
            return { cat: "fengshui", sub: "fs-all", highlight: "" };
        }
        if (tabParam && SUB_NAV_MAP[tabParam]) return { cat: tabParam, sub: "", highlight: "" };

        return { cat: "clock", sub: "stopwatch", highlight: "" };
    };

    // ==================== 5. BOOTSTRAP TOÀN TRANG UTILITIES ====================
    const initUtilitiesCore = () => {
        const mainEl = document.getElementById("main");
        if (!mainEl || mainEl.dataset.utilBound === "true") return;
        mainEl.dataset.utilBound = "true";
        isCoreBooted = true;

        bindDragToScrollNav();
        syncDetailsAriaExpanded(mainEl);

        // Khởi chạy cô lập toàn bộ các module chức năng đã đăng ký
        moduleInitCallbacks.forEach((initFn, idx) => runSafe(`moduleInit#${idx}`, initFn, mainEl));

        // Đọc và áp dụng đúng Route từ URL ngay lúc tải trang (Fix F5)
        const initialRoute = resolveRouteFromUrl();
        switchCategoryAndSub(initialRoute.cat, initialRoute.sub, {
            syncUrl: true,
            replace: true,
            highlight: initialRoute.highlight,
        });

        // Đồng bộ nút Back / Forward & thay đổi hash thủ công
        const syncFromLocation = () => {
            const route = resolveRouteFromUrl();
            switchCategoryAndSub(route.cat, route.sub, { syncUrl: false, highlight: route.highlight });
        };
        window.addEventListener("popstate", syncFromLocation);
        window.addEventListener("hashchange", syncFromLocation);

        // Điều hướng Dual-Navbar & Mobile Hamburger
        document.getElementById("util-burger-btn")?.addEventListener("click", () => toggleMobileUtilMenu());
        document.getElementById("util-mobile-backdrop")?.addEventListener("click", () => toggleMobileUtilMenu(true));

        document.getElementById("util-primary-nav-list")?.addEventListener("click", (e) => {
            const link = e.target.closest("[data-util-cat]");
            if (!link) return;
            e.preventDefault();
            switchCategoryAndSub(link.dataset.utilCat);
        });

        document.getElementById("util-subnav-list")?.addEventListener("click", (e) => {
            const subLink = e.target.closest("[data-util-sub]");
            if (!subLink) return;
            e.preventDefault();
            switchCategoryAndSub(activeCat, subLink.dataset.utilSub);
        });

        document.getElementById("util-open-modal-btn")?.addEventListener("click", () => {
            if (typeof window.openConverterModal === "function") window.openConverterModal(true);
            else document.getElementById("widget-trigger-btn")?.click();
        });

        // Dùng chung cho tất cả nút Bento Stepper (− / +) & Modal trên toàn trang
        mainEl.addEventListener("click", (e) => {
            const stepBtn = e.target.closest("[data-step-target]");
            if (stepBtn) {
                const inputEl = document.getElementById(stepBtn.dataset.stepTarget);
                if (!inputEl) return;
                const step = Number(stepBtn.dataset.step || 1);
                const min = Number(inputEl.min || 0);
                const max = Number(inputEl.max || 9999);
                const nextVal = Math.min(max, Math.max(min, Number(inputEl.value || 0) + step));
                inputEl.value = String(nextVal);
                inputEl.dispatchEvent(new Event("input", { bubbles: true }));
                return;
            }

            // Ủy quyền click mở Singleton Modal tới từng module (có cô lập lỗi)
            for (let i = 0; i < modalClickHandlers.length; i++) {
                const handled = runSafe(`modalHandler#${i}`, modalClickHandlers[i], e);
                if (handled === true) return;
            }
        });

        // Hỗ trợ bàn phím (Enter / Space) cho mọi thẻ tương tác role="button" tabindex="0"
        mainEl.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const interactiveCard = e.target.closest(
                "#ic-catalog-grid [data-hex-num], [data-ic-modal='current'], [data-sign-key], [data-tarot-modal], [data-conv-card], [data-st-idx], [data-hi-idx], [data-num-modal], [data-bio-key], [data-fs-idx]",
            );
            if (!interactiveCard) return;
            e.preventDefault();
            interactiveCard.click();
        });

        document.getElementById("util-modal-close")?.addEventListener("click", closeUtilModal);
        document.getElementById("util-modal-cancel")?.addEventListener("click", closeUtilModal);
        document.getElementById("util-modal-backdrop")?.addEventListener("click", closeUtilModal);
        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("util-detail-modal");
            if (e.key === "Escape" && modal && !modal.hidden) closeUtilModal();
        });
    };

    // Xuất trục điều phối dùng chung
    window.UtilHub = {
        DEFAULT_COVER_IMG,
        CARD_IMG_EXT,
        CARD_IMG_WIDTH,
        CARD_IMG_HEIGHT,
        TAROT_IMG_DIR,
        TAROT_IMG_EXT,
        ICHING_IMG_DIR,
        NUMEROLOGY_IMG_DIR,
        ICHING_ICON_DIR,
        HOROSCOPE_ICON_DIR,
        pad,
        escapeHtml,
        setText,
        setHtml,
        setAttr,
        toSlug,
        resolveCardImageUrl,
        buildBentoTooltipHtml,
        fetchJsonSafe,
        playSoundEffect,
        stopCurrentAudio,
        openUtilModal,
        closeUtilModal,
        createBentoDatePicker,
        switchCategoryAndSub,
        registerModule: (fn) => {
            if (typeof fn !== "function") return;
            moduleInitCallbacks.push(fn);
            if (isCoreBooted) {
                const mainEl = document.getElementById("main");
                if (mainEl) runSafe("lateModuleInit", fn, mainEl);
            }
        },
        onRouteChange: (fn) => {
            if (typeof fn !== "function") return;
            routeChangeListeners.push(fn);
            if (isCoreBooted) {
                runSafe("lateRouteListener", fn, currentRouteState);
            }
        },
        registerModalHandler: (fn) => {
            if (typeof fn === "function") modalClickHandlers.push(fn);
        },
    };

    // Chỉ boot trên DOMContentLoaded (KHÔNG nghe template-loaded để tránh khóa cổng sớm trước khi 4 module con nạp xong)
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUtilitiesCore);
    } else {
        initUtilitiesCore();
    }
})();
