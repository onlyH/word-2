function fadeIn(selector) {
    var panel = document.querySelector(selector);
    panel.classList.add('fade-out');
    panel.classList.remove('fade-in');
}

function fadeOut(selector) {
    var panel = document.querySelector(selector);
    panel.addEventListener('animationend', function () {
        document.querySelector(selector).remove();
    });
    panel.classList.remove('fade-in');
    panel.classList.add('fade-out');
};