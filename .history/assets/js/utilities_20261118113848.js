// assets/js/utilities.js
// BẢN FULL 100% HOÀN CHỈNH (ĐỢT 2/2):
// Điều khiển Bento Dual-Navbar (Drag-to-Scroll + Mobile Drawer), Singleton Modal (#util-detail-modal),
// Custom Bento Date Pickers, Tải nhạc chuông từ thiết bị, Đồng xu 3D + Mouse Entropy, Tarot Xòe Quạt,
// Phân trang Ngày Này Năm Xưa, 12 Linh Vật Horoscope SVG, Tính Thời Gian, Thần Số Học, Nhịp Sinh Học & Từ Điển Cổ Học
(() => {
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";
    const pad = (n) => String(n).padStart(2, "0");

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

    const buildBentoTooltipHtml = (title, desc, tagLabel) => `
        <span class="bento-tooltip" role="tooltip">
            <strong class="bento-tooltip__title">✦ ${title}</strong>
            <span class="bento-tooltip__desc">${desc}</span>
            <span class="bento-tooltip__tag">${tagLabel} &#8594;</span>
        </span>
    `;

    // ==================== HỆ THỐNG ÂM THANH (WEB AUDIO API + UPLOAD NHẠC TỪ MÁY) ====================
    let customCountdownAudioUrl = "";
    let customAlarmAudioUrl = "";
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

    // ==================== HỆ THỐNG SINGLETON MODAL DÙNG CHUNG (#util-detail-modal) ====================
    let modalSlideUrls = [];
    let modalSlideIdx = 0;

    const closeUtilModal = () => {
        const modal = document.getElementById("util-detail-modal");
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
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

        setText("util-modal-category", category);
        setText("util-modal-title", title);
        setText("util-modal-box1-title", box1Title);
        setText("util-modal-desc", desc);
        setText("util-modal-box2-title", box2Title);
        setText("util-modal-advice", advice);
        setText("util-modal-action-label", actionLabel);
        setAttr("util-modal-action-link", "href", actionHref);
        setAttr("util-modal-action-link", "target", actionTarget);

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

        // Xử lý Khung Smart Media (Video hoặc Slideshow Ảnh cho Ngày Này Năm Xưa)
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
                        <img src="${modalSlideUrls[modalSlideIdx]}" alt="${title}" onerror="this.src='${DEFAULT_COVER_IMG}'" />
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
    };

    // ==================== COMPONENT TÁI SỬ DỤNG: CUSTOM BENTO DATE PICKER (NGÀY - THÁNG - NĂM) ====================
    const createBentoDatePicker = (containerId, initialDate, onChangeCallback) => {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const state = {
            day: initialDate.day || 15,
            month: initialDate.month || 11,
            year: initialDate.year || 2026,
            yearStart: Math.floor((initialDate.year || 2026) / 12) * 12 - 4,
        };

        const render = () => {
            const maxDays = new Date(state.year, state.month, 0).getDate();
            if (state.day > maxDays) state.day = maxDays;

            let daysHtml = "";
            for (let d = 1; d <= maxDays; d++) {
                daysHtml += `<li><button type="button" class="bazi-picker__option ${d === state.day ? "is-selected" : ""}" data-bp-day="${d}">${pad(d)}</button></li>`;
            }

            let monthsHtml = "";
            for (let m = 1; m <= 12; m++) {
                monthsHtml += `<li><button type="button" class="bazi-picker__option ${m === state.month ? "is-selected" : ""}" data-bp-month="${m}">Tháng ${pad(m)}</button></li>`;
            }

            let yearsHtml = "";
            for (let y = state.yearStart; y < state.yearStart + 12; y++) {
                yearsHtml += `<li><button type="button" class="bazi-picker__option ${y === state.year ? "is-selected" : ""}" data-bp-year="${y}">${y}</button></li>`;
            }

            container.innerHTML = `
                <details class="bazi-picker js-cal-dropdown">
                    <summary class="bazi-picker__summary">
                        <span class="bazi-picker__summary-text">Ngày ${pad(state.day)}</span>
                        <img src="./assets/icons/arrow-down.svg" alt="" aria-hidden="true" class="bazi-picker__arrow icon" />
                    </summary>
                    <div class="bazi-picker__popover bazi-picker__popover--days">
                        <div class="bazi-picker__popover-head">Chọn Ngày</div>
                        <ul class="bazi-picker__grid bazi-picker__grid--days">${daysHtml}</ul>
                    </div>
                </details>

                <details class="bazi-picker js-cal-dropdown">
                    <summary class="bazi-picker__summary">
                        <span class="bazi-picker__summary-text">Tháng ${pad(state.month)}</span>
                        <img src="./assets/icons/arrow-down.svg" alt="" aria-hidden="true" class="bazi-picker__arrow icon" />
                    </summary>
                    <div class="bazi-picker__popover bazi-picker__popover--months">
                        <div class="bazi-picker__popover-head">Chọn Tháng</div>
                        <ul class="bazi-picker__grid bazi-picker__grid--months">${monthsHtml}</ul>
                    </div>
                </details>

                <details class="bazi-picker js-cal-dropdown">
                    <summary class="bazi-picker__summary">
                        <span class="bazi-picker__summary-text">Năm ${state.year}</span>
                        <img src="./assets/icons/arrow-down.svg" alt="" aria-hidden="true" class="bazi-picker__arrow icon" />
                    </summary>
                    <div class="bazi-picker__popover bazi-picker__popover--years">
                        <div class="bazi-picker__year-nav">
                            <button type="button" class="bazi-picker__year-step" data-bp-yrange="-12">&#10094;</button>
                            <span class="bazi-picker__year-range">${state.yearStart} - ${state.yearStart + 11}</span>
                            <button type="button" class="bazi-picker__year-step" data-bp-yrange="12">&#10095;</button>
                        </div>
                        <ul class="bazi-picker__grid bazi-picker__grid--years">${yearsHtml}</ul>
                    </div>
                </details>
            `;

            const pickers = container.querySelectorAll(".bazi-picker");
            pickers.forEach((cur) => {
                cur.ontoggle = () => {
                    if (cur.open) {
                        document.querySelectorAll(".bazi-picker[open]").forEach((other) => {
                            if (other !== cur) other.removeAttribute("open");
                        });
                    }
                };
            });
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
                if (yearPicker) yearPicker.setAttribute("open", "");
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

    // ==================== CẤU HÌNH SUB-NAVBAR 2 TẦNG ====================
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

    let activeCat = "clock";
    let activeSub = "stopwatch";
    let dateCalcMode = "add";
    let fsFilterKey = "fs-all";

    // ==================== MỤC 1: BỘ 3 ĐỒNG HỒ (BẤM GIỜ, ĐẾM NGƯỢC, BÁO THỨC) ====================
    let swTimer = null;
    let swStartTime = 0;
    let swElapsedMs = 0;
    let swRunning = false;
    let swLaps = [];

    let cdTimer = null;
    let cdRemainingSec = 300;
    let cdRunning = false;
    let cdHistory = [];

    let alarmsList = [
        {
            id: 1,
            hour: 6,
            minute: 30,
            title: "Dậy học bài & Tập thể dục",
            repeat: "Hằng ngày",
            enabled: true,
        },
    ];

    const formatStopwatch = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const centi = Math.floor((ms % 1000) / 10);
        return { main: `${pad(h)}:${pad(m)}:${pad(s)}`, ms: `.${pad(centi)}` };
    };

    const renderStopwatchLaps = () => {
        const body = document.getElementById("sw-laps-body");
        if (!body) return;
        if (!swLaps.length) {
            body.innerHTML = `<p class="util-data-table__empty">Chưa có dữ liệu bấm giờ. Hãy nhấn <strong>Bắt đầu</strong> và thực hiện <strong>Ngắt (Vòng)</strong> để lưu lại.</p>`;
            return;
        }
        body.innerHTML = swLaps
            .map(
                (l) => `
                    <div class="util-data-table__row util-data-table__row--3cols" role="row">
                        <span>Vòng #${pad(l.idx)}</span>
                        <span>+${l.lapStr}</span>
                        <strong>${l.totalStr}</strong>
                    </div>
                `,
            )
            .join("");
    };

    const renderAlarmsList = () => {
        const container = document.getElementById("al-list-container");
        if (!container) return;
        if (!alarmsList.length) {
            container.innerHTML = `<p class="util-data-table__empty">Chưa có báo thức nào. Thêm báo thức của bạn ở trên.</p>`;
            return;
        }
        container.innerHTML = alarmsList
            .map(
                (a) => `
                    <article class="util-alarm-item ${a.enabled ? "" : "is-disabled"}" data-alarm-id="${a.id}">
                        <div>
                            <strong class="util-alarm-item__time">${pad(a.hour)}:${pad(a.minute)}</strong>
                            <span class="util-alarm-item__title">${a.title}</span>
                            <small class="util-alarm-item__meta">🔁 ${a.repeat || "Hằng ngày"} • ${a.enabled ? "Đang bật" : "Đã tắt"}</small>
                        </div>
                        <div class="util-alarm-item__right">
                            <button
                                type="button"
                                class="util-alarm-item__toggle ${a.enabled ? "is-on" : ""}"
                                data-toggle-alarm="${a.id}"
                                aria-pressed="${a.enabled}"
                                title="Bật / Tắt báo thức này"
                            ></button>
                            <button
                                type="button"
                                class="util-alarm-item__del"
                                data-del-alarm="${a.id}"
                                aria-label="Xóa báo thức"
                                title="Xóa báo thức"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    </article>
                `,
            )
            .join("");
    };

    // ==================== MỤC 2: ĐỔI NGÀY ÂM ⇄ DƯƠNG TẠI CHỖ (CUSTOM BENTO PICKERS + 6 BENTO CARDS) ====================
    let ucDay = 15;
    let ucMonth = 11;
    let ucYear = 2026;
    let ucYearStart = 2020;
    let ucMode = "solar2lunar";
    let lastConvertedContext = null;

    const renderUcPickers = () => {
        const maxDays = ucMode === "solar2lunar" ? new Date(ucYear, ucMonth, 0).getDate() : 30;
        if (ucDay > maxDays) ucDay = maxDays;

        setText("uc-day-text", `Ngày ${pad(ucDay)}`);
        setText("uc-month-text", `Tháng ${pad(ucMonth)}`);
        setText("uc-year-text", `Năm ${ucYear}`);
        setText("uc-year-range-label", `${ucYearStart} - ${ucYearStart + 11}`);
        setText("uc-mode-text", ucMode === "solar2lunar" ? "Dương lịch → Âm lịch" : "Âm lịch → Dương lịch");

        const dayList = document.getElementById("uc-day-list");
        if (dayList) {
            let html = "";
            for (let d = 1; d <= maxDays; d++) {
                html += `<li><button type="button" class="bazi-picker__option ${d === ucDay ? "is-selected" : ""}" data-uc-day="${d}">${pad(d)}</button></li>`;
            }
            dayList.innerHTML = html;
        }

        const monthList = document.getElementById("uc-month-list");
        if (monthList) {
            let html = "";
            for (let m = 1; m <= 12; m++) {
                html += `<li><button type="button" class="bazi-picker__option ${m === ucMonth ? "is-selected" : ""}" data-uc-month="${m}">Tháng ${pad(m)}</button></li>`;
            }
            monthList.innerHTML = html;
        }

        const yearList = document.getElementById("uc-year-list");
        if (yearList) {
            let html = "";
            for (let y = ucYearStart; y < ucYearStart + 12; y++) {
                html += `<li><button type="button" class="bazi-picker__option ${y === ucYear ? "is-selected" : ""}" data-uc-year="${y}">${y}</button></li>`;
            }
            yearList.innerHTML = html;
        }
    };

    const renderInlineConverter = () => {
        const grid = document.getElementById("uc-result-grid");
        if (!grid || !window.LunarEngine) return;

        let sDay = ucDay;
        let sMonth = ucMonth;
        let sYear = ucYear;

        if (ucMode === "lunar2solar") {
            const conv = window.LunarEngine.convertLunar2Solar(ucDay, ucMonth, ucYear, 0);
            if (conv && conv.sDay > 0) {
                sDay = conv.sDay;
                sMonth = conv.sMonth;
                sYear = conv.sYear;
            }
        }

        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);
        const isoDate = `${sYear}-${pad(sMonth)}-${pad(sDay)}`;
        lastConvertedContext = { info, sDay, sMonth, sYear, isoDate };

        const cards = [
            {
                key: "solar",
                badge: "Dương Lịch",
                icon: "./assets/icons/calendar.svg",
                filtered: false,
                title: `${pad(sDay)}/${pad(sMonth)}/${sYear}`,
                sub: info.bilingualWeekday,
                desc: `Tiết khí: ${info.solarTerm} • Trực: ${info.trucObj.name} (${info.trucObj.short}).`,
                foot: "Mở tờ lịch ngày này",
            },
            {
                key: "lunar",
                badge: `Âm Lịch • ${info.isFullMonth ? "Tháng Đủ" : "Tháng Thiếu"}`,
                icon: `./assets/icons/zodiac/${info.yearZodiacFile}.svg`,
                filtered: true,
                title: `${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear}`,
                sub: `Năm ${info.yearCanChi} (${info.yearNapAm})`,
                desc: `Tháng ${info.monthCanChi} • Ngày ${info.dayCanChi} • Giờ đầu ngày: ${info.ratHourCanChi}.`,
                foot: "Xem giải nghĩa Âm lịch",
            },
            {
                key: "canchi",
                badge: info.fortuneStatus === "good" ? "Ngày Hoàng Đạo" : "Can Chi & Xung Hợp",
                icon: `./assets/icons/zodiac/${info.zodiacFile}.svg`,
                filtered: true,
                title: `Ngày ${info.dayCanChi}`,
                sub: `Tuổi hợp: ${info.ageHarmony.good}`,
                desc: `Tuổi xung cần lưu ý: ${info.ageHarmony.bad}. ${info.trucObj.desc}`,
                foot: "Xem xung hợp 12 Con Giáp",
            },
            {
                key: "napam",
                badge: info.elementInfo.label,
                icon: `./assets/icons/${info.elementInfo.icon}`,
                filtered: false,
                title: info.dayNapAm,
                sub: `Nạp âm tháng: ${info.monthNapAm}`,
                desc: `Năng lượng Ngũ Hành chủ đạo của ngày ${info.dayCanChi} thuộc ${info.elementInfo.label}.`,
                foot: "Xem chi tiết Nạp Âm",
            },
            {
                key: "direction",
                badge: "Hướng Xuất Hành",
                icon: "./assets/icons/fengshui/tai-than.svg",
                filtered: true,
                title: `Tài Thần: ${info.directions.tai}`,
                sub: `Hỷ Thần: ${info.directions.hy}`,
                desc: "Xuất hành theo hướng Tài Thần hoặc Hỷ Thần giúp công việc, giao thương và nhân duyên hanh thông.",
                foot: "Xem hướng tốt trong ngày",
            },
            {
                key: "hours",
                badge: "6 Giờ Hoàng Đạo",
                icon: "./assets/icons/fengshui/hoang-dao.svg",
                filtered: true,
                title: "Khung Giờ Tốt",
                sub: "Chọn giờ lành khởi sự",
                desc: info.goodHoursStr,
                foot: "Xem bảng 12 canh giờ",
            },
        ];

        grid.innerHTML = `
            <div class="util-catalog-grid">
                ${cards
                    .map(
                        (c, idx) => `
                            <article
                                class="util-bento-item ${idx < 2 ? "is-current-highlight" : ""} has-bento-tooltip"
                                data-conv-card="${c.key}"
                            >
                                <span class="util-bento-item__bg-wrap" aria-hidden="true">
                                    <img src="${c.icon}" alt="" class="util-bento-item__watermark" />
                                </span>
                                <div class="util-bento-item__top">
                                    <span class="util-bento-item__icon-box ${c.filtered ? "util-bento-item__icon-box--filtered" : ""}">
                                        <img src="${c.icon}" alt="" aria-hidden="true" />
                                    </span>
                                    <span class="util-bento-item__badge">${c.badge}</span>
                                </div>
                                <div class="util-bento-item__body">
                                    <strong class="util-bento-item__title">${c.title}</strong>
                                    <span class="util-bento-item__sub">${c.sub}</span>
                                </div>
                                <p class="util-bento-item__desc">${c.desc}</p>
                                <footer class="util-bento-item__foot">
                                    <span>${c.foot}</span>
                                    <span aria-hidden="true">&#8594;</span>
                                </footer>
                                ${buildBentoTooltipHtml(c.title, `${c.sub}. ${c.desc}`, `✦ Bấm để mở thẻ ${c.badge}`)}
                            </article>
                        `,
                    )
                    .join("")}
            </div>
        `;
    };

    // ==================== MỤC 3: TRA CỨU 24 TIẾT KHÍ (ĐỒNG BỘ TRANG DAY + 6 ANIMATION) ====================
    let stViewingYear = 2026;
    let stSeasonFilter = "all";

    const SOLAR_TERMS_DATA = [
        [
            "Tiểu Hàn",
            "05/01",
            "15:13",
            "winter",
            "sun",
            "term-winter-minor-cold.svg",
            "Chớm lạnh — Khí trời bắt đầu rét đậm, chuẩn bị bước vào giai đoạn lạnh nhất cuối năm.",
            "Nên giữ ấm cơ thể, bồi bổ dinh dưỡng và hoàn tất các kế hoạch cuối năm.",
        ],
        [
            "Đại Hàn",
            "20/01",
            "08:35",
            "winter",
            "sun",
            "term-winter-major-cold.svg",
            "Rét cực điểm — Tiết khí cuối năm âm lịch, hàn khí đạt đỉnh trước khi mầm xuân trỗi dậy.",
            "Thích hợp tổng kết năm cũ, dọn dẹp nhà cửa đón Tết và giữ ấm vùng cổ, bàn chân.",
        ],
        [
            "Lập Xuân",
            "04/02",
            "02:50",
            "spring",
            "sprout",
            "term-spring.svg",
            "Khởi đầu mùa xuân — Dương khí bừng dậy, cây cối đâm chồi nảy lộc, vạn vật sinh sôi.",
            "Đại cát cho việc lập kế hoạch năm mới, xuất hành đầu xuân, trồng cây và mở rộng giao kết.",
        ],
        [
            "Vũ Thủy",
            "18/02",
            "22:40",
            "spring",
            "rain",
            "term-rain.svg",
            "Mưa xuân — Hơi ẩm tăng dần, mưa phùn ấm áp tưới tắm cho mùa màng tươi tốt.",
            "Thuận lợi cho việc gieo trồng, học tập, bồi đắp tri thức và chăm sóc sức khỏe gan mật.",
        ],
        [
            "Kinh Trập",
            "05/03",
            "20:44",
            "spring",
            "thunder",
            "term-thunder.svg",
            "Sấm xuân thức tỉnh — Tiếng sấm đầu mùa vang lên đánh thức vạn vật sau kỳ ngủ đông.",
            "Thời điểm rất tốt để bứt phá, triển khai dự án mới và hành động quyết đoán.",
        ],
        [
            "Xuân Phân",
            "20/03",
            "21:32",
            "spring",
            "snow",
            "term-spring-equinox.svg",
            "Giữa xuân cân bằng — Ngày và đêm dài bằng nhau, âm dương điều hòa.",
            "Rất tốt cho việc hòa giải, ký kết hợp tác đôi bên cùng có lợi và cân bằng nhịp sống.",
        ],
        [
            "Thanh Minh",
            "05/04",
            "01:22",
            "spring",
            "sprout",
            "term-spring-clear.svg",
            "Trời trong sáng — Tiết trời quang đãng, gắn liền với truyền thống tảo mộ tri ân tổ tiên.",
            "Hợp đi tảo mộ, tri ân tổ tiên, du xuân ngoài trời và khởi sự việc thiện lành.",
        ],
        [
            "Cốc Vũ",
            "20/04",
            "08:24",
            "spring",
            "rain",
            "term-grain-rain.svg",
            "Mưa rào nuôi ngũ cốc — Lượng mưa dồi dào giúp lúa màu phát triển vượt bậc.",
            "Thuận lợi cho việc tích lũy tài chính, đầu tư dài hạn và chăm sóc gia đình.",
        ],
        [
            "Lập Hạ",
            "05/05",
            "18:30",
            "summer",
            "sun",
            "term-summer-sun.svg",
            "Bắt đầu mùa hạ — Nắng vàng rực rỡ, vạn vật bước vào kỳ trưởng thành mạnh mẽ.",
            "Hợp đẩy mạnh kinh doanh, quảng bá thương hiệu và giữ tâm thái bình hòa dưới nắng nóng.",
        ],
        [
            "Tiểu Mãn",
            "21/05",
            "07:23",
            "summer",
            "sprout",
            "term-grain.svg",
            "Lúa trổ đòng chắc hạt — Hạt ngũ cốc bắt đầu căng mẩy báo hiệu mùa màng bội thu.",
            "Nên kiên trì hoàn thiện các công việc đang dang dở để chuẩn bị gặt hái thành quả.",
        ],
        [
            "Mang Chủng",
            "05/06",
            "22:32",
            "summer",
            "sprout",
            "term-grain-ear.svg",
            "Lúa chín có râu — Thời điểm thu hoạch vụ chiêm và gieo cấy vụ mùa nhộn nhịp.",
            "Rất tốt cho việc thu hồi công nợ, chốt doanh số và tái đầu tư xoay vòng vốn.",
        ],
        [
            "Hạ Chí",
            "21/06",
            "15:10",
            "summer",
            "sun",
            "term-summer-solstice.svg",
            "Đỉnh điểm mùa hạ — Ngày dài nhất trong năm, dương khí đạt cực thịnh.",
            "Nên uống nhiều nước mát, nghỉ trưa hợp lý và tránh làm việc quá sức ngoài trời nắng gắt.",
        ],
        [
            "Tiểu Thử",
            "07/07",
            "08:45",
            "summer",
            "sun",
            "term-summer-minor-heat.svg",
            "Nóng nhẹ — Khí trời oi bức bắt đầu lan tỏa kèm mưa dông mùa hạ.",
            "Hợp làm việc nơi thoáng mát, kiểm soát cảm xúc và giữ gìn sức khỏe tim mạch.",
        ],
        [
            "Đại Thử",
            "23/07",
            "02:12",
            "summer",
            "sun",
            "term-summer-major-heat.svg",
            "Nóng oi ả cực độ — Giai đoạn nhiệt độ cao nhất trong năm, hành Hỏa vượng.",
            "Thích hợp dưỡng tâm, ăn thực phẩm thanh nhiệt và cẩn trọng phòng chống cháy nổ.",
        ],
        [
            "Lập Thu",
            "07/08",
            "18:28",
            "autumn",
            "wind",
            "term-autumn-wind.svg",
            "Khởi đầu mùa thu — Gió heo may chớm về, bầu trời cao trong và dịu mát dần.",
            "Thời điểm lý tưởng để hoạch định mục tiêu nửa cuối năm, khai trương và thu hoạch.",
        ],
        [
            "Xử Thử",
            "23/08",
            "09:05",
            "autumn",
            "wind",
            "term-autumn-cool.svg",
            "Dứt nắng nóng — Cái oi bức mùa hè chấm dứt, nhường chỗ cho tiết trời thu mát mẻ.",
            "Rất tốt cho việc nghỉ ngơi phục hồi sức lực, gắn kết gia đình và sắp xếp lại công việc.",
        ],
        [
            "Bạch Lộ",
            "07/09",
            "21:18",
            "autumn",
            "rain",
            "term-dew.svg",
            "Sương trắng — Đêm về se lạnh khiến hơi nước ngưng tụ thành giọt sương trên lá.",
            "Nên giữ ấm khi sáng sớm, thuận lợi cho việc học hành, thi cử và sáng tạo.",
        ],
        [
            "Thu Phân",
            "23/09",
            "06:49",
            "autumn",
            "snow",
            "term-autumn-day-night.svg",
            "Giữa thu cân bằng — Thời lượng ngày và đêm bằng nhau, tiết trời thu trong trẻo.",
            "Đại lợi cho việc hội họp, đoàn viên, ký kết giao ước và thưởng ngoạn mùa thu.",
        ],
        [
            "Hàn Lộ",
            "08/10",
            "13:02",
            "autumn",
            "rain",
            "term-cold-dew.svg",
            "Sương lạnh — Khí trời chuyển lạnh sâu hơn, sương đêm ngưng tụ dày.",
            "Hợp thu vén tài sản, củng cố nội lực và chăm sóc hệ hô hấp khi giao mùa.",
        ],
        [
            "Sương Giáng",
            "23/10",
            "16:15",
            "autumn",
            "rain",
            "term-frost.svg",
            "Sương mù & Giá lạnh — Tiết khí cuối cùng của mùa thu trước khi sang đông.",
            "Nên hoàn tất các kế hoạch mùa thu, chuẩn bị tích trữ nguồn lực cho mùa đông.",
        ],
        [
            "Lập Đông",
            "07/11",
            "16:20",
            "winter",
            "wind",
            "term-winter-snow.svg",
            "Bắt đầu mùa đông — Gió mùa đông bắc tràn về, vạn vật thu mình tích trữ năng lượng.",
            "Rất tốt cho việc bồi bổ sức khỏe, cất trữ tài sản và sum họp gia đình ấm cúng.",
        ],
        [
            "Tiểu Tuyết",
            "22/11",
            "13:45",
            "winter",
            "snow",
            "term-winter-minor-snow.svg",
            "Tuyết nhẹ / Rét đầu đông — Nhiệt độ giảm thấp, không khí khô lạnh rõ rệt.",
            "Thích hợp nghiên cứu chuyên sâu, làm việc nội bộ và giữ ấm cơ thể.",
        ],
        [
            "Đại Tuyết",
            "07/12",
            "09:08",
            "winter",
            "snow",
            "term-winter-major-snow.svg",
            "Tuyết dày / Rét đậm — Hàn khí bao phủ mạnh mẽ, đêm dài ngày ngắn.",
            "Nên hạn chế đi xa mạo hiểm, ưu tiên củng cố tài chính và chăm sóc người thân.",
        ],
        [
            "Đông Chí",
            "22/12",
            "03:02",
            "winter",
            "snow",
            "term-winter-solstice.svg",
            "Giữa đông — Đêm dài nhất trong năm; từ sau Đông Chí dương khí bắt đầu hồi sinh.",
            "Thời điểm cát lành để cầu phúc, đoàn viên và chuẩn bị đón vận hội mới.",
        ],
    ];

    const SEASON_VN = {
        spring: "Mùa Xuân • Hành Mộc",
        summer: "Mùa Hạ • Hành Hỏa",
        autumn: "Mùa Thu • Hành Kim",
        winter: "Mùa Đông • Hành Thủy",
    };

    const renderSolarTermsPanel = () => {
        setText("st-year-title", String(stViewingYear));
        setText("st-year-badge", `Năm ${stViewingYear}`);
        const grid = document.getElementById("st-cards-grid");
        if (!grid) return;

        const curTerm = window.LunarEngine
            ? window.LunarEngine.getFullDayInfo(new Date().getDate(), new Date().getMonth() + 1, stViewingYear)
                  .solarTerm
            : "Lập Đông";

        const filtered = SOLAR_TERMS_DATA.filter((item) => stSeasonFilter === "all" || item[3] === stSeasonFilter);

        grid.innerHTML = filtered
            .map(([name, ddmm, timeStr, seasonKey, animGroup, icon, desc, advice]) => {
                const isCur = name === curTerm;
                const iconPath = `./assets/icons/weather/${icon}`;
                const seasonLabel = SEASON_VN[seasonKey];
                const idx = SOLAR_TERMS_DATA.findIndex((x) => x[0] === name);

                return `
                    <article
                        class="util-bento-item ${isCur ? "is-current-highlight" : ""} has-bento-tooltip"
                        data-term-anim="${animGroup}"
                        data-st-idx="${idx}"
                    >
                        <span class="util-bento-item__bg-wrap" aria-hidden="true">
                            <img src="${iconPath}" alt="" class="util-bento-item__watermark" />
                        </span>

                        <div class="util-bento-item__top">
                            <span class="util-bento-item__icon-box util-bento-item__icon-box--filtered">
                                <img src="${iconPath}" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-bento-item__badge">${ddmm}/${stViewingYear} • ${timeStr}</span>
                        </div>

                        <div class="util-bento-item__body">
                            <strong class="util-bento-item__title">Tiết ${name} ${isCur ? "• Hiện tại" : ""}</strong>
                            <span class="util-bento-item__sub">${seasonLabel}</span>
                        </div>

                        <p class="util-bento-item__desc">${desc}</p>

                        <footer class="util-bento-item__foot">
                            <span>Xem dưỡng sinh &amp; hành sự</span>
                            <span aria-hidden="true">&#8594;</span>
                        </footer>

                        ${buildBentoTooltipHtml(
                            `Tiết ${name} (${ddmm}/${stViewingYear})`,
                            `${desc} ${advice}`,
                            `✦ Bấm để mở thẻ chi tiết Tiết ${name}`,
                        )}
                    </article>
                `;
            })
            .join("");
    };

    // ==================== MỤC 4: RÚT QUẺ KINH DỊCH (3 ĐỒNG XU 3D + MOUSE ENTROPY) & TAROT SVG ====================
    let mouseEntropyAccumulator = 19870113;
    let mouseMoveCount = 0;

    const ICHING_HEXAGRAMS = [
        {
            num: 1,
            name: "Thuần Càn (Càn vi Thiên)",
            trigrams: "Nội quái: Càn (Trời) • Ngoại quái: Càn (Trời)",
            lines: [1, 1, 1, 1, 1, 1],
            judgment: "Càn: Nguyên, Hanh, Lợi, Trinh. Khí dương cương kiện, tự cường bất tức, vạn vật khởi sinh.",
            image: "Trời chuyển động mạnh mẽ, người quân tử noi theo đó mà tự lực vươn lên không ngừng nghỉ.",
            advice: "Thời cơ đại cát để khởi sự lớn, dẫn dắt dự án và giữ vị thế chủ động. Cần kết hợp sự quyết đoán với lòng khiêm tốn.",
        },
        {
            num: 11,
            name: "Địa Thiên Thái (Càn hạ - Khôn thượng)",
            trigrams: "Nội quái: Càn (Trời) • Ngoại quái: Khôn (Đất)",
            lines: [1, 1, 1, 0, 0, 0],
            judgment: "Thái: Tiểu vãng đại lai, cát hanh. Trời đất giao hòa, âm dương thông suốt, muôn vật hưng thịnh.",
            image: "Khí trời và đất giao nhau tạo nên quẻ Thái. Bậc quân tử tài bồi cơ đồ giúp tập thể an lạc.",
            advice: "Mọi sự bế tắc đã qua, vận hội hanh thông đang mở ra. Đại lợi cho việc hợp tác, ký kết, mở rộng thị trường và cầu tài.",
        },
        {
            num: 14,
            name: "Hỏa Thiên Đại Hữu (Càn hạ - Ly thượng)",
            trigrams: "Nội quái: Càn (Trời) • Ngoại quái: Ly (Lửa)",
            lines: [1, 1, 1, 1, 0, 1],
            judgment:
                "Đại Hữu: Nguyên hanh. Mặt trời tỏa sáng trên bầu trời cao, vạn vật đều được soi chiếu, phúc lộc dồi dào.",
            image: "Lửa ở trên trời là tượng quẻ Đại Hữu. Người quân tử ngăn điều ác, nêu cao điều thiện, thuận theo mệnh trời.",
            advice: "Tài vận và uy tín cùng vượng. Rất thuận lợi cho việc đầu tư dài hạn, xây dựng thương hiệu và kết giao quý nhân.",
        },
        {
            num: 15,
            name: "Địa Sơn Khiêm (Cấn hạ - Khôn thượng)",
            trigrams: "Nội quái: Cấn (Núi) • Ngoại quái: Khôn (Đất)",
            lines: [0, 0, 1, 0, 0, 0],
            judgment:
                "Khiêm: Hanh, quân tử hữu chung. Núi cao ẩn mình dưới đất thấp, càng khiêm nhường càng tôn quý bền lâu.",
            image: "Trong đất có núi là tượng quẻ Khiêm. Người quân tử bớt chỗ nhiều, thêm vào chỗ ít để giữ sự cân bằng.",
            advice: "Giữ thái độ khiêm tốn, lắng nghe và điềm đạm sẽ giúp bạn hóa giải mọi trở ngại và thu phục lòng người.",
        },
        {
            num: 18,
            name: "Sơn Phong Cổ (Tốn hạ - Cấn thượng)",
            trigrams: "Nội quái: Tốn (Gió) • Ngoại quái: Cấn (Núi)",
            lines: [0, 1, 1, 0, 0, 1],
            judgment:
                "Cổ: Nguyên hanh, lợi thiệp đại xuyên. Chỉnh đốn những việc cũ kỹ để mở ra kỷ nguyên phát triển mới.",
            image: "Dưới núi có gió là tượng quẻ Cổ. Người quân tử chấn chỉnh phong hóa, nuôi dưỡng đức độ bền vững.",
            advice: "Đã đến lúc rà soát và đổi mới những quy trình cũ. Sự cải tổ dứt khoát, minh bạch sẽ mang lại thành quả vượt bậc.",
        },
        {
            num: 42,
            name: "Phong Lôi Ích (Chấn hạ - Tốn thượng)",
            trigrams: "Nội quái: Chấn (Sấm) • Ngoại quái: Tốn (Gió)",
            lines: [1, 0, 0, 0, 1, 1],
            judgment:
                "Ích: Lợi hữu攸 vãng, lợi thiệp đại xuyên. Gió sấm tương trợ cho nhau, tăng thêm phúc lộc và sức mạnh.",
            image: "Gió và sấm khích động lẫn nhau là tượng quẻ Ích. Người quân tử thấy điều thiện thì noi theo, có lỗi thì sửa đổi.",
            advice: "Rất tốt để tiến hành dự án lớn, học thêm kỹ năng mới và hỗ trợ cộng sự cùng phát triển.",
        },
        {
            num: 63,
            name: "Thủy Hỏa Ký Tế (Ly hạ - Khảm thượng)",
            trigrams: "Nội quái: Ly (Lửa) • Ngoại quái: Khảm (Nước)",
            lines: [1, 0, 1, 0, 1, 0],
            judgment:
                "Ký Tế: Hanh tiểu, lợi trinh. Nước lửa giao hòa đúng ngôi vị, mọi việc đã hoàn thành trật tự viên mãn.",
            image: "Nước ở trên lửa là tượng quẻ Ký Tế. Người quân tử lúc thành công vẫn lo nghĩ phòng ngừa rủi ro từ sớm.",
            advice: "Mục tiêu hiện tại đã đạt độ chín muồi. Hãy củng cố thành quả và chuẩn bị kỹ lưỡng cho chu kỳ tiếp theo.",
        },
    ];

    const TAROT_SVG_ICONS = {
        star: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="32 6 39 24 58 24 43 36 48 54 32 43 16 54 21 36 6 24 25 24"/></svg>`,
        sun: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="32" cy="32" r="14"/><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="18" y2="18"/><line x1="46" y1="46" x2="52" y2="52"/><line x1="52" y1="12" x2="46" y2="18"/><line x1="18" y1="46" x2="12" y2="52"/></svg>`,
        wheel: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="8"/><line x1="32" y1="8" x2="32" y2="56"/><line x1="8" y1="32" x2="56" y2="32"/><line x1="15" y1="15" x2="49" y2="49"/><line x1="49" y1="15" x2="15" y2="49"/></svg>`,
        balance: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="32" y1="10" x2="32" y2="54"/><line x1="14" y1="20" x2="50" y2="20"/><polygon points="14 20 6 36 22 36"/><polygon points="50 20 42 36 58 36"/><line x1="20" y1="54" x2="44" y2="54"/></svg>`,
        wand: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="52" x2="46" y2="18"/><polygon points="50 10 53 17 60 20 53 23 50 30 47 23 40 20 47 17"/><circle cx="24" cy="16" r="2"/><circle cx="48" cy="42" r="2"/></svg>`,
    };

    const TAROT_CARDS = [
        {
            roman: "I",
            en: "THE MAGICIAN",
            vn: "Nhà Ảo Thuật (The Magician)",
            svg: TAROT_SVG_ICONS.wand,
            keywords: "Hành động chủ động, kỹ năng điêu luyện, sự tập trung và biến ý tưởng thành hiện thực.",
            career: "Cơ hội thăng tiến hoặc khởi chạy dự án kỹ thuật mới đang rất thuận lợi; hãy tận dụng tối đa công cụ bạn đang có.",
            msg: "Bạn đã hội tụ đủ 4 yếu tố Đất, Nước, Lửa, Khí. Đây là lúc bắt tay vào hành động ngay với sự tự tin cao nhất.",
        },
        {
            roman: "X",
            en: "WHEEL OF FORTUNE",
            vn: "Bánh Xe Số Phận (Wheel of Fortune)",
            svg: TAROT_SVG_ICONS.wheel,
            keywords: "Bước ngoặt may mắn, chu kỳ vận hội mới và quy luật nhân quả tốt lành.",
            career: "Thị trường hoặc công việc có sự chuyển dịch tích cực bất ngờ; thích hợp nắm bắt xu hướng mới.",
            msg: "Bánh xe thời vận đang xoay chuyển theo chiều hướng thuận lợi. Hãy linh hoạt đón nhận cơ hội mới vừa xuất hiện.",
        },
        {
            roman: "XIV",
            en: "TEMPERANCE",
            vn: "Sự Điều Độ (Temperance)",
            svg: TAROT_SVG_ICONS.balance,
            keywords: "Đại diện cho sự cân bằng, kiên nhẫn, dung hòa hai cực đối lập và mục đích rõ ràng.",
            career: "Phối hợp nhịp nhàng giữa các phòng ban và quản trị rủi ro tài chính cân đối sẽ mang lại hiệu quả bền vững.",
            msg: "Hãy tìm kiếm sự điều độ trong mọi khía cạnh của cuộc sống và kết hợp giữa lý trí với trực giác một cách hài hòa.",
        },
        {
            roman: "XVII",
            en: "THE STAR",
            vn: "Ngôi Sao Hy Vọng (The Star)",
            svg: TAROT_SVG_ICONS.star,
            keywords: "Niềm tin, cảm hứng sáng tạo, sự bình yên nội tâm và tầm nhìn tương lai sáng rõ.",
            career: "Rất tốt cho các ngành sáng tạo, công nghệ, thiết kế và xây dựng định hướng chiến lược dài hạn.",
            msg: "Sau những thử thách, bầu trời đã quang đãng trở lại. Hãy tin tưởng vào con đường dài hạn của bạn.",
        },
        {
            roman: "XIX",
            en: "THE SUN",
            vn: "Mặt Trời Rực Rỡ (The Sun)",
            svg: TAROT_SVG_ICONS.sun,
            keywords: "Thành công viên mãn, niềm vui, sức sống tràn đầy và sự minh bạch tuyệt đối.",
            career: "Dự án gặt hái kết quả xuất sắc, doanh thu khởi sắc và nhận được sự ghi nhận xứng đáng từ tập thể.",
            msg: "Năng lượng tích cực và thành tựu rõ rệt đang đến với bạn. Mọi nỗ lực bền bỉ trong thời gian qua sắp đơm hoa kết trái.",
        },
    ];

    const renderIChingHexagram = (hex) => {
        const visual = document.getElementById("ic-lines-visual");
        if (visual) {
            visual.innerHTML = [...hex.lines]
                .reverse()
                .map((bit) =>
                    bit === 1
                        ? `<div class="util-hex-line util-hex-line--yang"><span></span></div>`
                        : `<div class="util-hex-line util-hex-line--yin"><span></span><span></span></div>`,
                )
                .join("");
        }
        setText("ic-hex-number", `Quẻ số ${hex.num} • Chu Dịch`);
        setText("ic-hex-name", hex.name);
        setText("ic-hex-trigrams", hex.trigrams);
        setText("ic-hex-judgment", hex.judgment);
        setText("ic-hex-image", hex.image);
        setText("ic-hex-advice", hex.advice);
    };

    const renderTarotCard = (card, isUpright = true) => {
        setText("tr-card-roman", card.roman);
        setHtml("tr-card-symbol", card.svg);
        setText("tr-card-en", card.en);
        setText(
            "tr-card-orientation",
            isUpright ? "Lá bài Xuôi (Upright)" : "Lá bài Ngược (Reversed • Chiêm nghiệm nội tâm)",
        );
        setText("tr-card-vn", card.vn);
        setText("tr-card-keywords", card.keywords);
        setText("tr-card-career", card.career);
        setText("tr-card-message", card.msg);
    };

    // ==================== MỤC 5: NGÀY NÀY NĂM XƯA (CUSTOM PICKER + ẢNH NỀN + PHÂN TRANG + MODAL SLIDESHOW) ====================
    let hiMonth = 11;
    let hiScope = "all";
    let hiPage = 1;
    const HI_PAGE_SIZE = 6;
    const hiCache = new Map();
    let currentHiFilteredList = [];

    const renderHistoryMonthPicker = () => {
        setText("hi-month-text", `Tháng ${pad(hiMonth)}`);
        const list = document.getElementById("hi-month-list");
        if (!list) return;
        let html = "";
        for (let m = 1; m <= 12; m++) {
            html += `<li><button type="button" class="bazi-picker__option ${m === hiMonth ? "is-selected" : ""}" data-hi-month="${m}">Tháng ${pad(m)}</button></li>`;
        }
        list.innerHTML = html;
    };

    const fetchAndRenderHistory = async () => {
        const grid = document.getElementById("hi-events-grid");
        const pagEl = document.getElementById("hi-pagination");
        if (!grid) return;

        if (!hiCache.has(hiMonth)) {
            let loaded = [];
            for (const path of [`./api/thang-${hiMonth}.json`, `./api/thang-${pad(hiMonth)}.json`]) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const data = await res.json();
                        loaded = Array.isArray(data) ? data : data?.data || data?.events || [];
                        break;
                    }
                } catch (e) {
                    // Fallback
                }
            }
            hiCache.set(hiMonth, loaded);
        }

        const rawItems = hiCache.get(hiMonth) || [];
        currentHiFilteredList = rawItems.filter((item) => {
            const scopeStr = String(item.pham_vi || item.scope || item.category_id || "").toLowerCase();
            const isIntl = Boolean(item.is_international) || scopeStr.includes("quoc-te") || scopeStr.includes("intl");
            if (hiScope === "vn") return !isIntl;
            if (hiScope === "intl") return isIntl;
            return true;
        });

        const totalPages = Math.max(1, Math.ceil(currentHiFilteredList.length / HI_PAGE_SIZE));
        if (hiPage > totalPages) hiPage = 1;

        const pageItems = currentHiFilteredList.slice((hiPage - 1) * HI_PAGE_SIZE, hiPage * HI_PAGE_SIZE);

        grid.innerHTML = pageItems
            .map((item, idx) => {
                const globalIdx = (hiPage - 1) * HI_PAGE_SIZE + idx;
                const rawSlug = String(item.image_slug || item.slug || "").trim();
                const cleanSlug = rawSlug
                    .split("/")
                    .pop()
                    .replace(/\.(jpg|jpeg|png|webp)$/i, "");
                const coverUrl = cleanSlug
                    ? `./assets/images/calendar-covers/thang-${hiMonth}/${cleanSlug}.jpg`
                    : DEFAULT_COVER_IMG;
                const scopeStr = String(item.pham_vi || item.scope || "").toLowerCase();
                const isIntl = Boolean(item.is_international) || scopeStr.includes("quoc-te");
                const name = item.ten || "Nhân vật & Sự kiện lịch sử";
                const occasion = item.hien_thi_nhan_dip || `Kỷ niệm lịch sử tháng ${hiMonth}`;
                const quote = item.danh_ngon || item.quote || occasion;

                return `
                    <article
                        class="util-history-card has-bento-tooltip"
                        data-hi-idx="${globalIdx}"
                        tabindex="0"
                    >
                        <div class="util-history-card__media" aria-hidden="true">
                            <img src="${coverUrl}" alt="" onerror="this.src='${DEFAULT_COVER_IMG}'" loading="lazy" />
                        </div>

                        <div class="util-history-card__top">
                            <span class="util-history-card__date-pill">${item.ngay_hien_thi || `Tháng ${pad(hiMonth)}`}</span>
                            <span class="util-history-card__scope-pill">${isIntl ? "Sự kiện Quốc tế" : "Lịch sử Việt Nam"}</span>
                        </div>

                        <div class="util-history-card__body">
                            <strong class="util-history-card__title">${name}</strong>
                            <p class="util-history-card__sub">${occasion}</p>
                        </div>

                        ${buildBentoTooltipHtml(
                            `${name} (${item.ngay_hien_thi || `T${hiMonth}`})`,
                            `${occasion}. "${quote}"`,
                            "✦ Bấm để mở Hồ sơ & Trình chiếu ảnh tư liệu",
                        )}
                    </article>
                `;
            })
            .join("");

        if (pagEl) {
            if (totalPages <= 1) {
                pagEl.innerHTML = "";
            } else {
                let pagHtml = "";
                for (let p = 1; p <= totalPages; p++) {
                    pagHtml += `<button type="button" class="util-pagination__btn ${p === hiPage ? "is-active" : ""}" data-hi-page="${p}">${p}</button>`;
                }
                pagEl.innerHTML = pagHtml;
            }
        }
    };

    // ==================== MỤC 6: HOROSCOPE 12 CUNG HOÀNG ĐẠO (CUSTOM PICKERS + 12 SVG LINH VẬT) ====================
    let hsDay = 13;
    let hsMonth = 1;

    

    const HOROSCOPE_SIGNS = [
        {
            key: "capricorn",
            name: "Ma Kết (Capricorn)",
            mascot: "Dê Biển Đuôi Cá",
            dates: "22/12 – 19/01",
            element: "Nguyên tố Đất • Sao Thổ chủ quản",
            traits: "Có trách nhiệm, kỷ luật, thực tế và giàu tham vọng. Ma Kết là người làm việc kiên trì, có tầm nhìn chiến lược xa và luôn nỗ lực đạt mục tiêu.",
            daily: "Hôm nay năng lượng nguyên tố Đất giúp Ma Kết xử lý công việc và tài chính cực kỳ sáng suốt. Con số may mắn: 4, 8 • Màu hợp: Nâu trầm, Xanh đen.",
        },
        {
            key: "aquarius",
            name: "Bảo Bình (Aquarius)",
            mascot: "Người Ôm Bình Nước",
            dates: "20/01 – 18/02",
            element: "Nguyên tố Khí • Sao Thiên Vương chủ quản",
            traits: "Độc lập, thông thái, giàu ý tưởng đổi mới công nghệ và luôn hướng tới giá trị nhân văn.",
            daily: "Một ý tưởng sáng tạo đột phá của Bảo Bình sẽ nhận được sự ủng hộ lớn từ đồng nghiệp hôm nay. Số may mắn: 7, 11.",
        },
        {
            key: "pisces",
            name: "Song Ngư (Pisces)",
            mascot: "Đôi Cá Bơi Ngược Chiều",
            dates: "19/02 – 20/03",
            element: "Nguyên tố Nước • Sao Hải Vương chủ quản",
            traits: "Giàu lòng trắc ẩn, trực giác nhạy bén, tinh tế và có tâm hồn nghệ thuật phong phú.",
            daily: "Trực giác của Song Ngư hôm nay vô cùng chính xác; hãy lắng nghe tiếng nói bên trong. Số may mắn: 3, 9.",
        },
        {
            key: "aries",
            name: "Bạch Dương (Aries)",
            mascot: "Cừu Đực Sừng Vàng",
            dates: "21/03 – 19/04",
            element: "Nguyên tố Lửa • Sao Hỏa chủ quản",
            traits: "Nhiệt huyết, tiên phong, dũng cảm và luôn tràn đầy năng lượng khởi đầu mới.",
            daily: "Ngày tuyệt vời để Bạch Dương khởi động dự án mới hoặc giải quyết dứt điểm việc tồn đọng. Số may mắn: 1, 9.",
        },
        {
            key: "taurus",
            name: "Kim Ngưu (Taurus)",
            mascot: "Bò Đực Dũng Mãnh",
            dates: "20/04 – 20/05",
            element: "Nguyên tố Đất • Sao Kim chủ quản",
            traits: "Điềm tĩnh, đáng tin cậy, yêu cái đẹp và có năng lực quản lý tài sản vững vàng.",
            daily: "Tài vận của Kim Ngưu hôm nay rất ổn định; thích hợp lập kế hoạch tích lũy dài hạn. Số may mắn: 2, 6.",
        },
        {
            key: "gemini",
            name: "Song Tử (Gemini)",
            mascot: "Cặp Song Sinh",
            dates: "21/05 – 21/06",
            element: "Nguyên tố Khí • Sao Thủy chủ quản",
            traits: "Linh hoạt, giao tiếp sắc sảo, ham học hỏi và thích nghi nhanh với mọi hoàn cảnh.",
            daily: "Khả năng đàm phán và kết nối thông tin giúp Song Tử mở ra cơ hội hợp tác mới. Số may mắn: 5, 14.",
        },
        {
            key: "cancer",
            name: "Cự Giải (Cancer)",
            mascot: "Linh Vật Cua Biển",
            dates: "22/06 – 22/07",
            element: "Nguyên tố Nước • Mặt Trăng chủ quản",
            traits: "Chu đáo, ấm áp, trọng tình nghĩa và luôn là hậu phương vững chắc cho gia đình.",
            daily: "Không gian ấm cúng và sự sẻ chia chân thành mang lại nguồn năng lượng bình an cho Cự Giải. Số may mắn: 2, 7.",
        },
        {
            key: "leo",
            name: "Sư Tử (Leo)",
            mascot: "Sư Tử Bờm Vàng",
            dates: "23/07 – 22/08",
            element: "Nguyên tố Lửa • Mặt Trời chủ quản",
            traits: "Tự tin, hào sảng, bản lĩnh dẫn dắt và luôn tỏa sáng với nguồn năng lượng ấm áp.",
            daily: "Sự quyết đoán và phong thái tự tin giúp Sư Tử ghi điểm ấn tượng trong mắt đối tác. Số may mắn: 1, 5.",
        },
        {
            key: "virgo",
            name: "Xử Nữ (Virgo)",
            mascot: "Trinh Nữ Cầm Bông Lúa",
            dates: "23/08 – 22/09",
            element: "Nguyên tố Đất • Sao Thủy chủ quản",
            traits: "Tỉ mỉ, chuẩn mực, tư duy phân tích hệ thống sắc bén và luôn hướng tới sự hoàn thiện.",
            daily: "Sự cẩn trọng đến từng chi tiết giúp Xử Nữ tối ưu hóa quy trình làm việc đạt hiệu suất cao nhất. Số may mắn: 5, 15.",
        },
        {
            key: "libra",
            name: "Thiên Bình (Libra)",
            mascot: "Cán Cân Công Lý",
            dates: "23/09 – 23/10",
            element: "Nguyên tố Khí • Sao Kim chủ quản",
            traits: "Công bằng, lịch thiệp, giàu gu thẩm mỹ và có biệt tài dung hòa các mối quan hệ.",
            daily: "Thiên Bình dễ dàng đạt được thỏa thuận đôi bên cùng có lợi trong các cuộc trao đổi. Số may mắn: 6, 9.",
        },
        {
            key: "scorpio",
            name: "Bọ Cạp (Scorpio)",
            mascot: "Bọ Cạp Huyền Bí",
            dates: "24/10 – 21/11",
            element: "Nguyên tố Nước • Sao Diêm Vương chủ quản",
            traits: "Sâu sắc, quyết liệt, tập trung cao độ và có nội lực bứt phá mạnh mẽ.",
            daily: "Sự tập trung bền bỉ giúp Bọ Cạp nhìn thấu bản chất vấn đề và nắm bắt cơ hội chiến lược. Số may mắn: 8, 18.",
        },
        {
            key: "sagittarius",
            name: "Nhân Mã (Sagittarius)",
            mascot: "Cung Thủ Nhân Mã",
            dates: "22/11 – 21/12",
            element: "Nguyên tố Lửa • Sao Mộc chủ quản",
            traits: "Phóng khoáng, lạc quan, yêu tự do khám phá tri thức và luôn nhìn về phía trước.",
            daily: "Tầm nhìn cởi mở mang lại cho Nhân Mã niềm cảm hứng mới mẻ trong học tập và công việc. Số may mắn: 3, 12.",
        },
    ];

    const getSignByMonthDay = (m, d) => {
        const code = m * 100 + d;
        if (code >= 1222 || code <= 119) return HOROSCOPE_SIGNS[0];
        if (code <= 218) return HOROSCOPE_SIGNS[1];
        if (code <= 320) return HOROSCOPE_SIGNS[2];
        if (code <= 419) return HOROSCOPE_SIGNS[3];
        if (code <= 520) return HOROSCOPE_SIGNS[4];
        if (code <= 621) return HOROSCOPE_SIGNS[5];
        if (code <= 722) return HOROSCOPE_SIGNS[6];
        if (code <= 822) return HOROSCOPE_SIGNS[7];
        if (code <= 922) return HOROSCOPE_SIGNS[8];
        if (code <= 1023) return HOROSCOPE_SIGNS[9];
        if (code <= 1121) return HOROSCOPE_SIGNS[10];
        return HOROSCOPE_SIGNS[11];
    };

    const renderHsPickers = () => {
        setText("hs-day-text", `Ngày ${pad(hsDay)}`);
        setText("hs-month-text", `Tháng ${pad(hsMonth)}`);

        const dList = document.getElementById("hs-day-list");
        if (dList) {
            let html = "";
            for (let d = 1; d <= 31; d++) {
                html += `<li><button type="button" class="bazi-picker__option ${d === hsDay ? "is-selected" : ""}" data-hs-day="${d}">${pad(d)}</button></li>`;
            }
            dList.innerHTML = html;
        }

        const mList = document.getElementById("hs-month-list");
        if (mList) {
            let html = "";
            for (let m = 1; m <= 12; m++) {
                html += `<li><button type="button" class="bazi-picker__option ${m === hsMonth ? "is-selected" : ""}" data-hs-month="${m}">Tháng ${pad(m)}</button></li>`;
            }
            mList.innerHTML = html;
        }
    };

    const renderHoroscopeSign = (sign) => {
        const svgMarkup = ZODIAC_MASCOT_SVGS[sign.key] || ZODIAC_MASCOT_SVGS.capricorn;
        setHtml("hs-sign-symbol", svgMarkup);
        setHtml("hs-hero-watermark", svgMarkup);
        setText("hs-sign-dates", sign.dates);
        setText("hs-sign-element", `${sign.element} • Linh vật: ${sign.mascot}`);
        setText("hs-sign-name", sign.name);
        setText("hs-sign-traits", sign.traits);
        setHtml("hs-sign-daily", `<strong>Luận giải năng lượng hôm nay:</strong> ${sign.daily}`);

        const grid = document.getElementById("hs-signs-grid");
        if (grid) {
            grid.innerHTML = HOROSCOPE_SIGNS.map((s) => {
                const sSvg = ZODIAC_MASCOT_SVGS[s.key];
                const isSel = s.key === sign.key;
                return `
                    <article
                        class="util-bento-item ${isSel ? "is-current-highlight" : ""} has-bento-tooltip"
                        data-sign-key="${s.key}"
                    >
                        <span class="util-bento-item__bg-wrap" aria-hidden="true">
                            <span class="util-bento-item__watermark">${sSvg}</span>
                        </span>
                        <div class="util-bento-item__top">
                            <span class="util-bento-item__icon-box">${sSvg}</span>
                            <span class="util-bento-item__badge">${s.dates}</span>
                        </div>
                        <div class="util-bento-item__body">
                            <strong class="util-bento-item__title">${s.name.split("(")[0].trim()}</strong>
                            <span class="util-bento-item__sub">${s.mascot}</span>
                        </div>
                        <p class="util-bento-item__desc">${s.traits}</p>
                        <footer class="util-bento-item__foot">
                            <span>${s.element.split("•")[0].trim()}</span>
                            <span aria-hidden="true">&#8594;</span>
                        </footer>
                        ${buildBentoTooltipHtml(s.name, `${s.element}. ${s.daily}`, `✦ Bấm để mở luận giải ${s.name}`)}
                    </article>
                `;
            }).join("");
        }
    };

    // ==================== MỤC 7: TÍNH THỜI GIAN (CUSTOM BENTO PICKERS + 6 STAT CARDS) ====================
    let ddStartPicker = null;
    let ddEndPicker = null;
    let asBasePicker = null;

    const computeDateDiff = () => {
        if (!ddStartPicker || !ddEndPicker) return;
        const s = ddStartPicker.getState();
        const e = ddEndPicker.getState();

        const d1 = new Date(s.year, s.month - 1, s.day);
        const d2 = new Date(e.year, e.month - 1, e.day);
        const diffMs = Math.abs(d2 - d1);
        const totalDays = Math.round(diffMs / 86400000);
        const totalHours = totalDays * 24;
        const totalMins = totalHours * 60;
        const weeks = Math.floor(totalDays / 7);
        const months = Math.floor(totalDays / 30.4375);
        const years = Math.floor(totalDays / 365.25);

        setText("dd-val-years", String(years));
        setText("dd-val-months", String(months));
        setText("dd-val-weeks", String(weeks));
        setText("dd-val-days", String(totalDays));
        setText("dd-val-hours", totalHours.toLocaleString("vi-VN"));
        setText("dd-val-minutes", totalMins.toLocaleString("vi-VN"));
        setText("dd-total-days-badge", `Tổng thời gian: ${totalDays} ngày`);

        if (window.LunarEngine) {
            const l1 = window.LunarEngine.getFullDayInfo(s.day, s.month, s.year);
            const l2 = window.LunarEngine.getFullDayInfo(e.day, e.month, e.year);
            setText(
                "dd-start-lunar-hint",
                `Âm lịch: ${pad(l1.lunarDay)}/${pad(l1.lunarMonth)}/${l1.lunarYear} (Ngày ${l1.dayCanChi} • ${l1.dayNapAm})`,
            );
            setText(
                "dd-end-lunar-hint",
                `Âm lịch: ${pad(l2.lunarDay)}/${pad(l2.lunarMonth)}/${l2.lunarYear} (Ngày ${l2.dayCanChi} • ${l2.dayNapAm})`,
            );
        }
    };

    const computeDateAddSub = () => {
        if (!asBasePicker) return;
        const b = asBasePicker.getState();
        const yOff = Number(document.getElementById("as-years")?.value || 0);
        const mOff = Number(document.getElementById("as-months")?.value || 0);
        const wOff = Number(document.getElementById("as-weeks")?.value || 0);
        const dOff = Number(document.getElementById("as-days")?.value || 0);

        const dir = dateCalcMode === "sub" ? -1 : 1;
        const target = new Date(b.year + dir * yOff, b.month - 1 + dir * mOff, b.day + dir * (wOff * 7 + dOff));
        const ty = target.getFullYear();
        const tm = target.getMonth() + 1;
        const td = target.getDate();

        const fullVi = new Intl.DateTimeFormat("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(target);

        setText(
            "as-res-mode-tag",
            dateCalcMode === "sub" ? "Kết quả sau khi trừ thời gian" : "Kết quả sau khi cộng thêm thời gian",
        );
        setText("as-res-solar", `${fullVi} Dương lịch`);
        setAttr("as-res-link", "href", `./day.html?date=${ty}-${pad(tm)}-${pad(td)}`);

        if (window.LunarEngine) {
            const info = window.LunarEngine.getFullDayInfo(td, tm, ty);
            setText(
                "as-res-lunar",
                `Nhằm ngày ${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear} Âm lịch • Năm ${info.yearCanChi} • Ngày ${info.dayCanChi} (${info.dayNapAm})`,
            );
        }
    };

    // ==================== MỤC 8: THẦN SỐ HỌC PYTHAGORAS ====================
    let numBirthPicker = null;

    const NUMEROLOGY_MEANINGS = {
        1: {
            title: "Nhà Tiên Phong Độc Lập",
            desc: "Đại diện cho khả năng lãnh đạo bẩm sinh, tự chủ, quyết đoán và bản lĩnh mở đường.",
            advice: "Phát huy tinh thần chủ động dẫn dắt, đồng thời học cách lắng nghe ý kiến từ đội ngũ cộng sự.",
        },
        2: {
            title: "Người Hòa Giải Tinh Tế",
            desc: "Đại diện cho sự lắng nghe, ngoại giao khéo léo, trực giác nhạy bén và tinh thần hợp tác.",
            advice: "Rất hợp vai trò kết nối, cố vấn chiến lược và xây dựng sự đồng thuận trong tập thể.",
        },
        3: {
            title: "Người Truyền Cảm Hứng & Sáng Tạo",
            desc: "Đại diện cho tư duy nhạy bén, ngôn từ sắc sảo, óc thẩm mỹ nghệ thuật và năng lượng tích cực.",
            advice: "Tập trung năng lượng vào việc sáng tạo sản phẩm, thuyết trình và hoàn tất mục tiêu đến cùng.",
        },
        4: {
            title: "Kiến Trúc Sư Thực Tế & Kỷ Luật",
            desc: "Đại diện cho tính hệ thống, quy trình chuẩn mực, nền tảng kỹ thuật vững chắc và sự bền bỉ.",
            advice: "Rất xuất sắc trong việc xây dựng cấu trúc dữ liệu, quản trị dự án và tích lũy tài sản an toàn.",
        },
        5: {
            title: "Người Tự Do & Đổi Mới Đột Phá",
            desc: "Đại diện cho sự linh hoạt, thích nghi nhanh, kết nối đa chiều và dám vượt qua giới hạn cũ.",
            advice: "Giữ kỷ luật cá nhân song hành cùng khát vọng đổi mới để biến trải nghiệm thành thành tựu.",
        },
        6: {
            title: "Người Nuôi Dưỡng & Trách Nhiệm",
            desc: "Đại diện cho tình yêu thương gia đình, sự tận tâm, gu thẩm mỹ tinh tế và tinh thần phụng sự.",
            advice: "Cân bằng giữa việc chăm lo cho người khác và dành thời gian tái tạo năng lượng cho bản thân.",
        },
        7: {
            title: "Nhà Triết Học & Nghiên Cứu Chuyên Sâu",
            desc: "Đại diện cho chiều sâu học thuật, tư duy phân tích gốc rễ, trực giác tâm linh và tự chiêm nghiệm.",
            advice: "Phù hợp tuyệt vời với nghiên cứu chuyên môn sâu, lập trình hệ thống, cổ học và chiến lược.",
        },
        8: {
            title: "Nhà Điều Hành & Thịnh Vượng Tài Chính",
            desc: "Đại diện cho năng lực quản trị vĩ mô, nhạy bén thương mại, quyền lực và hiệu quả thực tiễn.",
            advice: "Kết hợp mục tiêu tài chính với giá trị bền vững cho cộng đồng sẽ mang lại thành công lớn.",
        },
        9: {
            title: "Nhà Nhân Đạo & Lý Tưởng Lớn",
            desc: "Đại diện cho tầm nhìn bao dung, trách nhiệm xã hội, trí tuệ tổng hợp và sự viên mãn.",
            advice: "Lan tỏa tri thức, dẫn dắt thế hệ kế cận và theo đuổi những dự án mang lại giá trị lâu dài.",
        },
        11: {
            title: "Số Master 11/2 • Trực Giác Tâm Linh Cao",
            desc: "Bậc thầy truyền cảm hứng tinh thần, nhạy cảm với trường năng lượng và có tầm nhìn thấu thị.",
            advice: "Giữ tâm tĩnh tại để chuyển hóa trực giác nhạy bén thành những tác phẩm hoặc giải pháp giá trị.",
        },
        22: {
            title: "Số Master 22/4 • Kiến Tạo Đại Sự",
            desc: "Kết hợp tầm nhìn vĩ mô của số 11 với năng lực thực thi kỷ luật của số 4 để tạo di sản bền vững.",
            advice: "Hãy mạnh dạn đặt ra những mục tiêu lớn lao và kiên trì thực hiện từng bước vững chắc.",
        },
    };

    const reduceNum = (n, keepMaster = true) => {
        let cur = Number(n);
        while (cur > 9) {
            if (keepMaster && (cur === 11 || cur === 22)) return cur;
            cur = String(cur)
                .split("")
                .reduce((a, b) => a + Number(b), 0);
        }
        return cur || 1;
    };

    const renderNumerologyPersonal = () => {
        if (!numBirthPicker) return;
        const { day: d, month: m, year: y } = numBirthPicker.getState();
        const digitsStr = `${pad(d)}${pad(m)}${y}`;
        const allDigits = digitsStr.split("").map(Number);
        const rawSum = allDigits.reduce((a, b) => a + b, 0);
        const lifePath = reduceNum(rawSum, true);
        const info = NUMEROLOGY_MEANINGS[lifePath] || NUMEROLOGY_MEANINGS[3];

        setText("num-lifepath-number", String(lifePath));
        setText(
            "num-lifepath-formula",
            `Ngày sinh: ${pad(d)}/${pad(m)}/${y} (Tổng các chữ số: ${rawSum} → Số Chủ Đạo ${lifePath})`,
        );
        setText("num-lifepath-title", `Con Số Chủ Đạo ${lifePath} • ${info.title}`);
        setText("num-lifepath-desc", `${info.desc} ${info.advice}`);

        const now = new Date();
        const pYear = reduceNum(d + m + now.getFullYear(), false);
        const pMonth = reduceNum(pYear + (now.getMonth() + 1), false);
        const pDay = reduceNum(pMonth + now.getDate(), false);

        const cyclesGrid = document.getElementById("num-cycles-grid");
        if (cyclesGrid) {
            const cList = [
                { label: `Năm Cá Nhân (${now.getFullYear()})`, num: pYear },
                { label: `Tháng Cá Nhân (T${now.getMonth() + 1})`, num: pMonth },
                { label: "Ngày Cá Nhân Hôm Nay", num: pDay },
            ];
            cyclesGrid.innerHTML = cList
                .map((c) => {
                    const mObj = NUMEROLOGY_MEANINGS[c.num] || NUMEROLOGY_MEANINGS[1];
                    return `
                        <article class="util-num-cycle-box has-bento-tooltip" data-num-modal="${c.num}" data-num-role="${c.label}">
                            <span>${c.label}</span>
                            <strong>Số ${c.num}</strong>
                            <small>${mObj.title}</small>
                            ${buildBentoTooltipHtml(`${c.label}: Số ${c.num}`, mObj.desc, "✦ Bấm để mở giải nghĩa chi tiết")}
                        </article>
                    `;
                })
                .join("");
        }

        const counts = {};
        allDigits.forEach((digit) => {
            if (digit > 0) counts[digit] = (counts[digit] || "") + String(digit);
        });
        const layoutOrder = [
            [3, "Trí nhớ"],
            [6, "Sáng tạo"],
            [9, "Lý tưởng"],
            [2, "Trực giác"],
            [5, "Cân bằng"],
            [8, "Trí tuệ"],
            [1, "Thể chất"],
            [4, "Thực tế"],
            [7, "Trải nghiệm"],
        ];

        const chartGrid = document.getElementById("num-pythagoras-grid");
        if (chartGrid) {
            chartGrid.innerHTML = layoutOrder
                .map(([num, label]) => {
                    const str = counts[num] || "—";
                    const mObj = NUMEROLOGY_MEANINGS[num];
                    return `
                        <div class="util-pythagoras-cell ${counts[num] ? "has-val" : ""} has-bento-tooltip" data-num-modal="${num}" data-num-role="Ô số ${num} (${label})">
                            <small>Ô số ${num} (${label})</small>
                            <strong>${str}</strong>
                            ${buildBentoTooltipHtml(`Ô số ${num} (${label}): ${counts[num] ? `Xuất hiện ${counts[num].length} lần` : "Đang khuyết"}`, mObj.desc, `✦ Bấm để xem ý nghĩa Ô số ${num}`)}
                        </div>
                    `;
                })
                .join("");
        }
    };

    const renderNumerologyMonthCalendar = (selectedDay = 15) => {
        const year = 2026;
        const month = 11;
        const firstDayJs = new Date(year, month - 1, 1).getDay();
        const leading = (firstDayJs + 6) % 7;
        const maxDays = 30;
        const grid = document.getElementById("num-month-grid");
        if (!grid) return;

        const updateSelectedNumDay = (d) => {
            const raw = `${pad(d)}${pad(month)}${year}`.split("").reduce((a, b) => a + Number(b), 0);
            const num = reduceNum(raw, true);
            const info = NUMEROLOGY_MEANINGS[num] || NUMEROLOGY_MEANINGS[8];
            setText("num-cal-selected-badge", `Ngày ${pad(d)}/11/2026 • Số ${num}`);
            setText("num-day-tag", `Con số năng lượng của ngày ${pad(d)}/11/2026 là: Số ${num}`);
            setText("num-day-title", `Tần Số ${num}: ${info.title}`);
            setText("num-day-meaning", `${info.desc} ${info.advice}`);
            setAttr("num-day-link", "href", `./day.html?date=${year}-${pad(month)}-${pad(d)}`);
        };

        let html = "";
        for (let i = 0; i < 35; i++) {
            const d = i - leading + 1;
            if (d < 1 || d > maxDays) {
                html += `<div class="util-num-day-cell is-muted"><small>—</small><strong>•</strong></div>`;
            } else {
                const raw = `${pad(d)}${pad(month)}${year}`.split("").reduce((a, b) => a + Number(b), 0);
                const num = reduceNum(raw, true);
                html += `
                    <button
                        type="button"
                        class="util-num-day-cell ${d === selectedDay ? "is-active" : ""}"
                        data-num-cal-day="${d}"
                    >
                        <small>${d}/11</small>
                        <strong>${num}</strong>
                    </button>
                `;
            }
        }
        grid.innerHTML = html;
        updateSelectedNumDay(selectedDay);

        grid.querySelectorAll("[data-num-cal-day]").forEach((btn) => {
            btn.onclick = () => renderNumerologyMonthCalendar(Number(btn.dataset.numCalDay));
        });
    };

    // ==================== MỤC 9: NHỊP SINH HỌC BIORHYTHM (CUSTOM PICKERS + ANIMATION SÓNG + NGÀY GIAO ĐIỂM) ====================
    let bioBirthPicker = null;

    const renderBiorhythm = () => {
        if (!bioBirthPicker) return;
        const { day: bd, month: bm, year: by } = bioBirthPicker.getState();
        const birthDate = new Date(by, bm - 1, bd);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const daysAlive = Math.floor((todayStart - birthDate) / 86400000);

        const cycles = [
            {
                key: "phys",
                name: "Thể chất (23 ngày)",
                period: 23,
                color: "#2563eb",
                desc: "Chu kỳ 23 ngày chi phối sức bền cơ bắp, thể lực, hệ miễn dịch và khả năng vận động.",
            },
            {
                key: "emo",
                name: "Tình cảm (28 ngày)",
                period: 28,
                color: "#10b981",
                desc: "Chu kỳ 28 ngày chi phối cảm xúc, tâm trạng, sự đồng cảm, trực giác giao tiếp và nghệ thuật.",
            },
            {
                key: "intel",
                name: "Trí tuệ (33 ngày)",
                period: 33,
                color: "#f97316",
                desc: "Chu kỳ 33 ngày chi phối tư duy logic, khả năng tập trung, phân tích giải quyết vấn đề và trí nhớ.",
            },
            {
                key: "intuit",
                name: "Trực giác (38 ngày)",
                period: 38,
                color: "#8b5cf6",
                desc: "Chu kỳ 38 ngày chi phối linh cảm vô thức, khả năng nắm bắt cơ hội và sáng tạo đột phá.",
            },
        ];

        let totalPct = 0;
        const statsGrid = document.getElementById("bio-stats-grid");
        if (statsGrid) {
            statsGrid.innerHTML = cycles
                .map((c) => {
                    const pct = Math.round(Math.sin((2 * Math.PI * daysAlive) / c.period) * 100);
                    totalPct += pct;
                    let state = "Trạng thái ổn định";
                    if (Math.abs(pct) <= 12) state = "⚠️ Ngày giao điểm (Cần lưu ý)";
                    else if (pct >= 50) state = "🌟 Năng lượng đỉnh cao";
                    else if (pct < 0) state = "🌙 Giai đoạn nạp năng lượng";

                    return `
                        <article class="util-bio-stat-card has-bento-tooltip" data-bio-key="${c.key}" data-bio-pct="${pct}">
                            <div class="util-bio-stat-card__head">
                                <span>${c.name}</span>
                            </div>
                            <strong class="util-bio-stat-card__val" style="color: ${c.color}">
                                ${pct > 0 ? `+${pct}%` : `${pct}%`}
                            </strong>
                            <span class="util-bio-stat-card__advice">${state}</span>
                            ${buildBentoTooltipHtml(`${c.name}: ${pct}%`, c.desc, "✦ Bấm để xem khuyến nghị chi tiết")}
                        </article>
                    `;
                })
                .join("");
        }

        const svgW = 820;
        const svgH = 260;
        const leftPad = 68;
        const rightPad = 24;
        const topPad = 32;
        const bottomPad = 32;
        const plotW = svgW - leftPad - rightPad;
        const plotH = svgH - topPad - bottomPad;
        const midY = topPad + plotH / 2;

        const criticalDaysList = [];
        const peakDaysList = [];

        const pathsHtml = cycles
            .map((c) => {
                const pts = [];
                for (let i = 0; i <= 30; i++) {
                    const x = leftPad + (i / 30) * plotW;
                    const v = Math.sin((2 * Math.PI * (daysAlive + i)) / c.period);
                    const y = midY - v * (plotH / 2);
                    const cmd = i === 0 ? "M" : "L";
                    pts.push(`${cmd}${x.toFixed(1)},${y.toFixed(1)}`);

                    if (i > 0 && i <= 15) {
                        const dTarget = new Date(todayStart.getTime() + i * 86400000);
                        const dStr = `${pad(dTarget.getDate())}/${pad(dTarget.getMonth() + 1)}`;
                        if (Math.abs(v) < 0.13 && criticalDaysList.length < 4) {
                            criticalDaysList.push(`${dStr} (${c.name.split("(")[0].trim()})`);
                        }
                        if (v > 0.94 && peakDaysList.length < 4) {
                            peakDaysList.push(`${dStr} (${c.name.split("(")[0].trim()})`);
                        }
                    }
                }
                return `<path class="util-bio-wave-path" d="${pts.join(" ")}" fill="none" stroke="${c.color}" stroke-width="2.8" stroke-linecap="round" />`;
            })
            .join("");

        const container = document.getElementById("bio-svg-container");
        if (container) {
            container.innerHTML = `
                <svg viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="Biểu đồ Nhịp sinh học 30 ngày tới">
                    <line x1="${leftPad}" y1="${topPad}" x2="${svgW - rightPad}" y2="${topPad}" stroke="var(--border-color)" stroke-dasharray="4 4" />
                    <line x1="${leftPad}" y1="${midY}" x2="${svgW - rightPad}" y2="${midY}" stroke="var(--text-muted)" stroke-width="1.2" />
                    <line x1="${leftPad}" y1="${topPad + plotH}" x2="${svgW - rightPad}" y2="${topPad + plotH}" stroke="var(--border-color)" stroke-dasharray="4 4" />
                    <line x1="${leftPad}" y1="${topPad - 10}" x2="${leftPad}" y2="${topPad + plotH + 10}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 3" />

                    <text x="${leftPad - 10}" y="${topPad + 4}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-muted)">+100%</text>
                    <text x="${leftPad - 10}" y="${midY + 4}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-muted)">0%</text>
                    <text x="${leftPad - 10}" y="${topPad + plotH + 4}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-muted)">-100%</text>
                    <text x="${leftPad + 8}" y="${topPad - 10}" font-size="11.5" font-weight="800" fill="#ef4444">Hôm nay (${pad(now.getDate())}/${pad(now.getMonth() + 1)})</text>

                    ${pathsHtml}
                </svg>
            `;
        }

        const avgPct = Math.round(totalPct / 4);
        const insightsEl = document.getElementById("bio-insights-grid");
        if (insightsEl) {
            insightsEl.innerHTML = `
                <article class="util-bento-item is-current-highlight">
                    <div class="util-bento-item__top">
                        <span class="util-bento-item__icon-box">
                            <img src="./assets/icons/sparkle.svg" alt="" aria-hidden="true" />
                        </span>
                        <span class="util-bento-item__badge">Chỉ Số Tổng Hợp Hôm Nay</span>
                    </div>
                    <div class="util-bento-item__body">
                        <strong class="util-bento-item__title">Mức Năng Lượng Trung Bình: ${avgPct > 0 ? `+${avgPct}%` : `${avgPct}%`}</strong>
                        <span class="util-bento-item__sub">Đã sống: ${daysAlive.toLocaleString("vi-VN")} ngày tính từ ngày sinh</span>
                    </div>
                    <p class="util-bento-item__desc">
                        ${
                            avgPct >= 20
                                ? "Tổng hòa 4 chu kỳ đang ở pha Dương tích cực. Rất thuận lợi để giải quyết các công việc đòi hỏi sự tập trung và ra quyết định quan trọng."
                                : "Cơ thể đang trong giai đoạn điều hòa và tích lũy nội lực. Hãy phân bổ thời gian làm việc vừa sức và ưu tiên giấc ngủ sâu."
                        }
                    </p>
                </article>

                <article class="util-bento-item">
                    <div class="util-bento-item__top">
                        <span class="util-bento-item__icon-box">
                            <img src="./assets/icons/calendarCheck.svg" alt="" aria-hidden="true" />
                        </span>
                        <span class="util-bento-item__badge">Dự Báo 15 Ngày Tới</span>
                    </div>
                    <div class="util-bento-item__body">
                        <strong class="util-bento-item__title">Cảnh Báo Ngày Giao Điểm (0%) &amp; Đỉnh Cao</strong>
                        <span class="util-bento-item__sub">Ngày Giao Điểm: ${criticalDaysList.join(", ") || "Không có"}</span>
                    </div>
                    <p class="util-bento-item__desc">
                        🌟 <strong>Các ngày đạt đỉnh (+100%):</strong> ${peakDaysList.join(", ") || "Đang tiến dần lên đỉnh"}. Vào Ngày Giao Điểm (khi đường sóng cắt trục 0%), bạn nên tránh làm việc quá sức hoặc tranh luận căng thẳng.
                    </p>
                </article>
            `;
        }
    };

    // ==================== MỤC 10: TỪ ĐIỂN CỔ HỌC (ĐỒNG BỘ TRANG DAY + ICON ĐỘNG + TOOLTIP + MODAL) ====================
    const FENGSHUI_DICT = [
        [
            "Hải Trung Kim",
            "Giáp Tý, Ất Sửu",
            "fs-napam",
            "./assets/icons/metal.svg",
            false,
            "Vàng dưới biển — Nội lực tiềm ẩn, sâu sắc, điềm tĩnh và bền bỉ.",
            "Thổ sinh Kim, Kim sinh Thủy. Hợp màu trắng, bạc, vàng ánh kim; phương vị Chính Tây, Tây Bắc.",
        ],
        [
            "Lư Trung Hỏa",
            "Bính Dần, Đinh Mão",
            "fs-napam",
            "./assets/icons/fire.svg",
            false,
            "Lửa trong lò — Nhiệt huyết được tôi luyện, ấm áp và kiên định.",
            "Mộc sinh Hỏa, Hỏa sinh Thổ. Hợp màu đỏ chu sa, cam ấm, tím; phương vị Chính Nam.",
        ],
        [
            "Đại Lâm Mộc",
            "Mậu Thìn, Kỷ Tỵ",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Gỗ rừng già — Vững chãi, che chở, nhân hậu và giàu sức sống.",
            "Thủy sinh Mộc, Mộc sinh Hỏa. Hợp màu xanh lục bảo, xanh lá; phương vị Chính Đông, Đông Nam.",
        ],
        [
            "Lộ Bàng Thổ",
            "Canh Ngọ, Tân Mùi",
            "fs-napam",
            "./assets/icons/earth.svg",
            false,
            "Đất ven đường — Bằng phẳng, gắn kết giao thương và thực tế.",
            "Hỏa sinh Thổ, Thổ sinh Kim. Hợp màu vàng đất, nâu trầm; phương vị Trung Cung, Đông Bắc, Tây Nam.",
        ],
        [
            "Kiếm Phong Kim",
            "Nhâm Thân, Quý Dậu",
            "fs-napam",
            "./assets/icons/metal.svg",
            false,
            "Vàng mũi kiếm — Sắc bén, quyết đoán, bản lĩnh và mạnh mẽ.",
            "Hợp mệnh Thủy, Thổ, Kim. Rất tốt cho các ngành kỹ thuật, tài chính, công nghệ và quản trị.",
        ],
        [
            "Giản Hạ Thủy",
            "Bính Tý, Đinh Sửu",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước dưới khe — Dòng chảy ngầm tĩnh lặng, tinh tế và linh hoạt.",
            "Kim sinh Thủy, Thủy sinh Mộc. Hợp màu xanh đại dương, đen; phương vị Chính Bắc.",
        ],
        [
            "Tuyền Trung Thủy",
            "Giáp Thân, Ất Dậu",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước trong suối — Nguồn nước mát lành, trí tuệ và dồi dào.",
            "Hợp mệnh Mộc, Kim, Thủy. Thuận lợi cho nghiên cứu, học thuật, ngoại giao và thương mại.",
        ],
        [
            "Tùng Bách Mộc",
            "Canh Dần, Tân Mão",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Gỗ tùng bách — Bất khuất trước gió sương, trường thọ và chính trực.",
            "Hợp mệnh Hỏa, Thủy, Mộc. Đại diện cho ý chí kiên cường và uy tín bền vững.",
        ],
        [
            "Trường Lưu Thủy",
            "Nhâm Thìn, Quý Tỵ",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước chảy dài — Kiên trì, vươn xa biển lớn và không ngừng vận động.",
            "Hợp mệnh Mộc, Kim, Thủy. Tốt cho mở rộng quy mô, đầu tư dài hạn và logistics.",
        ],
        [
            "Bình Địa Mộc",
            "Mậu Tuất, Kỷ Hợi",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Cây đất bằng — Ôn hòa, phát triển thuận lợi và dễ kết giao.",
            "Hợp mệnh Hỏa, Thủy, Mộc. Thuận lợi cho hợp tác đội nhóm, kiến trúc, giáo dục.",
        ],
        [
            "Thiên Hà Thủy",
            "Bính Ngọ, Đinh Mùi",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước mưa trên trời — Thanh khiết, rộng lớn và nuôi dưỡng vạn vật.",
            "Hợp mệnh Mộc, Kim, Thủy. Mang lại phúc khí, sự hài hòa và tầm nhìn rộng mở.",
        ],
        [
            "Cung Đại An",
            "Khổng Minh Lục Diệu • Đại Cát",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-daian.svg",
            true,
            "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên ổn.",
            "Rất hợp để khởi sự việc quan trọng, ký kết hợp đồng, xuất hành hoặc cầu bình an.",
        ],
        [
            "Cung Lưu Niên",
            "Khổng Minh Lục Diệu • Thận Trọng",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-luunien.svg",
            true,
            "Mưu sự dễ chậm trễ, cầu lộc chưa thông; cần đề phòng khẩu thiệt.",
            "Nên ưu tiên xử lý việc tồn đọng, rà soát kỹ hồ sơ pháp lý và tránh vội vàng.",
        ],
        [
            "Cung Tốc Hỷ",
            "Khổng Minh Lục Diệu • Cát Tinh",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-tochy.svg",
            true,
            "Tin vui đến nhanh, mưu sự đại cát, thuận lợi cho gặp gỡ, ký kết.",
            "Thời điểm vàng để thương thảo, khai trương, ra mắt sản phẩm và kết nối quý nhân.",
        ],
        [
            "Cung Xích Khẩu",
            "Khổng Minh Lục Diệu • Khẩu Thiệt",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-xichkhau.svg",
            true,
            "Dễ xảy ra bất đồng lời ăn tiếng nói; nên cẩn trọng hợp đồng.",
            "Giữ thái độ hòa nhã trong giao tiếp, hạn chế tranh luận gay gắt.",
        ],
        [
            "Cung Tiểu Cát",
            "Khổng Minh Lục Diệu • Quý Nhân",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-tieucat.svg",
            true,
            "Cát lành, hòa hợp, mưu sự suôn sẻ và rất dễ gặp người giúp đỡ.",
            "Thuận lợi cho giao dịch tài chính, mở hàng, cầu tài lộc và vun đắp đối tác.",
        ],
        [
            "Cung Không Vong",
            "Khổng Minh Lục Diệu • Tránh Việc Lớn",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-khongvong.svg",
            true,
            "Cầu tài chưa lợi; mưu sự lớn dễ hao tổn công sức.",
            "Thích hợp nghỉ ngơi, học tập, lập kế hoạch nội bộ hoặc làm việc thiện nguyện.",
        ],
        [
            "Quẻ Càn",
            "Bát Quái • Hướng Tây Bắc (Hành Kim)",
            "fs-bagua",
            "./assets/icons/zodiac/dog.svg",
            true,
            "Tượng trưng cho Trời lớn, cương kiện, uy quyền, người đứng đầu và sự chính trực.",
            "Phương vị Tây Bắc (Hành Kim). Hợp cầu công danh, lãnh đạo và hoạch định chiến lược.",
        ],
        [
            "Quẻ Khảm",
            "Bát Quái • Hướng Chính Bắc (Hành Thủy)",
            "fs-bagua",
            "./assets/icons/zodiac/mouse.svg",
            true,
            "Tượng trưng cho Nước sâu, trí tuệ uyên bác, sự linh hoạt vượt qua hiểm trở.",
            "Phương vị Chính Bắc (Hành Thủy). Hợp nghiên cứu, học thuật, giao thương và tĩnh tâm.",
        ],
        [
            "Quẻ Cấn",
            "Bát Quái • Hướng Đông Bắc (Hành Thổ)",
            "fs-bagua",
            "./assets/icons/zodiac/tiger.svg",
            true,
            "Tượng trưng cho Núi cao vững chãi, sự tĩnh tâm và tích lũy nội lực.",
            "Phương vị Đông Bắc (Hành Thổ). Hợp tu dưỡng, củng cố nền tảng và bảo toàn tài sản.",
        ],
        [
            "Quẻ Chấn",
            "Bát Quái • Hướng Chính Đông (Hành Mộc)",
            "fs-bagua",
            "./assets/icons/zodiac/cat.svg",
            true,
            "Tượng trưng cho Sấm động mùa xuân, sinh khí bừng tỉnh và khởi đầu mới.",
            "Phương vị Chính Đông (Hành Mộc). Đại lợi cho xuất hành buổi sớm, khởi nghiệp.",
        ],
        [
            "Quẻ Tốn",
            "Bát Quái • Hướng Đông Nam (Hành Mộc)",
            "fs-bagua",
            "./assets/icons/zodiac/dragon.svg",
            true,
            "Tượng trưng cho Gió thuận hiền hòa, giao thương hanh thông và cung Tài Lộc.",
            "Phương vị Đông Nam (Hành Mộc). Rất tốt cho đàm phán, truyền thông và cầu tài.",
        ],
        [
            "Quẻ Ly",
            "Bát Quái • Hướng Chính Nam (Hành Hỏa)",
            "fs-bagua",
            "./assets/icons/zodiac/horse.svg",
            true,
            "Tượng trưng cho Lửa sáng, Mặt trời rực rỡ, văn minh, danh vọng và nhiệt huyết.",
            "Phương vị Chính Nam (Hành Hỏa). Hợp quảng bá thương hiệu, nghệ thuật và tỏa sáng.",
        ],
        [
            "Quẻ Khôn",
            "Bát Quái • Hướng Tây Nam (Hành Thổ)",
            "fs-bagua",
            "./assets/icons/zodiac/goat.svg",
            true,
            "Tượng trưng cho Đất mẹ bao dung, sự nhu thuận và hậu thuẫn vững chắc.",
            "Phương vị Tây Nam (Hành Thổ). Rất tốt cho bất động sản, nhân sự và gia đạo.",
        ],
        [
            "Quẻ Đoài",
            "Bát Quái • Hướng Chính Tây (Hành Kim)",
            "fs-bagua",
            "./assets/icons/zodiac/rooster.svg",
            true,
            "Tượng trưng cho Đầm nước, niềm vui, tài thuyết trình và ngoại giao hài hòa.",
            "Phương vị Chính Tây (Hành Kim). Hợp ngoại giao, thuyết trình và kết nối khách hàng.",
        ],
    ];

    const renderFengShuiDict = (highlightSlug = "") => {
        const grid = document.getElementById("fs-dict-grid");
        const q = (document.getElementById("fs-search-input")?.value || "").trim().toLowerCase();
        if (!grid) return;

        const items = FENGSHUI_DICT.filter(([title, sub, group, , , desc]) => {
            if (q) return `${title} ${sub} ${desc}`.toLowerCase().includes(q);
            if (fsFilterKey !== "fs-all" && group !== fsFilterKey) return false;
            return true;
        });

        grid.innerHTML = items
            .map(([title, sub, , icon, isFiltered, desc, advice]) => {
                const slug = toSlug(title);
                const isSel = highlightSlug && (slug.includes(highlightSlug) || highlightSlug.includes(slug));
                const idx = FENGSHUI_DICT.findIndex((x) => x[0] === title);

                return `
                    <article
                        class="util-bento-item ${isSel ? "is-current-highlight" : ""} has-bento-tooltip"
                        data-fs-idx="${idx}"
                    >
                        <span class="util-bento-item__bg-wrap" aria-hidden="true">
                            <img src="${icon}" alt="" class="util-bento-item__watermark" />
                        </span>
                        <div class="util-bento-item__top">
                            <span class="util-bento-item__icon-box ${isFiltered ? "util-bento-item__icon-box--filtered" : ""}">
                                <img src="${icon}" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-bento-item__badge">Cổ Học Tinh Hoa</span>
                        </div>
                        <div class="util-bento-item__body">
                            <strong class="util-bento-item__title">${title}</strong>
                            <span class="util-bento-item__sub">${sub}</span>
                        </div>
                        <p class="util-bento-item__desc">${desc}</p>
                        <footer class="util-bento-item__foot">
                            <span>Xem luận giải ứng dụng</span>
                            <span aria-hidden="true">&#8594;</span>
                        </footer>
                        ${buildBentoTooltipHtml(title, `${desc} ${advice}`, `✦ Bấm để mở thẻ giải nghĩa ${title}`)}
                    </article>
                `;
            })
            .join("");
    };

    // ==================== ĐIỀU KHIỂN MENU MOBILE, DRAG-TO-SCROLL & DUAL-NAVBAR ====================
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

    const switchCategoryAndSub = (catKey, subKey = "") => {
        activeCat = SUB_NAV_MAP[catKey] ? catKey : "clock";
        const subItems = SUB_NAV_MAP[activeCat] || [];
        activeSub = subKey || (subItems[0]?.id ?? "");

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
                                    href="#${item.id}"
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
        if (currentPanel) {
            if (activeCat === "datediff") {
                dateCalcMode = activeSub === "sub" ? "sub" : "add";
                const diffSub = currentPanel.querySelector('[data-subpanel="diff"]');
                const addSub = currentPanel.querySelector('[data-subpanel="add-sub"]');
                if (diffSub) diffSub.hidden = activeSub !== "diff";
                if (addSub) addSub.hidden = activeSub === "diff";

                const actionWord = dateCalcMode === "sub" ? "trừ" : "cộng";
                setText(
                    "as-panel-title",
                    dateCalcMode === "sub"
                        ? "Trừ Ngày & Tra Cứu Âm Lịch Ngày Đích"
                        : "Cộng Thêm Ngày & Tra Cứu Âm Lịch Ngày Đích",
                );
                setText("as-label-years", `Số năm ${actionWord}`);
                setText("as-label-months", `Số tháng ${actionWord}`);
                setText("as-label-weeks", `Số tuần ${actionWord}`);
                setText("as-label-days", `Số ngày ${actionWord}`);
                computeDateAddSub();
            } else if (activeCat === "fengshui") {
                fsFilterKey = activeSub || "fs-all";
                renderFengShuiDict();
            } else {
                currentPanel.querySelectorAll(".util-subpanel").forEach((sp) => {
                    sp.hidden = sp.dataset.subpanel !== activeSub;
                });
            }
        }

        toggleMobileUtilMenu(true);
    };

    // ==================== KHỞI TẠO TOÀN BỘ TRANG UTILITIES ====================
    const initUtilitiesPage = () => {
        const mainEl = document.getElementById("main");
        if (!mainEl || mainEl.dataset.utilBound === "true") return;
        mainEl.dataset.utilBound = "true";

        bindDragToScrollNav();

        const now = new Date();
        ucDay = now.getDate();
        ucMonth = now.getMonth() + 1;
        ucYear = now.getFullYear();

        // Khởi tạo các Custom Bento Date Pickers cho Mục 7, 8, 9
        ddStartPicker = createBentoDatePicker(
            "dd-start-pickers",
            { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() },
            computeDateDiff,
        );
        ddEndPicker = createBentoDatePicker("dd-end-pickers", { day: 17, month: 2, year: 2027 }, computeDateDiff);
        asBasePicker = createBentoDatePicker(
            "as-base-pickers",
            { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() },
            computeDateAddSub,
        );
        numBirthPicker = createBentoDatePicker(
            "num-birth-pickers",
            { day: 13, month: 1, year: 1987 },
            renderNumerologyPersonal,
        );
        bioBirthPicker = createBentoDatePicker("bio-birth-pickers", { day: 13, month: 1, year: 1987 }, renderBiorhythm);

        renderStopwatchLaps();
        renderAlarmsList();
        renderUcPickers();
        renderInlineConverter();
        renderSolarTermsPanel();
        renderIChingHexagram(ICHING_HEXAGRAMS[2]);
        renderTarotCard(TAROT_CARDS[2], true);
        renderHistoryMonthPicker();
        fetchAndRenderHistory();
        renderHsPickers();
        renderHoroscopeSign(HOROSCOPE_SIGNS[0]);
        computeDateDiff();
        computeDateAddSub();
        renderNumerologyPersonal();
        renderNumerologyMonthCalendar(now.getDate());
        renderBiorhythm();
        renderFengShuiDict();

        // Đọc tham số URL Deep-Link từ day.html / footer.html
        const params = new URLSearchParams(window.location.search);
        const napamParam = params.get("napam");
        const lucdieuParam = params.get("lucdieu") || params.get("direction");
        const baguaParam = params.get("bagua");
        const termParam = params.get("term");
        const tabParam = params.get("tab");

        if (napamParam) {
            switchCategoryAndSub("fengshui", "fs-napam");
            renderFengShuiDict(napamParam);
        } else if (lucdieuParam) {
            switchCategoryAndSub("fengshui", "fs-lucdieu");
            renderFengShuiDict(lucdieuParam);
        } else if (baguaParam) {
            switchCategoryAndSub("fengshui", "fs-bagua");
            renderFengShuiDict(baguaParam);
        } else if (termParam || tabParam === "solarterm") {
            switchCategoryAndSub("solarterm");
        } else if (tabParam === "napam" || tabParam === "lucdieu" || tabParam === "truc-sao") {
            switchCategoryAndSub("fengshui", "fs-all");
        } else {
            switchCategoryAndSub("clock", "stopwatch");
        }

        // Sự kiện điều hướng trên Dual-Navbar & Mobile Menu
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

        // Sự kiện dùng chung cho tất cả nút Bento Stepper (− / +) trên trang
        mainEl.addEventListener("click", (e) => {
            const stepBtn = e.target.closest("[data-step-target]");
            if (!stepBtn) return;
            const inputEl = document.getElementById(stepBtn.dataset.stepTarget);
            if (!inputEl) return;
            const step = Number(stepBtn.dataset.step || 1);
            const min = Number(inputEl.min || 0);
            const max = Number(inputEl.max || 9999);
            const nextVal = Math.min(max, Math.max(min, Number(inputEl.value || 0) + step));
            inputEl.value = String(nextVal);
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        });

        // 1.1. Sự kiện Đồng hồ bấm giờ
        const swStartBtn = document.getElementById("sw-start-btn");
        const swLapBtn = document.getElementById("sw-lap-btn");
        const swResetBtn = document.getElementById("sw-reset-btn");

        if (swStartBtn) {
            swStartBtn.onclick = () => {
                if (!swRunning) {
                    swRunning = true;
                    swStartTime = performance.now() - swElapsedMs;
                    swStartBtn.innerHTML = "<span>&#10074;&#10074; Tạm dừng</span>";
                    if (swLapBtn) swLapBtn.disabled = false;
                    setText("sw-status-tag", "Đang bấm giờ...");
                    setText("sw-head-badge", "Đang chạy");
                    swTimer = setInterval(() => {
                        swElapsedMs = performance.now() - swStartTime;
                        const fmt = formatStopwatch(swElapsedMs);
                        setText("sw-main-display", fmt.main);
                        setText("sw-ms-display", fmt.ms);
                    }, 30);
                } else {
                    swRunning = false;
                    clearInterval(swTimer);
                    swStartBtn.innerHTML = "<span>&#9654; Tiếp tục</span>";
                    setText("sw-status-tag", "Đang tạm dừng");
                    setText("sw-head-badge", "Tạm dừng");
                }
            };
        }

        if (swLapBtn) {
            swLapBtn.onclick = () => {
                if (!swRunning) return;
                const prevTotalMs = swLaps[0]?.totalMs || 0;
                const lapMs = swElapsedMs - prevTotalMs;
                const lapFmt = formatStopwatch(lapMs);
                const totalFmt = formatStopwatch(swElapsedMs);
                swLaps.unshift({
                    idx: swLaps.length + 1,
                    totalMs: swElapsedMs,
                    lapStr: `${lapFmt.main}${lapFmt.ms}`,
                    totalStr: `${totalFmt.main}${totalFmt.ms}`,
                });
                renderStopwatchLaps();
            };
        }

        if (swResetBtn) {
            swResetBtn.onclick = () => {
                swRunning = false;
                clearInterval(swTimer);
                swElapsedMs = 0;
                swLaps = [];
                setText("sw-main-display", "00:00:00");
                setText("sw-ms-display", ".00");
                setText("sw-status-tag", "Sẵn sàng bấm giờ");
                setText("sw-head-badge", "Chuẩn 1/100s");
                if (swStartBtn) swStartBtn.innerHTML = "<span>&#9654; Bắt đầu</span>";
                if (swLapBtn) swLapBtn.disabled = true;
                renderStopwatchLaps();
            };
        }

        // 1.2. Sự kiện Đồng hồ đếm ngược & Upload nhạc từ máy
        const syncCountdownDisplay = (sec) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            setText("cd-display-digits", `${pad(h)}:${pad(m)}:${pad(s)}`);
        };

        ["cd-input-hours", "cd-input-minutes", "cd-input-seconds"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", () => {
                if (cdRunning) return;
                const h = Number(document.getElementById("cd-input-hours")?.value || 0);
                const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
                const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
                cdRemainingSec = Math.max(0, h * 3600 + m * 60 + s);
                syncCountdownDisplay(cdRemainingSec);
            });
        });

        document.querySelectorAll("[data-cd-preset]").forEach((chip) => {
            chip.onclick = () => {
                document
                    .querySelectorAll("[data-cd-preset]")
                    .forEach((c) => c.classList.toggle("is-active", c === chip));
                const total = Number(chip.dataset.cdPreset || 300);
                cdRemainingSec = total;
                const hEl = document.getElementById("cd-input-hours");
                const mEl = document.getElementById("cd-input-minutes");
                const sEl = document.getElementById("cd-input-seconds");
                if (hEl) hEl.value = String(Math.floor(total / 3600));
                if (mEl) mEl.value = String(Math.floor((total % 3600) / 60));
                if (sEl) sEl.value = String(total % 60);
                syncCountdownDisplay(cdRemainingSec);
            };
        });

        const cdAudioInput = document.getElementById("cd-audio-file");
        document.getElementById("cd-upload-sound-btn")?.addEventListener("click", () => cdAudioInput?.click());
        cdAudioInput?.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            customCountdownAudioUrl = URL.createObjectURL(file);
            setText("cd-sound-file-label", `🎵 ${file.name}`);
            playSoundEffect(customCountdownAudioUrl);
        });

        document.getElementById("cd-test-sound-btn")?.addEventListener("click", () => {
            playSoundEffect(customCountdownAudioUrl);
        });

        const cdStartBtn = document.getElementById("cd-start-btn");
        if (cdStartBtn) {
            cdStartBtn.onclick = () => {
                stopCurrentAudio();
                if (!cdRunning) {
                    const h = Number(document.getElementById("cd-input-hours")?.value || 0);
                    const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
                    const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
                    const title = document.getElementById("cd-input-title")?.value || "Đồng hồ đếm ngược";
                    if (!cdTimer) cdRemainingSec = Math.max(1, h * 3600 + m * 60 + s);

                    cdRunning = true;
                    setText("cd-active-title-label", title);
                    setText("cd-status-badge", "Đang đếm ngược");
                    cdStartBtn.innerHTML = "<span>&#10074;&#10074; Tạm dừng hẹn giờ</span>";

                    cdHistory.unshift({
                        idx: cdHistory.length + 1,
                        title,
                        duration: `${pad(h)}:${pad(m)}:${pad(s)}`,
                        startedAt: new Date().toLocaleTimeString("vi-VN"),
                    });
                    const histBody = document.getElementById("cd-history-body");
                    if (histBody) {
                        histBody.innerHTML = cdHistory
                            .map(
                                (item) => `
                                    <div class="util-data-table__row util-data-table__row--4cols" role="row">
                                        <span>#${pad(item.idx)}</span>
                                        <strong>${item.title}</strong>
                                        <span>${item.duration}</span>
                                        <span>${item.startedAt}</span>
                                    </div>
                                `,
                            )
                            .join("");
                    }

                    cdTimer = setInterval(() => {
                        cdRemainingSec = Math.max(0, cdRemainingSec - 1);
                        syncCountdownDisplay(cdRemainingSec);
                        if (cdRemainingSec <= 0) {
                            clearInterval(cdTimer);
                            cdTimer = null;
                            cdRunning = false;
                            cdStartBtn.innerHTML = "<span>&#9654; Bắt đầu hẹn giờ</span>";
                            setText("cd-status-badge", "🔔 Đã hết giờ!");
                            playSoundEffect(customCountdownAudioUrl);
                        }
                    }, 1000);
                } else {
                    cdRunning = false;
                    clearInterval(cdTimer);
                    cdStartBtn.innerHTML = "<span>&#9654; Tiếp tục hẹn giờ</span>";
                    setText("cd-status-badge", "Tạm dừng");
                }
            };
        }

        document.getElementById("cd-reset-btn")?.addEventListener("click", () => {
            stopCurrentAudio();
            cdRunning = false;
            clearInterval(cdTimer);
            cdTimer = null;
            const h = Number(document.getElementById("cd-input-hours")?.value || 0);
            const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
            const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
            cdRemainingSec = h * 3600 + m * 60 + s;
            syncCountdownDisplay(cdRemainingSec);
            if (cdStartBtn) cdStartBtn.innerHTML = "<span>&#9654; Bắt đầu hẹn giờ</span>";
            setText("cd-status-badge", "Đang chờ");
        });

        // 1.3. Sự kiện Đồng hồ báo thức (Upload nhạc + Toggle + Snooze + Icon Thùng Rác SVG)
        const alAudioInput = document.getElementById("al-audio-file");
        document.getElementById("al-upload-sound-btn")?.addEventListener("click", () => alAudioInput?.click());
        alAudioInput?.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            customAlarmAudioUrl = URL.createObjectURL(file);
            setText("al-sound-file-label", `🎵 ${file.name}`);
            playSoundEffect(customAlarmAudioUrl);
        });

        document.getElementById("al-test-sound-btn")?.addEventListener("click", () => {
            playSoundEffect(customAlarmAudioUrl);
        });

        document.getElementById("al-repeat-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-al-repeat]");
            if (!btn) return;
            e.stopPropagation();
            const val = btn.dataset.alRepeat;
            const textEl = document.getElementById("al-repeat-text");
            if (textEl) {
                textEl.textContent = val;
                textEl.dataset.repeatVal = val;
            }
            document.querySelectorAll("[data-al-repeat]").forEach((b) => b.classList.toggle("is-selected", b === btn));
            document.getElementById("al-repeat-dropdown")?.removeAttribute("open");
        });

        document.getElementById("al-add-btn")?.addEventListener("click", () => {
            const hour = Math.min(23, Math.max(0, Number(document.getElementById("al-input-hour")?.value || 6)));
            const minute = Math.min(59, Math.max(0, Number(document.getElementById("al-input-minute")?.value || 30)));
            const title = document.getElementById("al-input-title")?.value || "Dậy học bài";
            const repeat = document.getElementById("al-repeat-text")?.dataset.repeatVal || "Hằng ngày";
            alarmsList.push({ id: Date.now(), hour, minute, title, repeat, enabled: true });
            renderAlarmsList();
        });

        document.getElementById("al-list-container")?.addEventListener("click", (e) => {
            const toggleBtn = e.target.closest("[data-toggle-alarm]");
            if (toggleBtn) {
                const id = Number(toggleBtn.dataset.toggleAlarm);
                alarmsList = alarmsList.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
                renderAlarmsList();
                return;
            }
            const delBtn = e.target.closest("[data-del-alarm]");
            if (delBtn) {
                const id = Number(delBtn.dataset.delAlarm);
                alarmsList = alarmsList.filter((a) => a.id !== id);
                renderAlarmsList();
            }
        });

        document.getElementById("al-stop-ring-btn")?.addEventListener("click", () => {
            stopCurrentAudio();
            const banner = document.getElementById("al-ringing-banner");
            if (banner) banner.hidden = true;
        });

        document.getElementById("al-snooze-btn")?.addEventListener("click", () => {
            stopCurrentAudio();
            const banner = document.getElementById("al-ringing-banner");
            if (banner) banner.hidden = true;
            const snoozeTime = new Date(Date.now() + 5 * 60000);
            alarmsList.push({
                id: Date.now(),
                hour: snoozeTime.getHours(),
                minute: snoozeTime.getMinutes(),
                title: "Báo lại sau 5 phút (Snooze)",
                repeat: "Chỉ một lần",
                enabled: true,
            });
            renderAlarmsList();
        });

        setInterval(() => {
            const cur = new Date();
            setText(
                "al-live-clock-pill",
                `Giờ hiện tại: ${pad(cur.getHours())}:${pad(cur.getMinutes())}:${pad(cur.getSeconds())}`,
            );
            if (cur.getSeconds() === 0) {
                alarmsList.forEach((a) => {
                    if (a.enabled && a.hour === cur.getHours() && a.minute === cur.getMinutes()) {
                        const banner = document.getElementById("al-ringing-banner");
                        if (banner) banner.hidden = false;
                        setText("al-ringing-title", `${pad(a.hour)}:${pad(a.minute)} — ${a.title}`);
                        playSoundEffect(customAlarmAudioUrl);
                    }
                });
            }
        }, 1000);

        // 2. Sự kiện Mục 2: Đổi Ngày Custom Bento Pickers
        document.getElementById("uc-day-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-day]");
            if (!btn) return;
            e.stopPropagation();
            ucDay = Number(btn.dataset.ucDay);
            document.getElementById("uc-day-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-month]");
            if (!btn) return;
            e.stopPropagation();
            ucMonth = Number(btn.dataset.ucMonth);
            document.getElementById("uc-month-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-year-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-year]");
            if (!btn) return;
            e.stopPropagation();
            ucYear = Number(btn.dataset.ucYear);
            document.getElementById("uc-year-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-year-prev-range")?.addEventListener("click", (e) => {
            e.stopPropagation();
            ucYearStart -= 12;
            renderUcPickers();
        });

        document.getElementById("uc-year-next-range")?.addEventListener("click", (e) => {
            e.stopPropagation();
            ucYearStart += 12;
            renderUcPickers();
        });

        document.getElementById("uc-mode-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-mode]");
            if (!btn) return;
            e.stopPropagation();
            ucMode = btn.dataset.ucMode;
            document.querySelectorAll("[data-uc-mode]").forEach((b) => b.classList.toggle("is-selected", b === btn));
            document.getElementById("uc-mode-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-today-btn")?.addEventListener("click", () => {
            const t = new Date();
            ucDay = t.getDate();
            ucMonth = t.getMonth() + 1;
            ucYear = t.getFullYear();
            ucYearStart = Math.floor(ucYear / 12) * 12 - 4;
            ucMode = "solar2lunar";
            renderUcPickers();
            renderInlineConverter();
        });

        // 3. Sự kiện Mục 3: 24 Tiết Khí
        document.getElementById("st-prev-year")?.addEventListener("click", () => {
            stViewingYear--;
            renderSolarTermsPanel();
        });
        document.getElementById("st-next-year")?.addEventListener("click", () => {
            stViewingYear++;
            renderSolarTermsPanel();
        });
        document.getElementById("st-current-year")?.addEventListener("click", () => {
            stViewingYear = new Date().getFullYear();
            renderSolarTermsPanel();
        });
        document.getElementById("st-season-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-st-season]");
            if (!btn) return;
            stSeasonFilter = btn.dataset.stSeason;
            document.querySelectorAll("[data-st-season]").forEach((b) => b.classList.toggle("is-active", b === btn));
            renderSolarTermsPanel();
        });

        // 4. Sự kiện Mục 4: Kinh Dịch (Mouse Entropy + Đồng xu 3D) & Tarot
        document.getElementById("panel-divination")?.addEventListener("mousemove", (e) => {
            mouseMoveCount++;
            mouseEntropyAccumulator =
                (mouseEntropyAccumulator ^
                    ((e.clientX * 31 + e.clientY * 17 + Math.floor(performance.now())) & 0xffffff)) >>>
                0;
            const pct = Math.min(100, 60 + (mouseMoveCount % 41));
            setText("ic-entropy-text", `Độ hội tụ năng lượng tương tác chuột: ${pct}%`);
            const bar = document.getElementById("ic-entropy-bar");
            if (bar) bar.style.width = `${pct}%`;
        });

        document.getElementById("ic-cast-btn")?.addEventListener("click", (e) => {
            const coins = document.querySelectorAll("#ic-coins-stage .util-coin");
            const resultBox = document.getElementById("ic-result-box");
            coins.forEach((c) => c.classList.add("is-tossing"));
            resultBox?.classList.add("is-sliding");

            const clickEntropy = (e.clientX * 73 + e.clientY * 37 + Math.floor(performance.now() * 100)) >>> 0;
            const combinedSeed = (mouseEntropyAccumulator ^ clickEntropy ^ Math.floor(Math.random() * 100000)) >>> 0;
            const chosenIdx = combinedSeed % ICHING_HEXAGRAMS.length;

            let stepCount = 0;
            const slideTimer = setInterval(() => {
                stepCount++;
                renderIChingHexagram(ICHING_HEXAGRAMS[(chosenIdx + stepCount) % ICHING_HEXAGRAMS.length]);
            }, 140);

            setTimeout(() => {
                clearInterval(slideTimer);
                coins.forEach((c) => c.classList.remove("is-tossing"));
                resultBox?.classList.remove("is-sliding");
                renderIChingHexagram(ICHING_HEXAGRAMS[chosenIdx]);
            }, 900);
        });

        const triggerTarotDraw = (fanIdx = -1) => {
            document.querySelectorAll("#tr-deck-fan .util-tarot-back").forEach((b, idx) => {
                b.classList.toggle("is-picked", idx === fanIdx);
            });
            const seed = (mouseEntropyAccumulator + Date.now() + (fanIdx >= 0 ? fanIdx * 19 : 0)) % TAROT_CARDS.length;
            const isUpright = Math.random() > 0.22;
            renderTarotCard(TAROT_CARDS[seed], isUpright);
        };

        document.getElementById("tr-draw-btn")?.addEventListener("click", () => {
            triggerTarotDraw(Math.floor(Math.random() * 7));
        });

        document.getElementById("tr-deck-fan")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-fan-idx]");
            if (!btn) return;
            triggerTarotDraw(Number(btn.dataset.fanIdx));
        });

        // 5. Sự kiện Mục 5: Ngày Này Năm Xưa
        document.getElementById("hi-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hi-month]");
            if (!btn) return;
            e.stopPropagation();
            hiMonth = Number(btn.dataset.hiMonth);
            hiPage = 1;
            document.getElementById("hi-month-dropdown")?.removeAttribute("open");
            renderHistoryMonthPicker();
            fetchAndRenderHistory();
        });

        document.getElementById("hi-scope-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hi-scope]");
            if (!btn) return;
            hiScope = btn.dataset.hiScope;
            hiPage = 1;
            document.querySelectorAll("[data-hi-scope]").forEach((b) => b.classList.toggle("is-active", b === btn));
            fetchAndRenderHistory();
        });

        document.getElementById("hi-pagination")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hi-page]");
            if (!btn) return;
            hiPage = Number(btn.dataset.hiPage);
            fetchAndRenderHistory();
        });

        // 6. Sự kiện Mục 6: Horoscope
        document.getElementById("hs-day-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hs-day]");
            if (!btn) return;
            e.stopPropagation();
            hsDay = Number(btn.dataset.hsDay);
            document.getElementById("hs-day-dropdown")?.removeAttribute("open");
            renderHsPickers();
            renderHoroscopeSign(getSignByMonthDay(hsMonth, hsDay));
        });

        document.getElementById("hs-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hs-month]");
            if (!btn) return;
            e.stopPropagation();
            hsMonth = Number(btn.dataset.hsMonth);
            document.getElementById("hs-month-dropdown")?.removeAttribute("open");
            renderHsPickers();
            renderHoroscopeSign(getSignByMonthDay(hsMonth, hsDay));
        });

        // 7 & 10. Sự kiện Cộng/Trừ ngày & Tìm kiếm Từ điển
        ["as-years", "as-months", "as-weeks", "as-days"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", computeDateAddSub);
        });

        document.getElementById("as-today-btn")?.addEventListener("click", () => {
            const t = new Date();
            asBasePicker?.setState({ day: t.getDate(), month: t.getMonth() + 1, year: t.getFullYear() });
            computeDateAddSub();
        });

        document.getElementById("fs-search-input")?.addEventListener("input", () => renderFengShuiDict());

        // ==================== ỦY QUYỀN SỰ KIỆN CLICK MỞ SINGLETON MODAL (#util-detail-modal) ====================
        mainEl.addEventListener("click", (e) => {
            // 1. Click vào Card ở Tab Đổi Ngày
            const convCard = e.target.closest("[data-conv-card]");
            if (convCard && lastConvertedContext) {
                const { info, sDay, sMonth, sYear, isoDate } = lastConvertedContext;
                openUtilModal({
                    category: "Đổi Ngày Âm ⇄ Dương",
                    title: `Ngày ${pad(sDay)}/${pad(sMonth)}/${sYear} DL (${pad(info.lunarDay)}/${pad(info.lunarMonth)} ÂL)`,
                    visualHtml: `<img src="./assets/icons/zodiac/${info.zodiacFile}.svg" alt="" /><strong>Ngày ${info.dayCanChi}</strong>`,
                    isFilteredVisual: true,
                    pills: [info.yearCanChi, info.dayNapAm, `Tiết ${info.solarTerm}`],
                    desc: `Ngày ${pad(sDay)}/${pad(sMonth)}/${sYear} Dương lịch nhằm ngày ${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear} Âm lịch (Năm ${info.yearCanChi}, Tháng ${info.monthCanChi}, Ngày ${info.dayCanChi}).`,
                    advice: `Trực ${info.trucObj.name}: ${info.trucObj.desc} • 6 Giờ Hoàng Đạo: ${info.goodHoursStr}.`,
                    actionHref: `./day.html?date=${isoDate}`,
                    actionLabel: "Mở trang Chi tiết Ngày này",
                });
                return;
            }

            // 2. Click vào Card ở Tab 24 Tiết Khí
            const stCard = e.target.closest("[data-st-idx]");
            if (stCard) {
                const item = SOLAR_TERMS_DATA[Number(stCard.dataset.stIdx)];
                if (!item) return;
                const [name, ddmm, timeStr, seasonKey, , icon, desc, advice] = item;
                openUtilModal({
                    category: "Nhị Thập Tứ Tiết Khí",
                    title: `Tiết ${name} (${ddmm}/${stViewingYear})`,
                    visualHtml: `<img src="./assets/icons/weather/${icon}" alt="" /><strong>${SEASON_VN[seasonKey]}</strong>`,
                    isFilteredVisual: true,
                    pills: [`Khởi tiết: ${timeStr}`, SEASON_VN[seasonKey], `Năm ${stViewingYear}`],
                    desc,
                    advice,
                    actionHref: `./day.html?date=${stViewingYear}-${ddmm.split("/")[1]}-${ddmm.split("/")[0]}`,
                    actionLabel: `Xem lịch ngày ${ddmm}/${stViewingYear}`,
                });
                return;
            }

            // 3. Click vào Card ở Tab Ngày Này Năm Xưa (Mở Smart Media Slideshow + Link Detail Tab mới)
            const hiCard = e.target.closest("[data-hi-idx]");
            if (hiCard) {
                const item = currentHiFilteredList[Number(hiCard.dataset.hiIdx)];
                if (!item) return;
                const rawSlug = String(item.image_slug || item.slug || "").trim();
                const cleanFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
                const cleanSlug = rawSlug
                    .split("/")
                    .pop()
                    .replace(/\.(jpg|jpeg|png|webp)$/i, "");
                const typeFolder = String(item.category_id || "")
                    .toLowerCase()
                    .includes("event")
                    ? "events"
                    : "figures";
                const coverUrl = `./assets/images/calendar-covers/thang-${hiMonth}/${cleanSlug}.jpg`;
                const slide2 = `./assets/images/${typeFolder}/${cleanFolder}/${cleanFolder}.webp`;
                const slide3 = `./assets/images/${typeFolder}/${cleanFolder}/2.webp`;
                const detailHref = `./detail.html?type=${typeFolder}&folder=${cleanFolder}&slug=${rawSlug}&month=${hiMonth}`;

                openUtilModal({
                    category: `Ngày Này Năm Xưa • ${item.ngay_hien_thi || `Tháng ${hiMonth}`}`,
                    title: item.ten || "Nhân vật & Sự kiện lịch sử",
                    visualHtml: `<img src="./assets/icons/calendarDay.svg" alt="" /><strong>${item.ngay_hien_thi || `Tháng ${hiMonth}`}</strong>`,
                    isFilteredVisual: true,
                    pills: [
                        item.ngay_hien_thi || `Tháng ${hiMonth}`,
                        typeFolder === "events" ? "Sự kiện lịch sử" : "Danh nhân lịch sử",
                    ],
                    box1Title: "Tiểu sử & Bối cảnh lịch sử",
                    desc: item.mo_ta || item.noi_dung || item.hien_thi_nhan_dip || "",
                    box2Title: "Danh ngôn & Dấu ấn thời đại",
                    advice: item.danh_ngon || item.quote || item.hien_thi_nhan_dip || "",
                    actionHref: detailHref,
                    actionLabel: "Đọc bài phân tích toàn văn (Mở trang mới) ↗",
                    actionTarget: "_blank",
                    mediaSlides: [coverUrl, slide2, slide3],
                    videoUrl: item.video_url || "",
                });
                return;
            }

            // 4. Click vào Card ở Tab Horoscope 12 Cung (Hiển thị SVG 128x128 lọc màu Ngũ Hành trong Modal)
            const signCard = e.target.closest("[data-sign-key]");
            if (signCard) {
                const found = HOROSCOPE_SIGNS.find((s) => s.key === signCard.dataset.signKey);
                if (!found) return;
                renderHoroscopeSign(found);
                openUtilModal({
                    category: "Chiêm Tinh Học Horoscope",
                    title: `${found.name} • ${found.mascot}`,
                    visualHtml: `${buildHoroscopeImgHtml(found.key)}<strong>${found.dates}</strong>`,
                    isFilteredVisual: true,
                    pills: [found.dates, found.element, found.mascot],
                    box1Title: "Đặc trưng tính cách & Bản mệnh",
                    desc: found.traits,
                    box2Title: "Thông điệp năng lượng trong ngày",
                    advice: found.daily,
                    actionHref: "./bazi.html",
                    actionLabel: "Đối chiếu thêm Lá Số Bát Tự Phương Đông",
                });
                return;
            }

            // 5. Click vào Ô Số ở Tab Thần Số Học Pythagoras
            const numCell = e.target.closest("[data-num-modal]");
            if (numCell) {
                const num = Number(numCell.dataset.numModal || 1);
                const role = numCell.dataset.numRole || `Con số ${num}`;
                const mObj = NUMEROLOGY_MEANINGS[num] || NUMEROLOGY_MEANINGS[1];
                openUtilModal({
                    category: "Thần Số Học Pythagoras",
                    title: `${role} • ${mObj.title}`,
                    visualHtml: `<strong style="font-size:4.8rem;line-height:1">${num}</strong><strong>Tần số ${num}</strong>`,
                    pills: [role, mObj.title],
                    desc: mObj.desc,
                    advice: mObj.advice,
                    actionHref: "./bazi.html",
                    actionLabel: "Khám phá thêm Bát Tự Tử Bình",
                });
                return;
            }

            // 6. Click vào Thẻ Chỉ Số ở Tab Nhịp Sinh Học
            const bioCard = e.target.closest("[data-bio-key]");
            if (bioCard) {
                const pct = Number(bioCard.dataset.bioPct || 0);
                const title = bioCard.querySelector(".util-bio-stat-card__head span")?.textContent || "Nhịp sinh học";
                const tipDesc = bioCard.querySelector(".bento-tooltip__desc")?.textContent || "";
                openUtilModal({
                    category: "Nhịp Sinh Học Biorhythm",
                    title: `${title}: ${pct > 0 ? `+${pct}%` : `${pct}%`}`,
                    visualHtml: `<strong style="font-size:3.8rem">${pct > 0 ? `+${pct}%` : `${pct}%`}</strong><strong>Hôm nay</strong>`,
                    pills: [title, pct >= 0 ? "Pha Dương (Phát tiết)" : "Pha Âm (Tích lũy)"],
                    desc: tipDesc,
                    advice:
                        Math.abs(pct) <= 12
                            ? "Hôm nay chỉ số này đang đi qua vùng Giao Điểm (0%). Bạn nên làm việc điều độ, tránh căng thẳng và nghỉ ngơi sớm."
                            : pct > 0
                              ? "Chỉ số đang ở nửa chu kỳ cao. Hãy tận dụng nguồn năng lượng này cho các hoạt động trọng tâm."
                              : "Chỉ số đang ở pha nạp lại năng lượng. Thích hợp duy trì nhịp độ ổn định và bồi dưỡng sức khỏe.",
                    actionHref: "./day.html",
                    actionLabel: "Xem thêm Giờ Hoàng Đạo hôm nay",
                });
                return;
            }

            // 7. Click vào Thẻ ở Tab Từ Điển Cổ Học
            const fsCard = e.target.closest("[data-fs-idx]");
            if (fsCard) {
                const item = FENGSHUI_DICT[Number(fsCard.dataset.fsIdx)];
                if (!item) return;
                const [title, sub, , icon, isFiltered, desc, advice] = item;
                openUtilModal({
                    category: "Từ Điển Bách Khoa Phong Thủy",
                    title,
                    visualHtml: `<img src="${icon}" alt="" /><strong>${sub.split("•")[0].trim()}</strong>`,
                    isFilteredVisual: Boolean(isFiltered),
                    pills: [sub, "Cổ Học Tinh Hoa"],
                    desc,
                    advice,
                    actionHref: "./bazi.html",
                    actionLabel: "Phân tích chuyên sâu trên Bàn Bát Tự",
                });
            }
        });

        document.getElementById("util-modal-close")?.addEventListener("click", closeUtilModal);
        document.getElementById("util-modal-cancel")?.addEventListener("click", closeUtilModal);
        document.getElementById("util-modal-backdrop")?.addEventListener("click", closeUtilModal);

        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("util-detail-modal");
            if (e.key === "Escape" && modal && !modal.hidden) closeUtilModal();
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUtilitiesPage);
    } else {
        initUtilitiesPage();
    }
    window.addEventListener("template-loaded", initUtilitiesPage);
})();

// hỏi lại quá trình copy đợt 2 cụ thể, hỏi lại svg card cung có kích thước? và tarot?
// copy utilities đợt 2 rồi, xem lại html và scss đợt 2 vì chua copy đợt 2.
