// Language selection logic
window.onload = function () {
    document.getElementById('btn-en').onclick = function () {
        localStorage.setItem('wasil_lang', 'en');
        window.location.href = 'wasil-roleselect.html';
    };
    document.getElementById('btn-ar').onclick = function () {
        localStorage.setItem('wasil_lang', 'ar');
        window.location.href = 'wasil-roleselect.html';
    };
};
