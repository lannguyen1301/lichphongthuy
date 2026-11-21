// assets/js/utilities/util-divination.js
// Mục 4.1 (Kinh Dịch 64 Quẻ + 3 Xu SVG 3D + List 64 Quẻ Hybrid)
// Mục 4.2 (Tarot 78 Lá Quạt 9/7 + Lật 3D + List 78 Lá Hybrid)
// Mục 6 (12 Cung Hoàng Đạo SVG 128x128 + Custom Bento Picker)
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const {
        TAROT_IMG_DIR,
        TAROT_IMG_EXT,
        ICHING_ICON_DIR,
        HOROSCOPE_ICON_DIR,
        pad,
        setText,
        setHtml,
        buildBentoTooltipHtml,
        fetchJsonSafe,
        openUtilModal,
    } = Hub;

    const getTarotFrontImgUrl = (card) => `${TAROT_IMG_DIR}/${card.suit}/${card.slug}.${TAROT_IMG_EXT}`;
    const getTarotBackImgUrl = () => `${TAROT_IMG_DIR}/back.${TAROT_IMG_EXT}`;
    const getIChingSvgUrl = (hex) => `${ICHING_ICON_DIR}/${hex.slug}.svg`;
    const getIChingDetailHref = (hex) => `./iching-detail.html?slug=${encodeURIComponent(hex.slug)}`;
    const getTarotDetailHref = (card, isUpright = true) =>
        `./tarot-detail.html?slug=${encodeURIComponent(card.slug)}&orientation=${isUpright ? "upright" : "reversed"}`;

    

    const SUIT_LABEL_VN = {
        major: "Bộ Ẩn Chính • Major Arcana",
        wands: "Bộ Gậy (Hành Hỏa) • Wands",
        swords: "Bộ Kiếm (Hành Khí) • Swords",
        cups: "Bộ Cốc (Hành Nước) • Cups",
        pentacles: "Bộ Tiền (Hành Đất) • Pentacles",
    };

    const SUIT_SHORT_VN = {
        major: "Ẩn Chính",
        wands: "Bộ Gậy",
        swords: "Bộ Kiếm",
        cups: "Bộ Cốc",
        pentacles: "Bộ Tiền",
    };

    let mouseEntropyAccumulator = 19870113;
    let isIChingAnimating = false;
    let isTarotAnimating = false;
    let icFortuneFilter = "all";
    let trSuitFilter = "all";

    let ICHING_HEXAGRAMS = [
        {
            num: 14,
            slug: "14-dai-huu",
            short: "Đại Hữu",
            name: "Hỏa Thiên Đại Hữu (Càn hạ - Ly thượng)",
            trigrams: "Nội quái: Càn (Trời) • Ngoại quái: Ly (Lửa)",
            lines: [1, 1, 1, 1, 0, 1],
            fortune: "Đại Cát",
            judgment:
                "Đại Hữu: Nguyên hanh. Mặt trời tỏa sáng trên trời cao, vạn vật được soi chiếu, phúc lộc sung túc.",
            image: "Lửa ở trên trời là tượng quẻ Đại Hữu; người quân tử ngăn điều ác, nêu cao điều thiện.",
            advice: "Tài vận và uy tín cùng vượng. Rất thuận lợi cho đầu tư dài hạn, xây thương hiệu và kết giao quý nhân.",
        },
    ];

    let TAROT_CARDS = [
        {
            id: 14,
            suit: "major",
            slug: "14-temperance",
            roman: "XIV",
            en: "Temperance",
            vn: "Sự Điều Độ",
            keywords_upright: "Cân bằng, kiên nhẫn, dung hòa hai cực đối lập và mục đích sống rõ ràng.",
            keywords_reversed: "Mất cân bằng, nóng vội, quá đà hoặc xung đột nhịp điệu làm việc.",
            career: "Phối hợp nhịp nhàng giữa các bộ phận và quản trị tài chính cân đối tạo hiệu quả bền vững.",
            msg_upright: "Hãy tìm kiếm sự điều độ và kết hợp hài hòa giữa lý trí sắc bén với trực giác tinh tế.",
            msg_reversed: "Điều chỉnh lại nhịp sinh hoạt và làm việc để tránh căng thẳng kéo dài.",
        },
    ];

    let HOROSCOPE_SIGNS = [
        {
            key: "capricorn",
            name: "Ma Kết (Capricorn)",
            mascot: "Dê Biển Đuôi Cá",
            dates: "22/12 – 19/01",
            element: "Nguyên tố Đất • Sao Thổ chủ quản",
            traits: "Có trách nhiệm, kỷ luật, thực tế và giàu tham vọng. Ma Kết luôn kiên trì đạt mục tiêu dài hạn.",
            daily: "Hôm nay năng lượng nguyên tố Đất giúp Ma Kết xử lý công việc và tài chính cực kỳ sáng suốt. Con số may mắn: 4, 8.",
        },
    ];

    let currentIChingHex = ICHING_HEXAGRAMS[0];
    let currentTarotState = { card: TAROT_CARDS[0], isUpright: true };
    let hsDay = 13;
    let hsMonth = 1;

    // ==================== 4.1. KINH DỊCH 64 QUẺ (HYBRID MODAL + DETAIL) ====================
    const openIChingModal = (hex) => {
        if (!hex) return;
        openUtilModal({
            category: `Chu Dịch • Quẻ số ${pad(hex.num)}`,
            title: hex.name,
            visualHtml: `
                <img src="${getIChingSvgUrl(hex)}" alt="Đồ hình ${hex.name}" width="70" height="70" decoding="async" />
                <strong>Quẻ ${hex.short || hex.num} • ${hex.fortune || "Chu Dịch"}</strong>
            `,
            isFilteredVisual: true,
            pills: [`Quẻ #${pad(hex.num)}`, hex.fortune || "Chu Dịch", hex.trigrams || "Lục Thập Tứ Quái"],
            box1Title: "Thoán Từ & Tượng Từ",
            desc: `${hex.judgment} ${hex.image}`,
            box2Title: "Diễn giải & Lời khuyên ứng dụng",
            advice: hex.advice,
            actionHref: getIChingDetailHref(hex),
            actionLabel: `Xem bài phân tích chi tiết Quẻ ${hex.short}`,
            actionTarget: "_self",
        });
    };

    const renderIChingHexagram = (hex) => {
        if (!hex) return;
        currentIChingHex = hex;

        const stageEl = document.getElementById("ic-hex-stage");
        const svgImg = document.getElementById("ic-hex-svg");
        const visual = document.getElementById("ic-lines-visual");

        if (stageEl) {
            stageEl.dataset.hexNum = String(hex.num);
            stageEl.setAttribute("aria-label", `Mở chi tiết Quẻ số ${hex.num}: ${hex.name}`);
        }

        if (svgImg && hex.slug) {
            svgImg.src = getIChingSvgUrl(hex);
            svgImg.alt = `Đồ hình Quẻ số ${hex.num}: ${hex.name}`;
        }

        if (visual && Array.isArray(hex.lines)) {
            visual.innerHTML = [...hex.lines]
                .reverse()
                .map((bit, revIdx) => {
                    const bottomOrder = 5 - revIdx;
                    const delay = (bottomOrder * 0.08).toFixed(2);
                    return bit === 1
                        ? `<div class="util-hex-line util-hex-line--yang" style="animation-delay:${delay}s"><span></span></div>`
                        : `<div class="util-hex-line util-hex-line--yin" style="animation-delay:${delay}s"><span></span><span></span></div>`;
                })
                .join("");
        }

        setText("ic-hex-number", `Quẻ số ${pad(hex.num)} • ${hex.fortune || "Chu Dịch"}`);
        setText("ic-hex-trigrams", hex.trigrams || "");
        setText("ic-hex-name", hex.name);
        setText("ic-hex-judgment", hex.judgment);
        setText("ic-hex-image", hex.image);
        setText("ic-hex-advice", hex.advice);

        document.querySelectorAll("#ic-catalog-grid [data-hex-num]").forEach((card) => {
            const isMatch = Number(card.dataset.hexNum) === Number(hex.num);
            card.classList.toggle("is-current-highlight", isMatch);
            if (isMatch) card.setAttribute("aria-current", "true");
            else card.removeAttribute("aria-current");
        });
    };

    const renderIChingCatalog = () => {
        const grid = document.getElementById("ic-catalog-grid");
        if (!grid) return;

        const q = (document.getElementById("ic-search-input")?.value || "").trim().toLowerCase();
        const filtered = ICHING_HEXAGRAMS.filter((h) => {
            if (icFortuneFilter !== "all" && h.fortune !== icFortuneFilter) return false;
            if (!q) return true;
            return `${pad(h.num)} ${h.num} ${h.short} ${h.name} ${h.trigrams} ${h.advice}`.toLowerCase().includes(q);
        });

        setText("ic-catalog-count", `${filtered.length} / ${ICHING_HEXAGRAMS.length} quẻ`);

        if (!filtered.length) {
            grid.innerHTML = `<p class="util-data-table__empty">Không tìm thấy quẻ nào khớp từ khóa.</p>`;
            return;
        }

        grid.innerHTML = filtered
            .map((h) => {
                const isCur = Number(currentIChingHex?.num) === Number(h.num);
                return `
                    <a
                        href="${getIChingDetailHref(h)}"
                        class="util-hex-card ${isCur ? "is-current-highlight" : ""}"
                        data-hex-num="${h.num}"
                        data-hybrid-modal="iching"
                        ${isCur ? 'aria-current="true"' : ""}
                        title="Bấm để xem nhanh giải nghĩa Quẻ ${h.short} (Ctrl + Click mở trang chi tiết)"
                    >
                        <div class="util-hex-card__top">
                            <span class="util-hex-card__svg" aria-hidden="true">
                                <img src="${getIChingSvgUrl(h)}" alt="" width="70" height="70" loading="lazy" decoding="async" />
                            </span>
                            <span class="util-hex-card__badge">#${pad(h.num)} • ${h.fortune}</span>
                        </div>
                        <div>
                            <strong class="util-hex-card__title">${h.short}</strong>
                            <div class="util-hex-card__sub">${h.name.split("(")[0].trim()}</div>
                        </div>
                        <p class="util-hex-card__desc">${h.advice}</p>
                    </a>
                `;
            })
            .join("");
    };

    // ==================== 4.2. TAROT 78 LÁ 3D & LIST 78 LÁ (HYBRID MODAL + DETAIL) ====================
    const openTarotModal = (card, isUpright = true) => {
        if (!card) return;
        const displayTitle = `${card.roman ? `${card.roman}. ` : ""}${card.vn} (${card.en})`;
        openUtilModal({
            category: SUIT_LABEL_VN[card.suit] || "Tarot Rider-Waite",
            title: displayTitle,
            visualHtml: `
                <img
                    src="${getTarotFrontImgUrl(card)}"
                    alt="Lá bài ${displayTitle}"
                    width="350"
                    height="600"
                    class="util-modal-tarot-img ${isUpright ? "" : "is-reversed"}"
                />
                <strong>${isUpright ? "Chiều Xuôi (Upright)" : "Chiều Ngược (Reversed)"}</strong>
            `,
            isFilteredVisual: false,
            pills: [
                SUIT_LABEL_VN[card.suit] || "Tarot",
                isUpright ? "Chiều Xuôi" : "Chiều Ngược",
                `Mã lá #${pad(card.id)}`,
            ],
            box1Title: "Từ khóa & Thông điệp tổng quan",
            desc: `${isUpright ? card.keywords_upright : card.keywords_reversed} ${isUpright ? card.msg_upright : card.msg_reversed}`,
            box2Title: "Công việc, Sự nghiệp & Tài chính",
            advice: card.career,
            actionHref: getTarotDetailHref(card, isUpright),
            actionLabel: `Xem bài phân tích chi tiết ${card.vn}`,
            actionTarget: "_self",
        });
    };

    const renderTarotCard = (card, isUpright = true) => {
        if (!card) return;
        currentTarotState = { card, isUpright };

        const stageEl = document.getElementById("tr-card-art");
        const frontImg = document.getElementById("tr-card-front-img");
        const orientEl = document.getElementById("tr-card-orientation");

        const orientationKey = isUpright ? "upright" : "reversed";
        const displayTitle = `${card.roman ? `${card.roman}. ` : ""}${card.vn} (${card.en})`;

        if (stageEl) {
            stageEl.dataset.orientation = orientationKey;
            stageEl.setAttribute(
                "aria-label",
                `Phóng to lá bài ${displayTitle} - ${isUpright ? "Chiều Xuôi" : "Chiều Ngược"}`,
            );
        }

        if (frontImg) {
            frontImg.src = getTarotFrontImgUrl(card);
            frontImg.alt = `Lá bài Tarot ${displayTitle} - ${isUpright ? "Chiều Xuôi" : "Chiều Ngược"}`;
        }

        if (orientEl) {
            orientEl.dataset.orientation = orientationKey;
            orientEl.textContent = isUpright
                ? "Lá bài Xuôi (Upright)"
                : "Lá bài Ngược (Reversed • Chiêm nghiệm nội tâm)";
        }

        setText("tr-card-suit-pill", SUIT_LABEL_VN[card.suit] || "Tarot Rider-Waite");
        setText("tr-card-vn", displayTitle);
        setText("tr-card-keywords", isUpright ? card.keywords_upright : card.keywords_reversed);
        setText("tr-card-career", card.career);
        setText("tr-card-message", isUpright ? card.msg_upright : card.msg_reversed);

        document.querySelectorAll("#tr-catalog-grid [data-tarot-id]").forEach((el) => {
            const isMatch = Number(el.dataset.tarotId) === Number(card.id);
            el.classList.toggle("is-current-highlight", isMatch);
            if (isMatch) el.setAttribute("aria-current", "true");
            else el.removeAttribute("aria-current");
        });
    };

    const renderTarotCatalog = () => {
        const grid = document.getElementById("tr-catalog-grid");
        if (!grid) return;

        const q = (document.getElementById("tr-search-input")?.value || "").trim().toLowerCase();
        const filtered = TAROT_CARDS.filter((c) => {
            if (trSuitFilter !== "all" && c.suit !== trSuitFilter) return false;
            if (!q) return true;
            return `${pad(c.id)} ${c.id} ${c.roman} ${c.vn} ${c.en} ${c.keywords_upright} ${SUIT_SHORT_VN[c.suit] || ""}`
                .toLowerCase()
                .includes(q);
        });

        setText("tr-catalog-count", `${filtered.length} / ${TAROT_CARDS.length} lá`);

        if (!filtered.length) {
            grid.innerHTML = `<p class="util-data-table__empty">Không tìm thấy lá bài Tarot nào khớp từ khóa.</p>`;
            return;
        }

        grid.innerHTML = filtered
            .map((c) => {
                const isCur = Number(currentTarotState.card?.id) === Number(c.id);
                const suitLabel = SUIT_SHORT_VN[c.suit] || "Tarot";
                return `
                    <a
                        href="${getTarotDetailHref(c, true)}"
                        class="util-tarot-card ${isCur ? "is-current-highlight" : ""}"
                        data-tarot-id="${c.id}"
                        data-suit="${c.suit}"
                        data-hybrid-modal="tarot"
                        ${isCur ? 'aria-current="true"' : ""}
                        title="Bấm để xem nhanh lá bài ${c.vn} (${c.en}) — Ctrl + Click mở trang chi tiết"
                    >
                        <div class="util-tarot-card__thumb">
                            <img
                                src="${getTarotFrontImgUrl(c)}"
                                alt="Lá bài Tarot ${c.vn} (${c.en})"
                                width="350"
                                height="600"
                                loading="lazy"
                                decoding="async"
                            />
                            <span class="util-tarot-card__badge">#${pad(c.id)} • ${suitLabel}</span>
                        </div>
                        <div class="util-tarot-card__body">
                            <strong class="util-tarot-card__title">${c.roman ? `${c.roman}. ` : ""}${c.vn}</strong>
                            <span class="util-tarot-card__sub">${c.en}</span>
                            <p class="util-tarot-card__desc">${c.keywords_upright}</p>
                        </div>
                    </a>
                `;
            })
            .join("");
    };

    // ==================== 6. HOROSCOPE 12 CUNG HOÀNG ĐẠO ====================
    const buildHoroscopeImgHtml = (signKey, extraClass = "") => `
        <img
            src="${HOROSCOPE_ICON_DIR}/${signKey}.svg"
            alt=""
            width="128"
            height="128"
            loading="lazy"
            decoding="async"
            ${extraClass ? `class="${extraClass}"` : ""}
        />
    `;

    const getSignByMonthDay = (m, d) => {
        const code = m * 100 + d;
        const findByKey = (k) => HOROSCOPE_SIGNS.find((s) => s.key === k) || HOROSCOPE_SIGNS[0];
        if (code >= 1222 || code <= 119) return findByKey("capricorn");
        if (code <= 218) return findByKey("aquarius");
        if (code <= 320) return findByKey("pisces");
        if (code <= 419) return findByKey("aries");
        if (code <= 520) return findByKey("taurus");
        if (code <= 621) return findByKey("gemini");
        if (code <= 722) return findByKey("cancer");
        if (code <= 822) return findByKey("leo");
        if (code <= 922) return findByKey("virgo");
        if (code <= 1023) return findByKey("libra");
        if (code <= 1121) return findByKey("scorpio");
        return findByKey("sagittarius");
    };

    const renderHsPickers = () => {
        setText("hs-day-text", `Ngày ${pad(hsDay)}`);
        setText("hs-month-text", `Tháng ${pad(hsMonth)}`);

        const dList = document.getElementById("hs-day-list");
        if (dList) {
            let html = "";
            for (let d = 1; d <= 31; d++) {
                const isSel = d === hsDay;
                html += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-hs-day="${d}">${pad(d)}</button></li>`;
            }
            dList.innerHTML = html;
        }

        const mList = document.getElementById("hs-month-list");
        if (mList) {
            let html = "";
            for (let m = 1; m <= 12; m++) {
                const isSel = m === hsMonth;
                html += `<li><button type="button" role="option" aria-selected="${isSel}" class="bazi-picker__option ${isSel ? "is-selected" : ""}" data-hs-month="${m}">Tháng ${pad(m)}</button></li>`;
            }
            mList.innerHTML = html;
        }
    };

    const renderHoroscopeSign = (sign) => {
        const targetSign = sign || HOROSCOPE_SIGNS[0];
        if (!targetSign) return;

        setHtml("hs-sign-symbol", buildHoroscopeImgHtml(targetSign.key));
        setHtml("hs-hero-watermark", buildHoroscopeImgHtml(targetSign.key, "util-horoscope-hero__watermark"));
        setText("hs-sign-dates", targetSign.dates);
        setText("hs-sign-element", `${targetSign.element} • Linh vật: ${targetSign.mascot}`);
        setText("hs-sign-name", targetSign.name);
        setText("hs-sign-traits", targetSign.traits);
        setHtml("hs-sign-daily", `<strong>Luận giải năng lượng hôm nay:</strong> ${targetSign.daily}`);

        const grid = document.getElementById("hs-signs-grid");
        if (grid) {
            grid.innerHTML = HOROSCOPE_SIGNS.map((s) => {
                const isSel = s.key === targetSign.key;
                const shortName = s.name.split("(")[0].trim();
                const shortElem = s.element.split("•")[0].trim();

                return `
                    <article
                        class="util-bento-item ${isSel ? "is-current-highlight" : ""} has-bento-tooltip"
                        data-sign-key="${s.key}"
                        role="button"
                        tabindex="0"
                        aria-pressed="${isSel}"
                        aria-label="${s.name}, ${s.dates}, ${shortElem}"
                    >
                        <span class="util-bento-item__bg-wrap" aria-hidden="true">
                            ${buildHoroscopeImgHtml(s.key, "util-bento-item__watermark")}
                        </span>
                        <div class="util-bento-item__top">
                            <span class="util-bento-item__icon-box util-bento-item__icon-box--filtered" aria-hidden="true">
                                ${buildHoroscopeImgHtml(s.key)}
                            </span>
                            <span class="util-bento-item__badge">${s.dates}</span>
                        </div>
                        <div class="util-bento-item__body">
                            <strong class="util-bento-item__title">${shortName}</strong>
                            <span class="util-bento-item__sub">${s.mascot}</span>
                        </div>
                        <p class="util-bento-item__desc">${s.traits}</p>
                        <footer class="util-bento-item__foot">
                            <span>${shortElem}</span>
                            <span aria-hidden="true">&#8594;</span>
                        </footer>
                        ${buildBentoTooltipHtml(s.name, `${s.element}. ${s.daily}`, `✦ Bấm để mở luận giải ${s.name}`)}
                    </article>
                `;
            }).join("");
        }
    };

    // ==================== ỦY QUYỀN CLICK HYBRID MODAL ====================
    Hub.registerModalHandler((e) => {
        const isModifiedClick = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1;

        // 1. Click thẻ trong List 64 Quẻ Kinh Dịch (Hybrid <a>)
        const hexCard = e.target.closest("#ic-catalog-grid [data-hex-num]");
        if (hexCard) {
            if (isModifiedClick) return true;
            e.preventDefault();
            const hex = ICHING_HEXAGRAMS.find((h) => Number(h.num) === Number(hexCard.dataset.hexNum));
            if (hex) {
                renderIChingHexagram(hex);
                openIChingModal(hex);
            }
            return true;
        }

        if (e.target.closest("[data-ic-modal='current']")) {
            openIChingModal(currentIChingHex);
            return true;
        }

        // 2. Click thẻ trong List 78 Lá Tarot (Hybrid <a>)
        const tarotListCard = e.target.closest("#tr-catalog-grid [data-tarot-id]");
        if (tarotListCard) {
            if (isModifiedClick) return true;
            e.preventDefault();
            const card = TAROT_CARDS.find((c) => Number(c.id) === Number(tarotListCard.dataset.tarotId));
            if (card) {
                renderTarotCard(card, true);
                openTarotModal(card, true);
            }
            return true;
        }

        // 3. Click vào Lá bài Tarot lớn đang lật
        if (e.target.closest("[data-tarot-modal]") && currentTarotState.card) {
            openTarotModal(currentTarotState.card, currentTarotState.isUpright);
            return true;
        }

        // 4. Click vào Cung Hoàng Đạo
        const signCard = e.target.closest("[data-sign-key]");
        if (signCard) {
            const found = HOROSCOPE_SIGNS.find((s) => s.key === signCard.dataset.signKey);
            if (!found) return true;
            renderHoroscopeSign(found);
            openUtilModal({
                category: "Chiêm Tinh Học Horoscope",
                title: `${found.name} • ${found.mascot}`,
                visualHtml: `${buildHoroscopeImgHtml(found.key)}<strong>${found.dates}</strong>`,
                isFilteredVisual: true,
                pills: [found.dates, found.element, found.mascot],
                box1Title: "Đặc trưng tính cách & Bản mệnh",
                desc: found.traits,
                box2Title: "Thông điệp năng lượng trong ngày",
                advice: found.daily,
                actionHref: "./bazi.html",
                actionLabel: "Đối chiếu thêm Lá Số Bát Tự Phương Đông",
            });
            return true;
        }

        return false;
    });

    Hub.registerModule(() => {
        renderIChingHexagram(ICHING_HEXAGRAMS[0]);
        renderIChingCatalog();
        renderTarotCard(TAROT_CARDS[0], true);
        renderTarotCatalog();
        renderHsPickers();
        renderHoroscopeSign(HOROSCOPE_SIGNS[0]);

        Promise.all([
            fetchJsonSafe("./api/iching.json", ICHING_HEXAGRAMS),
            fetchJsonSafe("./api/tarot.json", TAROT_CARDS),
            fetchJsonSafe("./api/horoscope.json", HOROSCOPE_SIGNS),
        ]).then(([ichingData, tarotData, horoscopeData]) => {
            ICHING_HEXAGRAMS = ichingData;
            TAROT_CARDS = tarotData;
            HOROSCOPE_SIGNS = horoscopeData;

            const defaultHex = ICHING_HEXAGRAMS.find((h) => h.num === 14) || ICHING_HEXAGRAMS[0];
            const defaultTarot = TAROT_CARDS.find((c) => c.id === 14) || TAROT_CARDS[0];
            renderIChingHexagram(defaultHex);
            renderIChingCatalog();
            renderTarotCard(defaultTarot, true);
            renderTarotCatalog();
            renderHoroscopeSign(getSignByMonthDay(hsMonth, hsDay));
        });

        document.getElementById("panel-divination")?.addEventListener("mousemove", (e) => {
            mouseEntropyAccumulator =
                (mouseEntropyAccumulator ^
                    ((e.clientX * 31 + e.clientY * 17 + Math.floor(performance.now())) & 0xffffff)) >>>
                0;
        });

        // Cuộn mượt xuống bảng tra cứu không làm đổi URL hash tab hiện tại
        document.getElementById("ic-jump-catalog-btn")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("ic-catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        document.getElementById("tr-jump-catalog-btn")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("tr-catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        // Gieo Quẻ Kinh Dịch 1-Click
        document.getElementById("ic-cast-btn")?.addEventListener("click", (e) => {
            if (isIChingAnimating || !ICHING_HEXAGRAMS.length) return;
            isIChingAnimating = true;

            const coins = document.querySelectorAll("#ic-coins-stage .util-coin");
            const resultBox = document.getElementById("ic-result-box");
            resultBox?.classList.remove("is-sliding");

            coins.forEach((c) => {
                c.classList.remove("is-tossing");
                void c.offsetWidth;
                c.classList.add("is-tossing");
                c.dataset.face = Math.random() > 0.5 ? "yang" : "yin";
            });

            const clickEntropy = (e.clientX * 73 + e.clientY * 37 + Math.floor(performance.now() * 100)) >>> 0;
            let chosenIdx =
                (mouseEntropyAccumulator ^ clickEntropy ^ Math.floor(Math.random() * 100000)) % ICHING_HEXAGRAMS.length;
            if (ICHING_HEXAGRAMS.length > 1 && ICHING_HEXAGRAMS[chosenIdx].num === currentIChingHex?.num) {
                chosenIdx = (chosenIdx + 1) % ICHING_HEXAGRAMS.length;
            }

            setTimeout(() => {
                coins.forEach((c) => c.classList.remove("is-tossing"));
                renderIChingHexagram(ICHING_HEXAGRAMS[chosenIdx]);
                resultBox?.classList.add("is-sliding");
                isIChingAnimating = false;
            }, 820);
        });

        document.getElementById("ic-search-input")?.addEventListener("input", renderIChingCatalog);
        document.getElementById("ic-fortune-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-ic-fortune]");
            if (!btn) return;
            icFortuneFilter = btn.dataset.icFortune || "all";
            document.querySelectorAll("[data-ic-fortune]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderIChingCatalog();
        });

        // Rút Bài Tarot 78 Lá
        const triggerTarotDraw = (fanIdx = -1, withShuffle = false) => {
            if (isTarotAnimating || !TAROT_CARDS.length) return;
            isTarotAnimating = true;

            const fanEl = document.getElementById("tr-deck-fan");
            const stageEl = document.getElementById("tr-card-art");
            const resultBox = document.getElementById("tr-result-box");

            const backImgUrl = getTarotBackImgUrl();
            document.querySelectorAll("#tr-deck-fan img, #tr-card-back-img").forEach((img) => {
                if (!img.getAttribute("src")?.endsWith(backImgUrl.replace("./", ""))) img.src = backImgUrl;
            });

            if (stageEl) stageEl.dataset.flipped = "false";
            if (fanEl && withShuffle) fanEl.dataset.deckState = "shuffling";
            resultBox?.classList.remove("is-sliding");

            const isCompactFan = window.innerWidth < 768;
            const randomVisibleIdx = isCompactFan ? 1 + Math.floor(Math.random() * 7) : Math.floor(Math.random() * 9);
            const chosenFanIdx = fanIdx >= 0 ? fanIdx : randomVisibleIdx;

            document.querySelectorAll("#tr-deck-fan .util-tarot-back").forEach((b) => {
                const isMatch = Number(b.dataset.fanIdx) === chosenFanIdx;
                b.classList.toggle("is-picked", isMatch);
                b.setAttribute("aria-pressed", String(isMatch));
            });

            const entropySeed =
                (mouseEntropyAccumulator ^ Math.floor(performance.now() * 100) ^ (chosenFanIdx * 97)) >>> 0;
            let nextIdx = (entropySeed + Math.floor(Math.random() * TAROT_CARDS.length)) % TAROT_CARDS.length;
            if (TAROT_CARDS.length > 1 && TAROT_CARDS[nextIdx].id === currentTarotState.card?.id) {
                nextIdx = (nextIdx + 1) % TAROT_CARDS.length;
            }
            const nextCard = TAROT_CARDS[nextIdx];
            const isUpright = Math.random() > 0.25;

            const preload = new Image();
            preload.src = getTarotFrontImgUrl(nextCard);

            const flipDelay = withShuffle ? 580 : 320;
            setTimeout(() => {
                if (fanEl) fanEl.dataset.deckState = "idle";
                renderTarotCard(nextCard, isUpright);

                requestAnimationFrame(() => {
                    if (stageEl) stageEl.dataset.flipped = "true";
                    resultBox?.classList.add("is-sliding");
                    setTimeout(() => {
                        isTarotAnimating = false;
                    }, 520);
                });
            }, flipDelay);
        };

        document.getElementById("tr-draw-btn")?.addEventListener("click", () => triggerTarotDraw(-1, true));
        document.getElementById("tr-deck-fan")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-fan-idx]");
            if (!btn) return;
            triggerTarotDraw(Number(btn.dataset.fanIdx), false);
        });

        // Tìm kiếm & lọc List 78 Lá Tarot
        document.getElementById("tr-search-input")?.addEventListener("input", renderTarotCatalog);
        document.getElementById("tr-suit-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-tr-suit]");
            if (!btn) return;
            trSuitFilter = btn.dataset.trSuit || "all";
            document.querySelectorAll("[data-tr-suit]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderTarotCatalog();
        });

        // Horoscope Pickers
        document.getElementById("hs-day-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hs-day]");
            if (!btn) return;
            e.stopPropagation();
            hsDay = Number(btn.dataset.hsDay);
            document.getElementById("hs-day-dropdown")?.removeAttribute("open");
            renderHsPickers();
            renderHoroscopeSign(getSignByMonthDay(hsMonth, hsDay));
        });

        document.getElementById("hs-month-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-hs-month]");
            if (!btn) return;
            e.stopPropagation();
            hsMonth = Number(btn.dataset.hsMonth);
            document.getElementById("hs-month-dropdown")?.removeAttribute("open");
            renderHsPickers();
            renderHoroscopeSign(getSignByMonthDay(hsMonth, hsDay));
        });
    });
})();
