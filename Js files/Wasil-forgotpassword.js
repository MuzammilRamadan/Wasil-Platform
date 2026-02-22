// ============================================
// WASIL FORGOT PASSWORD PAGE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // === STATE MANAGEMENT ===
    let currentStep = 1;
    let userEmail = '';
    let verificationCode = '';
    let resendTimer = null;
    let resendCountdown = 60;

    // === STEP 1: EMAIL SUBMISSION ===
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');

    emailForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validate email
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitButton = emailForm.querySelector('.primary-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');

        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-flex';

        // Simulate API call to send verification code
        setTimeout(() => {
            // Verify email exists in demo system or allow any email for demo
            userEmail = email;
            document.getElementById('sentEmail').textContent = email;

            showNotification('Verification code sent to your email!', 'success');

            // Move to step 2
            setTimeout(() => {
                goToStep(2);
            }, 1000);
        }, 1500);
    });

    // === STEP 2: CODE VERIFICATION ===
    const codeForm = document.getElementById('codeForm');
    const codeDigits = document.querySelectorAll('.code-digit');

    // Auto-focus and auto-advance code inputs
    codeDigits.forEach((digit, index) => {
        digit.addEventListener('input', function (e) {
            const value = e.target.value;

            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }

            // Auto-advance to next input
            if (value.length === 1 && index < codeDigits.length - 1) {
                codeDigits[index + 1].focus();
            }

            // Check if all digits are filled
            const allFilled = Array.from(codeDigits).every(d => d.value.length === 1);
            if (allFilled) {
                // Auto-submit after a short delay
                setTimeout(() => {
                    codeForm.dispatchEvent(new Event('submit'));
                }, 300);
            }
        });

        // Handle backspace
        digit.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeDigits[index - 1].focus();
            }
        });

        // Paste handler
        digit.addEventListener('paste', function (e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();

            // Only process if it's a 6-digit code
            if (/^\d{6}$/.test(pastedData)) {
                pastedData.split('').forEach((char, i) => {
                    if (codeDigits[i]) {
                        codeDigits[i].value = char;
                    }
                });
                codeDigits[5].focus();

                // Auto-submit
                setTimeout(() => {
                    codeForm.dispatchEvent(new Event('submit'));
                }, 300);
            }
        });
    });

    codeForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get the code from all digits
        const code = Array.from(codeDigits).map(d => d.value).join('');

        // Validate code
        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            showNotification('Please enter a valid 6-digit code', 'error');
            return;
        }

        // Show loading state
        const submitButton = codeForm.querySelector('.primary-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');

        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-flex';

        // Simulate API call to verify code
        setTimeout(() => {
            // Verify code (accept any 6-digit code for demo)
            verificationCode = code;
            showNotification('Code verified successfully!', 'success');

            // Move to step 3
            setTimeout(() => {
                goToStep(3);
            }, 1000);
        }, 1500);
    });

    // Resend code functionality
    const resendLink = document.getElementById('resendCode');
    const resendTimerDisplay = document.getElementById('resendTimer');
    const countdownSpan = document.getElementById('countdown');

    resendLink.addEventListener('click', async function (e) {
        e.preventDefault();

        if (resendLink.classList.contains('disabled')) {
            return;
        }

        try {
            // Simulate API call to resend code
            await simulateAPICall(1000);

            showNotification('Verification code resent!', 'success');

            // Start countdown timer
            startResendTimer();

        } catch (error) {
            console.error('Resend error:', error);
            showNotification('Failed to resend code. Please try again.', 'error');
        }
    });

    function startResendTimer() {
        resendCountdown = 60;
        resendLink.classList.add('disabled');
        resendTimerDisplay.style.display = 'block';
        resendLink.parentElement.style.display = 'none';

        resendTimer = setInterval(() => {
            resendCountdown--;
            countdownSpan.textContent = resendCountdown;

            if (resendCountdown <= 0) {
                clearInterval(resendTimer);
                resendLink.classList.remove('disabled');
                resendTimerDisplay.style.display = 'none';
                resendLink.parentElement.style.display = 'block';
            }
        }, 1000);
    }

    // === STEP 3: PASSWORD RESET ===
    const passwordForm = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Password visibility toggles
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    setupPasswordToggle(toggleNewPassword, newPasswordInput);
    setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);

    // Password strength checker
    newPasswordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = checkPasswordStrength(password);

        strengthFill.className = 'strength-fill ' + strength;
        strengthText.textContent = `Password strength: ${capitalizeFirstLetter(strength)}`;
    });

    passwordForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validate passwords
        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        const strength = checkPasswordStrength(newPassword);
        if (strength === 'weak') {
            showNotification('Please choose a stronger password', 'warning');
            return;
        }

        // Show loading state
        const submitButton = passwordForm.querySelector('.primary-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');

        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-flex';

        // Simulate API call to reset password
        setTimeout(() => {
            // Update user password in local storage
            const storedUsers = JSON.parse(localStorage.getItem('wasil_users') || '[]');
            const userIndex = storedUsers.findIndex(u => u.email === userEmail);

            if (userIndex !== -1) {
                storedUsers[userIndex].password = newPassword;
                localStorage.setItem('wasil_users', JSON.stringify(storedUsers));
            }

            showNotification('Password reset successfully!', 'success');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'wasil-login.html';
            }, 2000);
        }, 2000);
    });

    // === STEP NAVIGATION ===
    function goToStep(stepNumber) {
        // Hide all step contents
        document.querySelectorAll('.step-content').forEach(content => {
            content.style.display = 'none';
        });

        // Show current step content
        document.getElementById('step' + stepNumber).style.display = 'block';

        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');

            if (index + 1 < stepNumber) {
                step.classList.add('completed');
            } else if (index + 1 === stepNumber) {
                step.classList.add('active');
            }
        });

        currentStep = stepNumber;

        // Auto-focus first input in the step
        setTimeout(() => {
            const firstInput = document.querySelector(`#step${stepNumber} input`);
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);

        // Start resend timer when entering step 2
        if (stepNumber === 2) {
            startResendTimer();
        }
    }

    // === PASSWORD TOGGLE FUNCTION ===
    function setupPasswordToggle(toggleButton, passwordInput) {
        let passwordVisible = false;

        toggleButton.addEventListener('click', function () {
            passwordVisible = !passwordVisible;

            const eyeOpen = toggleButton.querySelector('#eyeOpen, .eye-open-icon');
            const eyeClosed = toggleButton.querySelector('#eyeClosed, .eye-closed-icon');
            const eyeSlash = toggleButton.querySelector('#eyeSlash, .eye-slash-icon');

            if (passwordVisible) {
                passwordInput.type = 'text';
                if (eyeOpen) eyeOpen.style.display = 'none';
                if (eyeClosed) eyeClosed.style.display = 'block';
                if (eyeSlash) eyeSlash.style.display = 'block';
            } else {
                passwordInput.type = 'password';
                if (eyeOpen) eyeOpen.style.display = 'block';
                if (eyeClosed) eyeClosed.style.display = 'none';
                if (eyeSlash) eyeSlash.style.display = 'none';
            }

            // Add subtle animation
            toggleButton.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                toggleButton.style.transform = 'translateY(-50%) scale(1)';
            }, 100);
        });
    }

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

    // === UTILITY FUNCTIONS ===
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function checkPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 1) return 'weak';
        if (strength === 2) return 'fair';
        if (strength === 3 || strength === 4) return 'good';
        return 'strong';
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function simulateAPICall(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    // === INPUT ANIMATIONS ===
    const inputFields = document.querySelectorAll('.input-field');

    inputFields.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });

        input.addEventListener('input', function () {
            if (this.value.length > 0) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // === KEYBOARD SHORTCUTS ===
    document.addEventListener('keydown', function (e) {
        // Submit on Enter when in input fields
        if (e.key === 'Enter') {
            const activeForm = document.querySelector(`#step${currentStep} form`);
            if (activeForm && document.activeElement.tagName === 'INPUT') {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // === LANGUAGE SWITCHING LOGIC ===
    function setLanguage(lang) {
        // Arabic translations
        const ar = {
            logo: 'واصل',
            tagline: 'معك في كل مكان',
            step1Label: 'أدخل البريد',
            step2Label: 'تحقق من الرمز',
            step3Label: 'كلمة سر جديدة',
            emailLabel: 'عنوان البريد الإلكتروني',
            emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
            sendCode: 'إرسال رمز التحقق',
            verifyCode: 'تحقق من الرمز',
            resetPassword: 'إعادة تعيين كلمة السر',
            backToLogin: 'تذكرت كلمة السر؟',
            backLink: 'العودة لتسجيل الدخول'
        };

        // English translations
        const en = {
            logo: 'WASIL',
            tagline: 'With you everywhere',
            step1Label: 'Enter Email',
            step2Label: 'Verify Code',
            step3Label: 'New Password',
            emailLabel: 'Email Address',
            emailPlaceholder: 'Enter your email address',
            sendCode: 'Send Verification Code',
            verifyCode: 'Verify Code',
            resetPassword: 'Reset Password',
            backToLogin: 'Remember your password?',
            backLink: 'Back to Login'
        };

        const t = lang === 'ar' ? ar : en;

        // Update text content
        document.querySelector('.logo').textContent = t.logo;
        document.querySelector('.tagline').textContent = t.tagline;

        // Update step labels
        const stepLabels = document.querySelectorAll('.step-label');
        if (stepLabels[0]) stepLabels[0].textContent = t.step1Label;
        if (stepLabels[1]) stepLabels[1].textContent = t.step2Label;
        if (stepLabels[2]) stepLabels[2].textContent = t.step3Label;

        // Direction
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }

    function addLangSwitchButton() {
        let btn = document.createElement('button');
        btn.className = 'lang-switch-btn';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: '10001',
            background: '#fff',
            color: '#4A90E2',
            border: 'none',
            borderRadius: '50px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
        });

        btn.textContent = document.documentElement.lang === 'ar' ? 'English' : 'عربي';

        btn.addEventListener('click', function () {
            const currentLang = document.documentElement.lang || 'en';
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang);
            btn.textContent = newLang === 'ar' ? 'English' : 'عربي';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });

        document.body.appendChild(btn);
    }

    // Initialize language switcher
    addLangSwitchButton();

});
