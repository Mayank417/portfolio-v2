 // --- Loader & Typewriter ---
        window.addEventListener('load', () => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
                typeWriter();
            }, 500);
        });

        const words = ["Computer Vision Models", "TinyML Solutions", "Backend Systems"];
        let i = 0;
        let timer;
        
        function typeWriter() {
            const heading = document.getElementById("typewriter");
            const word = words[i];
            let j = 0;
            let isDeleting = false;

            function loop() {
                heading.innerHTML = isDeleting ? word.substring(0, j--) : word.substring(0, j++);
                
                if (!isDeleting && j === word.length + 1) {
                    isDeleting = true;
                    setTimeout(loop, 2000);
                } else if (isDeleting && j < 0) {
                    isDeleting = false;
                    i = (i + 1) % words.length;
                    setTimeout(loop, 500);
                } else {
                    setTimeout(loop, isDeleting ? 50 : 150);
                }
            }
            loop();
        }

        // --- Theme Toggle ---
        const themeBtn = document.getElementById('theme-btn');
        const html = document.documentElement;
        
        // Check Saved Theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        themeBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
        });

        // --- Custom Cursor Logic (Existing) ---
        const cursorDot = document.getElementById('main-cursor');
        const canvas = document.getElementById('canvas-cursor');
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let mouse = { x: width/2, y: height/2 };
        let trail = [];

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            cursorDot.style.left = mouse.x + 'px';
            cursorDot.style.top = mouse.y + 'px';
        });

        // Loop for Cursor Trail
        function animateCursor() {
            ctx.clearRect(0, 0, width, height);
            trail.push({ x: mouse.x, y: mouse.y });
            if(trail.length > 20) trail.shift();

            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for(let i = 1; i < trail.length - 1; i++){
                const xc = (trail[i].x + trail[i+1].x) / 2;
                const yc = (trail[i].y + trail[i+1].y) / 2;
                ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            }
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // --- Spider Web Effect (Background) ---
        (function() {
            const sCanvas = document.getElementById('spider-canvas');
            const sCtx = sCanvas.getContext('2d');
            let sWidth, sHeight;
            let particles = [];
            const particleCount = 60; // Adjust for density
            const connectionDistance = 150;

            function resizeSpider() {
                sWidth = sCanvas.width = window.innerWidth;
                sHeight = sCanvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeSpider);
            resizeSpider();

            class Particle {
                constructor() {
                    this.x = Math.random() * sWidth;
                    this.y = Math.random() * sHeight;
                    this.vx = (Math.random() - 0.5) * 1;
                    this.vy = (Math.random() - 0.5) * 1;
                    this.size = Math.random() * 2 + 1;
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > sWidth) this.vx *= -1;
                    if (this.y < 0 || this.y > sHeight) this.vy *= -1;
                }
                draw() {
                    sCtx.beginPath();
                    sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    // Color based on theme
                    const isDark = document.documentElement.classList.contains('dark');
                    sCtx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
                    sCtx.fill();
                }
            }

            // Init particles
            for(let i=0; i<particleCount; i++) {
                particles.push(new Particle());
            }

            function animateSpider() {
                sCtx.clearRect(0, 0, sWidth, sHeight);
                const isDark = document.documentElement.classList.contains('dark');
                
                particles.forEach((p, index) => {
                    p.update();
                    p.draw();
                    
                    // Connect lines
                    for (let j = index + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);

                        if (dist < connectionDistance) {
                            sCtx.beginPath();
                            sCtx.moveTo(p.x, p.y);
                            sCtx.lineTo(p2.x, p2.y);
                            sCtx.strokeStyle = isDark ? 
                                `rgba(255,255,255,${0.1 - dist/connectionDistance*0.1})` : 
                                `rgba(0,0,0,${0.1 - dist/connectionDistance*0.1})`;
                            sCtx.lineWidth = 1;
                            sCtx.stroke();
                        }
                    }
                });
                requestAnimationFrame(animateSpider);
            }
            animateSpider();
        })();

        // --- Sun Parallax & 3D Cards ---
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX*2)/100;
            const y = (window.innerHeight - e.pageY*2)/100;
            const sun = document.getElementById('sun');
            sun.style.transform = `translateX(-50%) translate(${x}px, ${y}px)`;

            // 3D Card Tilt
            document.querySelectorAll('.card-3d').forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardX = e.clientX - rect.left;
                const cardY = e.clientY - rect.top;
                
                if (cardX >= 0 && cardX <= rect.width && cardY >= 0 && cardY <= rect.height) {
                    const rotX = (cardY - rect.height/2) / 10;
                    const rotY = -(cardX - rect.width/2) / 10;
                    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
                } else {
                    card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
                }
            });
        });

        // --- Project Modal Logic ---
        const modals = document.querySelectorAll('.project-detail');
        const showBtns = document.querySelectorAll('.show-more');
        const closeBtns = document.querySelectorAll('.close-detail');

        showBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.dataset.target);
                if(target) target.classList.remove('hidden');
            });
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.project-detail').classList.add('hidden');
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-detail')) {
                e.target.classList.add('hidden');
            }
        });
        // reveal + shimmer for hero heading (intersection observer)
(function() {
  const heading = document.getElementById('hero-heading');
  if (!heading) return;

  // Use IntersectionObserver to trigger when heading enters viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // animate entrance + expand underline
        heading.classList.add('animate-in');

        // after entrance, enable shimmer (delayed to keep shimmer subtle)
        setTimeout(() => heading.classList.add('heading-shimmer'), 800);

        io.unobserve(heading);
      }
    });
  }, { threshold: 0.3 });

  io.observe(heading);
})();

    
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;
    const moonIcon = themeBtn.querySelector('.fa-moon');
    const sunIcon = themeBtn.querySelector('.fa-sun');

    // 1. Check Local Storage on Load
    if (localStorage.getItem('theme') === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // 2. Button Click Event
    themeBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
 
    const spotlightEl = document.querySelector('.spotlight');

    window.addEventListener('mousemove', (e) => {
        if (spotlightEl) {
            // Mouse ki position CSS variables mein daal rahe hain
            spotlightEl.style.setProperty('--x', `${e.clientX}px`);
            spotlightEl.style.setProperty('--y', `${e.clientY}px`);
        }
    });