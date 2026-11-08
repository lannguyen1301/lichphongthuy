// assets/js/day-calendar.js
// Chuyên trách Trang Ngày (day.html): Tái sử dụng Tờ Lịch Bloc + Tính Hướng Xuất Hành,
// Khổng Minh Lục Diệu 12 giờ, Giờ Mặt Trời 4 miền & Bảng Chi Tiết 12 Canh Giờ (Chia 2 bên 6h-6h + Vòng SVG Ngũ Hành)
(() => {
    const DEFAULT_COVER_IMG =
        "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let viewingDate = new Date();
    let activeHourFilter = "all"; // "all" | "good" | "bad"
    const monthApiCache = new Map();
    let activeDayVnEvents = [];
    let activeDayIntlEvents = [];
    let currentVnEventIndex = 0;
    let currentIntlEventIndex = 0;

    const pad = (n) => String(n).padStart(2, "0");

    const fullViDateFormatter = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Ánh xạ 10 Thiên Can (0: Giáp -> 9: Quý) sang 5 Hành chuẩn Bát Tự
    const STEM_TO_ELEMENT = [
        "wood",  // 0: Giáp -> Mộc
        "wood",  // 1: Ất   -> Mộc
        "fire",  // 2: Bính -> Hỏa
        "fire",  // 3: Đinh -> Hỏa
        "earth", // 4: Mậu  -> Thổ
        "earth", // 5: Kỷ   -> Thổ
        "metal", // 6: Canh -> Kim
        "metal", // 7: Tân  -> Kim
        "water", // 8: Nhâm -> Thủy
        "water", // 9: Quý  -> Thủy
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

    const LUC_DIEU_6 = [
        {
            name: "Đại An",
            isGood: true,
            desc: "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên lành.",
        },
        {
            name: "Lưu Niên",
            isGood: false,
            desc: "Mưu sự khó thành, cầu lộc chưa thông, cần đề phòng khẩu thiệt.",
        },
        {
            name: "Tốc Hỷ",
            isGood: true,
            desc: "Tin vui đến nhanh, mưu sự đại cát, tốt nhất vào buổi sáng.",
        },
        {
            name: "Xích Khẩu",
            isGood: false,
            desc: "Dễ xảy ra bất hòa, tranh cãi; nên cẩn trọng lời ăn tiếng nói.",
        },
        {
            name: "Tiểu Cát",
            isGood: true,
            desc: "Cát lành, hòa hợp, mưu sự suôn sẻ và dễ gặp quý nhân phù trợ.",
        },
        {
            name: "Không Vong",
            isGood: false,
            desc: "Cầu tài không lợi, mưu sự dễ trắc trở, không nên tiến hành việc lớn.",
        },
    ];

    const HOUR_LABELS_12 = [
        { chi: "Tý", short: "23-1", icon: "mouse.svg", bagua: "Khảm • Chính Bắc" },
        { chi: "Sửu", short: "1-3", icon: "buffalo.svg", bagua: "Cấn • Đông Bắc" },
        { chi: "Dần", short: "3-5", icon: "tiger.svg", bagua: "Cấn • Đông Bắc" },
        { chi: "Mão", short: "5-7", icon: "cat.svg", bagua: "Chấn • Chính Đông" },
        { chi: "Thìn", short: "7-9", icon: "dragon.svg", bagua: "Tốn • Đông Nam" },
        { chi: "Tỵ", short: "9-11", icon: "snake.svg", bagua: "Tốn • Đông Nam" },
        { chi: "Ngọ", short: "11-13", icon: "horse.svg", bagua: "Ly • Chính Nam" },
        { chi: "Mùi", short: "13-15", icon: "goat.svg", bagua: "Khôn • Tây Nam" },
        { chi: "Thân", short: "15-17", icon: "monkey.svg", bagua: "Khôn • Tây Nam" },
        { chi: "Dậu", short: "17-19", icon: "rooster.svg", bagua: "Đoài • Chính Tây" },
        { chi: "Tuất", short: "19-21", icon: "dog.svg", bagua: "Càn • Tây Bắc" },
        { chi: "Hợi", short: "21-23", icon: "pig.svg", bagua: "Càn • Tây Bắc" },
    ];

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

    const SOLAR_TERMS_24 = [
        { name: "Tiểu Hàn", m1: 1, d1: 5, m2: 1, d2: 19 },
        { name: "Đại Hàn", m1: 1, d1: 20, m2: 2, d2: 3 },
        { name: "Lập Xuân", m1: 2, d1: 4, m2: 2, d2: 18 },
        { name: "Vũ Thủy", m1: 2, d1: 19, m2: 3, d2: 4 },
        { name: "Kinh Trập", m1: 3, d1: 5, m2: 3, d2: 20 },
        { name: "Xuân Phân", m1: 3, d1: 21, m2: 4, d2: 4 },
        { name: "Thanh Minh", m1: 4, d1: 5, m2: 4, d2: 19 },
        { name: "Cốc Vũ", m1: 4, d1: 20, m2: 5, d2: 4 },
        { name: "Lập Hạ", m1: 5, d1: 5, m2: 5, d2: 20 },
        { name: "Tiểu Mãn", m1: 5, d1: 21, m2: 6, d2: 5 },
        { name: "Mang Chủng", m1: 6, d1: 6, m2: 6, d2: 20 },
        { name: "Hạ Chí", m1: 6, d1: 21, m2: 7, d2: 6 },
        { name: "Tiểu Thử", m1: 7, d1: 7, m2: 7, d2: 22 },
        { name: "Đại Thử", m1: 7, d1: 23, m2: 8, d2: 6 },
        { name: "Lập Thu", m1: 8, d1: 7, m2: 8, d2: 22 },
        { name: "Xử Thử", m1: 8, d1: 23, m2: 9, d2: 7 },
        { name: "Bạch Lộ", m1: 9, d1: 8, m2: 9, d2: 22 },
        { name: "Thu Phân", m1: 9, d1: 23, m2: 10, d2: 7 },
        { name: "Hàn Lộ", m1: 10, d1: 8, m2: 10, d2: 22 },
        { name: "Sương Giáng", m1: 10, d1: 23, m2: 11, d2: 6 },
        { name: "Lập Đông", m1: 11, d1: 7, m2: 11, d2: 21 },
        { name: "Tiểu Tuyết", m1: 11, d1: 22, m2: 12, d2: 6 },
        { name: "Đại Tuyết", m1: 12, d1: 7, m2: 12, d2: 21 },
        { name: "Đông Chí", m1: 12, d1: 22, m2: 1, d2: 4 },
    ];

    // Sinh Component SVG Vòng Tròn Ngũ Hành Tương Sinh - Tương Khắc (Sáng / Chìm theo Set hành truyền vào)
    const buildWuXingSvgHtml = (activeElementsSet) => {
        const cls = (elKey) => (activeElementsSet.has(elKey) ? "is-active" : "is-dimmed");
        return `
            <svg
                class="wuxing-mini"
                viewBox="0 0 120 120"
                aria-label="Biểu đồ Bát Tự Ngũ Hành theo giờ"
                role="img"
            >
                <!-- 1. Vòng tròn Tương Sinh nét đứt -->
                <circle class="wuxing-mini__cycle" cx="60" cy="60" r="37" />
                <!-- 2. Ngôi sao 5 cánh Tương Khắc -->
                <polygon class="wuxing-mini__star" points="60,23 82,90 25,49 95,49 38,90" />

                <!-- 3. Năm đỉnh Ngũ Hành: Hỏa (12h) - Thổ (2h) - Kim (5h) - Thủy (7h) - Mộc (10h) -->
                <g class="wuxing-mini__node wuxing-mini__node--fire ${cls("fire")}">
                    <circle cx="60" cy="23" r="14" />
                    <text x="60" y="23">Hỏa</text>
                </g>

                <g class="wuxing-mini__node wuxing-mini__node--earth ${cls("earth")}">
                    <circle cx="95" cy="49" r="14" />
                    <text x="95" y="49">Thổ</text>
                </g>

                <g class="wuxing-mini__node wuxing-mini__node--metal ${cls("metal")}">
                    <circle cx="82" cy="90" r="14" />
                    <text x="82" y="90">Kim</text>
                </g>

                <g class="wuxing-mini__node wuxing-mini__node--water ${cls("water")}">
                    <circle cx="38" cy="90" r="14" />
                    <text x="38" y="90">Thủy</text>
                </g>

                <g class="wuxing-mini__node wuxing-mini__node--wood ${cls("wood")}">
                    <circle cx="25" cy="49" r="14" />
                    <text x="25" y="49">Mộc</text>
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
                        name: t.name,
                        start: `${pad(t.d1)}/${pad(t.m1)}/${yy}`,
                        end: `${pad(t.d2)}/${pad(t.m2)}/${yy}`,
                    };
                }
            } else if (code >= c1 || code <= c2) {
                const startYear = mm === 1 ? yy - 1 : yy;
                const endYear = mm === 12 ? yy + 1 : yy;
                return {
                    name: t.name,
                    start: `${pad(t.d1)}/${pad(t.m1)}/${startYear}`,
                    end: `${pad(t.d2)}/${pad(t.m2)}/${endYear}`,
                };
            }
        }
        return { name: "Lập Đông", start: `07/11/${yy}`, end: `21/11/${yy}` };
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
            {
                region: "Nam",
                place: "TP. Hồ Chí Minh (Đông Nam Bộ)",
                baseRiseMin: 345,
                baseSetMin: 1062,
                amp: 11,
            },
            {
                region: "ĐBSCL",
                place: "Cần Thơ - Cà Mau (Tây Nam Bộ)",
                baseRiseMin: 349,
                baseSetMin: 1067,
                amp: 10,
            },
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
        const lenH = Math.floor(avgLen / 60);
        const lenM = avgLen % 60;

        return {
            dayLengthLabel: `${lenH} giờ ${pad(lenM)} phút`,
            rows,
        };
    };

    const fetchMonthHistoryData = async (monthNum) => {
        const m = Number(monthNum) || 11;
        if (monthApiCache.has(m)) return monthApiCache.get(m);

        const candidatePaths = [`./api/thang-${m}.json`, `./api/thang-${pad(m)}.json`];
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
                // Thử đường dẫn tiếp theo
            }
        }
        monthApiCache.set(m, []);
        return [];
    };

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

        const occasionText =
            item.hien_thi_nhan_dip || item.ten || `Sự kiện lịch sử ngày ${paddedDay}/${paddedMonth}`;
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