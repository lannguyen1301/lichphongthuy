// assets/js/tarot-detail.js
// Trang chi tiết 78 Lá Bài Tarot: Đọc ./api/tarot.json, công tắc Chiều Xuôi / Chiều Ngược 180°,
// phân tích Nguyên tố theo Bộ, Lightbox phóng to & Sidebar Sticky 78 lá
(() => {
    const TAROT_IMG_DIR = "./assets/images/tarot";
    const TAROT_IMG_EXT = "png";
    const pad = (n) => String(n).padStart(2, "0");

    const SUIT_META = {
        major: {
            en: "Major Arcana",
            vn: "Bộ Ẩn Chính (22 lá)",
            short: "Ẩn Chính",
            element: "Tinh thần & Chu kỳ Lớn",
            domain: "Bước ngoặt cuộc đời & Sứ mệnh",
            icon: "./assets/icons/sparkle.svg",
            guide: "22 lá Bộ Ẩn Chính (Major Arcana) đại diện cho những bài học cốt lõi, bước ngoặt chiến lược và hành trình trưởng thành sâu sắc về nhận thức. Khi lá Ẩn Chính xuất hiện, thông điệp thường mang tầm ảnh hưởng dài hạn thay vì chỉ là chuyện nhất thời.",
        },
        wands: {
            en: "Suit of Wands",
            vn: "Bộ Gậy (14 lá)",
            short: "Bộ Gậy",
            element: "Nguyên tố Lửa (Hỏa)",
            domain: "Đam mê, Sáng tạo & Hành động",
            icon: "./assets/icons/fire.svg",
            guide: "Bộ Gậy gắn liền với nguyên tố Lửa — đại diện cho ý chí tiên phong, cảm hứng sáng tạo, động lực hành động và bản lĩnh dấn thân. Các lá Bộ Gậy khuyến khích sự chủ động, tốc độ và dám mở đường mới.",
        },
        swords: {
            en: "Suit of Swords",
            vn: "Bộ Kiếm (14 lá)",
            short: "Bộ Kiếm",
            element: "Nguyên tố Khí",
            domain: "Trí tuệ, Logic & Quyết định",
            icon: "./assets/icons/metal.svg",
            guide: "Bộ Kiếm gắn liền với nguyên tố Khí — đại diện cho tư duy phân tích, sự minh bạch, giao tiếp sắc bén và khả năng cắt bỏ những ràng buộc mơ hồ. Bộ bài này nhắc nhở dùng cái đầu lạnh và góc nhìn khách quan để giải quyết thử thách.",
        },
        cups: {
            en: "Suit of Cups",
            vn: "Bộ Cốc (14 lá)",
            short: "Bộ Cốc",
            element: "Nguyên tố Nước (Thủy)",
            domain: "Cảm xúc, Trực giác & Nhân duyên",
            icon: "./assets/icons/water.svg",
            guide: "Bộ Cốc gắn liền với nguyên tố Nước — đại diện cho đời sống nội tâm, lòng trắc ẩn, sự đồng điệu trong các mối quan hệ và cảm hứng nghệ thuật. Thông điệp Bộ Cốc thường nhấn mạnh sự lắng nghe trái tim và giữ gìn hòa khí.",
        },
        pentacles: {
            en: "Suit of Pentacles",
            vn: "Bộ Tiền (14 lá)",
            short: "Bộ Tiền",
            element: "Nguyên tố Đất (Thổ)",
            domain: "Tài chính, Sự nghiệp & Giá trị thực",
            icon: "./assets/icons/earth.svg",
            guide: "Bộ Tiền gắn liền với nguyên tố Đất — đại diện cho tài sản hữu hình, nền tảng sự nghiệp bền vững, sức khỏe thể chất và tính kỷ luật thực tế. Bộ bài này ủng hộ chiến lược đi từng bước chắc chắn để tích lũy thành quả lâu dài.",
        },
    };

    let allCards = [];
    let currentCard = null;
    let currentOrient = "upright";
    let activeSuitFilter = "all";
    let lastFocusedBeforeLightbox = null;

    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const getCardImgUrl = (card) => `${TAROT_IMG_DIR}/${card.suit}/${card.slug}.${TAROT_IMG_EXT}`;
    const getCardHref = (card, orient = "upright") =>
        `./tarot-detail.html?slug=${encodeURIComponent(card.slug)}&orientation=${orient}`;

    const applyOrientationState = (orient, { updateUrl = true } = {}) => {
        if (!currentCard) return;
        currentOrient = orient === "reversed" ? "reversed" : "upright";
        const isUp = currentOrient === "upright";

        const poster = document.getElementById("trd-poster-figure");
        const orientBadge = document.getElementById("trd-orient-badge");
        if (poster) poster.dataset.orientation = currentOrient;
        if (orientBadge) {
            orientBadge.dataset.orientation = currentOrient;
            orientBadge.textContent = isUp ? "Đang xem: Lá bài Xuôi (Upright)" : "Đang xem: Lá bài Ngược (Reversed)";
        }

        document.querySelectorAll("[data-set-orient]").forEach((btn) => {
            const isSel = btn.dataset.setOrient === currentOrient;
            btn.classList.toggle("is-active", isSel);
            btn.setAttribute("aria-pressed", String(isSel));
        });

        setText("trd-hero-message", `"${isUp ? currentCard.msg_upright : currentCard.msg_reversed}"`);
        setText("trd-hero-keywords", `Từ khóa: ${isUp ? currentCard.keywords_upright : currentCard.keywords_reversed}`);
        setText("trd-stat-orient", isUp ? "Chiều Xuôi (Upright)" : "Chiều Ngược (Reversed)");

        document.getElementById("trd-box-upright")?.classList.toggle("div-detail-block--highlight", isUp);
        document.getElementById("trd-box-reversed")?.classList.toggle("div-detail-block--highlight", !isUp);

        if (updateUrl) {
            const url = new URL(window.location.href);
            url.searchParams.set("slug", currentCard.slug);
            url.searchParams.set("orientation", currentOrient);
            window.history.replaceState({}, "", url.toString());
        }
    };

    const openLightbox = () => {
        if (!currentCard) return;
        const lightbox = document.getElementById("detail-lightbox");
        const img = document.getElementById("detail-lightbox-img");
        const cap = document.getElementById("detail-lightbox-caption");
        if (!lightbox || !img) return;

        lastFocusedBeforeLightbox = document.activeElement;
        const title = `${currentCard.roman ? `${currentCard.roman}. ` : ""}${currentCard.vn} (${currentCard.en})`;
        const isRev = currentOrient === "reversed";

        img.src = getCardImgUrl(currentCard);
        img.alt = `Lá bài Tarot ${title}`;
        img.classList.toggle("is-reversed", isRev);
        if (cap) cap.textContent = `${title} • ${isRev ? "Chiều Ngược (Reversed)" : "Chiều Xuôi (Upright)"}`;

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

    const renderRelatedSuitCards = () => {
        const grid = document.getElementById("trd-related-grid");
        if (!grid || !currentCard) return;

        const sameSuit = allCards.filter((c) => c.suit === currentCard.suit);
        const curPos = sameSuit.findIndex((c) => c.id === currentCard.id);
        const related = [];
        for (const offset of [-2, -1, 1, 2]) {
            const pick = sameSuit[(curPos + offset + sameSuit.length) % sameSuit.length];
            if (pick && pick.id !== currentCard.id && !related.some((r) => r.id === pick.id)) {
                related.push(pick);
            }
        }

        grid.innerHTML = related
            .map(
                (c) => `
                    <a
                        href="${getCardHref(c, "upright")}"
                        class="util-tarot-card"
                        title="Xem chi tiết lá bài ${c.vn} (${c.en})"
                    >
                        <div class="util-tarot-card__thumb">
                            <img
                                src="${getCardImgUrl(c)}"
                                alt="Lá bài Tarot ${c.vn} (${c.en})"
                                width="350"
                                height="600"
                                loading="lazy"
                                decoding="async"
                            />
                            <span class="util-tarot-card__badge">#${pad(c.id)}</span>
                        </div>
                        <div class="util-tarot-card__body">
                            <strong class="util-tarot-card__title">${c.roman ? `${c.roman}. ` : ""}${c.vn}</strong>
                            <span class="util-tarot-card__sub">${c.en}</span>
                        </div>
                    </a>
                `,
            )
            .join("");
    };

    const renderSidebar = () => {
        const listEl = document.getElementById("trd-sidebar-list");
        if (!listEl) return;

        const q = (document.getElementById("trd-sidebar-search")?.value || "").trim().toLowerCase();
        const filtered = allCards.filter((c) => {
            if (activeSuitFilter !== "all" && c.suit !== activeSuitFilter) return false;
            if (!q) return true;
            return `${pad(c.id)} ${c.id} ${c.roman} ${c.vn} ${c.en}`.toLowerCase().includes(q);
        });

        setText("trd-sidebar-count", `${filtered.length} lá`);

        if (!filtered.length) {
            listEl.innerHTML = `<p class="util-data-table__empty">Không có lá bài nào khớp bộ lọc.</p>`;
            return;
        }

        listEl.innerHTML = filtered
            .map((c) => {
                const isCur = currentCard && Number(c.id) === Number(currentCard.id);
                const suitShort = SUIT_META[c.suit]?.short || "Tarot";
                return `
                    <a
                        href="${getCardHref(c, "upright")}"
                        class="detail-sidebar__item div-sidebar-item ${isCur ? "is-current" : ""}"
                        ${isCur ? 'aria-current="page"' : ""}
                    >
                        <span class="div-sidebar-item__tarot-thumb" aria-hidden="true">
                            <img src="${getCardImgUrl(c)}" alt="" width="35" height="60" loading="lazy" decoding="async" />
                        </span>
                        <div class="detail-sidebar__item-info">
                            <strong class="detail-sidebar__item-name">${c.roman ? `${c.roman}. ` : ""}${c.vn}</strong>
                            <span class="detail-sidebar__item-occasion">${c.en} • ${suitShort}</span>
                        </div>
                    </a>
                `;
            })
            .join("");

        const activeEl = listEl.querySelector(".detail-sidebar__item.is-current");
        if (activeEl) {
            const topPos = activeEl.offsetTop - listEl.offsetTop - listEl.clientHeight / 2 + activeEl.clientHeight / 2;
            listEl.scrollTo({ top: Math.max(0, topPos), behavior: "smooth" });
        }
    };

    const initTarotDetailPage = async () => {
        try {
            const res = await fetch("./api/tarot.json");
            if (!res.ok) return;
            allCards = await res.json();
        } catch (err) {
            return;
        }

        if (!Array.isArray(allCards) || !allCards.length) return;

        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get("slug") || "";
        const idParam = params.has("id") ? Number(params.get("id")) : -1;
        const orientParam = params.get("orientation") === "reversed" ? "reversed" : "upright";

        currentCard =
            allCards.find((c) => c.slug === slugParam) ||
            allCards.find((c) => Number(c.id) === idParam) ||
            allCards.find((c) => Number(c.id) === 14) ||
            allCards[0];

        const curIdx = allCards.indexOf(currentCard);
        const prevCard = allCards[(curIdx - 1 + allCards.length) % allCards.length];
        const nextCard = allCards[(curIdx + 1) % allCards.length];

        document.getElementById("trd-prev-btn")?.setAttribute("href", getCardHref(prevCard, "upright"));
        document.getElementById("trd-next-btn")?.setAttribute("href", getCardHref(nextCard, "upright"));

        const suitInfo = SUIT_META[currentCard.suit] || SUIT_META.major;
        const displayTitle = `${currentCard.roman ? `${currentCard.roman}. ` : ""}${currentCard.vn} (${currentCard.en})`;

        document.title = `${displayTitle} - Tarot Rider-Waite • Lịch Phong Thủy`;

        setText("trd-suit-badge", suitInfo.short);
        setText("trd-id-badge", `Lá #${pad(currentCard.id)} / 78`);
        setText("trd-suit-eyebrow", `${suitInfo.vn} • ${suitInfo.en}`);
        setText("trd-main-title", displayTitle);

        const heroImg = document.getElementById("trd-hero-img");
        if (heroImg) {
            heroImg.src = getCardImgUrl(currentCard);
            heroImg.alt = `Lá bài Tarot ${displayTitle}`;
        }

        setText("trd-stat-suit", suitInfo.en);
        setText("trd-stat-suit-vn", suitInfo.vn);
        setText("trd-stat-element", suitInfo.element);
        setText("trd-stat-domain", suitInfo.domain);
        document.getElementById("trd-stat-elem-icon")?.setAttribute("src", suitInfo.icon);
        setText("trd-stat-roman", `${currentCard.roman || pad(currentCard.id)} • #${pad(currentCard.id)}`);
        setText("trd-stat-en", currentCard.en);

        setText("trd-up-keywords", currentCard.keywords_upright);
        setText("trd-up-msg", currentCard.msg_upright);
        setText("trd-rev-keywords", currentCard.keywords_reversed);
        setText("trd-rev-msg", currentCard.msg_reversed);
        setText("trd-body-career", currentCard.career);
        setText("trd-suit-guide-title", `Đặc Tính Nguyên Tố • ${suitInfo.vn}`);
        setText("trd-suit-guide-desc", suitInfo.guide);

        applyOrientationState(orientParam, { updateUrl: false });
        renderRelatedSuitCards();
        renderSidebar();

        // Công tắc Xuôi / Ngược
        document.querySelectorAll("[data-set-orient]").forEach((btn) => {
            btn.addEventListener("click", () => applyOrientationState(btn.dataset.setOrient, { updateUrl: true }));
        });

        // Lightbox phóng to (Chuột + Bàn phím)
        const poster = document.getElementById("trd-poster-figure");
        poster?.addEventListener("click", openLightbox);
        poster?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox();
            }
        });
        document.getElementById("detail-lightbox-close")?.addEventListener("click", closeLightbox);
        document.getElementById("detail-lightbox-backdrop")?.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });

        // Bộ lọc Sidebar 78 lá
        document.getElementById("trd-sidebar-search")?.addEventListener("input", renderSidebar);
        document.getElementById("trd-sidebar-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-trd-filter]");
            if (!btn) return;
            activeSuitFilter = btn.dataset.trdFilter || "all";
            document.querySelectorAll("[data-trd-filter]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderSidebar();
        });

        // Sao chép liên kết chia sẻ
        const shareBtn = document.getElementById("trd-share-btn");
        const shareLabel = document.getElementById("trd-share-label");
        if (shareBtn && shareLabel) {
            shareBtn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    shareLabel.textContent = "Đã sao chép!";
                    setTimeout(() => {
                        shareLabel.textContent = "Chia sẻ";
                    }, 2000);
                } catch (e) {
                    shareLabel.textContent = "Chia sẻ";
                }
            };
        }
    };

    document.addEventListener("DOMContentLoaded", initTarotDetailPage);
})();

