// assets/js/auth.js
// Quản lý Phiên Đăng nhập, Đăng ký, Hướng 1 Header Auth, Profile Toggle, Danh sách Người thân & Đổi mật khẩu
(() => {
    const USER_STORAGE_KEY = "feng_shui_user_session";
    const USERS_DB_KEY = "feng_shui_registered_users";
    const FAMILY_STORAGE_KEY = "feng_shui_family_members";
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const STRONG_PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    const ELEMENT_LABELS = {
        metal: "Hành Kim",
        wood: "Hành Mộc",
        water: "Hành Thủy",
        fire: "Hành Hỏa",
        earth: "Hành Thổ",
    };

    const pad = (n) => String(n).padStart(2, "0");

    const escapeHtml = (str) =>
        String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const getInitials = (name) => {
        const parts = String(name || "TV")
            .trim()
            .split(/\s+/)
            .filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    };

    const getCurrentUser = () => {
        try {
            const raw = localStorage.getItem(USER_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            return null;
        }
    };

    const saveCurrentUser = (userObj) => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
        if (userObj?.element && typeof window.setFengShuiTheme === "function") {
            window.setFengShuiTheme(userObj.element);
        }
    };

    const getFamilyList = () => {
        try {
            const raw = localStorage.getItem(FAMILY_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    };

    const saveFamilyList = (list) => {
        localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(list));
    };

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    // 1. ĐỒNG BỘ HEADER: HƯỚNG 1 (ẨN NÚT TRÙNG LẶP BẰNG hidden) + PROFILE TOGGLE + ARIA-EXPANDED
    const syncHeaderAuthUI = () => {
        document.querySelectorAll(".js-header-dropdown, .converter-modal__dropdown").forEach((dd) => {
            if (dd.dataset.ariaSynced === "true") return;
            dd.dataset.ariaSynced = "true";
            const summary = dd.querySelector("summary");
            dd.addEventListener("toggle", () => {
                summary?.setAttribute("aria-expanded", String(dd.open));
            });
        });

        // Xử lý chọn ngôn ngữ qua data-lang
        const langList = document.getElementById("header-lang-list");
        if (langList && langList.dataset.bound !== "true") {
            langList.dataset.bound = "true";
            langList.addEventListener("click", (e) => {
                const link = e.target.closest("[data-lang]");
                if (!link) return;
                e.preventDefault();
                const langCode = link.dataset.lang;
                setText("header-lang-current", link.textContent.trim());
                langList.querySelectorAll("[data-lang]").forEach((item) => {
                    const isMatch = item === link;
                    item.classList.toggle("header__lang-link--active", isMatch);
                    if (isMatch) item.setAttribute("aria-current", "true");
                    else item.removeAttribute("aria-current");
                });
                document.documentElement.lang = langCode;
                document.getElementById("header-lang-dropdown")?.removeAttribute("open");
            });
        }

        const authRoot = document.getElementById("header-auth-root");
        const guestBox = document.getElementById("header-auth-guest");
        const profileDetails = document.getElementById("header-auth-profile");
        if (!authRoot || !guestBox || !profileDetails) return;

        // HƯỚNG 1: Đọc data-page từ <body> để gắn thuộc tính hidden cho nút trùng lặp trên Header (Chuẩn a11y)
        const currentPage = document.body.dataset.page || "";
        const headerSigninBtn = guestBox.querySelector('[data-auth-link="signin"]');
        const headerSignupBtn = guestBox.querySelector('[data-auth-link="signup"]');
        if (headerSigninBtn) headerSigninBtn.hidden = currentPage === "signin";
        if (headerSignupBtn) headerSignupBtn.hidden = currentPage === "signup";

        const user = getCurrentUser();
        if (user) {
            authRoot.dataset.authState = "authenticated";
            guestBox.hidden = true;
            profileDetails.hidden = false;

            const initials = getInitials(user.name);
            const elemLabel = ELEMENT_LABELS[user.element] || "Hành Thổ";

            setText("header-profile-avatar", initials);
            setText("header-profile-name", user.name);
            setText("header-profile-element", elemLabel);
            setText("header-popover-avatar", initials);
            setText("header-popover-name", user.name);
            setText("header-popover-email", user.email);
            setText("header-popover-destiny", `Bản mệnh: ${elemLabel}`);

            const baziLink = document.getElementById("header-profile-bazi-link");
            if (baziLink) {
                const genderParam = user.gender ? `&gender=${user.gender}` : "";
                baziLink.href = user.birthdate ? `./bazi.html?date=${user.birthdate}${genderParam}` : "./bazi.html";
            }
        } else {
            authRoot.dataset.authState = "guest";
            guestBox.hidden = false;
            profileDetails.hidden = true;
            profileDetails.removeAttribute("open");
        }

        if (authRoot.dataset.authBound !== "true") {
            authRoot.dataset.authBound = "true";
            authRoot.addEventListener("click", (e) => {
                const actionBtn = e.target.closest("[data-auth-action]");
                if (!actionBtn) return;

                const action = actionBtn.dataset.authAction;
                if (action === "logout") {
                    localStorage.removeItem(USER_STORAGE_KEY);
                    syncHeaderAuthUI();
                    if (document.body.dataset.page === "profile") {
                        window.location.href = "./sign-in.html";
                    }
                } else if (action === "open-converter") {
                    profileDetails.removeAttribute("open");
                    if (typeof window.openConverterModal === "function") {
                        window.openConverterModal(true);
                    }
                }
            });
        }
    };

    // 2. TIỆN ÍCH HIỂN THỊ LỖI & ĐO ĐỘ MẠNH MẬT KHẨU
    const setFieldError = (inputEl, errorId, message) => {
        const errEl = document.getElementById(errorId);
        if (!inputEl || !errEl) return;
        const hasError = Boolean(message);
        inputEl.setAttribute("aria-invalid", String(hasError));
        errEl.textContent = message || "";
        errEl.hidden = !hasError;
    };

    const showBannerAlert = (alertId, message, type = "error") => {
        const alertEl = document.getElementById(alertId);
        if (!alertEl) return;
        alertEl.dataset.type = type;
        alertEl.textContent = message;
        alertEl.hidden = false;
        alertEl.focus();
    };

    const evaluatePasswordStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[@$!%*?&#]/.test(pw)) score++;
        const labels = ["Chưa nhập", "Yếu", "Trung bình", "Khá mạnh", "Rất mạnh"];
        return { score, label: pw ? labels[score] : labels[0] };
    };

    const bindPasswordMeter = (inputId, meterId, labelId, prefixText) => {
        const input = document.getElementById(inputId);
        const meter = document.getElementById(meterId);
        const labelEl = document.getElementById(labelId);
        if (!input || !meter || !labelEl || input.dataset.meterBound === "true") return;
        input.dataset.meterBound = "true";

        input.addEventListener("input", () => {
            const { score, label } = evaluatePasswordStrength(input.value);
            meter.value = score;
            meter.textContent = `${score}/4`;
            labelEl.textContent = `${prefixText}: ${label}`;
        });
    };

    // 3. ẨN / HIỆN MẬT KHẨU QUA data-toggle-password
    const bindPasswordToggles = () => {
        document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
            if (btn.dataset.bound === "true") return;
            btn.dataset.bound = "true";

            btn.addEventListener("click", () => {
                const input = document.getElementById(btn.dataset.togglePassword);
                if (!input) return;
                const showText = input.type === "password";
                input.type = showText ? "text" : "password";
                btn.setAttribute("aria-pressed", String(showText));
                btn.setAttribute("aria-label", showText ? "Ẩn mật khẩu" : "Hiện mật khẩu");
            });
        });
    };

    // 4. BỘ CHỌN 5 BẢN MỆNH QUA data-element-picker
    const bindElementPickers = () => {
        document.querySelectorAll("[data-element-picker]").forEach((group) => {
            if (group.dataset.bound === "true") return;
            group.dataset.bound = "true";

            const hiddenInput = document.getElementById(group.dataset.elementPicker);
            group.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-select-element]");
                if (!btn) return;
                const chosenElement = btn.dataset.selectElement;
                if (hiddenInput) hiddenInput.value = chosenElement;

                group.querySelectorAll("[data-select-element]").forEach((b) => {
                    const isSel = b === btn;
                    b.classList.toggle("is-active", isSel);
                    b.setAttribute("aria-pressed", String(isSel));
                });

                if (typeof window.setFengShuiTheme === "function") {
                    window.setFengShuiTheme(chosenElement);
                }
            });
        });
    };

    // 5. QUẢN LÝ 3 TAB TRÊN PROFILE.HTML (ROVING TABINDEX + HASH #family / #security)
    const initProfileTabs = () => {
        const tablist = document.getElementById("profile-tablist");
        if (!tablist || tablist.dataset.bound === "true") return;
        tablist.dataset.bound = "true";

        const tabs = Array.from(tablist.querySelectorAll("[data-profile-tab]"));

        const activateTab = (tabKey, shouldFocus = false) => {
            const targetBtn = tabs.find((t) => t.dataset.profileTab === tabKey) || tabs[0];
            if (!targetBtn) return;

            tabs.forEach((btn) => {
                const isSelected = btn === targetBtn;
                btn.classList.toggle("is-active", isSelected);
                btn.setAttribute("aria-selected", String(isSelected));
                btn.setAttribute("tabindex", isSelected ? "0" : "-1");

                const panelId = btn.getAttribute("aria-controls");
                const panel = panelId ? document.getElementById(panelId) : null;
                if (panel) panel.hidden = !isSelected;
            });

            const alertEl = document.getElementById("profile-alert");
            if (alertEl) alertEl.hidden = true;

            if (shouldFocus) targetBtn.focus();
        };

        tabs.forEach((btn, idx) => {
            btn.addEventListener("click", () => activateTab(btn.dataset.profileTab, false));
            btn.addEventListener("keydown", (e) => {
                let nextIdx = -1;
                if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
                if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
                if (nextIdx !== -1) {
                    e.preventDefault();
                    activateTab(tabs[nextIdx].dataset.profileTab, true);
                }
            });
        });

        const hash = window.location.hash.replace("#", "");
        if (["info", "family", "security"].includes(hash)) {
            activateTab(hash, false);
        }
    };

    // 6. RENDER DANH SÁCH NGƯỜI THÂN (QUY ĐỔI ÂM LỊCH & NẠP ÂM TỰ ĐỘNG BẰNG LUNARENGINE)
    const renderFamilyMembers = () => {
        const listEl = document.getElementById("profile-family-list");
        if (!listEl) return;

        const members = getFamilyList();
        setText("tab-family-count", String(members.length));
        setText("profile-hero-family-count", `${members.length} hồ sơ`);

        if (!members.length) {
            listEl.innerHTML = `
                <div class="family-list__empty">
                    Chưa có hồ sơ người thân nào được lưu. Thêm ngày sinh phía trên để tra cứu Âm lịch, Nạp âm và mở
                    nhanh Lá số Bát Tự!
                </div>
            `;
            return;
        }

        listEl.innerHTML = members
            .map((m) => {
                const safeName = escapeHtml(m.name);
                const safeRel = escapeHtml(m.relation);
                const [y, mo, d] = String(m.birthdate || "").split("-").map(Number);
                const dispSolar = y && mo && d ? `${pad(d)}/${pad(mo)}/${y}` : m.birthdate;

                let lunarStr = "";
                let napAmStr = "Đang quy đổi bản mệnh";
                let zodiacFile = "horse";

                if (y && mo && d && window.LunarEngine) {
                    const info = window.LunarEngine.getFullDayInfo(d, mo, y);
                    lunarStr = ` • ÂL: ${pad(info.lunarDay)}/${pad(info.lunarMonth)} ${info.yearCanChi}`;
                    napAmStr = `Mệnh năm: ${info.yearNapAm} (${m.gender === "female" ? "Nữ mệnh" : "Nam mệnh"})`;
                    zodiacFile = info.yearZodiacFile || "horse";
                }

                const baziHref = `./bazi.html?date=${encodeURIComponent(m.birthdate)}&gender=${encodeURIComponent(m.gender || "female")}`;

                return `
                    <article
                        class="family-card"
                        itemscope
                        itemtype="https://schema.org/Person"
                        data-family-id="${m.id}"
                    >
                        <div class="family-card__left">
                            <span class="family-card__zodiac" aria-hidden="true">
                                <img src="./assets/icons/zodiac/${zodiacFile}.svg" alt="" />
                            </span>
                            <div class="family-card__info">
                                <div class="family-card__head">
                                    <strong class="family-card__name" itemprop="name">${safeName}</strong>
                                    <span class="family-card__rel">${safeRel}</span>
                                </div>
                                <span class="family-card__dates">
                                    DL: <time itemprop="birthDate" datetime="${escapeHtml(m.birthdate)}">${dispSolar}</time>${lunarStr}
                                </span>
                                <span class="family-card__napam">${napAmStr}</span>
                            </div>
                        </div>

                        <div class="family-card__actions">
                            <a
                                href="${baziHref}"
                                class="btn family-card__bazi-btn"
                                title="Mở Lá số Bát Tự cho ${safeName}"
                            >
                                <span>Xem Bát Tự</span>
                                <span aria-hidden="true">&#8594;</span>
                            </a>
                            <button
                                type="button"
                                class="family-card__del-btn"
                                data-del-family-id="${m.id}"
                                aria-label="Xóa hồ sơ ${safeName}"
                                title="Xóa khỏi danh sách"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </article>
                `;
            })
            .join("");
    };

    // 7. ĐỒNG BỘ GIAO DIỆN TRANG PROFILE (profile.html)
    const renderProfileView = () => {
        const profileForm = document.getElementById("form-profile");
        if (!profileForm) return;

        let user = getCurrentUser();
        if (!user) {
            user = {
                name: "Minh Khôi",
                email: "minhkhoi@lichphongthuy.vn",
                element: document.documentElement.getAttribute("data-theme") || "earth",
                birthdate: "1995-08-15",
                gender: "male",
                password: "Demo@1234",
            };
            saveCurrentUser(user);
            syncHeaderAuthUI();
        }

        const initials = getInitials(user.name);
        const elemLabel = ELEMENT_LABELS[user.element] || "Hành Thổ";

        setText("profile-hero-avatar", initials);
        setText("profile-hero-name", user.name);
        setText("profile-hero-email", user.email);
        setText("profile-hero-element", `Bản mệnh: ${elemLabel}`);

        const nameInput = document.getElementById("profile-name");
        const emailInput = document.getElementById("profile-email");
        const birthInput = document.getElementById("profile-birthdate");
        const genderSelect = document.getElementById("profile-gender");
        const elemInput = document.getElementById("profile-element-input");

        if (nameInput) nameInput.value = user.name || "";
        if (emailInput) emailInput.value = user.email || "";
        if (birthInput) birthInput.value = user.birthdate || "";
        if (genderSelect) genderSelect.value = user.gender || "male";
        if (elemInput) elemInput.value = user.element || "earth";

        document.querySelectorAll("#profile-element-group [data-select-element]").forEach((btn) => {
            const isMatch = btn.dataset.selectElement === (user.element || "earth");
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-pressed", String(isMatch));
        });

        const baziBtn = document.getElementById("profile-open-bazi-btn");
        if (baziBtn) {
            const genderParam = user.gender ? `&gender=${user.gender}` : "";
            baziBtn.href = user.birthdate ? `./bazi.html?date=${user.birthdate}${genderParam}` : "./bazi.html";
        }

        if (user.birthdate && window.LunarEngine) {
            const [y, m, d] = user.birthdate.split("-").map(Number);
            if (y && m && d) {
                const info = window.LunarEngine.getFullDayInfo(d, m, y);
                setText(
                    "profile-lunar-summary",
                    `${pad(info.lunarDay)}/${pad(info.lunarMonth)} ${info.yearCanChi} • ${info.yearNapAm}`,
                );
                const wm = document.getElementById("profile-hero-watermark");
                if (wm) wm.src = `./assets/icons/zodiac/${info.yearZodiacFile}.svg`;
            }
        }

        renderFamilyMembers();
    };

    // 8. KHỞI TẠO CÁC FORM SIGN-IN, SIGN-UP, PROFILE, FAMILY & CHANGE PASSWORD
    const initAuthForms = () => {
        bindPasswordToggles();
        bindElementPickers();
        initProfileTabs();

        bindPasswordMeter("signup-password", "signup-pw-meter", "signup-pw-strength-text", "Độ mạnh mật khẩu");
        bindPasswordMeter("pw-new", "pw-new-meter", "pw-new-strength-text", "Độ mạnh mật khẩu mới");

        document.querySelectorAll(".auth-form__input").forEach((input) => {
            if (input.dataset.clearBound === "true") return;
            input.dataset.clearBound = "true";
            input.addEventListener("input", () => {
                const errId = `${input.id}-error`;
                if (document.getElementById(errId)) {
                    setFieldError(input, errId, "");
                }
            });
        });

        // Nút Demo Login, Quên mật khẩu & Đăng xuất trên trang Profile
        document.querySelectorAll("[data-auth-action='demo-login']").forEach((btn) => {
            btn.onclick = () => {
                const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";
                saveCurrentUser({
                    name: "Minh Khôi",
                    email: "minhkhoi@lichphongthuy.vn",
                    element: activeTheme,
                    birthdate: "1995-08-15",
                    gender: "male",
                    password: "Demo@1234",
                });
                window.location.href = "./index.html";
            };
        });

        document.querySelectorAll("[data-auth-action='forgot-hint']").forEach((link) => {
            link.onclick = (e) => {
                e.preventDefault();
                showBannerAlert(
                    "signin-alert",
                    "Chế độ bản tĩnh (Frontend): Bạn có thể bấm 'Dùng thử tài khoản Demo' (mật khẩu Demo@1234) hoặc tạo nhanh tài khoản mới ở trang Đăng ký.",
                    "success",
                );
            };
        });

        document.querySelectorAll(".auth-page [data-auth-action='logout']").forEach((btn) => {
            btn.onclick = () => {
                localStorage.removeItem(USER_STORAGE_KEY);
                syncHeaderAuthUI();
                window.location.href = "./sign-in.html";
            };
        });

        // Submit Form Đăng Nhập
        const signinForm = document.getElementById("form-signin");
        if (signinForm && signinForm.dataset.bound !== "true") {
            signinForm.dataset.bound = "true";
            signinForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const emailInput = document.getElementById("signin-email");
                const pwInput = document.getElementById("signin-password");
                let isValid = true;

                const emailVal = emailInput.value.trim();
                const pwVal = pwInput.value.trim();

                if (!EMAIL_REGEX.test(emailVal)) {
                    setFieldError(emailInput, "signin-email-error", "Vui lòng nhập địa chỉ email hợp lệ.");
                    isValid = false;
                } else {
                    setFieldError(emailInput, "signin-email-error", "");
                }

                if (pwVal.length < 6) {
                    setFieldError(pwInput, "signin-password-error", "Mật khẩu phải có ít nhất 6 ký tự.");
                    isValid = false;
                } else {
                    setFieldError(pwInput, "signin-password-error", "");
                }

                if (!isValid) return;

                const registered = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]");
                const found = registered.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());

                if (found && found.password && found.password !== pwVal) {
                    setFieldError(pwInput, "signin-password-error", "Mật khẩu chưa chính xác.");
                    return;
                }

                saveCurrentUser({
                    name: found?.name || emailVal.split("@")[0],
                    email: emailVal,
                    element: found?.element || document.documentElement.getAttribute("data-theme") || "earth",
                    birthdate: found?.birthdate || "",
                    gender: found?.gender || "male",
                    password: pwVal,
                });

                showBannerAlert("signin-alert", "Đăng nhập thành công! Đang chuyển về trang chủ...", "success");
                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 550);
            });
        }

        // Submit Form Đăng Ký
        const signupForm = document.getElementById("form-signup");
        if (signupForm && signupForm.dataset.bound !== "true") {
            signupForm.dataset.bound = "true";
            signupForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const nameInput = document.getElementById("signup-name");
                const emailInput = document.getElementById("signup-email");
                const pwInput = document.getElementById("signup-password");
                const confirmInput = document.getElementById("signup-confirm");
                const termsInput = document.getElementById("signup-terms");
                const birthInput = document.getElementById("signup-birthdate");
                const elementVal = document.getElementById("signup-element-input")?.value || "earth";

                let isValid = true;

                if (nameInput.value.trim().length < 2) {
                    setFieldError(nameInput, "signup-name-error", "Vui lòng nhập họ và tên (tối thiểu 2 ký tự).");
                    isValid = false;
                } else {
                    setFieldError(nameInput, "signup-name-error", "");
                }

                if (!EMAIL_REGEX.test(emailInput.value.trim())) {
                    setFieldError(emailInput, "signup-email-error", "Email không đúng định dạng.");
                    isValid = false;
                } else {
                    setFieldError(emailInput, "signup-email-error", "");
                }

                if (!STRONG_PW_REGEX.test(pwInput.value.trim())) {
                    setFieldError(
                        pwInput,
                        "signup-password-error",
                        "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
                    );
                    isValid = false;
                } else {
                    setFieldError(pwInput, "signup-password-error", "");
                }

                if (!confirmInput.value || confirmInput.value !== pwInput.value) {
                    setFieldError(confirmInput, "signup-confirm-error", "Mật khẩu nhập lại chưa khớp.");
                    isValid = false;
                } else {
                    setFieldError(confirmInput, "signup-confirm-error", "");
                }

                if (!termsInput.checked) {
                    setFieldError(termsInput, "signup-terms-error", "Bạn cần đồng ý điều khoản sử dụng.");
                    isValid = false;
                } else {
                    setFieldError(termsInput, "signup-terms-error", "");
                }

                if (!isValid) return;

                const newUser = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    element: elementVal,
                    birthdate: birthInput?.value || "",
                    gender: "male",
                    password: pwInput.value.trim(),
                };

                const registered = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]").filter(
                    (u) => u.email.toLowerCase() !== newUser.email.toLowerCase(),
                );
                registered.push(newUser);
                localStorage.setItem(USERS_DB_KEY, JSON.stringify(registered));
                saveCurrentUser(newUser);

                showBannerAlert("signup-alert", "Tạo tài khoản thành công! Đang chuyển về trang chủ...", "success");
                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 550);
            });
        }

        // Submit Form Cập Nhật Hồ Sơ (Tab 1 - profile.html)
        const profileForm = document.getElementById("form-profile");
        if (profileForm && profileForm.dataset.bound !== "true") {
            profileForm.dataset.bound = "true";
            renderProfileView();

            profileForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const nameInput = document.getElementById("profile-name");
                const emailInput = document.getElementById("profile-email");
                const birthInput = document.getElementById("profile-birthdate");
                const genderSelect = document.getElementById("profile-gender");
                const elementVal = document.getElementById("profile-element-input")?.value || "earth";

                let isValid = true;
                if (nameInput.value.trim().length < 2) {
                    setFieldError(nameInput, "profile-name-error", "Họ và tên phải có ít nhất 2 ký tự.");
                    isValid = false;
                } else {
                    setFieldError(nameInput, "profile-name-error", "");
                }

                if (!EMAIL_REGEX.test(emailInput.value.trim())) {
                    setFieldError(emailInput, "profile-email-error", "Email không đúng định dạng.");
                    isValid = false;
                } else {
                    setFieldError(emailInput, "profile-email-error", "");
                }

                if (!isValid) return;

                const existing = getCurrentUser() || {};
                const updatedUser = {
                    ...existing,
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    element: elementVal,
                    birthdate: birthInput?.value || "",
                    gender: genderSelect?.value || "male",
                };

                saveCurrentUser(updatedUser);
                syncHeaderAuthUI();
                renderProfileView();
                showBannerAlert("profile-alert", "Đã lưu thay đổi hồ sơ và đồng bộ bản mệnh thành công!", "success");
            });
        }

        // Submit Form Thêm Người Thân & Xóa Người Thân (Tab 2 - profile.html)
        const familyForm = document.getElementById("form-family-add");
        const familyListEl = document.getElementById("profile-family-list");
        if (familyForm && familyForm.dataset.bound !== "true") {
            familyForm.dataset.bound = "true";
            familyForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const nameInput = document.getElementById("family-name");
                const relSelect = document.getElementById("family-relation");
                const birthInput = document.getElementById("family-birthdate");
                const genderSelect = document.getElementById("family-gender");

                let isValid = true;
                if (nameInput.value.trim().length < 2) {
                    setFieldError(nameInput, "family-name-error", "Vui lòng nhập tên người thân (tối thiểu 2 ký tự).");
                    isValid = false;
                } else {
                    setFieldError(nameInput, "family-name-error", "");
                }

                if (!birthInput.value) {
                    setFieldError(birthInput, "family-birthdate-error", "Vui lòng chọn ngày sinh Dương lịch.");
                    isValid = false;
                } else {
                    setFieldError(birthInput, "family-birthdate-error", "");
                }

                if (!isValid) return;

                const members = getFamilyList();
                members.unshift({
                    id: String(Date.now()),
                    name: nameInput.value.trim(),
                    relation: relSelect?.value || "Người thân",
                    birthdate: birthInput.value,
                    gender: genderSelect?.value || "female",
                });
                saveFamilyList(members);
                renderFamilyMembers();

                nameInput.value = "";
                birthInput.value = "";
                showBannerAlert("profile-alert", "Đã lưu hồ sơ người thân vào danh sách!", "success");
            });
        }

        if (familyListEl && familyListEl.dataset.delBound !== "true") {
            familyListEl.dataset.delBound = "true";
            familyListEl.addEventListener("click", (e) => {
                const delBtn = e.target.closest("[data-del-family-id]");
                if (!delBtn) return;
                const targetId = delBtn.dataset.delFamilyId;
                const remaining = getFamilyList().filter((m) => String(m.id) !== String(targetId));
                saveFamilyList(remaining);
                renderFamilyMembers();
                showBannerAlert("profile-alert", "Đã xóa hồ sơ khỏi danh sách người thân.", "success");
            });
        }

        // Submit Form Đổi Mật Khẩu (Tab 3 - profile.html)
        const changePwForm = document.getElementById("form-change-password");
        if (changePwForm && changePwForm.dataset.bound !== "true") {
            changePwForm.dataset.bound = "true";
            changePwForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const curInput = document.getElementById("pw-current");
                const newInput = document.getElementById("pw-new");
                const confirmInput = document.getElementById("pw-confirm");
                const user = getCurrentUser();
                const expectedPw = user?.password || "Demo@1234";

                let isValid = true;
                if (!curInput.value.trim()) {
                    setFieldError(curInput, "pw-current-error", "Vui lòng nhập mật khẩu hiện tại.");
                    isValid = false;
                } else if (curInput.value.trim() !== expectedPw) {
                    setFieldError(curInput, "pw-current-error", "Mật khẩu hiện tại chưa chính xác.");
                    isValid = false;
                } else {
                    setFieldError(curInput, "pw-current-error", "");
                }

                if (!STRONG_PW_REGEX.test(newInput.value.trim())) {
                    setFieldError(
                        newInput,
                        "pw-new-error",
                        "Mật khẩu mới cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
                    );
                    isValid = false;
                } else if (newInput.value.trim() === expectedPw) {
                    setFieldError(newInput, "pw-new-error", "Mật khẩu mới phải khác mật khẩu hiện tại.");
                    isValid = false;
                } else {
                    setFieldError(newInput, "pw-new-error", "");
                }

                if (!confirmInput.value || confirmInput.value !== newInput.value) {
                    setFieldError(confirmInput, "pw-confirm-error", "Mật khẩu xác nhận chưa khớp.");
                    isValid = false;
                } else {
                    setFieldError(confirmInput, "pw-confirm-error", "");
                }

                if (!isValid) return;

                const nextPw = newInput.value.trim();
                const updatedUser = { ...(user || {}), password: nextPw };
                saveCurrentUser(updatedUser);

                // Cập nhật đồng bộ vào danh sách đăng ký cục bộ
                const registered = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]");
                const idx = registered.findIndex((u) => u.email.toLowerCase() === updatedUser.email?.toLowerCase());
                if (idx !== -1) {
                    registered[idx].password = nextPw;
                    localStorage.setItem(USERS_DB_KEY, JSON.stringify(registered));
                }

                changePwForm.reset();
                const meter = document.getElementById("pw-new-meter");
                if (meter) meter.value = 0;
                setText("pw-new-strength-text", "Độ mạnh mật khẩu mới: Chưa nhập");
                setText("profile-hero-security-status", "Vừa cập nhật");
                showBannerAlert("profile-alert", "Đổi mật khẩu thành công!", "success");
            });
        }
    };

    const bootAuthModule = () => {
        syncHeaderAuthUI();
        initAuthForms();
    };

    document.addEventListener("DOMContentLoaded", bootAuthModule);
    window.addEventListener("template-loaded", syncHeaderAuthUI);
})();