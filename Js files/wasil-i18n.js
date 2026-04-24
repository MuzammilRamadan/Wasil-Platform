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
    "login.role_admin": { en: "Ministry of Health – Admin Login", ar: "وزارة الصحة – تسجيل دخول المدير" },
    "login.role_org": { en: "Organization Login", ar: "تسجيل دخول المنظمة" },
    "login.role_community": { en: "Community Member Login", ar: "تسجيل دخول عضو المجتمع" },

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
    "home.welcome": { en: "Welcome back,", ar: "مرحباً،" },

    // Hero & Actions
    "hero-title": { en: "Outbreak Response", ar: "استجابة للأوبئة" },
    "hero-desc": { en: "Check nearby mobile clinics, report symptoms, or request urgent assistance.", ar: "تحقق من العيادات المتنقلة القريبة، أبلغ عن الأعراض، أو اطلب مساعدة عاجلة." },
    "btn-report": { en: "Report Case", ar: "الإبلاغ عن حالة" },
    "btn-clinics": { en: "Nearby Clinics", ar: "العيادات القريبة" },
    "btn-assign-clinic": { en: "Assign Clinic", ar: "تعيين عيادة" },

    // Outbreak Status
    "sec-outbreak": { en: "Outbreak Status", ar: "حالة الوباء" },
    "home.live": { en: "Live", ar: "مباشر" },
    "home.loading_outbreak": { en: "Loading outbreak data...", ar: "جاري تحميل بيانات الوباء..." },
    "home.loading_clinics": { en: "Loading deployed clinics...", ar: "جاري تحميل العيادات المنتشرة..." },
    "home.req_success": { en: "Request submitted successfully!", ar: "تم تقديم الطلب بنجاح!" },

    // Disease Guide
    "sec-diseases": { en: "Common Diseases", ar: "الأمراض الشائعة" },
    "dis-cholera": { en: "Cholera", ar: "الكوليرا" },
    "sym-cholera": { en: "Watery diarrhea, vomiting, dehydration, leg cramps.", ar: "إسهال مائي، قيء، جفاف، تشنجات في الساق." },
    "dis-typhoid": { en: "Typhoid", ar: "التايفود" },
    "sym-typhoid": { en: "Prolonged fever, headache, nausea, loss of appetite.", ar: "حمى طويلة، صداع، غثيان، فقدان الشهية." },
    "dis-dengue": { en: "Dengue Fever", ar: "حمى الضنك" },
    "sym-dengue": { en: "High fever, rash, joint pain, eye pain.", ar: "حمى عالية، طفح جلدي، ألم المفاصل، ألم العين." },
    "dis-malaria": { en: "Malaria", ar: "الملاريا" },
    "sym-malaria": { en: "Fever, chills, sweats, headache, fatigue.", ar: "حمى، قشعريرة، تعرق، صداع، تعب." },

    // Health Instructions
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
    "svc.vaccination": { en: "Vaccination", ar: "التطعيم" },
    "svc.vaccination_sub": { en: "Find Vaccine Centers", ar: "ابحث عن مراكز التطعيم" },
    "svc.ambulance": { en: "Rapid Ambulance", ar: "إسعاف سريع" },
    "svc.ambulance_sub": { en: "Emergency Transport", ar: "نقل طارئ" },
    "svc.consult": { en: "Medical Consult", ar: "استشارة طبية" },
    "svc.consult_sub": { en: "Talk to a Doctor", ar: "تحدث مع طبيب" },
    "svc.water": { en: "Water & Sanitation", ar: "المياه والصرف الصحي" },
    "svc.water_sub": { en: "Report Issues", ar: "أبلغ عن مشكلة" },
    "svc.nutrition": { en: "Nutrition Support", ar: "دعم التغذية" },
    "svc.nutrition_sub": { en: "Aid Programs", ar: "برامج المساعدة" },
    "svc.mental": { en: "Mental Health", ar: "الصحة النفسية" },
    "svc.mental_sub": { en: "Counseling & Aid", ar: "إرشاد ودعم" },

    // Org Dashboard
    "home.epidemic_dashboard": { en: "Epidemic Dashboard", ar: "لوحة تحكم الوباء" },
    "home.back_home": { en: "Back to Home", ar: "العودة للرئيسية" },
    "home.disease_severity": { en: "Disease Severity", ar: "خطورة المرض" },
    "home.loading_severity": { en: "Loading disease severity data...", ar: "جاري تحميل بيانات خطورة المرض..." },
    "home.reported_cases": { en: "Reported Cases", ar: "الحالات المبلغ عنها" },
    "home.prioritized": { en: "Prioritized", ar: "حسب الأولوية" },
    "home.grouping_cases": { en: "Grouping reported cases...", ar: "جاري تجميع الحالات المبلغ عنها..." },
    "home.request_assignation": { en: "Request Clinic Assignation", ar: "طلب تعيين عيادة" },

    // Requested Services view
    "home.requested_services": { en: "Requested Services", ar: "الخدمات المطلوبة" },
    "home.community_requests": { en: "Community Requests", ar: "طلبات المجتمع" },

    // Assigned Clinics view
    "home.assigned_clinics": { en: "Assigned Clinics", ar: "العيادات المعينة" },
    "home.active_clinics": { en: "Active Clinics", ar: "العيادات النشطة" },
    "home.pending_requests": { en: "Pending Requests", ar: "الطلبات المعلقة" },
    "home.areas_covered": { en: "Areas Covered", ar: "المناطق المغطاة" },
    "home.rejected": { en: "Rejected", ar: "مرفوض" },
    "home.your_requests": { en: "Your Requests", ar: "طلباتك" },
    "home.loading_your_req": { en: "Loading your clinic requests...", ar: "جاري تحميل طلبات عيادتك..." },

    // Service Request Modal
    "home.request_service": { en: "Request Service", ar: "طلب خدمة" },
    "home.service_type": { en: "Service Type", ar: "نوع الخدمة" },
    "home.your_location": { en: "Your Location", ar: "موقعك" },
    "home.location_desc": { en: "Enter your area or exact address", ar: "أدخل منطقتك أو عنوانك الدقيق" },
    "home.location_ph": { en: "e.g. Omdurman, Block 7", ar: "مثل أم درمان، المربع ٧" },
    "home.contact_info": { en: "Contact Information", ar: "معلومات الاتصال" },
    "home.contact_ph": { en: "e.g. +249 91 234 5678", ar: "مثال: 249 91 234 5678+" },
    "home.vaccine_type": { en: "Vaccination Type", ar: "نوع اللقاح" },
    "home.select_vaccine": { en: "Select vaccine type...", ar: "اختر نوع اللقاح..." },
    "home.case_type": { en: "Case Type", ar: "نوع الحالة" },
    "home.select_case": { en: "Select case type...", ar: "اختر نوع الحالة..." },
    "home.cancel": { en: "Cancel", ar: "إلغاء" },
    "home.confirm_request": { en: "Confirm Request", ar: "تأكيد الطلب" },
    "home.requesting": { en: "Requesting...", ar: "جاري الطلب..." },

    // Assignation Modal
    "home.clinic_target": { en: "Clinic Target Area", ar: "المنطقة المستهدفة للعيادة" },
    "home.select_areas": { en: "Select areas affected by epidemic", ar: "اختر المناطق المتضررة من الوباء" },
    "home.supplies": { en: "Supplies & Offerings", ar: "المستلزمات والعروض" },
    "home.supplies_ph": { en: "List what your organization will provide (e.g., Cholera vaccines, ORS packets, IV fluids...)", ar: "اذكر ما ستقدمه منظمتك (مثل لقاحات الكوليرا، محاليل الإماهة، السوائل الوريدية...)" },
    "home.deploy_date": { en: "Deployment Date", ar: "تاريخ الانتشار" },
    "home.operation_time": { en: "Operation Time", ar: "وقت التشغيل" },
    "home.operation_ph": { en: "e.g. 09:00 AM - 05:00 PM", ar: "مثال: 09:00 صباحاً - 05:00 مساءً" },

    // Notifications Modal
    "home.notifications": { en: "Notifications", ar: "الإشعارات" },
    "home.no_notifications": { en: "No new notifications", ar: "لا توجد إشعارات جديدة" },

    // Navigation
    "nav-home": { en: "Home", ar: "الرئيسية" },
    "nav-services": { en: "Services", ar: "الخدمات" },
    "nav-clinic": { en: "Assign Clinic", ar: "تعيين عيادة" },
    "nav-logout": { en: "Logout", ar: "تسجيل الخروج" },
    "nav-assigned": { en: "Assigned Clinics", ar: "العيادات المعينة" },

    // ── Admin Page ──
    "admin.title": { en: "Ministry of Health", ar: "وزارة الصحة" },
    "admin.subtitle": { en: "WASIL System Admin", ar: "مدير نظام واصل" },
    "admin.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
    "admin.deployed_clinics": { en: "Deployed Clinics", ar: "العيادات المنتشرة" },
    "admin.clinic_requests": { en: "Clinic Requests", ar: "طلبات العيادات" },
    "admin.system_users": { en: "System Users", ar: "مستخدمو النظام" },
    "admin.manage_diseases": { en: "Manage Diseases", ar: "إدارة الأمراض" },
    "admin.outbreak_dashboard": { en: "Outbreak Dashboard", ar: "لوحة تحكم الوباء" },
    "admin.logout": { en: "Logout", ar: "تسجيل الخروج" },

    // Admin – Dashboard
    "admin.epidemic_situation": { en: "Epidemic Situation", ar: "الوضع الوبائي" },
    "admin.overview_sub": { en: "Ministry of Health — Real-time Overview", ar: "وزارة الصحة — نظرة عامة في الوقت الفعلي" },
    "admin.loading_disease": { en: "Loading disease statistics...", ar: "جاري تحميل إحصائيات الأمراض..." },
    "admin.registered_diseases": { en: "Registered Diseases", ar: "الأمراض المسجلة" },
    "admin.epidemic_areas": { en: "Epidemic Areas", ar: "المناطق الوبائية" },
    "admin.select_area": { en: "Select an area to view ranked sub-areas", ar: "اختر منطقة لعرض المناطق الفرعية المصنفة" },
    "admin.loading_area": { en: "Loading area data...", ar: "جاري تحميل بيانات المنطقة..." },
    "admin.total_cases": { en: "Total Cases", ar: "إجمالي الحالات" },
    "admin.severity": { en: "Severity", ar: "الخطورة" },
    "admin.location": { en: "Location", ar: "الموقع" },
    "admin.cases": { en: "Cases", ar: "الحالات" },
    "admin.rank": { en: "Rank", ar: "الترتيب" },

    // Admin – Deployed Clinics
    "admin.active_clinics_sub": { en: "All active clinics — MOH & Organization operated", ar: "جميع العيادات النشطة — وزارة الصحة والمنظمات" },
    "admin.active_deploy": { en: "Active Deployments", ar: "الانتشارات النشطة" },
    "admin.clinic_name": { en: "Clinic Name", ar: "اسم العيادة" },
    "admin.capacity": { en: "Capacity", ar: "الطاقة الاستيعابية" },
    "admin.diseases_treated": { en: "Diseases Treated", ar: "الأمراض المعالجة" },
    "admin.schedule": { en: "Schedule", ar: "الجدول الزمني" },
    "admin.operating_party": { en: "Operating Party", ar: "الجهة المشغلة" },
    "admin.deployed_by_moh": { en: "MOH", ar: "وزارة الصحة" },
    "admin.status": { en: "Status", ar: "الحالة" },
    "admin.status_active": { en: "Active", ar: "نشط" },
    "admin.status_pending": { en: "Pending", ar: "قيد الانتظار" },
    "admin.loading_deployed": { en: "Loading deployed clinics...", ar: "جاري تحميل العيادات المنتشرة..." },

    // Admin – Clinic Requests
    "admin.clinic_req_sub": { en: "Review and approve organization clinic assignment requests", ar: "مراجعة وقبول طلبات تعيين العيادات من المنظمات" },
    "admin.loading_requests": { en: "Loading clinic requests...", ar: "جاري تحميل الطلبات..." },
    "admin.pending_requests": { en: "Pending Requests", ar: "الطلبات المعلقة" },
    "admin.org_name": { en: "Organization", ar: "المنظمة" },
    "admin.requested_area": { en: "Target Area", ar: "المنطقة المستهدفة" },
    "admin.btn_approve": { en: "Approve", ar: "موافقة" },
    "admin.btn_reject": { en: "Reject", ar: "رفض" },
    "admin.date_requested": { en: "Date", ar: "التاريخ" },
    "admin.no_requests": { en: "No pending requests", ar: "لا توجد طلبات معلقة" },

    // Admin – System Users
    "admin.system_user_sub": { en: "All registered users in the WASIL platform", ar: "جميع المستخدمين المسجلين في منصة واصل" },
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
    "admin.actions": { en: "Actions", ar: "الإجراءات" },
    "admin.loading_orgs": { en: "Loading organizations...", ar: "جاري تحميل المنظمات..." },
    "admin.loading_community": { en: "Loading community users...", ar: "جاري تحميل مستخدمي المجتمع..." },

    // Admin – Outbreak Dashboard
    "admin.realtime_cases": { en: "Real-time community-reported cases", ar: "الحالات المبلغ عنها من المجتمع في الوقت الفعلي" },
    "admin.cases_by_area": { en: "Cases by Area", ar: "الحالات حسب المنطقة" },
    "admin.sorted_severity": { en: "Sorted by severity & count", ar: "مرتبة حسب الخطورة والعدد" },
    "admin.recent_cases": { en: "Recent Reported Cases", ar: "الحالات المبلغ عنها مؤخراً" },
    "admin.loading_outbreak_data": { en: "Loading outbreak data...", ar: "جاري تحميل بيانات الوباء..." },

    // Admin – Manage Diseases
    "admin.active_diseases": { en: "Active Diseases", ar: "الأمراض النشطة" },
    "admin.add_disease": { en: "Add New Disease", ar: "إضافة مرض جديد" },
    "admin.disease_name": { en: "Disease Name", ar: "اسم المرض" },
    "admin.disease_name_ph": { en: "e.g. COVID-19", ar: "مثال: COVID-19" },
    "admin.default_severity": { en: "Default Severity", ar: "الخطورة الافتراضية" },
    "admin.add_disease_btn": { en: "Add Disease", ar: "إضافة مرض" },
    "admin.disease_th_name": { en: "Name", ar: "الاسم" },
    "admin.disease_th_severity": { en: "Default Severity", ar: "الخطورة الافتراضية" },
    "admin.disease_th_status": { en: "Status", ar: "الحالة" },
    "admin.disease_th_actions": { en: "Actions", ar: "الإجراءات" },
    "admin.loading_diseases": { en: "Loading diseases...", ar: "جاري تحميل الأمراض..." },
    "admin.manage_diseases_sub": { en: "Add or remove diseases from the reporting system", ar: "إضافة أو إزالة الأمراض من نظام الإبلاغ" },

    // ── Report Case Page ──
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
    "report.submit": { en: "Submit Report", ar: "إرسال التقرير" },
    "report.submitting": { en: "Submitting...", ar: "جاري الإرسال..." },

    // ── Dashboard ──
    "dashboard.coming_soon": { en: "Detailed statistics coming soon.", ar: "الإحصائيات التفصيلية قريباً." },
    "dashboard.back_home": { en: "Back to Home", ar: "العودة للرئيسية" },

    // ── Landing Page ──
    "landing.navCta": { en: "Enter Platform", ar: "دخول المنصة" },
    "landing.heroBadgeText": { en: "Live Epidemic Monitoring", ar: "مراقبة الأوبئة لحظة بلحظة" },
    "landing.heroTitleAr": { en: "WASIL — Epidemic Response Platform", ar: "واصِل — منصة الاستجابة الوبائية" },
    "landing.heroTitleEn": { en: "Connecting communities to mobile clinics in real-time", ar: "تربط المجتمعات بالعيادات المتنقلة في الوقت الفعلي" },
    "landing.heroGetStarted": { en: "Get Started", ar: "ابدأ الآن" },
    "landing.heroLogin": { en: "Login", ar: "تسجيل الدخول" },
    "landing.statCases": { en: "Cases Reported", ar: "حالة مُبلَّغ عنها" },
    "landing.statClinics": { en: "Clinics Deployed", ar: "عيادة منتشرة" },
    "landing.statRoles": { en: "User Roles", ar: "أدوار المستخدمين" },
    "landing.statAlerts": { en: "Real-time Alerts", ar: "تنبيهات فورية" },
    "landing.hiwLabel": { en: "How It Works", ar: "كيف يعمل" },
    "landing.hiwHeading": { en: "One platform, three roles", ar: "منصة واحدة، ثلاثة أدوار" },
    "landing.roleCommunityTitle": { en: "Community Member", ar: "عضو المجتمع" },
    "landing.roleCommunityDesc": { en: "Report disease cases, find nearby mobile clinics, and access emergency health instructions for your family.", ar: "أبلغ عن حالات الأمراض، جد العيادات المتنقلة القريبة، واحصل على تعليمات صحية طارئة لعائلتك." },
    "landing.roleOrgTitle": { en: "Organization", ar: "منظمة صحية" },
    "landing.roleOrgDesc": { en: "Deploy mobile clinics, manage field operations, and respond to community service requests in affected areas.", ar: "انشر العيادات المتنقلة، وأدر العمليات الميدانية، واستجب لطلبات خدمة المجتمع في المناطق المتضررة." },
    "landing.roleAdminTitle": { en: "MOH System Admin", ar: "مدير نظام وزارة الصحة" },
    "landing.roleAdminDesc": { en: "Monitor the entire epidemic response system, approve clinic requests, and oversee all registered users.", ar: "راقب نظام الاستجابة الوبائية بالكامل، وافق على طلبات العيادات، وأشرف على جميع المستخدمين المسجلين." },
    "landing.featLabel": { en: "Platform Features", ar: "مميزات المنصة" },
    "landing.featHeading": { en: "Everything you need for epidemic response", ar: "كل ما تحتاجه للاستجابة للأوبئة" },
    "landing.feat1Title": { en: "Real-time Epidemic Map", ar: "خريطة الأوبئة المباشرة" },
    "landing.feat1Desc": { en: "Track active outbreaks across regions with live severity indicators and case counts.", ar: "تتبع تفشيات الأمراض النشطة عبر المناطق مع مؤشرات الخطورة المباشرة وأعداد الحالات." },
    "landing.feat2Title": { en: "Clinic Requests", ar: "طلبات العيادات" },
    "landing.feat2Desc": { en: "Organizations can request mobile clinic deployments to epidemic-hit areas instantly.", ar: "تستطيع المنظمات طلب نشر العيادات المتنقلة في المناطق المتضررة بشكل فوري." },
    "landing.feat3Title": { en: "Case Reporting", ar: "الإبلاغ عن الحالات" },
    "landing.feat3Desc": { en: "Community members can report disease symptoms and cases directly from their phones.", ar: "يمكن لأفراد المجتمع الإبلاغ عن أعراض الأمراض والحالات مباشرة من هواتفهم." },
    "landing.feat4Title": { en: "Admin Dashboard", ar: "لوحة التحكم الإدارية" },
    "landing.feat4Desc": { en: "Full oversight for MOH admins — manage clinics, users, and response operations.", ar: "إشراف كامل لمدراء وزارة الصحة — إدارة العيادات والمستخدمين والعمليات." },
    "landing.feat5Title": { en: "Multilingual Support", ar: "دعم متعدد اللغات" },
    "landing.feat5Desc": { en: "Full Arabic and English localization for all users across Sudan.", ar: "توطين كامل بالعربية والإنجليزية لجميع المستخدمين عبر السودان." },
    "landing.feat6Title": { en: "Secure Authentication", ar: "مصادقة آمنة" },
    "landing.feat6Desc": { en: "Role-based access with Supabase authentication, keeping data safe and private.", ar: "وصول قائم على الأدوار مع مصادقة Supabase، للحفاظ على أمان البيانات وخصوصيتها." },
    "landing.ctaHeading": { en: "Join the response today", ar: "انضم إلى الاستجابة اليوم" },
    "landing.ctaDesc": { en: "Whether you're a community member, an organization, or MOH — WASIL connects you to save lives.", ar: "سواء كنت عضواً في المجتمع أو منظمة أو وزارة الصحة — واصِل يربطك لإنقاذ الأرواح." },
    "landing.ctaGetStarted": { en: "Get Started", ar: "ابدأ الآن" },
    "landing.ctaLogin": { en: "Login", ar: "تسجيل الدخول" },
    "landing.footerTagline": { en: "Electronic Health Platform — Sudan", ar: "منصة الصحة الإلكترونية — السودان" },
    "landing.footerRoles": { en: "Select Role", ar: "اختيار الدور" },
    "landing.footerLogin": { en: "Login", ar: "تسجيل الدخول" },
    "landing.footerSignup": { en: "Sign Up", ar: "إنشاء حساب" },
    "landing.footerAbout": { en: "Who Are We", ar: "من نحن" },
    "landing.footerContact": { en: "Contact", ar: "تواصل معنا" },
    "landing.footerPrivacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
    "landing.tickerLive": { en: "LIVE", ar: "مباشر" },
    "landing.ticker1": { en: "Khartoum North — Cholera Outbreak (HIGH RISK)", ar: "الخرطوم بحري — تفشي الكوليرا (خطر مرتفع)" },
    "landing.ticker2": { en: "Omdurman — Typhoid Cases Rising (MODERATE)", ar: "أم درمان — ارتفاع حالات التيفود (متوسط)" },
    "landing.ticker3": { en: "Jabarona — Cholera Alert (HIGH RISK)", ar: "جبرونا — تحذير كوليرا (خطر مرتفع)" },
    "landing.ticker4": { en: "Bahri — Dengue Fever Detected", ar: "بحري — رصد حمى الضنك" },
    "landing.ticker5": { en: "Haj Yousif — Malaria Cluster Reported", ar: "حاج يوسف — تقارير عن تجمع ملاريا" },
    "landing.footerCopy": { en: "© 2026 WASIL. All rights reserved.", ar: "© 2026 واصل. جميع الحقوق محفوظة." },

    "page.last_updated": { en: "Last updated:", ar: "آخر تحديث:" },

    // ── Dashboard ──
    "dash.title": { en: "Outbreak Dashboard", ar: "لوحة تتبع الأوبئة" },
    "dash.subtitle": { en: "Cases submitted by community users", ar: "الحالات المرسلة من قبل مستخدمي المجتمع" },
    "dash.by_area": { en: "📍 By Area", ar: "📍 حسب المنطقة" },
    "dash.recent": { en: "🕐 Recent Cases", ar: "🕐 الحالات الأخيرة" },
    "dash.total": { en: "Total", ar: "الإجمالي" },
    "dash.loading_data": { en: "Loading outbreak data...", ar: "جاري تحميل بيانات الأوبئة..." },
    "dash.loading_recent": { en: "Loading recent cases...", ar: "جاري تحميل الحالات الأخيرة..." },
    "dash.no_cases_title": { en: "No Cases Reported Yet", ar: "لم يتم الإبلاغ عن حالات بعد" },
    "dash.no_cases_desc": { en: "Cases submitted by community users will appear here in real time.", ar: "ستظهر الحالات المرسلة من مستخدمي المجتمع هنا في الوقت الفعلي." },
    "dash.failed": { en: "Failed to load data.", ar: "فشل تحميل البيانات." },
    "dash.reported_cases": { en: "reported cases", ar: "حالات مبلغ عنها" },
    "dash.reported_case": { en: "reported case", ar: "حالة مبلغ عنها" },

    // ── Who Are We Page ──
    "whoarewe.badge": { en: "About Us", ar: "من نحن" },
    "whoarewe.title": { en: "Who Are We?", ar: "من نحن؟" },
    "whoarewe.subtitle": { en: "A dedicated team bridging the gap between communities in need and life-saving health services during epidemics in Sudan.", ar: "فريق متخصص يسد الفجوة بين المجتمعات المحتاجة وخدمات الصحة المنقذة خلال الأوبئة في السودان." },
    "whoarewe.mission_title": { en: "Our Mission", ar: "رسالتنا" },
    "whoarewe.mission_text": { en: "WASIL \u2014 Arabic for \"the one who connects\" \u2014 is an electronic health platform built to bridge the gap between affected communities and mobile health services during epidemic crises in Sudan. We believe that timely access to medical information and emergency response can save lives.", ar: "واصل منصة صحة إلكترونية بنيت لسد الفجوة بين المجتمعات المتضررة وخدمات الصحة المتنقلة خلال أزمات الوباء في السودان. نؤمن بأن الوصول في الوقت المناسب إلى المعلومات الطبية ينقذ الأرواح." },
    "whoarewe.what_we_do": { en: "What Our Platform Does", ar: "ماذا تفعل منصتنا" },
    "whoarewe.our_story": { en: "Our Story", ar: "قصتنا" },
    "whoarewe.our_values": { en: "Our Values", ar: "قيمنا" },
    "whoarewe.cta_title": { en: "Ready to Join the Response?", ar: "هل أنت مستعد للانضمام إلى الاستجابة؟" },
    "whoarewe.cta_desc": { en: "Whether you're a community member, a health organization, or MOH \u2014 WASIL is built for you.", ar: "سواء كنت عضوًا في المجتمع أو منظمة صحية أو وزارة الصحة — واصل بُني لك." },
    "whoarewe.cta_btn": { en: "Get Started Now", ar: "ابدأ الآن" },

    // ── Contact Page ──
    "contact.badge": { en: "Contact", ar: "تواصل معنا" },
    "contact.title": { en: "Contact Information", ar: "معلومات الاتصال" },
    "contact.subtitle": { en: "We're here to help. Reach out to the WASIL team for support, partnerships, or any inquiries.", ar: "نحن هنا لمساعدتك. تواصل مع فريق واصل للدعم أو الشراكات أو أي استفسار." },
    "contact.email_title": { en: "Reach Us by Email", ar: "تواصل معنا بالبريد" },
    "contact.email_desc": { en: "For all inquiries \u2014 technical support, partnerships, health data requests, or general questions \u2014 email us directly.", ar: "لجميع الاستفسارات \u2014 الدعم الفني، الشراكات، طلبات البيانات الصحية، أو الأسئلة العامة \u2014 راسلنا مباشرة عبر البريد الإلكتروني." },
    "contact.general_inq": { en: "General Inquiries", ar: "استفسارات عامة" },
    "contact.general_desc": { en: "Questions about the platform or how to use WASIL?", ar: "هل لديك أسئلة حول المنصة أو كيفية استخدام واصل؟" },
    "contact.partnerships": { en: "Partnerships", ar: "الشراكات" },
    "contact.partnerships_desc": { en: "NGOs, health organizations, or government bodies looking to collaborate?", ar: "المنظمات غير الحكومية، المنظمات الصحية، أو الهيئات الحكومية التي تتطلع للتعاون؟" },
    "contact.tech_support": { en: "Technical Support", ar: "الدعم الفني" },
    "contact.tech_desc": { en: "Experiencing issues or bugs with the platform?", ar: "هل تواجه مشكلات أو أخطاء في المنصة؟" },
    "contact.response_time": { en: "We typically respond within 1\u20133 business days", ar: "نستجيب عادةً خلال 1-3 أيام عمل" },
    "contact.faq_title": { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
    "contact.faq1_q": { en: "How do I register as a Community Member?", ar: "كيف أقوم بالتسجيل كعضو في المجتمع؟" },
    "contact.faq1_a": { en: "Click \"Get Started\" on the landing page, select \"Community Member\" as your role, and complete the sign-up form with your email and password. Verification is required before accessing the platform.", ar: "انقر على \"ابدأ الآن\" في الصفحة الرئيسية، اختر \"عضو في المجتمع\" دورك، وأكمل نموذج التسجيل بالبريد الإلكتروني وكلمة المرور. التحقق مطلوب قبل الوصول إلى المنصة." },
    "contact.faq2_q": { en: "How can my organization apply to deploy mobile clinics?", ar: "كيف يمكن لمنظمتي التقدم بطلب لنشر عيادات متنقلة؟" },
    "contact.faq2_a": { en: "Register as an \"Organization\" on the platform. Once your account is approved by MOH admins, you can access the clinic assignment dashboard to submit deployment requests for affected areas.", ar: "سجل كـ \"منظمة\" على المنصة. بمجرد الموافقة على حسابك من مسؤولي وزارة الصحة، يمكنك الوصول إلى لوحة تحكم تعيين العيادات لتقديم طلبات النشر في المناطق المتضررة." },
    "contact.faq3_q": { en: "Is my health data kept confidential?", ar: "هل تبقى بياناتي الصحية سرية؟" },
    "contact.faq3_a": { en: "Yes. All personal health data is encrypted and only accessible to authorized health personnel. Case reports are aggregated and anonymized for epidemiological analysis.", ar: "نعم. يتم تشفير جميع البيانات الصحية الشخصية ولا يمكن الوصول إليها إلا للموظفين الصحيين المصرح لهم. يتم تجميع تقارير الحالات وإخفاء هويتها للتحليل الوبائي." },
    "contact.faq4_q": { en: "The platform is available in Arabic?", ar: "هل المنصة متاحة باللغة العربية؟" },
    "contact.faq4_a": { en: "Yes! WASIL supports full Arabic and English localization. You can toggle between languages using the language button in the top navigation bar across the platform.", ar: "نعم! يدعم واصل التعريب الكامل باللغتين العربية والإنجليزية. يمكنك التبديل بين اللغات باستخدام زر اللغة في شريط التنقل العلوي عبر المنصة." },
    "contact.faq5_q": { en: "I forgot my password. How do I reset it?", ar: "نسيت كلمة المرور الخاصة بي. كيف يمكنني إعادة تعيينها؟" },
    "contact.faq5_a": { en: "On the login page, click \"Forgot Password\" and enter your registered email. You will receive a password reset link within a few minutes. If you don't receive it, check your spam folder.", ar: "في صفحة تسجيل الدخول، انقر على \"نسيت كلمة المرور\" وأدخل بريدك الإلكتروني المسجل. ستتلقى رابط إعادة تعيين كلمة المرور في غضون بضع دقائق. إذا لم تستلمه، تحقق من مجلد البريد العشوائي." },

    // ── Dropdown Options ──
    "area.khartoum_north": { en: "Khartoum North", ar: "الخرطوم بحري" },
    "area.omdurman": { en: "Omdurman", ar: "أم درمان" },
    "area.bahri": { en: "Bahri", ar: "بحري" },
    "area.jabarona": { en: "Jabarona", ar: "جبرونا" },
    "area.haj_yousif": { en: "Haj Yousif", ar: "حاج يوسف" },
    "area.sharg_alneel": { en: "Sharg Al-Neel", ar: "شرق النيل" },
    "area.khartoum_center": { en: "Khartoum Center", ar: "وسط الخرطوم" },
    "area.soba": { en: "Soba", ar: "سوبا" },

    "vaccine.cholera": { en: "Cholera Vaccine", ar: "لقاح الكوليرا" },
    "vaccine.typhoid": { en: "Typhoid Vaccine", ar: "لقاح التيفوئيد" },
    "vaccine.meningitis": { en: "Meningitis Vaccine", ar: "لقاح التهاب السحايا" },
    "vaccine.yellow_fever": { en: "Yellow Fever Vaccine", ar: "لقاح الحمى الصفراء" },
    "vaccine.hepatitis_a": { en: "Hepatitis A Vaccine", ar: "لقاح التهاب الكبد أ" },
    "vaccine.polio": { en: "Polio Vaccine", ar: "لقاح شلل الأطفال" },
    "vaccine.measles": { en: "Measles Vaccine", ar: "لقاح الحصبة" },
    "vaccine.other": { en: "Other", ar: "أخرى" },

    "case_type.epidemic": { en: "Suspected Epidemic Disease", ar: "مرض وبائي مشتبه به" },
    "case_type.dehydration": { en: "Severe Dehydration (Cholera/Diarrhea)", ar: "جفاف شديد (كوليرا/إسهال)" },
    "case_type.fever": { en: "High Fever / Convulsions", ar: "حمى شديدة / تشنجات" },
    "case_type.trauma": { en: "Trauma / Injury", ar: "صدمة / إصابة" },
    "case_type.pregnancy": { en: "Pregnancy Emergency", ar: "طوارئ حمل" },
    "case_type.respiratory": { en: "Respiratory Distress", ar: "ضيق في التنفس" },
    "case_type.other": { en: "Other Emergency", ar: "طوارئ أخرى" },

    // ── Global Footer ──
    "footer.tagline": { en: "Electronic Health Platform \u2014 Sudan", ar: "منصة الصحة الإلكترونية \u2014 السودان" },
    "footer.home": { en: "Home", ar: "الرئيسية" },
    "footer.about": { en: "Who Are We", ar: "من نحن" },
    "footer.contact": { en: "Contact", ar: "اتصل بنا" },
    "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
    "footer.copyright": { en: "\u00a9 2026 WASIL. All rights reserved.", ar: "\u00a9 2026 واصل. جميع الحقوق محفوظة." }
};


// ── Apply Language ──
function applyLanguage() {
    var lang = localStorage.getItem('wasil_lang') || 'ar';
    var isArabic = (lang === 'ar');

    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    // Cairo font supports both Arabic & Latin scripts
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
    var lang = localStorage.getItem('wasil_lang') || 'ar';
    if (WASIL_TRANSLATIONS[key] && WASIL_TRANSLATIONS[key][lang]) {
        return WASIL_TRANSLATIONS[key][lang];
    }
    return key;
}

// Auto-apply on DOM ready
document.addEventListener('DOMContentLoaded', applyLanguage);
