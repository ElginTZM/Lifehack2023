document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("#nav-bar-links .nav-bar-link");
    const tabs = document.querySelectorAll('#content .content-tab');

    var tabOpening = 0;
    
    // hide all the tabs except current one
    tabs.forEach(tab => tab.style.display = 'none');
    tabs[tabOpening].style.display = 'block';

    // event listener for all tabs
    buttons.forEach((button, index) => button.addEventListener('click', () => {
        tabs[tabOpening].style.display = 'none';
        tabOpening = index;
        tabs[tabOpening].style.display = 'block';
    }));
});