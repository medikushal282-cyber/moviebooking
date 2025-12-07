class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                /* Base footer */
                footer {
                    background: rgba(0,0,0,0.65);
                    color: rgba(255,255,255,0.9);
                    padding-top: 2rem;
                    padding-bottom: 2rem;
                    box-sizing: border-box;
                }

                .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; box-sizing: border-box; }

                /* ===== CINEMATIC BANNER (full-width, centered) ===== */
                .footer-brand-banner {
                    width: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: center !important;
                    text-align: center !important;
                    padding: 36px 18px !important;
                    margin: 0 0 28px 0 !important;
                    background: rgba(0,0,0,0.35);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.06);
                    box-shadow: 0 8px 40px rgba(0,200,255,0.06), 0 0 18px rgba(255,0,200,0.03);
                }

                .footer-brand-title {
                    font-size: 2rem;
                    font-weight: 800;
                    line-height: 1;
                    margin: 0;
                    letter-spacing: 0.6px;
                    background: linear-gradient(90deg, #00f0ff, #0ea5e9, #9b00ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 0 18px rgba(0,240,255,0.12);
                }

                .footer-brand-sub {
                    margin-top: 8px;
                    color: rgba(255,255,255,0.85);
                    font-size: 1rem;
                }

                .footer-brand-icons {
                    display: flex;
                    gap: 14px;
                    margin-top: 14px;
                    justify-content: center;
                    align-items: center;
                }

                .social-icon {
                    color: rgba(255,255,255,0.9);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform .22s ease, color .18s ease;
                }
                .social-icon:hover { transform: translateY(-4px); color: var(--primary-600); }

                /* ===== ORIGINAL LAYOUT (center the link lists) ===== */
                .layout {
                    display: flex;
                    gap: 2rem;
                    justify-content: center; /* center the group */
                    align-items: flex-start;
                    flex-wrap: wrap;
                }

                /* brand-col kept for compatibility — center its contents */
                .brand-col {
                    display: flex !important;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    min-width: 180px;
                    max-width: 320px;
                    margin: 0 auto;
                }

                /* right-columns becomes a centered row of columns */
                .right-columns {
                    display: flex;
                    gap: 3rem;
                    justify-content: center;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    width: 100%;
                }

                .col {
                    width: fit-content;
                    max-width: 260px;
                    margin: 0 auto;
                    text-align: center;
                }

                .col h4 { margin: 0 0 0.6rem 0; }
                .col ul { padding: 0; margin: 0; list-style: none; display: inline-block; text-align: left; }
                .col ul li { margin: 0.25rem 0; }

                /* make list items look centered visually while keeping left alignment */
                @media (min-width: 640px) {
                    .col ul { text-align: left; }
                }
                @media (max-width: 639px) {
                    .col ul { text-align: center; display: block; }
                }

                /* Newsletter row centered */
                .newsletter-row {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 1.5rem;
                }
                .newsletter-input {
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #fff;
                    padding: 8px 10px;
                    border-radius: 8px 0 0 8px;
                }
                .newsletter-button {
                    background: var(--primary-600);
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 0 8px 8px 0;
                    cursor: pointer;
                }

                /* Footer bottom */
                .footer-bottom {
                    border-top: 1px solid rgba(255,255,255,0.06);
                    margin-top: 2rem;
                    padding-top: 1.25rem;
                    color: rgba(255,255,255,0.65);
                    text-align: center;
                    width: 100%;
                }

                /* small screens tighten spacing */
                @media (max-width: 480px) {
                    .footer-brand-title { font-size: 1.4rem; }
                    .footer-brand-banner { padding: 22px 12px; margin-bottom: 20px; }
                    .col { max-width: 200px; }
                }
            </style>

            <footer>
                <div class="container">

                    <!-- CENTERED CINEMATIC BANNER -->
                    <div class="footer-brand-banner" id="brandBanner">
                        <h2 class="footer-brand-title">Bookyourshow Cinematics</h2>
                        <p class="footer-brand-sub">Delivering the best movie listings, tickets and showtimes.</p>

                        <div class="footer-brand-icons" aria-hidden="true">
                            <a class="social-icon" href="#"><i data-feather="facebook"></i></a>
                            <a class="social-icon" href="#"><i data-feather="twitter"></i></a>
                            <a class="social-icon" href="#"><i data-feather="instagram"></i></a>
                            <a class="social-icon" href="#"><i data-feather="youtube"></i></a>
                        </div>
                    </div>


                        <div class="right-columns">
                            <div class="col links-col">
                                <h4 class="text-md font-semibold mb-2">Quick Links</h4>
                                <ul>
                                    <li><a class="footer-link" href="/">Home</a></li>
                                    <li><a class="footer-link" href="/movies.html">Movies</a></li>
                                    <li><a class="footer-link" href="/theaters.html">Theaters</a></li>
                                    <li><a class="footer-link" href="/offers.html">Offers</a></li>
                                </ul>
                            </div>

                            <div class="col legal-col">
                                <h4 class="text-md font-semibold mb-2">Legal</h4>
                                <ul>
                                    <li><a class="footer-link" href="/terms.html">Terms</a></li>
                                    <li><a class="footer-link" href="/privacy.html">Privacy</a></li>
                                    <li><a class="footer-link" href="/refund.html">Refund Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8">
    <div class="newsletter-row" style="
        display:flex;
        justify-content:center;
        align-items:center;
        width:100%;
        margin-top:2rem;
    ">
        <div style="
            max-width:520px;
            width:100%;
            margin:0 auto !important;
            text-align:center;
        ">
            <h5 style="margin:0 0 8px 0; color: rgba(255,255,255,0.9); text-align:center;">
                Subscribe to Newsletter
            </h5>

            <div style="
                display:flex;
                justify-content:center;
                align-items:center;
                gap: 0.5rem;
            ">
                <input type="email"
                    class="newsletter-input"
                    placeholder="Your email"
                    style="flex:1; max-width:350px; text-align:center;"
                />
                <button class="newsletter-button" style="padding: 0.6rem 1.1rem;">Subscribe</button>
            </div>
        </div>
    </div>
</div>


                    <!-- footer bottom -->
                    <div class="footer-bottom">
                        <p>© 2025 LadduAnna Productions. All rights reserved by him.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);
