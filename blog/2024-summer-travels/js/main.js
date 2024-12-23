import { loadSection, STATE } from './loader.js';
import { carouselHelper, audioHelper } from './0.js';

// ==============================
// GENERAL CODE
// ==============================

// Setup audio controls
function audioEventListeners() {
    // Setup volume event listeners
    const sliders = document.querySelectorAll('.volume-slider');

    for (let slider of sliders) {
        slider.addEventListener('input', function() {
            const value = this.value;
            this.style.setProperty('--value', `${value}%`);
        });
    }
    
    // Setup narration event listeners
    const narrationPlayer = document.querySelector('#narration-player');
    const narrationSlider = document.querySelector('#narration-controls .volume-slider');
    const narrationPause = document.querySelector('#narration-controls .play-pause');
    const narrationSpeed = document.querySelector('#narration-controls .speed');
    
    narrationSlider.addEventListener('input', function() {
        narrationPlayer.volume = this.value;
    });
    narrationPause.onclick = () => {
        const title = document.querySelector('#narration-label').dataset.title;
        if (narrationPlayer.paused) {
            narrationPlayer.play();
            document.querySelector('#narration-controls #narration-label').innerHTML =
                `Narration playing: ${title}`;
        }
        else {
            narrationPlayer.pause();
            document.querySelector('#narration-controls #narration-label').innerHTML =
                `Narration paused: ${title}`;
        }
    };
    
    narrationSpeed.onclick = () => {
        if (narrationPlayer.playbackRate === 1) {
            narrationPlayer.playbackRate = 1.5;
            narrationSpeed.textContent = '1.5x';
        } else if (narrationPlayer.playbackRate === 1.5) {
            narrationPlayer.playbackRate = 2;
            narrationSpeed.textContent = '2x';
        } else if (narrationPlayer.playbackRate === 2) {
            narrationPlayer.playbackRate = 2.5;
            narrationSpeed.textContent = '2.5x';
        } else if (narrationPlayer.playbackRate === 2.5) {
            narrationPlayer.playbackRate = 3;
            narrationSpeed.textContent = '3x';
        } else if (narrationPlayer.playbackRate === 3) {
            narrationPlayer.playbackRate = 1;
            narrationSpeed.textContent = '1x';
        }
    };

    // Setup music event listeners
    // Setup event listeners
    const musicPlayer = document.querySelector('#music-player');
    const musicSlider = document.querySelector('#music-controls .volume-slider');
    const musicPause = document.querySelector('#music-controls .play-pause');
    
    musicSlider.addEventListener('input', function() {
        musicPlayer.volume = this.value;
    });
    musicPause.onclick = () => {
        if (musicPlayer.paused) {
            musicPlayer.play();
            document.querySelector('#music-controls #music-label').innerHTML =
                "Music playing: Xinjiang by Zimpzon";
        }
        else {
            musicPlayer.pause();
            document.querySelector('#music-controls #music-label').innerHTML =
                "Music paused: Xinjiang by Zimpzon";
        }
    };

    // Todo: Add skip functionality
    const musicSkip = document.querySelector('#music-controls .skip');
}

// Allow people to click on images to make them larger.
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

function clearAllIntervals() {
    for (let interval in STATE['intervals']) {
        clearInterval(STATE['intervals'][interval]);
        delete STATE['intervals'][interval];
    }
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

        clearAllIntervals();

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

    console.log('Started parsing markdown');
    leftCol.innerHTML = marked.parse(md);

    // Prep other DOM elements
    document.body.classList.add('section-md');
    setTimeout(() => imageEnlarger(), 1000);

    // Todo: Unlock the audio bar, unlock the menu bar, get rid of the hint
    document.querySelector('#menu-bar').classList = '';
    document.querySelector('#menu-bar').classList.add('state-collapsed');
    document.querySelector('#audio-controls').classList.add('active');
    document.querySelector('#narration-controls').classList.add('active');
    document.querySelector('#music-controls').classList.add('active');

    document.querySelector('#narration-controls #narration-label').innerHTML = 
        "No narration selected.";
    
    
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
            console.log('Started building new content');
            buildContent(hash);
        }, true, true);
    });

    return hash;
}

// Sets up menu bar
function menuHelper() {    
    // Setup event listeners
    let toExpanded, toCollapsed;

    toExpanded = () => {
        const menu = document.querySelector('#menu-bar');
        const exit = document.querySelector('#menu-bar .exit');

        // Update menu to next state based on current state
        if (menu.classList.contains('state-collapsed')) {
            // CSS animation
            menu.classList.remove('state-collapsed');
            menu.classList.add('state-expand-vert');

            // If intervals still active, clear them - user has clicked on menu
            if (window.inspectSTATE['intervals']['hintInterval']) {
                clearInterval(window.inspectSTATE['intervals']['hintInterval']);
                window.inspectSTATE['intervals']['hintInterval'] = null;
            }
            if (window.inspectSTATE['intervals']['sliderAutoInterval']) {
                clearInterval(window.inspectSTATE['intervals']['sliderAutoInterval']);
                window.inspectSTATE['intervals']['sliderAutoInterval'] = null;
            }

            setTimeout(() => {
                menu.classList.remove('state-expand-vert');
                menu.classList.add('state-expand-horiz');
            }, 500);
            setTimeout(() => {
                // Unregister event listener after transition
                menu.onclick = () => null;
                // Register toCollapsed event listener
                exit.onclick = toCollapsed;
            }, 1000);
        }
    };

    toCollapsed = () => {
        const menu = document.querySelector('#menu-bar');
        const exit = document.querySelector('#menu-bar .exit');

        // CSS animation
        menu.classList.remove('state-expand-horiz');
        menu.classList.add('state-expand-vert');
        setTimeout(() => {
            menu.classList.remove('state-expand-vert');
            menu.classList.add('state-collapsed');
        }, 500);
        setTimeout(() => {
            // Unregister event listener after transition
            exit.onclick = () => null;
            // Register toExpanded event listener
            menu.onclick = toExpanded;
        }, 1000);
    }

    document.querySelector('#menu-bar').onclick = toExpanded;
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
            // If the user's trying to get to another page, do that first
            const hash = anchorHandler();

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

            // Preload media for default next section, if no hash
            // WARNING: need to set enableCache = true, but refreshCache should be false in production
            if (hash === '') loadSection('quebec', 30, () => null, true, true);
        }

        // Used to preload media for next section
        post0LoadCB();

    // WARNING: need to set enableCache = true, but refreshCache should be false in production
    }, true, true);
}

document.addEventListener('DOMContentLoaded', () => {
    audioEventListeners();
    menuHelper(STATE);
    setup0();
});