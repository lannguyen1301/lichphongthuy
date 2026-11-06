// assets/js/clock.js
(() => {
    const app = document.getElementById("clock-bento-app");
    if (!app) return;

    // 1. Danh mục 12 Địa Chi & Icon 12 Con Giáp tương ứng trong dự án
    const ZODIAC_BRANCHES = [
        { index: 0, key: "ty", vn: "Tý", han: "子", range: "23:00 - 01:00", start: 23, end: 1, icon: "mouse.svg" },
        { index: 1, key: "suu", vn: "Sửu", han: "丑", range: "01:00 - 03:00", start: 1, end: 3, icon: "buffalo.svg" },
        { index: 2, key: "dan", vn: "Dần", han: "寅", range: "03:00 - 05:00", start: 3, end: 5, icon: "tiger.svg" },
        { index: 3, key: "mao", vn: "Mão", han: "卯", range: "05:00 - 07:00", start: 5, end: 7, icon: "cat.svg" },
        { index: 4, key: "thin", vn: "Thìn", han: "辰", range: "07:00 - 09:00", start: 7, end: 9, icon: "dragon.svg" },
        { index: 5, key: "ty_snake", vn: "Tỵ", han: "巳", range: "09:00 - 11:00", start: 9, end: 11, icon: "snake.svg" },
        { index: 6, key: "ngo", vn: "Ngọ", han: "午", range: "11:00 - 13:00", start: 11, end: 13, icon: "horse.svg" },
        { index: 7, key: "mui", vn: "Mùi", han: "未", range: "13:00 - 15:00", start: 13, end: 15, icon: "goat.svg" },
        { index: 8, key: "than", vn: "Thân", han: "申", range: "15:00 - 17:00", start: 15, end: 17, icon: "monkey.svg" },
        { index: 9, key: "dau", vn: "Dậu", han: "酉", range: "17:00 - 19:00", start: 17, end: 19, icon: "rooster.svg" },
        { index: 10, key: "tuat", vn: "Tuất", han: "戌", range: "19:00 - 21:00", start: 19, end: 21, icon: "dog.svg" },
        { index: 11, key: "hoi", vn: "Hợi", han: "亥", range: "21:00 - 23:00", start: 21, end: 23, icon: "pig.svg" },
    ];

    const STEMS_VN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const BRANCHES_VN = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

    // Bảng Giờ Hoàng Đạo chuẩn theo Địa Chi của Ngày (0: Tý -> 11: Hợi)
    const AUSPICIOUS_HOURS_BY_DAY_BRANCH = {
        0: [0, 1, 3, 6, 8, 9],   // Ngày Tý, Ngọ
        6: [0, 1, 3, 6, 8, 9],
        1: [2, 3, 5, 8, 10, 11], // Ngày Sửu, Mùi
        7: [2, 3, 5, 8, 10, 11],
        2: [0, 1, 4, 5, 7, 10],  // Ngày Dần, Thân
        8: [0, 1, 4, 5, 7, 10],
        3: [0, 2, 3, 6, 7, 9],   // Ngày Mão, Dậu
        9: [0, 2, 3, 6, 7, 9],
        4: [2, 4, 5, 8, 9, 11],  // Ngày Thìn, Tuất
        10: [2, 4, 5, 8, 9, 11],
        5: [1, 4, 6, 7, 10, 11], // Ngày Tỵ, Hợi
        11: [1, 4, 6, 7, 10, 11],
    };

    // Bảng 30 Nạp Âm Ngũ Hành tiếng Việt
    const NAP_AM_60 = [
        "Hải Trung Kim", "Lư Trung Hỏa", "Đại Lâm Mộc", "Lộ Bàng Thổ", "Kiếm Phong Kim",
        "Sơn Đầu Hỏa", "Giản Hạ Thủy", "Thành Đầu Thổ", "Bạch Lạp Kim", "Dương Liễu Mộc",
        "Tuyền Trung Thủy", "Ốc Thượng Thổ", "Tích Lịch Hỏa", "Tùng Bách Mộc", "Trường Lưu Thủy",
        "Sa Trung Kim", "Sơn Hạ Hỏa", "Bình Địa Mộc", "Bích Thượng Thổ", "Kim Bạc Kim",
        "Phúc Đăng Hỏa", "Thiên Hà Thủy", "Đại Trạch Thổ", "Thoa Xuyến Kim", "Tang Đố Mộc",
        "Đại Khê Thủy", "Sa Trung Thổ", "Thiên Thượng Hỏa", "Thạch Lựu Mộc", "Đại Hải Thủy",
    ];

    let lastRenderedBranchIndex = -1;
    let selectedBranchIndex = -1;

    // 2. Lấy đối tượng ngày giờ theo múi giờ (data-timezone) đã chọn
    const getZonedDateParts = (timeZone) => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
        const hour24 = Number(parts.hour) % 24;
        return {
            year: Number(parts.year),
            month: Number(parts.month),
            day: Number(parts.day),
            hour: hour24,
            minute: Number(parts.minute),
            second: Number(parts.second),
        };
    };

    // Xác định chỉ số Canh Giờ (0: Tý -> 11: Hợi) từ giờ Dương lịch (0..23)
    const getBranchIndexFromHour = (hour24) => {
        if (hour24 === 23 || hour24 === 0) return 0;
        return Math.floor((hour24 + 1) / 2);
    };

    // Tính Nạp Âm từ Thiên Can (0..9) và Địa Chi (0..11)
    const getNapAm = (stemIdx, branchIdx) => {
        for (let i = 0; i < 60; i++) {
            if (i % 10 === stemIdx && i % 12 === branchIdx) {
                return NAP_AM_60[Math.floor(i / 2)];
            }
        }
        return "Bạch Lạp Kim";
    };

    // 3. Tính toán Can Chi & Âm Lịch Việt Nam (Kết hợp lunar-javascript & chuẩn Việt Nam)
    const computeLunarData = ({ year, month, day, hour, minute }) => {
        const currentBranchIdx = getBranchIndexFromHour(hour);

        // Tính Julian Day Number để xác định Can Chi Ngày chính xác tuyệt đối
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        const jdn =
            day +
            Math.floor((153 * m + 2) / 5) +
            365 * y +
            Math.floor(y / 4) -
            Math.floor(y / 100) +
            Math.floor(y / 400) -
            32045;

        const dayStemIdx = (jdn + 9) % 10;
        const dayBranchIdx = (jdn + 1) % 12;

        // Ngũ Thử Độn: Tìm Thiên Can của Giờ Tý dựa trên Thiên Can của Ngày
        const ratHourStemIdx = ((dayStemIdx % 5) * 2) % 10;

        let lunarDay = day;
        let lunarMonth = month;
        let yearStemIdx = (year + 6) % 10;
        let yearBranchIdx = (year + 8) % 12;
        let monthStemIdx = (year * 12 + month + 3) % 10;
        let monthBranchIdx = (month + 1) % 12;
        let solarTerm = "Sương Giáng";

        // Nếu thư viện lunar-javascript đã nạp qua CDN, lấy thêm Tiết khí và Ngày Âm lịch
        if (window.Solar) {
            try {
                const solarObj = window.Solar.fromYmdHms(year, month, day, hour, minute, 0);
                const lunarObj = solarObj.getLunar();
                lunarDay = lunarObj.getDay();
                lunarMonth = Math.abs(lunarObj.getMonth());
                const jieQi = lunarObj.getPrevJieQi(true);
                if (jieQi) {
                    const JIEQI_MAP = {
                        立春: "Lập Xuân", 雨水: "Vũ Thủy", 惊蛰: "Kinh Trập", 春分: "Xuân Phân",
                        清明: "Thanh Minh", 谷雨: "Cốc Vũ", 立夏: "Lập Hạ", 小满: "Tiểu Mãn",
                        芒种: "Mang Chủng", 夏至: "Hạ Chí", 小暑: "Tiểu Thử", 大暑: "Đại Thử",
                        立秋: "Lập Thu", 处暑: "Xử Thử", 白露: "Bạch Lộ", 秋分: "Thu Phân",
                        寒露: "Hàn Lộ", 霜降: "Sương Giáng", 立冬: "Lập Đông", 小雪: "Tiểu Tuyết",
                        大雪: "Đại Tuyết", 冬至: "Đông Chí", 小寒: "Tiểu Hàn", 大寒: "Đại Hàn",
                    };
                    solarTerm = JIEQI_MAP[jieQi.getName()] || solarTerm;
                }
            } catch (err) {
                console.warn("[clock] Dùng bộ tính Can Chi nội bộ:", err);
            }
        }

        const auspiciousList = AUSPICIOUS_HOURS_BY_DAY_BRANCH[dayBranchIdx] || [0, 1, 3, 6, 8, 9];

        // Tạo dữ liệu 12 Canh Giờ trong ngày
        const hours12 = ZODIAC_BRANCHES.map((b) => {
            const hStemIdx = (ratHourStemIdx + b.index) % 10;
            const canchi = `${STEMS_VN[hStemIdx]} ${b.vn}`;
            const isGood = auspiciousList.includes(b.index);
            return {
                ...b,
                stemIdx: hStemIdx,
                canchi,
                napAm: getNapAm(hStemIdx, b.index),
                isGood,
            };
        });

        return {
            lunarDay,
            lunarMonth,
            solarTerm,
            currentBranchIdx,
            dayCanChi: `${STEMS_VN[dayStemIdx]} ${BRANCHES_VN[dayBranchIdx]}`,
            dayNapAm: getNapAm(dayStemIdx, dayBranchIdx),
            monthCanChi: `${STEMS_VN[monthStemIdx]} ${BRANCHES_VN[monthBranchIdx]}`,
            monthNapAm: getNapAm(monthStemIdx, monthBranchIdx),
            yearCanChi: `${STEMS_VN[yearStemIdx]} ${BRANCHES_VN[yearBranchIdx]}`,
            yearNapAm: getNapAm(yearStemIdx, yearBranchIdx),
            hours12,
        };
    };

    // 4. Render 12 Thẻ Bento Canh Giờ (Chuẩn Roving Tabindex & data-*)
    const renderZodiacGrid = (lunarData) => {
        const grid = document.getElementById("clock-zodiac-grid");
        if (!grid) return;

        const activeFilter =
            document.querySelector(".clock-zodiac-section__filter-btn.is-active")?.dataset.hourFilter || "all";

        grid.innerHTML = lunarData.hours12
            .map((h) => {
                const isCurrent = h.index === lunarData.currentBranchIdx;
                const isSelected = h.index === selectedBranchIndex;
                const fortuneKey = h.isGood ? "good" : "bad";
                const fortuneLabel = h.isGood ? "Hoàng Đạo" : "Hắc Đạo";
                const fortuneIcon = h.isGood ? "☀️" : "🌙";
                const isDimmed = activeFilter !== "all" && activeFilter !== fortuneKey;

                // Roving Tabindex: Chỉ canh giờ đang chọn (hoặc canh giờ hiện tại) có tabindex="0"
                const focusTargetIdx = selectedBranchIndex !== -1 ? selectedBranchIndex : lunarData.currentBranchIdx;
                const tabIdx = h.index === focusTargetIdx ? "0" : "-1";

                return `
                    <button
                        type="button"
                        class="clock-zodiac-card ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""} ${isDimmed ? "is-dimmed" : ""}"
                        tabindex="${tabIdx}"
                        ${isCurrent ? 'aria-current="time"' : ""}
                        aria-label="Giờ ${h.canchi}, từ ${h.range}, ${fortuneLabel}, mệnh ${h.napAm}"
                        title="Giờ ${h.canchi} (${h.range}) • ${fortuneLabel} • Mệnh ${h.napAm}"
                        data-branch-index="${h.index}"
                        data-branch="${h.key}"
                        data-canchi="${h.canchi}"
                        data-range="${h.range}"
                        data-napam="${h.napAm}"
                        data-fortune="${fortuneKey}"
                    >
                        <div class="clock-zodiac-card__top" aria-hidden="true">
                            <span class="clock-zodiac-card__name">Giờ ${h.vn}</span>
                            <span class="clock-zodiac-card__utc">${h.range}</span>
                        </div>
                        <div class="clock-zodiac-card__bottom" aria-hidden="true">
                            <strong class="clock-zodiac-card__canchi">${h.canchi}</strong>
                            <span class="clock-zodiac-card__fortune">
                                <span>${fortuneIcon}</span> ${fortuneLabel}
                            </span>
                        </div>
                        <img
                            src="./assets/icons/zodiac/${h.icon}"
                            alt=""
                            aria-hidden="true"
                            class="clock-zodiac-card__img"
                        />
                    </button>
                `;
            })
            .join("");

        // Gắn sự kiện Click & Bàn phím Roving Tabindex (ArrowLeft, ArrowRight, ArrowUp, ArrowDown)
        const cards = Array.from(grid.querySelectorAll(".clock-zodiac-card"));
        cards.forEach((card, idx) => {
            card.addEventListener("click", () => {
                selectedBranchIndex = Number(card.dataset.branchIndex);
                updateSelectedHourDetail(lunarData.hours12[selectedBranchIndex], lunarData.solarTerm);
                renderZodiacGrid(lunarData);
            });

            card.addEventListener("keydown", (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % cards.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + cards.length) % cards.length;

                if (nextIdx !== -1) {
                    e.preventDefault();
                    selectedBranchIndex = Number(cards[nextIdx].dataset.branchIndex);
                    updateSelectedHourDetail(lunarData.hours12[selectedBranchIndex], lunarData.solarTerm);
                    renderZodiacGrid(lunarData);
                    grid.querySelector(`[data-branch-index="${selectedBranchIndex}"]`)?.focus();
                }
            });
        });
    };

    // 5. Cập nhật chi tiết khi người dùng chọn 1 Canh Giờ hoặc khi tự động nhảy giờ
    const updateSelectedHourDetail = (hourObj, solarTerm) => {
        if (!hourObj) return;
        const nameEl = document.getElementById("detail-selected-hour-name");
        const napamEl = document.getElementById("detail-selected-hour-napam");
        const termEl = document.getElementById("detail-selected-solarterm");

        if (nameEl) nameEl.textContent = `Giờ ${hourObj.canchi} (${hourObj.range})`;
        if (napamEl) napamEl.textContent = hourObj.napAm;
        if (termEl) termEl.textContent = solarTerm;
    };

    // 6. Cập nhật Đồng hồ thực mỗi giây
    const tickClock = () => {
        const tz = app.dataset.timezone || "Asia/Ho_Chi_Minh";
        const format = app.dataset.activeFormat || "24";
        const parts = getZonedDateParts(tz);
        const pad = (n) => String(n).padStart(2, "0");

        let displayHour = parts.hour;
        const ampmEl = document.getElementById("hero-clock-ampm");

        if (format === "12") {
            const suffix = parts.hour >= 12 ? "PM" : "AM";
            displayHour = parts.hour % 12 || 12;
            if (ampmEl) {
                ampmEl.textContent = suffix;
                ampmEl.hidden = false;
            }
        } else if (ampmEl) {
            ampmEl.hidden = true;
        }

        const hoursEl = app.querySelector('[data-clock-part="hours"]');
        const minutesEl = app.querySelector('[data-clock-part="minutes"]');
        const secondsEl = app.querySelector('[data-clock-part="seconds"]');
        const timeTag = document.getElementById("hero-clock-time");

        if (hoursEl) hoursEl.textContent = pad(displayHour);
        if (minutesEl) minutesEl.textContent = pad(parts.minute);
        if (secondsEl) secondsEl.textContent = pad(parts.second);
        if (timeTag) {
            timeTag.setAttribute("datetime", `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`);
        }

        // Chỉ tính lại Bát Tự & Render lưới 12 Canh Giờ khi khởi tạo hoặc khi bước sang Canh Giờ mới
        const currentBranchIdx = getBranchIndexFromHour(parts.hour);
        if (currentBranchIdx !== lastRenderedBranchIndex) {
            lastRenderedBranchIndex = currentBranchIdx;
            const lunarData = computeLunarData(parts);
            const currentHourInfo = lunarData.hours12[currentBranchIdx];

            // Cập nhật Pill trạng thái trên Header của Section
            const statusPill = document.getElementById("clock-branch-pill");
            const statusText = document.getElementById("clock-branch-status-text");
            if (statusPill && currentHourInfo) {
                statusPill.dataset.fortune = currentHourInfo.isGood ? "good" : "bad";
            }
            if (statusText && currentHourInfo) {
                statusText.textContent = `Đang là Giờ ${currentHourInfo.canchi} • ${currentHourInfo.isGood ? "Hoàng Đạo" : "Hắc Đạo"}`;
            }

            // Cập nhật Thứ/Ngày Dương lịch & Âm lịch dưới chân đồng hồ
            const solarDateEl = document.getElementById("clock-meta-solar-date");
            const lunarDateEl = document.getElementById("clock-meta-lunar-date");
            const weekdayFormatter = new Intl.DateTimeFormat("vi-VN", {
                timeZone: tz,
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            if (solarDateEl) {
                solarDateEl.textContent = weekdayFormatter.format(new Date());
                solarDateEl.setAttribute("datetime", `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`);
            }
            if (lunarDateEl) {
                lunarDateEl.textContent = `Âm lịch: ${pad(lunarData.lunarDay)}/${pad(lunarData.lunarMonth)} ${lunarData.yearCanChi}`;
            }

            // Cập nhật 4 Ô Bento Tứ Trụ
            if (currentHourInfo) {
                document.getElementById("pillar-hour-range").textContent = currentHourInfo.range;
                document.getElementById("pillar-hour-canchi").textContent = currentHourInfo.canchi;
                document.getElementById("pillar-hour-napam").textContent = `Hành: ${currentHourInfo.napAm}`;
                document.getElementById("pillar-hour-fortune").textContent = currentHourInfo.isGood
                    ? "Hoàng Đạo"
                    : "Hắc Đạo";
            }
            document.getElementById("pillar-day-canchi").textContent = lunarData.dayCanChi;
            document.getElementById("pillar-day-napam").textContent = `Hành: ${lunarData.dayNapAm}`;
            document.getElementById("pillar-day-lunar").textContent =
                `Ngày ${pad(lunarData.lunarDay)}/${pad(lunarData.lunarMonth)} ÂL`;
            document.getElementById("pillar-month-canchi").textContent = lunarData.monthCanChi;
            document.getElementById("pillar-month-napam").textContent = `Hành: ${lunarData.monthNapAm}`;
            document.getElementById("pillar-year-canchi").textContent = lunarData.yearCanChi;
            document.getElementById("pillar-year-napam").textContent = `Hành: ${lunarData.yearNapAm}`;

            updateSelectedHourDetail(currentHourInfo, lunarData.solarTerm);
            renderZodiacGrid(lunarData);

            // Thông báo nhẹ nhàng cho Screen Reader khi chuyển sang Canh Giờ mới
            const announcer = document.getElementById("clock-sr-announcer");
            if (announcer && currentHourInfo) {
                announcer.textContent = `Đã chuyển sang Giờ ${currentHourInfo.canchi}, ${currentHourInfo.isGood ? "Giờ Hoàng Đạo" : "Giờ Hắc Đạo"}`;
            }
        }
    };

    // 7. Gọi API Open-Meteo (Miễn phí, không cần Key) lấy Nhiệt độ & Giờ Mặt trời mọc/lặn theo data-lat, data-lon
    const fetchWeatherAndSun = async (lat, lon, tz) => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=${encodeURIComponent(tz)}`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();

            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const isDay = data.current_weather.is_day === 1;
                document.getElementById("clock-weather-temp").textContent = `${temp}°C`;
                document.getElementById("clock-weather-icon").textContent = isDay ? "☀️" : "🌙";
            }

            if (data.daily?.sunrise?.[0] && data.daily?.sunset?.[0]) {
                const rise = data.daily.sunrise[0].split("T")[1];
                const set = data.daily.sunset[0].split("T")[1];
                const [rH, rM] = rise.split(":").map(Number);
                const [sH, sM] = set.split(":").map(Number);
                const totalMins = sH * 60 + sM - (rH * 60 + rM);
                const dH = Math.floor(totalMins / 60);
                const dM = totalMins % 60;
                const sunEl = document.getElementById("clock-sun- times") || document.getElementById("clock-sun-times");
                if (sunEl) {
                    sunEl.textContent = `${rise} - ${set} (${dH}h ${String(dM).padStart(2, "0")}m)`;
                }
            }
        } catch (err) {
            console.warn("[clock] Không thể tải dữ liệu thời tiết, giữ giá trị mặc định:", err.message);
        }
    };

    // 8. Lắng nghe sự kiện tương tác qua dataset
    // 8.1. Nút chuyển đổi 12h / 24h
    document.querySelectorAll(".clock-hero__format-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const format = btn.dataset.timeFormat;
            app.dataset.activeFormat = format;

            document.querySelectorAll(".clock-hero__format-btn").forEach((b) => {
                const isMatch = b === btn;
                b.classList.toggle("is-active", isMatch);
                b.setAttribute("aria-pressed", String(isMatch));
            });

            tickClock();
        });
    });

    // 8.2. Chọn Khu vực / Tỉnh thành từ Dropdown
    const locDropdown = document.getElementById("clock-loc-dropdown");
    document.querySelectorAll(".clock-hero__loc-option").forEach((opt) => {
        opt.addEventListener("click", () => {
            const { cityId, cityName, country, lat, lon, tz, utc } = opt.dataset;

            app.dataset.activeCity = cityId;
            app.dataset.timezone = tz;

            document.querySelectorAll(".clock-hero__loc-option").forEach((o) => {
                const isMatch = o === opt;
                o.classList.toggle("is-selected", isMatch);
                o.setAttribute("aria-selected", String(isMatch));
            });

            document.getElementById("clock-loc-label").textContent = `${cityName}, ${country}`;
            document.getElementById("clock-city-heading").innerHTML = `${cityName},<br />${country}`;
            document.getElementById("clock-meta-utc").textContent = utc;
            document.getElementById("schema-lat")?.setAttribute("content", lat);
            document.getElementById("schema-lon")?.setAttribute("content", lon);

            locDropdown?.removeAttribute("open");
            lastRenderedBranchIndex = -1; // Ép tính lại Can Chi theo múi giờ mới
            tickClock();
            fetchWeatherAndSun(lat, lon, tz);
        });
    });

    // 8.3. Bộ lọc Tất cả / Hoàng Đạo / Hắc Đạo
    document.querySelectorAll(".clock-zodiac-section__filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".clock-zodiac-section__filter-btn").forEach((b) => {
                const isMatch = b === btn;
                b.classList.toggle("is-active", isMatch);
                b.setAttribute("aria-pressed", String(isMatch));
            });
            const parts = getZonedDateParts(app.dataset.timezone || "Asia/Ho_Chi_Minh");
            renderZodiacGrid(computeLunarData(parts));
        });
    });

    // Khởi chạy
    tickClock();
    setInterval(tickClock, 1000);
    fetchWeatherAndSun("10.8231", "106.6297", "Asia/Ho_Chi_Minh");
})();