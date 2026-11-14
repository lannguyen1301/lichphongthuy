// assets/js/bazi.js
// Chuyên trách Trang Bát Tự (bazi.html): Custom Bento Dropdowns, Bàn Tứ Trụ 4 cột đồng đều,
// Scroll Animation cho thanh Ngũ Hành & 5 Nhóm Thập Thần, Hover Animation Dụng Thần & 8 Đại Vận Bento Sole 3-4-1
(() => {
    let selectedDay = 13;
    let selectedMonth = 11;
    let selectedYear = 2026;
    let yearGridStart = 2016;
    let selectedHourKey = "hoi";
    let selectedGender = "male"; // "male" | "female"
    let selectedLongitude = 106.6;
    let currentBaziChart = null;
    let barObserver = null;

    const pad = (n) => String(n).padStart(2, "0");

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const setAttr = (id, attr, val) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, val);
    };

    const REGIONS_LIST = [
        { lon: 106.6, label: "Miền Nam • TP.HCM (106.6°Đ)", note: "+06p 24s" },
        { lon: 105.8, label: "Miền Bắc • Hà Nội (105.8°Đ)", note: "+03p 12s" },
        { lon: 108.2, label: "Miền Trung • Đà Nẵng (108.2°Đ)", note: "+12p 48s" },
        { lon: 105.7, label: "Tây Nam Bộ • Cần Thơ (105.7°Đ)", note: "+02p 48s" },
    ];

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
            range: "23:00 - 01:00",
            element: "water",
            vnElem: "Thủy",
            zodiac: "mouse.svg",
            animal: "Chuột",
            hiddenStems: [9],
        },
        {
            name: "Sửu",
            key: "suu",
            range: "01:00 - 03:00",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "buffalo.svg",
            animal: "Trâu",
            hiddenStems: [5, 9, 7],
        },
        {
            name: "Dần",
            key: "dan",
            range: "03:00 - 05:00",
            element: "wood",
            vnElem: "Mộc",
            zodiac: "tiger.svg",
            animal: "Hổ",
            hiddenStems: [0, 2, 4],
        },
        {
            name: "Mão",
            key: "mao",
            range: "05:00 - 07:00",
            element: "wood",
            vnElem: "Mộc",
            zodiac: "cat.svg",
            animal: "Mèo",
            hiddenStems: [1],
        },
        {
            name: "Thìn",
            key: "thin",
            range: "07:00 - 09:00",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "dragon.svg",
            animal: "Rồng",
            hiddenStems: [4, 1, 9],
        },
        {
            name: "Tỵ",
            key: "ty_snake",
            range: "09:00 - 11:00",
            element: "fire",
            vnElem: "Hỏa",
            zodiac: "snake.svg",
            animal: "Rắn",
            hiddenStems: [2, 4, 6],
        },
        {
            name: "Ngọ",
            key: "ngo",
            range: "11:00 - 13:00",
            element: "fire",
            vnElem: "Hỏa",
            zodiac: "horse.svg",
            animal: "Ngựa",
            hiddenStems: [3, 5],
        },
        {
            name: "Mùi",
            key: "mui",
            range: "13:00 - 15:00",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "goat.svg",
            animal: "Dê",
            hiddenStems: [5, 3, 1],
        },
        {
            name: "Thân",
            key: "than",
            range: "15:00 - 17:00",
            element: "metal",
            vnElem: "Kim",
            zodiac: "monkey.svg",
            animal: "Khỉ",
            hiddenStems: [6, 8, 4],
        },
        {
            name: "Dậu",
            key: "dau",
            range: "17:00 - 19:00",
            element: "metal",
            vnElem: "Kim",
            zodiac: "rooster.svg",
            animal: "Gà",
            hiddenStems: [7],
        },
        {
            name: "Tuất",
            key: "tuat",
            range: "19:00 - 21:00",
            element: "earth",
            vnElem: "Thổ",
            zodiac: "dog.svg",
            animal: "Chó",
            hiddenStems: [4, 7, 3],
        },
        {
            name: "Hợi",
            key: "hoi",
            range: "21:00 - 23:00",
            element: "water",
            vnElem: "Thủy",
            zodiac: "pig.svg",
            animal: "Hợi",
            hiddenStems: [8, 0],
        },
    ];

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

    // 1. Render 5 Custom Bento Pickers (Ngày, Tháng, Năm, Canh Giờ, Nơi Sinh)
    const renderCustomBaziPickers = () => {
        const dayListEl = document.getElementById("bazi-day-list");
        const monthListEl = document.getElementById("bazi-month-list");
        const yearListEl = document.getElementById("bazi-year-list");
        const hourListEl = document.getElementById("bazi-hour-list");
        const regionListEl = document.getElementById("bazi-region-list");

        const maxDays = new Date(selectedYear, selectedMonth, 0).getDate();
        if (selectedDay > maxDays) selectedDay = maxDays;

        const hourObj = BRANCH_META.find((b) => b.key === selectedHourKey) || BRANCH_META[11];
        const regionObj = REGIONS_LIST.find((r) => r.lon === selectedLongitude) || REGIONS_LIST[0];

        setText("bazi-day-text", `Ngày ${pad(selectedDay)}`);
        setText("bazi-month-text", `Tháng ${pad(selectedMonth)}`);
        setText("bazi-year-text", `Năm ${selectedYear}`);
        setText("bazi-hour-text", `Giờ ${hourObj.name} (${hourObj.range})`);
        setText("bazi-region-text", regionObj.label);
        setText("bazi-year-range-label", `${yearGridStart} - ${yearGridStart + 11}`);

        if (dayListEl) {
            let daysHtml = "";
            for (let d = 1; d <= maxDays; d++) {
                const isSel = d === selectedDay;
                daysHtml += `<li><button type="button" role="option" aria-selected="${isSel}" data-bazi-day="${d}" class="bazi-picker__option ${isSel ? "is-selected" : ""}">${pad(d)}</button></li>`;
            }
            dayListEl.innerHTML = daysHtml;
        }

        if (monthListEl) {
            let monthsHtml = "";
            for (let m = 1; m <= 12; m++) {
                const isSel = m === selectedMonth;
                monthsHtml += `<li><button type="button" role="option" aria-selected="${isSel}" data-bazi-month="${m}" class="bazi-picker__option ${isSel ? "is-selected" : ""}">Tháng ${pad(m)}</button></li>`;
            }
            monthListEl.innerHTML = monthsHtml;
        }

        if (yearListEl) {
            let yearsHtml = "";
            for (let y = yearGridStart; y < yearGridStart + 12; y++) {
                const isSel = y === selectedYear;
                yearsHtml += `<li><button type="button" role="option" aria-selected="${isSel}" data-bazi-year="${y}" class="bazi-picker__option ${isSel ? "is-selected" : ""}">${y}</button></li>`;
            }
            yearListEl.innerHTML = yearsHtml;
        }

        if (hourListEl) {
            hourListEl.innerHTML = BRANCH_META.map((b) => {
                const isSel = b.key === selectedHourKey;
                return `
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="${isSel}"
                            data-bazi-hour="${b.key}"
                            class="bazi-picker__option bazi-picker__option--row ${isSel ? "is-selected" : ""}"
                        >
                            <span>Giờ ${b.name}</span>
                            <small>${b.range}</small>
                        </button>
                    </li>
                `;
            }).join("");
        }

        if (regionListEl) {
            regionListEl.innerHTML = REGIONS_LIST.map((r) => {
                const isSel = r.lon === selectedLongitude;
                return `
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="${isSel}"
                            data-bazi-lon="${r.lon}"
                            class="bazi-picker__option bazi-picker__option--row ${isSel ? "is-selected" : ""}"
                        >
                            <span>${r.label}</span>
                            <small>${r.note}</small>
                        </button>
                    </li>
                `;
            }).join("");
        }
    };

    // 2. Kích hoạt hiệu ứng trượt thanh % khi cuộn tới (IntersectionObserver)
    const triggerBarsScrollAnimation = () => {
        const elemBars = document.getElementById("bazi-elements-bars");
        const tenGodBars = document.getElementById("bazi-tengods-bars");
        if (!elemBars) return;

        elemBars.classList.remove("is-in-view");
        tenGodBars?.classList.remove("is-in-view");

        if (barObserver) barObserver.disconnect();

        barObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            elemBars.classList.add("is-in-view");
                            tenGodBars?.classList.add("is-in-view");
                        });
                    }
                });
            },
            { threshold: 0.18 },
        );

        barObserver.observe(elemBars);
    };

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

        const thaiStemIdx = (monthStemIdx + 1) % 10;
        const thaiBranchIdx = (monthBranchIdx + 3) % 12;
        const thaiNguyenCanChi = `${STEM_META[thaiStemIdx].name} ${BRANCH_META[thaiBranchIdx].name}`;

        const diffMinutesFloat = (selectedLongitude - 105.0) * 4;
        const sign = diffMinutesFloat >= 0 ? "+" : "-";
        const absMins = Math.floor(Math.abs(diffMinutesFloat));
        const absSecs = Math.round((Math.abs(diffMinutesFloat) - absMins) * 60);
        const trueSolarLabel = `${sign}${pad(absMins)} phút ${pad(absSecs)} giây (${selectedLongitude}°Đ)`;

        // FIX ẢNH 2: Tên hiển thị ngắn gọn 1 dòng (TRỤ NĂM, TRỤ THÁNG, TRỤ NGÀY, TRỤ GIỜ), giải nghĩa đầy đủ nằm ở fullTitle
        const rawPillars = [
            {
                id: "year",
                shortTitle: "TRỤ NĂM",
                fullTitle: "Trụ Năm (Niên Trụ)",
                subRole: "Gốc rễ Tổ tiên & Thời niên thiếu",
                stemIdx: yearStemIdx,
                branchIdx: yearBranchIdx,
                isDayMaster: false,
            },
            {
                id: "month",
                shortTitle: "TRỤ THÁNG",
                fullTitle: "Trụ Tháng (Nguyệt Trụ)",
                subRole: "Nguyệt Lệnh, Sự nghiệp & Cha mẹ",
                stemIdx: monthStemIdx,
                branchIdx: monthBranchIdx,
                isDayMaster: false,
            },
            {
                id: "day",
                shortTitle: "TRỤ NGÀY",
                fullTitle: "Trụ Ngày (Nhật Chủ)",
                subRole: "Bản thân (Nhật Nguyên) & Phối ngẫu",
                stemIdx: dayStemIdx,
                branchIdx: dayBranchIdx,
                isDayMaster: true,
            },
            {
                id: "hour",
                shortTitle: "TRỤ GIỜ",
                fullTitle: "Trụ Giờ (Thời Trụ)",
                subRole: "Hậu vận, Con cái & Thành tựu",
                stemIdx: hourStemIdx,
                branchIdx: hourBranchIdx,
                isDayMaster: false,
            },
        ];

        const elementScores = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

        const pillars = rawPillars.map((p) => {
            const stemObj = STEM_META[p.stemIdx];
            const branchObj = BRANCH_META[p.branchIdx];
            const tenGod = p.isDayMaster ? "Nhật Chủ" : resolveTenGod(dayStemIdx, p.stemIdx);
            const napAm = getNapAmByStemBranch(p.stemIdx, p.branchIdx);
            const lifeStage = resolveLifeStage(dayStemIdx, p.branchIdx);

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

        // Phân bổ 5 Nhóm Thập Thần (Ấn Tinh, Tỷ Kiếp, Thực Thương, Tài Tinh, Quan Sát)
        const tenGodGroups = [
            {
                name: "Ấn Tinh",
                sub: "Chính/Thiên Ấn",
                pct: elementPercentages[dmElemInfo.genBy] || 0,
            },
            {
                name: "Tỷ Kiếp",
                sub: "Tỷ Kiên/Kiếp Tài",
                pct: elementPercentages[dmElemKey] || 0,
            },
            {
                name: "Thực Thương",
                sub: "Thực/Thương Quan",
                pct: elementPercentages[dmElemInfo.generates] || 0,
            },
            {
                name: "Tài Tinh",
                sub: "Chính/Thiên Tài",
                pct: elementPercentages[dmElemInfo.controls] || 0,
            },
            {
                name: "Quan Sát",
                sub: "Chính Quan/Thất Sát",
                pct: elementPercentages[dmElemInfo.ctrlBy] || 0,
            },
        ];

        let strengthState = "Thân Cân Bằng";
        let yongShinKey = dmElemInfo.generates;
        let xiShinKey = dmElemInfo.controls;
        let jiShinKey = dmElemInfo.ctrlBy;
        let strengthAdvice = "";

        if (supportPct < 45) {
            strengthState = "Thân Nhược (Cần Sinh Trợ)";
            yongShinKey = dmElemInfo.genBy;
            xiShinKey = dmElemKey;
            jiShinKey = dmElemInfo.controls;
            strengthAdvice = `Nhật Chủ ${STEM_META[dayStemIdx].name} (${dmElemInfo.short}) có lực lượng Tỷ/Ấn đạt ${supportPct}% (Thân Nhược). Dụng Thần ưu tiên số 1 là ${ELEMENT_INFO_MAP[yongShinKey].name} (Ấn Tinh sinh trợ) và Hỷ Thần là ${ELEMENT_INFO_MAP[xiShinKey].name} (Tỷ Kiếp tương trợ).`;
        } else if (supportPct > 56) {
            strengthState = "Thân Vượng (Cần Tiết Tú)";
            yongShinKey = dmElemInfo.generates;
            xiShinKey = dmElemInfo.controls;
            jiShinKey = dmElemInfo.genBy;
            strengthAdvice = `Nhật Chủ ${STEM_META[dayStemIdx].name} (${dmElemInfo.short}) có lực lượng Tỷ/Ấn đạt ${supportPct}% (Thân Vượng). Dụng Thần ưu tiên số 1 là ${ELEMENT_INFO_MAP[yongShinKey].name} (Thực Thương khơi thông năng lượng) và Hỷ Thần là ${ELEMENT_INFO_MAP[xiShinKey].name} (Tài Tinh).`;
        } else {
            strengthState = "Trung Hòa (Mệnh Cục Cân Bằng)";
            yongShinKey = dmElemInfo.generates;
            xiShinKey = dmElemInfo.genBy;
            jiShinKey = dmElemInfo.ctrlBy;
            strengthAdvice = `Nhật Chủ ${STEM_META[dayStemIdx].name} (${dmElemInfo.short}) đạt ngưỡng Trung Hòa lý tưởng (${supportPct}%). Nên duy trì sự lưu thông qua ${ELEMENT_INFO_MAP[yongShinKey].name} và ${ELEMENT_INFO_MAP[xiShinKey].name}.`;
        }

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
            tenGodGroups,
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
            tenGodGroups,
            activeElementsSet,
            missingElements,
            strengthState,
            strengthAdvice,
            yongShinKey,
            xiShinKey,
            jiShinKey,
            luckCycles8,
        } = chart;

        const genderText = `${isYangYear ? "Dương" : "Âm"} ${selectedGender === "male" ? "Nam" : "Nữ"} • ${isForwardLuck ? "Thuận hành" : "Nghịch hành"}`;
        setText("bazi-gender-destiny-tag", genderText);
        setText("bazi-solar-term-badge", `Tiết ${dayInfo.solarTerm}`);
        setAttr("bazi-daymaster-icon", "src", `./assets/icons/${dayMasterMeta.icon}`);
        setText("bazi-daymaster-name", dayMasterProfile.title);
        setText("bazi-daymaster-archetype", dayMasterProfile.archetype);
        setText("bazi-daymaster-desc", dayMasterProfile.desc);

        setText(
            "bazi-meta-lunar",
            `${pad(dayInfo.lunarDay)}/${pad(dayInfo.lunarMonth)} ${dayInfo.yearCanChi} (${dayInfo.isFullMonth ? "Đủ" : "Thiếu"})`,
        );
        setText("bazi-meta-year-napam", dayInfo.yearNapAm);
        setText("bazi-meta-thainguyen", `${thaiNguyenCanChi} • Trực ${dayInfo.trucObj.name}`);
        setText("bazi-meta-truesolar", trueSolarLabel);

        const isoDate = `${selectedYear}-${pad(selectedMonth)}-${pad(selectedDay)}`;
        setAttr("bazi-jump-day-link", "href", `./day.html?date=${isoDate}`);
        setAttr("bazi-master-watermark", "src", `./assets/icons/zodiac/${dayInfo.yearZodiacFile}.svg`);

        // 1. Render 4 Cột Tứ Trụ (Title ngắn gọn 1 dòng: TRỤ NĂM, TRỤ THÁNG, TRỤ NGÀY, TRỤ GIỜ)
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
                                <span class="bazi-pillar-col__pillar-name">${p.shortTitle}</span>
                                <span class="bazi-pillar-col__ten-god ${p.isDayMaster ? "bazi-pillar-col__ten-god--master" : ""}">
                                    ${p.tenGod}
                                </span>
                            </header>

                            <div class="bazi-pillar-col__main-chars">
                                <div class="bazi-pillar-col__stem-box">
                                    <div class="bazi-pillar-col__char-info">
                                        <small>Thiên Can (${p.stemObj.vnElem})</small>
                                        <strong>${p.stemObj.name}</strong>
                                    </div>
                                    <span class="bazi-pillar-col__char-icon">
                                        <img src="./assets/icons/${p.stemObj.icon}" alt="" aria-hidden="true" />
                                    </span>
                                </div>

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

                            <div class="bazi-pillar-col__hidden-stems">
                                <span class="bazi-pillar-col__section-label">Tàng Can (Thập Thần)</span>
                                <div class="bazi-pillar-col__hidden-list">${hiddenChipsHtml}</div>
                            </div>

                            <footer class="bazi-pillar-col__foot">
                                <strong class="bazi-pillar-col__napam">${p.napAm}</strong>
                                <span class="bazi-pillar-col__stage-pill">Trường sinh: ${p.lifeStage}</span>
                            </footer>

                            ${buildBentoTooltipHtml(
                                `${p.fullTitle}: ${p.canchi}`,
                                `${p.subRole}. Nạp âm ${p.napAm}, sao ${p.tenGod}, vận ${p.lifeStage}.`,
                                `✦ Bấm để mở luận giải ${p.fullTitle}`,
                            )}
                        </article>
                    `;
                })
                .join("");
        }

        // 2. Render Biểu đồ Ngũ Hành + 5 Thanh % (Có Scroll Animation) + 5 Nhóm Thập Thần
        setText(
            "bazi-missing-badge",
            missingElements.length > 0 ? `Khuyết: ${missingElements.join(", ")}` : "Hội Tụ Đủ 5 Hành",
        );

        const svgBoxEl = document.getElementById("bazi-wuxing-svg-container");
        if (svgBoxEl) {
            svgBoxEl.innerHTML = buildWuXingSvgHtml(activeElementsSet, dayMasterMeta.element, false);
        }

        setText(
            "bazi-wuxing-summary-note",
            `Dụng Thần cần ưu tiên: ${ELEMENT_INFO_MAP[yongShinKey].name} & ${ELEMENT_INFO_MAP[xiShinKey].name}.`,
        );

        const barsContainer = document.getElementById("bazi-elements-bars");
        if (barsContainer) {
            const orderKeys = ["metal", "wood", "water", "fire", "earth"];
            barsContainer.innerHTML = orderKeys
                .map((key, idx) => {
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
                                    style="--target-w: ${Math.max(4, pct)}%; transition-delay: ${idx * 0.08}s"
                                ></div>
                            </div>
                        </div>
                    `;
                })
                .join("");
        }

        const tenGodBarsEl = document.getElementById("bazi-tengods-bars");
        if (tenGodBarsEl) {
            tenGodBarsEl.innerHTML = tenGodGroups
                .map(
                    (g, idx) => `
                        <div class="bazi-tengods-row">
                            <span class="bazi-tengods-row__label">
                                ${g.name} <small>(${g.sub})</small>
                            </span>
                            <div class="bazi-tengods-row__track">
                                <div
                                    class="bazi-tengods-row__fill"
                                    style="--target-w: ${Math.max(4, g.pct)}%; transition-delay: ${idx * 0.08}s"
                                ></div>
                            </div>
                            <strong class="bazi-tengods-row__val">${g.pct}%</strong>
                        </div>
                    `,
                )
                .join("");
        }

        triggerBarsScrollAnimation();

        // 3. Render Dụng Thần, Hỷ Thần, Kỵ Thần & 4 Hộp Cải Vận (Có Watermark & Hover Animation Icon)
        setText("bazi-strength-badge", strengthState);
        setText("bazi-strength-subtitle", strengthAdvice);

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
                    desc: "Nguyên tố quan trọng nhất giúp điều hầu và cân bằng toàn bộ lá số Bát Tự.",
                },
                {
                    mod: "xi",
                    role: "Hỷ Thần (Trợ lực)",
                    key: xiShinKey,
                    obj: xiObj,
                    desc: "Nguyên tố cát lành tương trợ cho Dụng Thần, mang lại quý nhân và cơ hội thuận lợi.",
                },
                {
                    mod: "ji",
                    role: "Kỵ Thần (Cần tiết chế)",
                    key: jiShinKey,
                    obj: jiObj,
                    desc: "Nguyên tố dễ gây mất cân bằng mệnh cục; nên tiết chế màu sắc hoặc phương vị thuộc hành này.",
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
                            <span class="bazi-god-box__bg-wrap" aria-hidden="true">
                                <img src="./assets/icons/${g.obj.icon}" alt="" class="bazi-god-box__watermark" />
                            </span>

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
                    icon: "./assets/icons/weather/region-compass.svg",
                    val: `${yongObj.directions} • ${xiObj.directions}`,
                    sub: "Ưu tiên chọn hướng bàn làm việc, hướng nhà hoặc xuất hành theo phương vị Dụng Thần.",
                },
                {
                    label: "Màu sắc & Trang phục bổ khuyết",
                    tag: "Năng lượng Dụng Thần",
                    icon: "./assets/icons/theme.svg",
                    val: yongObj.colors,
                    sub: `Có thể kết hợp thêm gam màu ${xiObj.colors.toLowerCase()} của Hỷ Thần trong không gian sống.`,
                },
                {
                    label: "Con số Hà Đồ may mắn",
                    tag: "Tần số tương hợp",
                    icon: "./assets/icons/sparkle.svg",
                    val: `${yongObj.numbers} • ${xiObj.numbers}`,
                    sub: "Ứng dụng khi chọn số tầng, số phòng hoặc các mốc thời gian khởi sự quan trọng.",
                },
                {
                    label: "Lĩnh vực & Thói quen vượng khí",
                    tag: "Ứng dụng đời sống",
                    icon: "./assets/icons/fengshui/tai-than.svg",
                    val: yongObj.career,
                    sub: `Chủ động kết nối với đối tác hoặc quý nhân có bản mệnh vượng ${yongObj.name} và ${xiObj.name}.`,
                },
            ];

            remedyGridEl.innerHTML = remedies
                .map(
                    (r) => `
                        <article class="bazi-remedy-box">
                            <img src="${r.icon}" alt="" aria-hidden="true" class="bazi-remedy-box__watermark" />
                            <div class="bazi-remedy-box__head">
                                <div class="bazi-remedy-box__title-wrap">
                                    <span class="bazi-remedy-box__icon-wrap">
                                        <img src="${r.icon}" alt="" aria-hidden="true" />
                                    </span>
                                    <span class="bazi-remedy-box__label">${r.label}</span>
                                </div>
                                <span class="bazi-remedy-box__tag">${r.tag}</span>
                            </div>
                            <strong class="bazi-remedy-box__val">${r.val}</strong>
                            <p class="bazi-remedy-box__sub">${r.sub}</p>
                        </article>
                    `,
                )
                .join("");
        }

        // 4. Render 8 Đại Vận theo Bố cục Bento Sole 3 - 4 - 1 + Icon 12 Con Giáp & Watermark
        setText(
            "bazi-luck-direction-note",
            `Mệnh ${genderText} — Đại Vận khởi từ Trụ Tháng (${pillars[1].canchi}), mỗi đại vận cai quản 10 năm cuộc đời.`,
        );

        const luckGridEl = document.getElementById("bazi-luck-grid");
        if (luckGridEl) {
            luckGridEl.innerHTML = luckCycles8
                .map((lk, idx) => {
                    const isLastWide = idx === 7;
                    const zodiacImgPath = `./assets/icons/zodiac/${lk.branchObj.zodiac}`;

                    if (isLastWide) {
                        return `
                            <article
                                class="bazi-luck-card bazi-luck-card--wide ${lk.isCurrentLuck ? "is-current-luck" : ""} has-bento-tooltip"
                                data-bazi-modal="luck"
                                data-luck-idx="${idx}"
                            >
                                <span class="bazi-luck-card__bg-wrap" aria-hidden="true">
                                    <img src="${zodiacImgPath}" alt="" class="bazi-luck-card__watermark" />
                                </span>

                                <div class="bazi-luck-card__wide-left">
                                    <div class="bazi-luck-card__top">
                                        <span class="bazi-luck-card__step">Đại Vận ${lk.step} • Hậu Vận Viên Mãn</span>
                                        <span class="bazi-luck-card__ages">${lk.ageRange} (${lk.yearRange})</span>
                                    </div>

                                    <div class="bazi-luck-card__mid">
                                        <span class="bazi-luck-card__zodiac-box">
                                            <img src="${zodiacImgPath}" alt="" aria-hidden="true" />
                                        </span>
                                        <div class="bazi-luck-card__canchi-group">
                                            <strong class="bazi-luck-card__canchi">${lk.canchi}</strong>
                                            <span class="bazi-luck-card__tengod">Sao chủ vận: ${lk.tenGod}</span>
                                        </div>
                                    </div>

                                    <div class="bazi-luck-card__foot">
                                        <span class="bazi-luck-card__napam">Nạp âm: ${lk.napAm}</span>
                                        <span class="bazi-luck-card__stage">Vận: ${lk.lifeStage}</span>
                                    </div>
                                </div>

                                <div class="bazi-luck-card__wide-right">
                                    <strong>Tổng kết Hậu Vận &amp; Lời khuyên Dưỡng Sinh</strong>
                                    <p>
                                        Giai đoạn ${lk.ageRange} đi qua đại vận <b>${lk.canchi}</b> (${lk.napAm}), sao chủ đạo là <b>${lk.tenGod}</b>. Đây là thời kỳ thu hoạch phúc đức, an hưởng gia đạo và truyền trao kinh nghiệm cho thế hệ kế thừa.
                                    </p>
                                </div>

                                ${buildBentoTooltipHtml(
                                    `Đại Vận ${lk.step}: ${lk.canchi} (${lk.yearRange})`,
                                    `Giai đoạn ${lk.ageRange}. Sao chủ vận: ${lk.tenGod}, Nạp âm ${lk.napAm}, Vòng trường sinh: ${lk.lifeStage}.`,
                                    `✦ Bấm để xem chi tiết Đại Vận ${lk.canchi}`,
                                )}
                            </article>
                        `;
                    }

                    return `
                        <article
                            class="bazi-luck-card ${lk.isCurrentLuck ? "is-current-luck" : ""} has-bento-tooltip"
                            data-bazi-modal="luck"
                            data-luck-idx="${idx}"
                        >
                            <span class="bazi-luck-card__bg-wrap" aria-hidden="true">
                                <img src="${zodiacImgPath}" alt="" class="bazi-luck-card__watermark" />
                            </span>

                            <div class="bazi-luck-card__top">
                                <span class="bazi-luck-card__step">Đại Vận ${lk.step}</span>
                                <span class="bazi-luck-card__ages">${lk.ageRange}</span>
                            </div>

                            <div class="bazi-luck-card__mid">
                                <span class="bazi-luck-card__zodiac-box">
                                    <img src="${zodiacImgPath}" alt="" aria-hidden="true" />
                                </span>
                                <div class="bazi-luck-card__canchi-group">
                                    <strong class="bazi-luck-card__canchi">${lk.canchi}</strong>
                                    <span class="bazi-luck-card__tengod">${lk.tenGod}</span>
                                </div>
                            </div>

                            <div class="bazi-luck-card__foot">
                                <span class="bazi-luck-card__napam">${lk.napAm}</span>
                                <span class="bazi-luck-card__stage">${lk.lifeStage}</span>
                            </div>

                            ${buildBentoTooltipHtml(
                                `Đại Vận ${lk.step}: ${lk.canchi} (${lk.yearRange})`,
                                `Giai đoạn ${lk.ageRange}. Sao chủ vận: ${lk.tenGod}, Nạp âm ${lk.napAm}, Vòng trường sinh: ${lk.lifeStage}.`,
                                `✦ Bấm để xem chi tiết Đại Vận ${lk.canchi}`,
                            )}
                        </article>
                    `;
                })
                .join("");
        }
    };

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

        visualEl?.classList.remove("is-zodiac-filtered");

        if (modalType === "pillar") {
            const pIdx = Number(triggerEl.dataset.pillarIdx || 0);
            const p = currentBaziChart.pillars[pIdx];
            if (!p) return;

            if (catEl) catEl.textContent = p.fullTitle;
            if (titleEl) titleEl.textContent = `${p.canchi} • ${p.napAm}`;
            visualEl?.classList.add("is-zodiac-filtered");
            if (visualEl) {
                visualEl.innerHTML = `
                    <img src="./assets/icons/zodiac/${p.branchObj.zodiac}" alt="" />
                    <strong>Linh vật ${p.branchObj.animal} (${p.branchObj.name})</strong>
                `;
            }
            if (pillsEl) {
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">Thập Thần: ${p.tenGod}</span>
                    <span class="day-term-modal__pill">Trường sinh: ${p.lifeStage}</span>
                    <span class="day-term-modal__pill">Nạp âm: ${p.napAm}</span>
                `;
            }
            if (descEl) {
                descEl.textContent = `${p.fullTitle} (${p.subRole}) gồm Thiên Can ${p.stemObj.name} (${p.stemObj.vnElem}) kết hợp Địa Chi ${p.branchObj.name} (${p.branchObj.vnElem}). ${TEN_GODS_DESC[p.tenGod] || ""}`;
            }
            const hiddenSummary = p.hiddenDetails.map((h) => `${h.stemName} (${h.tenGod})`).join(", ");
            if (adviceEl) {
                adviceEl.textContent = `Bên trong Địa Chi ${p.branchObj.name} tàng ẩn các Thiên Can: ${hiddenSummary}. Trạng thái năng lượng trên Vòng Trường Sinh đạt ngưỡng "${p.lifeStage}".`;
            }
        } else if (modalType === "god") {
            const role = triggerEl.dataset.godRole || "Dụng Thần";
            const elemKey = triggerEl.dataset.godKey || "earth";
            const info = ELEMENT_INFO_MAP[elemKey];

            if (catEl) catEl.textContent = "Phân Tích Dụng Thần & Cải Vận";
            if (titleEl) titleEl.textContent = `${role} • ${info.name}`;
            if (visualEl) {
                visualEl.innerHTML = `
                    <img src="./assets/icons/${info.icon}" alt="" />
                    <strong>${info.name}</strong>
                `;
            }
            if (pillsEl) {
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">${currentBaziChart.strengthState}</span>
                    <span class="day-term-modal__pill">Hướng: ${info.directions}</span>
                    <span class="day-term-modal__pill">${info.numbers}</span>
                `;
            }
            if (descEl) descEl.textContent = currentBaziChart.strengthAdvice;
            if (adviceEl) {
                adviceEl.textContent = `Ứng dụng ${info.name}: Ưu tiên màu sắc (${info.colors}), phương hướng (${info.directions}) và các ngành nghề/hoạt động gắn với ${info.career}.`;
            }
        } else if (modalType === "luck") {
            const lIdx = Number(triggerEl.dataset.luckIdx || 0);
            const lk = currentBaziChart.luckCycles8[lIdx];
            if (!lk) return;

            if (catEl) catEl.textContent = `Chu Kỳ Đại Vận 10 Năm (Đại Vận ${lk.step})`;
            if (titleEl) titleEl.textContent = `Đại Vận ${lk.canchi} (${lk.ageRange})`;
            visualEl?.classList.add("is-zodiac-filtered");
            if (visualEl) {
                visualEl.innerHTML = `
                    <img src="./assets/icons/zodiac/${lk.branchObj.zodiac}" alt="" />
                    <strong>${lk.yearRange}</strong>
                `;
            }
            if (pillsEl) {
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">Sao chủ vận: ${lk.tenGod}</span>
                    <span class="day-term-modal__pill">Nạp âm: ${lk.napAm}</span>
                    <span class="day-term-modal__pill">Vận: ${lk.lifeStage}</span>
                `;
            }
            if (descEl) {
                descEl.textContent = `Trong 10 năm từ ${lk.ageRange} (${lk.yearRange}), đại vận đi qua can chi ${lk.canchi} với sao ${lk.tenGod} làm chủ đạo. ${TEN_GODS_DESC[lk.tenGod] || ""}`;
            }
            if (adviceEl) {
                adviceEl.textContent = `Giai đoạn này mang nạp âm ${lk.napAm} và khí vận ${lk.lifeStage}. Hãy kết hợp năng lượng Dụng Thần (${ELEMENT_INFO_MAP[currentBaziChart.yongShinKey].name}) để tối ưu hóa quyết định sự nghiệp và tài chính.`;
            }
        }

        modal.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const initBaziPage = () => {
        const mainEl = document.getElementById("main");
        if (!mainEl || !window.LunarEngine) return;
        if (mainEl.dataset.baziBound === "true") return;
        mainEl.dataset.baziBound = "true";

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
            const brIdx = window.LunarEngine.getBranchIndexFromHour(now.getHours());
            selectedHourKey = BRANCH_META[brIdx]?.key || "hoi";
        }

        if (hourParam && BRANCH_META.some((b) => b.key === hourParam)) {
            selectedHourKey = hourParam;
        }
        if (genderParam === "female" || genderParam === "male") {
            selectedGender = genderParam;
        }

        yearGridStart = Math.floor(selectedYear / 12) * 12 - 8;
        renderCustomBaziPickers();

        // Đồng bộ đóng/mở giữa 5 Custom Bento Dropdowns
        const allDropdowns = Array.from(mainEl.querySelectorAll(".bazi-picker"));
        allDropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    allDropdowns.forEach((other) => {
                        if (other !== current) other.removeAttribute("open");
                    });
                }
            };
        });

        document.getElementById("bazi-day-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-bazi-day]");
            if (!btn) return;
            e.stopPropagation();
            selectedDay = Number(btn.dataset.baziDay);
            document.getElementById("bazi-day-dropdown")?.removeAttribute("open");
            renderCustomBaziPickers();
            renderBaziPage();
        });

        document.getElementById("bazi-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-bazi-month]");
            if (!btn) return;
            e.stopPropagation();
            selectedMonth = Number(btn.dataset.baziMonth);
            document.getElementById("bazi-month-dropdown")?.removeAttribute("open");
            renderCustomBaziPickers();
            renderBaziPage();
        });

        document.getElementById("bazi-year-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-bazi-year]");
            if (!btn) return;
            e.stopPropagation();
            selectedYear = Number(btn.dataset.baziYear);
            document.getElementById("bazi-year-dropdown")?.removeAttribute("open");
            renderCustomBaziPickers();
            renderBaziPage();
        });

        document.getElementById("bazi-year-prev-range")?.addEventListener("click", (e) => {
            e.stopPropagation();
            yearGridStart -= 12;
            renderCustomBaziPickers();
        });

        document.getElementById("bazi-year-next-range")?.addEventListener("click", (e) => {
            e.stopPropagation();
            yearGridStart += 12;
            renderCustomBaziPickers();
        });

        document.getElementById("bazi-hour-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-bazi-hour]");
            if (!btn) return;
            e.stopPropagation();
            selectedHourKey = btn.dataset.baziHour || "hoi";
            document.getElementById("bazi-hour-dropdown")?.removeAttribute("open");
            renderCustomBaziPickers();
            renderBaziPage();
        });

        document.getElementById("bazi-region-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-bazi-lon]");
            if (!btn) return;
            e.stopPropagation();
            selectedLongitude = Number(btn.dataset.baziLon) || 106.6;
            document.getElementById("bazi-region-dropdown")?.removeAttribute("open");
            renderCustomBaziPickers();
            renderBaziPage();
        });

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

        const nowBtn = document.getElementById("bazi-now-btn");
        if (nowBtn) {
            nowBtn.onclick = () => {
                const now = new Date();
                selectedYear = now.getFullYear();
                selectedMonth = now.getMonth() + 1;
                selectedDay = now.getDate();
                const brIdx = window.LunarEngine.getBranchIndexFromHour(now.getHours());
                selectedHourKey = BRANCH_META[brIdx]?.key || "hoi";
                yearGridStart = Math.floor(selectedYear / 12) * 12 - 8;
                renderCustomBaziPickers();
                renderBaziPage();
            };
        }

        const shareBtn = document.getElementById("bazi-share-btn");
        const shareLabel = document.getElementById("bazi-share-label");
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

        mainEl.addEventListener("click", (e) => {
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

        window.addEventListener("converter-jump-to-date", (e) => {
            if (e.detail) {
                selectedYear = e.detail.year;
                selectedMonth = e.detail.month;
                selectedDay = e.detail.day;
                yearGridStart = Math.floor(selectedYear / 12) * 12 - 8;
                renderCustomBaziPickers();
                renderBaziPage();
            }
        });

        renderBaziPage();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBaziPage);
    } else {
        initBaziPage();
    }
    window.addEventListener("template-loaded", initBaziPage);
})();
