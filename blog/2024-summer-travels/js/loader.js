STATE = {
    '0': {
        'img': {
            '/blog/2024-summer-travels/img/banff-highway-mountain.jpg': null,
            '/blog/2024-summer-travels/img/vancouver-tower-beach-sunset.jpg': null
        },
        'audio': {
            '/blog/2024-summer-travels/audio/intro.mp3': null
        },
        'video': {}
    }
};

async function loadSection(section, delay = 'urgent', callback = () => null,
    enableCache = true, refreshCache = false) {
    /*
    Controller function to initiate the loading of a section's media files.
    
    Arguments:
    section (type: string)
    - Name of section to load. Must correspond to valid key in STATE object.
    
    delay (type: string, default: urgent)
    - Can be 'urgent' or 'background'. 
    - 'urgent' loading will load all media files sequentially without delays.
    - 'background' loading will load media files with 0.1s delay between each file.
    
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
                if (cache) await cache.put(file, response.clone());
            }

            // Store response in STATE object and wait 0.1s if background loading
            STATE[section][type][file] = response.blob();
            if (delay === 'background') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }   
}