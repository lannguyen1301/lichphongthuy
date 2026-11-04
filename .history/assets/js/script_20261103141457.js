// Trong assets/js/script.js - Cập nhật hàm load():
function load(selector, path) {
    const targetEl = $(selector);
    if (!targetEl) return;

    const cached = localStorage.getItem(path);
    if (cached) {
        targetEl.innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                targetEl.innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}