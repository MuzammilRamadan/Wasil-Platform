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
// ── DASHBOARD STATS — live from Supabase cases ──
// ══════════════════════════════════════════════
async function loadDashboardStats() {
    if (!window.supabase) return;

    try {
        const { data: cases, error } = await window.supabase
            .from('cases')
            .select('disease, severity, location');

        if (error || !cases || cases.length === 0) return;

        // Count per disease (case-insensitive match)
        const count = (keyword) =>
            cases.filter(c => c.disease && c.disease.toLowerCase().includes(keyword)).length;

        const chol = count('cholera');
        const typh = count('typhoid');
        const deng = count('dengue');
        const mala = count('malaria');

        // Update cholera card stat (already has id)
        const cholEl = document.getElementById('chol-cases');
        if (cholEl && chol > 0) cholEl.textContent = chol.toLocaleString();

        // Update other stats via querySelectorAll on the stat-num spans in each card
        const allStatNums = document.querySelectorAll('.disease-card-stats .stat-num');
        const cardValues = [chol, typh, deng, mala];
        document.querySelectorAll('.disease-card').forEach((card, i) => {
            const nums = card.querySelectorAll('.stat-num');
            if (nums[0] && cardValues[i] > 0) nums[0].textContent = cardValues[i].toLocaleString();
        });

        // Build area aggregate from cases
        const areaMap = {};
        cases.forEach(c => {
            if (!c.location) return;
            const key = c.location;
            if (!areaMap[key]) areaMap[key] = { count: 0, disease: c.disease };
            areaMap[key].count++;
        });

        // Sort by count and update table
        const sortedAreas = Object.entries(areaMap)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5);

        const tbody = document.getElementById('epicAreasTableBody');
        if (tbody && sortedAreas.length > 0) {
            const sevClass = (n) => n > 100 ? 'critical' : n > 30 ? 'high' : n > 10 ? 'moderate' : 'stable';
            const sevLabel = (n) => n > 100 ? 'CRITICAL' : n > 30 ? 'HIGH' : n > 10 ? 'MODERATE' : 'STABLE';
            tbody.innerHTML = sortedAreas.map(([loc, info], i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${loc}</td>
                    <td>${info.disease || '—'}</td>
                    <td>${info.count}</td>
                    <td><span class="severity-pill ${sevClass(info.count)}">${sevLabel(info.count)}</span></td>
                </tr>`).join('');
        }

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
                <td><span class="severity-pill stable">Active</span></td>
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
                        <span data-i18n="admin.btn_approve">Approve</span>
                    </button>
                    <button class="btn-reject" onclick="handleRequest('${req.id}','reject',this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        <span data-i18n="admin.btn_reject">Reject</span>
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
            const { error } = await window.supabase
                .from('clinic_requests')
                .update({ status: newStatus })
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

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function (e) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.querySelector('.menu-toggle');
        if (window.innerWidth <= 900 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    console.log('WASIL Admin Panel Initialized ✓');
});
