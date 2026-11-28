// assets/js/tarot-detail.js
// Đồng bộ 100% schema mới ./api/tarot.json + ảnh lá bài 800x1200 (2:3) cho tarot-detail.html
(() => {
    const TAROT_IMG_DIR = "./assets/images/tarot";
    const TAROT_IMG_EXT = "png"; // Sau này chuyển sang WebP chỉ đổi "png" -> "webp"

    const SUIT_META = {
        major: {
            label: "Bộ Ẩn Chính",
            en: "Major Arcana",
            countLabel: "Bộ Ẩn Chính (22 lá)",
            short: "Ẩn Chính",
            domain: "Bước ngoặt & Bài học lớn",
            guideTitle: "Ý Nghĩa Bộ Ẩn Chính (Major Arcana)",
            guideDesc:
                "22 lá Ẩn Chính đại diện cho những cột mốc quan trọng, bài học linh hồn và các bước ngoặt định hình hành trình trưởng thành lâu dài của mỗi người.",
        },
        wands: {
            label: "Bộ Gậy",
            en: "Suit of Wands",
            countLabel: "Bộ Gậy (14 lá)",
            short: "Bộ Gậy",
            domain: "Đam mê, Sáng tạo & Hành động",
            guideTitle: "Đặc Tính Nguyên Tố Lửa — Bộ Gậy (Wands)",
            guideDesc:
                "Bộ Gậy mang năng lượng nguyên tố Lửa, chủ quản ý chí tiên phong, cảm hứng sáng tạo, khát vọng chinh phục và tốc độ hành động trong sự nghiệp.",
        },
        swords: {
            label: "Bộ Kiếm",
            en: "Suit of Swords",
            countLabel: "Bộ Kiếm (14 lá)",
            short: "Bộ Kiếm",
            domain: "Trí tuệ, Sự thật & Quyết định",
            guideTitle: "Đặc Tính Nguyên Tố Khí — Bộ Kiếm (Swords)",
            guideDesc:
                "Bộ Kiếm mang năng lượng nguyên tố Khí, đại diện cho tư duy phân tích sắc bén, giao tiếp minh bạch, chiến lược và bản lĩnh đối diện thử thách tâm trí.",
        },
        cups: {
            label: "Bộ Cốc",
            en: "Suit of Cups",
            countLabel: "Bộ Cốc (14 lá)",
            short: "Bộ Cốc",
            domain: "Cảm xúc, Nhân duyên & Trực giác",
            guideTitle: "Đặc Tính Nguyên Tố Nước — Bộ Cốc (Cups)",
            guideDesc:
                "Bộ Cốc mang năng lượng nguyên tố Nước, phản ánh đời sống cảm xúc, tình yêu, sự thấu cảm, các mối nhân duyên và chiều sâu nghệ thuật.",
        },
        pentacles: {
            label: "Bộ Tiền",
            en: "Suit of Pentacles",
            countLabel: "Bộ Tiền (14 lá)",
            short: "Bộ Tiền",
            domain: "Tài chính, Vật chất & Bền vững",
            guideTitle: "Đặc Tính Nguyên Tố Đất — Bộ Tiền (Pentacles)",
            guideDesc:
                "Bộ Tiền mang năng lượng nguyên tố Đất, gắn liền với tài sản, công việc thực tiễn, kỹ năng chuyên môn, sức khỏe và sự thịnh vượng bền vững.",
        },
    };

    const ELEMENT_META = {
        fire: { label: "Nguyên tố Lửa (Fire)", icon: "./assets/icons/fire.svg" },
        water: { label: "Nguyên tố Nước (Water)", icon: "./assets/icons/water.svg" },
        air: { label: "Nguyên tố Khí (Air)", icon: "./assets/icons/sparkle.svg" },
        earth: { label: "Nguyên tố Đất (Earth)", icon: "./assets/icons/earth.svg" },
    };

    const pad = (n) => String(n).padStart(2, "0");

    let tarotDeck = [];
    let activeCard = null;
    let activeOrient = "upright";
    let activeSuitFilter = "all";
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

    const getSuitKey = (card) => (card.arcana === "major" || !card.suit ? "major" : card.suit);
    const getBackImageUrl = () => `${TAROT_IMG_DIR}/back.${TAROT_IMG_EXT}`;
    const getCardImageUrl = (card) => `${TAROT_IMG_DIR}/${getSuitKey(card)}/${card.slug}.${TAROT_IMG_EXT}`;
    const getDetailHref = (card, orient = "upright") =>
        `./tarot-detail.html?slug=${encodeURIComponent(card.slug)}&orient=${encodeURIComponent(orient)}`;

    const openLightbox = (imgSrc, captionText, orient = "upright") => {
        const lightbox = document.getElementById("detail-lightbox");
        const imgEl = document.getElementById("detail-lightbox-img");
        const capEl = document.getElementById("detail-lightbox-caption");
        if (!lightbox || !imgEl) return;

        lastFocusedBeforeLightbox = document.activeElement;
        imgEl.src = imgSrc;
        imgEl.alt = captionText || "Lá bài Tarot";
        imgEl.dataset.orientation = orient;
        imgEl.style.transform = orient === "reversed" ? "rotate(180deg)" : "";
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

    const renderRelatedCards = (card) => {
        const gridEl = document.getElementById("trd-related-grid");
        if (!gridEl) return;

        const suitKey = getSuitKey(card);
        const sameSuit = tarotDeck.filter((c) => getSuitKey(c) === suitKey);
        const pos = sameSuit.findIndex((c) => Number(c.id) === Number(card.id));

        const picked = [];
        for (const offset of [-2, -1, 1, 2]) {
            if (sameSuit.length <= 1) break;
            const neighbor = sameSuit[(pos + offset + sameSuit.length) % sameSuit.length];
            if (neighbor && neighbor.id !== card.id && !picked.some((p) => p.id === neighbor.id)) {
                picked.push(neighbor);
            }
        }

        const backUrl = getBackImageUrl();
        const suitInfo = SUIT_META[suitKey] || SUIT_META.major;

        gridEl.innerHTML = picked
            .slice(0, 4)
            .map((item) => {
                const titleVi = item.name?.vi || "";
                const titleEn = item.name?.en || "";
                return `
                    <a
                        href="${getDetailHref(item, "upright")}"
                        class="util-tr-card"
                        title="${escapeHtml(`${item.label}. ${titleVi} (${titleEn})`)}"
                    >
                        <div class="util-tr-card__thumb">
                            <img
                                src="${getCardImageUrl(item)}"
                                alt="${escapeHtml(`Lá bài Tarot ${item.label} - ${titleVi} (${titleEn})`)}"
                                width="800"
                                height="1200"
                                loading="lazy"
                                decoding="async"
                                onerror="this.onerror=null;this.src='${backUrl}';"
                            />
                        </div>
                        <div class="util-tr-card__body">
                            <div class="util-tr-card__meta">
                                <span class="util-tr-card__num">#${pad(item.id)}</span>
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

    const renderSidebarList = () => {
        const listEl = document.getElementById("trd-sidebar-list");
        const countEl = document.getElementById("trd-sidebar-count");
        const searchVal = (document.getElementById("trd-sidebar-search")?.value || "").trim().toLowerCase();
        if (!listEl) return;

        const filtered = tarotDeck.filter((c) => {
            const suitKey = getSuitKey(c);
            if (activeSuitFilter !== "all" && suitKey !== activeSuitFilter) return false;
            if (searchVal) {
                const haystack = [
                    pad(c.id),
                    String(c.id),
                    c.label,
                    c.name?.vi,
                    c.name?.en,
                    SUIT_META[suitKey]?.label,
                    ...(c.upright?.keywords || []),
                    ...(c.reversed?.keywords || []),
                ]
                    .join(" ")
                    .toLowerCase();
                if (!haystack.includes(searchVal)) return false;
            }
            return true;
        });

        if (countEl) countEl.textContent = `${filtered.length} lá`;

        listEl.innerHTML = filtered
            .map((c) => {
                const suitKey = getSuitKey(c);
                const suitInfo = SUIT_META[suitKey] || SUIT_META.major;
                const isCurrent = activeCard && Number(c.id) === Number(activeCard.id);
                const titleVi = c.name?.vi || "";
                const titleEn = c.name?.en || "";

                return `
                    <a
                        href="${getDetailHref(c, "upright")}"
                        class="detail-sidebar__item ${isCurrent ? "is-current" : ""}"
                        ${isCurrent ? 'aria-current="page"' : ""}
                        title="#${pad(c.id)} ${escapeHtml(titleVi)} (${escapeHtml(titleEn)})"
                    >
                        <div class="detail-sidebar__date-box">
                            <small>#${pad(c.id)}</small>
                            <strong>${escapeHtml(c.label)}</strong>
                        </div>
                        <div class="detail-sidebar__item-info">
                            <strong class="detail-sidebar__item-name">${escapeHtml(titleVi)}</strong>
                            <span class="detail-sidebar__item-occasion">
                                ${escapeHtml(titleEn)} • ${suitInfo.short}
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

    const renderOrientationState = () => {
        if (!activeCard) return;
        const isRev = activeOrient === "reversed";
        const side = activeCard[activeOrient] || activeCard.upright || {};
        const keywordsStr = Array.isArray(side.keywords) ? side.keywords.join(" • ") : "";

        const posterEl = document.getElementById("trd-poster-figure");
        if (posterEl) {
            posterEl.dataset.orientation = activeOrient;
            posterEl.setAttribute(
                "aria-label",
                `Phóng to lá bài Tarot ${activeCard.label} - ${activeCard.name?.vi} (${isRev ? "Chiều Ngược" : "Chiều Xuôi"})`,
            );
        }

        const orientBadge = document.getElementById("trd-orient-badge");
        if (orientBadge) {
            orientBadge.dataset.orientation = activeOrient;
            orientBadge.textContent = isRev ? "Đang xem: Lá bài Ngược (Reversed)" : "Đang xem: Lá bài Xuôi (Upright)";
        }

        setText("trd-hero-message", side.message || side.summary || "");
        setText("trd-hero-keywords", keywordsStr ? `Từ khóa: ${keywordsStr}` : "");
        setText("trd-stat-orient", isRev ? "Chiều Ngược" : "Chiều Xuôi");
        setText("trd-body-career", side.aspects?.career || activeCard.upright?.aspects?.career || "");

        document.querySelectorAll("[data-set-orient]").forEach((btn) => {
            const isMatch = btn.dataset.setOrient === activeOrient;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(isMatch));
        });

        document.getElementById("trd-box-upright")?.classList.toggle("is-active-orient", !isRev);
        document.getElementById("trd-box-reversed")?.classList.toggle("is-active-orient", isRev);

        // Đồng bộ ?orient= lên URL để bấm "Chia sẻ" giữ đúng chiều đang xem
        const url = new URL(window.location.href);
        url.searchParams.set("slug", activeCard.slug);
        url.searchParams.set("orient", activeOrient);
        window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    };

    const renderActiveCard = (card, orient = "upright") => {
        if (!card) return;
        activeCard = card;
        activeOrient = orient === "reversed" ? "reversed" : "upright";

        const suitKey = getSuitKey(card);
        const suitInfo = SUIT_META[suitKey] || SUIT_META.major;
        const elemInfo = ELEMENT_META[card.element] || ELEMENT_META.fire;
        const titleVi = card.name?.vi || "";
        const titleEn = card.name?.en || "";
        const backUrl = getBackImageUrl();

        document.title = `${card.label}. ${titleVi} (${titleEn}) - Chi Tiết Tarot`;

        // Prev / Next
        const idx = tarotDeck.findIndex((c) => Number(c.id) === Number(card.id));
        const prevCard = tarotDeck[(idx - 1 + tarotDeck.length) % tarotDeck.length];
        const nextCard = tarotDeck[(idx + 1) % tarotDeck.length];

        if (prevCard) {
            const prevBtn = document.getElementById("trd-prev-btn");
            if (prevBtn) {
                prevBtn.href = getDetailHref(prevCard, "upright");
                prevBtn.title = `Lá trước: ${prevCard.label}. ${prevCard.name?.vi}`;
            }
        }
        if (nextCard) {
            const nextBtn = document.getElementById("trd-next-btn");
            if (nextBtn) {
                nextBtn.href = getDetailHref(nextCard, "upright");
                nextBtn.title = `Lá tiếp: ${nextCard.label}. ${nextCard.name?.vi}`;
            }
        }

        setText("trd-suit-badge", suitInfo.label);
        setText("trd-id-badge", `Lá #${pad(card.id)} / 78`);
        setText("trd-suit-eyebrow", `${suitInfo.label} • ${suitInfo.en}`);
        setText("trd-main-title", `${card.label}. ${titleVi} (${titleEn})`);

        const heroImg = document.getElementById("trd-hero-img");
        if (heroImg) {
            heroImg.onerror = () => {
                heroImg.onerror = null;
                heroImg.src = backUrl;
            };
            heroImg.src = getCardImageUrl(card);
            heroImg.alt = `Lá bài Tarot ${card.label} - ${titleVi} (${titleEn})`;
            heroImg.width = 800;
            heroImg.height = 1200;
        }

        // 4 thẻ thông số
        setText("trd-stat-suit", suitInfo.en);
        setText("trd-stat-suit-vn", suitInfo.countLabel);
        const elemIconEl = document.getElementById("trd-stat-elem-icon");
        if (elemIconEl) elemIconEl.src = elemInfo.icon;
        setText("trd-stat-element", elemInfo.label);
        setText("trd-stat-domain", suitInfo.domain);
        setText("trd-stat-roman", `${card.label} • #${pad(card.id)}`);
        setText("trd-stat-en", titleEn);

        // Đối chiếu 2 chiều Xuôi & Ngược
        const up = card.upright || {};
        const rev = card.reversed || {};
        setText("trd-up-keywords", Array.isArray(up.keywords) ? up.keywords.join(", ") : "");
        setText("trd-up-msg", `${up.summary || ""} ${up.message || ""}`.trim());
        setText("trd-rev-keywords", Array.isArray(rev.keywords) ? rev.keywords.join(", ") : "");
        setText("trd-rev-msg", `${rev.summary || ""} ${rev.message || ""}`.trim());

        setText("trd-suit-guide-title", suitInfo.guideTitle);
        setText("trd-suit-guide-desc", suitInfo.guideDesc);

        renderOrientationState();
        renderRelatedCards(card);
        renderSidebarList();
    };

    const initTarotDetailPage = async () => {
        const res = await fetch("./api/tarot.json")
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []);

        tarotDeck = Array.isArray(res) ? res : [];
        if (!tarotDeck.length) return;

        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get("slug") || "";
        const idParam = params.has("id") ? Number(params.get("id")) : NaN;
        const orientParam = params.get("orient") === "reversed" ? "reversed" : "upright";

        const targetCard =
            (!Number.isNaN(idParam) && tarotDeck.find((c) => Number(c.id) === idParam)) ||
            tarotDeck.find((c) => c.slug === slugParam) ||
            tarotDeck.find((c) => Number(c.id) === 14) ||
            tarotDeck[0];

        renderActiveCard(targetCard, orientParam);

        // Công tắc gạt Chiều Xuôi / Ngược
        document.querySelectorAll("[data-set-orient]").forEach((btn) => {
            btn.addEventListener("click", () => {
                activeOrient = btn.dataset.setOrient === "reversed" ? "reversed" : "upright";
                renderOrientationState();
            });
        });

        // Lightbox (Click + bàn phím Enter/Space)
        const posterEl = document.getElementById("trd-poster-figure");
        const openPosterLightbox = () => {
            if (!activeCard) return;
            const imgSrc = document.getElementById("trd-hero-img")?.src || getCardImageUrl(activeCard);
            const caption = `${activeCard.label}. ${activeCard.name?.vi} (${activeCard.name?.en}) — ${activeOrient === "reversed" ? "Chiều Ngược" : "Chiều Xuôi"}`;
            openLightbox(imgSrc, caption, activeOrient);
        };

        posterEl?.addEventListener("click", openPosterLightbox);
        posterEl?.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            openPosterLightbox();
        });

        // Sidebar lọc 5 Bộ & tìm kiếm
        document.getElementById("trd-sidebar-search")?.addEventListener("input", renderSidebarList);

        document.querySelectorAll("#trd-sidebar-filters [data-trd-filter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                activeSuitFilter = btn.dataset.trdFilter || "all";
                document.querySelectorAll("#trd-sidebar-filters [data-trd-filter]").forEach((b) => {
                    const isMatch = b === btn;
                    b.classList.toggle("is-active", isMatch);
                    b.setAttribute("aria-pressed", String(isMatch));
                });
                renderSidebarList();
            });
        });

        // Nút Chia sẻ
        const shareBtn = document.getElementById("trd-share-btn");
        const shareLabel = document.getElementById("trd-share-label");
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

    document.addEventListener("DOMContentLoaded", initTarotDetailPage);
})();
