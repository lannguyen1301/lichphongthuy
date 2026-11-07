// assets/js/converter-modal.js
// Chuyên trách duy nhất Bento Modal Đổi Ngày Âm ⇄ Dương (Không chứa công thức lặp nhờ gọi window.LunarEngine)
(() => {
    let isModalKeyBound = false;
    let convertMode = "solar2lunar"; // "solar2lunar" | "lunar2solar"
    let selectedInputDay = 6;
    let selectedInputMonth = 11;
    let selectedInputYear = 2026;
    let yearGridStart = 2020;
    let resolvedSolarDate = { day: 6, month: 11, year: 2026 };

    const pad = (n) => String(n).padStart(2, "0");

    const VI_SOLAR_MONTH_NAMES = [
        "",
        "Tháng Một",
        "Tháng Hai",
        "Tháng Ba",
        "Tháng Tư",
        "Tháng Năm",
        "Tháng Sáu",
        "Tháng Bảy",
        "Tháng Tám",
        "Tháng Chín",
        "Tháng Mười",
        "Tháng Mười Một",
        "Tháng Mười Hai",
    ];

    const VI_LUNAR_MONTH_NAMES = [
        "",
        "Tháng Giêng",
        "Tháng Hai",
        "Tháng Ba",
        "Tháng Tư",
        "Tháng Năm",
        "Tháng Sáu",
        "Tháng Bảy",
        "Tháng Tám",
        "Tháng Chín",
        "Tháng Mười",
        "Tháng Mười Một",
        "Tháng Chạp",
    ];

    const toggleConverterModal = (forceOpen = null) => {
        const modal = document.getElementById("converter-modal");
        const triggerBtn = document.getElementById("widget-trigger-btn");
        if (!modal) return;

        const shouldOpen = forceOpen !== null ? forceOpen : modal.hidden;
        modal.hidden = !shouldOpen;

        if (triggerBtn) {
            triggerBtn.classList.toggle("is-active", shouldOpen);
            triggerBtn.setAttribute("aria-expanded", String(shouldOpen));
        }

        document.body.style.overflow = shouldOpen ? "hidden" : "";
    };

    window.openConverterModal = toggleConverterModal;

    const renderCustomBentoPickers = () => {
        const dayListEl = document.getElementById("conv-day-list");
        const monthListEl = document.getElementById("conv-month-list");
        const yearListEl = document.getElementById("conv-year-list");
        const dayTextEl = document.getElementById("conv-day-text");
        const monthTextEl = document.getElementById("conv-month-text");
        const yearTextEl = document.getElementById("conv-year-text");
        const yearRangeLabel = document.getElementById("conv-year-range-label");

        if (!dayListEl || !monthListEl || !yearListEl) return;

        const maxDays =
            convertMode === "solar2lunar" ? new Date(selectedInputYear, selectedInputMonth, 0).getDate() : 30;

        if (selectedInputDay > maxDays) selectedInputDay = maxDays;

        if (dayTextEl) dayTextEl.textContent = `Ngày ${pad(selectedInputDay)}`;
        if (monthTextEl) monthTextEl.textContent = `Tháng ${pad(selectedInputMonth)}`;
        if (yearTextEl) yearTextEl.textContent = `Năm ${selectedInputYear}`;

        let daysHtml = "";
        for (let d = 1; d <= maxDays; d++) {
            const isSel = d === selectedInputDay;
            daysHtml += `<li><button type="button" role="option" aria-selected="${isSel}" data-conv-day="${d}" class="converter-modal__option-btn ${isSel ? "is-selected" : ""}">${pad(d)}</button></li>`;
        }
        dayListEl.innerHTML = daysHtml;

        let monthsHtml = "";
        for (let m = 1; m <= 12; m++) {
            const isSel = m === selectedInputMonth;
            monthsHtml += `<li><button type="button" role="option" aria-selected="${isSel}" data-conv-month="${m}" class="converter-modal__option-btn ${isSel ? "is-selected" : ""}">Tháng ${m}</button></li>`;
        }
        monthListEl.innerHTML = monthsHtml;

        if (yearRangeLabel) yearRangeLabel.textContent = `${yearGridStart} - ${yearGridStart + 11}`;
        let yearsHtml = "";
        for (let y = yearGridStart; y < yearGridStart + 12; y++) {
            const isSel = y === selectedInputYear;
            yearsHtml += `<li><button type="button" role="option" aria-selected="${isSel}" data-conv-year="${y}" class="converter-modal__option-btn ${isSel ? "is-selected" : ""}">${y}</button></li>`;
        }
        yearListEl.innerHTML = yearsHtml;
    };

    const syncLeapToggleUI = (lunarLeapFromResult = 0) => {
        const leapToggleBtn = document.getElementById("conv-leap-toggle-btn");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const leapStatusText = document.getElementById("conv-leap-status-text");
        if (!leapToggleBtn || !leapCheckbox || !leapStatusText) return;

        if (convertMode === "solar2lunar") {
            leapToggleBtn.classList.add("is-disabled");
            leapToggleBtn.classList.remove("is-active");
            leapCheckbox.checked = Boolean(lunarLeapFromResult);
            leapToggleBtn.setAttribute("aria-pressed", String(Boolean(lunarLeapFromResult)));
            leapStatusText.textContent = lunarLeapFromResult ? "Tự động (Tháng nhuận)" : "Tự động (Tháng thường)";
        } else {
            leapToggleBtn.classList.remove("is-disabled");
            const isChecked = Boolean(leapCheckbox.checked);
            leapToggleBtn.classList.toggle("is-active", isChecked);
            leapToggleBtn.setAttribute("aria-pressed", String(isChecked));
            leapStatusText.textContent = isChecked ? "Đang chọn: Tháng Nhuận" : "Tính theo: Tháng thường";
        }
    };

    const runConversionAndRender = () => {
        if (!window.LunarEngine) return;

        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const isLeapChecked = leapCheckbox?.checked ? 1 : 0;

        let sDay = selectedInputDay;
        let sMonth = selectedInputMonth;
        let sYear = selectedInputYear;

        if (convertMode === "lunar2solar") {
            let converted = window.LunarEngine.convertLunar2Solar(
                selectedInputDay,
                selectedInputMonth,
                selectedInputYear,
                isLeapChecked,
            );
            if (!converted || converted.sDay === 0) {
                if (leapCheckbox) leapCheckbox.checked = false;
                converted = window.LunarEngine.convertLunar2Solar(
                    selectedInputDay,
                    selectedInputMonth,
                    selectedInputYear,
                    0,
                );
            }
            if (converted && converted.sDay > 0) {
                sDay = converted.sDay;
                sMonth = converted.sMonth;
                sYear = converted.sYear;
            }
        }

        resolvedSolarDate = { day: sDay, month: sMonth, year: sYear };
        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);

        syncLeapToggleUI(info.lunarLeap);

        document.getElementById("conv-res-solar").textContent = `${pad(sDay)}/${pad(sMonth)}/${sYear}`;
        document.getElementById("conv-res-weekday").textContent = info.bilingualWeekday;
        document.getElementById("conv-res-solar-full").textContent =
            `${VI_SOLAR_MONTH_NAMES[sMonth]} (${info.solarMonthEnLabel}) • Năm ${sYear}`;

        const lunarTagEl = document.getElementById("conv-res-lunar-tag");
        if (lunarTagEl) {
            const sizeText = info.isFullMonth ? "Tháng Đủ" : "Tháng Thiếu";
            const leapText = info.lunarLeap ? " • Nhuận" : "";
            lunarTagEl.textContent = `Âm lịch • ${sizeText}${leapText}`;
        }

        document.getElementById("conv-res-lunar").textContent =
            `${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear}`;
        document.getElementById("conv-res-year-canchi").textContent = `Năm ${info.yearCanChi}`;
        document.getElementById("conv-res-year-napam").textContent = `Mệnh năm: ${info.yearNapAm}`;
        document
            .getElementById("conv-res-year-zodiac")
            ?.setAttribute("src", `./assets/icons/zodiac/${info.yearZodiacFile}.svg`);

        const dayZodiacPath = `./assets/icons/zodiac/${info.zodiacFile}.svg`;
        const monthZodiacPath = `./assets/icons/zodiac/${info.monthZodiacFile}.svg`;

        document.getElementById("conv-icon-day-zodiac")?.setAttribute("src", dayZodiacPath);
        document.getElementById("conv-bg-day-zodiac")?.setAttribute("src", dayZodiacPath);
        document.getElementById("conv-res-day-canchi").textContent = info.dayCanChi;
        document.getElementById("conv-res-day-status-sub").textContent =
            info.fortuneStatus === "good"
                ? "Ngày Hoàng Đạo"
                : info.fortuneStatus === "bad"
                  ? "Ngày Hắc Đạo"
                  : "Ngày Bình Thường";

        document.getElementById("conv-icon-month-zodiac")?.setAttribute("src", monthZodiacPath);
        document.getElementById("conv-bg-month-zodiac")?.setAttribute("src", monthZodiacPath);
        document.getElementById("conv-res-month-canchi").textContent = info.monthCanChi;
        document.getElementById("conv-res-month-lunar-sub").textContent =
            `${VI_LUNAR_MONTH_NAMES[info.lunarMonth]} (${info.isFullMonth ? "Đủ" : "Thiếu"})`;

        document.getElementById("conv-icon-element")?.setAttribute("src", `./assets/icons/${info.elementInfo.icon}`);
        document.getElementById("conv-res-napam").textContent = info.dayNapAm;
        document.getElementById("conv-res-element-sub").textContent = info.elementInfo.label;

        document.getElementById("conv-res-term").textContent = info.solarTerm;
        document.getElementById("conv-res-truc").textContent = `Trực ${info.trucObj.name} • ${info.trucObj.short}`;

        const fortunePill = document.getElementById("conv-res-fortune-pill");
        const fortuneTitle = document.getElementById("conv-res-fortune-title");
        const hoursGrid = document.getElementById("conv-res-hours-grid");

        if (fortunePill) fortunePill.dataset.fortune = info.fortuneStatus || "normal";
        if (fortuneTitle) {
            fortuneTitle.textContent =
                info.fortuneStatus === "good"
                    ? "Ngày Hoàng Đạo (Tốt)"
                    : info.fortuneStatus === "bad"
                      ? "Ngày Hắc Đạo (Xấu)"
                      : "Ngày Bình Thường";
        }

        if (hoursGrid) {
            hoursGrid.innerHTML = info.goodHourCards
                .map(
                    (card) => `
                        <article class="converter-modal__hour-card" title="Giờ Hoàng Đạo: ${card.hourCanChi} (${card.range})">
                            <div class="converter-modal__hour-top">
                                <span class="converter-modal__hour-dot" aria-hidden="true"></span>
                                <strong class="converter-modal__hour-name">${card.hourCanChi}</strong>
                            </div>
                            <span class="converter-modal__hour-time">${card.range}</span>
                            <img
                                src="./assets/icons/zodiac/${card.icon}"
                                alt=""
                                aria-hidden="true"
                                class="converter-modal__hour-zodiac"
                            />
                        </article>
                    `,
                )
                .join("");
        }
    };

    const setConverterToToday = () => {
        if (!window.LunarEngine) return;
        const now = new Date();
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        if (leapCheckbox) leapCheckbox.checked = false;

        if (convertMode === "solar2lunar") {
            selectedInputDay = now.getDate();
            selectedInputMonth = now.getMonth() + 1;
            selectedInputYear = now.getFullYear();
        } else {
            const lunarToday = window.LunarEngine.convertSolar2Lunar(
                now.getDate(),
                now.getMonth() + 1,
                now.getFullYear(),
            );
            selectedInputDay = lunarToday.lunarDay;
            selectedInputMonth = lunarToday.lunarMonth;
            selectedInputYear = lunarToday.lunarYear;
            if (leapCheckbox) leapCheckbox.checked = Boolean(lunarToday.lunarLeap);
        }

        yearGridStart = Math.floor(selectedInputYear / 12) * 12 - 4;
        renderCustomBentoPickers();
        runConversionAndRender();
    };

    const initConverterModal = () => {
        const modal = document.getElementById("converter-modal");
        const widgetBtn = document.getElementById("widget-trigger-btn");
        if (!modal) return;

        if (widgetBtn) {
            widgetBtn.onclick = (e) => {
                e.preventDefault();
                toggleConverterModal();
            };
        }

        if (modal.dataset.bound === "true") return;
        modal.dataset.bound = "true";

        const closeBtn = document.getElementById("converter-modal-close");
        const backdrop = document.getElementById("converter-modal-backdrop");
        const dayDropdown = document.getElementById("conv-day-dropdown");
        const monthDropdown = document.getElementById("conv-month-dropdown");
        const yearDropdown = document.getElementById("conv-year-dropdown");
        const prevRangeBtn = document.getElementById("conv-year-prev-range");
        const nextRangeBtn = document.getElementById("conv-year-next-range");
        const leapToggleBtn = document.getElementById("conv-leap-toggle-btn");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const swapBtn = document.getElementById("conv-swap-direction-btn");
        const todayBtn = document.getElementById("conv-btn-today");
        const jumpBtn = document.getElementById("conv-btn-jump");
        const tabs = modal.querySelectorAll(".converter-modal__tab");

        if (closeBtn) closeBtn.onclick = () => toggleConverterModal(false);
        if (backdrop) backdrop.onclick = () => toggleConverterModal(false);

        const switchConvertMode = (nextMode) => {
            convertMode = nextMode;
            tabs.forEach((t) => {
                const isMatch = t.dataset.convertMode === convertMode;
                t.classList.toggle("is-active", isMatch);
                t.setAttribute("aria-selected", String(isMatch));
            });

            const isLunarInput = convertMode === "lunar2solar";
            document.getElementById("conv-day-label").textContent = isLunarInput ? "Ngày Âm" : "Ngày Dương";
            document.getElementById("conv-month-label").textContent = isLunarInput ? "Tháng Âm" : "Tháng Dương";
            if (!isLunarInput && leapCheckbox) leapCheckbox.checked = false;

            renderCustomBentoPickers();
            runConversionAndRender();
        };

        tabs.forEach((tab) => {
            tab.onclick = () => switchConvertMode(tab.dataset.convertMode || "solar2lunar");
        });

        if (swapBtn) {
            swapBtn.onclick = () => {
                switchConvertMode(convertMode === "solar2lunar" ? "lunar2solar" : "solar2lunar");
            };
        }

        if (leapToggleBtn && leapCheckbox) {
            leapToggleBtn.onclick = () => {
                if (convertMode !== "lunar2solar") return;
                leapCheckbox.checked = !leapCheckbox.checked;
                runConversionAndRender();
            };
        }

        [dayDropdown, monthDropdown, yearDropdown].forEach((current) => {
            if (!current) return;
            current.ontoggle = () => {
                if (current.open) {
                    [dayDropdown, monthDropdown, yearDropdown].forEach((other) => {
                        if (other && other !== current) other.removeAttribute("open");
                    });
                }
            };
        });

        dayDropdown?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-conv-day]");
            if (!btn) return;
            e.stopPropagation();
            selectedInputDay = Number(btn.dataset.convDay);
            dayDropdown.removeAttribute("open");
            renderCustomBentoPickers();
            runConversionAndRender();
        });

        monthDropdown?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-conv-month]");
            if (!btn) return;
            e.stopPropagation();
            selectedInputMonth = Number(btn.dataset.convMonth);
            monthDropdown.removeAttribute("open");
            renderCustomBentoPickers();
            runConversionAndRender();
        });

        yearDropdown?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-conv-year]");
            if (!btn) return;
            e.stopPropagation();
            selectedInputYear = Number(btn.dataset.convYear);
            yearDropdown.removeAttribute("open");
            renderCustomBentoPickers();
            runConversionAndRender();
        });

        if (prevRangeBtn) {
            prevRangeBtn.onclick = (e) => {
                e.stopPropagation();
                yearGridStart -= 12;
                renderCustomBentoPickers();
            };
        }

        if (nextRangeBtn) {
            nextRangeBtn.onclick = (e) => {
                e.stopPropagation();
                yearGridStart += 12;
                renderCustomBentoPickers();
            };
        }

        if (todayBtn) todayBtn.onclick = setConverterToToday;

        if (jumpBtn) {
            jumpBtn.onclick = () => {
                const { day, month, year } = resolvedSolarDate;
                toggleConverterModal(false);

                if (document.getElementById("month-cal-grid")) {
                    window.dispatchEvent(
                        new CustomEvent("converter-jump-to-date", {
                            detail: { year, month, day },
                        }),
                    );
                    document.getElementById("bloc-media-box")?.scrollIntoView({ behavior: "smooth" });
                } else {
                    window.location.href = `./index.html?date=${year}-${pad(month)}-${pad(day)}`;
                }
            };
        }

        setConverterToToday();
    };

    if (!isModalKeyBound) {
        isModalKeyBound = true;
        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("converter-modal");
            if (e.key === "Escape" && modal && !modal.hidden) {
                toggleConverterModal(false);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", initConverterModal);
    window.addEventListener("template-loaded", initConverterModal);
})();
