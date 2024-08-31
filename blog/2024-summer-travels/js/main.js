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
        }, 10000);

        startButton.onclick = () => {
            // Update CSS transitions occurring
            clearInterval(alternateButton);
            startButton.classList.remove('active');
            startButton.classList.add('expanding');
            startButton.classList.add('fading');

            clickedStart = true;
            document.querySelector('#temporary-hint').classList.remove('active');

            // Start narration audio
            setTimeout(() => {
                startButton.style.display = 'none';
                console.log('Narration audio started');
            }, 1000);
        }

    }, true, false);
}

document.addEventListener('DOMContentLoaded', setup0);