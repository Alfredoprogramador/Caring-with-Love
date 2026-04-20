// ===== FUTURISTIC PARTICLES =====
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '0, 212, 255' : '168, 85, 247'
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(drawParticles);
    }

    drawParticles();
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');

        // Fechar todos
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
        });

        // Abrir o clicado (se não estava aberto)
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== CONTAGEM ANIMADA (STATS) =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };

        update();
    });
}

// Observar quando stats ficam visíveis
const statsSection = document.querySelector('.experience-stats');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== SCROLL REVEAL =====
const fadeElements = document.querySelectorAll(
    '.exp-card, .service-card, .reason-card, .testimonial-card, .faq-item, .contact-item'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => revealObserver.observe(el));

// ===== SMOOTH SCROLL (fallback) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FORMULÁRIO =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const nome = formData.get('nome');

        // Feedback visual
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Mensagem Enviada! ✓';
        btn.style.background = 'var(--primary)';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active-link');
                if (a.getAttribute('href') === '#' + sectionId) {
                    a.classList.add('active-link');
                }
            });
        }
    });
});
