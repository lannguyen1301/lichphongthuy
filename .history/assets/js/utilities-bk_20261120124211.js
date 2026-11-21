// assets/js/utilities.js
// BẢN HOÀN THIỆN FULL: Fix F5 giữ nguyên Tab (URL Hash 2 chiều) + Kinh Dịch 64 Quẻ (3 Xu SVG 3D + Lưới tra cứu) +
// Tarot 78 Lá (Quạt bài + Lật 3D) + Horoscope 12 Cung SVG 128x128 + Singleton Modal + Full Keyboard a11y
(() => {
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";
    const TAROT_IMG_DIR = "./assets/images/tarot";
    const TAROT_IMG_EXT = "png"; // Khi đổi sang WebP chỉ cần sửa "png" -> "webp"
    const ICHING_ICON_DIR = "./assets/icons/iching";
    const HOROSCOPE_ICON_DIR = "./assets/icons/horoscope";

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

    const fetchJsonSafe = async (url, fallback) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return fallback;
            const data = await res.json();
            return Array.isArray(data) && data.length ? data : fallback;
        } catch (err) {
            return fallback;
        }
    };

    const playBellChime = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
                gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.14);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.45);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.14);
                osc.stop(ctx.currentTime + idx * 0.14 + 0.45);
            });
        } catch (e) {
            // Bỏ qua nếu trình duyệt chặn tự động phát âm thanh
        }
    };

    // ==================== SINGLETON MODAL (#util-detail-modal) ====================
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
        box2Title = "Lời khuyên ứng dụng",
        advice = "",
        actionHref = "./bazi.html",
        actionLabel = "Đối chiếu trên Bàn Bát Tự",
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

        modal.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("util-modal-close")?.focus();
    };

    // ==================== CẤU HÌNH DUAL-NAVBAR 2 TẦNG & ĐỒNG BỘ URL HASH ====================
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

    // ==================== 1. ĐỒNG HỒ (BẤM GIỜ, ĐẾM NGƯỢC, BÁO THỨC) ====================
    let swTimer = null;
    let swStartTime = 0;
    let swElapsedMs = 0;
    let swRunning = false;
    let swLaps = [];

    let cdTimer = null;
    let cdRemainingSec = 300;
    let cdRunning = false;
    let cdHistory = [];

    let alarmsList = [{ id: 1, hour: 6, minute: 30, title: "Dậy học bài & Tập thể dục", enabled: true }];

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
                    <article class="util-alarm-item" data-alarm-id="${a.id}">
                        <div>
                            <strong class="util-alarm-item__time">${pad(a.hour)}:${pad(a.minute)}</strong>
                            <span class="util-alarm-item__title">${a.title}</span>
                        </div>
                        <button type="button" class="util-alarm-item__del" data-del-alarm="${a.id}">Xóa</button>
                    </article>
                `,
            )
            .join("");
    };

    // ==================== 2. ĐỔI NGÀY TRỰC TIẾP ====================
    const renderInlineConverter = () => {
        const grid = document.getElementById("uc-result-grid");
        if (!grid || !window.LunarEngine) return;

        const dInput = Math.min(
            31,
            Math.max(1, Number(document.getElementById("uc-day")?.value || new Date().getDate())),
        );
        const mInput = Math.min(
            12,
            Math.max(1, Number(document.getElementById("uc-month")?.value || new Date().getMonth() + 1)),
        );
        const yInput = Math.min(
            2100,
            Math.max(1900, Number(document.getElementById("uc-year")?.value || new Date().getFullYear())),
        );
        const mode = document.getElementById("uc-mode")?.value || "solar2lunar";

        let sDay = dInput;
        let sMonth = mInput;
        let sYear = yInput;

        if (mode === "lunar2solar") {
            const conv = window.LunarEngine.convertLunar2Solar(dInput, mInput, yInput, 0);
            if (conv && conv.sDay > 0) {
                sDay = conv.sDay;
                sMonth = conv.sMonth;
                sYear = conv.sYear;
            }
        }

        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);
        grid.innerHTML = `
            <article class="util-item-card is-selected">
                <div class="util-item-card__head">
                    <span class="util-item-card__icon-wrap">
                        <img src="./assets/icons/calendar.svg" alt="" aria-hidden="true" />
                    </span>
                    <span class="util-item-card__tag">Dương Lịch</span>
                </div>
                <strong class="util-item-card__title">${pad(sDay)}/${pad(sMonth)}/${sYear}</strong>
                <span class="util-item-card__sub">${info.bilingualWeekday}</span>
                <p class="util-item-card__desc">Tiết khí: ${info.solarTerm} • Trực: ${info.trucObj.name} (${info.trucObj.short})</p>
            </article>
            <article class="util-item-card is-selected">
                <div class="util-item-card__head">
                    <span class="util-item-card__icon-wrap util-item-card__icon-wrap--filtered">
                        <img src="./assets/icons/zodiac/${info.zodiacFile}.svg" alt="" aria-hidden="true" />
                    </span>
                    <span class="util-item-card__tag">Âm Lịch Tương Ứng</span>
                </div>
                <strong class="util-item-card__title">${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear}</strong>
                <span class="util-item-card__sub">Năm ${info.yearCanChi} • Tháng ${info.monthCanChi} • Ngày ${info.dayCanChi}</span>
                <p class="util-item-card__desc">Nạp âm ngày: ${info.dayNapAm} • Mệnh năm: ${info.yearNapAm}</p>
            </article>
            <article class="util-item-card">
                <div class="util-item-card__head">
                    <span class="util-item-card__icon-wrap">
                        <img src="./assets/icons/${info.elementInfo.icon}" alt="" aria-hidden="true" />
                    </span>
                    <span class="util-item-card__tag">Giờ Hoàng Đạo &amp; Xuất Hành</span>
                </div>
                <strong class="util-item-card__title">Tài Thần: ${info.directions.tai}</strong>
                <span class="util-item-card__sub">Hỷ Thần: ${info.directions.hy} • Tuổi hợp: ${info.ageHarmony.good}</span>
                <p class="util-item-card__desc">6 Giờ Hoàng Đạo: ${info.goodHoursStr}</p>
            </article>
        `;
    };

    // ==================== 3. 24 TIẾT KHÍ ====================
    let stViewingYear = 2026;
    const SOLAR_TERMS_DATA = [
        [
            "Tiểu Hàn",
            "05/01",
            "15:13",
            "term-winter-minor-cold.svg",
            "Chớm lạnh — Khí trời bắt đầu rét đậm, chuẩn bị bước vào giai đoạn lạnh nhất cuối năm.",
        ],
        [
            "Đại Hàn",
            "20/01",
            "08:35",
            "term-winter-major-cold.svg",
            "Rét cực điểm — Tiết khí cuối năm âm lịch, hàn khí đạt đỉnh trước khi mầm xuân trỗi dậy.",
        ],
        [
            "Lập Xuân",
            "04/02",
            "02:50",
            "term-spring.svg",
            "Khởi đầu mùa xuân — Dương khí bừng dậy, cây cối đâm chồi nảy lộc, vạn vật sinh sôi.",
        ],
        [
            "Vũ Thủy",
            "18/02",
            "22:40",
            "term-rain.svg",
            "Mưa xuân — Hơi ẩm tăng dần, mưa phùn ấm áp tưới tắm cho mùa màng tươi tốt.",
        ],
        [
            "Kinh Trập",
            "05/03",
            "20:44",
            "term-thunder.svg",
            "Sấm xuân thức tỉnh — Tiếng sấm đầu mùa vang lên đánh thức vạn vật sau kỳ ngủ đông.",
        ],
        [
            "Xuân Phân",
            "20/03",
            "21:32",
            "term-spring-equinox.svg",
            "Giữa xuân cân bằng — Ngày và đêm dài bằng nhau, âm dương điều hòa.",
        ],
        [
            "Thanh Minh",
            "05/04",
            "01:22",
            "term-spring-clear.svg",
            "Trời trong sáng — Tiết trời quang đãng, gắn liền với truyền thống tảo mộ tri ân tổ tiên.",
        ],
        [
            "Cốc Vũ",
            "20/04",
            "08:24",
            "term-grain-rain.svg",
            "Mưa rào nuôi ngũ cốc — Lượng mưa dồi dào giúp lúa màu phát triển vượt bậc.",
        ],
        [
            "Lập Hạ",
            "05/05",
            "18:30",
            "term-summer-sun.svg",
            "Bắt đầu mùa hạ — Nắng vàng rực rỡ, vạn vật bước vào kỳ trưởng thành mạnh mẽ.",
        ],
        [
            "Tiểu Mãn",
            "21/05",
            "07:23",
            "term-grain.svg",
            "Lúa trổ đòng chắc hạt — Hạt ngũ cốc bắt đầu căng mẩy báo hiệu mùa màng bội thu.",
        ],
        [
            "Mang Chủng",
            "05/06",
            "22:32",
            "term-grain-ear.svg",
            "Lúa chín có râu — Thời điểm thu hoạch vụ chiêm và gieo cấy vụ mùa nhộn nhịp.",
        ],
        [
            "Hạ Chí",
            "21/06",
            "15:10",
            "term-summer-solstice.svg",
            "Đỉnh điểm mùa hạ — Ngày dài nhất trong năm, dương khí đạt cực thịnh.",
        ],
        [
            "Tiểu Thử",
            "07/07",
            "08:45",
            "term-summer-minor-heat.svg",
            "Nóng nhẹ — Khí trời oi bức bắt đầu lan tỏa kèm mưa dông mùa hạ.",
        ],
        [
            "Đại Thử",
            "23/07",
            "02:12",
            "term-summer-major-heat.svg",
            "Nóng oi ả cực độ — Giai đoạn nhiệt độ cao nhất trong năm, hành Hỏa vượng.",
        ],
        [
            "Lập Thu",
            "07/08",
            "18:28",
            "term-autumn-wind.svg",
            "Khởi đầu mùa thu — Gió heo may chớm về, bầu trời cao trong và dịu mát dần.",
        ],
        [
            "Xử Thử",
            "23/08",
            "09:05",
            "term-autumn-cool.svg",
            "Dứt nắng nóng — Cái oi bức mùa hè chấm dứt, nhường chỗ cho tiết trời thu mát mẻ.",
        ],
        [
            "Bạch Lộ",
            "07/09",
            "21:18",
            "term-dew.svg",
            "Sương trắng — Đêm về se lạnh khiến hơi nước ngưng tụ thành giọt sương trên lá.",
        ],
        [
            "Thu Phân",
            "23/09",
            "06:49",
            "term-autumn-day-night.svg",
            "Giữa thu cân bằng — Thời lượng ngày và đêm bằng nhau, tiết trời thu trong trẻo.",
        ],
        [
            "Hàn Lộ",
            "08/10",
            "13:02",
            "term-cold-dew.svg",
            "Sương lạnh — Khí trời chuyển lạnh sâu hơn, sương đêm ngưng tụ dày.",
        ],
        [
            "Sương Giáng",
            "23/10",
            "16:15",
            "term-frost.svg",
            "Sương mù & Giá lạnh — Tiết khí cuối cùng của mùa thu trước khi sang đông.",
        ],
        [
            "Lập Đông",
            "07/11",
            "16:20",
            "term-winter-snow.svg",
            "Bắt đầu mùa đông — Gió mùa đông bắc tràn về, vạn vật thu mình tích trữ năng lượng.",
        ],
        [
            "Tiểu Tuyết",
            "22/11",
            "13:45",
            "term-winter-minor-snow.svg",
            "Tuyết nhẹ / Rét đầu đông — Nhiệt độ giảm thấp, không khí khô lạnh rõ rệt.",
        ],
        [
            "Đại Tuyết",
            "07/12",
            "09:08",
            "term-winter-major-snow.svg",
            "Tuyết dày / Rét đậm — Hàn khí bao phủ mạnh mẽ, đêm dài ngày ngắn.",
        ],
        [
            "Đông Chí",
            "22/12",
            "03:02",
            "term-winter-solstice.svg",
            "Giữa đông — Đêm dài nhất trong năm; từ sau Đông Chí dương khí bắt đầu hồi sinh.",
        ],
    ];

    const renderSolarTermsPanel = () => {
        setText("st-year-title", String(stViewingYear));
        setText("st-year-badge", `Năm ${stViewingYear}`);
        const grid = document.getElementById("st-cards-grid");
        if (!grid) return;

        const curTerm = window.LunarEngine
            ? window.LunarEngine.getFullDayInfo(new Date().getDate(), new Date().getMonth() + 1, stViewingYear)
                  .solarTerm
            : "Lập Đông";

        grid.innerHTML = SOLAR_TERMS_DATA.map(([name, ddmm, timeStr, icon, desc]) => {
            const isCur = name === curTerm;
            return `
                <article class="util-term-card ${isCur ? "is-current-term" : ""}">
                    <div class="util-term-card__top">
                        <span class="util-term-card__icon-box">
                            <img src="./assets/icons/weather/${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                        </span>
                        <div class="util-term-card__date-box">
                            <strong>${ddmm}/${stViewingYear}</strong>
                            <small>Khởi tiết: ${timeStr}</small>
                        </div>
                    </div>
                    <strong class="util-term-card__name">Tiết ${name} ${isCur ? "• Đang vận hành" : ""}</strong>
                    <p class="util-term-card__desc">${desc}</p>
                </article>
            `;
        }).join("");
    };

    // ==================== 4. KINH DỊCH 64 QUẺ (3 XU 3D + LƯỚI 64 QUẺ) & TAROT 78 LÁ 3D ====================
    const getTarotFrontImgUrl = (card) => `${TAROT_IMG_DIR}/${card.suit}/${card.slug}.${TAROT_IMG_EXT}`;
    const getTarotBackImgUrl = () => `${TAROT_IMG_DIR}/back.${TAROT_IMG_EXT}`;
    const getIChingSvgUrl = (hex) => `${ICHING_ICON_DIR}/${hex.slug}.svg`;

    const SUIT_LABEL_VN = {
        major: "Bộ Ẩn Chính • Major Arcana",
        wands: "Bộ Gậy (Hành Hỏa) • Wands",
        swords: "Bộ Kiếm (Hành Khí) • Swords",
        cups: "Bộ Cốc (Hành Nước) • Cups",
        pentacles: "Bộ Tiền (Hành Đất) • Pentacles",
    };

    let mouseEntropyAccumulator = 19870113;
    let isIChingAnimating = false;
    let isTarotAnimating = false;
    let icFortuneFilter = "all";

    let ICHING_HEXAGRAMS = [
        {
            num: 14,
            slug: "14-dai-huu",
            short: "Đại Hữu",
            name: "Hỏa Thiên Đại Hữu (Càn hạ - Ly thượng)",
            trigrams: "Nội quái: Càn (Trời) • Ngoại quái: Ly (Lửa)",
            lines: [1, 1, 1, 1, 0, 1],
            fortune: "Đại Cát",
            judgment:
                "Đại Hữu: Nguyên hanh. Mặt trời tỏa sáng trên trời cao, vạn vật được soi chiếu, phúc lộc sung túc.",
            image: "Lửa ở trên trời là tượng quẻ Đại Hữu; người quân tử ngăn điều ác, nêu cao điều thiện.",
            advice: "Tài vận và uy tín cùng vượng. Rất thuận lợi cho đầu tư dài hạn, xây thương hiệu và kết giao quý nhân.",
        },
    ];

    let TAROT_CARDS = [
        {
            id: 14,
            suit: "major",
            slug: "14-temperance",
            roman: "XIV",
            en: "Temperance",
            vn: "Sự Điều Độ",
            keywords_upright: "Cân bằng, kiên nhẫn, dung hòa hai cực đối lập và mục đích sống rõ ràng.",
            keywords_reversed: "Mất cân bằng, nóng vội, quá đà hoặc xung đột nhịp điệu làm việc.",
            career: "Phối hợp nhịp nhàng giữa các bộ phận và quản trị tài chính cân đối tạo hiệu quả bền vững.",
            msg_upright: "Hãy tìm kiếm sự điều độ và kết hợp hài hòa giữa lý trí sắc bén với trực giác tinh tế.",
            msg_reversed: "Điều chỉnh lại nhịp sinh hoạt và làm việc để tránh căng thẳng kéo dài.",
        },
    ];

    let currentIChingHex = ICHING_HEXAGRAMS[0];
    let currentTarotState = { card: TAROT_CARDS[0], isUpright: true };

    const openIChingModal = (hex) => {
        if (!hex) return;
        openUtilModal({
            category: `Chu Dịch • Quẻ số ${pad(hex.num)}`,
            title: hex.name,
            visualHtml: `
                <img src="${getIChingSvgUrl(hex)}" alt="Đồ hình ${hex.name}" width="70" height="70" decoding="async" />
                <strong>Quẻ ${hex.short || hex.num} • ${hex.fortune || "Chu Dịch"}</strong>
            `,
            isFilteredVisual: true,
            pills: [`Quẻ #${pad(hex.num)}`, hex.fortune || "Chu Dịch", hex.trigrams || "Lục Thập Tứ Quái"],
            box1Title: "Thoán Từ & Tượng Từ",
            desc: `${hex.judgment} ${hex.image}`,
            box2Title: "Diễn giải & Lời khuyên ứng dụng",
            advice: hex.advice,
            actionHref: "./bazi.html",
            actionLabel: "Đối chiếu thêm Lá Số Bát Tự",
        });
    };

    const renderIChingHexagram = (hex) => {
        if (!hex) return;
        currentIChingHex = hex;

        const stageEl = document.getElementById("ic-hex-stage");
        const svgImg = document.getElementById("ic-hex-svg");
        const visual = document.getElementById("ic-lines-visual");

        if (stageEl) {
            stageEl.dataset.hexNum = String(hex.num);
            stageEl.setAttribute("aria-label", `Mở chi tiết Quẻ số ${hex.num}: ${hex.name}`);
        }

        if (svgImg && hex.slug) {
            svgImg.src = getIChingSvgUrl(hex);
            svgImg.alt = `Đồ hình Quẻ số ${hex.num}: ${hex.name}`;
        }

        // Xếp 6 hào hiển thị từ dưới lên trên (delay tăng dần từ Hào 1 ở đáy lên Hào 6 ở đỉnh)
        if (visual && Array.isArray(hex.lines)) {
            visual.innerHTML = [...hex.lines]
                .reverse()
                .map((bit, revIdx) => {
                    const bottomOrder = 5 - revIdx;
                    const delay = (bottomOrder * 0.08).toFixed(2);
                    return bit === 1
                        ? `<div class="util-hex-line util-hex-line--yang" style="animation-delay:${delay}s"><span></span></div>`
                        : `<div class="util-hex-line util-hex-line--yin" style="animation-delay:${delay}s"><span></span><span></span></div>`;
                })
                .join("");
        }

        setText("ic-hex-number", `Quẻ số ${pad(hex.num)} • ${hex.fortune || "Chu Dịch"}`);
        setText("ic-hex-trigrams", hex.trigrams || "");
        setText("ic-hex-name", hex.name);
        setText("ic-hex-judgment", hex.judgment);
        setText("ic-hex-image", hex.image);
        setText("ic-hex-advice", hex.advice);

        // Đồng bộ highlight thẻ đang chọn trên lưới 64 quẻ
        document.querySelectorAll("#ic-catalog-grid [data-hex-num]").forEach((card) => {
            const isMatch = Number(card.dataset.hexNum) === Number(hex.num);
            card.classList.toggle("is-current-highlight", isMatch);
            card.setAttribute("aria-pressed", String(isMatch));
        });
    };

    const renderIChingCatalog = () => {
        const grid = document.getElementById("ic-catalog-grid");
        if (!grid) return;

        const q = (document.getElementById("ic-search-input")?.value || "").trim().toLowerCase();
        const filtered = ICHING_HEXAGRAMS.filter((h) => {
            if (icFortuneFilter !== "all" && h.fortune !== icFortuneFilter) return false;
            if (!q) return true;
            return `${pad(h.num)} ${h.num} ${h.short} ${h.name} ${h.trigrams} ${h.advice}`.toLowerCase().includes(q);
        });

        setText("ic-catalog-count", `${filtered.length} / ${ICHING_HEXAGRAMS.length} quẻ`);

        if (!filtered.length) {
            grid.innerHTML = `<p class="util-data-table__empty">Không tìm thấy quẻ nào khớp từ khóa.</p>`;
            return;
        }

        grid.innerHTML = filtered
            .map((h) => {
                const isCur = Number(currentIChingHex?.num) === Number(h.num);
                return `
                    <article
                        class="util-hex-card ${isCur ? "is-current-highlight" : ""}"
                        role="button"
                        tabindex="0"
                        data-hex-num="${h.num}"
                        aria-pressed="${isCur}"
                        aria-label="Quẻ số ${h.num}: ${h.name}, ${h.fortune}"
                    >
                        <div class="util-hex-card__top">
                            <span class="util-hex-card__svg" aria-hidden="true">
                                <img src="${getIChingSvgUrl(h)}" alt="" width="70" height="70" loading="lazy" decoding="async" />
                            </span>
                            <span class="util-hex-card__badge">#${pad(h.num)} • ${h.fortune}</span>
                        </div>
                        <div>
                            <strong class="util-hex-card__title">${h.short}</strong>
                            <div class="util-hex-card__sub">${h.name.split("(")[0].trim()}</div>
                        </div>
                        <p class="util-hex-card__desc">${h.advice}</p>
                    </article>
                `;
            })
            .join("");
    };

    const renderTarotCard = (card, isUpright = true) => {
        if (!card) return;
        currentTarotState = { card, isUpright };

        const stageEl = document.getElementById("tr-card-art");
        const frontImg = document.getElementById("tr-card-front-img");
        const orientEl = document.getElementById("tr-card-orientation");

        const orientationKey = isUpright ? "upright" : "reversed";
        const displayTitle = `${card.roman ? `${card.roman}. ` : ""}${card.vn} (${card.en})`;

        if (stageEl) {
            stageEl.dataset.orientation = orientationKey;
            stageEl.setAttribute(
                "aria-label",
                `Phóng to lá bài ${displayTitle} - ${isUpright ? "Chiều Xuôi" : "Chiều Ngược"}`,
            );
        }

        if (frontImg) {
            frontImg.src = getTarotFrontImgUrl(card);
            frontImg.alt = `Lá bài Tarot ${displayTitle} - ${isUpright ? "Chiều Xuôi" : "Chiều Ngược"}`;
        }

        if (orientEl) {
            orientEl.dataset.orientation = orientationKey;
            orientEl.textContent = isUpright
                ? "Lá bài Xuôi (Upright)"
                : "Lá bài Ngược (Reversed • Chiêm nghiệm nội tâm)";
        }

        setText("tr-card-suit-pill", SUIT_LABEL_VN[card.suit] || "Tarot Rider-Waite");
        setText("tr-card-vn", displayTitle);
        setText("tr-card-keywords", isUpright ? card.keywords_upright : card.keywords_reversed);
        setText("tr-card-career", card.career);
        setText("tr-card-message", isUpright ? card.msg_upright : card.msg_reversed);
    };

    // ==================== 5. NGÀY NÀY NĂM XƯA ====================
    const renderHistoryMonthEvents = async (monthNum = 11) => {
        const grid = document.getElementById("hi-events-grid");
        if (!grid) return;

        let items = [];
        for (const path of [`./api/thang-${monthNum}.json`, `./api/thang-${pad(monthNum)}.json`]) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    items = Array.isArray(data) ? data : data?.data || data?.events || [];
                    break;
                }
            } catch (e) {
                // Thử đường dẫn tiếp theo
            }
        }

        if (!items.length) {
            items = [
                {
                    ten: "Nguyễn Thị Minh Khai",
                    ngay_hien_thi: `01/${pad(monthNum)}`,
                    hien_thi_nhan_dip: "Kỷ niệm ngày sinh nhà cách mạng Nguyễn Thị Minh Khai (01/11/1910)",
                    image_slug: "nguyen-thi-minh-khai-01-11-1910-28-08-1941",
                    category_id: "figures",
                },
            ];
        }

        grid.innerHTML = items
            .slice(0, 12)
            .map((item) => {
                const rawSlug = item.image_slug || item.slug || "";
                const cleanFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
                const typeFolder = String(item.category_id || "")
                    .toLowerCase()
                    .includes("event")
                    ? "events"
                    : "figures";
                const href = `./detail.html?type=${typeFolder}&folder=${cleanFolder}&slug=${rawSlug}&month=${monthNum}`;

                return `
                    <a href="${href}" class="util-item-card">
                        <div class="util-item-card__head">
                            <span class="util-item-card__icon-wrap">
                                <img src="./assets/icons/calendarDay.svg" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-item-card__tag">${item.ngay_hien_thi || `Tháng ${monthNum}`}</span>
                        </div>
                        <strong class="util-item-card__title">${item.ten || "Sự kiện lịch sử"}</strong>
                        <span class="util-item-card__sub">${item.hien_thi_nhan_dip || ""}</span>
                        <p class="util-item-card__desc">Bấm để đọc toàn văn tiểu sử và tư liệu lưu trữ &#8594;</p>
                    </a>
                `;
            })
            .join("");
    };

    // ==================== 6. HOROSCOPE 12 CUNG HOÀNG ĐẠO (JSON + ICON 128x128) ====================
    let HOROSCOPE_SIGNS = [
        {
            key: "capricorn",
            name: "Ma Kết (Capricorn)",
            mascot: "Dê Biển Đuôi Cá",
            dates: "22/12 – 19/01",
            element: "Nguyên tố Đất • Sao Thổ chủ quản",
            traits: "Có trách nhiệm, kỷ luật, thực tế và giàu tham vọng. Ma Kết luôn kiên trì đạt mục tiêu dài hạn.",
            daily: "Hôm nay năng lượng nguyên tố Đất giúp Ma Kết xử lý công việc và tài chính sáng suốt. Số may mắn: 4, 8.",
        },
    ];

    const buildHoroscopeImgHtml = (signKey, extraClass = "") => `
        <img
            src="${HOROSCOPE_ICON_DIR}/${signKey}.svg"
            alt=""
            width="128"
            height="128"
            loading="lazy"
            decoding="async"
            ${extraClass ? `class="${extraClass}"` : ""}
        />
    `;

    const getSignByMonthDay = (m, d) => {
        const code = m * 100 + d;
        const findByKey = (k) => HOROSCOPE_SIGNS.find((s) => s.key === k) || HOROSCOPE_SIGNS[0];
        if (code >= 1222 || code <= 119) return findByKey("capricorn");
        if (code <= 218) return findByKey("aquarius");
        if (code <= 320) return findByKey("pisces");
        if (code <= 419) return findByKey("aries");
        if (code <= 520) return findByKey("taurus");
        if (code <= 621) return findByKey("gemini");
        if (code <= 722) return findByKey("cancer");
        if (code <= 822) return findByKey("leo");
        if (code <= 922) return findByKey("virgo");
        if (code <= 1023) return findByKey("libra");
        if (code <= 1121) return findByKey("scorpio");
        return findByKey("sagittarius");
    };

    const renderHoroscopeSign = (sign) => {
        const targetSign = sign || HOROSCOPE_SIGNS[0];
        if (!targetSign) return;

        setHtml("hs-sign-symbol", buildHoroscopeImgHtml(targetSign.key));
        setText("hs-sign-dates", targetSign.dates);
        setText(
            "hs-sign-element",
            targetSign.mascot ? `${targetSign.element} • Linh vật: ${targetSign.mascot}` : targetSign.element,
        );
        setText("hs-sign-name", targetSign.name);
        setText("hs-sign-traits", targetSign.traits);
        setHtml("hs-sign-daily", `<strong>Luận giải năng lượng hôm nay:</strong> ${targetSign.daily}`);

        const grid = document.getElementById("hs-signs-grid");
        if (grid) {
            grid.innerHTML = HOROSCOPE_SIGNS.map(
                (s) => `
                    <button
                        type="button"
                        class="util-sign-btn ${s.key === targetSign.key ? "is-active" : ""}"
                        data-sign-key="${s.key}"
                        aria-pressed="${s.key === targetSign.key}"
                    >
                        ${buildHoroscopeImgHtml(s.key)}
                        <strong>${s.name.split("(")[0].trim()}</strong>
                        <small>${s.dates}</small>
                    </button>
                `,
            ).join("");
        }
    };

    // ==================== 7. TÍNH KHOẢNG CÁCH & CỘNG/TRỪ NGÀY ====================
    const computeDateDiff = () => {
        const sVal = document.getElementById("dd-start-date")?.value;
        const eVal = document.getElementById("dd-end-date")?.value;
        if (!sVal || !eVal) return;

        const d1 = new Date(sVal);
        const d2 = new Date(eVal);
        const diffMs = Math.abs(d2 - d1);
        const totalMins = Math.floor(diffMs / 60000);
        const totalHours = Math.floor(totalMins / 60);
        const totalDays = Math.floor(totalHours / 24);
        const weeks = Math.floor(totalDays / 7);
        const months = Math.floor(totalDays / 30.4375);
        const years = Math.floor(totalDays / 365.25);

        setText("dd-val-years", String(years));
        setText("dd-val-months", String(months));
        setText("dd-val-weeks", String(weeks));
        setText("dd-val-days", String(totalDays));
        setText("dd-val-hours", String(totalHours));
        setText("dd-val-minutes", String(totalMins % 60));
        setText("dd-total-days-badge", `Tổng cộng: ${totalDays} ngày`);

        if (window.LunarEngine) {
            const l1 = window.LunarEngine.getFullDayInfo(d1.getDate(), d1.getMonth() + 1, d1.getFullYear());
            const l2 = window.LunarEngine.getFullDayInfo(d2.getDate(), d2.getMonth() + 1, d2.getFullYear());
            setText(
                "dd-start-lunar-hint",
                `Âm lịch: ${pad(l1.lunarDay)}/${pad(l1.lunarMonth)}/${l1.lunarYear} (${l1.dayCanChi})`,
            );
            setText(
                "dd-end-lunar-hint",
                `Âm lịch: ${pad(l2.lunarDay)}/${pad(l2.lunarMonth)}/${l2.lunarYear} (${l2.dayCanChi})`,
            );
        }
    };

    const computeDateAddSub = () => {
        const baseStr = document.getElementById("as-base-date")?.value;
        if (!baseStr) return;

        const [by, bm, bd] = baseStr.split("-").map(Number);
        const yOff = Number(document.getElementById("as-years")?.value || 0);
        const mOff = Number(document.getElementById("as-months")?.value || 0);
        const wOff = Number(document.getElementById("as-weeks")?.value || 0);
        const dOff = Number(document.getElementById("as-days")?.value || 0);

        const dir = dateCalcMode === "sub" ? -1 : 1;
        const target = new Date(by + dir * yOff, bm - 1 + dir * mOff, bd + dir * (wOff * 7 + dOff));
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
            dateCalcMode === "sub" ? "Kết quả sau khi trừ thời gian" : "Kết quả sau khi cộng thêm",
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

    // ==================== 8. THẦN SỐ HỌC PYTHAGORAS ====================
    const NUMEROLOGY_MEANINGS = {
        1: {
            title: "Nhà Tiên Phong Độc Lập",
            desc: "Đại diện cho khả năng lãnh đạo bẩm sinh, tự chủ, quyết đoán và bản lĩnh mở đường.",
        },
        2: {
            title: "Người Hòa Giải Tinh Tế",
            desc: "Đại diện cho sự lắng nghe, ngoại giao khéo léo, trực giác nhạy bén và tinh thần hợp tác.",
        },
        3: {
            title: "Người Truyền Cảm Hứng & Sáng Tạo",
            desc: "Đại diện cho tư duy nhạy bén, ngôn từ sắc sảo, óc thẩm mỹ và năng lượng tích cực.",
        },
        4: {
            title: "Kiến Trúc Sư Thực Tế & Kỷ Luật",
            desc: "Đại diện cho tính hệ thống, quy trình chuẩn mực, nền tảng vững chắc và sự bền bỉ.",
        },
        5: {
            title: "Người Tự Do & Đổi Mới Đột Phá",
            desc: "Đại diện cho sự linh hoạt, thích nghi nhanh và dám vượt qua giới hạn cũ.",
        },
        6: {
            title: "Người Nuôi Dưỡng & Trách Nhiệm",
            desc: "Đại diện cho tình yêu thương gia đình, sự tận tâm và gu thẩm mỹ tinh tế.",
        },
        7: {
            title: "Nhà Triết Học & Nghiên Cứu Chuyên Sâu",
            desc: "Đại diện cho chiều sâu học thuật, tư duy phân tích gốc rễ và trực giác tâm linh.",
        },
        8: {
            title: "Nhà Điều Hành & Thịnh Vượng Tài Chính",
            desc: "Đại diện cho năng lực quản trị vĩ mô, nhạy bén thương mại và hiệu quả thực tiễn.",
        },
        9: {
            title: "Nhà Nhân Đạo & Lý Tưởng Lớn",
            desc: "Đại diện cho tầm nhìn bao dung, trách nhiệm xã hội và trí tuệ tổng hợp.",
        },
        11: {
            title: "Số Master 11/2 • Trực Giác Cao",
            desc: "Bậc thầy truyền cảm hứng tinh thần với trực giác nhạy bén và tầm nhìn sâu sắc.",
        },
        22: {
            title: "Số Master 22/4 • Kiến Tạo Đại Sự",
            desc: "Kết hợp tầm nhìn vĩ mô với năng lực thực thi kỷ luật để tạo di sản bền vững.",
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
        const val = document.getElementById("num-birth-input")?.value || "1987-01-13";
        const [y, m, d] = val.split("-").map(Number);
        const allDigits = `${pad(d)}${pad(m)}${y}`.split("").map(Number);
        const rawSum = allDigits.reduce((a, b) => a + b, 0);
        const lifePath = reduceNum(rawSum, true);
        const info = NUMEROLOGY_MEANINGS[lifePath] || NUMEROLOGY_MEANINGS[3];

        setText("num-lifepath-number", String(lifePath));
        setText(
            "num-lifepath-formula",
            `Ngày sinh: ${pad(d)}/${pad(m)}/${y} (Tổng: ${rawSum} → Số Chủ Đạo ${lifePath})`,
        );
        setText("num-lifepath-title", `Con Số Chủ Đạo ${lifePath} • ${info.title}`);
        setText("num-lifepath-desc", info.desc);

        const now = new Date();
        const pYear = reduceNum(d + m + now.getFullYear(), false);
        const pMonth = reduceNum(pYear + (now.getMonth() + 1), false);
        const pDay = reduceNum(pMonth + now.getDate(), false);
        setText("num-personal-year", `Số ${pYear}`);
        setText("num-personal-month", `Số ${pMonth}`);
        setText("num-personal-day", `Số ${pDay}`);

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
                .map(
                    ([num, label]) => `
                        <div class="util-pythagoras-cell ${counts[num] ? "has-val" : ""}">
                            <small>Ô số ${num} (${label})</small>
                            <strong>${counts[num] || "—"}</strong>
                        </div>
                    `,
                )
                .join("");
        }
    };

    const renderNumerologyMonthCalendar = (selectedDay = new Date().getDate()) => {
        const year = 2026;
        const month = 11;
        const leading = (new Date(year, month - 1, 1).getDay() + 6) % 7;
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
            setText("num-day-meaning", info.desc);
            setAttr("num-day-link", "href", `./day.html?date=${year}-${pad(month)}-${pad(d)}`);
        };

        let html = "";
        for (let i = 0; i < 35; i++) {
            const d = i - leading + 1;
            if (d < 1 || d > maxDays) {
                html += `<div class="util-num-day-cell is-muted" aria-hidden="true"><small>—</small><strong>•</strong></div>`;
            } else {
                const raw = `${pad(d)}${pad(month)}${year}`.split("").reduce((a, b) => a + Number(b), 0);
                const num = reduceNum(raw, true);
                const isSel = d === selectedDay;
                html += `<button type="button" class="util-num-day-cell ${isSel ? "is-active" : ""}" data-num-cal-day="${d}" aria-pressed="${isSel}"><small>${d}/11</small><strong>${num}</strong></button>`;
            }
        }
        grid.innerHTML = html;
        updateSelectedNumDay(selectedDay);

        grid.querySelectorAll("[data-num-cal-day]").forEach((btn) => {
            btn.onclick = () => renderNumerologyMonthCalendar(Number(btn.dataset.numCalDay));
        });
    };

    // ==================== 9. NHỊP SINH HỌC BIORHYTHM ====================
    const renderBiorhythm = () => {
        const val = document.getElementById("bio-birth-input")?.value || "1987-01-13";
        const [by, bm, bd] = val.split("-").map(Number);
        const birthDate = new Date(by, bm - 1, bd);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const daysAlive = Math.floor((todayStart - birthDate) / 86400000);

        const cycles = [
            { name: "Thể chất (23 ngày)", period: 23, color: "#2563eb" },
            { name: "Tình cảm (28 ngày)", period: 28, color: "#10b981" },
            { name: "Trí tuệ (33 ngày)", period: 33, color: "#f97316" },
            { name: "Trực giác (38 ngày)", period: 38, color: "#8b5cf6" },
        ];

        const statsGrid = document.getElementById("bio-stats-grid");
        if (statsGrid) {
            statsGrid.innerHTML = cycles
                .map((c) => {
                    const pct = Math.round(Math.sin((2 * Math.PI * daysAlive) / c.period) * 100);
                    const state =
                        Math.abs(pct) <= 12
                            ? "⚠️ Ngày giao điểm"
                            : pct >= 50
                              ? "🌟 Năng lượng đỉnh cao"
                              : pct < 0
                                ? "🌙 Pha tích lũy"
                                : "Ổn định";
                    return `
                        <article class="util-bio-stat-card">
                            <div class="util-bio-stat-card__head"><span>${c.name}</span></div>
                            <strong class="util-bio-stat-card__val" style="color:${c.color}">${pct > 0 ? `+${pct}%` : `${pct}%`}</strong>
                            <span class="util-bio-stat-card__advice">${state}</span>
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
        const plotW = svgW - leftPad - rightPad;
        const plotH = svgH - topPad * 2;
        const midY = topPad + plotH / 2;

        const pathsHtml = cycles
            .map((c) => {
                const pts = [];
                for (let i = 0; i <= 30; i++) {
                    const x = leftPad + (i / 30) * plotW;
                    const v = Math.sin((2 * Math.PI * (daysAlive + i)) / c.period);
                    const y = midY - v * (plotH / 2);
                    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
                }
                return `<path d="${pts.join(" ")}" fill="none" stroke="${c.color}" stroke-width="2.8" stroke-linecap="round" />`;
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
    };

    // ==================== 10. TỪ ĐIỂN CỔ HỌC ====================
    const FENGSHUI_DICT = [
        [
            "Hải Trung Kim",
            "Giáp Tý, Ất Sửu",
            "fs-napam",
            "./assets/icons/metal.svg",
            false,
            "Vàng dưới biển — Nội lực tiềm ẩn, sâu sắc và bền bỉ.",
        ],
        [
            "Lư Trung Hỏa",
            "Bính Dần, Đinh Mão",
            "fs-napam",
            "./assets/icons/fire.svg",
            false,
            "Lửa trong lò — Nhiệt huyết được tôi luyện, ấm áp và kiên định.",
        ],
        [
            "Đại Lâm Mộc",
            "Mậu Thìn, Kỷ Tỵ",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Gỗ rừng già — Vững chãi, che chở và giàu sức sống.",
        ],
        [
            "Lộ Bàng Thổ",
            "Canh Ngọ, Tân Mùi",
            "fs-napam",
            "./assets/icons/earth.svg",
            false,
            "Đất ven đường — Bằng phẳng, gắn kết giao thương và thực tế.",
        ],
        [
            "Cung Đại An",
            "Khổng Minh Lục Diệu • Đại Cát",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-daian.svg",
            true,
            "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên ổn.",
        ],
        [
            "Cung Tốc Hỷ",
            "Khổng Minh Lục Diệu • Cát Tinh",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-tochy.svg",
            true,
            "Tin vui đến nhanh, mưu sự đại cát, thuận lợi gặp gỡ ký kết.",
        ],
        [
            "Cung Tiểu Cát",
            "Khổng Minh Lục Diệu • Quý Nhân",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-tieucat.svg",
            true,
            "Cát lành, hòa hợp, mưu sự suôn sẻ và dễ gặp quý nhân.",
        ],
        [
            "Quẻ Càn",
            "Bát Quái • Hướng Tây Bắc (Kim)",
            "fs-bagua",
            "./assets/icons/zodiac/dog.svg",
            true,
            "Tượng trưng cho Trời lớn, cương kiện, uy quyền và chính trực.",
        ],
        [
            "Quẻ Ly",
            "Bát Quái • Hướng Chính Nam (Hỏa)",
            "fs-bagua",
            "./assets/icons/zodiac/horse.svg",
            true,
            "Tượng trưng cho Lửa sáng, Mặt trời rực rỡ, văn minh và danh vọng.",
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
            .map(([title, sub, , icon, isFiltered, desc]) => {
                const slug = toSlug(title);
                const isSel = highlightSlug && (slug.includes(highlightSlug) || highlightSlug.includes(slug));
                return `
                    <article class="util-item-card ${isSel ? "is-selected" : ""}">
                        <div class="util-item-card__head">
                            <span class="util-item-card__icon-wrap ${isFiltered ? "util-item-card__icon-wrap--filtered" : ""}">
                                <img src="${icon}" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-item-card__tag">Cổ Học Tinh Hoa</span>
                        </div>
                        <strong class="util-item-card__title">${title}</strong>
                        <span class="util-item-card__sub">${sub}</span>
                        <p class="util-item-card__desc">${desc}</p>
                    </article>
                `;
            })
            .join("");
    };

    // ==================== ĐIỀU HƯỚNG TAB & ĐỒNG BỘ URL 2 CHIỀU (FIX F5) ====================
    const switchCategoryAndSub = (catKey, subKey = "", { syncUrl = true, replace = false } = {}) => {
        activeCat = SUB_NAV_MAP[catKey] ? catKey : "clock";
        const subItems = SUB_NAV_MAP[activeCat] || [];
        const hasValidSub = subItems.some((item) => item.id === subKey);
        activeSub = hasValidSub ? subKey : (subItems[0]?.id ?? "");

        const mainEl = document.getElementById("main");
        if (mainEl) {
            mainEl.dataset.activeCat = activeCat;
            mainEl.dataset.activeSub = activeSub;
        }

        // Cập nhật URL Hash để Refresh (F5) giữ nguyên đúng Tab & Subtab hiện tại
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

    const resolveRouteFromUrl = () => {
        // 1. Ưu tiên đọc URL Hash dạng #cat/sub hoặc #cat (Giữ nguyên trạng thái khi bấm F5 / Back / Forward)
        const rawHash = window.location.hash.replace(/^#/, "").trim();
        if (rawHash && rawHash !== "ic-catalog-section") {
            const [hashCat, hashSub = ""] = rawHash.split("/");
            if (SUB_NAV_MAP[hashCat]) {
                return { cat: hashCat, sub: hashSub, highlight: "" };
            }
            // Hỗ trợ trường hợp hash chỉ ghi tên subtab (vd: #tarot, #iching, #alarm)
            for (const [catKey, subs] of Object.entries(SUB_NAV_MAP)) {
                if (subs.some((s) => s.id === hashCat)) {
                    return { cat: catKey, sub: hashCat, highlight: "" };
                }
            }
        }

        // 2. Fallback sang Query Deep-Link (?tab=, ?napam=, ?lucdieu=, ?bagua=, ?term=)
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
        if (tabParam && SUB_NAV_MAP[tabParam]) return { cat: tabParam, sub: "", highlight: "" };

        return { cat: "clock", sub: "stopwatch", highlight: "" };
    };

    // ==================== KHỞI TẠO TOÀN TRANG UTILITIES ====================
    const initUtilitiesPage = () => {
        const mainEl = document.getElementById("main");
        if (!mainEl || mainEl.dataset.utilBound === "true") return;
        mainEl.dataset.utilBound = "true";

        renderStopwatchLaps();
        renderAlarmsList();
        renderInlineConverter();
        renderSolarTermsPanel();
        renderIChingHexagram(ICHING_HEXAGRAMS[0]);
        renderIChingCatalog();
        renderTarotCard(TAROT_CARDS[0], true);
        renderHistoryMonthEvents(Number(document.getElementById("hi-month-select")?.value || 11));
        renderHoroscopeSign(HOROSCOPE_SIGNS[0]);
        computeDateDiff();
        computeDateAddSub();
        renderNumerologyPersonal();
        renderNumerologyMonthCalendar();
        renderBiorhythm();
        renderFengShuiDict();

        // Nạp song song 3 kho dữ liệu JSON (64 quẻ Kinh Dịch, 78 lá Tarot, 12 Cung Hoàng Đạo)
        Promise.all([
            fetchJsonSafe("./api/iching.json", ICHING_HEXAGRAMS),
            fetchJsonSafe("./api/tarot.json", TAROT_CARDS),
            fetchJsonSafe("./api/horoscope.json", HOROSCOPE_SIGNS),
        ]).then(([ichingData, tarotData, horoscopeData]) => {
            ICHING_HEXAGRAMS = ichingData;
            TAROT_CARDS = tarotData;
            HOROSCOPE_SIGNS = horoscopeData;

            const defaultHex = ICHING_HEXAGRAMS.find((h) => h.num === 14) || ICHING_HEXAGRAMS[0];
            const defaultTarot = TAROT_CARDS.find((c) => c.id === 14) || TAROT_CARDS[0];
            renderIChingHexagram(defaultHex);
            renderIChingCatalog();
            renderTarotCard(defaultTarot, true);

            const hsVal = document.getElementById("hs-birth-input")?.value || "1987-01-13";
            const [, hm, hd] = hsVal.split("-").map(Number);
            renderHoroscopeSign(getSignByMonthDay(hm || 1, hd || 13));
        });

        // Áp dụng đúng Route từ URL ngay lúc tải trang (Fix F5)
        const initialRoute = resolveRouteFromUrl();
        switchCategoryAndSub(initialRoute.cat, initialRoute.sub, { syncUrl: true, replace: true });
        if (initialRoute.highlight) renderFengShuiDict(initialRoute.highlight);

        // Hỗ trợ nút Back / Forward của trình duyệt
        window.addEventListener("popstate", () => {
            const route = resolveRouteFromUrl();
            switchCategoryAndSub(route.cat, route.sub, { syncUrl: false });
        });

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

        // 1.1. Đồng hồ bấm giờ
        const swStartBtn = document.getElementById("sw-start-btn");
        const swLapBtn = document.getElementById("sw-lap-btn");
        if (swStartBtn) {
            swStartBtn.onclick = () => {
                if (!swRunning) {
                    swRunning = true;
                    swStartTime = performance.now() - swElapsedMs;
                    swStartBtn.innerHTML = "<span>&#10074;&#10074; Tạm dừng</span>";
                    if (swLapBtn) swLapBtn.disabled = false;
                    setText("sw-status-tag", "Đang bấm giờ...");
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
                }
            };
        }

        if (swLapBtn) {
            swLapBtn.onclick = () => {
                if (!swRunning) return;
                const prevTotalMs = swLaps[0]?.totalMs || 0;
                const lapFmt = formatStopwatch(swElapsedMs - prevTotalMs);
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

        document.getElementById("sw-reset-btn")?.addEventListener("click", () => {
            swRunning = false;
            clearInterval(swTimer);
            swElapsedMs = 0;
            swLaps = [];
            setText("sw-main-display", "00:00:00");
            setText("sw-ms-display", ".00");
            setText("sw-status-tag", "Sẵn sàng bấm giờ");
            if (swStartBtn) swStartBtn.innerHTML = "<span>&#9654; Bắt đầu</span>";
            if (swLapBtn) swLapBtn.disabled = true;
            renderStopwatchLaps();
        });

        // 1.2. Đồng hồ đếm ngược
        const syncCountdownDisplay = (sec) => {
            setText(
                "cd-display-digits",
                `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`,
            );
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

        document.getElementById("cd-test-sound-btn")?.addEventListener("click", playBellChime);

        const cdStartBtn = document.getElementById("cd-start-btn");
        if (cdStartBtn) {
            cdStartBtn.onclick = () => {
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
                                        <span>#${pad(item.idx)}</span><strong>${item.title}</strong><span>${item.duration}</span><span>${item.startedAt}</span>
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
                            playBellChime();
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

        // 1.3. Đồng hồ báo thức
        document.getElementById("al-add-btn")?.addEventListener("click", () => {
            const hour = Math.min(23, Math.max(0, Number(document.getElementById("al-input-hour")?.value || 6)));
            const minute = Math.min(59, Math.max(0, Number(document.getElementById("al-input-minute")?.value || 30)));
            const title = document.getElementById("al-input-title")?.value || "Dậy học bài";
            alarmsList.push({ id: Date.now(), hour, minute, title, enabled: true });
            renderAlarmsList();
        });

        document.getElementById("al-list-container")?.addEventListener("click", (e) => {
            const delBtn = e.target.closest("[data-del-alarm]");
            if (!delBtn) return;
            alarmsList = alarmsList.filter((a) => a.id !== Number(delBtn.dataset.delAlarm));
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
                    if (a.enabled && a.hour === cur.getHours() && a.minute === cur.getMinutes()) playBellChime();
                });
            }
        }, 1000);

        // 2 & 3. Đổi ngày & Tiết Khí
        ["uc-day", "uc-month", "uc-year", "uc-mode"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", renderInlineConverter);
            document.getElementById(id)?.addEventListener("change", renderInlineConverter);
        });
        document.getElementById("uc-today-btn")?.addEventListener("click", () => {
            const t = new Date();
            const dEl = document.getElementById("uc-day");
            const mEl = document.getElementById("uc-month");
            const yEl = document.getElementById("uc-year");
            if (dEl) dEl.value = String(t.getDate());
            if (mEl) mEl.value = String(t.getMonth() + 1);
            if (yEl) yEl.value = String(t.getFullYear());
            renderInlineConverter();
        });

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

        // 4.1. Sự kiện Gieo Quẻ Kinh Dịch 1-Click (3 Xu SVG 3D + Xếp 6 Hào) & Lưới 64 Quẻ
        document.getElementById("panel-divination")?.addEventListener("mousemove", (e) => {
            mouseEntropyAccumulator =
                (mouseEntropyAccumulator ^
                    ((e.clientX * 31 + e.clientY * 17 + Math.floor(performance.now())) & 0xffffff)) >>>
                0;
        });

        document.getElementById("ic-cast-btn")?.addEventListener("click", (e) => {
            if (isIChingAnimating || !ICHING_HEXAGRAMS.length) return;
            isIChingAnimating = true;

            const coins = document.querySelectorAll("#ic-coins-stage .util-coin");
            const resultBox = document.getElementById("ic-result-box");
            resultBox?.classList.remove("is-sliding");

            coins.forEach((c) => {
                c.classList.remove("is-tossing");
                void c.offsetWidth;
                c.classList.add("is-tossing");
                c.dataset.face = Math.random() > 0.5 ? "yang" : "yin";
            });

            const clickEntropy = (e.clientX * 73 + e.clientY * 37 + Math.floor(performance.now() * 100)) >>> 0;
            let chosenIdx =
                (mouseEntropyAccumulator ^ clickEntropy ^ Math.floor(Math.random() * 100000)) % ICHING_HEXAGRAMS.length;
            if (ICHING_HEXAGRAMS.length > 1 && ICHING_HEXAGRAMS[chosenIdx].num === currentIChingHex?.num) {
                chosenIdx = (chosenIdx + 1) % ICHING_HEXAGRAMS.length;
            }

            setTimeout(() => {
                coins.forEach((c) => c.classList.remove("is-tossing"));
                renderIChingHexagram(ICHING_HEXAGRAMS[chosenIdx]);
                resultBox?.classList.add("is-sliding");
                isIChingAnimating = false;
            }, 820);
        });

        document.getElementById("ic-search-input")?.addEventListener("input", renderIChingCatalog);

        document.getElementById("ic-fortune-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-ic-fortune]");
            if (!btn) return;
            icFortuneFilter = btn.dataset.icFortune || "all";
            document.querySelectorAll("[data-ic-fortune]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderIChingCatalog();
        });

        // 4.2. Sự kiện Rút Bài Tarot 78 Lá (Quạt 9/7 lá + Lật 3D)
        const triggerTarotDraw = (fanIdx = -1, withShuffle = false) => {
            if (isTarotAnimating || !TAROT_CARDS.length) return;
            isTarotAnimating = true;

            const fanEl = document.getElementById("tr-deck-fan");
            const stageEl = document.getElementById("tr-card-art");
            const resultBox = document.getElementById("tr-result-box");

            const backImgUrl = getTarotBackImgUrl();
            document.querySelectorAll("#tr-deck-fan img, #tr-card-back-img").forEach((img) => {
                if (!img.getAttribute("src")?.endsWith(backImgUrl.replace("./", ""))) img.src = backImgUrl;
            });

            if (stageEl) stageEl.dataset.flipped = "false";
            if (fanEl && withShuffle) fanEl.dataset.deckState = "shuffling";
            resultBox?.classList.remove("is-sliding");

            const isCompactFan = window.innerWidth < 768;
            const randomVisibleIdx = isCompactFan ? 1 + Math.floor(Math.random() * 7) : Math.floor(Math.random() * 9);
            const chosenFanIdx = fanIdx >= 0 ? fanIdx : randomVisibleIdx;

            document.querySelectorAll("#tr-deck-fan .util-tarot-back").forEach((b) => {
                const isMatch = Number(b.dataset.fanIdx) === chosenFanIdx;
                b.classList.toggle("is-picked", isMatch);
                b.setAttribute("aria-pressed", String(isMatch));
            });

            const entropySeed =
                (mouseEntropyAccumulator ^ Math.floor(performance.now() * 100) ^ (chosenFanIdx * 97)) >>> 0;
            let nextIdx = (entropySeed + Math.floor(Math.random() * TAROT_CARDS.length)) % TAROT_CARDS.length;
            if (TAROT_CARDS.length > 1 && TAROT_CARDS[nextIdx].id === currentTarotState.card?.id) {
                nextIdx = (nextIdx + 1) % TAROT_CARDS.length;
            }
            const nextCard = TAROT_CARDS[nextIdx];
            const isUpright = Math.random() > 0.25;

            const preload = new Image();
            preload.src = getTarotFrontImgUrl(nextCard);

            const flipDelay = withShuffle ? 580 : 320;
            setTimeout(() => {
                if (fanEl) fanEl.dataset.deckState = "idle";
                renderTarotCard(nextCard, isUpright);

                requestAnimationFrame(() => {
                    if (stageEl) stageEl.dataset.flipped = "true";
                    resultBox?.classList.add("is-sliding");
                    setTimeout(() => {
                        isTarotAnimating = false;
                    }, 520);
                });
            }, flipDelay);
        };

        document.getElementById("tr-draw-btn")?.addEventListener("click", () => triggerTarotDraw(-1, true));
        document.getElementById("tr-deck-fan")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-fan-idx]");
            if (!btn) return;
            triggerTarotDraw(Number(btn.dataset.fanIdx), false);
        });

        // 5, 6, 7, 8, 9, 10. Sự kiện các tab còn lại
        document.getElementById("hi-month-select")?.addEventListener("change", (e) => {
            renderHistoryMonthEvents(Number(e.target.value || 11));
        });

        document.getElementById("hs-birth-input")?.addEventListener("change", (e) => {
            const [, m, d] = String(e.target.value || "1987-01-13")
                .split("-")
                .map(Number);
            renderHoroscopeSign(getSignByMonthDay(m || 1, d || 13));
        });

        ["dd-start-date", "dd-end-date"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", computeDateDiff);
        });
        ["as-base-date", "as-years", "as-months", "as-weeks", "as-days"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", computeDateAddSub);
        });
        document.getElementById("as-today-btn")?.addEventListener("click", () => {
            const t = new Date();
            const baseEl = document.getElementById("as-base-date");
            if (baseEl) baseEl.value = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
            computeDateAddSub();
        });

        document.getElementById("num-birth-input")?.addEventListener("input", renderNumerologyPersonal);
        document.getElementById("bio-birth-input")?.addEventListener("input", renderBiorhythm);
        document.getElementById("fs-search-input")?.addEventListener("input", () => renderFengShuiDict());

        // ==================== ỦY QUYỀN CLICK & BÀN PHÍM MỞ SINGLETON MODAL ====================
        mainEl.addEventListener("click", (e) => {
            // 1. Click vào Quẻ đang gieo hoặc 1 trong 64 Quẻ trên lưới tra cứu
            const hexCard = e.target.closest("#ic-catalog-grid [data-hex-num]");
            if (hexCard) {
                const hex = ICHING_HEXAGRAMS.find((h) => Number(h.num) === Number(hexCard.dataset.hexNum));
                if (hex) {
                    renderIChingHexagram(hex);
                    openIChingModal(hex);
                }
                return;
            }

            if (e.target.closest("[data-ic-modal='current']")) {
                openIChingModal(currentIChingHex);
                return;
            }

            // 2. Click vào Lá bài Tarot đã lật để phóng to trong Modal
            if (e.target.closest("[data-tarot-modal]") && currentTarotState.card) {
                const { card, isUpright } = currentTarotState;
                const displayTitle = `${card.roman ? `${card.roman}. ` : ""}${card.vn} (${card.en})`;
                openUtilModal({
                    category: SUIT_LABEL_VN[card.suit] || "Tarot Rider-Waite",
                    title: displayTitle,
                    visualHtml: `
                        <img
                            src="${getTarotFrontImgUrl(card)}"
                            alt="Lá bài ${displayTitle}"
                            class="util-modal-tarot-img ${isUpright ? "" : "is-reversed"}"
                        />
                        <strong>${isUpright ? "Chiều Xuôi (Upright)" : "Chiều Ngược (Reversed)"}</strong>
                    `,
                    isFilteredVisual: false,
                    pills: [
                        SUIT_LABEL_VN[card.suit] || "Tarot",
                        isUpright ? "Chiều Xuôi" : "Chiều Ngược",
                        `Mã lá #${pad(card.id)}`,
                    ],
                    box1Title: "Từ khóa & Thông điệp tổng quan",
                    desc: `${isUpright ? card.keywords_upright : card.keywords_reversed} ${isUpright ? card.msg_upright : card.msg_reversed}`,
                    box2Title: "Công việc, Sự nghiệp & Tài chính",
                    advice: card.career,
                    actionHref: "./bazi.html",
                    actionLabel: "Đối chiếu thêm Lá Số Bát Tự",
                });
                return;
            }

            // 3. Click vào 1 trong 12 Cung Hoàng Đạo
            const signBtn = e.target.closest("[data-sign-key]");
            if (signBtn) {
                const found = HOROSCOPE_SIGNS.find((s) => s.key === signBtn.dataset.signKey);
                if (found) renderHoroscopeSign(found);
            }
        });

        mainEl.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const interactiveCard = e.target.closest(
                "#ic-catalog-grid [data-hex-num], [data-ic-modal='current'], [data-tarot-modal]",
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

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUtilitiesPage);
    } else {
        initUtilitiesPage();
    }
    window.addEventListener("template-loaded", initUtilitiesPage);
})();
