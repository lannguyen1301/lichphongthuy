// assets/js/day-calendar.js
// Chuyên trách Trang Ngày (day.html): Tích hợp 39 Icon SVG trong ./assets/icons/fengshui/ & ./assets/icons/weather/,
// Tooltip 3 tầng tách riêng Tag hành động, Gợi ý Mệnh Hợp/Kỵ & Bento Modal Quick-View Hybrid SEO
(() => {
    const DEFAULT_COVER_IMG =
        "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let viewingDate = new Date();
    let activeHourFilter = "all"; // "all" | "good" | "bad"
    let currentDayHoursData = [];
    let currentDayContext = null;
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

    const STEM_TO_ELEMENT = [
        "wood", // Giáp
        "wood", // Ất
        "fire", // Bính
        "fire", // Đinh
        "earth", // Mậu
        "earth", // Kỷ
        "metal", // Canh
        "metal", // Tân
        "water", // Nhâm
        "water", // Quý
    ];

    const ELEMENT_VN_NAME = {
        fire: "Hỏa",
        earth: "Thổ",
        metal: "Kim",
        water: "Thủy",
        wood: "Mộc",
    };

    // Quy luật Ngũ Hành Tương Sinh & Tương Khắc để gợi ý "Tốt cho người mệnh nào"
    const ELEMENT_HARMONY_MAP = {
        metal: {
            good: "Thủy, Kim",
            bad: "Mộc",
            note: "Kim sinh Thủy và tương hợp mệnh Kim; người mệnh Mộc (Kim khắc Mộc) nên cẩn trọng việc lớn.",
        },
        wood: {
            good: "Hỏa, Mộc",
            bad: "Thổ",
            note: "Mộc sinh Hỏa và tương hợp mệnh Mộc; người mệnh Thổ (Mộc khắc Thổ) nên lưu ý khi cầu tài.",
        },
        water: {
            good: "Mộc, Thủy",
            bad: "Hỏa",
            note: "Thủy sinh Mộc và tương hợp mệnh Thủy; người mệnh Hỏa (Thủy khắc Hỏa) nên tránh nóng vội.",
        },
        fire: {
            good: "Thổ, Hỏa",
            bad: "Kim",
            note: "Hỏa sinh Thổ và tương hợp mệnh Hỏa; người mệnh Kim (Hỏa khắc Kim) cần thận trọng giao dịch.",
        },
        earth: {
            good: "Kim, Thổ",
            bad: "Thủy",
            note: "Thổ sinh Kim và tương hợp mệnh Thổ; người mệnh Thủy (Thổ khắc Thủy) nên ưu tiên sự ổn định.",
        },
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

    // 3 Vị Thần Hướng Xuất Hành (Khớp 100% với ./assets/icons/fengshui/{hy-than|tai-than|hac-than}.svg)
    const DIRECTION_DEITIES = {
        hy: {
            key: "hy-than",
            name: "Hỷ Thần",
            status: "Cát Thần (Tốt)",
            icon: "./assets/icons/fengshui/hy-than.svg",
            sub: "Hướng niềm vui, cưới hỏi",
            desc: "Hỷ Thần là vị thần chủ quản niềm vui, cát khánh, nhân duyên và hỷ sự trong thuật chọn ngày giờ cổ học.",
            advice: "Khi xuất hành theo hướng Hỷ Thần sẽ rất thuận lợi cho việc cưới hỏi, cầu duyên, gặp gỡ đối tác, dự tiệc mừng hoặc đón nhận tin vui.",
        },
        tai: {
            key: "tai-than",
            name: "Tài Thần",
            status: "Cát Thần (Tốt)",
            icon: "./assets/icons/fengshui/tai-than.svg",
            sub: "Hướng cầu tài, khai trương",
            desc: "Tài Thần là vị thần chủ quản tiền bạc, lộc phát, thương mại và sự thịnh vượng tài chính.",
            advice: "Xuất hành theo hướng Tài Thần đại lợi cho việc mở hàng, khai trương, ký kết hợp đồng thương mại, giao dịch bất động sản và cầu tài lộc.",
        },
        hac: {
            key: "hac-than",
            name: "Hạc Thần",
            status: "Hung Thần (Cần tránh)",
            icon: "./assets/icons/fengshui/hac-than.svg",
            sub: "Hướng xấu cần tránh",
            desc: "Hạc Thần là phương vị hung sát tinh dịch chuyển theo chu kỳ Lục Thập Hoa Giáp trên bầu trời.",
            advice: "Trong ngày hôm nay, nếu xuất hành đi xa hoặc khởi sự việc đại sự thì nên tránh đi thẳng về hướng Hạc Thần, ưu tiên chọn hướng Tài Thần hoặc Hỷ Thần.",
        },
    };

    // 6 Cung Khổng Minh Lục Diệu (Khớp 100% với ./assets/icons/fengshui/lucdieu-*.svg)
    const LUC_DIEU_6 = [
        {
            name: "Đại An",
            slug: "dai-an",
            icon: "./assets/icons/fengshui/lucdieu-daian.svg",
            isGood: true,
            desc: "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên ổn.",
            advice: "Rất hợp để khởi sự việc quan trọng, ký kết hợp đồng, xuất hành hoặc cầu bình an cho gia đạo.",
        },
        {
            name: "Lưu Niên",
            slug: "luu-nien",
            icon: "./assets/icons/fengshui/lucdieu-luunien.svg",
            isGood: false,
            desc: "Mưu sự dễ chậm trễ, cầu lộc chưa thông, cần đề phòng khẩu thiệt.",
            advice: "Nên ưu tiên xử lý các công việc tồn đọng, rà soát kỹ hồ sơ pháp lý và tránh vội vàng quyết định lớn.",
        },
        {
            name: "Tốc Hỷ",
            slug: "toc-hy",
            icon: "./assets/icons/fengshui/lucdieu-tochy.svg",
            isGood: true,
            desc: "Tin vui đến nhanh, mưu sự đại cát, thuận lợi cho việc gặp gỡ, ký kết.",
            advice: "Thời điểm vàng để thương thảo, ra mắt sản phẩm, gửi lời mời hợp tác hoặc kết nối quý nhân.",
        },
        {
            name: "Xích Khẩu",
            slug: "xich-khau",
            icon: "./assets/icons/fengshui/lucdieu-xichkhau.svg",
            isGood: false,
            desc: "Dễ xảy ra bất hòa, tranh cãi; nên cẩn trọng lời ăn tiếng nói và hợp đồng.",
            advice: "Giữ thái độ hòa nhã trong giao tiếp, hạn chế tranh luận gay gắt hoặc ký kết các cam kết nhạy cảm.",
        },
        {
            name: "Tiểu Cát",
            slug: "tieu-cat",
            icon: "./assets/icons/fengshui/lucdieu-tieucat.svg",
            isGood: true,
            desc: "Cát lành, hòa hợp, mưu sự suôn sẻ và dễ gặp quý nhân phù trợ.",
            advice: "Thuận lợi cho giao dịch tài chính, mở hàng, cầu tài lộc và vun đắp các mối quan hệ đối tác.",
        },
        {
            name: "Không Vong",
            slug: "khong-vong",
            icon: "./assets/icons/fengshui/lucdieu-khongvong.svg",
            isGood: false,
            desc: "Cầu tài không lợi, mưu sự dễ trắc trở, không nên tiến hành việc đại sự.",
            advice: "Thích hợp để nghỉ ngơi, học tập, lập kế hoạch nội bộ hoặc làm việc thiện nguyện hơn là đầu tư mạo hiểm.",
        },
    ];

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
            baguaAdvice:
                "Giờ Tý âm khí đạt cực điểm rồi bắt đầu sinh dương khí, hợp tĩnh dưỡng và suy ngẫm chiến lược.",
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
            baguaAdvice: "Năng lượng trầm ổn, bền bỉ như đất đá; hợp cho sự chuẩn bị kỹ lưỡng trước bình minh.",
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
            baguaAdvice: "Dương khí chớm nở, thích hợp thức dậy sớm rèn luyện sức khỏe, lên mục tiêu ngày mới.",
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
            baguaAdvice: "Mặt trời mọc ở hướng Đông, rất tốt để xuất hành buổi sớm, khai mở công việc đầu ngày.",
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
            baguaAdvice: "Khung giờ vượng khí nhất buổi sáng để khai trương, họp bàn, ký kết và đón tài lộc.",
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
            baguaAdvice: "Trí tuệ minh mẫn, giao tiếp sắc sảo; rất hợp đàm phán, thuyết trình và chốt giao dịch.",
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
            baguaAdvice:
                "Dương khí cực thịnh giữa trưa, hợp kết nối thân tình, nạp lại năng lượng và giữ tâm bình hòa.",
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
            baguaAdvice:
                "Khung giờ ổn định đầu giờ chiều để triển khai công việc nhóm, chăm sóc khách hàng và đối tác.",
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
            baguaAdvice: "Hiệu suất làm việc và xử lý số liệu cao, hợp hoàn tất các tác vụ quan trọng trong ngày.",
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
            baguaAdvice: "Thuận lợi cho việc tổng kết cuối ngày, gặp gỡ thân mật, tiệc mừng và gắn kết gia đình.",
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
            baguaAdvice: "Thích hợp học tập, đọc sách, hoạch định tầm nhìn dài hạn và sum họp bên người thân.",
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
            baguaAdvice: "Thời điểm thư giãn tâm trí, buông bỏ lo âu để chuẩn bị cho giấc ngủ sâu tái tạo sinh lực.",
        },
    ];

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
        { name: "Thiên Hà Thủy", meaning: "Nước mưa trên trời — Thanh khiết, rộng lớn và nuôi dưỡng vạn vật." },
        { name: "Đại Trạch Thổ", meaning: "Đất đầm lớn — Phì nhiêu, bao dung và giàu tiềm năng." },
        { name: "Thoa Xuyến Kim", meaning: "Vàng trang sức — Quý phái, thẩm mỹ cao và được trân trọng." },
        { name: "Tang Đố Mộc", meaning: "Gỗ cây dâu — Hữu ích, bền bỉ và mang lại giá trị thiết thực." },
        { name: "Đại Khê Thủy", meaning: "Nước khe lớn — Mạnh mẽ, khoáng đạt và giàu năng lượng." },
        { name: "Sa Trung Thổ", meaning: "Đất pha cát — Linh hoạt, dễ thích nghi với mọi hoàn cảnh." },
        { name: "Thiên Thượng Hỏa", meaning: "Lửa trên trời (Mặt trời) — Quang minh, chính đại và tràn đầy sinh lực." },
        { name: "Thạch Lựu Mộc", meaning: "Gỗ cây thạch lựu — Dẻo dai, kiên cường và kết trái ngọt lành." },
        { name: "Đại Hải Thủy", meaning: "Nước biển lớn — Bao la, hùng vĩ và dung nạp trăm sông." },
    ];

    // 24 Tiết Khí khớp 100% với danh sách 24 file SVG trong ./assets/icons/weather/term-*.svg của bạn
    const SOLAR_TERMS_24 = [
        {
            name: "Tiểu Hàn",
            icon: "term-winter-minor-cold.svg",
            season: "Mùa Đông • Hành Thủy",
            meaning: "Chớm lạnh — Khí trời bắt đầu rét đậm, chuẩn bị bước vào giai đoạn lạnh nhất cuối năm.",
            advice: "Nên giữ ấm cơ thể, bồi bổ dinh dưỡng và hoàn tất các kế hoạch cuối năm.",
            m1: 1,
            d1: 5,
            m2: 1,
            d2: 19,
        },
        {
            name: "Đại Hàn",
            icon: "term-winter-major-cold.svg",
            season: "Mùa Đông • Hành Thủy",
            meaning: "Rét cực điểm — Tiết khí cuối cùng của năm âm lịch, hàn khí đạt đỉnh trước khi mầm xuân trỗi dậy.",
            advice: "Thích hợp tổng kết năm cũ, dọn dẹp nhà cửa đón Tết và giữ ấm vùng cổ, bàn chân.",
            m1: 1,
            d1: 20,
            m2: 2,
            d2: 3,
        },
        {
            name: "Lập Xuân",
            icon: "term-spring.svg",
            season: "Mùa Xuân • Hành Mộc",
            meaning: "Khởi đầu mùa xuân — Dương khí bừng dậy, cây cối đâm chồi nảy lộc, vạn vật sinh sôi.",
            advice: "Đại cát cho việc lập kế hoạch năm mới, xuất hành đầu xuân, trồng cây và mở rộng giao kết.",
            m1: 2,
            d1: 4,
            m2: 2,
            d2: 18,
        },
        {
            name: "Vũ Thủy",
            icon: "term-rain.svg",
            season: "Mùa Xuân • Hành Mộc",
            meaning: "Mưa xuân — Hơi ẩm tăng dần, những cơn mưa phùn ấm áp tưới tắm cho mùa màng tươi tốt.",
            advice: "Thuận lợi cho việc gieo trồng, học tập, bồi đắp tri thức và chăm sóc sức khỏe gan mật.",
            m1: 2,
            d1: 19,
            m2: 3,
            d2: 4,
        },
        {
            name: "Kinh Trập",
            icon: "term-thunder.svg",
            season: "Mùa Xuân • Hành Mộc",
            meaning: "Sấm xuân thức tỉnh — Tiếng sấm đầu mùa vang lên đánh thức vạn vật sau kỳ ngủ đông.",
            advice: "Thời điểm rất tốt để bứt phá, triển khai dự án mới và hành động quyết đoán.",
            m1: 3,
            d1: 5,
            m2: 3,
            d2: 20,
        },
        {
            name: "Xuân Phân",
            icon: "term-spring-equinox.svg",
            season: "Mùa Xuân • Hành Mộc",
            meaning: "Giữa xuân cân bằng — Ngày và đêm dài bằng nhau, âm dương điều hòa, tiết trời ôn ấm.",
            advice: "Rất tốt cho việc hòa giải, ký kết hợp tác đôi bên cùng có lợi và cân bằng nhịp sống.",
            m1: 3,
            d1: 21,
            m2: 4,
            d2: 4,
        },
        {
            name: "Thanh Minh",
            icon: "term-spring-clear.svg",
            season: "Mùa Xuân • Hành Mộc",
            meaning: "Trời trong sáng — Khí trời quang đãng, mát mẻ, gắn liền với truyền thống tảo mộ, hướng về cội nguồn.",
            advice: "Hợp đi tảo mộ, tri ân tổ tiên, du xuân ngoài trời và khởi sự việc thiện lành.",
            m1: 4,
            d1: 5,
            m2: 4,
            d2: 19,
        },
        {
            name: "Cốc Vũ",
            icon: "term-grain-rain.svg",
            season: "Cuối Xuân • Hành Mộc",
            meaning: "Mưa rào nuôi ngũ cốc — Lượng mưa dồi dào giúp lúa màu và cây trồng phát triển vượt bậc.",
            advice: "Thuận lợi cho việc tích lũy tài chính, đầu tư dài hạn và chăm sóc gia đình.",
            m1: 4,
            d1: 20,
            m2: 5,
            d2: 4,
        },
        {
            name: "Lập Hạ",
            icon: "term-summer-sun.svg",
            season: "Mùa Hạ • Hành Hỏa",
            meaning: "Bắt đầu mùa hạ — Nắng vàng rực rỡ, nhiệt độ tăng cao, vạn vật bước vào kỳ trưởng thành mạnh mẽ.",
            advice: "Hợp đẩy mạnh kinh doanh, quảng bá thương hiệu và giữ tâm thái bình hòa dưới nắng nóng.",
            m1: 5,
            d1: 5,
            m2: 5,
            d2: 20,
        },
        {
            name: "Tiểu Mãn",
            icon: "term-grain.svg",
            season: "Mùa Hạ • Hành Hỏa",
            meaning: "Lúa trổ đòng chắc hạt — Hạt ngũ cốc bắt đầu căng mẩy, báo hiệu mùa màng sắp thu hoạch.",
            advice: "Nên kiên trì hoàn thiện các công việc đang dang dở để chuẩn bị gặt hái thành quả.",
            m1: 5,
            d1: 21,
            m2: 6,
            d2: 5,
        },
        {
            name: "Mang Chủng",
            icon: "term-grain-ear.svg",
            season: "Mùa Hạ • Hành Hỏa",
            meaning: "Lúa chín có râu — Thời điểm thu hoạch vụ chiêm và gieo cấy vụ mùa nhộn nhịp.",
            advice: "Rất tốt cho việc thu hồi công nợ, chốt doanh số và tái đầu tư xoay vòng vốn.",
            m1: 6,
            d1: 6,
            m2: 6,
            d2: 20,
        },
        {
            name: "Hạ Chí",
            icon: "term-summer-solstice.svg",
            season: "Mùa Hạ • Hành Hỏa",
            meaning: "Đỉnh điểm mùa hạ — Ngày dài nhất trong năm, dương khí đạt cực thịnh.",
            advice: "Nên uống nhiều nước mát, nghỉ trưa hợp lý và tránh làm việc quá sức ngoài trời nắng gắt.",
            m1: 6,
            d1: 21,
            m2: 7,
            d2: 6,
        },
        {
            name: "Tiểu Thử",
            icon: "term-summer-minor-heat.svg",
            season: "Mùa Hạ • Hành Hỏa",
            meaning: "Nóng nhẹ — Khí trời oi bức bắt đầu lan tỏa kèm theo những cơn mưa dông mùa hạ.",
            advice: "Hợp làm việc nơi thoáng mát, kiểm soát cảm xúc và giữ gìn sức khỏe tim mạch.",
            m1: 7,
            d1: 7,
            m2: 7,
            d2: 22,
        },
        {
            name: "Đại Thử",
            icon: "term-summer-major-heat.svg",
            season: "Mùa Hạ • Hành Hỏa",
            meaning: "Nóng oi ả cực độ — Giai đoạn nhiệt độ cao nhất trong năm, năng lượng Hỏa vượng.",
            advice: "Thích hợp dưỡng tâm, ăn thực phẩm thanh nhiệt và cẩn trọng phòng chống cháy nổ.",
            m1: 7,
            d1: 23,
            m2: 8,
            d2: 6,
        },
        {
            name: "Lập Thu",
            icon: "term-autumn-wind.svg",
            season: "Mùa Thu • Hành Kim",
            meaning: "Khởi đầu mùa thu — Gió heo may chớm về, bầu trời cao trong và dịu mát dần.",
            advice: "Thời điểm lý tưởng để hoạch định mục tiêu nửa cuối năm, khai trương và thu hoạch.",
            m1: 8,
            d1: 7,
            m2: 8,
            d2: 22,
        },
        {
            name: "Xử Thử",
            icon: "term-autumn-cool.svg",
            season: "Mùa Thu • Hành Kim",
            meaning: "Dứt nắng nóng (Mưa ngâu) — Cái oi bức mùa hè chấm dứt, nhường chỗ cho tiết trời thu mát mẻ.",
            advice: "Rất tốt cho việc nghỉ ngơi phục hồi sức lực, gắn kết gia đình và sắp xếp lại công việc.",
            m1: 8,
            d1: 23,
            m2: 9,
            d2: 7,
        },
        {
            name: "Bạch Lộ",
            icon: "term-dew.svg",
            season: "Mùa Thu • Hành Kim",
            meaning: "Sương trắng — Đêm về se lạnh khiến hơi nước ngưng tụ thành những giọt sương trắng trên lá.",
            advice: "Nên giữ ấm khi sáng sớm, thuận lợi cho việc học hành, thi cử và sáng tạo.",
            m1: 9,
            d1: 8,
            m2: 9,
            d2: 22,
        },
        {
            name: "Thu Phân",
            icon: "term-autumn-day-night.svg",
            season: "Mùa Thu • Hành Kim",
            meaning: "Giữa thu cân bằng — Thời lượng ngày và đêm bằng nhau, tiết trời thu trong trẻo nhất trong năm.",
            advice: "Đại lợi cho việc hội họp, đoàn viên, ký kết giao ước và thưởng ngoạn mùa thu.",
            m1: 9,
            d1: 23,
            m2: 10,
            d2: 7,
        },
        {
            name: "Hàn Lộ",
            icon: "term-cold-dew.svg",
            season: "Cuối Thu • Hành Kim",
            meaning: "Sương lạnh — Khí trời chuyển lạnh sâu hơn, sương đêm ngưng tụ dày và lạnh buốt trên cây cỏ.",
            advice: "Hợp thu vén tài sản, củng cố nội lực và chăm sóc hệ hô hấp khi giao mùa.",
            m1: 10,
            d1: 8,
            m2: 10,
            d2: 22,
        },
        {
            name: "Sương Giáng",
            icon: "term-frost.svg",
            season: "Cuối Thu • Hành Kim",
            meaning: "Sương mù & Giá lạnh — Tiết khí cuối cùng của mùa thu trước khi bước sang mùa đông.",
            advice: "Nên hoàn tất các kế hoạch mùa thu, chuẩn bị tích trữ nguồn lực cho mùa đông.",
            m1: 10,
            d1: 23,
            m2: 11,
            d2: 6,
        },
        {
            name: "Lập Đông",
            icon: "term-winter-snow.svg",
            season: "Mùa Đông • Hành Thủy",
            meaning: "Bắt đầu mùa đông — Gió mùa đông bắc tràn về, vạn vật thu mình tích trữ năng lượng.",
            advice: "Rất tốt cho việc bồi bổ sức khỏe, cất trữ tài sản và sum họp gia đình ấm cúng.",
            m1: 11,
            d1: 7,
            m2: 11,
            d2: 21,
        },
        {
            name: "Tiểu Tuyết",
            icon: "term-winter-minor-snow.svg",
            season: "Mùa Đông • Hành Thủy",
            meaning: "Tuyết nhẹ / Rét đầu đông — Nhiệt độ giảm thấp, không khí khô lạnh rõ rệt.",
            advice: "Thích hợp nghiên cứu chuyên sâu, làm việc nội bộ và giữ ấm cơ thể.",
            m1: 11,
            d1: 22,
            m2: 12,
            d2: 6,
        },
        {
            name: "Đại Tuyết",
            icon: "term-winter-major-snow.svg",
            season: "Mùa Đông • Hành Thủy",
            meaning: "Tuyết dày / Rét đậm — Hàn khí bao phủ mạnh mẽ, đêm dài ngày ngắn.",
            advice: "Nên hạn chế đi xa mạo hiểm, ưu tiên củng cố tài chính và chăm sóc người thân.",
            m1: 12,
            d1: 7,
            m2: 12,
            d2: 21,
        },
        {
            name: "Đông Chí",
            icon: "term-winter-solstice.svg",
            season: "Mùa Đông • Hành Thủy",
            meaning: "Giữa đông — Ngày ngắn nhất và đêm dài nhất trong năm; từ sau Đông Chí dương khí bắt đầu hồi sinh.",
            advice: "Thời điểm cát lành để cầu phúc, đoàn viên và chuẩn bị đón vận hội mới.",
            m1: 12,
            d1: 22,
            m2: 1,
            d2: 4,
        },
    ];

    // Hàm tạo HTML Bento Tooltip 3 tầng (Tách câu "Bấm để mở..." xuống dòng dưới thành Tag riêng biệt)
    const buildBentoTooltipHtml = (title, desc, tagLabel) => `
        <span class="bento-tooltip" role="tooltip">
            <strong class="bento-tooltip__title">✦ ${title}</strong>
            <span class="bento-tooltip__desc">${desc}</span>
            <span class="bento-tooltip__tag">${tagLabel} &#8594;</span>
        </span>
    `;

    const buildWuXingSvgHtml = (activeElementsSet, hourElementKey, isLarge = false) => {
        const cls = (elKey) => {
            const state = activeElementsSet.has(elKey) ? "is-active" : "is-dimmed";
            const hourCls = elKey === hourElementKey ? "is-hour-element" : "";
            return `${state} ${hourCls}`.trim();
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

    const getSolarTermRangeInfo = (dd, mm, yy) => {
        const code = mm * 100 + dd;
        for (const t of SOLAR_TERMS_24) {
            const c1 = t.m1 * 100 + t.d1;
            const c2 = t.m2 * 100 + t.d2;
            if (c1 <= c2) {
                if (code >= c1 && code <= c2) {
                    return {
                        ...t,
                        start: `${pad(t.d1)}/${pad(t.m1)}/${yy}`,
                        end: `${pad(t.d2)}/${pad(t.m2)}/${yy}`,
                    };
                }
            } else if (code >= c1 || code <= c2) {
                const startYear = mm === 1 ? yy - 1 : yy;
                const endYear = mm === 12 ? yy + 1 : yy;
                return {
                    ...t,
                    start: `${pad(t.d1)}/${pad(t.m1)}/${startYear}`,
                    end: `${pad(t.d2)}/${pad(t.m2)}/${endYear}`,
                };
            }
        }
        return {
            ...SOLAR_TERMS_24[20],
            start: `07/11/${yy}`,
            end: `21/11/${yy}`,
        };
    };

    // Đóng / Mở Bento Modal Giải Nghĩa Thuật Ngữ (Dùng chung cho cả Hướng xuất hành, Tiết khí, Lục diệu & Bảng 12 Giờ)
    const closeDayTermModal = () => {
        const modal = document.getElementById("day-term-modal");
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
    };

    const openDayTermModal = (colType, hourIdx, seoHref, extraKey = "") => {
        const modal = document.getElementById("day-term-modal");
        if (!modal) return;

        const catEl = document.getElementById("day-term-modal-category");
        const titleEl = document.getElementById("day-term-modal-title");
        const visualEl = document.getElementById("day-term-modal-visual");
        const pillsEl = document.getElementById("day-term-modal-pills");
        const descEl = document.getElementById("day-term-modal-desc");
        const adviceEl = document.getElementById("day-term-modal-advice");
        const seoLinkEl = document.getElementById("day-term-modal-seo-link");
        const seoLabelEl = document.getElementById("day-term-modal-seo-label");

        visualEl.classList.remove("is-zodiac-filtered");

        // 1. Mở từ khối Hướng Xuất Hành (Hỷ Thần / Tài Thần / Hạc Thần)
        if (colType === "direction" && currentDayContext) {
            const deity = DIRECTION_DEITIES[extraKey] || DIRECTION_DEITIES.hy;
            const dirVal = currentDayContext.directions[extraKey] || "Đông Nam";
            catEl.textContent = "Hướng Xuất Hành Theo Thiên Can";
            titleEl.textContent = `${deity.name} • Hướng ${dirVal}`;
            visualEl.classList.add("is-zodiac-filtered");
            visualEl.innerHTML = `
                <img src="${deity.icon}" alt="" />
                <strong>Hướng ${dirVal}</strong>
            `;
            pillsEl.innerHTML = `
                <span class="day-term-modal__pill day-term-modal__pill--highlight">${deity.status}</span>
                <span class="day-term-modal__pill">Ngày: ${currentDayContext.dayCanChi}</span>
                <span class="day-term-modal__pill">Phương vị: ${dirVal}</span>
            `;
            descEl.textContent = deity.desc;
            adviceEl.textContent = `${deity.advice} (Trong ngày ${currentDayContext.dayCanChi} - ${currentDayContext.dayNapAm}, hướng ${deity.name} nằm tại phương ${dirVal}).`;
            seoLabelEl.textContent = `Tra cứu Hướng Xuất Hành & Cát Thần`;
        }
        // 2. Mở từ khối Thông Tin Tiết Khí (24 Tiết Khí)
        else if (colType === "solarterm" && currentDayContext) {
            const term = currentDayContext.termRange;
            catEl.textContent = "Nhị Thập Tứ Tiết Khí";
            titleEl.textContent = `Tiết ${term.name}`;
            visualEl.classList.add("is-zodiac-filtered");
            visualEl.innerHTML = `
                <img src="./assets/icons/weather/${term.icon}" alt="" />
                <strong>${term.season}</strong>
            `;
            pillsEl.innerHTML = `
                <span class="day-term-modal__pill day-term-modal__pill--highlight">${term.season}</span>
                <span class="day-term-modal__pill">Bắt đầu: ${term.start}</span>
                <span class="day-term-modal__pill">Kết thúc: ${term.end}</span>
            `;
            descEl.textContent = `Tiết ${term.name}: ${term.meaning}`;
            adviceEl.textContent = term.advice;
            seoLabelEl.textContent = `Xem bảng 24 Tiết Khí trong năm`;
        }
        // 3. Mở từ Bảng 12 Canh Giờ hoặc Lưới 12 ô Khổng Minh Lục Diệu
        else {
            const rowData = currentDayHoursData[hourIdx];
            if (!rowData) return;

            const daoImgPath = rowData.isHoangDao
                ? "./assets/icons/fengshui/hoang-dao.svg"
                : "./assets/icons/fengshui/hac-dao.svg";

            if (colType === "time") {
                catEl.textContent = "Canh Giờ Âm Lịch";
                titleEl.textContent = `Giờ ${rowData.hCanChi} (${rowData.h.range})`;
                visualEl.classList.add("is-zodiac-filtered");
                visualEl.innerHTML = `
                    <img src="./assets/icons/zodiac/${rowData.h.icon}" alt="" />
                    <strong>${rowData.h.animalName}</strong>
                `;
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">
                        <img src="${daoImgPath}" alt="" />
                        <span>${rowData.isHoangDao ? "Giờ Hoàng Đạo (Tốt)" : "Giờ Hắc Đạo (Xấu)"}</span>
                    </span>
                    <span class="day-term-modal__pill">Hợp mệnh: ${rowData.harmonyObj.good}</span>
                    <span class="day-term-modal__pill">Kỵ mệnh: ${rowData.harmonyObj.bad}</span>
                `;
                descEl.textContent = `Canh giờ ${rowData.hCanChi} bắt đầu từ ${rowData.h.range}. Trong ngày ${rowData.dayCanChi}, đây là khung giờ ${rowData.isHoangDao ? "Hoàng Đạo (Cát thần bảo hộ, thuận lợi cho việc quan trọng)" : "Hắc Đạo (Nên thận trọng khi khởi sự việc lớn)"}.`;
                adviceEl.textContent = `${rowData.h.baguaAdvice} • ${rowData.harmonyObj.note}`;
                seoLabelEl.textContent = "Xem trên Đồng hồ 12 Canh Giờ";
            } else if (colType === "napam") {
                catEl.textContent = "Nạp Âm Lục Thập Hoa Giáp";
                titleEl.textContent = rowData.hNapAm;
                visualEl.innerHTML = `
                    <img src="./assets/icons/${rowData.elemIcon}" alt="" />
                    <strong>${rowData.elemShort}</strong>
                `;
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">${rowData.elemShort}</span>
                    <span class="day-term-modal__pill">Hợp mệnh: ${rowData.harmonyObj.good}</span>
                    <span class="day-term-modal__pill">Kỵ mệnh: ${rowData.harmonyObj.bad}</span>
                `;
                descEl.textContent = rowData.napAmObj.meaning;
                adviceEl.textContent = `Giờ ${rowData.hCanChi} mang nạp âm ${rowData.hNapAm} (${rowData.elemShort}). ${rowData.harmonyObj.note}`;
                seoLabelEl.textContent = `Tìm hiểu chuyên sâu về ${rowData.hNapAm}`;
            } else if (colType === "lucdieu") {
                catEl.textContent = "Khổng Minh Lục Diệu";
                titleEl.textContent = `Sao ${rowData.starObj.name} • Giờ ${rowData.hCanChi}`;
                visualEl.classList.add("is-zodiac-filtered");
                visualEl.innerHTML = `
                    <img src="${rowData.starObj.icon}" alt="" />
                    <strong>Giờ ${rowData.h.chi} (${rowData.h.short}h)</strong>
                `;
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">${rowData.starObj.isGood ? "Cát Tinh (Tốt)" : "Hung Tinh (Xấu)"}</span>
                    <span class="day-term-modal__pill">Hợp mệnh: ${rowData.harmonyObj.good}</span>
                    <span class="day-term-modal__pill">Lưu ý mệnh: ${rowData.harmonyObj.bad}</span>
                `;
                descEl.textContent = rowData.starObj.desc;
                adviceEl.textContent = `${rowData.starObj.advice} • Ngũ hành giờ thuộc ${rowData.elemShort}: Rất tốt cho người mệnh ${rowData.harmonyObj.good}, người mệnh ${rowData.harmonyObj.bad} nên lưu ý.`;
                seoLabelEl.textContent = `Tra cứu thuật Khổng Minh Lục Diệu`;
            } else if (colType === "wuxing") {
                catEl.textContent = "Bát Tự Ngũ Hành Tứ Trụ";
                titleEl.textContent = `Ngũ Hành Giờ ${rowData.hCanChi}`;
                visualEl.innerHTML = buildWuXingSvgHtml(rowData.activeElementsForHour, rowData.hourElementKey, true);
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">Hội tụ (Sáng): ${rowData.activeNames}</span>
                    <span class="day-term-modal__pill">Đang khuyết (Chìm): ${rowData.missingNames}</span>
                `;
                descEl.textContent = `Tứ Trụ tại thời điểm này gồm: Năm ${rowData.yearCanChi} • Tháng ${rowData.monthCanChi} • Ngày ${rowData.dayCanChi} • Giờ ${rowData.hCanChi}. Các đỉnh sáng trên biểu đồ là các hành xuất hiện trong Thiên Can của 4 trụ.`;
                adviceEl.textContent =
                    rowData.missingNames === "Không khuyết"
                        ? "Khung giờ này hội tụ đầy đủ Ngũ Hành cân bằng, rất tốt cho các hoạt động tổng hợp."
                        : `Khung giờ này đang khuyết hành ${rowData.missingNames}. Người có Dụng Thần hoặc bản mệnh hợp với ${rowData.harmonyObj.good} sẽ rất vượng khí khi hành sự vào giờ này.`;
                seoLabelEl.textContent = "Lập Lá Số Bát Tự Chuyên Sâu";
            } else {
                catEl.textContent = "Phương Vị Bát Quái & Linh Vật";
                titleEl.textContent = `Quẻ ${rowData.baguaName} • Hướng ${rowData.baguaDir}`;
                visualEl.classList.add("is-zodiac-filtered");
                visualEl.innerHTML = `
                    <img src="./assets/icons/zodiac/${rowData.h.icon}" alt="" />
                    <strong>${rowData.h.animalName}</strong>
                `;
                pillsEl.innerHTML = `
                    <span class="day-term-modal__pill day-term-modal__pill--highlight">Quẻ ${rowData.baguaName}</span>
                    <span class="day-term-modal__pill">Phương vị: ${rowData.baguaDir}</span>
                    <span class="day-term-modal__pill">Hợp mệnh: ${rowData.harmonyObj.good}</span>
                `;
                descEl.textContent = rowData.h.baguaDesc;
                adviceEl.textContent = `${rowData.h.baguaAdvice} (${rowData.harmonyObj.note})`;
                seoLabelEl.textContent = `Tra cứu Bát Quái & 12 Linh Vật`;
            }
        }

        if (seoLinkEl) seoLinkEl.href = seoHref || "./utilities.html";
        modal.hidden = false;
        document.body.style.overflow = "hidden";
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

        // 2. CHUẨN BỊ DỮ LIỆU NGỮ CẢNH NGÀY & 12 CANH GIỜ (Tính sẵn Mệnh Hợp/Kỵ cho từng giờ)
        const sexagenaryIdx = (((6 * dayStemIdx - 5 * info.dayChiIdx) % 60) + 60) % 60;
        const hyDir = HY_THAN_BY_STEM[dayStemIdx] || "Tây Bắc";
        const taiDir = TAI_THAN_BY_STEM[dayStemIdx] || "Đông Nam";
        const hacDir = HAC_THAN_DIRECTIONS[Math.floor(sexagenaryIdx / 7) % 8] || "Chính Nam";
        const termRange = getSolarTermRangeInfo(sDay, sMonth, sYear);
        const dayLucDieuIdx = (info.lunarMonth + info.lunarDay - 2) % 6;
        const dayLucDieuObj = LUC_DIEU_6[dayLucDieuIdx] || LUC_DIEU_6[0];

        currentDayContext = {
            dayCanChi: info.dayCanChi,
            dayNapAm: info.dayNapAm,
            directions: { hy: hyDir, tai: taiDir, hac: hacDir },
            termRange,
        };

        const goodHourSet = new Set(info.goodHoursStr.split(",").map((s) => s.trim().split(" ")[0]));
        const baseThreeElements = [
            STEM_TO_ELEMENT[yearStemIdx],
            STEM_TO_ELEMENT[monthStemIdx],
            STEM_TO_ELEMENT[dayStemIdx],
        ];
        const allFiveKeys = ["fire", "earth", "metal", "water", "wood"];

        currentDayHoursData = HOUR_LABELS_12.map((h, hIdx) => {
            const hStemIdx = (ratHourStemIdx + hIdx) % 10;
            const hStemName = window.LunarEngine.THIEN_CAN[hStemIdx];
            const hCanChi = `${hStemName} ${h.chi}`;
            const hSexagenary = (((6 * hStemIdx - 5 * hIdx) % 60) + 60) % 60;
            const napAmObj = NAP_AM_30_INFO[Math.floor(hSexagenary / 2)] || NAP_AM_30_INFO[6];
            const hNapAm = napAmObj.name;

            let elemIcon = "earth.svg";
            let elemShort = "Hành Thổ";
            let napAmElementKey = "earth";
            if (hNapAm.endsWith("Kim")) {
                elemIcon = "metal.svg";
                elemShort = "Hành Kim";
                napAmElementKey = "metal";
            } else if (hNapAm.endsWith("Mộc")) {
                elemIcon = "wood.svg";
                elemShort = "Hành Mộc";
                napAmElementKey = "wood";
            } else if (hNapAm.endsWith("Thủy")) {
                elemIcon = "water.svg";
                elemShort = "Hành Thủy";
                napAmElementKey = "water";
            } else if (hNapAm.endsWith("Hỏa")) {
                elemIcon = "fire.svg";
                elemShort = "Hành Hỏa";
                napAmElementKey = "fire";
            }

            const harmonyObj = ELEMENT_HARMONY_MAP[napAmElementKey] || ELEMENT_HARMONY_MAP.earth;
            const starObj = LUC_DIEU_6[(dayLucDieuIdx + hIdx) % 6];
            const isHoangDao = goodHourSet.has(h.chi);
            const fortuneKey = isHoangDao ? "good" : "bad";

            const hourElementKey = STEM_TO_ELEMENT[hStemIdx];
            const activeElementsForHour = new Set([...baseThreeElements, hourElementKey]);

            const activeNames = allFiveKeys
                .filter((k) => activeElementsForHour.has(k))
                .map((k) => ELEMENT_VN_NAME[k])
                .join(", ");
            const missingNames =
                allFiveKeys
                    .filter((k) => !activeElementsForHour.has(k))
                    .map((k) => ELEMENT_VN_NAME[k])
                    .join(", ") || "Không khuyết";

            const baguaParts = h.bagua.split("•");
            const baguaName = baguaParts[0].trim();
            const baguaDir = baguaParts[1].trim();

            return {
                h,
                hIdx,
                hStemName,
                hCanChi,
                napAmObj,
                hNapAm,
                elemIcon,
                elemShort,
                napAmElementKey,
                harmonyObj,
                starObj,
                isHoangDao,
                fortuneKey,
                hourElementKey,
                activeElementsForHour,
                activeNames,
                missingNames,
                baguaName,
                baguaDir,
                yearCanChi: info.yearCanChi,
                monthCanChi: info.monthCanChi,
                dayCanChi: info.dayCanChi,
                dayNapAm: info.dayNapAm,
            };
        });

        // 3. CỘT PHẢI — KHỐI 1: HƯỚNG XUẤT HÀNH (3 VỊ THẦN CÓ ICON SVG + WATERMARK + TOOLTIP TAG)
        const dirGridEl = document.getElementById("day-directions-grid");
        if (dirGridEl) {
            const dirItems = [
                { code: "hy", mod: "hy", dirVal: hyDir },
                { code: "tai", mod: "tai", dirVal: taiDir },
                { code: "hac", mod: "hac", dirVal: hacDir },
            ];

            dirGridEl.innerHTML = dirItems
                .map(({ code, mod, dirVal }) => {
                    const d = DIRECTION_DEITIES[code];
                    return `
                        <a
                            href="./utilities.html?direction=${d.key}"
                            class="day-dir-box day-dir-box--${mod} has-bento-tooltip"
                            data-col-modal="direction"
                            data-extra-key="${code}"
                        >
                            <span class="day-dir-box__card-bg" aria-hidden="true">
                                <img src="${d.icon}" alt="" class="day-dir-box__watermark" />
                            </span>

                            <div class="day-dir-box__top">
                                <span class="day-dir-box__icon-wrap">
                                    <img src="${d.icon}" alt="" aria-hidden="true" />
                                </span>
                                <span class="day-dir-box__label">${d.name} (${code === "hac" ? "Xấu" : "Tốt"})</span>
                            </div>

                            <div class="day-dir-box__body">
                                <strong class="day-dir-box__value">${dirVal}</strong>
                                <span class="day-dir-box__sub">${d.sub}</span>
                            </div>

                            ${buildBentoTooltipHtml(
                                `${d.name} • Hướng ${dirVal}`,
                                `${d.desc} ${d.advice}`,
                                `✦ Bấm để mở thẻ giải nghĩa ${d.name}`,
                            )}
                        </a>
                    `;
                })
                .join("");
        }

        // 4. CỘT PHẢI — KHỐI 2: THÔNG TIN TIẾT KHÍ (24 ICON WEATHER + WATERMARK + TOOLTIP TAG)
        const termSubEl = document.getElementById("day-term-summary-sub");
        if (termSubEl) {
            termSubEl.textContent = `Tiết ${termRange.name} (${termRange.season}) — ${termRange.meaning}`;
        }

        const termGridEl = document.getElementById("day-solarterm-grid");
        if (termGridEl) {
            const termIconPath = `./assets/icons/weather/${termRange.icon}`;
            const termHref = `./utilities.html?term=${toSlug(termRange.name)}`;

            const termBoxes = [
                {
                    label: "Tiết khí hiện tại",
                    val: termRange.name,
                    sub: termRange.season,
                    isPrimary: true,
                    tipTitle: `Tiết ${termRange.name}`,
                    tipDesc: `${termRange.meaning} ${termRange.advice}`,
                },
                {
                    label: "Ngày bắt đầu",
                    val: termRange.start,
                    sub: `Khởi tiết ${termRange.name}`,
                    isPrimary: false,
                    tipTitle: `Khởi đầu tiết ${termRange.name}`,
                    tipDesc: `Tiết ${termRange.name} bắt đầu từ ngày ${termRange.start}. ${termRange.meaning}`,
                },
                {
                    label: "Ngày kết thúc",
                    val: termRange.end,
                    sub: "Chuyển sang tiết kế tiếp",
                    isPrimary: false,
                    tipTitle: `Chu kỳ tiết ${termRange.name}`,
                    tipDesc: `Tiết ${termRange.name} kéo dài từ ${termRange.start} đến hết ngày ${termRange.end}. ${termRange.advice}`,
                },
            ];

            termGridEl.innerHTML = termBoxes
                .map(
                    (b) => `
                        <a
                            href="${termHref}"
                            class="day-solarterm-box ${b.isPrimary ? "day-solarterm-box--primary" : ""} has-bento-tooltip"
                            data-col-modal="solarterm"
                        >
                            <span class="day-solarterm-box__card-bg" aria-hidden="true">
                                <img src="${termIconPath}" alt="" class="day-solarterm-box__watermark" />
                            </span>

                            <div class="day-solarterm-box__top">
                                <span class="day-solarterm-box__icon-wrap">
                                    <img src="${termIconPath}" alt="" aria-hidden="true" />
                                </span>
                                <span class="day-solarterm-box__label">${b.label}</span>
                            </div>

                            <div class="day-solarterm-box__body">
                                <strong class="day-solarterm-box__val">${b.val}</strong>
                                <span class="day-solarterm-box__sub">${b.sub}</span>
                            </div>

                            ${buildBentoTooltipHtml(
                                b.tipTitle,
                                b.tipDesc,
                                `✦ Bấm để mở thẻ giải nghĩa Tiết ${termRange.name}`,
                            )}
                        </a>
                    `,
                )
                .join("");
        }

        // 5. CỘT PHẢI — KHỐI 3: KHỔNG MINH LỤC DIỆU (6 ICON SVG + HỢP MỆNH NGŨ HÀNH + TOOLTIP TAG)
        document.getElementById("day-lucdieu-day-badge").textContent = dayLucDieuObj.name;
        document.getElementById("day-lucdieu-summary").textContent =
            `Ngày ${dayLucDieuObj.name} — ${dayLucDieuObj.desc}`;

        const lucDieuGridEl = document.getElementById("day-lucdieu-grid");
        if (lucDieuGridEl) {
            lucDieuGridEl.innerHTML = currentDayHoursData
                .map((rowData) => {
                    const { h, hIdx, hCanChi, starObj, harmonyObj, elemShort } = rowData;
                    return `
                        <a
                            href="./utilities.html?lucdieu=${starObj.slug}"
                            class="day-lucdieu-cell ${starObj.isGood ? "day-lucdieu-cell--good" : "day-lucdieu-cell--bad"} has-bento-tooltip"
                            data-col-modal="lucdieu"
                            data-hour-idx="${hIdx}"
                        >
                            <span class="day-lucdieu-cell__card-bg" aria-hidden="true">
                                <img src="${starObj.icon}" alt="" class="day-lucdieu-cell__watermark" />
                            </span>

                            <div class="day-lucdieu-cell__head">
                                <strong class="day-lucdieu-cell__name">${starObj.name}</strong>
                                <img src="${starObj.icon}" alt="" aria-hidden="true" class="day-lucdieu-cell__icon" />
                            </div>

                            <span class="day-lucdieu-cell__time">Giờ ${h.chi} (${h.short}h)</span>

                            <span class="day-lucdieu-cell__harmony">
                                Hợp: <strong>${harmonyObj.good}</strong>
                            </span>

                            ${buildBentoTooltipHtml(
                                `Sao ${starObj.name} • Giờ ${hCanChi}`,
                                `${starObj.desc} Giờ thuộc ${elemShort}: Tốt cho người mệnh ${harmonyObj.good}, lưu ý mệnh ${harmonyObj.bad}.`,
                                `✦ Bấm để xem luận giải cung ${starObj.name}`,
                            )}
                        </a>
                    `;
                })
                .join("");
        }

        // 6. CỘT PHẢI — KHỐI 4: MẶT TRỜI 4 MIỀN (CÓ ICON MỌC sun-rise.svg & LẶN sun-set.svg)
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
                            <span class="day-sun-table__time" role="cell">
                                <img
                                    src="./assets/icons/weather/sun-rise.svg"
                                    alt=""
                                    aria-hidden="true"
                                    class="day-sun-table__time-icon"
                                />
                                <span>${r.riseStr}</span>
                            </span>
                            <span class="day-sun-table__time" role="cell">
                                <img
                                    src="./assets/icons/weather/sun-set.svg"
                                    alt=""
                                    aria-hidden="true"
                                    class="day-sun-table__time-icon"
                                />
                                <span>${r.setStr}</span>
                            </span>
                        </div>
                    `,
                )
                .join("");
        }

        // 7. TẦNG DƯỚI: 12 CANH GIỜ (THAY EMOJI BẰNG SVG hoang-dao.svg / hac-dao.svg + TOOLTIP TAG TÁCH DÒNG)
        const hourlyListEl = document.getElementById("day-hourly-list");
        if (hourlyListEl) {
            hourlyListEl.innerHTML = currentDayHoursData
                .map((rowData) => {
                    const {
                        h,
                        hIdx,
                        hCanChi,
                        napAmObj,
                        hNapAm,
                        elemIcon,
                        elemShort,
                        harmonyObj,
                        starObj,
                        isHoangDao,
                        fortuneKey,
                        hourElementKey,
                        activeElementsForHour,
                        activeNames,
                        missingNames,
                        baguaName,
                        baguaDir,
                    } = rowData;

                    const wuxingSvg = buildWuXingSvgHtml(activeElementsForHour, hourElementKey, false);
                    const daoIconPath = isHoangDao
                        ? "./assets/icons/fengshui/hoang-dao.svg"
                        : "./assets/icons/fengshui/hac-dao.svg";

                    return `
                        <article class="day-hour-row" data-hour-fortune="${fortuneKey}">
                            <!-- CỘT 1: CANH GIỜ -->
                            <a
                                href="./clock.html?branch=${h.key}"
                                class="day-hour-row__col-link day-hour-row__col-time has-bento-tooltip"
                                data-col-modal="time"
                                data-hour-idx="${hIdx}"
                            >
                                <strong>${hCanChi}</strong>
                                <span>${h.range}</span>
                                ${buildBentoTooltipHtml(
                                    `Giờ ${hCanChi} (${h.range})`,
                                    `${isHoangDao ? "Giờ Hoàng Đạo (Cát thần bảo hộ)." : "Giờ Hắc Đạo (Nên cẩn trọng việc lớn)."} Hợp mệnh ${harmonyObj.good}, kỵ mệnh ${harmonyObj.bad}.`,
                                    "✦ Bấm để mở thẻ luận giải Canh Giờ",
                                )}
                            </a>

                            <!-- CỘT 2: NẠP ÂM NGŨ HÀNH -->
                            <a
                                href="./utilities.html?napam=${toSlug(hNapAm)}"
                                class="day-hour-row__col-link day-hour-row__col-napam has-bento-tooltip"
                                data-col-modal="napam"
                                data-hour-idx="${hIdx}"
                            >
                                <span class="day-hour-row__napam-icon-box">
                                    <img src="./assets/icons/${elemIcon}" alt="" aria-hidden="true" />
                                </span>
                                <span class="day-hour-row__napam-info">
                                    <strong>${hNapAm}</strong>
                                    <small>${elemShort} • Hợp: ${harmonyObj.good}</small>
                                </span>
                                ${buildBentoTooltipHtml(
                                    hNapAm,
                                    `${napAmObj.meaning} Rất tốt cho người mệnh ${harmonyObj.good}.`,
                                    "✦ Bấm để mở thẻ giải nghĩa Nạp Âm",
                                )}
                            </a>

                            <!-- CỘT 3: KHỔNG MINH LỤC DIỆU & ICON SVG HOÀNG/HẮC ĐẠO -->
                            <a
                                href="./utilities.html?lucdieu=${starObj.slug}"
                                class="day-hour-row__col-link day-hour-row__col-lucdieu has-bento-tooltip"
                                data-col-modal="lucdieu"
                                data-hour-idx="${hIdx}"
                            >
                                <span class="day-hour-row__badge ${starObj.isGood ? "day-hour-row__badge--good" : "day-hour-row__badge--bad"}">
                                    <img src="${starObj.icon}" alt="" aria-hidden="true" />
                                    <span>${starObj.name}</span>
                                </span>
                                <span class="day-hour-row__dao-sub">
                                    <img src="${daoIconPath}" alt="" aria-hidden="true" class="day-hour-row__dao-icon" />
                                    <span>${isHoangDao ? "Giờ Hoàng Đạo" : "Giờ Hắc Đạo"}</span>
                                </span>
                                ${buildBentoTooltipHtml(
                                    `Sao ${starObj.name}`,
                                    `${starObj.desc} ${starObj.advice}`,
                                    "✦ Bấm để mở thẻ lời khuyên Lục Diệu",
                                )}
                            </a>

                            <!-- CỘT 4: VÒNG SVG NGŨ HÀNH ĐỘNG -->
                            <a
                                href="./bazi.html?date=${isoDateStr}&hour=${h.key}"
                                class="day-hour-row__col-link day-hour-row__col-wuxing has-bento-tooltip"
                                data-col-modal="wuxing"
                                data-hour-idx="${hIdx}"
                            >
                                ${wuxingSvg}
                                ${buildBentoTooltipHtml(
                                    `Ngũ Hành Tứ Trụ Giờ ${hCanChi}`,
                                    `Hội tụ (Sáng): ${activeNames} • Đang khuyết (Chìm): ${missingNames}.`,
                                    "✦ Bấm để mở biểu đồ Bát Tự Tứ Trụ",
                                )}
                            </a>

                            <!-- CỘT 5: LINH VẬT & QUẺ BÁT QUÁI -->
                            <a
                                href="./utilities.html?bagua=${toSlug(baguaName)}"
                                class="day-hour-row__col-link day-hour-row__col-bagua has-bento-tooltip"
                                data-col-modal="bagua"
                                data-hour-idx="${hIdx}"
                            >
                                <span class="day-hour-row__bagua-ring">
                                    <img src="./assets/icons/zodiac/${h.icon}" alt="" aria-hidden="true" />
                                </span>
                                <span class="day-hour-row__bagua-text">
                                    <strong>Quẻ ${baguaName}</strong>
                                    <small>Hướng ${baguaDir}</small>
                                </span>
                                ${buildBentoTooltipHtml(
                                    `Quẻ ${baguaName} • Hướng ${baguaDir}`,
                                    `${h.baguaDesc} (${h.animalName}).`,
                                    "✦ Bấm để mở thẻ phương vị Bát Quái",
                                )}
                            </a>
                        </article>
                    `;
                })
                .join("");

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
        const mainDayContainer = document.getElementById("main");

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

        // Sự kiện Click Hybrid ủy quyền trên toàn trang Ngày (Bắt cả Hướng xuất hành, Tiết khí, Lục diệu & Bảng 12 Giờ)
        if (mainDayContainer) {
            mainDayContainer.addEventListener("click", (e) => {
                const linkEl = e.target.closest("[data-col-modal]");
                if (!linkEl) return;
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;

                e.preventDefault();
                const colType = linkEl.dataset.colModal;
                const hourIdx = Number(linkEl.dataset.hourIdx || 0);
                const extraKey = linkEl.dataset.extraKey || "";
                const seoHref = linkEl.getAttribute("href");
                openDayTermModal(colType, hourIdx, seoHref, extraKey);
            });
        }

        // Sự kiện đóng Bento Modal Quick-View
        document.getElementById("day-term-modal-close")?.addEventListener("click", closeDayTermModal);
        document.getElementById("day-term-modal-cancel")?.addEventListener("click", closeDayTermModal);
        document.getElementById("day-term-modal-backdrop")?.addEventListener("click", closeDayTermModal);

        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("day-term-modal");
            if (e.key === "Escape" && modal && !modal.hidden) {
                closeDayTermModal();
            }
        });

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