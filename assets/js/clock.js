// assets/js/clock.js
// Chuyên trách duy nhất Trang Đồng hồ (clock.html): Đồng hồ TimeSpot, Bát Tự Tứ Trụ, 12 Canh Giờ & Thời tiết
(() => {
    let clockInterval = null;
    let lastRenderedBranchIndex = -1;
    let selectedBranchIndex = -1;

    const getZonedDateParts = (timeZone) => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
        return {
            year: Number(parts.year),
            month: Number(parts.month),
            day: Number(parts.day),
            hour: Number(parts.hour) % 24,
            minute: Number(parts.minute),
            second: Number(parts.second),
        };
    };

    const updateSelectedHourDetail = (hourObj, solarTerm) => {
        if (!hourObj) return;
        const nameEl = document.getElementById("detail-selected-hour-name");
        const napamEl = document.getElementById("detail-selected-hour-napam");
        const termEl = document.getElementById("detail-selected-solarterm");

        if (nameEl) nameEl.textContent = `Giờ ${hourObj.canchi} (${hourObj.range})`;
        if (napamEl) napamEl.textContent = hourObj.napAm;
        if (termEl) termEl.textContent = solarTerm;
    };

    const renderZodiacGrid = (dayInfo) => {
        const grid = document.getElementById("clock-zodiac-grid");
        if (!grid) return;

        const activeFilter =
            document.querySelector(".clock-zodiac-section__filter-btn.is-active")?.dataset.hourFilter || "all";

        grid.innerHTML = dayInfo.hours12
            .map((h) => {
                const isCurrent = h.index === dayInfo.currentBranchIdx;
                const isSelected = h.index === selectedBranchIndex;
                const fortuneKey = h.isGood ? "good" : "bad";
                const fortuneLabel = h.isGood ? "Hoàng Đạo" : "Hắc Đạo";
                const fortuneIcon = h.isGood ? "☀️" : "🌙";
                const isDimmed = activeFilter !== "all" && activeFilter !== fortuneKey;

                const focusTargetIdx = selectedBranchIndex !== -1 ? selectedBranchIndex : dayInfo.currentBranchIdx;
                const tabIdx = h.index === focusTargetIdx ? "0" : "-1";

                return `
                    <button
                        type="button"
                        class="clock-zodiac-card ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""} ${isDimmed ? "is-dimmed" : ""}"
                        tabindex="${tabIdx}"
                        ${isCurrent ? 'aria-current="time"' : ""}
                        aria-label="Giờ ${h.canchi}, từ ${h.range}, ${fortuneLabel}, mệnh ${h.napAm}"
                        title="Giờ ${h.canchi} (${h.range}) • ${fortuneLabel} • Mệnh ${h.napAm}"
                        data-branch-index="${h.index}"
                        data-branch="${h.key}"
                        data-canchi="${h.canchi}"
                        data-range="${h.range}"
                        data-napam="${h.napAm}"
                        data-fortune="${fortuneKey}"
                    >
                        <div class="clock-zodiac-card__top" aria-hidden="true">
                            <span class="clock-zodiac-card__name">Giờ ${h.vn}</span>
                            <span class="clock-zodiac-card__utc">${h.range}</span>
                        </div>
                        <div class="clock-zodiac-card__bottom" aria-hidden="true">
                            <strong class="clock-zodiac-card__canchi">${h.canchi}</strong>
                            <span class="clock-zodiac-card__fortune">
                                <span>${fortuneIcon}</span> ${fortuneLabel}
                            </span>
                        </div>
                        <img
                            src="./assets/icons/zodiac/${h.icon}"
                            alt=""
                            aria-hidden="true"
                            class="clock-zodiac-card__img"
                        />
                    </button>
                `;
            })
            .join("");

        const cards = Array.from(grid.querySelectorAll(".clock-zodiac-card"));
        cards.forEach((card, idx) => {
            card.onclick = () => {
                selectedBranchIndex = Number(card.dataset.branchIndex);
                updateSelectedHourDetail(dayInfo.hours12[selectedBranchIndex], dayInfo.solarTerm);
                renderZodiacGrid(dayInfo);
            };

            card.onkeydown = (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % cards.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + cards.length) % cards.length;

                if (nextIdx !== -1) {
                    e.preventDefault();
                    selectedBranchIndex = Number(cards[nextIdx].dataset.branchIndex);
                    updateSelectedHourDetail(dayInfo.hours12[selectedBranchIndex], dayInfo.solarTerm);
                    renderZodiacGrid(dayInfo);
                    grid.querySelector(`[data-branch-index="${selectedBranchIndex}"]`)?.focus();
                }
            };
        });
    };

    const fetchWeatherAndSun = async (lat, lon, tz) => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=${encodeURIComponent(tz)}`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();

            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const isDay = data.current_weather.is_day === 1;
                const tempEl = document.getElementById("clock-weather-temp");
                const iconEl = document.getElementById("clock-weather-icon");
                if (tempEl) tempEl.textContent = `${temp}°C`;
                if (iconEl) iconEl.textContent = isDay ? "☀️" : "🌙";
            }

            if (data.daily?.sunrise?.[0] && data.daily?.sunset?.[0]) {
                const rise = data.daily.sunrise[0].split("T")[1];
                const set = data.daily.sunset[0].split("T")[1];
                const [rH, rM] = rise.split(":").map(Number);
                const [sH, sM] = set.split(":").map(Number);
                const totalMins = sH * 60 + sM - (rH * 60 + rM);
                const dH = Math.floor(totalMins / 60);
                const dM = totalMins % 60;
                const sunEl = document.getElementById("clock-sun-times") || document.getElementById("clock-sun- times");
                if (sunEl) {
                    sunEl.textContent = `${rise} - ${set} (${dH}h ${String(dM).padStart(2, "0")}m)`;
                }
            }
        } catch (err) {
            // Giữ giá trị mặc định nếu không có kết nối mạng
        }
    };

    const initClockPage = () => {
        const rootEl = document.getElementById("clock-calendar-root");
        const app = document.getElementById("clock-bento-app");
        if (!app || !window.LunarEngine) return;

        if (rootEl) rootEl.setAttribute("aria-busy", "false");
        if (app.dataset.bound === "true") return;
        app.dataset.bound = "true";

        const tickClock = () => {
            const tz = app.dataset.timezone || "Asia/Ho_Chi_Minh";
            const format = app.dataset.activeFormat || "24";
            const parts = getZonedDateParts(tz);
            const pad = (n) => String(n).padStart(2, "0");

            let displayHour = parts.hour;
            const ampmEl = document.getElementById("hero-clock-ampm");

            if (format === "12") {
                const suffix = parts.hour >= 12 ? "PM" : "AM";
                displayHour = parts.hour % 12 || 12;
                if (ampmEl) {
                    ampmEl.textContent = suffix;
                    ampmEl.hidden = false;
                }
            } else if (ampmEl) {
                ampmEl.hidden = true;
            }

            const hoursEl = app.querySelector('[data-clock-part="hours"]');
            const minutesEl = app.querySelector('[data-clock-part="minutes"]');
            const secondsEl = app.querySelector('[data-clock-part="seconds"]');
            const timeTag = document.getElementById("hero-clock-time");

            if (hoursEl) hoursEl.textContent = pad(displayHour);
            if (minutesEl) minutesEl.textContent = pad(parts.minute);
            if (secondsEl) secondsEl.textContent = pad(parts.second);
            if (timeTag) {
                timeTag.setAttribute("datetime", `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`);
            }

            const currentBranchIdx = window.LunarEngine.getBranchIndexFromHour(parts.hour);
            if (currentBranchIdx !== lastRenderedBranchIndex) {
                lastRenderedBranchIndex = currentBranchIdx;
                const dayInfo = window.LunarEngine.getFullDayInfo(parts.day, parts.month, parts.year, parts.hour);
                const currentHourInfo = dayInfo.hours12[currentBranchIdx];

                const statusPill = document.getElementById("clock-branch-pill");
                const statusText = document.getElementById("clock-branch-status-text");
                if (statusPill && currentHourInfo) {
                    statusPill.dataset.fortune = currentHourInfo.isGood ? "good" : "bad";
                }
                if (statusText && currentHourInfo) {
                    statusText.textContent = `Đang là Giờ ${currentHourInfo.canchi} • ${currentHourInfo.isGood ? "Hoàng Đạo" : "Hắc Đạo"}`;
                }

                const solarDateEl = document.getElementById("clock-meta-solar-date");
                const lunarDateEl = document.getElementById("clock-meta-lunar-date");
                const weekdayFormatter = new Intl.DateTimeFormat("vi-VN", {
                    timeZone: tz,
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                if (solarDateEl) {
                    solarDateEl.textContent = weekdayFormatter.format(new Date());
                    solarDateEl.setAttribute("datetime", `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`);
                }
                if (lunarDateEl) {
                    lunarDateEl.textContent = `Âm lịch: ${pad(dayInfo.lunarDay)}/${pad(dayInfo.lunarMonth)} ${dayInfo.yearCanChi}`;
                }

                if (currentHourInfo) {
                    document.getElementById("pillar-hour-range").textContent = currentHourInfo.range;
                    document.getElementById("pillar-hour-canchi").textContent = currentHourInfo.canchi;
                    document.getElementById("pillar-hour-napam").textContent = `Hành: ${currentHourInfo.napAm}`;
                    document.getElementById("pillar-hour-fortune").textContent = currentHourInfo.isGood
                        ? "Hoàng Đạo"
                        : "Hắc Đạo";
                }
                document.getElementById("pillar-day-canchi").textContent = dayInfo.dayCanChi;
                document.getElementById("pillar-day-napam").textContent = `Hành: ${dayInfo.dayNapAm}`;
                document.getElementById("pillar-day-lunar").textContent =
                    `Ngày ${pad(dayInfo.lunarDay)}/${pad(dayInfo.lunarMonth)} ÂL`;
                document.getElementById("pillar-month-canchi").textContent = dayInfo.monthCanChi;
                document.getElementById("pillar-month-napam").textContent = `Hành: ${dayInfo.monthNapAm}`;
                document.getElementById("pillar-year-canchi").textContent = dayInfo.yearCanChi;
                document.getElementById("pillar-year-napam").textContent = `Hành: ${dayInfo.yearNapAm}`;

                updateSelectedHourDetail(currentHourInfo, dayInfo.solarTerm);
                renderZodiacGrid(dayInfo);

                const announcer = document.getElementById("clock-sr-announcer");
                if (announcer && currentHourInfo) {
                    announcer.textContent = `Đã chuyển sang Giờ ${currentHourInfo.canchi}, ${currentHourInfo.isGood ? "Giờ Hoàng Đạo" : "Giờ Hắc Đạo"}`;
                }
            }
        };

        app.querySelectorAll(".clock-hero__format-btn").forEach((btn) => {
            btn.onclick = () => {
                app.dataset.activeFormat = btn.dataset.timeFormat;
                app.querySelectorAll(".clock-hero__format-btn").forEach((b) => {
                    const isMatch = b === btn;
                    b.classList.toggle("is-active", isMatch);
                    b.setAttribute("aria-pressed", String(isMatch));
                });
                tickClock();
            };
        });

        const locDropdown = document.getElementById("clock-loc-dropdown");
        app.querySelectorAll(".clock-hero__loc-option").forEach((opt) => {
            opt.onclick = () => {
                const { cityId, cityName, country, lat, lon, tz, utc } = opt.dataset;
                app.dataset.activeCity = cityId;
                app.dataset.timezone = tz;

                app.querySelectorAll(".clock-hero__loc-option").forEach((o) => {
                    const isMatch = o === opt;
                    o.classList.toggle("is-selected", isMatch);
                    o.setAttribute("aria-selected", String(isMatch));
                });

                document.getElementById("clock-loc-label").textContent = `${cityName}, ${country}`;
                document.getElementById("clock-city-heading").innerHTML = `${cityName},<br />${country}`;
                document.getElementById("clock-meta-utc").textContent = utc;
                document.getElementById("schema-lat")?.setAttribute("content", lat);
                document.getElementById("schema-lon")?.setAttribute("content", lon);

                locDropdown?.removeAttribute("open");
                lastRenderedBranchIndex = -1;
                tickClock();
                fetchWeatherAndSun(lat, lon, tz);
            };
        });

        app.querySelectorAll(".clock-zodiac-section__filter-btn").forEach((btn) => {
            btn.onclick = () => {
                app.querySelectorAll(".clock-zodiac-section__filter-btn").forEach((b) => {
                    const isMatch = b === btn;
                    b.classList.toggle("is-active", isMatch);
                    b.setAttribute("aria-pressed", String(isMatch));
                });
                const parts = getZonedDateParts(app.dataset.timezone || "Asia/Ho_Chi_Minh");
                renderZodiacGrid(window.LunarEngine.getFullDayInfo(parts.day, parts.month, parts.year, parts.hour));
            };
        });

        lastRenderedBranchIndex = -1;
        tickClock();
        if (clockInterval) clearInterval(clockInterval);
        clockInterval = setInterval(tickClock, 1000);
        fetchWeatherAndSun("10.8231", "106.6297", "Asia/Ho_Chi_Minh");
    };

    document.addEventListener("DOMContentLoaded", initClockPage);
    window.addEventListener("template-loaded", initClockPage);
})();
