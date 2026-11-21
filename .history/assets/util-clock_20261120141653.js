// assets/js/utilities/util-clock.js
// Mục 1: Bộ 3 Đồng hồ (Bấm giờ 1/100s, Đếm ngược Bento Stepper + Upload nhạc, Báo thức đa năng + Snooze)
(() => {
    const Hub = window.UtilHub;
    if (!Hub) return;

    const { pad, setText, playSoundEffect, stopCurrentAudio } = Hub;

    let customCountdownAudioUrl = "";
    let customAlarmAudioUrl = "";

    let swTimer = null;
    let swStartTime = 0;
    let swElapsedMs = 0;
    let swRunning = false;
    let swLaps = [];

    let cdTimer = null;
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

    const formatStopwatch = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const centi = Math.floor((ms % 1000) / 10);
        return { main: `${pad(h)}:${pad(m)}:${pad(s)}`, ms: `.${pad(centi)}` };
    };

    const renderStopwatchLaps = () => {
        const body = document.getElementById("sw-laps-body");
        if (!body) return;
        if (!swLaps.length) {
            body.innerHTML = `<p class="util-data-table__empty">Chưa có dữ liệu bấm giờ. Hãy nhấn <strong>Bắt đầu</strong> và thực hiện <strong>Ngắt (Vòng)</strong> để lưu lại.</p>`;
            return;
        }
        body.innerHTML = swLaps
            .map(
                (l) => `
                    <div class="util-data-table__row util-data-table__row--3cols" role="row">
                        <span>Vòng #${pad(l.idx)}</span>
                        <span>+${l.lapStr}</span>
                        <strong>${l.totalStr}</strong>
                    </div>
                `,
            )
            .join("");
    };

    const renderAlarmsList = () => {
        const container = document.getElementById("al-list-container");
        if (!container) return;
        if (!alarmsList.length) {
            container.innerHTML = `<p class="util-data-table__empty">Chưa có báo thức nào. Thêm báo thức của bạn ở trên.</p>`;
            return;
        }
        container.innerHTML = alarmsList
            .map(
                (a) => `
                    <article class="util-alarm-item ${a.enabled ? "" : "is-disabled"}" data-alarm-id="${a.id}">
                        <div>
                            <strong class="util-alarm-item__time">${pad(a.hour)}:${pad(a.minute)}</strong>
                            <span class="util-alarm-item__title">${a.title}</span>
                            <small class="util-alarm-item__meta">🔁 ${a.repeat || "Hằng ngày"} • ${a.enabled ? "Đang bật" : "Đã tắt"}</small>
                        </div>
                        <div class="util-alarm-item__right">
                            <button
                                type="button"
                                class="util-alarm-item__toggle ${a.enabled ? "is-on" : ""}"
                                data-toggle-alarm="${a.id}"
                                aria-pressed="${a.enabled}"
                                aria-label="Bật hoặc tắt báo thức ${pad(a.hour)}:${pad(a.minute)}"
                                title="Bật / Tắt báo thức này"
                            ></button>
                            <button
                                type="button"
                                class="util-alarm-item__del"
                                data-del-alarm="${a.id}"
                                aria-label="Xóa báo thức ${pad(a.hour)}:${pad(a.minute)}"
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
                    </article>
                `,
            )
            .join("");
    };

    Hub.registerModule(() => {
        renderStopwatchLaps();
        renderAlarmsList();

        // 1.1. Đồng hồ bấm giờ
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
                    setText("sw-status-tag", "Đang bấm giờ...");
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
                    setText("sw-status-tag", "Đang tạm dừng");
                    setText("sw-head-badge", "Tạm dừng");
                }
            };
        }

        if (swLapBtn) {
            swLapBtn.onclick = () => {
                if (!swRunning) return;
                const prevTotalMs = swLaps[0]?.totalMs || 0;
                const lapFmt = formatStopwatch(swElapsedMs - prevTotalMs);
                const totalFmt = formatStopwatch(swElapsedMs);
                swLaps.unshift({
                    idx: swLaps.length + 1,
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
                setText("sw-main-display", "00:00:00");
                setText("sw-ms-display", ".00");
                setText("sw-status-tag", "Sẵn sàng bấm giờ");
                setText("sw-head-badge", "Chuẩn 1/100s");
                if (swStartBtn) swStartBtn.innerHTML = "<span>&#9654; Bắt đầu</span>";
                if (swLapBtn) swLapBtn.disabled = true;
                renderStopwatchLaps();
            };
        }

        // 1.2. Đồng hồ đếm ngược & Upload nhạc từ máy
        const syncCountdownDisplay = (sec) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            setText("cd-display-digits", `${pad(h)}:${pad(m)}:${pad(s)}`);
        };

        ["cd-input-hours", "cd-input-minutes", "cd-input-seconds"].forEach((id) => {
            document.getElementById(id)?.addEventListener("input", () => {
                if (cdRunning) return;
                const h = Number(document.getElementById("cd-input-hours")?.value || 0);
                const m = Number(document.getElementById("cd-input-minutes")?.value || 0);
                const s = Number(document.getElementById("cd-input-seconds")?.value || 0);
                cdRemainingSec = Math.max(0, h * 3600 + m * 60 + s);
                syncCountdownDisplay(cdRemainingSec);
            });
        });

        document.querySelectorAll("[data-cd-preset]").forEach((chip) => {
            chip.onclick = () => {
                document
                    .querySelectorAll("[data-cd-preset]")
                    .forEach((c) => c.classList.toggle("is-active", c === chip));
                const total = Number(chip.dataset.cdPreset || 300);
                cdRemainingSec = total;
                const hEl = document.getElementById("cd-input-hours");
                const mEl = document.getElementById("cd-input-minutes");
                const sEl = document.getElementById("cd-input-seconds");
                if (hEl) hEl.value = String(Math.floor(total / 3600));
                if (mEl) mEl.value = String(Math.floor((total % 3600) / 60));
                if (sEl) sEl.value = String(total % 60);
                syncCountdownDisplay(cdRemainingSec);
            };
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
                    const title = document.getElementById("cd-input-title")?.value || "Đồng hồ đếm ngược";
                    if (!cdTimer) cdRemainingSec = Math.max(1, h * 3600 + m * 60 + s);

                    cdRunning = true;
                    setText("cd-active-title-label", title);
                    setText("cd-status-badge", "Đang đếm ngược");
                    cdStartBtn.innerHTML = "<span>&#10074;&#10074; Tạm dừng hẹn giờ</span>";

                    cdHistory.unshift({
                        idx: cdHistory.length + 1,
                        title,
                        duration: `${pad(h)}:${pad(m)}:${pad(s)}`,
                        startedAt: new Date().toLocaleTimeString("vi-VN"),
                    });
                    const histBody = document.getElementById("cd-history-body");
                    if (histBody) {
                        histBody.innerHTML = cdHistory
                            .map(
                                (item) => `
                                    <div class="util-data-table__row util-data-table__row--4cols" role="row">
                                        <span>#${pad(item.idx)}</span>
                                        <strong>${item.title}</strong>
                                        <span>${item.duration}</span>
                                        <span>${item.startedAt}</span>
                                    </div>
                                `,
                            )
                            .join("");
                    }

                    cdTimer = setInterval(() => {
                        cdRemainingSec = Math.max(0, cdRemainingSec - 1);
                        syncCountdownDisplay(cdRemainingSec);
                        if (cdRemainingSec <= 0) {
                            clearInterval(cdTimer);
                            cdTimer = null;
                            cdRunning = false;
                            cdStartBtn.innerHTML = "<span>&#9654; Bắt đầu hẹn giờ</span>";
                            setText("cd-status-badge", "🔔 Đã hết giờ!");
                            playSoundEffect(customCountdownAudioUrl);
                        }
                    }, 1000);
                } else {
                    cdRunning = false;
                    clearInterval(cdTimer);
                    cdStartBtn.innerHTML = "<span>&#9654; Tiếp tục hẹn giờ</span>";
                    setText("cd-status-badge", "Tạm dừng");
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
            syncCountdownDisplay(cdRemainingSec);
            if (cdStartBtn) cdStartBtn.innerHTML = "<span>&#9654; Bắt đầu hẹn giờ</span>";
            setText("cd-status-badge", "Đang chờ");
        });

        // 1.3. Đồng hồ báo thức (Upload nhạc + Toggle + Snooze + Thùng rác SVG)
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

        document.getElementById("al-add-btn")?.addEventListener("click", () => {
            const hour = Math.min(23, Math.max(0, Number(document.getElementById("al-input-hour")?.value || 6)));
            const minute = Math.min(59, Math.max(0, Number(document.getElementById("al-input-minute")?.value || 30)));
            const title = document.getElementById("al-input-title")?.value || "Dậy học bài";
            const repeat = document.getElementById("al-repeat-text")?.dataset.repeatVal || "Hằng ngày";
            alarmsList.push({ id: Date.now(), hour, minute, title, repeat, enabled: true });
            renderAlarmsList();
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

        setInterval(() => {
            const cur = new Date();
            setText(
                "al-live-clock-pill",
                `Giờ hiện tại: ${pad(cur.getHours())}:${pad(cur.getMinutes())}:${pad(cur.getSeconds())}`,
            );
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