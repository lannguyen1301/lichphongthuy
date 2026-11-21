// assets/js/utilities/util-calendar.js
// Mục 2 (Đổi ngày Bento 6 thẻ), Mục 3 (24 Tiết khí lọc 4 mùa + 6 animation), Mục 7 (Tính khoảng cách & Cộng/Trừ ngày)
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const { pad, setText, setAttr, buildBentoTooltipHtml, openUtilModal, createBentoDatePicker } = Hub;

    // ==================== MỤC 2: ĐỔI NGÀY ÂM ⇄ DƯƠNG TẠI CHỖ ====================
    let ucDay = 15;
    let ucMonth = 11;
    let ucYear = 2026;
    let ucYearStart = 2020;
    let ucMode = "solar2lunar";
    let lastConvertedContext = null;

    const renderUcPickers = () => {
        const maxDays = ucMode === "solar2lunar" ? new Date(ucYear, ucMonth, 0).getDate() : 30;
        if (ucDay > maxDays) ucDay = maxDays;

        setText("uc-day-text", `Ngày ${pad(ucDay)}`);
        setText("uc-month-text", `Tháng ${pad(ucMonth)}`);
        setText("uc-year-text", `Năm ${ucYear}`);
        setText("uc-year-range-label", `${ucYearStart} - ${ucYearStart + 11}`);
        setText("uc-mode-text", ucMode === "solar2lunar" ? "Dương lịch → Âm lịch" : "Âm lịch → Dương lịch");

        const dayList = document.getElementById("uc-day-list");
        if (dayList) {
            let html = "";
            for (let d = 1; d <= maxDays; d++) {
                const isSel = d === ucDay;
                html += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-uc-day="${d}">${pad(d)}</button></li>`;
            }
            dayList.innerHTML = html;
        }

        const monthList = document.getElementById("uc-month-list");
        if (monthList) {
            let html = "";
            for (let m = 1; m <= 12; m++) {
                const isSel = m === ucMonth;
                html += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-uc-month="${m}">Tháng ${pad(m)}</button></li>`;
            }
            monthList.innerHTML = html;
        }

        const yearList = document.getElementById("uc-year-list");
        if (yearList) {
            let html = "";
            for (let y = ucYearStart; y < ucYearStart + 12; y++) {
                const isSel = y === ucYear;
                html += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-uc-year="${y}">${y}</button></li>`;
            }
            yearList.innerHTML = html;
        }
    };

    const renderInlineConverter = () => {
        const grid = document.getElementById("uc-result-grid");
        if (!grid || !window.LunarEngine) return;

        let sDay = ucDay;
        let sMonth = ucMonth;
        let sYear = ucYear;

        if (ucMode === "lunar2solar") {
            const conv = window.LunarEngine.convertLunar2Solar(ucDay, ucMonth, ucYear, 0);
            if (conv && conv.sDay > 0) {
                sDay = conv.sDay;
                sMonth = conv.sMonth;
                sYear = conv.sYear;
            }
        }

        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);
        const isoDate = `${sYear}-${pad(sMonth)}-${pad(sDay)}`;
        lastConvertedContext = { info, sDay, sMonth, sYear, isoDate };

        const cards = [
            {
                key: "solar",
                badge: "Dương Lịch",
                icon: "./assets/icons/calendar.svg",
                filtered: false,
                title: `${pad(sDay)}/${pad(sMonth)}/${sYear}`,
                sub: info.bilingualWeekday,
                desc: `Tiết khí: ${info.solarTerm} • Trực: ${info.trucObj.name} (${info.trucObj.short}).`,
                foot: "Mở tờ lịch ngày này",
            },
            {
                key: "lunar",
                badge: `Âm Lịch • ${info.isFullMonth ? "Tháng Đủ" : "Tháng Thiếu"}`,
                icon: `./assets/icons/zodiac/${info.yearZodiacFile}.svg`,
                filtered: true,
                title: `${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear}`,
                sub: `Năm ${info.yearCanChi} (${info.yearNapAm})`,
                desc: `Tháng ${info.monthCanChi} • Ngày ${info.dayCanChi} • Giờ đầu ngày: ${info.ratHourCanChi}.`,
                foot: "Xem giải nghĩa Âm lịch",
            },
            {
                key: "canchi",
                badge: info.fortuneStatus === "good" ? "Ngày Hoàng Đạo" : "Can Chi & Xung Hợp",
                icon: `./assets/icons/zodiac/${info.zodiacFile}.svg`,
                filtered: true,
                title: `Ngày ${info.dayCanChi}`,
                sub: `Tuổi hợp: ${info.ageHarmony.good}`,
                desc: `Tuổi xung cần lưu ý: ${info.ageHarmony.bad}. ${info.trucObj.desc}`,
                foot: "Xem xung hợp 12 Con Giáp",
            },
            {
                key: "napam",
                badge: info.elementInfo.label,
                icon: `./assets/icons/${info.elementInfo.icon}`,
                filtered: false,
                title: info.dayNapAm,
                sub: `Nạp âm tháng: ${info.monthNapAm}`,
                desc: `Năng lượng Ngũ Hành chủ đạo của ngày ${info.dayCanChi} thuộc ${info.elementInfo.label}.`,
                foot: "Xem chi tiết Nạp Âm",
            },
            {
                key: "direction",
                badge: "Hướng Xuất Hành",
                icon: "./assets/icons/fengshui/tai-than.svg",
                filtered: true,
                title: `Tài Thần: ${info.directions.tai}`,
                sub: `Hỷ Thần: ${info.directions.hy}`,
                desc: "Xuất hành theo hướng Tài Thần hoặc Hỷ Thần giúp công việc, giao thương và nhân duyên hanh thông.",
                foot: "Xem hướng tốt trong ngày",
            },
            {
                key: "hours",
                badge: "6 Giờ Hoàng Đạo",
                icon: "./assets/icons/fengshui/hoang-dao.svg",
                filtered: true,
                title: "Khung Giờ Tốt",
                sub: "Chọn giờ lành khởi sự",
                desc: info.goodHoursStr,
                foot: "Xem bảng 12 canh giờ",
            },
        ];

        grid.innerHTML = `
            <div class="util-catalog-grid">
                ${cards
                    .map(
                        (c, idx) => `
                            <article
                                class="util-bento-item ${idx < 2 ? "is-current-highlight" : ""} has-bento-tooltip"
                                data-conv-card="${c.key}"
                                role="button"
                                tabindex="0"
                                aria-label="${c.badge}: ${c.title}, ${c.sub}"
                            >
                                <span class="util-bento-item__bg-wrap" aria-hidden="true">
                                    <img src="${c.icon}" alt="" class="util-bento-item__watermark" />
                                </span>
                                <div class="util-bento-item__top">
                                    <span class="util-bento-item__icon-box ${c.filtered ? "util-bento-item__icon-box--filtered" : ""}">
                                        <img src="${c.icon}" alt="" aria-hidden="true" />
                                    </span>
                                    <span class="util-bento-item__badge">${c.badge}</span>
                                </div>
                                <div class="util-bento-item__body">
                                    <strong class="util-bento-item__title">${c.title}</strong>
                                    <span class="util-bento-item__sub">${c.sub}</span>
                                </div>
                                <p class="util-bento-item__desc">${c.desc}</p>
                                <footer class="util-bento-item__foot">
                                    <span>${c.foot}</span>
                                    <span aria-hidden="true">&#8594;</span>
                                </footer>
                                ${buildBentoTooltipHtml(c.title, `${c.sub}. ${c.desc}`, `✦ Bấm để mở thẻ ${c.badge}`)}
                            </article>
                        `,
                    )
                    .join("")}
            </div>
        `;
    };

    // ==================== MỤC 3: TRA CỨU 24 TIẾT KHÍ ====================
    let stViewingYear = 2026;
    let stSeasonFilter = "all";

    const SOLAR_TERMS_DATA = [
        [
            "Tiểu Hàn",
            "05/01",
            "15:13",
            "winter",
            "sun",
            "term-winter-minor-cold.svg",
            "Chớm lạnh — Khí trời bắt đầu rét đậm, chuẩn bị bước vào giai đoạn lạnh nhất cuối năm.",
            "Nên giữ ấm cơ thể, bồi bổ dinh dưỡng và hoàn tất các kế hoạch cuối năm.",
        ],
        [
            "Đại Hàn",
            "20/01",
            "08:35",
            "winter",
            "sun",
            "term-winter-major-cold.svg",
            "Rét cực điểm — Tiết khí cuối năm âm lịch, hàn khí đạt đỉnh trước khi mầm xuân trỗi dậy.",
            "Thích hợp tổng kết năm cũ, dọn dẹp nhà cửa đón Tết và giữ ấm vùng cổ, bàn chân.",
        ],
        [
            "Lập Xuân",
            "04/02",
            "02:50",
            "spring",
            "sprout",
            "term-spring.svg",
            "Khởi đầu mùa xuân — Dương khí bừng dậy, cây cối đâm chồi nảy lộc, vạn vật sinh sôi.",
            "Đại cát cho việc lập kế hoạch năm mới, xuất hành đầu xuân, trồng cây và mở rộng giao kết.",
        ],
        [
            "Vũ Thủy",
            "18/02",
            "22:40",
            "spring",
            "rain",
            "term-rain.svg",
            "Mưa xuân — Hơi ẩm tăng dần, mưa phùn ấm áp tưới tắm cho mùa màng tươi tốt.",
            "Thuận lợi cho việc gieo trồng, học tập, bồi đắp tri thức và chăm sóc sức khỏe gan mật.",
        ],
        [
            "Kinh Trập",
            "05/03",
            "20:44",
            "spring",
            "thunder",
            "term-thunder.svg",
            "Sấm xuân thức tỉnh — Tiếng sấm đầu mùa vang lên đánh thức vạn vật sau kỳ ngủ đông.",
            "Thời điểm rất tốt để bứt phá, triển khai dự án mới và hành động quyết đoán.",
        ],
        [
            "Xuân Phân",
            "20/03",
            "21:32",
            "spring",
            "snow",
            "term-spring-equinox.svg",
            "Giữa xuân cân bằng — Ngày và đêm dài bằng nhau, âm dương điều hòa.",
            "Rất tốt cho việc hòa giải, ký kết hợp tác đôi bên cùng có lợi và cân bằng nhịp sống.",
        ],
        [
            "Thanh Minh",
            "05/04",
            "01:22",
            "spring",
            "sprout",
            "term-spring-clear.svg",
            "Trời trong sáng — Tiết trời quang đãng, gắn liền với truyền thống tảo mộ tri ân tổ tiên.",
            "Hợp đi tảo mộ, tri ân tổ tiên, du xuân ngoài trời và khởi sự việc thiện lành.",
        ],
        [
            "Cốc Vũ",
            "20/04",
            "08:24",
            "spring",
            "rain",
            "term-grain-rain.svg",
            "Mưa rào nuôi ngũ cốc — Lượng mưa dồi dào giúp lúa màu phát triển vượt bậc.",
            "Thuận lợi cho việc tích lũy tài chính, đầu tư dài hạn và chăm sóc gia đình.",
        ],
        [
            "Lập Hạ",
            "05/05",
            "18:30",
            "summer",
            "sun",
            "term-summer-sun.svg",
            "Bắt đầu mùa hạ — Nắng vàng rực rỡ, vạn vật bước vào kỳ trưởng thành mạnh mẽ.",
            "Hợp đẩy mạnh kinh doanh, quảng bá thương hiệu và giữ tâm thái bình hòa dưới nắng nóng.",
        ],
        [
            "Tiểu Mãn",
            "21/05",
            "07:23",
            "summer",
            "sprout",
            "term-grain.svg",
            "Lúa trổ đòng chắc hạt — Hạt ngũ cốc bắt đầu căng mẩy báo hiệu mùa màng bội thu.",
            "Nên kiên trì hoàn thiện các công việc đang dang dở để chuẩn bị gặt hái thành quả.",
        ],
        [
            "Mang Chủng",
            "05/06",
            "22:32",
            "summer",
            "sprout",
            "term-grain-ear.svg",
            "Lúa chín có râu — Thời điểm thu hoạch vụ chiêm và gieo cấy vụ mùa nhộn nhịp.",
            "Rất tốt cho việc thu hồi công nợ, chốt doanh số và tái đầu tư xoay vòng vốn.",
        ],
        [
            "Hạ Chí",
            "21/06",
            "15:10",
            "summer",
            "sun",
            "term-summer-solstice.svg",
            "Đỉnh điểm mùa hạ — Ngày dài nhất trong năm, dương khí đạt cực thịnh.",
            "Nên uống nhiều nước mát, nghỉ trưa hợp lý và tránh làm việc quá sức ngoài trời nắng gắt.",
        ],
        [
            "Tiểu Thử",
            "07/07",
            "08:45",
            "summer",
            "sun",
            "term-summer-minor-heat.svg",
            "Nóng nhẹ — Khí trời oi bức bắt đầu lan tỏa kèm mưa dông mùa hạ.",
            "Hợp làm việc nơi thoáng mát, kiểm soát cảm xúc và giữ gìn sức khỏe tim mạch.",
        ],
        [
            "Đại Thử",
            "23/07",
            "02:12",
            "summer",
            "sun",
            "term-summer-major-heat.svg",
            "Nóng oi ả cực độ — Giai đoạn nhiệt độ cao nhất trong năm, hành Hỏa vượng.",
            "Thích hợp dưỡng tâm, ăn thực phẩm thanh nhiệt và cẩn trọng phòng chống cháy nổ.",
        ],
        [
            "Lập Thu",
            "07/08",
            "18:28",
            "autumn",
            "wind",
            "term-autumn-wind.svg",
            "Khởi đầu mùa thu — Gió heo may chớm về, bầu trời cao trong và dịu mát dần.",
            "Thời điểm lý tưởng để hoạch định mục tiêu nửa cuối năm, khai trương và thu hoạch.",
        ],
        [
            "Xử Thử",
            "23/08",
            "09:05",
            "autumn",
            "wind",
            "term-autumn-cool.svg",
            "Dứt nắng nóng — Cái oi bức mùa hè chấm dứt, nhường chỗ cho tiết trời thu mát mẻ.",
            "Rất tốt cho việc nghỉ ngơi phục hồi sức lực, gắn kết gia đình và sắp xếp lại công việc.",
        ],
        [
            "Bạch Lộ",
            "07/09",
            "21:18",
            "autumn",
            "rain",
            "term-dew.svg",
            "Sương trắng — Đêm về se lạnh khiến hơi nước ngưng tụ thành giọt sương trên lá.",
            "Nên giữ ấm khi sáng sớm, thuận lợi cho việc học hành, thi cử và sáng tạo.",
        ],
        [
            "Thu Phân",
            "23/09",
            "06:49",
            "autumn",
            "snow",
            "term-autumn-day-night.svg",
            "Giữa thu cân bằng — Thời lượng ngày và đêm bằng nhau, tiết trời thu trong trẻo.",
            "Đại lợi cho việc hội họp, đoàn viên, ký kết giao ước và thưởng ngoạn mùa thu.",
        ],
        [
            "Hàn Lộ",
            "08/10",
            "13:02",
            "autumn",
            "rain",
            "term-cold-dew.svg",
            "Sương lạnh — Khí trời chuyển lạnh sâu hơn, sương đêm ngưng tụ dày.",
            "Hợp thu vén tài sản, củng cố nội lực và chăm sóc hệ hô hấp khi giao mùa.",
        ],
        [
            "Sương Giáng",
            "23/10",
            "16:15",
            "autumn",
            "rain",
            "term-frost.svg",
            "Sương mù & Giá lạnh — Tiết khí cuối cùng của mùa thu trước khi sang đông.",
            "Nên hoàn tất các kế hoạch mùa thu, chuẩn bị tích trữ nguồn lực cho mùa đông.",
        ],
        [
            "Lập Đông",
            "07/11",
            "16:20",
            "winter",
            "wind",
            "term-winter-snow.svg",
            "Bắt đầu mùa đông — Gió mùa đông bắc tràn về, vạn vật thu mình tích trữ năng lượng.",
            "Rất tốt cho việc bồi bổ sức khỏe, cất trữ tài sản và sum họp gia đình ấm cúng.",
        ],
        [
            "Tiểu Tuyết",
            "22/11",
            "13:45",
            "winter",
            "snow",
            "term-winter-minor-snow.svg",
            "Tuyết nhẹ / Rét đầu đông — Nhiệt độ giảm thấp, không khí khô lạnh rõ rệt.",
            "Thích hợp nghiên cứu chuyên sâu, làm việc nội bộ và giữ ấm cơ thể.",
        ],
        [
            "Đại Tuyết",
            "07/12",
            "09:08",
            "winter",
            "snow",
            "term-winter-major-snow.svg",
            "Tuyết dày / Rét đậm — Hàn khí bao phủ mạnh mẽ, đêm dài ngày ngắn.",
            "Nên hạn chế đi xa mạo hiểm, ưu tiên củng cố tài chính và chăm sóc người thân.",
        ],
        [
            "Đông Chí",
            "22/12",
            "03:02",
            "winter",
            "snow",
            "term-winter-solstice.svg",
            "Giữa đông — Đêm dài nhất trong năm; từ sau Đông Chí dương khí bắt đầu hồi sinh.",
            "Thời điểm cát lành để cầu phúc, đoàn viên và chuẩn bị đón vận hội mới.",
        ],
    ];

    const SEASON_VN = {
        spring: "Mùa Xuân • Hành Mộc",
        summer: "Mùa Hạ • Hành Hỏa",
        autumn: "Mùa Thu • Hành Kim",
        winter: "Mùa Đông • Hành Thủy",
    };

    const renderSolarTermsPanel = () => {
        setText("st-year-title", String(stViewingYear));
        setText("st-year-badge", `Năm ${stViewingYear}`);
        const grid = document.getElementById("st-cards-grid");
        if (!grid) return;

        const curTerm = window.LunarEngine
            ? window.LunarEngine.getFullDayInfo(new Date().getDate(), new Date().getMonth() + 1, stViewingYear)
                  .solarTerm
            : "Lập Đông";

        const filtered = SOLAR_TERMS_DATA.filter((item) => stSeasonFilter === "all" || item[3] === stSeasonFilter);

        grid.innerHTML = filtered
            .map(([name, ddmm, timeStr, seasonKey, animGroup, icon, desc, advice]) => {
                const isCur = name === curTerm;
                const iconPath = `./assets/icons/weather/${icon}`;
                const seasonLabel = SEASON_VN[seasonKey];
                const idx = SOLAR_TERMS_DATA.findIndex((x) => x[0] === name);

                return `
                    <article
                        class="util-bento-item ${isCur ? "is-current-highlight" : ""} has-bento-tooltip"
                        data-term-anim="${animGroup}"
                        data-st-idx="${idx}"
                        role="button"
                        tabindex="0"
                        aria-label="Tiết ${name}, ${ddmm}/${stViewingYear}, ${seasonLabel}"
                    >
                        <span class="util-bento-item__bg-wrap" aria-hidden="true">
                            <img src="${iconPath}" alt="" class="util-bento-item__watermark" />
                        </span>
                        <div class="util-bento-item__top">
                            <span class="util-bento-item__icon-box util-bento-item__icon-box--filtered">
                                <img src="${iconPath}" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-bento-item__badge">${ddmm}/${stViewingYear} • ${timeStr}</span>
                        </div>
                        <div class="util-bento-item__body">
                            <strong class="util-bento-item__title">Tiết ${name} ${isCur ? "• Hiện tại" : ""}</strong>
                            <span class="util-bento-item__sub">${seasonLabel}</span>
                        </div>
                        <p class="util-bento-item__desc">${desc}</p>
                        <footer class="util-bento-item__foot">
                            <span>Xem dưỡng sinh &amp; hành sự</span>
                            <span aria-hidden="true">&#8594;</span>
                        </footer>
                        ${buildBentoTooltipHtml(`Tiết ${name} (${ddmm}/${stViewingYear})`, `${desc} ${advice}`, `✦ Bấm để mở thẻ chi tiết Tiết ${name}`)}
                    </article>
                `;
            })
            .join("");
    };

    // ==================== MỤC 7: TÍNH KHOẢNG CÁCH & CỘNG / TRỪ NGÀY ====================
    let dateCalcMode = "add";
    let ddStartPicker = null;
    let ddEndPicker = null;
    let asBasePicker = null;

    const computeDateDiff = () => {
        if (!ddStartPicker || !ddEndPicker) return;
        const s = ddStartPicker.getState();
        const e = ddEndPicker.getState();

        const d1 = new Date(s.year, s.month - 1, s.day);
        const d2 = new Date(e.year, e.month - 1, e.day);
        const totalDays = Math.round(Math.abs(d2 - d1) / 86400000);
        const totalHours = totalDays * 24;
        const totalMins = totalHours * 60;
        const weeks = Math.floor(totalDays / 7);
        const months = Math.floor(totalDays / 30.4375);
        const years = Math.floor(totalDays / 365.25);

        setText("dd-val-years", String(years));
        setText("dd-val-months", String(months));
        setText("dd-val-weeks", String(weeks));
        setText("dd-val-days", String(totalDays));
        setText("dd-val-hours", totalHours.toLocaleString("vi-VN"));
        setText("dd-val-minutes", totalMins.toLocaleString("vi-VN"));
        setText("dd-total-days-badge", `Tổng thời gian: ${totalDays} ngày`);

        if (window.LunarEngine) {
            const l1 = window.LunarEngine.getFullDayInfo(s.day, s.month, s.year);
            const l2 = window.LunarEngine.getFullDayInfo(e.day, e.month, e.year);
            setText(
                "dd-start-lunar-hint",
                `Âm lịch: ${pad(l1.lunarDay)}/${pad(l1.lunarMonth)}/${l1.lunarYear} (Ngày ${l1.dayCanChi} • ${l1.dayNapAm})`,
            );
            setText(
                "dd-end-lunar-hint",
                `Âm lịch: ${pad(l2.lunarDay)}/${pad(l2.lunarMonth)}/${l2.lunarYear} (Ngày ${l2.dayCanChi} • ${l2.dayNapAm})`,
            );
        }
    };

    const computeDateAddSub = () => {
        if (!asBasePicker) return;
        const b = asBasePicker.getState();
        const yOff = Number(document.getElementById("as-years")?.value || 0);
        const mOff = Number(document.getElementById("as-months")?.value || 0);
        const wOff = Number(document.getElementById("as-weeks")?.value || 0);
        const dOff = Number(document.getElementById("as-days")?.value || 0);

        const dir = dateCalcMode === "sub" ? -1 : 1;
        const target = new Date(b.year + dir * yOff, b.month - 1 + dir * mOff, b.day + dir * (wOff * 7 + dOff));
        const ty = target.getFullYear();
        const tm = target.getMonth() + 1;
        const td = target.getDate();

        const fullVi = new Intl.DateTimeFormat("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(target);

        setText(
            "as-res-mode-tag",
            dateCalcMode === "sub" ? "Kết quả sau khi trừ thời gian" : "Kết quả sau khi cộng thêm thời gian",
        );
        setText("as-res-solar", `${fullVi} Dương lịch`);
        setAttr("as-res-link", "href", `./day.html?date=${ty}-${pad(tm)}-${pad(td)}`);

        if (window.LunarEngine) {
            const info = window.LunarEngine.getFullDayInfo(td, tm, ty);
            setText(
                "as-res-lunar",
                `Nhằm ngày ${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear} Âm lịch • Năm ${info.yearCanChi} • Ngày ${info.dayCanChi} (${info.dayNapAm})`,
            );
        }
    };

    // Đồng bộ subpanel Cộng/Trừ ngày khi đổi Route
    Hub.onRouteChange(({ cat, sub }) => {
        if (cat !== "datediff") return;
        const panel = document.querySelector('.util-panel[data-panel-cat="datediff"]');
        if (!panel) return;

        dateCalcMode = sub === "sub" ? "sub" : "add";
        const diffSub = panel.querySelector('[data-subpanel="diff"]');
        const addSub = panel.querySelector('[data-subpanel="add-sub"]');
        if (diffSub) diffSub.hidden = sub !== "diff";
        if (addSub) addSub.hidden = sub === "diff";

        const actionWord = dateCalcMode === "sub" ? "trừ" : "cộng";
        setText(
            "as-panel-title",
            dateCalcMode === "sub"
                ? "Trừ Ngày & Tra Cứu Âm Lịch Ngày Đích"
                : "Cộng Thêm Ngày & Tra Cứu Âm Lịch Ngày Đích",
        );
        setText("as-label-years", `Số năm ${actionWord}`);
        setText("as-label-months", `Số tháng ${actionWord}`);
        setText("as-label-weeks", `Số tuần ${actionWord}`);
        setText("as-label-days", `Số ngày ${actionWord}`);
        computeDateAddSub();
    });

    // Ủy quyền Modal cho Mục 2 & Mục 3
    Hub.registerModalHandler((e) => {
        const convCard = e.target.closest("[data-conv-card]");
        if (convCard && lastConvertedContext) {
            const { info, sDay, sMonth, sYear, isoDate } = lastConvertedContext;
            openUtilModal({
                category: "Đổi Ngày Âm ⇄ Dương",
                title: `Ngày ${pad(sDay)}/${pad(sMonth)}/${sYear} DL (${pad(info.lunarDay)}/${pad(info.lunarMonth)} ÂL)`,
                visualHtml: `<img src="./assets/icons/zodiac/${info.zodiacFile}.svg" alt="" /><strong>Ngày ${info.dayCanChi}</strong>`,
                isFilteredVisual: true,
                pills: [info.yearCanChi, info.dayNapAm, `Tiết ${info.solarTerm}`],
                desc: `Ngày ${pad(sDay)}/${pad(sMonth)}/${sYear} Dương lịch nhằm ngày ${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear} Âm lịch (Năm ${info.yearCanChi}, Tháng ${info.monthCanChi}, Ngày ${info.dayCanChi}).`,
                advice: `Trực ${info.trucObj.name}: ${info.trucObj.desc} • 6 Giờ Hoàng Đạo: ${info.goodHoursStr}.`,
                actionHref: `./day.html?date=${isoDate}`,
                actionLabel: "Mở trang Chi tiết Ngày này",
            });
            return true;
        }

        const stCard = e.target.closest("[data-st-idx]");
        if (stCard) {
            const item = SOLAR_TERMS_DATA[Number(stCard.dataset.stIdx)];
            if (!item) return true;
            const [name, ddmm, timeStr, seasonKey, , icon, desc, advice] = item;
            openUtilModal({
                category: "Nhị Thập Tứ Tiết Khí",
                title: `Tiết ${name} (${ddmm}/${stViewingYear})`,
                visualHtml: `<img src="./assets/icons/weather/${icon}" alt="" /><strong>${SEASON_VN[seasonKey]}</strong>`,
                isFilteredVisual: true,
                pills: [`Khởi tiết: ${timeStr}`, SEASON_VN[seasonKey], `Năm ${stViewingYear}`],
                desc,
                advice,
                actionHref: `./day.html?date=${stViewingYear}-${ddmm.split("/")[1]}-${ddmm.split("/")[0]}`,
                actionLabel: `Xem lịch ngày ${ddmm}/${stViewingYear}`,
            });
            return true;
        }
        return false;
    });

    Hub.registerModule(() => {
        const now = new Date();
        ucDay = now.getDate();
        ucMonth = now.getMonth() + 1;
        ucYear = now.getFullYear();
        ucYearStart = Math.floor(ucYear / 12) * 12 - 4;

        ddStartPicker = createBentoDatePicker(
            "dd-start-pickers",
            { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() },
            computeDateDiff,
        );
        ddEndPicker = createBentoDatePicker("dd-end-pickers", { day: 17, month: 2, year: 2027 }, computeDateDiff);
        asBasePicker = createBentoDatePicker(
            "as-base-pickers",
            { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() },
            computeDateAddSub,
        );

        renderUcPickers();
        renderInlineConverter();
        renderSolarTermsPanel();
        computeDateDiff();
        computeDateAddSub();

        // Sự kiện Mục 2: Đổi ngày
        document.getElementById("uc-day-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-day]");
            if (!btn) return;
            e.stopPropagation();
            ucDay = Number(btn.dataset.ucDay);
            document.getElementById("uc-day-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-month]");
            if (!btn) return;
            e.stopPropagation();
            ucMonth = Number(btn.dataset.ucMonth);
            document.getElementById("uc-month-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-year-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-year]");
            if (!btn) return;
            e.stopPropagation();
            ucYear = Number(btn.dataset.ucYear);
            document.getElementById("uc-year-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-year-prev-range")?.addEventListener("click", (e) => {
            e.stopPropagation();
            ucYearStart -= 12;
            renderUcPickers();
        });

        document.getElementById("uc-year-next-range")?.addEventListener("click", (e) => {
            e.stopPropagation();
            ucYearStart += 12;
            renderUcPickers();
        });

        document.getElementById("uc-mode-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-uc-mode]");
            if (!btn) return;
            e.stopPropagation();
            ucMode = btn.dataset.ucMode;
            document.querySelectorAll("[data-uc-mode]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-selected", isSel);
                b.setAttribute("aria-selected", String(isSel));
            });
            document.getElementById("uc-mode-dropdown")?.removeAttribute("open");
            renderUcPickers();
            renderInlineConverter();
        });

        document.getElementById("uc-today-btn")?.addEventListener("click", () => {
            const t = new Date();
            ucDay = t.getDate();
            ucMonth = t.getMonth() + 1;
            ucYear = t.getFullYear();
            ucYearStart = Math.floor(ucYear / 12) * 12 - 4;
            ucMode = "solar2lunar";
            renderUcPickers();
            renderInlineConverter();
        });

        // Sự kiện Mục 3: 24 Tiết khí
        document.getElementById("st-prev-year")?.addEventListener("click", () => {
            stViewingYear--;
            renderSolarTermsPanel();
        });
        document.getElementById("st-next-year")?.addEventListener("click", () => {
            stViewingYear++;
            renderSolarTermsPanel();
        });
        document.getElementById("st-current-year")?.addEventListener("click", () => {
            stViewingYear = new Date().getFullYear();
            renderSolarTermsPanel();
        });
        document.getElementById("st-season-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-st-season]");
            if (!btn) return;
            stSeasonFilter = btn.dataset.stSeason;
            document.querySelectorAll("[data-st-season]").forEach((b) => b.classList.toggle("is-active", b === btn));
            renderSolarTermsPanel();
        });

        // Sự kiện Mục 7: Cộng / Trừ ngày
        ["as-years", "as-months", "as-weeks", "as-days"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", computeDateAddSub);
        });
        document.getElementById("as-today-btn")?.addEventListener("click", () => {
            const t = new Date();
            asBasePicker?.setState({ day: t.getDate(), month: t.getMonth() + 1, year: t.getFullYear() });
            computeDateAddSub();
        });
    });
})();
