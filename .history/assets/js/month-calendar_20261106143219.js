// assets/js/month-calendar.js
// Chuyên trách duy nhất Trang chủ (index.html): Lưới 42 ô ngày, Tờ Lịch Bloc & API ./api/thang-${month}.json
(() => {
    const DEFAULT_COVER_IMG =
        "./assets/images/calendar-covers/thang-11/nguyen-thi-minh-khai-01-11-1910-28-08-1941.jpg";

    let currentYearNumber = 2026;
    let currentMonthNumber = 11;
    let selectedSolarDay = 3;

    const monthApiCache = new Map();
    let activeDayVnEvents = [];
    let activeDayIntlEvents = [];
    let currentVnEventIndex = 0;
    let currentIntlEventIndex = 0;

    const fetchMonthHistoryData = async (monthNum) => {
        const m = Number(monthNum) || 11;
        if (monthApiCache.has(m)) return monthApiCache.get(m);

        const paddedMonth = String(m).padStart(2, "0");
        const candidatePaths = [`./api/thang-${m}.json`, `./api/thang-${paddedMonth}.json`];

        for (const path of candidatePaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    const normalized = Array.isArray(data) ? data : data?.data || data?.events || [];
                    monthApiCache.set(m, normalized);
                    return normalized;
                }
            } catch (err) {
                // Thử đường dẫn tiếp theo
            }
        }

        monthApiCache.set(m, []);
        return [];
    };

    const buildDetailUrlFromItem = (item, monthNum) => {
        if (!item) return "./detail.html";
        const rawSlug = item.image_slug || item.slug || "";
        const cleanActorFolder = rawSlug.replace(/-\d{2}-\d{2}-\d{4}.*$/, "") || rawSlug;
        const catStr = String(item.category_id || item.loai || "").toLowerCase();
        const typeFolder = catStr.includes("event") || catStr.includes("su-kien") ? "events" : "figures";

        const params = new URLSearchParams({
            type: typeFolder,
            folder: cleanActorFolder,
            slug: rawSlug,
            month: String(monthNum),
        });
        return `./detail.html?${params.toString()}`;
    };

    const setCoverImageWithFallback = (imgEl, monthNum, imageSlug, altText) => {
        if (!imgEl) return;
        if (altText) imgEl.alt = altText;

        if (!imageSlug) {
            imgEl.onerror = null;
            imgEl.src = DEFAULT_COVER_IMG;
            return;
        }

        const fileNameOnly = imageSlug.split("/").pop().trim();
        const cleanSlug = fileNameOnly.replace(/\.(jpg|jpeg|png|webp)$/i, "");
        const basePath = `./assets/images/calendar-covers/thang-${monthNum}/${cleanSlug}`;

        imgEl.onerror = () => {
            imgEl.onerror = () => {
                imgEl.onerror = null;
                imgEl.src = DEFAULT_COVER_IMG;
            };
            imgEl.src = `${basePath}.webp`;
        };

        imgEl.src = `${basePath}.jpg`;
    };

    const renderHistoryItemToBloc = (item, monthNum, solarDay) => {
        const imgEl = document.getElementById("detail-history-img");
        const mediaLinkEl = document.getElementById("detail-history-link");
        const captionLinkEl = document.getElementById("detail-history-caption");
        const captionTextEl = document.getElementById("detail-history-caption-text");
        const quoteTextEl =
            document.getElementById("detail-quote-text") || document.querySelector(".fengshui-quote__text");
        const quoteAuthorEl =
            document.getElementById("detail-quote-author") || document.querySelector(".fengshui-quote__author");

        const paddedDay = String(solarDay).padStart(2, "0");
        const paddedMonth = String(monthNum).padStart(2, "0");

        if (!item) {
            if (imgEl) {
                imgEl.onerror = null;
                imgEl.src = DEFAULT_COVER_IMG;
            }
            if (captionTextEl) {
                captionTextEl.textContent = `Sự kiện & Nhân vật lịch sử ngày ${paddedDay}/${paddedMonth}`;
            }
            if (mediaLinkEl) mediaLinkEl.href = `./detail.html?day=${solarDay}&month=${monthNum}`;
            if (captionLinkEl) captionLinkEl.href = `./detail.html?day=${solarDay}&month=${monthNum}`;
            if (quoteTextEl) {
                quoteTextEl.textContent = '"Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."';
            }
            if (quoteAuthorEl) {
                quoteAuthorEl.textContent = "- Chủ tịch Hồ Chí Minh -";
            }
            return;
        }

        const occasionText =
            item.hien_thi_nhan_dip || item.ten || `Sự kiện lịch sử ngày ${paddedDay}/${paddedMonth}`;
        const detailHref = buildDetailUrlFromItem(item, monthNum);

        setCoverImageWithFallback(imgEl, monthNum, item.image_slug || item.slug, occasionText);

        if (captionTextEl) captionTextEl.textContent = occasionText;
        if (mediaLinkEl) mediaLinkEl.href = detailHref;
        if (captionLinkEl) captionLinkEl.href = detailHref;

        if (quoteTextEl) {
            const rawQuote = (item.quote || item.danh_ngon || "").trim();
            quoteTextEl.textContent = rawQuote
                ? rawQuote.startsWith('"')
                    ? rawQuote
                    : `"${rawQuote}"`
                : `"${occasionText}"`;
        }

        if (quoteAuthorEl) {
            const authorName = item.ten || item.tac_gia || "Lịch sử Việt Nam";
            quoteAuthorEl.textContent = `- ${authorName} -`;
        }
    };

    const updateHistoryForSelectedDate = async (solarDay, monthNum) => {
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const sameDayLabel = document.getElementById("label-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");
        const intlLabel = document.getElementById("label-intl-events");

        const paddedDay = String(solarDay).padStart(2, "0");
        const paddedMonth = String(monthNum).padStart(2, "0");
        const targetDatePadded = `${paddedDay}/${paddedMonth}`;
        const targetDateShort = `${Number(solarDay)}/${Number(monthNum)}`;
        const targetSlugDate = `-${paddedDay}-${paddedMonth}-`;

        const allMonthItems = await fetchMonthHistoryData(monthNum);

        const matchedItems = allMonthItems.filter((entry) => {
            const displayDate = String(entry.ngay_hien_thi || entry.ngay_duong || entry.date || "").trim();
            const occasionStr = String(entry.hien_thi_nhan_dip || "");
            const slugStr = String(entry.image_slug || "");

            return (
                displayDate.startsWith(targetDatePadded) ||
                displayDate.startsWith(targetDateShort) ||
                displayDate === String(solarDay) ||
                Number(entry.day) === Number(solarDay) ||
                occasionStr.includes(`(${targetDatePadded}`) ||
                slugStr.includes(targetSlugDate)
            );
        });

        activeDayIntlEvents = matchedItems.filter((entry) => {
            const scope = String(entry.pham_vi || entry.scope || entry.category_id || "").toLowerCase();
            return Boolean(entry.is_international) || scope.includes("quoc-te") || scope.includes("international");
        });

        activeDayVnEvents = matchedItems.filter((entry) => !activeDayIntlEvents.includes(entry));
        currentVnEventIndex = 0;
        currentIntlEventIndex = 0;

        if (sameDayBtn) {
            if (activeDayVnEvents.length > 1) {
                sameDayBtn.hidden = false;
                sameDayBtn.classList.add("is-active");
                if (sameDayLabel) {
                    sameDayLabel.textContent = `Sự kiện cùng ngày (${activeDayVnEvents.length})`;
                }
            } else {
                sameDayBtn.hidden = true;
                sameDayBtn.classList.remove("is-active");
            }
        }

        if (intlBtn) {
            if (activeDayIntlEvents.length > 0) {
                intlBtn.hidden = false;
                intlBtn.classList.remove("is-active");
                if (intlLabel) {
                    intlLabel.textContent = `Sự kiện quốc tế (${activeDayIntlEvents.length})`;
                }
            } else {
                intlBtn.hidden = true;
                intlBtn.classList.remove("is-active");
            }
        }

        const primaryItem = activeDayVnEvents[0] || activeDayIntlEvents[0] || null;
        renderHistoryItemToBloc(primaryItem, monthNum, solarDay);
    };

    const syncCellToBlocCard = (cell) => {
        if (!window.LunarEngine) return;

        const sDay = Number(cell.dataset.solar) || 1;
        const sMonth = Number(cell.dataset.month) || currentMonthNumber;
        const sYear = Number(cell.dataset.year) || currentYearNumber;

        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);

        document.getElementById("detail-solar-year").textContent = String(sYear);
        document.getElementById("detail-solar-month-vn").textContent = info.solarMonthVnLabel;
        document.getElementById("detail-solar-month-en").textContent = info.solarMonthEnLabel;
        document.getElementById("detail-solar-day").textContent = String(sDay);
        document.getElementById("detail-lunar-year").textContent = `NĂM ${info.yearCanChi.toUpperCase()}`;
        document.getElementById("detail-weekday").textContent = info.bilingualWeekday;

        const statusEl = document.getElementById("detail-day-status");
        if (statusEl) {
            if (info.badgeText) {
                statusEl.textContent = `Ngày ${info.badgeText}`;
            } else if (info.fortuneStatus === "good") {
                statusEl.textContent = "Ngày Hoàng Đạo";
            } else if (info.fortuneStatus === "bad") {
                statusEl.textContent = "Ngày Hắc Đạo";
            } else {
                statusEl.textContent = "Ngày bình thường";
            }
        }

        document.getElementById("detail-lunar-day").textContent = String(info.lunarDay);
        document.getElementById("detail-lunar-month").textContent = info.lunarMonthFullLabel;
        document.getElementById("detail-canchi-month").textContent = `Tháng ${info.monthCanChi}`;
        document.getElementById("detail-canchi-day").textContent = `Ngày ${info.dayCanChi}`;
        document.getElementById("detail-canchi-hour").textContent = `Giờ ${info.ratHourCanChi}`;
        document.getElementById("detail-element").textContent = info.dayNapAm;
        document.getElementById("detail-solar-term").textContent = info.solarTerm;
        document.getElementById("detail-truc-name").textContent = info.trucObj.name;

        document.getElementById("detail-good-hours").textContent = info.goodHoursStr;
        document.getElementById("detail-bad-hours").textContent = info.badHoursStr;
        document.getElementById("detail-truc-title").textContent = info.trucObj.name;
        document.getElementById("detail-truc-desc").textContent = info.trucObj.desc;
        document.getElementById("detail-age-good").textContent = info.ageHarmony.good;
        document.getElementById("detail-age-bad").textContent = info.ageHarmony.bad;

        updateHistoryForSelectedDate(sDay, sMonth);
    };

    const syncToolbarDropdownUI = (monthNum, yearNum) => {
        const monthDropdown = document.getElementById("cal-month-dropdown");
        const yearDropdown = document.getElementById("cal-year-dropdown");
        const monthLabel = document.getElementById("cal-month-label");
        const yearLabel = document.getElementById("cal-year-label");

        if (monthLabel) monthLabel.textContent = `Tháng ${monthNum}`;
        if (yearLabel) yearLabel.textContent = String(yearNum);

        if (monthDropdown) {
            monthDropdown.querySelector(".month-cal__summary")?.setAttribute(
                "aria-label",
                `Chọn tháng, hiện tại là Tháng ${monthNum}`,
            );
            monthDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                const isSelected = Number(opt.dataset.month) === Number(monthNum);
                opt.classList.toggle("is-selected", isSelected);
                if (isSelected) opt.setAttribute("aria-selected", "true");
                else opt.removeAttribute("aria-selected");
            });
        }

        if (yearDropdown) {
            yearDropdown.querySelector(".month-cal__summary")?.setAttribute(
                "aria-label",
                `Chọn năm, hiện tại là ${yearNum}`,
            );
            const yearList = yearDropdown.querySelector(".month-cal__dropdown-menu--year");

            if (yearList && !yearList.querySelector(`[data-year="${yearNum}"]`)) {
                const li = document.createElement("li");
                const btn = document.createElement("button");
                btn.type = "button";
                btn.dataset.year = String(yearNum);
                btn.className = "month-cal__option";
                btn.textContent = String(yearNum);
                li.appendChild(btn);
                yearList.appendChild(li);
            }

            yearDropdown.querySelectorAll(".month-cal__option").forEach((opt) => {
                const isSelected = Number(opt.dataset.year) === Number(yearNum);
                opt.classList.toggle("is-selected", isSelected);
                if (isSelected) opt.setAttribute("aria-selected", "true");
                else opt.removeAttribute("aria-selected");
            });
        }
    };

    const renderMonthCalendarGrid = (yearNum, monthNum, preferredActiveDay = null) => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid || !window.LunarEngine) return;

        currentYearNumber = Number(yearNum);
        currentMonthNumber = Number(monthNum);
        syncToolbarDropdownUI(currentMonthNumber, currentYearNumber);

        const firstDayJs = new Date(currentYearNumber, currentMonthNumber - 1, 1).getDay();
        const leadingMutedCount = (firstDayJs + 6) % 7;
        const daysInCurrentMonth = new Date(currentYearNumber, currentMonthNumber, 0).getDate();

        const prevMonth = currentMonthNumber === 1 ? 12 : currentMonthNumber - 1;
        const prevYear = currentMonthNumber === 1 ? currentYearNumber - 1 : currentYearNumber;
        const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

        const nextMonth = currentMonthNumber === 12 ? 1 : currentMonthNumber + 1;
        const nextYear = currentMonthNumber === 12 ? currentYearNumber + 1 : currentYearNumber;

        const realNow = new Date();
        const realDay = realNow.getDate();
        const realMonth = realNow.getMonth() + 1;
        const realYear = realNow.getFullYear();

        let targetActiveDay = preferredActiveDay;
        if (!targetActiveDay) {
            targetActiveDay =
                currentYearNumber === realYear && currentMonthNumber === realMonth ? realDay : 1;
        }
        if (targetActiveDay > daysInCurrentMonth) targetActiveDay = daysInCurrentMonth;
        selectedSolarDay = targetActiveDay;

        const fragment = document.createDocumentFragment();
        const generatedCells = [];
        let activeCellRef = null;

        for (let i = 0; i < 42; i++) {
            let cellDay;
            let cellMonth;
            let cellYear;
            let isMuted = false;

            if (i < leadingMutedCount) {
                cellDay = daysInPrevMonth - leadingMutedCount + 1 + i;
                cellMonth = prevMonth;
                cellYear = prevYear;
                isMuted = true;
            } else if (i < leadingMutedCount + daysInCurrentMonth) {
                cellDay = i - leadingMutedCount + 1;
                cellMonth = currentMonthNumber;
                cellYear = currentYearNumber;
            } else {
                cellDay = i - (leadingMutedCount + daysInCurrentMonth) + 1;
                cellMonth = nextMonth;
                cellYear = nextYear;
                isMuted = true;
            }

            const dayInfo = window.LunarEngine.getFullDayInfo(cellDay, cellMonth, cellYear);
            const isToday = cellDay === realDay && cellMonth === realMonth && cellYear === realYear;
            const isActive = !isMuted && cellDay === targetActiveDay;

            const statusTokens = [];
            if (dayInfo.fortuneStatus) statusTokens.push(dayInfo.fortuneStatus);
            if (dayInfo.isHoliday) statusTokens.push("holiday");
            if (isToday) statusTokens.push("today");

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "month-cal__cell";
            if (isMuted) btn.classList.add("month-cal__cell--muted");
            if (isToday) btn.classList.add("month-cal__cell--today");
            if (isActive) {
                btn.classList.add("month-cal__cell--active");
                btn.setAttribute("aria-current", "date");
                activeCellRef = btn;
            }

            btn.dataset.solar = String(cellDay);
            btn.dataset.month = String(cellMonth);
            btn.dataset.year = String(cellYear);
            btn.dataset.lunar = `${dayInfo.lunarDay}/${dayInfo.lunarMonth}`;
            if (statusTokens.length > 0) btn.dataset.status = statusTokens.join(" ");

            const badgeHtml = dayInfo.badgeText
                ? `<span class="month-cal__badge">${dayInfo.badgeText}</span>`
                : "";

            let dotsInnerHtml = "";
            if (dayInfo.fortuneStatus === "good") {
                dotsInnerHtml += `<span class="month-cal__dot month-cal__dot--good"></span>`;
            } else if (dayInfo.fortuneStatus === "bad") {
                dotsInnerHtml += `<span class="month-cal__dot month-cal__dot--bad"></span>`;
            }
            if (dayInfo.isHoliday) {
                dotsInnerHtml += `<span class="month-cal__dot month-cal__dot--holiday"></span>`;
            }

            btn.innerHTML = `
                ${badgeHtml}
                <div class="month-cal__date-head">
                    <span class="month-cal__solar">${cellDay}</span>
                    <span class="month-cal__lunar">${dayInfo.lunarDay}/${dayInfo.lunarMonth}</span>
                </div>
                <div class="month-cal__dots">${dotsInnerHtml}</div>
                <img
                    src="./assets/icons/zodiac/${dayInfo.zodiacFile}.svg"
                    alt=""
                    aria-hidden="true"
                    class="month-cal__zodiac-img"
                />
            `;

            btn.onclick = () => {
                if (isMuted) {
                    renderMonthCalendarGrid(cellYear, cellMonth, cellDay);
                    return;
                }

                generatedCells.forEach((item) => {
                    item.classList.remove("month-cal__cell--active");
                    item.removeAttribute("aria-current");
                });

                btn.classList.add("month-cal__cell--active");
                btn.setAttribute("aria-current", "date");
                selectedSolarDay = cellDay;
                syncCellToBlocCard(btn);
            };

            generatedCells.push(btn);
            fragment.appendChild(btn);
        }

        grid.innerHTML = "";
        grid.appendChild(fragment);

        if (activeCellRef) syncCellToBlocCard(activeCellRef);
    };

    const initMonthCalendar = () => {
        const grid = document.getElementById("month-cal-grid");
        if (!grid || grid.dataset.bound === "true") return;
        grid.dataset.bound = "true";

        const prevMonthBtn = document.getElementById("cal-prev-month");
        const nextMonthBtn = document.getElementById("cal-next-month");
        const todayBtn = document.getElementById("cal-today-btn");
        const calDropdowns = document.querySelectorAll(".js-cal-dropdown");
        const legendPills = document.querySelectorAll(".month-cal__legend-pill");
        const sameDayBtn = document.getElementById("btn-same-day-events");
        const intlBtn = document.getElementById("btn-intl-events");

        if (prevMonthBtn) {
            prevMonthBtn.onclick = () => {
                const targetMonth = currentMonthNumber === 1 ? 12 : currentMonthNumber - 1;
                const targetYear = currentMonthNumber === 1 ? currentYearNumber - 1 : currentYearNumber;
                renderMonthCalendarGrid(targetYear, targetMonth, null);
            };
        }

        if (nextMonthBtn) {
            nextMonthBtn.onclick = () => {
                const targetMonth = currentMonthNumber === 12 ? 1 : currentMonthNumber + 1;
                const targetYear = currentMonthNumber === 12 ? currentYearNumber + 1 : currentYearNumber;
                renderMonthCalendarGrid(targetYear, targetMonth, null);
            };
        }

        if (todayBtn) {
            todayBtn.onclick = () => {
                const now = new Date();
                renderMonthCalendarGrid(now.getFullYear(), now.getMonth() + 1, now.getDate());
            };
        }

        if (sameDayBtn) {
            sameDayBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayVnEvents.length) return;

                currentVnEventIndex = (currentVnEventIndex + 1) % activeDayVnEvents.length;
                sameDayBtn.classList.add("is-active");
                intlBtn?.classList.remove("is-active");

                renderHistoryItemToBloc(
                    activeDayVnEvents[currentVnEventIndex],
                    currentMonthNumber,
                    selectedSolarDay,
                );
            };
        }

        if (intlBtn) {
            intlBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!activeDayIntlEvents.length) return;

                const nextItem = activeDayIntlEvents[currentIntlEventIndex];
                currentIntlEventIndex = (currentIntlEventIndex + 1) % activeDayIntlEvents.length;
                intlBtn.classList.add("is-active");
                sameDayBtn?.classList.remove("is-active");

                renderHistoryItemToBloc(nextItem, currentMonthNumber, selectedSolarDay);
            };
        }

        calDropdowns.forEach((current) => {
            current.ontoggle = () => {
                if (current.open) {
                    document.querySelectorAll(".js-header-dropdown[open], .js-cal-dropdown[open]").forEach((other) => {
                        if (other !== current) other.removeAttribute("open");
                    });
                }
            };

            current.onclick = (e) => {
                const opt = e.target.closest(".month-cal__option");
                if (!opt) return;
                e.stopPropagation();

                const nextMonth = opt.dataset.month ? Number(opt.dataset.month) : currentMonthNumber;
                const nextYear = opt.dataset.year ? Number(opt.dataset.year) : currentYearNumber;

                current.removeAttribute("open");
                renderMonthCalendarGrid(nextYear, nextMonth, null);
            };
        });

        const highlightCellsByStatus = (statusKey) => {
            grid.querySelectorAll(".month-cal__cell").forEach((cell) => {
                if (!statusKey) {
                    cell.classList.remove("is-dimmed", "is-highlighted");
                    return;
                }
                const cellStatus = cell.dataset.status || "";
                const isMatch = cellStatus.split(" ").includes(statusKey);
                cell.classList.toggle("is-highlighted", isMatch);
                cell.classList.toggle("is-dimmed", !isMatch);
            });
        };

        legendPills.forEach((pill) => {
            const filterKey = pill.dataset.filter;
            pill.onmouseenter = () => highlightCellsByStatus(filterKey);
            pill.onmouseleave = () => highlightCellsByStatus(null);
            pill.onfocus = () => highlightCellsByStatus(filterKey);
            pill.onblur = () => highlightCellsByStatus(null);
        });

        // ✅ ĐẶT Ở ĐÂY (Bên trong initMonthCalendar, thay thế cho dòng renderMonthCalendarGrid cũ):
        window.addEventListener("converter-jump-to-date", (e) => {
            if (e.detail) {
                renderMonthCalendarGrid(e.detail.year, e.detail.month, e.detail.day);
            }
        });

        const urlDateParam = new URLSearchParams(window.location.search).get("date");
        if (urlDateParam && /^\d{4}-\d{2}-\d{2}$/.test(urlDateParam)) {
            const [y, m, d] = urlDateParam.split("-").map(Number);
            renderMonthCalendarGrid(y, m, d);
        } else {
            renderMonthCalendarGrid(currentYearNumber, currentMonthNumber, selectedSolarDay);
        }
    }; // <--- Dấu đóng của hàm initMonthCalendar nằm ở đây!

    // Dòng lắng nghe sự kiện khởi tạo luôn nằm dưới cùng:
    document.addEventListener("DOMContentLoaded", initMonthCalendar);

    
})();