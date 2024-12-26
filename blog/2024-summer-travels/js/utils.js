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

}

function mdSectionAudioEventListeners() {
    // onended event listener for narration player
    const narrationPlayer = document.querySelector('#narration-player');
    narrationPlayer.onended = () => {
        // Pause the player
        narrationPlayer.currentTime = 0;
        narrationPlayer.pause();
        // Reset the speed
        document.querySelector('#narration-controls .speed').textContent = '1x';
        narrationPlayer.playbackRate = 1;
        // Update the play/pause button
        document.querySelector('#narration-controls .play-pause svg.play').classList.add('active');
        document.querySelector('#narration-controls .play-pause svg.pause').classList.remove('active');
    };

    function playNext() {
        // If no valid songs, load more
        const otherKeys = Object.keys(window.inspectSTATE['playingMusic']['audio']);
        if (otherKeys.length === 0) {
            initPlayingMusic();
        }

        // Start playing next valid song
        else {
            const nextKey = otherKeys[0];
            audioTransition(
                false,  // isNarration
                URL.createObjectURL(window.inspectSTATE['playingMusic']['audio'][nextKey]), // src
                0.3,    // volume
                true,   // fadeIn
                false,  // fadeOut
                false,  // loop
                1       // speed
            );

            // Update the label
            const musicLabel = document.querySelector('#music-controls #music-label');
            musicLabel.dataset.title = nextKey.split('/').pop().split('.')[0];
            musicLabel.innerHTML = `Music: ${musicLabel.dataset.title}`;

            // Move the song to playedMusic
            window.inspectSTATE['playedMusic']['audio'][nextKey] = 
                window.inspectSTATE['playingMusic']['audio'][nextKey];
            delete window.inspectSTATE['playingMusic']['audio'][nextKey];
        }
    }

    // Need an onended event listener for music player
    const musicPlayer = document.querySelector('#music-player');
    musicPlayer.onended = () => {
        // Move current song to playedMusic
        const currentTitle = document.querySelector('#music-controls #music-label').dataset.title;
        const key = `/blog/2024-summer-travels/music/${currentTitle}.mp3`;
        window.inspectSTATE['playedMusic']['audio'][key] = 
            window.inspectSTATE['playingMusic']['audio'][key];
        delete window.inspectSTATE['playingMusic']['audio'][key];

        playNext();
    }

    // Need to setup music skip button onclick, ariaDisabled.
    const musicSkip = document.querySelector('#music-controls .skip');
    musicSkip.ariaDisabled = false;
    musicSkip.classList.remove('disabled');
    musicSkip.onclick = () => {
        if (window.inspectSTATE['flags']['musicSkip']) {
            window.inspectSTATE['flags']['musicSkip'] = false;
            playNext();
            // Debounce double clicks
            setTimeout(() => window.inspectSTATE['flags']['musicSkip'] = true, 500);
        } else return;
    };
}

// Credit: bryc https://stackoverflow.com/a/47593316/9179875
function splitmix32(a) {
    return function() {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}

async function initPlayingMusic() {
    const prng = splitmix32(new Date().getTime())

    function startFirstSong(randomURL) {
        // Start playing first song
        audioTransition(
            false,  // isNarration
            URL.createObjectURL(window.inspectSTATE['playingMusic']['audio'][randomURL]), // src
            0.2,    // volume
            true,   // fadeIn
            false,  // fadeOut
            false,  // loop
            1       // speed
        );

        // Update the label
        const musicLabel = document.querySelector('#music-controls #music-label');
        musicLabel.dataset.title = randomURL.split('/').pop().split('.')[0];
        musicLabel.innerHTML = `Music: ${musicLabel.dataset.title}`;

        // Update the play/pause button
        document.querySelector('#music-controls .play-pause svg.play').classList.remove('active');
        document.querySelector('#music-controls .play-pause svg.pause').classList.add('active');

        // Move the song to playedMusic
        window.inspectSTATE['playedMusic']['audio'][randomURL] = 
            window.inspectSTATE['playingMusic']['audio'][randomURL];
        delete window.inspectSTATE['playingMusic']['audio'][randomURL];
    }

    // Move 4 songs from STATE['unplayedMusic'] to STATE['playingMusic']
    const unplayedURLs = Object.keys(window.inspectSTATE['unplayedMusic']['audio']);
    let outOfSongs = false;
    
    for (let i = 0; i < 4; i++) {
        // Move the song
        const randomIndex = Math.floor(prng() * unplayedURLs.length);
        const randomURL = unplayedURLs[randomIndex];
        window.inspectSTATE['playingMusic']['audio'][randomURL] = 
            window.inspectSTATE['unplayedMusic']['audio'][randomURL];
        delete window.inspectSTATE['unplayedMusic']['audio'][randomURL];
        unplayedURLs.splice(randomIndex, 1);

        // Always preload first song
        if (i === 0) {
            // WARNING: need to set enableCache = true, but refreshCache should be false in production
            await loadSection('playingMusic', 0, () => null, true, true);

            // wait for prior transitions to finish before starting new ones
            if (
                window.inspectSTATE['intervals']['fadeOutInterval'] || window.inspectSTATE['intervals']['fadeInIntervals']
            ) {
                const localInterval = setInterval(() => {
                    if (
                        window.inspectSTATE['intervals']['fadeOutInterval'] || window.inspectSTATE['intervals']['fadeInIntervals']
                    ) return;

                    // Prior audio transition done, start new one.
                    else {
                        clearInterval(localInterval);
                        startFirstSong(randomURL);
                    }
                }, 100)
            } 

            // otherwise, just run the logic without polling
            else startFirstSong(randomURL); 
        }

        // error checking if out of unplayed songs
        if (unplayedURLs.length === 0) {
            outOfSongs = true;
            break;
        }
    }

    // If out of songs, move all songs back to unplayed
    if (outOfSongs) {
        for (let url in window.inspectSTATE['playedMusic']['audio']) {
            window.inspectSTATE['unplayedMusic']['audio'][url] = 
                window.inspectSTATE['playedMusic']['audio'][url];
            delete window.inspectSTATE['playedMusic']['audio'][url];
        }
    }

    // Lazy load the rest of the music
    // WARNING: need to set enableCache = true, but refreshCache should be false in production
    loadSection('playingMusic', 200, () => null, true, true);
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
    
    // Todo: currently, fadeOut OR fadeIn is supported. Not both at once.
    // Fade out current audio with sine function
    if (fadeOut) {
        const OGVolume = player.volume;
        let currentVolume = player.volume;
        slider.value = player.volume;
        let i = 0;

        window.inspectSTATE['intervals']['fadeOutInterval'] = setInterval(() => {
            if (currentVolume > 0.001) {
                currentVolume = OGVolume - (OGVolume * Math.sin(i) + 0.001);
                slider.value = currentVolume;
                player.volume = slider.value;
                i += 0.01;
            } else {
                clearInterval(window.inspectSTATE['intervals']['fadeOutInterval']);
                window.inspectSTATE['intervals']['fadeOutInterval'] = null;
            }
        }, 3);
        
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
        window.inspectSTATE['intervals']['fadeInIntervals'] = setInterval(() => {
            if (currentVolume < volume) {
                currentVolume = volume * Math.sin(i) + 0.001;
                player.volume = currentVolume;
                slider.value = player.volume;
                i += 0.01;
            } else {
                clearInterval(window.inspectSTATE['intervals']['fadeInIntervals']);
                window.inspectSTATE['intervals']['fadeInIntervals'] = null;
            }
        }, 3);
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

// Event handler for narration button click
function onNarrationClick(event) {
    const section = document.body.className.replace('section-md', '').trim().replace('section-', '');
    const button = event.target;
    const src = button.dataset.src;
    const title = src.split('/').pop().split('.')[0];

    // If already title already in the narration label, do nothing
    if (document.querySelector('#narration-controls #narration-label').dataset.title === title) return;

    function changeNarration() {
        // Update the label
        const narrationLabel = document.querySelector('#narration-controls #narration-label');
        narrationLabel.dataset.title = title;
        narrationLabel.innerHTML = `Narration: ${title}`;

        // Update the audio
        const narrationPlayer = document.querySelector('#narration-player');
        audioTransition(
            true,   // isNarration
            URL.createObjectURL(window.inspectSTATE[section]['audio'][src]), // src
            0.4,    // volume
            true,   // fadeIn
            // fade out if narration player isn't paused
            !narrationPlayer.paused, // fadeOut
            false,  // loop,
            1       // speed
        );

        // Update the play/pause button
        document.querySelector('#narration-controls .play-pause svg.play').classList.remove('active');
        document.querySelector('#narration-controls .play-pause svg.pause').classList.add('active');
    }

    // wait for prior transitions to finish before starting new ones
    if (
        window.inspectSTATE['intervals']['fadeOutInterval'] || window.inspectSTATE['intervals']['fadeInIntervals']
    ) {
        // Most recent click is the one that'll get played after polling ends
        if (window.inspectSTATE['intervals']['pollingNarrationInterval']) 
            clearInterval(window.inspectSTATE['intervals']['pollingNarrationInterval']);

        window.inspectSTATE['intervals']['pollingNarrationInterval'] = setInterval(() => {
            if (
                window.inspectSTATE['intervals']['fadeOutInterval'] || window.inspectSTATE['intervals']['fadeInIntervals']
            ) return;

            // Prior audio transition done, start new one.
            else {
                clearInterval(window.inspectSTATE['intervals']['pollingNarrationInterval']);
                window.inspectSTATE['intervals']['pollingNarrationInterval'] = null;
                changeNarration();
            }
        }, 100)
    }

    // No prior transition, just run the logic without polling
    else changeNarration();
}

// Build content from markdown
// Note: this function runs AFTER the STATE object has loaded all necessary 
// content AND AFTER the main content has been cleared
function buildContent(section) {
    // Clean up classes
    document.body.classList = '';
    document.body.classList.add(`section-${section}`); // added section-md later
    
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

    leftCol.classList.add('left-col');
    container.appendChild(leftCol);

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
    setTimeout(() => {
        const microphoneSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"/></svg>`;

        // Add decorative microphone icon and event handlers to narration buttons
        const narrationButtons = document.querySelectorAll('.section-md #main-body .narration-button');
        for (let button of narrationButtons) {
            const label = button.innerText;
            button.innerHTML = microphoneSVG + label;
            button.title = `Play narration`;
            button.onclick = onNarrationClick;
        }

        // Set --narration-button-offset CSS variable
        const column = document.querySelector('.section-md .left-col');
        const styles = window.getComputedStyle(column);

        // Calculate total width (column width + left margin + 60px padding)
        const totalWidth = column.offsetWidth + parseFloat(styles.marginLeft) + 60;

        // Update the CSS variable dynamically
        document.documentElement.style.setProperty('--narration-button-offset', `${totalWidth}px`);    
    }, 25);

    // Initing event handlers
    setTimeout(() => {
        imageEnlarger();
        mdSectionAudioEventListeners();
    }, 500);

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

    // Reset to play icon
    document.querySelector('#narration-controls .play-pause svg.play').classList.add('active');
    document.querySelector('#narration-controls .play-pause svg.pause').classList.remove('active');
    document.querySelector('#music-controls .play-pause svg.play').classList.add('active');
    document.querySelector('#music-controls .play-pause svg.pause').classList.remove('active');

    initPlayingMusic();
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