// Wasil Role Select Logic
window.onload = function () {
    document.getElementById('card-community').addEventListener('click', function () {
        localStorage.setItem('wasil_role', 'community');
        animateAndNavigate(this, 'wasil-login.html');
    });

    document.getElementById('card-organization').addEventListener('click', function () {
        localStorage.setItem('wasil_role', 'organization');
        animateAndNavigate(this, 'wasil-login.html');
    });

    document.getElementById('card-admin').addEventListener('click', function () {
        localStorage.setItem('wasil_role', 'admin');
        animateAndNavigate(this, 'wasil-login.html');
    });
};

function animateAndNavigate(card, dest) {
    card.style.transform = 'scale(0.95)';
    card.style.boxShadow = '0 4px 16px rgba(26, 122, 74, 0.4)';
    setTimeout(function () {
        window.location.href = dest;
    }, 250);
}
