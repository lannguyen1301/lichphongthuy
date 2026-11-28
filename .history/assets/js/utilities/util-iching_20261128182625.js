// assets/js/utilities/util-iching.js
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const {
        ICHING_IMG_DIR,
        ICHING_ICON_DIR,
        CARD_IMG_EXT,
        CARD_IMG_WIDTH,
        CARD_IMG_HEIGHT,
        pad,
        toSlug,
        escapeHtml,
        setText,
        setAttr,
        resolveCardImageUrl,
        fetchJsonSafe,
        openUtilModal,
    } = Hub;

    const ICHING_HISTORY_KEY = "feng_shui_util_iching_history_v1";

    const ELEMENT_LABEL_VN = {
        metal: "Hành Kim",
        wood: "Hành Mộc",
        water: "Hành Thủy",
        fire: "Hành Hỏa",
        earth: "Hành Thổ",
    };

    // Bản đồ tên ảnh chuẩn cho 8 quẻ Bát Thuần (tránh lệch tên "Thuần Càn" vs "01-can-vi-thien")
    const PURE_HEX_SLUG_MAP = {
        1: "01-can-vi-thien",
        2: "02-khon-vi-dia",
        29: "29-kham-vi-thuy",
        30: "30-ly-vi-hoa",
        51: "51-chan-vi-loi",
        52: "52-can-vi-son",
        57: "57-ton-vi-phong",
        58: "58-doai-vi-trach",
    };

    let mergedHexagrams = [];
    let currentHex = null;
    let statusFilter = "all";
    let elementFilter = "all";
    let isAnimating = false;
    let mouseEntropy = 19870113;
    let castHistoryIds = [];

    const loadHistoryIds = () => {
        try {
            const raw = localStorage.getItem(ICHING_HISTORY_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed)
                ? parsed
                      .map(Number)
                      .filter((n) => n >= 1 && n <= 64)
                      .slice(0, 5)
                : [];
        } catch (err) {
            return [];
        }
    };

    const saveHistoryIds = (ids) => {
        try {
            localStorage.setItem(ICHING_HISTORY_KEY, JSON.stringify(ids.slice(0, 5)));
        } catch (err) {
            // Bỏ qua nếu bộ nhớ đầy
        }
    };

    const getFallbackSvgUrl = (hex) => `${ICHING_ICON_DIR}/${hex.iconSlug}.svg`;
    const getDetailHref = (hex) => `./iching-detail.html?slug=${encodeURIComponent(hex.cardSlug)}&num=${hex.id}`;

    const mergeIchingDatasets = (baseList, cardList) => {
        if (!Array.isArray(cardList) || !cardList.length) {
            console.warn(
                "[UtilIChing] ./api/iching-cards.json rỗng hoặc lỗi cú pháp JSON (hãy kiểm tra lại dấu phẩy/ngoặc trong file này). Đang dùng fallback tên file ảnh chuẩn.",
            );
        }

        const cardById = new Map(
            (Array.isArray(cardList) ? cardList : []).map((c) => [Number(c.id ?? c.number ?? c.hexagram_id), c]),
        );

        return (Array.isArray(baseList) ? baseList : []).map((base) => {
            const id = Number(base.id ?? base.number);
            const card = cardById.get(id) || null;

            const upper = card?.trigrams?.upper || base.trigrams?.upper || {};
            const lower = card?.trigrams?.lower || base.trigrams?.lower || {};
            const element = card?.element || base.element || "metal";
            const statusCode = card?.status?.code || base.fortune?.level || "binh_hoa";
            const statusLabel = card?.status?.label || card?.trang_thai || base.fortune?.label || "Bình Hòa";
            const fullName = card?.name || card?.ten_que || base.name?.full || `Quẻ ${id}`;
            const cardSlug = card?.slug || PURE_HEX_SLUG_MAP[id] || `${pad(id)}-${toSlug(fullName)}`;

            const rawImg =
                card?.artwork?.image_base ||
                card?.artwork?.src ||
                card?.image_base ||
                card?.image_file ||
                card?.image ||
                "";

            let cardImgUrl = "";
            if (rawImg) {
                const cleaned = String(rawImg).trim();
                const withDir = cleaned.includes("/") ? cleaned : `${ICHING_IMG_DIR}/${cleaned}`;
                cardImgUrl = resolveCardImageUrl(withDir);
            } else {
                cardImgUrl = `${ICHING_IMG_DIR}/${cardSlug}.${CARD_IMG_EXT}`;
            }

            const hexagramImages = Array.isArray(card?.hexagram_images)
                ? card.hexagram_images
                : Array.isArray(card?.tuong_que)
                  ? card.tuong_que
                  : card?.tuong_que
                    ? [card.tuong_que]
                    : [];

            const keywords =
                Array.isArray(card?.keywords) && card.keywords.length
                    ? card.keywords
                    : Array.isArray(card?.tu_khoa) && card.tu_khoa.length
                      ? card.tu_khoa
                      : base.keywords || [];

            return {
                id,
                numberStr: pad(id),
                iconSlug: base.slug || pad(id),
                cardSlug,
                unicode: base.unicode || "",
                element,
                elementLabel: ELEMENT_LABEL_VN[element] || "Ngũ Hành",
                shortName: base.name?.short || fullName,
                fullName,
                alias: card?.alias || base.name?.alias || "",
                hanziShort: card?.chinese?.short || base.name?.hanzi || "",
                hanziFull: card?.chinese?.full || card?.chinese?.short || base.name?.hanzi || "",
                lines: Array.isArray(base.lines)
                    ? base.lines
                    : String(card?.line_code || card?.ma_hao || "111111")
                          .split("")
                          .map(Number),
                lineCode: card?.line_code || card?.ma_hao || base.code || "111111",
                upper: {
                    name: upper.name || "",
                    nature: upper.nature || "",
                    symbol: upper.symbol || "",
                },
                lower: {
                    name: lower.name || "",
                    nature: lower.nature || "",
                    symbol: lower.symbol || "",
                },
                statusCode,
                statusLabel,
                hexagramImages,
                keywords,
                coupletOpening: card?.couplet?.opening || card?.giai_nghia_trai || "",
                coupletClosing: card?.couplet?.closing || card?.giai_nghia_phai || "",
                judgment: base.meaning?.judgment || "",
                symbolism: base.meaning?.symbolism || "",
                advice: card?.advice || card?.loi_khuyen || base.meaning?.advice || "",
                cardImgUrl,
                cardAlt: card?.artwork?.alt || `Thẻ bài Kinh Dịch Quẻ ${pad(id)}: ${fullName}`,
            };
        });
    };

    

    const openIChingModal = (hex) => {
        if (!hex) return;
        const fallbackSvg = getFallbackSvgUrl(hex);

        openUtilModal({
            category: `Chu Dịch • Quẻ #${hex.numberStr}${hex.hanziFull ? ` (${hex.hanziFull})` : ""}`,
            title: `${hex.fullName}${hex.alias ? ` (${hex.alias})` : ""}`,
            visualHtml: `
                <img
                    src="${hex.cardImgUrl}"
                    alt="${escapeHtml(hex.cardAlt)}"
                    width="${CARD_IMG_WIDTH}"
                    height="${CARD_IMG_HEIGHT}"
                    class="util-modal-card-img"
                    onerror="this.onerror=null;this.src='${fallbackSvg}';this.classList.add('is-fallback-svg');"
                />
                <strong>#${hex.numberStr} • ${escapeHtml(hex.statusLabel)}</strong>
            `,
            isFilteredVisual: false,
            pills: [
                hex.statusLabel,
                hex.elementLabel,
                `${hex.upper.symbol} ${hex.upper.name} trên • ${hex.lower.symbol} ${hex.lower.name} dưới`,
            ],
            box1Title: "Thoán Từ & Tượng Từ",
            desc: `${hex.judgment} ${hex.symbolism}`.trim(),
            box2Title: "Diễn giải & Lời khuyên ứng dụng",
            advice: hex.advice,
            actionHref: getDetailHref(hex),
            actionLabel: `Xem bài phân tích chi tiết Quẻ ${hex.shortName}`,
            actionTarget: "_self",
        });
    };

    const renderHistoryPills = () => {
        const wrap = document.getElementById("ic-history-wrap");
        const listEl = document.getElementById("ic-history-list");
        if (!wrap || !listEl) return;

        if (!castHistoryIds.length || !mergedHexagrams.length) {
            wrap.hidden = true;
            return;
        }

        wrap.hidden = false;
        listEl.innerHTML = castHistoryIds
            .map((id) => {
                const hex = mergedHexagrams.find((h) => h.id === id);
                if (!hex) return "";
                const isCur = currentHex && currentHex.id === hex.id;
                return `
                    <button
                        type="button"
                        class="util-al-quick-chip ${isCur ? "is-active" : ""}"
                        data-ic-history-id="${hex.id}"
                        aria-pressed="${isCur}"
                        title="Xem lại Quẻ #${hex.numberStr}: ${escapeHtml(hex.fullName)}"
                    >
                        #${hex.numberStr} ${escapeHtml(hex.shortName)}
                    </button>
                `;
            })
            .join("");
    };

    const renderActiveHexagram = (hex) => {
        if (!hex) return;
        currentHex = hex;

        const resultBox = document.getElementById("ic-result-box");
        const stageEl = document.getElementById("ic-hex-stage");
        const imgEl = document.getElementById("ic-hex-card-img");
        const visualLines = document.getElementById("ic-lines-visual");
        const fallbackSvg = getFallbackSvgUrl(hex);

        if (resultBox) {
            resultBox.dataset.hexId = hex.numberStr;
            resultBox.dataset.hexSlug = hex.cardSlug;
            resultBox.dataset.element = hex.element;
            resultBox.dataset.statusCode = hex.statusCode;
        }

        const headStatus = document.getElementById("ic-head-status");
        if (headStatus) {
            headStatus.textContent = `Quẻ #${hex.numberStr} • ${hex.statusLabel}`;
            headStatus.dataset.statusCode = hex.statusCode;
        }

        setText("ic-line-code", hex.lineCode);
        setText("ic-upper-trigram", `${hex.upper.symbol} ${hex.upper.name}`.trim());
        setText("ic-lower-trigram", `${hex.lower.symbol} ${hex.lower.name}`.trim());
        setText("ic-hex-element-label", hex.elementLabel);

        const yangCount = hex.lines.filter((b) => b === 1).length;
        setText("ic-hex-ratio", `${yangCount} Dương • ${6 - yangCount} Âm`);

        if (visualLines) {
            visualLines.innerHTML = [...hex.lines]
                .reverse()
                .map((bit, revIdx) => {
                    const bottomOrder = 5 - revIdx;
                    const delay = (bottomOrder * 0.05).toFixed(2);
                    const haoNum = 6 - revIdx;
                    return `
                        <div class="util-ic-hao-row">
                            <span class="util-ic-hao-row__num">H${haoNum}</span>
                            <div class="util-hex-line ${bit === 1 ? "util-hex-line--yang" : "util-hex-line--yin"}" style="animation-delay:${delay}s">
                                ${bit === 1 ? "<span></span>" : "<span></span><span></span>"}
                            </div>
                            <span class="util-ic-hao-row__type">${bit === 1 ? "Dương" : "Âm"}</span>
                        </div>
                    `;
                })
                .join("");
        }

        if (stageEl) {
            stageEl.dataset.hexNum = String(hex.id);
            stageEl.classList.remove("is-fallback-art");
            stageEl.setAttribute("aria-label", `Phóng to lá bài Quẻ #${hex.numberStr}: ${hex.fullName}`);
        }

        if (imgEl) {
            imgEl.onerror = () => {
                console.warn("[UtilIChing] Không tải được ảnh lá bài:", hex.cardImgUrl);
                imgEl.onerror = null;
                imgEl.src = fallbackSvg;
                stageEl?.classList.add("is-fallback-art");
            };
            imgEl.src = hex.cardImgUrl;
            imgEl.alt = hex.cardAlt;
        }

        setAttr("ic-detail-page-link", "href", getDetailHref(hex));
        setAttr("ic-schema-keywords", "content", hex.keywords.join(", "));

        const numBadge = document.getElementById("ic-hex-number");
        if (numBadge) {
            numBadge.textContent = `Quẻ #${hex.numberStr} • ${hex.statusLabel}`;
            numBadge.dataset.statusCode = hex.statusCode;
        }

        setText("ic-hex-hanzi", hex.hanziFull || hex.hanziShort);
        setText("ic-hex-name", `${hex.fullName}${hex.alias ? ` (${hex.alias})` : ""}`);

        const imagesWrap = document.getElementById("ic-hex-images");
        if (imagesWrap) {
            imagesWrap.innerHTML = hex.hexagramImages
                .map((txt) => `<span class="util-ic-omen-pill">✦ ${escapeHtml(txt)}</span>`)
                .join("");
            imagesWrap.hidden = !hex.hexagramImages.length;
        }

        const kwWrap = document.getElementById("ic-hex-keywords");
        if (kwWrap) {
            kwWrap.innerHTML = hex.keywords.map((kw) => `<li class="util-ic-keyword">#${escapeHtml(kw)}</li>`).join("");
        }

        const coupletBox = document.getElementById("ic-hex-couplet");
        if (coupletBox) {
            if (hex.coupletOpening || hex.coupletClosing) {
                setText("ic-couplet-opening", `“${hex.coupletOpening}”`);
                setText("ic-couplet-closing", hex.coupletClosing);
                coupletBox.hidden = false;
            } else {
                coupletBox.hidden = true;
            }
        }

        setText("ic-hex-judgment", hex.judgment);
        setText("ic-hex-image", hex.symbolism);
        setText("ic-hex-advice", hex.advice);

        document.querySelectorAll("#ic-catalog-grid [data-hex-num]").forEach((cardEl) => {
            const isMatch = Number(cardEl.dataset.hexNum) === hex.id;
            cardEl.classList.toggle("is-current-highlight", isMatch);
            if (isMatch) cardEl.setAttribute("aria-current", "true");
            else cardEl.removeAttribute("aria-current");
        });

        renderHistoryPills();
    };

    const renderCatalog = () => {
        const grid = document.getElementById("ic-catalog-grid");
        if (!grid) return;

        const q = (document.getElementById("ic-search-input")?.value || "").trim().toLowerCase();
        const filtered = mergedHexagrams.filter((h) => {
            if (statusFilter !== "all" && h.statusCode !== statusFilter) return false;
            if (elementFilter !== "all" && h.element !== elementFilter) return false;
            if (!q) return true;
            const haystack = [
                h.numberStr,
                String(h.id),
                h.shortName,
                h.fullName,
                h.alias,
                h.hanziShort,
                h.hanziFull,
                h.statusLabel,
                h.elementLabel,
                h.upper.name,
                h.lower.name,
                h.keywords.join(" "),
                h.hexagramImages.join(" "),
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });

        setText("ic-catalog-count", `${filtered.length} / ${mergedHexagrams.length} quẻ`);

        if (!filtered.length) {
            grid.innerHTML = `<p class="util-data-table__empty">Không tìm thấy quẻ Kinh Dịch nào khớp bộ lọc hiện tại.</p>`;
            return;
        }

        grid.innerHTML = filtered
            .map((h) => {
                const isCur = currentHex && currentHex.id === h.id;
                const fallbackSvg = getFallbackSvgUrl(h);

                return `
                    <a
                        href="${getDetailHref(h)}"
                        class="util-hex-card ${isCur ? "is-current-highlight" : ""}"
                        data-hex-num="${h.id}"
                        data-element="${h.element}"
                        data-status-code="${h.statusCode}"
                        data-hybrid-modal="iching"
                        ${isCur ? 'aria-current="true"' : ""}
                        title="Quẻ #${h.numberStr} ${escapeHtml(h.fullName)} — Bấm xem nhanh (Ctrl + Click mở trang chi tiết)"
                    >
                        <div class="util-hex-card__thumb">
                            <img
                                src="${h.cardImgUrl}"
                                alt="${escapeHtml(h.cardAlt)}"
                                width="${CARD_IMG_WIDTH}"
                                height="${CARD_IMG_HEIGHT}"
                                loading="lazy"
                                decoding="async"
                                onerror="this.onerror=null;this.src='${fallbackSvg}';this.closest('.util-hex-card__thumb')?.classList.add('is-fallback-svg');"
                            />
                        </div>

                        <div class="util-hex-card__body">
                            <div class="util-hex-card__meta">
                                <div class="util-hex-card__meta-left">
                                    <span class="util-tr-card__num">#${h.numberStr}</span>
                                    <span class="util-hex-card__trigrams">
                                        ${h.upper.symbol} ${escapeHtml(h.upper.name)} • ${h.lower.symbol} ${escapeHtml(h.lower.name)}
                                    </span>
                                </div>
                                <span class="util-hex-card__status-tag" data-status-code="${h.statusCode}">
                                    ${escapeHtml(h.statusLabel)}
                                </span>
                            </div>
                            <div class="util-hex-card__title-row">
                                <strong class="util-hex-card__title">${escapeHtml(h.fullName)}</strong>
                                ${h.hanziShort ? `<span class="util-hex-card__hanzi" lang="zh-Hant">${escapeHtml(h.hanziShort)}</span>` : ""}
                            </div>
                        </div>
                    </a>
                `;
            })
            .join("");
    };

    Hub.registerModalHandler((e) => {
        const isModifiedClick = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1;

        const catalogCard = e.target.closest("#ic-catalog-grid [data-hex-num]");
        if (catalogCard) {
            if (isModifiedClick) return true;
            e.preventDefault();
            const hex = mergedHexagrams.find((h) => h.id === Number(catalogCard.dataset.hexNum));
            if (hex) {
                renderActiveHexagram(hex);
                openIChingModal(hex);
            }
            return true;
        }

        if (e.target.closest("[data-ic-modal='current']")) {
            if (currentHex) openIChingModal(currentHex);
            return true;
        }

        return false;
    });

    Hub.registerModule("iching", async (subPanelEl) => {
        castHistoryIds = loadHistoryIds();

        const [baseData, cardData] = await Promise.all([
            fetchJsonSafe("./api/iching.json", []),
            fetchJsonSafe("./api/iching-cards.json", []),
        ]);

        mergedHexagrams = mergeIchingDatasets(baseData, cardData);
        if (!mergedHexagrams.length) return;

        const initialId = castHistoryIds[0] || 14;
        const defaultHex = mergedHexagrams.find((h) => h.id === initialId) || mergedHexagrams[0];
        renderActiveHexagram(defaultHex);
        renderCatalog();

        subPanelEl.addEventListener("mousemove", (e) => {
            mouseEntropy =
                (mouseEntropy ^ ((e.clientX * 31 + e.clientY * 17 + Math.floor(performance.now())) & 0xffffff)) >>> 0;
        });

        document.getElementById("ic-jump-catalog-btn")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("ic-catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        document.getElementById("ic-history-list")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-ic-history-id]");
            if (!btn) return;
            const picked = mergedHexagrams.find((h) => h.id === Number(btn.dataset.icHistoryId));
            if (picked) {
                renderActiveHexagram(picked);
                document.getElementById("ic-result-box")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });

        document.getElementById("ic-cast-btn")?.addEventListener("click", (e) => {
            if (isAnimating || !mergedHexagrams.length) return;
            isAnimating = true;

            const coins = document.querySelectorAll("#ic-coins-stage .util-coin");
            const resultBox = document.getElementById("ic-result-box");
            resultBox?.classList.remove("is-sliding");
            setText("ic-cast-state-text", "Đang gieo 3 đồng xu...");

            coins.forEach((c) => {
                c.classList.remove("is-tossing");
                void c.offsetWidth;
                c.classList.add("is-tossing");
                c.dataset.face = Math.random() > 0.5 ? "yang" : "yin";
            });

            const clickSeed = (e.clientX * 73 + e.clientY * 37 + Math.floor(performance.now() * 100)) >>> 0;
            let chosenIdx = (mouseEntropy ^ clickSeed ^ Math.floor(Math.random() * 100000)) % mergedHexagrams.length;
            if (mergedHexagrams.length > 1 && mergedHexagrams[chosenIdx].id === currentHex?.id) {
                chosenIdx = (chosenIdx + 1) % mergedHexagrams.length;
            }
            const nextHex = mergedHexagrams[chosenIdx];

            const preload = new Image();
            preload.src = nextHex.cardImgUrl;

            setTimeout(() => {
                coins.forEach((c) => c.classList.remove("is-tossing"));
                castHistoryIds = [nextHex.id, ...castHistoryIds.filter((id) => id !== nextHex.id)].slice(0, 5);
                saveHistoryIds(castHistoryIds);

                renderActiveHexagram(nextHex);
                setText("ic-cast-state-text", `Đã ứng Quẻ #${nextHex.numberStr} • ${nextHex.shortName}`);
                resultBox?.classList.add("is-sliding");
                isAnimating = false;
            }, 820);
        });

        document.getElementById("ic-search-input")?.addEventListener("input", renderCatalog);

        document.getElementById("ic-status-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-ic-status]");
            if (!btn) return;
            statusFilter = btn.dataset.icStatus || "all";
            document.querySelectorAll("#ic-status-filters [data-ic-status]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderCatalog();
        });

        document.getElementById("ic-element-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-ic-element]");
            if (!btn) return;
            elementFilter = btn.dataset.icElement || "all";
            document.querySelectorAll("#ic-element-filters [data-ic-element]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderCatalog();
        });
    });
})();
