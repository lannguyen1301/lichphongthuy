// Đọc file all_final.json (file sạch 292 nhân vật của bạn)
// Lưu ý: Hãy đổi tên file bạn vừa tải về thành "all_final.json" và để cùng thư mục với script này,
// hoặc đổi đường dẫn fetch bên dưới cho đúng vị trí file.
fetch("../../api2/all_final.json")
    .then((response) => response.json())
    .then((data) => {
        // Danh sách 74 ngày trống chính xác từ báo cáo của bạn
        const missingDates = [
            "06/08",
            "08/08",
            "11/08",
            "12/08",
            "13/08",
            "14/08",
            "15/08",
            "17/08",
            "19/08",
            "21/08",
            "22/08",
            "23/08",
            "24/08",
            "26/08",
            "27/08",
            "30/08",
            "31/08",
            "02/09",
            "03/09",
            "04/09",
            "14/09",
            "17/09",
            "18/09",
            "20/09",
            "21/09",
            "23/09",
            "24/09",
            "25/09",
            "26/09",
            "28/09",
            "30/09",
            "05/10",
            "07/10",
            "08/10",
            "09/10",
            "13/10",
            "16/10",
            "18/10",
            "19/10",
            "22/10",
            "23/10",
            "24/10",
            "25/10",
            "28/10",
            "30/10",
            "31/10",
            "02/11",
            "03/11",
            "06/11",
            "08/11",
            "12/11",
            "13/11",
            "14/11",
            "17/11",
            "20/11",
            "21/11",
            "25/11",
            "28/11",
            "29/11",
            "30/11",
            "05/12",
            "07/12",
            "08/12",
            "09/12",
            "14/12",
            "16/12",
            "17/12",
            "18/12",
            "23/12",
            "24/12",
            "27/12",
            "29/12",
            "30/12",
            "31/12",
        ];

        // Danh sách 74 danh nhân/hình tượng văn hóa bổ sung (Đảm bảo không trùng lặp)
        const supplementaryFigures = [
            "Lạc Long Quân",
            "Âu Cơ",
            "Thánh Gióng",
            "Sơn Tinh",
            "Thủy Tinh",
            "Chử Đồng Tử",
            "Tiên Dung Công chúa",
            "Liễu Hạnh Công chúa",
            "Mẫu Thoải",
            "Mẫu Thượng Ngàn",
            "Cô Chín Giếng",
            "Ông Hoàng Bảy",
            "Ông Hoàng Mười",
            "Bà Chúa Xứ",
            "Bà Chúa Kho",
            "Bà Huyện Thanh Quan",
            "Hồ Xuân Hương",
            "Phạm Thái",
            "Bùi Huy Bích",
            "Vũ Trinh",
            "Nguyễn Trường Tộ",
            "Trương Vĩnh Ký",
            "Huỳnh Thúc Kháng",
            "Trần Trọng Kim",
            "Phạm Quỳnh",
            "Nguyễn Văn Vĩnh",
            "Trần Văn Giáp",
            "Nguyễn Hiến Lê",
            "Giáp Hải",
            "Vũ Hữu",
            "Nguyễn Kiều",
            "Nhất Linh",
            "Khái Hưng",
            "Hoàng Đạo",
            "Thạch Lam",
            "Kim Lân",
            "Phùng Quán",
            "Nguyễn Hàng",
            "La Sơn Phu Tử Nguyễn Thiếp",
            "Nguyễn Hàm Ninh",
            "Tùng Thiện Vương",
            "Tuy Lý Vương",
            "Chu Mạnh Trinh",
            "Nguyễn Hữu Dật",
            "Nguyễn Cư Trinh",
            "Nguyễn Lộ Trạch",
            "Phạm Phú Thứ",
            "Trần Xuân Soạn",
            "Tôn Thất Đạm",
            "Phạm Bành",
            "Hà Văn Mao",
            "Trịnh Văn Cấn (Đội Cấn)",
            "Lương Văn Can",
            "Nguyễn Quyền",
            "Vũ Hoành",
            "Lê Đại",
            "Dương Bá Trạc",
            "Hoàng Trọng Mậu",
            "Lê Huân",
            "Đặng Thái Thân",
            "Lê Hồng Phong",
            "Hà Huy Tập",
            "Lê Thị Hồng Gấm",
            "Võ Thị Sáu",
            "Nguyễn Viết Xuân",
            "Bế Văn Đàn",
            "La Văn Cầu",
            "Lê Văn Tám",
            "Trần Văn Đang",
            "Trần Can",
            "Nguyễn Bá Ngọc",
            "Kpa Kơ Lơng",
            "Mạc Thị Bưởi",
            "Nguyễn Thị Chiên",
        ];

        // Tạo 74 object mới và đẩy vào mảng data
        missingDates.forEach((date, index) => {
            data.push({
                id: `vn_sup_${index + 1}`,
                ten: supplementaryFigures[index],
                ngay_sinh: "Không rõ",
                nam_sinh: "Không rõ",
                ngay_mat: "Không rõ",
                nam_mat: "Không rõ",
                linh_vuc: "Văn hóa - Lịch sử",
                category_id: "van-hoa-lich-su",
                image_slug: "", // Để trống để bạn bổ sung ảnh sau
                mo_ta: `Nhân vật lịch sử, danh nhân văn hóa tiêu biểu có tầm ảnh hưởng trong lịch sử dân tộc Việt Nam.`,
                quote: "",
                ngay_hien_thi: date,
                hien_thi_nhan_dip: `Tôn vinh cuộc đời, sự nghiệp và di sản của ${supplementaryFigures[index]}.`,
                historical_source: [],
            });
        });

        // Sắp xếp toàn bộ 366 ngày theo đúng thứ tự từ 01/01 đến 31/12
        let finalArray = data.sort((a, b) => {
            let [d1, m1] = a.ngay_hien_thi.split("/");
            let [d2, m2] = b.ngay_hien_thi.split("/");
            if (m1 !== m2) return parseInt(m1) - parseInt(m2);
            return parseInt(d1) - parseInt(d2);
        });

        // Check tổng số lượng để chốt hạ
        console.log(`✅ Tuyệt vời! Lịch của bạn hiện có đúng ${finalArray.length} ngày.`);

        // Tạo và tải file thành phẩm
        const blob = new Blob([JSON.stringify(finalArray, null, 4)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "lich_van_nien_366_PERFECT.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    .catch((error) => console.error("Lỗi:", error));
