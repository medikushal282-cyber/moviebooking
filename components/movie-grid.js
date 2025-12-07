class MovieGrid extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }
        
        .movie-section {
          margin-bottom: 3rem;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--primary-600);
          padding-left: 2rem;
          border-left: 4px solid var(--primary-600);
        }
        
        .movie-card {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .movie-poster {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        
        .movie-details {
          padding: 1rem;
        }
        
        .movie-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--gray-800);
        }
        
        .movie-release {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-bottom: 0.5rem;
        }
        
        .movie-cast {
          font-size: 0.875rem;
          color: var(--gray-700);
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .movie-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        
        .genre-tag {
          background: var(--primary-100);
          color: var(--primary-800);
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .dark .movie-card {
          background: var(--gray-800);
        }
        
        .dark .movie-title {
          color: white;
        }
        
        .dark .movie-cast,
        .dark .movie-release {
          color: var(--gray-300);
        }
        
        .dark .genre-tag {
          background: var(--primary-900);
          color: var(--primary-200);
        }
      /* Video Modal */
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        align-items: center;
        justify-content: center;
      }

      .modal.show {
        display: flex;
      }

      .modal-content {
        position: relative;
        width: 90%;
        max-width: 1000px;
        aspect-ratio: 16/9;
        background: black;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      }

      .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        background: none;
        border: none;
        padding: 5px;
      }

      .close-modal:hover {
        color: #cf30aa;
      }

      video {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }

      .watch-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #cf30aa, #a099d8);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
        text-decoration: none;
      }

      .watch-btn:hover {
        transform: scale(1.05);
      }
      </style>
      
      <div class="movie-grid">
        <!-- Bollywood Section -->
        <div class="movie-section">
          <h2 class="section-title">Bollywood (Hindi)</h2>
          <div class="movies-container" id="bollywood-movies"></div>
        </div>
        
        <!-- Tollywood Section -->
        <div class="movie-section">
          <h2 class="section-title">Tollywood (Telugu)</h2>
          <div class="movies-container" id="tollywood-movies"></div>
        </div>
        
        <!-- Hollywood Section -->
        <div class="movie-section">
          <h2 class="section-title">Hollywood</h2>
          <div class="movies-container" id="hollywood-movies"></div>
        </div>
      </div>

      <!-- Video Modal -->
      <div id="videoModal" class="modal">
        <div class="modal-content">
          <button class="close-modal">&times;</button>
          <video id="trailerVideo" controls>
            <source src="" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    `;

    this.loadMovies();
    this.setupModal();
  }

  setupModal() {
    const modal = this.shadowRoot.getElementById('videoModal');
    const closeBtn = this.shadowRoot.querySelector('.close-modal');
    const video = this.shadowRoot.getElementById('trailerVideo');

    closeBtn.onclick = () => {
      modal.classList.remove('show');
      video.pause();
      video.currentTime = 0;
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        video.pause();
        video.currentTime = 0;
      }
    };
  }

  playTrailer(url) {
    const modal = this.shadowRoot.getElementById('videoModal');
    const video = this.shadowRoot.getElementById('trailerVideo');

    if (url) {
      video.src = url;
      modal.classList.add('show');
      video.play().catch(e => console.log('Auto-play prevented:', e));
    } else {
      alert('Trailer coming soon!');
    }
  }

  loadMovies() {
    const movies = {
      bollywood: [
        {
          title: "120 Bahadur",
          releaseDate: "Nov 21",
          cast: "Farhan Akhtar, Raashi Khanna",
          genres: ["Thriller", "Action", "War"],
          image: "http://static.photos/movie/640x360/101",
          trailer: "trailers/SSYouTube.online_120 Bahadur  Official Teaser  Farhan Akhtar  Raashii Khanna  21st November_720p.mp4"
        },
        {
          title: "Haunted 3D: Ghosts of the Past",
          releaseDate: "Nov 21",
          cast: "Mimoh Chakraborty, Chetna Pande",
          genres: ["Horror"],
          image: "http://static.photos/movie/640x360/102",
          trailer: ""
        },
        {
          title: "Mastiii 4",
          releaseDate: "Nov 21",
          cast: "Ritesh Deshmukh, Vivek Oberoi",
          genres: ["Drama", "Comedy"],
          image: "http://static.photos/movie/640x360/103",
          trailer: "trailers/SSYouTube.online_Masti 4 - Official Teaser  Riteish Deshmukh  Vivek Oberoi  Aftab Shivdasani  21st Nov_720p.mp4"
        },
        {
          title: "Tere Ishk Mein",
          releaseDate: "Nov 28",
          cast: "Dhanush, Kriti Sanon",
          genres: ["Romance", "Drama", "Action"],
          image: "http://static.photos/movie/640x360/104",
          trailer: "trailers/SSYouTube.online_TERE ISHK MEIN TEASER (Hindi)  Dhanush, Kriti Sanon  A. R. Rahman  Aanand L Rai  Bhushan Kumar_720p.mp4"
        },
        {
          title: "Dhurandhar",
          releaseDate: "Dec 5",
          cast: "Ranveer Singh, Sanjay Dutt",
          genres: ["Thriller", "Action", "Crime"],
          image: "http://static.photos/movie/640x360/105",
          trailer: "trailers/SSYouTube.online_Dhurandhar Official Trailer  Ranveer Singh  Aditya Dhar  In Cinemas 5th December 2025_720p.mp4"
        },
        {
          title: "Ikkis",
          releaseDate: "Dec 25",
          cast: "Dharmendra, Agastya Nanda",
          genres: ["History", "War"],
          image: "http://static.photos/movie/640x360/106",
          trailer: "trailers/SSYouTube.online_Ikkis - Official Trailer  In Cinemas Worldwide This Christmas  25th December 2025_720p.mp4"
        }
      ],
      tollywood: [
        {
          title: "They Call Him OG",
          releaseDate: "Sep 27",
          cast: "Pawan Kalyan, Emraan Hashmi",
          genres: ["Action", "Crime"],
          image: "trailers/og1.jpg",
          trailer: "trailers/tollywood/og_trailer.mp4"
        },
        {
          title: "Mirai",
          releaseDate: "Dec 20",
          cast: "Teja Sajja, Ritika Nayak",
          genres: ["Sci-Fi", "Action"],
          image: "trailers/mirai1.jpeg",
          trailer: "trailers/tollywood/mirai_trailer.mp4"
        },
        {
          title: "Ghaati",
          releaseDate: "Dec 12",
          cast: "Anushka Shetty, Indrajith",
          genres: ["Crime", "Thriller"],
          image: "trailers/ghaati1.jpg",
          trailer: "trailers/tollywood/ghaati_trailer.mp4"
        },
        {
          title: "Subham",
          releaseDate: "Dec 6",
          cast: "Sree Vishnu, Priyadarshi",
          genres: ["Horror", "Comedy"],
          image: "trailers/subham1.jpg",
          trailer: "trailers/tollywood/subham_trailer.mp4"
        },
        {
          title: "Laila",
          releaseDate: "Dec 14",
          cast: "Tamannaah, Sidhu Jonnalagadda",
          genres: ["Comedy", "Romance"],
          image: "trailers/laila1.jpg",
          trailer: "trailers/tollywood/laila_trailer.mp4"
        },
        {
          title: "Badmashulu",
          releaseDate: "Dec 20",
          cast: "Allari Naresh, Sunil",
          genres: ["Comedy", "Drama"],
          image: "trailers/badmashulu1.jpg",
          trailer: "trailers/tollywood/badmashulu_trailer.mp4"
        }
      ],
      hollywood: [
        {
          title: "Wicked: For Good",
          releaseDate: "Nov 21",
          cast: "Cynthia Erivo, Ariana Grande",
          genres: ["Family", "Fantasy", "Musical"],
          image: "http://static.photos/movie/640x360/301",
          trailer: ""
        },
        {
          title: "Sisu: Road to Revenge",
          releaseDate: "Nov 21",
          cast: "Jorma Tommila, Stephen Lang",
          genres: ["Action", "War"],
          image: "http://static.photos/movie/640x360/302",
          trailer: ""
        },
        {
          title: "Zootopia 2",
          releaseDate: "Nov 26",
          cast: "Ginnifer Goodwin, Jason Bateman",
          genres: ["Animation", "Action", "Comedy"],
          image: "http://static.photos/movie/640x360/303",
          trailer: ""
        },
        {
          title: "Five Nights at Freddy's 2",
          releaseDate: "Dec 5",
          cast: "Josh Hutcherson, Matthew Lillard",
          genres: ["Horror", "Mystery", "Thriller"],
          image: "http://static.photos/movie/640x360/304",
          trailer: ""
        },
        {
          title: "Avatar: Fire and Ash",
          releaseDate: "Dec 19",
          cast: "Sam Worthington, Zoe Saldaña",
          genres: ["Action", "Adventure", "Fantasy"],
          image: "http://static.photos/movie/640x360/305",
          trailer: "trailers/avatar1.webp"
        },
        {
          title: "Marty Supreme",
          releaseDate: "Dec 25",
          cast: "Timothée Chalamet, Gwyneth Paltrow",
          genres: ["Drama"],
          image: "http://static.photos/movie/640x360/306",
          trailer: ""
        }
      ]
    };

    Object.keys(movies).forEach(industry => {
      const container = this.shadowRoot.getElementById(`${industry}-movies`);
      movies[industry].forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
          <img src="${movie.image}" alt="${movie.title}" class="movie-poster">
          <div class="movie-details">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-release">Release: ${movie.releaseDate}</div>
            <div class="movie-cast">${movie.cast}</div>
            <div class="movie-genres">
              ${movie.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
            <button class="watch-btn" data-trailer="${movie.trailer}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Watch Trailer
            </button>
          </div>
        `;

        const btn = movieCard.querySelector('.watch-btn');
        btn.onclick = () => this.playTrailer(movie.trailer);

        container.appendChild(movieCard);
      });
    });
  }
}

customElements.define('movie-grid', MovieGrid);