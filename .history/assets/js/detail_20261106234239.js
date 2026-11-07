// assets/js/detail.js
// Chuyên trách Giai đoạn 4 (detail.html): Đọc tham số URL, nạp ./api/thang-${month}.json,
// đồng bộ 4 Bento Card Con Giáp/Ngũ Hành, Bộ lọc sự kiện cùng tháng & Lightbox phóng to ảnh
// ĐÃ FIX: Khóa scrollRestoration và thay scrollIntoView() bằng scrollTop nội bộ để trang không tự cuộn lên trên
(() => {
    const DEFAULT_COVER_IMG = "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let allMonthItemsCache = [];
    let currentSelectedItem = null;
    let currentEventMonth = 11;
    let activeRelatedFilter = "all"; // "all" | "vn" | "intl"

    const pad = (n) => String(n).padStart(2, "0");

    // 1. Tắt chế độ tự ghi nhớ vị trí cuộn cũ của trình duyệt & đưa trang về đỉnh tuyệt đối (top: 0)
    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

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
                // Thử đường dẫn tiếp theo
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

    const isInternationalEvent = (entry) => {
        const scope = String(entry?.pham_vi || entry?.scope || entry?.category_id || "").toLowerCase();
        return Boolean(entry?.is_international) || scope.includes("quoc-te") || scope.includes("international");
    };

    const buildDetailHref = (item, monthNum) => {
        if (!item) return "./index.html";
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

    // Điều khiển Lightbox phóng to ảnh
    const openLightbox = (imgSrc, captionText) => {
        const lightbox = document.getElementById("detail-lightbox");
        const lightboxImg = document.getElementById("detail-lightbox-img");
        const lightboxCap = document.getElementById("detail-lightbox-caption");
        if (!lightbox || !lightboxImg) return;

        lightboxImg.src = imgSrc;
        lightboxImg.alt = captionText || "Hình ảnh tư liệu lịch sử";
        if (lightboxCap) lightboxCap.textContent = captionText || "";

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        const lightbox = document.getElementById("detail-lightbox");
        if (!lightbox) return;
        lightbox.hidden = true;
        document.body.style.overflow = "";
    };

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

    // Vẽ Thư viện ảnh tư liệu: Tự động chống lặp 2 ảnh giống nhau nếu folder riêng chưa có ảnh phụ
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

        const customImages = Array.isArray(item?.images)
            ? item.images
            : Array.isArray(item?.gallery)
              ? item.gallery
              : [];

        const galleryCards = [
            {
                primaryUrl: `${folderBasePath}/${actorFolder}.webp`,
                fallback1: `${folderBasePath}/1.jpg`,
                fallback2: coverUrl,
                caption: `Tư liệu lưu trữ: ${item?.ten || actorFolder}`,
            },
            {
                primaryUrl: customImages[0] ? `${folderBasePath}/${customImages[0]}` : `${folderBasePath}/2.webp`,
                fallback1: `${folderBasePath}/2.jpg`,
                fallback2: "",
                caption: item?.hien_thi_nhan_dip || "Tư liệu lịch sử mở rộng",
            },
        ];

        gridEl.classList.remove("detail-gallery__grid--single");

        gridEl.innerHTML = galleryCards
            .map(
                (card) => `
                    <figure class="detail-gallery__item js-gallery-figure" data-caption="${card.caption}">
                        <img
                            src="${card.primaryUrl}"
                            data-fallback-one="${card.fallback1}"
                            data-fallback-two="${card.fallback2}"
                            alt="${card.caption}"
                            class="detail-gallery__img js-gallery-img"
                            loading="lazy"
                        />
                        <figcaption class="detail-gallery__caption">
                            ${card.caption}
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
                    const parentFig = img.closest(".js-gallery-figure");
                    if (parentFig) parentFig.remove();
                    if (gridEl.children.length === 1) {
                        gridEl.classList.add("detail-gallery__grid--single");
                    }
                }
            };
        });

        gridEl.querySelectorAll(".js-gallery-figure").forEach((fig) => {
            fig.onclick = () => {
                const img = fig.querySelector("img");
                if (img?.src) openLightbox(img.src, fig.dataset.caption);
            };
        });
    };

    // Vẽ danh sách sự kiện cùng tháng ở Cột Phải (CHỈ cuộn nội bộ thẻ #related-events-list, KHÔNG cuộn window)
    const renderRelatedSidebarList = () => {
        const relatedCountEl = document.getElementById("related-events-count");
        const relatedListEl = document.getElementById("related-events-list");
        if (!relatedListEl) return;

        const filteredItems = allMonthItemsCache.filter((entry) => {
            if (activeRelatedFilter === "vn") return !isInternationalEvent(entry);
            if (activeRelatedFilter === "intl") return isInternationalEvent(entry);
            return true;
        });

        if (relatedCountEl) relatedCountEl.textContent = `${filteredItems.length} mục`;

        relatedListEl.innerHTML = filteredItems
            .map((item) => {
                const dm = parseDayMonthFromItem(item, currentEventMonth);
                const isCurrent = item === currentSelectedItem;
                const href = buildDetailHref(item, currentEventMonth);
                return `
                    <a
                        href="${href}"
                        class="detail-sidebar__item ${isCurrent ? "is-current" : ""}"
                        ${isCurrent ? 'aria-current="page"' : ""}
                    >
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

        // ✅ ĐÃ FIX: Chỉ tính toán scrollTop bên trong khung #related-events-list, tuyệt đối không dùng scrollIntoView()
        const activeSidebarItem = relatedListEl.querySelector(".detail-sidebar__item.is-current");
        if (activeSidebarItem) {
            const targetScrollTop =
                activeSidebarItem.offsetTop -
                relatedListEl.offsetTop -
                relatedListEl.clientHeight / 2 +
                activeSidebarItem.clientHeight / 2;

            relatedListEl.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: "smooth",
            });
        }
    };

    const initDetailPage = async () => {
        // Đảm bảo cửa sổ trình duyệt luôn ở vị trí trên cùng (top: 0) khi bắt đầu khởi tạo trang
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get("type") || "figures";
        const folderParam = params.get("folder") || "nguyen-thi-minh-khai";
        const slugParam = params.get("slug") || "nguyen-thi-minh-khai-01-11-1910-28-08-1941";
        const monthParam = Number(params.get("month")) || 11;
        const dayParam = Number(params.get("day")) || null;

        currentEventMonth = monthParam;
        allMonthItemsCache = await fetchMonthData(monthParam);

        currentSelectedItem =
            allMonthItemsCache.find((entry) => entry.image_slug === slugParam || entry.slug === slugParam) ||
            allMonthItemsCache.find((entry) => String(entry.image_slug || "").startsWith(folderParam)) ||
            (dayParam
                ? allMonthItemsCache.find((entry) => {
                      const dm = parseDayMonthFromItem(entry, monthParam);
                      return dm.day === dayParam;
                  })
                : null) ||
            allMonthItemsCache[0] ||
            null;

        const { day: eventDay, month: eventMonth } = parseDayMonthFromItem(currentSelectedItem, monthParam);
        const currentYear = 2026;
        const calendarJumpUrl = `./index.html?date=${currentYear}-${pad(eventMonth)}-${pad(eventDay)}`;

        document.getElementById("detail-back-link")?.setAttribute("href", calendarJumpUrl);
        document.getElementById("article-view-on-cal-btn")?.setAttribute("href", calendarJumpUrl);

        // Nút Sự kiện Trước / Tiếp theo trên thanh điều hướng đầu trang
        if (allMonthItemsCache.length > 0 && currentSelectedItem) {
            const currentIndex = allMonthItemsCache.indexOf(currentSelectedItem);
            const prevIndex = (currentIndex - 1 + allMonthItemsCache.length) % allMonthItemsCache.length;
            const nextIndex = (currentIndex + 1) % allMonthItemsCache.length;

            document
                .getElementById("detail-prev-item-btn")
                ?.setAttribute("href", buildDetailHref(allMonthItemsCache[prevIndex], eventMonth));
            document
                .getElementById("detail-next-item-btn")
                ?.setAttribute("href", buildDetailHref(allMonthItemsCache[nextIndex], eventMonth));
        }

        const isEventCategory =
            typeParam === "events" ||
            String(currentSelectedItem?.category_id || "")
                .toLowerCase()
                .includes("event") ||
            String(currentSelectedItem?.category_id || "")
                .toLowerCase()
                .includes("su-kien");

        const titleText = currentSelectedItem?.ten || "Nguyễn Thị Minh Khai";
        const occasionText =
            currentSelectedItem?.hien_thi_nhan_dip ||
            `Sự kiện & Nhân vật lịch sử ngày ${pad(eventDay)}/${pad(eventMonth)}`;
        const rawSlug = currentSelectedItem?.image_slug || slugParam;
        const resolvedFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || folderParam;

        document.title = `${titleText} - Lịch Phong Thủy`;

        document.getElementById("article-cat-badge").textContent = isEventCategory
            ? "Sự kiện lịch sử"
            : "Nhân vật lịch sử";
        document.getElementById("article-date-badge").textContent = `Ngày ${pad(eventDay)}/${pad(eventMonth)}`;
        document.getElementById("article-occasion-text").textContent = occasionText;
        document.getElementById("article-main-title").textContent = titleText;
        document.getElementById("article-type-label").textContent = isEventCategory
            ? "Sự kiện Trọng đại"
            : "Danh nhân Việt Nam";

        const quoteTextEl = document.getElementById("article-quote-text");
        const quoteAuthorEl = document.getElementById("article-quote-author");
        const rawQuote = (currentSelectedItem?.quote || currentSelectedItem?.danh_ngon || "").trim();
        if (quoteTextEl) {
            quoteTextEl.textContent = rawQuote
                ? rawQuote.startsWith('"')
                    ? rawQuote
                    : `"${rawQuote}"`
                : `"${occasionText}"`;
        }
        if (quoteAuthorEl) {
            quoteAuthorEl.textContent = `— ${currentSelectedItem?.tac_gia || titleText}`;
        }

        // Đồng bộ 4 Bento Stat Cards bằng window.LunarEngine (Con Giáp + Ngũ Hành)
        document.getElementById("article-solar-date").textContent =
            `${pad(eventDay)}/${pad(eventMonth)}/${currentYear}`;

        if (window.LunarEngine) {
            const info = window.LunarEngine.getFullDayInfo(eventDay, eventMonth, currentYear);

            document.getElementById("article-weekday-sub").textContent = info.bilingualWeekday;
            document.getElementById("article-lunar-date").textContent =
                `${pad(info.lunarDay)}/${pad(info.lunarMonth)} ${info.yearCanChi}`;
            document.getElementById("article-lunar-month-sub").textContent = info.lunarMonthFullLabel;

            const yearZodiacPath = `./assets/icons/zodiac/${info.yearZodiacFile}.svg`;
            document.getElementById("article-year-zodiac-icon")?.setAttribute("src", yearZodiacPath);
            document.getElementById("article-year-zodiac-bg")?.setAttribute("src", yearZodiacPath);

            const dayZodiacPath = `./assets/icons/zodiac/${info.zodiacFile}.svg`;
            document.getElementById("article-day-zodiac-icon")?.setAttribute("src", dayZodiacPath);
            document.getElementById("article-day-zodiac-bg")?.setAttribute("src", dayZodiacPath);
            document.getElementById("article-canchi-date").textContent = `Ngày ${info.dayCanChi}`;
            document.getElementById("article-fortune-sub").textContent =
                info.fortuneStatus === "good"
                    ? "🌟 Ngày Hoàng Đạo"
                    : info.fortuneStatus === "bad"
                      ? "🌙 Ngày Hắc Đạo"
                      : `Tháng ${info.monthCanChi}`;

            document
                .getElementById("article-element-icon")
                ?.setAttribute("src", `./assets/icons/${info.elementInfo.icon}`);
            document.getElementById("article-napam-val").textContent = info.dayNapAm;
            document.getElementById("article-term-sub").textContent =
                `Tiết ${info.solarTerm} • Trực ${info.trucObj.name}`;
        }

        // Nạp ảnh Hero 16:9 & Gắn sự kiện phóng to Lightbox
        const heroImgEl = document.getElementById("article-hero-img");
        const heroFigureEl = document.getElementById("detail-hero-figure");
        setHeroImageWithFallback(
            heroImgEl,
            isEventCategory ? "events" : "figures",
            resolvedFolder,
            eventMonth,
            rawSlug,
            titleText,
        );

        if (heroFigureEl && heroImgEl) {
            heroFigureEl.onclick = () => openLightbox(heroImgEl.src, occasionText);
        }

        // Đổ nội dung bài viết
        const bodyEl = document.getElementById("article-body-content");
        if (bodyEl) {
            const rawDesc =
                currentSelectedItem?.mo_ta ||
                currentSelectedItem?.noi_dung ||
                currentSelectedItem?.description ||
                occasionText;
            const paragraphs = String(rawDesc)
                .split(/\n+/)
                .map((p) => p.trim())
                .filter(Boolean);

            bodyEl.innerHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");
        }

        renderActorGallery(
            currentSelectedItem,
            isEventCategory ? "events" : "figures",
            resolvedFolder,
            eventMonth,
            rawSlug,
        );

        const sourcesListEl = document.getElementById("article-sources-list");
        if (sourcesListEl) {
            const sources = Array.isArray(currentSelectedItem?.historical_sources)
                ? currentSelectedItem.historical_sources
                : currentSelectedItem?.nguon_su_lieu
                  ? [currentSelectedItem.nguon_su_lieu]
                  : ["Đại cương Lịch sử Việt Nam", "Bảo tàng Lịch sử Quốc gia Việt Nam"];

            sourcesListEl.innerHTML = sources
                .map((src) => {
                    const label =
                        typeof src === "string" ? src : src.ten_nguon || src.title || src.name || "Tài liệu lịch sử";
                    return `<li class="detail-sources__item">${label}</li>`;
                })
                .join("");
        }

        // Bộ lọc Tất cả / Việt Nam / Quốc tế trên Cột Phải
        document.getElementById("related-month-title").textContent = `Sự kiện Tháng ${eventMonth}`;
        document.querySelectorAll(".detail-sidebar__filter-btn").forEach((btn) => {
            btn.onclick = () => {
                activeRelatedFilter = btn.dataset.relatedFilter || "all";
                document.querySelectorAll(".detail-sidebar__filter-btn").forEach((b) => {
                    b.classList.toggle("is-active", b === btn);
                });
                renderRelatedSidebarList();
            };
        });

        renderRelatedSidebarList();

        // Nút Sao chép liên kết chia sẻ
        const copyBtn = document.getElementById("detail-copy-link-btn");
        const copyLabel = document.getElementById("detail-copy-label");
        if (copyBtn && copyLabel) {
            copyBtn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    copyLabel.textContent = "Đã sao chép!";
                    setTimeout(() => {
                        copyLabel.textContent = "Chia sẻ";
                    }, 2000);
                } catch (e) {
                    copyLabel.textContent = "Chia sẻ";
                }
            };
        }

        // Sự kiện đóng Lightbox
        document.getElementById("detail-lightbox-close")?.addEventListener("click", closeLightbox);
        document.getElementById("detail-lightbox-backdrop")?.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    };

    // Giữ trạng thái Active cho mục "Ngày - tháng" trên Sidebar khi đang ở trang detail.html
    const keepSidebarActiveOnDetail = () => {
        const homeSidebarLink = document.querySelector('.sidebar__link[data-nav-page="index.html"]');
        if (homeSidebarLink) {
            homeSidebarLink.classList.add("sidebar__link--active");
            homeSidebarLink.setAttribute("aria-current", "page");
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        initDetailPage();
        keepSidebarActiveOnDetail();
    });
    window.addEventListener("template-loaded", keepSidebarActiveOnDetail);
})();
