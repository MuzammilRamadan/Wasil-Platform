// ============================================
// WASIL LOGIN PAGE - ROLE-BASED AUTH
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // === SHOW ROLE BANNER ===
    const role = localStorage.getItem('wasil_role') || 'community';
    const roleBannerMap = {
        admin: { key: 'login.role_admin', color: '#1a7a4a' },
        organization: { key: 'login.role_org', color: '#F39C12' },
        community: { key: 'login.role_community', color: '#4A90E2' }
    };
    const bannerConfig = roleBannerMap[role] || roleBannerMap.community;
    const banner = document.createElement('div');
    banner.style.cssText = `background:${bannerConfig.color};color:#fff;text-align:center;padding:8px 16px;font-size:0.82rem;font-weight:600;font-family:'Cairo','Inter',sans-serif;`;
    banner.setAttribute('data-i18n', bannerConfig.key);
    banner.textContent = bannerConfig.key;
    document.body.insertBefore(banner, document.body.firstChild);

    // === PASSWORD TOGGLE ===
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eyeOpen') || document.getElementById('fingerup');
    const eyeClosed = document.getElementById('eyeClosed');
    const eyeSlash = document.getElementById('eyeSlash');
    let passwordVisible = false;

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            passwordVisible = !passwordVisible;
            passwordInput.type = passwordVisible ? 'text' : 'password';
            if (eyeOpen) eyeOpen.style.display = passwordVisible ? 'none' : 'block';
            if (eyeClosed) eyeClosed.style.display = passwordVisible ? 'block' : 'none';
            if (eyeSlash) eyeSlash.style.display = passwordVisible ? 'block' : 'none';
            togglePassword.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => { togglePassword.style.transform = 'translateY(-50%) scale(1)'; }, 100);
        });
    }

    // === FORM SUBMISSION ===
    const loginForm = document.getElementById('loginForm');
    const signinButton = loginForm.querySelector('.signin-button');
    const buttonText = signinButton.querySelector('.button-text');
    const buttonLoader = signinButton.querySelector('.button-loader');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailPhone = document.getElementById('emailPhone').value.trim();
        const password = document.getElementById('password').value;
        const selectedRole = localStorage.getItem('wasil_role') || 'community';

        if (!emailPhone || !password) {
            showNotification('Please fill in all fields / يرجى ملء جميع الحقول', 'error');
            return;
        }

        // Show loading state
        signinButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-flex';

        try {
            // ── ADMIN LOGIN ──
            if (selectedRole === 'admin') {
                await handleAdminLogin(emailPhone, password);
                return;
            }

            // ── COMMUNITY / ORG LOGIN ──
            let loginEmail = emailPhone;

            // If input looks like a Sudan phone number, look up the email
            if (isSudanPhone(emailPhone)) {
                const normalizedPhone = normalizeSudanPhone(emailPhone);
                const { data: profile, error: profileErr } = await supabase
                    .from('community_profiles')
                    .select('email')
                    .eq('phone', normalizedPhone)
                    .single();

                if (profileErr || !profile) {
                    throw new Error('Phone number not found. / رقم الهاتف غير موجود.');
                }
                loginEmail = profile.email;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: password
            });

            if (error) throw error;

            if (data.user) {
                // Validate role matches
                const userRole = data.user.user_metadata?.role || 'community';
                if (selectedRole !== userRole) {
                    await supabase.auth.signOut();
                    throw new Error('Access denied. Please use the correct role. / الوصول مرفوض.');
                }
                await handleSuccessfulLogin(data.user);
            }

        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message || 'Invalid login credentials', 'error');
            signinButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
        }
    });

    async function handleAdminLogin(emailPhone, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailPhone,
                password: password
            });

            if (error) throw error;

            // Verify the user exists in admin_profiles table
            const { data: adminProfile, error: adminErr } = await supabase
                .from('admin_profiles')
                .select('id, full_name')
                .eq('id', data.user.id)
                .single();

            if (adminErr || !adminProfile) {
                await supabase.auth.signOut();
                throw new Error('Access denied. Admin credentials required. / الوصول مرفوض. بيانات المدير مطلوبة.');
            }

            localStorage.setItem('wasil_user', JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                fullName: adminProfile.full_name || 'Admin',
                role: 'admin'
            }));
            localStorage.setItem('wasil_role', 'admin');

            showNotification('Welcome, Admin! / مرحباً، جاري التحويل...', 'success');
            setTimeout(() => { window.location.href = 'wasil-admin.html'; }, 1000);

        } catch (err) {
            showNotification(err.message || 'Admin login failed', 'error');
            const sb = document.querySelector('.signin-button');
            sb.disabled = false;
            sb.querySelector('.button-text').style.display = 'inline';
            sb.querySelector('.button-loader').style.display = 'none';
        }
    }

    async function handleSuccessfulLogin(user) {
        showNotification('Login successful! / تم تسجيل الدخول!', 'success');

        const metadata = user.user_metadata || {};
        const role = metadata.role || 'community';
        let fullName = metadata.full_name || user.email.split('@')[0];
        let phone = user.phone || metadata.phone || '';

        try {
            if (role === 'organization') {
                const { data: orgProfile } = await supabase
                    .from('organization_profiles')
                    .select('*').eq('id', user.id).single();
                if (orgProfile) {
                    fullName = orgProfile.org_name || fullName;
                    phone = orgProfile.phone || phone;
                }
            } else {
                const { data: commProfile } = await supabase
                    .from('community_profiles')
                    .select('*').eq('id', user.id).single();
                if (commProfile) {
                    fullName = commProfile.full_name || fullName;
                    phone = commProfile.phone || phone;
                }
            }
        } catch (profileError) {
            console.warn('Could not fetch profile:', profileError.message);
        }

        localStorage.setItem('wasil_user', JSON.stringify({ id: user.id, email: user.email, fullName, phone }));
        localStorage.setItem('wasil_role', role);

        setTimeout(() => { window.location.href = 'wasil-home.html'; }, 1000);
    }

    // === Sudan Phone Helpers ===
    function isSudanPhone(input) {
        const cleaned = input.replace(/[\s\-]/g, '');
        return /^(09\d{8}|\+2499\d{8}|002499\d{8})$/.test(cleaned);
    }

    function normalizeSudanPhone(input) {
        const cleaned = input.replace(/[\s\-]/g, '');
        if (cleaned.startsWith('09')) return '+249' + cleaned.slice(1);
        if (cleaned.startsWith('00249')) return '+' + cleaned.slice(2);
        return cleaned;
    }

    // === INPUT ANIMATIONS ===
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('focus', function () { this.parentElement.style.transform = 'scale(1.01)'; });
        input.addEventListener('blur', function () { this.parentElement.style.transform = 'scale(1)'; });
        input.addEventListener('input', function () {
            this.classList.toggle('has-value', this.value.length > 0);
        });
    });

    // === FORGOT PASSWORD LINK ===
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'Wasil-forgotpassword.html';
        });
    }

    // === SIGN UP LINK ===
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'wasil-signup.html';
        });
    }

    // === LANG SWITCHER ===
    const langBtn = document.createElement('button');
    langBtn.style.cssText = 'position:fixed;top:50px;left:18px;z-index:10001;background:#fff;color:#4A90E2;border:none;border-radius:8px;padding:6px 16px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.08);font-family:Cairo,Inter,sans-serif;';
    langBtn.textContent = localStorage.getItem('wasil_lang') === 'ar' ? 'English' : 'العربية';
    langBtn.onclick = function () {
        const newLang = localStorage.getItem('wasil_lang') === 'ar' ? 'en' : 'ar';
        localStorage.setItem('wasil_lang', newLang);
        if (typeof applyLanguage === 'function') applyLanguage();
        langBtn.textContent = newLang === 'ar' ? 'English' : 'العربية';
    };
    document.body.appendChild(langBtn);

    // Apply translations on load
    if (typeof applyLanguage === 'function') applyLanguage();

    console.log('Wasil Login Page Initialized ✓ Role:', role);
});

// === SHARED NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.wasil-notif');
    if (existing) existing.remove();
    const n = document.createElement('div');
    n.className = 'wasil-notif';
    n.textContent = message;
    const colors = { success: '#2ECC71', error: '#E74C3C', info: '#4A90E2', warning: '#F39C12' };
    Object.assign(n.style, {
        position: 'fixed', top: '20px', right: '20px',
        padding: '14px 22px', borderRadius: '12px', color: '#fff',
        fontSize: '14px', fontWeight: '500', fontFamily: "'Cairo','Inter',sans-serif",
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: '10000',
        maxWidth: '320px', wordWrap: 'break-word',
        background: colors[type] || colors.info,
        animation: 'slideInRight 0.3s ease-out'
    });
    if (!document.querySelector('#wasil-notif-styles')) {
        const s = document.createElement('style');
        s.id = 'wasil-notif-styles';
        s.textContent = `@keyframes slideInRight{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}`;
        document.head.appendChild(s);
    }
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => n.remove(), 300);
    }, 3500);
}
