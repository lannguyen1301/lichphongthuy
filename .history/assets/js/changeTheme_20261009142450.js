// 1. Logic đổi theme và LƯU vào localStorage
function changeTheme(themeName) {
    const rootElement = document.documentElement; // Đã đổi sang thẻ <html> cho chuẩn

    if (themeName === "") {
        rootElement.removeAttribute("data-theme");
        // Xóa khỏi bộ nhớ nếu user chọn về mặc định
        localStorage.removeItem("user_theme");
    } else {
        rootElement.setAttribute("data-theme", themeName);
        // Lưu giá trị theme vào bộ nhớ với chìa khóa là "user_theme"
        localStorage.setItem("user_theme", themeName);
    }
}

// 2. LOGIC KIỂM TRA THEME CŨ KHI VỪA VÀO TRANG (Chạy đầu tiên)
// Dòng này rất quan trọng để khôi phục theme ngay khi trình duyệt vừa load
function loadSavedTheme() {
    // Lấy lại giá trị đã lưu trước đó
    const savedTheme = localStorage.getItem("user_theme");

    // Nếu có giá trị (user đã từng chọn), thì áp dụng ngay lập tức
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
}

// Chạy hàm kiểm tra ngay khi file JS được nạp
loadSavedTheme();

// 3. LOGIC GẮN SỰ KIỆN (EVENT LISTENER) VÀO NÚT BẤM
const themeButtons = document.querySelectorAll(".header__theme-btn");

themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const selectedTheme = this.getAttribute("data-theme");
        changeTheme(selectedTheme);
    });
});
