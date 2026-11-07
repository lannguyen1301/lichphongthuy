// assets/js/header.js
// Phụ trách: Sticky Header, Đồng hồ thời gian thực, Theme Ngũ hành, Sidebar Mobile, Footer & Bento Modal Đổi Âm/Dương
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // Trạng thái của Bento Modal Đổi Âm/Dương
    let convertMode = "solar2lunar"; // "solar2lunar" | "lunar2solar"
    let selectedInputDay = 6;
    let selectedInputMonth = 11;
    let selectedInputYear = 2026;
    let yearGridStart = 2020; // Hiển thị 12 năm mỗi trang trong Bento Year Picker (2020 - 2031)
    let resolvedSolarDate = { day: 6, month: 11, year: 2026 };

    const pad = (n) => String(n).padStart(2, "0");
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

    const VI_SOLAR_MONTH_NAMES = [
        "",
        "Tháng Một",
        "Tháng Hai",
        "Tháng Ba",
        "Tháng Tư",
        "Tháng Năm",
        "Tháng Sáu",
        "Tháng Bảy",
        "Tháng Tám",
        "Tháng Chín",
        "Tháng Mười",
        "Tháng Mười Một",
        "Tháng Mười Hai",
    ];

    const VI_LUNAR_MONTH_NAMES = [
        "",
        "Tháng Giêng",
        "Tháng Hai",
        "Tháng Ba",
        "Tháng Tư",
        "Tháng Năm",
        "Tháng Sáu",
        "Tháng Bảy",
        "Tháng Tám",
        "Tháng Chín",
        "Tháng Mười",
        "Tháng Mười Một",
        "Tháng Chạp",
    ];

    const HOUR_SLOTS = [
        { chi: "Tý", range: "23:00 - 01:00", icon: "mouse.svg" },
        { chi: "Sửu", range: "01:00 - 03:00", icon: "buffalo.svg" },
        { chi: "Dần", range: "03:00 - 05:00", icon: "tiger.svg" },
        { chi: "Mão", range: "05:00 - 07:00", icon: "cat.svg" },
        { chi: "Thìn", range: "07:00 - 09:00", icon: "dragon.svg" },
        { chi: "Tỵ", range: "09:00 - 11:00", icon: "snake.svg" },
        { chi: "Ngọ", range: "11:00 - 13:00", icon: "horse.svg" },
        { chi: "Mùi", range: "13:00 - 15:00", icon: "goat.svg" },
        { chi: "Thân", range: "15:00 - 17:00", icon: "monkey.svg" },
        { chi: "Dậu", range: "17:00 - 19:00", icon: "rooster.svg" },
        { chi: "Tuất", range: "19:00 - 21:00", icon: "dog.svg" },
        { chi: "Hợi", range: "21:00 - 23:00", icon: "pig.svg" },
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
        { name: "Kiến", short: "Tốt xuất hành, khai trương" },
        { name: "Trừ", short: "Tốt cầu an, giải trừ xấu" },
        { name: "Mãn", short: "Tốt cầu tài, khai trương" },
        { name: "Bình", short: "Tốt tu tạo, nhập trạch" },
        { name: "Định", short: "Tốt ký kết, cầu danh" },
        { name: "Chấp", short: "Tốt xây dựng, tu bổ" },
        { name: "Phá", short: "Hợp dỡ bỏ cũ, chữa bệnh" },
        { name: "Nguy", short: "Nên cẩn trọng việc lớn" },
        { name: "Thành", short: "Tốt khai trương, cưới gả" },
        { name: "Thu", short: "Tốt thu hoạch, tích trữ" },
        { name: "Khai", short: "Khởi đầu đại cát, hanh thông" },
        { name: "Bế", short: "Hợp tu dưỡng, bồi đắp" },
    ];

    // Nhận diện Icon Ngũ Hành từ tên Nạp Âm (Kim, Mộc, Thủy, Hỏa, Thổ)
    const resolveElementInfo = (napAmStr) => {
        const text = String(napAmStr || "").trim();
        if (text.endsWith("Kim")) return { icon: "metal.svg", label: "Hành Kim • Kim khí" };
        if (text.endsWith("Mộc")) return { icon: "wood.svg", label: "Hành Mộc • Sinh trưởng" };
        if (text.endsWith("Thủy")) return { icon: "water.svg", label: "Hành Thủy • Linh hoạt" };
        if (text.endsWith("Hỏa")) return { icon: "fire.svg", label: "Hành Hỏa • Nhiệt huyết" };
        return { icon: "earth.svg", label: "Hành Thổ • Vững chãi" };
    };

    // =========================================================================
    // THUẬT TOÁN QUY ĐỔI ÂM <-> DƯƠNG 2 CHIỀU CHUẨN VIỆT NAM (UTC+7)
    // =========================================================================
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

    const applyTheme = (selectedTheme) => {
        if (!selectedTheme) return;
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

        document.querySelectorAll(".header__theme-btn").forEach((btn) => {
            const isMatch = btn.dataset.theme === selectedTheme;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(Boolean(isMatch)));
        });

        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.classList.toggle("is-active", dot.dataset.quickTheme === selectedTheme);
        });
    };

    // 2. Bật/tắt Sidebar Drawer trên Mobile & Khóa cuộn trang
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

    // =========================================================================
    // 5. BENTO MODAL ĐỔI NGÀY ÂM - DƯƠNG (CUSTOM BENTO PICKERS + ICON CARDS)
    // =========================================================================
    const toggleConverterModal = (forceOpen = null) => {
        const modal = document.getElementById("converter-modal");
        const triggerBtn = document.getElementById("widget-trigger-btn");
        if (!modal) return;

        const shouldOpen = forceOpen !== null ? forceOpen : modal.hidden;
        modal.hidden = !shouldOpen;

        if (triggerBtn) {
            triggerBtn.classList.toggle("is-active", shouldOpen);
            triggerBtn.setAttribute("aria-expanded", String(shouldOpen));
        }

        document.body.style.overflow = shouldOpen ? "hidden" : "";
    };

    // Vẽ Lưới Bento 7 cột cho Ngày, 3x4 cho Tháng, 4x3 cho Năm
    const renderCustomBentoPickers = () => {
        const dayListEl = document.getElementById("conv-day-list");
        const monthListEl = document.getElementById("conv-month-list");
        const yearListEl = document.getElementById("conv-year-list");
        const dayTextEl = document.getElementById("conv-day-text");
        const monthTextEl = document.getElementById("conv-month-text");
        const yearTextEl = document.getElementById("conv-year-text");
        const yearRangeLabel = document.getElementById("conv-year-range-label");

        if (!dayListEl || !monthListEl || !yearListEl) return;

        const maxDays =
            convertMode === "solar2lunar"
                ? new Date(selectedInputYear, selectedInputMonth, 0).getDate()
                : 30;

        if (selectedInputDay > maxDays) selectedInputDay = maxDays;

        if (dayTextEl) dayTextEl.textContent = `Ngày ${pad(selectedInputDay)}`;
        if (monthTextEl) monthTextEl.textContent = `Tháng ${pad(selectedInputMonth)}`;
        if (yearTextEl) yearTextEl.textContent = `Năm ${selectedInputYear}`;

        // 1. Render Lưới Ngày (7 cột)
        let daysHtml = "";
        for (let d = 1; d <= maxDays; d++) {
            const isSel = d === selectedInputDay;
            daysHtml += `
                <li>
                    <button
                        type="button"
                        role="option"
                        aria-selected="${isSel}"
                        data-conv-day="${d}"
                        class="converter-modal__option-btn ${isSel ? "is-selected" : ""}"
                    >
                        ${pad(d)}
                    </button>
                </li>
            `;
        }
        dayListEl.innerHTML = daysHtml;

        // 2. Render Lưới Tháng (3 cột x 4 hàng)
        let monthsHtml = "";
        for (let m = 1; m <= 12; m++) {
            const isSel = m === selectedInputMonth;
            monthsHtml += `
                <li>
                    <button
                        type="button"
                        role="option"
                        aria-selected="${isSel}"
                        data-conv-month="${m}"
                        class="converter-modal__option-btn ${isSel ? "is-selected" : ""}"
                    >
                        Tháng ${m}
                    </button>
                </li>
            `;
        }
        monthListEl.innerHTML = monthsHtml;

        // 3. Render Lưới Năm (4 cột x 3 hàng = 12 năm)
        if (yearRangeLabel) {
            yearRangeLabel.textContent = `${yearGridStart} - ${yearGridStart + 11}`;
        }
        let yearsHtml = "";
        for (let y = yearGridStart; y < yearGridStart + 12; y++) {
            const isSel = y === selectedInputYear;
            yearsHtml += `
                <li>
                    <button
                        type="button"
                        role="option"
                        aria-selected="${isSel}"
                        data-conv-year="${y}"
                        class="converter-modal__option-btn ${isSel ? "is-selected" : ""}"
                    >
                        ${y}
                    </button>
                </li>
            `;
        }
        yearListEl.innerHTML = yearsHtml;
    };

    const runConversionAndRender = () => {
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const isLeapChecked = leapCheckbox?.checked ? 1 : 0;

        let sDay = selectedInputDay;
        let sMonth = selectedInputMonth;
        let sYear = selectedInputYear;

        if (convertMode === "lunar2solar") {
            let converted = convertLunar2Solar(
                selectedInputDay,
                selectedInputMonth,
                selectedInputYear,
                isLeapChecked,
            );
            if (!converted || converted.sDay === 0) {
                if (leapCheckbox) leapCheckbox.checked = false;
                converted = convertLunar2Solar(selectedInputDay, selectedInputMonth, selectedInputYear, 0);
            }
            if (converted && converted.sDay > 0) {
                sDay = converted.sDay;
                sMonth = converted.sMonth;
                sYear = converted.sYear;
            }
        }

        resolvedSolarDate = { day: sDay, month: sMonth, year: sYear };
        const lunar = convertSolar2Lunar(sDay, sMonth, sYear);
        const { lunarDay, lunarMonth, lunarYear, lunarLeap, isFullMonth, jd } = lunar;

        const yearCanIdx = (lunarYear + 6) % 10;
        const yearChiIdx = (lunarYear + 8) % 12;
        const monthCanIdx = (yearCanIdx * 2 + lunarMonth + 1) % 10;
        const monthChiIdx = (lunarMonth + 1) % 12;
        const dayCanIdx = (jd + 9) % 10;
        const dayChiIdx = (jd + 1) % 12;
        const ratHourStemIdx = ((dayCanIdx % 5) * 2) % 10;

        const yearCanChi = `${THIEN_CAN[yearCanIdx]} ${DIA_CHI[yearChiIdx]}`;
        const monthCanChi = `${THIEN_CAN[monthCanIdx]} ${DIA_CHI[monthChiIdx]}`;
        const dayCanChi = `${THIEN_CAN[dayCanIdx]} ${DIA_CHI[dayChiIdx]}`;

        const yearSexagenary = (((6 * yearCanIdx - 5 * yearChiIdx) % 60) + 60) % 60;
        const daySexagenary = (((6 * dayCanIdx - 5 * dayChiIdx) % 60) + 60) % 60;
        const yearNapAm = NAP_AM_LIST[Math.floor(yearSexagenary / 2)] || "Thiên Hà Thủy";
        const dayNapAm = NAP_AM_LIST[Math.floor(daySexagenary / 2)] || "Bạch Lạp Kim";

        const dateObj = new Date(sYear, sMonth - 1, sDay);
        const weekdayBilingual = `${viWeekdayFormatter.format(dateObj).toUpperCase()} • ${enWeekdayFormatter.format(dateObj).toUpperCase()}`;
        const enMonthName = enMonthFormatter.format(dateObj);

        const startChi = ((lunarMonth - 1) * 2) % 12;
        const offset = (dayChiIdx - startChi + 12) % 12;
        const fortuneStatus = [0, 1, 4, 7].includes(offset)
            ? "good"
            : [2, 3, 6, 8].includes(offset)
              ? "bad"
              : "normal";

        const trucObj = TRUC_LIST[(dayChiIdx - monthChiIdx + 12) % 12] || TRUC_LIST[0];
        const solarTerm = getSolarTermName(sDay, sMonth);
        const elementInfo = resolveElementInfo(dayNapAm);

        // 1. Đảo Dương lịch & Âm lịch
        document.getElementById("conv-res-solar").textContent = `${pad(sDay)}/${pad(sMonth)}/${sYear}`;
        document.getElementById("conv-res-weekday").textContent = weekdayBilingual;
        document.getElementById("conv-res-solar-full").textContent =
            `${VI_SOLAR_MONTH_NAMES[sMonth]} (${enMonthName}) • Năm ${sYear}`;

        const lunarTagEl = document.getElementById("conv-res-lunar-tag");
        if (lunarTagEl) {
            const sizeText = isFullMonth ? "Tháng Đủ" : "Tháng Thiếu";
            const leapText = lunarLeap ? " • Nhuận" : "";
            lunarTagEl.textContent = `Âm lịch • ${sizeText}${leapText}`;
        }

        document.getElementById("conv-res-lunar").textContent = `${pad(lunarDay)}/${pad(lunarMonth)}/${lunarYear}`;
        document.getElementById("conv-res-year-canchi").textContent = `Năm ${yearCanChi}`;
        document.getElementById("conv-res-year-napam").textContent = `Mệnh năm: ${yearNapAm}`;

        const yearZodiacImg = document.getElementById("conv-res-year-zodiac");
        if (yearZodiacImg) {
            yearZodiacImg.src = `./assets/icons/zodiac/${ZODIAC_FILES[yearChiIdx]}.svg`;
        }

        // 2. Bốn Bento Cards Thông số kèm Icon Con Giáp & Icon Ngũ Hành
        const dayZodiacPath = `./assets/icons/zodiac/${ZODIAC_FILES[dayChiIdx]}.svg`;
        const monthZodiacPath = `./assets/icons/zodiac/${ZODIAC_FILES[monthChiIdx]}.svg`;

        document.getElementById("conv-icon-day-zodiac")?.setAttribute("src", dayZodiacPath);
        document.getElementById("conv-bg-day-zodiac")?.setAttribute("src", dayZodiacPath);
        document.getElementById("conv-res-day-canchi").textContent = dayCanChi;
        document.getElementById("conv-res-day-status-sub").textContent =
            fortuneStatus === "good"
                ? "Ngày Hoàng Đạo"
                : fortuneStatus === "bad"
                  ? "Ngày Hắc Đạo"
                  : "Ngày Bình Thường";

        document.getElementById("conv-icon-month-zodiac")?.setAttribute("src", monthZodiacPath);
        document.getElementById("conv-bg-month-zodiac")?.setAttribute("src", monthZodiacPath);
        document.getElementById("conv-res-month-canchi").textContent = monthCanChi;
        document.getElementById("conv-res-month-lunar-sub").textContent =
            `${VI_LUNAR_MONTH_NAMES[lunarMonth]} (${isFullMonth ? "Đủ" : "Thiếu"})`;

        document.getElementById("conv-icon-element")?.setAttribute("src", `./assets/icons/${elementInfo.icon}`);
        document.getElementById("conv-res-napam").textContent = dayNapAm;
        document.getElementById("conv-res-element-sub").textContent = elementInfo.label;

        document.getElementById("conv-res-term").textContent = solarTerm;
        document.getElementById("conv-res-truc").textContent = `Trực ${trucObj.name} • ${trucObj.short}`;

        // 3. Vẽ 6 Bento Cards Giờ Hoàng Đạo kèm Icon Con Giáp
        const fortunePill = document.getElementById("conv-res-fortune-pill");
        const fortuneTitle = document.getElementById("conv-res-fortune-title");
        const hoursGrid = document.getElementById("conv-res-hours-grid");

        if (fortunePill) fortunePill.dataset.fortune = fortuneStatus;
        if (fortuneTitle) {
            fortuneTitle.textContent =
                fortuneStatus === "good"
                    ? "Ngày Hoàng Đạo (Tốt)"
                    : fortuneStatus === "bad"
                      ? "Ngày Hắc Đạo (Xấu)"
                      : "Ngày Bình Thường";
        }

        if (hoursGrid) {
            const goodIndices = GOOD_HOUR_INDICES[dayChiIdx] || [0, 1, 3, 6, 8, 9];
            hoursGrid.innerHTML = goodIndices
                .map((hIdx) => {
                    const slot = HOUR_SLOTS[hIdx];
                    const hStemIdx = (ratHourStemIdx + hIdx) % 10;
                    const hourCanChi = `${THIEN_CAN[hStemIdx]} ${slot.chi}`;
                    return `
                        <article class="converter-modal__hour-card" title="Giờ Hoàng Đạo: ${hourCanChi} (${slot.range})">
                            <div class="converter-modal__hour-top">
                                <span class="converter-modal__hour-dot" aria-hidden="true"></span>
                                <strong class="converter-modal__hour-name">${hourCanChi}</strong>
                            </div>
                            <span class="converter-modal__hour-time">${slot.range}</span>
                            <img
                                src="./assets/icons/zodiac/${slot.icon}"
                                alt=""
                                aria-hidden="true"
                                class="converter-modal__hour-zodiac"
                            />
                        </article>
                    `;
                })
                .join("");
        }
    };

    const setConverterToToday = () => {
        const now = new Date();
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        if (leapCheckbox) leapCheckbox.checked = false;

        if (convertMode === "solar2lunar") {
            selectedInputDay = now.getDate();
            selectedInputMonth = now.getMonth() + 1;
            selectedInputYear = now.getFullYear();
        } else {
            const lunarToday = convertSolar2Lunar(now.getDate(), now.getMonth() + 1, now.getFullYear());
            selectedInputDay = lunarToday.lunarDay;
            selectedInputMonth = lunarToday.lunarMonth;
            selectedInputYear = lunarToday.lunarYear;
            if (leapCheckbox) leapCheckbox.checked = Boolean(lunarToday.lunarLeap);
        }

        yearGridStart = Math.floor(selectedInputYear / 12) * 12 - 4;
        renderCustomBentoPickers();
        runConversionAndRender();
    };

    const initConverterModal = () => {
        const modal = document.getElementById("converter-modal");
        const widgetBtn = document.getElementById("widget-trigger-btn");
        if (!modal) return;

        if (widgetBtn) {
            widgetBtn.onclick = (e) => {
                e.preventDefault();
                toggleConverterModal();
            };
        }

        if (modal.dataset.bound === "true") return;
        modal.dataset.bound = "true";

        const closeBtn = document.getElementById("converter-modal-close");
        const backdrop = document.getElementById("converter-modal-backdrop");
        const dayDropdown = document.getElementById("conv-day-dropdown");
        const monthDropdown = document.getElementById("conv-month-dropdown");
        const yearDropdown = document.getElementById("conv-year-dropdown");
        const prevRangeBtn = document.getElementById("conv-year-prev-range");
        const nextRangeBtn = document.getElementById("conv-year-next-range");
        const leapRow = document.getElementById("conv-leap-row");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const swapBtn = document.getElementById("conv-swap-direction-btn");
        const todayBtn = document.getElementById("conv-btn-today");
        const jumpBtn = document.getElementById("conv-btn-jump");
        const tabs = modal.querySelectorAll(".converter-modal__tab");

        if (closeBtn) closeBtn.onclick = () => toggleConverterModal(false);
        if (backdrop) backdrop.onclick = () => toggleConverterModal(false);

        const switchConvertMode = (nextMode) => {
            convertMode = nextMode;
            tabs.forEach((t) => {
                const isMatch = t.dataset.convertMode === convertMode;
                t.classList.toggle("is-active", isMatch);
                t.setAttribute("aria-selected", String(isMatch));
            });

            const isLunarInput = convertMode === "lunar2solar";
            document.getElementById("conv-day-label").textContent = isLunarInput ? "Ngày Âm" : "Ngày Dương";
            document.getElementById("conv-month-label").textContent = isLunarInput ? "Tháng Âm" : "Tháng Dương";
            if (leapRow) leapRow.hidden = !isLunarInput;

            renderCustomBentoPickers();
            runConversionAndRender();
        };

        tabs.forEach((tab) => {
            tab.onclick = () => switchConvertMode(tab.dataset.convertMode || "solar2lunar");
        });

        if (swapBtn) {
            swapBtn.onclick = () => {
                const nextMode = convertMode === "solar2lunar" ? "lunar2solar" : "solar2lunar";
                switchConvertMode(nextMode);
            };
        }

        // Đóng các dropdown khác khi mở 1 dropdown trong Modal
        [dayDropdown, monthDropdown, yearDropdown].forEach((current) => {
            if (!current) return;
            current.ontoggle = () => {
                if (current.open) {
                    [dayDropdown, monthDropdown, yearDropdown].forEach((other) => {
                        if (other && other !== current) other.removeAttribute("open");
                    });
                }
            };
        });

        // Chọn Ngày trong Lưới Bento 7 cột
        dayDropdown?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-conv-day]");
            if (!btn) return;
            e.stopPropagation();
            selectedInputDay = Number(btn.dataset.convDay);
            dayDropdown.removeAttribute("open");
            renderCustomBentoPickers();
            runConversionAndRender();
        });

        // Chọn Tháng trong Lưới Bento 3x4
        monthDropdown?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-conv-month]");
            if (!btn) return;
            e.stopPropagation();
            selectedInputMonth = Number(btn.dataset.convMonth);
            monthDropdown.removeAttribute("open");
            renderCustomBentoPickers();
            runConversionAndRender();
        });

        // Chọn Năm trong Lưới Bento 4x3
        yearDropdown?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-conv-year]");
            if (!btn) return;
            e.stopPropagation();
            selectedInputYear = Number(btn.dataset.convYear);
            yearDropdown.removeAttribute("open");
            renderCustomBentoPickers();
            runConversionAndRender();
        });

        if (prevRangeBtn) {
            prevRangeBtn.onclick = (e) => {
                e.stopPropagation();
                yearGridStart -= 12;
                renderCustomBentoPickers();
            };
        }

        if (nextRangeBtn) {
            nextRangeBtn.onclick = (e) => {
                e.stopPropagation();
                yearGridStart += 12;
                renderCustomBentoPickers();
            };
        }

        leapCheckbox?.addEventListener("change", runConversionAndRender);
        if (todayBtn) todayBtn.onclick = setConverterToToday;

        if (jumpBtn) {
            jumpBtn.onclick = () => {
                const { day, month, year } = resolvedSolarDate;
                toggleConverterModal(false);

                if (document.getElementById("month-cal-grid")) {
                    window.dispatchEvent(
                        new CustomEvent("converter-jump-to-date", {
                            detail: { year, month, day },
                        }),
                    );
                    document.getElementById("bloc-media-box")?.scrollIntoView({ behavior: "smooth" });
                } else {
                    window.location.href = `./index.html?date=${year}-${pad(month)}-${pad(day)}`;
                }
            };
        }

        setConverterToToday();
    };

    // 6. Khởi tạo Header, Sidebar, Footer & Modal
    const initHeaderAndSidebar = () => {
        const header = document.getElementById("header") || document.getElementById("site-header");
        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";

        if (header) {
            const burgerBtn = document.getElementById("burger-btn");
            const backdrop = document.getElementById("sidebar-backdrop");
            const dropdowns = document.querySelectorAll(".js-header-dropdown");
            const themeBtns = document.querySelectorAll(".header__theme-btn");

            header.classList.toggle("header--scrolled", window.scrollY > 10);

            if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
            if (backdrop) backdrop.onclick = () => toggleSidebar(true);

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

        const footerConverterBtn = document.querySelector('[data-footer-action="open-converter"]');
        if (footerConverterBtn) {
            footerConverterBtn.onclick = () => toggleConverterModal(true);
        }

        syncActiveSidebarLink();
        initConverterModal();
    };

    // 7. Sự kiện toàn cục
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
                const modal = document.getElementById("converter-modal");
                if (modal && !modal.hidden) {
                    toggleConverterModal(false);
                }
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