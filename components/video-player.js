class CustomVideoPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['src', 'poster'];
    }

    connectedCallback() {
        const src = this.getAttribute('src') || '';
        const poster = this.getAttribute('poster') || '';

        console.log('Video player initialized with src:', src);

        this.render(src, poster);
        this.initPlayer();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.shadowRoot) {
            console.log(`Attribute ${name} changed to:`, newValue);
            const video = this.shadowRoot.getElementById('video');
            if (video) {
                if (name === 'src') {
                    const source = video.querySelector('source');
                    if (source) {
                        source.src = newValue;
                        video.load();
                    }
                } else if (name === 'poster') {
                    video.poster = newValue;
                }
            }
        }
    }

    render(src, poster) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                }

                video {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .play-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80px;
                    height: 80px;
                    background: rgba(207, 48, 170, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }

                .play-overlay.hide {
                    opacity: 0;
                    pointer-events: none;
                }

                .play-overlay svg {
                    width: 40px;
                    height: 40px;
                    color: white;
                    margin-left: 5px;
                }
            </style>

            <video id="video" ${poster ? `poster="${poster}"` : ''} controls>
                <source src="${src}" type="video/mp4">
                Your browser does not support the video tag.
            </video>

            <div class="play-overlay" id="playOverlay">
                <svg fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
            </div>
        `;
    }

    initPlayer() {
        const video = this.shadowRoot.getElementById('video');
        const playOverlay = this.shadowRoot.getElementById('playOverlay');

        video.addEventListener('error', (e) => {
            console.error('Video error:', video.error);
            console.error('Video src:', video.currentSrc);
        });

        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });

        playOverlay.addEventListener('click', () => {
            video.play();
            playOverlay.classList.add('hide');
        });

        video.addEventListener('play', () => {
            playOverlay.classList.add('hide');
        });

        video.addEventListener('pause', () => {
            playOverlay.classList.remove('hide');
        });

        video.addEventListener('ended', () => {
            playOverlay.classList.remove('hide');
        });
    }
}

customElements.define('custom-video-player', CustomVideoPlayer);
