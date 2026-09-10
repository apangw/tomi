document.addEventListener('DOMContentLoaded', () => {
    // Ganti videoUrl di sini untuk mengganti source tiap station.
    const stations = [
        {
            name: 'V-Rock',
            genre: 'Rock / Metal',
            videoUrl: 'https://youtube.com/embed/Up2qr5K6zc4'
        },
        {
            name: 'Wave 103',
            genre: 'New Wave / Synth',
            videoUrl: 'https://youtube.com/embed/CV7B3Q-AhWM'
        },
        {
            name: 'Flash FM',
            genre: 'Pop / Top 40',
            videoUrl: 'https://youtube.com/embed/tQO1ch6pvP5LKdJC'
        }
    ];

    const menuButton = document.querySelector('[data-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    menuButton?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

    mobileMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    document.querySelectorAll('.reveal').forEach((element) => {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(element);
    });

    const navbar = document.querySelector('#navbar');
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('shadow-sm', window.scrollY > 20);
    });

    const radioCards = document.querySelectorAll('[data-radio-station]');
    const radioPlayer = document.querySelector('#radio-player');
    const radioIframe = document.querySelector('#radio-iframe');
    const stationName = document.querySelector('#radio-station-name');
    const stationGenre = document.querySelector('#radio-station-genre');

    const getYouTubeEmbedUrl = (source) => {
        try {
            const url = new URL(source);
            let videoId = url.searchParams.get('v');

            if (url.hostname === 'youtu.be') {
                videoId = url.pathname.slice(1).split('/')[0];
            }

            if (url.pathname.startsWith('/embed/')) {
                videoId = url.pathname.split('/')[2];
            }

            if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                return null;
            }

            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } catch {
            return null;
        }
    };

    const playStation = (index) => {
        const station = stations[index];

        if (!station || !radioPlayer || !radioIframe) {
            return;
        }

        const embedUrl = getYouTubeEmbedUrl(station.videoUrl);

        if (!embedUrl) {
            return;
        }

        radioIframe.src = embedUrl;
        stationName.textContent = station.name;
        stationGenre.textContent = station.genre;
        radioPlayer.hidden = false;
    };

    radioCards.forEach((card) => {
        const stationIndex = Number(card.dataset.radioStation);
        card.addEventListener('click', () => playStation(stationIndex));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                playStation(stationIndex);
            }
        });
    });
});