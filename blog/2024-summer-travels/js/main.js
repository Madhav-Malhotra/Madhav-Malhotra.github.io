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

function imageEnlarger() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', () => {
        // Open the image in a new tab
        const src = img.getAttribute('src');
        window.open(src, '_blank');
        });
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
        setTimeout(() => {
            document.querySelector('.transition-mask').classList.remove('hide');
            setTimeout(() => document.querySelector('.transition-mask').remove(), 500);
        }, 500);
    }, 525);
}

// Build content from markdown
// Note: this function runs AFTER the STATE object has loaded all necessary 
// content AND AFTER the main content has been cleared
function buildContent(section) {
    // Clean up classes
    document.body.classList = '';
    document.body.classList.add(`section-${section}`);
    
    // Check for section 0 (special)
    if (section === '0') {
        setup0();
        return;
    }

    // Load markdown content for other sections
    // Start by setting up page structure
    let md = STATE[section]['md'];
    const container = document.querySelector('#main-body .container');
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');

    leftCol.classList.add('left-col');
    rightCol.classList.add('right-col');
    container.appendChild(leftCol);
    container.appendChild(rightCol);

    // Clean the markdown by replacing image URLs with object URLs + trimming whitespace
    for (let url in STATE[section]['img']) {
        if (STATE[section]['img'][url] === null) {
            console.error('Image not loaded:', url);
            continue;
        }
        const objURL = URL.createObjectURL(STATE[section]['img'][url]);
        md = md.replace(url, objURL);
    }

    md = md.split('\n').map(line => line.trimStart()).join('\n');

    console.log('Started parsing markdown: ', md);
    leftCol.innerHTML = marked.parse(md);

    document.body.classList.add('section-md');
    setTimeout(() => imageEnlarger(), 1000);
}

// Get anchor URL event handler for section navigation
function anchorHandler() {
    const hash = window.location.hash.substring(1);
    
    // Skip if empty hash
    if (hash === '') {
        return hash;
    }

    // Otherwise, load media for section in hash
    console.log('Started clearing main content');
    clearMainContent(() => {
        console.log('Started loading new content');
        // WARNING: need to set enableCache = true, but refreshCache should be false in production
        loadSection(hash, 0, () => {
            buildContent(hash);
            console.log('Started building new content');
        }, true, true);
    });

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
    if (hash === '') loadSection('quebec', 30, () => null, true, true);

    // If there is a hash, unlock the audio bar, unlock the menu bar, get rid of the hint,
    // and clear intervals
}));