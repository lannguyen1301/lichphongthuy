// Đường dẫn trỏ tới file JSON gốc của bạn (chỉnh lại cho đúng thư mục nếu cần)
const jsonUrl = "/lich_van_nien_FINAL_366.json";

fetch(jsonUrl)
    .then((response) => {
        if (!response.ok) throw new Error("Không tìm thấy file JSON");
        return response.json();
    })
    .then((data) => {
        // 1. Chạy vòng lặp dọn dẹp dữ liệu
        data.forEach((item) => {
            // Sửa ID thành chuẩn ngay_dd_mm
            let dateStr = item.ngay_hien_thi.replace("/", "_");
            item.id = `ngay_${dateStr}`;

            // Làm sạch image_slug
            if (item.image_slug) {
                let indexVN = item.image_slug.indexOf("-vn-");
                if (indexVN !== -1) {
                    item.image_slug = item.image_slug.substring(0, indexVN);
                } else {
                    item.image_slug = item.image_slug.replace(/-\d+$/, "");
                }
            }
        });

        // 2. Đóng gói thành file mới
        const jsonString = JSON.stringify(data, null, 4);
        const blob = new Blob([jsonString], { type: "application/json" });

        // 3. Tự động tải về máy
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "lich_van_nien_366_CLEANED.json"; // Tên file mới

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("✅ Đã xử lý và tải xuống file thành công! Bạn kiểm tra thư mục Download nhé.");
    })
    .catch((error) => {
        console.error("❌ Lỗi:", error.message);
    });
