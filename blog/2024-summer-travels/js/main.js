import { loadSection } from './loader.js';
import { carouselHelper, audioHelper } from './0.js';
import { audioEventListeners, getDecryptParams, anchorHandler, 
         menuHelper, setNarrationOffset } from './utils.js';

window.addEventListener('hashchange', anchorHandler);


// ==============================
// SECTION 0: INTRODUCTION
// ==============================
function setup0(post0LoadCB = () => null) { 
    // Load all media files for section 0
    let clickedStart = false;

    // Load section 0 content with 0 ms delay 
    loadSection('0', 0, () => {
        // Start DOM rendering
        window.inspectSTATE['intervals']['sliderAutoInterval'] = null;
        window.inspectSTATE['intervals']['hintInterval'] = null;

        // Setup image carousel
        carouselHelper();

        // Setup start button
        const startButton = document.querySelector('#start-button button');
        const alternateButton = setInterval(() => {
            startButton.classList.toggle('active');
        }, 500);

        setTimeout(() => {
            if (!clickedStart) {
                document.querySelector('#temporary-hint').classList.add('active');
            }
        }, 6000);

        startButton.onclick = () => {
            // If the user's trying to get to another page, do that first
            const hash = anchorHandler();

            // Update CSS transitions occurring
            clearInterval(alternateButton);
            startButton.classList.remove('active');
            startButton.classList.add('expanding');
            startButton.classList.add('fading');

            // Don't do anything if the user's trying to get to another page
            if (hash) return;

            clickedStart = true;
            document.querySelector('#temporary-hint').classList.remove('active');
            document.querySelector('#menu-bar').classList.remove('state-invisible');
            document.querySelector('#menu-bar').classList.add('state-collapsed');

            // Start narration audio 1s after start button is clicked
            setTimeout(() => audioHelper(), 1000);

            // Preload media for default next section, if no hash
            if (hash === '') loadSection('quebec', 30, () => null, true, false);
        }

        // Used to preload media for next section
        post0LoadCB();

    }, true, false);
}

document.addEventListener('DOMContentLoaded', () => {
    audioEventListeners();
    menuHelper();
    getDecryptParams();
    setup0();
});

// On resize, update narration offset
window.addEventListener('resize', setNarrationOffset);