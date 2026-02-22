// ============================================
// WASIL SIGN UP PAGE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // === ACCOUNT TYPE TOGGLE ===
    let accountType = localStorage.getItem('wasil_role') || 'community';
    const btnCommunity = document.getElementById('btnCommunity');
    const btnOrganization = document.getElementById('btnOrganization');
    const nameLabel = document.getElementById('nameLabel');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const phoneIntlWrapper = document.getElementById('phoneIntlWrapper');
    const phoneIntlInput = document.getElementById('phoneIntl');
    const countryCode = document.getElementById('countryCode');

    function setAccountType(type) {
        accountType = type;
        localStorage.setItem('wasil_role', type);

        if (type === 'organization') {
            btnOrganization.classList.add('active');
            btnCommunity.classList.remove('active');

            // Change labels dynamically
            nameLabel.textContent = t('signup.org_name_label');
            fullNameInput.placeholder = t('signup.org_name_ph');
            nameLabel.setAttribute('data-i18n', 'signup.org_name_label');
            fullNameInput.setAttribute('data-i18n-placeholder', 'signup.org_name_ph');

            // Show international phone, hide simple phone
            phoneInput.style.display = 'none';
            phoneInput.removeAttribute('required');
            phoneIntlWrapper.style.display = 'flex';
            phoneIntlInput.setAttribute('required', 'true');
        } else {
            btnCommunity.classList.add('active');
            btnOrganization.classList.remove('active');

            // Revert labels
            nameLabel.textContent = t('signup.name_label');
            fullNameInput.placeholder = t('signup.name_ph');
            nameLabel.setAttribute('data-i18n', 'signup.name_label');
            fullNameInput.setAttribute('data-i18n-placeholder', 'signup.name_ph');

            // Show simple phone, hide international phone
            phoneInput.style.display = 'block';
            phoneInput.setAttribute('required', 'true');
            phoneIntlWrapper.style.display = 'none';
            phoneIntlInput.removeAttribute('required');
        }
    }

    btnCommunity.addEventListener('click', function () {
        setAccountType('community');
    });

    btnOrganization.addEventListener('click', function () {
        setAccountType('organization');
    });

    // Initialize based on stored role
    setAccountType(accountType);

    // === FORM ELEMENTS ===
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const signupButton = signupForm.querySelector('.signup-button');
    const buttonText = signupButton.querySelector('.button-text');
    const buttonLoader = signupButton.querySelector('.button-loader');

    // === PASSWORD TOGGLE (Main Password) ===
    const togglePassword = document.getElementById('togglePassword');
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

        togglePassword.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            togglePassword.style.transform = 'translateY(-50%) scale(1)';
        }, 100);
    });

    // === PASSWORD TOGGLE (Confirm Password) ===
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    let confirmPasswordVisible = false;

    toggleConfirmPassword.addEventListener('click', function () {
        confirmPasswordVisible = !confirmPasswordVisible;
        confirmPasswordInput.type = confirmPasswordVisible ? 'text' : 'password';

        const eyeOpenConfirm = this.querySelector('.eye-open-confirm');
        const eyeSlashConfirm = this.querySelector('.eye-slash-confirm');

        if (confirmPasswordVisible) {
            eyeSlashConfirm.style.display = 'block';
        } else {
            eyeSlashConfirm.style.display = 'none';
        }

        toggleConfirmPassword.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            toggleConfirmPassword.style.transform = 'translateY(-50%) scale(1)';
        }, 100);
    });

    // === PASSWORD STRENGTH METER ===
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = calculatePasswordStrength(password);

        // Remove all strength classes
        strengthFill.className = 'strength-fill';

        if (password.length === 0) {
            strengthText.textContent = '';
            return;
        }

        // Add appropriate class and text
        strengthFill.classList.add(strength.level);
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    });

    function calculatePasswordStrength(password) {
        let score = 0;

        if (password.length === 0) {
            return { level: '', text: '', color: '' };
        }

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;

        const levels = [
            { level: 'weak', text: 'Weak password', color: '#E74C3C' },
            { level: 'weak', text: 'Weak password', color: '#E74C3C' },
            { level: 'fair', text: 'Fair password', color: '#F39C12' },
            { level: 'good', text: 'Good password', color: '#4A90E2' },
            { level: 'strong', text: 'Strong password', color: '#2ECC71' }
        ];

        return levels[score] || levels[0];
    }

    // === REAL-TIME PASSWORD MATCH VALIDATION ===
    confirmPasswordInput.addEventListener('input', function () {
        if (this.value.length > 0) {
            if (this.value === passwordInput.value) {
                this.style.borderColor = '#2ECC71';
            } else {
                this.style.borderColor = '#E74C3C';
            }
        }
    });

    passwordInput.addEventListener('input', function () {
        if (confirmPasswordInput.value.length > 0) {
            if (confirmPasswordInput.value === this.value) {
                confirmPasswordInput.style.borderColor = '#2ECC71';
            } else {
                confirmPasswordInput.style.borderColor = '#E74C3C';
            }
        }
    });

    // === PHONE NUMBER FORMATTING (Community – Sudan Format) ===
    // Sudan format: 09X XXX XXXX (10 digits starting with 09)
    phoneInput.setAttribute('placeholder', '091 234 5678');
    phoneInput.setAttribute('maxlength', '12'); // 10 digits + 2 spaces
    phoneInput.addEventListener('input', function (e) {
        let value = this.value.replace(/\D/g, '');
        // Limit to 10 digits
        if (value.length > 10) value = value.slice(0, 10);
        // Format as: 09X XXX XXXX
        if (value.length >= 6) {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
        } else if (value.length >= 3) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        }
        this.value = value;
    });

    // === FORM SUBMISSION ===
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form values
        const nameValue = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAccepted = termsCheckbox.checked;

        // Get phone value depending on account type
        let phone;
        if (accountType === 'organization') {
            const code = countryCode.value;
            const num = phoneIntlInput.value.trim().replace(/\D/g, '');
            phone = code + num;
        } else {
            // Normalize Sudan phone: strip spaces, convert 09X → +249 9X
            const digits = phoneInput.value.replace(/\D/g, '');
            phone = '+249' + digits.slice(1); // strip leading 0, prepend +249
        }

        // Validation
        if (!nameValue || nameValue.length < 2) {
            showNotification(accountType === 'organization' ? 'Please enter the organization name / أدخل اسم المنظمة' : 'Please enter your full name / أدخل اسمك الكامل', 'error');
            fullNameInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address / أدخل بريدًا إلكترونيًا صحيحًا', 'error');
            emailInput.focus();
            return;
        }

        if (accountType === 'community') {
            const digits = phoneInput.value.replace(/\D/g, '');
            if (!digits.startsWith('09') || digits.length !== 10) {
                showNotification('Phone must be Sudan format: 09X XXX XXXX / يجب أن يكون رقم سوداني: 09XXXXXXXX', 'error');
                phoneInput.focus();
                return;
            }
        } else if (accountType === 'organization') {
            const num = phoneIntlInput.value.trim().replace(/\D/g, '');
            if (!num || num.length < 7) {
                showNotification('Please enter a valid phone number / أدخل رقم هاتف صحيح', 'error');
                phoneIntlInput.focus();
                return;
            }
        }

        if (password.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            confirmPasswordInput.focus();
            return;
        }

        if (!termsAccepted) {
            showNotification('Please accept the Terms & Conditions', 'error');
            return;
        }

        // Show loading state
        signupButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-flex';

        try {
            const role = accountType; // 'community' or 'organization'

            // Create auth account
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: nameValue,
                        phone: phone,
                        role: role
                    }
                }
            });

            if (error) throw error;

            // Insert into the appropriate profile table
            if (data.user) {
                if (role === 'organization') {
                    // Insert into organization_profiles
                    const { error: profileError } = await supabase
                        .from('organization_profiles')
                        .insert({
                            id: data.user.id,
                            org_name: nameValue,
                            phone: phone,
                            email: email
                        });

                    if (profileError) {
                        console.warn('Organization profile insert warning:', profileError.message);
                    } else {
                        console.log('Organization profile created ✓');
                    }
                } else {
                    // Insert into community_profiles
                    const { error: profileError } = await supabase
                        .from('community_profiles')
                        .insert({
                            id: data.user.id,
                            full_name: nameValue,
                            phone: phone,   // stored as +249XXXXXXXXX
                            email: email
                        });

                    if (profileError) {
                        console.warn('Community profile insert warning:', profileError.message);
                    } else {
                        console.log('Community profile created ✓');
                    }
                }
            }

            showNotification('Account created! Please check your email. / تم إنشاء الحساب! تحقق من بريدك.', 'success');

            // Redirect to login after short delay
            setTimeout(() => {
                window.location.href = 'wasil-login.html';
            }, 2000);

        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message, 'error');
            signupButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
        }
    });

    // === INPUT ANIMATIONS ===
    const inputFields = document.querySelectorAll('.input-field');

    inputFields.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // === NOTIFICATION SYSTEM ===
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

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

        const colors = {
            success: '#2ECC71',
            error: '#E74C3C',
            info: '#4A90E2',
            warning: '#F39C12'
        };
        notification.style.background = colors[type] || colors.info;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // === UTILITY FUNCTIONS ===
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const digitsOnly = phone.replace(/\D/g, '');
        // Sudan format: starts with 09, exactly 10 digits
        return digitsOnly.startsWith('09') && digitsOnly.length === 10;
    }

    console.log('Wasil Sign Up Page Initialized ✓');
});
