/* ============================================================
   IEEE SIGHT SGNU — Cinematic Motion Engine v3 — ULTRA
   40+ Features | GSAP + Lenis + SplitType
   ============================================================ */

(function () {
    'use strict';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ========== F1: CANVAS PARTICLE NETWORK ========== */
    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let w, h, particles, mouse;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }

        function createParticles() {
            const count = isMobile ? 40 : 90;
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.5 + 0.2,
                });
            }
        }

        mouse = { x: null, y: null };
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        function draw() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 191, 255, ${p.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(0, 191, 255, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        const force = 0.02 * (1 - dist / 200);
                        p.vx += dx * force * 0.01;
                        p.vy += dy * force * 0.01;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(155, 81, 224, ${0.1 * (1 - dist / 200)})`;
                        ctx.lineWidth = 0.3;
                        ctx.stroke();
                    }
                }

                p.vx *= 0.999;
                p.vy *= 0.999;
            });
            requestAnimationFrame(draw);
        }

        resize();
        createParticles();
        draw();
        window.addEventListener('resize', () => { resize(); createParticles(); });
    }

    /* ========== F2: INNER PAGE CANVAS (TEAM/EVENTS/CONTACT) ========== */
    function initPageCanvas() {
        const canvas = document.getElementById('pageCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, dots = [];

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }

        function create() {
            const count = isMobile ? 30 : 60;
            dots = [];
            for (let i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 1.5 + 0.3,
                    alpha: Math.random() * 0.4 + 0.1,
                });
            }
        }

        function loop() {
            ctx.clearRect(0, 0, w, h);
            dots.forEach((d, i) => {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > w) d.vx *= -1;
                if (d.y < 0 || d.y > h) d.vy *= -1;

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 191, 255, ${d.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < dots.length; j++) {
                    const e = dots[j];
                    const dx = d.x - e.x;
                    const dy = d.y - e.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(e.x, e.y);
                        ctx.strokeStyle = `rgba(0, 191, 255, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(loop);
        }

        resize();
        create();
        loop();
        window.addEventListener('resize', () => { resize(); create(); });
    }

    /* ========== F3: LENIS SMOOTH SCROLL ========== */
    function initLenis() {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        const marqueeContent = document.querySelector('.marquee-content');
        if (marqueeContent) {
            lenis.on('scroll', (e) => {
                const speed = Math.min(Math.abs(e.velocity) * 0.1, 3);
                marqueeContent.style.animationDuration = Math.max(10, 30 - speed * 8) + 's';
            });
        }

        return lenis;
    }

    /* ========== F4: PRELOADER ========== */
    function initPreloader() {
        return new Promise((resolve) => {
            const preloader = document.getElementById('preloader');
            if (!preloader) { resolve(); return; }

            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.to(preloader, {
                        yPercent: -100,
                        duration: 0.8,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            resolve();
                        }
                    });
                }
            });

            tl.to('.preloader-word', {
                opacity: 1, y: 0,
                duration: 0.6, stagger: 0.12,
                ease: 'power3.out'
            })
            .to('.preloader-tagline', { opacity: 1, duration: 0.5 }, '-=0.2')
            .to('.preloader-bar-inner', { width: '100%', duration: 1.2, ease: 'power2.inOut' }, '-=0.3')
            .to({}, { duration: 0.3 });
        });
    }

    /* ========== F5: HERO ENTRANCE ========== */
    function initHeroAnimations() {
        const title = document.getElementById('heroTitle');
        if (title) {
            const split = new SplitType(title, { types: 'chars', tagName: 'span' });
            gsap.to(split.chars, {
                opacity: 1, y: 0,
                duration: 0.8, stagger: 0.03,
                ease: 'power3.out', delay: 0.1
            });
        }

        gsap.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
        gsap.to('.hero-subtext', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
        gsap.to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.65 });
        gsap.to('.scroll-indicator', { opacity: 1, duration: 0.8, delay: 1 });

        gsap.to('.shape-1', { y: -100, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.to('.shape-2', { y: -150, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.to('.shape-3', { y: -70, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.to('.shape-4', { y: -120, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });

        gsap.to('.hero-content', {
            opacity: 0, y: -50,
            scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.scroll-indicator', {
            opacity: 0,
            scrollTrigger: { trigger: '.hero', start: '20% top', end: '40% top', scrub: 1 }
        });
    }

    /* ========== F6: INNER PAGE HERO ANIMATIONS ========== */
    function initPageHero() {
        const pageTitle = document.getElementById('pageTitle');
        if (!pageTitle || document.getElementById('heroTitle')) return; // skip on main page

        // Animate page title with split characters
        const split = new SplitType(pageTitle, { types: 'chars', tagName: 'span' });
        gsap.from(split.chars, {
            opacity: 0, y: 80, rotateX: -90,
            duration: 0.9, stagger: 0.04,
            ease: 'power3.out', delay: 0.2
        });

        // Animate badge and subtitle
        gsap.from('.page-hero-badge', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.1 });
        gsap.from('.page-hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.5 });
    }

    /* ========== F7: IMPACT COUNTERS ========== */
    function initCounters() {
        const cards = document.querySelectorAll('.counter-card');
        cards.forEach((card, i) => {
            gsap.to(card, {
                opacity: 1, y: 0, duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        document.querySelectorAll('.counter-number').forEach((el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val).toLocaleString();
                }
            });
        });
    }

    /* ========== F8: GENERIC ANIMATED COUNTERS (Team/Events Stats) ========== */
    function initGenericCounters() {
        document.querySelectorAll('.stat-num, .isi-num').forEach((el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val).toLocaleString();
                }
            });
        });
    }

    /* ========== F9: SPLIT-REVEAL TEXT ========== */
    function initSplitReveal() {
        document.querySelectorAll('.split-reveal').forEach((el) => {
            const split = new SplitType(el, { types: 'lines,words', tagName: 'span' });
            split.lines.forEach((line) => { line.style.overflow = 'hidden'; });

            gsap.from(split.words, {
                y: '100%', opacity: 0,
                duration: 0.8, stagger: 0.02,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ========== F10: JOURNEY SECTION ========== */
    function initJourney() {
        const steps = document.querySelectorAll('.journey-step');
        const lineFill = document.getElementById('journeyLineFill');
        if (!steps.length || !lineFill) return;

        gsap.to(lineFill, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.journey-timeline',
                start: 'top 70%',
                end: 'bottom 50%',
                scrub: 0.5,
            }
        });

        steps.forEach((step) => {
            gsap.to(step, {
                opacity: 1, x: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    onEnter: () => step.classList.add('is-active'),
                }
            });
        });
    }

    /* ========== F11: VIDEO ========== */
    function initVideo() {
        const poster = document.getElementById('videoPoster');
        const frame = document.getElementById('videoFrame');
        if (!poster || !frame) return;

        const videoId = 'dQw4w9WgXcQ';

        poster.addEventListener('click', () => {
            frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            frame.style.display = 'block';
            gsap.to(poster, { opacity: 0, duration: 0.5, onComplete: () => { poster.style.display = 'none'; } });
        });
    }

    /* ========== F12: SPOTLIGHT ========== */
    function initSpotlight() {
        gsap.to('.spotlight-image', {
            opacity: 1, y: 0, duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.spotlight-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });
        gsap.to('.spotlight-info', {
            opacity: 1, y: 0, duration: 1, delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.spotlight-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ========== F13: HORIZONTAL SCROLL PROJECTS ========== */
    function initHorizontalScroll() {
        const track = document.getElementById('projectsTrack');
        const section = document.querySelector('.projects-section');
        if (!track || !section || isMobile) return;

        const totalScroll = track.scrollWidth - window.innerWidth + 100;

        gsap.to(track, {
            x: -totalScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${totalScroll}`,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
            }
        });
    }

    /* ========== F14: 3D CARD TILT ========== */
    function initCardTilt() {
        if (isTouch) return;
        document.querySelectorAll('.project-card, [data-tilt]').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 6, rotateX: -y * 6,
                    transformPerspective: 800,
                    duration: 0.4, ease: 'power2.out'
                });

                // Move shine
                const shine = card.querySelector('.card-shine');
                if (shine) {
                    shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;
                }
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
                const shine = card.querySelector('.card-shine');
                if (shine) shine.style.background = 'transparent';
            });
        });
    }

    /* ========== F15: NAVBAR ========== */
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        if (!navbar) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y > 100) {
                navbar.classList.add('is-scrolled');
                navbar.classList.toggle('is-hidden', y > lastScroll && y > 400);
            } else {
                navbar.classList.remove('is-scrolled', 'is-hidden');
            }
            lastScroll = y;
        });

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                menuBtn.classList.toggle('is-active');
                mobileMenu.classList.toggle('is-open');
                document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
            });
            mobileMenu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    menuBtn.classList.remove('is-active');
                    mobileMenu.classList.remove('is-open');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    /* ========== F16: CURSOR + CURSOR TEXT ========== */
    function initCursor() {
        if (isTouch) return;

        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        const cursorText = document.querySelector('.cursor-text');
        if (!cursor || !follower) return;

        let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
        });

        gsap.ticker.add(() => {
            cx += (mx - cx) * 0.2;
            cy += (my - cy) * 0.2;
            fx += (mx - fx) * 0.08;
            fy += (my - fy) * 0.08;

            cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
            follower.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%)`;

            if (cursorText) {
                cursorText.style.transform = `translate3d(${fx + 30}px, ${fy - 20}px, 0) translate(-50%, -50%)`;
            }
        });

        document.querySelectorAll('a, button, .magnetic').forEach((el) => {
            el.addEventListener('mouseenter', () => follower.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => follower.classList.remove('is-hovering'));
        });

        const hero = document.querySelector('.hero');
        if (hero && cursorText) {
            hero.addEventListener('mouseenter', () => cursorText.classList.add('is-visible'));
            hero.addEventListener('mouseleave', () => cursorText.classList.remove('is-visible'));
        }
    }

    /* ========== F17: MAGNETIC BUTTONS ========== */
    function initMagnetics() {
        if (isTouch) return;
        document.querySelectorAll('.magnetic').forEach((el) => {
            const strength = parseInt(el.dataset.strength, 10) || 20;
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
                gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    /* ========== F18: SCROLL PROGRESS ========== */
    function initScrollProgress() {
        const bar = document.querySelector('.scroll-progress');
        if (!bar) return;
        gsap.to(bar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
        });
    }

    /* ========== F19: FOOTER ANIMATIONS ========== */
    function initFooter() {
        const footer = document.getElementById('footer');
        if (!footer) return;

        ScrollTrigger.create({
            trigger: footer,
            start: 'top 90%',
            onEnter: () => footer.classList.add('is-visible'),
        });
    }

    /* ========== F20: TEAM CARD STAGGERED ENTRANCE ========== */
    function initTeamCards() {
        const groups = document.querySelectorAll('.team-group-block');
        groups.forEach((group) => {
            const cards = group.querySelectorAll('.team-page-card');
            const header = group.querySelector('.team-group-header');

            // Animate header
            if (header) {
                gsap.from(header, {
                    opacity: 0, x: -30,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            }

            // Staggered card entrance
            cards.forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0, y: 60, scale: 0.95,
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        });
    }

    /* ========== F21: EVENT ITEM ANIMATIONS ========== */
    function initEventItems() {
        document.querySelectorAll('.event-item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0, x: -40,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ========== F22: EVENT COUNTDOWN TIMER ========== */
    function initCountdown() {
        const cdDays = document.getElementById('cdDays');
        const cdHours = document.getElementById('cdHours');
        const cdMins = document.getElementById('cdMins');
        const cdSecs = document.getElementById('cdSecs');
        if (!cdDays) return;

        // Next event date — Mar 27, 2026 4:00 PM IST
        const target = new Date('2026-03-27T16:00:00+05:30').getTime();

        function update() {
            const now = Date.now();
            let diff = target - now;

            if (diff <= 0) {
                cdDays.textContent = '00';
                cdHours.textContent = '00';
                cdMins.textContent = '00';
                cdSecs.textContent = '00';
                document.querySelector('.countdown-event-name').textContent = 'Event is Live Now!';
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            cdDays.textContent = String(d).padStart(2, '0');
            cdHours.textContent = String(h).padStart(2, '0');
            cdMins.textContent = String(m).padStart(2, '0');
            cdSecs.textContent = String(s).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    /* ========== F23: CONTACT FORM ANIMATIONS ========== */
    function initContactAnimations() {
        const formWrapper = document.querySelector('.contact-form-wrapper');
        if (!formWrapper) return;

        gsap.from(formWrapper, {
            opacity: 0, y: 50, scale: 0.98,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: formWrapper,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        document.querySelectorAll('.contact-info-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0, x: 40,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ========== F24: REVEAL-UP ELEMENTS ========== */
    function initRevealUp() {
        document.querySelectorAll('.reveal-up').forEach((el) => {
            gsap.from(el, {
                opacity: 0, y: 30,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ========== F25: STATS BANNER ANIMATION ========== */
    function initStatsBanner() {
        const banner = document.querySelector('.team-stats-banner, .events-impact-strip');
        if (!banner) return;

        gsap.from(banner, {
            opacity: 0, y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: banner,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    }

    /* ========== F26: COUNTDOWN BANNER ANIMATION ========== */
    function initCountdownBanner() {
        const banner = document.querySelector('.countdown-banner');
        if (!banner) return;

        gsap.from(banner, {
            opacity: 0, scale: 0.95, y: 30,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: banner,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    }

    /* ========== F27: QUOTE SECTION ANIMATION ========== */
    function initQuoteSection() {
        const quote = document.querySelector('.team-quote-block');
        if (!quote) return;

        gsap.from('.quote-mark', {
            opacity: 0, scale: 0.5,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
                trigger: quote,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.quote-cite', {
            opacity: 0, y: 20,
            duration: 0.8, delay: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: quote,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    /* ========== F28: BACK TO TOP BUTTON ========== */
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        gsap.set(btn, { opacity: 0, pointerEvents: 'none' });

        ScrollTrigger.create({
            start: () => 'top top-=' + (window.innerHeight * 1.5),
            end: 'bottom bottom',
            onUpdate: (self) => {
                if (self.progress > 0) {
                    gsap.to(btn, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
                } else {
                    gsap.to(btn, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
                }
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ========== F29: GROUP LINE EXPAND ANIMATION ========== */
    function initGroupLines() {
        document.querySelectorAll('.group-line').forEach((line) => {
            gsap.from(line, {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ========== F30: CTA BAND PARALLAX ========== */
    function initCtaParallax() {
        const cta = document.querySelector('.cta-band');
        if (!cta) return;

        gsap.from('.cta-heading', {
            y: 60, opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cta,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.cta-buttons', {
            y: 40, opacity: 0,
            duration: 0.8, delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cta,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    /* ========== INITIALIZE ========== */
    gsap.registerPlugin(ScrollTrigger);

    document.addEventListener('DOMContentLoaded', async () => {
        initHeroCanvas();       // F1
        initPageCanvas();       // F2

        await initPreloader();  // F4

        initLenis();            // F3
        initNavbar();           // F15
        initHeroAnimations();   // F5
        initPageHero();         // F6
        initCounters();         // F7
        initGenericCounters();  // F8
        initSplitReveal();      // F9
        initJourney();          // F10
        initVideo();            // F11
        initSpotlight();        // F12
        initHorizontalScroll(); // F13
        initCardTilt();         // F14
        initCursor();           // F16
        initMagnetics();        // F17
        initScrollProgress();   // F18
        initFooter();           // F19
        initTeamCards();        // F20
        initEventItems();       // F21
        initCountdown();        // F22
        initContactAnimations();// F23
        initRevealUp();         // F24
        initStatsBanner();      // F25
        initCountdownBanner();  // F26
        initQuoteSection();     // F27
        initBackToTop();        // F28
        initGroupLines();       // F29
        initCtaParallax();      // F30
    });
})();
