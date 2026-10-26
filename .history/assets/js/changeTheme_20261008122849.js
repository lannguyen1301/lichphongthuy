 <script>
        // 1. Logic đổi theme thủ công
        function changeTheme(themeName) {
            const body = document.body;
            if (themeName === '') {
                body.removeAttribute('data-theme');
            } else {
                body.setAttribute('data-theme', themeName);
            }
        }

        // 2. Logic dò tìm Dark/Light Mode của Windows
        // const modeDetector = document.getElementById('mode-detector');
        // const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // function updateModeText(e) {
        //     if (e.matches) {
        //         modeDetector.textContent = "WINDOWS ĐANG Ở DARK MODE 🌙";
        //         modeDetector.style.background = "#374151"; // Màu tối
        //     } else {
        //         modeDetector.textContent = "WINDOWS ĐANG Ở LIGHT MODE ☀️";
        //         modeDetector.style.background = "#fbbf24"; // Màu vàng sáng
        //     }
        // }

        // Chạy lần đầu tiên khi mở web
        // updateModeText(darkModeQuery);
        // // Lắng nghe liên tục khi bro vào Setting Windows đổi theme
        // darkModeQuery.addEventListener('change', updateModeText);
    </script>