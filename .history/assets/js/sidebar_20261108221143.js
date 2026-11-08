// assets/js/sidebar.js
(() => {
    let isSidebarGlobalBound = false;

    const toggleSidebar = (forceClose = false) => {
        const sidebar = document.getElementById("calendar-sidebar");
        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        if (!sidebar || !burgerBtn || !backdrop) return;

        const isOpen = sidebar.classList.contains("is-open");
        const nextState = forceClose ? false : !isOpen;

        sidebar.classList.toggle("is-open", nextState);
        burgerBtn.classList.toggle("is-active", nextState);
        backdrop.classList.toggle("is-active", nextState);
        burgerBtn.setAttribute("aria-expanded", String(nextState));

        document.body.style.overflow = nextState ? "hidden" : "";
    };

    const syncActiveSidebarLink = () => {
        const rawPage = window.location.pathname.split("/").pop() || "index.html";
        const targetNavPage = rawPage === "detail.html" ? "index.html" : rawPage;
        const sidebarLinks = document.querySelectorAll(".sidebar__link[data-nav-page]");

        sidebarLinks.forEach((link) => {
            const isMatch = link.dataset.navPage === targetNavPage;
            link.classList.toggle("sidebar__link--active", isMatch);
            if (isMatch) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    };

    const initSidebar = () => {
        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");

        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        syncActiveSidebarLink();
    };

    if (!isSidebarGlobalBound) {
        isSidebarGlobalBound = true;

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") toggleSidebar(true);
        });
    }

    document.addEventListener("DOMContentLoaded", initSidebar);
    window.addEventListener("template-loaded", initSidebar);
})();

// 2. assets/js/sidebar.js
(() => {
    let isSidebarGlobalBound = false;

    const toggleSidebar = (forceClose = false) => {
        const sidebar = document.getElementById("calendar-sidebar");
        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");
        if (!sidebar || !burgerBtn || !backdrop) return;

        const isOpen = sidebar.classList.contains("is-open");
        const nextState = forceClose ? false : !isOpen;

        sidebar.classList.toggle("is-open", nextState);
        burgerBtn.classList.toggle("is-active", nextState);
        backdrop.classList.toggle("is-active", nextState);
        burgerBtn.setAttribute("aria-expanded", String(nextState));

        document.body.style.overflow = nextState ? "hidden" : "";
    };

    const syncActiveSidebarLink = () => {
        const rawPage = window.location.pathname.split("/").pop() || "index.html";
        const targetNavPage = rawPage === "detail.html" ? "index.html" : rawPage;
        const sidebarLinks = document.querySelectorAll(".sidebar__link[data-nav-page]");

        sidebarLinks.forEach((link) => {
            const isMatch = link.dataset.navPage === targetNavPage;
            link.classList.toggle("sidebar__link--active", isMatch);
            if (isMatch) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    };

    const initSidebar = () => {
        const burgerBtn = document.getElementById("burger-btn");
        const backdrop = document.getElementById("sidebar-backdrop");

        if (burgerBtn) burgerBtn.onclick = () => toggleSidebar();
        if (backdrop) backdrop.onclick = () => toggleSidebar(true);

        syncActiveSidebarLink();
    };

    if (!isSidebarGlobalBound) {
        isSidebarGlobalBound = true;

        window.addEventListener("resize", () => {
            const sidebar = document.getElementById("calendar-sidebar");
            if (window.innerWidth >= 768 && sidebar?.classList.contains("is-open")) {
                toggleSidebar(true);
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") toggleSidebar(true);
        });
    }

    document.addEventListener("DOMContentLoaded", initSidebar);
    window.addEventListener("template-loaded", initSidebar);
})();
