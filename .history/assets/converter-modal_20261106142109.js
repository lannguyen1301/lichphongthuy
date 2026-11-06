// assets/js/converter-modal.js
// Chuyên trách Giai đoạn 3: Hộp thoại Đổi Ngày Âm - Dương 2 chiều & Nhảy nhanh tới ngày trên Lịch
(() => {
    let isModalGlobalBound = false;
    let convertMode = "solar2lunar"; // "solar2lunar" | "lunar2solar"
    let resolvedSolarDate = { day: 4, month: 11, year: 2026 };

    const pad = (n) => String(n).padStart(2, "0");

    const toggleConverterModal = (forceOpen = null) => {
        const modal = document.getElementById("converter-modal");
        const triggerBtn = document.getElementById("widget-trigger-btn");
        if (!modal) return;

        const isCurrentlyHidden = modal.hidden;
        const shouldOpen = forceOpen !== null ? forceOpen : isCurrentlyHidden;

        modal.hidden = !shouldOpen;
        if (triggerBtn) {
            triggerBtn.classList.toggle("is-active", shouldOpen);
            triggerBtn.setAttribute("aria-expanded", String(shouldOpen));
        }

        // Khóa cuộn trang trên <body> khi Modal đang mở
        document.body.style.overflow = shouldOpen ? "hidden" : "";

        if (shouldOpen) {
            document.getElementById("conv-day")?.focus();
        } else {
            triggerBtn?.focus();
        }
    };

    const populateSelectOptions = (daySelect, monthSelect, yearSelect) => {
        if (!daySelect || !monthSelect || !yearSelect) return;

        if (yearSelect.options.length === 0) {
            let yearHtml = "";
            for (let y = 1920; y <= 2100; y++) {
                yearHtml += `<option value="${y}">Năm ${y}</option>`;
            }
            yearSelect.innerHTML = yearHtml;
        }

        if (monthSelect.options.length === 0) {
            let monthHtml = "";
            for (let m = 1; m <= 12; m++) {
                monthHtml += `<option value="${m}">Tháng ${pad(m)}</option>`;
            }
            monthSelect.innerHTML = monthHtml;
        }

        const selectedYear = Number(yearSelect.value) || 2026;
        const selectedMonth = Number(monthSelect.value) || 11;
        const prevDay = Number(daySelect.value) || 4;

        const maxDays =
            convertMode === "solar2lunar"
                ? new Date(selectedYear, selectedMonth, 0).getDate()
                : 30;

        let dayHtml = "";
        for (let d = 1; d <= maxDays; d++) {
            dayHtml += `<option value="${d}">Ngày ${pad(d)}</option>`;
        }
        daySelect.innerHTML = dayHtml;
        daySelect.value = String(Math.min(prevDay, maxDays));
    };

    const runConversionAndRender = () => {
        if (!window.LunarEngine) return;

        const daySelect = document.getElementById("conv-day");
        const monthSelect = document.getElementById("conv-month");
        const yearSelect = document.getElementById("conv-year");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        if (!daySelect || !monthSelect || !yearSelect) return;

        const inputDay = Number(daySelect.value) || 1;
        const inputMonth = Number(monthSelect.value) || 1;
        const inputYear = Number(yearSelect.value) || 2026;
        const isLeapChecked = leapCheckbox?.checked ? 1 : 0;

        let sDay = inputDay;
        let sMonth = inputMonth;
        let sYear = inputYear;

        if (convertMode === "lunar2solar" && typeof window.LunarEngine.convertLunar2Solar === "function") {
            let converted = window.LunarEngine.convertLunar2Solar(
                inputDay,
                inputMonth,
                inputYear,
                isLeapChecked,
            );
            // Nếu năm đó không có tháng nhuận mà người dùng lỡ tích chọn nhuận -> tự động tính theo tháng thường
            if (!converted || converted.sDay === 0) {
                if (leapCheckbox) leapCheckbox.checked = false;
                converted = window.LunarEngine.convertLunar2Solar(inputDay, inputMonth, inputYear, 0);
            }
            if (converted && converted.sDay > 0) {
                sDay = converted.sDay;
                sMonth = converted.sMonth;
                sYear = converted.sYear;
            }
        }

        resolvedSolarDate = { day: sDay, month: sMonth, year: sYear };
        const info = window.LunarEngine.getFullDayInfo(sDay, sMonth, sYear);

        document.getElementById("conv-res-solar").textContent =
            `${pad(info.sDay)}/${pad(info.sMonth)}/${info.sYear}`;
        document.getElementById("conv-res-weekday").textContent = info.bilingualWeekday;

        const lunarTagEl = document.getElementById("conv-res-lunar-tag");
        if (lunarTagEl) {
            const sizeText = info.isFullMonth ? "Tháng Đủ" : "Tháng Thiếu";
            const leapText = info.lunarLeap ? " • Nhuận" : "";
            lunarTagEl.textContent = `Âm lịch (${sizeText}${leapText})`;
        }

        document.getElementById("conv-res-lunar").textContent =
            `${pad(info.lunarDay)}/${pad(info.lunarMonth)}/${info.lunarYear}`;
        document.getElementById("conv-res-year-canchi").textContent = `Năm ${info.yearCanChi} (${info.yearNapAm})`;

        document.getElementById("conv-res-day-canchi").textContent = info.dayCanChi;
        document.getElementById("conv-res-month-canchi").textContent = info.monthCanChi;
        document.getElementById("conv-res-napam").textContent = info.dayNapAm;
        document.getElementById("conv-res-term-truc").textContent =
            `${info.solarTerm} • Trực ${info.trucObj.name}`;

        const fortuneEl = document.getElementById("conv-res-fortune");
        if (fortuneEl) {
            const statusTitle =
                info.fortuneStatus === "good"
                    ? "🌟 Ngày Hoàng Đạo (Tốt)"
                    : info.fortuneStatus === "bad"
                      ? "🌙 Ngày Hắc Đạo (Xấu)"
                      : "⚖️ Ngày Bình Thường";
            fortuneEl.textContent = `${statusTitle} — Giờ Hoàng Đạo: ${info.goodHoursStr}`;
        }
    };

    const setConverterToToday = () => {
        const daySelect = document.getElementById("conv-day");
        const monthSelect = document.getElementById("conv-month");
        const yearSelect = document.getElementById("conv-year");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        if (!daySelect || !monthSelect || !yearSelect || !window.LunarEngine) return;

        const now = new Date();
        if (leapCheckbox) leapCheckbox.checked = false;

        if (convertMode === "solar2lunar") {
            yearSelect.value = String(now.getFullYear());
            monthSelect.value = String(now.getMonth() + 1);
            populateSelectOptions(daySelect, monthSelect, yearSelect);
            daySelect.value = String(now.getDate());
        } else {
            const lunarToday = window.LunarEngine.convertSolar2Lunar(
                now.getDate(),
                now.getMonth() + 1,
                now.getFullYear(),
            );
            yearSelect.value = String(lunarToday.lunarYear);
            monthSelect.value = String(lunarToday.lunarMonth);
            populateSelectOptions(daySelect, monthSelect, yearSelect);
            daySelect.value = String(lunarToday.lunarDay);
            if (leapCheckbox) leapCheckbox.checked = Boolean(lunarToday.lunarLeap);
        }

        runConversionAndRender();
    };

    const initConverterModal = () => {
        const modal = document.getElementById("converter-modal");
        const triggerBtn = document.getElementById("widget-trigger-btn");
        if (!modal || modal.dataset.bound === "true") return;
        modal.dataset.bound = "true";

        const closeBtn = document.getElementById("converter-modal-close");
        const backdrop = document.getElementById("converter-modal-backdrop");
        const daySelect = document.getElementById("conv-day");
        const monthSelect = document.getElementById("conv-month");
        const yearSelect = document.getElementById("conv-year");
        const leapRow = document.getElementById("conv-leap-row");
        const leapCheckbox = document.getElementById("conv-leap-checkbox");
        const todayBtn = document.getElementById("conv-btn-today");
        const jumpBtn = document.getElementById("conv-btn-jump");
        const tabs = modal.querySelectorAll(".converter-modal__tab");

        if (triggerBtn) {
            triggerBtn.onclick = () => toggleConverterModal();
        }
        if (closeBtn) closeBtn.onclick = () => toggleConverterModal(false);
        if (backdrop) backdrop.onclick = () => toggleConverterModal(false);

        tabs.forEach((tab) => {
            tab.onclick = () => {
                convertMode = tab.dataset.convertMode || "solar2lunar";
                tabs.forEach((t) => {
                    const isMatch = t === tab;
                    t.classList.toggle("is-active", isMatch);
                    t.setAttribute("aria-selected", String(isMatch));
                });

                const isLunarInput = convertMode === "lunar2solar";
                document.getElementById("conv-day-label").textContent = isLunarInput ? "Ngày Âm" : "Ngày Dương";
                document.getElementById("conv-month-label").textContent = isLunarInput ? "Tháng Âm" : "Tháng Dương";
                if (leapRow) leapRow.hidden = !isLunarInput;

                populateSelectOptions(daySelect, monthSelect, yearSelect);
                runConversionAndRender();
            };
        });

        [monthSelect, yearSelect].forEach((sel) => {
            sel?.addEventListener("change", () => {
                populateSelectOptions(daySelect, monthSelect, yearSelect);
                runConversionAndRender();
            });
        });

        daySelect?.addEventListener("change", runConversionAndRender);
        leapCheckbox?.addEventListener("change", runConversionAndRender);

        if (todayBtn) todayBtn.onclick = setConverterToToday;

        if (jumpBtn) {
            jumpBtn.onclick = () => {
                const { day, month, year } = resolvedSolarDate;
                toggleConverterModal(false);

                // Nếu đang ở Trang chủ (có hàm nhảy ngày hoặc lưới lịch tháng), phát sự kiện nhảy thẳng tới ngày đó
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

    if (!isModalGlobalBound) {
        isModalGlobalBound = true;
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