import { loadSection } from './loader.js';

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
        if (narrationPlayer.paused) {
            narrationPlayer.play();
            document.querySelector('#narration-controls .play-pause svg.play').classList.remove('active');
            document.querySelector('#narration-controls .play-pause svg.pause').classList.add('active');
        }
        else {
            narrationPlayer.pause();
            document.querySelector('#narration-controls .play-pause svg.play').classList.add('active');
            document.querySelector('#narration-controls .play-pause svg.pause').classList.remove('active');
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
            document.querySelector('#music-controls .play-pause svg.play').classList.remove('active');
            document.querySelector('#music-controls .play-pause svg.pause').classList.add('active');
        }
        else {
            musicPlayer.pause();
            document.querySelector('#music-controls .play-pause svg.play').classList.add('active');
            document.querySelector('#music-controls .play-pause svg.pause').classList.remove('active');
        }
    };

    // Todo: Add skip functionality
    const musicSkip = document.querySelector('#music-controls .skip');
}

// Audio transitions
// Note: if using to simply transition volume without changing audio source, 
// set fadeOut = false and src = null. fadeIn will control smooth vs instant 
// volume change.
// Alternatively, if using to just stop audio playing, set src = ''.
function audioTransition(narrationPlayer, src, volume, fadeIn = false, fadeOut = false, loop = false, speed = null) {
    // Select the right player
    let player, slider;
    if (narrationPlayer) {
        player = document.querySelector('#narration-player');
        slider = document.querySelector('#narration-controls .volume-slider');
        if (speed) document.querySelector('#narration-controls .speed').textContent = `${speed}x`;
    } else {
        player = document.querySelector('#music-player');
        slider = document.querySelector('#music-controls .volume-slider');
    }
    
    // Fade out current audio with sine function
    if (fadeOut) {
        const OGVolume = player.volume;
        let currentVolume = player.volume;
        slider.value = player.volume;
        let i = 0;

        const fadeOutInterval = setInterval(() => {
            if (currentVolume > 0.001) {
                currentVolume = OGVolume - (OGVolume * Math.sin(i) + 0.001);
                slider.value = currentVolume;
                player.volume = slider.value;
                i += 0.01;
            } else {
                clearInterval(fadeOutInterval);
            }
        }, 10);
        
        player.volume = 0;
        slider.value = 0;
    }

    // Change audio source and start playing new audio, if necessary
    if (src) {
        player.src = src;
        if (src !== '') {
            player.load();
            player.volume = 0;
            player.play();
        }
    }

    // Fade in new audio with sine function, if necessary
    if (fadeIn) {
        let i = 0;
        let currentVolume = player.volume;
        const fadeInInterval = setInterval(() => {
            if (currentVolume < volume) {
                currentVolume = volume * Math.sin(i) + 0.001;
                player.volume = currentVolume;
                slider.value = player.volume;
                i += 0.01;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 10);
    }

    // Update settings
    player.volume = volume;
    slider.value = volume;
    player.loop = loop;
    if (speed) player.playbackRate = speed;
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
    for (let interval in window.inspectSTATE['intervals']) {
        clearInterval(window.inspectSTATE['intervals'][interval]);
        delete window.inspectSTATE['intervals'][interval];
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
    let md = window.inspectSTATE[section]['md'];
    const container = document.querySelector('#main-body .container');
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');

    leftCol.classList.add('left-col');
    rightCol.classList.add('right-col');
    container.appendChild(leftCol);
    container.appendChild(rightCol);

    // Clean the markdown by replacing image URLs with object URLs + trimming whitespace
    for (let url in window.inspectSTATE[section]['img']) {
        if (window.inspectSTATE[section]['img'][url] === null) {
            console.error('Image not loaded:', url);
            continue;
        }
        const objURL = URL.createObjectURL(window.inspectSTATE[section]['img'][url]);
        md = md.replace(url, objURL);
    }

    md = md.split('\n').map(line => line.trimStart()).join('\n');

    console.log('Started parsing markdown');
    leftCol.innerHTML = marked.parse(md);

    // Prep other DOM elements
    document.body.classList.add('section-md');
    setTimeout(() => imageEnlarger(), 1000);

    // Todo: get rid of the hint
    document.querySelector('#temporary-hint').classList.remove('active');

    // Unlock the menu bar, ensure its handlers work properly
    document.querySelector('#menu-bar').classList = '';
    document.querySelector('#menu-bar').classList.add('state-collapsed');
    menuHelper();

    // Unlock the audio controls
    document.querySelector('#audio-controls').classList.add('active');
    document.querySelector('#narration-controls').classList.add('active');
    document.querySelector('#music-controls').classList.add('active');

    // Fadeout current audio
    audioTransition(
        true,   // isNarration
        '',     // src
        0,      // volume
        false,  // fadeIn
        true,   // fadeOut
        false,  // loop
        1       // speed
    );

    audioTransition(
        false,  // isNarration
        '',     // src
        0,      // volume
        false,  // fadeIn
        true    // fadeOut
    );

    // Reset labels
    document.querySelector('#narration-controls #narration-label').innerHTML = 
        "No narration selected.";
    document.querySelector('#music-controls #music-label').innerHTML =
        "No music selected.";

    // Reset to to play icon
    document.querySelector('#narration-controls .play-pause svg.play').classList.add('active');
    document.querySelector('#narration-controls .play-pause svg.pause').classList.remove('active');
    document.querySelector('#music-controls .play-pause svg.play').classList.add('active');
    document.querySelector('#music-controls .play-pause svg.pause').classList.remove('active');
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
    let toExpanded, toCollapsed;
    
    // Setup event listeners
    toExpanded = () => {
        console.log('Expanding menu');
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

export { audioEventListeners, audioTransition, imageEnlarger, clearAllIntervals, 
         clearMainContent, buildContent, anchorHandler, menuHelper };