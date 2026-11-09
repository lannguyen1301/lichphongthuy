# festival.html

```html
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sự Kiện &amp; Lễ Tết Trong Năm 2026 - Lịch Phong Thủy</title>
        <link rel="icon" type="image/png" href="./assets/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="./assets/favicon/favicon.svg" />
        <link rel="shortcut icon" href="./assets/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="./assets/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="./assets/favicon/site.webmanifest" />
        <link rel="stylesheet" href="./assets/fonts/stylesheet.css" />
        <link rel="stylesheet" href="./assets/css/main.css" />
        <script src="./assets/js/script.js"></script>
    </head>

    <body>
        <!-- 1. Header dùng chung -->
        <header id="header" class="header"></header>
        <script>
            load("#header", "./templates/header.html");
        </script>

        <!-- 2. Sidebar dùng chung -->
        <div id="sidebar-root"></div>
        <script>
            load("#sidebar-root", "./templates/sidebar.html");
        </script>

        <!-- 3. Main Bento Grid: Sự Kiện & Lễ Tết (Phương án 2: Ô Đại Lễ 2x2 + Ô Lễ Thường 1x1) -->
        <main id="main" class="main festival-page">
            <div class="container">
                <div id="festival-calendar-root" aria-busy="true"></div>
                <script>
                    load("#festival-calendar-root", "./templates/festival-calendar.html");
                </script>
            </div>
        </main>

        <!-- 4. Footer dùng chung -->
        <footer id="footer" class="footer"></footer>
        <script>
            load("#footer", "./templates/footer.html");
        </script>

        <!-- 5. Bộ Script Modular -->
        <script src="./assets/js/lunar-engine.js"></script>
        <script src="./assets/js/header.js"></script>
        <script src="./assets/js/sidebar.js"></script>
        <script src="./assets/js/footer.js"></script>
        <script src="./assets/js/converter-modal.js"></script>
        <script src="./assets/js/festival-calendar.js"></script>
    </body>
</html>
```
