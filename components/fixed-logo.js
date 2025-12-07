class FixedLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .fixed-logo {
          position: fixed !important;
          top: 2rem !important;
          left: 2rem !important;
          right: auto !important;
          z-index: 9999 !important;
          transition: transform 0.3s ease;
        }

        .fixed-logo:hover {
          transform: scale(1.05);
        }

        .fixed-logo img {
          height: 80px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
          border-radius: 20px;
        }

        @media (max-width: 768px) {
          .fixed-logo {
            top: 1.5rem !important;
            left: 1.5rem !important;
            right: auto !important;
          }

          .fixed-logo img {
            height: 56px;
          }
        }
      </style>

      <a href="index.html" class="fixed-logo">
        <img src="bookyourshow.png" alt="BookYourShow - Home" />
      </a>
    `;
  }
}

customElements.define("fixed-logo", FixedLogo);
