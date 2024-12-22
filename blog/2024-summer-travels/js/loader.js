const STATE = {
    '0': {
        'img': {
            '/blog/2024-summer-travels/img/0/banff-mountain.webp': null,
            '/blog/2024-summer-travels/img/0/jasper-lake-2.webp': null,
            '/blog/2024-summer-travels/img/0/campbell-river-dock.webp': null,
            '/blog/2024-summer-travels/img/0/sunset-beach-vancouver.webp': null,
            '/blog/2024-summer-travels/img/0/train-kamloops.webp': null,
            '/blog/2024-summer-travels/img/0/train-winnipeg.webp': null,
            '/blog/2024-summer-travels/img/0/ubc-rose-garden-vancouver.webp': null
        },
        'audio': {
            '/blog/2024-summer-travels/audio/0/Housekeeping (45s).mp3': null,
            '/blog/2024-summer-travels/audio/0/Xinjiang by Zimpzon.mp3': null
        },
    },
    'intervals': {}
};

async function loadSection(section, delay = 0, callback = () => null,
    enableCache = true, refreshCache = false) {
    /*
    Controller function to initiate the loading of a section's media files.
    
    Arguments:
    section (type: string)
    - Name of section to load. Must correspond to valid key in STATE object.
    
    delay (type: number, default: 0)
    - Specify the amount of delay in milliseconds between each file.
    
    callback (type: function, default: () => null)
    - Function to execute after all media files have been loaded.
    - If using background loading, specify a function that just notes the section
      has been loaded and the next section can start background loading.
    - If using urgent loading, specify a function that starts DOM rendering.

    enableCache (type: boolean, default: true)
    - If true, media files will be searched for and cached in memory.

    refreshCache (type: boolean, default: false)
    - If true, media files will be reloaded from the server and recached.
    */

    // Ensure section is valid
    if (!(section in STATE)) {
        console.error(`Invalid section: ${section}`);
        return;
    }

    // Check if cache API is available in current browser
    let cache;
    if (enableCache && 'caches' in window) {
        cache = await caches.open(`madhavmalhotra-blog-summer-2024-travels-${section}`);
    } else cache = null;

    // Go through img, audio, video sections
    const mediaTypes = Object.keys(STATE[section]);
    for (let type of mediaTypes) {

        // Get all media files for current type
        const mediaFiles = Object.keys(STATE[section][type]);
        for (let file of mediaFiles) {

            // Load media file
            let response = null;
            if (cache && !refreshCache) response = await cache.match(file);
            if (!response) {
                response = await fetch(file);
                if (!response.ok) {
                    console.error(`Failed to load media file: ${file}`);
                    return;
                }
                if (cache) await cache.put(file, response.clone());
            }

            // Store response in STATE object and wait 0.1s if background loading
            STATE[section][type][file] = await response.blob();
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // Execute callback function upon succesful load
    callback();
}

export { loadSection, STATE };