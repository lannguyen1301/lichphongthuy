// assets/js/iching-detail.js
// Trang chi tiết 64 Quẻ Kinh Dịch: Đọc ./api/iching.json, vẽ 6 hào từ dưới lên,
// tự động tính 3 Quẻ Biến Liên Quan (Quẻ Hổ / Hỗ Quái, Quẻ Đối / Thác Quái, Quẻ Đảo / Tống Quái) & Sidebar Sticky
(() => {
    const ICON_DIR = "./assets/icons/iching";
    const pad = (n) => String(n).padStart(2, "0");

    let allHexagrams = [];
    let currentHex = null;
    let activeFilter = "all";

    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const linesKey = (arr) => (Array.isArray(arr) ? arr.join("") : "");

    const parseTrigrams = (trigramsStr = "") => {
        const lowerMatch = trigramsStr.match(/Nội quái:\s*([^•]+)/i);
        const upperMatch = trigramsStr.match(/Ngoại quái:\s*(.+)$/i);
        return {
            lower: lowerMatch ? lowerMatch[1].trim() : "Càn (Trời)",
            upper: upperMatch ? upperMatch[1].trim() : "Ly (Lửa)",
        };
    };

    const renderRelatedHexagrams = (hex, lookupByBits) => {
        const grid = document.getElementById("icd-related-grid");
        if (!grid || !Array.isArray(hex.lines) || hex.lines.length !== 6) return;

        const [h1, h2, h3, h4, h5, h6] = hex.lines;
        const nuclearBits = [h2, h3, h4, h3, h4, h5]; // Hỗ Quái (Quẻ Hổ: Hào 2-3-4 hạ, Hào 3-4-5 thượng)
        const oppositeBits = hex.lines.map((b) => (b === 1 ? 0 : 1)); // Thác Quái (Quẻ Đối: đảo âm dương)
        const invertedBits = [h6, h5, h4, h3, h2, h1]; // Tống Quái (Quẻ Đảo: lật ngược 180 độ)

        const relations = [
            {
                role: "Quẻ Hổ (Hỗ Quái)",
                note: "Diễn biến ẩn bên trong (ghép từ Hào 2-3-4 & 3-4-5)",
                target: lookupByBits.get(linesKey(nuclearBits)),
            },
            {
                role: "Quẻ Đối (Thác Quái)",
                note: "Thế âm dương đối lập hoàn toàn với quẻ gốc",
                target: lookupByBits.get(linesKey(oppositeBits)),
            },
            {
                role: "Quẻ Đảo (Tống Quái)",
                note: "Góc nhìn đảo ngược khi lật 180 độ toàn bộ 6 hào",
                target: lookupByBits.get(linesKey(invertedBits)),
            },
        ].filter((item) => Boolean(item.target));

        grid.innerHTML = relations
            .map(({ role, note, target }) => {
                const isSelf = target.num === hex.num;
                return `
                    <a
                        href="./iching-detail.html?slug=${encodeURIComponent(target.slug)}"
                        class="div-related-card ${isSelf ? "is-self-mirror" : ""}"
                        title="Xem chi tiết ${role}: Quẻ số ${target.num} - ${target.name}"
                    >
                        <div class="div-related-card__head">
                            <span class="div-related-card__role">${role}</span>
                            <span class="div-related-card__num">#${pad(target.num)}</span>
                        </div>
                        <div class="div-related-card__main">
                            <span class="div-related-card__svg-wrap" aria-hidden="true">
                                <img
                                    src="${ICON_DIR}/${target.slug}.svg"
                                    alt=""
                                    width="70"
                                    height="70"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </span>
                            <div class="div-related-card__info">
                                <strong>${target.short} ${isSelf ? "(Tự phản chiếu)" : ""}</strong>
                                <span>${target.name.split("(")[0].trim()}</span>
                                <small>${target.fortune}</small>
                            </div>
                        </div>
                        <p class="div-related-card__note">${note}</p>
                    </a>
                `;
            })
            .join("");
    };

    const renderSidebar = () => {
        const listEl = document.getElementById("icd-sidebar-list");
        if (!listEl) return;

        const q = (document.getElementById("icd-sidebar-search")?.value || "").trim().toLowerCase();
        const filtered = allHexagrams.filter((h) => {
            if (activeFilter !== "all" && h.fortune !== activeFilter) return false;
            if (!q) return true;
            return `${pad(h.num)} ${h.num} ${h.short} ${h.name} ${h.trigrams}`.toLowerCase().includes(q);
        });

        setText("icd-sidebar-count", `${filtered.length} quẻ`);

        if (!filtered.length) {
            listEl.innerHTML = `<p class="util-data-table__empty">Không có quẻ nào khớp bộ lọc.</p>`;
            return;
        }

        listEl.innerHTML = filtered
            .map((h) => {
                const isCur = currentHex && Number(h.num) === Number(currentHex.num);
                return `
                    <a
                        href="./iching-detail.html?slug=${encodeURIComponent(h.slug)}"
                        class="detail-sidebar__item div-sidebar-item ${isCur ? "is-current" : ""}"
                        ${isCur ? 'aria-current="page"' : ""}
                    >
                        <span class="div-sidebar-item__svg" aria-hidden="true">
                            <img src="${ICON_DIR}/${h.slug}.svg" alt="" width="40" height="40" loading="lazy" decoding="async" />
                        </span>
                        <div class="detail-sidebar__item-info">
                            <strong class="detail-sidebar__item-name">#${pad(h.num)} • ${h.short}</strong>
                            <span class="detail-sidebar__item-occasion">${h.name.split("(")[0].trim()} • ${h.fortune}</span>
                        </div>
                    </a>
                `;
            })
            .join("");

        const activeEl = listEl.querySelector(".detail-sidebar__item.is-current");
        if (activeEl) {
            const topPos =
                activeEl.offsetTop - listEl.offsetTop - listEl.clientHeight / 2 + activeEl.clientHeight / 2;
            listEl.scrollTo({ top: Math.max(0, topPos), behavior: "smooth" });
        }
    };

    const initIChingDetailPage = async () => {
        try {
            const res = await fetch("./api/iching.json");
            if (!res.ok) return;
            allHexagrams = await res.json();
        } catch (err) {
            return;
        }

        if (!Array.isArray(allHexagrams) || !allHexagrams.length) return;

        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get("slug") || "";
        const numParam = Number(params.get("num") || 0);

        currentHex =
            allHexagrams.find((h) => h.slug === slugParam) ||
            allHexagrams.find((h) => Number(h.num) === numParam) ||
            allHexagrams.find((h) => Number(h.num) === 14) ||
            allHexagrams[0];

        const curIdx = allHexagrams.indexOf(currentHex);
        const prevHex = allHexagrams[(curIdx - 1 + allHexagrams.length) % allHexagrams.length];
        const nextHex = allHexagrams[(curIdx + 1) % allHexagrams.length];

        document.getElementById("icd-prev-btn")?.setAttribute("href", `./iching-detail.html?slug=${encodeURIComponent(prevHex.slug)}`);
        document.getElementById("icd-next-btn")?.setAttribute("href", `./iching-detail.html?slug=${encodeURIComponent(nextHex.slug)}`);

        const cleanMainName = currentHex.name.split("(")[0].trim();
        document.title = `Quẻ ${pad(currentHex.num)}: ${cleanMainName} - Kinh Dịch • Lịch Phong Thủy`;

        setText("icd-num-badge", `Quẻ số ${pad(currentHex.num)}`);
        setText("icd-fortune-badge", currentHex.fortune);
        setText("icd-trigrams-eyebrow", currentHex.trigrams);
        setText("icd-main-title", `Quẻ ${pad(currentHex.num)}: ${cleanMainName}`);
        setText("icd-full-name", currentHex.name);
        setText("icd-hero-quote", `"${currentHex.judgment}"`);

        const svgImg = document.getElementById("icd-hero-svg");
        if (svgImg) {
            svgImg.src = `${ICON_DIR}/${currentHex.slug}.svg`;
            svgImg.alt = `Đồ hình Quẻ số ${pad(currentHex.num)}: ${currentHex.name}`;
        }

        const linesStack = document.getElementById("icd-lines-stack");
        if (linesStack && Array.isArray(currentHex.lines)) {
            linesStack.innerHTML = [...currentHex.lines]
                .reverse()
                .map((bit, revIdx) => {
                    const haoNum = 6 - revIdx;
                    const typeLabel = bit === 1 ? "Dương" : "Âm";
                    const lineMarkup =
                        bit === 1
                            ? `<div class="util-hex-line util-hex-line--yang" style="animation-delay:${(haoNum - 1) * 0.06}s"><span></span></div>`
                            : `<div class="util-hex-line util-hex-line--yin" style="animation-delay:${(haoNum - 1) * 0.06}s"><span></span><span></span></div>`;
                    return `
                        <div class="div-hao-row">
                            <span class="div-hao-row__label">Hào ${haoNum}</span>
                            <div class="div-hao-row__bar">${lineMarkup}</div>
                            <span class="div-hao-row__type">${typeLabel}</span>
                        </div>
                    `;
                })
                .join("");
        }

        const yangCount = (currentHex.lines || []).filter((b) => b === 1).length;
        const yinCount = 6 - yangCount;
        const { lower, upper } = parseTrigrams(currentHex.trigrams);

        setText("icd-stat-num", `Quẻ #${pad(currentHex.num)} / 64`);
        setText("icd-stat-short", `Quẻ ${currentHex.short}`);
        setText("icd-stat-fortune", currentHex.fortune);
        setText("icd-stat-ratio", `${yangCount} Hào Dương • ${yinCount} Hào Âm`);
        setText("icd-stat-lower", lower);
        setText("icd-stat-upper", upper);

        setText("icd-body-judgment", currentHex.judgment);
        setText("icd-body-image", currentHex.image);
        setText("icd-body-advice", currentHex.advice);

        const lookupByBits = new Map(allHexagrams.map((h) => [linesKey(h.lines), h]));
        renderRelatedHexagrams(currentHex, lookupByBits);
        renderSidebar();

        document.getElementById("icd-sidebar-search")?.addEventListener("input", renderSidebar);
        document.getElementById("icd-sidebar-filters")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-icd-filter]");
            if (!btn) return;
            activeFilter = btn.dataset.icdFilter || "all";
            document.querySelectorAll("[data-icd-filter]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-active", isSel);
                b.setAttribute("aria-pressed", String(isSel));
            });
            renderSidebar();
        });

        const shareBtn = document.getElementById("icd-share-btn");
        const shareLabel = document.getElementById("icd-share-label");
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

    document.addEventListener("DOMContentLoaded", initIChingDetailPage);
})();