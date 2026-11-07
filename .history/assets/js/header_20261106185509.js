// assets/js/header.js
// Phụ trách: Sticky Header, Đồng hồ thời gian thực, Theme Ngũ hành, Sidebar Mobile, Footer & Modal Đổi Âm/Dương
(() => {
    const THEME_STORAGE_KEY = "feng_shui_theme";
    let isGlobalBound = false;
    let clockTimer = null;

    // Trạng thái của Modal Đổi Âm/Dương
    let convertMode = "solar2lunar"; // "solar2lunar" | "lunar2solar"
    let resolvedSolarDate = { day: 4, month: 11, year: 2026 };

    const pad = (n) => String(n).padStart(2, "0");
    const INT = (d) => Math.floor(d);

    const viWeekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "long" });
    const enWeekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

    const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
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
    const TRUC_NAMES = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"];

    // =========================================================================
    // THUẬT TOÁN QUY ĐỔI ÂM <-> DƯƠNG 2 CHIỀU CHO MODAL HEADER
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
    // 5. ĐIỀU KHIỂN MODAL ĐỔI NGÀY ÂM - DƯƠNG TRÊN HEADER
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

        if (shouldOpen) {
            document.getElementById("conv-day")?.focus();
        } else {
            triggerBtn?.focus();
        }
    };

    const populateConverterSelects = (daySelect, monthSelect, yearSelect) => {
        if (!daySelect || !monthSelect || !yearSelect) return;

        if (yearSelect.options.length === 0) {
            let yearHtml = "";
            for (let y = 1920; y <= 2100; y++) {
                yearHtml += `<option value="${y}">Năm ${y}</option>`;
            }
            yearSelect.innerHTML = yearHtml;
        }

        if (monthSelect.options.length === 0) {
            let monthHtml = "";
            for (let m = 1; m <= 12; m++) {
                monthHtml += `<option value="${m}">Tháng ${pad(m)}</option>`;
            }
            monthSelect.innerHTML = monthHtml;
        }

        const selectedYear = Number(yearSelect.value) || 2026;
        const selectedMonth = Number(monthSelect.value) || 11;
        const prevDay = Number(daySelect.value) || 4;
        const maxDays =
            convertMode === "solar2lunar" ? new Date(selectedYear, selectedMonth, 0).getDate() : 30;

        let dayHtml = "";
        for (let d = 1; d <= maxDays; d++) {
            dayHtml += `<option value="${d}">Ngày ${pad(d)}</option>`;
        }
        daySelect.innerHTML = dayHtml;
        daySelect.value = String(Math.min(prevDay, maxDays));
    };

    const runConversionAndRender = () => {
        const daySelect = document.getElementById("conv-day");
        const monthSelect = document.getElementById("conv-month");
        const yearSelect = document.getElementById("conv-year");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        if (!daySelect || !monthSelect || !yearSelect) return;

        const inputDay = Number(daySelect.value) || 1;
        const inputMonth = Number(monthSelect.value) || 1;
        const inputYear = Number(yearSelect.value) || 2026;
        const isLeapChecked = leapCheckbox?.checked ? 1 : 0;

        let sDay = inputDay;
        let sMonth = inputMonth;
        let sYear = inputYear;

        if (convertMode === "lunar2solar") {
            let converted = convertLunar2Solar(inputDay, inputMonth, inputYear, isLeapChecked);
            if (!converted || converted.sDay === 0) {
                if (leapCheckbox) leapCheckbox.checked = false;
                converted = convertLunar2Solar(inputDay, inputMonth, inputYear, 0);
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

        const yearCanChi = `${THIEN_CAN[yearCanIdx]} ${DIA_CHI[yearChiIdx]}`;
        const monthCanChi = `${THIEN_CAN[monthCanIdx]} ${DIA_CHI[monthChiIdx]}`;
        const dayCanChi = `${THIEN_CAN[dayCanIdx]} ${DIA_CHI[dayChiIdx]}`;

        const yearSexagenary = (((6 * yearCanIdx - 5 * yearChiIdx) % 60) + 60) % 60;
        const daySexagenary = (((6 * dayCanIdx - 5 * dayChiIdx) % 60) + 60) % 60;
        const yearNapAm = NAP_AM_LIST[Math.floor(yearSexagenary / 2)] || "Thiên Hà Thủy";
        const dayNapAm = NAP_AM_LIST[Math.floor(daySexagenary / 2)] || "Bạch Lạp Kim";

        const dateObj = new Date(sYear, sMonth - 1, sDay);
        const weekdayBilingual = `${viWeekdayFormatter.format(dateObj).toUpperCase()} • ${enWeekdayFormatter.format(dateObj).toUpperCase()}`;

        const startChi = ((lunarMonth - 1) * 2) % 12;
        const offset = (dayChiIdx - startChi + 12) % 12;
        const fortuneStatus = [0, 1, 4, 7].includes(offset)
            ? "good"
            : [2, 3, 6, 8].includes(offset)
              ? "bad"
              : "";

        const trucName = TRUC_NAMES[(dayChiIdx - monthChiIdx + 12) % 12] || "Thành";
        const solarTerm = getSolarTermName(sDay, sMonth);
        const goodIndices = GOOD_HOUR_INDICES[dayChiIdx] || [0, 1, 3, 6, 8, 9];
        const goodHoursStr = HOUR_RANGES.filter((_, idx) => goodIndices.includes(idx)).join(", ");

        document.getElementById("conv-res-solar").textContent = `${pad(sDay)}/${pad(sMonth)}/${sYear}`;
        document.getElementById("conv-res-weekday").textContent = weekdayBilingual;

        const lunarTagEl = document.getElementById("conv-res-lunar-tag");
        if (lunarTagEl) {
            const sizeText = isFullMonth ? "Tháng Đủ" : "Tháng Thiếu";
            const leapText = lunarLeap ? " • Nhuận" : "";
            lunarTagEl.textContent = `Âm lịch (${sizeText}${leapText})`;
        }

        document.getElementById("conv-res-lunar").textContent = `${pad(lunarDay)}/${pad(lunarMonth)}/${lunarYear}`;
        document.getElementById("conv-res-year-canchi").textContent = `Năm ${yearCanChi} (${yearNapAm})`;
        document.getElementById("conv-res-day-canchi").textContent = dayCanChi;
        document.getElementById("conv-res-month-canchi").textContent = monthCanChi;
        document.getElementById("conv-res-napam").textContent = dayNapAm;
        document.getElementById("conv-res-term-truc").textContent = `${solarTerm} • Trực ${trucName}`;

        const fortuneEl = document.getElementById("conv-res-fortune");
        if (fortuneEl) {
            const statusTitle =
                fortuneStatus === "good"
                    ? "🌟 Ngày Hoàng Đạo (Tốt)"
                    : fortuneStatus === "bad"
                      ? "🌙 Ngày Hắc Đạo (Xấu)"
                      : "⚖️ Ngày Bình Thường";
            fortuneEl.textContent = `${statusTitle} — Giờ Hoàng Đạo: ${goodHoursStr}`;
        }
    };

    const setConverterToToday = () => {
        const daySelect = document.getElementById("conv-day");
        const monthSelect = document.getElementById("conv-month");
        const yearSelect = document.getElementById("conv-year");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        if (!daySelect || !monthSelect || !yearSelect) return;

        const now = new Date();
        if (leapCheckbox) leapCheckbox.checked = false;

        if (convertMode === "solar2lunar") {
            yearSelect.value = String(now.getFullYear());
            monthSelect.value = String(now.getMonth() + 1);
            populateConverterSelects(daySelect, monthSelect, yearSelect);
            daySelect.value = String(now.getDate());
        } else {
            const lunarToday = convertSolar2Lunar(now.getDate(), now.getMonth() + 1, now.getFullYear());
            yearSelect.value = String(lunarToday.lunarYear);
            monthSelect.value = String(lunarToday.lunarMonth);
            populateConverterSelects(daySelect, monthSelect, yearSelect);
            daySelect.value = String(lunarToday.lunarDay);
            if (leapCheckbox) leapCheckbox.checked = Boolean(lunarToday.lunarLeap);
        }

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
        const daySelect = document.getElementById("conv-day");
        const monthSelect = document.getElementById("conv-month");
        const yearSelect = document.getElementById("conv-year");
        const leapRow = document.getElementById("conv-leap-row");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const todayBtn = document.getElementById("conv-btn-today");
        const jumpBtn = document.getElementById("conv-btn-jump");
        const tabs = modal.querySelectorAll(".converter-modal__tab");

        if (closeBtn) closeBtn.onclick = () => toggleConverterModal(false);
        if (backdrop) backdrop.onclick = () => toggleConverterModal(false);

        tabs.forEach((tab) => {
            tab.onclick = () => {
                convertMode = tab.dataset.convertMode || "solar2lunar";
                tabs.forEach((t) => {
                    const isMatch = t === tab;
                    t.classList.toggle("is-active", isMatch);
                    t.setAttribute("aria-selected", String(isMatch));
                });

                const isLunarInput = convertMode === "lunar2solar";
                document.getElementById("conv-day-label").textContent = isLunarInput ? "Ngày Âm" : "Ngày Dương";
                document.getElementById("conv-month-label").textContent = isLunarInput ? "Tháng Âm" : "Tháng Dương";
                if (leapRow) leapRow.hidden = !isLunarInput;

                populateConverterSelects(daySelect, monthSelect, yearSelect);
                runConversionAndRender();
            };
        });

        [monthSelect, yearSelect].forEach((sel) => {
            sel?.addEventListener("change", () => {
                populateConverterSelects(daySelect, monthSelect, yearSelect);
                runConversionAndRender();
            });
        });

        daySelect?.addEventListener("change", runConversionAndRender);
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