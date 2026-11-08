// assets/js/lunar-engine.js
// Lõi tính toán dùng chung (Service Layer): Đổi Âm <-> Dương 2 chiều, Can Chi, Nạp Âm, Tiết Khí, 12 Trực & 6 Giờ Hoàng Đạo
(() => {
    const INT = (d) => Math.floor(d);
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

    const HOUR_SLOTS = [
        { index: 0, key: "ty", vn: "Tý", range: "23:00 - 01:00", shortRange: "Tý (23-1)", icon: "mouse.svg" },
        { index: 1, key: "suu", vn: "Sửu", range: "01:00 - 03:00", shortRange: "Sửu (1-3)", icon: "buffalo.svg" },
        { index: 2, key: "dan", vn: "Dần", range: "03:00 - 05:00", shortRange: "Dần (3-5)", icon: "tiger.svg" },
        { index: 3, key: "mao", vn: "Mão", range: "05:00 - 07:00", shortRange: "Mão (5-7)", icon: "cat.svg" },
        { index: 4, key: "thin", vn: "Thìn", range: "07:00 - 09:00", shortRange: "Thìn (7-9)", icon: "dragon.svg" },
        { index: 5, key: "ty_snake", vn: "Tỵ", range: "09:00 - 11:00", shortRange: "Tỵ (9-11)", icon: "snake.svg" },
        { index: 6, key: "ngo", vn: "Ngọ", range: "11:00 - 13:00", shortRange: "Ngọ (11-13)", icon: "horse.svg" },
        { index: 7, key: "mui", vn: "Mùi", range: "13:00 - 15:00", shortRange: "Mùi (13-15)", icon: "goat.svg" },
        { index: 8, key: "than", vn: "Thân", range: "15:00 - 17:00", shortRange: "Thân (15-17)", icon: "monkey.svg" },
        { index: 9, key: "dau", vn: "Dậu", range: "17:00 - 19:00", shortRange: "Dậu (17-19)", icon: "rooster.svg" },
        { index: 10, key: "tuat", vn: "Tuất", range: "19:00 - 21:00", shortRange: "Tuất (19-21)", icon: "dog.svg" },
        { index: 11, key: "hoi", vn: "Hợi", range: "21:00 - 23:00", shortRange: "Hợi (21-23)", icon: "pig.svg" },
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
        {
            name: "Kiến",
            short: "Tốt xuất hành, khai trương",
            desc: "Tốt cho xuất hành, khai trương, giá thú; kỵ động thổ, đào đất.",
        },
        {
            name: "Trừ",
            short: "Tốt cầu an, giải trừ xấu",
            desc: "Tốt cho cầu an, dọn dẹp, giải trừ điều xấu, khám chữa bệnh.",
        },
        {
            name: "Mãn",
            short: "Tốt cầu tài, khai trương",
            desc: "Tốt cho tế tự, cầu tài, khai trương, xuất hành, sửa kho.",
        },
        {
            name: "Bình",
            short: "Tốt tu tạo, nhập trạch",
            desc: "Tốt cho tu tạo, sửa chữa, nhập trạch, cưới gả, giao dịch.",
        },
        {
            name: "Định",
            short: "Tốt ký kết, cầu danh",
            desc: "Tốt cho ký kết, thương lượng, cầu danh, nhập học, làm chuồng trại.",
        },
        {
            name: "Chấp",
            short: "Tốt xây dựng, tu bổ",
            desc: "Tốt cho xây dựng, tu bổ, tuyển dụng; kỵ xuất hành đi xa.",
        },
        {
            name: "Phá",
            short: "Hợp dỡ bỏ cũ, chữa bệnh",
            desc: "Chỉ hợp dỡ bỏ nhà cũ, chữa bệnh; kỵ khai trương, cưới hỏi.",
        },
        {
            name: "Nguy",
            short: "Nên cẩn trọng việc lớn",
            desc: "Xấu cho mọi việc lớn. Nên cẩn thận, đề phòng nguy hiểm, tai nạn.",
        },
        {
            name: "Thành",
            short: "Tốt khai trương, cưới gả",
            desc: "Tốt cho khai trương, nhập học, cưới gả, dọn nhà, xuất hành.",
        },
        {
            name: "Thu",
            short: "Tốt thu hoạch, tích trữ",
            desc: "Tốt cho thu hoạch, cất trữ, mua sắm tài sản; kỵ an táng.",
        },
        {
            name: "Khai",
            short: "Khởi đầu đại cát",
            desc: "Tốt cho khai trương, động thổ, cưới hỏi, xuất hành, nhậm chức.",
        },
        {
            name: "Bế",
            short: "Hợp tu dưỡng, bồi đắp",
            desc: "Hợp đắp đê, lấp lỗ, tu dưỡng; kỵ khai trương, xuất hành, động thổ.",
        },
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
        "14/2": "Valentine",
        "8/3": "Quốc tế PN",
        "30/4": "Giải phóng",
        "1/5": "Quốc tế LĐ",
        "1/6": "Thiếu nhi",
        "2/9": "Quốc khánh",
        "20/10": "PN Việt Nam",
        "20/11": "20/11",
        "22/12": "QĐND VN",
        "24/12": "Giáng sinh",
    };

    const LUNAR_HOLIDAYS = {
        "1/1": "Tết Nguyên Đán",
        "2/1": "Mùng 2 Tết",
        "3/1": "Mùng 3 Tết",
        "15/1": "Rằm Tháng Giêng",
        "3/3": "Tết Hàn Thực",
        "10/3": "Giỗ Tổ Hùng Vương",
        "15/4": "Lễ Phật Đản",
        "5/5": "Tết Đoan Ngọ",
        "15/7": "Lễ Vu Lan",
        "15/8": "Tết Trung Thu",
        "23/12": "Ông Công Ông Táo",
    };

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

    const jdToDate = (jd) => {
        let a, b, c;
        if (jd > 2299160) {
            a = jd + 32044;
            b = INT((4 * a + 3) / 146097);
            c = a - INT((b * 146097) / 4);
        } else {
            b = 0;
            c = jd + 32082;
        }
        const d = INT((4 * c + 3) / 1461);
        const e = c - INT((1461 * d) / 4);
        const m = INT((5 * e + 2) / 153);
        const day = e - INT((153 * m + 2) / 5) + 1;
        const month = m + 3 - 12 * INT(m / 10);
        const year = b * 100 + d - 4800 + INT(m / 10);
        return { sDay: day, sMonth: month, sYear: year };
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

    const convertSolar2Lunar = (dd, mm, yy, timeZone = 7) => {
        const dayNumber = jdFromDate(dd, mm, yy);
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
        return { lunarDay, lunarMonth, lunarYear, lunarLeap, isFullMonth, jd: dayNumber };
    };

    const convertLunar2Solar = (lunarDay, lunarMonth, lunarYear, lunarLeap = 0, timeZone = 7) => {
        let a11, b11;
        if (lunarMonth < 11) {
            a11 = getLunarMonth11(lunarYear - 1, timeZone);
            b11 = getLunarMonth11(lunarYear, timeZone);
        } else {
            a11 = getLunarMonth11(lunarYear, timeZone);
            b11 = getLunarMonth11(lunarYear + 1, timeZone);
        }
        const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
        let off = lunarMonth - 11;
        if (off < 0) off += 12;
        if (b11 - a11 > 365) {
            const leapOff = getLeapMonthOffset(a11, timeZone);
            let leapMonth = leapOff - 2;
            if (leapMonth < 0) leapMonth += 12;
            if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
                return { sDay: 0, sMonth: 0, sYear: 0 };
            } else if (lunarLeap !== 0 || off >= leapOff) {
                off += 1;
            }
        }
        const monthStart = getNewMoonDay(k + off, timeZone);
        return jdToDate(monthStart + lunarDay - 1);
    };

    const getNapAm = (stemIdx, branchIdx) => {
        const idx = (((6 * stemIdx - 5 * branchIdx) % 60) + 60) % 60;
        return NAP_AM_LIST[Math.floor(idx / 2)] || "Bạch Lạp Kim";
    };

    // Thay thế từ hàm resolveElementInfo đến hết file trong assets/js/lunar-engine.js
    const resolveElementInfo = (napAmStr) => {
        const text = String(napAmStr || "").trim();
        if (text.endsWith("Kim")) return { key: "metal", name: "Kim", icon: "metal.svg", label: "Hành Kim • Kim khí" };
        if (text.endsWith("Mộc"))
            return { key: "wood", name: "Mộc", icon: "wood.svg", label: "Hành Mộc • Sinh trưởng" };
        if (text.endsWith("Thủy"))
            return { key: "water", name: "Thủy", icon: "water.svg", label: "Hành Thủy • Linh hoạt" };
        if (text.endsWith("Hỏa"))
            return { key: "fire", name: "Hỏa", icon: "fire.svg", label: "Hành Hỏa • Nhiệt huyết" };
        return { key: "earth", name: "Thổ", icon: "earth.svg", label: "Hành Thổ • Vững chãi" };
    };

    const LUC_DIEU_6 = [
        {
            name: "Đại An",
            isGood: true,
            bonus: 14,
            desc: "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên lành.",
        },
        {
            name: "Lưu Niên",
            isGood: false,
            bonus: -8,
            desc: "Mưu sự khó thành, cầu lộc chưa thông, cần đề phòng khẩu thiệt.",
        },
        { name: "Tốc Hỷ", isGood: true, bonus: 12, desc: "Tin vui đến nhanh, mưu sự đại cát, tốt nhất vào buổi sáng." },
        {
            name: "Xích Khẩu",
            isGood: false,
            bonus: -10,
            desc: "Dễ xảy ra bất hòa, tranh cãi; nên cẩn trọng lời ăn tiếng nói.",
        },
        {
            name: "Tiểu Cát",
            isGood: true,
            bonus: 10,
            desc: "Cát lành, hòa hợp, mưu sự suôn sẻ và dễ gặp quý nhân phù trợ.",
        },
        {
            name: "Không Vong",
            isGood: false,
            bonus: -12,
            desc: "Cầu tài không lợi, mưu sự dễ trắc trở, không nên tiến hành việc lớn.",
        },
    ];

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

    const getBranchIndexFromHour = (hour24 = 0) => {
        const h = Number(hour24) % 24;
        if (h === 23 || h === 0) return 0;
        return Math.floor((h + 1) / 2);
    };

    const getDayAuspiciousStatus = (lunarMonth, dayChiIndex) => {
        const startChi = ((lunarMonth - 1) * 2) % 12;
        const offset = (dayChiIndex - startChi + 12) % 12;
        if ([0, 1, 4, 7].includes(offset)) return "good";
        if ([2, 3, 6, 8].includes(offset)) return "bad";
        return "";
    };

    const getSolarTermName = (dd, mm) => {
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

        if (SOLAR_HOLIDAYS[solarKey]) return { badgeText: SOLAR_HOLIDAYS[solarKey], isHoliday: true };
        if (!lLeap && LUNAR_HOLIDAYS[lunarKey]) return { badgeText: LUNAR_HOLIDAYS[lunarKey], isHoliday: true };
        if (lDay === 1) return { badgeText: "Mùng 1", isHoliday: true };
        if (lDay === 15) return { badgeText: "Rằm", isHoliday: true };
        return { badgeText: "", isHoliday: false };
    };

    const getFullDayInfo = (sDay, sMonth, sYear, sHour = new Date().getHours()) => {
        const lunar = convertSolar2Lunar(sDay, sMonth, sYear);
        const { lunarDay, lunarMonth, lunarYear, lunarLeap, isFullMonth, jd } = lunar;

        const yearCanIdx = (lunarYear + 6) % 10;
        const yearChiIdx = (lunarYear + 8) % 12;
        const monthCanIdx = ((yearCanIdx % 5) * 2 + lunarMonth + 1) % 10;
        const monthChiIdx = (lunarMonth + 1) % 12;
        const dayCanIdx = (jd + 9) % 10;
        const dayChiIdx = (jd + 1) % 12;
        const ratHourStemIdx = ((dayCanIdx % 5) * 2) % 10;
        const currentBranchIdx = getBranchIndexFromHour(sHour);

        const yearCanChi = `${THIEN_CAN[yearCanIdx]} ${DIA_CHI[yearChiIdx]}`;
        const monthCanChi = `${THIEN_CAN[monthCanIdx]} ${DIA_CHI[monthChiIdx]}`;
        const dayCanChi = `${THIEN_CAN[dayCanIdx]} ${DIA_CHI[dayChiIdx]}`;
        const yearNapAm = getNapAm(yearCanIdx, yearChiIdx);
        const monthNapAm = getNapAm(monthCanIdx, monthChiIdx);
        const dayNapAm = getNapAm(dayCanIdx, dayChiIdx);

        const dateObj = new Date(sYear, sMonth - 1, sDay);
        const bilingualWeekday = `${viWeekdayFormatter.format(dateObj).toUpperCase()} • ${enWeekdayFormatter.format(dateObj).toUpperCase()}`;
        const solarMonthEnLabel = enMonthFormatter.format(new Date(sYear, sMonth - 1, 1));
        const solarMonthVnLabel = VI_TRADITIONAL_SOLAR_MONTHS[sMonth] || `THÁNG ${sMonth}`;

        const baseLunarMonthName = VI_TRADITIONAL_LUNAR_MONTHS[lunarMonth] || `THÁNG ${lunarMonth}`;
        const lunarMonthFullLabel = `${baseLunarMonthName}${lunarLeap ? " NHUẬN" : ""}${isFullMonth ? " (Đ)" : " (T)"}`;

        const fortuneStatus = getDayAuspiciousStatus(lunarMonth, dayChiIdx);
        const holidayInfo = getHolidayBadge(sDay, sMonth, lunarDay, lunarMonth, lunarLeap);
        const solarTerm = getSolarTermName(sDay, sMonth);
        const trucObj = TRUC_LIST[(dayChiIdx - monthChiIdx + 12) % 12] || TRUC_LIST[0];
        const ageHarmony = AGE_HARMONY_MAP[dayChiIdx] || AGE_HARMONY_MAP[0];
        const goodIndices = GOOD_HOUR_INDICES[dayChiIdx] || [0, 1, 3, 6, 8, 9];
        const dayLucDieuIdx = (lunarMonth + lunarDay - 2) % 6;

        const goodHoursShort = [];
        const badHoursShort = [];
        const goodHourCards = [];
        const hours12 = [];

        HOUR_SLOTS.forEach((slot, idx) => {
            const hStemIdx = (ratHourStemIdx + idx) % 10;
            const canchi = `${THIEN_CAN[hStemIdx]} ${slot.vn}`;
            const hourCanChi = `Giờ ${canchi}`;
            const napAm = getNapAm(hStemIdx, idx);
            const elemObj = resolveElementInfo(napAm);
            const isGood = goodIndices.includes(idx);
            const lucDieuObj = LUC_DIEU_6[(dayLucDieuIdx + idx) % 6] || LUC_DIEU_6[0];
            const energyScore = Math.min(98, Math.max(42, (isGood ? 78 : 58) + lucDieuObj.bonus));

            if (isGood) {
                goodHoursShort.push(slot.shortRange);
                goodHourCards.push({
                    hourCanChi,
                    range: slot.range,
                    icon: slot.icon,
                });
            } else {
                badHoursShort.push(slot.shortRange);
            }

            hours12.push({
                ...slot,
                stemIdx: hStemIdx,
                canchi,
                hourCanChi,
                napAm,
                elementKey: elemObj.key,
                elementName: elemObj.name,
                elementIcon: elemObj.icon,
                isGood,
                lucDieuName: lucDieuObj.name,
                lucDieuGood: lucDieuObj.isGood,
                lucDieuDesc: lucDieuObj.desc,
                energyScore,
            });
        });

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
            yearChiIdx,
            monthChiIdx,
            dayChiIdx,
            currentBranchIdx,
            yearCanChi,
            monthCanChi,
            dayCanChi,
            ratHourCanChi: `${THIEN_CAN[ratHourStemIdx]} Tý`,
            yearNapAm,
            monthNapAm,
            dayNapAm,
            elementInfo: resolveElementInfo(dayNapAm),
            zodiacFile: ZODIAC_FILES[dayChiIdx] || "mouse",
            monthZodiacFile: ZODIAC_FILES[monthChiIdx] || "dog",
            yearZodiacFile: ZODIAC_FILES[yearChiIdx] || "horse",
            directions: {
                hy: HY_THAN_BY_STEM[dayCanIdx] || "Tây Bắc",
                tai: TAI_THAN_BY_STEM[dayCanIdx] || "Đông Nam",
            },
            fortuneStatus,
            badgeText: holidayInfo.badgeText,
            isHoliday: holidayInfo.isHoliday,
            solarTerm,
            trucObj,
            ageHarmony,
            goodHoursStr: goodHoursShort.join(", "),
            badHoursStr: badHoursShort.join(", "),
            goodHourCards,
            hours12,
            bilingualWeekday,
            solarMonthVnLabel,
            solarMonthEnLabel,
            lunarMonthFullLabel,
        };
    };

    window.LunarEngine = {
        THIEN_CAN,
        DIA_CHI,
        ZODIAC_FILES,
        getBranchIndexFromHour,
        convertSolar2Lunar,
        convertLunar2Solar,
        getFullDayInfo,
    };
})();
