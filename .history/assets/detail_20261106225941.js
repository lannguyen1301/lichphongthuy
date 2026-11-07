// assets/js/detail.js
// Chuyên trách Giai đoạn 4 (detail.html): Đọc tham số URL, nạp ./api/thang-${month}.json
// và hiển thị bộ ảnh từ ./assets/images/{figures|events}/{folder}/
(() => {
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    const pad = (n) => String(n).padStart(2, "0");

    const fetchMonthData = async (monthNum) => {
        const m = Number(monthNum) || 11;
        const candidatePaths = [`./api/thang-${m}.json`, `./api/thang-${pad(m)}.json`];

        for (const path of candidatePaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    return Array.isArray(data) ? data : data?.data || data?.events || [];
                }
            } catch (err) {
                // Thử đường dẫn dự phòng tiếp theo
            }
        }
        return [];
    };

    const parseDayMonthFromItem = (item, fallbackMonth) => {
        const displayDate = String(item?.ngay_hien_thi || item?.ngay_duong || "").trim();
        if (/^\d{1,2}\/\d{1,2}/.test(displayDate)) {
            const [d, m] = displayDate.split("/").map(Number);
            return { day: d || 1, month: m || fallbackMonth };
        }
        const slugStr = String(item?.image_slug || "");
        const match = slugStr.match(/-(\d{2})-(\d{2})-\d{4}/);
        if (match) {
            return { day: Number(match[1]) || 1, month: Number(match[2]) || fallbackMonth };
        }
        return { day: Number(item?.day) || 1, month: fallbackMonth };
    };

    const buildDetailHref = (item, monthNum) => {
        const rawSlug = item.image_slug || item.slug || "";
        const cleanFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
        const catStr = String(item.category_id || item.loai || "").toLowerCase();
        const typeFolder = catStr.includes("event") || catStr.includes("su-kien") ? "events" : "figures";

        const params = new URLSearchParams({
            type: typeFolder,
            folder: cleanFolder,
            slug: rawSlug,
            month: String(monthNum),
        });
        return `./detail.html?${params.toString()}`;
    };

    // Nạp ảnh chính: Ưu tiên ảnh trong folder riêng ./assets/images/{type}/{folder}/ -> Ảnh bìa calendar-covers -> Mặc định
    const setHeroImageWithFallback = (imgEl, typeFolder, actorFolder, monthNum, rawSlug, altText) => {
        if (!imgEl) return;
        if (altText) imgEl.alt = altText;

        const cleanSlug = String(rawSlug || "")
            .split("/")
            .pop()
            .replace(/\.(jpg|jpeg|png|webp)$/i, "");

        const candidateUrls = [
            `./assets/images/calendar-covers/thang-${monthNum}/${cleanSlug}.jpg`,
            `./assets/images/calendar-covers/thang-${monthNum}/${cleanSlug}.webp`,
            `./assets/images/${typeFolder}/${actorFolder}/${actorFolder}.webp`,
            `./assets/images/${typeFolder}/${actorFolder}/${actorFolder}.jpg`,
            `./assets/images/${typeFolder}/${actorFolder}/1.webp`,
            `./assets/images/${typeFolder}/${actorFolder}/1.jpg`,
            DEFAULT_COVER_IMG,
        ];

        let idx = 0;
        const tryNext = () => {
            if (idx >= candidateUrls.length) {
                imgEl.onerror = null;
                return;
            }
            imgEl.src = candidateUrls[idx++];
        };

        imgEl.onerror = tryNext;
        tryNext();
    };

    // Tạo Thư viện ảnh từ ./assets/images/{type}/{folder}/ (Hỗ trợ mảng gallery trong JSON hoặc tự động tìm ảnh trong folder)
    const renderActorGallery = (item, typeFolder, actorFolder, monthNum, rawSlug) => {
        const pathEl = document.getElementById("article-folder-path");
        const gridEl = document.getElementById("article-gallery-grid");
        if (!gridEl) return;

        const folderBasePath = `./assets/images/${typeFolder}/${actorFolder}`;
        if (pathEl) pathEl.textContent = `${folderBasePath}/`;

        const cleanSlug = String(rawSlug || "")
            .split("/")
            .pop()
            .replace(/\.(jpg|jpeg|png|webp)$/i, "");
        const coverUrl = `./assets/images/calendar-covers/thang-${monthNum}/${cleanSlug}.jpg`;

        // Nếu trong JSON có khai báo sẵn mảng "images" hoặc "gallery" (ví dụ: ["anh-1.webp", "anh-2.webp"])
        const customImages = Array.isArray(item?.images)
            ? item.images
            : Array.isArray(item?.gallery)
              ? item.gallery
              : [];

        const galleryCards = [
            {
                primaryUrl: `${folderBasePath}/${actorFolder}.webp`,
                fallback1: `${folderBasePath}/1.webp`,
                fallback2: coverUrl,
                caption: `Tư liệu chính: ${item?.ten || actorFolder}`,
            },
            {
                primaryUrl: customImages[0]
                    ? `${folderBasePath}/${customImages[0]}`
                    : `${folderBasePath}/${cleanSlug}.webp`,
                fallback1: `${folderBasePath}/2.webp`,
                fallback2: coverUrl,
                caption: item?.hien_thi_nhan_dip || `Hình ảnh lịch sử lưu trữ`,
            },
        ];

        gridEl.innerHTML = galleryCards
            .map(
                (card, index) => `
                    <figure class="detail-gallery__item">
                        <img
                            src="${card.primaryUrl}"
                            data-fallback-one="${card.fallback1}"
                            data-fallback-two="${card.fallback2}"
                            alt="${card.caption}"
                            class="detail-gallery__img js-gallery-img"
                            loading="lazy"
                        />
                        <figcaption class="detail-gallery__caption">
                            Hình ${index + 1}: ${card.caption}
                        </figcaption>
                    </figure>
                `,
            )
            .join("");

        gridEl.querySelectorAll(".js-gallery-img").forEach((img) => {
            let step = 0;
            img.onerror = () => {
                step++;
                if (step === 1 && img.dataset.fallbackOne) {
                    img.src = img.dataset.fallbackOne;
                } else if (step === 2 && img.dataset.fallbackTwo) {
                    img.src = img.dataset.fallbackTwo;
                } else {
                    img.onerror = null;
                    img.src = DEFAULT_COVER_IMG;
                }
            };
        });
    };

    const initDetailPage = async () => {
        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get("type") || "figures";
        const folderParam = params.get("folder") || "nguyen-thi-minh-khai";
        const slugParam = params.get("slug") || "nguyen-thi-minh-khai-01-11-1910-28-08-1941";
        const monthParam = Number(params.get("month")) || 11;
        const dayParam = Number(params.get("day")) || null;

        const allMonthItems = await fetchMonthData(monthParam);

        // Tìm đúng nhân vật / sự kiện theo slug, folder hoặc ngày
        let currentItem =
            allMonthItems.find((entry) => entry.image_slug === slugParam || entry.slug === slugParam) ||
            allMonthItems.find((entry) => String(entry.image_slug || "").startsWith(folderParam)) ||
            (dayParam
                ? allMonthItems.find((entry) => {
                      const dm = parseDayMonthFromItem(entry, monthParam);
                      return dm.day === dayParam;
                  })
                : null) ||
            allMonthItems[0] ||
            null;

        const { day: eventDay, month: eventMonth } = parseDayMonthFromItem(currentItem, monthParam);
        const currentYear = 2026;

        // Cập nhật link nút Quay lại Lịch Tháng đúng ngày vừa xem
        const backLink = document.getElementById("detail-back-link");
        if (backLink) {
            backLink.href = `./index.html?date=${currentYear}-${pad(eventMonth)}-${pad(eventDay)}`;
        }

        const isEventCategory =
            typeParam === "events" ||
            String(currentItem?.category_id || "")
                .toLowerCase()
                .includes("event") ||
            String(currentItem?.category_id || "")
                .toLowerCase()
                .includes("su-kien");

        const titleText = currentItem?.ten || "Nguyễn Thị Minh Khai";
        const occasionText =
            currentItem?.hien_thi_nhan_dip || `Sự kiện & Nhân vật lịch sử ngày ${pad(eventDay)}/${pad(eventMonth)}`;
        const rawSlug = currentItem?.image_slug || slugParam;
        const resolvedFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || folderParam;

        document.title = `${titleText} - Lịch Phong Thủy`;

        document.getElementById("article-cat-badge").textContent = isEventCategory
            ? "Sự kiện lịch sử"
            : "Nhân vật lịch sử";
        document.getElementById("article-date-badge").textContent = `Ngày ${pad(eventDay)}/${pad(eventMonth)}`;
        document.getElementById("article-occasion-tag").textContent = occasionText;
        document.getElementById("article-main-title").textContent = titleText;

        const quoteTextEl = document.getElementById("article-quote-text");
        const quoteAuthorEl = document.getElementById("article-quote-author");
        const rawQuote = (currentItem?.quote || currentItem?.danh_ngon || "").trim();
        if (quoteTextEl) {
            quoteTextEl.textContent = rawQuote
                ? rawQuote.startsWith('"')
                    ? rawQuote
                    : `"${rawQuote}"`
                : `"${occasionText}"`;
        }
        if (quoteAuthorEl) {
            quoteAuthorEl.textContent = `— ${titleText}`;
        }

        // Tính Âm lịch & Can Chi cho ngày kỷ niệm bằng window.LunarEngine
        document.getElementById("article-solar-date").textContent =
            `${pad(eventDay)}/${pad(eventMonth)}/${currentYear}`;
        if (window.LunarEngine) {
            const lunarInfo = window.LunarEngine.getFullDayInfo(eventDay, eventMonth, currentYear);
            document.getElementById("article-lunar-date").textContent =
                `${pad(lunarInfo.lunarDay)}/${pad(lunarInfo.lunarMonth)} ${lunarInfo.yearCanChi}`;
            document.getElementById("article-canchi-date").textContent = `Ngày ${lunarInfo.dayCanChi}`;
        }
        document.getElementById("article-type-label").textContent = isEventCategory
            ? "Sự kiện Trọng đại"
            : "Danh nhân Việt Nam";

        // Nạp ảnh Hero 16:9
        const heroImgEl = document.getElementById("article-hero-img");
        setHeroImageWithFallback(
            heroImgEl,
            isEventCategory ? "events" : "figures",
            resolvedFolder,
            eventMonth,
            rawSlug,
            titleText,
        );

        // Đổ nội dung mô tả chi tiết (mo_ta / noi_dung)
        const bodyEl = document.getElementById("article-body-content");
        if (bodyEl) {
            const rawDesc = currentItem?.mo_ta || currentItem?.noi_dung || currentItem?.description || occasionText;
            const paragraphs = String(rawDesc)
                .split(/\n+/)
                .map((p) => p.trim())
                .filter(Boolean);

            bodyEl.innerHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");
        }

        // Vẽ Thư viện ảnh tư liệu theo đúng folder ./assets/images/{figures|events}/{folder}/
        renderActorGallery(currentItem, isEventCategory ? "events" : "figures", resolvedFolder, eventMonth, rawSlug);

        // Đổ danh sách Nguồn sử liệu (historical_sources)
        const sourcesListEl = document.getElementById("article-sources-list");
        if (sourcesListEl) {
            const sources = Array.isArray(currentItem?.historical_sources)
                ? currentItem.historical_sources
                : currentItem?.nguon_su_lieu
                  ? [currentItem.nguon_su_lieu]
                  : ["Đại cương Lịch sử Việt Nam", "Bảo tàng Lịch sử Quốc gia Việt Nam"];

            sourcesListEl.innerHTML = sources
                .map((src) => {
                    if (typeof src === "string") {
                        return `<li class="detail-sources__item">${src}</li>`;
                    }
                    const label = src.ten_nguon || src.title || src.name || "Tài liệu lịch sử";
                    return `<li class="detail-sources__item">${label}</li>`;
                })
                .join("");
        }

        // Vẽ danh sách các sự kiện khác trong cùng tháng ở Cột Phải
        const relatedTitleEl = document.getElementById("related-month-title");
        const relatedCountEl = document.getElementById("related-events-count");
        const relatedListEl = document.getElementById("related-events-list");

        if (relatedTitleEl) relatedTitleEl.textContent = `Sự kiện Tháng ${eventMonth}`;
        if (relatedCountEl) relatedCountEl.textContent = `${allMonthItems.length} mục`;

        if (relatedListEl) {
            relatedListEl.innerHTML = allMonthItems
                .map((item) => {
                    const dm = parseDayMonthFromItem(item, eventMonth);
                    const isCurrent = item === currentItem;
                    const href = buildDetailHref(item, eventMonth);
                    return `
                        <a href="${href}" class="detail-sidebar__item ${isCurrent ? "is-current" : ""}">
                            <div class="detail-sidebar__date-box">
                                <small>T${dm.month}</small>
                                <strong>${pad(dm.day)}</strong>
                            </div>
                            <div class="detail-sidebar__item-info">
                                <strong class="detail-sidebar__item-name">${item.ten || "Sự kiện lịch sử"}</strong>
                                <span class="detail-sidebar__item-occasion">${item.hien_thi_nhan_dip || ""}</span>
                            </div>
                        </a>
                    `;
                })
                .join("");
        }
    };

    document.addEventListener("DOMContentLoaded", initDetailPage);
})();
