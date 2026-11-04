// // Hàm hiển thị lỗi
// export function showError(inputElement, message) {
//     // Kích hoạt trạng thái :invalid cho CSS
//     inputElement.setCustomValidity(message);

//     // Tìm thẻ <p class="form__error"> để đổi chữ
//     const formGroup = inputElement.closest(".form__group");
//     const errorElement = formGroup.querySelector(".form__error");
//     if (errorElement) {
//         errorElement.innerText = message;
//     }
// }

// // Hàm xóa lỗi khi nhập đúng
// export function showSuccess(inputElement) {
//     // Khôi phục trạng thái hợp lệ (xóa lỗi)
//     inputElement.setCustomValidity("");
// }

// // Regex kiểm tra email chuẩn
// export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hàm hiển thị lỗi
export function showError(inputElement, message) {
    inputElement.setCustomValidity(message); // Kích hoạt viền đỏ CSS

    const formGroup = inputElement.closest(".form__group");
    const errorElement = formGroup.querySelector(".form__error");
    if (errorElement) {
        errorElement.innerText = message;
    }
}

// Hàm xóa lỗi
export function showSuccess(inputElement) {
    inputElement.setCustomValidity(""); // Tắt viền đỏ CSS
}

// Biểu thức kiểm tra email
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Biểu thức kiểm tra mật khẩu mạnh (tối thiểu 8 ký tự, có hoa, thường, số, ký tự đặc biệt)
export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
