// assets/js/day-calendar.js
// Chuyên trách Trang Ngày (day.html): Tờ lịch Bloc 16:9, Hướng Xuất Hành, Khổng Minh Lục Diệu,
// Mặt Trời 4 miền & Bảng 12 Canh Giờ (1 Cột Lớn 12 Dòng + Vòng SVG Ngũ Hành Động + 5 Bento Tooltips & Link SEO)
(() => {
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let viewingDate = new Date();
    let activeHourFilter = "all"; // "all" | "good" | "bad"
    const monthApiCache = new Map();
    let activeDayVnEvents = [];
    let activeDayIntlEvents = [];
    let currentVnEventIndex = 0;
    let currentIntlEventIndex = 0;

    const pad = (n) => String(n).padStart(2, "0");

    const toSlug = (str) =>
        String(str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    const fullViDateFormatter = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Ánh xạ 10 Thiên Can (0: Giáp -> 9: Quý) sang 5 Hành chuẩn Bát Tự
    const STEM_TO_ELEMENT = [
        "wood", // 0: Giáp -> Mộc
        "wood", // 1: Ất   -> Mộc
        "fire", // 2: Bính -> Hỏa
        "fire", // 3: Đinh -> Hỏa
        "earth", // 4: Mậu  -> Thổ
        "earth", // 5: Kỷ   -> Thổ
        "metal", // 6: Canh -> Kim
        "metal", // 7: Tân  -> Kim
        "water", // 8: Nhâm -> Thủy
        "water", // 9: Quý  -> Thủy
    ];

    const ELEMENT_VN_NAME = {
        fire: "Hỏa",
        earth: "Thổ",
        metal: "Kim",
        water: "Thủy",
        wood: "Mộc",
    };

    const HY_THAN_BY_STEM = [
        "Đông Bắc",
        "Tây Bắc",
        "Tây Nam",
        "Chính Nam",
        "Đông Nam",
        "Đông Bắc",
        "Tây Bắc",
        "Tây Nam",
        "Chính Nam",
        "Đông Nam",
    ];

    const TAI_THAN_BY_STEM = [
        "Đông Nam",
        "Đông Nam",
        "Chính Đông",
        "Chính Đông",
        "Chính Bắc",
        "Chính Nam",
        "Tây Nam",
        "Tây Nam",
        "Chính Tây",
        "Tây Bắc",
    ];

    const HAC_THAN_DIRECTIONS = [
        "Đông Bắc",
        "Chính Đông",
        "Đông Nam",
        "Chính Nam",
        "Tây Nam",
        "Chính Tây",
        "Tây Bắc",
        "Chính Bắc",
    ];

    const LUC_DIEU_6 = [
        {
            name: "Đại An",
            isGood: true,
            desc: "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên ổn.",
        },
        {
            name: "Lưu Niên",
            isGood: false,
            desc: "Mưu sự dễ chậm trễ, cầu lộc chưa thông, cần đề phòng khẩu thiệt.",
        },
        {
            name: "Tốc Hỷ",
            isGood: true,
            desc: "Tin vui đến nhanh, mưu sự đại cát, thuận lợi cho việc gặp gỡ, ký kết.",
        },
        {
            name: "Xích Khẩu",
            isGood: false,
            desc: "Dễ xảy ra bất hòa, tranh cãi; nên cẩn trọng lời ăn tiếng nói và hợp đồng.",
        },
        {
            name: "Tiểu Cát",
            isGood: true,
            desc: "Cát lành, hòa hợp, mưu sự suôn sẻ và dễ gặp quý nhân phù trợ.",
        },
        {
            name: "Không Vong",
            isGood: false,
            desc: "Cầu tài không lợi, mưu sự dễ trắc trở, không nên tiến hành việc đại sự.",
        },
    ];

    // Đầy đủ range, key và giải nghĩa Quẻ Bát Quái + Linh Vật cho cả 12 Canh Giờ (Không còn lỗi undefined)
    const HOUR_LABELS_12 = [
        {
            chi: "Tý",
            key: "ty",
            short: "23-1",
            range: "23:00 – 01:00",
            icon: "mouse.svg",
            animalName: "Linh vật Chuột (Tý)",
            bagua: "Khảm • Chính Bắc",
            baguaDesc: "Quẻ Khảm tượng trưng cho Nước & Trí tuệ sâu sắc, phương vị Chính Bắc.",
        },
        {
            chi: "Sửu",
            key: "suu",
            short: "1-3",
            range: "01:00 – 03:00",
            icon: "buffalo.svg",
            animalName: "Linh vật Trâu (Sửu)",
            bagua: "Cấn • Đông Bắc",
            baguaDesc: "Quẻ Cấn tượng trưng cho Núi vững chãi & Sự tĩnh tâm, phương vị Đông Bắc.",
        },
        {
            chi: "Dần",
            key: "dan",
            short: "3-5",
            range: "03:00 – 05:00",
            icon: "tiger.svg",
            animalName: "Linh vật Hổ (Dần)",
            bagua: "Cấn • Đông Bắc",
            baguaDesc: "Quẻ Cấn tượng trưng cho Núi cao & Ý chí khởi đầu mạnh mẽ, phương vị Đông Bắc.",
        },
        {
            chi: "Mão",
            key: "mao",
            short: "5-7",
            range: "05:00 – 07:00",
            icon: "cat.svg",
            animalName: "Linh vật Mèo (Mão)",
            bagua: "Chấn • Chính Đông",
            baguaDesc: "Quẻ Chấn tượng trưng cho Sấm động & Sinh khí bừng tỉnh, phương vị Chính Đông.",
        },
        {
            chi: "Thìn",
            key: "thin",
            short: "7-9",
            range: "07:00 – 09:00",
            icon: "dragon.svg",
            animalName: "Linh vật Rồng (Thìn)",
            bagua: "Tốn • Đông Nam",
            baguaDesc: "Quẻ Tốn tượng trưng cho Gió thuận & Giao thương hanh thông, phương vị Đông Nam.",
        },
        {
            chi: "Tỵ",
            key: "ty_snake",
            short: "9-11",
            range: "09:00 – 11:00",
            icon: "snake.svg",
            animalName: "Linh vật Rắn (Tỵ)",
            bagua: "Tốn • Đông Nam",
            baguaDesc: "Quẻ Tốn tượng trưng cho Sự uyển chuyển & Tài lộc lan tỏa, phương vị Đông Nam.",
        },
        {
            chi: "Ngọ",
            key: "ngo",
            short: "11-13",
            range: "11:00 – 13:00",
            icon: "horse.svg",
            animalName: "Linh vật Ngựa (Ngọ)",
            bagua: "Ly • Chính Nam",
            baguaDesc: "Quẻ Ly tượng trưng cho Lửa sáng, Danh vọng & Nhiệt huyết, phương vị Chính Nam.",
        },
        {
            chi: "Mùi",
            key: "mui",
            short: "13-15",
            range: "13:00 – 15:00",
            icon: "goat.svg",
            animalName: "Linh vật Dê (Mùi)",
            bagua: "Khôn • Tây Nam",
            baguaDesc: "Quẻ Khôn tượng trưng cho Đất mẹ bao dung & Sự nuôi dưỡng, phương vị Tây Nam.",
        },
        {
            chi: "Thân",
            key: "than",
            short: "15-17",
            range: "15:00 – 17:00",
            icon: "monkey.svg",
            animalName: "Linh vật Khỉ (Thân)",
            bagua: "Khôn • Tây Nam",
            baguaDesc: "Quẻ Khôn kết hợp linh vật Khỉ nhạy bén, thuận lợi cho ứng biến, phương vị Tây Nam.",
        },
        {
            chi: "Dậu",
            key: "dau",
            short: "17-19",
            range: "17:00 – 19:00",
            icon: "rooster.svg",
            animalName: "Linh vật Gà (Dậu)",
            bagua: "Đoài • Chính Tây",
            baguaDesc: "Quẻ Đoài tượng trưng cho Đầm nước, Niềm vui & Giao tiếp, phương vị Chính Tây.",
        },
        {
            chi: "Tuất",
            key: "tuat",
            short: "19-21",
            range: "19:00 – 21:00",
            icon: "dog.svg",
            animalName: "Linh vật Chó (Tuất)",
            bagua: "Càn • Tây Bắc",
            baguaDesc: "Quẻ Càn tượng trưng cho Trời lớn, Uy quyền & Sự trung tín, phương vị Tây Bắc.",
        },
        {
            chi: "Hợi",
            key: "hoi",
            short: "21-23",
            range: "21:00 – 23:00",
            icon: "pig.svg",
            animalName: "Linh vật Hợi (Lợn)",
            bagua: "Càn • Tây Bắc",
            baguaDesc: "Quẻ Càn tượng trưng cho Sự viên mãn, sung túc & Nghỉ ngơi, phương vị Tây Bắc.",
        },
    ];

    // Bảng 30 Nạp Âm kèm giải nghĩa dễ hiểu cho người mới tra cứu
    const NAP_AM_30_INFO = [
        { name: "Hải Trung Kim", meaning: "Vàng dưới biển — Nội lực tiềm ẩn, sâu sắc và bền bỉ." },
        { name: "Lư Trung Hỏa", meaning: "Lửa trong lò — Nhiệt huyết được tôi luyện, ấm áp và kiên định." },
        { name: "Đại Lâm Mộc", meaning: "Gỗ rừng già — Vững chãi, che chở và giàu sức sống." },
        { name: "Lộ Bàng Thổ", meaning: "Đất ven đường — Bằng phẳng, gắn kết và thực tế." },
        { name: "Kiếm Phong Kim", meaning: "Vàng mũi kiếm — Sắc bén, quyết đoán và mạnh mẽ." },
        { name: "Sơn Đầu Hỏa", meaning: "Lửa đầu núi — Rực rỡ, lan tỏa và giàu cảm hứng." },
        { name: "Giản Hạ Thủy", meaning: "Nước dưới khe — Dòng chảy ngầm tĩnh lặng, tinh tế và linh hoạt." },
        { name: "Thành Đầu Thổ", meaning: "Đất tường thành — Bảo vệ vững chắc, kỷ luật và đáng tin cậy." },
        { name: "Bạch Lạp Kim", meaning: "Vàng chân đèn — Tinh khiết, đang trong quá trình rèn giũa thành tài." },
        { name: "Dương Liễu Mộc", meaning: "Gỗ cây dương liễu — Mềm mại, uyển chuyển và khéo léo ứng biến." },
        { name: "Tuyền Trung Thủy", meaning: "Nước trong suối — Nguồn nước mát lành, trí tuệ và dồi dào." },
        { name: "Ốc Thượng Thổ", meaning: "Đất ngói lợp nhà — Che chở, ổn định và giữ gìn gia đạo." },
        { name: "Tích Lịch Hỏa", meaning: "Lửa sấm sét — Nguồn năng lượng bùng nổ, quyết liệt và đột phá." },
        { name: "Tùng Bách Mộc", meaning: "Gỗ tùng bách — Bất khuất trước gió sương, trường thọ và chính trực." },
        { name: "Trường Lưu Thủy", meaning: "Nước chảy dài — Kiên trì, vươn xa và không ngừng vận động." },
        { name: "Sa Trung Kim", meaning: "Vàng trong cát — Quý giá, cần sự đãi lọc để tỏa sáng." },
        { name: "Sơn Hạ Hỏa", meaning: "Lửa chân núi — Ấm áp, gần gũi và nuôi dưỡng thực chất." },
        { name: "Bình Địa Mộc", meaning: "Cây đất bằng — Ôn hòa, phát triển thuận lợi và dễ gần." },
        { name: "Bích Thượng Thổ", meaning: "Đất vách tường — Điểm tựa an toàn, tỉ mỉ và chu đáo." },
        { name: "Kim Bạch Kim", meaning: "Vàng pha bạc — Sang trọng, tinh tế và sắc sảo." },
        { name: "Phú Đăng Hỏa", meaning: "Lửa đèn lớn — Soi sáng trí tuệ, ấm cúng và dẫn đường." },
        { name: "Thiên Hà Thủy", meaning: "Nước mưa trên trời — Thanh khiết, rộng lớn và潤泽 vạn vật." },
        { name: "Đại Trạch Thổ", meaning: "Đất đầm lớn — Phì nhiêu, bao dung và giàu tiềm năng." },
        { name: "Thoa Xuyến Kim", meaning: "Vàng trang sức — Quý phái, thẩm mỹ cao và được trân trọng." },
        { name: "Tang Đố Mộc", meaning: "Gỗ cây dâu — Hữu ích, bền bỉ và mang lại giá trị thiết thực." },
        { name: "Đại Khê Thủy", meaning: "Nước khe lớn — Mạnh mẽ, khoáng đạt và giàu năng lượng." },
        { name: "Sa Trung Thổ", meaning: "Đất pha cát — Linh hoạt, dễ thích nghi với mọi hoàn cảnh." },
        { name: "Thiên Thượng Hỏa", meaning: "Lửa trên trời (Mặt trời) — Quang minh, chính đại và tràn đầy sinh lực." },
        { name: "Thạch Lựu Mộc", meaning: "Gỗ cây thạch lựu — Dẻo dai, kiên cường và kết trái ngọt lành." },
        { name: "Đại Hải Thủy", meaning: "Nước biển lớn — Bao la, hùng vĩ và dung nạp trăm sông." },
    ];

    const SOLAR_TERMS_24 = [
        { name: "Tiểu Hàn", m1: 1, d1: 5, m2: 1, d2: 19 },
        { name: "Đại Hàn", m1: 1, d1: 20, m2: 2, d2: 3 },
        { name: "Lập Xuân", m1: 2, d1: 4, m2: 2, d2: 18 },
        { name: "Vũ Thủy", m1: 2, d1: 19, m2: 3, d2: 4 },
        { name: "Kinh Trập", m1: 3, d1: 5, m2: 3, d2: 20 },
        { name: "Xuân Phân", m1: 3, d1: 21, m2: 4, d2: 4 },
        { name: "Thanh Minh", m1: 4, d1: 5, m2: 4, d2: 19 },
        { name: "Cốc Vũ", m1: 4, d1: 20, m2: 5, d2: 4 },
        { name: "Lập Hạ", m1: 5, d1: 5, m2: 5, d2: 20 },
        { name: "Tiểu Mãn", m1: 5, d1: 21, m2: 6, d2: 5 },
        { name: "Mang Chủng", m1: 6, d1: 6, m2: 6, d2: 20 },
        { name: "Hạ Chí", m1: 6, d1: 21, m2: 7, d2: 6 },
        { name: "Tiểu Thử", m1: 7, d1: 7, m2: 7, d2: 22 },
        { name: "Đại Thử", m1: 7, d1: 23, m2: 8, d2: 6 },
        { name: "Lập Thu", m1: 8, d1: 7, m2: 8, d2: 22 },
        { name: "Xử Thử", m1: 8, d1: 23, m2: 9, d2: 7 },
        { name: "Bạch Lộ", m1: 9, d1: 8, m2: 9, d2: 22 },
        { name: "Thu Phân", m1: 9, d1: 23, m2: 10, d2: 7 },
        { name: "Hàn Lộ", m1: 10, d1: 8, m2: 10, d2: 22 },
        { name: "Sương Giáng", m1: 10, d1: 23, m2: 11, d2: 6 },
        { name: "Lập Đông", m1: 11, d1: 7, m2: 11, d2: 21 },
        { name: "Tiểu Tuyết", m1: 11, d1: 22, m2: 12, d2: 6 },
        { name: "Đại Tuyết", m1: 12, d1: 7, m2: 12, d2: 21 },
        { name: "Đông Chí", m1: 12, d1: 22, m2: 1, d2: 4 },
    ];

    // Vẽ Component SVG Vòng Ngũ Hành Động Cỡ Lớn (9.2rem x 9.2rem)
    const buildWuXingSvgHtml = (activeElementsSet, hourElementKey) => {
        const cls = (elKey) => {
            const state = activeElementsSet.has(elKey) ? "is-active" : "is-dimmed";
            const hourCls = elKey === hourElementKey ? "is-hour-element" : "";
            return `${state} ${hourCls}`.trim();
        };

        return `
            <svg class="wuxing-mini" viewBox="0 0 120 120" role="img" aria-label="Biểu đồ Bát Tự Ngũ Hành">
                <!-- 1. Vòng tròn Tương Sinh xoay động -->
                <circle class="wuxing-mini__cycle" cx="60" cy="60" r="39" />
                <!-- 2. Ngôi sao Tương Khắc 5 đỉnh -->
                <polygon class="wuxing-mini__star" points="60,21 83,91 23,48 97,48 37,91" />

                <!-- 3. Năm nút Ngũ Hành cỡ lớn (r=15.5) -->
                <g class="wuxing-mini__node wuxing-mini__node--fire ${cls("fire")}">
                    <circle cx="60" cy="21" r="15.5" />
                    <text x="60" y="21">Hỏa</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--earth ${cls("earth")}">
                    <circle cx="97" cy="48" r="15.5" />
                    <text x="97" y="48">Thổ</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--metal ${cls("metal")}">
                    <circle cx="83" cy="91" r="15.5" />
                    <text x="83" y="91">Kim</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--water ${cls("water")}">
                    <circle cx="37" cy="91" r="15.5" />
                    <text x="37" y="91">Thủy</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--wood ${cls("wood")}">
                    <circle cx="23" cy="48" r="15.5" />
                    <text x="23" y="48">Mộc</text>
                </g>
            </svg>
        `;
    };

    const getSolarTermRangeInfo = (dd, mm, yy) => {
        const code = mm * 100 + dd;
        for (const t of SOLAR_TERMS_24) {
            const c1 = t.m1 * 100 + t.d1;
            const c2 = t.m2 * 100 + t.d2;
            if (c1 <= c2) {
                if (code >= c1 && code <= c2) {
                    return {
                        name: t.name,
                        start: `${pad(t.d1)}/${pad(t.m1)}/${yy}`,
                        end: `${pad(t.d2)}/${pad(t.m2)}/${yy}`,
                    };
                }
            } else if (code >= c1 || code <= c2) {
                const startYear = mm === 1 ? yy - 1 : yy;
                const endYear = mm === 12 ? yy + 1 : yy;
                return {
                    name: t.name,
                    start: `${pad(t.d1)}/${pad(t.m1)}/${startYear}`,
                    end: `${pad(t.d2)}/${pad(t.m2)}/${endYear}`,
                };
            }
        }
        return { name: "Lập Đông", start: `07/11/${yy}`, end: `21/11/${yy}` };
    };

    const computeSunTimes4Regions = (dd, mm, yy) => {
        const startOfYear = new Date(yy, 0, 0);
        const current = new Date(yy, mm - 1, dd);
        const dayOfYear = Math.floor((current - startOfYear) / 86400000);
        const seasonalWave = Math.sin(((dayOfYear - 80) / 365) * 2 * Math.PI);

        const regions = [
            {
                region: "Bắc",
                place: "Hà Nội - Hải Phòng (Duyên hải Bắc Bộ)",
                baseRiseMin: 350,
                baseSetMin: 1055,
                amp: 24,
            },
            {
                region: "Trung",
                place: "Đà Nẵng - Huế (Bắc & Nam Trung Bộ)",
                baseRiseMin: 344,
                baseSetMin: 1054,
                amp: 16,
            },
            { region: "Nam", place: "TP. Hồ Chí Minh (Đông Nam Bộ)", baseRiseMin: 345, baseSetMin: 1062, amp: 11 },
            { region: "ĐBSCL", place: "Cần Thơ - Cà Mau (Tây Nam Bộ)", baseRiseMin: 349, baseSetMin: 1067, amp: 10 },
        ];

        const formatMins = (totalMins) => {
            const h = Math.floor(totalMins / 60);
            const m = Math.round(totalMins % 60);
            return `${pad(h)}:${pad(m)}:20`;
        };

        const rows = regions.map((r) => {
            const rise = Math.round(r.baseRiseMin - seasonalWave * r.amp);
            const set = Math.round(r.baseSetMin + seasonalWave * r.amp);
            return {
                region: r.region,
                place: r.place,
                riseStr: formatMins(rise),
                setStr: formatMins(set),
                dayLengthMins: set - rise,
            };
        });

        const avgLen = Math.round(rows.reduce((acc, r) => acc + r.dayLengthMins, 0) / rows.length);
        return {
            dayLengthLabel: `${Math.floor(avgLen / 60)} giờ ${pad(avgLen % 60)} phút`,
            rows,
        };
    };

    const fetchMonthHistoryData = async (monthNum) => {
        const m = Number(monthNum) || 11;
        if (monthApiCache.has(m)) return monthApiCache.get(m);

        for (const path of [`./api/thang-${m}.json`, `./api/thang-${pad(m)}.json`]) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    const normalized = Array.isArray(data) ? data : data?.data || data?.events || [];
                    monthApiCache.set(m, normalized);
                    return normalized;
                }
            } catch (err) {
                // Thử đường dẫn tiếp theo
            }
        }
        monthApiCache.set(m, []);
        return [];
    };

    const buildDetailUrlFromItem = (item, monthNum) => {
        if (!item) return "./detail.html";
        const rawSlug = item.image_slug || item.slug || "";
        const cleanFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
        const typeFolder = String(item.category_id || item.loai || "")
            .toLowerCase()
            .includes("event")
            ? "events"
            : "figures";
        const params = new URLSearchParams({
            type: typeFolder,
            folder: cleanFolder,
            slug: rawSlug,
            month: String(monthNum),
        });
        return `./detail.html?${params.toString()}`;
    };

    const setCoverImageWithFallback = (imgEl, monthNum, imageSlug, altText) => {
        if (!imgEl) return;
        if (altText) imgEl.alt = altText;
        if (!imageSlug) {
            imgEl.onerror = null;
            imgEl.src = DEFAULT_COVER_IMG;
            return;
        }
        const cleanSlug = imageSlug
            .split("/")
            .pop()
            .trim()
            .replace(/\.(jpg|jpeg|png|webp)$/i, "");
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

    const renderHistoryItemToBloc = (item, monthNum, solarDay) => {
        const imgEl = document.getElementById("detail-history-img");
        const mediaLinkEl = document.getElementById("detail-history-link");
        const captionLinkEl = document.getElementById("detail-history-caption");
        const captionTextEl = document.getElementById("detail-history-caption-text");
        const quoteTextEl = document.getElementById("detail-quote-text");
        const quoteAuthorEl = document.getElementById("detail-quote-author");

        const paddedDay = pad(solarDay);
        const paddedMonth = pad(monthNum);

        if (!item) {
            if (imgEl) {
                imgEl.onerror = null;
                imgEl.src = DEFAULT_COVER_IMG;
            }
            if (captionTextEl) {
                captionTextEl.textContent = `Sự kiện & Nhân vật lịch sử ngày ${paddedDay}/${paddedMonth}`;
            }
            if (mediaLinkEl) mediaLinkEl.href = `./detail.html?day=${solarDay}&month=${monthNum}`;
            if (captionLinkEl) captionLinkEl.href = `./detail.html?day=${solarDay}&month=${monthNum}`;
            return;
        }

        const occasionText = item.hien_thi_nhan_dip || item.ten || `Sự kiện lịch sử ngày ${paddedDay}/${paddedMonth}`;
        const detailHref = buildDetailUrlFromItem(item, monthNum);
        setCoverImageWithFallback(imgEl, monthNum, item.image_slug || item.slug, occasionText);

        if (captionTextEl) captionTextEl.textContent = occasionText;
        if (mediaLinkEl) mediaLinkEl.href = detailHref;
        if (captionLinkEl) captionLinkEl.href = detailHref;
        if (quoteTextEl) {
            const raw = (item.quote || item.danh_ngon || "").trim();
            quoteTextEl.textContent = raw ? (raw.startsWith('"') ? raw : `"${raw}"`) : `"${occasionText}"`;
        }
        if (quoteAuthorEl) {
            quoteAuthorEl.textContent = `- ${item.ten || item.tac_gia || "Lịch sử Việt Nam"} -`;
        }
    };

    const updateHistoryForDay = async (solarDay, monthNum) => {
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const sameDayLabel = document.getElementById("label-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");
        const intlLabel = document.getElementById("label-intl-events");

        const paddedDay = pad(solarDay);
        const paddedMonth = pad(monthNum);
        const targetDatePadded = `${paddedDay}/${paddedMonth}`;
        const targetDateShort = `${Number(solarDay)}/${Number(monthNum)}`;
        const targetSlugDate = `-${paddedDay}-${paddedMonth}-`;

        const allMonthItems = await fetchMonthHistoryData(monthNum);

        const matchedItems = allMonthItems.filter((entry) => {
            const displayDate = String(entry.ngay_hien_thi || entry.ngay_duong || entry.date || "").trim();
            const occasionStr = String(entry.hien_thi_nhan_dip || "");
            const slugStr = String(entry.image_slug || "");

            return (
                displayDate.startsWith(targetDatePadded) ||
                displayDate.startsWith(targetDateShort) ||
                displayDate === String(solarDay) ||
                Number(entry.day) === Number(solarDay) ||
                occasionStr.includes(`(${targetDatePadded}`) ||
                slugStr.includes(targetSlugDate)
            );
        });

        activeDayIntlEvents = matchedItems.filter((entry) => {
            const scope = String(entry.pham_vi || entry.scope || entry.category_id || "").toLowerCase();
            return Boolean(entry.is_international) || scope.includes("quoc-te") || scope.includes("international");
        });
        activeDayVnEvents = matchedItems.filter((entry) => !activeDayIntlEvents.includes(entry));
        currentVnEventIndex = 0;
        currentIntlEventIndex = 0;

        if (sameDayBtn) {
            if (activeDayVnEvents.length > 1) {
                sameDayBtn.hidden = false;
                sameDayBtn.classList.add("is-active");
                if (sameDayLabel) sameDayLabel.textContent = `Sự kiện cùng ngày (${activeDayVnEvents.length})`;
            } else {
                sameDayBtn.hidden = true;
                sameDayBtn.classList.remove("is-active");
            }
        }

        if (intlBtn) {
            if (activeDayIntlEvents.length > 0) {
                intlBtn.hidden = false;
                intlBtn.classList.remove("is-active");
                if (intlLabel) intlLabel.textContent = `Sự kiện quốc tế (${activeDayIntlEvents.length})`;
            } else {
                intlBtn.hidden = true;
                intlBtn.classList.remove("is-active");
            }
        }

        renderHistoryItemToBloc(activeDayVnEvents[0] || activeDayIntlEvents[0] || null, monthNum, solarDay);
    };

    const applyHourRowsFilter = () => {
        document.querySelectorAll(".day-hour-row").forEach((row) => {
            const fortune = row.dataset.hourFortune || "normal";
            const isDimmed = activeHourFilter !== "all" && activeHourFilter !== fortune;
            row.classList.toggle("is-dimmed", isDimmed);
        });
    };

    const renderDayPage = (dateObj) => {
        if (!window.LunarEngine) return;

        viewingDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const sDay = viewingDate.getDate();
        const sMonth = viewingDate.getMonth() + 1;
        const sYear = viewingDate.getFullYear();
        const isoDateStr = `${sYear}-${pad(sMonth)}-${pad(sDay)}`;

        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);
        const yearStemIdx = (info.lunarYear + 6) % 10;
        const monthStemIdx = (yearStemIdx * 2 + info.lunarMonth + 1) % 10;
        const dayStemIdx = (info.jd + 9) % 10;
        const ratHourStemIdx = ((dayStemIdx % 5) * 2) % 10;

        const toolbarHeading = document.getElementById("day-toolbar-heading");
        if (toolbarHeading) toolbarHeading.textContent = fullViDateFormatter.format(viewingDate);

        // 1. CỘT TRÁI (Tờ Lịch Bloc & Phong Thủy)
        document.getElementById("detail-solar-year").textContent = String(sYear);
        document.getElementById("detail-solar-month-vn").textContent = info.solarMonthVnLabel;
        document.getElementById("detail-solar-month-en").textContent = info.solarMonthEnLabel;
        document.getElementById("detail-solar-day").textContent = String(sDay);
        document.getElementById("detail-lunar-year").textContent = `NĂM ${info.yearCanChi.toUpperCase()}`;
        document.getElementById("detail-weekday").textContent = info.bilingualWeekday;

        const statusEl = document.getElementById("detail-day-status");
        if (statusEl) {
            statusEl.textContent = info.badgeText
                ? `Ngày ${info.badgeText}`
                : info.fortuneStatus === "good"
                  ? "Ngày Hoàng Đạo"
                  : info.fortuneStatus === "bad"
                    ? "Ngày Hắc Đạo"
                    : "Ngày bình thường";
        }

        document.getElementById("detail-lunar-day").textContent = String(info.lunarDay);
        document.getElementById("detail-lunar-month").textContent = info.lunarMonthFullLabel;
        document.getElementById("detail-canchi-month").textContent = `Tháng ${info.monthCanChi}`;
        document.getElementById("detail-canchi-day").textContent = `Ngày ${info.dayCanChi}`;
        document.getElementById("detail-canchi-hour").textContent = `Giờ ${info.ratHourCanChi}`;
        document.getElementById("detail-element").textContent = info.dayNapAm;
        document.getElementById("detail-solar-term").textContent = info.solarTerm;
        document.getElementById("detail-truc-name").textContent = info.trucObj.name;

        document.getElementById("detail-good-hours").textContent = info.goodHoursStr;
        document.getElementById("detail-bad-hours").textContent = info.badHoursStr;
        document.getElementById("detail-truc-title").textContent = info.trucObj.name;
        document.getElementById("detail-truc-desc").textContent = info.trucObj.desc;
        document.getElementById("detail-age-good").textContent = info.ageHarmony.good;
        document.getElementById("detail-age-bad").textContent = info.ageHarmony.bad;

        updateHistoryForDay(sDay, sMonth);

        // 2. CỘT PHẢI (Hướng Xuất Hành, Tiết Khí, Khổng Minh Lục Diệu, Mặt Trời 4 Miền)
        const sexagenaryIdx = (((6 * dayStemIdx - 5 * info.dayChiIdx) % 60) + 60) % 60;
        document.getElementById("day-dir-hy").textContent = HY_THAN_BY_STEM[dayStemIdx] || "Tây Bắc";
        document.getElementById("day-dir-tai").textContent = TAI_THAN_BY_STEM[dayStemIdx] || "Đông Nam";
        document.getElementById("day-dir-hac").textContent =
            HAC_THAN_DIRECTIONS[Math.floor(sexagenaryIdx / 7) % 8] || "Chính Nam";

        const termRange = getSolarTermRangeInfo(sDay, sMonth, sYear);
        document.getElementById("day-term-current").textContent = termRange.name;
        document.getElementById("day-term-start").textContent = termRange.start;
        document.getElementById("day-term-end").textContent = termRange.end;

        const dayLucDieuIdx = (info.lunarMonth + info.lunarDay - 2) % 6;
        const dayLucDieuObj = LUC_DIEU_6[dayLucDieuIdx] || LUC_DIEU_6[0];
        document.getElementById("day-lucdieu-day-badge").textContent = dayLucDieuObj.name;
        document.getElementById("day-lucdieu-summary").textContent =
            `Ngày ${dayLucDieuObj.name} — ${dayLucDieuObj.desc}`;

        const lucDieuGridEl = document.getElementById("day-lucdieu-grid");
        if (lucDieuGridEl) {
            lucDieuGridEl.innerHTML = HOUR_LABELS_12.map((h, hIdx) => {
                const starObj = LUC_DIEU_6[(dayLucDieuIdx + hIdx) % 6];
                return `
                    <article class="day-lucdieu-cell ${starObj.isGood ? "day-lucdieu-cell--good" : "day-lucdieu-cell--bad"}">
                        <strong class="day-lucdieu-cell__name">${starObj.name}</strong>
                        <span class="day-lucdieu-cell__time">${h.chi} (${h.short})</span>
                    </article>
                `;
            }).join("");
        }

        const sunInfo = computeSunTimes4Regions(sDay, sMonth, sYear);
        document.getElementById("day-sun-date-label").textContent = `${pad(sDay)}/${pad(sMonth)}/${sYear}`;
        document.getElementById("day-sun-length-label").textContent = sunInfo.dayLengthLabel;

        const sunRowsEl = document.getElementById("day-sun-rows");
        if (sunRowsEl) {
            sunRowsEl.innerHTML = sunInfo.rows
                .map(
                    (r) => `
                        <div class="day-sun-table__row" role="row">
                            <span class="day-sun-table__region" role="cell">${r.region}</span>
                            <span class="day-sun-table__place" role="cell">${r.place}</span>
                            <span class="day-sun-table__time" role="cell">${r.riseStr}</span>
                            <span class="day-sun-table__time" role="cell">${r.setStr}</span>
                        </div>
                    `,
                )
                .join("");
        }

        // 3. TẦNG DƯỚI (1 CỘT LỚN 12 DÒNG): 5 TOOLTIPS GIẢI NGHĨA RIÊNG TỪNG CỘT + LINK ĐIỀU HƯỚNG / SEO
        const hourlyListEl = document.getElementById("day-hourly-list");
        if (hourlyListEl) {
            const goodHourSet = new Set(info.goodHoursStr.split(",").map((s) => s.trim().split(" ")[0]));
            const baseThreeElements = [
                STEM_TO_ELEMENT[yearStemIdx],
                STEM_TO_ELEMENT[monthStemIdx],
                STEM_TO_ELEMENT[dayStemIdx],
            ];
            const allFiveKeys = ["fire", "earth", "metal", "water", "wood"];

            hourlyListEl.innerHTML = HOUR_LABELS_12.map((h, hIdx) => {
                const hStemIdx = (ratHourStemIdx + hIdx) % 10;
                const hStemName = window.LunarEngine.THIEN_CAN[hStemIdx];
                const hCanChi = `${hStemName} ${h.chi}`;
                const hSexagenary = (((6 * hStemIdx - 5 * hIdx) % 60) + 60) % 60;
                const napAmObj = NAP_AM_30_INFO[Math.floor(hSexagenary / 2)] || NAP_AM_30_INFO[6];
                const hNapAm = napAmObj.name;

                let elemIcon = "earth.svg";
                let elemShort = "Hành Thổ";
                if (hNapAm.endsWith("Kim")) {
                    elemIcon = "metal.svg";
                    elemShort = "Hành Kim";
                } else if (hNapAm.endsWith("Mộc")) {
                    elemIcon = "wood.svg";
                    elemShort = "Hành Mộc";
                } else if (hNapAm.endsWith("Thủy")) {
                    elemIcon = "water.svg";
                    elemShort = "Hành Thủy";
                } else if (hNapAm.endsWith("Hỏa")) {
                    elemIcon = "fire.svg";
                    elemShort = "Hành Hỏa";
                }

                const starObj = LUC_DIEU_6[(dayLucDieuIdx + hIdx) % 6];
                const isHoangDao = goodHourSet.has(h.chi);
                const fortuneKey = isHoangDao ? "good" : "bad";

                const hourElementKey = STEM_TO_ELEMENT[hStemIdx];
                const activeElementsForHour = new Set([...baseThreeElements, hourElementKey]);
                const wuxingSvg = buildWuXingSvgHtml(activeElementsForHour, hourElementKey);

                const activeNames = allFiveKeys
                    .filter((k) => activeElementsForHour.has(k))
                    .map((k) => ELEMENT_VN_NAME[k])
                    .join(", ");
                const missingNames =
                    allFiveKeys
                        .filter((k) => !activeElementsForHour.has(k))
                        .map((k) => ELEMENT_VN_NAME[k])
                        .join(", ") || "Không khuyết";

                // 5 Nội dung Bento Tooltip độc lập cho 5 cột
                const tipTime = `Khung giờ ${h.range} (${isHoangDao ? "Giờ Hoàng Đạo - Tốt" : "Giờ Hắc Đạo - Xấu"}). Bấm để mở trên Đồng hồ 12 canh giờ.`;
                const tipNapAm = `${napAmObj.meaning} Bấm để xem chi tiết Nạp Âm.`;
                const tipLucDieu = `${starObj.desc} (${isHoangDao ? "Giờ Hoàng Đạo" : "Giờ Hắc Đạo"}).`;
                const tipWuXing = `Tứ Trụ giờ ${hCanChi} hội tụ: ${activeNames} (Sáng) • Đang khuyết: ${missingNames} (Chìm). Bấm để xem Bát Tự.`;
                const tipBagua = `${h.baguaDesc} (${h.animalName}).`;

                const baguaParts = h.bagua.split("•");

                return `
                    <article class="day-hour-row" data-hour-fortune="${fortuneKey}">
                        <!-- CỘT 1: CANH GIỜ (Link sang clock.html) -->
                        <a
                            href="./clock.html?branch=${h.key}"
                            class="day-hour-row__col-link day-hour-row__col-time"
                            data-tooltip-title="Giờ ${hCanChi}"
                            data-tooltip="${tipTime}"
                        >
                            <strong>${hCanChi}</strong>
                            <span>${h.range}</span>
                        </a>

                        <!-- CỘT 2: NẠP ÂM NGŨ HÀNH (Link chờ SEO sang utilities.html) -->
                        <a
                            href="./utilities.html?napam=${toSlug(hNapAm)}"
                            class="day-hour-row__col-link day-hour-row__col-napam"
                            data-tooltip-title="${hNapAm}"
                            data-tooltip="${tipNapAm}"
                        >
                            <span class="day-hour-row__napam-icon-box">
                                <img src="./assets/icons/${elemIcon}" alt="" aria-hidden="true" />
                            </span>
                            <span class="day-hour-row__napam-info">
                                <strong>${hNapAm}</strong>
                                <small>${elemShort}</small>
                            </span>
                        </a>

                        <!-- CỘT 3: KHỔNG MINH LỤC DIỆU (Link chờ SEO sang utilities.html) -->
                        <a
                            href="./utilities.html?lucdieu=${toSlug(starObj.name)}"
                            class="day-hour-row__col-link day-hour-row__col-lucdieu"
                            data-tooltip-title="Sao ${starObj.name}"
                            data-tooltip="${tipLucDieu}"
                        >
                            <span class="day-hour-row__badge ${starObj.isGood ? "day-hour-row__badge--good" : "day-hour-row__badge--bad"}">
                                ${starObj.name}
                            </span>
                            <span class="day-hour-row__dao-sub">
                                ${isHoangDao ? "☀️ Giờ Hoàng Đạo" : "🌙 Giờ Hắc Đạo"}
                            </span>
                        </a>

                        <!-- CỘT 4: VÒNG SVG NGŨ HÀNH ĐỘNG (Link sang bazi.html) -->
                        <a
                            href="./bazi.html?date=${isoDateStr}&hour=${h.key}"
                            class="day-hour-row__col-link day-hour-row__col-wuxing"
                            data-tooltip-title="Ngũ Hành Tứ Trụ"
                            data-tooltip="${tipWuXing}"
                        >
                            ${wuxingSvg}
                        </a>

                        <!-- CỘT 5: LINH VẬT & QUẺ BÁT QUÁI (Link chờ SEO sang utilities.html) -->
                        <a
                            href="./utilities.html?bagua=${toSlug(baguaParts[0])}"
                            class="day-hour-row__col-link day-hour-row__col-bagua"
                            data-tooltip-title="Quẻ ${baguaParts[0].trim()}"
                            data-tooltip="${tipBagua}"
                        >
                            <span class="day-hour-row__bagua-ring">
                                <img src="./assets/icons/zodiac/${h.icon}" alt="" aria-hidden="true" />
                            </span>
                            <span class="day-hour-row__bagua-text">
                                <strong>Quẻ ${baguaParts[0].trim()}</strong>
                                <small>Hướng ${baguaParts[1].trim()}</small>
                            </span>
                        </a>
                    </article>
                `;
            }).join("");

            applyHourRowsFilter();
        }
    };

    const initDayCalendarPage = () => {
        const prevBtn = document.getElementById("day-prev-btn");
        const nextBtn = document.getElementById("day-next-btn");
        const todayBtn = document.getElementById("day-today-btn");
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");
        const shareBtn = document.getElementById("day-share-btn");

        if (prevBtn) {
            prevBtn.onclick = () => {
                const prev = new Date(viewingDate);
                prev.setDate(prev.getDate() - 1);
                renderDayPage(prev);
            };
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                const next = new Date(viewingDate);
                next.setDate(next.getDate() + 1);
                renderDayPage(next);
            };
        }

        if (todayBtn) {
            todayBtn.onclick = () => renderDayPage(new Date());
        }

        if (sameDayBtn) {
            sameDayBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayVnEvents.length) return;
                currentVnEventIndex = (currentVnEventIndex + 1) % activeDayVnEvents.length;
                sameDayBtn.classList.add("is-active");
                intlBtn?.classList.remove("is-active");
                renderHistoryItemToBloc(
                    activeDayVnEvents[currentVnEventIndex],
                    viewingDate.getMonth() + 1,
                    viewingDate.getDate(),
                );
            };
        }

        if (intlBtn) {
            intlBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayIntlEvents.length) return;
                const nextItem = activeDayIntlEvents[currentIntlEventIndex];
                currentIntlEventIndex = (currentIntlEventIndex + 1) % activeDayIntlEvents.length;
                intlBtn.classList.add("is-active");
                sameDayBtn?.classList.remove("is-active");
                renderHistoryItemToBloc(nextItem, viewingDate.getMonth() + 1, viewingDate.getDate());
            };
        }

        if (shareBtn) {
            shareBtn.onclick = async () => {
                const y = viewingDate.getFullYear();
                const m = pad(viewingDate.getMonth() + 1);
                const d = pad(viewingDate.getDate());
                const shareUrl = `${window.location.origin}${window.location.pathname}?date=${y}-${m}-${d}`;
                try {
                    await navigator.clipboard.writeText(shareUrl);
                } catch (e) {
                    // Fallback
                }
            };
        }

        document.querySelectorAll(".day-hourly-section__filter-btn").forEach((btn) => {
            btn.onclick = () => {
                activeHourFilter = btn.dataset.dayHourFilter || "all";
                document.querySelectorAll(".day-hourly-section__filter-btn").forEach((b) => {
                    b.classList.toggle("is-active", b === btn);
                });
                applyHourRowsFilter();
            };
        });

        window.addEventListener("converter-jump-to-date", (e) => {
            if (e.detail) {
                renderDayPage(new Date(e.detail.year, e.detail.month - 1, e.detail.day));
            }
        });

        const urlDateParam = new URLSearchParams(window.location.search).get("date");
        if (urlDateParam && /^\d{4}-\d{2}-\d{2}$/.test(urlDateParam)) {
            const [y, m, d] = urlDateParam.split("-").map(Number);
            renderDayPage(new Date(y, m - 1, d));
        } else {
            renderDayPage(new Date());
        }
    };

    document.addEventListener("DOMContentLoaded", initDayCalendarPage);
})();
