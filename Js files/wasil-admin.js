// ============================================
// WASIL ADMIN JS — Ministry of Health Panel
// ============================================

// ── AUTH GUARD ──
(function adminAuthGuard() {
    const userStr = localStorage.getItem('wasil_user');
    const role = localStorage.getItem('wasil_role');
    if (!userStr || role !== 'admin') {
        localStorage.setItem('wasil_role', 'admin');
        window.location.href = 'wasil-login.html';
        return;
    }
    try {
        const user = JSON.parse(userStr);
        const nameEl = document.getElementById('adminName');
        const emailEl = document.getElementById('adminEmail');
        if (nameEl) nameEl.textContent = user.fullName || 'Admin';
        if (emailEl) emailEl.textContent = user.email || '—';
    } catch (e) { /* ignore */ }
})();

// ── SECTION NAVIGATION ──
function showSection(name, clickedEl) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const target = document.getElementById('section-' + name);
    if (target) target.classList.add('active');
    if (clickedEl) clickedEl.classList.add('active');

    const titleEl = document.getElementById('topbarTitle');
    if (titleEl) {
        const span = clickedEl ? clickedEl.querySelector('span[data-i18n]') : null;
        titleEl.textContent = span ? span.textContent : '';
    }

    if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
        var overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.classList.remove('active');
    }
}

// ── TOGGLE SIDEBAR (mobile) ──
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    var overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.toggle('active');
}

// ── LANGUAGE TOGGLE ──
function toggleLang() {
    const current = localStorage.getItem('wasil_lang') || 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('wasil_lang', next);
    document.getElementById('langBtnText').textContent = next === 'ar' ? 'English' : 'العربية';
    if (typeof applyLanguage === 'function') applyLanguage();
}

// ── LOGOUT ──
async function handleLogout() {
    try {
        if (window.supabase && window.supabase.auth) {
            await window.supabase.auth.signOut();
        }
    } catch (e) { console.warn('Logout error:', e); }
    localStorage.removeItem('wasil_user');
    localStorage.removeItem('wasil_role');
    window.location.href = 'wasil-roleselect.html';
}

// ══════════════════════════════════════════════
// ── SEVERITY FROM CASE COUNT (platform-wide rule) ──
// 1–10 → low | 11–30 → moderate | 31–60 → high | 61+ → critical
// ══════════════════════════════════════════════
function computeSeverityFromCount(count) {
    if (count >= 61) return 'critical';
    if (count >= 31) return 'high';
    if (count >= 11) return 'moderate';
    return 'low';
}

// ══════════════════════════════════════════════
// ── DASHBOARD STATS — live from Supabase cases ──
// ══════════════════════════════════════════════
async function loadDashboardStats() {
    if (!window.supabase) return;

    try {
        const { data: activeDiseases, error: dErr } = await window.supabase
            .from('diseases')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

        const { data: cases, error } = await window.supabase
            .from('cases')
            .select('disease, severity, location');

        if (error) throw error;

        const diseaseList = (activeDiseases && activeDiseases.length > 0) ? activeDiseases : [
            { name: 'Cholera', default_severity: 'critical' },
            { name: 'Typhoid', default_severity: 'high' },
            { name: 'Dengue Fever', default_severity: 'moderate' },
            { name: 'Malaria', default_severity: 'low' }
        ];

        const grid = document.getElementById('diseaseCardsGrid');
        if (grid) {
            grid.innerHTML = diseaseList.map(disease => {
                const count = cases ? cases.filter(c => c.disease && c.disease.toLowerCase() === disease.name.toLowerCase()).length : 0;

                // Severity derived from case count
                const sev = computeSeverityFromCount(count);
                const sevClass = sev === 'critical' ? 'critical' : sev === 'high' ? 'high' : sev === 'low' ? 'stable' : 'moderate';
                const sevLabel = (sev === 'low' ? 'stable' : sev).toUpperCase();

                let iconPath = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'; // Generic
                const lname = disease.name.toLowerCase();
                if (lname.includes('cholera')) iconPath = '<circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12H5M19 12h3"></path><path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"></path>';
                else if (lname.includes('typhoid')) iconPath = '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>';
                else if (lname.includes('dengue')) iconPath = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>';
                else if (lname.includes('malaria')) iconPath = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>';
                else iconPath = '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>';

                return `
                <div class="disease-card ${sevClass}">
                    <div class="disease-card-icon" style="color:var(--${sevClass});">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            ${iconPath}
                        </svg>
                    </div>
                    <div class="disease-card-body">
                        <h3>${disease.name}</h3>
                        <div class="severity-pill ${sevClass}">${sevLabel}</div>
                    </div>
                    <div class="disease-card-stats">
                        <div class="stat"><span class="stat-num">${count.toLocaleString()}</span><span class="stat-label">Cases</span></div>
                        <div class="stat"><span class="stat-num" style="font-size:0.75rem;color:#64748B;">${count===0?'–':count<=10?'1–10':count<=30?'11–30':count<=60?'31–60':'61+'}</span><span class="stat-label">Range</span></div>
                    </div>
                </div>`;
            }).join('');
        }

        if (!cases || cases.length === 0) return;

        // Render interactive area tabs on the Dashboard
        renderEpicAreasFromCases(cases);

    } catch (err) {
        console.error('loadDashboardStats error:', err);
    }
}

// ══════════════════════════════════════════════
// ── DEPLOYED CLINICS — load approved requests ──
// ══════════════════════════════════════════════
async function loadDeployedClinics() {
    const tbody = document.getElementById('deployedTableBody');
    const countEl = document.getElementById('deployedCount');
    if (!tbody) return;

    if (!window.supabase) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#7F8C8D;padding:24px;">Supabase not initialized.</td></tr>`;
        return;
    }

    try {
        const { data: clinics, error } = await window.supabase
            .from('clinic_requests')
            .select('id, org_name, target_area, capacity, diseases, schedule, created_at, clinic_name')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!clinics || clinics.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#7F8C8D;padding:32px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#BDC3C7" stroke-width="1.5" style="display:block;margin:0 auto 10px;">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                No deployed clinics yet. Approve a clinic request to see it here.
            </td></tr>`;
            if (countEl) countEl.textContent = '0 active deployments';
            return;
        }

        if (countEl) countEl.textContent = `${clinics.length} active deployment${clinics.length !== 1 ? 's' : ''}`;

        tbody.innerHTML = clinics.map(c => {
            const diseases = Array.isArray(c.diseases)
                ? c.diseases.map(d => `<span class="tag">${d}</span>`).join('')
                : (c.diseases ? `<span class="tag">${c.diseases}</span>` : '—');
            const name = c.clinic_name || (c.org_name ? `${c.org_name} Clinic` : 'Clinic');
            return `
            <tr>
                <td><strong>${name}</strong></td>
                <td>${c.target_area || '—'}</td>
                <td>${c.capacity ? `${c.capacity}/day` : '—'}</td>
                <td>${diseases}</td>
                <td>${c.schedule || '—'}</td>
                <td>${c.org_name || '—'}</td>
                <td><span class="severity-pill stable" data-i18n="admin.status_active">t('admin.status_active') || 'Active'</span></td>
            </tr>`;
        }).join('');

    } catch (err) {
        console.error('loadDeployedClinics error:', err);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#E74C3C;padding:24px;">Failed to load clinics: ${err.message}</td></tr>`;
    }
}

// ══════════════════════════════════════════════
// ── CLINIC REQUESTS — load pending requests ──
// ══════════════════════════════════════════════
async function loadClinicRequests() {
    if (!window.supabase) return;

    try {
        const { data: requests, error } = await window.supabase
            .from('clinic_requests')
            .select('id, org_name, target_area, capacity, diseases, schedule, created_at')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Update badge
        const badge = document.getElementById('requestsBadge');
        if (badge) {
            badge.textContent = requests ? requests.length : 0;
            badge.style.display = (requests && requests.length > 0) ? 'inline-block' : 'none';
        }

        const list = document.getElementById('requestsList');
        if (!list) return;

        if (!requests || requests.length === 0) {
            list.innerHTML = `<div style="text-align:center;color:#7F8C8D;padding:48px 24px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BDC3C7" stroke-width="1.5" style="display:block;margin:0 auto 12px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                No pending clinic requests.
            </div>`;
            return;
        }

        const colors = ['#1a7a4a', '#E74C3C', '#8B5CF6', '#E67E22', '#4A90E2'];
        list.innerHTML = requests.map((req, i) => {
            const avatarLetter = (req.org_name || 'O').charAt(0).toUpperCase();
            const color = colors[i % colors.length];
            const diseases = Array.isArray(req.diseases)
                ? req.diseases.map(d => `<span class="tag">${d}</span>`).join('')
                : (req.diseases ? `<span class="tag">${req.diseases}</span>` : '—');
            const dateStr = req.created_at ? new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
            return `
            <div class="request-card" data-id="${req.id}">
                <div class="request-org">
                    <div class="org-avatar" style="background:${color}">${avatarLetter}</div>
                    <div>
                        <h4>${req.org_name || 'Organization'}</h4>
                        <span class="request-date">${dateStr}</span>
                    </div>
                </div>
                <div class="request-details">
                    <div class="detail-row"><span class="detail-key">Target Area</span><span class="detail-val">${req.target_area || '—'}</span></div>
                    <div class="detail-row"><span class="detail-key">Capacity</span><span class="detail-val">${req.capacity ? req.capacity + ' patients/day' : '—'}</span></div>
                    <div class="detail-row"><span class="detail-key">Diseases</span><span class="detail-val">${diseases}</span></div>
                    <div class="detail-row"><span class="detail-key">Schedule</span><span class="detail-val">${req.schedule || '—'}</span></div>
                </div>
                <div class="request-actions">
                    <button class="btn-approve" onclick="handleRequest('${req.id}','approve',this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span data-i18n="admin.btn_approve" data-i18n="admin.btn_approve">t('admin.btn_approve') || 'Approve'</span>
                    </button>
                    <button class="btn-reject" onclick="handleRequest('${req.id}','reject',this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        <span data-i18n="admin.btn_reject" data-i18n="admin.btn_reject">t('admin.btn_reject') || 'Reject'</span>
                    </button>
                </div>
            </div>`;
        }).join('');

    } catch (err) {
        console.error('loadClinicRequests error:', err);
    }
}

// ── CLINIC REQUEST: APPROVE / REJECT ──
async function handleRequest(requestId, action, btn) {
    const card = document.querySelector(`.request-card[data-id="${requestId}"]`);
    if (!card) return;

    card.querySelectorAll('button').forEach(b => b.disabled = true);

    try {
        if (window.supabase) {
            const newStatus = action === 'approve' ? 'approved' : 'rejected';
            const updateProps = { status: newStatus };

            if (action === 'reject') {
                const reason = prompt("Enter a brief reason for rejecting this clinic request:");
                if (reason === null) {
                    card.querySelectorAll('button').forEach(b => b.disabled = false);
                    return; // user cancelled
                }
                updateProps.rejection_reason = reason;
            }

            const { error } = await window.supabase
                .from('clinic_requests')
                .update(updateProps)
                .eq('id', requestId);

            if (error) {
                console.warn('Supabase update error:', error.message);
                showToast('Error updating request: ' + error.message, 'error');
                card.querySelectorAll('button').forEach(b => b.disabled = false);
                return;
            }
        }

        const isApprove = action === 'approve';
        card.classList.add(isApprove ? 'approved' : 'rejected');

        const actionsDiv = card.querySelector('.request-actions');
        actionsDiv.innerHTML = `
            <div style="text-align:center;padding:10px 0;">
                <span style="font-size:0.9rem;font-weight:700;color:${isApprove ? '#1a7a4a' : '#C0392B'}">
                    ${isApprove ? '✓ Approved / تمت الموافقة' : '✗ Rejected / تم الرفض'}
                </span>
            </div>`;

        // If approved, refresh deployed clinics table from Supabase
        if (isApprove) {
            await loadDeployedClinics();
        }

        updateRequestsBadge();
        showToast(isApprove
            ? 'Request approved! / تمت الموافقة على الطلب!'
            : 'Request rejected. / تم رفض الطلب.',
            isApprove ? 'success' : 'error');

    } catch (err) {
        console.error('Request action error:', err);
        card.querySelectorAll('button').forEach(b => b.disabled = false);
        showToast('An error occurred. / حدث خطأ.', 'error');
    }
}

// ── USERS TAB SWITCH ──
function switchUsersTab(tab, btn) {
    document.querySelectorAll('.users-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.users-tab-content').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const content = document.getElementById('tab-' + tab);
    if (content) content.classList.add('active');
}

// ── BADGE UPDATE ──
function updateRequestsBadge() {
    const pending = document.querySelectorAll('.request-card:not(.approved):not(.rejected)').length;
    const badge = document.getElementById('requestsBadge');
    if (badge) {
        badge.textContent = pending;
        badge.style.display = pending > 0 ? 'inline-block' : 'none';
    }
}

// ── TOAST ──
function showToast(message, type = 'success') {
    const toast = document.getElementById('adminToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'admin-toast ' + type + ' show';
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// ══════════════════════════════════════════════
// ── REMOVE USER — delete from Supabase ──
// ══════════════════════════════════════════════
async function removeUser(userId, tableName, btn) {
    const userName = btn.closest('tr').querySelector('td')?.textContent || 'this user';
    const confirmed = confirm(`Are you sure you want to remove ${userName}?\nهل أنت متأكد من حذف هذا المستخدم؟`);
    if (!confirmed) return;

    if (!window.supabase) {
        showToast('Supabase not initialized.', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = '...';

    try {
        // Delete from the profile table
        const { error } = await window.supabase
            .from(tableName)
            .delete()
            .eq('id', userId);

        if (error) throw error;

        // Also try to delete from the generic profiles table
        await window.supabase.from('profiles').delete().eq('id', userId);

        // Remove the row from the table with animation
        const row = btn.closest('tr');
        if (row) {
            row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(20px)';
            setTimeout(() => row.remove(), 400);
        }

        showToast('User removed successfully! / تم حذف المستخدم بنجاح!', 'success');

    } catch (err) {
        console.error('removeUser error:', err);
        btn.disabled = false;
        btn.textContent = 'Remove';
        showToast('Failed to remove user: ' + err.message, 'error');
    }
}

// ══════════════════════════════════════════════
// ── SYSTEM USERS — load from Supabase ──
// ══════════════════════════════════════════════
async function loadSystemUsers() {
    if (!window.supabase) return;

    // ── Organizations ──
    try {
        const { data: orgs, error: orgErr } = await window.supabase
            .from('organization_profiles')
            .select('org_name, phone, email, id')
            .order('org_name', { ascending: true });

        const orgsBody = document.getElementById('orgsTableBody');
        if (orgsBody) {
            if (orgErr || !orgs || orgs.length === 0) {
                orgsBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#7F8C8D;padding:32px;">
                    No registered organizations found.
                </td></tr>`;
            } else {
                // For each org, get approved/rejected counts from clinic_requests
                const { data: allRequests } = await window.supabase
                    .from('clinic_requests')
                    .select('org_name, status');

                orgsBody.innerHTML = orgs.map(org => {
                    let approved = 0, rejected = 0;
                    if (allRequests) {
                        allRequests.forEach(r => {
                            if (r.org_name === org.org_name) {
                                if (r.status === 'approved') approved++;
                                else if (r.status === 'rejected') rejected++;
                            }
                        });
                    }
                    return `
                    <tr>
                        <td><strong>${org.org_name || '—'}</strong></td>
                        <td>${org.phone || '—'}</td>
                        <td>${org.email || '—'}</td>
                        <td><span class="count-badge green">${approved}</span></td>
                        <td><span class="count-badge red">${rejected}</span></td>
                        <td><button class="btn-remove" onclick="removeUser('${org.id}','organization_profiles',this)" title="Remove user">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Remove
                        </button></td>
                    </tr>`;
                }).join('');
            }
        }
    } catch (err) {
        console.error('loadSystemUsers (orgs) error:', err);
        const orgsBody = document.getElementById('orgsTableBody');
        if (orgsBody) orgsBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#E74C3C;padding:24px;">Failed to load: ${err.message}</td></tr>`;
    }

    // ── Community Users ──
    try {
        const { data: community, error: communityErr } = await window.supabase
            .from('community_profiles')
            .select('full_name, phone, email, location, reported_disease')
            .order('full_name', { ascending: true });

        const communityBody = document.getElementById('communityTableBody');
        if (communityBody) {
            if (communityErr || !community || community.length === 0) {
                // Fallback: try 'profiles' table
                const { data: profiles, error: profilesErr } = await window.supabase
                    .from('profiles')
                    .select('full_name, phone, email, location, role')
                    .eq('role', 'community')
                    .order('full_name', { ascending: true });

                if (!profilesErr && profiles && profiles.length > 0) {
                    communityBody.innerHTML = profiles.map(u => `
                    <tr>
                        <td>${u.full_name || '—'}</td>
                        <td>${u.phone || '—'}</td>
                        <td>${u.email || '—'}</td>
                        <td>${u.location || '—'}</td>
                        <td>—</td>
                        <td><button class="btn-remove" onclick="removeUser('${u.id}','profiles',this)" title="Remove user">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Remove
                        </button></td>
                    </tr>`).join('');
                } else {
                    communityBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#7F8C8D;padding:32px;">
                        No registered community users found.
                    </td></tr>`;
                }
            } else {
                communityBody.innerHTML = community.map(u => `
                <tr>
                    <td>${u.full_name || '—'}</td>
                    <td>${u.phone || '—'}</td>
                    <td>${u.email || '—'}</td>
                    <td>${u.location || '—'}</td>
                    <td>${u.reported_disease ? `<span class="tag">${u.reported_disease}</span>` : '—'}</td>
                    <td><button class="btn-remove" onclick="removeUser('${u.id}','community_profiles',this)" title="Remove user">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Remove
                    </button></td>
                </tr>`).join('');
            }
        }
    } catch (err) {
        console.error('loadSystemUsers (community) error:', err);
        const communityBody = document.getElementById('communityTableBody');
        if (communityBody) communityBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#E74C3C;padding:24px;">Failed to load: ${err.message}</td></tr>`;
    }
}

// ══════════════════════════════════════════════
// ── OUTBREAK DASHBOARD — real-time from cases ──
// ══════════════════════════════════════════════
async function loadOutbreakDashboard() {
    if (!window.supabase) return;

    const areaEl = document.getElementById('adminAreaList');
    const tbody = document.getElementById('adminCasesTableBody');
    const chipsEl = document.getElementById('adminOutbreakChips');
    const countEl = document.getElementById('recentCasesCount');
    if (!areaEl || !tbody) return;

    try {
        const { data: cases, error } = await window.supabase
            .from('cases')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !cases || cases.length === 0) {
            areaEl.innerHTML = '<p style="text-align:center;padding:32px;color:#94A3B8;">No cases submitted yet.</p>';
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:#94A3B8;">No cases yet.</td></tr>';
            if (chipsEl) chipsEl.innerHTML = '';
            return;
        }

        const areaMap = {};
        cases.forEach(c => {
            const area = (c.location || 'Unknown').split(',')[0].trim();
            if (!areaMap[area]) areaMap[area] = { count: 0, diseases: new Set(), locations: [] };
            areaMap[area].count++;
            if (c.disease) areaMap[area].diseases.add(c.disease);

            let specificLoc = c.location && c.location.indexOf(',') !== -1 ? c.location.slice(c.location.indexOf(',') + 1).trim() : 'Unknown Sub-area';
            if (c.description && c.description.trim() !== '') specificLoc += ' - ' + c.description;
            areaMap[area].locations.push({ loc: specificLoc, disease: c.disease, id: c.id });
        });

        // Compute severity from count for each area
        const sevOrder = s => ({ critical: 0, high: 1, moderate: 2, low: 3 }[s] ?? 4);
        const riskColor = { critical: '#EF4444', high: '#F59E0B', moderate: '#3B82F6', low: '#10B981' };
        const riskLabel = { critical: 'CRITICAL', high: 'HIGH', moderate: 'MODERATE', low: 'LOW' };
        const riskBg = { critical: 'rgba(239,68,68,0.08)', high: 'rgba(245,158,11,0.08)', moderate: 'rgba(59,130,246,0.08)', low: 'rgba(16,185,129,0.08)' };

        // Total severity chips based on area count-severity
        const totals = { critical: 0, high: 0, moderate: 0, low: 0 };
        Object.values(areaMap).forEach(info => {
            const sev = computeSeverityFromCount(info.count);
            totals[sev]++;
        });

        // Chips
        if (chipsEl) {
            chipsEl.innerHTML = [
                `<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:700;color:#1e293b;">${cases.length} Total Cases</span>`,
                `<span style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:700;color:#EF4444;">${totals.critical} Areas Critical</span>`,
                `<span style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:700;color:#F59E0B;">${totals.high} Areas High</span>`,
                `<span style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:700;color:#3B82F6;">${totals.moderate} Areas Moderate</span>`,
                `<span style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:700;color:#10B981;">${totals.low} Areas Low</span>`,
                `<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;padding:5px 14px;font-size:0.8rem;font-weight:600;color:#64748B;">${Object.keys(areaMap).length} Areas</span>`
            ].join('');
        }

        // Area cards — sorted by count desc
        const sorted = Object.entries(areaMap).sort((a, b) => b[1].count - a[1].count);

        areaEl.innerHTML = '';
        sorted.forEach(([area, info]) => {
            const dom = computeSeverityFromCount(info.count);
            const color = riskColor[dom];
            const tags = [...info.diseases].map(d =>
                `<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:2px 8px;font-size:0.68rem;font-weight:600;color:#475569;">${d}</span>`).join(' ');

            const locsList = info.locations.slice(0, 5).map(l => {
                return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f1f5f9;font-size:0.78rem;">
                    <span style="color:#475569;"><span style="color:${color};margin-right:4px;">●</span>${l.loc}</span>
                    <span style="font-weight:600;color:#1e293b;">${l.disease || ''}</span>
                </div>`;
            }).join('');
            const moreLocs = info.locations.length > 5 ? `<div style="text-align:center;font-size:0.7rem;color:#94a3b8;margin-top:4px;">+ ${info.locations.length - 5} more cases</div>` : '';

            areaEl.insertAdjacentHTML('beforeend', `
            <div style="border-left:4px solid ${color};background:#fff;border-radius:10px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 6px rgba(0,0,0,0.05);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                    <span style="font-weight:700;font-size:0.95rem;color:#1e293b;">${area}</span>
                    <span style="background:${riskBg[dom]};color:${color};border-radius:20px;padding:3px 10px;font-size:0.65rem;font-weight:800;letter-spacing:0.5px;">${riskLabel[dom]}</span>
                </div>
                <p style="font-size:0.82rem;color:#64748B;margin-bottom:6px;"><strong style="color:#1e293b;font-size:0.95rem;">${info.count}</strong> case${info.count !== 1 ? 's' : ''} &nbsp;<span style="font-size:0.68rem;color:#94a3b8;">(${info.count<=10?'1–10 Low':info.count<=30?'11–30 Moderate':info.count<=60?'31–60 High':'61+ Critical'})</span></p>
                ${info.diseases.size > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">${tags}</div>` : ''}
                <div style="background:#f8fafc;padding:8px 12px;border-radius:8px;">
                    <strong style="font-size:0.75rem;color:#1e293b;margin-bottom:4px;display:block;">Specific Locations</strong>
                    ${locsList}
                    ${moreLocs}
                </div>
            </div>`);
        });

        // Cases table with admin actions
        if (countEl) countEl.textContent = `${cases.length} cases total`;
        const sevPill = (s, count) => {
            const computed = computeSeverityFromCount(count || 0);
            const cls = computed === 'critical' ? 'critical' : computed === 'high' ? 'high' : computed === 'moderate' ? 'moderate' : 'stable';
            return `<span class="severity-pill ${cls}">${computed.toUpperCase()}</span>`;
        };
        function timeAgo(d) {
            const diff = Math.floor((Date.now() - new Date(d)) / 1000);
            if (diff < 60) return diff + 's ago';
            if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
            if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
            return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        }

        // Build a per-disease running count to assign severity
        const diseaseCountMap = {};
        const casesForTable = cases.slice(0, 30);
        // Count total per disease across ALL cases for accurate severity
        cases.forEach(c => {
            const d = (c.disease || 'Unknown').toLowerCase();
            diseaseCountMap[d] = (diseaseCountMap[d] || 0) + 1;
        });

        tbody.innerHTML = casesForTable.map(c => {
            const dCount = diseaseCountMap[(c.disease || '').toLowerCase()] || 1;
            const caseStatus = c.status || 'reported';
            const statusStyle = caseStatus === 'cured' ? 'color:#10B981;font-weight:700;' :
                                caseStatus === 'treating' ? 'color:#3B82F6;font-weight:700;' : 'color:#94A3B8;';
            return `
            <tr id="case-row-${c.id}">
                <td>${c.location || '—'}</td>
                <td>${c.disease || '—'}</td>
                <td>${sevPill(c.severity, dCount)}</td>
                <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${(c.description || '').replace(/"/g, '&quot;')}">${c.description || '—'}</td>
                <td style="white-space:nowrap;">${timeAgo(c.created_at)}</td>
                <td style="white-space:nowrap;">
                    <span style="${statusStyle};font-size:0.75rem;display:block;margin-bottom:4px;">${caseStatus.toUpperCase()}</span>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">
                        <button onclick="updateCaseStatus('${c.id}','treating')" title="Mark as Treating"
                            style="font-size:0.68rem;padding:3px 7px;border-radius:4px;border:1px solid #3B82F6;color:#3B82F6;background:transparent;cursor:pointer;font-weight:600;">Treating</button>
                        <button onclick="updateCaseStatus('${c.id}','cured')" title="Mark as Cured"
                            style="font-size:0.68rem;padding:3px 7px;border-radius:4px;border:1px solid #10B981;color:#10B981;background:transparent;cursor:pointer;font-weight:600;">Cured</button>
                        <button onclick="deleteCase('${c.id}')" title="Remove Case"
                            style="font-size:0.68rem;padding:3px 7px;border-radius:4px;border:1px solid #EF4444;color:#EF4444;background:transparent;cursor:pointer;font-weight:600;">Remove</button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        // Also refresh the Dashboard's Epidemic Areas tabs
        renderEpicAreasFromCases(cases);

    } catch (err) {
        console.error('loadOutbreakDashboard error:', err);
        if (areaEl) areaEl.innerHTML = '<p style="color:#EF4444;padding:20px;">Failed to load outbreak data.</p>';
    }

    // Realtime subscription (only once)
    if (!window._outbreakSubActive) {
        window._outbreakSubActive = true;
        window.supabase.channel('admin:cases:live')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cases' }, () => {
                loadOutbreakDashboard();
                const b = document.getElementById('outbreakBadge');
                if (b) { b.style.display = 'inline-block'; setTimeout(() => b.style.display = 'none', 5000); }
            })
            .subscribe();
    }
}

// ══════════════════════════════════════════════
// ── CASE STATUS ACTIONS (Admin) ──
// ══════════════════════════════════════════════
async function updateCaseStatus(caseId, newStatus) {
    if (!window.supabase) return;
    try {
        const { error } = await window.supabase
            .from('cases')
            .update({ status: newStatus })
            .eq('id', caseId);
        if (error) throw error;
        showToast(`Case marked as ${newStatus}!`, 'success');
        // Update the status label in the row immediately
        const row = document.getElementById('case-row-' + caseId);
        if (row) {
            const statusSpan = row.querySelector('td:last-child span');
            if (statusSpan) {
                statusSpan.textContent = newStatus.toUpperCase();
                statusSpan.style.color = newStatus === 'cured' ? '#10B981' : '#3B82F6';
            }
        }
    } catch (err) {
        console.error('updateCaseStatus error:', err);
        showToast('Error updating case: ' + err.message, 'error');
    }
}

async function deleteCase(caseId) {
    if (!confirm('Remove this case? This cannot be undone.\nحذف هذه الحالة؟')) return;
    if (!window.supabase) return;
    try {
        const { error } = await window.supabase
            .from('cases')
            .delete()
            .eq('id', caseId);
        if (error) throw error;
        // Animate row removal
        const row = document.getElementById('case-row-' + caseId);
        if (row) {
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(20px)';
            setTimeout(() => { row.remove(); loadOutbreakDashboard(); }, 350);
        }
        showToast('Case removed successfully!', 'success');
    } catch (err) {
        console.error('deleteCase error:', err);
        showToast('Error removing case: ' + err.message, 'error');
    }
}

// ══════════════════════════════════════════════
// ── MANAGE DISEASES ──
// ══════════════════════════════════════════════

async function loadDiseasesSettings() {
    if (!window.supabase) return;
    const tbody = document.getElementById('diseasesTableBody');
    if (!tbody) return;

    try {
        const { data: diseases, error } = await window.supabase
            .from('diseases')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            if (error.code === '42P01') {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:24px;">Please run the 'add_diseases_table.sql' migration.</td></tr>`;
                return;
            }
            throw error;
        }

        if (!diseases || diseases.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:24px;">No diseases found. Add one above.</td></tr>`;
            return;
        }

        tbody.innerHTML = diseases.map(d => {
            const sevClass = d.default_severity === 'critical' ? 'critical' : d.default_severity === 'high' ? 'high' : d.default_severity === 'low' ? 'stable' : 'moderate';
            return `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td><span class="severity-pill ${sevClass}">${(d.default_severity || 'moderate').toUpperCase()}</span></td>
                <td><span class="tag" style="background:${d.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; color:${d.is_active ? '#10B981' : '#EF4444'}">${d.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button class="btn-remove" onclick="removeDisease('${d.id}')" title="Delete Disease">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                        Delete
                    </button>
                    ${d.is_active ?
                    `<button class="btn-approve" style="background:transparent; color:#E67E22; border:1px solid #E67E22; margin-left:6px;" onclick="toggleDiseaseActive('${d.id}', false)">Deactivate</button>` :
                    `<button class="btn-approve" style="background:transparent; color:#10B981; border:1px solid #10B981; margin-left:6px;" onclick="toggleDiseaseActive('${d.id}', true)">Activate</button>`
                }
                </td>
            </tr>`;
        }).join('');
    } catch (err) {
        console.error('loadDiseasesSettings error:', err);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#EF4444;">Failed to load diseases</td></tr>`;
    }
}

async function removeDisease(id) {
    if (!confirm("Are you sure you want to delete this disease? Active cases will still retain the name as text.")) return;
    try {
        const { error } = await window.supabase.from('diseases').delete().eq('id', id);
        if (error) throw error;
        showToast('Disease deleted', 'success');
        loadDiseasesSettings();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting disease', 'error');
    }
}

async function toggleDiseaseActive(id, isActive) {
    try {
        const { error } = await window.supabase.from('diseases').update({ is_active: isActive }).eq('id', id);
        if (error) throw error;
        showToast(isActive ? 'Disease activated' : 'Disease deactivated', 'success');
        loadDiseasesSettings();
        loadDashboardStats();
    } catch (err) {
        showToast('Error updating disease', 'error');
    }
}


// ══════════════════════════════════════════════
// ── EPIDEMIC AREAS — Interactive Tabs + Sub-area Ranking ──
// ══════════════════════════════════════════════

function computeSeverityFromCount(count) {
    if (count <= 10) return 'low';
    if (count <= 30) return 'moderate';
    if (count <= 60) return 'high';
    return 'critical';
}

/**
 * Build main-area → sub-area map from cases array,
 * then render the area tabs and the default sub-area panel.
 * Location format expected: "MainArea, SubArea"
 */
function renderEpicAreasFromCases(cases) {
    const tabsEl = document.getElementById('epicAreaTabs');
    const panelEl = document.getElementById('epicSubAreasPanel');
    if (!tabsEl || !panelEl) return;

    if (!cases || cases.length === 0) {
        tabsEl.innerHTML = '<div class="area-tabs-loading">No epidemic data yet.</div>';
        panelEl.innerHTML = '';
        return;
    }

    const sevPriority = { critical: 0, high: 1, moderate: 2, low: 3 };

    // Build mainAreaMap
    const mainAreaMap = {};
    cases.forEach(c => {
        if (!c.location) return;
        const parts = c.location.split(',');
        const mainArea = parts[0].trim();
        const subArea = parts.length > 1 ? parts.slice(1).join(',').trim() : mainArea;

        if (!mainAreaMap[mainArea]) mainAreaMap[mainArea] = { total: 0, subAreas: {} };
        mainAreaMap[mainArea].total++;

        const subs = mainAreaMap[mainArea].subAreas;
        if (!subs[subArea]) subs[subArea] = { count: 0, diseases: new Set() };
        subs[subArea].count++;
        if (c.disease) subs[subArea].diseases.add(c.disease);
    });

    // Sort main areas by total cases (desc)
    const sortedMainAreas = Object.entries(mainAreaMap)
        .sort(([, a], [, b]) => b.total - a.total);

    // Store globally so selectEpicArea can access
    window._epicAreaData = mainAreaMap;

    // Tab accent colour from count-based severity
    const areaTabColor = { critical: '#EF4444', high: '#F59E0B', moderate: '#3B82F6', low: '#10B981' };

    // Render tab buttons
    tabsEl.innerHTML = sortedMainAreas.map(([area, info], i) => {
        const sev = computeSeverityFromCount(info.total);
        const color = areaTabColor[sev] || '#10B981';
        // Use data-area attribute to avoid quote escaping issues in onclick
        const safeArea = area.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        return `
        <button class="area-tab-btn${i === 0 ? ' active' : ''}"
                data-area="${safeArea}"
                onclick="selectEpicArea(this)"
                style="--tab-accent:${color};">
            <span class="area-tab-name">${area}</span>
            <span class="area-tab-count">${info.total}</span>
        </button>`;
    }).join('');

    // Show first area by default
    if (sortedMainAreas.length > 0) {
        _renderEpicSubAreas(sortedMainAreas[0][0], sortedMainAreas[0][1], panelEl);
    }
}

/** Called when admin clicks an area tab button */
function selectEpicArea(btn) {
    const areaName = btn.getAttribute('data-area');
    if (!areaName) return;
    document.querySelectorAll('#epicAreaTabs .area-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const panelEl = document.getElementById('epicSubAreasPanel');
    if (!panelEl || !window._epicAreaData) return;
    const areaInfo = window._epicAreaData[areaName];
    if (areaInfo) _renderEpicSubAreas(areaName, areaInfo, panelEl);
}

/** Render ranked sub-areas inside the panel for a selected main area */
function _renderEpicSubAreas(areaName, areaInfo, panelEl) {
    const riskColor = { critical: '#EF4444', high: '#F59E0B', moderate: '#3B82F6', low: '#10B981' };

    const sortedSubs = Object.entries(areaInfo.subAreas)
        .sort(([, a], [, b]) => b.count - a.count);

    panelEl.innerHTML = `
    <div class="subareas-header">
        <span class="subareas-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:5px;vertical-align:-2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${areaName}
        </span>
        <span class="subareas-total">${areaInfo.total} total case${areaInfo.total !== 1 ? 's' : ''} — <span style="font-weight:700;color:${riskColor[computeSeverityFromCount(areaInfo.total)]}">${computeSeverityFromCount(areaInfo.total).toUpperCase()}</span></span>
    </div>
    <div class="subareas-list">
        ${sortedSubs.length === 0
            ? '<div class="subarea-empty">No sub-area data available.</div>'
            : sortedSubs.map(([sub, info], i) => {
                const sev = computeSeverityFromCount(info.count);
                const color = riskColor[sev] || riskColor.low;
                const diseases = [...info.diseases].slice(0, 2).join(', ');
                return `
                <div class="subarea-row">
                    <div class="subarea-rank-badge" style="background:${i === 0 ? color : '#f1f5f9'};color:${i === 0 ? '#fff' : '#64748b'}">${i + 1}</div>
                    <div class="subarea-info">
                        <span class="subarea-name">${sub}</span>
                        ${diseases ? `<span class="subarea-disease">${diseases}</span>` : ''}
                    </div>
                    <div class="subarea-right">
                        <span class="subarea-cases">${info.count} case${info.count !== 1 ? 's' : ''}</span>
                        <span class="severity-pill ${sev === 'critical' ? 'critical' : sev === 'high' ? 'high' : sev === 'moderate' ? 'moderate' : 'stable'}">${sev.toUpperCase()}</span>
                    </div>
                </div>`;
            }).join('')
        }
    </div>`;
}


// ══════════════════════════════════════════════
// ── INIT ──
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
    if (typeof applyLanguage === 'function') applyLanguage();

    const lang = localStorage.getItem('wasil_lang') || 'en';
    const langBtn = document.getElementById('langBtnText');
    if (langBtn) langBtn.textContent = lang === 'ar' ? 'English' : 'العربية';

    // Initialize requests badge (will be updated by loadClinicRequests)
    updateRequestsBadge();

    // Load all Supabase data
    loadDashboardStats();
    loadDeployedClinics();
    loadClinicRequests();
    loadSystemUsers();
    loadOutbreakDashboard();
    loadDiseasesSettings();

    // Add Disease form
    const addDiseaseForm = document.getElementById('addDiseaseForm');
    if (addDiseaseForm) {
        addDiseaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('addDiseaseBtn');
            const name = document.getElementById('newDiseaseName').value.trim();
            const severity = document.getElementById('newDiseaseSeverity').value;

            if (!name) return;
            btn.disabled = true;
            btn.textContent = 'Adding...';

            try {
                const { error } = await window.supabase.from('diseases').insert({
                    name: name,
                    default_severity: severity,
                    is_active: true
                });
                if (error) throw error;
                showToast('Disease added successfully!', 'success');
                addDiseaseForm.reset();
                loadDiseasesSettings();
                loadDashboardStats();
            } catch (err) {
                console.error(err);
                if (err.code === '42P01') showToast('Please run the SQL migration first.', 'error');
                else showToast('Error adding disease.', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Add Disease';
            }
        });
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function (e) {
        var sidebar = document.getElementById('sidebar');
        var toggleBtn = document.querySelector('.menu-toggle');
        var overlay = document.getElementById('sidebarOverlay');
        if (window.innerWidth <= 900 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    });

    console.log('WASIL Admin Panel Initialized ✓');
});
