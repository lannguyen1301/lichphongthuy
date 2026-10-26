// Gọi file data.json chứa toàn bộ 366 nhân vật
fetch('')
    .then(response => response.json())
    .then(data => {
        let duplicates = {};
        let mismatchDates = [];
        let usedDates = new Set();

        data.forEach(item => {
            // 1. Ghi nhận số lần xuất hiện để check trùng lặp
            if (duplicates[item.ten]) {
                duplicates[item.ten].push(item.ngay_hien_thi);
            } else {
                duplicates[item.ten] = [item.ngay_hien_thi];
            }

            // 2. Check sai logic ngày tháng
            // Kiểm tra xem ngay_hien_thi có khớp với ngay_sinh hoặc ngay_mat không
            const isUnknownDate = item.ngay_sinh === "Không rõ" && item.ngay_mat === "Không rõ";
            const isValidDate = (item.ngay_hien_thi === item.ngay_sinh) || (item.ngay_hien_thi === item.ngay_mat) || isUnknownDate;
            
            if (!isValidDate) {
                mismatchDates.push({ 
                    ten: item.ten, 
                    ngay_hien_thi: item.ngay_hien_thi, 
                    ngay_sinh: item.ngay_sinh, 
                    ngay_mat: item.ngay_mat 
                });
            }

            // 3. Ghi nhận ngày đã được sử dụng
            usedDates.add(item.ngay_hien_thi);
        });

        // --- IN BÁO CÁO RA CONSOLE ---
        console.log("=== 1. BÁO CÁO TRÙNG LẶP NHÂN VẬT ===");
        let hasDuplicate = false;
        for (const [ten, days] of Object.entries(duplicates)) {
            if (days.length > 1) {
                console.log(`❌ [Trùng lặp] ${ten}: Xuất hiện ${days.length} lần ở các ngày [${days.join(', ')}]`);
                hasDuplicate = true;
            }
        }
        if (!hasDuplicate) console.log("✅ Ngon lành! Không có nhân vật nào bị trùng.");

        console.log("\n=== 2. BÁO CÁO SAI LỆCH NGÀY THÁNG ===");
        if (mismatchDates.length > 0) {
            mismatchDates.forEach(err => {
                console.log(`⚠️ [Sai ngày] ${err.ten}: Đang xếp ngày ${err.ngay_hien_thi} (Thực tế -> Sinh: ${err.ngay_sinh} | Mất: ${err.ngay_mat})`);
            });
            console.log(`\nTổng cộng có ${mismatchDates.length} nhân vật bị xếp sai ngày.`);
        } else {
            console.log("✅ Chuẩn không cần chỉnh! Tất cả ngày hiển thị đều khớp với lịch sử.");
        }
    })
    .catch(error => {
        console.error("❌ Lỗi khi đọc file JSON. Hãy kiểm tra lại đường dẫn hoặc định dạng file:", error);
    });