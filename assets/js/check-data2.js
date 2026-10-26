fetch("./api2/all.json") // Hãy đảm bảo đường dẫn đúng với file all.json của bạn
    .then((response) => response.json())
    .then((data) => {
        let uniqueChars = new Map();

        // 1. Dọn dẹp bản sao vô tính: Chỉ giữ 1 object duy nhất cho mỗi cái tên
        data.forEach((item) => {
            let ten = item.ten.trim();
            if (!uniqueChars.has(ten)) {
                uniqueChars.set(ten, item);
            }
        });

        let characters = Array.from(uniqueChars.values());
        let calendar = {}; // Lưới lịch 366 slot
        let conflictsToManualCheck = [];
        let sidelinedCharacters = [];

        // Hàm nhận diện Phụ nữ cơ bản qua từ khóa trong tên
        const isFemale = (name) => {
            const lower = name.toLowerCase();
            return (
                lower.includes("thị ") ||
                lower.includes("bà ") ||
                lower.includes("công chúa") ||
                lower.includes("nữ ") ||
                lower.includes("phi ")
            );
        };

        // 2. CHẤM ĐIỂM & ĐỊNH VỊ NGÀY CHUẨN
        characters.forEach((item) => {
            let score = 0;
            let targetDate = "";

            let hasSinh = item.ngay_sinh !== "Không rõ" && item.ngay_sinh !== "";
            let hasMat = item.ngay_mat !== "Không rõ" && item.ngay_mat !== "";

            if (hasSinh && hasMat) {
                score = 100;
                targetDate = item.ngay_sinh;
                item.hien_thi_nhan_dip = `Kỷ niệm ngày sinh của ${item.ten}.`;
            } else if (hasSinh && !hasMat) {
                score = 90;
                targetDate = item.ngay_sinh;
                item.hien_thi_nhan_dip = `Kỷ niệm ngày sinh của ${item.ten}.`;
            } else if (!hasSinh && hasMat) {
                score = 80;
                targetDate = item.ngay_mat;
                item.hien_thi_nhan_dip = `Tưởng nhớ ngày mất của ${item.ten}.`;
            } else {
                score = 70; // Nhóm Backup
                targetDate = item.ngay_hien_thi;
                item.hien_thi_nhan_dip = `Tôn vinh sự kiện đặc biệt, cuộc đời và di sản của ${item.ten}.`;
            }

            item.score = score;
            item.isFemale = isFemale(item.ten);
            item.targetDate = targetDate;

            if (!calendar[targetDate]) calendar[targetDate] = [];
            calendar[targetDate].push(item);
        });

        // 3. CHIẾN TRƯỜNG TRANH SLOT (Giải quyết đụng độ)
        let finalData = {};
        for (let date in calendar) {
            let candidates = calendar[date];

            if (candidates.length === 1) {
                finalData[date] = candidates[0]; // Độc chiếm slot
            } else {
                // Bộ lọc Tie-breaker: Điểm cao -> Ưu tiên Nữ
                candidates.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    if (b.isFemale && !a.isFemale) return 1;
                    if (a.isFemale && !b.isFemale) return -1;
                    return 0; // Chờ người phán xử
                });

                let winner = candidates[0];
                finalData[date] = winner;

                // Log những ca hòa nhau tuyệt đối để phán xử bằng tay
                if (candidates.length > 1) {
                    let runnerUp = candidates[1];
                    if (winner.score === runnerUp.score && winner.isFemale === runnerUp.isFemale) {
                        conflictsToManualCheck.push(
                            `[${date}] HÒA NHAU CÙNG ${winner.score} ĐIỂM: ${winner.ten} vs ${runnerUp.ten}`,
                        );
                    }
                    // Gom những người rớt đài
                    for (let i = 1; i < candidates.length; i++) {
                        sidelinedCharacters.push(candidates[i].ten);
                    }
                }
            }
        }

        // 4. Lấy danh sách ngày trống
        let daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let emptyDays = [];
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= daysInMonth[m - 1]; d++) {
                let dayStr = (d < 10 ? "0" + d : d) + "/" + (m < 10 ? "0" + m : m);
                if (!finalData[dayStr]) emptyDays.push(dayStr);
            }
        }

        // --- XUẤT BÁO CÁO RA CONSOLE ---
        console.log("=== 1. CÁC CA ĐỤNG ĐỘ HÒA ĐIỂM (Cần bạn phán xử độ vĩ đại) ===");
        if (conflictsToManualCheck.length === 0) console.log("0 ca trùng. Máy tự xử lý mượt mà!");
        else conflictsToManualCheck.forEach((c) => console.warn(c));

        console.log(`\n=== 2. DANH SÁCH BỊ LOẠI KHỎI SLOT: ${sidelinedCharacters.length} người ===`);

        console.log(`\n=== 3. SỐ NGÀY TRỐNG TRONG LỊCH: ${emptyDays.length} ngày ===`);
        console.log(emptyDays.join(", "));

        // --- 5. TẠO FILE JSON CHUẨN MỰC ---
        let exportArray = Object.values(finalData).sort((a, b) => {
            let [d1, m1] = a.targetDate.split("/");
            let [d2, m2] = b.targetDate.split("/");
            if (m1 !== m2) return parseInt(m1) - parseInt(m2);
            return parseInt(d1) - parseInt(d2);
        });

        // Dọn dẹp dữ liệu rác trước khi xuất
        exportArray.forEach((item) => {
            item.ngay_hien_thi = item.targetDate;
            delete item.score;
            delete item.isFemale;
            delete item.targetDate;
        });

        const blob = new Blob([JSON.stringify(exportArray, null, 4)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "all_scored_filtered.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("\n✅ Đã chấm điểm, dọn dẹp và tải file 'all_scored_filtered.json' về máy.");
    })
    .catch((error) => console.error("Lỗi:", error));
