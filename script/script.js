
        // Gestion du menu mobile
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navContainer = document.getElementById('navContainer');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navContainer.classList.toggle('active');
            document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (navContainer.classList.contains('active') && 
                !navContainer.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navContainer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Loading Screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loadingScreen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loadingScreen').style.display = 'none';
                }, 500);
            }, 2000);
        });

        // Typing Animation
        const texts = [
            "Développeur Backend",
            "Passionné de DevOps", 
            "Expert Linux & Docker",
            "Concepteur de solutions innovantes",
            "Architecte Cloud"
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typedElement = document.getElementById('typedText');

        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typedElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        }

        // Start typing animation
        typeText();

        // Enhanced Particles with Programming Symbols
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const symbols = ['{ }', '< />', '( )', '[ ]', '&&', '||', '=>', '===', '!==', '++', '--', 'fn', 'var', 'let', 'const'];
            
            function addParticle() {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
                
                const colors = ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-orange)'];
                particle.style.color = colors[Math.floor(Math.random() * colors.length)];
                
                particlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particlesContainer.contains(particle)) {
                        particlesContainer.removeChild(particle);
                    }
                }, 16000);
            }
            
            for (let i = 0; i < 15; i++) {
                setTimeout(addParticle, i * 800);
            }
            
            setInterval(addParticle, 3000);
        }

        // Matrix Rain Effect
        function createMatrixRain() {
            const matrixContainer = document.getElementById('matrixRain');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            matrixContainer.appendChild(canvas);

            const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
            const matrixArray = matrix.split("");

            const fontSize = 10;
            const columns = canvas.width / fontSize;
            const drops = [];

            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }

            function drawMatrix() {
                ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00d4ff';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            setInterval(drawMatrix, 35);
        }

        // Hero Code Animation
        function animateHeroCode() {
            const codeLines = document.querySelectorAll('#heroCode .code-line');
            codeLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.animationDelay = '0s';
                    line.style.opacity = '1';
                    line.style.width = '100%';
                }, index * 300 + 1000);
            });
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.id === 'competences') {
                        const skillBars = entry.target.querySelectorAll('.skill-progress');
                        skillBars.forEach((bar, index) => {
                            const width = bar.getAttribute('data-width');
                            setTimeout(() => {
                                bar.style.width = width + '%';
                            }, index * 150 + 300);
                        });
                    }

                    if (entry.target.id === 'apropos') {
                        const terminalLines = entry.target.querySelectorAll('.terminal-line');
                        terminalLines.forEach((line, index) => {
                            setTimeout(() => {
                                line.style.animationDelay = '0s';
                            }, index * 200);
                        });
                    }

                    if (entry.target.id === 'accueil') {
                        animateHeroCode();
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Smooth scrolling navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update scroll progress and active nav
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            document.getElementById('scrollProgress').style.width = scrollPercent + '%';

            const sections = document.querySelectorAll('.section');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < bottom) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = e.target.querySelector('.submit-btn');
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            btn.disabled = true;
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                btn.style.background = 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.background = 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))';
                    e.target.reset();
                }, 3000);
            }, 2000);
        });

        // Project cards 3D hover effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });

        // Floating elements animation
        function addFloatingCode() {
            const codes = [
                'func main()',
                'docker run',
                'kubectl apply',
                'git commit',
                'npm install',
                'go build',
                '=> {}',
                'const app',
                'async/await',
                'SELECT *',
                'FROM users',
                'WHERE id',
                'docker-compose up',
                'helm install'
            ];

            function createFloatingCode() {
                const element = document.createElement('div');
                element.className = 'floating-code';
                element.textContent = codes[Math.floor(Math.random() * codes.length)];
                element.style.left = Math.random() * 100 + 'vw';
                element.style.fontSize = (Math.random() * 6 + 10) + 'px';
                
                document.body.appendChild(element);
                
                setTimeout(() => {
                    if (document.body.contains(element)) {
                        document.body.removeChild(element);
                    }
                }, 15000);
            }

            setInterval(createFloatingCode, 4000);
        }

        // Tech stack icons animation
        document.querySelectorAll('.tech-icon').forEach((icon, index) => {
            setTimeout(() => {
                icon.style.animation = 'fadeInUp 0.8s ease forwards';
                icon.style.opacity = '1';
                icon.style.transform = 'translateY(0)';
            }, index * 150 + 500);
        });

        // Skills section enhanced animation
        const skillsSection = document.getElementById('competences');
        const skillCategories = skillsSection.querySelectorAll('.skill-category');
        
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) rotateX(0deg)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });

        skillCategories.forEach((category, index) => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(50px) rotateX(10deg)';
            category.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            skillsObserver.observe(category);
        });

        // Projects section staggered animation
        const projectCards = document.querySelectorAll('.project-card');
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            projectsObserver.observe(card);
        });

        // Parallax effect for background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const bg = document.querySelector('.animated-bg');
            const rate = scrolled * -0.3;
            bg.style.transform = `translateY(${rate}px)`;
        });

        // Initialize everything
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            createMatrixRain();
            addFloatingCode();
            
            // Add some initial tech icons animation
            const techIcons = document.querySelectorAll('.tech-icon');
            techIcons.forEach((icon, index) => {
                icon.style.opacity = '0';
                icon.style.transform = 'translateY(20px)';
            });
        });

        // Smooth reveal for all elements on page load
        window.addEventListener('load', () => {
            const allElements = document.querySelectorAll('.section, .nav, .tech-icon');
            allElements.forEach((element, index) => {
                element.style.animationDelay = (index * 50) + 'ms';
            });
        });

        // Enhanced cursor trail effect
        let trail = [];
        document.addEventListener('mousemove', (e) => {
            trail.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });

            trail = trail.filter(point => Date.now() - point.time < 500);

            if (Math.random() < 0.3) {
                const dot = document.createElement('div');
                dot.style.cssText = `
                    position: fixed;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    width: 3px;
                    height: 3px;
                    background: var(--accent-blue);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    opacity: 0.6;
                    animation: trailFade 0.8s ease forwards;
                `;
                
                document.body.appendChild(dot);
                
                setTimeout(() => {
                    if (document.body.contains(dot)) {
                        document.body.removeChild(dot);
                    }
                }, 800);
            }
        });

        // Add trail fade animation
        const trailStyle = document.createElement('style');
        trailStyle.textContent = `
            @keyframes trailFade {
                0% { opacity: 0.6; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.5); }
            }
            @keyframes fadeInUp {
                0% { opacity: 0; transform: translateY(30px); }
                100% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(trailStyle);

        // Dynamic background color based on scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const bg = document.querySelector('.animated-bg');
            
            // Change background hue based on scroll position
            const hue = scrollPercent * 60; // 0 to 60 degrees
            bg.style.filter = `hue-rotate(${hue}deg) brightness(${1 + scrollPercent * 0.1})`;
        });

        // Add interactive elements for better UX
        document.querySelectorAll('.social-link, .nav-link, .tech-icon, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
            });
        });

        // Console message for developers
        console.log(`
        🚀 Portfolio d'Izayid Ali - Version Enhanced
        
        ✨ Nouvelles fonctionnalités :
        • Animations d'ordinateur et avatar personnalisé
        • Vrais icônes Font Awesome
        • Effet Matrix et particules de code
        • Animations 3D avancées
        • Design futuriste et moderne
        • Menu responsive pour mobile
        
        🛠️ Technologies utilisées :
        • HTML5, CSS3, JavaScript
        • Font Awesome Icons
        • Animations CSS et JavaScript
        • Design responsive
        
        💫 Développé avec passion par Izayid Ali
        Contact: izayid.ali@example.com
        `);

const certifications = {
    cert1: {
    image: './images/cert-licence-gl.jpg',
    title: 'Licence Professionnelle en Génie Logiciel',
    issuer: 'Université Dakar Bourguiba',
    date: '2025',
    description: 'Diplôme de Licence Professionnelle en Génie Logiciel obtenu avec la mention Très Bien. Formation complète couvrant le développement full-stack, DevOps, IA et les méthodologies modernes.',
    skills: [
        'Développement Full-Stack - Angular, Laravel, Flask, Java, PHP',
        'DevOps & CI/CD - Docker, Kubernetes, GitHub Actions, déploiement',
        'Intelligence Artificielle - Initiation ML, DL, entraînement de modèles',
        'Administration Système - Linux, Windows, scripting Bash',
        'Bases de données - Oracle, SQL Server, MySQL, modélisation Merise',
        'Développement Web - HTML, CSS, JavaScript, architectures modernes',
        'Méthodologies - Agile/Scrum, UML, génie logiciel',
        'Sécurité & Réseaux - Sécurisation applications et infrastructures'
    ],
    link: 'https://udb.sn/'
},
    cert2: {
        image: './images/cert-stage-udb.jpg',
        title: 'Stage Professionnel - Université Dakar Bourguiba',
        issuer: 'Université Dakar Bourguiba',
        date: '2025',
        description: 'Stage réalisé au sein de l\'Université Dakar Bourguiba portant sur le développement d\'une plateforme complète de gestion des informations, administration et réseau alumni.',
        skills: [
            'Développement Full-Stack',
            'Gestion de bases de données',
            'Conception et développement d\'interfaces utilisateur',
            'Intégration de systèmes',
            'Gestion des utilisateurs et rôles',
            'Développement de fonctionnalités réseaux sociaux',
            'Optimisation des performances',
            'Documentation technique'
        ],
        link: 'https://udb.sn/'
    },
    cert3: {
        image: './images/cert-meilleur-etudiant.jpg',
        title: 'Certificat du meilleur étudiant en L2 Informatique',
        issuer: 'Université — Année académique 2023–2024',
        date: '2024',
        description: 'Récompense décernée pour avoir obtenu la meilleure moyenne du département Informatique durant l’année 2023–2024. Le certificat a également mis en avant la communauté comorienne pour ses excellents résultats académiques.',
        skills: [
            'Excellence académique',
            'Esprit de rigueur et de performance',
            'Leadership étudiant',
            'Reconnaissance institutionnelle'
        ],
        link: '#'
    },
    cert4: {
        image: './images/cert-ibm-cloud.jpg',
        title: 'IBM - Cloud Computing Fundamentals (Earn a Credential!)',
        issuer: 'IBM Skills Network',
        date: 'En cours',
        description: 'Programme de certification professionnelle proposé par IBM, axé sur les fondamentaux du Cloud Computing. Formation couvrant les modèles de services (IaaS, PaaS, SaaS), la virtualisation, le déploiement d’applications cloud et l’impact du cloud sur l’IA et l’analyse de données.',
        skills: [
            'Fondamentaux du Cloud Computing',
            'IaaS, PaaS, SaaS - architectures et modèles de services',
            'Virtualisation et conteneurisation',
            'Déploiement d’applications sur le cloud',
            'Sécurité et gouvernance cloud',
            'Analyse de données accélérée par le cloud',
            'Introduction aux solutions IA sur le cloud IBM'
        ],
        link: 'https://students.yourlearning.ibm.com/activity/PLAN-58FA14F64C9B?focuslmsId=MDLPT-312'
    }

};

// Les fonctions JavaScript restent les mêmes
function openCertModal(certId) {
    const cert = certifications[certId];
    const modal = document.getElementById('certModal');
    const modalBody = document.getElementById('certModalBody');

    let skillsList = cert.skills.map(skill => `<li>${skill}</li>`).join('');

    modalBody.innerHTML = `
        <img src="${cert.image}" alt="${cert.title}" class="modal-image">
        <div class="modal-body">
            <div class="modal-header">
                <h2>${cert.title}</h2>
                <p class="modal-issuer">${cert.issuer}</p>
            </div>
            <p class="modal-description">${cert.description}</p>
            <div class="modal-skills">
                <h3>Compétences validées :</h3>
                <ul>${skillsList}</ul>
            </div>
        </div>
        <div class="modal-footer">
            <p class="modal-date"><i class="far fa-calendar"></i> Obtenu en ${cert.date}</p>
            
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fermer avec Échap ou clic en dehors
window.addEventListener('click', function(e) {
    const modal = document.getElementById('certModal');
    if (e.target === modal) {
        closeCertModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});


