/**
 * load-components.js
 * Loads sidebar.html and footer.html dynamically and handles active link highlighting.
 */

// Function to toggle sidebar dropdowns
window.toggleDropdown = function (button) {
    const dropdown = button.parentElement;
    dropdown.classList.toggle('open');
};

// Function to toggle sidebar mobile menu
function initSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Function to toggle Dark Mode
window.toggleTheme = function () {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Safely save to localStorage
    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
        console.warn('LocalStorage not available');
    }

    updateThemeIcon(isDark);
};

function updateThemeIcon(isDark) {
    // Select icon in top-header (dashboard) or anywhere else
    const icon = document.querySelector('.theme-toggle i') || document.querySelector('.nav-actions .theme-btn i');
    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Initialize Theme from LocalStorage
function initTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            updateThemeIcon(true);
        }
    } catch (e) {
        console.warn('LocalStorage access failed');
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Initializing components...");
    initTheme(); // Apply saved theme immediately

    // Determine base path to ensure relative fetches work
    // If we are at /dashboard.html, path is ./
    // If we are at /repo/dashboard.html, path is ./
    // This is essentially just fetching from the same directory as the current file.
    const componentPath = './'; 

    // 1. Load Sidebar
    const sidebarContainer = document.getElementById("sidebar"); 
    if (sidebarContainer) {
        try {
            console.log("Fetching sidebar...");
            const response = await fetch(componentPath + "sidebar.html");
            if (response.ok) {
                const html = await response.text();
                sidebarContainer.innerHTML = html;

                // Active Link Logic
                const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
                console.log("Current path identified as:", currentPath);
                
                const links = sidebarContainer.querySelectorAll('a.nav-item, a.sub-link');

                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === currentPath) {
                        link.classList.add('active');
                        // If it's a sub-link, open the dropdown and activate parent
                        if (link.classList.contains('sub-link')) {
                            link.style.color = 'var(--primary-orange)';
                            link.style.fontWeight = '600';

                            const parentDropdown = link.closest('.nav-dropdown');
                            if (parentDropdown) {
                                parentDropdown.classList.add('open');
                                // Optional: Highlight the parent button too?
                                const btn = parentDropdown.querySelector('.nav-dropdown-btn');
                                if (btn) btn.classList.add('active');
                            }
                        }
                    }
                });

                initSidebarToggle();

            } else {
                console.error("Failed to load sidebar.html: " + response.status);
                sidebarContainer.innerHTML = "<div style='padding:20px; color:white;'>Error loading sidebar</div>";
            }
        } catch (error) {
            console.error("Error loading sidebar:", error);
            sidebarContainer.innerHTML = "<div style='padding:20px; color:white;'>Check network/console</div>";
        }
    }

    // 2. Load Footer
    const mainFooter = document.querySelector('.main-footer');
    if (mainFooter) {
        try {
            console.log("Fetching footer...");
            const response = await fetch(componentPath + "footer.html");
            if (response.ok) {
                const html = await response.text();
                mainFooter.innerHTML = html;
            } else {
                console.error("Failed to load footer.html: " + response.status);
            }
        } catch (error) {
            console.error("Error loading footer:", error);
        }
    }
});
