// assets/js/bazi.js
// Chuyên trách Trang Bát Tự (bazi.html): Lập lá số Tứ Trụ Tử Bình, Tàng Can, Thập Thần,
// Vòng Trường Sinh, Định lượng Ngũ Hành, Dụng Thần/Hỷ Thần & 8 Đại Vận 10 Năm
(() => {
    let selectedDay = 13;
    let selectedMonth = 11;
    let selectedYear = 2026;
    let selectedHourKey = "thin";
    let selectedGender = "male"; // "male" | "female"
    let selectedLongitude = 106.6;
    let currentBaziChart = null;

    const pad = (n) => String(n).padStart(2, "0");

    // 1. Bảng quy chiếu Ngũ Hành của 10 Thiên Can & 12 Địa Chi
    const STEM_META = [
        { name: "Giáp", element: "wood", polarity: 1, vnElem: "Dương Mộc", icon: "wood.svg" },
        { name: "Ất", element: "wood", polarity: 0, vnElem: "Âm Mộc", icon: "wood.svg" },
        { name: "Bính", element: "fire", polarity: 1, vnElem: "Dương Hỏa", icon: "fire.svg" },
        { name: "Đinh", element: "fire", polarity: 0, vnElem: "Âm Hỏa", icon: "fire.svg" },
        { name: "Mậu", element: "earth", polarity: 1, vnElem: "Dương Thổ", icon: "earth.svg" },
        { name: "Kỷ", element: "earth", polarity: 0, vnElem: "Âm Thổ", icon: "earth.svg" },
        { name: "Canh", element: "metal", polarity: 1, vnElem: "Dương Kim", icon: "metal.svg" },
        { name: "Tân", element: "metal", polarity: 0, vnElem: "Âm Kim", icon: "metal.svg" },
        { name: "Nhâm", element: "water", polarity: 1, vnElem: "Dương Thủy", icon: "water.svg" },
        { name: "Quý", element: "water", polarity: 0, vnElem: "Âm Thủy", icon: "water.svg" },
    ];

    const BRANCH_META = [
        {
            name: "Tý",
            key: "ty",
            element: "water",
            vnElem: "Thủy",
            zodiac: "mouse.svg",
            animal: "Chuột",
            hiddenStems: [9], // Quý
        },
        {
            name: "Sửu",
            key: "suu",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "buffalo.svg",
            animal: "Trâu",
            hiddenStems: [5, 9, 7], // Kỷ, Quý, Tân
        },
        {
            name: "Dần",
            key: "dan",
            element: "wood",
            vnElem: "Mộc",
            zodiac: "tiger.svg",
            animal: "Hổ",
            hiddenStems: [0, 2, 4], // Giáp, Bính, Mậu
        },
        {
            name: "Mão",
            key: "mao",
            element: "wood",
            vnElem: "Mộc",
            zodiac: "cat.svg",
            animal: "Mèo",
            hiddenStems: [1], // Ất
        },
        {
            name: "Thìn",
            key: "thin",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "dragon.svg",
            animal: "Rồng",
            hiddenStems: [4, 1, 9], // Mậu, Ất, Quý
        },
        {
            name: "Tỵ",
            key: "ty_snake",
            element: "fire",
            vnElem: "Hỏa",
            zodiac: "snake.svg",
            animal: "Rắn",
            hiddenStems: [2, 4, 6], // Bính, Mậu, Canh
        },
        {
            name: "Ngọ",
            key: "ngo",
            element: "fire",
            vnElem: "Hỏa",
            zodiac: "horse.svg",
            animal: "Ngựa",
            hiddenStems: [3, 5], // Đinh, Kỷ
        },
        {
            name: "Mùi",
            key: "mui",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "goat.svg",
            animal: "Dê",
            hiddenStems: [5, 3, 1], // Kỷ, Đinh, Ất
        },
        {
            name: "Thân",
            key: "than",
            element: "metal",
            vnElem: "Kim",
            zodiac: "monkey.svg",
            animal: "Khỉ",
            hiddenStems: [6, 8, 4], // Canh, Nhâm, Mậu
        },
        {
            name: "Dậu",
            key: "dau",
            element: "metal",
            vnElem: "Kim",
            zodiac: "rooster.svg",
            animal: "Gà",
            hiddenStems: [7], // Tân
        },
        {
            name: "Tuất",
            key: "tuat",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "dog.svg",
            animal: "Chó",
            hiddenStems: [4, 7, 3], // Mậu, Tân, Đinh
        },
        {
            name: "Hợi",
            key: "hoi",
            element: "water",
            vnElem: "Thủy",
            zodiac: "pig.svg",
            animal: "Hợi",
            hiddenStems: [8, 0], // Nhâm, Giáp
        },
    ];

    // Hình tượng & Tính cách 10 Nhật Chủ (Day Master Archetypes)
    const DAY_MASTER_PROFILES = [
        {
            title: "Giáp Mộc (Dương Mộc)",
            archetype: "Hình tượng: Cây đại thụ vươn thẳng giữa rừng",
            desc: "Người Nhật Chủ Giáp Mộc có tố chất lãnh đạo bẩm sinh, chính trực, nhân hậu và giàu ý chí vươn lên. Hợp đảm nhận vai trò tiên phong và xây dựng nền tảng.",
        },
        {
            title: "Ất Mộc (Âm Mộc)",
            archetype: "Hình tượng: Cỏ hoa, dây leo mềm mại mà dẻo dai",
            desc: "Người Nhật Chủ Ất Mộc khéo léo, linh hoạt, giàu lòng trắc ẩn và có khả năng thích nghi tuyệt vời trước mọi biến động của hoàn cảnh.",
        },
        {
            title: "Bính Hỏa (Dương Hỏa)",
            archetype: "Hình tượng: Ánh mặt trời rực rỡ quang minh",
            desc: "Người Nhật Chủ Bính Hỏa nhiệt huyết, hào sảng, truyền cảm hứng mạnh mẽ và luôn tỏa năng lượng tích cực đến tập thể xung quanh.",
        },
        {
            title: "Đinh Hỏa (Âm Hỏa)",
            archetype: "Hình tượng: Ngọn đèn ấm áp, ánh sao đêm tinh anh",
            desc: "Người Nhật Chủ Đinh Hỏa sâu sắc, tinh tế, trực giác nhạy bén và luôn giữ được ngọn lửa đam mê bền bỉ trong nghiên cứu, sáng tạo.",
        },
        {
            title: "Mậu Thổ (Dương Thổ)",
            archetype: "Hình tượng: Núi lớn, tường thành vững chãi",
            desc: "Người Nhật Chủ Mậu Thổ điềm đạm, trọng chữ tín, bao dung và là điểm tựa vững chắc đáng tin cậy trong công việc lẫn gia đình.",
        },
        {
            title: "Kỷ Thổ (Âm Thổ)",
            archetype: "Hình tượng: Đất phù sa màu mỡ nuôi dưỡng vạn vật",
            desc: "Người Nhật Chủ Kỷ Thổ chu đáo, tỉ mỉ, giàu nội lực và có biệt tài tổ chức, điều phối nguồn lực êm thấm, hiệu quả.",
        },
        {
            title: "Canh Kim (Dương Kim)",
            archetype: "Hình tượng: Thanh kiếm báu, kim loại nguyên khối",
            desc: "Người Nhật Chủ Canh Kim quyết đoán, nghĩa khí, thẳng thắn và có năng lực giải quyết dứt điểm những thử thách gai góc nhất.",
        },
        {
            title: "Tân Kim (Âm Kim)",
            archetype: "Hình tượng: Châu ngọc, vàng trang sức tinh xảo",
            desc: "Người Nhật Chủ Tân Kim tinh tế, trọng danh dự, sắc sảo và có gu thẩm mỹ cao. Bề ngoài ôn nhu nhưng nội tâm cực kỳ kiên định.",
        },
        {
            title: "Nhâm Thủy (Dương Thủy)",
            archetype: "Hình tượng: Đại dương bao la, dòng sông lớn",
            desc: "Người Nhật Chủ Nhâm Thủy thông tuệ, tầm nhìn phóng khoáng, tư duy chiến lược sắc bén và không ngừng vươn ra biển lớn.",
        },
        {
            title: "Quý Thủy (Âm Thủy)",
            archetype: "Hình tượng: Mưa xuân, sương sớm thuần khiết",
            desc: "Người Nhật Chủ Quý Thủy mưu lược, nhẹ nhàng, giàu trí tưởng tượng và thấu hiểu tâm lý người khác một cách tự nhiên.",
        },
    ];

    const ELEMENT_INFO_MAP = {
        metal: {
            name: "Hành Kim",
            short: "Kim",
            icon: "metal.svg",
            genBy: "earth",
            generates: "water",
            ctrlBy: "fire",
            controls: "wood",
            directions: "Chính Tây, Tây Bắc",
            colors: "Trắng, Bạc, Vàng kim, Xám ánh kim",
            numbers: "Số 4, Số 9 (Hệ Kim)",
            career: "Tài chính, Công nghệ, Kỹ thuật, Cơ khí, Quản trị hệ thống",
        },
        wood: {
            name: "Hành Mộc",
            short: "Mộc",
            icon: "wood.svg",
            genBy: "water",
            generates: "fire",
            ctrlBy: "metal",
            controls: "earth",
            directions: "Chính Đông, Đông Nam",
            colors: "Xanh lục bảo, Xanh lá cây, Xanh ngọc",
            numbers: "Số 3, Số 8 (Hệ Mộc)",
            career: "Giáo dục, Kiến trúc, Nội thất, Y dược, Sáng tạo nội dung",
        },
        water: {
            name: "Hành Thủy",
            short: "Thủy",
            icon: "water.svg",
            genBy: "metal",
            generates: "wood",
            ctrlBy: "earth",
            controls: "fire",
            directions: "Chính Bắc",
            colors: "Xanh đại dương, Đen, Xanh lam đậm",
            numbers: "Số 1, Số 6 (Hệ Thủy)",
            career: "Thương mại, Logistics, Truyền thông, Phần mềm, Ngoại giao",
        },
        fire: {
            name: "Hành Hỏa",
            short: "Hỏa",
            icon: "fire.svg",
            genBy: "wood",
            generates: "earth",
            ctrlBy: "water",
            controls: "metal",
            directions: "Chính Nam",
            colors: "Đỏ chu sa, Cam ấm, Hồng, Tím",
            numbers: "Số 2, Số 7 (Hệ Hỏa)",
            career: "Marketing, Năng lượng, Nghệ thuật, Ẩm thực, Lãnh đạo",
        },
        earth: {
            name: "Hành Thổ",
            short: "Thổ",
            icon: "earth.svg",
            genBy: "fire",
            generates: "metal",
            ctrlBy: "wood",
            controls: "water",
            directions: "Trung Cung, Đông Bắc, Tây Nam",
            colors: "Vàng đất, Nâu trầm, Cam đất, Be",
            numbers: "Số 5, Số 0 (Hệ Thổ)",
            career: "Bất động sản, Xây dựng, Quản lý dự án, Nông nghiệp, Tư vấn",
        },
    };

    const LIFE_STAGES_12 = [
        "Trường Sinh",
        "Mộc Dục",
        "Quan Đới",
        "Lâm Quan",
        "Đế Vượng",
        "Suy",
        "Bệnh",
        "Tử",
        "Mộ",
        "Tuyệt",
        "Thai",
        "Dưỡng",
    ];

    // Vị trí khởi Trường Sinh của 10 Thiên Can trên 12 Địa Chi
    const CHANGSHENG_START_BRANCH = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];

    const TEN_GODS_DESC = {
        "Nhật Chủ": "Ngôi vị trung tâm đại diện cho chính bản thân người xem (Nhật Nguyên) trong lá số Bát Tự Tử Bình.",
        "Tỷ Kiên":
            "Đại diện cho bạn bè đồng trang lứa, ý chí tự lập, lòng tự trọng và sự kiên định giữ vững lập trường.",
        "Kiếp Tài":
            "Đại diện cho sự quyết liệt, nhạy bén nắm bắt cơ hội, tinh thần cạnh tranh nhưng cần quản lý tài chính chặt chẽ.",
        "Thực Thần":
            "Cát tinh của phúc lộc, tài năng nghệ thuật, tư duy thông tuệ, sống lạc quan và tạo ra giá trị bền vững.",
        "Thương Quan":
            "Đại diện cho sự sáng tạo đột phá, tài hùng biện sắc sảo, dám nghĩ dám làm và phá vỡ lối mòn cũ.",
        "Thiên Tài":
            "Đại diện cho tài lộc mở rộng, nhạy bén đầu tư, kinh doanh thương mại, giao tế rộng rãi và hào phóng.",
        "Chính Tài":
            "Đại diện cho nguồn tài chính vững chắc, sự cần mẫn, thực tế, trọng chữ tín và quản lý tài sản an toàn.",
        "Thất Sát":
            "Đại diện cho quyền uy, bản lĩnh vượt khó, tinh thần kỷ luật thép và khả năng xoay chuyển cục diện lớn.",
        "Chính Quan":
            "Cát tinh của danh tiếng, chức vị, sự chuẩn mực, thượng tôn pháp luật và tinh thần trách nhiệm cao.",
        "Thiên Ấn":
            "Đại diện cho trực giác nhạy bén, tư duy độc lập, chiều sâu tâm linh và năng lực nghiên cứu chuyên biệt.",
        "Chính Ấn": "Cát tinh của học vấn, quý nhân phù trợ, lòng nhân từ, sự che chở và uy tín học thuật.",
    };

    // Tính Thập Thần giữa Thiên Can mục tiêu và Nhật Chủ
    const resolveTenGod = (dayStemIdx, targetStemIdx) => {
        const dm = STEM_META[dayStemIdx];
        const tg = STEM_META[targetStemIdx];
        const samePol = dm.polarity === tg.polarity;
        const elemInfo = ELEMENT_INFO_MAP[dm.element];

        if (tg.element === dm.element) return samePol ? "Tỷ Kiên" : "Kiếp Tài";
        if (tg.element === elemInfo.generates) return samePol ? "Thực Thần" : "Thương Quan";
        if (tg.element === elemInfo.controls) return samePol ? "Thiên Tài" : "Chính Tài";
        if (tg.element === elemInfo.ctrlBy) return samePol ? "Thất Sát" : "Chính Quan";
        return samePol ? "Thiên Ấn" : "Chính Ấn";
    };

    // Tính vị trí Vòng Trường Sinh của Nhật Chủ trên từng Địa Chi
    const resolveLifeStage = (dayStemIdx, branchIdx) => {
        const startBranch = CHANGSHENG_START_BRANCH[dayStemIdx];
        const isYang = STEM_META[dayStemIdx].polarity === 1;
        const offset = isYang ? (branchIdx - startBranch + 12) % 12 : (startBranch - branchIdx + 12) % 12;
        return LIFE_STAGES_12[offset] || "Dưỡng";
    };

    const getNapAmByStemBranch = (stemIdx, branchIdx) => {
        const NAP_AM_30 = [
            "Hải Trung Kim",
            "Lư Trung Hỏa",
            "Đại Lâm Mộc",
            "Lộ Bàng Thổ",
            "Kiếm Phong Kim",
            "Sơn Đầu Hỏa",
            "Giản Hạ Thủy",
            "Thành Đầu Thổ",
            "Bạch Lạp Kim",
            "Dương Liễu Mộc",
            "Tuyền Trung Thủy",
            "Ốc Thượng Thổ",
            "Tích Lịch Hỏa",
            "Tùng Bách Mộc",
            "Trường Lưu Thủy",
            "Sa Trung Kim",
            "Sơn Hạ Hỏa",
            "Bình Địa Mộc",
            "Bích Thượng Thổ",
            "Kim Bạch Kim",
            "Phú Đăng Hỏa",
            "Thiên Hà Thủy",
            "Đại Trạch Thổ",
            "Thoa Xuyến Kim",
            "Tang Đố Mộc",
            "Đại Khê Thủy",
            "Sa Trung Thổ",
            "Thiên Thượng Hỏa",
            "Thạch Lựu Mộc",
            "Đại Hải Thủy",
        ];
        const sexagenaryIdx = (((6 * stemIdx - 5 * branchIdx) % 60) + 60) % 60;
        return NAP_AM_30[Math.floor(sexagenaryIdx / 2)] || "Thiên Hà Thủy";
    };

    const buildBentoTooltipHtml = (title, desc, tagLabel) => `
        <span class="bento-tooltip" role="tooltip">
            <strong class="bento-tooltip__title">✦ ${title}</strong>
            <span class="bento-tooltip__desc">${desc}</span>
            <span class="bento-tooltip__tag">${tagLabel} &#8594;</span>
        </span>
    `;

    const buildWuXingSvgHtml = (activeElementsSet, dayMasterKey, isLarge = false) => {
        const cls = (elKey) => {
            const state = activeElementsSet.has(elKey) ? "is-active" : "is-dimmed";
            const masterCls = elKey === dayMasterKey ? "is-hour-element" : "";
            return `${state} ${masterCls}`.trim();
        };

        return `
            <svg class="wuxing-mini ${isLarge ? "wuxing-mini--lg" : ""}" viewBox="0 0 120 120" role="img" aria-label="Biểu đồ Bát Tự Ngũ Hành">
                <circle class="wuxing-mini__cycle" cx="60" cy="60" r="39" />
                <polygon class="wuxing-mini__star" points="60,21 83,91 23,48 97,48 37,91" />
                <g class="wuxing-mini__node wuxing-mini__node--fire ${cls("fire")}">
                    <circle cx="60" cy="21" r="15.5" /><text x="60" y="21">Hỏa</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--earth ${cls("earth")}">
                    <circle cx="97" cy="48" r="15.5" /><text x="97" y="48">Thổ</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--metal ${cls("metal")}">
                    <circle cx="83" cy="91" r="15.5" /><text x="83" y="91">Kim</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--water ${cls("water")}">
                    <circle cx="37" cy="91" r="15.5" /><text x="37" y="91">Thủy</text>
                </g>
                <g class="wuxing-mini__node wuxing-mini__node--wood ${cls("wood")}">
                    <circle cx="23" cy="48" r="15.5" /><text x="23" y="48">Mộc</text>
                </g>
            </svg>
        `;
    };

    // Tính toán toàn bộ Lá Số Bát Tự Tứ Trụ
    const calculateBaziChart = () => {
        if (!window.LunarEngine) return null;

        const hourIdx = Math.max(
            0,
            BRANCH_META.findIndex((b) => b.key === selectedHourKey),
        );
        const representativeHour24 = hourIdx === 0 ? 0 : hourIdx * 2 - 1;
        const dayInfo = window.LunarEngine.getFullDayInfo(
            selectedDay,
            selectedMonth,
            selectedYear,
            representativeHour24,
        );

        const yearStemIdx = (dayInfo.lunarYear + 6) % 10;
        const yearBranchIdx = dayInfo.yearChiIdx;
        const monthStemIdx = ((yearStemIdx % 5) * 2 + dayInfo.lunarMonth + 1) % 10;
        const monthBranchIdx = dayInfo.monthChiIdx;
        const dayStemIdx = (dayInfo.jd + 9) % 10;
        const dayBranchIdx = dayInfo.dayChiIdx;
        const ratHourStemIdx = ((dayStemIdx % 5) * 2) % 10;
        const hourStemIdx = (ratHourStemIdx + hourIdx) % 10;
        const hourBranchIdx = hourIdx;

        // Thai Nguyên (Can tháng tiến 1, Chi tháng tiến 3)
        const thaiStemIdx = (monthStemIdx + 1) % 10;
        const thaiBranchIdx = (monthBranchIdx + 3) % 12;
        const thaiNguyenCanChi = `${STEM_META[thaiStemIdx].name} ${BRANCH_META[thaiBranchIdx].name}`;

        // Độ lệch Chân Thái Dương Thời so với kinh tuyến chuẩn múi giờ UTC+7 (105.0°Đ)
        const diffMinutesFloat = (selectedLongitude - 105.0) * 4;
        const sign = diffMinutesFloat >= 0 ? "+" : "-";
        const absMins = Math.floor(Math.abs(diffMinutesFloat));
        const absSecs = Math.round((Math.abs(diffMinutesFloat) - absMins) * 60);
        const trueSolarLabel = `${sign}${pad(absMins)} phút ${pad(absSecs)} giây (Kinh độ ${selectedLongitude}°Đ)`;

        // Xây dựng 4 Trụ: Năm - Tháng - Ngày - Giờ
        const rawPillars = [
            {
                id: "year",
                title: "Trụ Năm (Niên Trụ)",
                subRole: "Gốc rễ Tổ tiên & Thời niên thiếu",
                stemIdx: yearStemIdx,
                branchIdx: yearBranchIdx,
                isDayMaster: false,
            },
            {
                id: "month",
                title: "Trụ Tháng (Nguyệt Trụ)",
                subRole: "Môi trường, Sự nghiệp & Cha mẹ",
                stemIdx: monthStemIdx,
                branchIdx: monthBranchIdx,
                isDayMaster: false,
            },
            {
                id: "day",
                title: "Trụ Ngày (Nhật Chủ)",
                subRole: "Bản thân (Nhật Nguyên) & Phối ngẫu",
                stemIdx: dayStemIdx,
                branchIdx: dayBranchIdx,
                isDayMaster: true,
            },
            {
                id: "hour",
                title: "Trụ Giờ (Thời Trụ)",
                subRole: "Hậu vận, Con cái & Thành tựu",
                stemIdx: hourStemIdx,
                branchIdx: hourBranchIdx,
                isDayMaster: false,
            },
        ];

        // Đếm điểm lực lượng 5 Hành (Thiên Can + Địa Chi + Tàng Can)
        const elementScores = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

        const pillars = rawPillars.map((p) => {
            const stemObj = STEM_META[p.stemIdx];
            const branchObj = BRANCH_META[p.branchIdx];
            const tenGod = p.isDayMaster ? "Nhật Chủ" : resolveTenGod(dayStemIdx, p.stemIdx);
            const napAm = getNapAmByStemBranch(p.stemIdx, p.branchIdx);
            const lifeStage = resolveLifeStage(dayStemIdx, p.branchIdx);

            // Cộng trọng số Ngũ Hành (Trụ Tháng nắm Nguyệt Lệnh nên có trọng số cao hơn)
            const weightMultiplier = p.id === "month" ? 1.5 : 1;
            elementScores[stemObj.element] += 12 * weightMultiplier;
            elementScores[branchObj.element] += 14 * weightMultiplier;

            const hiddenDetails = branchObj.hiddenStems.map((hStemIdx, idx) => {
                const hStem = STEM_META[hStemIdx];
                const hGod = resolveTenGod(dayStemIdx, hStemIdx);
                const hiddenWeight = idx === 0 ? 7 : idx === 1 ? 4 : 2;
                elementScores[hStem.element] += hiddenWeight;
                return {
                    stemName: hStem.name,
                    vnElem: hStem.vnElem,
                    element: hStem.element,
                    tenGod: hGod,
                };
            });

            return {
                ...p,
                stemObj,
                branchObj,
                canchi: `${stemObj.name} ${branchObj.name}`,
                tenGod,
                napAm,
                lifeStage,
                hiddenDetails,
            };
        });

        // Tính phần trăm 5 Hành & phân tích Cường Nhược của Nhật Chủ
        const totalScore = Object.values(elementScores).reduce((a, b) => a + b, 0) || 100;
        const elementPercentages = {};
        const activeElementsSet = new Set();
        const missingElements = [];

        ["metal", "wood", "water", "fire", "earth"].forEach((key) => {
            const pct = Math.round((elementScores[key] / totalScore) * 100);
            elementPercentages[key] = pct;
            if (pct > 0) activeElementsSet.add(key);
            else missingElements.push(ELEMENT_INFO_MAP[key].short);
        });

        const dmElemKey = STEM_META[dayStemIdx].element;
        const dmElemInfo = ELEMENT_INFO_MAP[dmElemKey];
        const supportPct = (elementPercentages[dmElemKey] || 0) + (elementPercentages[dmElemInfo.genBy] || 0);

        let strengthState = "Thân Cân Bằng";
        let yongShinKey = dmElemInfo.generates;
        let xiShinKey = dmElemInfo.controls;
        let jiShinKey = dmElemInfo.ctrlBy;
        let strengthAdvice = "";

        if (supportPct < 45) {
            strengthState = "Thân Nhược (Cần Sinh Trợ)";
            yongShinKey = dmElemInfo.genBy; // Ấn Tinh sinh thân
            xiShinKey = dmElemKey; // Tỷ Kiếp trợ thân
            jiShinKey = dmElemInfo.controls; // Tài Tinh hao thân
            strengthAdvice = `Nhật Chủ ${STEM_META[dayStemIdx].name} (${dmElemInfo.short}) có lực lượng Tỷ/Ấn đạt ${supportPct}% (Thân Nhược). Dụng Thần ưu tiên số 1 là ${ELEMENT_INFO_MAP[yongShinKey].name} (Ấn Tinh sinh trợ) và Hỷ Thần là ${ELEMENT_INFO_MAP[xiShinKey].name} (Tỷ Kiếp tương trợ).`;
        } else if (supportPct > 56) {
            strengthState = "Thân Vượng (Cần Tiết Tú)";
            yongShinKey = dmElemInfo.generates; // Thực Thương tiết tú
            xiShinKey = dmElemInfo.controls; // Tài Tinh
            jiShinKey = dmElemInfo.genBy; // Ấn Tinh làm quá vượng
            strengthAdvice = `Nhật Chủ ${STEM_META[dayStemIdx].name} (${dmElemInfo.short}) có lực lượng Tỷ/Ấn đạt ${supportPct}% (Thân Vượng). Dụng Thần ưu tiên số 1 là ${ELEMENT_INFO_MAP[yongShinKey].name} (Thực Thương khơi thông năng lượng) và Hỷ Thần là ${ELEMENT_INFO_MAP[xiShinKey].name} (Tài Tinh).`;
        } else {
            strengthState = "Trung Hòa (Mệnh Cục Cân Bằng)";
            yongShinKey = dmElemInfo.generates;
            xiShinKey = dmElemInfo.genBy;
            jiShinKey = dmElemInfo.ctrlBy;
            strengthAdvice = `Nhật Chủ ${STEM_META[dayStemIdx].name} (${dmElemInfo.short}) đạt ngưỡng Trung Hòa lý tưởng (${supportPct}%). Nên duy trì sự lưu thông qua ${ELEMENT_INFO_MAP[yongShinKey].name} và ${ELEMENT_INFO_MAP[xiShinKey].name}.`;
        }

        // Tính 8 Đại Vận 10 Năm (Dương Nam / Âm Nữ thuận hành; Âm Nam / Dương Nữ nghịch hành)
        const isYangYear = STEM_META[yearStemIdx].polarity === 1;
        const isForwardLuck = (selectedGender === "male" && isYangYear) || (selectedGender === "female" && !isYangYear);
        const startAge = ((dayInfo.lunarDay + dayInfo.lunarMonth) % 7) + 2;
        const currentAge = Math.max(1, new Date().getFullYear() - selectedYear + 1);

        const luckCycles8 = Array.from({ length: 8 }, (_, idx) => {
            const step = idx + 1;
            const stepOffset = isForwardLuck ? step : -step;
            const lStemIdx = (monthStemIdx + stepOffset + 100) % 10;
            const lBranchIdx = (monthBranchIdx + stepOffset + 120) % 12;
            const lStem = STEM_META[lStemIdx];
            const lBranch = BRANCH_META[lBranchIdx];
            const ageFrom = startAge + idx * 10;
            const ageTo = ageFrom + 9;
            const yearFrom = selectedYear + ageFrom;
            const yearTo = selectedYear + ageTo;
            const isCurrentLuck = currentAge >= ageFrom && currentAge <= ageTo;

            return {
                step,
                ageRange: `${ageFrom} – ${ageTo} tuổi`,
                yearRange: `${yearFrom} – ${yearTo}`,
                canchi: `${lStem.name} ${lBranch.name}`,
                stemObj: lStem,
                branchObj: lBranch,
                tenGod: resolveTenGod(dayStemIdx, lStemIdx),
                napAm: getNapAmByStemBranch(lStemIdx, lBranchIdx),
                lifeStage: resolveLifeStage(dayStemIdx, lBranchIdx),
                isCurrentLuck: isCurrentLuck || (idx === 0 && currentAge < startAge),
            };
        });

        return {
            dayInfo,
            dayStemIdx,
            dayBranchIdx,
            dayMasterMeta: STEM_META[dayStemIdx],
            dayMasterProfile: DAY_MASTER_PROFILES[dayStemIdx],
            thaiNguyenCanChi,
            trueSolarLabel,
            isYangYear,
            isForwardLuck,
            pillars,
            elementPercentages,
            activeElementsSet,
            missingElements,
            supportPct,
            strengthState,
            strengthAdvice,
            yongShinKey,
            xiShinKey,
            jiShinKey,
            luckCycles8,
        };
    };

    // Đổ dữ liệu Lá Số Bát Tự ra Giao Diện Bento Grid
    const renderBaziPage = () => {
        const chart = calculateBaziChart();
        if (!chart) return;
        currentBaziChart = chart;

        const {
            dayInfo,
            dayMasterMeta,
            dayMasterProfile,
            thaiNguyenCanChi,
            trueSolarLabel,
            isYangYear,
            isForwardLuck,
            pillars,
            elementPercentages,
            activeElementsSet,
            missingElements,
            strengthState,
            strengthAdvice,
            yongShinKey,
            xiShinKey,
            jiShinKey,
            luckCycles8,
        } = chart;

        // 1. CỘT TRÁI CẶP 1: Hồ Sơ Bản Mệnh & Nhật Chủ
        const genderText = `${isYangYear ? "Dương" : "Âm"} ${selectedGender === "male" ? "Nam" : "Nữ"} • ${isForwardLuck ? "Thuận hành" : "Nghịch hành"}`;
        document.getElementById("bazi-gender-destiny-tag").textContent = genderText;
        document.getElementById("bazi-solar-term-badge").textContent = `Tiết ${dayInfo.solarTerm}`;
        document.getElementById("bazi-daymaster-icon").src = `./assets/icons/${dayMasterMeta.icon}`;
        document.getElementById("bazi-daymaster-name").textContent = dayMasterProfile.title;
        document.getElementById("bazi-daymaster-archetype").textContent = dayMasterProfile.archetype;
        document.getElementById("bazi-daymaster-desc").textContent = dayMasterProfile.desc;

        document.getElementById("bazi-meta-lunar").textContent =
            `${pad(dayInfo.lunarDay)}/${pad(dayInfo.lunarMonth)} ${dayInfo.yearCanChi} (${dayInfo.isFullMonth ? "Đủ" : "Thiếu"})`;
        document.getElementById("bazi-meta-year-napam").textContent = dayInfo.yearNapAm;
        document.getElementById("bazi-meta-thainguyen").textContent =
            `${thaiNguyenCanChi} • Trực ${dayInfo.trucObj.name}`;
        document.getElementById("bazi-meta-truesolar").textContent = trueSolarLabel;

        const isoDate = `${selectedYear}-${pad(selectedMonth)}-${pad(selectedDay)}`;
        document.getElementById("bazi-jump-day-link").href = `./day.html?date=${isoDate}`;
        document.getElementById("bazi-master-watermark").src = `./assets/icons/zodiac/${dayInfo.yearZodiacFile}.svg`;

        // 2. CỘT PHẢI CẶP 1: Bàn Tứ Trụ Bát Tự 4 Cột
        const pillarsGridEl = document.getElementById("bazi-pillars-grid");
        if (pillarsGridEl) {
            pillarsGridEl.innerHTML = pillars
                .map((p, idx) => {
                    const hiddenChipsHtml = p.hiddenDetails
                        .map(
                            (h) => `
                                <span class="bazi-pillar-col__hidden-chip">
                                    ${h.stemName} <em>(${h.tenGod})</em>
                                </span>
                            `,
                        )
                        .join("");

                    return `
                        <article
                            class="bazi-pillar-col ${p.isDayMaster ? "bazi-pillar-col--daymaster" : ""} has-bento-tooltip"
                            data-bazi-modal="pillar"
                            data-pillar-idx="${idx}"
                        >
                            <span class="bazi-pillar-col__bg-wrap" aria-hidden="true">
                                <img
                                    src="./assets/icons/zodiac/${p.branchObj.zodiac}"
                                    alt=""
                                    class="bazi-pillar-col__watermark"
                                />
                            </span>

                            <header class="bazi-pillar-col__head">
                                <span class="bazi-pillar-col__pillar-name">${p.title}</span>
                                <span class="bazi-pillar-col__ten-god ${p.isDayMaster ? "bazi-pillar-col__ten-god--master" : ""}">
                                    ${p.tenGod}
                                </span>
                            </header>

                            <div class="bazi-pillar-col__main-chars">
                                <!-- Thiên Can -->
                                <div class="bazi-pillar-col__stem-box">
                                    <div class="bazi-pillar-col__char-info">
                                        <small>Thiên Can (${p.stemObj.vnElem})</small>
                                        <strong>${p.stemObj.name}</strong>
                                    </div>
                                    <span class="bazi-pillar-col__char-icon">
                                        <img src="./assets/icons/${p.stemObj.icon}" alt="" aria-hidden="true" />
                                    </span>
                                </div>

                                <!-- Địa Chi -->
                                <div class="bazi-pillar-col__branch-box">
                                    <div class="bazi-pillar-col__char-info">
                                        <small>Địa Chi (${p.branchObj.vnElem})</small>
                                        <strong>${p.branchObj.name}</strong>
                                    </div>
                                    <span class="bazi-pillar-col__char-icon bazi-pillar-col__char-icon--zodiac">
                                        <img
                                            src="./assets/icons/zodiac/${p.branchObj.zodiac}"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                            </div>

                            <!-- Tàng Can ẩn trong Địa Chi -->
                            <div class="bazi-pillar-col__hidden-stems">
                                <span class="bazi-pillar-col__section-label">Tàng Can (Thập Thần)</span>
                                <div class="bazi-pillar-col__hidden-list">${hiddenChipsHtml}</div>
                            </div>

                            <footer class="bazi-pillar-col__foot">
                                <strong class="bazi-pillar-col__napam">${p.napAm}</strong>
                                <span class="bazi-pillar-col__stage-pill">Trường sinh: ${p.lifeStage}</span>
                            </footer>

                            ${buildBentoTooltipHtml(
                                `${p.title}: ${p.canchi}`,
                                `${p.subRole}. Nạp âm ${p.napAm}, sao ${p.tenGod}, vận ${p.lifeStage}.`,
                                `✦ Bấm để mở luận giải ${p.title}`,
                            )}
                        </article>
                    `;
                })
                .join("");
        }

        // 3. CỘT TRÁI CẶP 2: Biểu đồ Sinh Khắc & 5 Thanh Tỷ Lệ Ngũ Hành
        const missingBadgeEl = document.getElementById("bazi-missing-badge");
        if (missingBadgeEl) {
            missingBadgeEl.textContent =
                missingElements.length > 0 ? `Khuyết: ${missingElements.join(", ")}` : "Hội Tụ Đủ 5 Hành";
        }

        const svgBoxEl = document.getElementById("bazi-wuxing-svg-container");
        if (svgBoxEl) {
            svgBoxEl.innerHTML = buildWuXingSvgHtml(activeElementsSet, dayMasterMeta.element, false);
        }

        document.getElementById("bazi-wuxing-summary-note").textContent =
            `Dụng Thần cần ưu tiên: ${ELEMENT_INFO_MAP[yongShinKey].name} & ${ELEMENT_INFO_MAP[xiShinKey].name}.`;

        const barsContainer = document.getElementById("bazi-elements-bars");
        if (barsContainer) {
            const orderKeys = ["metal", "wood", "water", "fire", "earth"];
            barsContainer.innerHTML = orderKeys
                .map((key) => {
                    const info = ELEMENT_INFO_MAP[key];
                    const pct = elementPercentages[key] || 0;
                    let stateLabel = "Cân bằng";
                    if (pct === 0) stateLabel = "Đang khuyết";
                    else if (pct >= 30) stateLabel = "Thịnh vượng";
                    else if (pct <= 12) stateLabel = "Hơi yếu";

                    return `
                        <div class="bazi-element-row">
                            <div class="bazi-element-row__top">
                                <span class="bazi-element-row__name">
                                    <img src="./assets/icons/${info.icon}" alt="" aria-hidden="true" />
                                    <span>${info.name}</span>
                                </span>
                                <div class="bazi-element-row__meta">
                                    <span class="bazi-element-row__state">${stateLabel}</span>
                                    <strong>${pct}%</strong>
                                </div>
                            </div>
                            <div class="bazi-element-row__track">
                                <div
                                    class="bazi-element-row__fill bazi-element-row__fill--${key}"
                                    style="width: ${Math.max(4, pct)}%"
                                ></div>
                            </div>
                        </div>
                    `;
                })
                .join("");
        }

        // 4. CỘT PHẢI CẶP 2: Dụng Thần, Hỷ Thần, Kỵ Thần & 4 Hộp Cải Vận
        document.getElementById("bazi-strength-badge").textContent = strengthState;
        document.getElementById("bazi-strength-subtitle").textContent = strengthAdvice;

        const yongObj = ELEMENT_INFO_MAP[yongShinKey];
        const xiObj = ELEMENT_INFO_MAP[xiShinKey];
        const jiObj = ELEMENT_INFO_MAP[jiShinKey];

        const godsGridEl = document.getElementById("bazi-gods-grid");
        if (godsGridEl) {
            const godItems = [
                {
                    mod: "yong",
                    role: "Dụng Thần (Chủ đạo)",
                    key: yongShinKey,
                    obj: yongObj,
                    desc: `Nguyên tố quan trọng nhất giúp điều hầu và cân bằng toàn bộ lá số Bát Tự.`,
                },
                {
                    mod: "xi",
                    role: "Hỷ Thần (Trợ lực)",
                    key: xiShinKey,
                    obj: xiObj,
                    desc: `Nguyên tố cát lành tương trợ cho Dụng Thần, mang lại quý nhân và cơ hội thuận lợi.`,
                },
                {
                    mod: "ji",
                    role: "Kỵ Thần (Cần tiết chế)",
                    key: jiShinKey,
                    obj: jiObj,
                    desc: `Nguyên tố dễ gây mất cân bằng mệnh cục; nên tiết chế màu sắc hoặc phương vị thuộc hành này.`,
                },
            ];

            godsGridEl.innerHTML = godItems
                .map(
                    (g) => `
                        <article
                            class="bazi-god-box bazi-god-box--${g.mod} has-bento-tooltip"
                            data-bazi-modal="god"
                            data-god-role="${g.role}"
                            data-god-key="${g.key}"
                        >
                            <div class="bazi-god-box__top">
                                <span class="bazi-god-box__icon-wrap">
                                    <img src="./assets/icons/${g.obj.icon}" alt="" aria-hidden="true" />
                                </span>
                                <span class="bazi-god-box__role">${g.role}</span>
                            </div>

                            <strong class="bazi-god-box__elem">${g.obj.name}</strong>
                            <p class="bazi-god-box__desc">${g.desc}</p>

                            ${buildBentoTooltipHtml(
                                `${g.role}: ${g.obj.name}`,
                                `${g.desc} Hướng hợp: ${g.obj.directions}.`,
                                `✦ Bấm để mở thẻ phân tích ${g.role}`,
                            )}
                        </article>
                    `,
                )
                .join("");
        }

        const remedyGridEl = document.getElementById("bazi-remedy-grid");
        if (remedyGridEl) {
            const remedies = [
                {
                    label: "Phương vị & Hướng đại lợi",
                    tag: `Theo ${yongObj.short} & ${xiObj.short}`,
                    val: `${yongObj.directions} • ${xiObj.directions}`,
                    sub: "Ưu tiên chọn hướng bàn làm việc, hướng nhà hoặc xuất hành theo phương vị Dụng Thần.",
                },
                {
                    label: "Màu sắc & Trang phục bổ khuyết",
                    tag: "Năng lượng Dụng Thần",
                    val: yongObj.colors,
                    sub: `Có thể kết hợp thêm gam màu ${xiObj.colors.toLowerCase()} của Hỷ Thần trong không gian sống.`,
                },
                {
                    label: "Con số Hà Đồ may mắn",
                    tag: "Tần số tương hợp",
                    val: `${yongObj.numbers} • ${xiObj.numbers}`,
                    sub: "Ứng dụng khi chọn số tầng, số phòng hoặc các mốc thời gian khởi sự quan trọng.",
                },
                {
                    label: "Lĩnh vực & Thói quen vượng khí",
                    tag: "Ứng dụng đời sống",
                    val: yongObj.career,
                    sub: `Chủ động kết nối với đối tác hoặc quý nhân có bản mệnh vượng ${yongObj.name} và ${xiObj.name}.`,
                },
            ];

            remedyGridEl.innerHTML = remedies
                .map(
                    (r) => `
                        <article class="bazi-remedy-box">
                            <div class="bazi-remedy-box__head">
                                <span class="bazi-remedy-box__label">${r.label}</span>
                                <span class="bazi-remedy-box__tag">${r.tag}</span>
                            </div>
                            <strong class="bazi-remedy-box__val">${r.val}</strong>
                            <p class="bazi-remedy-box__sub">${r.sub}</p>
                        </article>
                    `,
                )
                .join("");
        }

        // 5. TẦNG 4: Lưới 8 Đại Vận (10 Năm/Vận)
        document.getElementById("bazi-luck-direction-note").textContent =
            `Mệnh ${genderText} — Đại Vận khởi từ Trụ Tháng (${pillars[1].canchi}), mỗi đại vận cai quản 10 năm cuộc đời.`;

        const luckGridEl = document.getElementById("bazi-luck-grid");
        if (luckGridEl) {
            luckGridEl.innerHTML = luckCycles8
                .map(
                    (lk, idx) => `
                        <article
                            class="bazi-luck-card ${lk.isCurrentLuck ? "is-current-luck" : ""} has-bento-tooltip"
                            data-bazi-modal="luck"
                            data-luck-idx="${idx}"
                        >
                            <span class="bazi-luck-card__step">Đại Vận ${lk.step}</span>
                            <span class="bazi-luck-card__ages">${lk.ageRange}</span>
                            <strong class="bazi-luck-card__canchi">${lk.canchi}</strong>
                            <span class="bazi-luck-card__tengod">${lk.tenGod}</span>
                            <span class="bazi-luck-card__napam">${lk.napAm}</span>

                            ${buildBentoTooltipHtml(
                                `Đại Vận ${lk.step}: ${lk.canchi} (${lk.yearRange})`,
                                `Giai đoạn ${lk.ageRange}. Sao chủ vận: ${lk.tenGod}, Nạp âm ${lk.napAm}, Vòng trường sinh: ${lk.lifeStage}.`,
                                `✦ Bấm để xem chi tiết Đại Vận ${lk.canchi}`,
                            )}
                        </article>
                    `,
                )
                .join("");
        }
    };

    // Đóng / Mở Bento Modal Giải Nghĩa Bát Tự (#bazi-term-modal)
    const closeBaziModal = () => {
        const modal = document.getElementById("bazi-term-modal");
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
    };

    const openBaziModal = (triggerEl) => {
        const modal = document.getElementById("bazi-term-modal");
        if (!modal || !currentBaziChart) return;

        const modalType = triggerEl.dataset.baziModal;
        const catEl = document.getElementById("bazi-term-modal-category");
        const titleEl = document.getElementById("bazi-term-modal-title");
        const visualEl = document.getElementById("bazi-term-modal-visual");
        const pillsEl = document.getElementById("bazi-term-modal-pills");
        const descEl = document.getElementById("bazi-term-modal-desc");
        const adviceEl = document.getElementById("bazi-term-modal-advice");

        visualEl.classList.remove("is-zodiac-filtered");

        if (modalType === "pillar") {
            const pIdx = Number(triggerEl.dataset.pillarIdx || 0);
            const p = currentBaziChart.pillars[pIdx];
            if (!p) return;

            catEl.textContent = p.title;
            titleEl.textContent = `${p.canchi} • ${p.napAm}`;
            visualEl.classList.add("is-zodiac-filtered");
            visualEl.innerHTML = `
                <img src="./assets/icons/zodiac/${p.branchObj.zodiac}" alt="" />
                <strong>Linh vật ${p.branchObj.animal} (${p.branchObj.name})</strong>
            `;
            pillsEl.innerHTML = `
                <span class="day-term-modal__pill day-term-modal__pill--highlight">Thập Thần: ${p.tenGod}</span>
                <span class="day-term-modal__pill">Trường sinh: ${p.lifeStage}</span>
                <span class="day-term-modal__pill">Nạp âm: ${p.napAm}</span>
            `;
            descEl.textContent = `${p.title} (${p.subRole}) gồm Thiên Can ${p.stemObj.name} (${p.stemObj.vnElem}) kết hợp Địa Chi ${p.branchObj.name} (${p.branchObj.vnElem}). ${TEN_GODS_DESC[p.tenGod] || ""}`;
            const hiddenSummary = p.hiddenDetails.map((h) => `${h.stemName} (${h.tenGod})`).join(", ");
            adviceEl.textContent = `Bên trong Địa Chi ${p.branchObj.name} tàng ẩn các Thiên Can: ${hiddenSummary}. Trạng thái năng lượng trên Vòng Trường Sinh đạt ngưỡng "${p.lifeStage}".`;
        } else if (modalType === "god") {
            const role = triggerEl.dataset.godRole || "Dụng Thần";
            const elemKey = triggerEl.dataset.godKey || "earth";
            const info = ELEMENT_INFO_MAP[elemKey];

            catEl.textContent = "Phân Tích Dụng Thần & Cải Vận";
            titleEl.textContent = `${role} • ${info.name}`;
            visualEl.innerHTML = `
                <img src="./assets/icons/${info.icon}" alt="" />
                <strong>${info.name}</strong>
            `;
            pillsEl.innerHTML = `
                <span class="day-term-modal__pill day-term-modal__pill--highlight">${currentBaziChart.strengthState}</span>
                <span class="day-term-modal__pill">Hướng: ${info.directions}</span>
                <span class="day-term-modal__pill">${info.numbers}</span>
            `;
            descEl.textContent = currentBaziChart.strengthAdvice;
            adviceEl.textContent = `Ứng dụng ${info.name}: Ưu tiên màu sắc (${info.colors}), phương hướng (${info.directions}) và các ngành nghề/hoạt động gắn với ${info.career}.`;
        } else if (modalType === "luck") {
            const lIdx = Number(triggerEl.dataset.luckIdx || 0);
            const lk = currentBaziChart.luckCycles8[lIdx];
            if (!lk) return;

            catEl.textContent = `Chu Kỳ Đại Vận 10 Năm (Đại Vận ${lk.step})`;
            titleEl.textContent = `Đại Vận ${lk.canchi} (${lk.ageRange})`;
            visualEl.classList.add("is-zodiac-filtered");
            visualEl.innerHTML = `
                <img src="./assets/icons/zodiac/${lk.branchObj.zodiac}" alt="" />
                <strong>${lk.yearRange}</strong>
            `;
            pillsEl.innerHTML = `
                <span class="day-term-modal__pill day-term-modal__pill--highlight">Sao chủ vận: ${lk.tenGod}</span>
                <span class="day-term-modal__pill">Nạp âm: ${lk.napAm}</span>
                <span class="day-term-modal__pill">Vận: ${lk.lifeStage}</span>
            `;
            descEl.textContent = `Trong 10 năm từ ${lk.ageRange} (${lk.yearRange}), đại vận đi qua can chi ${lk.canchi} với sao ${lk.tenGod} làm chủ đạo. ${TEN_GODS_DESC[lk.tenGod] || ""}`;
            adviceEl.textContent = `Giai đoạn này mang nạp âm ${lk.napAm} và khí vận ${lk.lifeStage}. Hãy kết hợp năng lượng Dụng Thần (${ELEMENT_INFO_MAP[currentBaziChart.yongShinKey].name}) để tối ưu hóa quyết định sự nghiệp và tài chính.`;
        }

        modal.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const populateSelectOptions = () => {
        const daySelect = document.getElementById("bazi-select-day");
        const yearSelect = document.getElementById("bazi-select-year");
        if (!daySelect || !yearSelect) return;

        const maxDays = new Date(selectedYear, selectedMonth, 0).getDate();
        if (selectedDay > maxDays) selectedDay = maxDays;

        let daysHtml = "";
        for (let d = 1; d <= maxDays; d++) {
            daysHtml += `<option value="${d}" ${d === selectedDay ? "selected" : ""}>Ngày ${pad(d)}</option>`;
        }
        daySelect.innerHTML = daysHtml;

        if (yearSelect.options.length <= 1) {
            let yearsHtml = "";
            for (let y = 1940; y <= 2040; y++) {
                yearsHtml += `<option value="${y}" ${y === selectedYear ? "selected" : ""}>Năm ${y}</option>`;
            }
            yearSelect.innerHTML = yearsHtml;
        } else {
            yearSelect.value = String(selectedYear);
        }
    };

    const initBaziPage = () => {
        // Đọc tham số URL (?date=YYYY-MM-DD&hour=ty) nếu chuyển sang từ trang day.html
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get("date");
        const hourParam = params.get("hour");
        const genderParam = params.get("gender");

        if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
            const [y, m, d] = dateParam.split("-").map(Number);
            selectedYear = y;
            selectedMonth = m;
            selectedDay = d;
        } else {
            const now = new Date();
            selectedYear = now.getFullYear();
            selectedMonth = now.getMonth() + 1;
            selectedDay = now.getDate();
            if (window.LunarEngine) {
                const brIdx = window.LunarEngine.getBranchIndexFromHour(now.getHours());
                selectedHourKey = BRANCH_META[brIdx]?.key || "thin";
            }
        }

        if (hourParam && BRANCH_META.some((b) => b.key === hourParam)) {
            selectedHourKey = hourParam;
        }
        if (genderParam === "female" || genderParam === "male") {
            selectedGender = genderParam;
        }

        populateSelectOptions();

        const daySelect = document.getElementById("bazi-select-day");
        const monthSelect = document.getElementById("bazi-select-month");
        const yearSelect = document.getElementById("bazi-select-year");
        const hourSelect = document.getElementById("bazi-select-hour");
        const regionSelect = document.getElementById("bazi-select-region");
        const nowBtn = document.getElementById("bazi-now-btn");
        const shareBtn = document.getElementById("bazi-share-btn");
        const shareLabel = document.getElementById("bazi-share-label");

        if (monthSelect) monthSelect.value = String(selectedMonth);
        if (hourSelect) hourSelect.value = selectedHourKey;

        document.querySelectorAll("[data-bazi-gender]").forEach((btn) => {
            const isMatch = btn.dataset.baziGender === selectedGender;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(isMatch));

            btn.onclick = () => {
                selectedGender = btn.dataset.baziGender || "male";
                document.querySelectorAll("[data-bazi-gender]").forEach((b) => {
                    const active = b === btn;
                    b.classList.toggle("is-active", active);
                    b.setAttribute("aria-pressed", String(active));
                });
                renderBaziPage();
            };
        });

        daySelect?.addEventListener("change", () => {
            selectedDay = Number(daySelect.value);
            renderBaziPage();
        });

        monthSelect?.addEventListener("change", () => {
            selectedMonth = Number(monthSelect.value);
            populateSelectOptions();
            renderBaziPage();
        });

        yearSelect?.addEventListener("change", () => {
            selectedYear = Number(yearSelect.value);
            populateSelectOptions();
            renderBaziPage();
        });

        hourSelect?.addEventListener("change", () => {
            selectedHourKey = hourSelect.value;
            renderBaziPage();
        });

        regionSelect?.addEventListener("change", () => {
            selectedLongitude = Number(regionSelect.value) || 106.6;
            renderBaziPage();
        });

        if (nowBtn) {
            nowBtn.onclick = () => {
                const now = new Date();
                selectedYear = now.getFullYear();
                selectedMonth = now.getMonth() + 1;
                selectedDay = now.getDate();
                if (window.LunarEngine) {
                    const brIdx = window.LunarEngine.getBranchIndexFromHour(now.getHours());
                    selectedHourKey = BRANCH_META[brIdx]?.key || "thin";
                }
                populateSelectOptions();
                if (monthSelect) monthSelect.value = String(selectedMonth);
                if (hourSelect) hourSelect.value = selectedHourKey;
                renderBaziPage();
            };
        }

        if (shareBtn && shareLabel) {
            shareBtn.onclick = async () => {
                const isoDate = `${selectedYear}-${pad(selectedMonth)}-${pad(selectedDay)}`;
                const shareUrl = `${window.location.origin}${window.location.pathname}?date=${isoDate}&hour=${selectedHourKey}&gender=${selectedGender}`;
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    shareLabel.textContent = "Đã sao chép link!";
                    setTimeout(() => {
                        shareLabel.textContent = "Chia sẻ lá số";
                    }, 2000);
                } catch (e) {
                    shareLabel.textContent = "Chia sẻ lá số";
                }
            };
        }

        // Ủy quyền sự kiện Click mở Bento Modal Giải Nghĩa Bát Tự
        document.getElementById("main")?.addEventListener("click", (e) => {
            const triggerEl = e.target.closest("[data-bazi-modal]");
            if (!triggerEl) return;
            openBaziModal(triggerEl);
        });

        document.getElementById("bazi-term-modal-close")?.addEventListener("click", closeBaziModal);
        document.getElementById("bazi-term-modal-cancel")?.addEventListener("click", closeBaziModal);
        document.getElementById("bazi-term-modal-backdrop")?.addEventListener("click", closeBaziModal);

        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("bazi-term-modal");
            if (e.key === "Escape" && modal && !modal.hidden) {
                closeBaziModal();
            }
        });

        // Đồng bộ khi người dùng chọn ngày từ Converter Modal trên Header
        window.addEventListener("converter-jump-to-date", (e) => {
            if (e.detail) {
                selectedYear = e.detail.year;
                selectedMonth = e.detail.month;
                selectedDay = e.detail.day;
                populateSelectOptions();
                if (monthSelect) monthSelect.value = String(selectedMonth);
                renderBaziPage();
            }
        });

        renderBaziPage();
    };

    document.addEventListener("DOMContentLoaded", initBaziPage);
})();
