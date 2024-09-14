import { loadSection, STATE } from './loader.js';

const sliders = document.querySelectorAll('.volume-slider');

for (let slider of sliders) {
    slider.addEventListener('input', function() {
        const value = this.value;
        this.style.setProperty('--value', `${value}%`);
    });
}

function setup0() {
    // Load all media files for section 0
    let clickedStart = false;

    loadSection('0', 0, () => {
        // Start DOM rendering
        window.inspectSTATE = STATE;

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
                const num = toggle.dataset.num;
                const currentSlide = document.querySelector('.slide.active');

                document.querySelector(`#slide-${num}`).classList.add('active');
                setTimeout(() => currentSlide.classList.remove('active'), 550);
                document.querySelector('.switch.active').classList.remove('active');
                toggle.classList.add('active');
            };
        });

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
            const hint = document.querySelector('#temporary-hint');
            hint.classList.remove('active');

            // Start narration audio
            setTimeout(() => {
                // Update what's visible
                hint.style.display = 'none';
                startButton.style.display = 'none';
                document.querySelector('#audio-controls').classList.add('active');

                // Start playing music
                document.querySelector('#music-controls').classList.add('active');
                const musicPlayer = document.querySelector('#music-player');
                musicPlayer.src = URL.createObjectURL(STATE['0']['audio']['/blog/2024-summer-travels/audio/0/Xinjiang by Zimpzon.mp3']);
                musicPlayer.loop = true;
                musicPlayer.volume = 0.5;
                musicPlayer.load();
                musicPlayer.play();

                setTimeout(() => {
                    const musicVolume = document.querySelector('#music-controls .volume-slider');
                    let i = 0;

                    const increaseMusicVolume = setInterval(() => {
                        musicVolume.value = Math.sin(i)/2 + 0.001;
                        i += 0.005;
                        if (musicVolume.value >= 0.5) clearInterval(increaseMusicVolume);
                    }, 10);
                }, 600);

                // Setup event listeners
                const musicSlider = document.querySelector('#music-controls .volume-slider');
                const musicPause = document.querySelector('#music-controls .play-pause');
                const musicSkip = document.querySelector('#music-controls .skip');

                musicSlider.addEventListener('input', function() {
                    musicPlayer.volume = this.value;
                });
                musicPause.onclick = () => {
                    if (musicPlayer.paused) musicPlayer.play();
                    else musicPlayer.pause();
                };
                musicSkip.classList.add('disabled');
                musicSkip.ariaDisabled = true;        

                // Start playing narration
                const narrationPlayer = document.querySelector('#narration-player');
                narrationPlayer.src = URL.createObjectURL(STATE['0']['audio']['/blog/2024-summer-travels/audio/0/Intro (4.25min).mp3']);
                narrationPlayer.volume = 0.5;
                narrationPlayer.load();

                // Setup event listeners
                const narrationSlider = document.querySelector('#narration-controls .volume-slider');
                const narrationPause = document.querySelector('#narration-controls .play-pause');
                const narrationSpeed = document.querySelector('#narration-controls .speed');

                narrationSlider.addEventListener('input', function() {
                    narrationPlayer.volume = this.value;
                });
                narrationPause.onclick = () => {
                    if (narrationPlayer.paused) narrationPlayer.play();
                    else narrationPlayer.pause();
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

                setTimeout(() => {
                    document.querySelector('#narration-controls').classList.add('active');

                    setTimeout(() => {
                        const narrationVolume = document.querySelector('#narration-controls .volume-slider');
                        const musicVolume = document.querySelector('#music-controls .volume-slider');
                        let i = 0;
                        narrationPlayer.play();

                        const increaseNarrationVolume = setInterval(() => {
                            narrationVolume.value = Math.sin(i)*1.0 + 0.001;
                            narrationPlayer.volume = narrationVolume.value;

                            if (musicVolume.value > 0.1) {
                                musicVolume.value -= 0.01;
                                musicPlayer.volume = musicVolume.value;
                            }
                            
                            i += 0.01;
                            if (narrationVolume.value >= 0.99) clearInterval(increaseNarrationVolume);
                        }, 10);
                    }, 600);
                }, 16000)
            }, 500);
        }

    }, true, true);
}

document.addEventListener('DOMContentLoaded', setup0);