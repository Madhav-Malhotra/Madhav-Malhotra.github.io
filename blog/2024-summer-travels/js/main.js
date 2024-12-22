import { loadSection, STATE } from './loader.js';
import { menuHelper, carouselHelper, audioHelper } from './0.js';

// ==============================
// GENERAL CODE
// ==============================

// Setup audio controls
const sliders = document.querySelectorAll('.volume-slider');

for (let slider of sliders) {
    slider.addEventListener('input', function() {
        const value = this.value;
        this.style.setProperty('--value', `${value}%`);
    });
}

// Transition between sections
function clearMainContent(postTransitionCB = () => null) {
    // Add a transition mask
    const transitionMask = document.createElement('div');
    document.querySelector('#main-body').appendChild(transitionMask);
    transitionMask.classList.add('transition-mask');
    setTimeout(() => transitionMask.classList.add('hide'), 10);

    setTimeout(() => {
        // Get rid of the old content
        const toClear = document.querySelector('#main-body .container');
        toClear.innerHTML = '';

        // Clear any intervals
        for (let interval in STATE['intervals']) {
            clearInterval(STATE['intervals'][interval]);
            delete STATE['intervals'][interval];
        }

        // Load the new content
        postTransitionCB();

        // Remove the transition mask
        document.querySelector('.transition-mask').classList.remove('hide');
        setTimeout(() => document.querySelector('.transition-mask').remove(), 500);
    }, 6000);
}

// Get anchor URL event handler for section navigation
function anchorHandler() {
    const hash = window.location.hash.substring(1);
    
    if (hash === '') {
        console.log('No hash');
    } else console.log(`Navigating to section ${hash}`);

    return hash;
}

window.addEventListener('hashchange', anchorHandler);


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

document.addEventListener('DOMContentLoaded', () => setup0(() => {
    // Check if hash is set
    const hash = anchorHandler();
    
    // Preload media for default next section, if no hash
    // WARNING: need to set enableCache = true, but refreshCache should be false in production
    if (hash === '') loadSection('quebec', 50, () => null, true, true);
}));