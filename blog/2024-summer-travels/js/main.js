import { loadSection, STATE } from './loader.js';
import { menuHelper, carouselHelper, audioHelper } from './0.js';

// Setup audio controls
const sliders = document.querySelectorAll('.volume-slider');

for (let slider of sliders) {
    slider.addEventListener('input', function() {
        const value = this.value;
        this.style.setProperty('--value', `${value}%`);
    });
}

// ==============================
// SECTION 0: INTRODUCTION
// ==============================
let sliderAutoInterval, hintInterval;

function setup0(post0LoadCB = () => null) { 
    // Load all media files for section 0
    let clickedStart = false;

    // Load section 0 content with 0 ms delay 
    loadSection('0', 0, () => {
        // Start DOM rendering
        window.inspectSTATE = STATE;
        window.inspectSTATE['intervals']['sliderAutoInterval'] = sliderAutoInterval;
        window.inspectSTATE['intervals']['hintInterval'] = hintInterval;
        
        // Setup menu bar
        menuHelper(STATE);

        // Setup image carousel
        carouselHelper(STATE);

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
            // Update CSS transitions occurring
            clearInterval(alternateButton);
            startButton.classList.remove('active');
            startButton.classList.add('expanding');
            startButton.classList.add('fading');

            clickedStart = true;
            document.querySelector('#temporary-hint').classList.remove('active');
            document.querySelector('#menu-bar').classList.remove('state-invisible');
            document.querySelector('#menu-bar').classList.add('state-collapsed');

            // Start narration audio 1s after start button is clicked
            setTimeout(() => {
                audioHelper(STATE);
            }, 1000);
        }

        // Used to preload media for next section
        post0LoadCB();

    // WARNING: need to set enableCache = true, but refreshCache should be false in production
    }, true, true);
}

document.addEventListener('DOMContentLoaded', () => setup0());