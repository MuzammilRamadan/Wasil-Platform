// ============================================
// WASIL Electronic Health Platform — Home Logic
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('WASIL Electronic Health Platform Loaded');

    // ── 0. Session Check ──
    async function checkSession() {
        // demo mode bypass
        if (sessionStorage.getItem('demo_mode')) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = 'wasil-login.html';
        } else {
            // Check if profile role matches local role (security check)
            // const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            // if (profile && profile.role !== localStorage.getItem('wasil_role')) {
            //     localStorage.setItem('wasil_role', profile.role);
            //     window.location.reload();
            // }
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
    } else {
        fetchDashboardStats();
        fetchServiceRequests();
        fetchAssignedClinics();
    }

    // ── Function: Fetch Clinics (Community) ──
    async function fetchClinics() {
        const listContainer = document.getElementById('clinicsList');
        if (!listContainer) return;

        const { data: clinics, error } = await supabase
            .from('clinics')
            .select('*')
            .eq('status', 'active');

        if (error) {
            console.error('Error fetching clinics:', error);
            return;
        }

        if (clinics && clinics.length > 0) {
            listContainer.innerHTML = ''; // Clear static content
            clinics.forEach((clinic, index) => {
                const vaccines = clinic.vaccines ? clinic.vaccines.map(v => `<span class="vaccine-tag">${v}</span>`).join('') : '';
                const html = `
                <div class="clinic-card">
                    <span class="clinic-number">CLINIC #${index + 1}</span>
                    <h4>${clinic.name}</h4>
                    <div class="clinic-details">
                        <div class="clinic-detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${clinic.location}</span>
                        </div>
                        <div class="clinic-detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                            <span class="detail-label">Capacity:</span>
                            <span class="detail-value">${clinic.capacity}</span>
                        </div>
                    </div>
                    <div class="clinic-vaccines">
                        ${vaccines}
                    </div>
                </div>`;
                listContainer.insertAdjacentHTML('beforeend', html);
            });
        }
    }

    // ── Function: Fetch Dashboard Stats (Organization) ──
    async function fetchDashboardStats() {
        // Fetch counts for each severity
        const severities = ['critical', 'high', 'moderate', 'low'];
        const stats = {};

        for (const severity of severities) {
            const { count, error } = await supabase
                .from('cases')
                .select('*', { count: 'exact', head: true })
                .eq('severity', severity);

            if (!error) stats[severity] = count;
        }

        // Update UI (Severity Cards)
        // Note: In a real app, we'd map these IDs dynamically. 
        // For this demo, we'll just log or update specific elements if they existed with IDs.
        // We will update the "Reported Cases" count in the hero or status section if applicable.

        // Example: Update total cases in outbreak status
        const totalCases = Object.values(stats).reduce((a, b) => a + b, 0);
        document.querySelectorAll('.outbreak-status p').forEach(p => {
            // updates all for demo purposes, or target specific areas if we had area data
            // p.textContent = `${totalCases} Reported Cases`; 
        });

        // Fetch prioritized cases for the list
        const { data: cases } = await supabase
            .from('cases')
            .select('*')
            .order('severity', { ascending: false }) // severe first
            .limit(5);

        const casesList = document.querySelector('.cases-list');
        if (casesList && cases) {
            casesList.innerHTML = '';
            cases.forEach(c => {
                const badgeClass = c.severity === 'critical' ? 'critical' : (c.severity === 'high' ? 'high' : 'moderate');
                const html = `
                <div class="case-item">
                    <div class="case-info">
                        <h5>${c.location} — ${c.disease}</h5>
                        <p>${c.description || 'No description'}</p>
                    </div>
                    <div class="case-meta">
                        <span class="case-severity-tag ${badgeClass}">${c.severity.toUpperCase()}</span>
                    </div>
                </div>`;
                casesList.insertAdjacentHTML('beforeend', html);
            });
        }
    }

    // ── Function: Fetch Service Requests (Organization) ──
    async function fetchServiceRequests() {
        const list = document.getElementById('serviceRequestsList');
        if (!list) return;

        // Realtime subscription
        supabase.channel('public:service_requests')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, payload => {
                showToast('New Service Request Received!');
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
                <h5>${req.service_type} Request</h5>
                <p>${req.location} — ${req.status}</p>
                <span class="request-time">${timeAgo}</span>
            </div>
            ${isNew ? '<span class="new-badge">NEW</span>' : ''}
        </div>`;

        if (isNew) {
            container.insertAdjacentHTML('afterbegin', html);
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }
    }

    // ── Function: Fetch Assigned Clinics (Organization) ──
    async function fetchAssignedClinics() {
        // Fetch from assignments table
    }

    // ── 2. Role-Based Element Visibility ──
    document.querySelectorAll('[data-role]').forEach(el => {
        if (el.getAttribute('data-role') !== role) {
            el.style.display = 'none';
        }
    });

    // ── 3. Organization-Specific UI Changes ──
    if (isOrg) {
        // Change "Services" to "Requested Services"
        const servicesLabel = document.getElementById('navServicesLabel');
        const servicesTitle = document.getElementById('servicesViewTitle');
        const navServicesBtn = document.getElementById('navServicesBtn');

        if (servicesLabel) servicesLabel.textContent = 'Requested Services';
        if (servicesTitle) servicesTitle.textContent = 'Requested Services';

        // Change the services nav target to requested-services view
        if (navServicesBtn) {
            navServicesBtn.setAttribute('data-target', 'view-requested-services');
            navServicesBtn.setAttribute('href', '#requested-services');
        }

        // Show notification badge for org
        const headerBadge = document.getElementById('headerNotifBadge');
        if (headerBadge) {
            headerBadge.style.display = 'flex';
            headerBadge.textContent = '3';
        }

        // Add notification badge to services nav
        const navNotif = document.createElement('span');
        navNotif.className = 'nav-notification';
        navNotif.textContent = '3';
        if (navServicesBtn) navServicesBtn.appendChild(navNotif);
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

    // ── 7. Assignation Modal ──
    const modal = document.getElementById('assignationModal');
    const btnRequestAssignation = document.getElementById('btnRequestAssignation');
    const assignationForm = document.getElementById('assignationForm');

    if (btnRequestAssignation && modal) {
        btnRequestAssignation.addEventListener('click', function () {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal on overlay click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Handle form submission
    if (assignationForm) {
        assignationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Collect form data
            const checkedAreas = [];
            document.querySelectorAll('input[name="target_areas"]:checked').forEach(cb => {
                checkedAreas.push(cb.value);
            });

            const supplies = document.getElementById('suppliesField').value;
            const deployDate = document.getElementById('deploymentDate').value;

            if (checkedAreas.length === 0) {
                alert('Please select at least one target area.');
                return;
            }

            if (!supplies.trim()) {
                alert('Please describe the supplies and offerings.');
                return;
            }

            if (!deployDate) {
                alert('Please select a deployment date.');
                return;
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('You must be logged in to assign a clinic.');
                return;
            }

            // Insert into Supabase
            const { error } = await supabase
                .from('assignments')
                .insert({
                    target_areas: checkedAreas,
                    supplies: supplies,
                    deployment_date: deployDate,
                    org_id: user.id,
                    status: 'pending'
                });

            if (error) {
                console.error('Error assigning clinic:', error);
                alert('Failed to submit request: ' + error.message);
                return;
            }

            // Close modal and show success
            closeModal();
            showToast('Request submitted successfully!');

            // Reset form
            assignationForm.reset();
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
                const serviceName = title.textContent;
                console.log('Requesting service:', serviceName);

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    showToast('Please login to request services');
                    return;
                }

                // Insert request
                const { error } = await supabase
                    .from('service_requests')
                    .insert({
                        service_type: serviceName,
                        location: 'Unknown Location', // In real app, get geolocation
                        requester_id: user.id,
                        status: 'pending'
                    });

                if (error) {
                    console.error('Error requesting service:', error);
                    showToast('Failed to send request');
                } else {
                    showToast(`${serviceName} request sent!`);
                }
            }
        });
    });

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

    // ── 13. Keyboard Shortcut: Escape to close modal ──
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
