// assets/js/clock.js
// Chuyên trách Trang Đồng hồ (clock.html): Đồng hồ TimeSpot, 6 Thẻ Giờ Quốc Tế, Năng lượng Giờ, 4 Trụ Con Giáp & 12 Canh Giờ
(() => {
    let clockInterval = null;
    let lastRenderedBranchKey = "";
    let selectedBranchIndex = -1;

    const ANIMAL_VN_NAMES = [
        "Con Chuột",
        "Con Trâu",
        "Con Hổ",
        "Con Mèo",
        "Con Rồng",
        "Con Rắn",
        "Con Ngựa",
        "Con Dê",
        "Con Khỉ",
        "Con Gà",
        "Con Chó",
        "Con Hợi",
    ];

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

    const getPeriodLabel = (hour24) => {
        if (hour24 >= 5 && hour24 < 11) return "☀️ Sáng";
        if (hour24 >= 11 && hour24 < 14) return "☀️ Trưa";
        if (hour24 >= 14 && hour24 < 18) return "🌤️ Chiều";
        if (hour24 >= 18 && hour24 < 22) return "🌙 Tối";
        return "🌙 Đêm";
    };

    // 1. Cập nhật thời gian thực trên Dải 6 Thẻ Giờ Quốc Tế (Phương án 1)
    const updateWorldClockStrip = (format = "24") => {
        const pad = (n) => String(n).padStart(2, "0");
        document.querySelectorAll(".clock-world-card").forEach((card) => {
            const tz = card.dataset.tz;
            if (!tz) return;
            const parts = getZonedDateParts(tz);
            const timeEl = card.querySelector("[data-world-tz]");
            const periodEl = card.querySelector("[data-world-period]");

            let dispH = parts.hour;
            let suffix = "";
            if (format === "12") {
                suffix = parts.hour >= 12 ? " PM" : " AM";
                dispH = parts.hour % 12 || 12;
            }

            if (timeEl) {
                timeEl.textContent = `${pad(dispH)}:${pad(parts.minute)}${suffix}`;
                timeEl.setAttribute("datetime", `${pad(parts.hour)}:${pad(parts.minute)}`);
            }
            if (periodEl) {
                periodEl.textContent = getPeriodLabel(parts.hour);
            }
        });
    };

    // 2. Cập nhật Khối Năng lượng Canh Giờ (<meter>) & Thông số giờ đang chọn (Phương án 2)
    const updateSelectedHourDetail = (hourObj, dayInfo) => {
        if (!hourObj || !dayInfo) return;

        const nameEl = document.getElementById("detail-selected-hour-name");
        const napamEl = document.getElementById("detail-selected-hour-napam");
        const dirEl = document.getElementById("detail-selected-directions");
        const termEl = document.getElementById("detail-selected-solarterm");

        if (nameEl) nameEl.textContent = `Giờ ${hourObj.canchi} (${hourObj.range})`;
        if (napamEl) napamEl.textContent = hourObj.napAm;
        if (dirEl && dayInfo.directions) {
            dirEl.textContent = `${dayInfo.directions.tai} • ${dayInfo.directions.hy}`;
        }
        if (termEl) {
            termEl.textContent = `${dayInfo.solarTerm} • Trực ${dayInfo.trucObj.name}`;
        }

        // Cập nhật thẻ <meter> Năng lượng Giờ
        const energyCard = document.getElementById("clock-energy-card");
        const energyIcon = document.getElementById("clock-energy-icon");
        const energyLabel = document.getElementById("clock-energy-label");
        const energyBadge = document.getElementById("clock-energy-lucdieu");
        const energyMeter = document.getElementById("clock-energy-meter");
        const energyDesc = document.getElementById("clock-energy-desc");

        if (energyCard) energyCard.dataset.element = hourObj.elementKey;
        if (energyIcon) energyIcon.src = `./assets/icons/${hourObj.elementIcon}`;
        if (energyLabel) energyLabel.textContent = `Năng lượng Giờ ${hourObj.canchi}`;
        if (energyBadge) {
            energyBadge.textContent = `${hourObj.lucDieuName} • ${hourObj.energyScore}%`;
            energyBadge.dataset.fortune = hourObj.lucDieuGood ? "good" : "bad";
        }
        if (energyMeter) {
            energyMeter.value = hourObj.energyScore;
            energyMeter.textContent = `${hourObj.energyScore}%`;
        }
        if (energyDesc) {
            energyDesc.textContent = `Hành ${hourObj.napAm} • Cung ${hourObj.lucDieuName}: ${hourObj.lucDieuDesc}`;
        }
    };

    // 3. Render 12 Thẻ Bento Canh Giờ (Đủ 12 con giáp, nhãn Năng lượng Ngũ Hành & Roving Tabindex)
    const renderZodiacGrid = (dayInfo) => {
        const grid = document.getElementById("clock-zodiac-grid");
        if (!grid || !dayInfo?.hours12) return;

        const activeFilter =
            document.querySelector(".clock-zodiac-section__filter-btn.is-active")?.dataset.hourFilter || "all";

        const focusTargetIdx = selectedBranchIndex !== -1 ? selectedBranchIndex : dayInfo.currentBranchIdx;

        grid.innerHTML = dayInfo.hours12
            .map((h) => {
                const isCurrent = h.index === dayInfo.currentBranchIdx;
                const isSelected = h.index === focusTargetIdx;
                const fortuneKey = h.isGood ? "good" : "bad";
                const fortuneLabel = h.isGood ? "Hoàng Đạo" : "Hắc Đạo";
                const fortuneIcon = h.isGood ? "☀️" : "🌙";
                const isDimmed = activeFilter !== "all" && activeFilter !== fortuneKey;
                const tabIdx = h.index === focusTargetIdx ? "0" : "-1";

                return `
                    <button
                        type="button"
                        class="clock-zodiac-card ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""} ${isDimmed ? "is-dimmed" : ""}"
                        tabindex="${tabIdx}"
                        ${isCurrent ? 'aria-current="time"' : ""}
                        aria-controls="clock-energy-card"
                        aria-label="Giờ ${h.canchi}, từ ${h.range}, ${fortuneLabel}, mệnh ${h.napAm}, năng lượng ${h.energyScore} phần trăm"
                        title="Giờ ${h.canchi} (${h.range}) • ${fortuneLabel} • ${h.napAm} • Năng lượng ${h.energyScore}%"
                        data-branch-index="${h.index}"
                        data-branch="${h.key}"
                        data-canchi="${h.canchi}"
                        data-range="${h.range}"
                        data-napam="${h.napAm}"
                        data-element="${h.elementKey}"
                        data-energy="${h.energyScore}"
                        data-fortune="${fortuneKey}"
                    >
                        <div class="clock-zodiac-card__top" aria-hidden="true">
                            <span class="clock-zodiac-card__name">Giờ ${h.vn}</span>
                            <span class="clock-zodiac-card__utc">${h.range}</span>
                        </div>

                        <div class="clock-zodiac-card__mid" aria-hidden="true">
                            <strong class="clock-zodiac-card__canchi">${h.canchi}</strong>
                            <span class="clock-zodiac-card__element-tag">
                                ${h.napAm} • ${h.energyScore}%
                            </span>
                        </div>

                        <div class="clock-zodiac-card__bottom" aria-hidden="true">
                            <span class="clock-zodiac-card__lucdieu">${h.lucDieuName}</span>
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
                updateSelectedHourDetail(dayInfo.hours12[selectedBranchIndex], dayInfo);
                renderZodiacGrid(dayInfo);
            };

            card.onkeydown = (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % cards.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + cards.length) % cards.length;

                if (nextIdx !== -1) {
                    e.preventDefault();
                    selectedBranchIndex = Number(cards[nextIdx].dataset.branchIndex);
                    updateSelectedHourDetail(dayInfo.hours12[selectedBranchIndex], dayInfo);
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
                const sunEl = document.getElementById("clock-sun-times");
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

            // Cập nhật giờ thực cho 6 thẻ Giờ Quốc Tế
            updateWorldClockStrip(format);

            const currentBranchIdx = window.LunarEngine.getBranchIndexFromHour(parts.hour);
            const branchRenderKey = `${parts.year}-${parts.month}-${parts.day}-${currentBranchIdx}-${tz}`;

            if (branchRenderKey !== lastRenderedBranchKey) {
                lastRenderedBranchKey = branchRenderKey;
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

                // PHƯƠNG ÁN 3: Cập nhật 4 Ô Bento Tứ Trụ kèm Icon 12 Con Giáp & Bóng Con Giáp chìm
                if (currentHourInfo) {
                    const hourIconPath = `./assets/icons/zodiac/${currentHourInfo.icon}`;
                    document.getElementById("pillar-hour-range").textContent = currentHourInfo.range;
                    document.getElementById("pillar-hour-canchi").textContent = currentHourInfo.canchi;
                    document.getElementById("pillar-hour-lucdieu").textContent =
                        `Cung: ${currentHourInfo.lucDieuName} (${currentHourInfo.energyScore}%)`;
                    document.getElementById("pillar-hour-napam").textContent = `Hành: ${currentHourInfo.napAm}`;
                    document.getElementById("pillar-hour-fortune").textContent = currentHourInfo.isGood
                        ? "Hoàng Đạo"
                        : "Hắc Đạo";
                    document.getElementById("pillar-hour-icon")?.setAttribute("src", hourIconPath);
                    document.getElementById("pillar-hour-bg")?.setAttribute("src", hourIconPath);
                }

                const dayZodiacPath = `./assets/icons/zodiac/${dayInfo.zodiacFile}.svg`;
                document.getElementById("pillar-day-truc").textContent = `Trực: ${dayInfo.trucObj.name}`;
                document.getElementById("pillar-day-canchi").textContent = dayInfo.dayCanChi;
                document.getElementById("pillar-day-element-sub").textContent = dayInfo.elementInfo.label;
                document.getElementById("pillar-day-napam").textContent = `Hành: ${dayInfo.dayNapAm}`;
                document.getElementById("pillar-day-lunar").textContent =
                    `Ngày ${pad(dayInfo.lunarDay)}/${pad(dayInfo.lunarMonth)} ÂL`;
                document.getElementById("pillar-day-icon")?.setAttribute("src", dayZodiacPath);
                document.getElementById("pillar-day-bg")?.setAttribute("src", dayZodiacPath);

                const monthZodiacPath = `./assets/icons/zodiac/${dayInfo.monthZodiacFile}.svg`;
                document.getElementById("pillar-month-num").textContent =
                    `Tháng ${dayInfo.lunarMonth} ÂL (${dayInfo.isFullMonth ? "Đủ" : "Thiếu"})`;
                document.getElementById("pillar-month-canchi").textContent = dayInfo.monthCanChi;
                document.getElementById("pillar-month-term-sub").textContent = `Tiết ${dayInfo.solarTerm}`;
                document.getElementById("pillar-month-napam").textContent = `Hành: ${dayInfo.monthNapAm}`;
                document.getElementById("pillar-month-icon")?.setAttribute("src", monthZodiacPath);
                document.getElementById("pillar-month-bg")?.setAttribute("src", monthZodiacPath);

                const yearZodiacPath = `./assets/icons/zodiac/${dayInfo.yearZodiacFile}.svg`;
                const yearAnimalName = ANIMAL_VN_NAMES[dayInfo.yearChiIdx] || "Con Ngựa";
                document.getElementById("pillar-year-solar").textContent = `Năm ${dayInfo.lunarYear}`;
                document.getElementById("pillar-year-canchi").textContent = dayInfo.yearCanChi;
                document.getElementById("pillar-year-animal-sub").textContent = `Sinh tiêu: ${yearAnimalName}`;
                document.getElementById("pillar-year-napam").textContent = `Hành: ${dayInfo.yearNapAm}`;
                document.getElementById("pillar-year-badge").textContent = yearAnimalName;
                document.getElementById("pillar-year-icon")?.setAttribute("src", yearZodiacPath);
                document.getElementById("pillar-year-bg")?.setAttribute("src", yearZodiacPath);

                const targetHour =
                    selectedBranchIndex !== -1 ? dayInfo.hours12[selectedBranchIndex] : currentHourInfo;
                updateSelectedHourDetail(targetHour, dayInfo);
                renderZodiacGrid(dayInfo);

                const announcer = document.getElementById("clock-sr-announcer");
                if (announcer && currentHourInfo) {
                    announcer.textContent = `Đang xem múi giờ ${tz}, Giờ ${currentHourInfo.canchi}, ${currentHourInfo.isGood ? "Giờ Hoàng Đạo" : "Giờ Hắc Đạo"}`;
                }
            }
        };

        // Hàm dùng chung khi đổi Thành phố từ Dropdown hoặc từ 6 Thẻ Bento Giờ Quốc Tế
        const applyCitySelection = ({ cityId, cityName, country, lat, lon, tz, utc }) => {
            app.dataset.activeCity = cityId;
            app.dataset.timezone = tz;

            // Đồng bộ Dropdown
            app.querySelectorAll(".clock-hero__loc-option").forEach((o) => {
                const isMatch = o.dataset.cityId === cityId;
                o.classList.toggle("is-selected", isMatch);
                o.setAttribute("aria-selected", String(isMatch));
            });

            // Đồng bộ Dải 6 Thẻ Giờ Quốc Tế (Roving Tabindex + aria-pressed)
            app.querySelectorAll(".clock-world-card").forEach((card) => {
                const isMatch = card.dataset.cityId === cityId;
                card.classList.toggle("is-active", isMatch);
                card.setAttribute("aria-pressed", String(isMatch));
                card.setAttribute("tabindex", isMatch ? "0" : "-1");
            });

            document.getElementById("clock-loc-label").textContent = `${cityName}, ${country}`;
            document.getElementById("clock-city-heading").innerHTML = `${cityName},<br />${country}`;
            document.getElementById("clock-meta-utc").textContent = utc;
            document.getElementById("schema-lat")?.setAttribute("content", lat);
            document.getElementById("schema-lon")?.setAttribute("content", lon);

            selectedBranchIndex = -1;
            lastRenderedBranchKey = "";
            tickClock();
            fetchWeatherAndSun(lat, lon, tz);
        };

        // Sự kiện Nút 12h / 24h
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

        // Sự kiện Dropdown Khu vực
        const locDropdown = document.getElementById("clock-loc-dropdown");
        if (locDropdown) {
            const summary = locDropdown.querySelector("summary");
            locDropdown.ontoggle = () => {
                summary?.setAttribute("aria-expanded", String(locDropdown.open));
            };
        }

        app.querySelectorAll(".clock-hero__loc-option").forEach((opt) => {
            opt.onclick = () => {
                applyCitySelection(opt.dataset);
                locDropdown?.removeAttribute("open");
            };
        });

        // Sự kiện Click & Phím mũi tên trên Dải 6 Thẻ Giờ Quốc Tế
        const worldCards = Array.from(app.querySelectorAll(".clock-world-card"));
        worldCards.forEach((card, idx) => {
            card.onclick = () => applyCitySelection(card.dataset);

            card.onkeydown = (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % worldCards.length;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                    nextIdx = (idx - 1 + worldCards.length) % worldCards.length;

                if (nextIdx !== -1) {
                    e.preventDefault();
                    const targetCard = worldCards[nextIdx];
                    applyCitySelection(targetCard.dataset);
                    targetCard.focus();
                }
            };
        });

        // Sự kiện Bộ lọc Hoàng Đạo / Hắc Đạo
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

        lastRenderedBranchKey = "";
        tickClock();
        if (clockInterval) clearInterval(clockInterval);
        clockInterval = setInterval(tickClock, 1000);
        fetchWeatherAndSun("10.8231", "106.6297", "Asia/Ho_Chi_Minh");
    };

    document.addEventListener("DOMContentLoaded", initClockPage);
    window.addEventListener("template-loaded", initClockPage);
})();