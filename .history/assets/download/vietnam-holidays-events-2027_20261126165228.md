```json
{
  "metadata": {
    "country": "VN",
    "year": 2027,
    "lunar_year_can_chi": "Đinh Mùi",
    "lunar_year_has_leap_month": false,
    "timezone": "Asia/Ho_Chi_Minh",
    "utc_offset": "+07:00",
    "schema_version": "2.0.0",
    "changelog_v2": [
      "Mở rộng từ 48 lên 82 mốc ngày nghỉ lễ, ngày lễ lớn, sự kiện năm tròn, truyền thống ngành nghề, lễ quốc tế & tôn giáo.",
      "Tích hợp đầy đủ 24 Tiết khí năm 2027 kèm tọa độ kinh độ Hoàng Đạo và thời điểm giao tiết chính xác đến phút theo múi giờ UTC+7.",
      "Gộp bản ghi Tiết Thanh Minh & Tết Thanh Minh (05/04/2027) bằng secondary_categories để tránh trùng lặp dữ liệu (tổng 105 bản ghi duy nhất)."
    ],
    "legal_references": [
      "Bộ luật Lao động số 45/2019/QH14 (Điều 112)",
      "Nghị quyết 28/2026/QH16 (bổ sung Ngày Văn hóa Việt Nam 24/11)",
      "Luật sửa đổi, bổ sung một số điều của Bộ luật Lao động (thông qua ngày 21/11/2026, hiệu lực từ 01/03/2027)",
      "Thông báo số 11483/TB-BNV ngày 09/10/2026 của Bộ Nội vụ về lịch nghỉ lễ, Tết năm 2027",
      "Nghị định 145/2013/NĐ-CP (Điều 4 về các ngày lễ lớn)",
      "Nghị định 111/2018/NĐ-CP (về ngày thành lập, ngày truyền thống, ngày hưởng ứng)",
      "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
      "Thuật toán Lịch Âm Dương Việt Nam (UTC+7) & Kinh độ Hoàng Đạo Mặt Trời (Jean Meeus Astronomical Algorithms)"
    ],
    "summary": {
      "total_unique_records": 105,
      "fixed_date_records": 100,
      "year_round_records": 5,
      "public_holiday_periods": 7,
      "statutory_paid_days_off": 13,
      "civil_service_consecutive_days_off": 23,
      "foreign_worker_additional_days_off": 2,
      "solar_terms_count": 24,
      "merged_overlap_note": "82 sự kiện + 24 Tiết khí - 1 bản ghi giao thoa (Thanh Minh 05/04/2027) = 105 bản ghi chuẩn hóa.",
      "category_counts": {
        "public_holiday": 8,
        "solar_term": 24,
        "commemorative_industry": 27,
        "traditional_lunar": 14,
        "anniversary_milestone_2027": 12,
        "major_national_holiday": 4,
        "international_religious": 16
      }
    }
  },
  "categories": [
    {
      "code": "public_holiday",
      "label_vi": "Ngày nghỉ lễ, Tết hưởng nguyên lương",
      "description": "Các ngày lễ, Tết người lao động được nghỉ làm, hưởng nguyên lương theo Bộ luật Lao động và văn bản sửa đổi."
    },
    {
      "code": "major_national_holiday",
      "label_vi": "Ngày lễ lớn cố định",
      "description": "Các ngày lễ lớn của đất nước quy định tại Điều 4 Nghị định 145/2013/NĐ-CP."
    },
    {
      "code": "anniversary_milestone_2027",
      "label_vi": "Sự kiện lịch sử & kỷ niệm năm tròn 2027",
      "description": "Các sự kiện lịch sử và ngày sinh danh nhân kỷ niệm năm tròn trong năm 2027 theo Kết luận 91."
    },
    {
      "code": "traditional_lunar",
      "label_vi": "Ngày lễ Âm lịch & dân gian truyền thống",
      "description": "Các ngày lễ, Tết cổ truyền và Phật giáo tính theo Âm lịch Việt Nam (múi giờ UTC+7)."
    },
    {
      "code": "commemorative_industry",
      "label_vi": "Ngày truyền thống ngành nghề & kỷ niệm quốc gia VN",
      "description": "Các ngày truyền thống ngành nghề, đoàn thể và ngày kỷ niệm chính thức tại Việt Nam."
    },
    {
      "code": "international_religious",
      "label_vi": "Ngày kỷ niệm quốc tế & lễ tôn giáo phổ biến",
      "description": "Các ngày lễ quốc tế (LHQ, văn hóa phổ biến) và lễ trọng Công giáo/Kitô giáo."
    },
    {
      "code": "solar_term",
      "label_vi": "24 Tiết khí năm 2027",
      "description": "24 mốc tiết lệnh và trung khí theo kinh độ Hoàng Đạo Mặt Trời, tính chính xác theo giờ Việt Nam (UTC+7)."
    }
  ],
  "events": [
    {
      "id": "vn-2027-tet-duong-lich",
      "name": "Tết Dương lịch",
      "category": "public_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-01-01",
        "day": 1,
        "month": 1,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "01/01/2027"
      },
      "lunar_date": {
        "day": 24,
        "month": 11,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "24/11/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 1,
        "civil_service_schedule": {
          "start_date": "2027-01-01",
          "end_date": "2027-01-03",
          "total_consecutive_days": 3,
          "includes_compensatory_day": false,
          "note": "Nghỉ liên tục 3 ngày từ Thứ Sáu 01/01 đến hết Chủ nhật 03/01/2027."
        }
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Điều 112 Bộ luật Lao động 2019; Thông báo 11483/TB-BNV",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-tieu-han",
      "name": "Tiết Tiểu Hàn",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-01-05",
        "day": 5,
        "month": 1,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "05/01/2027"
      },
      "lunar_date": {
        "day": 28,
        "month": 11,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "28/11/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 1,
        "name_vi": "Tiểu Hàn",
        "han_tu": "小寒",
        "term_type": "tiet",
        "season": "Đông",
        "solar_longitude_deg": 285,
        "exact_time_vn": "21:05",
        "exact_iso_vn": "2027-01-05T21:05:00+07:00",
        "meaning": "Rét nhẹ"
      }
    },
    {
      "id": "vn-2027-hoc-sinh-sinh-vien-vn",
      "name": "Ngày truyền thống Học sinh, Sinh viên Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-01-09",
        "day": 9,
        "month": 1,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "09/01/2027"
      },
      "lunar_date": {
        "day": 2,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "02/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1950,
        "anniversary_years": 77,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Đại hội toàn quốc Liên đoàn Thanh niên Việt Nam lần thứ nhất (02/1950)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-dai-han",
      "name": "Tiết Đại Hàn",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-01-20",
        "day": 20,
        "month": 1,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "20/01/2027"
      },
      "lunar_date": {
        "day": 13,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "13/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 2,
        "name_vi": "Đại Hàn",
        "han_tu": "大寒",
        "term_type": "khi",
        "season": "Đông",
        "solar_longitude_deg": 300,
        "exact_time_vn": "14:27",
        "exact_iso_vn": "2027-01-20T14:27:00+07:00",
        "meaning": "Rét đậm nhất trong năm"
      }
    },
    {
      "id": "vn-2027-ong-cong-ong-tao",
      "name": "Ngày Ông Công Ông Táo chầu trời",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-01-30",
        "day": 30,
        "month": 1,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "30/01/2027"
      },
      "lunar_date": {
        "day": 23,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "23/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "23 tháng Chạp năm Bính Ngọ."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ky-niem-110-nam-do-muoi",
      "name": "110 năm Ngày sinh đồng chí Đỗ Mười",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-02",
        "day": 2,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "02/02/2027"
      },
      "lunar_date": {
        "day": 26,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "26/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1917,
        "anniversary_years": 110,
        "organization_level": "national",
        "host_agency": "TP. Hà Nội",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-thanh-lap-dang-csvn",
      "name": "Ngày thành lập Đảng Cộng sản Việt Nam",
      "category": "major_national_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-03",
        "day": 3,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "03/02/2027"
      },
      "lunar_date": {
        "day": 27,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "27/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1930,
        "anniversary_years": 97,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 4 Nghị định 145/2013/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-lap-xuan",
      "name": "Tiết Lập Xuân",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-04",
        "day": 4,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "04/02/2027"
      },
      "lunar_date": {
        "day": 28,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "28/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 3,
        "name_vi": "Lập Xuân",
        "han_tu": "立春",
        "term_type": "tiet",
        "season": "Xuân",
        "solar_longitude_deg": 315,
        "exact_time_vn": "08:42",
        "exact_iso_vn": "2027-02-04T08:42:00+07:00",
        "meaning": "Bắt đầu mùa xuân"
      }
    },
    {
      "id": "vn-2027-giao-thua-dinh-mui",
      "name": "Giao thừa Tết Nguyên đán Đinh Mùi",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-05",
        "day": 5,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "05/02/2027"
      },
      "lunar_date": {
        "day": 29,
        "month": 12,
        "year": 2026,
        "year_can_chi": "Bính Ngọ",
        "is_leap_month": false,
        "formatted": "29/12/2026 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Tháng Chạp năm Bính Ngọ là tháng thiếu (29 ngày), giao thừa vào tối 29 tháng Chạp; nằm trong kỳ nghỉ Tết Nguyên đán."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tet-nguyen-dan-dinh-mui",
      "name": "Tết Nguyên đán Đinh Mùi",
      "category": "public_holiday",
      "secondary_categories": [
        "major_national_holiday",
        "traditional_lunar"
      ],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-06",
        "day": 6,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "06/02/2027"
      },
      "lunar_date": {
        "day": 1,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "01/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 5,
        "civil_service_schedule": {
          "start_date": "2027-02-04",
          "end_date": "2027-02-10",
          "total_consecutive_days": 7,
          "includes_compensatory_day": true,
          "note": "Nghỉ từ Thứ Năm 04/02 (28 tháng Chạp) đến hết Thứ Tư 10/02/2027 (Mùng 5 Tết). Doanh nghiệp tư nhân chọn 1 trong 3 phương án theo quy định và thông báo trước ít nhất 30 ngày."
        }
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 112 Bộ luật Lao động 2019; Điều 4 Nghị định 145/2013/NĐ-CP; Thông báo 11483/TB-BNV",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ky-niem-120-nam-truong-chinh",
      "name": "120 năm Ngày sinh đồng chí Trường Chinh",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-09",
        "day": 9,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "09/02/2027"
      },
      "lunar_date": {
        "day": 4,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "04/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1907,
        "anniversary_years": 120,
        "organization_level": "provincial",
        "host_agency": "Tỉnh Ninh Bình",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tet-khai-ha",
      "name": "Tết Khai hạ (Mùng 7 tháng Giêng)",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-12",
        "day": 12,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "12/02/2027"
      },
      "lunar_date": {
        "day": 7,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "07/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Ngày hạ cây nêu, kết thúc lễ Tết đầu xuân theo phong tục cổ truyền."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-le-tinh-nhan-valentine",
      "name": "Lễ Tình nhân (Valentine)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-14",
        "day": 14,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "14/02/2027"
      },
      "lunar_date": {
        "day": 9,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "09/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm quốc tế phổ biến tại Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-via-than-tai",
      "name": "Ngày vía Thần Tài",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-15",
        "day": 15,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "15/02/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Mùng 10 tháng Giêng năm Đinh Mùi."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-vu-thuy",
      "name": "Tiết Vũ Thủy",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-19",
        "day": 19,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "19/02/2027"
      },
      "lunar_date": {
        "day": 14,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "14/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 4,
        "name_vi": "Vũ Thủy",
        "han_tu": "雨水",
        "term_type": "khi",
        "season": "Xuân",
        "solar_longitude_deg": 330,
        "exact_time_vn": "04:32",
        "exact_iso_vn": "2027-02-19T04:32:00+07:00",
        "meaning": "Mưa ẩm mùa xuân"
      }
    },
    {
      "id": "vn-2027-tet-nguyen-tieu",
      "name": "Tết Nguyên Tiêu (Rằm tháng Giêng)",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-20",
        "day": 20,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "20/02/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-thay-thuoc-viet-nam",
      "name": "Ngày Thầy thuốc Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-02-27",
        "day": 27,
        "month": 2,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "27/02/2027"
      },
      "lunar_date": {
        "day": 22,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "22/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1955,
        "anniversary_years": 72,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 39-HĐBT ngày 06/02/1985; Nghị định 111/2018/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-bo-doi-bien-phong",
      "name": "Ngày truyền thống Bộ đội Biên phòng & Ngày Biên phòng toàn dân",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-03",
        "day": 3,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "03/03/2027"
      },
      "lunar_date": {
        "day": 26,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "26/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1959,
        "anniversary_years": 68,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 16/HĐBT ngày 22/02/1989; Luật Biên giới quốc gia",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-kinh-trap",
      "name": "Tiết Kinh Trập",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-06",
        "day": 6,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "06/03/2027"
      },
      "lunar_date": {
        "day": 29,
        "month": 1,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "29/01/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 5,
        "name_vi": "Kinh Trập",
        "han_tu": "驚蟄",
        "term_type": "tiet",
        "season": "Xuân",
        "solar_longitude_deg": 345,
        "exact_time_vn": "02:36",
        "exact_iso_vn": "2027-03-06T02:36:00+07:00",
        "meaning": "Sâu bọ thức giấc sau kỳ ngủ đông"
      }
    },
    {
      "id": "vn-2027-quoc-te-phu-nu",
      "name": "Ngày Quốc tế Phụ nữ",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-08",
        "day": 8,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "08/03/2027"
      },
      "lunar_date": {
        "day": 1,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "01/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm quốc tế phổ biến tại Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-quoc-te-hanh-phuc",
      "name": "Ngày Quốc tế Hạnh phúc",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-20",
        "day": 20,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "20/03/2027"
      },
      "lunar_date": {
        "day": 13,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "13/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 2013,
        "anniversary_years": 14,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Nghị quyết Liên hợp quốc A/RES/66/281; Quyết định 2589/QĐ-TTg ngày 26/12/2013",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-xuan-phan",
      "name": "Tiết Xuân Phân",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-21",
        "day": 21,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "21/03/2027"
      },
      "lunar_date": {
        "day": 14,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "14/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 6,
        "name_vi": "Xuân Phân",
        "han_tu": "春分",
        "term_type": "khi",
        "season": "Xuân",
        "solar_longitude_deg": 0,
        "exact_time_vn": "03:23",
        "exact_iso_vn": "2027-03-21T03:23:00+07:00",
        "meaning": "Giữa mùa xuân, ngày và đêm dài bằng nhau"
      }
    },
    {
      "id": "vn-2027-thanh-lap-doan-tncs-hcm",
      "name": "Ngày thành lập Đoàn TNCS Hồ Chí Minh",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-26",
        "day": 26,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "26/03/2027"
      },
      "lunar_date": {
        "day": 19,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "19/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1931,
        "anniversary_years": 96,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Nghị định 111/2018/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-the-thao-viet-nam",
      "name": "Ngày Thể thao Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-27",
        "day": 27,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "27/03/2027"
      },
      "lunar_date": {
        "day": 20,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "20/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1946,
        "anniversary_years": 81,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 25/CT ngày 29/01/1991 của Chủ tịch Hội đồng Bộ trưởng",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-le-phuc-sinh",
      "name": "Lễ Phục Sinh (Công giáo)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-03-28",
        "day": 28,
        "month": 3,
        "year": 2027,
        "quarter": 1,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "28/03/2027"
      },
      "lunar_date": {
        "day": 21,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "21/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Lễ trọng Công giáo & Kitô giáo (tính theo chu kỳ trăng xuân phân)",
        "notes": "Ngày lễ di động hằng năm; năm 2027 rơi vào Chủ nhật 28/03/2027."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ca-thang-tu",
      "name": "Ngày Cá tháng Tư (April Fools' Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-01",
        "day": 1,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "01/04/2027"
      },
      "lunar_date": {
        "day": 25,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "25/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm văn hóa quốc tế phổ biến",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-thanh-minh",
      "name": "Tiết Thanh Minh (Tết Thanh Minh)",
      "category": "solar_term",
      "secondary_categories": [
        "traditional_lunar"
      ],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-05",
        "day": 5,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "05/04/2027"
      },
      "lunar_date": {
        "day": 29,
        "month": 2,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "29/02/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": "Trùng dịp Tết Thanh Minh (tảo mộ truyền thống); gộp chung bản ghi để tránh trùng lặp dữ liệu."
      },
      "solar_term_details": {
        "order_in_year": 7,
        "name_vi": "Thanh Minh",
        "han_tu": "清明",
        "term_type": "tiet",
        "season": "Xuân",
        "solar_longitude_deg": 15,
        "exact_time_vn": "07:14",
        "exact_iso_vn": "2027-04-05T07:14:00+07:00",
        "meaning": "Trời quang đãng, dịp Tết Thanh Minh tảo mộ"
      }
    },
    {
      "id": "vn-2027-ky-niem-120-nam-le-duan",
      "name": "120 năm Ngày sinh đồng chí Lê Duẩn",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-07",
        "day": 7,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "07/04/2027"
      },
      "lunar_date": {
        "day": 1,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "01/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1907,
        "anniversary_years": 120,
        "organization_level": "provincial",
        "host_agency": "Tỉnh Quảng Trị",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tet-han-thuc",
      "name": "Tết Hàn thực",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-09",
        "day": 9,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "09/04/2027"
      },
      "lunar_date": {
        "day": 3,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "03/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Mùng 3 tháng 3 Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-gio-to-hung-vuong",
      "name": "Giỗ Tổ Hùng Vương",
      "category": "public_holiday",
      "secondary_categories": [
        "major_national_holiday",
        "traditional_lunar"
      ],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-16",
        "day": 16,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "16/04/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 1,
        "civil_service_schedule": {
          "start_date": "2027-04-16",
          "end_date": "2027-04-18",
          "total_consecutive_days": 3,
          "includes_compensatory_day": false,
          "note": "Nghỉ liên tục 3 ngày từ Thứ Sáu 16/04 đến hết Chủ nhật 18/04/2027."
        }
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 112 Bộ luật Lao động 2019; Điều 4 Nghị định 145/2013/NĐ-CP; Thông báo 11483/TB-BNV",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-coc-vu",
      "name": "Tiết Cốc Vũ",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-20",
        "day": 20,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "20/04/2027"
      },
      "lunar_date": {
        "day": 14,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "14/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 8,
        "name_vi": "Cốc Vũ",
        "han_tu": "穀雨",
        "term_type": "khi",
        "season": "Xuân",
        "solar_longitude_deg": 30,
        "exact_time_vn": "14:15",
        "exact_iso_vn": "2027-04-20T14:15:00+07:00",
        "meaning": "Mưa rào tốt cho mùa màng"
      }
    },
    {
      "id": "vn-2027-ngay-sach-va-van-hoa-doc-vn",
      "name": "Ngày Sách và Văn hóa đọc Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-21",
        "day": 21,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "21/04/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 2014,
        "anniversary_years": 13,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 1862/QĐ-TTg ngày 04/11/2021 (kế thừa Quyết định 284/QĐ-TTg năm 2014)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-trai-dat",
      "name": "Ngày Trái Đất (Earth Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-22",
        "day": 22,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "22/04/2027"
      },
      "lunar_date": {
        "day": 16,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "16/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1970,
        "anniversary_years": 57,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm môi trường toàn cầu (Liên hợp quốc công nhận)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-chien-thang-30-4",
      "name": "Ngày Chiến thắng (Giải phóng miền Nam, thống nhất đất nước)",
      "category": "public_holiday",
      "secondary_categories": [
        "major_national_holiday"
      ],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-04-30",
        "day": 30,
        "month": 4,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "30/04/2027"
      },
      "lunar_date": {
        "day": 24,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "24/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 1,
        "civil_service_schedule": {
          "start_date": "2027-04-30",
          "end_date": "2027-05-03",
          "total_consecutive_days": 4,
          "includes_compensatory_day": true,
          "note": "Nghỉ gộp cùng lễ 01/05 từ Thứ Sáu 30/04 đến hết Thứ Hai 03/05/2027 (nghỉ bù ngày 01/05 trùng Thứ Bảy cho khối nghỉ cố định Thứ Bảy – Chủ nhật)."
        }
      },
      "event_details": {
        "origin_year": 1975,
        "anniversary_years": 52,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 112 Bộ luật Lao động 2019; Điều 4 Nghị định 145/2013/NĐ-CP; Thông báo 11483/TB-BNV",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-quoc-te-lao-dong",
      "name": "Ngày Quốc tế Lao động",
      "category": "public_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-01",
        "day": 1,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "01/05/2027"
      },
      "lunar_date": {
        "day": 25,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "25/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 1,
        "civil_service_schedule": {
          "start_date": "2027-04-30",
          "end_date": "2027-05-03",
          "total_consecutive_days": 4,
          "includes_compensatory_day": true,
          "note": "Trùng Thứ Bảy, nghỉ bù sang Thứ Hai 03/05/2027 đối với khối nghỉ Thứ Bảy – Chủ nhật. Đơn vị làm việc Thứ Bảy không phát sinh nghỉ bù."
        }
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Điều 112 Bộ luật Lao động 2019; Thông báo 11483/TB-BNV",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ky-niem-110-nam-van-tien-dung",
      "name": "110 năm Ngày sinh Đại tướng Văn Tiến Dũng",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-02",
        "day": 2,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "02/05/2027"
      },
      "lunar_date": {
        "day": 26,
        "month": 3,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "26/03/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1917,
        "anniversary_years": 110,
        "organization_level": "provincial",
        "host_agency": "TP. Hồ Chí Minh",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-lap-ha",
      "name": "Tiết Lập Hạ",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-06",
        "day": 6,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "06/05/2027"
      },
      "lunar_date": {
        "day": 1,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "01/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 9,
        "name_vi": "Lập Hạ",
        "han_tu": "立夏",
        "term_type": "tiet",
        "season": "Hạ",
        "solar_longitude_deg": 45,
        "exact_time_vn": "00:21",
        "exact_iso_vn": "2027-05-06T00:21:00+07:00",
        "meaning": "Bắt đầu mùa hạ"
      }
    },
    {
      "id": "vn-2027-chien-thang-dien-bien-phu",
      "name": "Ngày Chiến thắng Điện Biên Phủ",
      "category": "major_national_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-07",
        "day": 7,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "07/05/2027"
      },
      "lunar_date": {
        "day": 2,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "02/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1954,
        "anniversary_years": 73,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 4 Nghị định 145/2013/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-cua-me",
      "name": "Ngày của Mẹ (Mother's Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-09",
        "day": 9,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "09/05/2027"
      },
      "lunar_date": {
        "day": 4,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "04/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm quốc tế phổ biến tại Việt Nam",
        "notes": "Chủ nhật thứ hai của tháng 5 hằng năm."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-thanh-lap-doi-tntp-hcm",
      "name": "Ngày thành lập Đội Thiếu niên Tiền phong Hồ Chí Minh",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-15",
        "day": 15,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "15/05/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1941,
        "anniversary_years": 86,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày truyền thống tổ chức Đội TNTP Hồ Chí Minh",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-khoa-hoc-va-cong-nghe-vn",
      "name": "Ngày Khoa học và Công nghệ Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-18",
        "day": 18,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "18/05/2027"
      },
      "lunar_date": {
        "day": 13,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "13/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 2013,
        "anniversary_years": 14,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Điều 7 Luật Khoa học và Công nghệ số 29/2013/QH13",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-sinh-chu-tich-ho-chi-minh",
      "name": "Ngày sinh Chủ tịch Hồ Chí Minh",
      "category": "major_national_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-19",
        "day": 19,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "19/05/2027"
      },
      "lunar_date": {
        "day": 14,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "14/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1890,
        "anniversary_years": 137,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 4 Nghị định 145/2013/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-dai-le-phat-dan",
      "name": "Đại lễ Phật Đản",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-20",
        "day": 20,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "20/05/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Lễ trọng Phật giáo & truyền thống văn hóa Việt Nam",
        "notes": "Rằm tháng Tư Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-tieu-man",
      "name": "Tiết Tiểu Mãn",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-05-21",
        "day": 21,
        "month": 5,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "21/05/2027"
      },
      "lunar_date": {
        "day": 16,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "16/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 10,
        "name_vi": "Tiểu Mãn",
        "han_tu": "小滿",
        "term_type": "khi",
        "season": "Hạ",
        "solar_longitude_deg": 60,
        "exact_time_vn": "13:14",
        "exact_iso_vn": "2027-05-21T13:14:00+07:00",
        "meaning": "Lũ nhỏ, lúa bắt đầu chắc hạt"
      }
    },
    {
      "id": "vn-2027-quoc-te-thieu-nhi",
      "name": "Ngày Quốc tế Thiếu nhi",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-01",
        "day": 1,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "01/06/2027"
      },
      "lunar_date": {
        "day": 27,
        "month": 4,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "27/04/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm quốc tế phổ biến tại Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-moi-truong-the-gioi",
      "name": "Ngày Môi trường Thế giới (World Environment Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-05",
        "day": 5,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "05/06/2027"
      },
      "lunar_date": {
        "day": 1,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "01/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1972,
        "anniversary_years": 55,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Nghị quyết Đại hội đồng Liên hợp quốc (1972)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-mang-chung",
      "name": "Tiết Mang Chủng",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-06",
        "day": 6,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "06/06/2027"
      },
      "lunar_date": {
        "day": 2,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "02/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 11,
        "name_vi": "Mang Chủng",
        "han_tu": "芒種",
        "term_type": "tiet",
        "season": "Hạ",
        "solar_longitude_deg": 75,
        "exact_time_vn": "04:22",
        "exact_iso_vn": "2027-06-06T04:22:00+07:00",
        "meaning": "Chòm sao Tua Rua mọc, thời điểm gieo cấy"
      }
    },
    {
      "id": "vn-2027-tet-doan-ngo",
      "name": "Tết Đoan Ngọ",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-09",
        "day": 9,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "09/06/2027"
      },
      "lunar_date": {
        "day": 5,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "05/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Mùng 5 tháng 5 Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-cua-cha",
      "name": "Ngày của Cha (Father's Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-20",
        "day": 20,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "20/06/2027"
      },
      "lunar_date": {
        "day": 16,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "16/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm quốc tế phổ biến tại Việt Nam",
        "notes": "Chủ nhật thứ ba của tháng 6 hằng năm."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-bao-chi-cach-mang-vn",
      "name": "Ngày Báo chí Cách mạng Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-21",
        "day": 21,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "21/06/2027"
      },
      "lunar_date": {
        "day": 17,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "17/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1925,
        "anniversary_years": 102,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 52-QĐ/TW ngày 05/02/1985; Nghị định 111/2018/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-ha-chi",
      "name": "Tiết Hạ Chí",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-21",
        "day": 21,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "21/06/2027"
      },
      "lunar_date": {
        "day": 17,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "17/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 12,
        "name_vi": "Hạ Chí",
        "han_tu": "夏至",
        "term_type": "khi",
        "season": "Hạ",
        "solar_longitude_deg": 90,
        "exact_time_vn": "21:05",
        "exact_iso_vn": "2027-06-21T21:05:00+07:00",
        "meaning": "Giữa mùa hạ, ngày dài nhất năm ở Bắc bán cầu"
      }
    },
    {
      "id": "vn-2027-ngay-gia-dinh-viet-nam",
      "name": "Ngày Gia đình Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-06-28",
        "day": 28,
        "month": 6,
        "year": 2027,
        "quarter": 2,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "28/06/2027"
      },
      "lunar_date": {
        "day": 24,
        "month": 5,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "24/05/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 2001,
        "anniversary_years": 26,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 72/2001/QĐ-TTg ngày 04/05/2001",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-tieu-thu",
      "name": "Tiết Tiểu Thử",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-07-07",
        "day": 7,
        "month": 7,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "07/07/2027"
      },
      "lunar_date": {
        "day": 4,
        "month": 6,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "04/06/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 13,
        "name_vi": "Tiểu Thử",
        "han_tu": "小暑",
        "term_type": "tiet",
        "season": "Hạ",
        "solar_longitude_deg": 105,
        "exact_time_vn": "14:34",
        "exact_iso_vn": "2027-07-07T14:34:00+07:00",
        "meaning": "Nóng nhẹ"
      }
    },
    {
      "id": "vn-2027-tiet-khi-dai-thu",
      "name": "Tiết Đại Thử",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-07-23",
        "day": 23,
        "month": 7,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "23/07/2027"
      },
      "lunar_date": {
        "day": 20,
        "month": 6,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "20/06/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 14,
        "name_vi": "Đại Thử",
        "han_tu": "大暑",
        "term_type": "khi",
        "season": "Hạ",
        "solar_longitude_deg": 120,
        "exact_time_vn": "07:58",
        "exact_iso_vn": "2027-07-23T07:58:00+07:00",
        "meaning": "Nóng oi bức nhất trong năm"
      }
    },
    {
      "id": "vn-2027-ngay-to-quoc-tri-an-thuong-binh-liet-si",
      "name": "Ngày Tổ quốc tri ân – 80 năm Ngày Thương binh, liệt sĩ",
      "category": "public_holiday",
      "secondary_categories": [
        "anniversary_milestone_2027"
      ],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-07-27",
        "day": 27,
        "month": 7,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "27/07/2027"
      },
      "lunar_date": {
        "day": 24,
        "month": 6,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "24/06/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 1,
        "civil_service_schedule": {
          "start_date": "2027-07-27",
          "end_date": "2027-07-27",
          "total_consecutive_days": 1,
          "includes_compensatory_day": false,
          "note": "Nghỉ 1 ngày vào Thứ Ba 27/07/2027. Năm 2027 là năm đầu tiên áp dụng chế độ nghỉ lễ hưởng nguyên lương theo Luật sửa đổi Bộ luật Lao động."
        }
      },
      "event_details": {
        "origin_year": 1947,
        "anniversary_years": 80,
        "organization_level": "national",
        "host_agency": "Bộ Nội vụ",
        "legal_basis": "Luật sửa đổi, bổ sung một số điều của Bộ luật Lao động (thông qua 21/11/2026, hiệu lực từ 01/03/2027); Kết luận 91",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-le-that-tich",
      "name": "Lễ Thất Tịch",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-08",
        "day": 8,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "08/08/2027"
      },
      "lunar_date": {
        "day": 7,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "07/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống",
        "notes": "Mùng 7 tháng 7 Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-lap-thu",
      "name": "Tiết Lập Thu",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-08",
        "day": 8,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "08/08/2027"
      },
      "lunar_date": {
        "day": 7,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "07/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 15,
        "name_vi": "Lập Thu",
        "han_tu": "立秋",
        "term_type": "tiet",
        "season": "Thu",
        "solar_longitude_deg": 135,
        "exact_time_vn": "00:25",
        "exact_iso_vn": "2027-08-08T00:25:00+07:00",
        "meaning": "Bắt đầu mùa thu"
      }
    },
    {
      "id": "vn-2027-le-vu-lan",
      "name": "Lễ Vu Lan (Rằm tháng Bảy)",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-16",
        "day": 16,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "16/08/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Lễ trọng Phật giáo & truyền thống báo hiếu Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-cach-mang-thang-tam",
      "name": "Ngày Cách mạng Tháng Tám thành công",
      "category": "major_national_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-19",
        "day": 19,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "19/08/2027"
      },
      "lunar_date": {
        "day": 18,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "18/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1945,
        "anniversary_years": 82,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 4 Nghị định 145/2013/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-cong-an-nhan-dan-vn",
      "name": "Ngày truyền thống Công an Nhân dân Việt Nam & Ngày hội Toàn dân bảo vệ ANTQ",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-19",
        "day": 19,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "19/08/2027"
      },
      "lunar_date": {
        "day": 18,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "18/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1945,
        "anniversary_years": 82,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 521/QĐ-TTg ngày 13/06/2005; Luật Công an nhân dân",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-xu-thu",
      "name": "Tiết Xử Thử",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-23",
        "day": 23,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "23/08/2027"
      },
      "lunar_date": {
        "day": 22,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "22/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 16,
        "name_vi": "Xử Thử",
        "han_tu": "處暑",
        "term_type": "khi",
        "season": "Thu",
        "solar_longitude_deg": 150,
        "exact_time_vn": "15:07",
        "exact_iso_vn": "2027-08-23T15:07:00+07:00",
        "meaning": "Hết nắng gắt, thời tiết dịu mát dần"
      }
    },
    {
      "id": "vn-2027-nganh-ngoai-giao-va-van-phong-cqnn",
      "name": "Ngày truyền thống Ngành Ngoại giao & Văn phòng các cơ quan hành chính nhà nước",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-08-28",
        "day": 28,
        "month": 8,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "28/08/2027"
      },
      "lunar_date": {
        "day": 27,
        "month": 7,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "27/07/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1945,
        "anniversary_years": 82,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 828/QĐ-TTg ngày 22/07/2004; Nghị định 111/2018/NĐ-CP",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-quoc-khanh",
      "name": "Ngày Quốc khánh nước Cộng hòa xã hội chủ nghĩa Việt Nam",
      "category": "public_holiday",
      "secondary_categories": [
        "major_national_holiday"
      ],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-09-02",
        "day": 2,
        "month": 9,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "02/09/2027"
      },
      "lunar_date": {
        "day": 2,
        "month": 8,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "02/08/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 2,
        "civil_service_schedule": {
          "start_date": "2027-09-02",
          "end_date": "2027-09-05",
          "total_consecutive_days": 4,
          "includes_compensatory_day": false,
          "note": "Nghỉ 2 ngày luật định (Thứ Năm 02/09 và Thứ Sáu 03/09) nối liền Thứ Bảy 04/09 và Chủ nhật 05/09/2027. Doanh nghiệp tư nhân chọn ngày 02/09 kèm ngày 01/09 hoặc 03/09."
        }
      },
      "event_details": {
        "origin_year": 1945,
        "anniversary_years": 82,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Điều 112 Bộ luật Lao động 2019; Điều 4 Nghị định 145/2013/NĐ-CP; Thông báo 11483/TB-BNV",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-bach-lo",
      "name": "Tiết Bạch Lộ",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-09-08",
        "day": 8,
        "month": 9,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "08/09/2027"
      },
      "lunar_date": {
        "day": 8,
        "month": 8,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "08/08/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 17,
        "name_vi": "Bạch Lộ",
        "han_tu": "白露",
        "term_type": "tiet",
        "season": "Thu",
        "solar_longitude_deg": 165,
        "exact_time_vn": "03:27",
        "exact_iso_vn": "2027-09-08T03:27:00+07:00",
        "meaning": "Sương trắng xuất hiện buổi sớm"
      }
    },
    {
      "id": "vn-2027-thanh-lap-mat-tran-to-quoc-vn",
      "name": "Ngày thành lập Mặt trận Tổ quốc Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-09-10",
        "day": 10,
        "month": 9,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "10/09/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 8,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/08/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1955,
        "anniversary_years": 72,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Đại hội Mặt trận Dân tộc Thống nhất (10/09/1955)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tet-trung-thu",
      "name": "Tết Trung Thu",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-09-15",
        "day": 15,
        "month": 9,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "15/09/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 8,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/08/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Rằm tháng Tám Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-50-nam-viet-nam-gia-nhap-lhq",
      "name": "50 năm Ngày Việt Nam gia nhập Liên hợp quốc",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-09-20",
        "day": 20,
        "month": 9,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "20/09/2027"
      },
      "lunar_date": {
        "day": 20,
        "month": 8,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "20/08/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1977,
        "anniversary_years": 50,
        "organization_level": "ministry_sector",
        "host_agency": "Bộ Ngoại giao",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-thu-phan",
      "name": "Tiết Thu Phân",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-09-23",
        "day": 23,
        "month": 9,
        "year": 2027,
        "quarter": 3,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "23/09/2027"
      },
      "lunar_date": {
        "day": 23,
        "month": 8,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "23/08/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 18,
        "name_vi": "Thu Phân",
        "han_tu": "秋分",
        "term_type": "khi",
        "season": "Thu",
        "solar_longitude_deg": 180,
        "exact_time_vn": "12:55",
        "exact_iso_vn": "2027-09-23T12:55:00+07:00",
        "meaning": "Giữa mùa thu, ngày và đêm dài bằng nhau"
      }
    },
    {
      "id": "vn-2027-quoc-te-nguoi-cao-tuoi",
      "name": "Ngày Quốc tế Người cao tuổi",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-01",
        "day": 1,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "01/10/2027"
      },
      "lunar_date": {
        "day": 2,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "02/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1990,
        "anniversary_years": 37,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Nghị quyết Liên hợp quốc 45/106; Luật Người cao tuổi Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-khuyen-hoc-viet-nam",
      "name": "Ngày Khuyến học Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-02",
        "day": 2,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "02/10/2027"
      },
      "lunar_date": {
        "day": 3,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "03/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1996,
        "anniversary_years": 31,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 1271/QĐ-TTg ngày 16/09/2008",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tet-trung-cuu",
      "name": "Tết Trùng Cửu",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-08",
        "day": 8,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "08/10/2027"
      },
      "lunar_date": {
        "day": 9,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "09/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống",
        "notes": "Mùng 9 tháng 9 Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-han-lo",
      "name": "Tiết Hàn Lộ",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-08",
        "day": 8,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "08/10/2027"
      },
      "lunar_date": {
        "day": 9,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "09/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 19,
        "name_vi": "Hàn Lộ",
        "han_tu": "寒露",
        "term_type": "tiet",
        "season": "Thu",
        "solar_longitude_deg": 195,
        "exact_time_vn": "19:16",
        "exact_iso_vn": "2027-10-08T19:16:00+07:00",
        "meaning": "Sương lạnh"
      }
    },
    {
      "id": "vn-2027-chuyen-doi-so-quoc-gia",
      "name": "Ngày Chuyển đổi số quốc gia",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-10",
        "day": 10,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "10/10/2027"
      },
      "lunar_date": {
        "day": 11,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "11/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 2022,
        "anniversary_years": 5,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 505/QĐ-TTg ngày 22/04/2022 của Thủ tướng Chính phủ",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-giai-phong-thu-do-va-luat-su-vn",
      "name": "Ngày Giải phóng Thủ đô & Ngày truyền thống Luật sư Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-10",
        "day": 10,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "10/10/2027"
      },
      "lunar_date": {
        "day": 11,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "11/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1954,
        "anniversary_years": 73,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 149/QĐ-TTg (Ngày truyền thống Luật sư VN 10/10/1945); Sự kiện lịch sử 10/10/1954",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-doanh-nhan-viet-nam",
      "name": "Ngày Doanh nhân Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-13",
        "day": 13,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "13/10/2027"
      },
      "lunar_date": {
        "day": 14,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "14/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 2004,
        "anniversary_years": 23,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 990/QĐ-TTg ngày 20/09/2004",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-thanh-lap-hoi-nong-dan-vn",
      "name": "Ngày thành lập Hội Nông dân Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-14",
        "day": 14,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "14/10/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1930,
        "anniversary_years": 97,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định của Bộ Chính trị (17/01/1991)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-hoi-lien-hiep-thanh-nien-vn",
      "name": "Ngày truyền thống Hội Liên hiệp Thanh niên Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-15",
        "day": 15,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "15/10/2027"
      },
      "lunar_date": {
        "day": 16,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "16/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1956,
        "anniversary_years": 71,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Đại hội thành lập Hội LHTN Việt Nam (15/10/1956)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-phu-nu-viet-nam",
      "name": "Ngày Phụ nữ Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-20",
        "day": 20,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "20/10/2027"
      },
      "lunar_date": {
        "day": 21,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "21/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1930,
        "anniversary_years": 97,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày thành lập Hội Liên hiệp Phụ nữ Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-suong-giang",
      "name": "Tiết Sương Giáng",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-23",
        "day": 23,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "23/10/2027"
      },
      "lunar_date": {
        "day": 24,
        "month": 9,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "24/09/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 20,
        "name_vi": "Sương Giáng",
        "han_tu": "霜降",
        "term_type": "khi",
        "season": "Thu",
        "solar_longitude_deg": 210,
        "exact_time_vn": "22:26",
        "exact_iso_vn": "2027-10-23T22:26:00+07:00",
        "meaning": "Sương giá bắt đầu xuất hiện"
      }
    },
    {
      "id": "vn-2027-halloween",
      "name": "Lễ hội Halloween",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-10-31",
        "day": 31,
        "month": 10,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "31/10/2027"
      },
      "lunar_date": {
        "day": 3,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "03/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Lễ hội văn hóa quốc tế phổ biến",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-110-nam-cach-mang-thang-muoi-nga",
      "name": "110 năm Cách mạng Tháng Mười Nga",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-07",
        "day": 7,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "07/11/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1917,
        "anniversary_years": 110,
        "organization_level": "national",
        "host_agency": "TP. Hà Nội",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tet-trung-thap",
      "name": "Tết Trùng Thập (Tết Cơm mới)",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-07",
        "day": 7,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "07/11/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": "Mùng 10 tháng 10 Âm lịch."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-lap-dong",
      "name": "Tiết Lập Đông",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-07",
        "day": 7,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "07/11/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 21,
        "name_vi": "Lập Đông",
        "han_tu": "立冬",
        "term_type": "tiet",
        "season": "Đông",
        "solar_longitude_deg": 225,
        "exact_time_vn": "22:37",
        "exact_iso_vn": "2027-11-07T22:37:00+07:00",
        "meaning": "Bắt đầu mùa đông"
      }
    },
    {
      "id": "vn-2027-ngay-phap-luat-viet-nam",
      "name": "Ngày Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-09",
        "day": 9,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "09/11/2027"
      },
      "lunar_date": {
        "day": 12,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "12/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1946,
        "anniversary_years": 81,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Điều 8 Luật Phổ biến, giáo dục pháp luật năm 2012",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ram-thang-muoi",
      "name": "Tết Hạ Nguyên (Rằm tháng Mười)",
      "category": "traditional_lunar",
      "secondary_categories": [],
      "calendar_basis": "lunar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-12",
        "day": 12,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "12/11/2027"
      },
      "lunar_date": {
        "day": 15,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "15/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Phong tục truyền thống Việt Nam",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-dai-doan-ket-toan-dan-toc",
      "name": "Ngày truyền thống Mặt trận Tổ quốc Việt Nam (Ngày hội Đại đoàn kết toàn dân tộc)",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-18",
        "day": 18,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Thursday",
        "day_of_week_vi": "Thứ Năm",
        "formatted": "18/11/2027"
      },
      "lunar_date": {
        "day": 21,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "21/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1930,
        "anniversary_years": 97,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Nghị quyết 04/NQ-ĐCT-MTTW ngày 01/08/2003",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-quoc-te-nam-gioi",
      "name": "Ngày Quốc tế Nam giới (International Men's Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-19",
        "day": 19,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "19/11/2027"
      },
      "lunar_date": {
        "day": 22,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "22/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1999,
        "anniversary_years": 28,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Ngày kỷ niệm quốc tế phổ biến",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-nha-giao-viet-nam",
      "name": "Ngày Nhà giáo Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-20",
        "day": 20,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "20/11/2027"
      },
      "lunar_date": {
        "day": 23,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "23/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1982,
        "anniversary_years": 45,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 167-HĐBT ngày 28/09/1982",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-tieu-tuyet",
      "name": "Tiết Tiểu Tuyết",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-22",
        "day": 22,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "22/11/2027"
      },
      "lunar_date": {
        "day": 25,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "25/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 22,
        "name_vi": "Tiểu Tuyết",
        "han_tu": "小雪",
        "term_type": "khi",
        "season": "Đông",
        "solar_longitude_deg": 240,
        "exact_time_vn": "20:10",
        "exact_iso_vn": "2027-11-22T20:10:00+07:00",
        "meaning": "Tuyết nhẹ (vùng ôn đới), trời trở lạnh"
      }
    },
    {
      "id": "vn-2027-di-san-van-hoa-va-chu-thap-do-vn",
      "name": "Ngày Di sản Văn hóa Việt Nam & Ngày thành lập Hội Chữ thập đỏ Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-23",
        "day": 23,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "23/11/2027"
      },
      "lunar_date": {
        "day": 26,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "26/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1945,
        "anniversary_years": 82,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 36/2005/QĐ-TTg ngày 24/02/2005 (Di sản Văn hóa VN); Hội Chữ thập đỏ VN thành lập 23/11/1946",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-van-hoa-viet-nam",
      "name": "Ngày Văn hóa Việt Nam",
      "category": "public_holiday",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-11-24",
        "day": 24,
        "month": 11,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "24/11/2027"
      },
      "lunar_date": {
        "day": 27,
        "month": 10,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "27/10/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": true,
        "statutory_paid_days": 1,
        "civil_service_schedule": {
          "start_date": "2027-11-24",
          "end_date": "2027-11-24",
          "total_consecutive_days": 1,
          "includes_compensatory_day": false,
          "note": "Nghỉ 1 ngày vào Thứ Tư 24/11/2027 theo Nghị quyết 28/2026/QH16 và Luật sửa đổi Bộ luật Lao động."
        }
      },
      "event_details": {
        "origin_year": 1946,
        "anniversary_years": 81,
        "organization_level": "national",
        "host_agency": null,
        "legal_basis": "Nghị quyết 28/2026/QH16; Luật sửa đổi, bổ sung một số điều của Bộ luật Lao động (thông qua 21/11/2026)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-the-gioi-phong-chong-aids",
      "name": "Ngày Thế giới phòng chống AIDS (World AIDS Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-01",
        "day": 1,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "01/12/2027"
      },
      "lunar_date": {
        "day": 4,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "04/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1988,
        "anniversary_years": 39,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Tổ chức Y tế Thế giới (WHO) & Liên hợp quốc",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-hoi-cuu-chien-binh-vn",
      "name": "Ngày thành lập Hội Cựu chiến binh Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-06",
        "day": 6,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Monday",
        "day_of_week_vi": "Thứ Hai",
        "formatted": "06/12/2027"
      },
      "lunar_date": {
        "day": 9,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "09/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1989,
        "anniversary_years": 38,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định của Bộ Chính trị ngày 06/12/1989",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-dai-tuyet",
      "name": "Tiết Đại Tuyết",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-07",
        "day": 7,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Tuesday",
        "day_of_week_vi": "Thứ Ba",
        "formatted": "07/12/2027"
      },
      "lunar_date": {
        "day": 10,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "10/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 23,
        "name_vi": "Đại Tuyết",
        "han_tu": "大雪",
        "term_type": "tiet",
        "season": "Đông",
        "solar_longitude_deg": 255,
        "exact_time_vn": "15:36",
        "exact_iso_vn": "2027-12-07T15:36:00+07:00",
        "meaning": "Tuyết dày (vùng ôn đới), lạnh sâu"
      }
    },
    {
      "id": "vn-2027-80-nam-chien-thang-viet-bac-thu-dong",
      "name": "80 năm Chiến thắng Việt Bắc Thu Đông",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-19",
        "day": 19,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "19/12/2027"
      },
      "lunar_date": {
        "day": 22,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "22/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1947,
        "anniversary_years": 80,
        "organization_level": "ministry_sector",
        "host_agency": "Quân ủy Trung ương – Bộ Quốc phòng",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-thanh-lap-qdnd-viet-nam",
      "name": "Ngày thành lập Quân đội Nhân dân Việt Nam & Ngày hội Quốc phòng toàn dân",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-22",
        "day": 22,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "22/12/2027"
      },
      "lunar_date": {
        "day": 25,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "25/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1944,
        "anniversary_years": 83,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Chỉ thị 381-CT/TW (1989); Luật Quốc phòng",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-tiet-khi-dong-chi",
      "name": "Tiết Đông Chí",
      "category": "solar_term",
      "secondary_categories": [],
      "calendar_basis": "solar_longitude",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-22",
        "day": 22,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Wednesday",
        "day_of_week_vi": "Thứ Tư",
        "formatted": "22/12/2027"
      },
      "lunar_date": {
        "day": 25,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "25/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Hệ thống 24 Tiết khí thiên văn theo kinh độ Hoàng Đạo (múi giờ UTC+7)",
        "notes": null
      },
      "solar_term_details": {
        "order_in_year": 24,
        "name_vi": "Đông Chí",
        "han_tu": "冬至",
        "term_type": "khi",
        "season": "Đông",
        "solar_longitude_deg": 270,
        "exact_time_vn": "09:36",
        "exact_iso_vn": "2027-12-22T09:36:00+07:00",
        "meaning": "Giữa mùa đông, đêm dài nhất năm ở Bắc bán cầu"
      }
    },
    {
      "id": "vn-2027-dem-giang-sinh",
      "name": "Đêm Giáng sinh (Christmas Eve)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-24",
        "day": 24,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Friday",
        "day_of_week_vi": "Thứ Sáu",
        "formatted": "24/12/2027"
      },
      "lunar_date": {
        "day": 27,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "27/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Lễ trọng Công giáo / Tin Lành & lễ hội quốc tế phổ biến",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-le-giang-sinh",
      "name": "Lễ Giáng sinh (Noel / Christmas Day)",
      "category": "international_religious",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-25",
        "day": 25,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Saturday",
        "day_of_week_vi": "Thứ Bảy",
        "formatted": "25/12/2027"
      },
      "lunar_date": {
        "day": 28,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "28/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": null,
        "anniversary_years": null,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Lễ trọng Công giáo / Tin Lành & lễ hội quốc tế phổ biến",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-ngay-dan-so-viet-nam",
      "name": "Ngày Dân số Việt Nam",
      "category": "commemorative_industry",
      "secondary_categories": [],
      "calendar_basis": "solar",
      "is_fixed_date": true,
      "solar_date": {
        "iso": "2027-12-26",
        "day": 26,
        "month": 12,
        "year": 2027,
        "quarter": 4,
        "day_of_week_en": "Sunday",
        "day_of_week_vi": "Chủ nhật",
        "formatted": "26/12/2027"
      },
      "lunar_date": {
        "day": 29,
        "month": 11,
        "year": 2027,
        "year_can_chi": "Đinh Mùi",
        "is_leap_month": false,
        "formatted": "29/11/2027 ÂL"
      },
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1961,
        "anniversary_years": 66,
        "organization_level": null,
        "host_agency": null,
        "legal_basis": "Quyết định 326/QĐ-TTg ngày 19/05/1997 của Thủ tướng Chính phủ",
        "notes": null
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-100-nam-tac-pham-duong-kach-menh",
      "name": "100 năm tác phẩm Đường Kách mệnh của Lãnh tụ Nguyễn Ái Quốc",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "year_round",
      "is_fixed_date": false,
      "solar_date": null,
      "lunar_date": null,
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1927,
        "anniversary_years": 100,
        "organization_level": "ministry_sector",
        "host_agency": "Ban Tuyên giáo Trung ương hướng dẫn",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": "Tổ chức trong năm 2027."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-600-nam-chien-thang-chi-lang-xuong-giang",
      "name": "600 năm Chiến thắng Chi Lăng – Xương Giang",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "year_round",
      "is_fixed_date": false,
      "solar_date": null,
      "lunar_date": null,
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1427,
        "anniversary_years": 600,
        "organization_level": "national",
        "host_agency": "Tỉnh Lạng Sơn",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": "Tổ chức trong năm 2027 theo kế hoạch cụ thể của cơ quan chủ trì."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-80-nam-atk-dinh-hoa-cho-don",
      "name": "80 năm Chủ tịch Hồ Chí Minh cùng Trung ương Đảng, Chính phủ về ATK Định Hóa, ATK Chợ Đồn",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "year_round",
      "is_fixed_date": false,
      "solar_date": null,
      "lunar_date": null,
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1947,
        "anniversary_years": 80,
        "organization_level": "national",
        "host_agency": "Tỉnh Thái Nguyên",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": "Tổ chức trong năm 2027 theo kế hoạch cụ thể của cơ quan chủ trì."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-80-nam-tac-pham-sua-doi-loi-lam-viec",
      "name": "80 năm tác phẩm Sửa đổi lối làm việc của Chủ tịch Hồ Chí Minh",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "year_round",
      "is_fixed_date": false,
      "solar_date": null,
      "lunar_date": null,
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1947,
        "anniversary_years": 80,
        "organization_level": "ministry_sector",
        "host_agency": "Ban Tuyên giáo Trung ương hướng dẫn",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": "Tổ chức trong năm 2027."
      },
      "solar_term_details": null
    },
    {
      "id": "vn-2027-950-nam-chien-thang-song-nhu-nguyet",
      "name": "950 năm Chiến thắng trên sông Như Nguyệt và bài thơ Nam Quốc Sơn Hà",
      "category": "anniversary_milestone_2027",
      "secondary_categories": [],
      "calendar_basis": "year_round",
      "is_fixed_date": false,
      "solar_date": null,
      "lunar_date": null,
      "holiday_policy": {
        "is_public_holiday": false,
        "statutory_paid_days": 0,
        "civil_service_schedule": null
      },
      "event_details": {
        "origin_year": 1077,
        "anniversary_years": 950,
        "organization_level": "national",
        "host_agency": "Tỉnh Bắc Ninh",
        "legal_basis": "Danh mục các ngày lễ lớn và sự kiện lịch sử quan trọng giai đoạn 2026–2030 (Kết luận 91)",
        "notes": "Tổ chức trong năm 2027 theo kế hoạch cụ thể của cơ quan chủ trì."
      },
      "solar_term_details": null
    }
  ]
}