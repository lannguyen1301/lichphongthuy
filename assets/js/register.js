import { showError, showSuccess, emailRegex, strongPasswordRegex } from "./validation.js";

const form = document.getElementById("form-signup");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

if (form) {
    // --- 1. XỬ LÝ KHI NGƯỜI DÙNG CLICK RA NGOÀI (BLUR) ---
    email.addEventListener("blur", () => {
        if (email.value.trim() !== "") {
            if (!emailRegex.test(email.value.trim())) {
                showError(email, "Email không đúng định dạng");
            } else {
                showSuccess(email);
            }
        }
    });

    password.addEventListener("blur", () => {
        if (password.value.trim() !== "") {
            if (!strongPasswordRegex.test(password.value.trim())) {
                showError(password, "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt");
            } else {
                showSuccess(password);
            }
        }
    });

    confirmPassword.addEventListener("blur", () => {
        if (confirmPassword.value.trim() !== "") {
            if (confirmPassword.value !== password.value) {
                showError(confirmPassword, "Mật khẩu không khớp");
            } else {
                showSuccess(confirmPassword);
            }
        }
    });

    // --- 2. XÓA LỖI NGAY KHI BẮT ĐẦU GÕ LẠI (INPUT) ---
    email.addEventListener("input", () => showSuccess(email));
    password.addEventListener("input", () => showSuccess(password));
    confirmPassword.addEventListener("input", () => showSuccess(confirmPassword));

    // --- 3. XỬ LÝ KHI BẤM NÚT SIGN UP (SUBMIT) ---
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let isValid = true;

        // Check Email
        if (!emailRegex.test(email.value.trim())) {
            showError(email, "Email không đúng định dạng");
            isValid = false;
        }

        // Check Password (Mật khẩu mạnh)
        if (!strongPasswordRegex.test(password.value.trim())) {
            showError(password, "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt");
            isValid = false;
        }

        // Check Confirm Password
        if (confirmPassword.value.trim() === "" || confirmPassword.value !== password.value) {
            showError(confirmPassword, "Mật khẩu không khớp");
            isValid = false;
        }

        // Chuyển trang nếu mọi thứ hợp lệ
        if (isValid) {
            console.log("Form hợp lệ, đang xử lý...");
            window.location.href = "./index-logined.html";
        }
    });
}

// --- 4. TÍNH NĂNG ẨN/HIỆN MẬT KHẨU ---
const togglePasswordIcons = document.querySelectorAll(".js-toggle-password");

togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
        const input = this.closest(".form__text-input").querySelector(".form__input");

        if (input) {
            if (input.type === "password") {
                input.type = "text";
                this.src = "./assets/icons/eye.svg"; // Icon mắt mở
            } else {
                input.type = "password";
                this.src = "./assets/icons/eye-slash.svg"; // Icon mắt nhắm
            }
        }
    });
});
