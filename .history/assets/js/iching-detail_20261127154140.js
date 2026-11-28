// assets/js/iching-detail.js
// Đồng bộ 100% schema mới ./api/iching.json & ./api/iching-cards.json + ảnh thẻ 800x1200 (2:3)
(() => {
    const CARD_IMG_EXT = "png"; // Sau này chuyển sang WebP chỉ đổi "png" -> "webp"
    const ICHING_ICON_DIR = "./assets/icons/iching";

    const ELEMENT_LABEL_VN = {
        metal: "Hành Kim",
        wood: "Hành Mộc",
        water: "Hành Thủy",
        fire: "Hành Hỏa",
        earth: "Hành Thổ",
    };

    const pad = (n) => String(n).padStart(2, "0");

    let mergedHexagrams = [];
    let activeHex = null;
    let activeFilter = "all";
    let lastFocusedBeforeLightbox = null;

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const escapeHtml = (str) =>
        String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const resolveCardImageUrl = (basePath) => {
        if (!basePath) return "";
        const normalized = String(basePath).trim().startsWith("/")
            ? `.${String(basePath).trim()}`
            : String(basePath).trim();
        if (/\.(png|webp|jpe?g|svg)$/i.test(normalized)) return normalized;
        return `${normalized}.${CARD_IMG_EXT}`;
    };

    const getFallbackSvgUrl = (hex) => `${ICHING_ICON_DIR}/${hex.iconSlug}.svg`;
    const getDetailHref = (hex) => `./iching-detail.html?slug=${encodeURIComponent(hex.cardSlug)}&num=${hex.id}`;

    const mergeIchingDatasets = (baseList, cardList) => {
        const cardById = new Map((Array.isArray(cardList) ? cardList : []).map((c) => [Number(c.id), c]));

        return (Array.isArray(baseList) ? baseList : []).map((base) => {
            const id = Number(base.id || base.number);
            const card = cardById.get(id) || null;

            const upper = card?.trigrams?.upper || base.trigrams?.upper || {};
            const lower = card?.trigrams?.lower || base.trigrams?.lower || {};
            const element = card?.element || base.element || "metal";
            const statusCode = card?.status?.code || base.fortune?.level || "binh_hoa";
            const statusLabel = card?.status?.label || base.fortune?.label || "Bình Hòa";
            const hasCardArt = Boolean(card?.artwork?.image_base);

            const cardImgUrl = hasCardArt
                ? resolveCardImageUrl(card.artwork.image_base)
                : `${ICHING_ICON_DIR}/${base.slug}.svg`;

            return {
                id,
                numberStr: pad(id),
                iconSlug: base.slug || pad(id),
                cardSlug: card?.slug || base.slug || pad(id),
                unicode: base.unicode || "",
                element,
                elementLabel: ELEMENT_LABEL_VN[element] || "Ngũ Hành",
                shortName: base.name?.short || card?.name || `Quẻ ${id}`,
                fullName: card?.name || base.name?.full || `Quẻ ${id}`,
                alias: card?.alias || base.name?.alias || "",
                hanziShort: card?.chinese?.short || base.name?.hanzi || "",
                hanziFull: card?.chinese?.full || card?.chinese?.short || base.name?.hanzi || "",
                lines: Array.isArray(base.lines)
                    ? base.lines
                    : String(card?.line_code || "111111")
                          .split("")
                          .map(Number),
                lineCode: card?.line_code || base.code || "111111",
                upper: {
                    name: upper.name || "",
                    nature: upper.nature || "",
                    symbol: upper.symbol || "",
                    code: upper.code || "",
                },
                lower: {
                    name: lower.name || "",
                    nature: lower.nature || "",
                    symbol: lower.symbol || "",
                    code: lower.code || "",
                },
                statusCode,
                statusLabel,
                hexagramImages: Array.isArray(card?.hexagram_images) ? card.hexagram_images : [],
                keywords: Array.isArray(card?.keywords) && card.keywords.length ? card.keywords : base.keywords || [],
                coupletOpening: card?.couplet?.opening || "",
                coupletClosing: card?.couplet?.closing || "",
                judgment: base.meaning?.judgment || "",
                symbolism: base.meaning?.symbolism || "",
                advice: card?.advice || base.meaning?.advice || "",
                hasCardArt,
                cardImgUrl,
                cardAlt:
                    card?.artwork?.alt || `Thẻ bài Kinh Dịch Quẻ ${pad(id)}: ${card?.name || base.name?.full || ""}`,
                focalObject: card?.artwork?.focal_object || "",
            };
        });
    };

    const openLightbox = (imgSrc, captionText) => {
        const lightbox = document.getElementById("detail-lightbox");
        const imgEl = document.getElementById("detail-lightbox-img");
        const capEl = document.getElementById("detail-lightbox-caption");
        if (!lightbox || !imgEl) return;

        lastFocusedBeforeLightbox = document.activeElement;
        imgEl.src = imgSrc;
        imgEl.alt = captionText || "Thẻ bài Kinh Dịch";
        if (capEl) capEl.textContent = captionText || "";

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("detail-lightbox-close")?.focus();
    };

    const closeLightbox = () => {
        const lightbox = document.getElementById("detail-lightbox");
        if (!lightbox || lightbox.hidden) return;
        lightbox.hidden = true;
        document.body.style.overflow = "";
        if (lastFocusedBeforeLightbox && typeof lastFocusedBeforeLightbox.focus === "function") {
            lastFocusedBeforeLightbox.focus();
            lastFocusedBeforeLightbox = null;
        }
    };

    const renderHexLines = (lines) => {
        const stackEl = document.getElementById("icd-lines-stack");
        if (!stackEl || !Array.isArray(lines)) return;

        stackEl.innerHTML = [...lines]
            .reverse()
            .map((bit, idx) =>
                bit === 1
                    ? `<div class="util-hex-line util-hex-line--yang" style="animation-delay:${idx * 0.04}s"><span></span></div>`
                    : `<div class="util-hex-line util-hex-line--yin" style="animation-delay:${idx * 0.04}s"><span></span><span></span></div>`,
            )
            .join("");
    };

    const renderRelatedHexagrams = (hex) => {
        const gridEl = document.getElementById("icd-related-grid");
        if (!gridEl || !Array.isArray(hex.lines) || hex.lines.length !== 6) return;

        const findByLines = (arr) => mergedHexagrams.find((h) => h.lines.join("") === arr.join(""));

        const hoLines = [hex.lines[1], hex.lines[2], hex.lines[3], hex.lines[2], hex.lines[3], hex.lines[4]];
        const thacLines = hex.lines.map((b) => (b ? 0 : 1));
        const tongLines = [...hex.lines].reverse();

        const variants = [
            { role: "Hỗ Quái (Diễn biến ẩn)", hex: findByLines(hoLines) },
            { role: "Thác Quái (Mặt đối lập)", hex: findByLines(thacLines) },
            { role: "Tống Quái (Góc nhìn đảo ngược)", hex: findByLines(tongLines) },
        ].filter((v) => Boolean(v.hex));

        gridEl.innerHTML = variants
            .map(({ role, hex: target }) => {
                const fallbackSvg = getFallbackSvgUrl(target);
                return `
                    <a
                        href="${getDetailHref(target)}"
                        class="util-hex-card"
                        data-element="${target.element}"
                        data-status-code="${target.statusCode}"
                        title="Xem chi tiết ${role}: Quẻ #${target.numberStr} ${escapeHtml(target.fullName)}"
                    >
                        <div class="util-hex-card__thumb ${target.hasCardArt ? "" : "is-fallback-svg"}">
                            <img
                                src="${target.cardImgUrl}"
                                alt="${escapeHtml(target.cardAlt)}"
                                width="800"
                                height="1200"
                                loading="lazy"
                                decoding="async"
                                onerror="this.onerror=null;this.src='${fallbackSvg}';this.closest('.util-hex-card__thumb')?.classList.add('is-fallback-svg');"
                            />
                        </div>
                        <div class="util-hex-card__body">
                            <div class="util-tr-card__meta">
                                <span class="util-tr-card__num">${role}</span>
                                <span class="util-hex-card__status-tag" data-status-code="${target.statusCode}">
                                    ${escapeHtml(target.statusLabel)}
                                </span>
                            </div>
                            <div class="util-hex-card__title-row">
                                <strong class="util-hex-card__title">#${target.numberStr} ${escapeHtml(target.fullName)}</strong>
                                ${target.hanziShort ? `<span class="util-hex-card__hanzi" lang="zh-Hant">${escapeHtml(target.hanziShort)}</span>` : ""}
                            </div>
                            <span class="util-hex-card__sub">${escapeHtml(target.advice)}</span>
                        </div>
                    </a>
                `;
            })
            .join("");
    };

    const matchesStatusFilter = (hex, filterVal) => {
        if (!filterVal || filterVal === "all") return true;
        if (hex.statusCode === filterVal || hex.statusLabel === filterVal) return true;
        // Tương thích ngược với các nút lọc cũ trên iching-detail.html nếu chưa đổi sang mã statusCode
        if (filterVal === "Cát Hanh") return hex.statusCode === "cat";
        if (filterVal === "Thận Trọng") return hex.statusCode === "tieu_hung" || hex.statusCode === "hung";
        return false;
    };

    const renderSidebarList = () => {
        const listEl = document.getElementById("icd-sidebar-list");
        const countEl = document.getElementById("icd-sidebar-count");
        const searchVal = (document.getElementById("icd-sidebar-search")?.value || "").trim().toLowerCase();
        if (!listEl) return;

        const filtered = mergedHexagrams.filter((h) => {
            if (!matchesStatusFilter(h, activeFilter)) return false;
            if (searchVal) {
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
                    h.keywords.join(" "),
                ]
                    .join(" ")
                    .toLowerCase();
                if (!haystack.includes(searchVal)) return false;
            }
            return true;
        });

        if (countEl) countEl.textContent = `${filtered.length} quẻ`;

        listEl.innerHTML = filtered
            .map((h) => {
                const isCurrent = activeHex && h.id === activeHex.id;
                return `
                    <a
                        href="${getDetailHref(h)}"
                        class="detail-sidebar__item ${isCurrent ? "is-current" : ""}"
                        ${isCurrent ? 'aria-current="page"' : ""}
                        title="Quẻ #${h.numberStr}: ${escapeHtml(h.fullName)}"
                    >
                        <div class="detail-sidebar__date-box">
                            <small>Quẻ</small>
                            <strong>${h.numberStr}</strong>
                        </div>
                        <div class="detail-sidebar__item-info">
                            <strong class="detail-sidebar__item-name">
                                ${escapeHtml(h.fullName)}
                                ${h.hanziShort ? `<span lang="zh-Hant"> (${escapeHtml(h.hanziShort)})</span>` : ""}
                            </strong>
                            <span class="detail-sidebar__item-occasion">
                                ${escapeHtml(h.statusLabel)} • ${escapeHtml(h.elementLabel)}
                            </span>
                        </div>
                    </a>
                `;
            })
            .join("");

        const activeItem = listEl.querySelector(".detail-sidebar__item.is-current");
        if (activeItem) {
            const topPos =
                activeItem.offsetTop - listEl.offsetTop - listEl.clientHeight / 2 + activeItem.clientHeight / 2;
            listEl.scrollTo({ top: Math.max(0, topPos), behavior: "smooth" });
        }
    };

    const renderActiveHexagram = (hex) => {
        if (!hex) return;
        activeHex = hex;

        const fallbackSvg = getFallbackSvgUrl(hex);

        document.title = `Quẻ ${hex.numberStr}: ${hex.fullName} - Lịch Phong Thủy`;

        // Prev / Next
        const idx = mergedHexagrams.findIndex((h) => h.id === hex.id);
        const prevHex = mergedHexagrams[(idx - 1 + mergedHexagrams.length) % mergedHexagrams.length];
        const nextHex = mergedHexagrams[(idx + 1) % mergedHexagrams.length];

        if (prevHex) {
            const prevBtn = document.getElementById("icd-prev-btn");
            if (prevBtn) {
                prevBtn.href = getDetailHref(prevHex);
                prevBtn.title = `Quẻ trước: #${prevHex.numberStr} ${prevHex.fullName}`;
            }
        }
        if (nextHex) {
            const nextBtn = document.getElementById("icd-next-btn");
            if (nextBtn) {
                nextBtn.href = getDetailHref(nextHex);
                nextBtn.title = `Quẻ tiếp: #${nextHex.numberStr} ${nextHex.fullName}`;
            }
        }

        setText("icd-num-badge", `Quẻ số ${hex.numberStr}`);
        const fortuneBadge = document.getElementById("icd-fortune-badge");
        if (fortuneBadge) {
            fortuneBadge.textContent = hex.statusLabel;
            fortuneBadge.dataset.statusCode = hex.statusCode;
        }

        // Thẻ bài 2:3 (800x1200) & data-* chuẩn tiếng Anh
        const cardShell = document.getElementById("icd-card-shell");
        const cardFigure = document.getElementById("icd-card-figure");
        const heroImg = document.getElementById("icd-hero-svg");
        const rawLink = document.getElementById("icd-raw-art-link");
        const hanziEl = document.getElementById("icd-card-hanzi");
        const focalEl = document.getElementById("icd-card-focal");

        if (cardShell) {
            cardShell.dataset.hexId = hex.numberStr;
            cardShell.dataset.hexSlug = hex.cardSlug;
            cardShell.dataset.element = hex.element;
            cardShell.dataset.fortuneCode = hex.statusCode;
            cardShell.dataset.maHao = hex.lineCode;
            cardShell.classList.toggle("is-fallback-art", !hex.hasCardArt);
        }

        setText("icd-card-num", `#${hex.numberStr}`);
        const cardStatusEl = document.getElementById("icd-card-status");
        if (cardStatusEl) {
            cardStatusEl.textContent = hex.statusLabel;
            cardStatusEl.dataset.statusCode = hex.statusCode;
        }
        setText("icd-card-title", hex.fullName);

        if (hanziEl) {
            if (hex.hanziFull) {
                hanziEl.textContent = hex.hanziFull;
                hanziEl.title = `Hán tự đầy đủ: ${hex.hanziFull} (${hex.fullName})`;
                hanziEl.hidden = false;
            } else {
                hanziEl.hidden = true;
            }
        }

        if (focalEl) {
            if (hex.focalObject) {
                focalEl.textContent = hex.focalObject;
                focalEl.hidden = false;
            } else {
                focalEl.hidden = true;
            }
        }

        const lightboxCaption = hex.focalObject
            ? `Quẻ ${hex.numberStr}: ${hex.fullName}${hex.hanziFull ? ` (${hex.hanziFull})` : ""} — ${hex.focalObject}`
            : `Quẻ ${hex.numberStr}: ${hex.fullName}`;

        if (heroImg) {
            heroImg.onerror = () => {
                heroImg.onerror = null;
                heroImg.src = fallbackSvg;
                cardShell?.classList.add("is-fallback-art");
            };
            heroImg.src = hex.cardImgUrl;
            heroImg.alt = hex.cardAlt;
            heroImg.width = 800;
            heroImg.height = 1200;
        }

        if (cardFigure) {
            cardFigure.dataset.fullSrc = hex.cardImgUrl;
            cardFigure.dataset.caption = lightboxCaption;
            cardFigure.setAttribute("aria-label", `Phóng to thẻ bài ${lightboxCaption}`);
            cardFigure.title = `Bấm hoặc nhấn Enter để phóng to — ${lightboxCaption}`;
        }

        if (rawLink) {
            rawLink.href = hex.cardImgUrl;
            const rawLabel = rawLink.querySelector("span:first-child");
            if (rawLabel) rawLabel.textContent = hex.hasCardArt ? "Mở ảnh thẻ bài gốc" : "Mở đồ hình SVG gốc";
        }

        const keywordsMeta = document.getElementById("icd-schema-keywords");
        if (keywordsMeta) keywordsMeta.content = hex.keywords.join(", ");

        // Cột phải Hero
        setText(
            "icd-trigrams-eyebrow",
            `Ngoại quái: ${hex.upper.symbol} ${hex.upper.name} (${hex.upper.nature}) • Nội quái: ${hex.lower.symbol} ${hex.lower.name} (${hex.lower.nature})`,
        );

        const mainTitleEl = document.getElementById("icd-main-title");
        if (mainTitleEl) {
            mainTitleEl.innerHTML = hex.hanziShort
                ? `Quẻ ${hex.numberStr}: ${escapeHtml(hex.fullName)} <small lang="zh-Hant">(${escapeHtml(hex.hanziShort)})</small>`
                : `Quẻ ${hex.numberStr}: ${escapeHtml(hex.fullName)}`;
        }
        setText(
            "icd-full-name",
            `${hex.alias ? `${hex.alias} • ` : ""}${hex.elementLabel} • Mã hào ${hex.lineCode}`,
        );

        const metaBox = document.getElementById("icd-card-meta-box");
        const omenListEl = document.getElementById("icd-omen-list");
        const kwListEl = document.getElementById("icd-keywords-list");
        if (metaBox && omenListEl && kwListEl) {
            if (hex.hexagramImages.length || hex.keywords.length) {
                omenListEl.innerHTML = hex.hexagramImages
                    .map((o) => `<span class="iching-card-meta__omen-pill">✦ ${escapeHtml(o)}</span>`)
                    .join("");
                kwListEl.innerHTML = hex.keywords
                    .map((k) => `<li class="iching-card-meta__keyword">#${escapeHtml(k)}</li>`)
                    .join("");
                metaBox.hidden = false;
            } else {
                metaBox.hidden = true;
            }
        }

        // Accordion câu đối 2 vế (couplet.opening & couplet.closing)
        const pairWrapper = document.getElementById("icd-pair-wrapper");
        const pairBtn = document.getElementById("icd-pair-toggle-btn");
        const pairPanel = document.getElementById("icd-card-pair-panel");
        if (pairWrapper && pairBtn && pairPanel) {
            if (hex.coupletOpening || hex.coupletClosing) {
                setText("icd-pair-left", hex.coupletOpening);
                setText("icd-pair-right", hex.coupletClosing);
                pairWrapper.hidden = false;
                pairBtn.setAttribute("aria-expanded", "false");
                pairPanel.hidden = true;
            } else {
                pairWrapper.hidden = true;
            }
        }

        setText("icd-hero-quote", hex.judgment);
        setText("icd-body-judgment", hex.judgment);
        setText("icd-body-image", hex.symbolism);
        setText("icd-body-advice", hex.advice);

        // 4 thẻ thông số cấu trúc
        const yangCount = hex.lines.filter((b) => b === 1).length;
        const yinCount = 6 - yangCount;
        setText("icd-stat-num", `Quẻ #${hex.numberStr} / 64`);
        setText("icd-stat-short", `${hex.elementLabel} • Quẻ ${hex.shortName}`);
        setText("icd-stat-fortune", hex.statusLabel);
        setText("icd-stat-ratio", `${yangCount} Dương • ${yinCount} Âm`);

        setText("icd-stat-lower", `${hex.lower.symbol} ${hex.lower.name} (${hex.lower.nature})`);
        setText(
            "icd-stat-lower-sub",
            hex.lower.code ? `Mã hào: ${hex.lower.code} • Hào 1 – 2 – 3` : "Hào 1 – 2 – 3 (Nền tảng)",
        );
        setText("icd-stat-upper", `${hex.upper.symbol} ${hex.upper.name} (${hex.upper.nature})`);
        setText(
            "icd-stat-upper-sub",
            hex.upper.code ? `Mã hào: ${hex.upper.code} • Hào 4 – 5 – 6` : "Hào 4 – 5 – 6 (Biểu hiện)",
        );

        renderHexLines(hex.lines);
        renderRelatedHexagrams(hex);
        renderSidebarList();
    };

    const initIchingDetailPage = async () => {
        const [baseRes, cardRes] = await Promise.all([
            fetch("./api/iching.json")
                .then((r) => (r.ok ? r.json() : []))
                .catch(() => []),
            fetch("./api/iching-cards.json")
                .then((r) => (r.ok ? r.json() : []))
                .catch(() => []),
        ]);

        mergedHexagrams = mergeIchingDatasets(baseRes, cardRes);
        if (!mergedHexagrams.length) return;

        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get("slug") || "";
        const numParam = Number(params.get("num")) || 0;

        const targetHex =
            (numParam && mergedHexagrams.find((h) => h.id === numParam)) ||
            mergedHexagrams.find((h) => h.cardSlug === slugParam || h.iconSlug === slugParam) ||
            mergedHexagrams.find((h) => h.id === 14) ||
            mergedHexagrams[0];

        renderActiveHexagram(targetHex);

        const mainEl = document.getElementById("main");
        mainEl?.addEventListener("click", (e) => {
            const trigger = e.target.closest("[data-card-action]");
            if (!trigger) return;

            const action = trigger.dataset.cardAction;
            if (action === "zoom") {
                const imgSrc = document.getElementById("icd-hero-svg")?.src || trigger.dataset.fullSrc;
                openLightbox(imgSrc, trigger.dataset.caption);
            } else if (action === "toggle-pair") {
                const panel = document.getElementById(trigger.getAttribute("aria-controls"));
                if (!panel) return;
                const willExpand = trigger.getAttribute("aria-expanded") !== "true";
                trigger.setAttribute("aria-expanded", String(willExpand));
                panel.hidden = !willExpand;
                if (willExpand) panel.focus();
            }
        });

        mainEl?.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const poster = e.target.closest('#icd-card-figure[data-card-action="zoom"]');
            if (!poster) return;
            e.preventDefault();
            poster.click();
        });

        document.getElementById("icd-sidebar-search")?.addEventListener("input", renderSidebarList);

        document.querySelectorAll("#icd-sidebar-filters [data-icd-filter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                activeFilter = btn.dataset.icdFilter || "all";
                document.querySelectorAll("#icd-sidebar-filters [data-icd-filter]").forEach((b) => {
                    const isMatch = b === btn;
                    b.classList.toggle("is-active", isMatch);
                    b.setAttribute("aria-pressed", String(isMatch));
                });
                renderSidebarList();
            });
        });

        const shareBtn = document.getElementById("icd-share-btn");
        const shareLabel = document.getElementById("icd-share-label");
        shareBtn?.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                if (shareLabel) {
                    shareLabel.textContent = "Đã sao chép!";
                    setTimeout(() => {
                        shareLabel.textContent = "Chia sẻ";
                    }, 2000);
                }
            } catch (err) {
                // Trình duyệt không hỗ trợ clipboard
            }
        });

        document.getElementById("detail-lightbox-close")?.addEventListener("click", closeLightbox);
        document.getElementById("detail-lightbox-backdrop")?.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    };

    document.addEventListener("DOMContentLoaded", initIchingDetailPage);
})();