class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.init();
  }

  render() {
    this.innerHTML = `
      <style>
        .nav-wrapper {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          bottom: 0;
          padding-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .nav-wrapper {
            top: 0;
            bottom: unset;
            padding-top: 1rem;
          }
        }

        .nav-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 10px 14px;
          border-radius: 9999px;
          box-shadow: 0 0 18px rgba(0,0,0,0.35);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          padding: 8px 16px;
          font-weight: 700;
          border-radius: 9999px;
          user-select: none;
        }

        .brand img {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .nav-item {
          position: relative;
          gap: 6px;
          display: flex;
          align-items: center;
          padding: 12px 20px;
          border-radius: 9999px;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all .25s ease;
        }

        .nav-item:hover {
          color: rgba(255,255,255,0.9);
        }

        .nav-item.active {
          color: #fff;
          font-weight: 600;
          background: rgba(14, 165, 233, 0.15);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          top: -35px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 30px;
          background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.7) 0%, transparent 70%);
          filter: blur(12px);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
        }
      </style>

      <div class="nav-wrapper">
        <div class="nav-bar">

          <!-- NAV ITEMS -->
          <div class="nav-item" data-url="index.html"><i data-feather="home"></i><span class="hidden md:inline">Home</span></div>
          <div class="nav-item" data-url="movies.html"><i data-feather="film"></i><span class="hidden md:inline">Movies</span></div>
          <div class="nav-item" data-url="theatres.html"><i data-feather="map-pin"></i><span class="hidden md:inline">Theatres</span></div>
          <div class="nav-item" data-url="offers.html"><i data-feather="percent"></i><span class="hidden md:inline">Offers</span></div>
          <div class="nav-item" data-url="profile.html"><i data-feather="user"></i><span class="hidden md:inline">Profile</span></div>
          <div class="nav-item hidden" id="admin-nav-item" data-url="admin.html"><i data-feather="shield"></i><span class="hidden md:inline">Admin</span></div>

        </div>
      </div>
    `;
  }

  init() {
    // Check for admin role
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          const adminItem = this.querySelector('#admin-nav-item');
          if (adminItem) adminItem.classList.remove('hidden');
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }

    feather.replace();

    const items = Array.from(this.querySelectorAll(".nav-item"));

    // Create lamp
    const lamp = document.createElement("div");
    lamp.className = "lamp";

    const lampBlur = document.createElement("div");
    lampBlur.className = "lamp-blur";

    // Set active based on URL
    let current = items[0];
    const path = window.location.pathname;

    items.forEach(i => {
      if (i.dataset.url && path.endsWith(i.dataset.url)) {
        current = i;
      }
    });

    const setActive = (el) => {
      items.forEach(i => i.classList.remove("active"));
      el.classList.add("active");

      // Move glow under the active element
      el.appendChild(lamp);
      el.appendChild(lampBlur);
    };

    setActive(current);

    items.forEach(item => {
      item.onclick = () => {
        setActive(item);
        window.location.assign(item.dataset.url);
      };
    });
  }
}

customElements.define("custom-navbar", CustomNavbar);

// Auto-load Music Player - DISABLED FOR NOW
// Uncomment the lines below to re-enable the music player
/*
(function() {
  const script = document.createElement('script');
  script.src = 'components/music-player.js';
  document.head.appendChild(script);
})();
*/
