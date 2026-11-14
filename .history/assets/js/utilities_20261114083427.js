// assets/js/utilities.js
// Chuyên trách Trang Tiện Ích & Bách Khoa Cổ Học (utilities.html):
// 1. 30 Nạp Âm Lục Thập Hoa Giáp | 2. 24 Tiết Khí Nông Lịch | 3. Khổng Minh Lục Diệu & Hướng Xuất Hành
// 4. 12 Trực & 28 Sao Nhị Thập Bát Tú | 5. 8 Quẻ Bát Quái & 12 Con Giáp
(() => {
    let activeTab = "napam"; // "napam" | "solarterm" | "lucdieu" | "truc-sao" | "bagua"
    let activeSubfilter = "all";
    let searchQuery = "";
    let selectedItemObj = null;

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

    const ELEMENT_HARMONY = {
        metal: {
            vn: "Hành Kim",
            icon: "./assets/icons/metal.svg",
            good: "Thủy, Thổ, Kim",
            bad: "Mộc, Hỏa",
            advice: "Thổ sinh Kim, Kim sinh Thủy. Hợp màu trắng, bạc, vàng ánh kim; phương vị Chính Tây, Tây Bắc.",
        },
        wood: {
            vn: "Hành Mộc",
            icon: "./assets/icons/wood.svg",
            good: "Hỏa, Thủy, Mộc",
            bad: "Thổ, Kim",
            advice: "Thủy sinh Mộc, Mộc sinh Hỏa. Hợp màu xanh lục bảo, xanh lá; phương vị Chính Đông, Đông Nam.",
        },
        water: {
            vn: "Hành Thủy",
            icon: "./assets/icons/water.svg",
            good: "Mộc, Kim, Thủy",
            bad: "Hỏa, Thổ",
            advice: "Kim sinh Thủy, Thủy sinh Mộc. Hợp màu xanh đại dương, đen; phương vị Chính Bắc.",
        },
        fire: {
            vn: "Hành Hỏa",
            icon: "./assets/icons/fire.svg",
            good: "Thổ, Mộc, Hỏa",
            bad: "Kim, Thủy",
            advice: "Mộc sinh Hỏa, Hỏa sinh Thổ. Hợp màu đỏ chu sa, cam ấm, tím; phương vị Chính Nam.",
        },
        earth: {
            vn: "Hành Thổ",
            icon: "./assets/icons/earth.svg",
            good: "Kim, Hỏa, Thổ",
            bad: "Thủy, Mộc",
            advice: "Hỏa sinh Thổ, Thổ sinh Kim. Hợp màu vàng đất, nâu trầm; phương vị Trung Cung, Đông Bắc, Tây Nam.",
        },
    };

    // ==================== 1. DỮ LIỆU TAB 1: 30 NẠP ÂM LỤC THẬP HOA GIÁP ====================
    const RAW_NAP_AM_30 = [
        [
            "Hải Trung Kim",
            "Giáp Tý, Ất Sửu",
            "metal",
            "Vàng dưới biển — Nội lực tiềm ẩn, sâu sắc, điềm tĩnh và bền bỉ.",
        ],
        [
            "Lư Trung Hỏa",
            "Bính Dần, Đinh Mão",
            "fire",
            "Lửa trong lò — Nhiệt huyết được tôi luyện, ấm áp và kiên định.",
        ],
        ["Đại Lâm Mộc", "Mậu Thìn, Kỷ Tỵ", "wood", "Gỗ rừng già — Vững chãi, che chở, nhân hậu và giàu sức sống."],
        ["Lộ Bàng Thổ", "Canh Ngọ, Tân Mùi", "earth", "Đất ven đường — Bằng phẳng, gắn kết giao thương và thực tế."],
        ["Kiếm Phong Kim", "Nhâm Thân, Quý Dậu", "metal", "Vàng mũi kiếm — Sắc bén, quyết đoán, bản lĩnh và mạnh mẽ."],
        ["Sơn Đầu Hỏa", "Giáp Tuất, Ất Hợi", "fire", "Lửa đầu núi — Rực rỡ, lan tỏa tầm nhìn xa và giàu cảm hứng."],
        [
            "Giản Hạ Thủy",
            "Bính Tý, Đinh Sửu",
            "water",
            "Nước dưới khe — Dòng chảy ngầm tĩnh lặng, tinh tế và linh hoạt.",
        ],
        ["Thành Đầu Thổ", "Mậu Dần, Kỷ Mão", "earth", "Đất tường thành — Bảo vệ vững chắc, kỷ luật và đáng tin cậy."],
        [
            "Bạch Lạp Kim",
            "Canh Thìn, Tân Tỵ",
            "metal",
            "Vàng chân đèn — Tinh khiết, đang trong quá trình rèn giũa thành tài.",
        ],
        [
            "Dương Liễu Mộc",
            "Nhâm Ngọ, Quý Mùi",
            "wood",
            "Gỗ cây dương liễu — Mềm mại, uyển chuyển và khéo léo ứng biến.",
        ],
        [
            "Tuyền Trung Thủy",
            "Giáp Thân, Ất Dậu",
            "water",
            "Nước trong suối — Nguồn nước mát lành, trí tuệ và dồi dào.",
        ],
        [
            "Ốc Thượng Thổ",
            "Bính Tuất, Đinh Hợi",
            "earth",
            "Đất ngói lợp nhà — Che chở, ổn định quy củ và giữ gìn gia đạo.",
        ],
        ["Tích Lịch Hỏa", "Mậu Tý, Kỷ Sửu", "fire", "Lửa sấm sét — Nguồn năng lượng bùng nổ, quyết liệt và đột phá."],
        [
            "Tùng Bách Mộc",
            "Canh Dần, Tân Mão",
            "wood",
            "Gỗ tùng bách — Bất khuất trước gió sương, trường thọ và chính trực.",
        ],
        [
            "Trường Lưu Thủy",
            "Nhâm Thìn, Quý Tỵ",
            "water",
            "Nước chảy dài — Kiên trì, vươn xa biển lớn và không ngừng vận động.",
        ],
        [
            "Sa Trung Kim",
            "Giáp Ngọ, Ất Mùi",
            "metal",
            "Vàng trong cát — Quý giá, nội tâm phong phú, cần đãi lọc để tỏa sáng.",
        ],
        [
            "Sơn Hạ Hỏa",
            "Bính Thân, Đinh Dậu",
            "fire",
            "Lửa chân núi — Ấm áp, gần gũi, thiết thực và nuôi dưỡng thực chất.",
        ],
        ["Bình Địa Mộc", "Mậu Tuất, Kỷ Hợi", "wood", "Cây đất bằng — Ôn hòa, phát triển thuận lợi và dễ kết giao."],
        [
            "Bích Thượng Thổ",
            "Canh Tý, Tân Sửu",
            "earth",
            "Đất vách tường — Điểm tựa an toàn, tỉ mỉ, chu đáo và vững vàng.",
        ],
        ["Kim Bạch Kim", "Nhâm Dần, Quý Mão", "metal", "Vàng pha bạc — Sang trọng, tinh tế, nguyên tắc và sắc sảo."],
        ["Phú Đăng Hỏa", "Giáp Thìn, Ất Tỵ", "fire", "Lửa đèn lớn — Soi sáng trí tuệ, ấm cúng gia đình và dẫn đường."],
        [
            "Thiên Hà Thủy",
            "Bính Ngọ, Đinh Mùi",
            "water",
            "Nước mưa trên trời — Thanh khiết, rộng lớn, tưới mát và nuôi dưỡng vạn vật.",
        ],
        ["Đại Trạch Thổ", "Mậu Thân, Kỷ Dậu", "earth", "Đất đầm lớn — Phì nhiêu, bao dung, tự do và giàu tiềm năng."],
        [
            "Thoa Xuyến Kim",
            "Canh Tuất, Tân Hợi",
            "metal",
            "Vàng trang sức — Quý phái, thẩm mỹ cao, khéo léo và được trân trọng.",
        ],
        [
            "Tang Đố Mộc",
            "Nhâm Tý, Quý Sửu",
            "wood",
            "Gỗ cây dâu — Hữu ích, bền bỉ, nhân từ và mang lại giá trị thiết thực.",
        ],
        [
            "Đại Khê Thủy",
            "Giáp Dần, Ất Mão",
            "water",
            "Nước khe lớn — Mạnh mẽ, khoáng đạt, nhạy bén và giàu năng lượng.",
        ],
        [
            "Sa Trung Thổ",
            "Bính Thìn, Đinh Tỵ",
            "earth",
            "Đất pha cát — Linh hoạt, thông minh, dễ thích nghi với mọi hoàn cảnh.",
        ],
        [
            "Thiên Thượng Hỏa",
            "Mậu Ngọ, Kỷ Mùi",
            "fire",
            "Lửa trên trời (Mặt trời) — Quang minh, chính đại và tràn đầy sinh lực.",
        ],
        [
            "Thạch Lựu Mộc",
            "Canh Thân, Tân Dậu",
            "wood",
            "Gỗ cây thạch lựu — Dẻo dai, kiên cường vượt khó và kết trái ngọt lành.",
        ],
        [
            "Đại Hải Thủy",
            "Nhâm Tuất, Quý Hợi",
            "water",
            "Nước biển lớn — Bao la, hùng vĩ, tầm nhìn lớn và dung nạp trăm sông.",
        ],
    ];

    const NAP_AM_ITEMS = RAW_NAP_AM_30.map(([title, pairs, groupKey, desc]) => {
        const el = ELEMENT_HARMONY[groupKey];
        return {
            slug: toSlug(title),
            tab: "napam",
            group: groupKey,
            category: "Nạp Âm Lục Thập Hoa Giáp",
            title,
            eyebrow: `Tuổi: ${pairs}`,
            badge: el.vn,
            badgeType: "normal",
            icon: el.icon,
            isFilteredIcon: false,
            desc,
            advice: `Hợp mệnh: ${el.good} • Lưu ý mệnh: ${el.bad}. ${el.advice}`,
            footNote: `Hợp: ${el.good}`,
        };
    });

    // ==================== 2. DỮ LIỆU TAB 2: 24 TIẾT KHÍ NÔNG LỊCH ====================
    const RAW_SOLAR_TERMS_24 = [
        [
            "Lập Xuân",
            "04/02 – 18/02",
            "spring",
            "term-spring.svg",
            "Khởi đầu mùa xuân — Dương khí bừng dậy, cây cối đâm chồi nảy lộc, vạn vật sinh sôi.",
            "Đại cát cho việc lập kế hoạch năm mới, xuất hành đầu xuân, trồng cây và mở rộng giao kết.",
        ],
        [
            "Vũ Thủy",
            "19/02 – 04/03",
            "spring",
            "term-rain.svg",
            "Mưa xuân — Hơi ẩm tăng dần, những cơn mưa phùn ấm áp tưới tắm cho mùa màng tươi tốt.",
            "Thuận lợi cho việc gieo trồng, học tập, bồi đắp tri thức và chăm sóc sức khỏe gan mật.",
        ],
        [
            "Kinh Trập",
            "05/03 – 20/03",
            "spring",
            "term-thunder.svg",
            "Sấm xuân thức tỉnh — Tiếng sấm đầu mùa vang lên đánh thức vạn vật sau kỳ ngủ đông.",
            "Thời điểm rất tốt để bứt phá, triển khai dự án mới và hành động quyết đoán.",
        ],
        [
            "Xuân Phân",
            "21/03 – 04/04",
            "spring",
            "term-spring-equinox.svg",
            "Giữa xuân cân bằng — Ngày và đêm dài bằng nhau, âm dương điều hòa, tiết trời ôn ấm.",
            "Rất tốt cho việc hòa giải, ký kết hợp tác đôi bên cùng có lợi và cân bằng nhịp sống.",
        ],
        [
            "Thanh Minh",
            "05/04 – 19/04",
            "spring",
            "term-spring-clear.svg",
            "Trời trong sáng — Khí trời quang đãng, mát mẻ, gắn liền với truyền thống tảo mộ, hướng về cội nguồn.",
            "Hợp đi tảo mộ, tri ân tổ tiên, du xuân ngoài trời và khởi sự việc thiện lành.",
        ],
        [
            "Cốc Vũ",
            "20/04 – 04/05",
            "spring",
            "term-grain-rain.svg",
            "Mưa rào nuôi ngũ cốc — Lượng mưa dồi dào giúp lúa màu và cây trồng phát triển vượt bậc.",
            "Thuận lợi cho việc tích lũy tài chính, đầu tư dài hạn và chăm sóc gia đình.",
        ],
        [
            "Lập Hạ",
            "05/05 – 20/05",
            "summer",
            "term-summer-sun.svg",
            "Bắt đầu mùa hạ — Nắng vàng rực rỡ, nhiệt độ tăng cao, vạn vật bước vào kỳ trưởng thành mạnh mẽ.",
            "Hợp đẩy mạnh kinh doanh, quảng bá thương hiệu và giữ tâm thái bình hòa dưới nắng nóng.",
        ],
        [
            "Tiểu Mãn",
            "21/05 – 05/06",
            "summer",
            "term-grain.svg",
            "Lúa trổ đòng chắc hạt — Hạt ngũ cốc bắt đầu căng mẩy, báo hiệu mùa màng sắp thu hoạch.",
            "Nên kiên trì hoàn thiện các công việc đang dang dở để chuẩn bị gặt hái thành quả.",
        ],
        [
            "Mang Chủng",
            "06/06 – 20/06",
            "summer",
            "term-grain-ear.svg",
            "Lúa chín có râu — Thời điểm thu hoạch vụ chiêm và gieo cấy vụ mùa nhộn nhịp.",
            "Rất tốt cho việc thu hồi công nợ, chốt doanh số và tái đầu tư xoay vòng vốn.",
        ],
        [
            "Hạ Chí",
            "21/06 – 06/07",
            "summer",
            "term-summer-solstice.svg",
            "Đỉnh điểm mùa hạ — Ngày dài nhất trong năm, dương khí đạt cực thịnh.",
            "Nên uống nhiều nước mát, nghỉ trưa hợp lý và tránh làm việc quá sức ngoài trời nắng gắt.",
        ],
        [
            "Tiểu Thử",
            "07/07 – 22/07",
            "summer",
            "term-summer-minor-heat.svg",
            "Nóng nhẹ — Khí trời oi bức bắt đầu lan tỏa kèm theo những cơn mưa dông mùa hạ.",
            "Hợp làm việc nơi thoáng mát, kiểm soát cảm xúc và giữ gìn sức khỏe tim mạch.",
        ],
        [
            "Đại Thử",
            "23/07 – 06/08",
            "summer",
            "term-summer-major-heat.svg",
            "Nóng oi ả cực độ — Giai đoạn nhiệt độ cao nhất trong năm, năng lượng Hỏa vượng.",
            "Thích hợp dưỡng tâm, ăn thực phẩm thanh nhiệt và cẩn trọng phòng chống cháy nổ.",
        ],
        [
            "Lập Thu",
            "07/08 – 22/08",
            "autumn",
            "term-autumn-wind.svg",
            "Khởi đầu mùa thu — Gió heo may chớm về, bầu trời cao trong và dịu mát dần.",
            "Thời điểm lý tưởng để hoạch định mục tiêu nửa cuối năm, khai trương và thu hoạch.",
        ],
        [
            "Xử Thử",
            "23/08 – 07/09",
            "autumn",
            "term-autumn-cool.svg",
            "Dứt nắng nóng (Mưa ngâu) — Cái oi bức mùa hè chấm dứt, nhường chỗ cho tiết trời thu mát mẻ.",
            "Rất tốt cho việc nghỉ ngơi phục hồi sức lực, gắn kết gia đình và sắp xếp lại công việc.",
        ],
        [
            "Bạch Lộ",
            "08/09 – 22/09",
            "autumn",
            "term-dew.svg",
            "Sương trắng — Đêm về se lạnh khiến hơi nước ngưng tụ thành những giọt sương trắng trên lá.",
            "Nên giữ ấm khi sáng sớm, thuận lợi cho việc học hành, thi cử và sáng tạo.",
        ],
        [
            "Thu Phân",
            "23/09 – 07/10",
            "autumn",
            "term-autumn-day-night.svg",
            "Giữa thu cân bằng — Thời lượng ngày và đêm bằng nhau, tiết trời thu trong trẻo nhất trong năm.",
            "Đại lợi cho việc hội họp, đoàn viên, ký kết giao ước và thưởng ngoạn mùa thu.",
        ],
        [
            "Hàn Lộ",
            "08/10 – 22/10",
            "autumn",
            "term-cold-dew.svg",
            "Sương lạnh — Khí trời chuyển lạnh sâu hơn, sương đêm ngưng tụ dày và lạnh buốt trên cây cỏ.",
            "Hợp thu vén tài sản, củng cố nội lực và chăm sóc hệ hô hấp khi giao mùa.",
        ],
        [
            "Sương Giáng",
            "23/10 – 06/11",
            "autumn",
            "term-frost.svg",
            "Sương mù & Giá lạnh — Tiết khí cuối cùng của mùa thu trước khi bước sang mùa đông.",
            "Nên hoàn tất các kế hoạch mùa thu, chuẩn bị tích trữ nguồn lực cho mùa đông.",
        ],
        [
            "Lập Đông",
            "07/11 – 21/11",
            "winter",
            "term-winter-snow.svg",
            "Bắt đầu mùa đông — Gió mùa đông bắc tràn về, vạn vật thu mình tích trữ năng lượng.",
            "Rất tốt cho việc bồi bổ sức khỏe, cất trữ tài sản và sum họp gia đình ấm cúng.",
        ],
        [
            "Tiểu Tuyết",
            "22/11 – 06/12",
            "winter",
            "term-winter-minor-snow.svg",
            "Tuyết nhẹ / Rét đầu đông — Nhiệt độ giảm thấp, không khí khô lạnh rõ rệt.",
            "Thích hợp nghiên cứu chuyên sâu, làm việc nội bộ và giữ ấm cơ thể.",
        ],
        [
            "Đại Tuyết",
            "07/12 – 21/12",
            "winter",
            "term-winter-major-snow.svg",
            "Tuyết dày / Rét đậm — Hàn khí bao phủ mạnh mẽ, đêm dài ngày ngắn.",
            "Nên hạn chế đi xa mạo hiểm, ưu tiên củng cố tài chính và chăm sóc người thân.",
        ],
        [
            "Đông Chí",
            "22/12 – 04/01",
            "winter",
            "term-winter-solstice.svg",
            "Giữa đông — Ngày ngắn nhất và đêm dài nhất trong năm; từ sau Đông Chí dương khí bắt đầu hồi sinh.",
            "Thời điểm cát lành để cầu phúc, đoàn viên và chuẩn bị đón vận hội mới.",
        ],
        [
            "Tiểu Hàn",
            "05/01 – 19/01",
            "winter",
            "term-winter-minor-cold.svg",
            "Chớm lạnh — Khí trời bắt đầu rét đậm, chuẩn bị bước vào giai đoạn lạnh nhất cuối năm.",
            "Nên giữ ấm cơ thể, bồi bổ dinh dưỡng và hoàn tất các kế hoạch cuối năm.",
        ],
        [
            "Đại Hàn",
            "20/01 – 03/02",
            "winter",
            "term-winter-major-cold.svg",
            "Rét cực điểm — Tiết khí cuối cùng của năm âm lịch, hàn khí đạt đỉnh trước khi mầm xuân trỗi dậy.",
            "Thích hợp tổng kết năm cũ, dọn dẹp nhà cửa đón Tết và giữ ấm vùng cổ, bàn chân.",
        ],
    ];

    const SEASON_LABELS = {
        spring: "Mùa Xuân • Hành Mộc",
        summer: "Mùa Hạ • Hành Hỏa",
        autumn: "Mùa Thu • Hành Kim",
        winter: "Mùa Đông • Hành Thủy",
    };

    const SOLAR_TERM_ITEMS = RAW_SOLAR_TERMS_24.map(([name, range, seasonKey, iconFile, desc, advice]) => ({
        slug: toSlug(name),
        tab: "solarterm",
        group: seasonKey,
        category: "Nhị Thập Tứ Tiết Khí",
        title: `Tiết ${name}`,
        eyebrow: `Khoảng ngày: ${range} DL`,
        badge: SEASON_LABELS[seasonKey],
        badgeType: "normal",
        icon: `./assets/icons/weather/${iconFile}`,
        isFilteredIcon: true,
        desc,
        advice,
        footNote: `Chu kỳ: ${range}`,
    }));

    // ==================== 3. DỮ LIỆU TAB 3: KHỔNG MINH LỤC DIỆU & HƯỚNG XUẤT HÀNH ====================
    const LUC_DIEU_DIRECTION_ITEMS = [
        {
            slug: "dai-an",
            tab: "lucdieu",
            group: "lucdieu",
            category: "Khổng Minh Lục Diệu",
            title: "Cung Đại An",
            eyebrow: "Cát Tinh • Tốt cho mọi việc",
            badge: "Đại Cát (Tốt)",
            badgeType: "good",
            icon: "./assets/icons/fengshui/lucdieu-daian.svg",
            isFilteredIcon: true,
            desc: "Đại An mang ý nghĩa bình an, vững chãi và cát khánh. Mọi việc tiến hành trong ngày/giờ Đại An đều êm xuôi, nhà cửa yên lành.",
            advice: "Rất hợp để khởi sự việc quan trọng, ký kết hợp đồng, động thổ, xuất hành theo hướng Tây Nam hoặc cầu bình an cho gia đạo.",
            footNote: "Khổng Minh Lục Diệu",
        },
        {
            slug: "luu-nien",
            tab: "lucdieu",
            group: "lucdieu",
            category: "Khổng Minh Lục Diệu",
            title: "Cung Lưu Niên",
            eyebrow: "Bình / Hung • Dễ chậm trễ",
            badge: "Thận Trọng",
            badgeType: "bad",
            icon: "./assets/icons/fengshui/lucdieu-luunien.svg",
            isFilteredIcon: true,
            desc: "Lưu Niên tượng trưng cho dòng thời gian chững lại; mưu sự dễ gặp dây dưa, cầu tài lộc chưa thông suốt ngay tức thì.",
            advice: "Nên ưu tiên xử lý các công việc tồn đọng, rà soát kỹ hồ sơ pháp lý và tránh vội vàng ra quyết định đầu tư lớn.",
            footNote: "Khổng Minh Lục Diệu",
        },
        {
            slug: "toc-hy",
            tab: "lucdieu",
            group: "lucdieu",
            category: "Khổng Minh Lục Diệu",
            title: "Cung Tốc Hỷ",
            eyebrow: "Cát Tinh • Tin vui đến nhanh",
            badge: "Cát Lành (Tốt)",
            badgeType: "good",
            icon: "./assets/icons/fengshui/lucdieu-tochy.svg",
            isFilteredIcon: true,
            desc: "Tốc Hỷ là ngôi sao của niềm vui bất ngờ và vận may đến nhanh chóng, đặc biệt vượng khí vào các khung giờ buổi sáng.",
            advice: "Thời điểm vàng để thương thảo hợp đồng, khai trương, ra mắt sản phẩm, cưới hỏi hoặc kết nối quý nhân hướng Chính Nam.",
            footNote: "Khổng Minh Lục Diệu",
        },
        {
            slug: "xich-khau",
            tab: "lucdieu",
            group: "lucdieu",
            category: "Khổng Minh Lục Diệu",
            title: "Cung Xích Khẩu",
            eyebrow: "Hung Tinh • Đề phòng khẩu thiệt",
            badge: "Hung (Cần tránh)",
            badgeType: "bad",
            icon: "./assets/icons/fengshui/lucdieu-xichkhau.svg",
            isFilteredIcon: true,
            desc: "Xích Khẩu chủ về lời ăn tiếng nói dễ nảy sinh bất đồng, tranh luận hoặc hiểu lầm trong giao dịch.",
            advice: "Giữ thái độ hòa nhã, lắng nghe nhiều hơn trong các cuộc họp và đọc kỹ các điều khoản hợp đồng trước khi đặt bút ký.",
            footNote: "Khổng Minh Lục Diệu",
        },
        {
            slug: "tieu-cat",
            tab: "lucdieu",
            group: "lucdieu",
            category: "Khổng Minh Lục Diệu",
            title: "Cung Tiểu Cát",
            eyebrow: "Cát Tinh • Quý nhân phù trợ",
            badge: "Cát Lành (Tốt)",
            badgeType: "good",
            icon: "./assets/icons/fengshui/lucdieu-tieucat.svg",
            isFilteredIcon: true,
            desc: "Tiểu Cát mang năng lượng hòa hợp, may mắn dịu nhẹ nhưng bền bỉ, mưu sự suôn sẻ và rất dễ gặp người giúp đỡ.",
            advice: "Thuận lợi cho việc mở hàng, giao dịch tài chính, cầu tài hướng Tây Nam và vun đắp các mối quan hệ đối tác.",
            footNote: "Khổng Minh Lục Diệu",
        },
        {
            slug: "khong-vong",
            tab: "lucdieu",
            group: "lucdieu",
            category: "Khổng Minh Lục Diệu",
            title: "Cung Không Vong",
            eyebrow: "Hung Tinh • Tránh việc đại sự",
            badge: "Hung (Cần tránh)",
            badgeType: "bad",
            icon: "./assets/icons/fengshui/lucdieu-khongvong.svg",
            isFilteredIcon: true,
            desc: "Không Vong tượng trưng cho sự hao hụt hoặc chưa tụ khí; cầu tài hay xuất hành lớn dễ tốn công sức mà kết quả chưa như ý.",
            advice: "Thích hợp để nghỉ ngơi tĩnh dưỡng, học tập nghiên cứu, lập kế hoạch nội bộ hoặc làm việc thiện nguyện tích phúc.",
            footNote: "Khổng Minh Lục Diệu",
        },
        {
            slug: "hy-than",
            tab: "lucdieu",
            group: "direction",
            category: "Phương Vị Xuất Hành",
            title: "Hỷ Thần (Cát Thần)",
            eyebrow: "Chủ quản niềm vui & Nhân duyên",
            badge: "Hướng Đại Lợi",
            badgeType: "good",
            icon: "./assets/icons/fengshui/hy-than.svg",
            isFilteredIcon: true,
            desc: "Hỷ Thần là vị thần mang lại tin vui, hỷ sự, may mắn và nhân duyên tốt đẹp, vị trí thay đổi theo Thiên Can của từng ngày.",
            advice: "Xuất hành theo hướng Hỷ Thần đại lợi cho việc cưới hỏi, đính hôn, gặp gỡ đối tác, dự tiệc mừng hoặc đón khách quý.",
            footNote: "Tra theo Thiên Can Ngày",
        },
        {
            slug: "tai-than",
            tab: "lucdieu",
            group: "direction",
            category: "Phương Vị Xuất Hành",
            title: "Tài Thần (Cát Thần)",
            eyebrow: "Chủ quản tài lộc & Thương mại",
            badge: "Hướng Cầu Tài",
            badgeType: "good",
            icon: "./assets/icons/fengshui/tai-than.svg",
            isFilteredIcon: true,
            desc: "Tài Thần là vị thần cai quản tiền bạc, tài lộc và sự hưng thịnh trong kinh doanh buôn bán.",
            advice: "Khi mở hàng, khai trương, xuất hành đầu năm hay đi ký kết hợp đồng thương mại, hãy ưu tiên bước đi về phương Tài Thần.",
            footNote: "Tra theo Thiên Can Ngày",
        },
        {
            slug: "hac-than",
            tab: "lucdieu",
            group: "direction",
            category: "Phương Vị Xuất Hành",
            title: "Hạc Thần (Hung Thần)",
            eyebrow: "Phương vị xấu cần tránh",
            badge: "Hướng Cần Tránh",
            badgeType: "bad",
            icon: "./assets/icons/fengshui/hac-than.svg",
            isFilteredIcon: true,
            desc: "Hạc Thần là phương vị hung sát dịch chuyển theo chu kỳ Lục Thập Hoa Giáp trên bầu trời.",
            advice: "Khi xuất hành đi xa hoặc tiến hành việc trọng đại, nên tránh đi thẳng về hướng Hạc Thần mà chọn hướng Tài Thần hoặc Hỷ Thần.",
            footNote: "Tra theo Hoa Giáp Ngày",
        },
    ];

    // ==================== 4. DỮ LIỆU TAB 4: 12 TRỰC & NHỊ THẬP BÁT TÚ ====================
    const RAW_TRUC_12 = [
        [
            "Trực Kiến",
            "good",
            "Đứng đầu 12 Trực, tượng trưng cho sức sống mới bắt đầu nảy nở.",
            "Tốt cho xuất hành, khai trương, giá thú, nhậm chức; kỵ động thổ, đào đất.",
        ],
        [
            "Trực Trừ",
            "good",
            "Tượng trưng cho việc tẩy rửa, loại bỏ cái cũ để đón điều mới tốt lành.",
            "Tốt cho cầu an, dọn dẹp, giải trừ điều xấu, khám chữa bệnh; kỵ đi xa.",
        ],
        [
            "Trực Mãn",
            "good",
            "Tượng trưng cho sự đầy đủ, viên mãn và sung túc.",
            "Tốt cho tế tự, cầu tài, khai trương, sửa kho; kỵ động thổ, kiện tụng.",
        ],
        [
            "Trực Bình",
            "good",
            "Tượng trưng cho sự cân bằng, ổn định và hài hòa.",
            "Tốt cho tu tạo, sửa chữa, nhập trạch, cưới gả, giao dịch thương mại.",
        ],
        [
            "Trực Định",
            "good",
            "Tượng trưng cho sự vững chắc, cố định lâu dài.",
            "Tốt cho ký kết, thương lượng, cầu danh, nhập học; kỵ thưa kiện, đi xa.",
        ],
        [
            "Trực Chấp",
            "normal",
            "Tượng trưng cho sự nắm giữ, bảo toàn và duy trì kỷ cương.",
            "Tốt cho xây dựng, tu bổ, tuyển dụng, tế tự; kỵ xuất hành xa, mở kho.",
        ],
        [
            "Trực Phá",
            "bad",
            "Tượng trưng cho sự công phá, tháo dỡ những cấu trúc cũ kỹ.",
            "Chỉ hợp dỡ bỏ nhà cũ, chữa bệnh, giải hạn; kỵ khai trương, cưới hỏi.",
        ],
        [
            "Trực Nguy",
            "bad",
            "Tượng trưng cho sự chênh vênh, cần hết sức cẩn trọng.",
            "Nên cầu phúc, tế tự, tu dưỡng nghỉ ngơi; kỵ khai trương, xuất hành xa.",
        ],
        [
            "Trực Thành",
            "good",
            "Tượng trưng cho sự thành tựu, kết quả viên mãn.",
            "Đại lợi cho khai trương, nhập học, cưới gả, dọn nhà mới, ký hợp đồng.",
        ],
        [
            "Trực Thu",
            "normal",
            "Tượng trưng cho sự thu hoạch, cất giữ thành quả.",
            "Tốt cho thu hoạch, cất trữ, mua tài sản; kỵ an táng, khởi công lớn.",
        ],
        [
            "Trực Khai",
            "good",
            "Tượng trưng cho sự mở mang, thông suốt và hanh thông.",
            "Đại cát cho khai trương, động thổ, cưới hỏi, xuất hành, nhậm chức.",
        ],
        [
            "Trực Bế",
            "bad",
            "Tượng trưng cho sự khép lại, tích lũy và đóng kín.",
            "Hợp đắp đê, lấp lỗ, sửa kho, tu dưỡng; kỵ khai trương, xuất hành.",
        ],
    ];

    const RAW_STARS_28 = [
        [
            "Sao Giác (Mộc Giao)",
            "Đông Phương Thanh Long",
            "good",
            "Cát tinh chủ về công danh, học vấn và thi cử đỗ đạt. Rất tốt cho xây dựng, cưới hỏi, nhập học.",
        ],
        [
            "Sao Cang (Kim Long)",
            "Đông Phương Thanh Long",
            "bad",
            "Chủ về sự cứng cỏi; nên cẩn trọng khi cưới gả, khởi công lớn hoặc đi thuyền.",
        ],
        [
            "Sao Đê (Thổ Lạc)",
            "Đông Phương Thanh Long",
            "bad",
            "Không lợi cho việc khởi tạo mới, cưới hỏi hoặc xuất hành đường thủy.",
        ],
        [
            "Sao Phòng (Nhật Thố)",
            "Đông Phương Thanh Long",
            "good",
            "Đại cát tinh (Thiên mã) — Tốt cho mọi việc: khai trương, cưới hỏi, động thổ, nhập trạch.",
        ],
        [
            "Sao Tâm (Nguyệt Hồ)",
            "Đông Phương Thanh Long",
            "bad",
            "Hung tinh — Kỵ xây cất, cưới gả, kiện tụng; chỉ hợp việc tế tự, cầu an.",
        ],
        [
            "Sao Vĩ (Hỏa Hổ)",
            "Đông Phương Thanh Long",
            "good",
            "Cát tinh — Rất tốt cho việc cầu tài, khai trương, cưới hỏi và xây dựng.",
        ],
        [
            "Sao Cơ (Thủy Báo)",
            "Đông Phương Thanh Long",
            "good",
            "Cát tinh — Đại lợi cho việc khởi công tạo tác, thu nạp tài lộc, mở cửa hiệu.",
        ],
        [
            "Sao Đẩu (Mộc Giải)",
            "Bắc Phương Huyền Vũ",
            "good",
            "Cát tinh — Thuận lợi cho việc động thổ, trổ cửa, cầu tài lộc và xuất hành.",
        ],
        [
            "Sao Ngưu (Kim Ngưu)",
            "Bắc Phương Huyền Vũ",
            "bad",
            "Không thuận cho việc cưới hỏi, đi xa; chỉ hợp tu sửa nhỏ trong nhà.",
        ],
        [
            "Sao Nữ (Thổ蝠)",
            "Bắc Phương Huyền Vũ",
            "bad",
            "Nên tránh khởi sự việc lớn, tranh chấp; hợp học nghệ, may mặc.",
        ],
        [
            "Sao Hư (Nhật Thử)",
            "Bắc Phương Huyền Vũ",
            "bad",
            "Không lợi cho việc xây cất hay mở hàng; hợp tĩnh dưỡng, cầu phúc.",
        ],
        [
            "Sao Nguy (Nguyệt Yến)",
            "Bắc Phương Huyền Vũ",
            "bad",
            "Cần thận trọng khi làm việc trên cao hoặc đi xa; hợp an sàng, tế tự.",
        ],
        [
            "Sao Thất (Hỏa Trư)",
            "Bắc Phương Huyền Vũ",
            "good",
            "Cát tinh — Rất tốt cho việc xây dựng nhà cửa, cưới hỏi, khai trương, cầu tài.",
        ],
        [
            "Sao Bích (Thủy Dư)",
            "Bắc Phương Huyền Vũ",
            "good",
            "Đại cát tinh — Khởi công trăm việc đều tốt, vượng tài lộc và quý nhân.",
        ],
        [
            "Sao Khuê (Mộc Lang)",
            "Tây Phương Bạch Hổ",
            "normal",
            "Chủ về văn chương học thuật; tốt cho nhập học, cầu danh, sửa sang nhà cửa.",
        ],
        [
            "Sao Lâu (Kim Cẩu)",
            "Tây Phương Bạch Hổ",
            "good",
            "Cát tinh — Thuận lợi cho việc cưới gả, xây dựng, giao thương và cầu tài.",
        ],
        [
            "Sao Vị (Thổ Trĩ)",
            "Tây Phương Bạch Hổ",
            "good",
            "Cát tinh — Tốt cho việc tích trữ tài sản, khai trương, cưới hỏi và động thổ.",
        ],
        [
            "Sao Mão (Nhật Kê)",
            "Tây Phương Bạch Hổ",
            "bad",
            "Kỵ việc khởi công xây dựng, cưới hỏi hoặc mở kho xuất hàng.",
        ],
        [
            "Sao Tất (Nguyệt Ô)",
            "Tây Phương Bạch Hổ",
            "good",
            "Đại cát tinh — Rất tốt cho nông nghiệp, xây dựng, cưới gả, khai trương, xuất hành.",
        ],
        [
            "Sao Chủy (Hỏa Hầu)",
            "Tây Phương Bạch Hổ",
            "bad",
            "Hung tinh — Xây dựng, chôn cất, đi xa, cưới gả đều không tốt; nên giữ mình thận trọng.",
        ],
        [
            "Sao Sâm (Thủy Viên)",
            "Tây Phương Bạch Hổ",
            "good",
            "Cát tinh — Khởi công tạo tác nhiều việc tốt lành: xây cất nhà, trổ cửa, nhập học, đi thuyền.",
        ],
        [
            "Sao Tỉnh (Mộc Hãn)",
            "Nam Phương Chu Tước",
            "good",
            "Cát tinh — Thuận lợi cho việc tế tự, gieo trồng, thi cử và tu tạo.",
        ],
        [
            "Sao Quỷ (Kim Dương)",
            "Nam Phương Chu Tước",
            "bad",
            "Không lợi cho việc cưới hỏi, động thổ; hợp việc cầu an, bố thí.",
        ],
        [
            "Sao Liễu (Thổ Chương)",
            "Nam Phương Chu Tước",
            "bad",
            "Nên kiềm chế nóng nảy, tránh khởi công lớn hoặc tranh tụng.",
        ],
        [
            "Sao Tinh (Nhật Mã)",
            "Nam Phương Chu Tước",
            "normal",
            "Tốt cho việc xây bếp, tu tạo nhỏ; hạn chế cưới hỏi hoặc mở hàng lớn.",
        ],
        [
            "Sao Trương (Nguyệt Lộc)",
            "Nam Phương Chu Tước",
            "good",
            "Cát tinh — Đại lợi cho việc khai trương, cưới hỏi, cầu tài, nhập trạch.",
        ],
        [
            "Sao Dực (Hỏa Xà)",
            "Nam Phương Chu Tước",
            "normal",
            "Hợp cho việc văn hóa, nghệ thuật, học tập; cẩn trọng khi xuất hành xa.",
        ],
        [
            "Sao Chẩn (Thủy Giun)",
            "Nam Phương Chu Tước",
            "good",
            "Cát tinh — Rất tốt cho việc xuất hành, giao thương, mua bán đất đai và cưới hỏi.",
        ],
    ];

    const TRUC_SAO_ITEMS = [
        ...RAW_TRUC_12.map(([title, status, desc, advice]) => ({
            slug: toSlug(title),
            tab: "truc-sao",
            group: "truc",
            category: "Thập Nhị Kiến Trừ (12 Trực)",
            title,
            eyebrow: "Chu kỳ 12 Trực luân phiên",
            badge: status === "good" ? "Trực Tốt (Cát)" : status === "bad" ? "Trực Xấu (Hung)" : "Bình Hòa",
            badgeType: status,
            icon: status === "bad" ? "./assets/icons/fengshui/hac-dao.svg" : "./assets/icons/fengshui/hoang-dao.svg",
            isFilteredIcon: true,
            desc,
            advice,
            footNote: "Thập Nhị Kiến Trừ",
        })),
        ...RAW_STARS_28.map(([title, palace, status, desc]) => ({
            slug: toSlug(title.split("(")[0].trim()),
            tab: "truc-sao",
            group: "sao",
            category: "Nhị Thập Bát Tú (28 Sao)",
            title,
            eyebrow: palace,
            badge: status === "good" ? "Sao Kiết (Tốt)" : status === "bad" ? "Sao Hung (Xấu)" : "Sao Bình",
            badgeType: status,
            icon: status === "bad" ? "./assets/icons/fengshui/hac-dao.svg" : "./assets/icons/fengshui/hoang-dao.svg",
            isFilteredIcon: true,
            desc,
            advice: `Thuộc chòm ${palace}. Khi gặp ngày có ${title}, nên căn cứ vào tính chất Kiết/Hung của sao kết hợp với Trực ngày để chọn việc phù hợp.`,
            footNote: palace,
        })),
    ];

    // ==================== 5. DỮ LIỆU TAB 5: 8 QUẺ BÁT QUÁI & 12 CON GIÁP ====================
    const RAW_BAGUA_8 = [
        [
            "Quẻ Càn (☰)",
            "Tây Bắc",
            "metal",
            "dog.svg",
            "Tượng trưng cho Trời lớn, cương kiện, uy quyền, người đứng đầu và sự chính trực.",
            "Phương vị Tây Bắc (Hành Kim). Hợp cầu công danh, lãnh đạo, hoạch định chiến lược dài hạn.",
        ],
        [
            "Quẻ Khảm (☵)",
            "Chính Bắc",
            "water",
            "mouse.svg",
            "Tượng trưng cho Nước sâu, trí tuệ uyên bác, sự linh hoạt vượt qua hiểm trở.",
            "Phương vị Chính Bắc (Hành Thủy). Hợp nghiên cứu, học thuật, giao thương và tĩnh tâm.",
        ],
        [
            "Quẻ Cấn (☶)",
            "Đông Bắc",
            "earth",
            "tiger.svg",
            "Tượng trưng cho Núi cao vững chãi, sự tĩnh định, biết dừng đúng lúc và tích lũy nội lực.",
            "Phương vị Đông Bắc (Hành Thổ). Hợp tu dưỡng, củng cố nền tảng và bảo toàn tài sản.",
        ],
        [
            "Quẻ Chấn (☳)",
            "Chính Đông",
            "wood",
            "cat.svg",
            "Tượng trưng cho Sấm động mùa xuân, sinh khí bừng tỉnh, hành động nhanh nhạy và khởi đầu mới.",
            "Phương vị Chính Đông (Hành Mộc). Đại lợi cho xuất hành buổi sớm, khởi nghiệp, mở rộng thị trường.",
        ],
        [
            "Quẻ Tốn (☴)",
            "Đông Nam",
            "wood",
            "dragon.svg",
            "Tượng trưng cho Gió thuận hiền hòa, sự uyển chuyển, giao thương hanh thông và tài lộc lan tỏa.",
            "Phương vị Đông Nam (Hành Mộc - Cung Tài Lộc). Rất tốt cho đàm phán, truyền thông và cầu tài.",
        ],
        [
            "Quẻ Ly (☲)",
            "Chính Nam",
            "fire",
            "horse.svg",
            "Tượng trưng cho Lửa sáng, Mặt trời rực rỡ, văn minh, danh vọng và nhiệt huyết.",
            "Phương vị Chính Nam (Hành Hỏa). Hợp quảng bá thương hiệu, nghệ thuật, thi cử và tỏa sáng.",
        ],
        [
            "Quẻ Khôn (☷)",
            "Tây Nam",
            "earth",
            "goat.svg",
            "Tượng trưng cho Đất mẹ bao dung, sự nhu thuận, nuôi dưỡng vạn vật và hậu thuẫn vững chắc.",
            "Phương vị Tây Nam (Hành Thổ). Rất tốt cho bất động sản, nhân sự, gia đạo và hợp tác nhóm.",
        ],
        [
            "Quẻ Đoài (☱)",
            "Chính Tây",
            "metal",
            "rooster.svg",
            "Tượng trưng cho Đầm nước, niềm vui, tài ăn nói thuyết phục và sự gắn kết hài hòa.",
            "Phương vị Chính Tây (Hành Kim). Hợp ngoại giao, thuyết trình, tiệc mừng và kết nối khách hàng.",
        ],
    ];

    const RAW_ZODIAC_12 = [
        [
            "Tuổi Tý (Con Chuột)",
            "mouse.svg",
            "Tam hợp: Thân - Tý - Thìn (Hành Thủy)",
            "Tứ hành xung: Tý - Ngọ - Mão - Dậu • Nhị hợp: Sửu.",
        ],
        [
            "Tuổi Sửu (Con Trâu)",
            "buffalo.svg",
            "Tam hợp: Tỵ - Dậu - Sửu (Hành Kim)",
            "Tứ hành xung: Thìn - Tuất - Sửu - Mùi • Nhị hợp: Tý.",
        ],
        [
            "Tuổi Dần (Con Hổ)",
            "tiger.svg",
            "Tam hợp: Dần - Ngọ - Tuất (Hành Hỏa)",
            "Tứ hành xung: Dần - Thân - Tỵ - Hợi • Nhị hợp: Hợi.",
        ],
        [
            "Tuổi Mão (Con Mèo)",
            "cat.svg",
            "Tam hợp: Hợi - Mão - Mùi (Hành Mộc)",
            "Tứ hành xung: Tý - Ngọ - Mão - Dậu • Nhị hợp: Tuất.",
        ],
        [
            "Tuổi Thìn (Con Rồng)",
            "dragon.svg",
            "Tam hợp: Thân - Tý - Thìn (Hành Thủy)",
            "Tứ hành xung: Thìn - Tuất - Sửu - Mùi • Nhị hợp: Dậu.",
        ],
        [
            "Tuổi Tỵ (Con Rắn)",
            "snake.svg",
            "Tam hợp: Tỵ - Dậu - Sửu (Hành Kim)",
            "Tứ hành xung: Dần - Thân - Tỵ - Hợi • Nhị hợp: Thân.",
        ],
        [
            "Tuổi Ngọ (Con Ngựa)",
            "horse.svg",
            "Tam hợp: Dần - Ngọ - Tuất (Hành Hỏa)",
            "Tứ hành xung: Tý - Ngọ - Mão - Dậu • Nhị hợp: Mùi.",
        ],
        [
            "Tuổi Mùi (Con Dê)",
            "goat.svg",
            "Tam hợp: Hợi - Mão - Mùi (Hành Mộc)",
            "Tứ hành xung: Thìn - Tuất - Sửu - Mùi • Nhị hợp: Ngọ.",
        ],
        [
            "Tuổi Thân (Con Khỉ)",
            "monkey.svg",
            "Tam hợp: Thân - Tý - Thìn (Hành Thủy)",
            "Tứ hành xung: Dần - Thân - Tỵ - Hợi • Nhị hợp: Tỵ.",
        ],
        [
            "Tuổi Dậu (Con Gà)",
            "rooster.svg",
            "Tam hợp: Tỵ - Dậu - Sửu (Hành Kim)",
            "Tứ hành xung: Tý - Ngọ - Mão - Dậu • Nhị hợp: Thìn.",
        ],
        [
            "Tuổi Tuất (Con Chó)",
            "dog.svg",
            "Tam hợp: Dần - Ngọ - Tuất (Hành Hỏa)",
            "Tứ hành xung: Thìn - Tuất - Sửu - Mùi • Nhị hợp: Mão.",
        ],
        [
            "Tuổi Hợi (Con Hợi)",
            "pig.svg",
            "Tam hợp: Hợi - Mão - Mùi (Hành Mộc)",
            "Tứ hành xung: Dần - Thân - Tỵ - Hợi • Nhị hợp: Dần.",
        ],
    ];

    const BAGUA_ZODIAC_ITEMS = [
        ...RAW_BAGUA_8.map(([title, dir, elemKey, zodiacIcon, desc, advice]) => ({
            slug: toSlug(title.split("(")[0].replace("Quẻ", "").trim()),
            tab: "bagua",
            group: "bagua",
            category: "Bát Quái Phương Vị",
            title,
            eyebrow: `Phương vị: ${dir}`,
            badge: ELEMENT_HARMONY[elemKey].vn,
            badgeType: "normal",
            icon: `./assets/icons/zodiac/${zodiacIcon}`,
            isFilteredIcon: true,
            desc,
            advice,
            footNote: `Hướng ${dir}`,
        })),
        ...RAW_ZODIAC_12.map(([title, zodiacIcon, tamHop, xungHop]) => ({
            slug: toSlug(title.split("(")[0].trim()),
            tab: "bagua",
            group: "zodiac",
            category: "Thập Nhị Địa Chi (12 Con Giáp)",
            title,
            eyebrow: tamHop,
            badge: "Tam Hợp & Lục Hợp",
            badgeType: "good",
            icon: `./assets/icons/zodiac/${zodiacIcon}`,
            isFilteredIcon: true,
            desc: `${tamHop}. Các tuổi trong cùng bộ Tam Hợp và Nhị Hợp khi kết hợp làm ăn, xuất hành hoặc chọn ngày giờ sẽ bổ trợ sinh khí mạnh mẽ cho nhau.`,
            advice: `${xungHop} Khi chọn ngày lành tháng tốt, nên ưu tiên ngày thuộc Tam Hợp/Nhị Hợp và tránh ngày Lục Xung với bản mệnh.`,
            footNote: tamHop.replace("Tam hợp: ", ""),
        })),
    ];

    const ALL_DICTIONARY_ITEMS = [
        ...NAP_AM_ITEMS,
        ...SOLAR_TERM_ITEMS,
        ...LUC_DIEU_DIRECTION_ITEMS,
        ...TRUC_SAO_ITEMS,
        ...BAGUA_ZODIAC_ITEMS,
    ];

    // Cấu hình Tiêu đề & Nút lọc phụ của từng Tab
    const TAB_CONFIG = {
        napam: {
            heading: "Bảng Tra Cứu 30 Nạp Âm Lục Thập Hoa Giáp",
            sub: "Phân loại đầy đủ 30 Nạp Âm theo 5 nguyên tố Kim - Mộc - Thủy - Hỏa - Thổ và quy luật Tương Sinh",
            filters: [
                { key: "all", label: "Tất cả (30)" },
                { key: "metal", label: "Hành Kim (6)" },
                { key: "wood", label: "Hành Mộc (6)" },
                { key: "water", label: "Hành Thủy (6)" },
                { key: "fire", label: "Hành Hỏa (6)" },
                { key: "earth", label: "Hành Thổ (6)" },
            ],
        },
        solarterm: {
            heading: "Chu Kỳ 24 Tiết Khí Nông Lịch Phương Đông",
            sub: "24 mốc vận hành của Mặt Trời trên hoàng đạo cùng biểu tượng thời tiết và lời khuyên dưỡng sinh, hành sự",
            filters: [
                { key: "all", label: "Cả năm (24)" },
                { key: "spring", label: "Mùa Xuân (6)" },
                { key: "summer", label: "Mùa Hạ (6)" },
                { key: "autumn", label: "Mùa Thu (6)" },
                { key: "winter", label: "Mùa Đông (6)" },
            ],
        },
        lucdieu: {
            heading: "Khổng Minh Lục Diệu & Tam Thần Xuất Hành",
            sub: "6 cung giờ cát hung của Gia Cát Khổng Minh và 3 phương vị Hỷ Thần, Tài Thần, Hạc Thần",
            filters: [
                { key: "all", label: "Tất cả (9)" },
                { key: "lucdieu", label: "6 Cung Lục Diệu" },
                { key: "direction", label: "3 Vị Thần Xuất Hành" },
            ],
        },
        "truc-sao": {
            heading: "Thập Nhị Kiến Trừ (12 Trực) & Nhị Thập Bát Tú (28 Sao)",
            sub: "Hệ thống 12 Trực và 28 chòm sao cổ học dùng để chọn ngày lành tháng tốt, khởi công, cưới hỏi",
            filters: [
                { key: "all", label: "Tất cả (40)" },
                { key: "truc", label: "12 Trực (Kiến Trừ)" },
                { key: "sao", label: "28 Sao (Nhị Thập Bát Tú)" },
            ],
        },
        bagua: {
            heading: "Bát Quái Phương Vị & Xung Hợp 12 Con Giáp",
            sub: "8 quẻ Tiên/Hậu Thiên Bát Quái và quy luật Tam Hợp, Nhị Hợp, Tứ Hành Xung của 12 Địa Chi",
            filters: [
                { key: "all", label: "Tất cả (20)" },
                { key: "bagua", label: "8 Quẻ Bát Quái" },
                { key: "zodiac", label: "12 Con Giáp (Tam Hợp)" },
            ],
        },
    };

    // 1. Cập nhật Khung Spotlight Tiêu Điểm ở Cột Trái Tầng 2
    const syncItemToSpotlight = (item) => {
        if (!item) return;
        selectedItemObj = item;

        document.getElementById("util-spot-category").textContent = item.category;
        document.getElementById("util-spot-subbadge").textContent = item.badge;
        document.getElementById("util-spot-eyebrow").textContent = item.eyebrow;
        document.getElementById("util-spot-title").textContent = item.title;
        document.getElementById("util-spot-desc").textContent = item.desc;
        document.getElementById("util-spot-advice").textContent = item.advice;

        const iconBox = document.getElementById("util-spot-icon-box");
        const iconImg = document.getElementById("util-spot-icon");
        const watermarkImg = document.getElementById("util-spot-watermark");

        if (iconBox) iconBox.classList.toggle("is-zodiac-filtered", Boolean(item.isFilteredIcon));
        if (iconImg) iconImg.src = item.icon;
        if (watermarkImg) watermarkImg.src = item.icon;

        document.querySelectorAll(".util-item-card").forEach((card) => {
            card.classList.toggle("is-selected", card.dataset.utilSlug === item.slug);
        });
    };

    // 2. Mở Bento Modal Giải Nghĩa Lớn (#util-term-modal)
    const closeUtilModal = () => {
        const modal = document.getElementById("util-term-modal");
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
    };

    const openUtilModal = (item) => {
        const modal = document.getElementById("util-term-modal");
        if (!modal || !item) return;

        document.getElementById("util-term-modal-category").textContent = item.category;
        document.getElementById("util-term-modal-title").textContent = item.title;

        const visualEl = document.getElementById("util-term-modal-visual");
        if (visualEl) {
            visualEl.classList.toggle("is-zodiac-filtered", Boolean(item.isFilteredIcon));
            visualEl.innerHTML = `
                <img src="${item.icon}" alt="" />
                <strong>${item.badge}</strong>
            `;
        }

        const pillsEl = document.getElementById("util-term-modal-pills");
        if (pillsEl) {
            pillsEl.innerHTML = `
                <span class="day-term-modal__pill day-term-modal__pill--highlight">${item.badge}</span>
                <span class="day-term-modal__pill">${item.eyebrow}</span>
                <span class="day-term-modal__pill">${item.footNote}</span>
            `;
        }

        document.getElementById("util-term-modal-desc").textContent = item.desc;
        document.getElementById("util-term-modal-advice").textContent = item.advice;

        modal.hidden = false;
        document.body.style.overflow = "hidden";
    };

    // 3. Render Thanh Bộ Lọc Phụ & Lưới Bento Thẻ Từ Điển
    const renderCatalogSection = () => {
        const config = TAB_CONFIG[activeTab] || TAB_CONFIG.napam;
        const headingEl = document.getElementById("util-catalog-heading");
        const subEl = document.getElementById("util-catalog-subtitle");
        const subfiltersBar = document.getElementById("util-subfilters-bar");
        const gridEl = document.getElementById("util-cards-grid");

        if (headingEl) {
            headingEl.textContent = searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : config.heading;
        }
        if (subEl) {
            subEl.textContent = searchQuery
                ? "Hiển thị kết quả khớp từ khóa trên toàn bộ 5 hệ thống cổ học"
                : config.sub;
        }

        // Render các nút lọc phụ
        if (subfiltersBar) {
            subfiltersBar.innerHTML = config.filters
                .map(
                    (f) => `
                        <button
                            type="button"
                            class="util-subfilter-btn ${f.key === activeSubfilter ? "is-active" : ""}"
                            data-subfilter="${f.key}"
                        >
                            ${f.label}
                        </button>
                    `,
                )
                .join("");

            subfiltersBar.querySelectorAll(".util-subfilter-btn").forEach((btn) => {
                btn.onclick = () => {
                    activeSubfilter = btn.dataset.subfilter || "all";
                    searchQuery = "";
                    const searchInput = document.getElementById("util-search-input");
                    const clearBtn = document.getElementById("util-search-clear");
                    if (searchInput) searchInput.value = "";
                    if (clearBtn) clearBtn.hidden = true;
                    renderCatalogSection();
                };
            });
        }

        // Lọc danh sách mục
        const q = searchQuery.trim().toLowerCase();
        const filteredItems = ALL_DICTIONARY_ITEMS.filter((item) => {
            if (q) {
                const haystack =
                    `${item.title} ${item.eyebrow} ${item.badge} ${item.desc} ${item.category}`.toLowerCase();
                return haystack.includes(q);
            }
            if (item.tab !== activeTab) return false;
            if (activeSubfilter !== "all" && item.group !== activeSubfilter) return false;
            return true;
        });

        if (!gridEl) return;

        if (filteredItems.length === 0) {
            gridEl.innerHTML = `
                <article class="util-item-card">
                    <strong class="util-item-card__title">Không tìm thấy thuật ngữ phù hợp</strong>
                    <p class="util-item-card__desc">
                        Bạn hãy thử gõ tên khác (ví dụ: Tuyền Trung Thủy, Lập Đông, Đại An, Quẻ Càn, Sao Sâm) hoặc chuyển sang Tab bên cạnh.
                    </p>
                </article>
            `;
            return;
        }

        // Nếu chưa có mục Spotlight hoặc mục đang chọn không nằm trong danh sách hiện tại thì chọn mục đầu tiên
        if (!selectedItemObj || !filteredItems.some((i) => i.slug === selectedItemObj.slug)) {
            selectedItemObj = filteredItems[0];
        }

        gridEl.innerHTML = filteredItems
            .map((item) => {
                const isSelected = selectedItemObj && selectedItemObj.slug === item.slug;
                const tagMod =
                    item.badgeType === "good"
                        ? "util-item-card__tag--good"
                        : item.badgeType === "bad"
                          ? "util-item-card__tag--bad"
                          : "";

                return `
                    <article
                        class="util-item-card ${isSelected ? "is-selected" : ""}"
                        data-util-slug="${item.slug}"
                        tabindex="0"
                    >
                        <img
                            src="${item.icon}"
                            alt=""
                            aria-hidden="true"
                            class="util-item-card__watermark"
                        />

                        <div class="util-item-card__head">
                            <span class="util-item-card__icon-wrap ${item.isFilteredIcon ? "util-item-card__icon-wrap--filtered" : ""}">
                                <img src="${item.icon}" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-item-card__tag ${tagMod}">${item.badge}</span>
                        </div>

                        <div class="util-item-card__body">
                            <strong class="util-item-card__title">${item.title}</strong>
                            <span class="util-item-card__sub">${item.eyebrow}</span>
                        </div>

                        <p class="util-item-card__desc">${item.desc}</p>

                        <footer class="util-item-card__foot">
                            <span>${item.footNote}</span>
                            <span class="util-item-card__more">Xem giải nghĩa &#8594;</span>
                        </footer>
                    </article>
                `;
            })
            .join("");

        syncItemToSpotlight(selectedItemObj);
    };

    // 4. Đồng bộ 4 Ô Thông Số Thực Tế Của Ngày Hôm Nay (Cột Phải Tầng 2)
    const populateTodayQuickBridge = () => {
        if (!window.LunarEngine) return;
        const now = new Date();
        const sDay = now.getDate();
        const sMonth = now.getMonth() + 1;
        const sYear = now.getFullYear();

        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);
        const dayLucDieuIdx = (info.lunarMonth + info.lunarDay - 2) % 6;
        const lucDieuNames = ["Đại An", "Lưu Niên", "Tốc Hỷ", "Xích Khẩu", "Tiểu Cát", "Không Vong"];
        const todayLucDieuName = lucDieuNames[dayLucDieuIdx] || "Đại An";

        const badgeEl = document.getElementById("util-today-date-badge");
        if (badgeEl) {
            badgeEl.textContent = `Hôm nay • ${pad(sDay)}/${pad(sMonth)}/${sYear} (${pad(info.lunarDay)}/${pad(info.lunarMonth)} ÂL)`;
        }

        const napAmBtn = document.getElementById("util-bridge-napam");
        if (napAmBtn) {
            napAmBtn.dataset.quickLookupSlug = toSlug(info.dayNapAm);
            document.getElementById("util-bridge-napam-val").textContent = info.dayNapAm;
            document.getElementById("util-bridge-napam-sub").textContent = `Ngày ${info.dayCanChi} • Bấm để tra`;
        }

        const termBtn = document.getElementById("util-bridge-term");
        if (termBtn) {
            termBtn.dataset.quickLookupSlug = toSlug(info.solarTerm);
            document.getElementById("util-bridge-term-val").textContent = `Tiết ${info.solarTerm}`;
            document.getElementById("util-bridge-term-sub").textContent = `Tháng ${info.monthCanChi} • Bấm để tra`;
        }

        const lucDieuBtn = document.getElementById("util-bridge-lucdieu");
        if (lucDieuBtn) {
            lucDieuBtn.dataset.quickLookupSlug = toSlug(todayLucDieuName);
            document.getElementById("util-bridge-lucdieu-val").textContent = `Cung ${todayLucDieuName}`;
            document.getElementById("util-bridge-lucdieu-sub").textContent =
                `Tài Thần: ${info.directions.tai} • Hỷ Thần: ${info.directions.hy}`;
        }

        const trucBtn = document.getElementById("util-bridge-truc");
        if (trucBtn) {
            trucBtn.dataset.quickLookupSlug = toSlug(`Trực ${info.trucObj.name}`);
            document.getElementById("util-bridge-truc-val").textContent = `Trực ${info.trucObj.name}`;
            document.getElementById("util-bridge-truc-sub").textContent = `Tuổi hợp: ${info.ageHarmony.good}`;
        }
    };

    // 5. Chuyển Tab và Tự Động Bắt Tham Số URL Deep-Link từ day.html / footer.html
    const activateTabAndSlug = (targetTab, targetSlug = "") => {
        if (TAB_CONFIG[targetTab]) {
            activeTab = targetTab;
        }
        activeSubfilter = "all";

        document.querySelectorAll("[data-util-tab]").forEach((btn) => {
            const isMatch = btn.dataset.utilTab === activeTab;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-selected", String(isMatch));
        });

        if (targetSlug) {
            const found = ALL_DICTIONARY_ITEMS.find(
                (i) => i.slug === targetSlug || i.slug.includes(targetSlug) || targetSlug.includes(i.slug),
            );
            if (found) {
                activeTab = found.tab;
                selectedItemObj = found;
                document.querySelectorAll("[data-util-tab]").forEach((btn) => {
                    const isMatch = btn.dataset.utilTab === activeTab;
                    btn.classList.toggle("is-active", isMatch);
                    btn.setAttribute("aria-selected", String(isMatch));
                });
            }
        }

        renderCatalogSection();
    };

    const initUtilitiesPage = () => {
        const mainEl = document.getElementById("main");
        if (!mainEl) return;
        if (mainEl.dataset.utilBound === "true") return;
        mainEl.dataset.utilBound = "true";

        populateTodayQuickBridge();

        // Đọc tham số URL (?napam=..., ?term=..., ?lucdieu=..., ?direction=..., ?bagua=..., ?tab=...)
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        const napamParam = params.get("napam");
        const termParam = params.get("term");
        const lucdieuParam = params.get("lucdieu");
        const directionParam = params.get("direction");
        const baguaParam = params.get("bagua");

        if (napamParam) activateTabAndSlug("napam", napamParam);
        else if (termParam) activateTabAndSlug("solarterm", termParam);
        else if (lucdieuParam) activateTabAndSlug("lucdieu", lucdieuParam);
        else if (directionParam) activateTabAndSlug("lucdieu", directionParam);
        else if (baguaParam) activateTabAndSlug("bagua", baguaParam);
        else if (tabParam) activateTabAndSlug(tabParam, "");
        else activateTabAndSlug("napam", "tuyen-trung-thuy");

        // Sự kiện bấm chuyển 5 Tabs chính
        document.querySelectorAll("[data-util-tab]").forEach((tabBtn) => {
            tabBtn.onclick = () => {
                const nextTab = tabBtn.dataset.utilTab || "napam";
                searchQuery = "";
                const searchInput = document.getElementById("util-search-input");
                const clearBtn = document.getElementById("util-search-clear");
                if (searchInput) searchInput.value = "";
                if (clearBtn) clearBtn.hidden = true;
                selectedItemObj = null;
                activateTabAndSlug(nextTab, "");
            };
        });

        // Sự kiện gõ Tìm kiếm nhanh
        const searchInput = document.getElementById("util-search-input");
        const clearBtn = document.getElementById("util-search-clear");

        searchInput?.addEventListener("input", () => {
            searchQuery = searchInput.value || "";
            if (clearBtn) clearBtn.hidden = !searchQuery.trim();
            renderCatalogSection();
        });

        if (clearBtn && searchInput) {
            clearBtn.onclick = () => {
                searchInput.value = "";
                searchQuery = "";
                clearBtn.hidden = true;
                renderCatalogSection();
            };
        }

        // Sự kiện bấm vào 4 ô Đối chiếu ngày hôm nay
        document.querySelectorAll("[data-quick-lookup-tab]").forEach((pillBtn) => {
            pillBtn.onclick = () => {
                const tTab = pillBtn.dataset.quickLookupTab || "napam";
                const tSlug = pillBtn.dataset.quickLookupSlug || "";
                activateTabAndSlug(tTab, tSlug);
                document
                    .getElementById("util-spotlight-card")
                    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            };
        });

        // Nút mở nhanh Converter Modal từ trang Tiện Ích
        document.getElementById("util-open-converter-btn")?.addEventListener("click", () => {
            if (typeof window.openConverterModal === "function") {
                window.openConverterModal(true);
            } else {
                document.getElementById("widget-trigger-btn")?.click();
            }
        });

        // Nút mở Modal từ khung Spotlight
        document.getElementById("util-spot-open-modal-btn")?.addEventListener("click", () => {
            if (selectedItemObj) openUtilModal(selectedItemObj);
        });

        // Sự kiện bấm vào thẻ trong lưới #util-cards-grid (Đồng bộ Spotlight + Mở Modal)
        document.getElementById("util-cards-grid")?.addEventListener("click", (e) => {
            const cardEl = e.target.closest("[data-util-slug]");
            if (!cardEl) return;
            const slug = cardEl.dataset.utilSlug;
            const item = ALL_DICTIONARY_ITEMS.find((i) => i.slug === slug);
            if (!item) return;

            syncItemToSpotlight(item);
            openUtilModal(item);
        });

        // Đóng Modal
        document.getElementById("util-term-modal-close")?.addEventListener("click", closeUtilModal);
        document.getElementById("util-term-modal-cancel")?.addEventListener("click", closeUtilModal);
        document.getElementById("util-term-modal-backdrop")?.addEventListener("click", closeUtilModal);

        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("util-term-modal");
            if (e.key === "Escape" && modal && !modal.hidden) {
                closeUtilModal();
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUtilitiesPage);
    } else {
        initUtilitiesPage();
    }
    window.addEventListener("template-loaded", initUtilitiesPage);
})();
