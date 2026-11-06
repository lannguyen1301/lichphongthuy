// assets/js/header.js
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let isGlobalBound = false;
    let clockTimer = null;

    // Trạng thái Tháng / Năm đang hiển thị trên bảng lịch
    const todayReal = new Date();
    let currentYearNumber = 2026;
    let currentMonthNumber = 11;
    let selectedSolarDay = 3;

    const monthApiCache = new Map();

    // Trạng thái lưu danh sách sự kiện của ngày đang chọn để chuyển đổi khi bấm 2 nút chờ
    let activeDayVnEvents = [];
    let activeDayIntlEvents = [];
    let currentVnEventIndex = 0;
    let currentIntlEventIndex = 0;

    // =========================================================================
    // HẰNG SỐ TRA CỨU LỊCH VẠN NIÊN & PHONG THỦY
    // =========================================================================
    const WEEKDAY_LABELS = [
        "THỨ HAI • MONDAY",
        "THỨ BA • TUESDAY",
        "THỨ TƯ • WEDNESDAY",
        "THỨ NĂM • THURSDAY",
        "THỨ SÁU • FRIDAY",
        "THỨ BẢY • SATURDAY",
        "CHỦ NHẬT • SUNDAY",
    ];

    const SOLAR_MONTH_VN = {
        1: "THÁNG MỘT",
        2: "THÁNG HAI",
        3: "THÁNG BA",
        4: "THÁNG TƯ",
        5: "THÁNG NĂM",
        6: "THÁNG SÁU",
        7: "THÁNG BẢY",
        8: "THÁNG TÁM",
        9: "THÁNG CHÍN",
        10: "THÁNG MƯỜI",
        11: "THÁNG MƯỜI MỘT",
        12: "THÁNG MƯỜI HAI",
    };

    const SOLAR_MONTH_EN = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };

    const LUNAR_MONTH_BASE_NAMES = {
        1: "THÁNG GIÊNG",
        2: "THÁNG HAI",
        3: "THÁNG BA",
        4: "THÁNG TƯ",
        5: "THÁNG NĂM",
        6: "THÁNG SÁU",
        7: "THÁNG BẢY",
        8: "THÁNG TÁM",
        9: "THÁNG CHÍN",
        10: "THÁNG MƯỜI",
        11: "THÁNG MƯỜI MỘT",
        12: "THÁNG CHẠP",
    };

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

    // Ngày lễ Dương lịch cố định trong năm
    const SOLAR_HOLIDAY_BADGES = {
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

    // Ngày lễ Âm lịch cố định trong năm
    const LUNAR_HOLIDAY_BADGES = {
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

    // 30 Nạp Âm Ngũ Hành (60 Hoa Giáp chia 2)
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

    // 12 Trực & Ý nghĩa
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

    // 12 Khung giờ Địa Chi trong ngày
    const HOUR_RANGES = [
        "Tý (23-1)",
        "Sửu (1-3)",
        "Dần (3-5)",
        "Mão (5-7)",
        "Thìn (7-9)",
        "Tỵ (9-11)",
        "Ngọ (11-13)",
        "Mùi (13-15)",
        "Thân (15-17)",
        "Dậu (17-19)",
        "Tuất (19-21)",
        "Hợi (21-23)",
    ];

    // Bảng chỉ số 6 Giờ Hoàng Đạo theo Địa Chi của ngày (0: Tý -> 11: Hợi)
    const GOOD_HOUR_INDICES = {
        0: [0, 1, 3, 6, 8, 9], // Ngày Tý, Ngọ
        6: [0, 1, 3, 6, 8, 9],
        1: [2, 3, 5, 8, 10, 11], // Ngày Sửu, Mùi
        7: [2, 3, 5, 8, 10, 11],
        2: [0, 1, 4, 5, 7, 10], // Ngày Dần, Thân
        8: [0, 1, 4, 5, 7, 10],
        3: [0, 2, 3, 6, 7, 9], // Ngày Mão, Dậu
        9: [0, 2, 3, 6, 7, 9],
        4: [2, 4, 5, 8, 9, 11], // Ngày Thìn, Tuất
        10: [2, 4, 5, 8, 9, 11],
        5: [1, 4, 6, 7, 10, 11], // Ngày Tỵ, Hợi
        11: [1, 4, 6, 7, 10, 11],
    };

    // Tuổi hợp / Tuổi xung theo Địa Chi ngày
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

    // =========================================================================
    // THUẬT TOÁN ÂM LỊCH VIỆT NAM (HỒ NGỌC ĐỨC - MÚI GIỜ UTC+7)
    // =========================================================================
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

    // Chuyển đổi ngày Dương sang Âm lịch Việt Nam + kiểm tra tháng đủ (30 ngày) hay thiếu (29 ngày)
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
        return {
            lunarDay,
            lunarMonth,
            lunarYear,
            lunarLeap,
            isFullMonth,
            jd: dayNumber,
        };
    };

    // Tính trạng thái Hoàng Đạo ("good"), Hắc Đạo ("bad") hoặc Bình thường ("")
    const getDayAuspiciousStatus = (lunarMonth, dayChiIndex) => {
        const startChi = ((lunarMonth - 1) * 2) % 12;
        const offset = (dayChiIndex - startChi + 12) % 12;
        // 4 sao Đại Hoàng Đạo (Thanh Long, Minh Đường, Kim Quỹ, Ngọc Đường) -> Chấm Vàng Hoàng Đạo
        if ([0, 1, 4, 7].includes(offset)) return "good";
        // 4 sao Đại Hắc Đạo (Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao) -> Chấm Xám Hắc Đạo
        if ([2, 3, 6, 8].includes(offset)) return "bad";
        return "";
    };

    // Tính Tiết Khí theo ngày Dương lịch
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

    // 1. Khôi phục Theme Ngũ hành từ localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "earth";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const isCurrentBoolean = (val) => Boolean(val);

    const applyTheme = (selectedTheme) => {
        if (!selectedTheme) return;
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

        document.querySelectorAll(".header__theme-btn").forEach((btn) => {
            const isMatch = btn.dataset.theme === selectedTheme;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(isCurrentBoolean(isMatch)));
        });

        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.classList.toggle("is-active", dot.dataset.quickTheme === selectedTheme);
        });
    };

    // 2. Bật/tắt Sidebar Drawer trên Mobile & Khóa cuộn trang (Body Scroll Lock)
    const toggleSidebar = (forceClose = false) => {
        const sidebar = document.getElementById("calendar-sidebar");
        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        if (!sidebar || !burgerBtn || !backdrop) return;

        const isOpen = sidebar.classList.contains("is-open");
        const nextState = forceClose ? false : !isOpen;

        sidebar.classList.toggle("is-open", nextState);
        burgerBtn.classList.toggle("is-active", nextState);
        backdrop.classList.toggle("is-active", nextState);
        burgerBtn.setAttribute("aria-expanded", String(nextState));

        document.body.style.overflow = nextState ? "hidden" : "";
    };

    // 3. Đồng bộ trạng thái Active trên thanh điều hướng Sidebar
    const syncActiveSidebarLink = () => {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const sidebarLinks = document.querySelectorAll(".sidebar__link[data-nav-page]");

        sidebarLinks.forEach((link) => {
            const isMatch = link.dataset.navPage === currentPage;
            link.classList.toggle("sidebar__link--active", isMatch);
            if (isMatch) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    // 4. Cập nhật Ngày & Giờ thực trên Header
    const updateClock = () => {
        const dateEl = document.getElementById("current-date");
        const timeEl = document.getElementById("current-time");
        if (!dateEl || !timeEl) return;

        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");

        const dd = pad(now.getDate());
        const mm = pad(now.getMonth() + 1);
        const yyyy = now.getFullYear();
        const hh = pad(now.getHours());
        const min = pad(now.getMinutes());
        const ss = pad(now.getSeconds());

        dateEl.textContent = `${dd}/${mm}/${yyyy}`;
        dateEl.setAttribute("datetime", `${yyyy}-${mm}-${dd}`);
        timeEl.textContent = `${hh}:${min}:${ss}`;
        timeEl.setAttribute("datetime", `${hh}:${min}:${ss}`);
    };

    // 5. Tải dữ liệu JSON theo tháng từ ./api/thang-${month}.json
    const fetchMonthHistoryData = async (monthNum) => {
        const m = Number(monthNum) || 11;
        if (monthApiCache.has(m)) {
            return monthApiCache.get(m);
        }

        const paddedMonth = String(m).padStart(2, "0");
        const candidatePaths = [`./api/thang-${m}.json`, `./api/thang-${paddedMonth}.json`];

        for (const path of candidatePaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    const normalized = Array.isArray(data) ? data : data?.data || data?.events || [];
                    monthApiCache.set(m, normalized);
                    return normalized;
                }
            } catch (err) {
                // Thử đường dẫn dự phòng tiếp theo
            }
        }

        monthApiCache.set(m, []);
        return [];
    };

    // 6. Chuẩn hóa đường dẫn sang trang detail.html
    const buildDetailUrlFromItem = (item, monthNum) => {
        if (!item) return "./detail.html";
        const rawSlug = item.image_slug || item.slug || "";
        const cleanActorFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
        const catStr = String(item.category_id || item.loai || "").toLowerCase();
        const typeFolder = catStr.includes("event") || catStr.includes("su-kien") ? "events" : "figures";

        const params = new URLSearchParams({
            type: typeFolder,
            folder: cleanActorFolder,
            slug: rawSlug,
            month: String(monthNum),
        });
        return `./detail.html?${params.toString()}`;
    };

    // 7. Nạp ảnh bìa 16:9 tại ./assets/images/calendar-covers/thang-${monthNum}/${cleanSlug}
    const setCoverImageWithFallback = (imgEl, monthNum, imageSlug, altText) => {
        if (!imgEl) return;
        if (altText) imgEl.alt = altText;

        if (!imageSlug) {
            imgEl.onerror = null;
            imgEl.src = DEFAULT_COVER_IMG;
            return;
        }

        const fileNameOnly = imageSlug.split("/").pop().trim();
        const cleanSlug = fileNameOnly.replace(/\.(jpg|jpeg|png|webp)$/i, "");
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

    // 8. Đổ đối tượng sự kiện/nhân vật từ JSON lên Khung ảnh 16:9 & Khối Quote Cột Trái
    const renderHistoryItemToBloc = (item, monthNum, solarDay) => {
        const imgEl = document.getElementById("detail-history-img");
        const mediaLinkEl = document.getElementById("detail-history-link");
        const captionLinkEl = document.getElementById("detail-history-caption");
        const captionTextEl = document.getElementById("detail-history-caption-text");
        const quoteTextEl =
            document.getElementById("detail-quote-text") || document.querySelector(".fengshui-quote__text");
        const quoteAuthorEl =
            document.getElementById("detail-quote-author") || document.querySelector(".fengshui-quote__author");

        const paddedDay = String(solarDay).padStart(2, "0");
        const paddedMonth = String(monthNum).padStart(2, "0");

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
            if (quoteTextEl) {
                quoteTextEl.textContent = '"Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."';
            }
            if (quoteAuthorEl) {
                quoteAuthorEl.textContent = "- Chủ tịch Hồ Chí Minh -";
            }
            return;
        }

        const occasionText = item.hien_thi_nhan_dip || item.ten || `Sự kiện lịch sử ngày ${paddedDay}/${paddedMonth}`;
        const detailHref = buildDetailUrlFromItem(item, monthNum);

        setCoverImageWithFallback(imgEl, monthNum, item.image_slug || item.slug, occasionText);

        if (captionTextEl) captionTextEl.textContent = occasionText;
        if (mediaLinkEl) mediaLinkEl.href = detailHref;
        if (captionLinkEl) captionLinkEl.href = detailHref;

        if (quoteTextEl) {
            const rawQuote = (item.quote || item.danh_ngon || "").trim();
            quoteTextEl.textContent = rawQuote
                ? rawQuote.startsWith('"')
                    ? rawQuote
                    : `"${rawQuote}"`
                : `"${occasionText}"`;
        }

        if (quoteAuthorEl) {
            const authorName = item.ten || item.tac_gia || "Lịch sử Việt Nam";
            quoteAuthorEl.textContent = `- ${authorName} -`;
        }
    };

    // 9. Lọc sự kiện trong ngày và tự động Bật / Tắt (hidden) 2 nút "Sự kiện cùng ngày" & "Sự kiện quốc tế"
    const updateHistoryForSelectedDate = async (solarDay, monthNum) => {
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const sameDayLabel = document.getElementById("label-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");
        const intlLabel = document.getElementById("label-intl-events");

        const paddedDay = String(solarDay).padStart(2, "0");
        const paddedMonth = String(monthNum).padStart(2, "0");
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
                if (sameDayLabel) {
                    sameDayLabel.textContent = `Sự kiện cùng ngày (${activeDayVnEvents.length})`;
                }
            } else {
                sameDayBtn.hidden = true;
                sameDayBtn.classList.remove("is-active");
            }
        }

        if (intlBtn) {
            if (activeDayIntlEvents.length > 0) {
                intlBtn.hidden = false;
                intlBtn.classList.remove("is-active");
                if (intlLabel) {
                    intlLabel.textContent = `Sự kiện quốc tế (${activeDayIntlEvents.length})`;
                }
            } else {
                intlBtn.hidden = true;
                intlBtn.classList.remove("is-active");
            }
        }

        const primaryItem = activeDayVnEvents[0] || activeDayIntlEvents[0] || null;
        renderHistoryItemToBloc(primaryItem, monthNum, solarDay);
    };

    // 10. Đồng bộ toàn bộ thông tin từ ô ngày được chọn sang Tờ Lịch Bloc & Khối Phong Thủy (Cột Trái)
    const syncCellToBlocCard = (cell, index) => {
        const sDay = Number(cell.dataset.solar) || 1;
        const sMonth = Number(cell.dataset.month) || currentMonthNumber;
        const sYear = Number(cell.dataset.year) || currentYearNumber;

        const lunarInfo = convertSolar2Lunar(sDay, sMonth, sYear);
        const { lunarDay, lunarMonth, lunarYear, lunarLeap, isFullMonth, jd } = lunarInfo;

        // Tính Can Chi Năm, Tháng, Ngày, Giờ
        const yearCanIdx = (lunarYear + 6) % 10;
        const yearChiIdx = (lunarYear + 8) % 12;
        const monthCanIdx = (yearCanIdx * 2 + lunarMonth + 1) % 10;
        const monthChiIdx = (lunarMonth + 1) % 12;
        const dayCanIdx = (jd + 9) % 10;
        const dayChiIdx = (jd + 1) % 12;
        const hourCanIdx = (dayCanIdx * 2) % 10;

        // Cập nhật Tầng Đầu & Băng Rôn Tờ Lịch Bloc
        const solarYearEl = document.getElementById("detail-solar-year");
        const solarMonthVnEl = document.getElementById("detail-solar-month-vn");
        const solarMonthEnEl = document.getElementById("detail-solar-month-en");
        const solarDayEl = document.getElementById("detail-solar-day");
        const statusEl = document.getElementById("detail-day-status");
        const lunarYearEl = document.getElementById("detail-lunar-year");
        const weekdayEl = document.getElementById("detail-weekday");

        if (solarYearEl) solarYearEl.textContent = String(sYear);
        if (solarMonthVnEl) solarMonthVnEl.textContent = SOLAR_MONTH_VN[sMonth] || `THÁNG ${sMonth}`;
        if (solarMonthEnEl) solarMonthEnEl.textContent = SOLAR_MONTH_EN[sMonth] || "";
        if (solarDayEl) solarDayEl.textContent = String(sDay);

        if (lunarYearEl) {
            lunarYearEl.textContent = `NĂM ${THIEN_CAN[yearCanIdx].toUpperCase()} ${DIA_CHI[yearChiIdx].toUpperCase()}`;
        }
        if (weekdayEl && typeof index === "number") {
            weekdayEl.textContent = WEEKDAY_LABELS[index % 7];
        }

        if (statusEl) {
            const statusStr = cell.dataset.status || "";
            const badgeEl = cell.querySelector(".month-cal__badge");
            if (badgeEl) {
                statusEl.textContent = `Ngày ${badgeEl.textContent.trim()}`;
            } else if (statusStr.includes("good")) {
                statusEl.textContent = "Ngày Hoàng Đạo";
            } else if (statusStr.includes("bad")) {
                statusEl.textContent = "Ngày Hắc Đạo";
            } else {
                statusEl.textContent = "Ngày bình thường";
            }
        }

        // Cập nhật Tầng Đáy Tờ Lịch Bloc (Số Âm, Tháng Âm, Can Chi, Nạp Âm, Tiết Khí, Trực)
        const lunarDayEl = document.getElementById("detail-lunar-day");
        const lunarMonthEl = document.getElementById("detail-lunar-month");
        const canchiMonthEl = document.getElementById("detail-canchi-month");
        const canchiDayEl = document.getElementById("detail-canchi-day");
        const canchiHourEl = document.getElementById("detail-canchi-hour");
        const elementEl = document.getElementById("detail-element");
        const solarTermEl = document.getElementById("detail-solar-term");
        const trucNameEl = document.getElementById("detail-truc-name");

        if (lunarDayEl) lunarDayEl.textContent = String(lunarDay);
        if (lunarMonthEl) {
            const baseMonthName = LUNAR_MONTH_BASE_NAMES[lunarMonth] || `THÁNG ${lunarMonth}`;
            const leapSuffix = lunarLeap ? " NHUẬN" : "";
            const sizeSuffix = isFullMonth ? " (Đ)" : " (T)";
            lunarMonthEl.textContent = `${baseMonthName}${leapSuffix}${sizeSuffix}`;
        }
        if (canchiMonthEl) {
            canchiMonthEl.textContent = `Tháng ${THIEN_CAN[monthCanIdx]} ${DIA_CHI[monthChiIdx]}`;
        }
        if (canchiDayEl) {
            canchiDayEl.textContent = `Ngày ${THIEN_CAN[dayCanIdx]} ${DIA_CHI[dayChiIdx]}`;
        }
        if (canchiHourEl) {
            canchiHourEl.textContent = `Giờ ${THIEN_CAN[hourCanIdx]} Tý`;
        }

        // Tính Nạp Âm theo chỉ số 60 Hoa Giáp của ngày
        const sexagenaryIdx = (((6 * dayCanIdx - 5 * dayChiIdx) % 60) + 60) % 60;
        const napAmName = NAP_AM_LIST[Math.floor(sexagenaryIdx / 2)] || "Bạch Lạp Kim";
        if (elementEl) elementEl.textContent = napAmName;

        // Tính Tiết Khí & 12 Trực
        if (solarTermEl) solarTermEl.textContent = getSolarTermName(sDay, sMonth);
        const trucIdx = (dayChiIdx - monthChiIdx + 12) % 12;
        const trucObj = TRUC_LIST[trucIdx] || TRUC_LIST[0];
        if (trucNameEl) trucNameEl.textContent = trucObj.name;

        // Cập nhật Khối Phong Thủy (Giờ Hoàng Đạo / Hắc Đạo, Trực, Tuổi Hợp / Xung)
        const goodHoursEl = document.getElementById("detail-good-hours");
        const badHoursEl = document.getElementById("detail-bad-hours");
        const trucTitleEl = document.getElementById("detail-truc-title");
        const trucDescEl = document.getElementById("detail-truc-desc");
        const ageGoodEl = document.getElementById("detail-age-good");
        const ageBadEl = document.getElementById("detail-age-bad");

        const goodIndices = GOOD_HOUR_INDICES[dayChiIdx] || [0, 1, 3, 6, 8, 9];
        const goodHoursArr = [];
        const badHoursArr = [];
        HOUR_RANGES.forEach((label, idx) => {
            if (goodIndices.includes(idx)) {
                goodHoursArr.push(label);
            } else {
                badHoursArr.push(label);
            }
        });

        if (goodHoursEl) goodHoursEl.textContent = goodHoursArr.join(", ");
        if (badHoursEl) badHoursEl.textContent = badHoursArr.join(", ");
        if (trucTitleEl) trucTitleEl.textContent = trucObj.name;
        if (trucDescEl) trucDescEl.textContent = trucObj.desc;

        const ageHarmony = AGE_HARMONY_MAP[dayChiIdx];
        if (ageHarmony) {
            if (ageGoodEl) ageGoodEl.textContent = ageHarmony.good;
            if (ageBadEl) ageBadEl.textContent = ageHarmony.bad;
        }

        // Gọi API lấy ảnh bìa 16:9 & trích dẫn lịch sử của ngày đang chọn
        updateHistoryForSelectedDate(sDay, sMonth);
    };

    // =========================================================================
    // 11. GIAI ĐOẠN 2: VẼ ĐỘNG LƯỚI 42 Ô NGÀY CHO BẤT KỲ THÁNG / NĂM NÀO
    // =========================================================================
    const syncToolbarDropdownUI = (monthNum, yearNum) => {
        const monthDropdown = document.getElementById("cal-month-dropdown");
        const yearDropdown = document.getElementById("cal-year-dropdown");
        const monthLabel = document.getElementById("cal-month-label");
        const yearLabel = document.getElementById("cal-year-label");

        if (monthLabel) monthLabel.textContent = `Tháng ${monthNum}`;
        if (yearLabel) yearLabel.textContent = String(yearNum);

        if (monthDropdown) {
            const summary = monthDropdown.querySelector(".month-cal__summary");
            if (summary) summary.setAttribute("aria-label", `Chọn tháng, hiện tại là Tháng ${monthNum}`);
            monthDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                const isSelected = Number(opt.dataset.month) === Number(monthNum);
                opt.classList.toggle("is-selected", isSelected);
                if (isSelected) {
                    opt.setAttribute("aria-selected", "true");
                } else {
                    opt.removeAttribute("aria-selected");
                }
            });
        }

        if (yearDropdown) {
            const summary = yearDropdown.querySelector(".month-cal__summary");
            if (summary) summary.setAttribute("aria-label", `Chọn năm, hiện tại là ${yearNum}`);
            const yearList = yearDropdown.querySelector(".month-cal__dropdown-menu--year");

            // Nếu người dùng lật qua năm chưa có trong danh sách thì tự động thêm vào
            if (yearList && !yearList.querySelector(`[data-year="${yearNum}"]`)) {
                const li = document.createElement("li");
                const btn = document.createElement("button");
                btn.type = "button";
                btn.dataset.year = String(yearNum);
                btn.className = "month-cal__option";
                btn.textContent = String(yearNum);
                li.appendChild(btn);
                yearList.appendChild(li);
            }

            yearDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                const isSelected = Number(opt.dataset.year) === Number(yearNum);
                opt.classList.toggle("is-selected", isSelected);
                if (isSelected) {
                    opt.setAttribute("aria-selected", "true");
                } else {
                    opt.removeAttribute("aria-selected");
                }
            });
        }
    };

    const renderMonthCalendarGrid = (yearNum, monthNum, preferredActiveDay = null) => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid) return;

        currentYearNumber = Number(yearNum);
        currentMonthNumber = Number(monthNum);
        syncToolbarDropdownUI(currentMonthNumber, currentYearNumber);

        // Xác định thứ của ngày Mùng 1 Dương lịch (Chuyển Chủ Nhật = 0 sang hệ Thứ Hai = 0 -> Chủ Nhật = 6)
        const firstDayJs = new Date(currentYearNumber, currentMonthNumber - 1, 1).getDay();
        const leadingMutedCount = (firstDayJs + 6) % 7;
        const daysInCurrentMonth = new Date(currentYearNumber, currentMonthNumber, 0).getDate();

        const prevMonth = currentMonthNumber === 1 ? 12 : currentMonthNumber - 1;
        const prevYear = currentMonthNumber === 1 ? currentYearNumber - 1 : currentYearNumber;
        const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

        const nextMonth = currentMonthNumber === 12 ? 1 : currentMonthNumber + 1;
        const nextYear = currentMonthNumber === 12 ? currentYearNumber + 1 : currentYearNumber;

        const realNow = new Date();
        const realDay = realNow.getDate();
        const realMonth = realNow.getMonth() + 1;
        const realYear = realNow.getFullYear();

        // Quyết định ngày nào trong tháng được gắn trạng thái --active mặc định
        let targetActiveDay = preferredActiveDay;
        if (!targetActiveDay) {
            if (currentYearNumber === realYear && currentMonthNumber === realMonth) {
                targetActiveDay = realDay;
            } else {
                targetActiveDay = 1;
            }
        }
        if (targetActiveDay > daysInCurrentMonth) {
            targetActiveDay = daysInCurrentMonth;
        }
        selectedSolarDay = targetActiveDay;

        const fragment = document.createDocumentFragment();
        const generatedCells = [];
        let activeCellRef = null;

        for (let i = 0; i < 42; i++) {
            let cellDay;
            let cellMonth;
            let cellYear;
            let isMuted = false;

            if (i < leadingMutedCount) {
                cellDay = daysInPrevMonth - leadingMutedCount + 1 + i;
                cellMonth = prevMonth;
                cellYear = prevYear;
                isMuted = true;
            } else if (i < leadingMutedCount + daysInCurrentMonth) {
                cellDay = i - leadingMutedCount + 1;
                cellMonth = currentMonthNumber;
                cellYear = currentYearNumber;
            } else {
                cellDay = i - (leadingMutedCount + daysInCurrentMonth) + 1;
                cellMonth = nextMonth;
                cellYear = nextYear;
                isMuted = true;
            }

            const lunar = convertSolar2Lunar(cellDay, cellMonth, cellYear);
            const dayChiIdx = (lunar.jd + 1) % 12;
            const zodiacFile = ZODIAC_FILES[dayChiIdx] || "mouse";
            const fortuneStatus = getDayAuspiciousStatus(lunar.lunarMonth, dayChiIdx);

            // Kiểm tra ngày lễ / Mùng 1 / Rằm
            const solarKey = `${cellDay}/${cellMonth}`;
            const lunarKey = `${lunar.lunarDay}/${lunar.lunarMonth}`;
            let badgeText = "";
            let isHoliday = false;

            if (SOLAR_HOLIDAY_BADGES[solarKey]) {
                badgeText = SOLAR_HOLIDAY_BADGES[solarKey];
                isHoliday = true;
            } else if (!lunar.lunarLeap && LUNAR_HOLIDAY_BADGES[lunarKey]) {
                badgeText = LUNAR_HOLIDAY_BADGES[lunarKey];
                isHoliday = true;
            } else if (lunar.lunarDay === 1) {
                badgeText = "Mùng 1";
                isHoliday = true;
            } else if (lunar.lunarDay === 15) {
                badgeText = "Rằm";
                isHoliday = true;
            }

            // Kiểm tra ngày Hôm nay
            const isToday = cellDay === realDay && cellMonth === realMonth && cellYear === realYear;
            const isActive = !isMuted && cellDay === targetActiveDay;

            const statusTokens = [];
            if (fortuneStatus) statusTokens.push(fortuneStatus);
            if (isHoliday) statusTokens.push("holiday");
            if (isToday) statusTokens.push("today");

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "month-cal__cell";
            if (isMuted) btn.classList.add("month-cal__cell--muted");
            if (isToday) btn.classList.add("month-cal__cell--today");
            if (isActive) {
                btn.classList.add("month-cal__cell--active");
                btn.setAttribute("aria-current", "date");
                activeCellRef = btn;
            }

            btn.dataset.solar = String(cellDay);
            btn.dataset.month = String(cellMonth);
            btn.dataset.year = String(cellYear);
            btn.dataset.lunar = `${lunar.lunarDay}/${lunar.lunarMonth}`;
            if (statusTokens.length > 0) {
                btn.dataset.status = statusTokens.join(" ");
            }

            // 1. Nhãn Badge góc trên phải (nếu có)
            const badgeHtml = badgeText ? `<span class="month-cal__badge">${badgeText}</span>` : "";

            // 2. Chấm tròn trạng thái góc dưới trái
            let dotsInnerHtml = "";
            if (fortuneStatus === "good") {
                dotsInnerHtml += `<span class="month-cal__dot month-cal__dot--good"></span>`;
            } else if (fortuneStatus === "bad") {
                dotsInnerHtml += `<span class="month-cal__dot month-cal__dot--bad"></span>`;
            }
            if (isHoliday) {
                dotsInnerHtml += `<span class="month-cal__dot month-cal__dot--holiday"></span>`;
            }

            // 3. Hiển thị ngày Âm (Nếu là Mùng 1 hoặc ngày đầu tiên của tháng Dương thì hiện dạng dd/mm, còn lại cũng giữ dd/mm đồng bộ thiết kế Phương án 1)
            const lunarDisplayStr = `${lunar.lunarDay}/${lunar.lunarMonth}`;

            btn.innerHTML = `
                ${badgeHtml}
                <div class="month-cal__date-head">
                    <span class="month-cal__solar">${cellDay}</span>
                    <span class="month-cal__lunar">${lunarDisplayStr}</span>
                </div>
                <div class="month-cal__dots">${dotsInnerHtml}</div>
                <img
                    src="./assets/icons/zodiac/${zodiacFile}.svg"
                    alt=""
                    aria-hidden="true"
                    class="month-cal__zodiac-img"
                />
            `;

            btn.onclick = () => {
                // Nếu người dùng bấm vào ô ngày mờ (muted) của tháng trước/sau -> Tự động lật sang tháng đó
                if (isMuted) {
                    renderMonthCalendarGrid(cellYear, cellMonth, cellDay);
                    return;
                }

                generatedCells.forEach((item) => {
                    item.classList.remove("month-cal__cell--active");
                    item.removeAttribute("aria-current");
                });

                btn.classList.add("month-cal__cell--active");
                btn.setAttribute("aria-current", "date");
                selectedSolarDay = cellDay;
                syncCellToBlocCard(btn, i);
            };

            generatedCells.push(btn);
            fragment.appendChild(btn);
        }

        grid.innerHTML = "";
        grid.appendChild(fragment);

        if (activeCellRef) {
            syncCellToBlocCard(activeCellRef, generatedCells.indexOf(activeCellRef));
        }
    };

    // 12. Khởi tạo Lịch Tháng, Nút Prev/Next, Hôm nay, Dropdown Tháng/Năm & Chú thích
    const initMonthCalendar = () => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid) return;

        const prevMonthBtn = document.getElementById("cal-prev-month");
        const nextMonthBtn = document.getElementById("cal-next-month");
        const todayBtn = document.getElementById("cal-today-btn");
        const calDropdowns = document.querySelectorAll(".js-cal-dropdown");
        const legendPills = document.querySelectorAll(".month-cal__legend-pill");
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");

        // Nút Tháng trước (❮)
        if (prevMonthBtn) {
            prevMonthBtn.onclick = () => {
                const targetMonth = currentMonthNumber === 1 ? 12 : currentMonthNumber - 1;
                const targetYear = currentMonthNumber === 1 ? currentYearNumber - 1 : currentYearNumber;
                renderMonthCalendarGrid(targetYear, targetMonth, null);
            };
        }

        // Nút Tháng sau (❯)
        if (nextMonthBtn) {
            nextMonthBtn.onclick = () => {
                const targetMonth = currentMonthNumber === 12 ? 1 : currentMonthNumber + 1;
                const targetYear = currentMonthNumber === 12 ? currentYearNumber + 1 : currentYearNumber;
                renderMonthCalendarGrid(targetYear, targetMonth, null);
            };
        }

        // Nút "Hôm nay": Nhảy thẳng về đúng ngày/tháng/năm thực tế hiện tại
        if (todayBtn) {
            todayBtn.onclick = () => {
                const now = new Date();
                renderMonthCalendarGrid(now.getFullYear(), now.getMonth() + 1, now.getDate());
            };
        }

        // Nút "Sự kiện cùng ngày" trên ảnh 16:9
        if (sameDayBtn) {
            sameDayBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayVnEvents.length) return;

                currentVnEventIndex = (currentVnEventIndex + 1) % activeDayVnEvents.length;
                sameDayBtn.classList.add("is-active");
                intlBtn?.classList.remove("is-active");

                renderHistoryItemToBloc(activeDayVnEvents[currentVnEventIndex], currentMonthNumber, selectedSolarDay);
            };
        }

        // Nút "Sự kiện quốc tế" trên ảnh 16:9
        if (intlBtn) {
            intlBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayIntlEvents.length) return;

                const nextItem = activeDayIntlEvents[currentIntlEventIndex];
                currentIntlEventIndex = (currentIntlEventIndex + 1) % activeDayIntlEvents.length;
                intlBtn.classList.add("is-active");
                sameDayBtn?.classList.remove("is-active");

                renderHistoryItemToBloc(nextItem, currentMonthNumber, selectedSolarDay);
            };
        }

        // Sự kiện chọn Tháng / Năm từ Custom Dropdown
        calDropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((other) => {
                        if (other !== current) {
                            other.removeAttribute("open");
                        }
                    });
                }
            };

            current.onclick = (e) => {
                const opt = e.target.closest(".month-cal__option");
                if (!opt) return;
                e.stopPropagation();

                const nextMonth = opt.dataset.month ? Number(opt.dataset.month) : currentMonthNumber;
                const nextYear = opt.dataset.year ? Number(opt.dataset.year) : currentYearNumber;

                current.removeAttribute("open");
                renderMonthCalendarGrid(nextYear, nextMonth, null);
            };
        });

        // Bộ lọc chú thích cuối bảng (Hoàng Đạo, Hắc Đạo, Ngày Lễ, Hôm Nay)
        const highlightCellsByStatus = (statusKey) => {
            const currentCells = grid.querySelectorAll(".month-cal__cell");
            currentCells.forEach((cell) => {
                if (!statusKey) {
                    cell.classList.remove("is-dimmed", "is-highlighted");
                    return;
                }
                const cellStatus = cell.dataset.status || "";
                const isMatch = cellStatus.split(" ").includes(statusKey);
                cell.classList.toggle("is-highlighted", isMatch);
                cell.classList.toggle("is-dimmed", !isMatch);
            });
        };

        legendPills.forEach((pill) => {
            const filterKey = pill.dataset.filter;
            pill.onmouseenter = () => highlightCellsByStatus(filterKey);
            pill.onmouseleave = () => highlightCellsByStatus(null);
            pill.onfocus = () => highlightCellsByStatus(filterKey);
            pill.onblur = () => highlightCellsByStatus(null);
        });

        // Khởi chạy lần đầu tiên (Vẽ lưới lịch và đồng bộ sang Tờ Lịch Bloc)
        renderMonthCalendarGrid(currentYearNumber, currentMonthNumber, selectedSolarDay);
    };

    // 13. Khởi tạo Header, Sidebar & Footer
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header") || document.getElementById("site-header");
        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";

        if (header) {
            const burgerBtn = document.getElementById("burger-btn");
            const backdrop = document.getElementById("sidebar-backdrop");
            const widgetBtn = document.getElementById("widget-trigger-btn");
            const dropdowns = document.querySelectorAll(".js-header-dropdown");
            const themeBtns = document.querySelectorAll(".header__theme-btn");

            header.classList.toggle("header--scrolled", window.scrollY > 10);

            if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
            if (backdrop) backdrop.onclick = () => toggleSidebar(true);

            if (widgetBtn) {
                widgetBtn.onclick = () => {
                    const isExpanded = widgetBtn.getAttribute("aria-expanded") === "true";
                    const nextState = !isExpanded;
                    widgetBtn.classList.toggle("is-active", nextState);
                    widgetBtn.setAttribute("aria-expanded", String(nextState));
                };
            }

            dropdowns.forEach((current) => {
                current.ontoggle = () => {
                    if (current.open) {
                        document
                            .querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]")
                            .forEach((other) => {
                                if (other !== current) {
                                    other.removeAttribute("open");
                                }
                            });
                    }
                };
            });

            themeBtns.forEach((btn) => {
                const isCurrent = btn.dataset.theme === activeTheme;
                btn.classList.toggle("is-active", isCurrent);
                btn.setAttribute("aria-pressed", String(isCurrent));

                btn.onclick = () => {
                    applyTheme(btn.dataset.theme);
                    btn.closest("details")?.removeAttribute("open");
                };
            });

            updateClock();
            if (clockTimer) clearInterval(clockTimer);
            clockTimer = setInterval(updateClock, 1000);
        }

        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.classList.toggle("is-active", dot.dataset.quickTheme === activeTheme);
            dot.onclick = () => applyTheme(dot.dataset.quickTheme);
        });

        const scrollTopBtn = document.querySelector('[data-footer-action="scroll-top"]');
        if (scrollTopBtn) {
            scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
        }

        syncActiveSidebarLink();
        initMonthCalendar();
    };

    // 14. Sự kiện toàn cục
    const bindGlobalListeners = () => {
        if (isGlobalBound) return;
        isGlobalBound = true;

        window.addEventListener(
            "scroll",
            () => {
                const header = document.getElementById("header") || document.getElementById("site-header");
                if (header) {
                    header.classList.toggle("header--scrolled", window.scrollY > 10);
                }
            },
            { passive: true },
        );

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.removeAttribute("open");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                toggleSidebar(true);
                document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((dropdown) => {
                    dropdown.removeAttribute("open");
                });
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindGlobalListeners();
        initHeaderAndSidebar();
    });

    window.addEventListener("template-loaded", initHeaderAndSidebar);
})();
