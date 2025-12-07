class AnimatedButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const text = this.getAttribute('text') || 'Button';
        const duration = parseInt(this.getAttribute('duration') || '2000');

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          width: 160px; /* w-40 */
          height: 64px; /* h-16 */
          border-radius: 1.75rem;
          padding: 1px;
          overflow: hidden;
          background: transparent;
          cursor: pointer;
        }

        .border-container {
          position: absolute;
          inset: 0;
          border-radius: calc(1.75rem * 0.96);
          pointer-events: none;
        }

        .moving-light {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px; /* w-20 */
          height: 80px; /* h-20 */
          opacity: 0.8;
          background: radial-gradient(#0ea5e9 40%, transparent 60%); /* sky-500 */
          transform: translate(-50%, -50%);
          will-change: transform;
        }

        .content {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.8); /* slate-900/0.8 */
          border: 1px solid rgb(30, 41, 59); /* slate-800 */
          backdrop-filter: blur(24px); /* backdrop-blur-xl */
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem; /* text-sm */
          border-radius: calc(1.75rem * 0.96);
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        
        svg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      </style>

      <div class="border-container">
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="100%">
          <rect fill="none" width="100%" height="100%" rx="30%" ry="30%" id="path-rect" />
        </svg>
        <div class="moving-light" id="moving-light"></div>
      </div>

      <div class="content">
        ${text}
      </div>
    `;

        this.animateBorder(duration);
    }

    animateBorder(duration) {
        const rect = this.shadowRoot.getElementById('path-rect');
        const light = this.shadowRoot.getElementById('moving-light');
        let startTime = null;

        const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;

            const length = rect.getTotalLength();
            const pxPerMs = length / duration;
            const distance = (elapsed * pxPerMs) % length;

            const point = rect.getPointAtLength(distance);
            light.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
}

customElements.define('animated-button', AnimatedButton);
