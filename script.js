// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change and auto-hide on scroll
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    // Background change based on scroll position
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    // Auto-hide navbar based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        navbar.classList.add('nav-hidden');
    } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        navbar.classList.remove('nav-hidden');
    }
    
    lastScrollY = currentScrollY;
});

// Bidirectional Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
};

const bidirectionalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Element is entering viewport - show it
            entry.target.classList.add('visible');
            entry.target.classList.remove('exit');
        } else {
            // Element is leaving viewport - hide it in opposite direction
            entry.target.classList.remove('visible');
            entry.target.classList.add('exit');
        }
    });
}, observerOptions);

// Initialize bidirectional animations
document.addEventListener('DOMContentLoaded', () => {
    // ALL ELEMENTS USE SCALE-IN ANIMATION - NO EXCEPTIONS
    
    // Hero section elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-stats, .hero-buttons, .hero-visual');
    heroElements.forEach(element => {
        element.classList.add('scale-in');
        bidirectionalObserver.observe(element);
    });
    
    // Section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('scale-in');
        bidirectionalObserver.observe(title);
    });
    
    // About section elements
    const aboutText = document.querySelector('.about-text');
    const aboutSkills = document.querySelector('.about-skills');
    
    if (aboutText) {
        aboutText.classList.add('scale-in');
        bidirectionalObserver.observe(aboutText);
    }
    
    if (aboutSkills) {
        aboutSkills.classList.add('scale-in');
        bidirectionalObserver.observe(aboutSkills);
    }
    
    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('scale-in');
        bidirectionalObserver.observe(card);
    });
    
    // Main sections
    const mainSections = document.querySelectorAll('.about.scale-in, .projects.scale-in, .contact.scale-in, .footer.scale-in');
    mainSections.forEach(section => {
        bidirectionalObserver.observe(section);
    });
    
    // Contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.classList.add('scale-in');
        bidirectionalObserver.observe(method);
    });
    
    // Terminal
    const terminal = document.querySelector('.terminal');
    if (terminal) {
        terminal.classList.add('scale-in');
        bidirectionalObserver.observe(terminal);
    }
    
    // Contact intro text
    const contactIntro = document.querySelector('.contact-intro');
    if (contactIntro) {
        contactIntro.classList.add('scale-in');
        bidirectionalObserver.observe(contactIntro);
    }
    
    // Skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.classList.add('scale-in');
        bidirectionalObserver.observe(category);
    });
});

// Typing animation for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 150);
    }
});

// Matrix rain effect
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.1';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
        this.initializeDrops();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / 20);
        this.initializeDrops();
    }
    
    initializeDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = '15px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            this.ctx.fillText(text, i * 20, this.drops[i]);
            
            if (this.drops[i] > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i] += 20;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize matrix rain effect
// new MatrixRain();

// Glitch effect for project cards
function addGlitchEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.animation = 'glitch-card 0.3s ease-in-out';
        });
        
        card.addEventListener('animationend', () => {
            card.style.animation = '';
        });
    });
}

// Add glitch animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch-card {
        0%, 100% { transform: translateY(-10px); }
        20% { transform: translateY(-10px) translateX(-2px); }
        40% { transform: translateY(-10px) translateX(2px); }
        60% { transform: translateY(-10px) translateX(-1px); }
        80% { transform: translateY(-10px) translateX(1px); }
    }
`;
document.head.appendChild(style);

// Initialize glitch effect
document.addEventListener('DOMContentLoaded', addGlitchEffect);

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start) + (element.textContent.includes('%') ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        }
    }
    
    updateCounter();
}

// Initialize counters when they come into view
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            const value = parseFloat(statNumber.textContent);
            
            entry.target.classList.add('animated');
            animateCounter(statNumber, value);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => statObserver.observe(stat));
});

// Terminal typing effect
function terminalTypeEffect() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    terminalLines.forEach((line, index) => {
        if (line.classList.contains('output')) return;
        
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            function type() {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50);
                }
            }
            type();
        }, index * 1000);
    });
}

// Initialize terminal typing when contact section is in view
const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
            entry.target.classList.add('typed');
            terminalTypeEffect();
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.querySelector('.terminal');
    if (terminal) {
        terminalObserver.observe(terminal);
    }
});

// Particle system for hero background
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(this.canvas);
        }
        
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.01;
                particle.y -= dy * 0.01;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx2 = particle.x - otherParticle.x;
                const dy2 = particle.y - otherParticle.y;
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                
                if (distance2 < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - distance2 / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) { // Only on larger screens for performance
        new ParticleSystem();
    }
});

// Enhanced scroll indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ffff, #ff00ff);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrollPercent + '%';
    });
}

// Initialize scroll indicator
createScrollIndicator();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console easter egg
console.log(`
%c
██╗  ██╗███████╗██╗   ██╗██╗███╗   ██╗    ██╗  ██╗███████╗██████╗ ███╗   ██╗███████╗
██║ ██╔╝██╔════╝██║   ██║██║████╗  ██║    ██║ ██╔╝██╔════╝██╔══██╗████╗  ██║██╔════╝
█████╔╝ █████╗  ██║   ██║██║██╔██╗ ██║    █████╔╝ █████╗  ██████╔╝██╔██╗ ██║███████╗
██╔═██╗ ██╔══╝  ╚██╗ ██╔╝██║██║╚██╗██║    ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║╚════██║
██║  ██╗███████╗ ╚████╔╝ ██║██║ ╚████║    ██║  ██╗███████╗██║  ██║██║ ╚████║███████║
╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝

Welcome to my portfolio! 
Thanks for checking the console. 
Feel free to reach out if you want to collaborate!

Email: Kevin.Kerns88@gmail.com
`, 'color: #00ffff; font-family: monospace;');
