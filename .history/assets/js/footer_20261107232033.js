// assets/js/footer.js
// Chuyên trách duy nhất Footer: Chấm đổi nhanh Ngũ hành, Nút cuộn đầu trang, Mở Modal từ Footer & Form Email
(() => {
    const syncFooterThemeDots = (activeTheme) => {
        document.querySelectorAll(".footer__element-dot").forEach((dot) => {
            const isMatch = dot.dataset.quickTheme === activeTheme;
            dot.classList.toggle("is-active", isMatch);
            dot.setAttribute("aria-pressed", String(isMatch));
        });
    };

    const initFooter = () => {
        const footer = document.getElementById("footer");
        if (!footer) return;

        const activeTheme = document.documentElement.getAttribute("data-theme") || "earth";
        syncFooterThemeDots(activeTheme);

        footer.querySelectorAll(".footer__element-dot").forEach((dot) => {
            dot.onclick = () => {
                if (typeof window.setFengShuiTheme === "function") {
                    window.setFengShuiTheme(dot.dataset.quickTheme);
                }
            };
        });

        const scrollTopBtn = footer.querySelector('[data-footer-action="scroll-top"]');
        if (scrollTopBtn) {
            scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
        }

        const converterBtn = footer.querySelector('[data-footer-action="open-converter"]');
        if (converterBtn) {
            converterBtn.onclick = () => {
                if (typeof window.openConverterModal === "function") {
                    window.openConverterModal(true);
                } else {
                    document.getElementById("widget-trigger-btn")?.click();
                }
            };
        }

        const newsletterForm = document.getElementById("footer-newsletter-form");
        const emailInput = document.getElementById("footer-email");
        const feedbackEl = document.getElementById("footer-form-feedback");

        if (newsletterForm && emailInput && feedbackEl) {
            newsletterForm.onsubmit = (e) => {
                e.preventDefault();
                feedbackEl.hidden = false;
                if (!emailInput.value.trim() || !emailInput.checkValidity()) {
                    feedbackEl.textContent = "Vui lòng nhập địa chỉ email hợp lệ!";
                    return;
                }
                feedbackEl.textContent = "Đăng ký nhận lịch ngày tốt thành công!";
                emailInput.value = "";
            };
        }
    };

    window.addEventListener("theme-changed", (e) => {
        if (e.detail?.theme) syncFooterThemeDots(e.detail.theme);
    });

    document.addEventListener("DOMContentLoaded", initFooter);
    window.addEventListener("template-loaded", initFooter);
})();
