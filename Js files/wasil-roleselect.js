// Wasil Role Select Logic
window.onload = function () {
    document.getElementById('card-community').addEventListener('click', function () {
        localStorage.setItem('wasil_role', 'community');
        animateAndNavigate(this);
    });

    document.getElementById('card-organization').addEventListener('click', function () {
        localStorage.setItem('wasil_role', 'organization');
        animateAndNavigate(this);
    });
};

function animateAndNavigate(card) {
    card.style.transform = 'scale(0.95)';
    card.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.4)';
    setTimeout(function () {
        window.location.href = 'wasil-login.html';
    }, 250);
}
