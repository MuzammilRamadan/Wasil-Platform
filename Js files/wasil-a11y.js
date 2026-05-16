// ============================================
//  wasil — Accessibility (a11y) Utilities
// ============================================
// Provides: focus trap, modal ARIA helpers,
// keyboard navigation, and live-region announcements.
// ============================================

'use strict';

// ── Focusable element selector ──
const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details > summary'
].join(', ');

/**
 * FocusTrap — traps keyboard focus inside a modal/dialog.
 * Usage:
 *   const trap = new FocusTrap(modalElement);
 *   trap.activate();   // when opening
 *   trap.deactivate(); // when closing
 */
class FocusTrap {
    constructor(container) {
        this.container = container;
        this._lastFocused = null;
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    activate() {
        this._lastFocused = document.activeElement;
        this.container.addEventListener('keydown', this._handleKeyDown);

        // Move focus to first focusable element inside the container
        const focusables = this._getFocusables();
        if (focusables.length > 0) {
            focusables[0].focus();
        } else {
            // If no focusable child, make the container itself focusable
            this.container.setAttribute('tabindex', '-1');
            this.container.focus();
        }
    }

    deactivate() {
        this.container.removeEventListener('keydown', this._handleKeyDown);
        // Restore focus to the element that was active before the modal opened
        if (this._lastFocused && typeof this._lastFocused.focus === 'function') {
            this._lastFocused.focus();
        }
    }

    _getFocusables() {
        return Array.from(this.container.querySelectorAll(FOCUSABLE_SELECTORS))
            .filter(el => !el.closest('[hidden]') && getComputedStyle(el).display !== 'none');
    }

    _handleKeyDown(e) {
        if (e.key !== 'Tab') return;

        const focusables = this._getFocusables();
        if (focusables.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
            // Shift+Tab — going backwards
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab — going forwards
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
}

/**
 * openModal — opens a modal overlay with full ARIA support.
 * @param {HTMLElement} overlay — the outer .modal-overlay element
 * @param {FocusTrap}   trap    — an associated FocusTrap instance
 */
function openModal(overlay, trap) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('aria-hidden-main', 'true'); // informational
    trap.activate();
}

/**
 * closeModal — closes a modal overlay with ARIA cleanup.
 * @param {HTMLElement} overlay
 * @param {FocusTrap}   trap
 */
function closeModal(overlay, trap) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    trap.deactivate();
}

/**
 * bindEscapeKey — closes any active modal when Escape is pressed.
 * @param {Function} closeFn — the close function to call
 * @returns {Function} — the listener, so you can removeEventListener later
 */
function bindEscapeKey(closeFn) {
    function onKeyDown(e) {
        if (e.key === 'Escape') closeFn();
    }
    document.addEventListener('keydown', onKeyDown);
    return onKeyDown;
}

/**
 * announce — sends a live-region announcement.
 * Used for screen-reader-only messages (toasts, state changes).
 * @param {string}  message   — the message to announce
 * @param {'polite'|'assertive'} priority
 */
function announce(message, priority = 'polite') {
    let region = document.getElementById('wasil-live-region');
    if (!region) {
        region = document.createElement('div');
        region.id = 'wasil-live-region';
        region.setAttribute('aria-live', priority);
        region.setAttribute('aria-atomic', 'true');
        region.setAttribute('role', 'status');
        // Visually hidden but readable by screen readers
        Object.assign(region.style, {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: '0'
        });
        document.body.appendChild(region);
    }

    // Toggling content triggers screen reader re-read
    region.setAttribute('aria-live', priority);
    region.textContent = '';
    // Small delay ensures the DOM mutation is picked up
    requestAnimationFrame(() => {
        region.textContent = message;
    });
}

// ── Export to global window scope for use across pages ──
window.wasilA11y = {
    FocusTrap,
    openModal,
    closeModal,
    bindEscapeKey,
    announce
};

