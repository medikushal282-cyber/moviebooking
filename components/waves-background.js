// === Waves Background (Vanilla JS version of the React TSX component) ===

// Import simplex-noise via CDN (this loads globally as SimplexNoise)
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/simplex-noise.min.js";
document.head.appendChild(script);

script.onload = () => {
    const container = document.getElementById("waves-background");
    if (!container) return;

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    container.appendChild(svg);

    // Config
    const strokeColor = "#ffffff";
    const pointerSize = 0.5;

    // Simplex noise
    const noise = new SimplexNoise();

    // Refs
    let lines = [];
    let paths = [];
    const mouse = {
        x: -10, y: 0,
        lx: 0, ly: 0,
        sx: 0, sy: 0,
        v: 0, vs: 0,
        a: 0, set: false
    };

    let width = 0;
    let height = 0;

    // Resize canvas
    function setSize() {
        width = container.clientWidth;
        height = container.clientHeight;
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
    }

    // Create all points + paths
    function setLines() {
        svg.innerHTML = "";
        lines = [];
        paths = [];

        const xGap = 8;
        const yGap = 8;

        const oWidth = width + 200;
        const oHeight = height + 30;

        const totalLines = Math.ceil(oWidth / xGap);
        const totalPoints = Math.ceil(oHeight / yGap);

        const xStart = (width - xGap * totalLines) / 2;
        const yStart = (height - yGap * totalPoints) / 2;

        for (let i = 0; i < totalLines; i++) {
            const points = [];

            for (let j = 0; j < totalPoints; j++) {
                points.push({
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 }
                });
            }

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", strokeColor);
            path.setAttribute("stroke-width", "1");
            svg.appendChild(path);

            lines.push(points);
            paths.push(path);
        }
    }

    // Mouse / Touch update
    function updateMouse(x, y) {
        mouse.x = x;
        mouse.y = y;

        if (!mouse.set) {
            mouse.sx = x;
            mouse.sy = y;
            mouse.lx = x;
            mouse.ly = y;
            mouse.set = true;
        }

        container.style.setProperty("--x", `${mouse.sx}px`);
        container.style.setProperty("--y", `${mouse.sy}px`);
    }

    window.addEventListener("mousemove", e => updateMouse(e.clientX, e.clientY));
    window.addEventListener("touchmove", e => {
        e.preventDefault();
        const t = e.touches[0];
        updateMouse(t.clientX, t.clientY);
    }, { passive: false });

    // Animation helpers
    function movePoints(time) {
        lines.forEach(points => {
            points.forEach(p => {
                const move = noise.noise2D(
                    (p.x + time * 0.008) * 0.003,
                    (p.y + time * 0.003) * 0.002
                ) * 8;

                p.wave.x = Math.cos(move) * 12;
                p.wave.y = Math.sin(move) * 6;

                const dx = p.x - mouse.sx;
                const dy = p.y - mouse.sy;
                const d = Math.hypot(dx, dy);
                const l = Math.max(175, mouse.vs);

                if (d < l) {
                    const s = 1 - d / l;
                    const f = Math.cos(d * 0.001) * s;
                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.01;
                p.cursor.vy += (0 - p.cursor.y) * 0.01;

                p.cursor.vx *= 0.95;
                p.cursor.vy *= 0.95;

                p.cursor.x += p.cursor.vx;
                p.cursor.y += p.cursor.vy;

                p.cursor.x = Math.max(-50, Math.min(50, p.cursor.x));
                p.cursor.y = Math.max(-50, Math.min(50, p.cursor.y));
            });
        });
    }

    function moved(p) {
        return {
            x: p.x + p.wave.x + p.cursor.x,
            y: p.y + p.wave.y + p.cursor.y
        };
    }

    function drawLines() {
        lines.forEach((points, i) => {
            let d = "";
            points.forEach((p, index) => {
                const m = moved(p);
                if (index === 0) d += `M ${m.x} ${m.y}`;
                else d += ` L ${m.x} ${m.y}`;
            });
            paths[i].setAttribute("d", d);
        });
    }

    function animate(time) {
        if (!mouse.set) {
            mouse.sx = width / 2;
            mouse.sy = height / 2;
        }

        mouse.sx += (mouse.x - mouse.sx) * 0.1;
        mouse.sy += (mouse.y - mouse.sy) * 0.1;

        const dx = mouse.x - mouse.lx;
        const dy = mouse.y - mouse.ly;
        const d = Math.hypot(dx, dy);

        mouse.v = d;
        mouse.vs += (d - mouse.vs) * 0.1;
        mouse.vs = Math.min(100, mouse.vs);

        mouse.lx = mouse.x;
        mouse.ly = mouse.y;

        mouse.a = Math.atan2(dy, dx);

        movePoints(time);
        drawLines();

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        setSize();
        setLines();
    });

    setSize();
    setLines();
    requestAnimationFrame(animate);
};
