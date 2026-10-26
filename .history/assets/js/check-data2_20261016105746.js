fetch("./api2/all.json")
    .then((response) => response.json())
    .then((data) => {
        let duplicates = {};

        // 1. Nhóm các nhân vật theo tên để xử lý trùng lặp
        data.forEach((item) => {
            if (!duplicates[item.ten]) duplicates[item.ten] = [];
            duplicates[item.ten].push(item);
        });

        let finalCharacters = [];

        // 2. Tự động thanh lọc & Ép chuẩn ngày (Quy tắc Tối thượng)
        for (const [ten, items] of Object.entries(duplicates)) {
            let selectedItem = items[0]; // Lấy 1 bản ghi duy nhất để dẹp lỗi xuất hiện 2 lần

            // Xử lý 228 nhân vật bị sai ngày: Trả về đúng ngay_sinh hoặc ngay_mat
            if (selectedItem.ngay_sinh !== "Không rõ") {
                selectedItem.ngay_hien_thi = selectedItem.ngay_sinh;
            } else if (selectedItem.ngay_mat !== "Không rõ") {
                selectedItem.ngay_hien_thi = selectedItem.ngay_mat;
            }
            // Nếu cả sinh và mất đều "Không rõ", giữ nguyên ngày hiển thị hiện tại.

            finalCharacters.push(selectedItem);
        }

        // 3. Đưa vào lịch 366 ngày để kiểm tra "đụng độ"
        let cleanData = {};
        let collisions = []; // Chứa danh sách những người cùng ngày sinh

        finalCharacters.forEach((item) => {
            let day = item.ngay_hien_thi;
            if (cleanData[day]) {
                collisions.push(`${item.ten} bị TRÙNG NGÀY với ${cleanData[day].ten} tại slot ${day}`);
            } else {
                cleanData[day] = item;
            }
        });

        // 4. Quét ngày trống để chuẩn bị lấp đầy
        let missingDays = [];
        let daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= daysInMonth[m - 1]; d++) {
                let dayStr = (d < 10 ? "0" + d : d) + "/" + (m < 10 ? "0" + m : m);
                if (!cleanData[dayStr]) {
                    missingDays.push(dayStr);
                }
            }
        }

        // --- IN KẾT QUẢ RA CONSOLE ---
        console.log("=== 1. CÁC NHÂN VẬT ĐỤNG ĐỘ SLOT (Cùng ngày sinh/mất) ===");
        collisions.forEach((c) => console.warn(c));

        console.log("\n=== 2. DANH SÁCH NGÀY TRỐNG CẦN BỔ SUNG ===");
        console.log(missingDays.join(", "));
        console.log(`=> Tổng cộng thiếu ${missingDays.length} ngày.`);

        // --- 5. TỰ ĐỘNG XUẤT FILE SẠCH ---
        let cleanArray = Object.values(cleanData).sort((a, b) => {
            let [d1, m1] = a.ngay_hien_thi.split("/");
            let [d2, m2] = b.ngay_hien_thi.split("/");
            if (m1 !== m2) return parseInt(m1) - parseInt(m2);
            return parseInt(d1) - parseInt(d2);
        });

        const blob = new Blob([JSON.stringify(cleanArray, null, 4)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "all_cleaned.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("\n✅ Đã dọn rác xong! File 'all_cleaned.json' chuẩn ngày tháng đã được tải về máy.");
    })
    .catch((error) => console.error("Lỗi:", error));
