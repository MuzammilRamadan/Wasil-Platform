document.addEventListener('DOMContentLoaded', async function() {
    const tickerTrack = document.getElementById('tickerTrack');
    if (!tickerTrack) return;

    if (!window.supabase) {
        console.error('Supabase not initialized');
        return;
    }

    async function loadTicker() {
        try {
            const { data: cases, error } = await window.supabase
                .from('cases')
                .select('location, disease, severity')
                .in('severity', ['high', 'critical'])
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            if (!cases || cases.length === 0) {
                tickerTrack.innerHTML = `<span class="ticker-item"><span class="warn-icon">ℹ</span> <span data-i18n="landing.no_alerts">No active critical alerts.</span></span>`;
                return;
            }

            let html = '';
            
            function renderItem(c) {
                const area = c.location ? c.location.split(',')[0].trim() : 'Unknown';
                const disease = c.disease || 'Unknown';
                const severity = c.severity ? c.severity.toUpperCase() : 'UNKNOWN';
                
                // Try to translate area and disease
                const areaKey = `area.${area.toLowerCase().replace(/ /g, '_')}`;
                const translatedArea = t(areaKey) || area;
                const translatedDisease = typeof translateDisease === 'function' ? translateDisease(disease) : disease;
                
                let severityLabel = severity;
                if (localStorage.getItem('wasil_lang') === 'ar') {
                    if (severity === 'CRITICAL') severityLabel = 'خطر حرج';
                    if (severity === 'HIGH') severityLabel = 'خطر مرتفع';
                }
                
                return `<span class="ticker-item"><span class="warn-icon">⚠</span> <span>${translatedArea} — ${translatedDisease} (${severityLabel})</span></span>`;
            }

            cases.forEach(c => { html += renderItem(c); });
            // Duplicate for seamless loop
            cases.forEach(c => { html += renderItem(c); });

            tickerTrack.innerHTML = html;

        } catch (err) {
            console.error('Error loading ticker:', err);
            tickerTrack.innerHTML = `<span class="ticker-item"><span class="warn-icon">⚠</span> <span>Failed to load live alerts.</span></span>`;
        }
    }

    loadTicker();
    
    // Refresh ticker every 5 minutes
    setInterval(loadTicker, 5 * 60 * 1000);
});
