import { audioTransition } from './utils.js';

// Sets up image carousel
function carouselHelper() {
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
    for (let url in window.inspectSTATE['0']['img']) {
        // Skip existing item
        if (url.includes('campbell-river')) continue;
        if (!window.inspectSTATE['0']['img'].hasOwnProperty(url)) continue;
        
        // Assemble slide
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.id = `slide-${id}`;

        const img = document.createElement('img');
        img.src = URL.createObjectURL(window.inspectSTATE['0']['img'][url]);
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
            
            // Don't do anything if the clicked slide is already active
            if (currentSlide.id === `slide-${num}`) return;

            // Make new slide active
            document.querySelector(`#slide-${num}`).classList.add('active');
            // Fade out current slide via CSS transition
            currentSlide.classList.remove('active');
            currentSlide.classList.add('fade-out');

            // Make new switch active
            const currentToggle = document.querySelector('.switch.active');
            currentToggle.classList.remove('active');
            toggle.classList.add('active');

            // Cleanup fade-out transition
            setTimeout(() => currentSlide.classList.remove('fade-out'), 1000);
        };
    });

    // Autoplay every 15 seconds
    window.inspectSTATE['intervals']['sliderAutoInterval'] = setInterval(() => {
        const currentSlide = document.querySelector('.slide.active');
        let num = parseInt(currentSlide.id.split('-')[1]);
        num = num === 7 ? 1 : num + 1;

        // Click on the next switch
        const nextSwitch = document.querySelector(`.switch[data-num="${num}"]`);
        nextSwitch.click();
        nextSwitch.focus();
    }, 15000);
}

// Sets up narration audio and then music audio
function audioHelper() {
    // Update what's visible
    document.querySelector('#temporary-hint').style.display = 'none';
    const startButton = document.querySelector('#start-button button');
    if (startButton) startButton.style.display = 'none';
    document.querySelector('#audio-controls').classList.add('active');

    // Start playing narration
    document.querySelector('#narration-controls').classList.add('active');

    audioTransition(
        true, // isNarration
        URL.createObjectURL(window.inspectSTATE['0']['audio']['/blog/2024-summer-travels/audio/0/Housekeeping (45s).mp3']),
        1,  // finalVolume
        true  // fadeIn
    );

    // Setup music controls
    const musicSkip = document.querySelector('#music-controls .skip');
    musicSkip.classList.add('disabled');
    musicSkip.ariaDisabled = true;

    const narrationPlayer = document.querySelector('#narration-player');
    narrationPlayer.onended = () => {
        document.querySelector('#narration-controls .speed').textContent = '1x';
        narrationPlayer.playbackRate = 1;
        narrationPlayer.currentTime = 0;
        narrationPlayer.pause();
        document.querySelector('#narration-controls .play-pause svg.play').classList.add('active');
        document.querySelector('#narration-controls .play-pause svg.pause').classList.remove('active');

        audioTransition(
            false, // isNarration
            URL.createObjectURL(window.inspectSTATE['0']['audio']['/blog/2024-summer-travels/audio/0/Xinjiang by Zimpzon.mp3']),
            0.3,  // finalVolume
            true  // fadeIn
        )

        document.querySelector('#music-controls').classList.add('active');

        // Also add hint to click on menu button
        window.inspectSTATE['intervals']['hintInterval'] = setInterval(() => {
            const menuBar = document.querySelector('#menu-bar');
            if (menuBar.classList.contains('state-collapsed')) {
                // offset the rest of the logic so it doesn't happen RIGHT as 
                // photos change. Less distracting.
                setTimeout(() => {
                    menuBar.classList.add('highlight');
                    setTimeout(() => menuBar.classList.remove('highlight'), 500);
                    setTimeout(() => menuBar.classList.add('highlight'), 1100);
                    setTimeout(() => menuBar.classList.remove('highlight'), 1600);
                    setTimeout(() => menuBar.classList.add('highlight'), 2200);
                    setTimeout(() => menuBar.classList.remove('highlight'), 2700);
                }, 2000);
            }
        }, 15000);

        // Unregister event listener
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
    }
}

export { carouselHelper, audioHelper };