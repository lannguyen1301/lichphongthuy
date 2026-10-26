fetch("./api2/all.json")
    .then((response) => response.json())
    .then((data) => {
        let finalCharacters = [];
        let seen = new Set();

        // 1. Tự động gộp các nhân vật trùng tên (bỏ qua phần trong ngoặc đơn)
        data.forEach((item) => {
            let checkName = item.ten.split("(")[0].trim().toLowerCase();
            if (!seen.has(checkName)) {
                seen.add(checkName);

                // Ép về ngày chuẩn
                if (item.ngay_sinh !== "Không rõ") {
                    item.ngay_hien_thi = item.ngay_sinh;
                    item.hien_thi_nhan_dip = `Kỷ niệm ngày sinh của ${item.ten}.`;
                } else if (item.ngay_mat !== "Không rõ") {
                    item.ngay_hien_thi = item.ngay_mat;
                    item.hien_thi_nhan_dip = `Tưởng nhớ ngày mất của ${item.ten}.`;
                }
                finalCharacters.push(item);
            }
        });

        let cleanData = {};
        let overflowCharacters = [];

        // 2. Xếp vào slot lịch, phát hiện đụng độ
        finalCharacters.forEach((item) => {
            let day = item.ngay_hien_thi;
            if (!cleanData[day]) {
                cleanData[day] = item;
            } else {
                overflowCharacters.push(item); // Bị trùng -> Cho ra ghế chờ
            }
        });

        // 3. Lấy danh sách 366 ngày trong năm
        let daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let allDays = [];
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= daysInMonth[m - 1]; d++) {
                allDays.push((d < 10 ? "0" + d : d) + "/" + (m < 10 ? "0" + m : m));
            }
        }

        // Tìm các ngày đang bị trống
        let emptyDays = allDays.filter((day) => !cleanData[day]);

        // 4. THUẬT TOÁN AUTO-SPREAD: Trám người bị đụng độ vào ngày trống
        overflowCharacters.forEach((item) => {
            if (emptyDays.length > 0) {
                let newDay = emptyDays.shift(); // Lấy ngày trống đầu tiên
                item.ngay_hien_thi = newDay;
                // Đổi câu chữ để hợp logic khi đứng ở ngày ngẫu nhiên
                item.hien_thi_nhan_dip = `Tôn vinh cuộc đời, sự nghiệp và những cống hiến vĩ đại của ${item.ten}.`;
                cleanData[newDay] = item;
            }
        });

        // 5. In số ngày trống CÒN LẠI CUỐI CÙNG ra Console
        console.log("=== NHỮNG NGÀY TRỐNG CUỐI CÙNG CẦN BỔ SUNG ===");
        console.log(emptyDays.join(", "));
        console.log(`=> Lịch đang thiếu đúng ${emptyDays.length} nhân vật để đạt 366 ngày.`);

        // 6. Xuất file all_final.json sạch sẽ, sắp xếp theo thứ tự thời gian
        let cleanArray = Object.values(cleanData).sort((a, b) => {
            let [d1, m1] = a.ngay_hien_thi.split("/");
            let [d2, m2] = b.ngay_hien_thi.split("/");
            if (m1 !== m2) return parseInt(m1) - parseInt(m2);
            return parseInt(d1) - parseInt(d2);
        });

        const blob = new Blob([JSON.stringify(cleanArray, null, 4)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "all_final.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("✅ TUYỆT VỜI! File 'all_final.json' siêu sạch đã được tải về máy.");
    })
    .catch((error) => console.error("Lỗi:", error));
