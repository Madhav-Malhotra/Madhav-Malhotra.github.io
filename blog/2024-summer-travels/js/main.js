import { loadSection, STATE } from './loader.js';

// Load all media files for section 0
loadSection('0', 0, () => {
    // Start DOM rendering
    console.log('Section 0 loaded');
    window.inspectSTATE = STATE;
}, true, false);