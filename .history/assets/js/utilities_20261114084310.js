// assets/js/utilities.js
// BẢN FULL 100% ĐÃ FIX SẠCH LỖI SYNTAXERROR & TYPEERROR:
// Điều khiển Bento Dual-Navbar 2 tầng, Mobile Hamburger Menu & 10 Chuyên mục Tiện ích Vạn Niên
(() => {
    const pad = (n) => String(n).padStart(2, "0");

    // Bộ 3 hàm thao tác DOM an toàn tuyệt đối (Chống lỗi Cannot set properties of null)
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

    // Phát âm báo chuông bằng Web Audio API (Chạy 100% Offline không cần file MP3 ngoài)
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

    // ==================== 1. MODULE ĐỒNG HỒ (BẤM GIỜ, ĐẾM NGƯỢC, BÁO THỨC) ====================
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

    // ==================== 2. MODULE ĐỔI NGÀY TRỰC TIẾP TẠI CHỖ ====================
    const renderInlineConverter = () => {
        const grid = document.getElementById("uc-result-grid");
        if (!grid || !window.LunarEngine) return;

        const dInput = Math.min(31, Math.max(1, Number(document.getElementById("uc-day")?.value || 14)));
        const mInput = Math.min(12, Math.max(1, Number(document.getElementById("uc-month")?.value || 11)));
        const yInput = Math.min(2100, Math.max(1900, Number(document.getElementById("uc-year")?.value || 2026)));
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

    // ==================== 3. MODULE 24 TIẾT KHÍ ====================
    let stViewingYear = 2026;
    const SOLAR_TERMS_DATA = [
        ["Tiểu Hàn", "05/01", "15:13", "term-winter-minor-cold.svg", "Chớm lạnh — Khí trời bắt đầu rét đậm, chuẩn bị bước vào giai đoạn lạnh nhất cuối năm."],
        ["Đại Hàn", "20/01", "08:35", "term-winter-major-cold.svg", "Rét cực điểm — Tiết khí cuối năm âm lịch, hàn khí đạt đỉnh trước khi mầm xuân trỗi dậy."],
        ["Lập Xuân", "04/02", "02:50", "term-spring.svg", "Khởi đầu mùa xuân — Dương khí bừng dậy, cây cối đâm chồi nảy lộc, vạn vật sinh sôi."],
        ["Vũ Thủy", "18/02", "22:40", "term-rain.svg", "Mưa xuân — Hơi ẩm tăng dần, mưa phùn ấm áp tưới tắm cho mùa màng tươi tốt."],
        ["Kinh Trập", "05/03", "20:44", "term-thunder.svg", "Sấm xuân thức tỉnh — Tiếng sấm đầu mùa vang lên đánh thức vạn vật sau kỳ ngủ đông."],
        ["Xuân Phân", "20/03", "21:32", "term-spring-equinox.svg", "Giữa xuân cân bằng — Ngày và đêm dài bằng nhau, âm dương điều hòa."],
        ["Thanh Minh", "05/04", "01:22", "term-spring-clear.svg", "Trời trong sáng — Tiết trời quang đãng, gắn liền với truyền thống tảo mộ tri ân tổ tiên."],
        ["Cốc Vũ", "20/04", "08:24", "term-grain-rain.svg", "Mưa rào nuôi ngũ cốc — Lượng mưa dồi dào giúp lúa màu phát triển vượt bậc."],
        ["Lập Hạ", "05/05", "18:30", "term-summer-sun.svg", "Bắt đầu mùa hạ — Nắng vàng rực rỡ, vạn vật bước vào kỳ trưởng thành mạnh mẽ."],
        ["Tiểu Mãn", "21/05", "07:23", "term-grain.svg", "Lúa trổ đòng chắc hạt — Hạt ngũ cốc bắt đầu căng mẩy báo hiệu mùa màng bội thu."],
        ["Mang Chủng", "05/06", "22:32", "term-grain-ear.svg", "Lúa chín có râu — Thời điểm thu hoạch vụ chiêm và gieo cấy vụ mùa nhộn nhịp."],
        ["Hạ Chí", "21/06", "15:10", "term-summer-solstice.svg", "Đỉnh điểm mùa hạ — Ngày dài nhất trong năm, dương khí đạt cực thịnh."],
        ["Tiểu Thử", "07/07", "08:45", "term-summer-minor-heat.svg", "Nóng nhẹ — Khí trời oi bức bắt đầu lan tỏa kèm mưa dông mùa hạ."],
        ["Đại Thử", "23/07", "02:12", "term-summer-major-heat.svg", "Nóng oi ả cực độ — Giai đoạn nhiệt độ cao nhất trong năm, hành Hỏa vượng."],
        ["Lập Thu", "07/08", "18:28", "term-autumn-wind.svg", "Khởi đầu mùa thu — Gió heo may chớm về, bầu trời cao trong và dịu mát dần."],
        ["Xử Thử", "23/08", "09:05", "term-autumn-cool.svg", "Dứt nắng nóng — Cái oi bức mùa hè chấm dứt, nhường chỗ cho tiết trời thu mát mẻ."],
        ["Bạch Lộ", "07/09", "21:18", "term-dew.svg", "Sương trắng — Đêm về se lạnh khiến hơi nước ngưng tụ thành giọt sương trên lá."],
        ["Thu Phân", "23/09", "06:49", "term-autumn-day-night.svg", "Giữa thu cân bằng — Thời lượng ngày và đêm bằng nhau, tiết trời thu trong trẻo."],
        ["Hàn Lộ", "08/10", "13:02", "term-cold-dew.svg", "Sương lạnh — Khí trời chuyển lạnh sâu hơn, sương đêm ngưng tụ dày."],
        ["Sương Giáng", "23/10", "16:15", "term-frost.svg", "Sương mù & Giá lạnh — Tiết khí cuối cùng của mùa thu trước khi sang đông."],
        ["Lập Đông", "07/11", "16:20", "term-winter-snow.svg", "Bắt đầu mùa đông — Gió mùa đông bắc tràn về, vạn vật thu mình tích trữ năng lượng."],
        ["Tiểu Tuyết", "22/11", "13:45", "term-winter-minor-snow.svg", "Tuyết nhẹ / Rét đầu đông — Nhiệt độ giảm thấp, không khí khô lạnh rõ rệt."],
        ["Đại Tuyết", "07/12", "09:08", "term-winter-major-snow.svg", "Tuyết dày / Rét đậm — Hàn khí bao phủ mạnh mẽ, đêm dài ngày ngắn."],
        ["Đông Chí", "22/12", "03:02", "term-winter-solstice.svg", "Giữa đông — Đêm dài nhất trong năm; từ sau Đông Chí dương khí bắt đầu hồi sinh."],
    ];

    const renderSolarTermsPanel = () => {
        setText("st-year-title", String(stViewingYear));
        setText("st-year-badge", `Năm ${stViewingYear}`);
        const grid = document.getElementById("st-cards-grid");
        if (!grid) return;

        const curTerm = window.LunarEngine
            ? window.LunarEngine.getFullDayInfo(new Date().getDate(), new Date().getMonth() + 1, stViewingYear).solarTerm
            : "Lập Đông";

        grid.innerHTML = SOLAR_TERMS_DATA.map(([name, ddmm, timeStr, icon, desc]) => {
            const isCur = name === curTerm;
            return `
                <article class="util-term-card ${isCur ? "is-current-term" : ""}">
                    <div class="util-term-card__top">
                        <span class="util-term-card__icon-box">
                            <img src="./assets/icons/weather/${icon}" alt="" aria-hidden="true" />
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

    // ==================== 4. MODULE KINH DỊCH & TAROT ====================
    const ICHING_HEXAGRAMS = [
        {
            num: 1,
            name: "Thuần Càn (Càn vi Thiên)",
            lines: [1, 1, 1, 1, 1, 1],
            judgment: "Càn: Nguyên, Hanh, Lợi, Trinh. Khí dương cương kiện, tự cường bất tức.",
            image: "Trời chuyển động mạnh mẽ, người quân tử noi theo mà tự lực vươn lên không ngừng nghỉ.",
            advice: "Thời cơ đại cát để khởi sự lớn, giữ vị thế chủ động, quyết đoán nhưng tránh kiêu ngạo.",
        },
        {
            num: 11,
            name: "Địa Thiên Thái (Càn hạ - Khôn thượng)",
            lines: [1, 1, 1, 0, 0, 0],
            judgment: "Thái: Tiểu vãng đại lai, cát hanh. Trời đất giao hòa, âm dương thông suốt.",
            image: "Khí trời và đất giao nhau tạo nên quẻ Thái. Bậc quân tử tài bồi cơ đồ giúp muôn dân an lạc.",
            advice: "Mọi sự bế tắc đã qua, vận hội hanh thông đang mở ra. Rất lợi cho hợp tác, ký kết và cầu tài.",
        },
        {
            num: 14,
            name: "Hỏa Thiên Đại Hữu (Càn hạ - Ly thượng)",
            lines: [1, 1, 1, 1, 0, 1],
            judgment: "Đại Hữu: Nguyên hanh. Mặt trời soi sáng trên bầu trời cao, phúc lộc dồi dào.",
            image: "Lửa ở trên trời là tượng quẻ Đại Hữu. Người quân tử ngăn điều ác, nêu cao điều thiện.",
            advice: "Tài vận và uy tín cùng vượng. Hãy giữ tâm khiêm cung và chia sẻ giá trị với cộng sự.",
        },
        {
            num: 18,
            name: "Sơn Phong Cổ (Tốn hạ - Cấn thượng)",
            lines: [0, 1, 1, 0, 0, 1],
            judgment: "Cổ: Nguyên hanh, lợi thiệp đại xuyên. Chỉnh đốn việc cũ để mở ra kỷ nguyên mới.",
            image: "Dưới núi có gió là tượng quẻ Cổ. Người quân tử chấn chỉnh phong hóa, nuôi dưỡng đức độ bền vững.",
            advice: "Đã đến lúc sửa chữa những thiếu sót cũ và đổi mới quy trình để tạo ra khởi đầu tốt đẹp hơn.",
        },
        {
            num: 63,
            name: "Thủy Hỏa Ký Tế (Ly hạ - Khảm thượng)",
            lines: [1, 0, 1, 0, 1, 0],
            judgment: "Ký Tế: Hanh tiểu, lợi trinh. Mọi việc đã hoàn thành trật tự viên mãn.",
            image: "Nước ở trên lửa là tượng quẻ Ký Tế. Người quân tử lúc thành công vẫn lo nghĩ phòng ngừa rủi ro.",
            advice: "Mục tiêu hiện tại đã đạt độ chín muồi. Hãy củng cố thành quả và chuẩn bị kỹ cho chu kỳ tiếp theo.",
        },
    ];

    const TAROT_CARDS = [
        {
            roman: "I",
            en: "THE MAGICIAN",
            vn: "Nhà Ảo Thuật (The Magician)",
            symbol: "🪄",
            keywords: "Hành động, kỹ năng điêu luyện, sự tập trung và biến ý tưởng thành hiện thực.",
            msg: "Bạn đã có đầy đủ nguồn lực và kỹ năng cần thiết trong tay. Đây là lúc bắt tay vào hành động ngay với sự tự tin cao nhất.",
        },
        {
            roman: "X",
            en: "WHEEL OF FORTUNE",
            vn: "Bánh Xe Số Phận (Wheel of Fortune)",
            symbol: "☸️",
            keywords: "Bước ngoặt may mắn, chu kỳ vận hội mới và nhân quả tốt lành.",
            msg: "Bánh xe thời vận đang xoay chuyển theo chiều hướng tích cực. Hãy linh hoạt đón nhận cơ hội mới vừa xuất hiện.",
        },
        {
            roman: "XIV",
            en: "TEMPERANCE",
            vn: "Sự Điều Độ (Temperance)",
            symbol: "⚖️",
            keywords: "Đại diện cho sự cân bằng, kiên nhẫn, sự hòa hợp và mục đích rõ ràng.",
            msg: "Sự cân bằng, hòa hợp và kiên nhẫn. Hãy tìm kiếm sự điều độ trong mọi khía cạnh của cuộc sống và kết hợp các yếu tố đối lập một cách hài hòa.",
        },
        {
            roman: "XVII",
            en: "THE STAR",
            vn: "Ngôi Sao Hy Vọng (The Star)",
            symbol: "🌟",
            keywords: "Niềm tin, cảm hứng sáng tạo, sự bình yên và tầm nhìn tương lai.",
            msg: "Sau những thử thách, bầu trời đã quang đãng trở lại. Hãy tin tưởng vào định hướng dài hạn và tỏa sáng theo cách riêng của bạn.",
        },
        {
            roman: "XIX",
            en: "THE SUN",
            vn: "Mặt Trời Rực Rỡ (The Sun)",
            symbol: "☀️",
            keywords: "Thành công viên mãn, niềm vui, sức sống tràn đầy và sự minh bạch.",
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
        setText("ic-hex-judgment", hex.judgment);
        setText("ic-hex-image", hex.image);
        setText("ic-hex-advice", hex.advice);
    };

    // ==================== 5. MODULE NGÀY NÀY NĂM XƯA (FETCH JSON) ====================
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

        grid.innerHTML = items.slice(0, 12).map((item) => {
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
        }).join("");
    };

    // ==================== 6. MODULE HOROSCOPE 12 CUNG HOÀNG ĐẠO ====================
    const HOROSCOPE_SIGNS = [
        {
            key: "capricorn",
            name: "Ma Kết (Capricorn)",
            symbol: "♑",
            dates: "22/12 – 19/01",
            element: "Nguyên tố Đất • Sao Thổ chủ quản",
            traits: "Có trách nhiệm, kỷ luật và đầy tham vọng. Ma Kết là người làm việc chăm chỉ, có tầm nhìn xa và luôn nỗ lực để đạt được mục tiêu đã đề ra.",
            daily: "Hôm nay năng lượng nguyên tố Đất giúp Ma Kết xử lý công việc và tài chính cực kỳ sáng suốt. Con số may mắn: 4, 8.",
        },
        {
            key: "aquarius",
            name: "Bảo Bình (Aquarius)",
            symbol: "♒",
            dates: "20/01 – 18/02",
            element: "Nguyên tố Khí • Sao Thiên Vương chủ quản",
            traits: "Độc lập, thông thái, giàu ý tưởng đổi mới công nghệ và luôn hướng tới giá trị nhân văn.",
            daily: "Một ý tưởng sáng tạo đột phá của Bảo Bình sẽ nhận được sự ủng hộ lớn từ đồng nghiệp hôm nay. Số may mắn: 7, 11.",
        },
        {
            key: "pisces",
            name: "Song Ngư (Pisces)",
            symbol: "♓",
            dates: "19/02 – 20/03",
            element: "Nguyên tố Nước • Sao Hải Vương chủ quản",
            traits: "Giàu lòng trắc ẩn, trực giác nhạy bén, tinh tế và có tâm hồn nghệ thuật phong phú.",
            daily: "Trực giác của Song Ngư hôm nay vô cùng chính xác; hãy lắng nghe tiếng nói bên trong. Số may mắn: 3, 9.",
        },
        {
            key: "aries",
            name: "Bạch Dương (Aries)",
            symbol: "♈",
            dates: "21/03 – 19/04",
            element: "Nguyên tố Lửa • Sao Hỏa chủ quản",
            traits: "Nhiệt huyết, tiên phong, dũng cảm và luôn tràn đầy năng lượng khởi đầu mới.",
            daily: "Ngày tuyệt vời để Bạch Dương khởi động dự án mới hoặc giải quyết dứt điểm việc tồn đọng. Số may mắn: 1, 9.",
        },
        {
            key: "taurus",
            name: "Kim Ngưu (Taurus)",
            symbol: "♉",
            dates: "20/04 – 20/05",
            element: "Nguyên tố Đất • Sao Kim chủ quản",
            traits: "Điềm tĩnh, đáng tin cậy, yêu cái đẹp và có năng lực quản lý tài sản vững vàng.",
            daily: "Tài vận của Kim Ngưu hôm nay rất ổn định; thích hợp lập kế hoạch tích lũy dài hạn. Số may mắn: 2, 6.",
        },
        {
            key: "gemini",
            name: "Song Tử (Gemini)",
            symbol: "♊",
            dates: "21/05 – 21/06",
            element: "Nguyên tố Khí • Sao Thủy chủ quản",
            traits: "Linh hoạt, giao tiếp sắc sảo, ham học hỏi và thích nghi nhanh với mọi hoàn cảnh.",
            daily: "Khả năng đàm phán và kết nối thông tin giúp Song Tử mở ra cơ hội hợp tác mới. Số may mắn: 5, 14.",
        },
        {
            key: "cancer",
            name: "Cự Giải (Cancer)",
            symbol: "♋",
            dates: "22/06 – 22/07",
            element: "Nguyên tố Nước • Mặt Trăng chủ quản",
            traits: "Chu đáo, ấm áp, trọng tình nghĩa và luôn là hậu phương vững chắc cho gia đình.",
            daily: "Không gian ấm cúng và sự sẻ chia chân thành mang lại nguồn năng lượng bình an cho Cự Giải. Số may mắn: 2, 7.",
        },
        {
            key: "leo",
            name: "Sư Tử (Leo)",
            symbol: "♌",
            dates: "23/07 – 22/08",
            element: "Nguyên tố Lửa • Mặt Trời chủ quản",
            traits: "Tự tin, hào sảng, bản lĩnh dẫn dắt và luôn tỏa sáng với nguồn năng lượng ấm áp.",
            daily: "Sự quyết đoán và phong thái tự tin giúp Sư Tử ghi điểm ấn tượng trong mắt đối tác. Số may mắn: 1, 5.",
        },
        {
            key: "virgo",
            name: "Xử Nữ (Virgo)",
            symbol: "♍",
            dates: "23/08 – 22/09",
            element: "Nguyên tố Đất • Sao Thủy chủ quản",
            traits: "Tỉ mỉ, chuẩn mực, tư duy phân tích hệ thống sắc bén và luôn hướng tới sự hoàn thiện.",
            daily: "Sự cẩn trọng đến từng chi tiết giúp Xử Nữ tối ưu hóa quy trình làm việc đạt hiệu suất cao nhất. Số may mắn: 5, 15.",
        },
        {
            key: "libra",
            name: "Thiên Bình (Libra)",
            symbol: "♎",
            dates: "23/09 – 23/10",
            element: "Nguyên tố Khí • Sao Kim chủ quản",
            traits: "Công bằng, lịch thiệp, giàu gu thẩm mỹ và có biệt tài dung hòa các mối quan hệ.",
            daily: "Thiên Bình dễ dàng đạt được thỏa thuận đôi bên cùng có lợi trong các cuộc trao đổi. Số may mắn: 6, 9.",
        },
        {
            key: "scorpio",
            name: "Bọ Cạp (Scorpio)",
            symbol: "♏",
            dates: "24/10 – 21/11",
            element: "Nguyên tố Nước • Sao Diêm Vương chủ quản",
            traits: "Sâu sắc, quyết liệt, tập trung cao độ và có nội lực bứt phá mạnh mẽ.",
            daily: "Sự tập trung bền bỉ giúp Bọ Cạp nhìn thấu bản chất vấn đề và nắm bắt cơ hội chiến lược. Số may mắn: 8, 18.",
        },
        {
            key: "sagittarius",
            name: "Nhân Mã (Sagittarius)",
            symbol: "♐",
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

    const renderHoroscopeSign = (sign) => {
        setText("hs-sign-symbol", sign.symbol);
        setText("hs-sign-dates", sign.dates);
        setText("hs-sign-element", sign.element);
        setText("hs-sign-name", sign.name);
        setText("hs-sign-traits", sign.traits);
        setHtml("hs-sign-daily", `<strong>Luận giải cho ngày hôm nay:</strong> ${sign.daily}`);

        const grid = document.getElementById("hs-signs-grid");
        if (grid) {
            grid.innerHTML = HOROSCOPE_SIGNS.map(
                (s) => `
                    <button
                        type="button"
                        class="util-sign-btn ${s.key === sign.key ? "is-active" : ""}"
                        data-sign-key="${s.key}"
                    >
                        <span>${s.symbol}</span>
                        <strong>${s.name.split("(")[0].trim()}</strong>
                        <small>${s.dates}</small>
                    </button>
                `,
            ).join("");
        }
    };

    // ==================== 7. MODULE TÍNH KHOẢNG CÁCH & CỘNG/TRỪ NGÀY ====================
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
        setText("dd-total-days-badge", `Tổng cộng: ${(diffMs / 86400000).toFixed(2)} ngày`);

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
        const baseVal = document.getElementById("as-base-date")?.value;
        if (!baseVal) return;
        const [by, bm, bd] = baseVal.split("-").map(Number);
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
            dateCalcMode === "sub" ? "Kết quả sau khi trừ đi" : "Kết quả sau khi cộng thêm",
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

    // ==================== 8. MODULE THẦN SỐ HỌC PYTHAGORAS ====================
    const NUMEROLOGY_MEANINGS = {
        1: { title: "Nhà Tiên Phong Độc Lập", desc: "Đại diện cho khả năng lãnh đạo, tự chủ, quyết đoán và mở đường." },
        2: { title: "Người Hòa Giải Tinh Tế", desc: "Đại diện cho sự lắng nghe, ngoại giao khéo léo, trực giác và hợp tác." },
        3: { title: "Người Truyền Cảm Hứng & Sáng Tạo", desc: "Đại diện cho tư duy nhạy bén, ngôn từ sắc sảo, nghệ thuật và niềm vui." },
        4: { title: "Kiến Trúc Sư Thực Tế", desc: "Đại diện cho tính kỷ luật, quy trình vững chắc, nguyên tắc và sự bền bỉ." },
        5: { title: "Người Tự Do & Đổi Mới", desc: "Đại diện cho sự linh hoạt, kết nối đa chiều, trải nghiệm và bứt phá." },
        6: { title: "Người Nuôi Dưỡng & Trách Nhiệm", desc: "Đại diện cho tình yêu thương gia đình, sự tận tâm, thẩm mỹ và phụng sự." },
        7: { title: "Nhà Triết Học & Nghiên Cứu Chuyên Sâu", desc: "Đại diện cho chiều sâu học thuật, phân tích bản chất, nội tâm và chiêm nghiệm." },
        8: { title: "Nhà Điều Hành & Tài Chính", desc: "Đại diện cho năng lực quản trị, nhạy bén kinh doanh, quyền lực và thịnh vượng." },
        9: { title: "Nhà Nhân Đạo & Lý Tưởng Lớn", desc: "Đại diện cho tầm nhìn bao dung, trách nhiệm cộng đồng và sự viên mãn." },
        11: { title: "Số Master 11/2 • Trực Giác Tâm Linh Cao", desc: "Bậc thầy truyền cảm hứng tinh thần, nhạy cảm và thấu thị sâu sắc." },
        22: { title: "Số Master 22/4 • Kiến Tạo Đại Sự", desc: "Kết hợp tầm nhìn lớn với năng lực thực thi thực tế để tạo di sản bền vững." },
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
        const allDigits = val.replace(/-/g, "").split("").map(Number);
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
                .map(([num, label]) => {
                    const str = counts[num] || "—";
                    return `
                        <div class="util-pythagoras-cell ${counts[num] ? "has-val" : ""}">
                            <small>Ô số ${num} (${label})</small>
                            <strong>${str}</strong>
                        </div>
                    `;
                })
                .join("");
        }
    };

    const renderNumerologyMonthCalendar = (selectedDay = 14) => {
        const year = 2026;
        const month = 11;
        const firstDayJs = new Date(year, month - 1, 1).getDay();
        const leading = (firstDayJs + 6) % 7;
        const maxDays = 30;
        const grid = document.getElementById("num-month-grid");
        if (!grid) return;

        const updateSelectedNumDay = (d) => {
            const raw = `${pad(d)}${pad(month)}${year}`
                .split("")
                .reduce((a, b) => a + Number(b), 0);
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
                html += `<div class="util-num-day-cell is-muted"><small>—</small><strong>•</strong></div>`;
            } else {
                const raw = `${pad(d)}${pad(month)}${year}`
                    .split("")
                    .reduce((a, b) => a + Number(b), 0);
                const num = reduceNum(raw, true);
                html += `
                    <button
                        type="button"
                        class="util-num-day-cell ${d === selectedDay ? "is-active" : ""}"
                        data-num-cal-day="${d}"
                    >
                        <small>${d}</small>
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

    // ==================== 9. MODULE NHỊP SINH HỌC BIORHYTHM (ĐÃ FIX CHUẨN CÚ PHÁP SVG PATH) ====================
    const renderBiorhythm = () => {
        const val = document.getElementById("bio-birth-input")?.value || "1987-01-13";
        const [by, bm, bd] = val.split("-").map(Number);
        const birthDate = new Date(by, bm - 1, bd);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const daysAlive = Math.floor((todayStart - birthDate) / 86400000);

        const cycles = [
            { key: "phys", name: "Thể chất (23 ngày)", period: 23, color: "#2563eb" },
            { key: "emo", name: "Tình cảm (28 ngày)", period: 28, color: "#10b981" },
            { key: "intel", name: "Trí tuệ (33 ngày)", period: 33, color: "#f97316" },
            { key: "intuit", name: "Trực giác (38 ngày)", period: 38, color: "#8b5cf6" },
        ];

        const statsGrid = document.getElementById("bio-stats-grid");
        if (statsGrid) {
            statsGrid.innerHTML = cycles
                .map((c) => {
                    const pct = Math.round(Math.sin((2 * Math.PI * daysAlive) / c.period) * 100);
                    let state = "Trạng thái ổn định";
                    if (Math.abs(pct) <= 10) state = "⚠️ Ngày giao điểm (Cần lưu ý)";
                    else if (pct >= 50) state = "🌟 Năng lượng đỉnh cao";
                    else if (pct < 0) state = "🌙 Giai đoạn nạp năng lượng";

                    return `
                        <article class="util-bio-stat-card">
                            <div class="util-bio-stat-card__head">
                                <span>${c.name}</span>
                            </div>
                            <strong class="util-bio-stat-card__val" style="color: ${c.color}">
                                ${pct > 0 ? `+${pct}%` : `${pct}%`}
                            </strong>
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
        const bottomPad = 32;
        const plotW = svgW - leftPad - rightPad;
        const plotH = svgH - topPad - bottomPad;
        const midY = topPad + plotH / 2;

        // ✅ ĐÃ FIX TRIỆT ĐỂ LỖI CÚ PHÁP TẠI ĐÂY: Tách rõ cmd = i === 0 ? "M" : "L"
        const pathsHtml = cycles
            .map((c) => {
                const pts = [];
                for (let i = 0; i <= 30; i++) {
                    const x = leftPad + (i / 30) * plotW;
                    const v = Math.sin((2 * Math.PI * (daysAlive + i)) / c.period);
                    const y = midY - v * (plotH / 2);
                    const cmd = i === 0 ? "M" : "L";
                    pts.push(`${cmd}${x.toFixed(1)},${y.toFixed(1)}`);
                }
                return `<path d="${pts.join(" ")}" fill="none" stroke="${c.color}" stroke-width="2.6" stroke-linecap="round" />`;
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

    // ==================== 10. MODULE TỪ ĐIỂN CỔ HỌC PHONG THỦY ====================
    const FENGSHUI_DICT = [
        ["Hải Trung Kim", "Giáp Tý, Ất Sửu", "fs-napam", "./assets/icons/metal.svg", false, "Vàng dưới biển — Nội lực tiềm ẩn, sâu sắc, điềm tĩnh và bền bỉ. Hợp mệnh Thủy, Thổ, Kim."],
        ["Lư Trung Hỏa", "Bính Dần, Đinh Mão", "fs-napam", "./assets/icons/fire.svg", false, "Lửa trong lò — Nhiệt huyết được tôi luyện, ấm áp và kiên định. Hợp mệnh Thổ, Mộc, Hỏa."],
        ["Đại Lâm Mộc", "Mậu Thìn, Kỷ Tỵ", "fs-napam", "./assets/icons/wood.svg", false, "Gỗ rừng già — Vững chãi, che chở, nhân hậu và giàu sức sống. Hợp mệnh Hỏa, Thủy, Mộc."],
        ["Lộ Bàng Thổ", "Canh Ngọ, Tân Mùi", "fs-napam", "./assets/icons/earth.svg", false, "Đất ven đường — Bằng phẳng, gắn kết giao thương và thực tế. Hợp mệnh Kim, Hỏa, Thổ."],
        ["Kiếm Phong Kim", "Nhâm Thân, Quý Dậu", "fs-napam", "./assets/icons/metal.svg", false, "Vàng mũi kiếm — Sắc bén, quyết đoán, bản lĩnh và mạnh mẽ. Hợp mệnh Thủy, Thổ, Kim."],
        ["Giản Hạ Thủy", "Bính Tý, Đinh Sửu", "fs-napam", "./assets/icons/water.svg", false, "Nước dưới khe — Dòng chảy ngầm tĩnh lặng, tinh tế và linh hoạt. Hợp mệnh Mộc, Kim, Thủy."],
        ["Tuyền Trung Thủy", "Giáp Thân, Ất Dậu", "fs-napam", "./assets/icons/water.svg", false, "Nước trong suối — Nguồn nước mát lành, trí tuệ và dồi dào. Hợp mệnh Mộc, Kim, Thủy."],
        ["Tùng Bách Mộc", "Canh Dần, Tân Mão", "fs-napam", "./assets/icons/wood.svg", false, "Gỗ tùng bách — Bất khuất trước gió sương, trường thọ và chính trực. Hợp mệnh Hỏa, Thủy, Mộc."],
        ["Trường Lưu Thủy", "Nhâm Thìn, Quý Tỵ", "fs-napam", "./assets/icons/water.svg", false, "Nước chảy dài — Kiên trì, vươn xa biển lớn và không ngừng vận động. Hợp mệnh Mộc, Kim, Thủy."],
        ["Bình Địa Mộc", "Mậu Tuất, Kỷ Hợi", "fs-napam", "./assets/icons/wood.svg", false, "Cây đất bằng — Ôn hòa, phát triển thuận lợi và dễ kết giao. Hợp mệnh Hỏa, Thủy, Mộc."],
        ["Thiên Hà Thủy", "Bính Ngọ, Đinh Mùi", "fs-napam", "./assets/icons/water.svg", false, "Nước mưa trên trời — Thanh khiết, rộng lớn và nuôi dưỡng vạn vật. Hợp mệnh Mộc, Kim, Thủy."],
        ["Cung Đại An", "Khổng Minh Lục Diệu • Đại Cát", "fs-lucdieu", "./assets/icons/fengshui/lucdieu-daian.svg", true, "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên ổn. Hợp khởi sự, ký kết, xuất hành."],
        ["Cung Lưu Niên", "Khổng Minh Lục Diệu • Thận Trọng", "fs-lucdieu", "./assets/icons/fengshui/lucdieu-luunien.svg", true, "Mưu sự dễ chậm trễ, cầu lộc chưa thông; nên ưu tiên xử lý việc tồn đọng và rà soát hồ sơ."],
        ["Cung Tốc Hỷ", "Khổng Minh Lục Diệu • Cát Tinh", "fs-lucdieu", "./assets/icons/fengshui/lucdieu-tochy.svg", true, "Tin vui đến nhanh, mưu sự đại cát; thời điểm vàng để thương thảo, khai trương và kết nối quý nhân."],
        ["Cung Xích Khẩu", "Khổng Minh Lục Diệu • Đề Phòng Khẩu Thiệt", "fs-lucdieu", "./assets/icons/fengshui/lucdieu-xichkhau.svg", true, "Dễ xảy ra bất đồng lời ăn tiếng nói; nên giữ thái độ hòa nhã và cẩn trọng văn bản hợp đồng."],
        ["Cung Tiểu Cát", "Khổng Minh Lục Diệu • Quý Nhân Phù Trợ", "fs-lucdieu", "./assets/icons/fengshui/lucdieu-tieucat.svg", true, "Cát lành, hòa hợp, mưu sự suôn sẻ và rất thuận lợi cho giao dịch tài chính, mở hàng."],
        ["Cung Không Vong", "Khổng Minh Lục Diệu • Tránh Việc Lớn", "fs-lucdieu", "./assets/icons/fengshui/lucdieu-khongvong.svg", true, "Cầu tài chưa lợi; thích hợp nghỉ ngơi, học tập, lập kế hoạch nội bộ hoặc làm việc thiện nguyện."],
        ["Quẻ Càn (☰)", "Bát Quái • Hướng Tây Bắc (Hành Kim)", "fs-bagua", "./assets/icons/zodiac/dog.svg", true, "Tượng trưng cho Trời lớn, cương kiện, uy quyền, lãnh đạo và tầm nhìn chiến lược."],
        ["Quẻ Khảm (☵)", "Bát Quái • Hướng Chính Bắc (Hành Thủy)", "fs-bagua", "./assets/icons/zodiac/mouse.svg", true, "Tượng trưng cho Nước sâu, trí tuệ uyên bác, nghiên cứu và sự linh hoạt."],
        ["Quẻ Chấn (☳)", "Bát Quái • Hướng Chính Đông (Hành Mộc)", "fs-bagua", "./assets/icons/zodiac/cat.svg", true, "Tượng trưng cho Sấm động mùa xuân, sinh khí bừng tỉnh và khởi đầu mới."],
        ["Quẻ Tốn (☴)", "Bát Quái • Hướng Đông Nam (Hành Mộc)", "fs-bagua", "./assets/icons/zodiac/dragon.svg", true, "Tượng trưng cho Gió thuận, giao thương hanh thông và cung Tài Lộc."],
        ["Quẻ Ly (☲)", "Bát Quái • Hướng Chính Nam (Hành Hỏa)", "fs-bagua", "./assets/icons/zodiac/horse.svg", true, "Tượng trưng cho Lửa sáng, danh vọng, truyền thông và nhiệt huyết."],
        ["Quẻ Khôn (☷)", "Bát Quái • Hướng Tây Nam (Hành Thổ)", "fs-bagua", "./assets/icons/zodiac/goat.svg", true, "Tượng trưng cho Đất mẹ bao dung, bất động sản, nhân sự và gia đạo."],
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

    // ==================== ĐIỀU KHIỂN MENU MOBILE & BENTO DUAL-NAVBAR ====================
    const toggleMobileUtilMenu = (forceClose = false) => {
        const nav = document.getElementById("util-primary-nav");
        const burger = document.getElementById("util-burger-btn");
        const backdrop = document.getElementById("util-mobile-backdrop");
        if (!nav || !burger || !backdrop) return;

        const isOpen = nav.classList.contains("is-open");
        const nextState = forceClose ? false : !isOpen;

        nav.classList.toggle("is-open", nextState);
        burger.classList.toggle("is-active", nextState);
        backdrop.classList.toggle("is-active", nextState);
        burger.setAttribute("aria-expanded", String(nextState));

        document.body.style.overflow = nextState ? "hidden" : "";
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

    const initUtilitiesPage = () => {
        const mainEl = document.getElementById("main");
        if (!mainEl || mainEl.dataset.utilBound === "true") return;
        mainEl.dataset.utilBound = "true";

        renderStopwatchLaps();
        renderAlarmsList();
        renderInlineConverter();
        renderSolarTermsPanel();
        renderIChingHexagram(ICHING_HEXAGRAMS[2]);
        renderHistoryMonthEvents(11);
        renderHoroscopeSign(HOROSCOPE_SIGNS[0]);
        computeDateDiff();
        computeDateAddSub();
        renderNumerologyPersonal();
        renderNumerologyMonthCalendar(new Date().getDate());
        renderBiorhythm();
        renderFengShuiDict();

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

        // Hỗ trợ cả 2 ID nút mở nhanh Converter Modal (ở bản 8 tab và bản 10 tab)
        const handleOpenModal = () => {
            if (typeof window.openConverterModal === "function") window.openConverterModal(true);
            else document.getElementById("widget-trigger-btn")?.click();
        };
        document.getElementById("util-open-modal-btn")?.addEventListener("click", handleOpenModal);
        document.getElementById("util-shortcut-converter")?.addEventListener("click", handleOpenModal);

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
                if (swStartBtn) swStartBtn.innerHTML = "<span>&#9654; Bắt đầu</span>";
                if (swLapBtn) swLapBtn.disabled = true;
                renderStopwatchLaps();
            };
        }

        // 1.2. Sự kiện Đồng hồ đếm ngược
        const syncCountdownDisplay = (sec) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            setText("cd-display-digits", `${pad(h)}:${pad(m)}:${pad(s)}`);
        };

        document.querySelectorAll("[data-cd-preset]").forEach((chip) => {
            chip.onclick = () => {
                document.querySelectorAll("[data-cd-preset]").forEach((c) => c.classList.toggle("is-active", c === chip));
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

        // 1.3. Sự kiện Đồng hồ báo thức
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
            const id = Number(delBtn.dataset.delAlarm);
            alarmsList = alarmsList.filter((a) => a.id !== id);
            renderAlarmsList();
        });

        setInterval(() => {
            const now = new Date();
            setText(
                "al-live-clock-pill",
                `Giờ hiện tại: ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
            );
            if (now.getSeconds() === 0) {
                alarmsList.forEach((a) => {
                    if (a.enabled && a.hour === now.getHours() && a.minute === now.getMinutes()) {
                        playBellChime();
                    }
                });
            }
        }, 1000);

        // 2. Sự kiện Đổi ngày tại chỗ
        ["uc-day", "uc-month", "uc-year", "uc-mode"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", renderInlineConverter);
            document.getElementById(id)?.addEventListener("change", renderInlineConverter);
        });
        document.getElementById("uc-today-btn")?.addEventListener("click", () => {
            const now = new Date();
            const dEl = document.getElementById("uc-day");
            const mEl = document.getElementById("uc-month");
            const yEl = document.getElementById("uc-year");
            const modeEl = document.getElementById("uc-mode");
            if (dEl) dEl.value = String(now.getDate());
            if (mEl) mEl.value = String(now.getMonth() + 1);
            if (yEl) yEl.value = String(now.getFullYear());
            if (modeEl) modeEl.value = "solar2lunar";
            renderInlineConverter();
        });

        // 3. Sự kiện Tiết Khí
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

        // 4. Sự kiện Kinh Dịch & Tarot
        document.getElementById("ic-cast-btn")?.addEventListener("click", () => {
            const randomHex = ICHING_HEXAGRAMS[Math.floor(Math.random() * ICHING_HEXAGRAMS.length)];
            renderIChingHexagram(randomHex);
        });

        document.getElementById("tr-draw-btn")?.addEventListener("click", () => {
            const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
            const isUpright = Math.random() > 0.25;
            setText("tr-card-roman", card.roman);
            setText("tr-card-symbol", card.symbol);
            setText("tr-card-en", card.en);
            setText(
                "tr-card-orientation",
                isUpright ? "Lá bài Xuôi (Upright)" : "Lá bài Ngược (Reversed • Cần chiêm nghiệm nội tâm)",
            );
            setText("tr-card-vn", card.vn);
            setText("tr-card-keywords", card.keywords);
            setText("tr-card-message", card.msg);
        });

        // 5. Sự kiện Ngày Này Năm Xưa
        document.getElementById("hi-month-select")?.addEventListener("change", (e) => {
            renderHistoryMonthEvents(Number(e.target.value) || 11);
        });

        // 6. Sự kiện Horoscope
        document.getElementById("hs-birth-input")?.addEventListener("change", (e) => {
            const [, m, d] = (e.target.value || "1987-01-13").split("-").map(Number);
            renderHoroscopeSign(getSignByMonthDay(m, d));
        });

        document.getElementById("hs-signs-grid")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-sign-key]");
            if (!btn) return;
            const found = HOROSCOPE_SIGNS.find((s) => s.key === btn.dataset.signKey);
            if (found) renderHoroscopeSign(found);
        });

        // 7. Sự kiện Tính khoảng cách
        document.getElementById("dd-start-date")?.addEventListener("change", computeDateDiff);
        document.getElementById("dd-end-date")?.addEventListener("change", computeDateDiff);

        ["as-base-date", "as-years", "as-months", "as-weeks", "as-days"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", computeDateAddSub);
        });

        document.getElementById("as-today-btn")?.addEventListener("click", () => {
            const now = new Date();
            const baseInput = document.getElementById("as-base-date");
            if (baseInput) {
                baseInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
            }
            computeDateAddSub();
        });

        // 8, 9, 10. Sự kiện Thần số học, Nhịp sinh học & Tìm kiếm Từ điển
        document.getElementById("num-birth-input")?.addEventListener("change", renderNumerologyPersonal);
        document.getElementById("bio-birth-input")?.addEventListener("change", renderBiorhythm);
        document.getElementById("fs-search-input")?.addEventListener("input", () => renderFengShuiDict());
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUtilitiesPage);
    } else {
        initUtilitiesPage();
    }
    window.addEventListener("template-loaded", initUtilitiesPage);
})();