// 1. Logic đổi theme thủ công của bạn
function changeTheme(themeName) {
    const body = document.body;
    if (themeName === "") {
        body.removeAttribute("data-theme");
    } else {
        body.setAttribute("data-theme", themeName);
    }
}

// 2. LOGIC GẮN SỰ KIỆN (EVENT LISTENER) VÀO HTML
// Bắt toàn bộ các nút bấm có class 'header__theme-btn'
const themeButtons = document.querySelectorAll(".header__theme-btn");

// Duyệt qua từng nút và gắn sự kiện click
themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
        // Trích xuất giá trị từ attribute 'data-theme' của chính nút vừa bấm
        const selectedTheme = this.getAttribute("data-theme");

        // Gọi hàm đổi theme
        changeTheme(selectedTheme);
    });
});
