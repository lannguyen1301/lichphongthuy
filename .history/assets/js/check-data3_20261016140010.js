fetch("../..") // Đọc lại dữ liệu gốc từ all.json
    .then((response) => response.json())
    .then((data) => {
        let calendar = {};
        let sidelinedQueue = [];

        // 1. KẾT QUẢ PHÁN QUYẾT TỪ "TÒA ÁN LỊCH SỬ"
        const manualWinners = {
            "12/01": "Phạm Tuyên",
            "14/01": "Phạm Tiến Duật",
            "20/10": "Lý Tự Trọng (Lê Hữu Trọng)",
            "01/05": "Trần Phú",
            "01/07": "Nguyễn Đình Chiểu",
            "20/08": "Tôn Đức Thắng",
            "17/05": "Trần Cao Vân",
            "27/11": "Nguyễn Bỉnh Khiêm",
            "26/11": "Đặng Thùy Trâm",
            "01/10": "Lê Trọng Tấn",
            "10/02": "Hoàng Diệu",
            "16/08": "Nguyễn Phúc Nguyên (Chúa Sãi)",
            "11/11": "Trần Nhân Tông (Trần Khâm)",
            "11/06": "Nguyễn Phúc Chu",
            "28/12": "Phan Đình Phùng",
            "01/03": "Phạm Văn Đồng",
            "19/09": "Duy Tân (Nguyễn Phúc Vĩnh San)",
            "09/09": "Phan Châu Trinh (Phan Chu Trinh)",
            "12/03": "Ngô Quyền",
            "28/02": "Trịnh Công Sơn",
            "19/05": "Hồ Chí Minh",
            "19/12": "Nguyễn Công Trứ",
            "02/05": "Văn Tiến Dũng",
            "12/09": "Lưu Hữu Phước",
            "11/09": "Ngô Thì Nhậm",
            "07/05": "Phạm Ngọc Thạch",
            "06/10": "Xuân Quỳnh",
            "20/04": "Ngô Tất Tố",
        };

        // 2. DỌN SẠCH CÁC BẢN SAO VÔ TÍNH (Xóa vĩnh viễn các tên trùng lặp có chứa dấu ngoặc)
        let uniqueMap = new Map();
        data.forEach((item) => {
            let baseName = item.ten.split("(")[0].trim().toLowerCase();
            // Nếu chưa có, hoặc nếu item này là bản CHÍNH (không có ngoặc) thì ưu tiên ghi đè
            if (!uniqueMap.has(baseName) || item.ten.indexOf("(") === -1) {
                uniqueMap.set(baseName, item);
            }
        });
        let uniqueData = Array.from(uniqueMap.values());

        // 3. CHẤM ĐIỂM & ĐỊNH VỊ (Theo Bộ Luật 3 Điều Kiện)
        let initialGroup = {};
        uniqueData.forEach((item) => {
            let hasSinh = item.ngay_sinh !== "Không rõ" && item.ngay_sinh !== "";
            let hasMat = item.ngay_mat !== "Không rõ" && item.ngay_mat !== "";

            if (hasSinh) {
                item.score = hasMat ? 100 : 90;
                item.targetDate = item.ngay_sinh;
                item.hien_thi_nhan_dip = `Kỷ niệm ngày sinh của ${item.ten}.`;
            } else if (hasMat) {
                item.score = 80;
                item.targetDate = item.ngay_mat;
                item.hien_thi_nhan_dip = `Tưởng nhớ ngày mất của ${item.ten}.`;
            } else {
                item.score = 70;
                item.targetDate = item.ngay_hien_thi;
                item.hien_thi_nhan_dip = `Tôn vinh cuộc đời, sự nghiệp và những cống hiến vĩ đại của ${item.ten}.`;
            }

            if (!initialGroup[item.targetDate]) initialGroup[item.targetDate] = [];
            initialGroup[item.targetDate].push(item);
        });

        // 4. VÒNG 1: TRANH ĐOẠT SLOT & THỰC THI PHÁN QUYẾT
        for (let date in initialGroup) {
            let candidates = initialGroup[date];
            if (candidates.length === 1) {
                calendar[date] = candidates[0]; // Độc chiếm slot
            } else {
                let winner;
                // Bê y nguyên phán quyết bằng tay của chúng ta
                if (manualWinners[date]) {
                    winner = candidates.find((c) => c.ten === manualWinners[date]);
                }
                // Nếu chưa có phán quyết, máy sẽ chọn người điểm cao nhất
                if (!winner) {
                    candidates.sort((a, b) => b.score - a.score);
                    winner = candidates[0];
                }

                calendar[date] = winner;

                // Gom những người rớt đài vào hàng chờ
                candidates.forEach((c) => {
                    if (c.ten !== winner.ten) sidelinedQueue.push(c);
                });
            }
        }

        let rescuedByDeathDate = [];
        // 5. VÒNG 2: CỨU VỚT BẰNG NGÀY MẤT
        let remainingQueue = [];
        sidelinedQueue.forEach((item) => {
            let hasMat = item.ngay_mat !== "Không rõ" && item.ngay_mat !== "";
            // Nếu người này rớt đài khỏi ngày sinh, có ngày mất, và ngày mất đang trống -> Trám vào
            if (item.score >= 90 && hasMat && !calendar[item.ngay_mat]) {
                calendar[item.ngay_mat] = item;
                item.hien_thi_nhan_dip = `Tưởng nhớ ngày mất của ${item.ten}.`;
                rescuedByDeathDate.push(`${item.ten} -> Chuyển sang ngày mất ${item.ngay_mat}`);
            } else {
                remainingQueue.push(item);
            }
        });

        // 6. VÒNG 3: ÁP DỤNG ĐIỀU KIỆN 3 (Trải đều vào các ngày trống)
        let daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let emptyDays = [];
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= daysInMonth[m - 1]; d++) {
                let dayStr = (d < 10 ? "0" + d : d) + "/" + (m < 10 ? "0" + m : m);
                if (!calendar[dayStr]) emptyDays.push(dayStr);
            }
        }

        let spreadCharacters = [];
        remainingQueue.forEach((item) => {
            if (emptyDays.length > 0) {
                let newDay = emptyDays.shift(); // Lấy ngày trống đầu tiên
                calendar[newDay] = item;
                item.hien_thi_nhan_dip = `Tôn vinh cuộc đời, sự nghiệp và những cống hiến vĩ đại của ${item.ten}.`;
                spreadCharacters.push(`${item.ten} -> Lấp vào ngày ${newDay}`);
            }
        });

        // --- XUẤT BÁO CÁO RA CONSOLE ---
        console.log(`=== VÒNG 2: CỨU VỚT BẰNG NGÀY MẤT (${rescuedByDeathDate.length} người) ===`);
        rescuedByDeathDate.forEach((msg) => console.log(msg));

        console.log(`\n=== VÒNG 3: TRÁM NGÀY TRỐNG (${spreadCharacters.length} người) ===`);
        spreadCharacters.forEach((msg) => console.log(msg));

        console.log(`\n=== SỐ NGÀY TRỐNG CUỐI CÙNG CHƯA CÓ DỮ LIỆU: ${emptyDays.length} ngày ===`);
        console.log(emptyDays.join(", "));

        // --- 7. DỌN DẸP & XUẤT FILE DATA FINAL CHUẨN MỰC ---
        let exportArray = Object.values(calendar);

        exportArray.forEach((item) => {
            // Tìm ngược lại cái key (ngày) mà nhân vật đang đứng trong calendar
            let finalDate = Object.keys(calendar).find((key) => calendar[key] === item);
            item.ngay_hien_thi = finalDate;
            // Xóa các trường tạm sinh ra trong lúc chạy code
            delete item.score;
            delete item.targetDate;
        });

        exportArray.sort((a, b) => {
            let [d1, m1] = a.ngay_hien_thi.split("/");
            let [d2, m2] = b.ngay_hien_thi.split("/");
            if (m1 !== m2) return parseInt(m1) - parseInt(m2);
            return parseInt(d1) - parseInt(d2);
        });

        const blob = new Blob([JSON.stringify(exportArray, null, 4)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "lich_van_nien_chinh_thuc.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("\n✅ ĐÃ HOÀN TẤT XẾP SLOT! File 'lich_van_nien_chinh_thuc.json' đã được tải về.");
    })
    .catch((error) => console.error("Lỗi:", error));
