// ============================================
// WASIL LOGIN PAGE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // === PASSWORD TOGGLE ===
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');
    const eyeSlash = document.getElementById('eyeSlash');

    let passwordVisible = false;

    togglePassword.addEventListener('click', function () {
        passwordVisible = !passwordVisible;

        if (passwordVisible) {
            passwordInput.type = 'text';
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
            eyeSlash.style.display = 'block';
        } else {
            passwordInput.type = 'password';
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
            eyeSlash.style.display = 'none';
        }

        // Add subtle animation
        togglePassword.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            togglePassword.style.transform = 'translateY(-50%) scale(1)';
        }, 100);
    });

    // === FORM SUBMISSION ===
    const loginForm = document.getElementById('loginForm');
    const signinButton = loginForm.querySelector('.signin-button');
    const buttonText = signinButton.querySelector('.button-text');
    const buttonLoader = signinButton.querySelector('.button-loader');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailPhone = document.getElementById('emailPhone').value.trim();
        const password = document.getElementById('password').value;

        // Basic validation
        if (!emailPhone || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        signinButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-flex';

        try {
            // DEMO MODE BYPASS
            if (emailPhone === 'demo@wasil.com' && password === 'demo123') {
                handleSuccessfulLogin({ fullName: 'Demo User', email: 'demo@wasil.com', user_metadata: { role: 'community' } });
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailPhone,
                password: password
            });

            if (error) throw error;

            if (data.user) {
                handleSuccessfulLogin(data.user);
            }

        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message || 'Invalid login credentials', 'error');
            signinButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
        }
    });

    async function handleSuccessfulLogin(user) {
        showNotification('Login successful! Redirecting...', 'success');

        // Extract metadata or fallback
        const metadata = user.user_metadata || {};
        const role = metadata.role || 'community';
        let fullName = metadata.full_name || user.email.split('@')[0];
        let phone = user.phone || metadata.phone || '';

        // Fetch profile from the correct table
        try {
            if (role === 'organization') {
                const { data: orgProfile } = await supabase
                    .from('organization_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (orgProfile) {
                    fullName = orgProfile.org_name || fullName;
                    phone = orgProfile.phone || phone;
                }
            } else {
                const { data: commProfile } = await supabase
                    .from('community_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (commProfile) {
                    fullName = commProfile.full_name || fullName;
                    phone = commProfile.phone || phone;
                }
            }
        } catch (profileError) {
            console.warn('Could not fetch profile:', profileError.message);
        }

        // Save session info
        localStorage.setItem('wasil_user', JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: fullName,
            phone: phone
        }));

        // IMPORTANT: Set logic role for home page
        localStorage.setItem('wasil_role', role);

        setTimeout(() => {
            window.location.href = 'wasil-home.html';
        }, 1000);
    }

    // === INPUT ANIMATIONS ===
    const inputFields = document.querySelectorAll('.input-field');

    inputFields.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Real-time validation feedback
        input.addEventListener('input', function () {
            if (this.value.length > 0) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // === FORGOT PASSWORD LINK ===
    const forgotPasswordLink = document.querySelector('.forgot-password');

    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'Wasil-forgotpassword.html';
    });

    // === SIGN UP LINK ===
    const signupLink = document.querySelector('.signup-link');

    signupLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'wasil-signup.html';
    });

    // === NOTIFICATION SYSTEM ===
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#2ECC71',
            error: '#E74C3C',
            info: '#4A90E2',
            warning: '#F39C12'
        };
        notification.style.background = colors[type] || colors.info;

        // Add animation keyframes if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // === KEYBOARD SHORTCUTS ===
    document.addEventListener('keydown', function (e) {
        // Submit on Enter when in input fields
        if (e.key === 'Enter' && (e.target.id === 'emailPhone' || e.target.id === 'password')) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // === SMOOTH SCROLLING (for mobile) ===
    window.addEventListener('resize', function () {
        // Adjust viewport for mobile keyboards
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    });

    // === LANGUAGE SWITCHING LOGIC ===
    function setLanguage(lang) {
        // Arabic translations
        const ar = {
            logo: 'واصل',
            tagline: 'معك في كل مكان',
            emailLabel: 'رقم الهاتف او البريد الالكتروني',
            emailPlaceholder: 'أدخل رقم الهاتف أو البريد الالكتروني',
            passwordLabel: 'كلمة السر',
            passwordPlaceholder: 'أدخل كلمة السر',
            signIn: 'تسجيل الدخول',
            forgot: 'نسيت كلمة السر؟',
            demo: '<strong style="color: #4A90E2;">تجربة دخول:</strong> demo@wasil.com / demo123',
            signup: 'ليس لديك حساب؟',
            signupLink: 'إنشاء حساب'
        };
        // English translations
        const en = {
            logo: 'WASIL',
            tagline: 'With you everywhere',
            emailLabel: 'Email or Phone Number',
            emailPlaceholder: 'Enter your email or phone number',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter your password',
            signIn: 'Sign In',
            forgot: 'Forgot Password?',
            demo: '<strong style="color: #4A90E2;">Demo Login:</strong> demo@wasil.com / demo123',
            signup: "Don't have an account?",
            signupLink: 'Sign Up'
        };
        const t = lang === 'ar' ? ar : en;
        // Update text content
        document.querySelector('.logo').textContent = t.logo;
        document.querySelector('.tagline').textContent = t.tagline;
        document.querySelector('label[for="emailPhone"]').textContent = t.emailLabel;
        document.getElementById('emailPhone').placeholder = t.emailPlaceholder;
        document.querySelector('label[for="password"]').textContent = t.passwordLabel;
        document.getElementById('password').placeholder = t.passwordPlaceholder;
        document.querySelector('.button-text').textContent = t.signIn;
        document.querySelector('.forgot-password').textContent = t.forgot;
        document.querySelector('.demo-info p').innerHTML = t.demo;
        document.querySelector('.signup-section p').innerHTML = `${t.signup} <a href="wasil-signup.html" class="signup-link">${t.signupLink}</a>`;
        // Direction
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }

    function addLangSwitchButton() {
        let btn = document.createElement('button');
        btn.className = 'lang-switch-btn';
        btn.style.position = 'fixed';
        btn.style.top = '18px';
        btn.style.left = '18px';
        btn.style.zIndex = '10001';
        btn.style.background = '#fff';
        btn.style.color = '#4A90E2';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.padding = '6px 16px';
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        btn.textContent = localStorage.getItem('wasil_lang') === 'ar' ? 'English' : 'العربية';
        btn.onclick = function () {
            const newLang = localStorage.getItem('wasil_lang') === 'ar' ? 'en' : 'ar';
            localStorage.setItem('wasil_lang', newLang);
            setLanguage(newLang);
            btn.textContent = newLang === 'ar' ? 'English' : 'العربية';
        };
        document.body.appendChild(btn);
    }

    // On load, set language
    const lang = localStorage.getItem('wasil_lang') || 'en';
    setLanguage(lang);
    addLangSwitchButton();

    console.log('Wasil Login Page Initialized ✓');
});

// === UTILITY FUNCTIONS ===

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = ['weak', 'fair', 'good', 'strong'];
    return levels[strength] || 'weak';
}
