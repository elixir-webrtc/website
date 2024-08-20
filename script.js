function toggleMenu() {
    const menuContent = document.getElementById("navbar-menu-content");
    if (window.getComputedStyle(menuContent).display !== "none") {
        menuContent.style.display = "none";
    } else {
        menuContent.style.display = "flex";
    }
}

document.getElementById("navbar-menu").onclick = toggleMenu;
document.getElementById("navbar-menu-list").onclick = toggleMenu;