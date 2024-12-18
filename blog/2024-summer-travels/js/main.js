import { loadSection, STATE } from './loader.js';

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

// Sets up image carousel
function carouselHelper(STATE) {
    // Get data for image carousel
    const carousel = document.querySelector('#image-carousel');
    const controls = document.querySelector('#carousel-controls');
    const CAPTIONS = {
        '/blog/2024-summer-travels/img/0/banff-mountain.webp': 'Mountain in Banff National Park, Alberta',
        '/blog/2024-summer-travels/img/0/jasper-lake-2.webp': 'Beauvert Lake in Jasper, Alberta',
        '/blog/2024-summer-travels/img/0/campbell-river-dock.webp': 'Dock near Campbell River, British Columbia',
        '/blog/2024-summer-travels/img/0/sunset-beach-vancouver.webp': 'Sunset at Tower Beach, Vancouver',
        '/blog/2024-summer-travels/img/0/train-kamloops.webp': 'Train in badlands near Kamloops, British Columbia',
        '/blog/2024-summer-travels/img/0/train-winnipeg.webp': 'Train riding into sunset near Winnipeg, Manitoba',
        '/blog/2024-summer-travels/img/0/ubc-rose-garden-vancouver.webp': 'Rose garden at University of British Columbia, Vancouver'
    }

    let id = 2;
    for (let url in STATE['0']['img']) {
        // Skip existing item
        if (url.includes('campbell-river')) continue;
        if (!STATE['0']['img'].hasOwnProperty(url)) continue;
        
        // Assemble slide
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.id = `slide-${id}`;

        const img = document.createElement('img');
        img.src = URL.createObjectURL(STATE['0']['img'][url]);
        img.alt = CAPTIONS[url];

        const caption = document.createElement('p');
        caption.textContent = CAPTIONS[url];
        caption.classList.add('image-caption');

        slide.appendChild(img);
        slide.appendChild(caption);
        carousel.appendChild(slide);

        // Assemble control
        const toggle = document.createElement('button');
        toggle.classList.add('switch');
        toggle.dataset.num = id;
        controls.appendChild(toggle);

        ++id;
    }

    // Setup controls event listener
    document.querySelectorAll('.switch').forEach((toggle) => {
        toggle.onclick = () => {
            // Get number of slide clicked on
            const num = toggle.dataset.num;
            // Get current active slide
            const currentSlide = document.querySelector('.slide.active');

            // Make new slide active
            document.querySelector(`#slide-${num}`).classList.add('active');
            // Fade out current slide via CSS transition
            currentSlide.classList.remove('active');
            currentSlide.classList.add('fade-out');
            setTimeout(() => currentSlide.classList.remove('fade-out'), 1000);
            // Make new switch active
            toggle.classList.add('active');
        };
    });
}

// Sets up narration audio and then music audio
function audioHelper(STATE) {
    // Update what's visible
    document.querySelector('#temporary-hint').style.display = 'none';
    document.querySelector('#start-button button').style.display = 'none';
    document.querySelector('#audio-controls').classList.add('active');

    // Start playing narration
    document.querySelector('#narration-controls').classList.add('active');
    document.querySelector('#narration-controls #narration-label').innerHTML = 
        "Narration Playing: Housekeeping (45s)";

    const narrationPlayer = document.querySelector('#narration-player');
    narrationPlayer.src = URL.createObjectURL(STATE['0']['audio']['/blog/2024-summer-travels/audio/0/Housekeeping (45s).mp3']);
    narrationPlayer.loop = false;
    narrationPlayer.volume = 0;
    narrationPlayer.load();
    narrationPlayer.play();

    // Fade in volume slider
    const narrationVolume = document.querySelector('#narration-controls .volume-slider');
    let i = 0;

    const increaseNarrationVolume = setInterval(() => {
        narrationVolume.value = Math.sin(i)/2 + 0.001;
        narrationPlayer.volume = narrationVolume.value;
        i += 0.01;
        if (narrationVolume.value >= 0.5) {
            clearInterval(increaseNarrationVolume);
            narrationPlayer.volume = 0.5;
        }
    }, 10);

    // Setup event listeners
    const narrationSlider = document.querySelector('#narration-controls .volume-slider');
    const narrationPause = document.querySelector('#narration-controls .play-pause');
    const narrationSpeed = document.querySelector('#narration-controls .speed');
    
    narrationSlider.addEventListener('input', function() {
        narrationPlayer.volume = this.value;
    });
    narrationPause.onclick = () => {
        if (narrationPlayer.paused) {
            narrationPlayer.play();
            document.querySelector('#narration-controls #narration-label').innerHTML =
                "Narration Playing: Housekeeping (45s)";
        }
        else {
            narrationPlayer.pause();
            document.querySelector('#narration-controls #narration-label').innerHTML =
                "Narration Paused: Housekeeping (45s)";
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

    // Setup music controls
    const musicPlayer = document.querySelector('#music-player');
    musicPlayer.src = URL.createObjectURL(STATE['0']['audio']['/blog/2024-summer-travels/audio/0/Xinjiang by Zimpzon.mp3']);
    musicPlayer.volume = 0.5;
    musicPlayer.load();

    // Setup event listeners
    const musicSlider = document.querySelector('#music-controls .volume-slider');
    const musicPause = document.querySelector('#music-controls .play-pause');
    const musicSkip = document.querySelector('#music-controls .skip');
    
    musicSlider.addEventListener('input', function() {
        musicPlayer.volume = this.value;
    });
    musicPause.onclick = () => {
        if (musicPlayer.paused) {
            musicPlayer.play();
            document.querySelector('#music-controls #music-label').innerHTML =
                "Music Playing: Xinjiang by Zimpzon";
        }
        else {
            musicPlayer.pause();
            document.querySelector('#music-controls #music-label').innerHTML =
                "Music Paused: Xinjiang by Zimpzon";
        }
    };

    musicSkip.classList.add('disabled');
    musicSkip.ariaDisabled = true;

    // Fade in music when the narration is done
    function fadeInMusic() {
        const musicVolume = document.querySelector('#music-controls .volume-slider');
        document.querySelector('#music-controls').classList.add('active');
        musicPlayer.loop = true;
        musicPlayer.play();

        let i = 0;

        const increaseMusicVolume = setInterval(() => {
            musicVolume.value = Math.sin(i)/2 + 0.001;
            i += 0.005;
            if (musicVolume.value >= 0.5) clearInterval(increaseMusicVolume);
        }, 10);
    }

    narrationPlayer.onended = () => {
        document.querySelector('#narration-controls .play-pause').textContent = 'Play';
        document.querySelector('#narration-controls .speed').textContent = '1x';
        narrationPlayer.currentTime = 0;
        narrationPlayer.pause();
        document.querySelector('#narration-controls #narration-label').innerHTML =
            "Narration Stopped: Housekeeping (45s)";

        fadeInMusic();
    }
}

function setup0() {
    // Load all media files for section 0
    let clickedStart = false;

    // Load section 0 content with 0 ms delay 
    loadSection('0', 0, () => {
        // Start DOM rendering
        window.inspectSTATE = STATE;

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

            // Start narration audio 1s after start button is clicked
            setTimeout(() => {
                audioHelper(STATE);
            }, 1000);
        }

    // WARNING: need to set enableCache = true, but refreshCache should be false in production
    }, true, true);
}

document.addEventListener('DOMContentLoaded', setup0);