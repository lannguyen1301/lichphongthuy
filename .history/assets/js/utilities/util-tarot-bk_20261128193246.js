// assets/js/utilities/util-tarot.js
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const {
        TAROT_IMG_DIR,
        TAROT_IMG_EXT,
        CARD_IMG_WIDTH,
        CARD_IMG_HEIGHT,
        pad,
        escapeHtml,
        setText,
        setAttr,
        fetchJsonSafe,
        openUtilModal,
    } = Hub;

    const TAROT_HISTORY_KEY = "feng_shui_util_tarot_history_v1";

    const SUIT_META = {
        major: {
            label: "Bộ Ẩn Chính",
            en: "Major Arcana",
            short: "Ẩn Chính",
            essenceTitle: "Đặc tính Bộ Ẩn Chính (Major Arcana)",
            essenceDesc:
                "Đại diện cho các bước ngoặt lớn, bài học trưởng thành và dòng chảy dài hạn định hình hành trình của bạn.",
        },
        wands: {
            label: "Bộ Gậy",
            en: "Suit of Wands",
            short: "Bộ Gậy",
            essenceTitle: "Bộ Gậy • Nguyên tố Lửa",
            essenceDesc:
                "Chủ quản ý chí tiên phong, cảm hứng sáng tạo, sự nhiệt huyết và năng lượng hành động bứt phá.",
        },
        swords: {
            label: "Bộ Kiếm",
            en: "Suit of Swords",
            short: "Bộ Kiếm",
            essenceTitle: "Bộ Kiếm • Nguyên tố Khí",
            essenceDesc:
                "Đại diện cho tư duy phân tích sắc bén, sự minh bạch, chiến lược giao tiếp và bản lĩnh ra quyết định.",
        },
        cups: {
            label: "Bộ Cốc",
            en: "Suit of Cups",
            short: "Bộ Cốc",
            essenceTitle: "Bộ Cốc • Nguyên tố Nước",
            essenceDesc: "Phản ánh đời sống nội tâm, tình cảm, sự thấu cảm, các mối nhân duyên và chiều sâu trực giác.",
        },
        pentacles: {
            label: "Bộ Tiền",
            en: "Suit of Pentacles",
            short: "Bộ Tiền",
            essenceTitle: "Bộ Tiền • Nguyên tố Đất",
            essenceDesc:
                "Gắn liền với tài chính, sự nghiệp thực tiễn, kỹ năng chuyên môn, sức khỏe và nền tảng bền vững.",
        },
    };

    const ELEMENT_META = {
        fire: "Nguyên tố Lửa",
        water: "Nguyên tố Nước",
        air: "Nguyên tố Khí",
        earth: "Nguyên tố Đất",
    };

    let tarotDeck = [];
    let currentCard = null;
    let currentOrient = "upright";
    let activeSuitFilter = "all";
    let activeElemFilter = "all";
    let isDrawing = false;
    let drawHistory = [];

    const getSuitKey = (card) => (card.arcana === "major" || !card.suit ? "major" : card.suit);
    const getBackImageUrl = () => `${TAROT_IMG_DIR}/back.${TAROT_IMG_EXT}`;
    const getBackFallbackPng = () => `${TAROT_IMG_DIR}/back.png`;
    const getCardImageUrl = (card) => `${TAROT_IMG_DIR}/${getSuitKey(card)}/${card.slug}.${TAROT_IMG_EXT}`;
    const getDetailHref = (card, orient = "upright") =>
        `./tarot-detail.html?slug=${encodeURIComponent(card.slug)}&orient=${encodeURIComponent(orient)}`;

    const bindBackImageSafe = (img) => {
        if (!img) return;
        img.onerror = () => {
            if (!img.src.endsWith(".png")) {
                img.src = getBackFallbackPng();
                return;
            }
            img.onerror = null;
        };
        img.src = getBackImageUrl();
    };

    const loadHistory = () => {
        try {
            const raw = localStorage.getItem(TAROT_HISTORY_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
        } catch (err) {
            return [];
        }
    };

    const saveHistory = (list) => {
        try {
            localStorage.setItem(TAROT_HISTORY_KEY, JSON.stringify(list.slice(0, 5)));
        } catch (err) {
            // Bỏ qua nếu bộ nhớ đầy
        }
    };

    
    const openTarotModal = (card, orient = "upright") => {
        if (!card) return;
        const suitKey = getSuitKey(card);
        const suitInfo = SUIT_META[suitKey] || SUIT_META.major;
        const side = card[orient] || card.upright || {};
        const isRev = orient === "reversed";
        const imgUrl = getCardImageUrl(card);
        const backUrl = getBackFallbackPng();
        const titleVi = card.name?.vi || "";
        const titleEn = card.name?.en || "";

        openUtilModal({
            category: `${suitInfo.label} • ${suitInfo.en}`,
            title: `${card.label}. ${titleVi} (${titleEn})`,
            visualHtml: `
                <img
                    src="${imgUrl}"
                    alt="${escapeHtml(`${titleVi} (${titleEn}) - ${isRev ? "Chiều Ngược" : "Chiều Xuôi"}`)}"
                    width="${CARD_IMG_WIDTH}"
                    height="${CARD_IMG_HEIGHT}"
                    class="util-modal-card-img ${isRev ? "is-reversed" : ""}"
                    onerror="this.onerror=null;this.src='${backUrl}';"
                />
                <strong>${isRev ? "↺ Chiều Ngược (Reversed)" : "✦ Chiều Xuôi (Upright)"}</strong>
            `,
            isFilteredVisual: false,
            pills: [
                isRev ? "Lá bài Ngược" : "Lá bài Xuôi",
                suitInfo.short,
                ELEMENT_META[card.element] || "Nguyên tố",
                `Lá #${pad(card.id)} / 78`,
            ],
            box1Title: "Tóm tắt & Công việc, Tài chính",
            desc: `${side.summary || ""} ${side.aspects?.career ? `— Công việc: ${side.aspects.career}` : ""}`.trim(),
            box2Title: "Thông điệp & Lời khuyên",
            advice: side.message || "",
            actionHref: getDetailHref(card, orient),
            actionLabel: `Xem giải nghĩa 2 chiều lá ${titleVi}`,
            actionTarget: "_self",
        });
    };

    const renderHistoryPills = () => {
        const wrap = document.getElementById("tr-history-wrap");
        const listEl = document.getElementById("tr-history-list");
        if (!wrap || !listEl) return;

        if (!drawHistory.length || !tarotDeck.length) {
            wrap.hidden = true;
            return;
        }

        wrap.hidden = false;
        listEl.innerHTML = drawHistory
            .map((entry) => {
                const card = tarotDeck.find((c) => Number(c.id) === Number(entry.id));
                if (!card) return "";
                const isCur = currentCard && currentCard.id === card.id && currentOrient === entry.orient;
                const tag = entry.orient === "reversed" ? "↺" : "✦";
                return `
                    <button
                        type="button"
                        class="util-al-quick-chip ${isCur ? "is-active" : ""}"
                        data-tr-history-id="${card.id}"
                        data-tr-history-orient="${entry.orient}"
                        aria-pressed="${isCur}"
                        title="Xem lại lá ${escapeHtml(card.name?.vi)} (${entry.orient === "reversed" ? "Ngược" : "Xuôi"})"
                    >
                        ${tag} #${pad(card.id)} ${escapeHtml(card.name?.vi)}
                    </button>
                `;
            })
            .join("");
    };

    const renderActiveCard = (card, orient = "upright", { animateFlip = false } = {}) => {
        if (!card) return;
        currentCard = card;
        currentOrient = orient === "reversed" ? "reversed" : "upright";

        const suitKey = getSuitKey(card);
        const suitInfo = SUIT_META[suitKey] || SUIT_META.major;
        const side = card[currentOrient] || card.upright || {};
        const altOrient = currentOrient === "reversed" ? "upright" : "reversed";
        const altSide = card[altOrient] || {};
        const isRev = currentOrient === "reversed";
        const imgUrl = getCardImageUrl(card);
        const titleVi = card.name?.vi || "";
        const titleEn = card.name?.en || "";

        const resultBox = document.getElementById("tr-result-box");
        const stage = document.getElementById("tr-card-art");
        const frontImg = document.getElementById("tr-card-front-img");

        if (resultBox) {
            resultBox.dataset.cardId = String(card.id);
            resultBox.dataset.arcana = card.arcana || "major";
            resultBox.dataset.element = card.element || "fire";
            resultBox.dataset.orientation = currentOrient;
        }

        const applyCardContent = () => {
            if (frontImg) {
                frontImg.onerror = () => {
                    console.warn("[UtilTarot] Không tải được ảnh mặt trước:", imgUrl);
                    frontImg.onerror = null;
                    frontImg.src = getBackFallbackPng();
                };
                frontImg.src = imgUrl;
                frontImg.alt = `Lá bài Tarot ${card.label} - ${titleVi} (${titleEn}) - ${isRev ? "Chiều Ngược" : "Chiều Xuôi"}`;
            }

            if (stage) {
                stage.dataset.orientation = currentOrient;
                stage.setAttribute("aria-label", `Phóng to lá bài ${card.label}. ${titleVi} (${titleEn})`);
            }

            const orientBadge = document.getElementById("tr-card-orientation");
            if (orientBadge) {
                orientBadge.dataset.orientation = currentOrient;
                orientBadge.textContent = isRev ? "↺ Lá bài Ngược (Reversed)" : "✦ Lá bài Xuôi (Upright)";
            }

            setText("tr-card-suit-pill", suitInfo.label);
            setText("tr-card-elem-pill", ELEMENT_META[card.element] || "Nguyên tố");
            setText("tr-card-vn", `${card.label}. ${titleVi}`);
            setText("tr-card-en", `${titleEn} • Lá #${pad(card.id)} / 78`);
            setText("tr-head-badge", `${suitInfo.short} • #${pad(card.id)}`);

            const kwList = Array.isArray(side.keywords) ? side.keywords : [];
            const kwWrap = document.getElementById("tr-card-keywords");
            if (kwWrap) {
                kwWrap.innerHTML = kwList.map((kw) => `<li class="util-ic-keyword">#${escapeHtml(kw)}</li>`).join("");
            }
            setAttr("tr-schema-keywords", "content", kwList.join(", "));

            setText("tr-card-summary", side.summary || "");
            setText("tr-card-career", side.aspects?.career || "");
            setText("tr-card-message", side.message || "");
            setAttr("tr-detail-page-link", "href", getDetailHref(card, currentOrient));

            // Bảng đối chiếu chiều còn lại + Đặc tính Bộ bài
            setText(
                "tr-alt-orient-title",
                altOrient === "reversed" ? "↺ Góc nhìn khi lá Ngược" : "✦ Góc nhìn khi lá Xuôi",
            );
            setText("tr-alt-orient-summary", altSide.summary || altSide.message || "");
            const altKwWrap = document.getElementById("tr-alt-orient-keywords");
            if (altKwWrap) {
                altKwWrap.innerHTML = (Array.isArray(altSide.keywords) ? altSide.keywords : [])
                    .slice(0, 3)
                    .map((k) => `<span>#${escapeHtml(k)}</span>`)
                    .join("");
            }
            const altBtn = document.getElementById("tr-alt-orient-btn");
            if (altBtn) altBtn.dataset.flipTarget = altOrient;

            setText("tr-suit-essence-title", suitInfo.essenceTitle);
            setText("tr-suit-essence-desc", suitInfo.essenceDesc);

            document.querySelectorAll("[data-tr-orient]").forEach((btn) => {
                const isMatch = btn.dataset.trOrient === currentOrient;
                btn.classList.toggle("is-active", isMatch);
                btn.setAttribute("aria-pressed", String(isMatch));
            });

            document.querySelectorAll("#tr-catalog-grid [data-card-id]").forEach((el) => {
                const isMatch = Number(el.dataset.cardId) === card.id;
                el.classList.toggle("is-current-highlight", isMatch);
                if (isMatch) el.setAttribute("aria-current", "true");
                else el.removeAttribute("aria-current");
            });

            renderHistoryPills();
        };

        if (animateFlip && stage) {
            stage.dataset.flipped = "false";
            const preload = new Image();
            preload.src = imgUrl;
            setTimeout(() => {
                applyCardContent();
                requestAnimationFrame(() => {
                    stage.dataset.flipped = "true";
                });
            }, 260);
        } else {
            applyCardContent();
            if (stage) stage.dataset.flipped = "true";
        }
    };

    const renderCatalog = () => {
        const grid = document.getElementById("tr-catalog-grid");
        if (!grid) return;

        const q = (document.getElementById("tr-search-input")?.value || "").trim().toLowerCase();
        const filtered = tarotDeck.filter((c) => {
            const suitKey = getSuitKey(c);
            if (activeSuitFilter !== "all" && suitKey !== activeSuitFilter) return false;
            if (activeElemFilter !== "all" && c.element !== activeElemFilter) return false;
            if (!q) return true;
            const haystack = [
                pad(c.id),
                String(c.id),
                c.label,
                c.name?.vi,
                c.name?.en,
                SUIT_META[suitKey]?.label,
                ELEMENT_META[c.element],
                ...(c.upright?.keywords || []),
                ...(c.reversed?.keywords || []),
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });

        setText("tr-catalog-count", `${filtered.length} / ${tarotDeck.length} lá`);

        if (!filtered.length) {
            grid.innerHTML = `<p class="util-data-table__empty">Không tìm thấy lá bài Tarot nào khớp bộ lọc hiện tại.</p>`;
            return;
        }

        const backFallback = getBackFallbackPng();

        grid.innerHTML = filtered
            .map((c) => {
                const suitKey = getSuitKey(c);
                const suitInfo = SUIT_META[suitKey] || SUIT_META.major;
                const isCur = currentCard && currentCard.id === c.id;
                const imgUrl = getCardImageUrl(c);
                const titleVi = c.name?.vi || "";
                const titleEn = c.name?.en || "";

                return `
                    <a
                        href="${getDetailHref(c, "upright")}"
                        class="util-tr-card ${isCur ? "is-current-highlight" : ""}"
                        data-card-id="${c.id}"
                        data-suit="${suitKey}"
                        data-element="${c.element || "fire"}"
                        data-hybrid-modal="tarot"
                        ${isCur ? 'aria-current="true"' : ""}
                        title="${escapeHtml(`${c.label}. ${titleVi} (${titleEn})`)} — Bấm xem nhanh (Ctrl + Click mở trang chi tiết)"
                    >
                        <div class="util-tr-card__thumb">
                            <img
                                src="${imgUrl}"
                                alt="${escapeHtml(`Lá bài Tarot ${c.label} - ${titleVi} (${titleEn})`)}"
                                width="${CARD_IMG_WIDTH}"
                                height="${CARD_IMG_HEIGHT}"
                                loading="lazy"
                                decoding="async"
                                onerror="this.onerror=null;this.src='${backFallback}';"
                            />
                        </div>

                        <div class="util-tr-card__body">
                            <div class="util-tr-card__meta">
                                <span class="util-tr-card__num">#${pad(c.id)}</span>
                                <span class="util-tr-card__suit">${suitInfo.short}</span>
                            </div>
                            <strong class="util-tr-card__title">${escapeHtml(titleVi)}</strong>
                            <span class="util-tr-card__en">${escapeHtml(titleEn)}</span>
                        </div>
                    </a>
                `;
            })
            .join("");
    };

    const drawRandomCard = (pickedFanIdx = null) => {
        if (isDrawing || !tarotDeck.length) return;
        isDrawing = true;

        const fanEl = document.getElementById("tr-deck-fan");
        const fanCards = Array.from(document.querySelectorAll("#tr-deck-fan .util-tarot-back"));
        const targetFanIdx = pickedFanIdx !== null ? pickedFanIdx : Math.floor(Math.random() * fanCards.length);

        if (fanEl) fanEl.dataset.deckState = "shuffling";
        fanCards.forEach((btn, i) => {
            const isPicked = i === targetFanIdx;
            btn.classList.toggle("is-picked", isPicked);
            btn.setAttribute("aria-pressed", String(isPicked));
        });

        let chosenIdx = Math.floor(Math.random() * tarotDeck.length);
        if (tarotDeck.length > 1 && tarotDeck[chosenIdx].id === currentCard?.id) {
            chosenIdx = (chosenIdx + 1) % tarotDeck.length;
        }
        const nextCard = tarotDeck[chosenIdx];
        const nextOrient = Math.random() < 0.72 ? "upright" : "reversed";

        const preload = new Image();
        preload.src = getCardImageUrl(nextCard);

        setTimeout(() => {
            if (fanEl) fanEl.dataset.deckState = "idle";
            drawHistory = [
                { id: nextCard.id, orient: nextOrient },
                ...drawHistory.filter((item) => item.id !== nextCard.id),
            ].slice(0, 5);
            saveHistory(drawHistory);

            renderActiveCard(nextCard, nextOrient, { animateFlip: true });
            isDrawing = false;
        }, 420);
    };

    Hub.registerModalHandler((e) => {
        const isModifiedClick = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1;

        const catalogCard = e.target.closest("#tr-catalog-grid [data-card-id]");
        if (catalogCard) {
            if (isModifiedClick) return true;
            e.preventDefault();
            const card = tarotDeck.find((c) => Number(c.id) === Number(catalogCard.dataset.cardId));
            if (card) {
                renderActiveCard(card, "upright", { animateFlip: false });
                openTarotModal(card, "upright");
            }
            return true;
        }

        if (e.target.closest("[data-tarot-modal='current']")) {
            if (currentCard) openTarotModal(currentCard, currentOrient);
            return true;
        }

        return false;
    });

    Hub.registerModule("tarot", async () => {
        drawHistory = loadHistory();

        document.querySelectorAll("#tr-deck-fan img, #tr-card-back-img").forEach(bindBackImageSafe);

        tarotDeck = await fetchJsonSafe("./api/tarot.json", []);
        if (!tarotDeck.length) return;

        const firstEntry = drawHistory[0];
        const initialCard =
            (firstEntry && tarotDeck.find((c) => Number(c.id) === Number(firstEntry.id))) ||
            tarotDeck.find((c) => Number(c.id) === 14) ||
            tarotDeck[0];
        const initialOrient = firstEntry?.orient || "upright";

        renderActiveCard(initialCard, initialOrient, { animateFlip: false });
        renderCatalog();

        document.getElementById("tr-jump-catalog-btn")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("tr-catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        document.getElementById("tr-draw-btn")?.addEventListener("click", () => drawRandomCard(null));

        document.getElementById("tr-deck-fan")?.addEventListener("click", (e) => {
            const cardBtn = e.target.closest(".util-tarot-back");
            if (!cardBtn) return;
            drawRandomCard(Number(cardBtn.dataset.fanIdx || 4));
        });

        document.getElementById("tr-history-list")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-tr-history-id]");
            if (!btn) return;
            const picked = tarotDeck.find((c) => Number(c.id) === Number(btn.dataset.trHistoryId));
            if (picked) {
                renderActiveCard(picked, btn.dataset.trHistoryOrient || "upright", { animateFlip: true });
            }
        });

        document.querySelectorAll("[data-tr-orient]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (!currentCard) return;
                renderActiveCard(currentCard, btn.dataset.trOrient || "upright", { animateFlip: false });
            });
        });

        document.getElementById("tr-alt-orient-btn")?.addEventListener("click", (e) => {
            if (!currentCard) return;
            const target = e.currentTarget.dataset.flipTarget || "reversed";
            renderActiveCard(currentCard, target, { animateFlip: false });
        });

        document.getElementById("tr-search-input")?.addEventListener("input", renderCatalog);

        document.getElementById("tr-suit-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-tr-suit]");
            if (!btn) return;
            activeSuitFilter = btn.dataset.trSuit || "all";
            document.querySelectorAll("#tr-suit-filters [data-tr-suit]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderCatalog();
        });

        document.getElementById("tr-element-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-tr-element]");
            if (!btn) return;
            activeElemFilter = btn.dataset.trElement || "all";
            document.querySelectorAll("#tr-element-filters [data-tr-element]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderCatalog();
        });
    });
})();
