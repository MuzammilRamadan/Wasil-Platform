// SUPABASE CONFIGURATION
const SUPABASE_URL = 'https://vuzcmbfzgxbtpvceyigf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1emNtYmZ6Z3hidHB2Y2V5aWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjYwODUsImV4cCI6MjA4NjgwMjA4NX0.GQQeIx0CPNpUzyjFrz4E0EsfxoCEHvt_-gQvVOwllfY';

// Initialize Supabase Client
// Expose globally so all page scripts (wasil-signup.js, wasil-login.js, etc.) can use it
if (window.supabase && window.supabase.createClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    // Alias as 'supabase' globally so existing code works without changes
    window.supabase = window.supabaseClient;
    console.log('Supabase Client Initialized ✓');
} else {
    console.error('Supabase SDK not loaded! Make sure the CDN script is included before this file.');
}
