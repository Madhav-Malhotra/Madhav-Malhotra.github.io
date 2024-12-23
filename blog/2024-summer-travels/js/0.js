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
function audioHelper(STATE) {
    // Update what's visible
    document.querySelector('#temporary-hint').style.display = 'none';
    const startButton = document.querySelector('#start-button button');
    if (startButton) startButton.style.display = 'none';
    document.querySelector('#audio-controls').classList.add('active');

    // Start playing narration
    document.querySelector('#narration-controls').classList.add('active');
    document.querySelector('#narration-controls #narration-label').innerHTML = 
        "Narration playing: Housekeeping (45s)";

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

    // Setup music controls
    const musicPlayer = document.querySelector('#music-player');
    musicPlayer.src = URL.createObjectURL(STATE['0']['audio']['/blog/2024-summer-travels/audio/0/Xinjiang by Zimpzon.mp3']);
    musicPlayer.volume = 0.3;
    musicPlayer.load();

    const musicSkip = document.querySelector('#music-controls .skip');

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
            if (musicVolume.value >= 0.3) clearInterval(increaseMusicVolume);
        }, 10);

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
    }

    narrationPlayer.onended = () => {
        document.querySelector('#narration-controls .speed').textContent = '1x';
        narrationPlayer.currentTime = 0;
        narrationPlayer.pause();
        document.querySelector('#narration-controls #narration-label').innerHTML =
            "Narration stopped: Housekeeping (45s)";

        fadeInMusic();
    }
}

export { carouselHelper, audioHelper };