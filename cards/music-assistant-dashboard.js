class MusicAssistantDashboard extends HTMLElement {
    constructor() {
        super();
        if (!window.hassHelpersCreated) {
            const hass = document.querySelector('home-assistant')?.hass;
            if (hass) {
                if (!hass.states['input_text.ma_search']) {
                    hass.callService('input_text', 'set_value', { entity_id: 'input_text.ma_search', value: '' });
                }
                if (!hass.states['input_select.ma_player']) {
                    hass.callService('input_select', 'set_options', { entity_id: 'input_select.ma_player', options: Object.keys(hass.states).filter(e => e.startsWith('media_player.')) });
                }
                window.hassHelpersCreated = true;
            }
        }
    }

    set hass(hass) {
        const search = this.querySelector('#ma-search');
        const player = this.querySelector('#ma-player');
        const resultsContainer = this.querySelector('#ma-results');
        const queueContainer = this.querySelector('#ma-queue');
        const nowPlayingContainer = this.querySelector('#ma-now-playing');

        const searchQuery = hass.states['input_text.ma_search']?.state || '';
        search.value = searchQuery;

        const results = hass.states['sensor.ma_search_results']?.attributes?.results || [];
        resultsContainer.innerHTML = '';
        results.forEach((item) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.margin = '4px 0';

            const img = document.createElement('img');
            img.src = item.artwork || '';
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.borderRadius = '8px';
            img.style.marginRight = '8px';

            const btn = document.createElement('button');
            btn.textContent = `${item.name} - ${item.artist}`;
            btn.style.flex = '1';
            btn.style.border = 'none';
            btn.style.background = '#6200ee';
            btn.style.color = '#fff';
            btn.style.padding = '6px 12px';
            btn.style.borderRadius = '6px';
            btn.style.cursor = 'pointer';
            btn.onmouseenter = () => btn.style.background = '#3700b3';
            btn.onmouseleave = () => btn.style.background = '#6200ee';

            btn.onclick = () => hass.callService('music_assistant', 'play_media', {
                item_id: item.id,
                player: player.value
            });

            div.appendChild(img);
            div.appendChild(btn);
            resultsContainer.appendChild(div);
        });

        const queue = hass.states['media_player.' + player.value]?.attributes?.media_playlist || [];
        queueContainer.innerHTML = '';
        queue.forEach(track => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.margin = '2px 0';

            const img = document.createElement('img');
            img.src = track.artwork || '';
            img.style.width = '40px';
            img.style.height = '40px';
            img.style.borderRadius = '6px';
            img.style.marginRight = '6px';

            div.textContent = `${track.title} - ${track.artist}`;
            div.prepend(img);
            queueContainer.appendChild(div);
        });

        const nowPlaying = hass.states['media_player.' + player.value];
        if (nowPlaying) {
            nowPlayingContainer.innerHTML = `
                <strong>Now Playing:</strong> ${nowPlaying.attributes.media_title || ''} - ${nowPlaying.attributes.media_artist || ''}<br/>
                <img src='${nowPlaying.attributes.entity_picture || ''}' style='width:70px;height:70px;margin-top:4px;border-radius:8px;' />
            `;
        }
    }

    connectedCallback() {
        this.innerHTML = `
        <div style='display:flex;flex-direction:column;gap:12px;font-family:Roboto, sans-serif;'>
            <input id='ma-search' placeholder='Search for tracks, albums, artists' style='padding:8px;border-radius:6px;border:1px solid #ccc;font-size:16px;' />
            <input id='ma-player' placeholder='Player entity (e.g., media_player.living_room)' style='padding:8px;border-radius:6px;border:1px solid #ccc;font-size:16px;' />
            <button id='ma-search-btn' style='padding:8px 16px;background:#03dac6;color:#000;border:none;border-radius:6px;font-size:16px;cursor:pointer;'>Search</button>
            <h4 style='margin:8px 0;'>Search Results</h4>
            <div id='ma-results'></div>
            <h4 style='margin:8px 0;'>Queue</h4>
            <div id='ma-queue'></div>
            <h4 style='margin:8px 0;'>Now Playing</h4>
            <div id='ma-now-playing'></div>
            <div style='display:flex;gap:6px;margin-top:8px;'>
                <button id='ma-play' style='flex:1;padding:8px;background:#6200ee;color:#fff;border-radius:6px;border:none;cursor:pointer;'>Play</button>
                <button id='ma-pause' style='flex:1;padding:8px;background:#b00020;color:#fff;border-radius:6px;border:none;cursor:pointer;'>Pause</button>
                <button id='ma-next' style='flex:1;padding:8px;background:#03dac6;color:#000;border-radius:6px;border:none;cursor:pointer;'>Next</button>
                <button id='ma-prev' style='flex:1;padding:8px;background:#018786;color:#fff;border-radius:6px;border:none;cursor:pointer;'>Previous</button>
            </div>
        </div>
        `;

        const play = this.querySelector('#ma-play');
        const pause = this.querySelector('#ma-pause');
        const next = this.querySelector('#ma-next');
        const prev = this.querySelector('#ma-prev');
        const searchBtn = this.querySelector('#ma-search-btn');
        const playerInput = this.querySelector('#ma-player');
        const searchInput = this.querySelector('#ma-search');

        searchBtn.onclick = () => {
            const searchVal = searchInput.value;
            this.hass.callService('music_assistant', 'search', { query: searchVal });
        };
        
        play.onclick = () => this.hass.callService('media_player', 'media_play', { entity_id: playerInput.value });
        pause.onclick = () => this.hass.callService('media_player', 'media_pause', { entity_id: playerInput.value });
        next.onclick = () => this.hass.callService('media_player', 'media_next_track', { entity_id: playerInput.value });
        prev.onclick = () => this.hass.callService('media_player', 'media_previous_track', { entity_id: playerInput.value });
    }
}

customElements.define('music-assistant-dashboard', MusicAssistantDashboard);