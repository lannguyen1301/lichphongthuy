// assets/js/utilities/util-explore.js
// Mục 5 (Ngày Này Năm Xưa + Slideshow Modal), Mục 8 (Thần số học Pythagoras 3x3),
// Mục 9 (Nhịp sinh học SVG 30 ngày + Ngày Giao Điểm), Mục 10 (Từ điển Cổ học 25 mục)
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const {
        DEFAULT_COVER_IMG,
        pad,
        setText,
        setAttr,
        toSlug,
        buildBentoTooltipHtml,
        openUtilModal,
        createBentoDatePicker,
    } = Hub;

    // ==================== MỤC 5: NGÀY NÀY NĂM XƯA ====================
    let hiMonth = 11;
    let hiScope = "all";
    let hiPage = 1;
    const HI_PAGE_SIZE = 6;
    const hiCache = new Map();
    let currentHiFilteredList = [];

    const renderHistoryMonthPicker = () => {
        setText("hi-month-text", `Tháng ${pad(hiMonth)}`);
        const list = document.getElementById("hi-month-list");
        if (!list) return;
        let html = "";
        for (let m = 1; m <= 12; m++) {
            const isSel = m === hiMonth;
            html += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-hi-month="${m}">Tháng ${pad(m)}</button></li>`;
        }
        list.innerHTML = html;
    };

    const fetchAndRenderHistory = async () => {
        const grid = document.getElementById("hi-events-grid");
        const pagEl = document.getElementById("hi-pagination");
        if (!grid) return;

        if (!hiCache.has(hiMonth)) {
            let loaded = [];
            for (const path of [`./api/thang-${hiMonth}.json`, `./api/thang-${pad(hiMonth)}.json`]) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const data = await res.json();
                        loaded = Array.isArray(data) ? data : data?.data || data?.events || [];
                        break;
                    }
                } catch (e) {
                    // Fallback sang path kế tiếp
                }
            }
            hiCache.set(hiMonth, loaded);
        }

        const rawItems = hiCache.get(hiMonth) || [];
        currentHiFilteredList = rawItems.filter((item) => {
            const scopeStr = String(item.pham_vi || item.scope || item.category_id || "").toLowerCase();
            const isIntl = Boolean(item.is_international) || scopeStr.includes("quoc-te") || scopeStr.includes("intl");
            if (hiScope === "vn") return !isIntl;
            if (hiScope === "intl") return isIntl;
            return true;
        });

        const totalPages = Math.max(1, Math.ceil(currentHiFilteredList.length / HI_PAGE_SIZE));
        if (hiPage > totalPages) hiPage = 1;

        const pageItems = currentHiFilteredList.slice((hiPage - 1) * HI_PAGE_SIZE, hiPage * HI_PAGE_SIZE);

        grid.innerHTML = pageItems
            .map((item, idx) => {
                const globalIdx = (hiPage - 1) * HI_PAGE_SIZE + idx;
                const rawSlug = String(item.image_slug || item.slug || "").trim();
                const cleanSlug = rawSlug
                    .split("/")
                    .pop()
                    .replace(/\.(jpg|jpeg|png|webp)$/i, "");
                const coverUrl = cleanSlug
                    ? `./assets/images/calendar-covers/thang-${hiMonth}/${cleanSlug}.jpg`
                    : DEFAULT_COVER_IMG;
                const scopeStr = String(item.pham_vi || item.scope || "").toLowerCase();
                const isIntl = Boolean(item.is_international) || scopeStr.includes("quoc-te");
                const name = item.ten || "Nhân vật & Sự kiện lịch sử";
                const occasion = item.hien_thi_nhan_dip || `Kỷ niệm lịch sử tháng ${hiMonth}`;
                const quote = item.danh_ngon || item.quote || occasion;

                return `
                    <article
                        class="util-history-card has-bento-tooltip"
                        data-hi-idx="${globalIdx}"
                        role="button"
                        tabindex="0"
                        aria-label="${name}, ${item.ngay_hien_thi || `Tháng ${pad(hiMonth)}`}"
                    >
                        <div class="util-history-card__media" aria-hidden="true">
                            <img src="${coverUrl}" alt="" onerror="this.src='${DEFAULT_COVER_IMG}'" loading="lazy" decoding="async" />
                        </div>
                        <div class="util-history-card__top">
                            <span class="util-history-card__date-pill">${item.ngay_hien_thi || `Tháng ${pad(hiMonth)}`}</span>
                            <span class="util-history-card__scope-pill">${isIntl ? "Sự kiện Quốc tế" : "Lịch sử Việt Nam"}</span>
                        </div>
                        <div class="util-history-card__body">
                            <strong class="util-history-card__title">${name}</strong>
                            <p class="util-history-card__sub">${occasion}</p>
                        </div>
                        ${buildBentoTooltipHtml(
                            `${name} (${item.ngay_hien_thi || `T${hiMonth}`})`,
                            `${occasion}. "${quote}"`,
                            "✦ Bấm để mở Hồ sơ & Trình chiếu ảnh tư liệu",
                        )}
                    </article>
                `;
            })
            .join("");

        if (pagEl) {
            if (totalPages <= 1) {
                pagEl.innerHTML = "";
            } else {
                let pagHtml = "";
                for (let p = 1; p <= totalPages; p++) {
                    pagHtml += `<button type="button" class="util-pagination__btn ${p === hiPage ? "is-active" : ""}" data-hi-page="${p}" ${p === hiPage ? 'aria-current="page"' : ""}>${p}</button>`;
                }
                pagEl.innerHTML = pagHtml;
            }
        }
    };

    // ==================== MỤC 8: THẦN SỐ HỌC PYTHAGORAS ====================
    let numBirthPicker = null;

    const NUMEROLOGY_MEANINGS = {
        1: {
            title: "Nhà Tiên Phong Độc Lập",
            desc: "Đại diện cho khả năng lãnh đạo bẩm sinh, tự chủ, quyết đoán và bản lĩnh mở đường.",
            advice: "Phát huy tinh thần chủ động dẫn dắt, đồng thời học cách lắng nghe ý kiến từ đội ngũ cộng sự.",
        },
        2: {
            title: "Người Hòa Giải Tinh Tế",
            desc: "Đại diện cho sự lắng nghe, ngoại giao khéo léo, trực giác nhạy bén và tinh thần hợp tác.",
            advice: "Rất hợp vai trò kết nối, cố vấn chiến lược và xây dựng sự đồng thuận trong tập thể.",
        },
        3: {
            title: "Người Truyền Cảm Hứng & Sáng Tạo",
            desc: "Đại diện cho tư duy nhạy bén, ngôn từ sắc sảo, óc thẩm mỹ nghệ thuật và năng lượng tích cực.",
            advice: "Tập trung năng lượng vào việc sáng tạo sản phẩm, thuyết trình và hoàn tất mục tiêu đến cùng.",
        },
        4: {
            title: "Kiến Trúc Sư Thực Tế & Kỷ Luật",
            desc: "Đại diện cho tính hệ thống, quy trình chuẩn mực, nền tảng kỹ thuật vững chắc và sự bền bỉ.",
            advice: "Rất xuất sắc trong việc xây dựng cấu trúc dữ liệu, quản trị dự án và tích lũy tài sản an toàn.",
        },
        5: {
            title: "Người Tự Do & Đổi Mới Đột Phá",
            desc: "Đại diện cho sự linh hoạt, thích nghi nhanh, kết nối đa chiều và dám vượt qua giới hạn cũ.",
            advice: "Giữ kỷ luật cá nhân song hành cùng khát vọng đổi mới để biến trải nghiệm thành thành tựu.",
        },
        6: {
            title: "Người Nuôi Dưỡng & Trách Nhiệm",
            desc: "Đại diện cho tình yêu thương gia đình, sự tận tâm, gu thẩm mỹ tinh tế và tinh thần phụng sự.",
            advice: "Cân bằng giữa việc chăm lo cho người khác và dành thời gian tái tạo năng lượng cho bản thân.",
        },
        7: {
            title: "Nhà Triết Học & Nghiên Cứu Chuyên Sâu",
            desc: "Đại diện cho chiều sâu học thuật, tư duy phân tích gốc rễ, trực giác tâm linh và tự chiêm nghiệm.",
            advice: "Phù hợp tuyệt vời với nghiên cứu chuyên môn sâu, lập trình hệ thống, cổ học và chiến lược.",
        },
        8: {
            title: "Nhà Điều Hành & Thịnh Vượng Tài Chính",
            desc: "Đại diện cho năng lực quản trị vĩ mô, nhạy bén thương mại, quyền lực và hiệu quả thực tiễn.",
            advice: "Kết hợp mục tiêu tài chính với giá trị bền vững cho cộng đồng sẽ mang lại thành công lớn.",
        },
        9: {
            title: "Nhà Nhân Đạo & Lý Tưởng Lớn",
            desc: "Đại diện cho tầm nhìn bao dung, trách nhiệm xã hội, trí tuệ tổng hợp và sự viên mãn.",
            advice: "Lan tỏa tri thức, dẫn dắt thế hệ kế cận và theo đuổi những dự án mang lại giá trị lâu dài.",
        },
        11: {
            title: "Số Master 11/2 • Trực Giác Tâm Linh Cao",
            desc: "Bậc thầy truyền cảm hứng tinh thần, nhạy cảm với trường năng lượng và có tầm nhìn thấu thị.",
            advice: "Giữ tâm tĩnh tại để chuyển hóa trực giác nhạy bén thành những tác phẩm hoặc giải pháp giá trị.",
        },
        22: {
            title: "Số Master 22/4 • Kiến Tạo Đại Sự",
            desc: "Kết hợp tầm nhìn vĩ mô của số 11 với năng lực thực thi kỷ luật của số 4 để tạo di sản bền vững.",
            advice: "Hãy mạnh dạn đặt ra những mục tiêu lớn lao và kiên trì thực hiện từng bước vững chắc.",
        },
    };

    const reduceNum = (n, keepMaster = true) => {
        let cur = Number(n);
        while (cur > 9) {
            if (keepMaster && (cur === 11 || cur === 22)) return cur;
            cur = String(cur)
                .split("")
                .reduce((a, b) => a + Number(b), 0);
        }
        return cur || 1;
    };

    const renderNumerologyPersonal = () => {
        if (!numBirthPicker) return;
        const { day: d, month: m, year: y } = numBirthPicker.getState();
        const allDigits = `${pad(d)}${pad(m)}${y}`.split("").map(Number);
        const rawSum = allDigits.reduce((a, b) => a + b, 0);
        const lifePath = reduceNum(rawSum, true);
        const info = NUMEROLOGY_MEANINGS[lifePath] || NUMEROLOGY_MEANINGS[3];

        setText("num-lifepath-number", String(lifePath));
        setText(
            "num-lifepath-formula",
            `Ngày sinh: ${pad(d)}/${pad(m)}/${y} (Tổng các chữ số: ${rawSum} → Số Chủ Đạo ${lifePath})`,
        );
        setText("num-lifepath-title", `Con Số Chủ Đạo ${lifePath} • ${info.title}`);
        setText("num-lifepath-desc", `${info.desc} ${info.advice}`);

        const now = new Date();
        const pYear = reduceNum(d + m + now.getFullYear(), false);
        const pMonth = reduceNum(pYear + (now.getMonth() + 1), false);
        const pDay = reduceNum(pMonth + now.getDate(), false);

        const cyclesGrid = document.getElementById("num-cycles-grid");
        if (cyclesGrid) {
            const cList = [
                { label: `Năm Cá Nhân (${now.getFullYear()})`, num: pYear },
                { label: `Tháng Cá Nhân (T${now.getMonth() + 1})`, num: pMonth },
                { label: "Ngày Cá Nhân Hôm Nay", num: pDay },
            ];
            cyclesGrid.innerHTML = cList
                .map((c) => {
                    const mObj = NUMEROLOGY_MEANINGS[c.num] || NUMEROLOGY_MEANINGS[1];
                    return `
                        <article
                            class="util-num-cycle-box has-bento-tooltip"
                            data-num-modal="${c.num}"
                            data-num-role="${c.label}"
                            role="button"
                            tabindex="0"
                            aria-label="${c.label}: Số ${c.num}, ${mObj.title}"
                        >
                            <span>${c.label}</span>
                            <strong>Số ${c.num}</strong>
                            <small>${mObj.title}</small>
                            ${buildBentoTooltipHtml(`${c.label}: Số ${c.num}`, mObj.desc, "✦ Bấm để mở giải nghĩa chi tiết")}
                        </article>
                    `;
                })
                .join("");
        }

        const counts = {};
        allDigits.forEach((digit) => {
            if (digit > 0) counts[digit] = (counts[digit] || "") + String(digit);
        });
        const layoutOrder = [
            [3, "Trí nhớ"],
            [6, "Sáng tạo"],
            [9, "Lý tưởng"],
            [2, "Trực giác"],
            [5, "Cân bằng"],
            [8, "Trí tuệ"],
            [1, "Thể chất"],
            [4, "Thực tế"],
            [7, "Trải nghiệm"],
        ];

        const chartGrid = document.getElementById("num-pythagoras-grid");
        if (chartGrid) {
            chartGrid.innerHTML = layoutOrder
                .map(([num, label]) => {
                    const str = counts[num] || "—";
                    const mObj = NUMEROLOGY_MEANINGS[num];
                    return `
                        <div
                            class="util-pythagoras-cell ${counts[num] ? "has-val" : ""} has-bento-tooltip"
                            data-num-modal="${num}"
                            data-num-role="Ô số ${num} (${label})"
                            role="button"
                            tabindex="0"
                            aria-label="Ô số ${num} (${label}): ${counts[num] ? str : "Đang khuyết"}"
                        >
                            <small>Ô số ${num} (${label})</small>
                            <strong>${str}</strong>
                            ${buildBentoTooltipHtml(`Ô số ${num} (${label}): ${counts[num] ? `Xuất hiện ${counts[num].length} lần` : "Đang khuyết"}`, mObj.desc, `✦ Bấm để xem ý nghĩa Ô số ${num}`)}
                        </div>
                    `;
                })
                .join("");
        }
    };

    const renderNumerologyMonthCalendar = (selectedDay = 15) => {
        const year = 2026;
        const month = 11;
        const leading = (new Date(year, month - 1, 1).getDay() + 6) % 7;
        const maxDays = 30;
        const grid = document.getElementById("num-month-grid");
        if (!grid) return;

        const updateSelectedNumDay = (d) => {
            const raw = `${pad(d)}${pad(month)}${year}`.split("").reduce((a, b) => a + Number(b), 0);
            const num = reduceNum(raw, true);
            const info = NUMEROLOGY_MEANINGS[num] || NUMEROLOGY_MEANINGS[8];
            setText("num-cal-selected-badge", `Ngày ${pad(d)}/11/2026 • Số ${num}`);
            setText("num-day-tag", `Con số năng lượng của ngày ${pad(d)}/11/2026 là: Số ${num}`);
            setText("num-day-title", `Tần Số ${num}: ${info.title}`);
            setText("num-day-meaning", `${info.desc} ${info.advice}`);
            setAttr("num-day-link", "href", `./day.html?date=${year}-${pad(month)}-${pad(d)}`);
        };

        let html = "";
        for (let i = 0; i < 35; i++) {
            const d = i - leading + 1;
            if (d < 1 || d > maxDays) {
                html += `<div class="util-num-day-cell is-muted" aria-hidden="true"><small>—</small><strong>•</strong></div>`;
            } else {
                const raw = `${pad(d)}${pad(month)}${year}`.split("").reduce((a, b) => a + Number(b), 0);
                const num = reduceNum(raw, true);
                const isSel = d === selectedDay;
                html += `
                    <button
                        type="button"
                        class="util-num-day-cell ${isSel ? "is-active" : ""}"
                        data-num-cal-day="${d}"
                        aria-pressed="${isSel}"
                        aria-label="Ngày ${d} tháng 11, con số năng lượng ${num}"
                    >
                        <small>${d}/11</small>
                        <strong>${num}</strong>
                    </button>
                `;
            }
        }
        grid.innerHTML = html;
        updateSelectedNumDay(selectedDay);

        grid.querySelectorAll("[data-num-cal-day]").forEach((btn) => {
            btn.onclick = () => renderNumerologyMonthCalendar(Number(btn.dataset.numCalDay));
        });
    };

    // ==================== MỤC 9: NHỊP SINH HỌC BIORHYTHM ====================
    let bioBirthPicker = null;

    const renderBiorhythm = () => {
        if (!bioBirthPicker) return;
        const { day: bd, month: bm, year: by } = bioBirthPicker.getState();
        const birthDate = new Date(by, bm - 1, bd);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const daysAlive = Math.floor((todayStart - birthDate) / 86400000);

        const cycles = [
            {
                key: "phys",
                name: "Thể chất (23 ngày)",
                period: 23,
                color: "#2563eb",
                desc: "Chu kỳ 23 ngày chi phối sức bền cơ bắp, thể lực, hệ miễn dịch và khả năng vận động.",
            },
            {
                key: "emo",
                name: "Tình cảm (28 ngày)",
                period: 28,
                color: "#10b981",
                desc: "Chu kỳ 28 ngày chi phối cảm xúc, tâm trạng, sự đồng cảm, trực giác giao tiếp và nghệ thuật.",
            },
            {
                key: "intel",
                name: "Trí tuệ (33 ngày)",
                period: 33,
                color: "#f97316",
                desc: "Chu kỳ 33 ngày chi phối tư duy logic, khả năng tập trung, phân tích giải quyết vấn đề và trí nhớ.",
            },
            {
                key: "intuit",
                name: "Trực giác (38 ngày)",
                period: 38,
                color: "#8b5cf6",
                desc: "Chu kỳ 38 ngày chi phối linh cảm vô thức, khả năng nắm bắt cơ hội và sáng tạo đột phá.",
            },
        ];

        let totalPct = 0;
        const statsGrid = document.getElementById("bio-stats-grid");
        if (statsGrid) {
            statsGrid.innerHTML = cycles
                .map((c) => {
                    const pct = Math.round(Math.sin((2 * Math.PI * daysAlive) / c.period) * 100);
                    totalPct += pct;
                    let state = "Trạng thái ổn định";
                    if (Math.abs(pct) <= 12) state = "⚠️ Ngày giao điểm (Cần lưu ý)";
                    else if (pct >= 50) state = "🌟 Năng lượng đỉnh cao";
                    else if (pct < 0) state = "🌙 Giai đoạn nạp năng lượng";

                    return `
                        <article
                            class="util-bio-stat-card has-bento-tooltip"
                            data-bio-key="${c.key}"
                            data-bio-pct="${pct}"
                            role="button"
                            tabindex="0"
                            aria-label="${c.name}: ${pct > 0 ? `+${pct}%` : `${pct}%`}, ${state}"
                        >
                            <div class="util-bio-stat-card__head"><span>${c.name}</span></div>
                            <strong class="util-bio-stat-card__val" style="color:${c.color}">${pct > 0 ? `+${pct}%` : `${pct}%`}</strong>
                            <span class="util-bio-stat-card__advice">${state}</span>
                            ${buildBentoTooltipHtml(`${c.name}: ${pct}%`, c.desc, "✦ Bấm để xem khuyến nghị chi tiết")}
                        </article>
                    `;
                })
                .join("");
        }

        const svgW = 820;
        const svgH = 260;
        const leftPad = 68;
        const rightPad = 24;
        const topPad = 32;
        const plotW = svgW - leftPad - rightPad;
        const plotH = svgH - topPad * 2;
        const midY = topPad + plotH / 2;

        const criticalDaysList = [];
        const peakDaysList = [];

        const pathsHtml = cycles
            .map((c) => {
                const pts = [];
                for (let i = 0; i <= 30; i++) {
                    const x = leftPad + (i / 30) * plotW;
                    const v = Math.sin((2 * Math.PI * (daysAlive + i)) / c.period);
                    const y = midY - v * (plotH / 2);
                    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);

                    if (i > 0 && i <= 15) {
                        const dTarget = new Date(todayStart.getTime() + i * 86400000);
                        const dStr = `${pad(dTarget.getDate())}/${pad(dTarget.getMonth() + 1)}`;
                        if (Math.abs(v) < 0.13 && criticalDaysList.length < 4) {
                            criticalDaysList.push(`${dStr} (${c.name.split("(")[0].trim()})`);
                        }
                        if (v > 0.94 && peakDaysList.length < 4) {
                            peakDaysList.push(`${dStr} (${c.name.split("(")[0].trim()})`);
                        }
                    }
                }
                return `<path class="util-bio-wave-path" d="${pts.join(" ")}" fill="none" stroke="${c.color}" stroke-width="2.8" stroke-linecap="round" />`;
            })
            .join("");

        const container = document.getElementById("bio-svg-container");
        if (container) {
            container.innerHTML = `
                <svg viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="Biểu đồ Nhịp sinh học 30 ngày tới">
                    <line x1="${leftPad}" y1="${topPad}" x2="${svgW - rightPad}" y2="${topPad}" stroke="var(--border-color)" stroke-dasharray="4 4" />
                    <line x1="${leftPad}" y1="${midY}" x2="${svgW - rightPad}" y2="${midY}" stroke="var(--text-muted)" stroke-width="1.2" />
                    <line x1="${leftPad}" y1="${topPad + plotH}" x2="${svgW - rightPad}" y2="${topPad + plotH}" stroke="var(--border-color)" stroke-dasharray="4 4" />
                    <line x1="${leftPad}" y1="${topPad - 10}" x2="${leftPad}" y2="${topPad + plotH + 10}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 3" />
                    <text x="${leftPad - 10}" y="${topPad + 4}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-muted)">+100%</text>
                    <text x="${leftPad - 10}" y="${midY + 4}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-muted)">0%</text>
                    <text x="${leftPad - 10}" y="${topPad + plotH + 4}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-muted)">-100%</text>
                    <text x="${leftPad + 8}" y="${topPad - 10}" font-size="11.5" font-weight="800" fill="#ef4444">Hôm nay (${pad(now.getDate())}/${pad(now.getMonth() + 1)})</text>
                    ${pathsHtml}
                </svg>
            `;
        }

        const avgPct = Math.round(totalPct / 4);
        const insightsEl = document.getElementById("bio-insights-grid");
        if (insightsEl) {
            insightsEl.innerHTML = `
                <article class="util-bento-item is-current-highlight">
                    <div class="util-bento-item__top">
                        <span class="util-bento-item__icon-box"><img src="./assets/icons/sparkle.svg" alt="" aria-hidden="true" /></span>
                        <span class="util-bento-item__badge">Chỉ Số Tổng Hợp Hôm Nay</span>
                    </div>
                    <div class="util-bento-item__body">
                        <strong class="util-bento-item__title">Mức Năng Lượng Trung Bình: ${avgPct > 0 ? `+${avgPct}%` : `${avgPct}%`}</strong>
                        <span class="util-bento-item__sub">Đã sống: ${daysAlive.toLocaleString("vi-VN")} ngày tính từ ngày sinh</span>
                    </div>
                    <p class="util-bento-item__desc">
                        ${
                            avgPct >= 20
                                ? "Tổng hòa 4 chu kỳ đang ở pha Dương tích cực. Rất thuận lợi để giải quyết các công việc đòi hỏi sự tập trung và ra quyết định quan trọng."
                                : "Cơ thể đang trong giai đoạn điều hòa và tích lũy nội lực. Hãy phân bổ thời gian làm việc vừa sức và ưu tiên giấc ngủ sâu."
                        }
                    </p>
                </article>
                <article class="util-bento-item">
                    <div class="util-bento-item__top">
                        <span class="util-bento-item__icon-box"><img src="./assets/icons/calendarCheck.svg" alt="" aria-hidden="true" /></span>
                        <span class="util-bento-item__badge">Dự Báo 15 Ngày Tới</span>
                    </div>
                    <div class="util-bento-item__body">
                        <strong class="util-bento-item__title">Cảnh Báo Ngày Giao Điểm (0%) &amp; Đỉnh Cao</strong>
                        <span class="util-bento-item__sub">Ngày Giao Điểm: ${criticalDaysList.join(", ") || "Không có"}</span>
                    </div>
                    <p class="util-bento-item__desc">
                        🌟 <strong>Các ngày đạt đỉnh (+100%):</strong> ${peakDaysList.join(", ") || "Đang tiến dần lên đỉnh"}. Vào Ngày Giao Điểm (khi đường sóng cắt trục 0%), bạn nên tránh làm việc quá sức hoặc tranh luận căng thẳng.
                    </p>
                </article>
            `;
        }
    };

    // ==================== MỤC 10: TỪ ĐIỂN CỔ HỌC (ĐỦ 25 MỤC NGUYÊN BẢN) ====================
    let fsFilterKey = "fs-all";

    const FENGSHUI_DICT = [
        [
            "Hải Trung Kim",
            "Giáp Tý, Ất Sửu",
            "fs-napam",
            "./assets/icons/metal.svg",
            false,
            "Vàng dưới biển — Nội lực tiềm ẩn, sâu sắc, điềm tĩnh và bền bỉ.",
            "Thổ sinh Kim, Kim sinh Thủy. Hợp màu trắng, bạc, vàng ánh kim; phương vị Chính Tây, Tây Bắc.",
        ],
        [
            "Lư Trung Hỏa",
            "Bính Dần, Đinh Mão",
            "fs-napam",
            "./assets/icons/fire.svg",
            false,
            "Lửa trong lò — Nhiệt huyết được tôi luyện, ấm áp và kiên định.",
            "Mộc sinh Hỏa, Hỏa sinh Thổ. Hợp màu đỏ chu sa, cam ấm, tím; phương vị Chính Nam.",
        ],
        [
            "Đại Lâm Mộc",
            "Mậu Thìn, Kỷ Tỵ",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Gỗ rừng già — Vững chãi, che chở, nhân hậu và giàu sức sống.",
            "Thủy sinh Mộc, Mộc sinh Hỏa. Hợp màu xanh lục bảo, xanh lá; phương vị Chính Đông, Đông Nam.",
        ],
        [
            "Lộ Bàng Thổ",
            "Canh Ngọ, Tân Mùi",
            "fs-napam",
            "./assets/icons/earth.svg",
            false,
            "Đất ven đường — Bằng phẳng, gắn kết giao thương và thực tế.",
            "Hỏa sinh Thổ, Thổ sinh Kim. Hợp màu vàng đất, nâu trầm; phương vị Trung Cung, Đông Bắc, Tây Nam.",
        ],
        [
            "Kiếm Phong Kim",
            "Nhâm Thân, Quý Dậu",
            "fs-napam",
            "./assets/icons/metal.svg",
            false,
            "Vàng mũi kiếm — Sắc bén, quyết đoán, bản lĩnh và mạnh mẽ.",
            "Hợp mệnh Thủy, Thổ, Kim. Rất tốt cho các ngành kỹ thuật, tài chính, công nghệ và quản trị.",
        ],
        [
            "Giản Hạ Thủy",
            "Bính Tý, Đinh Sửu",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước dưới khe — Dòng chảy ngầm tĩnh lặng, tinh tế và linh hoạt.",
            "Kim sinh Thủy, Thủy sinh Mộc. Hợp màu xanh đại dương, đen; phương vị Chính Bắc.",
        ],
        [
            "Tuyền Trung Thủy",
            "Giáp Thân, Ất Dậu",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước trong suối — Nguồn nước mát lành, trí tuệ và dồi dào.",
            "Hợp mệnh Mộc, Kim, Thủy. Thuận lợi cho nghiên cứu, học thuật, ngoại giao và thương mại.",
        ],
        [
            "Tùng Bách Mộc",
            "Canh Dần, Tân Mão",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Gỗ tùng bách — Bất khuất trước gió sương, trường thọ và chính trực.",
            "Hợp mệnh Hỏa, Thủy, Mộc. Đại diện cho ý chí kiên cường và uy tín bền vững.",
        ],
        [
            "Trường Lưu Thủy",
            "Nhâm Thìn, Quý Tỵ",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước chảy dài — Kiên trì, vươn xa biển lớn và không ngừng vận động.",
            "Hợp mệnh Mộc, Kim, Thủy. Tốt cho mở rộng quy mô, đầu tư dài hạn và logistics.",
        ],
        [
            "Bình Địa Mộc",
            "Mậu Tuất, Kỷ Hợi",
            "fs-napam",
            "./assets/icons/wood.svg",
            false,
            "Cây đất bằng — Ôn hòa, phát triển thuận lợi và dễ kết giao.",
            "Hợp mệnh Hỏa, Thủy, Mộc. Thuận lợi cho hợp tác đội nhóm, kiến trúc, giáo dục.",
        ],
        [
            "Thiên Hà Thủy",
            "Bính Ngọ, Đinh Mùi",
            "fs-napam",
            "./assets/icons/water.svg",
            false,
            "Nước mưa trên trời — Thanh khiết, rộng lớn và nuôi dưỡng vạn vật.",
            "Hợp mệnh Mộc, Kim, Thủy. Mang lại phúc khí, sự hài hòa và tầm nhìn rộng mở.",
        ],
        [
            "Cung Đại An",
            "Khổng Minh Lục Diệu • Đại Cát",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-daian.svg",
            true,
            "Mọi việc đều tốt lành, cầu tài đi hướng Tây Nam, nhà cửa yên ổn.",
            "Rất hợp để khởi sự việc quan trọng, ký kết hợp đồng, xuất hành hoặc cầu bình an.",
        ],
        [
            "Cung Lưu Niên",
            "Khổng Minh Lục Diệu • Thận Trọng",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-luunien.svg",
            true,
            "Mưu sự dễ chậm trễ, cầu lộc chưa thông; cần đề phòng khẩu thiệt.",
            "Nên ưu tiên xử lý việc tồn đọng, rà soát kỹ hồ sơ pháp lý và tránh vội vàng.",
        ],
        [
            "Cung Tốc Hỷ",
            "Khổng Minh Lục Diệu • Cát Tinh",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-tochy.svg",
            true,
            "Tin vui đến nhanh, mưu sự đại cát, thuận lợi cho gặp gỡ, ký kết.",
            "Thời điểm vàng để thương thảo, khai trương, ra mắt sản phẩm và kết nối quý nhân.",
        ],
        [
            "Cung Xích Khẩu",
            "Khổng Minh Lục Diệu • Khẩu Thiệt",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-xichkhau.svg",
            true,
            "Dễ xảy ra bất đồng lời ăn tiếng nói; nên cẩn trọng hợp đồng.",
            "Giữ thái độ hòa nhã trong giao tiếp, hạn chế tranh luận gay gắt.",
        ],
        [
            "Cung Tiểu Cát",
            "Khổng Minh Lục Diệu • Quý Nhân",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-tieucat.svg",
            true,
            "Cát lành, hòa hợp, mưu sự suôn sẻ và rất dễ gặp người giúp đỡ.",
            "Thuận lợi cho giao dịch tài chính, mở hàng, cầu tài lộc và vun đắp đối tác.",
        ],
        [
            "Cung Không Vong",
            "Khổng Minh Lục Diệu • Tránh Việc Lớn",
            "fs-lucdieu",
            "./assets/icons/fengshui/lucdieu-khongvong.svg",
            true,
            "Cầu tài chưa lợi; mưu sự lớn dễ hao tổn công sức.",
            "Thích hợp nghỉ ngơi, học tập, lập kế hoạch nội bộ hoặc làm việc thiện nguyện.",
        ],
        [
            "Quẻ Càn",
            "Bát Quái • Hướng Tây Bắc (Hành Kim)",
            "fs-bagua",
            "./assets/icons/zodiac/dog.svg",
            true,
            "Tượng trưng cho Trời lớn, cương kiện, uy quyền, người đứng đầu và sự chính trực.",
            "Phương vị Tây Bắc (Hành Kim). Hợp cầu công danh, lãnh đạo và hoạch định chiến lược.",
        ],
        [
            "Quẻ Khảm",
            "Bát Quái • Hướng Chính Bắc (Hành Thủy)",
            "fs-bagua",
            "./assets/icons/zodiac/mouse.svg",
            true,
            "Tượng trưng cho Nước sâu, trí tuệ uyên bác, sự linh hoạt vượt qua hiểm trở.",
            "Phương vị Chính Bắc (Hành Thủy). Hợp nghiên cứu, học thuật, giao thương và tĩnh tâm.",
        ],
        [
            "Quẻ Cấn",
            "Bát Quái • Hướng Đông Bắc (Hành Thổ)",
            "fs-bagua",
            "./assets/icons/zodiac/tiger.svg",
            true,
            "Tượng trưng cho Núi cao vững chãi, sự tĩnh tâm và tích lũy nội lực.",
            "Phương vị Đông Bắc (Hành Thổ). Hợp tu dưỡng, củng cố nền tảng và bảo toàn tài sản.",
        ],
        [
            "Quẻ Chấn",
            "Bát Quái • Hướng Chính Đông (Hành Mộc)",
            "fs-bagua",
            "./assets/icons/zodiac/cat.svg",
            true,
            "Tượng trưng cho Sấm động mùa xuân, sinh khí bừng tỉnh và khởi đầu mới.",
            "Phương vị Chính Đông (Hành Mộc). Đại lợi cho xuất hành buổi sớm, khởi nghiệp.",
        ],
        [
            "Quẻ Tốn",
            "Bát Quái • Hướng Đông Nam (Hành Mộc)",
            "fs-bagua",
            "./assets/icons/zodiac/dragon.svg",
            true,
            "Tượng trưng cho Gió thuận hiền hòa, giao thương hanh thông và cung Tài Lộc.",
            "Phương vị Đông Nam (Hành Mộc). Rất tốt cho đàm phán, truyền thông và cầu tài.",
        ],
        [
            "Quẻ Ly",
            "Bát Quái • Hướng Chính Nam (Hành Hỏa)",
            "fs-bagua",
            "./assets/icons/zodiac/horse.svg",
            true,
            "Tượng trưng cho Lửa sáng, Mặt trời rực rỡ, văn minh, danh vọng và nhiệt huyết.",
            "Phương vị Chính Nam (Hành Hỏa). Hợp quảng bá thương hiệu, nghệ thuật và tỏa sáng.",
        ],
        [
            "Quẻ Khôn",
            "Bát Quái • Hướng Tây Nam (Hành Thổ)",
            "fs-bagua",
            "./assets/icons/zodiac/goat.svg",
            true,
            "Tượng trưng cho Đất mẹ bao dung, sự nhu thuận và hậu thuẫn vững chắc.",
            "Phương vị Tây Nam (Hành Thổ). Rất tốt cho bất động sản, nhân sự và gia đạo.",
        ],
        [
            "Quẻ Đoài",
            "Bát Quái • Hướng Chính Tây (Hành Kim)",
            "fs-bagua",
            "./assets/icons/zodiac/rooster.svg",
            true,
            "Tượng trưng cho Đầm nước, niềm vui, tài thuyết trình và ngoại giao hài hòa.",
            "Phương vị Chính Tây (Hành Kim). Hợp ngoại giao, thuyết trình và kết nối khách hàng.",
        ],
    ];

    const renderFengShuiDict = (highlightSlug = "") => {
        const grid = document.getElementById("fs-dict-grid");
        const q = (document.getElementById("fs-search-input")?.value || "").trim().toLowerCase();
        if (!grid) return;

        const items = FENGSHUI_DICT.filter(([title, sub, group, , , desc]) => {
            if (q) return `${title} ${sub} ${desc}`.toLowerCase().includes(q);
            if (fsFilterKey !== "fs-all" && group !== fsFilterKey) return false;
            return true;
        });

        grid.innerHTML = items
            .map(([title, sub, , icon, isFiltered, desc, advice]) => {
                const slug = toSlug(title);
                const isSel = highlightSlug && (slug.includes(highlightSlug) || highlightSlug.includes(slug));
                const idx = FENGSHUI_DICT.findIndex((x) => x[0] === title);

                return `
                    <article
                        class="util-bento-item ${isSel ? "is-current-highlight" : ""} has-bento-tooltip"
                        data-fs-idx="${idx}"
                        role="button"
                        tabindex="0"
                        aria-label="${title}, ${sub}"
                    >
                        <span class="util-bento-item__bg-wrap" aria-hidden="true">
                            <img src="${icon}" alt="" class="util-bento-item__watermark" />
                        </span>
                        <div class="util-bento-item__top">
                            <span class="util-bento-item__icon-box ${isFiltered ? "util-bento-item__icon-box--filtered" : ""}">
                                <img src="${icon}" alt="" aria-hidden="true" />
                            </span>
                            <span class="util-bento-item__badge">Cổ Học Tinh Hoa</span>
                        </div>
                        <div class="util-bento-item__body">
                            <strong class="util-bento-item__title">${title}</strong>
                            <span class="util-bento-item__sub">${sub}</span>
                        </div>
                        <p class="util-bento-item__desc">${desc}</p>
                        <footer class="util-bento-item__foot">
                            <span>Xem luận giải ứng dụng</span>
                            <span aria-hidden="true">&#8594;</span>
                        </footer>
                        ${buildBentoTooltipHtml(title, `${desc} ${advice}`, `✦ Bấm để mở thẻ giải nghĩa ${title}`)}
                    </article>
                `;
            })
            .join("");
    };

    // Đồng bộ bộ lọc Từ điển khi đổi Route hoặc nhận deep-link ?napam= / ?lucdieu= / ?bagua=
    Hub.onRouteChange(({ cat, sub, highlight }) => {
        if (cat !== "fengshui") return;
        fsFilterKey = sub || "fs-all";
        renderFengShuiDict(highlight || "");
    });

    // Ủy quyền Modal cho Mục 5, 8, 9, 10
    Hub.registerModalHandler((e) => {
        const hiCard = e.target.closest("[data-hi-idx]");
        if (hiCard) {
            const item = currentHiFilteredList[Number(hiCard.dataset.hiIdx)];
            if (!item) return true;
            const rawSlug = String(item.image_slug || item.slug || "").trim();
            const cleanFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
            const cleanSlug = rawSlug
                .split("/")
                .pop()
                .replace(/\.(jpg|jpeg|png|webp)$/i, "");
            const typeFolder = String(item.category_id || "")
                .toLowerCase()
                .includes("event")
                ? "events"
                : "figures";
            const coverUrl = `./assets/images/calendar-covers/thang-${hiMonth}/${cleanSlug}.jpg`;
            const slide2 = `./assets/images/${typeFolder}/${cleanFolder}/${cleanFolder}.webp`;
            const slide3 = `./assets/images/${typeFolder}/${cleanFolder}/2.webp`;
            const detailHref = `./detail.html?type=${typeFolder}&folder=${cleanFolder}&slug=${rawSlug}&month=${hiMonth}`;

            openUtilModal({
                category: `Ngày Này Năm Xưa • ${item.ngay_hien_thi || `Tháng ${hiMonth}`}`,
                title: item.ten || "Nhân vật & Sự kiện lịch sử",
                visualHtml: `<img src="./assets/icons/calendarDay.svg" alt="" /><strong>${item.ngay_hien_thi || `Tháng ${hiMonth}`}</strong>`,
                isFilteredVisual: true,
                pills: [
                    item.ngay_hien_thi || `Tháng ${hiMonth}`,
                    typeFolder === "events" ? "Sự kiện lịch sử" : "Danh nhân lịch sử",
                ],
                box1Title: "Tiểu sử & Bối cảnh lịch sử",
                desc: item.mo_ta || item.noi_dung || item.hien_thi_nhan_dip || "",
                box2Title: "Danh ngôn & Dấu ấn thời đại",
                advice: item.danh_ngon || item.quote || item.hien_thi_nhan_dip || "",
                actionHref: detailHref,
                actionLabel: "Đọc bài phân tích toàn văn (Mở trang mới) ↗",
                actionTarget: "_blank",
                mediaSlides: [coverUrl, slide2, slide3],
                videoUrl: item.video_url || "",
            });
            return true;
        }

        const numCell = e.target.closest("[data-num-modal]");
        if (numCell) {
            const num = Number(numCell.dataset.numModal || 1);
            const role = numCell.dataset.numRole || `Con số ${num}`;
            const mObj = NUMEROLOGY_MEANINGS[num] || NUMEROLOGY_MEANINGS[1];
            openUtilModal({
                category: "Thần Số Học Pythagoras",
                title: `${role} • ${mObj.title}`,
                visualHtml: `<strong style="font-size:4.8rem;line-height:1">${num}</strong><strong>Tần số ${num}</strong>`,
                pills: [role, mObj.title],
                desc: mObj.desc,
                advice: mObj.advice,
                actionHref: "./bazi.html",
                actionLabel: "Khám phá thêm Bát Tự Tử Bình",
            });
            return true;
        }

        const bioCard = e.target.closest("[data-bio-key]");
        if (bioCard) {
            const pct = Number(bioCard.dataset.bioPct || 0);
            const title = bioCard.querySelector(".util-bio-stat-card__head span")?.textContent || "Nhịp sinh học";
            const tipDesc = bioCard.querySelector(".bento-tooltip__desc")?.textContent || "";
            openUtilModal({
                category: "Nhịp Sinh Học Biorhythm",
                title: `${title}: ${pct > 0 ? `+${pct}%` : `${pct}%`}`,
                visualHtml: `<strong style="font-size:3.8rem">${pct > 0 ? `+${pct}%` : `${pct}%`}</strong><strong>Hôm nay</strong>`,
                pills: [title, pct >= 0 ? "Pha Dương (Phát tiết)" : "Pha Âm (Tích lũy)"],
                desc: tipDesc,
                advice:
                    Math.abs(pct) <= 12
                        ? "Hôm nay chỉ số này đang đi qua vùng Giao Điểm (0%). Bạn nên làm việc điều độ, tránh căng thẳng và nghỉ ngơi sớm."
                        : pct > 0
                          ? "Chỉ số đang ở nửa chu kỳ cao. Hãy tận dụng nguồn năng lượng này cho các hoạt động trọng tâm."
                          : "Chỉ số đang ở pha nạp lại năng lượng. Thích hợp duy trì nhịp độ ổn định và bồi dưỡng sức khỏe.",
                actionHref: "./day.html",
                actionLabel: "Xem thêm Giờ Hoàng Đạo hôm nay",
            });
            return true;
        }

        const fsCard = e.target.closest("[data-fs-idx]");
        if (fsCard) {
            const item = FENGSHUI_DICT[Number(fsCard.dataset.fsIdx)];
            if (!item) return true;
            const [title, sub, , icon, isFiltered, desc, advice] = item;
            openUtilModal({
                category: "Từ Điển Bách Khoa Phong Thủy",
                title,
                visualHtml: `<img src="${icon}" alt="" /><strong>${sub.split("•")[0].trim()}</strong>`,
                isFilteredVisual: Boolean(isFiltered),
                pills: [sub, "Cổ Học Tinh Hoa"],
                desc,
                advice,
                actionHref: "./bazi.html",
                actionLabel: "Phân tích chuyên sâu trên Bàn Bát Tự",
            });
            return true;
        }

        return false;
    });

    Hub.registerModule(() => {
        const now = new Date();
        numBirthPicker = createBentoDatePicker(
            "num-birth-pickers",
            { day: 13, month: 1, year: 1987 },
            renderNumerologyPersonal,
        );
        bioBirthPicker = createBentoDatePicker("bio-birth-pickers", { day: 13, month: 1, year: 1987 }, renderBiorhythm);

        renderHistoryMonthPicker();
        fetchAndRenderHistory();
        renderNumerologyPersonal();
        renderNumerologyMonthCalendar(now.getDate());
        renderBiorhythm();
        renderFengShuiDict();

        // Sự kiện Mục 5: Ngày Này Năm Xưa
        document.getElementById("hi-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hi-month]");
            if (!btn) return;
            e.stopPropagation();
            hiMonth = Number(btn.dataset.hiMonth);
            hiPage = 1;
            document.getElementById("hi-month-dropdown")?.removeAttribute("open");
            renderHistoryMonthPicker();
            fetchAndRenderHistory();
        });

        document.getElementById("hi-scope-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hi-scope]");
            if (!btn) return;
            hiScope = btn.dataset.hiScope;
            hiPage = 1;
            document.querySelectorAll("[data-hi-scope]").forEach((b) => b.classList.toggle("is-active", b === btn));
            fetchAndRenderHistory();
        });

        document.getElementById("hi-pagination")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hi-page]");
            if (!btn) return;
            hiPage = Number(btn.dataset.hiPage);
            fetchAndRenderHistory();
        });

        // Sự kiện Mục 10: Từ điển Cổ học
        document.getElementById("fs-search-input")?.addEventListener("input", () => renderFengShuiDict());
    });
})();
