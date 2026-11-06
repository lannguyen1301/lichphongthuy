// assets/js/lunar-engine.js
// Lớp Adapter trung gian (Service Layer): Tự động tích hợp @dqcai/vn-lunar, lunar-javascript (window.Solar)
// và thuật toán Hồ Ngọc Đức (UTC+7). Khi lên React/Node.js chỉ cần import thư viện vào đầu file này.
(() => {
    const viWeekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "long" });
    const enWeekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
    const enMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

    const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    const ZODIAC_FILES = [
        "mouse",
        "buffalo",
        "tiger",
        "cat",
        "dragon",
        "snake",
        "horse",
        "goat",
        "monkey",
        "rooster",
        "dog",
        "pig",
    ];

    const ZODIAC_BRANCHES = [
        {
            index: 0,
            key: "ty",
            vn: "Tý",
            han: "子",
            range: "23:00 - 01:00",
            shortRange: "Tý (23-1)",
            icon: "mouse.svg",
        },
        {
            index: 1,
            key: "suu",
            vn: "Sửu",
            han: "丑",
            range: "01:00 - 03:00",
            shortRange: "Sửu (1-3)",
            icon: "buffalo.svg",
        },
        {
            index: 2,
            key: "dan",
            vn: "Dần",
            han: "寅",
            range: "03:00 - 05:00",
            shortRange: "Dần (3-5)",
            icon: "tiger.svg",
        },
        {
            index: 3,
            key: "mao",
            vn: "Mão",
            han: "卯",
            range: "05:00 - 07:00",
            shortRange: "Mão (5-7)",
            icon: "cat.svg",
        },
        {
            index: 4,
            key: "thin",
            vn: "Thìn",
            han: "辰",
            range: "07:00 - 09:00",
            shortRange: "Thìn (7-9)",
            icon: "dragon.svg",
        },
        {
            index: 5,
            key: "ty_snake",
            vn: "Tỵ",
            han: "巳",
            range: "09:00 - 11:00",
            shortRange: "Tỵ (9-11)",
            icon: "snake.svg",
        },
        {
            index: 6,
            key: "ngo",
            vn: "Ngọ",
            han: "午",
            range: "11:00 - 13:00",
            shortRange: "Ngọ (11-13)",
            icon: "horse.svg",
        },
        {
            index: 7,
            key: "mui",
            vn: "Mùi",
            han: "未",
            range: "13:00 - 15:00",
            shortRange: "Mùi (13-15)",
            icon: "goat.svg",
        },
        {
            index: 8,
            key: "than",
            vn: "Thân",
            han: "申",
            range: "15:00 - 17:00",
            shortRange: "Thân (15-17)",
            icon: "monkey.svg",
        },
        {
            index: 9,
            key: "dau",
            vn: "Dậu",
            han: "酉",
            range: "17:00 - 19:00",
            shortRange: "Dậu (17-19)",
            icon: "rooster.svg",
        },
        {
            index: 10,
            key: "tuat",
            vn: "Tuất",
            han: "戌",
            range: "19:00 - 21:00",
            shortRange: "Tuất (19-21)",
            icon: "dog.svg",
        },
        {
            index: 11,
            key: "hoi",
            vn: "Hợi",
            han: "亥",
            range: "21:00 - 23:00",
            shortRange: "Hợi (21-23)",
            icon: "pig.svg",
        },
    ];

    const VI_TRADITIONAL_SOLAR_MONTHS = [
        "",
        "THÁNG MỘT",
        "THÁNG HAI",
        "THÁNG BA",
        "THÁNG TƯ",
        "THÁNG NĂM",
        "THÁNG SÁU",
        "THÁNG BẢY",
        "THÁNG TÁM",
        "THÁNG CHÍN",
        "THÁNG MƯỜI",
        "THÁNG MƯỜI MỘT",
        "THÁNG MƯỜI HAI",
    ];

    const VI_TRADITIONAL_LUNAR_MONTHS = [
        "",
        "THÁNG GIÊNG",
        "THÁNG HAI",
        "THÁNG BA",
        "THÁNG TƯ",
        "THÁNG NĂM",
        "THÁNG SÁU",
        "THÁNG BẢY",
        "THÁNG TÁM",
        "THÁNG CHÍN",
        "THÁNG MƯỜI",
        "THÁNG MƯỜI MỘT",
        "THÁNG CHẠP",
    ];

    const GOOD_HOUR_INDICES = {
        0: [0, 1, 3, 6, 8, 9],
        6: [0, 1, 3, 6, 8, 9],
        1: [2, 3, 5, 8, 10, 11],
        7: [2, 3, 5, 8, 10, 11],
        2: [0, 1, 4, 5, 7, 10],
        8: [0, 1, 4, 5, 7, 10],
        3: [0, 2, 3, 6, 7, 9],
        9: [0, 2, 3, 6, 7, 9],
        4: [2, 4, 5, 8, 9, 11],
        10: [2, 4, 5, 8, 9, 11],
        5: [1, 4, 6, 7, 10, 11],
        11: [1, 4, 6, 7, 10, 11],
    };

    const NAP_AM_LIST = [
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

    const TRUC_LIST = [
        { name: "Kiến", desc: "Tốt cho xuất hành, khai trương, giá thú; kỵ động thổ, đào đất." },
        { name: "Trừ", desc: "Tốt cho cầu an, dọn dẹp, giải trừ điều xấu, khám chữa bệnh." },
        { name: "Mãn", desc: "Tốt cho tế tự, cầu tài, khai trương, xuất hành, sửa kho." },
        { name: "Bình", desc: "Tốt cho tu tạo, sửa chữa, nhập trạch, cưới gả, giao dịch." },
        { name: "Định", desc: "Tốt cho ký kết, thương lượng, cầu danh, nhập học, làm chuồng trại." },
        { name: "Chấp", desc: "Tốt cho xây dựng, tu bổ, tuyển dụng; kỵ xuất hành đi xa." },
        { name: "Phá", desc: "Chỉ hợp dỡ bỏ nhà cũ, chữa bệnh; kỵ khai trương, cưới hỏi." },
        { name: "Nguy", desc: "Xấu cho mọi việc lớn. Nên cẩn thận, đề phòng nguy hiểm, tai nạn." },
        { name: "Thành", desc: "Tốt cho khai trương, nhập học, cưới gả, dọn nhà, xuất hành." },
        { name: "Thu", desc: "Tốt cho thu hoạch, cất trữ, mua sắm tài sản; kỵ an táng." },
        { name: "Khai", desc: "Tốt cho khai trương, động thổ, cưới hỏi, xuất hành, nhậm chức." },
        { name: "Bế", desc: "Hợp đắp đê, lấp lỗ, tu dưỡng; kỵ khai trương, xuất hành, động thổ." },
    ];

    const AGE_HARMONY_MAP = {
        0: { good: "Thìn, Thân, Sửu", bad: "Ngọ, Mùi, Mão" },
        1: { good: "Tỵ, Dậu, Tý", bad: "Mùi, Ngọ, Tuất" },
        2: { good: "Ngọ, Tuất, Hợi", bad: "Thân, Tỵ, Hợi" },
        3: { good: "Mùi, Hợi, Tuất", bad: "Dậu, Tý, Thìn" },
        4: { good: "Tý, Thân, Dậu", bad: "Tuất, Mão, Thìn" },
        5: { good: "Sửu, Dậu, Thân", bad: "Hợi, Dần, Thân" },
        6: { good: "Dần, Tuất, Mùi", bad: "Tý, Sửu, Mão" },
        7: { good: "Mão, Hợi, Ngọ", bad: "Sửu, Tý, Tuất" },
        8: { good: "Tý, Thìn, Tỵ", bad: "Dần, Hợi, Tỵ" },
        9: { good: "Sửu, Tỵ, Thìn", bad: "Mão, Tuất, Dậu" },
        10: { good: "Dần, Ngọ, Mão", bad: "Thìn, Sửu, Mùi" },
        11: { good: "Mão, Mùi, Dần", bad: "Tỵ, Thân, Hợi" },
    };

    const SOLAR_HOLIDAYS = {
        "1/1": "Tết DL",
        "3/2": "Đảng CSVN",
        "14/2": "Valentine",
        "27/2": "Thầy thuốc VN",
        "8/3": "Quốc tế PN",
        "26/3": "Đoàn TNCS",
        "30/4": "Giải phóng",
        "1/5": "Quốc tế LĐ",
        "7/5": "Điện Biên Phủ",
        "19/5": "SN Bác Hồ",
        "1/6": "Thiếu nhi",
        "21/6": "Báo chí VN",
        "28/6": "Gia đình VN",
        "27/7": "Thương binh LS",
        "19/8": "CM Tháng Tám",
        "2/9": "Quốc khánh",
        "10/10": "GP Thủ đô",
        "13/10": "Doanh nhân VN",
        "20/10": "PN Việt Nam",
        "20/11": "20/11",
        "22/12": "QĐND VN",
        "24/12": "Giáng sinh",
        "25/12": "Noel",
    };

    const LUNAR_HOLIDAYS = {
        "1/1": "Tết Nguyên Đán",
        "2/1": "Mùng 2 Tết",
        "3/1": "Mùng 3 Tết",
        "10/1": "Vía Thần Tài",
        "15/1": "Rằm Tháng Giêng",
        "3/3": "Tết Hàn Thực",
        "10/3": "Giỗ Tổ Hùng Vương",
        "15/4": "Lễ Phật Đản",
        "5/5": "Tết Đoan Ngọ",
        "15/7": "Lễ Vu Lan",
        "15/8": "Tết Trung Thu",
        "9/9": "Tết Trùng Cửu",
        "15/10": "Tết Hạ Nguyên",
        "23/12": "Ông Công Ông Táo",
    };

    const JIEQI_TRANSLATION = {
        立春: "Lập Xuân",
        雨水: "Vũ Thủy",
        惊蛰: "Kinh Trập",
        春分: "Xuân Phân",
        清明: "Thanh Minh",
        谷雨: "Cốc Vũ",
        立夏: "Lập Hạ",
        小满: "Tiểu Mãn",
        芒种: "Mang Chủng",
        夏至: "Hạ Chí",
        小暑: "Tiểu Thử",
        大暑: "Đại Thử",
        立秋: "Lập Thu",
        处暑: "Xử Thử",
        白露: "Bạch Lộ",
        秋分: "Thu Phân",
        寒露: "Hàn Lộ",
        霜降: "Sương Giáng",
        立冬: "Lập Đông",
        小雪: "Tiểu Tuyết",
        大雪: "Đại Tuyết",
        冬至: "Đông Chí",
        小寒: "Tiểu Hàn",
        大寒: "Đại Hàn",
    };

    // Thuật toán Hồ Ngọc Đức chuẩn múi giờ Việt Nam (UTC+7)
    const INT = (d) => Math.floor(d);

    const jdFromDate = (dd, mm, yy) => {
        const a = INT((14 - mm) / 12);
        const y = yy + 4800 - a;
        const m = mm + 12 * a - 3;
        let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
        if (jd < 2299161) {
            jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
        }
        return jd;
    };

    const getNewMoonDay = (k, timeZone = 7) => {
        const T = k / 1236.85;
        const T2 = T * T;
        const T3 = T2 * T;
        const dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
        C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
        C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
        C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
        C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
        C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        let deltat;
        if (T < -11) {
            deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
        } else {
            deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
        }
        const JdNew = Jd1 + C1 - deltat;
        return INT(JdNew + 0.5 + timeZone / 24);
    };

    const getSunLongitude = (jdn, timeZone = 7) => {
        const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
        const T2 = T * T;
        const dr = Math.PI / 180;
        const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
        let L = L0 + DL;
        L = L * dr;
        L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
        return INT((L / Math.PI) * 6);
    };

    const getLunarMonth11 = (yy, timeZone = 7) => {
        const off = jdFromDate(31, 12, yy) - 2415021;
        const k = INT(off / 29.530588853);
        let nm = getNewMoonDay(k, timeZone);
        const sunLong = getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    };

    const getLeapMonthOffset = (a11, timeZone = 7) => {
        const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0;
        let i = 1;
        let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc !== last && i < 14);
        return i - 1;
    };

    // Hàm lõi chuyển Dương sang Âm: Tự động ưu tiên @dqcai/vn-lunar nếu được nạp, fallback về thuật toán nội bộ
    const convertSolar2Lunar = (dd, mm, yy, timeZone = 7) => {
        const dayNumber = jdFromDate(dd, mm, yy);

        if (window.vnLunar && typeof window.vnLunar.getLunarDate === "function") {
            try {
                const res = window.vnLunar.getLunarDate(dd, mm, yy);
                if (res && res.day) {
                    return {
                        lunarDay: res.day,
                        lunarMonth: res.month,
                        lunarYear: res.year,
                        lunarLeap: res.leap ? 1 : 0,
                        isFullMonth: true,
                        jd: res.jd || dayNumber,
                    };
                }
            } catch (e) {
                // Fallback xuống thuật toán Hồ Ngọc Đức bên dưới
            }
        }

        const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
        let monthStart = getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = getNewMoonDay(k, timeZone);
        }
        let nextMonthStart = getNewMoonDay(k + 1, timeZone);
        if (nextMonthStart <= monthStart) {
            nextMonthStart = getNewMoonDay(k + 2, timeZone);
        }
        const isFullMonth = nextMonthStart - monthStart === 30;

        let a11 = getLunarMonth11(yy, timeZone);
        let b11 = a11;
        let lunarYear;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = getLunarMonth11(yy - 1, timeZone);
        } else {
            lunarYear = yy + 1;
            b11 = getLunarMonth11(yy + 1, timeZone);
        }
        const lunarDay = dayNumber - monthStart + 1;
        const diff = INT((monthStart - a11) / 29);
        let lunarLeap = 0;
        let lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff === leapMonthDiff) {
                    lunarLeap = 1;
                }
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }
        return {
            lunarDay,
            lunarMonth,
            lunarYear,
            lunarLeap,
            isFullMonth,
            jd: dayNumber,
        };
    };

    const getNapAm = (stemIdx, branchIdx) => {
        const idx = (((6 * stemIdx - 5 * branchIdx) % 60) + 60) % 60;
        return NAP_AM_LIST[Math.floor(idx / 2)] || "Bạch Lạp Kim";
    };

    const getDayAuspiciousStatus = (lunarMonth, dayChiIndex) => {
        const startChi = ((lunarMonth - 1) * 2) % 12;
        const offset = (dayChiIndex - startChi + 12) % 12;
        if ([0, 1, 4, 7].includes(offset)) return "good";
        if ([2, 3, 6, 8].includes(offset)) return "bad";
        return "";
    };

    // Lấy Tiết Khí: Tự động ưu tiên thư viện lunar-javascript (window.Solar) nếu có mặt trên trang
    const getSolarTermName = (dd, mm, yy = 2026) => {
        if (window.Solar && typeof window.Solar.fromYmd === "function") {
            try {
                const lunarObj = window.Solar.fromYmd(yy, mm, dd).getLunar();
                const jieQi = lunarObj.getPrevJieQi(true);
                if (jieQi && JIEQI_TRANSLATION[jieQi.getName()]) {
                    return JIEQI_TRANSLATION[jieQi.getName()];
                }
            } catch (e) {
                // Fallback xuống bảng Tiết Khí nội bộ
            }
        }

        const code = mm * 100 + dd;
        if (code < 105) return "Đông Chí";
        if (code < 120) return "Tiểu Hàn";
        if (code < 204) return "Đại Hàn";
        if (code < 219) return "Lập Xuân";
        if (code < 305) return "Vũ Thủy";
        if (code < 321) return "Kinh Trập";
        if (code < 405) return "Xuân Phân";
        if (code < 420) return "Thanh Minh";
        if (code < 505) return "Cốc Vũ";
        if (code < 521) return "Lập Hạ";
        if (code < 606) return "Tiểu Mãn";
        if (code < 621) return "Mang Chủng";
        if (code < 707) return "Hạ Chí";
        if (code < 723) return "Tiểu Thử";
        if (code < 807) return "Đại Thử";
        if (code < 823) return "Lập Thu";
        if (code < 908) return "Xử Thử";
        if (code < 923) return "Bạch Lộ";
        if (code < 1008) return "Thu Phân";
        if (code < 1023) return "Hàn Lộ";
        if (code < 1107) return "Sương Giáng";
        if (code < 1122) return "Lập Đông";
        if (code < 1207) return "Tiểu Tuyết";
        if (code < 1222) return "Đại Tuyết";
        return "Đông Chí";
    };

    const getHolidayBadge = (sDay, sMonth, lDay, lMonth, lLeap) => {
        const solarKey = `${sDay}/${sMonth}`;
        const lunarKey = `${lDay}/${lMonth}`;

        if (SOLAR_HOLIDAYS[solarKey]) {
            return { badgeText: SOLAR_HOLIDAYS[solarKey], isHoliday: true };
        }
        if (!lLeap && LUNAR_HOLIDAYS[lunarKey]) {
            return { badgeText: LUNAR_HOLIDAYS[lunarKey], isHoliday: true };
        }
        if (lDay === 1) {
            return { badgeText: "Mùng 1", isHoliday: true };
        }
        if (lDay === 15) {
            return { badgeText: "Rằm", isHoliday: true };
        }
        return { badgeText: "", isHoliday: false };
    };

    const formatBilingualWeekday = (year, month, day) => {
        const dateObj = new Date(year, month - 1, day);
        const viDay = viWeekdayFormatter.format(dateObj).toUpperCase();
        const enDay = enWeekdayFormatter.format(dateObj).toUpperCase();
        return `${viDay} • ${enDay}`;
    };

    const formatEnglishMonth = (year, month) => {
        return enMonthFormatter.format(new Date(year, month - 1, 1));
    };

    const getBranchIndexFromHour = (hour24) => {
        if (hour24 === 23 || hour24 === 0) return 0;
        return Math.floor((hour24 + 1) / 2);
    };

    // API tổng hợp trả về đầy đủ thông tin Âm Dương, Can Chi, Nạp Âm, Trực, Giờ Hoàng Đạo cho 1 ngày bất kỳ
    const getFullDayInfo = (sDay, sMonth, sYear, hour24 = 0) => {
        const lunar = convertSolar2Lunar(sDay, sMonth, sYear);
        const { lunarDay, lunarMonth, lunarYear, lunarLeap, isFullMonth, jd } = lunar;

        const yearCanIdx = (lunarYear + 6) % 10;
        const yearChiIdx = (lunarYear + 8) % 12;
        const monthCanIdx = (yearCanIdx * 2 + lunarMonth + 1) % 10;
        const monthChiIdx = (lunarMonth + 1) % 12;
        const dayCanIdx = (jd + 9) % 10;
        const dayChiIdx = (jd + 1) % 12;

        const ratHourStemIdx = ((dayCanIdx % 5) * 2) % 10;
        const currentBranchIdx = getBranchIndexFromHour(hour24);
        const currentHourStemIdx = (ratHourStemIdx + currentBranchIdx) % 10;

        const fortuneStatus = getDayAuspiciousStatus(lunarMonth, dayChiIdx);
        const holidayInfo = getHolidayBadge(sDay, sMonth, lunarDay, lunarMonth, lunarLeap);
        const solarTerm = getSolarTermName(sDay, sMonth, sYear);
        const trucIdx = (dayChiIdx - monthChiIdx + 12) % 12;
        const trucObj = TRUC_LIST[trucIdx] || TRUC_LIST[0];
        const ageHarmony = AGE_HARMONY_MAP[dayChiIdx] || AGE_HARMONY_MAP[0];
        const goodIndices = GOOD_HOUR_INDICES[dayChiIdx] || [0, 1, 3, 6, 8, 9];

        const goodHoursShort = [];
        const badHoursShort = [];
        const hours12 = ZODIAC_BRANCHES.map((b) => {
            const hStemIdx = (ratHourStemIdx + b.index) % 10;
            const canchi = `${THIEN_CAN[hStemIdx]} ${b.vn}`;
            const isGood = goodIndices.includes(b.index);
            if (isGood) {
                goodHoursShort.push(b.shortRange);
            } else {
                badHoursShort.push(b.shortRange);
            }
            return {
                ...b,
                stemIdx: hStemIdx,
                canchi,
                napAm: getNapAm(hStemIdx, b.index),
                isGood,
            };
        });

        const baseLunarMonthName = VI_TRADITIONAL_LUNAR_MONTHS[lunarMonth] || `THÁNG ${lunarMonth}`;
        const lunarMonthFullLabel = `${baseLunarMonthName}${lunarLeap ? " NHUẬN" : ""}${isFullMonth ? " (Đ)" : " (T)"}`;

        return {
            sDay,
            sMonth,
            sYear,
            lunarDay,
            lunarMonth,
            lunarYear,
            lunarLeap,
            isFullMonth,
            jd,
            yearCanChi: `${THIEN_CAN[yearCanIdx]} ${DIA_CHI[yearChiIdx]}`,
            yearNapAm: getNapAm(yearCanIdx, yearChiIdx),
            monthCanChi: `${THIEN_CAN[monthCanIdx]} ${DIA_CHI[monthChiIdx]}`,
            monthNapAm: getNapAm(monthCanIdx, monthChiIdx),
            dayCanChi: `${THIEN_CAN[dayCanIdx]} ${DIA_CHI[dayChiIdx]}`,
            dayNapAm: getNapAm(dayCanIdx, dayChiIdx),
            hourCanChi: `${THIEN_CAN[currentHourStemIdx]} ${DIA_CHI[currentBranchIdx]}`,
            ratHourCanChi: `${THIEN_CAN[ratHourStemIdx]} Tý`,
            dayChiIdx,
            zodiacFile: ZODIAC_FILES[dayChiIdx] || "mouse",
            fortuneStatus,
            badgeText: holidayInfo.badgeText,
            isHoliday: holidayInfo.isHoliday,
            solarTerm,
            trucObj,
            ageHarmony,
            goodHoursStr: goodHoursShort.join(", "),
            badHoursStr: badHoursShort.join(", "),
            hours12,
            currentBranchIdx,
            solarMonthVnLabel: VI_TRADITIONAL_SOLAR_MONTHS[sMonth] || `THÁNG ${sMonth}`,
            solarMonthEnLabel: formatEnglishMonth(sYear, sMonth),
            lunarMonthFullLabel,
            bilingualWeekday: formatBilingualWeekday(sYear, sMonth, sDay),
        };
    };

    window.LunarEngine = {
        THIEN_CAN,
        DIA_CHI,
        ZODIAC_FILES,
        ZODIAC_BRANCHES,
        jdFromDate,
        convertSolar2Lunar,
        getNapAm,
        getDayAuspiciousStatus,
        getSolarTermName,
        getHolidayBadge,
        getBranchIndexFromHour,
        formatBilingualWeekday,
        formatEnglishMonth,
        getFullDayInfo,
    };
})();
