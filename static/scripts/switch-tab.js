document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("#nav-bar-links .nav-bar-link");

    // hide all the tabs except current one
    switchTab(0);

    // event listener for all tabs
    buttons.forEach((button, index) => button.addEventListener('click', () => {
        switchTab(index);
        if (index === 1) {
            documentManager.viewCurrent();
        } else {
            documentManager.switchAway();
        }
    }));
});


function switchTab(index) {
    const tabs = document.querySelectorAll('#content .content-tab');
    const buttons = document.querySelectorAll("#nav-bar-links .nav-bar-link");
    tabs.forEach(tab => tab.style.display = 'none');
    tabs[index].style.display = 'block';
    buttons.forEach(button => button.style.color = "black");
    buttons[index].style.color = "chocolate";
}