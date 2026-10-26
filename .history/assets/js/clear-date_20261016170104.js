const fs = require('fs');

// Đọc file gốc
const inputFileName = './lich_van_nien_FINAL_366.json';
const outputFileName = './lich_van_nien_366_CLEANED.json'; // Tạo file mới, giữ nguyên file cũ để backup

try {
    const data = require(inputFileName);

    data.forEach(item => {
        // 1. Cập nhật lại trường 'id' thành dạng 'ngay_dd_mm'
        let dateStr = item.ngay_hien_thi.replace('/', '_');
        item.id = `ngay_${dateStr}`;

        // 2. Làm sạch trường 'image_slug' (Xóa phần đuôi -vn-xxx hoặc các ID rác)
        if (item.image_slug) {
            // Tìm vị trí của chuỗi "-vn-" trong image_slug
            let indexVN = item.image_slug.indexOf('-vn-');
            
            if (indexVN !== -1) {
                // Nếu có "-vn-", cắt bỏ từ đó đến cuối chuỗi
                item.image_slug = item.image_slug.substring(0, indexVN);
            } else {
                // Đề phòng trường hợp các ID cũ không có "vn_", cắt bỏ phần đoạn mã số bị nối ở cuối
                item.image_slug = item.image_slug.replace(/-\d+$/, ''); 
            }
        }
    });

    // 3. Lưu kết quả ra file MỚI (Không ghi đè file gốc)
    fs.writeFileSync(outputFileName, JSON.stringify(data, null, 4));

    console.log(`✅ Thành công! Đã xử lý xong dữ liệu và lưu vào file mới: ${outputFileName}`);
    console.log(`🔒 File gốc ${inputFileName} vẫn được giữ nguyên để dự phòng.`);

} catch (err) {
    console.error("❌ Lỗi: Không thể tìm thấy hoặc đọc file gốc.", err.message);
}