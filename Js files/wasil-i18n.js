// ============================================
// WASIL i18n – Centralized Translation System
// ============================================

const WASIL_TRANSLATIONS = {

    // ── Language Page ──
    "lang.title": { en: "Choose Your Language", ar: "اختر لغتك" },
    "lang.english": { en: "English", ar: "English" },
    "lang.arabic": { en: "العربية", ar: "العربية" },

    // ── Role Select Page ──
    "role.title": { en: "How will you use WASIL?", ar: "كيف ستستخدم واصل؟" },
    "role.community": { en: "Community Member", ar: "عضو مجتمع" },
    "role.community_desc": { en: "Report cases, find nearby clinics, and access health instructions.", ar: "الإبلاغ عن الحالات، البحث عن العيادات القريبة، والوصول للتعليمات الصحية." },
    "role.organization": { en: "Organization", ar: "منظمة" },
    "role.organization_desc": { en: "Assign clinics, provide services, and manage epidemic response.", ar: "تعيين العيادات، تقديم الخدمات، وإدارة الاستجابة للأوبئة." },
    "role.admin": { en: "System Admin", ar: "مدير النظام" },
    "role.admin_desc": { en: "Ministry of Health: manage epidemic response, review clinic requests, and monitor all users.", ar: "وزارة الصحة: إدارة الاستجابة للأوبئة، مراجعة طلبات العيادات، ومراقبة المستخدمين." },

    // ── Login Page ──
    "login.logo": { en: "WASIL", ar: "واصل" },
    "login.tagline": { en: "With you everywhere", ar: "معك في كل مكان" },
    "login.email_label": { en: "Phone Number or Email", ar: "رقم الهاتف أو البريد الإلكتروني" },
    "login.email_ph": { en: "Enter phone or email", ar: "أدخل رقم الهاتف أو البريد الإلكتروني" },
    "login.pass_label": { en: "Password", ar: "كلمة السر" },
    "login.pass_ph": { en: "Enter your password", ar: "أدخل كلمة السر" },
    "login.signin": { en: "Sign In", ar: "تسجيل الدخول" },
    "login.forgot": { en: "Forgot Password?", ar: "نسيت كلمة السر؟" },
    "login.demo": { en: "Demo Login:", ar: "تسجيل تجريبي:" },
    "login.no_account": { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
    "login.signup_link": { en: "Sign Up", ar: "إنشاء حساب" },

    // ── Sign Up Page ──
    "signup.logo": { en: "WASIL", ar: "واصل" },
    "signup.tagline": { en: "Create Your Account", ar: "أنشئ حسابك" },
    "signup.name_label": { en: "Full Name", ar: "الاسم الكامل" },
    "signup.name_ph": { en: "Enter your full name", ar: "أدخل اسمك الكامل" },
    "signup.email_label": { en: "Email Address", ar: "البريد الإلكتروني" },
    "signup.email_ph": { en: "Enter your email", ar: "أدخل بريدك الإلكتروني" },
    "signup.phone_label": { en: "Phone Number", ar: "رقم الهاتف" },
    "signup.phone_ph": { en: "Enter your phone number", ar: "أدخل رقم هاتفك" },
    "signup.pass_label": { en: "Password", ar: "كلمة السر" },
    "signup.pass_ph": { en: "Create a password", ar: "أنشئ كلمة سر" },
    "signup.confirm_label": { en: "Confirm Password", ar: "تأكيد كلمة السر" },
    "signup.confirm_ph": { en: "Confirm your password", ar: "أكّد كلمة السر" },
    "signup.terms": { en: "I agree to the", ar: "أوافق على" },
    "signup.terms_link": { en: "Terms & Conditions", ar: "الشروط والأحكام" },
    "signup.privacy_and": { en: "and", ar: "و" },
    "signup.privacy_link": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
    "signup.create": { en: "Create Account", ar: "إنشاء حساب" },
    "signup.has_account": { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
    "signup.signin_link": { en: "Sign In", ar: "تسجيل الدخول" },
    "signup.strength_weak": { en: "Weak", ar: "ضعيفة" },
    "signup.strength_fair": { en: "Fair", ar: "متوسطة" },
    "signup.strength_strong": { en: "Strong", ar: "قوية" },
    "signup.type_community": { en: "Community Member", ar: "عضو مجتمع" },
    "signup.type_org": { en: "Organization", ar: "منظمة" },
    "signup.org_name_label": { en: "Organization Name", ar: "اسم المنظمة" },
    "signup.org_name_ph": { en: "Enter organization name", ar: "أدخل اسم المنظمة" },
    "signup.phone_intl_ph": { en: "Phone number", ar: "رقم الهاتف" },

    // ── Forgot Password Page ──
    "forgot.logo": { en: "WASIL", ar: "واصل" },
    "forgot.tagline": { en: "With you everywhere", ar: "معك في كل مكان" },
    "forgot.step1_label": { en: "Enter Email", ar: "أدخل البريد" },
    "forgot.step2_label": { en: "Verify Code", ar: "تحقق من الرمز" },
    "forgot.step3_label": { en: "New Password", ar: "كلمة سر جديدة" },
    "forgot.info_email": { en: "Enter your email address and we'll send you a verification code to reset your password.", ar: "أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة السر." },
    "forgot.email_label": { en: "Email Address", ar: "البريد الإلكتروني" },
    "forgot.email_ph": { en: "Enter your email address", ar: "أدخل بريدك الإلكتروني" },
    "forgot.send_code": { en: "Send Verification Code", ar: "إرسال رمز التحقق" },
    "forgot.code_sent": { en: "We've sent a 6-digit verification code to", ar: "لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى" },
    "forgot.code_enter": { en: ". Please enter it below.", ar: ". يرجى إدخاله أدناه." },
    "forgot.code_label": { en: "Verification Code", ar: "رمز التحقق" },
    "forgot.no_code": { en: "Didn't receive the code?", ar: "لم يصلك الرمز؟" },
    "forgot.resend": { en: "Resend Code", ar: "إعادة إرسال الرمز" },
    "forgot.resend_timer": { en: "Resend available in", ar: "إعادة الإرسال متاحة خلال" },
    "forgot.verify": { en: "Verify Code", ar: "تحقق من الرمز" },
    "forgot.code_success": { en: "Code verified successfully! Now create your new password.", ar: "تم التحقق من الرمز بنجاح! الآن أنشئ كلمة سر جديدة." },
    "forgot.new_pass_label": { en: "New Password", ar: "كلمة السر الجديدة" },
    "forgot.new_pass_ph": { en: "Enter new password", ar: "أدخل كلمة السر الجديدة" },
    "forgot.confirm_label": { en: "Confirm New Password", ar: "تأكيد كلمة السر الجديدة" },
    "forgot.confirm_ph": { en: "Confirm new password", ar: "أكّد كلمة السر الجديدة" },
    "forgot.reset": { en: "Reset Password", ar: "إعادة تعيين كلمة السر" },
    "forgot.remember": { en: "Remember your password?", ar: "تتذكر كلمة السر؟" },
    "forgot.back_login": { en: "Back to Login", ar: "العودة لتسجيل الدخول" },
    "forgot.strength_label": { en: "Password strength:", ar: "قوة كلمة السر:" },
    "forgot.strength_weak": { en: "Weak", ar: "ضعيفة" },

    // ── Home Page ──
    "app-name": { en: "WASIL", ar: "واصل" },
    "app-slogan": { en: "YOUR HEALTH COMPANION", ar: "رفيقك الصحي" },
    "home.welcome": { en: "Welcome back,", ar: "مرحباً،" }, // Keeping for safety if used elsewhere

    // Hero & Actions
    "hero-title": { en: "Outbreak Response", ar: "استجابة للأوبئة" },
    "hero-desc": { en: "Check nearby mobile clinics, report symptoms, or request urgent assistance.", ar: "تحقق من العيادات المتنقلة القريبة، أبلغ عن الأعراض، أو اطلب مساعدة عاجلة." },
    "btn-report": { en: "Report Case", ar: "الإبلاغ عن حالة" },
    "btn-clinics": { en: "Nearby Clinics", ar: "العيادات القريبة" },
    "btn-assign-clinic": { en: "Assign Clinic", ar: "تعيين عيادة" },

    // Outbreak Status
    "sec-outbreak": { en: "Outbreak Status", ar: "حالة الوباء" },
    "area-khartoum": { en: "Khartoum North", ar: "الخرطوم بحري" },
    "risk-high": { en: "HIGH RISK", ar: "خطر مرتفع" },
    "cases-khartoum": { en: "1,245 Reported Cases", ar: "١,٢٤٥ حالة مبلغ عنها" },
    "area-omdurman": { en: "Omdurman", ar: "أم درمان" },
    "risk-moderate": { en: "MODERATE", ar: "متوسط" },
    "cases-omdurman": { en: "850 Reported Cases", ar: "٨٥٠ حالة مبلغ عنها" },

    // Disease Guide
    "sec-diseases": { en: "Common Diseases", ar: "الأمراض الشائعة" },
    "dis-cholera": { en: "Cholera", ar: "الكوليرا" },
    "sym-cholera": { en: "Watery diarrhea, vomiting, dehydration, leg cramps.", ar: "إسهال مائي، قيء، جفاف، تشنجات في الساق." },
    "dis-typhoid": { en: "Typhoid", ar: "التايفود" },
    "sym-typhoid": { en: "Prolonged fever, headache, nausea, loss of appetite.", ar: "حمى طويلة، صداع، غثيان، فقدان الشهية." },
    "dis-dengue": { en: "Dengue Fever", ar: "حمى الضنك" },
    "sym-dengue": { en: "High fever, rash, joint pain, eye pain.", ar: "حمى عالية، طفح جلدي، ألم المفاصل، ألم العين." },
    "dis-malaria": { en: "Malaria", ar: "الملاريا" },
    "sym-malaria": { en: "Fever, chills, sweets, headache, fatigue.", ar: "حمى، قشعريرة، تعرق، صداع، تعب." },

    // Health Instructions (Community)
    "sec-health-inst": { en: "Health Instructions", ar: "تعليمات صحية" },
    "inst-wash-title": { en: "Wash Hands Frequently", ar: "اغسل يديك بانتظام" },
    "inst-wash-desc": { en: "Use soap and water for at least 20 seconds, especially before eating and after using the restroom.", ar: "استخدم الصابون والماء لمدة 20 ثانية على الأقل، خاصة قبل الأكل وبعد استخدام الحمام." },
    "inst-water-title": { en: "Drink Clean Water", ar: "اشرب مياه نظيفة" },
    "inst-water-desc": { en: "Always boil or filter water before drinking. Avoid untreated or stagnant water sources.", ar: "قم بغلي أو تصفية المياه دائماً قبل الشرب. تجنب مصادر المياه غير المعالجة أو الراكدة." },
    "inst-symptoms-title": { en: "Report Symptoms Early", ar: "أبلغ عن الأعراض مبكراً" },
    "inst-symptoms-desc": { en: "If you experience fever, diarrhea, or vomiting, report to the nearest clinic immediately.", ar: "إذا شعرت بحمى، إسهال، أو قيء، أبلغ أقرب عيادة فوراً." },
    "inst-vaccine-title": { en: "Stay Vaccinated", ar: "التزم بالتطعيمات" },
    "inst-vaccine-desc": { en: "Ensure you and your family are up to date with recommended vaccinations.", ar: "تأكد من أنك وعائلتك قد أخذتم التطعيمات الموصى بها." },

    // Services View
    "sec-services-view": { en: "Medical Services", ar: "الخدمات الطبية" },
    "svc-symptom": { en: "Symptom", ar: "فحص" },
    "svc-screening": { en: "Screening", ar: "الأعراض" },
    "svc-vaccination": { en: "Vaccination", ar: "مراكز" },
    "svc-centers": { en: "Centers", ar: "التطعيم" },
    "svc-rapid": { en: "Rapid", ar: "فحص" },
    "svc-testing": { en: "Testing", ar: "سريع" },
    "svc-request": { en: "Request", ar: "طلب" },
    "svc-ambulance": { en: "Ambulance", ar: "إسعاف" },

    // Navigation
    "nav-home": { en: "Home", ar: "الرئيسية" },
    "nav-services": { en: "Services", ar: "الخدمات" },
    "nav-clinic": { en: "Assign Clinic", ar: "تعيين عيادة" },
    "nav-logout": { en: "Logout", ar: "تسجيل الخروج" },

    // ── Login Page – Role Banner ──
    "login.role_admin": { en: "Ministry of Health – Admin Login", ar: "وزارة الصحة – تسجيل دخول المدير" },
    "login.role_org": { en: "Organization Login", ar: "تسجيل دخول المنظمة" },
    "login.role_community": { en: "Community Member Login", ar: "تسجيل دخول عضو المجتمع" },

    // ── Admin Page ──
    "admin.title": { en: "Ministry of Health", ar: "وزارة الصحة" },
    "admin.subtitle": { en: "WASIL System Admin", ar: "مدير نظام واصل" },
    "admin.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
    "admin.deployed_clinics": { en: "Deployed Clinics", ar: "العيادات المنتشرة" },
    "admin.clinic_requests": { en: "Clinic Requests", ar: "طلبات العيادات" },
    "admin.system_users": { en: "System Users", ar: "مستخدمو النظام" },
    "admin.logout": { en: "Logout", ar: "تسجيل الخروج" },

    // Admin – Dashboard
    "admin.epidemic_situation": { en: "Epidemic Situation", ar: "الوضع الوبائي" },
    "admin.registered_diseases": { en: "Registered Diseases", ar: "الأمراض المسجلة" },
    "admin.epidemic_areas": { en: "Epidemic Areas", ar: "المناطق الوبائية" },
    "admin.total_cases": { en: "Total Cases", ar: "إجمالي الحالات" },
    "admin.severity": { en: "Severity", ar: "الخطورة" },
    "admin.location": { en: "Location", ar: "الموقع" },
    "admin.cases": { en: "Cases", ar: "الحالات" },
    "admin.rank": { en: "Rank", ar: "الترتيب" },

    // Admin – Deployed Clinics
    "admin.clinic_name": { en: "Clinic Name", ar: "اسم العيادة" },
    "admin.capacity": { en: "Capacity", ar: "الطاقة الاستيعابية" },
    "admin.diseases_treated": { en: "Diseases Treated", ar: "الأمراض المعالجة" },
    "admin.schedule": { en: "Schedule", ar: "الجدول الزمني" },
    "admin.operating_party": { en: "Operating Party", ar: "الجهة المشغلة" },
    "admin.deployed_by_moh": { en: "MOH", ar: "وزارة الصحة" },
    "admin.status_active": { en: "Active", ar: "نشط" },
    "admin.status_pending": { en: "Pending", ar: "قيد الانتظار" },

    // Admin – Clinic Requests
    "admin.pending_requests": { en: "Pending Requests", ar: "الطلبات المعلقة" },
    "admin.org_name": { en: "Organization", ar: "المنظمة" },
    "admin.requested_area": { en: "Target Area", ar: "المنطقة المستهدفة" },
    "admin.btn_approve": { en: "Approve", ar: "موافقة" },
    "admin.btn_reject": { en: "Reject", ar: "رفض" },
    "admin.date_requested": { en: "Date", ar: "التاريخ" },
    "admin.no_requests": { en: "No pending requests", ar: "لا توجد طلبات معلقة" },

    // Admin – System Users
    "admin.organizations": { en: "Organizations", ar: "المنظمات" },
    "admin.community_users": { en: "Community Users", ar: "مستخدمو المجتمع" },
    "admin.contact": { en: "Contact", ar: "التواصل" },
    "admin.approved_count": { en: "Approved", ar: "تمت الموافقة" },
    "admin.rejected_count": { en: "Rejected", ar: "تم الرفض" },
    "admin.reported_disease": { en: "Reported Disease", ar: "المرض المبلغ عنه" },
    "admin.user_name": { en: "Name", ar: "الاسم" },
    "admin.user_phone": { en: "Phone", ar: "الهاتف" },
    "admin.user_email": { en: "Email", ar: "البريد الإلكتروني" },
    "admin.user_location": { en: "Location", ar: "الموقع" },

    // ── NEW: Service Request Modal (Home) ──
    "home.request_service": { en: "Request Service", ar: "طلب خدمة" },
    "home.service_type": { en: "Service Type", ar: "نوع الخدمة" },
    "home.your_location": { en: "Your Location", ar: "موقعك" },
    "home.location_desc": { en: "Enter your area or exact address", ar: "أدخل منطقتك أو عنوانك الدقيق" },
    "home.location_ph": { en: "e.g. Omdurman, Block 7", ar: "مثل أم درمان، المربع ٧" },
    "home.cancel": { en: "Cancel", ar: "إلغاء" },
    "home.confirm_request": { en: "Confirm Request", ar: "تأكيد الطلب" },
    "home.requesting": { en: "Requesting...", ar: "جاري الطلب..." },

    // ── NEW: Report Case Page ──
    "report.title": { en: "Report a Case", ar: "الإبلاغ عن حالة" },
    "report.back": { en: "Back", ar: "رجوع" },
    "report.success": { en: "Case reported successfully!", ar: "تم الإبلاغ عن الحالة بنجاح!" },
    "report.info": { en: "Your report helps health authorities deploy mobile clinics faster. All reports are confidential.", ar: "بلاغك يساعد السلطات الصحية في نشر العيادات المتنقلة بشكل أسرع. جميع البلاغات سرية." },
    "report.sec_disease": { en: "Suspected Disease", ar: "المرض المشتبه به" },
    "dis.unknown": { en: "Unknown", ar: "غير معروف" },
    "dis.other": { en: "Other", ar: "أخرى" },
    "report.other_disease_ph": { en: "Enter disease name...", ar: "أدخل اسم المرض..." },
    "report.sec_severity": { en: "Severity Level", ar: "مستوى الخطورة" },
    "sev.critical": { en: "Critical", ar: "حرج" },
    "sev.critical_desc": { en: "Life-threatening", ar: "يهدد الحياة" },
    "sev.high": { en: "High", ar: "مرتفع" },
    "sev.high_desc": { en: "Spreading fast", ar: "سريع الانتشار" },
    "sev.moderate": { en: "Moderate", ar: "متوسط" },
    "sev.moderate_desc": { en: "Manageable", ar: "يمكن السيطرة عليه" },
    "sev.low": { en: "Low", ar: "منخفض" },
    "sev.low_desc": { en: "Isolated case", ar: "حالة معزولة" },
    "report.sec_location": { en: "Your Location", ar: "موقعك" },
    "report.area": { en: "Area / Neighborhood", ar: "المنطقة / الحي" },
    "report.select_area": { en: "Select your area...", ar: "اختر منطقتك..." },
    "report.other_area": { en: "Other area...", ar: "منطقة أخرى..." },
    "report.location_specify": { en: "Specify Location", ar: "حدد الموقع" },
    "report.location_ph": { en: "Enter your area or address...", ar: "أدخل منطقتك أو عنوانك..." },
    "report.specific_address": { en: "Specific Address / Block", ar: "العنوان الدقيق / المربع" },
    "report.specific_address_ph": { en: "e.g. Block 7, near the school...", ar: "مثل المربع ٧، بالقرب من المدرسة..." },
    "report.optional": { en: "Optional", ar: "اختياري" },
    "report.sec_desc": { en: "Description", ar: "الوصف" },
    "report.symptoms": { en: "Symptoms & Details", ar: "الأعراض والتفاصيل" },
    "report.symptoms_ph": { en: "Describe symptoms, number of people affected, any relevant details...", ar: "صف الأعراض، عدد الأشخاص المتأثرين، وأي تفاصيل ذات صلة..." },
    // ── NEW: Dashboard Placeholder ──
    "dashboard.coming_soon": { en: "Detailed statistics coming soon.", ar: "الإحصائيات التفصيلية قريباً." },
    "dashboard.back_home": { en: "Back to Home", ar: "العودة للرئيسية" }
};


// ── Apply Language ──
function applyLanguage() {
    var lang = localStorage.getItem('wasil_lang') || 'en';
    var isArabic = (lang === 'ar');

    // Set direction and lang attribute
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    // Cairo font on ALL pages (Cairo supports both Arabic & Latin scripts)
    document.body.style.fontFamily = "'Cairo', 'Inter', -apple-system, sans-serif";

    // Translate text content
    var textElements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textElements.length; i++) {
        var key = textElements[i].getAttribute('data-i18n');
        if (WASIL_TRANSLATIONS[key] && WASIL_TRANSLATIONS[key][lang]) {
            textElements[i].textContent = WASIL_TRANSLATIONS[key][lang];
        }
    }

    // Translate placeholders
    var phElements = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phElements.length; j++) {
        var phKey = phElements[j].getAttribute('data-i18n-placeholder');
        if (WASIL_TRANSLATIONS[phKey] && WASIL_TRANSLATIONS[phKey][lang]) {
            phElements[j].setAttribute('placeholder', WASIL_TRANSLATIONS[phKey][lang]);
        }
    }
}

// Helper to get a single translation
function t(key) {
    var lang = localStorage.getItem('wasil_lang') || 'en';
    if (WASIL_TRANSLATIONS[key] && WASIL_TRANSLATIONS[key][lang]) {
        return WASIL_TRANSLATIONS[key][lang];
    }
    return key;
}

// Auto-apply on DOM ready
document.addEventListener('DOMContentLoaded', applyLanguage);
