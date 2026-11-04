# SCSS FOLDER

## main.scss

```scss
// ==========================================================================
// 1. ABSTRACTS (Không tạo ra CSS - Phải đặt trên cùng để các tầng dưới sử dụng)
@use "./abstracts";

// ==========================================================================
// 2. VENDORS (CSS từ bên thứ ba - Nạp sớm để dễ dàng ghi đè nếu cần)
@use "./vendors";

// ==========================================================================
// 3. BASE (Reset và cài đặt mặc định cho các thẻ HTML)
@use "./base";

// ==========================================================================
// 4. LAYOUT (Khung sườn, bố cục lớn của toàn trang)
@use "./layout";

// ==========================================================================
// 5. COMPONENTS (Các thành phần UI nhỏ, có tính tái sử dụng cao)
@use "./components";

// ==========================================================================
// 6. PAGES (CSS đặc thù, cấu trúc riêng cho từng trang cụ thể)
@use "./pages";

// ==========================================================================
// 7. THEMES (Cấu hình thay đổi giao diện theo chủ đề như Dark/Light mode)
@use "./themes";
```

## abstracts folder

### index.scss

```scss
// 1. Cấu hình lõi (Variables & Theme)
// @forward "resets";
@forward "variables";
@forward "palette";
@forward "theme-engine";

// 2. Các hàm và Mixins
@forward "mixins";

// 3. Typo & Placeholders
// @forward "placeholder"; // đã xé lẻ thành các file riêng biệt như css-grid, flex-box, positioning, images, animations
@forward "typography";

// 4. Các Abstract hỗ trợ layout & UI (Thứ tự nhóm này có thể linh hoạt)
@forward "css-grid";
@forward "flex-box";
@forward "positioning";
@forward "images";
@forward "animations";
```

### variables.scss

```scss
/* ==========================================================================
   BIẾN HỆ THỐNG TOÀN CỤC (GLOBAL VARIABLES)
   Mọi tham số thiết kế lõi phải được định nghĩa tại đây.
   Sử dụng cờ !default để cho phép ghi đè trong môi trường module hóa,
   bảo vệ mã nguồn khỏi các xung đột khi tích hợp giao diện (theming).
   ========================================================================== */

// 1. TYPOGRAPHY (Kiểu Chữ)
// Khai báo các giá trị nền tảng thay thế cho các chuỗi hardcoded trong _base.scss
// --------------------------------------------------------------------------
$base-font-size: 62.5% !default; // Thiết lập 1rem = 10px
$body-font-size: 1.6rem !default;
$body-font-family:
    Plus Jakarta Sans,
    sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue" !default;

// 2. GRID SYSTEM (Hệ Thống Lưới & Điểm Ngắt)
// Tổng hợp từ _grid.scss, _utils.scss và _mixins.scss
// --------------------------------------------------------------------------
// Điểm ngắt cho Media Queries (Breakpoint dictionary)
$grid-breakpoints: (
    xxl: 1400px,
    xl: 1200px,
    lg: 992px,
    md: 768px,
    sm: 576px,
) !default;

// Chiều rộng tối đa của container theo từng điểm ngắt
$container-max-widths: (
    xxl: 1140px,
    xl: 960px,
    lg: 720px,
    md: 540px,
    sm: 100%,
) !default;

// Tham số cấu trúc lưới và kích thước thành phần
$grid-columns: 12 !default;
$grid-gutter-width: 30px !default;
$container-max-width-custom: 1370px !default;
$container-padding-sm: 20px !default;

// Các hệ số nhân của khoảng cách (Gutters ratio map)
$gutters: (
    0: 0,
    1: 0.25,
    2: 0.5,
    3: 1,
    4: 1.5,
    5: 3,
) !default;

// 3. UTILITIES (Tiện Ích Hiển Thị)
// Tham số điều khiển từ _utils.scss
// --------------------------------------------------------------------------
// Các giá trị của thuộc tính display được hỗ trợ để tự động sinh class (.d-flex, .d-block...)

// 4. COLORS (Màu Sắc Mặc Định - Trạng thái chưa chọn Ngũ Hành)
// Các giá trị nguyên thủy (Raw hex) dùng để cấp cho :root
// --------------------------------------------------------------------------

// Giao diện Light Mode (Mặc định)
$color-bg-main-light: #ffffff !default;
$color-bg-surface-light: #f3f4f6 !default; // Xám nhạt
$color-text-main-light: #1f2937 !default; // Đen/Xám đậm
$color-text-muted-light: #6b7280 !default;
$color-primary-light: #3b82f6 !default; // Xanh dương

// Giao diện Dark Mode
$color-bg-main-dark: #111827 !default;
$color-bg-surface-dark: #1f2937 !default;
$color-text-main-dark: #f9fafb !default; // Trắng/Xám sáng
$color-text-muted-dark: #9ca3af !default;
$color-primary-dark: #60a5fa !default;

$theme-transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    fill 0.3s ease;

// 5. DISPLAY VALUES (Giá Trị Hiển Thị)
$display-values: block, flex, grid, none !default;

// Kích thước & Vị trí Header
$header-top-offset: 30px !default;
$header-height-mobile: 60px !default;
$header-height-pc: 100px !default;

// Khoảng cách (Gap / Margin) giữa các khối (Blocks/Sections)
$gap-header-main: 30px !default; // Gap từ Header xuống Main
$gap-section-default: 60px !default; // Gap chuẩn giữa các section (như bài toán flex-direction: column ban nãy)
```

### palette.scss

```scss
$feng-shui-themes: (
    // ----------------------------------------
    // 1. MỆNH KIM (METAL)
    // ----------------------------------------
    "metal": (
            "primary": (
                100: #fef9c3,
                200: #fef08a,
                300: #fde047,
                400: #facc15,
                500: #eab308,
                600: #ca8a04,
                700: #a16207,
                800: #854d0e,
                900: #713f12,
            ),
            // Vàng kim
            "secondary": (
                    100: #fef3c7,
                    200: #fde68a,
                    300: #fcd34d,
                    400: #fbbf24,
                    500: #f59e0b,
                    600: #d97706,
                    700: #b45309,
                    800: #92400e,
                    900: #78350f,
                ),
            // Nâu đất (Thổ sinh Kim)
            "neutral": (
                    100: #f8fafc,
                    200: #f1f5f9,
                    300: #e2e8f0,
                    400: #cbd5e1,
                    500: #94a3b8,
                    600: #64748b,
                    700: #475569,
                    800: #334155,
                    900: #0f172a,
                ),
            // Xám bạc
            "accent": (
                    100: #f3f4f6,
                    200: #e5e7eb,
                    300: #d1d5db,
                    400: #9ca3af,
                    500: #6b7280,
                    600: #4b5563,
                    700: #374151,
                    800: #1f2937,
                    900: #111827,
                ),
            // Khói đậm
            "muted": (
                    100: #fafafa,
                    200: #f4f4f5,
                    300: #e4e4e7,
                    400: #d4d4d8,
                    500: #a1a1aa,
                    600: #71717a,
                    700: #52525b,
                    800: #3f3f46,
                    900: #27272a,
                ),
            // Kẽm nhạt
            "success": (
                    100: #dcfce7,
                    200: #bbf7d0,
                    300: #86efac,
                    400: #4ade80,
                    500: #22c55e,
                    600: #16a34a,
                    700: #15803d,
                    800: #166534,
                    900: #14532d,
                ),
            "warning": (
                100: #fef9c3,
                200: #fef08a,
                300: #fde047,
                400: #facc15,
                500: #eab308,
                600: #ca8a04,
                700: #a16207,
                800: #854d0e,
                900: #713f12,
            ),
            "danger": (
                100: #fee2e2,
                200: #fecaca,
                300: #fca5a5,
                400: #f87171,
                500: #ef4444,
                600: #dc2626,
                700: #b91c1c,
                800: #991b1b,
                900: #7f1d1d,
            ),
            "info": (
                100: #e0f2fe,
                200: #bae6fd,
                300: #7dd3fc,
                400: #38bdf8,
                500: #0ea5e9,
                600: #0284c7,
                700: #0369a1,
                800: #075985,
                900: #0c4a6e,
            ),
        ),

    // ----------------------------------------
    // 2. MỆNH MỘC (WOOD)
    // ----------------------------------------
    "wood": (
            "primary": (
                100: #d1fae5,
                200: #a7f3d0,
                300: #6ee7b7,
                400: #34d399,
                500: #10b981,
                600: #059669,
                700: #047857,
                800: #065f46,
                900: #064e3b,
            ),
            // Xanh lá
            "secondary": (
                    100: #dbeafe,
                    200: #bfdbfe,
                    300: #93c5fd,
                    400: #60a5fa,
                    500: #3b82f6,
                    600: #2563eb,
                    700: #1d4ed8,
                    800: #1e40af,
                    900: #1e3a8a,
                ),
            // Xanh dương (Thủy sinh Mộc)
            "neutral": (
                    100: #f3f4f6,
                    200: #e5e7eb,
                    300: #d1d5db,
                    400: #9ca3af,
                    500: #6b7280,
                    600: #4b5563,
                    700: #374151,
                    800: #1f2937,
                    900: #111827,
                ),
            // Xám tro
            "accent": (
                    100: #ecfdf5,
                    200: #d1fae5,
                    300: #a7f3d0,
                    400: #6ee7b7,
                    500: #34d399,
                    600: #10b981,
                    700: #059669,
                    800: #047857,
                    900: #064e3b,
                ),
            // Xanh ngọc
            "muted": (
                    100: #f8fafc,
                    200: #f1f5f9,
                    300: #e2e8f0,
                    400: #cbd5e1,
                    500: #94a3b8,
                    600: #64748b,
                    700: #475569,
                    800: #334155,
                    900: #0f172a,
                ),
            // Xám xanh
            "success": (
                    100: #dcfce7,
                    200: #bbf7d0,
                    300: #86efac,
                    400: #4ade80,
                    500: #22c55e,
                    600: #16a34a,
                    700: #15803d,
                    800: #166534,
                    900: #14532d,
                ),
            "warning": (
                100: #fef9c3,
                200: #fef08a,
                300: #fde047,
                400: #facc15,
                500: #eab308,
                600: #ca8a04,
                700: #a16207,
                800: #854d0e,
                900: #713f12,
            ),
            "danger": (
                100: #fee2e2,
                200: #fecaca,
                300: #fca5a5,
                400: #f87171,
                500: #ef4444,
                600: #dc2626,
                700: #b91c1c,
                800: #991b1b,
                900: #7f1d1d,
            ),
            "info": (
                100: #e0f2fe,
                200: #bae6fd,
                300: #7dd3fc,
                400: #38bdf8,
                500: #0ea5e9,
                600: #0284c7,
                700: #0369a1,
                800: #075985,
                900: #0c4a6e,
            ),
        ),

    // ----------------------------------------
    // 3. MỆNH THỦY (WATER)
    // ----------------------------------------
    "water": (
            "primary": (
                100: #dbeafe,
                200: #bfdbfe,
                300: #93c5fd,
                400: #60a5fa,
                500: #3b82f6,
                600: #2563eb,
                700: #1d4ed8,
                800: #1e40af,
                900: #1e3a8a,
            ),
            // Xanh dương
            "secondary": (
                    100: #f8fafc,
                    200: #f1f5f9,
                    300: #e2e8f0,
                    400: #cbd5e1,
                    500: #94a3b8,
                    600: #64748b,
                    700: #475569,
                    800: #334155,
                    900: #0f172a,
                ),
            // Xám bạc (Kim sinh Thủy)
            "neutral": (
                    100: #fafafa,
                    200: #f4f4f5,
                    300: #e4e4e7,
                    400: #d4d4d8,
                    500: #a1a1aa,
                    600: #71717a,
                    700: #52525b,
                    800: #3f3f46,
                    900: #27272a,
                ),
            // Kẽm
            "accent": (
                    100: #e0f2fe,
                    200: #bae6fd,
                    300: #7dd3fc,
                    400: #38bdf8,
                    500: #0ea5e9,
                    600: #0284c7,
                    700: #0369a1,
                    800: #075985,
                    900: #0c4a6e,
                ),
            // Xanh lơ
            "muted": (
                    100: #f3f4f6,
                    200: #e5e7eb,
                    300: #d1d5db,
                    400: #9ca3af,
                    500: #6b7280,
                    600: #4b5563,
                    700: #374151,
                    800: #1f2937,
                    900: #111827,
                ),
            // Khói
            "success": (
                    100: #dcfce7,
                    200: #bbf7d0,
                    300: #86efac,
                    400: #4ade80,
                    500: #22c55e,
                    600: #16a34a,
                    700: #15803d,
                    800: #166534,
                    900: #14532d,
                ),
            "warning": (
                100: #fef9c3,
                200: #fef08a,
                300: #fde047,
                400: #facc15,
                500: #eab308,
                600: #ca8a04,
                700: #a16207,
                800: #854d0e,
                900: #713f12,
            ),
            "danger": (
                100: #fee2e2,
                200: #fecaca,
                300: #fca5a5,
                400: #f87171,
                500: #ef4444,
                600: #dc2626,
                700: #b91c1c,
                800: #991b1b,
                900: #7f1d1d,
            ),
            "info": (
                100: #e0f2fe,
                200: #bae6fd,
                300: #7dd3fc,
                400: #38bdf8,
                500: #0ea5e9,
                600: #0284c7,
                700: #0369a1,
                800: #075985,
                900: #0c4a6e,
            ),
        ),

    // ----------------------------------------
    // 4. MỆNH HỎA (FIRE)
    // ----------------------------------------
    "fire": (
            "primary": (
                100: #fee2e2,
                200: #fecaca,
                300: #fca5a5,
                400: #f87171,
                500: #ef4444,
                600: #dc2626,
                700: #b91c1c,
                800: #991b1b,
                900: #7f1d1d,
            ),
            // Đỏ
            "secondary": (
                    100: #d1fae5,
                    200: #a7f3d0,
                    300: #6ee7b7,
                    400: #34d399,
                    500: #10b981,
                    600: #059669,
                    700: #047857,
                    800: #065f46,
                    900: #064e3b,
                ),
            // Xanh lá (Mộc sinh Hỏa)
            "neutral": (
                    100: #f5f5f4,
                    200: #e7e5e4,
                    300: #d6d3d1,
                    400: #a8a29e,
                    500: #78716c,
                    600: #57534e,
                    700: #44403c,
                    800: #292524,
                    900: #1c1917,
                ),
            // Đá ấm
            "accent": (
                    100: #ffedd5,
                    200: #fed7aa,
                    300: #fdba74,
                    400: #fb923c,
                    500: #f97316,
                    600: #ea580c,
                    700: #c2410c,
                    800: #9a3412,
                    900: #7c2d12,
                ),
            // Cam
            "muted": (
                    100: #fafafa,
                    200: #f4f4f5,
                    300: #e4e4e7,
                    400: #d4d4d8,
                    500: #a1a1aa,
                    600: #71717a,
                    700: #52525b,
                    800: #3f3f46,
                    900: #27272a,
                ),
            // Kẽm
            "success": (
                    100: #dcfce7,
                    200: #bbf7d0,
                    300: #86efac,
                    400: #4ade80,
                    500: #22c55e,
                    600: #16a34a,
                    700: #15803d,
                    800: #166534,
                    900: #14532d,
                ),
            "warning": (
                100: #fef9c3,
                200: #fef08a,
                300: #fde047,
                400: #facc15,
                500: #eab308,
                600: #ca8a04,
                700: #a16207,
                800: #854d0e,
                900: #713f12,
            ),
            "danger": (
                100: #fee2e2,
                200: #fecaca,
                300: #fca5a5,
                400: #f87171,
                500: #ef4444,
                600: #dc2626,
                700: #b91c1c,
                800: #991b1b,
                900: #7f1d1d,
            ),
            "info": (
                100: #e0f2fe,
                200: #bae6fd,
                300: #7dd3fc,
                400: #38bdf8,
                500: #0ea5e9,
                600: #0284c7,
                700: #0369a1,
                800: #075985,
                900: #0c4a6e,
            ),
        ),

    // ----------------------------------------
    // 5. MỆNH THỔ (EARTH)
    // ----------------------------------------
    "earth": (
            "primary": (
                100: #fef3c7,
                200: #fde68a,
                300: #fcd34d,
                400: #fbbf24,
                500: #f59e0b,
                600: #d97706,
                700: #b45309,
                800: #92400e,
                900: #78350f,
            ),
            // Nâu/Cam đất
            "secondary": (
                    100: #fee2e2,
                    200: #fecaca,
                    300: #fca5a5,
                    400: #f87171,
                    500: #ef4444,
                    600: #dc2626,
                    700: #b91c1c,
                    800: #991b1b,
                    900: #7f1d1d,
                ),
            // Đỏ (Hỏa sinh Thổ)
            "neutral": (
                    100: #f5f5f4,
                    200: #e7e5e4,
                    300: #d6d3d1,
                    400: #a8a29e,
                    500: #78716c,
                    600: #57534e,
                    700: #44403c,
                    800: #292524,
                    900: #1c1917,
                ),
            // Đá ấm
            "accent": (
                    100: #fef9c3,
                    200: #fef08a,
                    300: #fde047,
                    400: #facc15,
                    500: #eab308,
                    600: #ca8a04,
                    700: #a16207,
                    800: #854d0e,
                    900: #713f12,
                ),
            // Vàng cát
            "muted": (
                    100: #f3f4f6,
                    200: #e5e7eb,
                    300: #d1d5db,
                    400: #9ca3af,
                    500: #6b7280,
                    600: #4b5563,
                    700: #374151,
                    800: #1f2937,
                    900: #111827,
                ),
            // Khói đậm
            "success": (
                    100: #dcfce7,
                    200: #bbf7d0,
                    300: #86efac,
                    400: #4ade80,
                    500: #22c55e,
                    600: #16a34a,
                    700: #15803d,
                    800: #166534,
                    900: #14532d,
                ),
            "warning": (
                100: #fef9c3,
                200: #fef08a,
                300: #fde047,
                400: #facc15,
                500: #eab308,
                600: #ca8a04,
                700: #a16207,
                800: #854d0e,
                900: #713f12,
            ),
            "danger": (
                100: #fee2e2,
                200: #fecaca,
                300: #fca5a5,
                400: #f87171,
                500: #ef4444,
                600: #dc2626,
                700: #b91c1c,
                800: #991b1b,
                900: #7f1d1d,
            ),
            "info": (
                100: #e0f2fe,
                200: #bae6fd,
                300: #7dd3fc,
                400: #38bdf8,
                500: #0ea5e9,
                600: #0284c7,
                700: #0369a1,
                800: #075985,
                900: #0c4a6e,
            ),
        )
);
```

### theme-engine.scss

```scss
// scss/abstracts/_theme-engine.scss
@use "sass:map";
@use "palette" as pal;

// 1. ĐÃ THÊM CÔNG TẮC: $is-default: false
@mixin generate-theme($element-name, $is-default: false) {
    $theme-data: map.get(pal.$feng-shui-themes, $element-name);

    @if $theme-data == null {
        @error "Lỗi: Không tìm thấy dữ liệu cho bản mệnh '#{$element-name}'";
    }

    // 2. ĐÃ THÊM BỘ DÒ ĐƯỜNG: Sinh ra :root nếu là theme mặc định
    // $selector: if($is-default, ":root, [data-theme='#{$element-name}']", "[data-theme='#{$element-name}']");
    $selector: if(
        sass($is-default): ":root, [data-theme='#{$element-name}']" ; else: "[data-theme='#{$element-name}']",
    );

    // 3. Gọi $selector thay vì ghi cứng [data-theme]
    #{$selector} {
        /* 1. NHÓM NỀN & CHỮ */
        --body-bg: #{map.get($theme-data, "neutral", 100)};
        --bg-surface: #{map.get($theme-data, "neutral", 200)};
        --text-color: #{map.get($theme-data, "neutral", 800)};
        --text-muted: #{map.get($theme-data, "neutral", 500)};
        --border-color: #{map.get($theme-data, "neutral", 300)};

        --primary-color: #{map.get($theme-data, "primary", 500)};
        --secondary-color: #{map.get($theme-data, "secondary", 500)};
        --accent-color: #{map.get($theme-data, "accent", 500)};

        --primary-hover: #{map.get($theme-data, "primary", 600)};
        --primary-active: #{map.get($theme-data, "primary", 700)};
        --focus-ring-color: var(--primary-color);
        --bg-disabled: #{map.get($theme-data, "neutral", 200)};
        --text-disabled: #{map.get($theme-data, "neutral", 400)};

        /* 2. NHÓM TRẠNG THÁI (Báo lỗi, Thành công, Cảnh báo) */
        --color-success: #{map.get($theme-data, "success", 500)};
        --color-warning: #{map.get($theme-data, "warning", 500)};
        --color-danger: #{map.get($theme-data, "danger", 500)};
        --color-info: #{map.get($theme-data, "info", 500)};

        /* 3. NHÓM TƯƠNG TÁC (Hover, Active, Disabled cho Button/Link) */
        --primary-hover: #{map.get($theme-data, "primary", 600)};
        --primary-active: #{map.get($theme-data, "primary", 700)};
        --focus-ring-color: var(--primary-color);
        --bg-disabled: #{map.get($theme-data, "neutral", 200)};
        --text-disabled: #{map.get($theme-data, "neutral", 400)};

        /* 4. NHÓM THÀNH PHẦN KHÁC (Icon, Đổ bóng, Lớp phủ Modal) */
        --icon-color: var(--text-muted);
        --icon-hover: var(--primary-color);
        --shadow-color: rgba(0, 0, 0, 0.1);
        --overlay-bg: rgba(0, 0, 0, 0.4);

        /* =========================================================
           CHẾ ĐỘ TỐI (DARK MODE) 
           ========================================================= */
        @media (prefers-color-scheme: dark) {
            /* 1. Nhóm Nền & Chữ */
            --body-bg: #{map.get($theme-data, "primary", 900)};
            --bg-surface: #{map.get($theme-data, "primary", 800)};
            --text-color: #{map.get($theme-data, "neutral", 100)};
            --text-muted: #{map.get($theme-data, "neutral", 300)};
            --border-color: #{map.get($theme-data, "primary", 700)};

            --primary-color: #{map.get($theme-data, "primary", 500)};
            --secondary-color: #{map.get($theme-data, "secondary", 400)};
            --accent-color: #{map.get($theme-data, "accent", 400)};

            /* 2. Nhóm Trạng thái */
            --color-success: #{map.get($theme-data, "success", 400)};
            --color-warning: #{map.get($theme-data, "warning", 400)};
            --color-danger: #{map.get($theme-data, "danger", 400)};
            --color-info: #{map.get($theme-data, "info", 400)};

            /* 3. Nhóm Tương tác */
            --primary-hover: #{map.get($theme-data, "primary", 400)};
            --primary-active: #{map.get($theme-data, "primary", 300)};
            --bg-disabled: #{map.get($theme-data, "neutral", 800)};
            --text-disabled: #{map.get($theme-data, "neutral", 600)};

            /* 4. Nhóm Thành phần khác */
            --shadow-color: rgba(0, 0, 0, 0.5);
            --overlay-bg: rgba(0, 0, 0, 0.7);
        }
    }
}
```

### mixins.scss

```scss
// scscss/abstracts/_mixins.scss
@use "sass:map";
@use "sass:math";
@use "sass:string";
@use "variables" as vars;

// 1. Mixin để xử lý Media Query (Dùng cho @content)
@mixin screen($key) {
    $breakpoint: map.get(vars.$grid-breakpoints, $key);

    @if ($breakpoint == 0) {
        @content;
    } @else {
        @media (max-width: ($breakpoint - 0.02px)) {
            @content;
        }
    }
}

// 2. Function để tạo chuỗi infix (Dùng để tạo class: .col-sm-12)
// Function trả về giá trị, Mixin thực hiện hành động.
@function get-infix($key) {
    $breakpoint: map.get(vars.$grid-breakpoints, $key);

    // Kiểm tra: Nếu breakpoint tồn tại và khác 0, trả về "-key", ngược lại trả về ""
    @if $breakpoint != null and $breakpoint != 0 {
        @return string.unquote("-" + $key);
    } @else {
        @return "";
    }
}
```

### typography.scss

```scss
// abstracts/placeholders/_typography.scss

// ==========================================
// TYPOGRAPHY & TEXT TRUNCATION
// ==========================================

// Cắt chữ hiển thị dấu 3 chấm nếu quá dài (1 dòng)
%textEllipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

// Cắt chữ 3 chấm an toàn bên trong Flex Container
// (Bắt buộc phải có min-width: 0 để chống vỡ layout)
%textEllipsisFlex {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

// Cắt chữ 2 dòng (Thường dùng cho Tiêu đề bài viết / Tên component)
%textClamp2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

// Cắt chữ 3 dòng (Thường dùng cho Đoạn mô tả / Trích dẫn ngắn)
%textClamp3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

// Cắt chữ 4 dòng (Dùng cho các khối nội dung rộng hơn)
%textClamp4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

// ==========================================
// TEXT BEHAVIORS (Hành vi văn bản)
// ==========================================

// Ép buộc ngắt dòng khi gặp chuỗi ký tự quá dài (như URL)
%textBreak {
    word-break: break-word;
    overflow-wrap: break-word;
}

// Ngăn chặn rớt dòng trong mọi trường hợp (Dùng cho Badge, Tag)
%textNoWrap {
    white-space: nowrap;
}

// Xóa khoảng cách thừa của đoạn văn cuối cùng trong một khối
%textNoMarginBottom {
    > *:last-child {
        margin-bottom: 0;
    }
}

// ==========================================
// ACCESSIBILITY & SEO
// ==========================================

// Ẩn phần tử UI nhưng không làm mất khỏi trình đọc màn hình (Tốt cho SEO / Accessibility)
// Dùng cho label của ô input search nếu thiết kế chỉ có icon mà không có text hiển thị
%srOnly {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

### css-grid.scss

```scss
// abstracts/placeholders/_css-grid.scss

// ==========================================
// 1. CSS GRID CONTAINERS (Kích hoạt & Bố cục)
// ==========================================

// Kích hoạt Grid
%grid {
    display: grid;
}

// Căn giữa tuyệt đối mọi thứ CHỈ VỚI 2 DÒNG
%gridCenter {
    display: grid;
    place-items: center;
}

// Chia cột đều nhau (Equal Columns)
%gridCols2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
%gridCols3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
%gridCols4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
%gridCols5 {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
}

// Lưới Tự Động Responsive (Tự rớt dòng không cần Media Query)
%gridAutoSm {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
%gridAutoMd {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
%gridAutoLg {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

// ==========================================
// 2. MACRO LAYOUTS (Bố cục Tổng thể)
// ==========================================

// Layout có Sidebar cố định bên trái (250px), nội dung bên phải tự co giãn
%gridSidebarLeft {
    display: grid;
    grid-template-columns: 250px 1fr;
}

// Layout có Sidebar cố định bên phải (250px), nội dung bên trái tự co giãn
%gridSidebarRight {
    display: grid;
    grid-template-columns: 1fr 250px;
}

// Layout Sidebar tự động ôm nội dung, phần còn lại co giãn
%gridSidebarAuto {
    display: grid;
    grid-template-columns: auto 1fr;
}

// Cấu trúc Kinh điển: Header - Main - Footer (Main luôn đẩy Footer xuống đáy)
%gridHolyGrail {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

// ==========================================
// 3. GRID ITEMS (Dành cho thẻ con trong Lưới)
// ==========================================

// Phóng to phần tử con chiếm toàn bộ chiều ngang của Grid
%gridColFull {
    grid-column: 1 / -1;
}

// Chiếm nhiều cột
%gridColSpan2 {
    grid-column: span 2;
}
%gridColSpan3 {
    grid-column: span 3;
}

// Chiếm nhiều hàng dọc
%gridRowSpan2 {
    grid-row: span 2;
}
%gridRowSpan3 {
    grid-row: span 3;
}
```

### flex-box.scss

```scss
// abstracts/placeholders/_flex-box.scss

// 1. FLEXBOX CONTAINERS (Dành cho thẻ cha)

// Flex căn giữa cả 2 chiều
%flexCenter {
    display: flex;
    align-items: center;
    justify-content: center;
}

// Căn giữa an toàn (Chống mất chữ khi cuộn trên màn hình nhỏ)
%flexCenterSafe {
    display: flex;
    justify-content: safe center;
    align-items: safe center;
}

// Chỉ căn giữa trục dọc (Đẩy sang lề phải)
%flexYCenterRight {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

// Chỉ căn giữa trục dọc (Giữ nguyên lề trái)
%flexYCenterLeft {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

// Căn góc trên / dưới
%flexTopLeft {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}
%flexTopCenter {
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
%flexTopRight {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}
%flexBottomLeft {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
}
%flexBottomCenter {
    display: flex;
    align-items: flex-end;
    justify-content: center;
}
%flexBottomRight {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}

// Xếp cột dọc
%flexColumn {
    display: flex;
    flex-direction: column;
}

// Xếp cột dọc và căn giữa theo trục dọc
%flexColumnCenter {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

// Xếp cột dọc và căn giữa tuyệt đối cả 2 trục
%flexColumnCenterAll {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

// Flex chỉ căn giữa trục dọc (thường dùng cho các item xếp ngang)
%flexItemCenter {
    display: flex;
    align-items: center;
}

// Căn giữa trục dọc, đẩy 2 bên ra xa (Thường dùng cho Header, Navbar)
%flexBetween {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

// Dàn đều 2 bên, các thẻ con dãn hết chiều cao
%flexBetweenStretch {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
}

// Dàn đều xung quanh
%flexAround {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

%flexEvenly {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

// Xếp cột dọc, nằm sát trên, căn giữa ngang
%flexColTopCenter {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

// Xếp cột dọc, các thẻ con tự dãn hết chiều ngang
%flexColStretch {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}

// List rớt dòng lề trái, item dãn chiều dọc (Card list)
%flexWrapStart {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
}

// Wrap kết hợp khoảng cách (Tags, Chips)
%flexWrapGap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; // Thay bằng var(--gap) hoặc biến $gap nếu có
    align-items: center;
}

// Nút bấm có Icon (Inline flex)
%inlineFlexCenter {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
}

// Đảo ngược
%flexRowReverse {
    display: flex;
    flex-direction: row-reverse;
}
%flexColReverse {
    display: flex;
    flex-direction: column-reverse;
}

// Khung cuộn ngang (Carousel)
%flexScrollX {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

// Khung cuộn dọc (Chat, list dài)
%flexScrollY {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-y: auto;
    overflow-x: hidden;
}

// 2. FLEXBOX ITEMS (Dành riêng cho thẻ con)
// Nuốt trọn không gian trống (Dùng cho nội dung chính)
%flexItemFluid {
    flex: 1 1 0%;
    min-width: 0; // Chống tràn text vỡ layout
}

// Co giãn tự nhiên theo chữ
%flexItemAuto {
    flex: 1 1 auto;
    min-width: 0;
}

// Cố định kích thước, cấm bóp méo (Avatar, Icon)
%flexItemFixed {
    flex: 0 0 auto;
}

// Vũ khí Margin Auto trong Flex
%flexPushRight {
    margin-left: auto;
} // Đẩy dạt sang phải

%flexPushBottom {
    margin-top: auto;
} // Đẩy cắm xuống đáy

// Lưới giả (Fake Grid) dành cho thẻ con (Đi kèm thẻ cha %flexWrapStart)
%flexCol50 {
    flex: 0 0 50%;
    max-width: 50%;
}
%flexCol33 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
}
%flexCol25 {
    flex: 0 0 25%;
    max-width: 25%;
}
```

### positioning.scss

```scss
// abstracts/placeholders/_position.scss

// ==========================================
// POSITIONING PLACEHOLDERS
// ==========================================

// 1. CĂN GIỮA TUYỆT ĐỐI
// Căn giữa 2 trục (Modal, Popup, Icon giữa khung hình)
%absCenter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

// Căn giữa dọc (Icon input, Nút mũi tên Slider)
%absCenterY {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

// Căn giữa ngang (Tooltip, Badge nổi)
%absCenterX {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

// 2. PHỦ KÍN KHÔNG GIAN (COVER)
// Phủ kín phần tử cha (Overlay hình ảnh, Lớp phủ thẻ)
%absCover {
    position: absolute;
    inset: 0;
}

// Phủ kín toàn bộ màn hình trình duyệt (Modal Backdrop, Loading Screen)
%fixedCover {
    position: fixed;
    inset: 0;
}

// ==========================================
// BỔ SUNG TỪ KINH NGHIỆM THỰC CHIẾN
// ==========================================

// 3. PSEUDO-ELEMENTS (Tiết kiệm code khi viết ::before, ::after)
%absPseudo {
    content: "";
    position: absolute;
    display: block;
}

// 4. STICKY (Cố định khi cuộn)
// Dành cho Header, Table Head, hoặc Sidebar bám dính khi user cuộn trang
%stickyTop {
    position: sticky;
    top: 0;
    z-index: 10;
}
```

### images.scss

```scss
@use "positioning";
// ==========================================
// 5. IMAGES & BACKGROUNDS (Hình ảnh)
// ==========================================

// --- BACKGROUNDS ---
// Hình nền: Phủ kín khung, tự cắt phần thừa, không méo[cite: 3]
%bgCover {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

// Hình nền: Hiển thị trọn vẹn hình ảnh, không cắt xén, căn giữa
%bgContain {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

// Lớp phủ đen mờ trên ảnh nền (Dùng cho Header, Banner có chữ trắng)
%bgOverlay {
    position: relative;
    z-index: 1;

    &::before {
        content: "";
        @extend %absCover; // Kế thừa từ phần POSITIONING
        background-color: rgba(#000, 0.4); // Có thể thay bằng biến $color-black
        z-index: -1;
    }
}

// --- IMAGES ---
// Thẻ <img>: Phủ kín khung cha, tự động cắt phần thừa, không méo
%imgCover {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

// Thẻ <img>: Thu nhỏ để vừa vặn hoàn toàn, không méo, không cắt
%imgContain {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

// Thẻ <img>: Hình ảnh tự động co giãn theo chiều ngang màn hình, không bị vỡ tỷ lệ
%imgResponsive {
    display: block;
    max-width: 100%;
    height: auto;
}
```

### animations.scss

```scss
// scss/abstracts/_animations.scss
// 1. Hiệu ứng Fade-in (Xuất hiện nhẹ nhàng)
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 2. Toàn bộ nội dung chuẩn của scss/abstracts/_animations.scss:

%transTheme {
    transition: var(--theme-transition);
}

%transInteractive {
    transition:
        var(--theme-transition),
        transform 0.2s ease;
}

%transHeaderScroll {
    transition:
        var(--theme-transition),
        box-shadow 0.25s ease,
        border-color 0.25s ease;
}

%transSidebarDrawer {
    transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        var(--theme-transition);
}

%transTooltip {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s ease;
}

%transBurgerBar {
    transition:
        transform 0.25s ease,
        opacity 0.25s ease;
}

%transBackdrop {
    transition:
        opacity 0.25s ease,
        visibility 0.25s ease;
}

%animDropdownFadeIn {
    animation: fadeIn 0.2s ease-out forwards;
}

%animFloat {
    animation: float 3s ease-in-out infinite;
}

%animPulse {
    animation: pulse 2s ease-in-out infinite;
}

%animShake {
    animation: shake 0.35s ease-in-out;
}

// 3. Hiệu ứng Pulse (Nhịp đập - Dùng cho hành Hỏa)
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

// Class sử dụng
.animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-pulse {
    animation: pulse 2s ease-in-out infinite;
}

// scss/abstracts/_animations.scss
// Tuân thủ đúng nguyên tắc main.scss: Tầng Abstracts không tự sinh ra CSS nếu không được @extend/@include

// ==========================================
// 1. TRANSITION PLACEHOLDERS (Chuyển tiếp trạng thái khi tương tác)
// ==========================================

// Chuyển màu mượt theo Theme Ngũ hành (Dùng cho Link, Button, Khung viền)
%transTheme {
    transition: var(--theme-transition);
}

// Chuyển màu Theme kết hợp nhấc nhẹ nút khi Hover (Dùng cho Icon Home, Button Login)
%transInteractive {
    transition:
        var(--theme-transition),
        transform 0.2s ease;
}

// Hiệu ứng đổ bóng và thu gọn chiều cao cho Sticky Header khi cuộn trang
%transHeaderScroll {
    transition:
        var(--theme-transition),
        box-shadow 0.25s ease,
        height 0.25s ease;
}

// Hiệu ứng trượt ngăn kéo Sidebar (Drawer) trên Mobile & đổi màu Theme
%transSidebarDrawer {
    transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        var(--theme-transition);
}

// Hiệu ứng bật/tắt nhãn Tooltip bên phải Icon của Sidebar
%transTooltip {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s ease;
}

// Hiệu ứng xoay 3 thanh ngang của nút Hamburger thành dấu X
%transBurgerBar {
    transition:
        transform 0.25s ease,
        opacity 0.25s ease;
}

// Hiệu ứng ẩn/hiện lớp phủ mờ (Backdrop) khi mở Mobile Menu
%transBackdrop {
    transition:
        opacity 0.25s ease,
        visibility 0.25s ease;
}

// ==========================================
// 2. ANIMATION PLACEHOLDERS (Chạy theo @keyframes từ base/_keyframes.scss)
// ==========================================

// Hiệu ứng xuất hiện mượt cho Dropdown Ngôn ngữ & Theme
%animDropdownFadeIn {
    animation: fadeIn 0.2s ease-out forwards;
}

%animFloat {
    animation: float 3s ease-in-out infinite;
}

%animPulse {
    animation: pulse 2s ease-in-out infinite;
}

%animShake {
    animation: shake 0.35s ease-in-out;
}
```

## base folder

### index.scss

```scss
@forward "./reset";
@forward "./base";
@forward "./grid";
@forward "./utils";
@forward "./keyframes";
```

### reset.scss

```scss
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block;
}
body {
    line-height: 1;
}
ol,
ul {
    list-style: none;
}
blockquote,
q {
    quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
    content: "";
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
```

### base.scss

```scss
/* ==========================================================================
   CSS CƠ SỞ (BASE CSS)
   Cấu trúc reset mặc định và định dạng nền tảng cho tài liệu.
   ========================================================================== */
@use "../abstracts/" as abs;
// @use "../abstracts/variables" as v;
// @use "../abstracts/mixins" as m;
:root {
    /* Lấy chính xác thông số transition từ file variables cũ của bạn */
    --theme-transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, fill 0.3s ease;
}

*,
::after,
::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    // Liên kết với hằng số cơ sở
    font-size: abs.$base-font-size;
}

body {
    // Kế thừa typography từ tệp biến trung tâm
    font-size: abs.$body-font-size;
    font-family: abs.$body-font-family;
    line-height: 1.5; /* Khoảng cách tối thiểu an toàn cho người chứng khó đọc */
    -webkit-font-smoothing: antialiased;
    // Sử dụng CSS Custom Properties cho phép chuyển đổi Theme động
    color: var(--text-color);
    background: var(--body-bg);
    // transition: abs.$theme-transition;
    transition: var(--theme-transition);
}

/* Tối ưu hóa ngắt dòng thông minh (Smart text-wrapping) */
p,
li,
dd {
    text-wrap: pretty; /* Loại bỏ dòng rớt (orphans) cho văn bản dài */
    overflow-wrap: break-word;
}

button {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
}

a,
img,
button,
label,
input,
textarea,
select {
    padding: 0;
    font-family: inherit;
    color: inherit;
    outline: none;
    border: none;
    // Đã khắc phục lỗi cú pháp: sửa --webkit-tab thành chuẩn của Apple
    -webkit-tap-highlight-color: transparent;
}

input,
textarea {
    background: transparent;
}
/* Thay thế các giải pháp JavaScript tính toán chiều cao cuộn */
textarea {
    field-sizing: content;
}

// Xử lý ghi đè CSS autofill của trình duyệt
input:-webkit-autofill,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
input:-webkit-autofill:hover {
    transition: background-color 1s 9999s;
    -webkit-text-fill-color: var(--text-color);
    caret-color: var(--text-color);
}

/* Thiết lập đa phương tiện logic (Tương thích ngôn ngữ RTL/Dọc) */
img,
picture,
video,
canvas,
svg {
    display: block;
    max-inline-size: 100%;
}

/* ĐẢM BẢO KHẢ NĂNG TIẾP CẬN: Quản lý vòng tiêu điểm bàn phím */
:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 4px; /* Đẩy viền ra ngoài để tránh nhiễu loạn thị giác */
}

a {
    color: inherit;
    text-decoration: none;
}

ul,
ol {
    list-style: none;
}

/* Ẩn mũi tên trên Chrome, Safari, Edge và các trình duyệt dựa trên Chromium */
details summary::-webkit-details-marker {
    display: none;
}

/* Ẩn mũi tên trên Firefox */
details summary {
    list-style: none;
    display: flex;
}

.icon {
    // filter: var(--icon-color);
    width: 24px;
    height: 24px;
}

.container {
    // Áp dụng mixin screen và cấu hình khoảng đệm tĩnh
    @include abs.screen(sm) {
        padding-left: abs.$container-padding-sm !important;
        padding-right: abs.$container-padding-sm !important;
    }
}

i,
em {
    font-style: italic;
}

b,
strong {
    font-weight: 600;
}
```

### grid.scss

```scss
// scss/base/_grid.scss
@use "sass:math";
@use "sass:map";
@use "../abstracts" as abs;

// 1. Base Container & Row
.container-fluid {
    --grid-gutter-x: #{abs.$grid-gutter-width};
    --grid-gutter-y: 0;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: calc(var(--grid-gutter-x) * 0.5);
    padding-right: calc(var(--grid-gutter-x) * 0.5);
}

.container {
    @extend .container-fluid;
    max-width: abs.$container-max-width-custom;
    // Max-width sẽ được xử lý trong loop breakpoint
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(var(--grid-gutter-y) * -1);
    margin-left: calc(var(--grid-gutter-x) * -0.5);
    margin-right: calc(var(--grid-gutter-x) * -0.5);

    > * {
        margin-top: var(--grid-gutter-y);
        padding-left: calc(var(--grid-gutter-x) * 0.5);
        padding-right: calc(var(--grid-gutter-x) * 0.5);
    }
}

.col {
    flex: 1 0 0%;
}

// 2. Mixins for generating classes
@mixin make-columns($infix: "") {
    @for $i from 1 through abs.$grid-columns {
        .col#{$infix}-#{$i} {
            flex: 0 0 auto;
            width: math.div(100%, abs.$grid-columns) * $i;
        }
    }
}

@mixin make-offsets($infix: "") {
    @for $i from 0 through abs.$grid-columns {
        .offset#{$infix}-#{$i} {
            margin-left: if(sass($i > 0): math.div(100%, abs.$grid-columns) * $i; else: 0);
        }
    }
}

// 3. Execution
@include make-columns("");
@include make-offsets("");

// 4. Breakpoint Loop (Đã fix để chạy hoàn hảo với mixins)
@each $breakpoint, $dimension in abs.$grid-breakpoints {
    // Desktop-First: Điểm ngắt 0px (xs) không có ý nghĩa với max-width, nên bỏ qua
    @if $dimension != 0 {
        // Đổi "abs.breakpoint" thành "abs.screen" theo đúng file mixins
        @include abs.screen($breakpoint) {
            .container {
                max-width: map.get(abs.$container-max-widths, $breakpoint);
            }

            // Gọi hàm get-infix từ mixins thay vì tự nối chuỗi thủ công
            $infix: abs.get-infix($breakpoint);

            @include make-columns($infix);
            @include make-offsets($infix);

            @each $i, $ratio in abs.$gutters {
                .g#{$infix}-#{$i},
                .gx#{$infix}-#{$i} {
                    --grid-gutter-x: #{abs.$grid-gutter-width * $ratio};
                }
            }
        }
    }
}
```

### utils.scss

```scss
/* ==========================================================================
   TIỆN ÍCH (UTILITIES)
   Tự động sinh các lớp bổ trợ điều khiển hiển thị (display classes).
   ========================================================================== */

@use "../abstracts" as abs;

@mixin make-display($breakpoint: null) {
    // Phân tích nội suy tiền tố một cách an toàn
    $infix: if(
        sass($breakpoint != null): "-#{$breakpoint}" ; else: "",
    );

    @each $display in abs.$display-values {
        .d#{$infix}-#{$display} {
            display: $display !important;
        }
    }
}

// 1. Gọi lớp tiện ích hiển thị cho viewport tiêu chuẩn
@include make-display();

// 2. Khởi tạo các lớp tiện ích tương ứng với từng breakpoint
@each $breakpoint, $dimension in abs.$grid-breakpoints {
    @media (max-width: ($dimension - 0.02px)) {
        @include make-display($breakpoint);
    }
}
```

### keyframes.scss

```scss
// scss/base/_keyframes.scss
// Gom toàn bộ @keyframes từ abstracts/_animations.scss và base/_keyframes.scss về đúng tầng Base

// 1. Hiệu ứng Fade-in (Xuất hiện nhẹ nhàng cho Dropdown Header)
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(1rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 2. Hiệu ứng Float (Nhấp nhô như sóng nước - Dùng cho hành Thủy)
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-1rem);
    }
}

// 3. Hiệu ứng Pulse (Nhịp đập - Dùng cho hành Hỏa)
@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

// 4. Hiệu ứng Shake (Rung cảnh báo lỗi)
@keyframes shake {
    0%,
    100% {
        translate: 0;
    }
    25%,
    75% {
        translate: 0.4rem;
    }
    50% {
        translate: -0.4rem;
    }
}
```

### index.scss

```scss
@forward "./reset";
@forward "./base";
@forward "./grid";
@forward "./utils";
@forward "./keyframes";
```

### reset.scss

```scss
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block;
}
body {
    line-height: 1;
}
ol,
ul {
    list-style: none;
}
blockquote,
q {
    quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
    content: "";
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
```

### base.scss

```scss
/* ==========================================================================
   CSS CƠ SỞ (BASE CSS)
   Cấu trúc reset mặc định và định dạng nền tảng cho tài liệu.
   ========================================================================== */
@use "../abstracts/" as abs;
// @use "../abstracts/variables" as v;
// @use "../abstracts/mixins" as m;
:root {
    /* Lấy chính xác thông số transition từ file variables cũ của bạn */
    --theme-transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, fill 0.3s ease;
}

*,
::after,
::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    // Liên kết với hằng số cơ sở
    font-size: abs.$base-font-size;
}

body {
    // Kế thừa typography từ tệp biến trung tâm
    font-size: abs.$body-font-size;
    font-family: abs.$body-font-family;
    line-height: 1.5; /* Khoảng cách tối thiểu an toàn cho người chứng khó đọc */
    -webkit-font-smoothing: antialiased;
    // Sử dụng CSS Custom Properties cho phép chuyển đổi Theme động
    color: var(--text-color);
    background: var(--body-bg);
    // transition: abs.$theme-transition;
    transition: var(--theme-transition);
}

/* Tối ưu hóa ngắt dòng thông minh (Smart text-wrapping) */
p,
li,
dd {
    text-wrap: pretty; /* Loại bỏ dòng rớt (orphans) cho văn bản dài */
    overflow-wrap: break-word;
}

button {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
}

a,
img,
button,
label,
input,
textarea,
select {
    padding: 0;
    font-family: inherit;
    color: inherit;
    outline: none;
    border: none;
    // Đã khắc phục lỗi cú pháp: sửa --webkit-tab thành chuẩn của Apple
    -webkit-tap-highlight-color: transparent;
}

input,
textarea {
    background: transparent;
}
/* Thay thế các giải pháp JavaScript tính toán chiều cao cuộn */
textarea {
    field-sizing: content;
}

// Xử lý ghi đè CSS autofill của trình duyệt
input:-webkit-autofill,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
input:-webkit-autofill:hover {
    transition: background-color 1s 9999s;
    -webkit-text-fill-color: var(--text-color);
    caret-color: var(--text-color);
}

/* Thiết lập đa phương tiện logic (Tương thích ngôn ngữ RTL/Dọc) */
img,
picture,
video,
canvas,
svg {
    display: block;
    max-inline-size: 100%;
}

/* ĐẢM BẢO KHẢ NĂNG TIẾP CẬN: Quản lý vòng tiêu điểm bàn phím */
:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 4px; /* Đẩy viền ra ngoài để tránh nhiễu loạn thị giác */
}

a {
    color: inherit;
    text-decoration: none;
}

ul,
ol {
    list-style: none;
}

/* Ẩn mũi tên trên Chrome, Safari, Edge và các trình duyệt dựa trên Chromium */
details summary::-webkit-details-marker {
    display: none;
}

/* Ẩn mũi tên trên Firefox */
details summary {
    list-style: none;
    display: flex;
}

.icon {
    // filter: var(--icon-color);
    width: 24px;
    height: 24px;
}

.container {
    // Áp dụng mixin screen và cấu hình khoảng đệm tĩnh
    @include abs.screen(sm) {
        padding-left: abs.$container-padding-sm !important;
        padding-right: abs.$container-padding-sm !important;
    }
}

i,
em {
    font-style: italic;
}

b,
strong {
    font-weight: 600;
}
```

### grid.scss

```scss
// scss/base/_grid.scss
@use "sass:math";
@use "sass:map";
@use "../abstracts" as abs;

// 1. Base Container & Row
.container-fluid {
    --grid-gutter-x: #{abs.$grid-gutter-width};
    --grid-gutter-y: 0;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: calc(var(--grid-gutter-x) * 0.5);
    padding-right: calc(var(--grid-gutter-x) * 0.5);
}

.container {
    @extend .container-fluid;
    max-width: abs.$container-max-width-custom;
    // Max-width sẽ được xử lý trong loop breakpoint
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(var(--grid-gutter-y) * -1);
    margin-left: calc(var(--grid-gutter-x) * -0.5);
    margin-right: calc(var(--grid-gutter-x) * -0.5);

    > * {
        margin-top: var(--grid-gutter-y);
        padding-left: calc(var(--grid-gutter-x) * 0.5);
        padding-right: calc(var(--grid-gutter-x) * 0.5);
    }
}

.col {
    flex: 1 0 0%;
}

// 2. Mixins for generating classes
@mixin make-columns($infix: "") {
    @for $i from 1 through abs.$grid-columns {
        .col#{$infix}-#{$i} {
            flex: 0 0 auto;
            width: math.div(100%, abs.$grid-columns) * $i;
        }
    }
}

@mixin make-offsets($infix: "") {
    @for $i from 0 through abs.$grid-columns {
        .offset#{$infix}-#{$i} {
            margin-left: if(sass($i > 0): math.div(100%, abs.$grid-columns) * $i; else: 0);
        }
    }
}

// 3. Execution
@include make-columns("");
@include make-offsets("");

// 4. Breakpoint Loop (Đã fix để chạy hoàn hảo với mixins)
@each $breakpoint, $dimension in abs.$grid-breakpoints {
    // Desktop-First: Điểm ngắt 0px (xs) không có ý nghĩa với max-width, nên bỏ qua
    @if $dimension != 0 {
        // Đổi "abs.breakpoint" thành "abs.screen" theo đúng file mixins
        @include abs.screen($breakpoint) {
            .container {
                max-width: map.get(abs.$container-max-widths, $breakpoint);
            }

            // Gọi hàm get-infix từ mixins thay vì tự nối chuỗi thủ công
            $infix: abs.get-infix($breakpoint);

            @include make-columns($infix);
            @include make-offsets($infix);

            @each $i, $ratio in abs.$gutters {
                .g#{$infix}-#{$i},
                .gx#{$infix}-#{$i} {
                    --grid-gutter-x: #{abs.$grid-gutter-width * $ratio};
                }
            }
        }
    }
}
```

### utils.scss

```scss
/* ==========================================================================
   TIỆN ÍCH (UTILITIES)
   Tự động sinh các lớp bổ trợ điều khiển hiển thị (display classes).
   ========================================================================== */

@use "../abstracts" as abs;

@mixin make-display($breakpoint: null) {
    // Phân tích nội suy tiền tố một cách an toàn
    $infix: if(
        sass($breakpoint != null): "-#{$breakpoint}" ; else: "",
    );

    @each $display in abs.$display-values {
        .d#{$infix}-#{$display} {
            display: $display !important;
        }
    }
}

// 1. Gọi lớp tiện ích hiển thị cho viewport tiêu chuẩn
@include make-display();

// 2. Khởi tạo các lớp tiện ích tương ứng với từng breakpoint
@each $breakpoint, $dimension in abs.$grid-breakpoints {
    @media (max-width: ($dimension - 0.02px)) {
        @include make-display($breakpoint);
    }
}
```

### keyframes.scss

```scss
// scss/base/_keyframes.scss
// Gom toàn bộ @keyframes từ abstracts/_animations.scss và base/_keyframes.scss về đúng tầng Base

// 1. Hiệu ứng Fade-in (Xuất hiện nhẹ nhàng cho Dropdown Header)
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(1rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 2. Hiệu ứng Float (Nhấp nhô như sóng nước - Dùng cho hành Thủy)
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-1rem);
    }
}

// 3. Hiệu ứng Pulse (Nhịp đập - Dùng cho hành Hỏa)
@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

// 4. Hiệu ứng Shake (Rung cảnh báo lỗi)
@keyframes shake {
    0%,
    100% {
        translate: 0;
    }
    25%,
    75% {
        translate: 0.4rem;
    }
    50% {
        translate: -0.4rem;
    }
}
```

## components folder

### index.scss

```scss
@forward "./button";
@forward "./logo-header";
@forward "./date-time";
```

### button.scss

```scss
// scss/components/_button.scss
@use "../abstracts" as abs;

.btn {
    @extend %inlineFlexCenter;
    gap: 0.8rem;
    font-size: 1.4rem;
    font-weight: 600;
    border-radius: 1.2rem;
    cursor: pointer;
    @extend %textNoWrap;
    @extend %transInteractive;

    &--login {
        height: 4.2rem;
        padding: 0 2rem;
        background-color: var(--primary-color);
        color: #ffffff;

        &:hover {
            background-color: var(--primary-hover);
            transform: translateY(-1px);
        }

        &:active {
            background-color: var(--primary-active);
            transform: translateY(0);
        }

        @include abs.screen(sm) {
            height: 3.8rem;
            padding: 0 1.4rem;
            font-size: 1.3rem;
        }
    }
}
```

### date-time.scss

```scss
// scss/components/_date-time.scss
@use "../abstracts" as abs;

.header__datetime-wrapper {
    @extend %flexItemCenter;
    gap: 1.4rem;
    height: 4.2rem;
    padding: 0 1.6rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 99.9rem;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--text-color);
    @extend %transTheme;
}

.header__date-group,
.header__time-group {
    @extend %flexItemCenter;
    gap: 0.8rem;
    @extend %textNoWrap;
}

.header__time-group {
    padding-left: 1.4rem;
    border-left: 1px solid var(--border-color);
    font-variant-numeric: tabular-nums;
}
```

### logo-header.scss

```scss
// scss/components/_logo-header.scss
@use "../abstracts" as abs;

.header__logo {
    @extend %flexItemFixed;

    &-link {
        @extend %inlineFlexCenter;
    }

    &-img {
        height: 4.2rem;
        width: auto;
        @extend %imgResponsive;

        @include abs.screen(md) {
            height: 3.4rem;
        }
    }
}

// Nút Widget Trigger (Thay thế Icon Home trong đảo Bento trái)
.header__widget {
    @extend %flexItemFixed;
    padding-left: 1.2rem;
    border-left: 1px solid var(--border-color);

    @include abs.screen(sm) {
        padding-left: 0.8rem;
    }

    &-btn {
        @extend %inlineFlexCenter;
        gap: 0.8rem;
        height: 4.2rem;
        padding: 0 1.4rem;
        border-radius: 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--text-color);
        @extend %textNoWrap;
        @extend %transInteractive;

        &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: translateY(-1px);
        }

        &.is-active {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: #ffffff;
        }

        // Desktop-First: Xuống dưới mốc xl (1200px) thu gọn thành nút Icon vuông để tiết kiệm diện tích
        @include abs.screen(xl) {
            width: 4.2rem;
            padding: 0;
        }

        @include abs.screen(sm) {
            width: 3.8rem;
            height: 3.8rem;
        }
    }

    &-icon {
        width: 2rem;
        height: 2rem;
        @extend %flexItemFixed;
    }

    &-label {
        @include abs.screen(xl) {
            display: none;
        }
    }
}
```

## layout folder

### index.scss

```scss
@forward "./header";
@forward "./footer";
@forward "./sidebar";
```

### header.scss

```scss
// scss/layout/_header.scss
@use "../abstracts" as abs;

.header {
    @extend %stickyTop;
    top: abs.$header-top-offset; // Mặc định cách top 30px trên mọi giao diện
    margin-top: abs.$header-top-offset;
    margin-bottom: abs.$gap-header-main;
    z-index: 50;
    height: abs.$header-height-pc;
    background-color: transparent; // Trong suốt để lộ 2 đảo Bento
    border-bottom: none;
    pointer-events: none; // Cho phép click xuyên qua khoảng trống giữa 2 đảo Bento

    // Desktop-First: Thu gọn chiều cao ở màn hình Tablet & Mobile (<= 768px)
    @include abs.screen(md) {
        height: abs.$header-height-mobile;
    }

    &__container {
        @extend %flexBetween;
        height: 100%;
        gap: 2rem;

        @include abs.screen(sm) {
            gap: 1rem;
        }
    }

    // 2 ĐẢO BENTO ĐỘC LẬP (Cụm Trái & Cụm Phải)
    &__left,
    &__right {
        pointer-events: auto; // Bật lại tương tác chuột cho 2 đảo Bento
        @extend %flexItemCenter;
        height: 100%;
        padding: 0 2rem;
        gap: 1.2rem;
        background-color: var(--body-bg);
        border: 1px solid var(--border-color);
        border-radius: 2.4rem;
        box-shadow: 0 0.4rem 1.6rem var(--shadow-color);
        @extend %transHeaderScroll;

        // Desktop-First: Giảm dần khoảng đệm từ Laptop (xl) -> Tablet (md) -> Mobile (sm)
        @include abs.screen(xl) {
            padding: 0 1.6rem;
        }

        @include abs.screen(md) {
            padding: 0 1.2rem;
            border-radius: 1.6rem;
            gap: 1rem;
        }

        @include abs.screen(sm) {
            padding: 0 1rem;
            border-radius: 1.4rem;
            gap: 0.6rem;
        }
    }

    // Khi cuộn trang xuống, 2 đảo Bento tăng độ nổi khối và làm mờ nền kính
    &--scrolled &__left,
    &--scrolled &__right {
        box-shadow: 0 1rem 2.8rem var(--shadow-color);
        border-color: var(--primary-color);
        backdrop-filter: blur(10px);
    }

    &__lang-details,
    &__theme-details {
        position: relative;
    }

    &__lang-summary,
    &__theme-summary {
        @extend %inlineFlexCenter;
        gap: 0.6rem;
        height: 4.2rem;
        padding: 0 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 1.2rem;
        font-size: 1.4rem;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        @extend %transTheme;

        &:hover {
            border-color: var(--primary-color);
        }

        @include abs.screen(sm) {
            height: 3.8rem;
            padding: 0 0.8rem;
        }
    }

    &__lang-arrow {
        width: 1.6rem;
        height: 1.6rem;
        @extend %transBurgerBar;
    }

    &__lang-details[open] &__lang-arrow {
        transform: rotate(180deg);
    }

    &__lang-list,
    &__theme-list {
        position: absolute;
        top: calc(100% + 1rem);
        right: 0;
        z-index: 60;
        min-width: 14rem;
        padding: 0.6rem;
        background-color: var(--body-bg);
        border: 1px solid var(--border-color);
        border-radius: 1.4rem;
        box-shadow: 0 1rem 2.5rem var(--shadow-color);
        @extend %animDropdownFadeIn;
    }

    &__lang-link,
    &__theme-btn {
        @extend %flexYCenterLeft;
        gap: 1rem;
        width: 100%;
        padding: 0.8rem 1.2rem;
        border-radius: 0.8rem;
        font-size: 1.4rem;
        font-weight: 500;
        color: var(--text-color);
        @extend %transTheme;

        &:hover {
            background-color: var(--bg-surface);
            color: var(--primary-color);
        }
    }

    &__lang-link--active,
    &__theme-btn.is-active {
        background-color: var(--bg-surface);
        color: var(--primary-color);
        font-weight: 700;
    }

    // Nút Hamburger chuẩn vùng chạm 44x44px (4.4rem) dưới mốc md (768px)
    &__burger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        width: 4.4rem;
        height: 4.4rem;
        border-radius: 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        @extend %transTheme;

        @include abs.screen(md) {
            display: inline-flex;
        }

        &-bar {
            width: 2rem;
            height: 0.2rem;
            background-color: var(--text-color);
            border-radius: 0.2rem;
            @extend %transBurgerBar;
        }

        &.is-active &-bar:nth-child(1) {
            transform: translateY(0.7rem) rotate(45deg);
        }
        &.is-active &-bar:nth-child(2) {
            opacity: 0;
        }
        &.is-active &-bar:nth-child(3) {
            transform: translateY(-0.7rem) rotate(-45deg);
        }
    }
}
```

### footer.scss

```scss

```

### sidebar.scss

```scss
// scss/layout/_sidebar.scss
@use "../abstracts" as abs;

#sidebar-root {
    display: contents;
}

.sidebar {
    position: fixed;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 40;
    padding: 1rem 0.8rem;
    background-color: var(--body-bg);
    border: 1px solid var(--border-color);
    border-radius: 2rem;
    box-shadow: 0 0.8rem 2.4rem var(--shadow-color);
    @extend %transSidebarDrawer;

    &__list {
        @extend %flexColumn;
        gap: 0.8rem;
    }

    &__link {
        position: relative;
        @extend %flexCenter;
        width: 4.6rem;
        height: 4.6rem;
        border-radius: 1.2rem;
        color: var(--text-muted);
        @extend %transTheme;

        &:hover,
        &:focus-visible {
            background-color: var(--bg-surface);
            color: var(--primary-color);
        }

        // Trạng thái Active nổi bật cho mục hiện tại
        &--active {
            background-color: var(--bg-surface);
            color: var(--primary-color);
            box-shadow: inset 0 0 0 0.2rem var(--primary-color);
        }
    }

    // Nhãn Tooltip nổi bên phải Icon trên PC
    &__tooltip {
        @extend %absCenterY;
        left: calc(100% + 1.4rem);
        transform: translate(-0.8rem, -50%);
        padding: 0.6rem 1.2rem;
        background-color: var(--text-color);
        color: var(--body-bg);
        font-size: 1.3rem;
        font-weight: 600;
        border-radius: 0.8rem;
        @extend %textNoWrap;
        box-shadow: 0 0.4rem 1.2rem var(--shadow-color);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        @extend %transTooltip;

        &::before {
            @extend %absPseudo;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 0.5rem;
            border-style: solid;
            border-color: transparent var(--text-color) transparent transparent;
        }
    }

    &__link:hover &__tooltip,
    &__link:focus-visible &__tooltip {
        opacity: 1;
        visibility: visible;
        transform: translate(0, -50%);
    }

    // Responsive dưới 768px (md): Không dùng @extend bên trong @media để tránh lỗi Sass
    @include abs.screen(md) {
        top: calc(#{abs.$header-top-offset} + #{abs.$header-height-mobile} + 1.5rem);
        left: 1.6rem;
        bottom: 1.6rem;
        width: 26rem;
        transform: translateX(calc(-100% - 3rem));
        border-radius: 2rem;
        padding: 1.6rem;
        z-index: 55;
        overflow-y: auto;

        &.is-open {
            transform: translateX(0);
        }

        &__link {
            // Đã có display: flex và align-items: center từ %flexCenter ở trên, chỉ cần đổi justify-content
            justify-content: flex-start;
            width: 100%;
            height: 4.8rem;
            padding: 0 1.6rem;
            gap: 1.4rem;
        }

        &__tooltip {
            position: static;
            transform: none;
            opacity: 1;
            visibility: visible;
            background-color: transparent;
            color: inherit;
            padding: 0;
            font-size: 1.5rem;
            box-shadow: none;
            pointer-events: auto;

            &::before {
                display: none;
            }
        }
    }
}

.sidebar-backdrop {
    // Đặt @extend ở cấp gốc (ngoài @media) để tuân thủ quy tắc của Dart Sass
    @extend %fixedCover;
    @extend %transBackdrop;
    display: none;
    background-color: var(--overlay-bg);
    backdrop-filter: blur(2px);
    z-index: 45;
    opacity: 0;
    visibility: hidden;

    @include abs.screen(md) {
        display: block;

        &.is-active {
            opacity: 1;
            visibility: visible;
        }
    }
}
```

### index.scss

```scss
@forward "./header";
@forward "./footer";
@forward "./sidebar";
```

### header.scss

```scss
// scss/layout/_header.scss
@use "../abstracts" as abs;

#header-root {
    display: contents;
}

.header {
    @extend %stickyTop;
    z-index: 50;
    height: abs.$header-height-pc;
    background-color: var(--body-bg);
    border-bottom: 1px solid var(--border-color);
    @extend %transHeaderScroll;

    @include abs.screen(md) {
        height: abs.$header-height-mobile;
    }

    &--scrolled {
        box-shadow: 0 0.6rem 2rem var(--shadow-color);
    }

    &__container {
        @extend %flexBetween;
        height: 100%;
        gap: 2rem;
    }

    &__left,
    &__right {
        @extend %flexItemCenter;
        gap: 1.2rem;

        @include abs.screen(sm) {
            gap: 0.8rem;
        }
    }

    &__lang-details,
    &__theme-details {
        position: relative;
    }

    &__lang-summary,
    &__theme-summary {
        @extend %inlineFlexCenter;
        gap: 0.6rem;
        height: 4.2rem;
        padding: 0 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 1.2rem;
        font-size: 1.4rem;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        @extend %transTheme;

        &:hover {
            border-color: var(--primary-color);
        }

        @include abs.screen(sm) {
            height: 3.8rem;
            padding: 0 1rem;
        }
    }

    &__lang-arrow {
        width: 1.6rem;
        height: 1.6rem;
        @extend %transBurgerBar;
    }

    &__lang-details[open] &__lang-arrow {
        transform: rotate(180deg);
    }

    &__lang-list,
    &__theme-list {
        position: absolute;
        top: calc(100% + 0.8rem);
        right: 0;
        z-index: 60;
        min-width: 13.5rem;
        padding: 0.6rem;
        background-color: var(--body-bg);
        border: 1px solid var(--border-color);
        border-radius: 1.2rem;
        box-shadow: 0 1rem 2.5rem var(--shadow-color);
        @extend %animDropdownFadeIn;
    }

    &__lang-link,
    &__theme-btn {
        @extend %flexYCenterLeft;
        gap: 1rem;
        width: 100%;
        padding: 0.8rem 1.2rem;
        border-radius: 0.8rem;
        font-size: 1.4rem;
        font-weight: 500;
        color: var(--text-color);
        @extend %transTheme;

        &:hover {
            background-color: var(--bg-surface);
            color: var(--primary-color);
        }
    }

    &__lang-link--active,
    &__theme-btn.is-active {
        background-color: var(--bg-surface);
        color: var(--primary-color);
        font-weight: 700;
    }

    // Nút Hamburger chuẩn 44x44px (4.4rem)
    &__burger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        width: 4.4rem;
        height: 4.4rem;
        border-radius: 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        @extend %transTheme;

        @include abs.screen(md) {
            display: inline-flex;
        }

        &-bar {
            width: 2rem;
            height: 0.2rem;
            background-color: var(--text-color);
            border-radius: 0.2rem;
            @extend %transBurgerBar;
        }

        &.is-active &-bar:nth-child(1) {
            transform: translateY(0.7rem) rotate(45deg);
        }
        &.is-active &-bar:nth-child(2) {
            opacity: 0;
        }
        &.is-active &-bar:nth-child(3) {
            transform: translateY(-0.7rem) rotate(-45deg);
        }
    }
}
```

### footer.scss

```scss

```

### sidebar.scss

```scss
// scss/layout/_sidebar.scss
@use "../abstracts" as abs;

.sidebar {
    position: fixed;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 40;
    padding: 1rem 0.8rem;
    background-color: var(--body-bg);
    border: 1px solid var(--border-color);
    border-radius: 1.6rem;
    box-shadow: 0 0.8rem 2.4rem var(--shadow-color);
    @extend %transSidebarDrawer;

    &__list {
        @extend %flexColumn;
        gap: 0.8rem;
    }

    &__link {
        position: relative;
        @extend %flexCenter;
        width: 4.6rem;
        height: 4.6rem;
        border-radius: 1.2rem;
        color: var(--text-muted);
        @extend %transTheme;

        &:hover,
        &:focus-visible {
            background-color: var(--bg-surface);
            color: var(--primary-color);
        }

        &--active {
            background-color: var(--bg-surface);
            color: var(--primary-color);
            box-shadow: inset 0 0 0 0.2rem var(--primary-color);
        }
    }

    &__tooltip {
        @extend %absCenterY;
        left: calc(100% + 1.4rem);
        transform: translate(-0.8rem, -50%);
        padding: 0.6rem 1.2rem;
        background-color: var(--text-color);
        color: var(--body-bg);
        font-size: 1.3rem;
        font-weight: 600;
        border-radius: 0.8rem;
        @extend %textNoWrap;
        box-shadow: 0 0.4rem 1.2rem var(--shadow-color);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        @extend %transTooltip;

        &::before {
            @extend %absPseudo;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 0.5rem;
            border-style: solid;
            border-color: transparent var(--text-color) transparent transparent;
        }
    }

    &__link:hover &__tooltip,
    &__link:focus-visible &__tooltip {
        opacity: 1;
        visibility: visible;
        transform: translate(0, -50%);
    }

    @include abs.screen(md) {
        top: abs.$header-height-mobile;
        left: 0;
        bottom: 0;
        width: 26rem;
        transform: translateX(-100%);
        border-radius: 0;
        border-top: none;
        border-left: none;
        padding: 2rem 1.6rem;
        z-index: 55;
        overflow-y: auto;

        &.is-open {
            transform: translateX(0);
        }

        &__link {
            @extend %flexYCenterLeft;
            width: 100%;
            height: 4.8rem;
            padding: 0 1.6rem;
            gap: 1.4rem;
        }

        &__tooltip {
            position: static;
            transform: none;
            opacity: 1;
            visibility: visible;
            background-color: transparent;
            color: inherit;
            padding: 0;
            font-size: 1.5rem;
            box-shadow: none;
            pointer-events: auto;

            &::before {
                display: none;
            }
        }
    }
}

.sidebar-backdrop {
    display: none;

    @include abs.screen(md) {
        display: block;
        @extend %fixedCover;
        top: abs.$header-height-mobile;
        background-color: var(--overlay-bg);
        backdrop-filter: blur(2px);
        z-index: 52;
        opacity: 0;
        visibility: hidden;
        @extend %transBackdrop;

        &.is-active {
            opacity: 1;
            visibility: visible;
        }
    }
}
```

## pages folder

```scss

```

## themes folder

### index.scss

```scss
// scss/themes/_index.scss
@use "../abstracts" as abs;

// Khởi tạo 5 mệnh Ngũ hành (Mệnh Thổ làm mặc định cho :root)
@include abs.generate-theme("earth", $is-default: true);
@include abs.generate-theme("fire");
@include abs.generate-theme("metal");
@include abs.generate-theme("water");
@include abs.generate-theme("wood");
```

## vendors folder

```scss

```
