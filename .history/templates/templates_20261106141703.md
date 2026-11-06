# templates folder

## header.html

```html
<!-- templates/header.html -->
<div class="header__container container">
    <div class="header__left">
        <div class="header__logo logo">
            <a href="./index.html" class="header__logo-link">
                <img src="./assets/icons/logo.svg" alt="Lịch Phong Thủy - Trang chủ" class="header__logo-img" />
            </a>
        </div>

        <div class="header__widget">
            <button
                type="button"
                class="header__widget-btn"
                id="widget-trigger-btn"
                aria-label="Mở tiện ích đổi ngày Âm Dương nhanh"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="converter-modal"
            >
                <img src="./assets/icons/sparkle.svg" alt="" aria-hidden="true" class="header__widget-icon icon" />
                <span class="header__widget-label">Đổi Âm/Dương</span>
            </button>
        </div>
    </div>

    <div class="header__right">
        <div class="header__datetime-wrapper d-lg-none" role="group" aria-label="Thời gian hiện tại">
            <div class="header__date-group">
                <img src="./assets/icons/calendar.svg" alt="" aria-hidden="true" class="header__date-icon icon" />
                <time datetime="2026-11-03" class="header__date-text" id="current-date">03/11/2026</time>
            </div>
            <div class="header__time-group">
                <img src="./assets/icons/clock.svg" alt="" aria-hidden="true" class="header__time-icon icon" />
                <time datetime="14:12:00" class="header__time-text" id="current-time">14:12:00</time>
            </div>
        </div>

        <div class="header__lang-group">
            <details class="header__lang-details js-header-dropdown">
                <summary class="header__lang-summary" aria-label="Chọn ngôn ngữ, hiện tại là Tiếng Việt">
                    <img src="./assets/icons/global.svg" alt="" aria-hidden="true" class="header__lang-icon icon" />
                    <span class="header__lang-current">VN</span>
                    <img
                        src="./assets/icons/arrow-down.svg"
                        alt=""
                        aria-hidden="true"
                        class="header__lang-arrow icon"
                    />
                </summary>
                <ul class="header__lang-list">
                    <li class="header__lang-item">
                        <a href="#!" lang="vi" aria-current="true" class="header__lang-link header__lang-link--active"
                            >VN</a
                        >
                    </li>
                    <li class="header__lang-item">
                        <a href="#!" lang="en" class="header__lang-link">EN</a>
                    </li>
                    <li class="header__lang-item">
                        <a href="#!" lang="ja" class="header__lang-link">JP</a>
                    </li>
                </ul>
            </details>
        </div>

        <div class="header__theme-group">
            <details class="header__theme-details js-header-dropdown">
                <summary class="header__theme-summary" aria-label="Chọn giao diện Ngũ hành">
                    <img src="./assets/icons/theme.svg" alt="" aria-hidden="true" class="header__theme-icon icon" />
                </summary>
                <ul class="header__theme-list">
                    <li class="header__theme-item">
                        <button
                            type="button"
                            data-theme="earth"
                            aria-pressed="true"
                            class="btn header__theme-btn is-active"
                        >
                            <img
                                src="./assets/icons/earth.svg"
                                alt=""
                                aria-hidden="true"
                                class="header__theme-icon icon"
                            />
                            <span>Thổ</span>
                        </button>
                    </li>
                    <li class="header__theme-item">
                        <button type="button" data-theme="fire" aria-pressed="false" class="btn header__theme-btn">
                            <img
                                src="./assets/icons/fire.svg"
                                alt=""
                                aria-hidden="true"
                                class="header__theme-icon icon"
                            />
                            <span>Hoả</span>
                        </button>
                    </li>
                    <li class="header__theme-item">
                        <button type="button" data-theme="metal" aria-pressed="false" class="btn header__theme-btn">
                            <img
                                src="./assets/icons/metal.svg"
                                alt=""
                                aria-hidden="true"
                                class="header__theme-icon icon"
                            />
                            <span>Kim</span>
                        </button>
                    </li>
                    <li class="header__theme-item">
                        <button type="button" data-theme="water" aria-pressed="false" class="btn header__theme-btn">
                            <img
                                src="./assets/icons/water.svg"
                                alt=""
                                aria-hidden="true"
                                class="header__theme-icon icon"
                            />
                            <span>Thuỷ</span>
                        </button>
                    </li>
                    <li class="header__theme-item">
                        <button type="button" data-theme="wood" aria-pressed="false" class="btn header__theme-btn">
                            <img
                                src="./assets/icons/wood.svg"
                                alt=""
                                aria-hidden="true"
                                class="header__theme-icon icon"
                            />
                            <span>Mộc</span>
                        </button>
                    </li>
                </ul>
            </details>
        </div>

        <div class="header__auth">
            <a href="./sign-in.html" class="btn btn--login header__auth-btn">Đăng nhập</a>
        </div>

        <button
            type="button"
            class="header__burger"
            id="burger-btn"
            aria-label="Mở danh mục Xem Ngày Tốt"
            aria-expanded="false"
            aria-controls="calendar-sidebar"
        >
            <span class="header__burger-bar"></span>
            <span class="header__burger-bar"></span>
            <span class="header__burger-bar"></span>
        </button>
    </div>
</div>

<!-- MODAL TIỆN ÍCH ĐỔI NGÀY ÂM - DƯƠNG NHANH (GIAI ĐOẠN 3) -->
<div
    class="converter-modal"
    id="converter-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="converter-modal-title"
    hidden
>
    <div class="converter-modal__backdrop" id="converter-modal-backdrop" aria-hidden="true"></div>

    <div class="converter-modal__dialog" role="document">
        <!-- 1. Header của Modal -->
        <header class="converter-modal__header">
            <div class="converter-modal__title-wrap">
                <span class="converter-modal__badge">Tiện ích Vạn Niên</span>
                <h2 class="converter-modal__title" id="converter-modal-title">Đổi Ngày Âm &#8644; Dương</h2>
            </div>

            <button
                type="button"
                class="converter-modal__close-btn"
                id="converter-modal-close"
                aria-label="Đóng hộp thoại đổi ngày"
                title="Đóng (Esc)"
            >
                &#10005;
            </button>
        </header>

        <!-- 2. Thanh chọn chiều quy đổi (Dương -> Âm hoặc Âm -> Dương) -->
        <div class="converter-modal__tabs" role="tablist" aria-label="Chọn chiều quy đổi lịch">
            <button
                type="button"
                role="tab"
                aria-selected="true"
                class="converter-modal__tab is-active"
                data-convert-mode="solar2lunar"
                id="tab-solar2lunar"
            >
                Dương lịch &#8594; Âm lịch
            </button>
            <button
                type="button"
                role="tab"
                aria-selected="false"
                class="converter-modal__tab"
                data-convert-mode="lunar2solar"
                id="tab-lunar2solar"
            >
                Âm lịch &#8594; Dương lịch
            </button>
        </div>

        <!-- 3. Bộ chọn Ngày / Tháng / Năm -->
        <form class="converter-modal__form" id="converter-form" novalidate>
            <div class="converter-modal__inputs">
                <div class="converter-modal__field">
                    <label for="conv-day" class="converter-modal__label" id="conv-day-label">Ngày Dương</label>
                    <select id="conv-day" class="converter-modal__select"></select>
                </div>

                <div class="converter-modal__field">
                    <label for="conv-month" class="converter-modal__label" id="conv-month-label">Tháng Dương</label>
                    <select id="conv-month" class="converter-modal__select"></select>
                </div>

                <div class="converter-modal__field">
                    <label for="conv-year" class="converter-modal__label" id="conv-year-label">Năm</label>
                    <select id="conv-year" class="converter-modal__select"></select>
                </div>
            </div>

            <!-- Tùy chọn Tháng Nhuận (Chỉ hiện khi đang ở chế độ Âm lịch -> Dương lịch) -->
            <div class="converter-modal__leap-row" id="conv-leap-row" hidden>
                <label class="converter-modal__leap-label" for="conv-leap-checkbox">
                    <input type="checkbox" id="conv-leap-checkbox" class="converter-modal__checkbox" />
                    <span>Là tháng nhuận Âm lịch (nếu năm đó có nhuận)</span>
                </label>
            </div>
        </form>

        <!-- 4. Khối Bento Hiển thị Kết quả Quy đổi & Phong Thủy -->
        <section class="converter-modal__result" aria-live="polite">
            <div class="converter-modal__result-main">
                <div class="converter-modal__result-box converter-modal__result-box--solar">
                    <span class="converter-modal__result-tag">Dương lịch</span>
                    <strong class="converter-modal__result-num" id="conv-res-solar">04/11/2026</strong>
                    <span class="converter-modal__result-sub" id="conv-res-weekday">THỨ TƯ • WEDNESDAY</span>
                </div>

                <div class="converter-modal__result-arrow" aria-hidden="true">&#8644;</div>

                <div class="converter-modal__result-box converter-modal__result-box--lunar">
                    <span class="converter-modal__result-tag" id="conv-res-lunar-tag">Âm lịch (Tháng Đủ)</span>
                    <strong class="converter-modal__result-num" id="conv-res-lunar">26/09/2026</strong>
                    <span class="converter-modal__result-sub" id="conv-res-year-canchi">Năm Bính Ngọ</span>
                </div>
            </div>

            <div class="converter-modal__meta-grid">
                <div class="converter-modal__meta-item">
                    <span>Can chi ngày:</span>
                    <strong id="conv-res-day-canchi">Nhâm Ngọ</strong>
                </div>
                <div class="converter-modal__meta-item">
                    <span>Can chi tháng:</span>
                    <strong id="conv-res-month-canchi">Mậu Tuất</strong>
                </div>
                <div class="converter-modal__meta-item">
                    <span>Mệnh ngày:</span>
                    <strong id="conv-res-napam">Dương Liễu Mộc</strong>
                </div>
                <div class="converter-modal__meta-item">
                    <span>Tiết khí &amp; Trực:</span>
                    <strong id="conv-res-term-truc">Sương Giáng • Trực Thành</strong>
                </div>
            </div>

            <div class="converter-modal__fortune-bar" id="conv-res-fortune">
                🌟 Ngày Hoàng Đạo — Giờ tốt: Tý (23-1), Sửu (1-3), Mão (5-7), Ngọ (11-13), Thân (15-17), Dậu (17-19)
            </div>
        </section>

        <!-- 5. Footer hành động của Modal -->
        <footer class="converter-modal__footer">
            <button type="button" class="btn converter-modal__today-btn" id="conv-btn-today">Về Hôm Nay</button>

            <button type="button" class="btn converter-modal__jump-btn" id="conv-btn-jump">
                <span>Xem chi tiết trên Lịch</span>
                <span aria-hidden="true">&#8594;</span>
            </button>
        </footer>
    </div>
</div>
```

## sidebar.html

```html
<aside class="sidebar" id="calendar-sidebar" aria-label="Thanh công cụ tra cứu lịch">
    <nav class="sidebar__nav" aria-label="Xem Ngày Tốt">
        <ul class="sidebar__list">
            <li class="sidebar__item">
                <a
                    href="./index.html"
                    class="sidebar__link sidebar__link--active"
                    data-nav-page="index.html"
                    aria-current="page"
                    title="Xem Lịch Ngày và Lịch Tháng"
                >
                    <img src="./assets/icons/calendarCheck.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Ngày - tháng</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a
                    href="./index.html#bloc-media-box"
                    class="sidebar__link"
                    data-nav-page="day.html"
                    title="Xem Lịch Ngày"
                >
                    <img src="./assets/icons/calendarDay.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Ngày</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a
                    href="./clock.html"
                    class="sidebar__link"
                    data-nav-page="clock.html"
                    title="Xem Đồng Hồ Phong Thủy và 12 Canh Giờ"
                >
                    <img src="./assets/icons/calendarClock.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Giờ</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a href="#!" class="sidebar__link" data-nav-page="week.html" title="Xem Lịch Tuần">
                    <img src="./assets/icons/calendarRange.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Tuần</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a href="./year.html" class="sidebar__link" data-nav-page="year.html" title="Xem Lịch Năm">
                    <img src="./assets/icons/calendarYear.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Năm</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a href="#!" class="sidebar__link" data-nav-page="festival.html" title="Xem Lễ Tết">
                    <img src="./assets/icons/partyFestival.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Lễ tết</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a href="#!" class="sidebar__link" data-nav-page="bazi.html" title="Xem Bát Tự">
                    <img src="./assets/icons/ying-yang-2.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Bát tự</span>
                </a>
            </li>
            <li class="sidebar__item">
                <a href="#!" class="sidebar__link" data-nav-page="utilities.html" title="Xem Tiện Ích">
                    <img src="./assets/icons/utilities.svg" alt="" aria-hidden="true" class="sidebar__img icon" />
                    <span class="sidebar__tooltip">Tiện ích</span>
                </a>
            </li>
        </ul>
    </nav>
</aside>

<div class="sidebar-backdrop" id="sidebar-backdrop" aria-hidden="true"></div>
```

## footer.html

```html
<!-- Tệp templates/footer.html (Nạp vào <footer id="footer" class="footer"> trong index.html) -->
<div class="container">
    <!-- HÀNG TRÊN: 3 Ô BENTO CHÍNH (5 CỘT - 4 CỘT - 3 CỘT TRÊN PC) -->
    <div class="row footer__bento-row">
        <!-- BENTO 1 (5 CỘT): THƯƠNG HIỆU & MICRODATA ORGANIZATION -->
        <div class="col-5 col-lg-12">
            <section
                class="footer__card footer__card--brand"
                aria-label="Thông tin nền tảng Lịch Phong Thủy"
                itemscope
                itemtype="https://schema.org/Organization"
            >
                <meta itemprop="url" content="https://lichphongthuy.vn" />

                <div class="footer__brand-head">
                    <a href="./index.html" class="footer__logo-link" title="Về trang chủ Lịch Phong Thủy">
                        <img
                            src="./assets/icons/logo.svg"
                            alt="Logo Lịch Phong Thủy"
                            class="footer__logo-img"
                            itemprop="logo"
                            loading="lazy"
                        />
                        <span class="footer__brand-name" itemprop="name">Lịch Phong Thủy</span>
                    </a>
                    <span class="footer__version-badge" title="Phiên bản năm Bính Ngọ 2026">v2026.11</span>
                </div>

                <p class="footer__desc" itemprop="description">
                    Nền tảng tra cứu <strong>Lịch Vạn Niên</strong>, Can Chi, Tiết Khí và ứng dụng lý thuyết
                    <strong>Ngũ Hành</strong> vào đời sống hằng ngày. Kết hợp tinh hoa cổ học phương Đông cùng giao diện
                    Bento trực quan.
                </p>

                <!-- Đổi nhanh giao diện Ngũ Hành ngay dưới Footer bằng data-quick-theme -->
                <div class="footer__elements" role="group" aria-label="Đổi nhanh bản mệnh giao diện">
                    <span class="footer__elements-label">Bản mệnh:</span>
                    <div class="footer__elements-list">
                        <button
                            type="button"
                            class="footer__element-dot"
                            data-quick-theme="metal"
                            aria-label="Chuyển sang giao diện mệnh Kim"
                            title="Mệnh Kim (Vàng ánh kim)"
                        >
                            Kim
                        </button>
                        <button
                            type="button"
                            class="footer__element-dot"
                            data-quick-theme="wood"
                            aria-label="Chuyển sang giao diện mệnh Mộc"
                            title="Mệnh Mộc (Xanh lục bảo)"
                        >
                            Mộc
                        </button>
                        <button
                            type="button"
                            class="footer__element-dot"
                            data-quick-theme="water"
                            aria-label="Chuyển sang giao diện mệnh Thủy"
                            title="Mệnh Thủy (Xanh đại dương)"
                        >
                            Thủy
                        </button>
                        <button
                            type="button"
                            class="footer__element-dot"
                            data-quick-theme="fire"
                            aria-label="Chuyển sang giao diện mệnh Hỏa"
                            title="Mệnh Hỏa (Đỏ nhiệt huyết)"
                        >
                            Hỏa
                        </button>
                        <button
                            type="button"
                            class="footer__element-dot"
                            data-quick-theme="earth"
                            aria-label="Chuyển sang giao diện mệnh Thổ"
                            title="Mệnh Thổ (Nâu đại địa)"
                        >
                            Thổ
                        </button>
                    </div>
                </div>

                <!-- Thông tin liên hệ chuẩn Schema.org -->
                <address
                    class="footer__contact"
                    itemprop="address"
                    itemscope
                    itemtype="https://schema.org/PostalAddress"
                >
                    <span class="footer__contact-item">
                        <span aria-hidden="true">📍</span>
                        <span itemprop="addressLocality">TP. Hồ Chí Minh</span>,
                        <span itemprop="addressCountry">Việt Nam</span>
                    </span>
                    <a
                        href="mailto:lienhe@lichphongthuy.vn"
                        class="footer__contact-link"
                        itemprop="email"
                        title="Gửi email liên hệ hợp tác"
                    >
                        lienhe@lichphongthuy.vn
                    </a>
                </address>
            </section>
        </div>

        <!-- BENTO 2 (4 CỘT): ĐIỀU HƯỚNG NHANH (2 CỘT LINK CHUẨN LANDMARK NAV) -->
        <div class="col-4 col-lg-7 col-md-12">
            <div class="footer__card footer__card--links">
                <nav class="footer__nav" aria-label="Danh mục tra cứu lịch">
                    <h2 class="footer__heading">Tra cứu Lịch</h2>
                    <ul class="footer__list">
                        <li class="footer__item">
                            <a
                                href="#main"
                                class="footer__link"
                                data-footer-nav="today"
                                title="Xem chi tiết tờ lịch Bloc hôm nay"
                            >
                                Lịch Ngày (<abbr title="Âm lịch">ÂL</abbr> / <abbr title="Dương lịch">DL</abbr>)
                            </a>
                        </li>
                        <li class="footer__item">
                            <a
                                href="#month-cal-section"
                                class="footer__link"
                                data-footer-nav="month"
                                title="Xem lưới lịch tháng và ngày Hoàng Đạo"
                            >
                                Lịch Tháng &amp; Hoàng Đạo
                            </a>
                        </li>
                        <li class="footer__item">
                            <button
                                type="button"
                                class="footer__link footer__link--btn"
                                data-footer-action="open-converter"
                                aria-controls="widget-trigger-btn"
                                title="Mở công cụ quy đổi ngày Âm sang Dương"
                            >
                                Đổi Ngày Âm - Dương
                            </button>
                        </li>
                        <li class="footer__item">
                            <a
                                href="#!"
                                class="footer__link"
                                data-footer-nav="solar-terms"
                                title="Tra cứu 24 Tiết khí trong năm"
                            >
                                Nhị Thập Tứ Tiết Khí
                            </a>
                        </li>
                    </ul>
                </nav>

                <nav class="footer__nav" aria-label="Cổ học và Phong thủy">
                    <h2 class="footer__heading">Phong Thủy</h2>
                    <ul class="footer__list">
                        <li class="footer__item">
                            <a href="#!" class="footer__link" data-footer-nav="bazi" title="Lập lá số Bát Tự Tử Bình">
                                Lá Số Bát Tự
                            </a>
                        </li>
                        <li class="footer__item">
                            <a href="#!" class="footer__link" data-footer-nav="stars" title="Tra cứu Nhị Thập Bát Tú">
                                Nhị Thập Bát Tú
                            </a>
                        </li>
                        <li class="footer__item">
                            <a
                                href="#!"
                                class="footer__link"
                                data-footer-nav="auspicious"
                                title="Chọn ngày lành tháng tốt"
                            >
                                Xem Ngày Tốt Xấu
                            </a>
                        </li>
                        <li class="footer__item">
                            <a href="#!" class="footer__link" data-footer-nav="wuxing" title="Bảng tra Nạp Âm Ngũ Hành">
                                Nạp Âm Ngũ Hành
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- BENTO 3 (3 CỘT): NHẬN BẢN TIN NGÀY TỐT & MẠNG XÃ HỘI BẢO MẬT -->
        <div class="col-3 col-lg-5 col-md-12">
            <section class="footer__card footer__card--utility" aria-label="Đăng ký nhận lịch và kết nối">
                <h2 class="footer__heading">Nhận Lịch Ngày Tốt</h2>
                <p class="footer__sub-desc">Nhận thông báo ngày Rằm, Mùng 1 và giờ Hoàng Đạo đầu mỗi tuần.</p>

                <form class="footer__form" id="footer-newsletter-form" data-form-type="newsletter" novalidate>
                    <label for="footer-email" class="footer__sr-only">Địa chỉ Email của bạn</label>
                    <div class="footer__input-group">
                        <input
                            type="email"
                            id="footer-email"
                            name="email"
                            class="footer__input"
                            placeholder="nhap@email.vn"
                            autocomplete="email"
                            required
                            aria-describedby="footer-form-feedback"
                        />
                        <button
                            type="submit"
                            class="btn footer__submit-btn"
                            aria-label="Đăng ký nhận lịch qua Email"
                            title="Đăng ký ngay"
                        >
                            Gửi
                        </button>
                    </div>
                    <!-- Dùng thuộc tính hidden để ẩn hoàn toàn khi chưa có thông báo; aria-live giúp đọc tự động khi hiện -->
                    <p id="footer-form-feedback" class="footer__feedback" aria-live="polite" hidden></p>
                </form>

                <!-- Liên kết ngoài: Bắt buộc có target="_blank" và rel="noopener noreferrer" -->
                <div class="footer__social">
                    <span class="footer__social-label">Kết nối &amp; Mã nguồn:</span>
                    <ul class="footer__social-list">
                        <li>
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                itemprop="sameAs"
                                class="footer__social-link"
                                aria-label="Xem mã nguồn dự án trên GitHub (Mở trong tab mới)"
                                title="GitHub (Mở trong tab mới)"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path
                                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                                    />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://vi.wikipedia.org/wiki/%C3%82m_l%E1%BB%8Bch"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="footer__social-link"
                                aria-label="Tài liệu tham khảo Âm lịch trên Wikipedia (Mở trong tab mới)"
                                title="Tài liệu Âm lịch Wikipedia (Mở trong tab mới)"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path
                                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                    ></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>

    <!-- HÀNG DƯỚI: 1 THANH BENTO BAR (12 CỘT) CHO BẢN QUYỀN & NÚT LÊN ĐẦU TRANG -->
    <div class="footer__bottom-bar">
        <p class="footer__copyright">
            &copy; <time datetime="2026" id="footer-year">2026</time> <strong>Lịch Phong Thủy</strong>. Mọi thông tin
            Can Chi, Giờ Hoàng Đạo mang tính chất tham khảo và chiêm nghiệm văn hóa.
        </p>

        <button
            type="button"
            class="footer__top-btn"
            data-footer-action="scroll-top"
            aria-label="Cuộn mượt lên đầu trang"
            title="Lên đầu trang"
        >
            <span>Đầu trang</span>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                aria-hidden="true"
            >
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        </button>
    </div>
</div>
```

### clock-calendar.html

```html
<section
    class="clock-page__wrapper"
    id="clock-bento-app"
    aria-label="Không gian Đồng hồ Phong thủy thời gian thực"
    data-active-format="24"
    data-active-city="hcm"
    data-timezone="Asia/Ho_Chi_Minh"
>
    <!-- Vùng thông báo ẩn dành riêng cho Screen Reader (Chỉ đọc khi đổi canh giờ hoặc đổi cài đặt) -->
    <div id="clock-sr-announcer" class="clock-page__sr-only" aria-live="polite" aria-atomic="true"></div>

    <!-- ==================== TẦNG 1: HERO CLOCK BENTO (LẤY CẢM HỨNG TỪ TIMESPOT) ==================== -->
    <section class="clock-hero" aria-label="Đồng hồ thời gian thực và Khu vực">
        <!-- Header của Section: Trạng thái Giờ Âm lịch | Select Khu Vực | Nút 12h/24h -->
        <header class="clock-hero__header">
            <div
                class="clock-hero__status-pill"
                id="clock-branch-pill"
                data-fortune="good"
                title="Trạng thái Canh giờ Âm lịch hiện tại"
            >
                <span class="clock-hero__status-dot" aria-hidden="true"></span>
                <span id="clock-branch-status-text">Đang tính canh giờ...</span>
            </div>

            <!-- Bộ chọn Khu vực / Tỉnh thành (Vũ trang data-* cho JS & API Thời tiết) -->
            <details class="clock-hero__loc-dropdown js-cal-dropdown" id="clock-loc-dropdown">
                <summary
                    class="clock-hero__loc-summary"
                    aria-label="Chọn khu vực xem giờ và thời tiết"
                    title="Đổi tỉnh thành hoặc múi giờ quốc tế"
                >
                    <span aria-hidden="true">📍</span>
                    <span class="clock-hero__loc-summary-text" id="clock-loc-label">TP. Hồ Chí Minh, Việt Nam</span>
                    <img
                        src="./assets/icons/arrow-down.svg"
                        alt=""
                        aria-hidden="true"
                        class="clock-hero__loc-arrow icon"
                    />
                </summary>

                <ul class="clock-hero__loc-menu" role="listbox" aria-label="Danh sách khu vực và múi giờ">
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="true"
                            class="clock-hero__loc-option is-selected"
                            data-city-id="hcm"
                            data-city-name="TP. Hồ Chí Minh"
                            data-country="Việt Nam"
                            data-lat="10.8231"
                            data-lon="106.6297"
                            data-tz="Asia/Ho_Chi_Minh"
                            data-utc="UTC+7"
                            title="Múi giờ Việt Nam (UTC+7)"
                        >
                            <span>TP. Hồ Chí Minh, Việt Nam</span>
                            <small>UTC+7</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="hn"
                            data-city-name="Hà Nội"
                            data-country="Việt Nam"
                            data-lat="21.0285"
                            data-lon="105.8542"
                            data-tz="Asia/Ho_Chi_Minh"
                            data-utc="UTC+7"
                            title="Thủ đô Hà Nội (UTC+7)"
                        >
                            <span>Hà Nội, Việt Nam</span>
                            <small>UTC+7</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="dn"
                            data-city-name="Đà Nẵng"
                            data-country="Việt Nam"
                            data-lat="16.0544"
                            data-lon="108.2022"
                            data-tz="Asia/Ho_Chi_Minh"
                            data-utc="UTC+7"
                            title="TP. Đà Nẵng (UTC+7)"
                        >
                            <span>Đà Nẵng, Việt Nam</span>
                            <small>UTC+7</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="hue"
                            data-city-name="Thừa Thiên Huế"
                            data-country="Việt Nam"
                            data-lat="16.4637"
                            data-lon="107.5909"
                            data-tz="Asia/Ho_Chi_Minh"
                            data-utc="UTC+7"
                            title="Cố đô Huế (UTC+7)"
                        >
                            <span>Thừa Thiên Huế, Việt Nam</span>
                            <small>UTC+7</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="ct"
                            data-city-name="Cần Thơ"
                            data-country="Việt Nam"
                            data-lat="10.0452"
                            data-lon="105.7469"
                            data-tz="Asia/Ho_Chi_Minh"
                            data-utc="UTC+7"
                            title="TP. Cần Thơ (UTC+7)"
                        >
                            <span>Cần Thơ, Việt Nam</span>
                            <small>UTC+7</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="tyo"
                            data-city-name="Tokyo"
                            data-country="Nhật Bản"
                            data-lat="35.6762"
                            data-lon="139.6503"
                            data-tz="Asia/Tokyo"
                            data-utc="UTC+9"
                            title="Tokyo, Nhật Bản (UTC+9)"
                        >
                            <span>Tokyo, Nhật Bản</span>
                            <small>UTC+9</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="lon"
                            data-city-name="London"
                            data-country="Vương quốc Anh"
                            data-lat="51.5074"
                            data-lon="-0.1278"
                            data-tz="Europe/London"
                            data-utc="UTC+0"
                            title="London, Vương quốc Anh (UTC+0)"
                        >
                            <span>London, Vương quốc Anh</span>
                            <small>UTC+0</small>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected="false"
                            class="clock-hero__loc-option"
                            data-city-id="nyc"
                            data-city-name="New York"
                            data-country="Hoa Kỳ"
                            data-lat="40.7128"
                            data-lon="-74.0060"
                            data-tz="America/New_York"
                            data-utc="UTC-5"
                            title="New York, Hoa Kỳ (UTC-5)"
                        >
                            <span>New York, Hoa Kỳ</span>
                            <small>UTC-5</small>
                        </button>
                    </li>
                </ul>
            </details>

            <!-- Nút chuyển đổi 12h / 24h giống góc phải TimeSpot -->
            <div
                class="clock-hero__format-switch"
                role="group"
                aria-label="Định dạng hiển thị đồng hồ 12 giờ hoặc 24 giờ"
            >
                <button
                    type="button"
                    class="clock-hero__format-btn"
                    data-time-format="12"
                    aria-pressed="false"
                    title="Chuyển sang định dạng 12 giờ (AM/PM)"
                >
                    12h
                </button>
                <button
                    type="button"
                    class="clock-hero__format-btn is-active"
                    data-time-format="24"
                    aria-pressed="true"
                    title="Chuyển sang định dạng 24 giờ"
                >
                    24h
                </button>
            </div>
        </header>

        <!-- Màn hình Đồng hồ số khổng lồ (role="timer" + aria-live="off" chống đọc lặp mỗi giây) -->
        <div class="clock-hero__stage">
            <time
                id="hero-clock-time"
                class="clock-hero__digits"
                datetime="08:15:40"
                role="timer"
                aria-live="off"
                aria-atomic="true"
                title="Giờ thực tế theo múi giờ khu vực đang chọn"
            >
                <span class="clock-hero__digit-group" data-clock-part="hours">08</span>
                <span class="clock-hero__colon" aria-hidden="true">:</span>
                <span class="clock-hero__digit-group" data-clock-part="minutes">15</span>
                <span class="clock-hero__colon" aria-hidden="true">:</span>
                <span class="clock-hero__digit-group clock-hero__digit-group--sec" data-clock-part="seconds">40</span>
            </time>
            <!-- Hậu tố AM/PM: Dùng thuộc tính hidden chuẩn HTML5 khi đang ở chế độ 24h -->
            <span class="clock-hero__ampm" id="hero-clock-ampm" hidden>AM</span>
        </div>

        <!-- Thanh Meta 3 góc dưới chân đồng hồ (Giống bố cục TimeSpot) -->
        <footer class="clock-hero__meta">
            <div class="clock-hero__meta-col clock-hero__meta-col--left">
                <span class="clock-hero__meta-label">Hiện tại</span>
                <abbr
                    title="Giờ Phối hợp Quốc tế (Coordinated Universal Time)"
                    class="clock-hero__utc-badge"
                    id="clock-meta-utc"
                    >UTC+7</abbr
                >
                <span
                    class="clock-hero__weather-chip"
                    id="clock-meta-weather"
                    title="Nhiệt độ và trạng thái thời tiết thực tế tại khu vực"
                >
                    <span aria-hidden="true" id="clock-weather-icon">☀️</span>
                    <strong id="clock-weather-temp">30°C</strong>
                </span>
            </div>

            <div class="clock-hero__meta-col clock-hero__meta-col--center">
                <p class="clock-hero__sun-line" title="Giờ Mặt trời mọc, Mặt trời lặn và tổng thời lượng ban ngày">
                    <span>Mặt trời</span>
                    <span aria-hidden="true">☀️</span> :
                    <strong id="clock-sun- times">05:45 - 17:32 (11h 47m)</strong>
                </p>
                <p class="clock-hero__date-line">
                    <time datetime="2026-11-05" id="clock-meta-solar-date">Thứ Năm, 05 tháng 11, 2026</time>
                </p>
            </div>

            <div class="clock-hero__meta-col clock-hero__meta-col--right">
                <span class="clock-hero__lunar-pill" id="clock-meta-lunar-date">Âm lịch: 27/09 Bính Ngọ</span>
            </div>
        </footer>
    </section>

    <!-- ==================== TẦNG 2: ĐỊA DANH & BÁT TỰ TỨ TRỤ (PLANET CLOCK + KABALA) ==================== -->
    <div class="row clock-page__mid-row">
        <!-- Cột Trái (5 cột): Địa danh lớn + Luận giải giờ hiện tại (Microdata Schema.org Place) -->
        <div class="col-5 col-lg-12">
            <article
                class="clock-location-card"
                aria-label="Thông tin địa danh và luận giải giờ hiện tại"
                itemscope
                itemtype="https://schema.org/Place"
            >
                <div itemprop="geo" itemscope itemtype="https://schema.org/GeoCoordinates" hidden>
                    <meta itemprop="latitude" id="schema-lat" content="10.8231" />
                    <meta itemprop="longitude" id="schema-lon" content="106.6297" />
                </div>

                <div class="clock-location-card__top">
                    <span class="clock-location-card__eyebrow">Địa danh &amp; Thời vận hiện tại</span>
                    <h1 class="clock-location-card__city" itemprop="name" id="clock-city-heading">
                        TP. Hồ Chí Minh,<br />Việt Nam
                    </h1>
                    <p class="clock-location-card__quote" id="clock-city-advice">
                        "Thuận thiên hành sự, chọn đúng thời cơ. Mọi việc khởi đầu vào giờ lành đều hanh thông."
                    </p>
                </div>

                <div class="clock-location-card__stats">
                    <div class="clock-location-card__stat-box">
                        <span class="clock-location-card__stat-label">Canh giờ đang xem</span>
                        <strong class="clock-location-card__stat-val" id="detail-selected-hour-name"
                            >Giờ Thân (15:00 - 17:00)</strong
                        >
                    </div>
                    <div class="clock-location-card__stat-box">
                        <span class="clock-location-card__stat-label">Nạp âm giờ</span>
                        <strong class="clock-location-card__stat-val" id="detail-selected-hour-napam"
                            >Tuyền Trung Thủy</strong
                        >
                    </div>
                    <div class="clock-location-card__stat-box">
                        <span class="clock-location-card__stat-label">Hướng Tài Thần / Hỷ Thần</span>
                        <strong class="clock-location-card__stat-val" id="detail-selected-directions"
                            >Đông Nam • Đông Bắc</strong
                        >
                    </div>
                    <div class="clock-location-card__stat-box">
                        <span class="clock-location-card__stat-label">Tiết khí hiện tại</span>
                        <strong class="clock-location-card__stat-val" id="detail-selected-solarterm"
                            >Sương Giáng</strong
                        >
                    </div>
                </div>
            </article>
        </div>

        <!-- Cột Phải (7 cột): 4 Ô Bento Tứ Trụ (Giờ - Ngày - Tháng - Năm Can Chi & Nạp Âm) -->
        <div class="col-7 col-lg-12">
            <section class="clock-pillars" aria-label="Bát tự Tứ trụ thời gian thực">
                <div class="clock-pillars__grid">
                    <!-- Trụ Giờ (Nổi bật theo cảm hứng ô màu Cam/Vàng của Planet Clock) -->
                    <article
                        class="clock-pillar-card clock-pillar-card--highlight"
                        data-pillar="hour"
                        title="Trụ Giờ trong Bát Tự (Thay đổi mỗi 2 tiếng)"
                    >
                        <header class="clock-pillar-card__head">
                            <span class="clock-pillar-card__tag">Trụ Giờ</span>
                            <span class="clock-pillar-card__range" id="pillar-hour-range">15:00 - 17:00</span>
                        </header>
                        <strong class="clock-pillar-card__canchi" id="pillar-hour-canchi">Giáp Thân</strong>
                        <footer class="clock-pillar-card__foot">
                            <span class="clock-pillar-card__napam" id="pillar-hour-napam">Hành: Tuyền Trung Thủy</span>
                            <span class="clock-pillar-card__badge" id="pillar-hour-fortune">Hoàng Đạo</span>
                        </footer>
                    </article>

                    <!-- Trụ Ngày -->
                    <article class="clock-pillar-card" data-pillar="day" title="Trụ Ngày trong Bát Tự">
                        <header class="clock-pillar-card__head">
                            <span class="clock-pillar-card__tag">Trụ Ngày</span>
                            <span class="clock-pillar-card__range" id="pillar-day-truc">Trực: Thành</span>
                        </header>
                        <strong class="clock-pillar-card__canchi" id="pillar-day-canchi">Quý Mùi</strong>
                        <footer class="clock-pillar-card__foot">
                            <span class="clock-pillar-card__napam" id="pillar-day-napam">Hành: Dương Liễu Mộc</span>
                            <span class="clock-pillar-card__badge" id="pillar-day-lunar">Ngày 27/9 ÂL</span>
                        </footer>
                    </article>

                    <!-- Trụ Tháng -->
                    <article class="clock-pillar-card" data-pillar="month" title="Trụ Tháng trong Bát Tự">
                        <header class="clock-pillar-card__head">
                            <span class="clock-pillar-card__tag">Trụ Tháng</span>
                            <span class="clock-pillar-card__range" id="pillar-month-num">Tháng 9 ÂL (Đủ)</span>
                        </header>
                        <strong class="clock-pillar-card__canchi" id="pillar-month-canchi">Mậu Tuất</strong>
                        <footer class="clock-pillar-card__foot">
                            <span class="clock-pillar-card__napam" id="pillar-month-napam">Hành: Bình Địa Mộc</span>
                            <span class="clock-pillar-card__badge">Mùa Thu</span>
                        </footer>
                    </article>

                    <!-- Trụ Năm -->
                    <article class="clock-pillar-card" data-pillar="year" title="Trụ Năm trong Bát Tự">
                        <header class="clock-pillar-card__head">
                            <span class="clock-pillar-card__tag">Trụ Năm</span>
                            <span class="clock-pillar-card__range" id="pillar-year-solar">Năm 2026</span>
                        </header>
                        <strong class="clock-pillar-card__canchi" id="pillar-year-canchi">Bính Ngọ</strong>
                        <footer class="clock-pillar-card__foot">
                            <span class="clock-pillar-card__napam" id="pillar-year-napam">Hành: Thiên Hà Thủy</span>
                            <span class="clock-pillar-card__badge">Con Ngựa</span>
                        </footer>
                    </article>
                </div>
            </section>
        </div>
    </div>

    <!-- ==================== TẦNG 3: DẢI 12 THẺ BENTO CANH GIỜ ÂM LỊCH (TÝ -> HỢI) ==================== -->
    <section class="clock-zodiac-section" aria-label="Danh sách 12 Canh giờ Âm lịch trong ngày">
        <header class="clock-zodiac-section__header">
            <div>
                <h2 class="clock-zodiac-section__title">12 Canh Giờ Trong Ngày (Tý &#8594; Hợi)</h2>
                <p class="clock-zodiac-section__sub">
                    Canh giờ hiện tại được tô đậm tự động. Dùng phím mũi tên Trái/Phải hoặc bấm vào từng ô để xem chi
                    tiết.
                </p>
            </div>

            <!-- Bộ lọc nhanh Hoàng Đạo / Hắc Đạo dùng data-hour-filter và aria-pressed -->
            <div
                class="clock-zodiac-section__filters"
                role="group"
                aria-label="Lọc 12 canh giờ theo Hoàng Đạo hoặc Hắc Đạo"
            >
                <button
                    type="button"
                    class="clock-zodiac-section__filter-btn is-active"
                    data-hour-filter="all"
                    aria-pressed="true"
                    title="Hiển thị toàn bộ 12 canh giờ"
                >
                    Tất cả (12)
                </button>
                <button
                    type="button"
                    class="clock-zodiac-section__filter-btn"
                    data-hour-filter="good"
                    aria-pressed="false"
                    title="Chỉ làm sáng 6 giờ Hoàng Đạo (Tốt)"
                >
                    <span class="clock-zodiac-section__dot clock-zodiac-section__dot--good" aria-hidden="true"></span>
                    Hoàng Đạo (6)
                </button>
                <button
                    type="button"
                    class="clock-zodiac-section__filter-btn"
                    data-hour-filter="bad"
                    aria-pressed="false"
                    title="Chỉ làm sáng 6 giờ Hắc Đạo (Xấu)"
                >
                    <span class="clock-zodiac-section__dot clock-zodiac-section__dot--bad" aria-hidden="true"></span>
                    Hắc Đạo (6)
                </button>
            </div>
        </header>

        <!-- Lưới 12 Canh Giờ (Hỗ trợ Roving Tabindex: chỉ 1 nút có tabindex="0") -->
        <div class="clock-zodiac-grid" id="clock-zodiac-grid" role="group" aria-label="Lưới 12 Canh Giờ Âm Lịch">
            <!-- JS sẽ tự động render & cập nhật 12 thẻ Bento Canh Giờ tại đây (kèm fallback tĩnh cho Giờ Tý) -->
            <button
                type="button"
                class="clock-zodiac-card is-current"
                tabindex="0"
                aria-current="time"
                data-branch-index="0"
                data-branch="ty"
                data-fortune="good"
                title="Giờ Tý (23:00 - 01:00) - Hoàng Đạo"
            >
                <div class="clock-zodiac-card__top">
                    <span class="clock-zodiac-card__name">Giờ Tý</span>
                    <span class="clock-zodiac-card__utc">23:00 - 01:00</span>
                </div>
                <div class="clock-zodiac-card__bottom">
                    <strong class="clock-zodiac-card__canchi">Nhâm Tý</strong>
                    <span class="clock-zodiac-card__fortune"> <span aria-hidden="true">☀️</span> Hoàng Đạo </span>
                </div>
                <img src="./assets/icons/zodiac/mouse.svg" alt="" aria-hidden="true" class="clock-zodiac-card__img" />
            </button>
        </div>
    </section>
</section>
```

## year-calendar.html

```html
<!-- templates/year-calendar.html -->
<section class="year-cal-app" id="year-cal-app" aria-label="Lịch tổng hợp 12 tháng năm 2026" data-active-year="2026">
    <!-- THANH ĐIỀU KHIỂN NĂM: Trái (< + Về Năm Nay) | Giữa (Năm 2026) | Phải (Chọn năm + >) -->
    <header class="month-cal year-cal-app__toolbar-card">
        <div class="month-cal__toolbar year-cal-app__toolbar">
            <div class="year-cal-app__side year-cal-app__side--left">
                <button
                    type="button"
                    class="month-cal__nav-btn"
                    id="cal-prev-year"
                    data-year-Step="-1"
                    aria-label="Xem năm trước (2025)"
                    title="Chuyển sang năm 2025"
                >
                    &#10094;
                </button>
                <button
                    type="button"
                    class="btn month-cal__today-btn"
                    id="cal-current-year-btn"
                    data-target-year="2026"
                    title="Quay về năm hiện tại (2026)"
                >
                    Về Năm Nay
                </button>
            </div>

            <h1 class="year-cal-app__heading" id="year-main-heading" aria-live="polite">
                Năm <time datetime="2026" id="year-main-number">2026</time>
            </h1>

            <div class="year-cal-app__side year-cal-app__side--right">
                <details class="month-cal__dropdown js-cal-dropdown" id="cal-year-dropdown">
                    <summary
                        class="month-cal__summary"
                        aria-label="Chọn năm tra cứu, hiện tại là năm 2026"
                        aria-expanded="false"
                        aria-controls="year-dropdown-list"
                        title="Mở danh sách chọn năm"
                    >
                        <span class="month-cal__summary-text" id="cal-year-label">Năm 2026</span>
                        <img
                            src="./assets/icons/arrow-down.svg"
                            alt=""
                            aria-hidden="true"
                            class="month-cal__arrow icon"
                        />
                    </summary>
                    <ul
                        class="month-cal__dropdown-menu month-cal__dropdown-menu--year"
                        id="year-dropdown-list"
                        role="listbox"
                        aria-label="Danh sách năm"
                    >
                        <li>
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                data-year="2024"
                                class="month-cal__option"
                                title="Xem lịch năm 2024"
                            >
                                Năm 2024
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                data-year="2025"
                                class="month-cal__option"
                                title="Xem lịch năm 2025"
                            >
                                Năm 2025
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                role="option"
                                aria-selected="true"
                                data-year="2026"
                                class="month-cal__option is-selected"
                                title="Xem lịch năm 2026"
                            >
                                Năm 2026
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                data-year="2027"
                                class="month-cal__option"
                                title="Xem lịch năm 2027"
                            >
                                Năm 2027
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                data-year="2028"
                                class="month-cal__option"
                                title="Xem lịch năm 2028"
                            >
                                Năm 2028
                            </button>
                        </li>
                    </ul>
                </details>

                <button
                    type="button"
                    class="month-cal__nav-btn"
                    id="cal-next-year"
                    data-year-Step="1"
                    aria-label="Xem năm sau (2027)"
                    title="Chuyển sang năm 2027"
                >
                    &#10095;
                </button>
            </div>
        </div>
    </header>

    <!-- LƯỚI BENTO 12 THÁNG (4 CỘT X 3 HÀNG TRÊN PC) -->
    <div class="year-cal-app__grid" id="year-months-grid" role="group" aria-label="12 tháng trong năm 2026">
        <!-- ==================== THÁNG 1 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="1" data-year="2026" aria-label="Tháng 1 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 1</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 1">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2025-12-29"
                    data-solar="29"
                    title="29/12/2025"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2025-12-30"
                    data-solar="30"
                    title="30/12/2025"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2025-12-31"
                    data-solar="31"
                    title="31/12/2025"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-01"
                    data-solar="1"
                    data-status="holiday"
                    title="01/01/2026 - Tết Dương Lịch"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-02"
                    data-solar="2"
                    data-status="good"
                    title="02/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">2</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-03"
                    data-solar="3"
                    data-status="good"
                    title="03/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">3</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-04"
                    data-solar="4"
                    title="04/01/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-05"
                    data-solar="5"
                    data-status="good"
                    title="05/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">5</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-06"
                    data-solar="6"
                    title="06/01/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-07"
                    data-solar="7"
                    title="07/01/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-08"
                    data-solar="8"
                    data-status="good"
                    title="08/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">8</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-09"
                    data-solar="9"
                    data-status="holiday"
                    title="09/01/2026 - Ngày Học sinh Sinh viên VN"
                >
                    <span class="month-cal__solar">9</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-10"
                    data-solar="10"
                    data-status="good"
                    title="10/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">10</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-11"
                    data-solar="11"
                    data-status="good"
                    title="11/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">11</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-12"
                    data-solar="12"
                    title="12/01/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-13"
                    data-solar="13"
                    title="13/01/2026"
                >
                    <span class="month-cal__solar">13</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-14"
                    data-solar="14"
                    title="14/01/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-15"
                    data-solar="15"
                    data-status="good"
                    title="15/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">15</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-16"
                    data-solar="16"
                    title="16/01/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-17"
                    data-solar="17"
                    data-status="good"
                    title="17/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-18"
                    data-solar="18"
                    title="18/01/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-19"
                    data-solar="19"
                    title="19/01/2026"
                >
                    <span class="month-cal__solar">19</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-20"
                    data-solar="20"
                    title="20/01/2026"
                >
                    <span class="month-cal__solar">20</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-21"
                    data-solar="21"
                    title="21/01/2026"
                >
                    <span class="month-cal__solar">21</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-22"
                    data-solar="22"
                    data-status="good"
                    title="22/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">22</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-23"
                    data-solar="23"
                    title="23/01/2026"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-24"
                    data-solar="24"
                    data-status="good"
                    title="24/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-25"
                    data-solar="25"
                    title="25/01/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-26"
                    data-solar="26"
                    title="26/01/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-27"
                    data-solar="27"
                    title="27/01/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-28"
                    data-solar="28"
                    data-status="good"
                    title="28/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">28</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-29"
                    data-solar="29"
                    data-status="good"
                    title="29/01/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">29</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-30"
                    data-solar="30"
                    title="30/01/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-01-31"
                    data-solar="31"
                    title="31/01/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-01"
                    data-solar="1"
                    title="01/02/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-02"
                    data-solar="2"
                    title="02/02/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-03"
                    data-solar="3"
                    title="03/02/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-04"
                    data-solar="4"
                    title="04/02/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-05"
                    data-solar="5"
                    title="05/02/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-06"
                    data-solar="6"
                    title="06/02/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-07"
                    data-solar="7"
                    title="07/02/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-08"
                    data-solar="8"
                    title="08/02/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 2 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="2" data-year="2026" aria-label="Tháng 2 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 2</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 2">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-01-26"
                    data-solar="26"
                    title="26/01/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-01-27"
                    data-solar="27"
                    title="27/01/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-01-28"
                    data-solar="28"
                    title="28/01/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-01-29"
                    data-solar="29"
                    title="29/01/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-01-30"
                    data-solar="30"
                    title="30/01/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-01-31"
                    data-solar="31"
                    title="31/01/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-01"
                    data-solar="1"
                    title="01/02/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-02"
                    data-solar="2"
                    title="02/02/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-03"
                    data-solar="3"
                    data-status="holiday"
                    title="03/02/2026 - Ngày thành lập Đảng CSVN"
                >
                    <span class="month-cal__solar">3</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-04"
                    data-solar="4"
                    title="04/02/2026 - Lập Xuân"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-05"
                    data-solar="5"
                    data-status="good"
                    title="05/02/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">5</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-06"
                    data-solar="6"
                    title="06/02/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-07"
                    data-solar="7"
                    title="07/02/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-08"
                    data-solar="8"
                    title="08/02/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-09"
                    data-solar="9"
                    title="09/02/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-10"
                    data-solar="10"
                    data-status="good holiday"
                    title="10/02/2026 - Ông Công Ông Táo (23 tháng Chạp)"
                >
                    <span class="month-cal__solar">10</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-11"
                    data-solar="11"
                    title="11/02/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-12"
                    data-solar="12"
                    data-status="good"
                    title="12/02/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">12</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-13"
                    data-solar="13"
                    title="13/02/2026"
                >
                    <span class="month-cal__solar">13</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-14"
                    data-solar="14"
                    data-status="holiday"
                    title="14/02/2026 - Lễ Tình Nhân (Valentine)"
                >
                    <span class="month-cal__solar">14</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-15"
                    data-solar="15"
                    title="15/02/2026"
                >
                    <span class="month-cal__solar">15</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-16"
                    data-solar="16"
                    title="16/02/2026 - Giao Thừa Bính Ngọ"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-17"
                    data-solar="17"
                    data-status="holiday"
                    title="17/02/2026 - Mùng 1 Tết Nguyên Đán Bính Ngọ"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-18"
                    data-solar="18"
                    data-status="good holiday"
                    title="18/02/2026 - Mùng 2 Tết Nguyên Đán"
                >
                    <span class="month-cal__solar">18</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-19"
                    data-solar="19"
                    data-status="good holiday"
                    title="19/02/2026 - Mùng 3 Tết Nguyên Đán"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-20"
                    data-solar="20"
                    title="20/02/2026"
                >
                    <span class="month-cal__solar">20</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-21"
                    data-solar="21"
                    data-status="good"
                    title="21/02/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">21</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-22"
                    data-solar="22"
                    title="22/02/2026"
                >
                    <span class="month-cal__solar">22</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-23"
                    data-solar="23"
                    title="23/02/2026"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-24"
                    data-solar="24"
                    data-status="good"
                    title="24/02/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-25"
                    data-solar="25"
                    data-status="holiday"
                    title="25/02/2026 - Mùng 9 Vía Ngọc Hoàng"
                >
                    <span class="month-cal__solar">25</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-26"
                    data-solar="26"
                    data-status="good holiday"
                    title="26/02/2026 - Ngày vía Thần Tài (Mùng 10 tháng Giêng)"
                >
                    <span class="month-cal__solar">26</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-27"
                    data-solar="27"
                    data-status="holiday"
                    title="27/02/2026 - Ngày Thầy thuốc Việt Nam"
                >
                    <span class="month-cal__solar">27</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-02-28"
                    data-solar="28"
                    title="28/02/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-01"
                    data-solar="1"
                    title="01/03/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-02"
                    data-solar="2"
                    title="02/03/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-03"
                    data-solar="3"
                    title="03/03/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-04"
                    data-solar="4"
                    title="04/03/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-05"
                    data-solar="5"
                    title="05/03/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-06"
                    data-solar="6"
                    title="06/03/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-07"
                    data-solar="7"
                    title="07/03/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-08"
                    data-solar="8"
                    title="08/03/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 3 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="3" data-year="2026" aria-label="Tháng 3 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 3</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 3">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-23"
                    data-solar="23"
                    title="23/02/2026"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-24"
                    data-solar="24"
                    title="24/02/2026"
                >
                    <span class="month-cal__solar">24</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-25"
                    data-solar="25"
                    title="25/02/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-26"
                    data-solar="26"
                    title="26/02/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-27"
                    data-solar="27"
                    title="27/02/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-02-28"
                    data-solar="28"
                    title="28/02/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-01"
                    data-solar="1"
                    title="01/03/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-02"
                    data-solar="2"
                    title="02/03/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-03"
                    data-solar="3"
                    data-status="good holiday"
                    title="03/03/2026 - Rằm tháng Giêng (Tết Nguyên Tiêu)"
                >
                    <span class="month-cal__solar">3</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-04"
                    data-solar="4"
                    data-status="good"
                    title="04/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">4</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-05"
                    data-solar="5"
                    title="05/03/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-06"
                    data-solar="6"
                    title="06/03/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-07"
                    data-solar="7"
                    title="07/03/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-08"
                    data-solar="8"
                    data-status="holiday"
                    title="08/03/2026 - Quốc tế Phụ nữ"
                >
                    <span class="month-cal__solar">8</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-09"
                    data-solar="9"
                    data-status="good"
                    title="09/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">9</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-10"
                    data-solar="10"
                    data-status="good"
                    title="10/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">10</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-11"
                    data-solar="11"
                    title="11/03/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-12"
                    data-solar="12"
                    title="12/03/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-13"
                    data-solar="13"
                    title="13/03/2026"
                >
                    <span class="month-cal__solar">13</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-14"
                    data-solar="14"
                    title="14/03/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-15"
                    data-solar="15"
                    data-status="good"
                    title="15/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">15</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-16"
                    data-solar="16"
                    data-status="good"
                    title="16/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">16</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-17"
                    data-solar="17"
                    data-status="good"
                    title="17/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-18"
                    data-solar="18"
                    title="18/03/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-19"
                    data-solar="19"
                    data-status="holiday"
                    title="19/03/2026 - Mùng 1 tháng 2 ÂL"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-20"
                    data-solar="20"
                    title="20/03/2026 - Xuân Phân"
                >
                    <span class="month-cal__solar">20</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-21"
                    data-solar="21"
                    data-status="good holiday"
                    title="21/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">21</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-22"
                    data-solar="22"
                    data-status="good"
                    title="22/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">22</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-23"
                    data-solar="23"
                    title="23/03/2026"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-24"
                    data-solar="24"
                    data-status="good"
                    title="24/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-25"
                    data-solar="25"
                    title="25/03/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-26"
                    data-solar="26"
                    data-status="holiday"
                    title="26/03/2026 - Ngày thành lập Đoàn TNCS Hồ Chí Minh"
                >
                    <span class="month-cal__solar">26</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-27"
                    data-solar="27"
                    data-status="good"
                    title="27/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">27</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-28"
                    data-solar="28"
                    title="28/03/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-29"
                    data-solar="29"
                    data-status="good"
                    title="29/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">29</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-30"
                    data-solar="30"
                    data-status="good"
                    title="30/03/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">30</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-03-31"
                    data-solar="31"
                    title="31/03/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-01"
                    data-solar="1"
                    title="01/04/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-02"
                    data-solar="2"
                    title="02/04/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-03"
                    data-solar="3"
                    title="03/04/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-04"
                    data-solar="4"
                    title="04/04/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-05"
                    data-solar="5"
                    title="05/04/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 4 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="4" data-year="2026" aria-label="Tháng 4 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 4</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 4">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-30"
                    data-solar="30"
                    title="30/03/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-03-31"
                    data-solar="31"
                    title="31/03/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-01"
                    data-solar="1"
                    data-status="holiday"
                    title="01/04/2026 - Cá Tháng Tư"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-02"
                    data-solar="2"
                    data-status="good"
                    title="02/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">2</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-03"
                    data-solar="3"
                    data-status="good"
                    title="03/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">3</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-04"
                    data-solar="4"
                    title="04/04/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-05"
                    data-solar="5"
                    data-status="good"
                    title="05/04/2026 - Tiết Thanh Minh (Hoàng Đạo)"
                >
                    <span class="month-cal__solar">5</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-06"
                    data-solar="6"
                    data-status="holiday"
                    title="06/04/2026"
                >
                    <span class="month-cal__solar">6</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-07"
                    data-solar="7"
                    title="07/04/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-08"
                    data-solar="8"
                    title="08/04/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-09"
                    data-solar="9"
                    title="09/04/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-10"
                    data-solar="10"
                    data-status="good"
                    title="10/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">10</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-11"
                    data-solar="11"
                    title="11/04/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-12"
                    data-solar="12"
                    title="12/04/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-13"
                    data-solar="13"
                    title="13/04/2026"
                >
                    <span class="month-cal__solar">13</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-14"
                    data-solar="14"
                    data-status="good"
                    title="14/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">14</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-15"
                    data-solar="15"
                    data-status="good"
                    title="15/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">15</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-16"
                    data-solar="16"
                    title="16/04/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-17"
                    data-solar="17"
                    data-status="holiday"
                    title="17/04/2026 - Mùng 1 tháng 3 ÂL"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-18"
                    data-solar="18"
                    title="18/04/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-19"
                    data-solar="19"
                    data-status="holiday"
                    title="19/04/2026 - Tết Hàn Thực (3/3 ÂL)"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-20"
                    data-solar="20"
                    title="20/04/2026"
                >
                    <span class="month-cal__solar">20</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-21"
                    data-solar="21"
                    data-status="holiday"
                    title="21/04/2026 - Ngày Sách Việt Nam"
                >
                    <span class="month-cal__solar">21</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-22"
                    data-solar="22"
                    title="22/04/2026"
                >
                    <span class="month-cal__solar">22</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-23"
                    data-solar="23"
                    data-status="good"
                    title="23/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">23</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-24"
                    data-solar="24"
                    title="24/04/2026"
                >
                    <span class="month-cal__solar">24</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-25"
                    data-solar="25"
                    title="25/04/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-26"
                    data-solar="26"
                    data-status="holiday"
                    title="26/04/2026 - Giỗ Tổ Hùng Vương (10/3 ÂL)"
                >
                    <span class="month-cal__solar">26</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-27"
                    data-solar="27"
                    title="27/04/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-28"
                    data-solar="28"
                    data-status="good"
                    title="28/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">28</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-29"
                    data-solar="29"
                    data-status="good"
                    title="29/04/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">29</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-04-30"
                    data-solar="30"
                    data-status="holiday"
                    title="30/04/2026 - Ngày Giải phóng miền Nam"
                >
                    <span class="month-cal__solar">30</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-01"
                    data-solar="1"
                    title="01/05/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-02"
                    data-solar="2"
                    title="02/05/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-03"
                    data-solar="3"
                    title="03/05/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-04"
                    data-solar="4"
                    title="04/05/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-05"
                    data-solar="5"
                    title="05/05/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-06"
                    data-solar="6"
                    title="06/05/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-07"
                    data-solar="7"
                    title="07/05/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-08"
                    data-solar="8"
                    title="08/05/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-09"
                    data-solar="9"
                    title="09/05/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-05-10"
                    data-solar="10"
                    title="10/05/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 5 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="5" data-year="2026" aria-label="Tháng 5 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 5</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 5">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-27"
                    data-solar="27"
                    title="27/04/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-28"
                    data-solar="28"
                    title="28/04/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-29"
                    data-solar="29"
                    title="29/04/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-04-30"
                    data-solar="30"
                    title="30/04/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-01"
                    data-solar="1"
                    data-status="good holiday"
                    title="01/05/2026 - Quốc tế Lao động"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-02"
                    data-solar="2"
                    title="02/05/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-03"
                    data-solar="3"
                    title="03/05/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-04"
                    data-solar="4"
                    title="04/05/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-05"
                    data-solar="5"
                    title="05/05/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-06"
                    data-solar="6"
                    data-status="good"
                    title="06/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">6</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-07"
                    data-solar="7"
                    data-status="holiday"
                    title="07/05/2026 - Chiến thắng Điện Biên Phủ"
                >
                    <span class="month-cal__solar">7</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-08"
                    data-solar="8"
                    title="08/05/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-09"
                    data-solar="9"
                    title="09/05/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-10"
                    data-solar="10"
                    title="10/05/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-11"
                    data-solar="11"
                    data-status="good"
                    title="11/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">11</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-12"
                    data-solar="12"
                    title="12/05/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-13"
                    data-solar="13"
                    data-status="good"
                    title="13/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">13</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-14"
                    data-solar="14"
                    title="14/05/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-15"
                    data-solar="15"
                    title="15/05/2026"
                >
                    <span class="month-cal__solar">15</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-16"
                    data-solar="16"
                    title="16/05/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-17"
                    data-solar="17"
                    data-status="holiday"
                    title="17/05/2026 - Mùng 1 tháng 4 ÂL"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-18"
                    data-solar="18"
                    title="18/05/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-19"
                    data-solar="19"
                    data-status="holiday"
                    title="19/05/2026 - Ngày sinh Chủ tịch Hồ Chí Minh"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-20"
                    data-solar="20"
                    data-status="good"
                    title="20/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">20</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-21"
                    data-solar="21"
                    title="21/05/2026"
                >
                    <span class="month-cal__solar">21</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-22"
                    data-solar="22"
                    title="22/05/2026"
                >
                    <span class="month-cal__solar">22</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-23"
                    data-solar="23"
                    data-status="good"
                    title="23/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">23</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-24"
                    data-solar="24"
                    title="24/05/2026"
                >
                    <span class="month-cal__solar">24</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-25"
                    data-solar="25"
                    data-status="good"
                    title="25/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">25</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-26"
                    data-solar="26"
                    title="26/05/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-27"
                    data-solar="27"
                    data-status="good"
                    title="27/05/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">27</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-28"
                    data-solar="28"
                    title="28/05/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-29"
                    data-solar="29"
                    title="29/05/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-30"
                    data-solar="30"
                    title="30/05/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-05-31"
                    data-solar="31"
                    data-status="holiday"
                    title="31/05/2026 - Đại lễ Phật Đản (15/4 ÂL)"
                >
                    <span class="month-cal__solar">31</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-01"
                    data-solar="1"
                    title="01/06/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-02"
                    data-solar="2"
                    title="02/06/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-03"
                    data-solar="3"
                    title="03/06/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-04"
                    data-solar="4"
                    title="04/06/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-05"
                    data-solar="5"
                    title="05/06/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-06"
                    data-solar="6"
                    title="06/06/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-07"
                    data-solar="7"
                    title="07/06/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 6 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="6" data-year="2026" aria-label="Tháng 6 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 6</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 6">
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-01"
                    data-solar="1"
                    data-status="good holiday"
                    title="01/06/2026 - Quốc tế Thiếu nhi"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-02"
                    data-solar="2"
                    title="02/06/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-03"
                    data-solar="3"
                    title="03/06/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-04"
                    data-solar="4"
                    data-status="good"
                    title="04/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">4</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-05"
                    data-solar="5"
                    title="05/06/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-06"
                    data-solar="6"
                    title="06/06/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-07"
                    data-solar="7"
                    title="07/06/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-08"
                    data-solar="8"
                    data-status="good"
                    title="08/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">8</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-09"
                    data-solar="9"
                    title="09/06/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-10"
                    data-solar="10"
                    title="10/06/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-11"
                    data-solar="11"
                    title="11/06/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-12"
                    data-solar="12"
                    title="12/06/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-13"
                    data-solar="13"
                    data-status="good"
                    title="13/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">13</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-14"
                    data-solar="14"
                    title="14/06/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-15"
                    data-solar="15"
                    data-status="good holiday"
                    title="15/06/2026 - Mùng 1 tháng 5 ÂL"
                >
                    <span class="month-cal__solar">15</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-16"
                    data-solar="16"
                    data-status="good"
                    title="16/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">16</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-17"
                    data-solar="17"
                    title="17/06/2026"
                >
                    <span class="month-cal__solar">17</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-18"
                    data-solar="18"
                    title="18/06/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-19"
                    data-solar="19"
                    data-status="holiday"
                    title="19/06/2026 - Tết Đoan Ngọ (5/5 ÂL)"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-20"
                    data-solar="20"
                    data-status="good"
                    title="20/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">20</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-21"
                    data-solar="21"
                    data-status="holiday"
                    title="21/06/2026 - Ngày Báo chí Cách mạng VN / Hạ Chí"
                >
                    <span class="month-cal__solar">21</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-22"
                    data-solar="22"
                    data-status="good"
                    title="22/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">22</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-23"
                    data-solar="23"
                    title="23/06/2026"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-24"
                    data-solar="24"
                    title="24/06/2026"
                >
                    <span class="month-cal__solar">24</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-25"
                    data-solar="25"
                    title="25/06/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-26"
                    data-solar="26"
                    data-status="good"
                    title="26/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">26</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-27"
                    data-solar="27"
                    data-status="good"
                    title="27/06/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">27</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-28"
                    data-solar="28"
                    data-status="holiday"
                    title="28/06/2026 - Ngày Gia đình Việt Nam"
                >
                    <span class="month-cal__solar">28</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-29"
                    data-solar="29"
                    data-status="holiday"
                    title="29/06/2026 - Rằm tháng 5 ÂL"
                >
                    <span class="month-cal__solar">29</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-06-30"
                    data-solar="30"
                    title="30/06/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-01"
                    data-solar="1"
                    title="01/07/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-02"
                    data-solar="2"
                    title="02/07/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-03"
                    data-solar="3"
                    title="03/07/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-04"
                    data-solar="4"
                    title="04/07/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-05"
                    data-solar="5"
                    title="05/07/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-06"
                    data-solar="6"
                    title="06/07/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-07"
                    data-solar="7"
                    title="07/07/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-08"
                    data-solar="8"
                    title="08/07/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-09"
                    data-solar="9"
                    title="09/07/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-10"
                    data-solar="10"
                    title="10/07/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-11"
                    data-solar="11"
                    title="11/07/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-12"
                    data-solar="12"
                    title="12/07/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 7 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="7" data-year="2026" aria-label="Tháng 7 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 7</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 7">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-29"
                    data-solar="29"
                    title="29/06/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-06-30"
                    data-solar="30"
                    title="30/06/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-01"
                    data-solar="1"
                    title="01/07/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-02"
                    data-solar="2"
                    data-status="good"
                    title="02/07/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">2</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-03"
                    data-solar="3"
                    title="03/07/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-04"
                    data-solar="4"
                    data-status="good"
                    title="04/07/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">4</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-05"
                    data-solar="5"
                    title="05/07/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-06"
                    data-solar="6"
                    title="06/07/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-07"
                    data-solar="7"
                    title="07/07/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-08"
                    data-solar="8"
                    title="08/07/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-09"
                    data-solar="9"
                    data-status="good"
                    title="09/07/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">9</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-10"
                    data-solar="10"
                    title="10/07/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-11"
                    data-solar="11"
                    data-status="good"
                    title="11/07/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">11</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-12"
                    data-solar="12"
                    title="12/07/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-13"
                    data-solar="13"
                    title="13/07/2026"
                >
                    <span class="month-cal__solar">13</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-14"
                    data-solar="14"
                    data-status="holiday"
                    title="14/07/2026 - Mùng 1 tháng 6 ÂL"
                >
                    <span class="month-cal__solar">14</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-15"
                    data-solar="15"
                    title="15/07/2026"
                >
                    <span class="month-cal__solar">15</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-16"
                    data-solar="16"
                    data-status="good"
                    title="16/07/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">16</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-17"
                    data-solar="17"
                    title="17/07/2026"
                >
                    <span class="month-cal__solar">17</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-18"
                    data-solar="18"
                    title="18/07/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-19"
                    data-solar="19"
                    title="19/07/2026"
                >
                    <span class="month-cal__solar">19</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-20"
                    data-solar="20"
                    title="20/07/2026"
                >
                    <span class="month-cal__solar">20</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-21"
                    data-solar="21"
                    title="21/07/2026"
                >
                    <span class="month-cal__solar">21</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-22"
                    data-solar="22"
                    data-status="good"
                    title="22/07/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">22</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-23"
                    data-solar="23"
                    title="23/07/2026 - Đại Thử"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-24"
                    data-solar="24"
                    title="24/07/2026"
                >
                    <span class="month-cal__solar">24</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-25"
                    data-solar="25"
                    title="25/07/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-26"
                    data-solar="26"
                    title="26/07/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-27"
                    data-solar="27"
                    data-status="holiday"
                    title="27/07/2026 - Ngày Thương binh Liệt sĩ"
                >
                    <span class="month-cal__solar">27</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-28"
                    data-solar="28"
                    data-status="good holiday"
                    title="28/07/2026 - Rằm tháng 6 ÂL / Ngày Công đoàn VN"
                >
                    <span class="month-cal__solar">28</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-29"
                    data-solar="29"
                    title="29/07/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-30"
                    data-solar="30"
                    title="30/07/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-07-31"
                    data-solar="31"
                    title="31/07/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-01"
                    data-solar="1"
                    title="01/08/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-02"
                    data-solar="2"
                    title="02/08/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-03"
                    data-solar="3"
                    title="03/08/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-04"
                    data-solar="4"
                    title="04/08/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-05"
                    data-solar="5"
                    title="05/08/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-06"
                    data-solar="6"
                    title="06/08/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-07"
                    data-solar="7"
                    title="07/08/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-08"
                    data-solar="8"
                    title="08/08/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-09"
                    data-solar="9"
                    title="09/08/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 8 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="8" data-year="2026" aria-label="Tháng 8 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 8</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 8">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-27"
                    data-solar="27"
                    title="27/07/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-28"
                    data-solar="28"
                    title="28/07/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-29"
                    data-solar="29"
                    title="29/07/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-30"
                    data-solar="30"
                    title="30/07/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-07-31"
                    data-solar="31"
                    title="31/07/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-01"
                    data-solar="1"
                    data-status="holiday"
                    title="01/08/2026"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-02"
                    data-solar="2"
                    title="02/08/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-03"
                    data-solar="3"
                    title="03/08/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-04"
                    data-solar="4"
                    data-status="good"
                    title="04/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">4</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-05"
                    data-solar="5"
                    title="05/08/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-06"
                    data-solar="6"
                    title="06/08/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-07"
                    data-solar="7"
                    title="07/08/2026 - Lập Thu"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-08"
                    data-solar="8"
                    title="08/08/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-09"
                    data-solar="9"
                    data-status="good"
                    title="09/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">9</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-10"
                    data-solar="10"
                    title="10/08/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-11"
                    data-solar="11"
                    title="11/08/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-12"
                    data-solar="12"
                    title="12/08/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-13"
                    data-solar="13"
                    data-status="holiday"
                    title="13/08/2026 - Mùng 1 tháng 7 ÂL"
                >
                    <span class="month-cal__solar">13</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-14"
                    data-solar="14"
                    title="14/08/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-15"
                    data-solar="15"
                    data-status="good"
                    title="15/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">15</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-16"
                    data-solar="16"
                    title="16/08/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-17"
                    data-solar="17"
                    title="17/08/2026"
                >
                    <span class="month-cal__solar">17</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-18"
                    data-solar="18"
                    data-status="good"
                    title="18/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">18</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-19"
                    data-solar="19"
                    data-status="holiday"
                    title="19/08/2026 - Cách mạng tháng Tám thành công"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-20"
                    data-solar="20"
                    title="20/08/2026"
                >
                    <span class="month-cal__solar">20</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-21"
                    data-solar="21"
                    data-status="good"
                    title="21/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">21</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-22"
                    data-solar="22"
                    title="22/08/2026"
                >
                    <span class="month-cal__solar">22</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-23"
                    data-solar="23"
                    title="23/08/2026 - Xử Thử"
                >
                    <span class="month-cal__solar">23</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-24"
                    data-solar="24"
                    data-status="good"
                    title="24/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-25"
                    data-solar="25"
                    data-status="good"
                    title="25/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">25</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-26"
                    data-solar="26"
                    title="26/08/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-27"
                    data-solar="27"
                    data-status="holiday"
                    title="27/08/2026 - Lễ Vu Lan (Rằm tháng 7 ÂL)"
                >
                    <span class="month-cal__solar">27</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-28"
                    data-solar="28"
                    title="28/08/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-29"
                    data-solar="29"
                    title="29/08/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-30"
                    data-solar="30"
                    data-status="good"
                    title="30/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">30</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-08-31"
                    data-solar="31"
                    data-status="good"
                    title="31/08/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">31</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-01"
                    data-solar="1"
                    title="01/09/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-02"
                    data-solar="2"
                    title="02/09/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-03"
                    data-solar="3"
                    title="03/09/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-04"
                    data-solar="4"
                    title="04/09/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-05"
                    data-solar="5"
                    title="05/09/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-06"
                    data-solar="6"
                    title="06/09/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 9 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="9" data-year="2026" aria-label="Tháng 9 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 9</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 9">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-08-31"
                    data-solar="31"
                    title="31/08/2026"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-01"
                    data-solar="1"
                    title="01/09/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-02"
                    data-solar="2"
                    data-status="holiday"
                    title="02/09/2026 - Quốc khánh nước CHXHCN Việt Nam"
                >
                    <span class="month-cal__solar">2</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-03"
                    data-solar="3"
                    title="03/09/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-04"
                    data-solar="4"
                    title="04/09/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-05"
                    data-solar="5"
                    data-status="good holiday"
                    title="05/09/2026 - Ngày Khai giảng năm học mới"
                >
                    <span class="month-cal__solar">5</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-06"
                    data-solar="6"
                    data-status="good"
                    title="06/09/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">6</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-07"
                    data-solar="7"
                    title="07/09/2026 - Bạch Lộ"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-08"
                    data-solar="8"
                    title="08/09/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-09"
                    data-solar="9"
                    title="09/09/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-10"
                    data-solar="10"
                    data-status="holiday"
                    title="10/09/2026 - Ngày thành lập Mặt trận Tổ quốc VN"
                >
                    <span class="month-cal__solar">10</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-11"
                    data-solar="11"
                    data-status="holiday"
                    title="11/09/2026 - Mùng 1 tháng 8 ÂL"
                >
                    <span class="month-cal__solar">11</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-12"
                    data-solar="12"
                    title="12/09/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-13"
                    data-solar="13"
                    data-status="good"
                    title="13/09/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">13</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-14"
                    data-solar="14"
                    title="14/09/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-15"
                    data-solar="15"
                    title="15/09/2026"
                >
                    <span class="month-cal__solar">15</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-16"
                    data-solar="16"
                    title="16/09/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-17"
                    data-solar="17"
                    title="17/09/2026"
                >
                    <span class="month-cal__solar">17</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-18"
                    data-solar="18"
                    data-status="good"
                    title="18/09/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">18</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-19"
                    data-solar="19"
                    title="19/09/2026"
                >
                    <span class="month-cal__solar">19</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-20"
                    data-solar="20"
                    data-status="good"
                    title="20/09/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">20</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-21"
                    data-solar="21"
                    title="21/09/2026"
                >
                    <span class="month-cal__solar">21</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-22"
                    data-solar="22"
                    title="22/09/2026"
                >
                    <span class="month-cal__solar">22</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-23"
                    data-solar="23"
                    title="23/09/2026 - Thu Phân"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-24"
                    data-solar="24"
                    title="24/09/2026"
                >
                    <span class="month-cal__solar">24</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-25"
                    data-solar="25"
                    data-status="good holiday"
                    title="25/09/2026 - Tết Trung Thu (Rằm tháng 8 ÂL)"
                >
                    <span class="month-cal__solar">25</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-26"
                    data-solar="26"
                    data-status="good"
                    title="26/09/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">26</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-27"
                    data-solar="27"
                    title="27/09/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-28"
                    data-solar="28"
                    title="28/09/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-29"
                    data-solar="29"
                    title="29/09/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-09-30"
                    data-solar="30"
                    data-status="good"
                    title="30/09/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">30</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-01"
                    data-solar="1"
                    title="01/10/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-02"
                    data-solar="2"
                    title="02/10/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-03"
                    data-solar="3"
                    title="03/10/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-04"
                    data-solar="4"
                    title="04/10/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-05"
                    data-solar="5"
                    title="05/10/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-06"
                    data-solar="6"
                    title="06/10/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-07"
                    data-solar="7"
                    title="07/10/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-08"
                    data-solar="8"
                    title="08/10/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-09"
                    data-solar="9"
                    title="09/10/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-10"
                    data-solar="10"
                    title="10/10/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-11"
                    data-solar="11"
                    title="11/10/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 10 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="10" data-year="2026" aria-label="Tháng 10 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 10</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 10">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-28"
                    data-solar="28"
                    title="28/09/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-29"
                    data-solar="29"
                    title="29/09/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-09-30"
                    data-solar="30"
                    title="30/09/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-01"
                    data-solar="1"
                    data-status="good holiday"
                    title="01/10/2026 - Quốc tế Người cao tuổi"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-02"
                    data-solar="2"
                    data-status="good"
                    title="02/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">2</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-03"
                    data-solar="3"
                    title="03/10/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-04"
                    data-solar="4"
                    title="04/10/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-05"
                    data-solar="5"
                    title="05/10/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-06"
                    data-solar="6"
                    title="06/10/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-07"
                    data-solar="7"
                    data-status="good"
                    title="07/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">7</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-08"
                    data-solar="8"
                    title="08/10/2026 - Hàn Lộ"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-09"
                    data-solar="9"
                    title="09/10/2026"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-10"
                    data-solar="10"
                    data-status="holiday"
                    title="10/10/2026 - Ngày Giải phóng Thủ đô / Mùng 1 tháng 9 ÂL"
                >
                    <span class="month-cal__solar">10</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-11"
                    data-solar="11"
                    title="11/10/2026"
                >
                    <span class="month-cal__solar">11</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-12"
                    data-solar="12"
                    data-status="good"
                    title="12/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">12</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-13"
                    data-solar="13"
                    data-status="holiday"
                    title="13/10/2026 - Ngày Doanh nhân Việt Nam"
                >
                    <span class="month-cal__solar">13</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-14"
                    data-solar="14"
                    data-status="good"
                    title="14/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">14</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-15"
                    data-solar="15"
                    title="15/10/2026"
                >
                    <span class="month-cal__solar">15</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-16"
                    data-solar="16"
                    title="16/10/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-17"
                    data-solar="17"
                    title="17/10/2026"
                >
                    <span class="month-cal__solar">17</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-18"
                    data-solar="18"
                    data-status="holiday"
                    title="18/10/2026 - Tết Trùng Cửu (9/9 ÂL)"
                >
                    <span class="month-cal__solar">18</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-19"
                    data-solar="19"
                    title="19/10/2026"
                >
                    <span class="month-cal__solar">19</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-20"
                    data-solar="20"
                    data-status="holiday"
                    title="20/10/2026 - Ngày Phụ nữ Việt Nam"
                >
                    <span class="month-cal__solar">20</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-21"
                    data-solar="21"
                    data-status="good"
                    title="21/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">21</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-22"
                    data-solar="22"
                    title="22/10/2026"
                >
                    <span class="month-cal__solar">22</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-23"
                    data-solar="23"
                    title="23/10/2026 - Sương Giáng"
                >
                    <span class="month-cal__solar">23</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-24"
                    data-solar="24"
                    data-status="holiday"
                    title="24/10/2026 - Rằm tháng 9 ÂL"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-25"
                    data-solar="25"
                    title="25/10/2026"
                >
                    <span class="month-cal__solar">25</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-26"
                    data-solar="26"
                    data-status="good"
                    title="26/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">26</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-27"
                    data-solar="27"
                    title="27/10/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-28"
                    data-solar="28"
                    data-status="good holiday"
                    title="28/10/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">28</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-29"
                    data-solar="29"
                    title="29/10/2026"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-30"
                    data-solar="30"
                    title="30/10/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-10-31"
                    data-solar="31"
                    data-status="holiday"
                    title="31/10/2026 - Lễ hội Halloween"
                >
                    <span class="month-cal__solar">31</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-01"
                    data-solar="1"
                    title="01/11/2026"
                >
                    <span class="month-cal__solar">1</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-02"
                    data-solar="2"
                    title="02/11/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-03"
                    data-solar="3"
                    title="03/11/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-04"
                    data-solar="4"
                    title="04/11/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted month-cal__cell--today"
                    tabindex="-1"
                    data-date="2026-11-05"
                    data-solar="5"
                    data-status="today"
                    title="05/11/2026"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-06"
                    data-solar="6"
                    title="06/11/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-07"
                    data-solar="7"
                    title="07/11/2026"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-08"
                    data-solar="8"
                    title="08/11/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 11 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="11" data-year="2026" aria-label="Tháng 11 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 11</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 11">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-26"
                    data-solar="26"
                    data-status="good"
                    title="26/10/2026 (17/9 ÂL)"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-27"
                    data-solar="27"
                    data-status="bad"
                    title="27/10/2026 (18/9 ÂL)"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-28"
                    data-solar="28"
                    data-status="good holiday"
                    title="28/10/2026 (19/9 ÂL)"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-29"
                    data-solar="29"
                    title="29/10/2026 (20/9 ÂL)"
                >
                    <span class="month-cal__solar">29</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-30"
                    data-solar="30"
                    data-status="bad"
                    title="30/10/2026 (21/9 ÂL)"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-10-31"
                    data-solar="31"
                    title="31/10/2026 (22/9 ÂL)"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-01"
                    data-solar="1"
                    title="01/11/2026 (23/9 ÂL)"
                >
                    <span class="month-cal__solar">1</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-02"
                    data-solar="2"
                    data-status="good"
                    title="02/11/2026 (24/9 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">2</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-03"
                    data-solar="3"
                    title="03/11/2026 (25/9 ÂL)"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-04"
                    data-solar="4"
                    data-status="good"
                    title="04/11/2026 (26/9 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">4</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--today month-cal__cell--active"
                    tabindex="0"
                    aria-current="date"
                    data-date="2026-11-05"
                    data-solar="5"
                    data-status="bad today"
                    title="Hôm nay: 05/11/2026 (27/9 ÂL)"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-06"
                    data-solar="6"
                    title="06/11/2026 (28/9 ÂL)"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-07"
                    data-solar="7"
                    data-status="good"
                    title="07/11/2026 (29/9 ÂL) - Lập Đông / Hoàng Đạo"
                >
                    <span class="month-cal__solar">7</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-08"
                    data-solar="8"
                    data-status="bad"
                    title="08/11/2026 (30/9 ÂL)"
                >
                    <span class="month-cal__solar">8</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-09"
                    data-solar="9"
                    data-status="holiday"
                    title="09/11/2026 (Mùng 1/10 ÂL) - Ngày Pháp luật VN"
                >
                    <span class="month-cal__solar">9</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-10"
                    data-solar="10"
                    data-status="bad"
                    title="10/11/2026 (2/10 ÂL)"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-11"
                    data-solar="11"
                    data-status="good"
                    title="11/11/2026 (3/10 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">11</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-12"
                    data-solar="12"
                    title="12/11/2026 (4/10 ÂL)"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-13"
                    data-solar="13"
                    data-status="bad"
                    title="13/11/2026 (5/10 ÂL)"
                >
                    <span class="month-cal__solar">13</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-14"
                    data-solar="14"
                    title="14/11/2026 (6/10 ÂL)"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-15"
                    data-solar="15"
                    title="15/11/2026 (7/10 ÂL)"
                >
                    <span class="month-cal__solar">15</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-16"
                    data-solar="16"
                    data-status="good"
                    title="16/11/2026 (8/10 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">16</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-17"
                    data-solar="17"
                    data-status="good"
                    title="17/11/2026 (9/10 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-18"
                    data-solar="18"
                    data-status="holiday"
                    title="18/11/2026 (10/10 ÂL) - Ngày hội Đại đoàn kết toàn dân tộc"
                >
                    <span class="month-cal__solar">18</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-19"
                    data-solar="19"
                    data-status="good"
                    title="19/11/2026 (11/10 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">19</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-20"
                    data-solar="20"
                    data-status="holiday"
                    title="20/11/2026 (12/10 ÂL) - Ngày Nhà giáo Việt Nam"
                >
                    <span class="month-cal__solar">20</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-21"
                    data-solar="21"
                    data-status="bad"
                    title="21/11/2026 (13/10 ÂL)"
                >
                    <span class="month-cal__solar">21</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-22"
                    data-solar="22"
                    title="22/11/2026 (14/10 ÂL) - Tiểu Tuyết"
                >
                    <span class="month-cal__solar">22</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-23"
                    data-solar="23"
                    data-status="good holiday"
                    title="23/11/2026 (Rằm 15/10 ÂL) - Tết Hạ Nguyên"
                >
                    <span class="month-cal__solar">23</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-24"
                    data-solar="24"
                    data-status="holiday"
                    title="24/11/2026 (16/10 ÂL)"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-25"
                    data-solar="25"
                    data-status="bad"
                    title="25/11/2026 (17/10 ÂL)"
                >
                    <span class="month-cal__solar">25</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-26"
                    data-solar="26"
                    title="26/11/2026 (18/10 ÂL)"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-27"
                    data-solar="27"
                    title="27/11/2026 (19/10 ÂL)"
                >
                    <span class="month-cal__solar">27</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-28"
                    data-solar="28"
                    data-status="good"
                    title="28/11/2026 (20/10 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">28</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-29"
                    data-solar="29"
                    data-status="good"
                    title="29/11/2026 (21/10 ÂL) - Hoàng Đạo"
                >
                    <span class="month-cal__solar">29</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-11-30"
                    data-solar="30"
                    title="30/11/2026 (22/10 ÂL)"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-12-01"
                    data-solar="1"
                    data-status="good"
                    title="01/12/2026 (23/10 ÂL)"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-12-02"
                    data-solar="2"
                    title="02/12/2026 (24/10 ÂL)"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-12-03"
                    data-solar="3"
                    title="03/12/2026 (25/10 ÂL)"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-12-04"
                    data-solar="4"
                    data-status="bad"
                    title="04/12/2026 (26/10 ÂL)"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-12-05"
                    data-solar="5"
                    title="05/12/2026 (27/10 ÂL)"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-12-06"
                    data-solar="6"
                    title="06/12/2026 (28/10 ÂL)"
                >
                    <span class="month-cal__solar">6</span>
                </button>
            </div>
        </article>

        <!-- ==================== THÁNG 12 / 2026 ==================== -->
        <article class="month-cal month-cal--mini" data-month="12" data-year="2026" aria-label="Tháng 12 năm 2026">
            <h2 class="month-cal__mini-title">Tháng 12</h2>
            <div class="month-cal__weekdays" role="row">
                <span class="month-cal__weekday" role="columnheader" title="Thứ Hai">Hai</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Ba">Ba</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Tư">Tư</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Năm">Năm</span>
                <span class="month-cal__weekday" role="columnheader" title="Thứ Sáu">Sáu</span>
                <span class="month-cal__weekday month-cal__weekday--sat" role="columnheader" title="Thứ Bảy">Bảy</span>
                <span class="month-cal__weekday month-cal__weekday--sun" role="columnheader" title="Chủ Nhật">CN</span>
            </div>
            <div class="month-cal__grid" role="group" aria-label="Các ngày trong Tháng 12">
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2026-11-30"
                    data-solar="30"
                    title="30/11/2026"
                >
                    <span class="month-cal__solar">30</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-01"
                    data-solar="1"
                    data-status="good"
                    title="01/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">1</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-02"
                    data-solar="2"
                    title="02/12/2026"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-03"
                    data-solar="3"
                    title="03/12/2026"
                >
                    <span class="month-cal__solar">3</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-04"
                    data-solar="4"
                    title="04/12/2026"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-05"
                    data-solar="5"
                    data-status="good"
                    title="05/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">5</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-06"
                    data-solar="6"
                    title="06/12/2026"
                >
                    <span class="month-cal__solar">6</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-07"
                    data-solar="7"
                    title="07/12/2026 - Đại Tuyết"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-08"
                    data-solar="8"
                    title="08/12/2026"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-09"
                    data-solar="9"
                    data-status="holiday"
                    title="09/12/2026 - Mùng 1 tháng 11 ÂL"
                >
                    <span class="month-cal__solar">9</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-10"
                    data-solar="10"
                    title="10/12/2026"
                >
                    <span class="month-cal__solar">10</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-11"
                    data-solar="11"
                    data-status="good"
                    title="11/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">11</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-12"
                    data-solar="12"
                    title="12/12/2026"
                >
                    <span class="month-cal__solar">12</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-13"
                    data-solar="13"
                    data-status="good"
                    title="13/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">13</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-14"
                    data-solar="14"
                    title="14/12/2026"
                >
                    <span class="month-cal__solar">14</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-15"
                    data-solar="15"
                    title="15/12/2026"
                >
                    <span class="month-cal__solar">15</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-16"
                    data-solar="16"
                    title="16/12/2026"
                >
                    <span class="month-cal__solar">16</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-17"
                    data-solar="17"
                    data-status="good"
                    title="17/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">17</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-18"
                    data-solar="18"
                    title="18/12/2026"
                >
                    <span class="month-cal__solar">18</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-19"
                    data-solar="19"
                    title="19/12/2026 - Ngày Toàn quốc kháng chiến"
                >
                    <span class="month-cal__solar">19</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-20"
                    data-solar="20"
                    title="20/12/2026"
                >
                    <span class="month-cal__solar">20</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-21"
                    data-solar="21"
                    title="21/12/2026"
                >
                    <span class="month-cal__solar">21</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-22"
                    data-solar="22"
                    data-status="holiday"
                    title="22/12/2026 - Ngày thành lập QĐND Việt Nam / Đông Chí"
                >
                    <span class="month-cal__solar">22</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-23"
                    data-solar="23"
                    data-status="good holiday"
                    title="23/12/2026 - Rằm tháng 11 ÂL (Hoàng Đạo)"
                >
                    <span class="month-cal__solar">23</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-24"
                    data-solar="24"
                    data-status="holiday"
                    title="24/12/2026 - Đêm Giáng Sinh"
                >
                    <span class="month-cal__solar">24</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-25"
                    data-solar="25"
                    data-status="holiday"
                    title="25/12/2026 - Lễ Giáng Sinh (Noel)"
                >
                    <span class="month-cal__solar">25</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--holiday"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-26"
                    data-solar="26"
                    title="26/12/2026"
                >
                    <span class="month-cal__solar">26</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-27"
                    data-solar="27"
                    title="27/12/2026"
                >
                    <span class="month-cal__solar">27</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-28"
                    data-solar="28"
                    title="28/12/2026"
                >
                    <span class="month-cal__solar">28</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-29"
                    data-solar="29"
                    data-status="good"
                    title="29/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">29</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-30"
                    data-solar="30"
                    data-status="good"
                    title="30/12/2026 - Hoàng Đạo"
                >
                    <span class="month-cal__solar">30</span
                    ><span class="month-cal__dots" aria-hidden="true"
                        ><i class="month-cal__dot month-cal__dot--good"></i
                    ></span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell"
                    tabindex="-1"
                    data-date="2026-12-31"
                    data-solar="31"
                    title="31/12/2026 - Tất niên Dương lịch"
                >
                    <span class="month-cal__solar">31</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-01"
                    data-solar="1"
                    title="01/01/2027"
                >
                    <span class="month-cal__solar">1</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-02"
                    data-solar="2"
                    title="02/01/2027"
                >
                    <span class="month-cal__solar">2</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-03"
                    data-solar="3"
                    title="03/01/2027"
                >
                    <span class="month-cal__solar">3</span>
                </button>

                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-04"
                    data-solar="4"
                    title="04/01/2027"
                >
                    <span class="month-cal__solar">4</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-05"
                    data-solar="5"
                    title="05/01/2027"
                >
                    <span class="month-cal__solar">5</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-06"
                    data-solar="6"
                    title="06/01/2027"
                >
                    <span class="month-cal__solar">6</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-07"
                    data-solar="7"
                    title="07/01/2027"
                >
                    <span class="month-cal__solar">7</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-08"
                    data-solar="8"
                    title="08/01/2027"
                >
                    <span class="month-cal__solar">8</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-09"
                    data-solar="9"
                    title="09/01/2027"
                >
                    <span class="month-cal__solar">9</span>
                </button>
                <button
                    type="button"
                    class="month-cal__cell month-cal__cell--muted"
                    tabindex="-1"
                    data-date="2027-01-10"
                    data-solar="10"
                    title="10/01/2027"
                >
                    <span class="month-cal__solar">10</span>
                </button>
            </div>
        </article>
    </div>

    <!-- CHÚ THÍCH LỌC NHANH TOÀN NĂM (Tái sử dụng .month-cal__legend) -->
    <footer class="month-cal month-cal__legend year-cal-app__legend" aria-label="Bộ lọc chú thích lịch năm">
        <button
            type="button"
            class="month-cal__legend-pill"
            data-filter="good"
            aria-pressed="false"
            title="Làm sáng tất cả ngày Hoàng Đạo trong 12 tháng"
        >
            <i class="month-cal__legend-dot month-cal__legend-dot--good" aria-hidden="true"></i>
            <span>Hoàng Đạo</span>
        </button>
        <button
            type="button"
            class="month-cal__legend-pill"
            data-filter="bad"
            aria-pressed="false"
            title="Làm sáng tất cả ngày Hắc Đạo"
        >
            <i class="month-cal__legend-dot month-cal__legend-dot--bad" aria-hidden="true"></i>
            <span>Hắc Đạo</span>
        </button>
        <button
            type="button"
            class="month-cal__legend-pill"
            data-filter="holiday"
            aria-pressed="false"
            title="Làm sáng tất cả Ngày Lễ và Rằm/Mùng 1 trong năm"
        >
            <i class="month-cal__legend-dot month-cal__legend-dot--holiday" aria-hidden="true"></i>
            <span>Ngày Lễ</span>
        </button>
        <button
            type="button"
            class="month-cal__legend-pill"
            data-filter="today"
            aria-pressed="false"
            title="Làm sáng ngày Hôm Nay"
        >
            <i class="month-cal__legend-dot month-cal__legend-dot--today" aria-hidden="true"></i>
            <span>Hôm Nay</span>
        </button>
    </footer>
</section>
```
