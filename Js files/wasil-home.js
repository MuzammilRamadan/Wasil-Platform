// ============================================
//  wasil Electronic Health Platform — Home Logic
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('wasil Electronic Health Platform Loaded');

    // ── 0. Session Check ──
    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // Also allow locally-stored user (for fallback login flow)
            const localUser = localStorage.getItem('wasil_user');
            if (!localUser) {
                window.location.href = 'wasil-login.html';
            }
        }
    }
    checkSession();

    // ── 1. Role Detection ──
    const role = localStorage.getItem('wasil_role') || 'community';
    const isOrg = (role === 'organization');

    // ... (existing role UI logic) ...

    // ── DATA FETCHING ──
    if (!isOrg) {
        fetchClinics();
        fetchNotifications();
    } else {
        fetchDashboardStats();
        fetchServiceRequests();
        fetchAssignedClinics();
    }
    // Always update disease severity labels and locality outbreak on home
    fetchDiseaseSeverityForHome();

    // ── Function: Fetch & Render Outbreak Status (Real-time by area) ──
    async function fetchOutbreakStatus() {
        const container = document.getElementById('outbreakStatusList');
        if (!container) return;

        // Fetch all cases grouped by location
        const { data: cases, error } = await supabase
            .from('cases')
            .select('location, severity')
            .order('created_at', { ascending: false });

        if (error || !cases || cases.length === 0) {
            container.innerHTML = `<div class="empty-state" style="padding:1rem 0;">
                <p style="color:var(--text-light);font-size:0.82rem;">${t('home.no_cases_reported') || 'No cases reported yet.'}</p>
            </div>`;
            return;
        }

        // Aggregate per area
        const areaMap = {};
        cases.forEach(c => {
            // Normalize: take first part before comma for the area name
            const area = (c.location || 'Unknown').split(',')[0].trim();
            if (!areaMap[area]) areaMap[area] = { count: 0, severities: [] };
            areaMap[area].count++;
            areaMap[area].severities.push(c.severity);
        });

        // Determine dominant severity per area
        function dominantSeverity(severities) {
            const order = ['critical', 'high', 'moderate', 'low'];
            for (const s of order) {
                if (severities.includes(s)) return s;
            }
            return 'low';
        }

        function severityStyle(sev) {
            if (sev === 'critical') return { color: 'var(--alert)', bg: 'rgba(239,68,68,0.08)', label: t('home.sev_critical') || 'CRITICAL', border: 'var(--alert)' };
            if (sev === 'high') return { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: t('home.sev_high') || 'HIGH', border: '#F59E0B' };
            if (sev === 'moderate') return { color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', label: t('home.sev_moderate') || 'MODERATE', border: 'var(--warning)' };
            return { color: 'var(--success)', bg: 'rgba(16,185,129,0.08)', label: t('home.sev_low') || 'LOW', border: 'var(--success)' };
        }

        // Sort areas by case count descending
        const sorted = Object.entries(areaMap).sort((a, b) => b[1].count - a[1].count);

        container.innerHTML = '';
        sorted.forEach(([area, info]) => {
            const sev = dominantSeverity(info.severities);
            const style = severityStyle(sev);
            const html = `
            <div class="outbreak-status" style="border-left-color:${style.border};">
                <div class="status-content">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                        <h4 style="margin:0;">${area}</h4>
                        <span class="status-badge" style="color:${style.color};background:${style.bg};">${style.label}</span>
                    </div>
                    <p style="font-size:0.78rem;color:${style.color};font-weight:600;">${info.count} <span style="text-transform: capitalize">${info.count !== 1 ? t('home.cases_label') || 'Cases' : t('home.case_label') || 'Case'}</span></p>
                </div>
                <span class="status-badge" style="color:${style.color};background:${style.bg};font-size:0.7rem;">${info.count}</span>
            </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Subscribe to real-time case inserts
        supabase.channel('public:cases:outbreak')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cases' }, () => {
                fetchOutbreakStatus(); // Refresh on new case
            })
            .subscribe();
    }

    // ── Function: Fetch Clinics (Community) ──
    async function fetchClinics() {
        const listContainer = document.getElementById('clinicsList');
        if (!listContainer) return;

        let { data: clinics, error } = await supabase
            .from('clinic_requests')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching clinics:', error);
            if (sessionStorage.getItem('demo_mode')) {
                clinics = [
                    { clinic_name: "عيادة الأمل المتنقلة", org_name: "وزارة الصحة", target_area: "بحري, شرق النيل", capacity: 150, schedule: "2026-05-20", diseases: ["Cholera", "Malaria"] },
                    { clinic_name: "عيادة الإغاثة", org_name: "منظمة أطباء بلا حدود", target_area: "امدرمان, امبدة", capacity: 200, schedule: "2026-05-18", diseases: ["Dengue Fever"] }
                ];
            } else {
                listContainer.innerHTML = `<div class="empty-state">
                    <p>Failed to load clinics.</p>
                </div>`;
                return;
            }
        }

        if (clinics && clinics.length > 0) {
            listContainer.innerHTML = ''; // Clear loading content
            clinics.forEach((clinic, index) => {
                const diseasesArray = Array.isArray(clinic.diseases) ? clinic.diseases : (clinic.diseases ? [clinic.diseases] : []);
                const vaccines = diseasesArray.map(v => `<span class="vaccine-tag">${translateDisease(v)}</span>`).join('');
                const clinicName = clinic.clinic_name || `${clinic.org_name || 'Organization'} Clinic`;

                const html = `
                <div class="clinic-card" style="cursor:pointer;" data-clinic-id="${index}">
                    <span class="clinic-number">${t('home.clinic_num') || 'CLINIC #'} ${index + 1}</span>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0; padding-right: 10px;">${clinicName}</h4>
                        <span class="clinic-org-badge">${clinic.org_name || 'Admin'}</span>
                    </div>
                    <div class="clinic-details">
                        <div class="clinic-detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${clinic.target_area || 'Various'}</span>
                        </div>
                        <div class="clinic-detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                            <span class="detail-label">Capacity:</span>
                            <span class="detail-value">${clinic.capacity ? clinic.capacity + ' patients / day' : 'Not specified'}</span>
                        </div>
                        <div class="clinic-detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span class="detail-label">Schedule:</span>
                            <span class="detail-value clinic-schedule">${clinic.schedule || 'Regular hours'}</span>
                        </div>
                    </div>
                    <div class="clinic-vaccines">
                        ${vaccines}
                    </div>
                    <div style="margin-top:10px;text-align:right;">
                        <button class="request-assign-btn" style="width:100%; margin-bottom:8px;" onclick="event.stopPropagation(); alert('تم تسجيلك للعيادة بنجاح وسيتم إرسال رسالة تأكيد لرقمك');">التسجيل لحجز موعد</button>
                        <span style="font-size:0.78rem;color:var(--primary);font-weight:600;">${t('home.view_details') || 'View Details'} &rsaquo;</span>
                    </div>
                </div>`;
                listContainer.insertAdjacentHTML('beforeend', html);

                // Store clinic data for detail view
                window._wasilClinics = window._wasilClinics || [];
                window._wasilClinics[index] = clinic;
            });

            // Add click handlers to clinic cards
            listContainer.querySelectorAll('.clinic-card').forEach((card) => {
                card.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-clinic-id'));
                    showClinicDetail(idx);
                });
            });
        } else {
            listContainer.innerHTML = `<div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <h4>${t('home.no_deployed_clinics') || 'No Deployed Clinics'}</h4>
                <p>${t('home.no_deployed_desc') || 'There are currently no active mobile clinics deployed by the Ministry of Health.'}</p>
            </div>`;
        }
    }

    // ── Function: Fetch Notifications (Community) ──
    async function fetchNotifications() {
        const notifContainer = document.getElementById('communityNotificationsList');
        if (!notifContainer) return;

        let { data: clinics, error } = await supabase
            .from('clinic_requests')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error || !clinics || clinics.length === 0) {
            if (sessionStorage.getItem('demo_mode') && error) {
                clinics = [
                    { clinic_name: "عيادة الأمل المتنقلة", org_name: "وزارة الصحة", target_area: "بحري, شرق النيل", capacity: 150, schedule: "2026-05-20", diseases: ["Cholera", "Malaria"] },
                    { clinic_name: "عيادة الإغاثة", org_name: "منظمة أطباء بلا حدود", target_area: "امدرمان, امبدة", capacity: 200, schedule: "2026-05-18", diseases: ["Dengue Fever"] }
                ];
            } else {
                notifContainer.innerHTML = `<div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <h4>لا توجد إشعارات جديدة</h4>
                    <p>سيتم إشعارك فور توفر عيادات متنقلة بالقرب من موقعك.</p>
                </div>`;
                return;
            }
        }

        notifContainer.innerHTML = '';
        clinics.forEach((clinic) => {
            const clinicName = clinic.clinic_name || `${clinic.org_name || 'Organization'} Clinic`;
            const area = clinic.target_area || 'Various';
            
            const html = `
            <div class="service-request-item" style="padding: 12px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 10px; display: flex; gap: 12px; align-items: flex-start; background: var(--white);">
                <div class="request-icon" style="background: rgba(16, 185, 129, 0.08); color: #10B981; padding: 8px; border-radius: 8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <div class="request-content" style="flex: 1;">
                    <h5 style="margin: 0 0 4px 0; font-size: 0.95rem; color: var(--text);">${t('home.new_clinic_published') || 'تم نشر عيادة جديدة'}</h5>
                    <p style="margin: 0; font-size: 0.82rem; color: var(--text-light); line-height: 1.4;">
                        ${(t('home.clinic_now_available') || 'عيادة {clinic} متوفرة الآن في منطقة {area}').replace('{clinic}', '<strong>'+clinicName+'</strong>').replace('{area}', '<strong>'+area+'</strong>')}
                    </p>
                </div>
                <span class="new-badge" style="background: #10B981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: bold;">${t('home.new_badge_text') || 'جديد'}</span>
            </div>`;
            notifContainer.insertAdjacentHTML('beforeend', html);
        });
    }
    // ── Function: Show Clinic Detail ──
    function showClinicDetail(index) {
        const clinic = (window._wasilClinics || [])[index];
        if (!clinic) return;

        const clinicName = clinic.clinic_name || `${clinic.org_name || 'Organization'} Clinic`;
        const diseasesArray = Array.isArray(clinic.diseases) ? clinic.diseases : (clinic.diseases ? [clinic.diseases] : []);
        const supplyTags = diseasesArray.map(v => `<span class="vaccine-tag" style="margin:3px;">${translateDisease(v)}</span>`).join('');
        const deployDate = clinic.schedule ? new Date(clinic.schedule).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

        const content = document.getElementById('clinicDetailContent');
        if (!content) return;

        content.innerHTML = `
        <div style="background:linear-gradient(135deg,var(--primary),#0E7490);border-radius:16px;padding:20px;color:#fff;margin-bottom:16px;position:relative;overflow:hidden;">
            <div style="position:absolute;top:-20px;right:-20px;opacity:0.1;">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
            </div>
            <span style="font-size:0.7rem;font-weight:700;letter-spacing:2px;opacity:0.8;">${t('home.deployed_clinic_label') || 'DEPLOYED CLINIC'}</span>
            <h3 style="margin:6px 0 4px;font-size:1.1rem;">${clinicName}</h3>
            <p style="font-size:0.82rem;opacity:0.85;margin:0;">${clinic.org_name || 'Ministry of Health'}</p>
            <span style="display:inline-block;margin-top:10px;background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600;">${t('home.status_active') || 'APPROVED & ACTIVE'}</span>
        </div>

        <div style="background:#fff;border-radius:14px;padding:18px;border:1px solid var(--border);margin-bottom:12px;">
            <h4 style="font-size:0.9rem;font-weight:700;margin:0 0 14px;color:var(--text);">Clinic Information</h4>
            <div class="clinic-detail-row" style="margin-bottom:10px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span class="detail-label">Location:</span>
                <span class="detail-value" style="font-weight:600;">${clinic.target_area || 'Various Areas'}</span>
            </div>
            <div class="clinic-detail-row" style="margin-bottom:10px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span class="detail-label">Daily Capacity:</span>
                <span class="detail-value" style="font-weight:600;">${clinic.capacity ? clinic.capacity + ' patients' : 'Not specified'}</span>
            </div>
            ${deployDate ? `<div class="clinic-detail-row" style="margin-bottom:10px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span class="detail-label">Deployment Date:</span>
                <span class="detail-value" style="font-weight:600;">${deployDate}</span>
            </div>` : ''}
        </div>

        <div style="background:#fff;border-radius:14px;padding:18px;border:1px solid var(--border);margin-bottom:12px;">
            <h4 style="font-size:0.9rem;font-weight:700;margin:0 0 14px;display:flex;align-items:center;gap:8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                    <path d="M18.5 2.5L21.5 5.5"></path>
                    <path d="M15 6l3 3"></path>
                    <path d="M16.5 4.5l-9.2 9.2a2 2 0 0 0-.5 1.3V18h3a2 2 0 0 0 1.3-.5l9.2-9.2"></path>
                    <path d="M6 18L2 22"></path>
                </svg>
                ${t('home.supplies_label') || 'Supplies'}
            </h4>
            ${diseasesArray.length > 0
                ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${supplyTags}</div>`
                : '<p style="color:var(--text-light);font-size:0.82rem;">No specific supplies listed.</p>'}
        </div>

        <div style="background:rgba(37,99,235,0.04);border:1px solid rgba(37,99,235,0.15);border-radius:14px;padding:16px;">
            <p style="font-size:0.8rem;color:var(--primary);font-weight:600;margin:0 0 4px;">&#128337; ${t('home.operative_hours') || 'Operating Hours'}</p>
            <p style="font-size:0.82rem;color:var(--text);margin:0;">${deployDate ? 'From ' + deployDate : '7:00 AM – 5:00 PM daily (or as scheduled by clinic)'}</p>
        </div>`;

        switchToView('view-clinic-detail', null);
        navItems.forEach(nav => nav.classList.remove('active'));
    }

    // ── Function: Fetch Disease Severity Labels for Home (all roles) ──
    async function fetchDiseaseSeverityForHome() {
        const diseaseNames = ['Cholera', 'Typhoid', 'Dengue Fever', 'Malaria'];
        const idMap = { 'Cholera': 'sev-cholera', 'Typhoid': 'sev-typhoid', 'Dengue Fever': 'sev-dengue', 'Malaria': 'sev-malaria' };
        const dotIdMap = { 'Cholera': 0, 'Typhoid': 1, 'Dengue Fever': 2, 'Malaria': 3 };

        let cases = [];
        if (window.supabase) {
            const { data } = await window.supabase.from('cases').select('disease');
            if (data) cases = data;
        }

        const countMap = {};
        diseaseNames.forEach(d => countMap[d] = 0);
        cases.forEach(c => {
            const key = diseaseNames.find(d => c.disease && c.disease.toLowerCase() === d.toLowerCase());
            if (key) countMap[key]++;
        });

        const maxCount = Math.max(...Object.values(countMap), 1);

        diseaseNames.forEach(d => {
            const el = document.getElementById(idMap[d]);
            if (!el) return;
            const count = countMap[d];
            const ratio = count / maxCount;
            let sevLabel, sevColor;
            if (ratio >= 0.75) { sevLabel = t('sev.critical') || 'CRITICAL'; sevColor = '#EF4444'; }
            else if (ratio >= 0.5) { sevLabel = t('sev.high') || 'HIGH'; sevColor = '#F59E0B'; }
            else if (ratio >= 0.25) { sevLabel = t('sev.moderate') || 'MODERATE'; sevColor = '#3B82F6'; }
            else { sevLabel = t('sev.low') || 'LOW'; sevColor = '#10B981'; }
            el.textContent = `${sevLabel} — ${count} ${t('home.cases') || 'Cases'}`;
            el.style.color = sevColor;
        });

        // Also fill locality outbreak list (org only)
        const localityEl = document.getElementById('localityOutbreakList');
        if (!localityEl) return;

        const LOCALITIES = ['الخرطوم', 'بحري', 'امدرمان'];
        let allCases = [];
        if (window.supabase) {
            const { data } = await window.supabase.from('cases').select('location, disease');
            if (data) allCases = data;
        }

        const localityMap = {};
        LOCALITIES.forEach(l => localityMap[l] = 0);
        allCases.forEach(c => {
            const loc = (c.location || '').trim();
            const matched = LOCALITIES.find(l => loc.startsWith(l));
            if (matched) localityMap[matched]++;
        });

        const totalAll = Object.values(localityMap).reduce((a, b) => a + b, 0) || 1;
        const getLocalityKey = (loc) => {
            if (loc === 'الخرطوم') return 'khartoum_center';
            if (loc === 'بحري') return 'bahri';
            if (loc === 'امدرمان') return 'omdurman';
            return loc;
        };

        localityEl.innerHTML = LOCALITIES.map(l => {
            const cnt = localityMap[l];
            const color = cnt > 20 ? '#EF4444' : cnt > 10 ? '#F59E0B' : '#10B981';
            return `
            <div class="disease-item">
                <div class="disease-header">
                    <h4 style="font-size:0.95rem;">${t('area.' + getLocalityKey(l)) || l}</h4>
                    <span class="risk-dot" style="background:${color};"></span>
                </div>
                <p class="disease-symptoms" style="color:${color};font-weight:600;">${cnt} ${t('home.reported_cases') || 'Reported Cases'}</p>
            </div>`;
        }).join('');
    }

    // ── Function: Fetch Dashboard Stats (Organization) ──
    async function fetchDashboardStats() {
        if (!window.supabase) return;

        try {
            const { data: cases, error } = await window.supabase.from('cases').select('*');
            if (error) throw error;

            const LOCALITIES = ['الخرطوم', 'بحري', 'امدرمان'];
            const LOCALITY_AREAS = {
                'الخرطوم': ['وسط الخرطوم', 'جبل اولياء', 'الخرطوم 1', 'الخرطوم 2', 'الخرطوم 3', 'جنوب الحزام', 'الشجرة'],
                'امدرمان': ['امدرمان', 'امدرمان القديمة', 'كرري', 'امبدة'],
                'بحري': ['بحري المدينة', 'بحري وسط', 'بحري شمال', 'ريفي بحري', 'شرق النيل']
            };
            const DISEASE_NAMES = ['الكوليرا', 'التيفوئيد', 'حمى الضنك', 'الملاريا'];

            // Build data structure: locality -> area -> disease -> count
            const localityData = {};
            LOCALITIES.forEach(l => {
                localityData[l] = { total: 0, areas: {} };
                LOCALITY_AREAS[l].forEach(a => {
                    localityData[l].areas[a] = { total: 0, diseases: {} };
                    DISEASE_NAMES.forEach(d => localityData[l].areas[a].diseases[d] = 0);
                });
            });

            (cases || []).forEach(c => {
                const loc = (c.location || '').trim();
                const dis = translateDisease(c.disease) || c.disease || 'غير محدد';
                const matchedLocality = LOCALITIES.find(l => loc.startsWith(l));
                if (!matchedLocality) return;
                const rest = loc.slice(matchedLocality.length).replace(/^[,\s]+/, '');
                const matchedArea = LOCALITY_AREAS[matchedLocality].find(a => rest.startsWith(a)) || 'غير محدد';

                localityData[matchedLocality].total++;
                if (!localityData[matchedLocality].areas[matchedArea]) {
                    localityData[matchedLocality].areas[matchedArea] = { total: 0, diseases: {} };
                    DISEASE_NAMES.forEach(d => localityData[matchedLocality].areas[matchedArea].diseases[d] = 0);
                }
                localityData[matchedLocality].areas[matchedArea].total++;
                if (DISEASE_NAMES.includes(dis)) {
                    localityData[matchedLocality].areas[matchedArea].diseases[dis]++;
                }
            });

            const container = document.getElementById('localityCaseCards');
            if (!container) return;

            if (!cases || cases.length === 0) {
                container.innerHTML = `<p style="text-align:center;color:var(--text-light);padding:20px;">لا توجد حالات مبلغة حتى الآن.</p>`;
                return;
            }

            container.innerHTML = LOCALITIES.map((locality, li) => {
                const lData = localityData[locality];
                const sevColor = lData.total > 20 ? '#EF4444' : lData.total > 10 ? '#F59E0B' : '#10B981';
                
                const getLocalityKey = (loc) => {
                    if (loc === 'الخرطوم') return 'khartoum_center';
                    if (loc === 'بحري') return 'bahri';
                    if (loc === 'امدرمان') return 'omdurman';
                    return loc;
                };

                const areaCards = Object.entries(lData.areas).map(([areaName, aData]) => {
                    if (aData.total === 0) return '';
                    const disBreakdown = Object.entries(aData.diseases)
                        .filter(([, cnt]) => cnt > 0)
                        .map(([dis, cnt]) => `<span style="font-size:0.72rem;background:rgba(37,99,235,0.08);color:var(--primary);border-radius:12px;padding:2px 8px;margin:2px;display:inline-block;">${t('dis.' + dis) || dis}: ${cnt}</span>`)
                        .join('');
                    return `
                    <div style="background:var(--bg);border-radius:10px;padding:10px 12px;margin-top:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <span style="font-size:0.88rem;font-weight:700;color:var(--text);">${t('area.' + areaName.replace(/ /g, '_')) || areaName}</span>
                            <span style="font-size:0.78rem;font-weight:700;color:var(--primary);background:rgba(37,99,235,0.08);padding:2px 8px;border-radius:20px;">${aData.total} ${t('home.cases') || 'Cases'}</span>
                        </div>
                        <div>${disBreakdown || '<span style="font-size:0.75rem;color:var(--text-light);">-</span>'}</div>
                    </div>`;
                }).join('');

                return `
                <div class="case-item" style="flex-direction:column;align-items:stretch;gap:0;padding:0;overflow:hidden;border-radius:12px;border:1.5px solid var(--border);margin-bottom:10px;">
                    <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'; this.querySelector('.expand-arrow').style.transform=this.nextElementSibling.style.display==='block'?'rotate(180deg)':'rotate(0deg)';"
                        style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer;background:var(--white);">
                        <div>
                            <h5 style="margin:0;font-size:0.95rem;color:var(--text);">${t('area.' + getLocalityKey(locality)) || locality}</h5>
                            <p style="margin:4px 0 0;font-size:0.78rem;color:${sevColor};font-weight:700;">${lData.total} ${t('home.reported_cases') || 'Reported Cases'}</p>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="width:12px;height:12px;border-radius:50%;background:${sevColor};display:inline-block;"></span>
                            <span class="expand-arrow" style="font-size:1.1rem;color:var(--text-light);transition:transform 0.2s;">&#8964;</span>
                        </div>
                    </div>
                    <div style="display:none;padding:12px 14px 14px;background:#fafafa;border-top:1px solid var(--border);">
                        ${areaCards || '<p style="font-size:0.82rem;color:var(--text-light);text-align:center;">' + (t('home.no_cases_for_locality') || 'No specific cases for this locality') + '</p>'}
                    </div>
                </div>`;
            }).join('');

        } catch (err) {
            console.error('fetchDashboardStats error:', err);
        }
    }

    // ── Function: Fetch Service Requests (Organization) ──
    async function fetchServiceRequests() {
        const list = document.getElementById('serviceRequestsList');
        if (!list) return;

        supabase.channel('public:service_requests')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, payload => {
                showToast(t('home.new_service_req') ? t('home.new_service_req') + '!' : 'New Service Request Received!');
                renderRequestItem(payload.new, list, true);
            })
            .subscribe();

        // Initial fetch
        const { data: requests, error } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (requests && requests.length > 0) {
            list.innerHTML = '';
            requests.forEach(req => renderRequestItem(req, list));
        }
    }

    function renderRequestItem(req, container, isNew = false) {
        const timeAgo = new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const html = `
        <div class="service-request-item">
            <div class="request-icon" style="background: rgba(37, 99, 235, 0.08); color: #2563EB;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <div class="request-content">
                <h5>${req.service_type} ${t('home.request_word') || 'Request'}</h5>
                <p>${req.location} — ${t('home.status_' + req.status) || req.status}</p>
                <span class="request-time">${timeAgo}</span>
            </div>
            ${isNew ? '<span class="new-badge">' + (t('home.new_badge_text') || 'NEW') + '</span>' : ''}
        </div>`;

        if (isNew) {
            container.insertAdjacentHTML('afterbegin', html);
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }
    }

    // ── Function: Fetch Assigned Clinics (Organization) ──
    async function fetchAssignedClinics() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const listContainer = document.getElementById('assignedClinicsList');
        if (!listContainer) return;

        const { data: myRequests, error } = await supabase
            .from('clinic_requests')
            .select('*')
            .eq('org_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching org clinic requests:', error);
            listContainer.innerHTML = `<div class="empty-state"><p>Error loading requests.</p></div>`;
            return;
        }

        // Calculate stats
        let active = 0;
        let pending = 0;
        let rejected = 0;
        let areas = new Set();
        let notifications = [];

        myRequests?.forEach(req => {
            if (req.status === 'approved') active++;
            if (req.status === 'pending') pending++;
            if (req.status === 'rejected') {
                rejected++;
                notifications.push(req);
            }
            if (req.target_area) {
                req.target_area.split(',').forEach(a => areas.add(a.trim()));
            }
        });

        // Update stats UI
        const activeEl = document.getElementById('orgStatActive');
        const pendingEl = document.getElementById('orgStatPending');
        const areasEl = document.getElementById('orgStatAreas');
        const rejectedEl = document.getElementById('orgStatRejected');

        if (activeEl) activeEl.textContent = active;
        if (pendingEl) pendingEl.textContent = pending;
        if (areasEl) areasEl.textContent = areas.size;
        if (rejectedEl) rejectedEl.textContent = rejected;

        // Populate Notifications Banner/Modal
        const btnNotifs = document.getElementById('btnNotifications');
        const badgeNotifs = document.getElementById('headerNotifBadge');
        if (btnNotifs) btnNotifs.style.display = 'block';

        if (badgeNotifs) {
            badgeNotifs.textContent = notifications.length;
            badgeNotifs.style.display = notifications.length > 0 ? 'flex' : 'none';
        }

        const notifList = document.getElementById('notificationsList');
        if (notifList) {
            if (notifications.length === 0) {
                notifList.innerHTML = `<p style="text-align:center;color:var(--text-light);font-size:0.85rem;padding:20px;">${t('home.no_new_notifs') || 'No new notifications'}</p>`;
            } else {
                notifList.innerHTML = notifications.map(n => {
                    const reqDate = n.created_at ? new Date(n.created_at).toLocaleDateString() : '';
                    return `<div style="background:rgba(231,76,60,0.05);border-left:4px solid #E74C3C;padding:12px;border-radius:6px;font-size:0.85rem;">
                        <div style="font-weight:700;color:#E74C3C;margin-bottom:4px;">${t('home.status_rejected') || 'Request Rejected'} - ${n.clinic_name || n.target_area || 'Clinic'}</div>
                        <div style="color:var(--text);margin-bottom:6px;">${t('home.notif_rejected') || 'Your clinic request was rejected'} (${reqDate})</div>
                        <div style="background:#fff;padding:8px;border-radius:4px;font-size:0.8rem;color:var(--text-light);font-style:italic;">
                            " ${n.rejection_reason || t('home.no_reason') || 'No specific reason provided by reviewer.'} "
                        </div>
                    </div>`;
                }).join('');
            }
        }

        if (myRequests && myRequests.length > 0) {
            listContainer.innerHTML = '';
            myRequests.forEach(req => {
                const clinicName = req.clinic_name || `${req.target_area || 'Clinic'} Assignment`;
                const displayDate = req.created_at ? new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date';
                const diseasesOverview = Array.isArray(req.diseases) ? req.diseases.map(translateDisease).join(', ') : translateDisease(req.diseases || 'General Medical');

                let statusClass = '';
                let statusText = 'Pending';

                if (req.status === 'approved') {
                    statusClass = 'active';
                    statusText = t('home.status_active') || 'Active';
                } else if (req.status === 'rejected') {
                    statusClass = 'rejected';
                    statusText = t('home.status_rejected') || 'Rejected';
                } else {
                    statusClass = 'pending';
                    statusText = t('home.status_pending') || 'Pending';
                }

                const html = `
                <div class="assigned-clinic-item">
                    <div class="assigned-info">
                        <h5>${clinicName}</h5>
                        <p>${t('home.requested_on') || 'Requested:'} ${displayDate} — ${diseasesOverview}</p>
                    </div>
                    <span class="assigned-status ${statusClass}">${statusText}</span>
                </div>`;
                listContainer.insertAdjacentHTML('beforeend', html);
            });
        } else {
            listContainer.innerHTML = `<div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <h4>${t('home.no_requests_yet') || 'No Requests Yet'}</h4>
                <p>${t('home.no_requests_desc') || "You haven't submitted any clinic deployment requests."}</p>
            </div>`;
        }
    }

    // ── 2. Role-Based Element Visibility ──
    document.querySelectorAll('[data-role]').forEach(el => {
        if (el.getAttribute('data-role') !== role) {
            el.style.display = 'none';
        }
    });

    // ── 3. Organization-Specific UI Changes ──
    if (isOrg) {
        // Update hero description for org role
        const heroDesc = document.getElementById('heroDynamicDesc');
        if (heroDesc) {
            heroDesc.textContent = t('home.hero_org_desc') || 'ادر طلبات نشر العيادات، وراقب حالة الوباء، واستجب بسرعة لتقارير المجتمع';
        }

        const servicesLabel = document.getElementById('navServicesLabel');
        const servicesTitle = document.getElementById('servicesViewTitle');
        const navServicesBtn = document.getElementById('navServicesBtn');

        if (servicesLabel) servicesLabel.textContent = t('home.requested_services') || 'Requested Services';
        if (servicesTitle) servicesTitle.textContent = t('home.requested_services') || 'Requested Services';

        if (navServicesBtn) {
            navServicesBtn.setAttribute('data-target', 'view-requested-services');
            navServicesBtn.setAttribute('href', '#requested-services');
        }
    }

    // ── 4. View Switching (Bottom Nav) ──
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    function switchToView(targetId, activeNavItem) {
        // Update nav state
        navItems.forEach(nav => nav.classList.remove('active'));
        if (activeNavItem) activeNavItem.classList.add('active');

        // Update view state
        views.forEach(view => {
            if (view.id === targetId) {
                view.style.display = 'block';
                view.style.animation = 'none';
                view.offsetHeight; // trigger reflow
                view.style.animation = 'fadeIn 0.4s ease-out forwards';
            } else {
                view.style.display = 'none';
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) return; // external link

            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;

            switchToView(targetId, this);
        });
    });

    // ── 5. Nearby Clinics Button (Community) ──
    const btnNearbyClinics = document.getElementById('btnNearbyClinics');
    if (btnNearbyClinics) {
        btnNearbyClinics.addEventListener('click', function () {
            switchToView('view-clinics', null);
            // Remove active from all nav items when in sub-view
            navItems.forEach(nav => nav.classList.remove('active'));
        });
    }

    // Back from clinics
    const btnBackFromClinics = document.getElementById('btnBackFromClinics');
    if (btnBackFromClinics) {
        btnBackFromClinics.addEventListener('click', function () {
            const homeNav = document.getElementById('navHomeBtn');
            switchToView('view-home', homeNav);
        });
    }

    // Back from clinic detail
    const btnBackFromClinicDetail = document.getElementById('btnBackFromClinicDetail');
    if (btnBackFromClinicDetail) {
        btnBackFromClinicDetail.addEventListener('click', function () {
            switchToView('view-clinics', null);
            navItems.forEach(nav => nav.classList.remove('active'));
        });
    }

    // ── 6. Assign Clinic Button (Organization) ──
    const btnAssignClinic = document.getElementById('btnAssignClinic');
    if (btnAssignClinic) {
        btnAssignClinic.addEventListener('click', function () {
            switchToView('view-org-dashboard', null);
            navItems.forEach(nav => nav.classList.remove('active'));
        });
    }

    // Back from dashboard
    const btnBackFromDashboard = document.getElementById('btnBackFromDashboard');
    if (btnBackFromDashboard) {
        btnBackFromDashboard.addEventListener('click', function () {
            const homeNav = document.getElementById('navHomeBtn');
            switchToView('view-home', homeNav);
        });
    }

    // ── 7. Assignation Modal — with FocusTrap & aria-hidden ──
    const modal = document.getElementById('assignationModal');
    const btnRequestAssignation = document.getElementById('btnRequestAssignation');
    const assignationForm = document.getElementById('assignationForm');

    // Build a FocusTrap instance for each modal
    const assignTrap = window.wasilA11y ? new wasilA11y.FocusTrap(modal) : null;
    const notifTrapEl = document.getElementById('notificationsModal');
    const notifTrap = window.wasilA11y && notifTrapEl ? new wasilA11y.FocusTrap(notifTrapEl) : null;
    const svcModalEl = document.getElementById('serviceRequestModal');
    const svcTrap = window.wasilA11y && svcModalEl ? new wasilA11y.FocusTrap(svcModalEl) : null;

    function openAssignModal() {
        if (!modal) return;
        if (window.wasilA11y && assignTrap) {
            wasilA11y.openModal(modal, assignTrap);
        } else {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAssignModal() {
        if (!modal) return;
        if (window.wasilA11y && assignTrap) {
            wasilA11y.closeModal(modal, assignTrap);
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Keep legacy closeModal alias for backward compat
    function closeModal() { closeAssignModal(); }

    if (btnRequestAssignation && modal) {
        btnRequestAssignation.addEventListener('click', openAssignModal);
    }

    // Close on overlay backdrop click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeAssignModal();
        });
    }

    // ── Notifications Modal (Org Only) ──
    const notifModal = document.getElementById('notificationsModal');
    const btnNotifs = document.getElementById('btnNotifications');

    if (btnNotifs && notifModal) {
        btnNotifs.addEventListener('click', function () {
            if (window.wasilA11y && notifTrap) {
                wasilA11y.openModal(notifModal, notifTrap);
            } else {
                notifModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            // hide badge when opened
            const badge = document.getElementById('headerNotifBadge');
            if (badge) badge.style.display = 'none';
        });

        notifModal.addEventListener('click', function (e) {
            if (e.target === notifModal) {
                if (window.wasilA11y && notifTrap) {
                    wasilA11y.closeModal(notifModal, notifTrap);
                } else {
                    notifModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // ── Locality → Area Dependent Dropdown ──
    const AREAS_BY_LOCALITY = {
        'الخرطوم': ['وسط الخرطوم', 'جبل اولياء', 'الخرطوم 1', 'الخرطوم 2', 'الخرطوم 3', 'جنوب الحزام', 'الشجرة', 'حاج يوسف'],
        'بحري': ['بحري المدينة', 'بحري وسط', 'بحري شمال', 'ريفي بحري', 'شرق النيل', 'جبرونة'],
        'امدرمان': ['امدرمان المدينة', 'امدرمان القديمة', 'كرري', 'امبدة', 'سوق امدرمان', 'ابو روف']
    };

    const localitySelect = document.getElementById('assignLocality');
    const areaSelect = document.getElementById('assignArea');

    if (localitySelect && areaSelect) {
        localitySelect.addEventListener('change', function () {
            const areas = AREAS_BY_LOCALITY[this.value] || [];
            areaSelect.innerHTML = '<option value="" disabled selected>اختر المنطقة...</option>';
            areas.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a;
                opt.textContent = a;
                areaSelect.appendChild(opt);
            });
            areaSelect.disabled = false;
        });
    }

    // Handle form submission
    if (assignationForm) {
        assignationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const locality = document.getElementById('assignLocality')?.value || '';
            const area = document.getElementById('assignArea')?.value || '';
            const targetArea = area ? `${locality}, ${area}` : locality;

            const checkedDiseases = [];
            document.querySelectorAll('input[name="target_diseases"]:checked').forEach(cb => {
                checkedDiseases.push(cb.value);
            });

            const supplies = document.getElementById('suppliesField')?.value?.trim() || '';
            const capacity = document.getElementById('clinicCapacity')?.value || '';
            const deployDate = document.getElementById('deploymentDate')?.value || '';
            const deployEndDate = document.getElementById('deploymentEndDate')?.value || '';
            const opTime = document.getElementById('operationTime')?.value || '';

            if (!locality) {
                alert('يرجى اختيار المحلية المستهدفة.');
                return;
            }
            if (!area) {
                alert('يرجى اختيار المنطقة المستهدفة.');
                return;
            }
            if (checkedDiseases.length === 0) {
                alert('يرجى تحديد مرض واحد على الأقل.');
                return;
            }
            if (!capacity) {
                alert('يرجى إدخال الطاقة الاستيعابية للعيادة.');
                return;
            }
            if (!deployDate || !deployEndDate) {
                alert('يرجى إدخال تاريخ النشر وتاريخ انتهائه.');
                return;
            }
            if (!opTime) {
                alert('يرجى تحديد وقت التشغيل.');
                return;
            }

            const schedule = `تاريخ النشر: ${deployDate} | تاريخ الانتهاء: ${deployEndDate} | وقت التشغيل: ${opTime} | الإمدادات: ${supplies || '—'}`;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('يجب تسجيل الدخول لتقديم الطلب.');
                return;
            }

            let orgName = user.email;
            try {
                const { data: orgProfile } = await supabase
                    .from('organization_profiles')
                    .select('org_name')
                    .eq('id', user.id)
                    .single();
                if (orgProfile?.org_name) orgName = orgProfile.org_name;
            } catch (e) { /* use fallback */ }

            const { error } = await supabase
                .from('clinic_requests')
                .insert({
                    org_id: user.id,
                    org_name: orgName,
                    target_area: targetArea,
                    diseases: checkedDiseases,
                    capacity: parseInt(capacity),
                    schedule: schedule,
                    status: 'pending'
                });

            if (error) {
                console.error('Error submitting clinic request:', error);
                alert('فشل تقديم الطلب: ' + error.message);
                return;
            }

            closeModal();
            showToast('تم تقديم طلب تعيين العيادة بنجاح ✔');
            assignationForm.reset();
            if (areaSelect) { areaSelect.innerHTML = '<option value="" disabled selected>اختر المنطقة أولاً...</option>'; areaSelect.disabled = true; }
        });
    }

    // ── 8. Toast Notification ──
    function showToast(message) {
        const toast = document.getElementById('successToast');
        if (!toast) return;

        const span = toast.querySelector('span');
        if (span) span.textContent = message;

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);

        // Announce to screen readers via live region
        if (window.wasilA11y) {
            wasilA11y.announce(message, 'polite');
        }
    }

    // ── 9. Service Card Interactions ──
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', async function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            const title = this.querySelector('h4');
            if (!title) return;

            // Community users can "request" a service
            if (!isOrg) {
                const serviceName = title.textContent.trim();
                const cardId = this.id || ''; // e.g. "svc-vaccination", "svc-ambulance"

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    showToast('Please login to request services');
                    return;
                }

                // Show modal for service location
                const modal = document.getElementById('serviceRequestModal');
                const display = document.getElementById('serviceTypeDisplay');
                const hiddenInput = document.getElementById('serviceTypeHidden');

                if (modal && display && hiddenInput) {
                    display.textContent = serviceName;
                    hiddenInput.value = serviceName;

                    // Show/hide service-specific fields — use card id for reliability
                    const isVaccination = cardId.includes('vaccination');
                    const isAmbulance = cardId.includes('ambulance');

                    const vacFields = document.getElementById('vaccinationFields');
                    const ambFields = document.getElementById('ambulanceFields');
                    if (vacFields) vacFields.style.display = isVaccination ? 'block' : 'none';
                    if (ambFields) ambFields.style.display = isAmbulance ? 'block' : 'none';

                    // Reset dropdowns on each open
                    const vacType = document.getElementById('vaccinationTypeInput');
                    const ambCase = document.getElementById('ambulanceCaseTypeInput');
                    if (vacType) vacType.selectedIndex = 0;
                    if (ambCase) ambCase.selectedIndex = 0;

                    // Hide and clear the 'other' text field each time modal opens
                    const otherVacGroup = document.getElementById('otherVaccineGroup');
                    const otherVacInput = document.getElementById('otherVaccineInput');
                    if (otherVacGroup) otherVacGroup.style.display = 'none';
                    if (otherVacInput) otherVacInput.value = '';

                    // Open service request modal with focus trap
                    if (window.wasilA11y && svcTrap) {
                        wasilA11y.openModal(svcModalEl, svcTrap);
                    } else {
                        modal.classList.add('active');
                    }
                }
            }
        });
    });

    // ── Show 'specify' field when 'Other' vaccine is chosen ──
    const vacTypeSelect = document.getElementById('vaccinationTypeInput');
    if (vacTypeSelect) {
        vacTypeSelect.addEventListener('change', function () {
            const otherGroup = document.getElementById('otherVaccineGroup');
            if (otherGroup) {
                otherGroup.style.display = this.value === 'Other' ? 'block' : 'none';
            }
        });
    }

    // ── 10. Outbreak Status Card Interaction ──
    const statusCards = document.querySelectorAll('.outbreak-status');
    statusCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (e) {
            // Let the inline onclick handle navigation
        });
    });

    // ── 11. Case Item Interactions ──
    const caseItems = document.querySelectorAll('.case-item');
    caseItems.forEach(item => {
        item.addEventListener('click', function () {
            const info = this.querySelector('.case-info h5');
            if (info) {
                console.log('Case clicked:', info.textContent);
            }
        });
    });

    // ── 12. Set min date for deployment to today ──
    const deploymentDate = document.getElementById('deploymentDate');
    if (deploymentDate) {
        const today = new Date().toISOString().split('T')[0];
        deploymentDate.setAttribute('min', today);
        deploymentDate.value = today;
    }

    // ── 13. Keyboard: Escape closes any open modal ──
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        // Assignation modal
        if (modal && modal.classList.contains('active')) closeAssignModal();
        // Notifications modal
        if (notifModal && notifModal.classList.contains('active')) {
            if (window.wasilA11y && notifTrap) wasilA11y.closeModal(notifModal, notifTrap);
            else { notifModal.classList.remove('active'); document.body.style.overflow = ''; }
        }
        // Service request modal
        if (svcModalEl && svcModalEl.classList.contains('active')) {
            if (window.wasilA11y && svcTrap) wasilA11y.closeModal(svcModalEl, svcTrap);
            else { svcModalEl.classList.remove('active'); }
        }
    });

    // ── Handle Service Request Form Submission ──
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    const serviceRequestModal = document.getElementById('serviceRequestModal');

    if (serviceRequestForm) {
        serviceRequestForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('confirmServiceBtn');
            const origText = submitBtn.textContent;
            submitBtn.textContent = '...';
            submitBtn.disabled = true;

            const serviceName = document.getElementById('serviceTypeHidden').value;
            const locationValue = document.getElementById('serviceLocationInput').value.trim();

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Not logged in');

                // Collect extra fields
                const mobile = document.getElementById('serviceMobileInput')?.value.trim() || null;
                let vacType = document.getElementById('vaccinationTypeInput')?.value || null;
                const ambCase = document.getElementById('ambulanceCaseTypeInput')?.value || null;

                // If 'Other' was chosen, use the custom text field value instead
                if (vacType === 'Other') {
                    const custom = document.getElementById('otherVaccineInput')?.value.trim();
                    vacType = custom ? custom : 'Other';
                }

                // Build notes string from extra fields
                let notes = '';
                if (mobile) notes += `Contact: ${mobile}. `;
                if (vacType) notes += `Vaccine Type: ${vacType}. `;
                if (ambCase) notes += `Case Type: ${ambCase}. `;

                const { error } = await supabase
                    .from('service_requests')
                    .insert({
                        service_type: serviceName,
                        location: locationValue,
                        requester_id: user.id,
                        status: 'pending',
                        notes: notes.trim() || null
                    });

                if (error) throw error;

                serviceRequestModal.classList.remove('active');
                serviceRequestForm.reset();
                showToast(`${serviceName} request sent!`);
            } catch (err) {
                console.error('Error requesting service:', err);
                showToast('Failed to send request');
            } finally {
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
            }
        });

        document.getElementById('cancelServiceBtn')?.addEventListener('click', () => {
            if (window.wasilA11y && svcTrap) {
                wasilA11y.closeModal(svcModalEl, svcTrap);
            } else {
                serviceRequestModal.classList.remove('active');
            }
            serviceRequestForm.reset();
        });
    }

});

