// assets/js/footer.js
// Chuyên trách duy nhất templates/footer.html: Đổi nhanh bản mệnh, Cuộn lên đầu trang & Form bản tin
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
                const headerWidgetBtn = document.getElementById("widget-trigger-btn");
                headerWidgetBtn?.click();
                headerWidgetBtn?.focus();
            };
        }

        const newsletterForm = document.getElementById("footer-newsletter-form");
        const emailInput = document.getElementById("footer-email");
        const feedbackEl = document.getElementById("footer-form-feedback");

        if (newsletterForm && emailInput && feedbackEl) {
            newsletterForm.onsubmit = (e) => {
                e.preventDefault();
                if (!emailInput.value.trim() || !emailInput.checkValidity()) {
                    feedbackEl.hidden = false;
                    feedbackEl.textContent = "Vui lòng nhập địa chỉ email hợp lệ!";
                    return;
                }
                feedbackEl.hidden = false;
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