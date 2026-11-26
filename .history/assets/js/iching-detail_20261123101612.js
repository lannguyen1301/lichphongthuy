// assets/js/iching-detail.js
// Nạp song song ./api/iching.json và ./api/iching-card.json, ghép theo số quẻ (1-64),
// hiển thị Thẻ bài khắc gỗ 3:4, Lightbox phóng to, 3 Quẻ biến & Sidebar lọc 64 quẻ chuẩn a11y
(() => {
    const pad = (n) => String(n).padStart(2, "0");

    let allHexagrams = [];
    let cardMapByNum = new Map();
    let activeHex = null;
    let activeFilter = "all";

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

    const normalizeAssetPath = (rawPath) => {
        if (!rawPath) return "";
        return rawPath.startsWith("/") ? `.${rawPath}` : rawPath;
    };

    // Mở & Đóng Lightbox phóng to thẻ bài
    const openLightbox = (imgSrc, captionText) => {
        const lightbox = document.getElementById("detail-lightbox");
        const imgEl = document.getElementById("detail-lightbox-img");
        const capEl = document.getElementById("detail-lightbox-caption");
        if (!lightbox || !imgEl) return;

        imgEl.src = imgSrc;
        imgEl.alt = captionText || "Thẻ bài Kinh Dịch";
        if (capEl) capEl.textContent = captionText || "";

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        const lightbox = document.getElementById("detail-lightbox");
        if (!lightbox) return;
        lightbox.hidden = true;
        document.body.style.overflow = "";
    };

    // Vẽ 6 hào từ trên xuống dưới (index 5 -> 0)
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

    // Tính 3 Quẻ biến (Hỗ Quái, Thác Quái, Tống Quái) từ mảng 6 hào [h1..h6]
    const renderRelatedHexagrams = (hex) => {
        const gridEl = document.getElementById("icd-related-grid");
        if (!gridEl || !Array.isArray(hex.lines) || hex.lines.length !== 6) return;

        const findByLines = (arr) => allHexagrams.find((h) => h.lines.join("") === arr.join(""));

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
                const iconSrc = `./assets/icons/iching/${target.slug}.svg`;
                return `
                    <a
                        href="./iching-detail.html?slug=${encodeURIComponent(target.slug)}"
                        class="util-hex-card"
                        title="Xem chi tiết ${role}: Quẻ ${target.num} ${escapeHtml(target.name)}"
                    >
                        <div class="util-hex-card__top">
                            <span class="util-hex-card__svg" aria-hidden="true">
                                <img src="${iconSrc}" alt="" loading="lazy" />
                            </span>
                            <span class="util-hex-card__badge">${role}</span>
                        </div>
                        <strong class="util-hex-card__title">Quẻ ${target.num}: ${escapeHtml(target.short)}</strong>
                        <span class="util-hex-card__sub">${escapeHtml(target.name)}</span>
                        <p class="util-hex-card__desc">${escapeHtml(target.advice)}</p>
                    </a>
                `;
            })
            .join("");
    };

    // Render Sidebar 64 Quẻ + Lọc & Tìm kiếm
    const renderSidebarList = () => {
        const listEl = document.getElementById("icd-sidebar-list");
        const countEl = document.getElementById("icd-sidebar-count");
        const searchVal = (document.getElementById("icd-sidebar-search")?.value || "").trim().toLowerCase();
        if (!listEl) return;

        const filtered = allHexagrams.filter((h) => {
            const card = cardMapByNum.get(h.num);
            const displayFortune = card?.trang_thai || h.fortune;

            if (activeFilter !== "all" && displayFortune !== activeFilter) return false;
            if (searchVal) {
                const haystack = `${h.num} ${h.short} ${h.name} ${card?.ten_que || ""} ${card?.han_tu_day_du || ""}`.toLowerCase();
                if (!haystack.includes(searchVal)) return false;
            }
            return true;
        });

        if (countEl) countEl.textContent = `${filtered.length} quẻ`;

        listEl.innerHTML = filtered
            .map((h) => {
                const card = cardMapByNum.get(h.num);
                const isCurrent = activeHex && h.num === activeHex.num;
                const displayFortune = card?.trang_thai || h.fortune;
                return `
                    <a
                        href="./iching-detail.html?slug=${encodeURIComponent(h.slug)}"
                        class="detail-sidebar__item ${isCurrent ? "is-current" : ""}"
                        ${isCurrent ? 'aria-current="page"' : ""}
                        title="Quẻ #${pad(h.num)}: ${escapeHtml(card?.ten_que || h.name)}"
                    >
                        <div class="detail-sidebar__date-box">
                            <small>Quẻ</small>
                            <strong>${pad(h.num)}</strong>
                        </div>
                        <div class="detail-sidebar__item-info">
                            <strong class="detail-sidebar__item-name">
                                ${escapeHtml(card?.ten_que || h.short)}
                                ${card?.han_tu ? `<span lang="zh-Hant"> (${escapeHtml(card.han_tu)})</span>` : ""}
                            </strong>
                            <span class="detail-sidebar__item-occasion">
                                ${escapeHtml(displayFortune)} • ${escapeHtml(h.name)}
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

    // Đổ dữ liệu Quẻ hiện tại + Metadata từ iching-card.json vào DOM
    const renderActiveHexagram = (hex) => {
        if (!hex) return;
        activeHex = hex;

        const card = cardMapByNum.get(hex.num) || null;
        const displayTitle = card?.ten_que || hex.name;
        const displayFortune = card?.trang_thai || hex.fortune;
        const fallbackSvg = `./assets/icons/iching/${hex.slug}.svg`;
        const artSrc = card?.image_file ? normalizeAssetPath(card.image_file) : fallbackSvg;
        const focalText = card?.focal_accent_object || "";

        document.title = `Quẻ ${pad(hex.num)}: ${displayTitle} - Lịch Phong Thủy`;

        // Thanh điều hướng Top bar (Prev / Next)
        const idx = allHexagrams.findIndex((h) => h.num === hex.num);
        const prevHex = allHexagrams[(idx - 1 + allHexagrams.length) % allHexagrams.length];
        const nextHex = allHexagrams[(idx + 1) % allHexagrams.length];
        if (prevHex) {
            const prevBtn = document.getElementById("icd-prev-btn");
            if (prevBtn) {
                prevBtn.href = `./iching-detail.html?slug=${encodeURIComponent(prevHex.slug)}`;
                prevBtn.title = `Quẻ trước: #${pad(prevHex.num)} ${prevHex.short}`;
            }
        }
        if (nextHex) {
            const nextBtn = document.getElementById("icd-next-btn");
            if (nextBtn) {
                nextBtn.href = `./iching-detail.html?slug=${encodeURIComponent(nextHex.slug)}`;
                nextBtn.title = `Quẻ tiếp: #${pad(nextHex.num)} ${nextHex.short}`;
            }
        }

        setText("icd-num-badge", `Quẻ số ${pad(hex.num)}`);
        setText("icd-fortune-badge", displayFortune);

        // Cập nhật Thẻ bài 3:4 & toàn bộ data-* qua dataset
        const cardShell = document.getElementById("icd-card-shell");
        const cardFigure = document.getElementById("icd-card-figure");
        const heroImg = document.getElementById("icd-hero-svg");
        const rawLink = document.getElementById("icd-raw-art-link");
        const hanziEl = document.getElementById("icd-card-hanzi");
        const focalEl = document.getElementById("icd-card-focal");

        if (cardShell) {
            cardShell.dataset.hexId = pad(hex.num);
            cardShell.dataset.hexSlug = card?.slug || hex.slug;
            cardShell.dataset.element = card?.ngu_hanh || "hoa";
            cardShell.dataset.fortuneCode = card?.trang_thai_code || "";
            cardShell.dataset.maHao = card?.ma_hao || hex.lines.join("");
            cardShell.classList.toggle("is-fallback-art", !card);
        }

        setText("icd-card-num", `#${pad(hex.num)}`);
        setText("icd-card-status", displayFortune);
        setText("icd-card-title", displayTitle);

        if (hanziEl) {
            if (card?.han_tu_day_du || card?.han_tu) {
                hanziEl.textContent = card.han_tu_day_du || card.han_tu;
                hanziEl.title = `Hán tự đầy đủ: ${card.han_tu_day_du || card.han_tu} (${displayTitle})`;
                hanziEl.hidden = false;
            } else {
                hanziEl.hidden = true;
            }
        }

        if (focalEl) {
            if (focalText) {
                focalEl.textContent = focalText;
                focalEl.hidden = false;
            } else {
                focalEl.hidden = true;
            }
        }

        const fullAlt = focalText
            ? `Minh họa khắc gỗ Quẻ ${pad(hex.num)} ${displayTitle}: ${focalText}`
            : `Đồ hình Quẻ ${pad(hex.num)}: ${displayTitle}`;
        const lightboxCaption = focalText
            ? `Quẻ ${pad(hex.num)}: ${displayTitle}${card?.han_tu_day_du ? ` (${card.han_tu_day_du})` : ""} — ${focalText}`
            : `Quẻ ${pad(hex.num)}: ${displayTitle}`;

        if (heroImg) {
            heroImg.onerror = () => {
                heroImg.onerror = null;
                heroImg.src = fallbackSvg;
                cardShell?.classList.add("is-fallback-art");
            };
            heroImg.src = artSrc;
            heroImg.alt = fullAlt;
        }

        if (cardFigure) {
            cardFigure.dataset.fullSrc = artSrc;
            cardFigure.dataset.caption = lightboxCaption;
            cardFigure.setAttribute("aria-label", `Phóng to thẻ bài ${lightboxCaption}`);
            cardFigure.title = `Bấm hoặc nhấn Enter để phóng to — ${lightboxCaption}`;
        }

        if (rawLink) rawLink.href = artSrc;

        // Schema keywords
        const keywordsMeta = document.getElementById("icd-schema-keywords");
        if (keywordsMeta && Array.isArray(card?.tu_khoa)) {
            keywordsMeta.content = card.tu_khoa.join(", ");
        }

        // Nội / Ngoại quái & Tiêu đề
        const trigramsStr = card
            ? `Thượng quái: ${card.thuong_quai.ten} (${card.thuong_quai.tuong}) • Hạ quái: ${card.ha_quai.ten} (${card.ha_quai.tuong})`
            : hex.trigrams;
        setText("icd-trigrams-eyebrow", trigramsStr);

        const mainTitleEl = document.getElementById("icd-main-title");
        if (mainTitleEl) {
            mainTitleEl.innerHTML = card?.han_tu
                ? `Quẻ ${pad(hex.num)}: ${escapeHtml(displayTitle)} <small lang="zh-Hant">(${escapeHtml(card.han_tu)})</small>`
                : `Quẻ ${pad(hex.num)}: ${escapeHtml(displayTitle)}`;
        }
        setText("icd-full-name", hex.name);

        // Tượng quẻ & Dải Từ khóa từ iching-card.json
        const metaBox = document.getElementById("icd-card-meta-box");
        const omenListEl = document.getElementById("icd-omen-list");
        const kwListEl = document.getElementById("icd-keywords-list");
        if (metaBox && omenListEl && kwListEl) {
            if (card && (card.tuong_que?.length || card.tu_khoa?.length)) {
                omenListEl.innerHTML = (card.tuong_que || [])
                    .map((o) => `<span class="iching-card-meta__omen-pill">${escapeHtml(o)}</span>`)
                    .join("");
                kwListEl.innerHTML = (card.tu_khoa || [])
                    .map((k) => `<li class="iching-card-meta__keyword">#${escapeHtml(k)}</li>`)
                    .join("");
                metaBox.hidden = false;
            } else {
                metaBox.hidden = true;
            }
        }

        // Giải nghĩa 2 vế Trái / Phải (Accordion)
        const pairWrapper = document.getElementById("icd-pair-wrapper");
        const pairBtn = document.getElementById("icd-pair-toggle-btn");
        const pairPanel = document.getElementById("icd-card-pair-panel");
        if (pairWrapper && pairBtn && pairPanel) {
            if (card?.giai_nghia_trai || card?.giai_nghia_phai) {
                setText("icd-pair-left", card.giai_nghia_trai || "");
                setText("icd-pair-right", card.giai_nghia_phai || "");
                pairWrapper.hidden = false;
                pairBtn.setAttribute("aria-expanded", "false");
                pairPanel.hidden = true;
            } else {
                pairWrapper.hidden = true;
            }
        }

        // Thoán từ, Tượng từ & Lời khuyên (Ưu tiên lời khuyên giàu chi tiết của iching-card.json nếu có)
        setText("icd-hero-quote", hex.judgment);
        setText("icd-body-judgment", hex.judgment);
        setText("icd-body-image", hex.image);
        setText("icd-body-advice", card?.loi_khuyen || hex.advice);

        // 4 Thẻ thông số cấu trúc
        const yangCount = hex.lines.filter((b) => b === 1).length;
        const yinCount = 6 - yangCount;
        setText("icd-stat-num", `Quẻ #${pad(hex.num)} / 64`);
        setText("icd-stat-short", `Quẻ ${hex.short}`);
        setText("icd-stat-fortune", displayFortune);
        setText("icd-stat-ratio", `${yangCount} Dương • ${yinCount} Âm`);

        if (card?.ha_quai && card?.thuong_quai) {
            setText("icd-stat-lower", `${card.ha_quai.ten} (${card.ha_quai.tuong})`);
            setText("icd-stat-lower-sub", `Mã hào: ${card.ha_quai.ma} • Hào 1 – 2 – 3`);
            setText("icd-stat-upper", `${card.thuong_quai.ten} (${card.thuong_quai.tuong})`);
            setText("icd-stat-upper-sub", `Mã hào: ${card.thuong_quai.ma} • Hào 4 – 5 – 6`);
        } else {
            const parts = String(hex.trigrams || "").split("•");
            setText("icd-stat-lower", (parts[0] || "").replace("Nội quái:", "").trim() || "--");
            setText("icd-stat-upper", (parts[1] || "").replace("Ngoại quái:", "").trim() || "--");
        }

        renderHexLines(hex.lines);
        renderRelatedHexagrams(hex);
        renderSidebarList();
    };

    const initIchingDetailPage = async () => {
        const [hexRes, cardRes] = await Promise.all([
            fetch("./api/iching.json").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("./api/iching-card.json").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        ]);

        allHexagrams = Array.isArray(hexRes) ? hexRes : [];
        const cardsArr = Array.isArray(cardRes) ? cardRes : [];
        cardMapByNum = new Map(cardsArr.map((c) => [Number(c.id), c]));

        if (!allHexagrams.length) return;

        // Hỗ trợ mở theo ?slug=02-khon, ?slug=02-khon-vi-dia hoặc ?num=2 (mặc định Quẻ 14)
        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get("slug") || "";
        const numParam = Number(params.get("num")) || 0;

        let targetHex =
            (numParam && allHexagrams.find((h) => h.num === numParam)) ||
            allHexagrams.find((h) => h.slug === slugParam) ||
            allHexagrams.find((h) => cardMapByNum.get(h.num)?.slug === slugParam) ||
            allHexagrams.find((h) => h.num === 14) ||
            allHexagrams[0];

        renderActiveHexagram(targetHex);

        // Ủy quyền sự kiện Click & Bàn phím đọc từ data-card-action
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

        // Bộ lọc & Tìm kiếm Sidebar 64 quẻ
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

        // Nút Chia sẻ
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
                // Bỏ qua nếu trình duyệt không hỗ trợ clipboard
            }
        });

        // Đóng Lightbox
        document.getElementById("detail-lightbox-close")?.addEventListener("click", closeLightbox);
        document.getElementById("detail-lightbox-backdrop")?.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    };

    document.addEventListener("DOMContentLoaded", initIchingDetailPage);
})();