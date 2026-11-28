// assets/js/utilities/util-clock.js
// Mục 1 Bento: Bấm giờ (Telemetry Best/Worst/Avg + Bar), Đếm ngược (Vòng SVG + Chạy lại), Báo thức (Hero kế tiếp + chống trùng + role="switch")
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const { pad, escapeHtml, setText, playSoundEffect, stopCurrentAudio } = Hub;

    const RING_CIRCUMFERENCE = 2 * Math.PI * 96; // r = 96 -> ~603.19

    let customCountdownAudioUrl = "";
    let customAlarmAudioUrl = "";

    let swTimer = null;
    let swStartTime = 0;
    let swElapsedMs = 0;
    let swRunning = false;
    let swLaps = [];

    let cdTimer = null;
    let cdTotalSec = 300;
    let cdRemainingSec = 300;
    let cdRunning = false;
    let cdHistory = [];

    let alarmsList = [
        {
            id: 1,
            hour: 6,
            minute: 30,
            title: "Dậy học bài & Tập thể dục",
            repeat: "Hằng ngày",
            enabled: true,
        },
    ];

    const safeEscape = (str) =>
        typeof escapeHtml === "function"
            ? escapeHtml(str)
            : String(str || "")
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");

    // ==================== 1.1. HELPERS STOPWATCH ====================
    const formatStopwatch = (ms) => {
        const safeMs = Math.max(0, ms);
        const totalSec = Math.floor(safeMs / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const centi = Math.floor((safeMs % 1000) / 10);
        return {
            main: `${pad(h)}:${pad(m)}:${pad(s)}`,
            ms: `.${pad(centi)}`,
            compact: h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}.${pad(centi)}`,
        };
    };

    const setStopwatchState = (state) => {
        const root = document.getElementById("sw-bento-root");
        const badge = document.getElementById("sw-head-badge");
        if (root) root.dataset.clockState = state;
        if (badge) badge.dataset.clockState = state;
    };

    const renderStopwatchLaps = () => {
        const body = document.getElementById("sw-laps-body");
        if (!body) return;

        setText("sw-stat-count", pad(swLaps.length));

        if (!swLaps.length) {
            setText("sw-stat-best", "--:--.--");
            setText("sw-stat-best-tag", "Chưa có");
            setText("sw-stat-worst", "--:--.--");
            setText("sw-stat-worst-tag", "Chưa có");
            setText("sw-stat-avg", "--:--.--");
            body.innerHTML = `<p class="util-data-table__empty">Chưa có vòng nào. Nhấn <strong>Bắt đầu</strong> và <strong>Ngắt (Vòng)</strong> để xem phân tích tốc độ.</p>`;
            return;
        }

        let bestLap = swLaps[0];
        let worstLap = swLaps[0];
        let sumLapMs = 0;

        swLaps.forEach((l) => {
            sumLapMs += l.lapMs;
            if (l.lapMs < bestLap.lapMs) bestLap = l;
            if (l.lapMs > worstLap.lapMs) worstLap = l;
        });

        const avgMs = sumLapMs / swLaps.length;
        const maxLapMs = Math.max(1, worstLap.lapMs);

        setText("sw-stat-best", formatStopwatch(bestLap.lapMs).compact);
        setText("sw-stat-best-tag", `Vòng #${pad(bestLap.idx)}`);
        setText("sw-stat-worst", formatStopwatch(worstLap.lapMs).compact);
        setText("sw-stat-worst-tag", `Vòng #${pad(worstLap.idx)}`);
        setText("sw-stat-avg", formatStopwatch(avgMs).compact);

        body.innerHTML = swLaps
            .map((l) => {
                let rank = "normal";
                let rankLabel = "";
                if (swLaps.length >= 2 && l.idx === bestLap.idx) {
                    rank = "best";
                    rankLabel = "Nhanh nhất";
                } else if (swLaps.length >= 2 && l.idx === worstLap.idx) {
                    rank = "worst";
                    rankLabel = "Chậm nhất";
                }
                const ratio = Math.max(10, Math.round((l.lapMs / maxLapMs) * 100));

                return `
                    <div class="util-sw-lap-row" role="listitem" data-lap-rank="${rank}">
                        <div class="util-sw-lap-row__top">
                            <span class="util-sw-lap-row__left">
                                <strong>Vòng #${pad(l.idx)}</strong>
                                ${rankLabel ? `<span class="util-sw-lap-row__badge">${rankLabel}</span>` : ""}
                            </span>
                            <div class="util-sw-lap-row__times">
                                <span>+${l.lapStr}</span>
                                <small>${l.totalStr}</small>
                            </div>
                        </div>
                        <div class="util-sw-lap-row__bar" aria-hidden="true">
                            <div class="util-sw-lap-row__bar-fill" style="--lap-ratio:${ratio}%"></div>
                        </div>
                    </div>
                `;
            })
            .join("");
    };

    // ==================== 1.2. HELPERS COUNTDOWN ====================
    const syncCountdownVisual = (sec, total = cdTotalSec) => {
        const safeSec = Math.max(0, sec);
        const h = Math.floor(safeSec / 3600);
        const m = Math.floor((safeSec % 3600) / 60);
        const s = safeSec % 60;
        setText("cd-display-digits", `${pad(h)}:${pad(m)}:${pad(s)}`);

        const ratio = total > 0 ? Math.min(1, Math.max(0, safeSec / total)) : 0;
        const pct = Math.round(ratio * 100);
        setText("cd-progress-pct", `${pct}%`);

        const ring = document.getElementById("cd-progress-ring");
        if (ring) {
            ring.style.strokeDasharray = String(RING_CIRCUMFERENCE);
            ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - ratio));
        }
    };

    const setCountdownState = (state) => {
        const root = document.getElementById("cd-bento-root");
        const badge = document.getElementById("cd-status-badge");
        if (root) root.dataset.clockState = state;
        if (badge) badge.dataset.clockState = state;
    };

    const renderCountdownHistory = () => {
        const histBody = document.getElementById("cd-history-body");
        if (!histBody) return;
        if (!cdHistory.length) {
            histBody.innerHTML = `<p class="util-data-table__empty">Chưa có dữ liệu hẹn giờ. Nhấn <strong>Bắt đầu hẹn giờ</strong> để lưu phiên đầu tiên.</p>`;
            return;
        }
        histBody.innerHTML = cdHistory
            .slice(0, 6)
            .map(
                (item) => `
                    <article class="util-cd-history-tile">
                        <div class="util-cd-history-tile__info">
                            <strong>${safeEscape(item.title)}</strong>
                            <small>${item.duration} • Lúc ${item.startedAt}</small>
                        </div>
                        <button
                            type="button"
                            class="util-cd-history-tile__replay"
                            data-cd-replay-sec="${item.seconds}"
                            data-cd-replay-title="${safeEscape(item.title)}"
                            title="Nạp lại mốc ${item.duration}"
                        >
                            &#8635; Nạp lại
                        </button>
                    </article>
                `,
            )
            .join("");
    };

    // ==================== 1.3. HELPERS ALARM ====================
    const getMinutesUntilAlarm = (alarm, now = new Date()) => {
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const targetMin = alarm.hour * 60 + alarm.minute;
        let diff = targetMin - nowMin;
        if (diff <= 0) diff += 24 * 60;
        return diff;
    };

    const formatRemainMinutes = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h === 0) return `Còn ${m} phút`;
        if (m === 0) return `Còn ${h} giờ`;
        return `Còn ${h} giờ ${m} phút`;
    };

    const getAlarmPeriodMeta = (hour) => {
        if (hour >= 5 && hour < 11) return { key: "morning", label: "🌅 Buổi sáng" };
        if (hour >= 11 && hour < 14) return { key: "afternoon", label: "☀️ Buổi trưa" };
        if (hour >= 14 && hour < 18) return { key: "afternoon", label: "🌤️ Buổi chiều" };
        if (hour >= 18 && hour < 22) return { key: "evening", label: "🌇 Buổi tối" };
        return { key: "night", label: "🌙 Đêm khuya" };
    };

    const syncAlarmComposerPreview = () => {
        const h = Math.min(23, Math.max(0, Number(document.getElementById("al-input-hour")?.value || 0)));
        const m = Math.min(59, Math.max(0, Number(document.getElementById("al-input-minute")?.value || 0)));
        setText("al-preview-time", `${pad(h)}:${pad(m)}`);
    };

    const renderAlarmsList = () => {
        const container = document.getElementById("al-list-container");
        const heroEl = document.getElementById("al-next-hero");
        if (!container) return;

        const now = new Date();
        const activeAlarms = alarmsList
            .filter((a) => a.enabled)
            .map((a) => ({ ...a, remainMin: getMinutesUntilAlarm(a, now) }))
            .sort((a, b) => a.remainMin - b.remainMin);

        const nextAlarm = activeAlarms[0] || null;

        setText("al-active-count", `${activeAlarms.length} đang bật`);
        setText(
            "al-total-hint",
            alarmsList.length ? `${alarmsList.length} báo thức • Sắp xếp theo thời gian gần nhất` : "Chưa có báo thức",
        );

        if (heroEl) heroEl.dataset.empty = String(!nextAlarm);
        if (nextAlarm) {
            setText("al-next-time", `${pad(nextAlarm.hour)}:${pad(nextAlarm.minute)}`);
            setText("al-next-title", nextAlarm.title);
            setText("al-next-countdown", `⏰ ${formatRemainMinutes(nextAlarm.remainMin)} nữa đổ chuông`);
        } else {
            setText("al-next-time", "--:--");
            setText("al-next-title", "Chưa có báo thức nào đang bật");
            setText("al-next-countdown", "Bật hoặc thêm báo thức ở bên phải");
        }

        if (!alarmsList.length) {
            container.innerHTML = `<p class="util-data-table__empty">Chưa có báo thức nào. Thiết lập giờ và nhấn <strong>+ Lưu báo thức</strong> ở trên.</p>`;
            return;
        }

        // Sắp xếp: Báo thức đang bật gần nhất lên đầu, tiếp theo là các báo thức bật khác, cuối cùng là báo thức đang tắt
        const sortedAlarms = [...alarmsList].sort((a, b) => {
            if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
            return getMinutesUntilAlarm(a, now) - getMinutesUntilAlarm(b, now);
        });

        container.innerHTML = sortedAlarms
            .map((a) => {
                const isNext = Boolean(nextAlarm && a.id === nextAlarm.id);
                const remainMin = getMinutesUntilAlarm(a, now);
                const period = getAlarmPeriodMeta(a.hour);
                const timeStr = `${pad(a.hour)}:${pad(a.minute)}`;

                return `
                    <article
                        class="util-alarm-item ${a.enabled ? "" : "is-disabled"}"
                        data-alarm-id="${a.id}"
                        data-is-next="${isNext}"
                        data-alarm-period="${period.key}"
                    >
                        <div class="util-alarm-item__head">
                            <span class="util-alarm-item__period">${period.label}</span>
                            ${isNext ? `<span class="util-alarm-item__next-tag">Sắp kêu</span>` : ""}
                        </div>

                        <div class="util-alarm-item__main">
                            <strong class="util-alarm-item__time">${timeStr}</strong>
                            <span class="util-alarm-item__title">${safeEscape(a.title)}</span>
                            <span class="util-alarm-item__remain">
                                ${a.enabled ? formatRemainMinutes(remainMin) : "Đang tạm tắt"}
                            </span>
                        </div>

                        <footer class="util-alarm-item__foot">
                            <small class="util-alarm-item__meta">🔁 ${safeEscape(a.repeat || "Hằng ngày")}</small>
                            <div class="util-alarm-item__right">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked="${a.enabled}"
                                    class="util-alarm-item__toggle ${a.enabled ? "is-on" : ""}"
                                    data-toggle-alarm="${a.id}"
                                    aria-label="Bật hoặc tắt báo thức ${timeStr}"
                                    title="Bật / Tắt báo thức ${timeStr}"
                                ></button>
                                <button
                                    type="button"
                                    class="util-alarm-item__del"
                                    data-del-alarm="${a.id}"
                                    aria-label="Xóa báo thức ${timeStr}"
                                    title="Xóa báo thức"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        </footer>
                    </article>
                `;
            })
            .join("");
    };

    // ==================== KHỞI CHẠY MODULE ====================
    Hub.registerModule(() => {
        renderStopwatchLaps();
        syncCountdownVisual(cdRemainingSec, cdTotalSec);
        renderCountdownHistory();
        syncAlarmComposerPreview();
        renderAlarmsList();

        // ---------- 1.1. ĐỒNG HỒ BẤM GIỜ ----------
        const swStartBtn = document.getElementById("sw-start-btn");
        const swLapBtn = document.getElementById("sw-lap-btn");
        const swResetBtn = document.getElementById("sw-reset-btn");

        if (swStartBtn) {
            swStartBtn.onclick = () => {
                if (!swRunning) {
                    swRunning = true;
                    swStartTime = performance.now() - swElapsedMs;
                    swStartBtn.innerHTML = "<span>&#10074;&#10074; Tạm dừng</span>";
                    if (swLapBtn) swLapBtn.disabled = false;
                    setStopwatchState("running");
                    setText("sw-status-text", "Đang bấm giờ...");
                    setText("sw-head-badge", "Đang chạy");
                    swTimer = setInterval(() => {
                        swElapsedMs = performance.now() - swStartTime;
                        const fmt = formatStopwatch(swElapsedMs);
                        setText("sw-main-display", fmt.main);
                        setText("sw-ms-display", fmt.ms);
                    }, 30);
                } else {
                    swRunning = false;
                    clearInterval(swTimer);
                    swStartBtn.innerHTML = "<span>&#9654; Tiếp tục</span>";
                    setStopwatchState("paused");
                    setText("sw-status-text", "Đang tạm dừng");
                    setText("sw-head-badge", "Tạm dừng");
                }
            };
        }

        if (swLapBtn) {
            swLapBtn.onclick = () => {
                if (!swRunning) return;
                const prevTotalMs = swLaps[0]?.totalMs || 0;
                const lapMs = Math.max(10, swElapsedMs - prevTotalMs);
                const lapFmt = formatStopwatch(lapMs);
                const totalFmt = formatStopwatch(swElapsedMs);
                swLaps.unshift({
                    idx: swLaps.length + 1,
                    lapMs,
                    totalMs: swElapsedMs,
                    lapStr: `${lapFmt.main}${lapFmt.ms}`,
                    totalStr: `${totalFmt.main}${totalFmt.ms}`,
                });
                renderStopwatchLaps();
            };
        }

        if (swResetBtn) {
            swResetBtn.onclick = () => {
                swRunning = false;
                clearInterval(swTimer);
                swElapsedMs = 0;
                swLaps = [];
                setStopwatchState("idle");
                setText("sw-main-display", "00:00:00");
                setText("sw-ms-display", ".00");
                setText("sw-status-text", "Sẵn sàng bấm giờ");
                setText("sw-head-badge", "Chuẩn 1/100s");
                if (swStartBtn) swStartBtn.innerHTML = "<span>&#9654; Bắt đầu</span>";
                if (swLapBtn) swLapBtn.disabled = true;
                renderStopwatchLaps();
            };
        }

        // ---------- 1.2. ĐỒNG HỒ ĐẾM NGƯỢC ----------
        const applyCountdownInputs = (totalSec, customTitle = "") => {
            const safeTotal = Math.max(0, Number(totalSec) || 0);
            cdTotalSec = Math.max(1, safeTotal);
            cdRemainingSec = safeTotal;
            const hEl = document.getElementById("cd-input-hours");
            const mEl = document.getElementById("cd-input-minutes");
            const sEl = document.getElementById("cd-input-seconds");
            const titleEl = document.getElementById("cd-input-title");
            if (hEl) hEl.value = String(Math.floor(safeTotal / 3600));
            if (mEl) mEl.value = String(Math.floor((safeTotal % 3600) / 60));
            if (sEl) sEl.value = String(safeTotal % 60);
            if (customTitle && titleEl) titleEl.value = customTitle;
            syncCountdownVisual(cdRemainingSec, cdTotalSec);
        };

        ["cd-input-hours", "cd-input-minutes", "cd-input-seconds"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", () => {
                if (cdRunning) return;
                const h = Number(document.getElementById("cd-input-hours")?.value || 0);
                const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
                const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
                cdRemainingSec = Math.max(0, h * 3600 + m * 60 + s);
                cdTotalSec = Math.max(1, cdRemainingSec);
                syncCountdownVisual(cdRemainingSec, cdTotalSec);
                document.querySelectorAll("[data-cd-preset]").forEach((c) => {
                    const isMatch = Number(c.dataset.cdPreset) === cdRemainingSec;
                    c.classList.toggle("is-active", isMatch);
                    c.setAttribute("aria-pressed", String(isMatch));
                });
            });
        });

        document.querySelectorAll("[data-cd-preset]").forEach((tile) => {
            tile.onclick = () => {
                if (cdRunning) return;
                document.querySelectorAll("[data-cd-preset]").forEach((c) => {
                    const isMatch = c === tile;
                    c.classList.toggle("is-active", isMatch);
                    c.setAttribute("aria-pressed", String(isMatch));
                });
                applyCountdownInputs(Number(tile.dataset.cdPreset || 300));
                setCountdownState("idle");
                setText("cd-end-at-label", "Sẵn sàng đếm ngược");
            };
        });

        document.getElementById("cd-history-body")?.addEventListener("click", (e) => {
            const replayBtn = e.target.closest("[data-cd-replay-sec]");
            if (!replayBtn || cdRunning) return;
            applyCountdownInputs(Number(replayBtn.dataset.cdReplaySec || 300), replayBtn.dataset.cdReplayTitle || "");
            setCountdownState("idle");
            setText("cd-end-at-label", "Đã nạp lại mốc thời gian");
        });

        const cdAudioInput = document.getElementById("cd-audio-file");
        document.getElementById("cd-upload-sound-btn")?.addEventListener("click", () => cdAudioInput?.click());
        cdAudioInput?.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            customCountdownAudioUrl = URL.createObjectURL(file);
            setText("cd-sound-file-label", `🎵 ${file.name}`);
            playSoundEffect(customCountdownAudioUrl);
        });

        document.getElementById("cd-test-sound-btn")?.addEventListener("click", () => {
            playSoundEffect(customCountdownAudioUrl);
        });

        const cdStartBtn = document.getElementById("cd-start-btn");
        if (cdStartBtn) {
            cdStartBtn.onclick = () => {
                stopCurrentAudio();
                if (!cdRunning) {
                    const h = Number(document.getElementById("cd-input-hours")?.value || 0);
                    const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
                    const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
                    const title = document.getElementById("cd-input-title")?.value.trim() || "Đồng hồ đếm ngược";
                    const configuredSec = Math.max(1, h * 3600 + m * 60 + s);

                    if (!cdTimer) {
                        cdTotalSec = configuredSec;
                        cdRemainingSec = configuredSec;
                        cdHistory.unshift({
                            idx: cdHistory.length + 1,
                            title,
                            seconds: configuredSec,
                            duration: `${pad(Math.floor(configuredSec / 3600))}:${pad(Math.floor((configuredSec % 3600) / 60))}:${pad(configuredSec % 60)}`,
                            startedAt: new Date().toLocaleTimeString("vi-VN"),
                        });
                        renderCountdownHistory();
                    }

                    const finishTime = new Date(Date.now() + cdRemainingSec * 1000);
                    setText("cd-end-at-label", `Kết thúc lúc ${pad(finishTime.getHours())}:${pad(finishTime.getMinutes())}:${pad(finishTime.getSeconds())}`);

                    cdRunning = true;
                    setCountdownState("running");
                    setText("cd-active-title-label", title);
                    setText("cd-status-badge", "Đang đếm ngược");
                    cdStartBtn.innerHTML = "<span>&#10074;&#10074; Tạm dừng</span>";
                    syncCountdownVisual(cdRemainingSec, cdTotalSec);

                    cdTimer = setInterval(() => {
                        cdRemainingSec = Math.max(0, cdRemainingSec - 1);
                        syncCountdownVisual(cdRemainingSec, cdTotalSec);
                        if (cdRemainingSec <= 0) {
                            clearInterval(cdTimer);
                            cdTimer = null;
                            cdRunning = false;
                            setCountdownState("done");
                            cdStartBtn.innerHTML = "<span>&#9654; Bắt đầu hẹn giờ</span>";
                            setText("cd-status-badge", "🔔 Đã hết giờ!");
                            setText("cd-end-at-label", "Đã hoàn tất hẹn giờ!");
                            playSoundEffect(customCountdownAudioUrl);
                        }
                    }, 1000);
                } else {
                    cdRunning = false;
                    clearInterval(cdTimer);
                    setCountdownState("paused");
                    cdStartBtn.innerHTML = "<span>&#9654; Tiếp tục</span>";
                    setText("cd-status-badge", "Tạm dừng");
                    setText("cd-end-at-label", "Đang tạm dừng");
                }
            };
        }

        document.getElementById("cd-reset-btn")?.addEventListener("click", () => {
            stopCurrentAudio();
            cdRunning = false;
            clearInterval(cdTimer);
            cdTimer = null;
            const h = Number(document.getElementById("cd-input-hours")?.value || 0);
            const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
            const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
            cdRemainingSec = h * 3600 + m * 60 + s;
            cdTotalSec = Math.max(1, cdRemainingSec);
            setCountdownState("idle");
            syncCountdownVisual(cdRemainingSec, cdTotalSec);
            if (cdStartBtn) cdStartBtn.innerHTML = "<span>&#9654; Bắt đầu hẹn giờ</span>";
            setText("cd-status-badge", "Đang chờ");
            setText("cd-end-at-label", "Nhấn Bắt đầu để đếm ngược");
        });

        // ---------- 1.3. ĐỒNG HỒ BÁO THỨC ----------
        ["al-input-hour", "al-input-minute"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", syncAlarmComposerPreview);
        });

        document.querySelectorAll("[data-al-quick]").forEach((chip) => {
            chip.onclick = () => {
                const [qh, qm] = String(chip.dataset.alQuick || "06:30")
                    .split(":")
                    .map(Number);
                const hEl = document.getElementById("al-input-hour");
                const mEl = document.getElementById("al-input-minute");
                if (hEl) hEl.value = String(qh);
                if (mEl) mEl.value = String(qm);
                syncAlarmComposerPreview();
            };
        });

        const alAudioInput = document.getElementById("al-audio-file");
        document.getElementById("al-upload-sound-btn")?.addEventListener("click", () => alAudioInput?.click());
        alAudioInput?.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            customAlarmAudioUrl = URL.createObjectURL(file);
            setText("al-sound-file-label", `🎵 ${file.name}`);
            playSoundEffect(customAlarmAudioUrl);
        });

        document.getElementById("al-test-sound-btn")?.addEventListener("click", () => {
            playSoundEffect(customAlarmAudioUrl);
        });

        document.getElementById("al-repeat-dropdown")?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-al-repeat]");
            if (!btn) return;
            e.stopPropagation();
            const val = btn.dataset.alRepeat;
            const textEl = document.getElementById("al-repeat-text");
            if (textEl) {
                textEl.textContent = val;
                textEl.dataset.repeatVal = val;
            }
            document.querySelectorAll("[data-al-repeat]").forEach((b) => {
                const isSel = b === btn;
                b.classList.toggle("is-selected", isSel);
                b.setAttribute("aria-selected", String(isSel));
            });
            document.getElementById("al-repeat-dropdown")?.removeAttribute("open");
        });

        let hintTimer = null;
        const showAlarmHint = (msg) => {
            const hintEl = document.getElementById("al-form-hint");
            if (!hintEl) return;
            hintEl.textContent = msg;
            hintEl.hidden = false;
            clearTimeout(hintTimer);
            hintTimer = setTimeout(() => {
                hintEl.hidden = true;
            }, 2800);
        };

        document.getElementById("al-add-btn")?.addEventListener("click", () => {
            const hour = Math.min(23, Math.max(0, Number(document.getElementById("al-input-hour")?.value || 6)));
            const minute = Math.min(59, Math.max(0, Number(document.getElementById("al-input-minute")?.value || 30)));
            const title = document.getElementById("al-input-title")?.value.trim() || "Nhắc nhở báo thức";
            const repeat = document.getElementById("al-repeat-text")?.dataset.repeatVal || "Hằng ngày";

            // Ngăn tạo trùng y hệt giờ + phút + chế độ lặp (chỉ bật lại và thông báo rõ cho UX sạch)
            const duplicate = alarmsList.find(
                (a) => a.hour === hour && a.minute === minute && a.repeat === repeat && a.title === title,
            );
            if (duplicate) {
                duplicate.enabled = true;
                renderAlarmsList();
                showAlarmHint(`Báo thức ${pad(hour)}:${pad(minute)} (${title}) đã có sẵn và đang được bật!`);
                return;
            }

            alarmsList.push({ id: Date.now(), hour, minute, title, repeat, enabled: true });
            renderAlarmsList();
            showAlarmHint(`✓ Đã thêm báo thức lúc ${pad(hour)}:${pad(minute)} (${formatRemainMinutes(getMinutesUntilAlarm({ hour, minute }))}).`);
        });

        document.getElementById("al-list-container")?.addEventListener("click", (e) => {
            const toggleBtn = e.target.closest("[data-toggle-alarm]");
            if (toggleBtn) {
                const id = Number(toggleBtn.dataset.toggleAlarm);
                alarmsList = alarmsList.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
                renderAlarmsList();
                return;
            }
            const delBtn = e.target.closest("[data-del-alarm]");
            if (delBtn) {
                const id = Number(delBtn.dataset.delAlarm);
                alarmsList = alarmsList.filter((a) => a.id !== id);
                renderAlarmsList();
            }
        });

        document.getElementById("al-stop-ring-btn")?.addEventListener("click", () => {
            stopCurrentAudio();
            const banner = document.getElementById("al-ringing-banner");
            if (banner) banner.hidden = true;
        });

        document.getElementById("al-snooze-btn")?.addEventListener("click", () => {
            stopCurrentAudio();
            const banner = document.getElementById("al-ringing-banner");
            if (banner) banner.hidden = true;
            const snoozeTime = new Date(Date.now() + 5 * 60000);
            alarmsList.push({
                id: Date.now(),
                hour: snoozeTime.getHours(),
                minute: snoozeTime.getMinutes(),
                title: "Báo lại sau 5 phút (Snooze)",
                repeat: "Chỉ một lần",
                enabled: true,
            });
            renderAlarmsList();
        });

        let lastMinuteChecked = -1;
        setInterval(() => {
            const cur = new Date();
            setText(
                "al-live-clock-pill",
                `Giờ hiện tại: ${pad(cur.getHours())}:${pad(cur.getMinutes())}:${pad(cur.getSeconds())}`,
            );

            // Mỗi khi sang phút mới: cập nhật lại đếm ngược "Còn X giờ Y phút" và kiểm tra đổ chuông
            if (cur.getMinutes() !== lastMinuteChecked) {
                lastMinuteChecked = cur.getMinutes();
                renderAlarmsList();
            }

            if (cur.getSeconds() === 0) {
                alarmsList.forEach((a) => {
                    if (a.enabled && a.hour === cur.getHours() && a.minute === cur.getMinutes()) {
                        const banner = document.getElementById("al-ringing-banner");
                        if (banner) banner.hidden = false;
                        setText("al-ringing-title", `${pad(a.hour)}:${pad(a.minute)} — ${a.title}`);
                        playSoundEffect(customAlarmAudioUrl);
                    }
                });
            }
        }, 1000);
    });
})();