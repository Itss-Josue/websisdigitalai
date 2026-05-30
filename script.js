/* ==========================================
   WebSis Digital Ai - Interactivity & Logic
   Mejorado: Lluvia digital más notoria
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Menu Movil (Mobile Toggle) ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --- 2. Header Scroll Effect & Active Section ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // --- 3. Animaciones al hacer Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.feature-card, .feature-demo-card, .service-card, .portfolio-item, .contact-wrapper, .whatsapp-cta-bar');
    
    animatedElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // --- 4. Contadores Animados en Laptop Mockup ---
    const counters = document.querySelectorAll('.counter-text');
    
    const startCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            let count = 0;
            const speed = 2000 / target;
            
            const updateCount = () => {
                count += Math.ceil(target / 100);
                if (count >= target) {
                    if (counter.textContent.includes('+')) {
                        counter.innerText = `+${target}`;
                    } else if (counter.textContent.includes('%')) {
                        counter.innerText = `${target}%`;
                    } else {
                        counter.innerText = target;
                    }
                } else {
                    if (counter.innerText.includes('+')) {
                        counter.innerText = `+${count}`;
                    } else if (counter.innerText.includes('%')) {
                        counter.innerText = `${count}%`;
                    } else {
                        counter.innerText = count;
                    }
                    setTimeout(updateCount, speed);
                }
            };
            updateCount();
        });
    };

    const visualObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounters();
            visualObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });
    
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        visualObserver.observe(heroVisual);
    }

    // --- 5. Simulador de Presupuesto Interactivo (Calculator) ---
    const calcForm = document.getElementById('calc-form');
    const radioCards = document.querySelectorAll('.calc-radio-card');
    const checkboxCards = document.querySelectorAll('.calc-checkbox-card');
    const prioritySelect = document.getElementById('calc-priority');
    const totalPriceDisplay = document.getElementById('calc-total-price');
    const summaryDisplay = document.getElementById('calc-summary-list');
    const btnCalcSend = document.getElementById('btn-calc-send');

    radioCards.forEach(card => {
        const input = card.querySelector('input[type="radio"]');
        card.addEventListener('click', () => {
            radioCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            input.checked = true;
            calculateBudget();
        });
    });

    checkboxCards.forEach(card => {
        const input = card.querySelector('input[type="checkbox"]');
        card.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.checked = !input.checked;
            }
            card.classList.toggle('active', input.checked);
            calculateBudget();
        });
    });

    if (prioritySelect) {
        prioritySelect.addEventListener('change', calculateBudget);
    }

    function calculateBudget() {
        let total = 0;
        let selectedMain = '';
        let mainPrice = 0;
        let selectedAddons = [];

        const activeRadio = calcForm.querySelector('input[name="main-service"]:checked');
        if (activeRadio) {
            mainPrice = parseFloat(activeRadio.getAttribute('data-price'));
            total += mainPrice;
            const parentLabel = activeRadio.closest('.calc-radio-card');
            selectedMain = parentLabel.querySelector('.title').textContent;
        }

        const activeCheckboxes = calcForm.querySelectorAll('input[name="addons"]:checked');
        activeCheckboxes.forEach(checkbox => {
            const price = parseFloat(checkbox.getAttribute('data-price'));
            total += price;
            const parentLabel = checkbox.closest('.calc-checkbox-card');
            selectedAddons.push(parentLabel.querySelector('.title').textContent);
        });

        const priorityMultiplier = parseFloat(prioritySelect.options[prioritySelect.selectedIndex].getAttribute('data-multiplier'));
        const priorityText = prioritySelect.options[prioritySelect.selectedIndex].text;
        
        total = total * priorityMultiplier;
        total = Math.round(total);

        animatePrice(total);

        let summaryHTML = `<strong>Servicio:</strong> ${selectedMain} (S/. ${mainPrice})<br>`;
        if (selectedAddons.length > 0) {
            summaryHTML += `<strong>Adicionales:</strong> ${selectedAddons.join(', ')}<br>`;
        }
        summaryHTML += `<strong>Prioridad:</strong> ${priorityText.split(' (')[0]}`;
        summaryDisplay.innerHTML = summaryHTML;
    }

    function animatePrice(targetPrice) {
        const startPrice = parseInt(totalPriceDisplay.textContent.replace(/[^\d]/g, ''), 10) || 0;
        const duration = 400;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress);
            const currentPrice = Math.round(startPrice + (targetPrice - startPrice) * easeProgress);
            
            totalPriceDisplay.textContent = currentPrice;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    calculateBudget();

    if (btnCalcSend) {
        btnCalcSend.addEventListener('click', () => {
            const activeRadio = calcForm.querySelector('input[name="main-service"]:checked');
            const parentLabel = activeRadio.closest('.calc-radio-card');
            const selectedMain = parentLabel.querySelector('.title').textContent;
            
            const activeCheckboxes = calcForm.querySelectorAll('input[name="addons"]:checked');
            let selectedAddons = [];
            activeCheckboxes.forEach(checkbox => {
                const parent = checkbox.closest('.calc-checkbox-card');
                selectedAddons.push(parent.querySelector('.title').textContent);
            });

            const priorityText = prioritySelect.options[prioritySelect.selectedIndex].text;
            const finalPrice = totalPriceDisplay.textContent;

            let waMsg = `¡Hola WebSis Digital Ai! He calculado una cotización en su web:\n\n`;
            waMsg += `*Servicio Principal:* ${selectedMain}\n`;
            if (selectedAddons.length > 0) {
                waMsg += `*Adicionales:* ${selectedAddons.join(', ')}\n`;
            }
            waMsg += `*Entrega:* ${priorityText}\n`;
            waMsg += `*Precio Estimado:* S/. ${finalPrice}\n\n`;
            waMsg += `Me gustaría conversar con ustedes para afinar los detalles de mi proyecto.`;

            const waUrl = `https://wa.me/51900000000?text=${encodeURIComponent(waMsg)}`;
            window.open(waUrl, '_blank');
        });
    }

    // --- 6. Portfolio / Proyectos Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    if (item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                }
            });
        });
    });

    // --- 7. Project Details Modal Logic ---
    const projectDetails = {
        graschavez: {
            title: "Gras Chavez - Cancha de Fútbol",
            tag: "Páginas Web",
            desc: "Landing page deportiva diseñada para el alquiler de canchas de grass sintético en Huanta. Incluye sistema de reservas por WhatsApp, visualización de horarios disponibles, precios por turno, galería de instalaciones y sección de campeonatos semanales para atraer y fidelizar clientes.",
            img: "gras-chavez.png",
            specs: [
                "Diseño oscuro de alto impacto con identidad deportiva y moderna",
                "Botón de reserva directa integrado con WhatsApp",
                "Sección de precios y horarios disponibles por turno",
                "Galería visual de instalaciones y cancha profesional",
                "Estadísticas: +500 partidos jugados, atención 24/7, campeonatos semanales",
                "Diseño 100% responsive para móviles y escritorio"
            ],
            wa: "https://wa.me/51900000000?text=Hola%20WebSis,%20vi%20el%20proyecto%20de%20Gras%20Chavez%20y%20me%20gustar%C3%ADa%20una%20web%20similar%20para%20mi%20negocio."
        },
        auradent: {
            title: "Aura Dent - Clínica Dental",
            tag: "Páginas Web",
            desc: "Un sitio web corporativo tipo Landing Page para captación de leads en redes sociales. Cuenta con animaciones fluidas, información de tratamientos, agenda automatizada por WhatsApp, opiniones de pacientes y optimización para anuncios de Google Ads y Facebook Ads.",
            img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
            specs: [
                "Carga optimizada de alta velocidad (Menos de 1s)",
                "Secciones: Servicios, Especialistas, Testimonios y Contacto",
                "Formulario de citas que llega a WhatsApp del consultorio",
                "Integración con Google Analytics y Pixels de publicidad",
                "Diseño visual moderno adaptado a la identidad corporativa"
            ],
            wa: "https://wa.me/51900000000?text=Hola%20WebSis,%20vi%20el%20dise%C3%B1o%20de%20la%20cl%C3%ADnica%20Aura%20Dent%20y%20me%20gustar%C3%ADa%20una%20web%20similar%20para%20mi%20negocio."
        },
        farmacontrol: {
            title: "FarmaControl - Gestión de Farmacia",
            tag: "Sistemas para Empresas",
            desc: "Un sistema web empresarial (ERP) a medida diseñado para centralizar las operaciones de farmacias y boticas. Ofrece administración de ventas diarias, alertas automáticas de medicamentos por vencer, control de stocks mínimos y perfiles con diferentes permisos para dueños y cajeros.",
            img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
            specs: [
                "Control de inventario exhaustivo en tiempo real",
                "Módulo de Punto de Venta (POS) rápido y fácil de usar",
                "Alertas inteligentes para medicamentos en fecha crítica",
                "Reportes y gráficos de ventas semanales/mensuales",
                "Diseño web responsive para usar en PC, tablet o celular"
            ],
            wa: "https://wa.me/51900000000?text=Hola%20WebSis,%20vi%20el%20sistema%20FarmaControl%20y%20me%20gustar%C3%ADa%20cotizar%20un%20sistema%20a%20medida%20similar."
        },
        urbanstyle: {
            title: "UrbanStyle - Tienda de Moda",
            tag: "Páginas Web / E-Commerce",
            desc: "Una completa plataforma de comercio electrónico diseñada para la venta y exhibición de prendas de vestir. Cuenta con carrito de compras reactivo, panel autoadministrable de inventario de productos, y pasarela de pago configurada con múltiples tarjetas de crédito y débito.",
            img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
            specs: [
                "Carrito de compras interactivo con actualización en vivo",
                "Integración de pasarelas de pago (Niubiz, Culqi, MercadoPago)",
                "Panel de administrador para agregar productos, tallas y stock",
                "Integración con envíos por delivery y cupones de descuento",
                "Optimización SEO para posicionar productos en búsquedas de Google"
            ],
            wa: "https://wa.me/51900000000?text=Hola%20WebSis,%20vi%20el%20E-Commerce%20UrbanStyle%20y%20quisiera%20cotizar%20una%20tienda%20online%20similar."
        },
        burger: {
            title: "Campaña Burguer & Co - Flyers",
            tag: "Marketing & Creación de Flyers",
            desc: "Campaña publicitaria y diseño gráfico integral para redes sociales. Incluye la creación de una grilla de flyers corporativos llamativos con promociones irresistibles y la configuración de pauta pagada en Meta Ads para geolocalizar clientes potenciales alrededor del restaurante.",
            img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
            specs: [
                "Diseño de 10 flyers publicitarios de alta definición",
                "Segmentación de público objetivo enfocado en comida rápida",
                "Campaña de Meta Ads configurada para recibir pedidos directos",
                "Copys persuasivos enfocados en venta emocional",
                "Soporte y reportes de efectividad cada 15 días"
            ],
            wa: "https://wa.me/51900000000?text=Hola%20WebSis,%20vi%20la%20campa%C3%B1a%20de%20Burguer%20%26%20Co%20y%20quisiera%20el%20servicio%20de%20dise%C3%B1o%20de%20flyers%20y%20marketing."
        }
    };

    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-project-title');
    const modalTag = document.getElementById('modal-project-tag');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalImg = document.getElementById('modal-project-img');
    const modalSpecs = document.getElementById('modal-project-specs');
    const modalWaBtn = document.getElementById('modal-project-whatsapp');

    const detailButtons = document.querySelectorAll('.view-details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectKey = e.target.getAttribute('data-project');
            const data = projectDetails[projectKey];

            if (data) {
                modalTitle.textContent = data.title;
                modalTag.textContent = data.tag;
                modalDesc.textContent = data.desc;
                modalImg.style.backgroundImage = `url('${data.img}')`;
                modalWaBtn.setAttribute('href', data.wa);
                
                modalSpecs.innerHTML = '';
                data.specs.forEach(spec => {
                    const li = document.createElement('li');
                    li.textContent = spec;
                    modalSpecs.appendChild(li);
                });

                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // --- 8. 3D Tilt Hover Effect for Service Cards ---
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const rotateX = -(y - yc) / 15;
            const rotateY = (x - xc) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // --- 9. Dark/Light Mode Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyEl = document.body;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        bodyEl.classList.remove('dark-theme', 'light-theme');
        bodyEl.classList.add(currentTheme + '-theme');
    } else {
        bodyEl.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (bodyEl.classList.contains('dark-theme')) {
                bodyEl.classList.remove('dark-theme');
                bodyEl.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                bodyEl.classList.remove('light-theme');
                bodyEl.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 10. Ambient Rain Canvas Particle System (AJUSTADO: líneas más sutiles) ---
const canvas = document.getElementById('ambient-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class RainDrop {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -Math.random() * 80 - 20;
            // Longitud más contenida: 20px a 45px
            this.length = Math.random() * 25 + 20;
            // Velocidad suave pero visible: 8 a 16
            this.speed = Math.random() * 8 + 8;
            // Opacidad más discreta: 0.3 a 0.65
            this.opacity = Math.random() * 0.35 + 0.3;
            // Grosor más fino: 0.6px a 1.4px
            this.width = Math.random() * 0.8 + 0.6;
        }

        update() {
            this.y += this.speed;
            this.x += 0.4; // desplazamiento lateral más leve

            if (this.y > height || this.x > width + 40) {
                this.reset();
            }
        }

        draw() {
            const isLightTheme = bodyEl.classList.contains('light-theme');
            
            let gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.length);
            if (isLightTheme) {
                gradient.addColorStop(0, `rgba(124, 58, 237, 0)`);
                gradient.addColorStop(0.6, `rgba(37, 99, 235, ${this.opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(124, 58, 237, ${this.opacity})`);
            } else {
                gradient.addColorStop(0, `rgba(139, 92, 246, 0)`);
                gradient.addColorStop(0.5, `rgba(139, 92, 246, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(59, 130, 246, ${this.opacity})`);
            }

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.width;
            ctx.lineCap = 'round';
            // Sombra más tenue
            ctx.shadowBlur = 2;
            ctx.shadowColor = isLightTheme ? 'rgba(37, 99, 235, 0.2)' : 'rgba(139, 92, 246, 0.3)';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + (this.length * 0.06), this.y + this.length);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    // Densidad alta pero con trazo fino: máximo 200 gotas
    const maxDrops = Math.min(Math.floor(width / 8), 200);
    const drops = [];
    for (let i = 0; i < maxDrops; i++) {
        drops.push(new RainDrop());
    }

    const animateRain = () => {
        ctx.clearRect(0, 0, width, height);
        drops.forEach(drop => {
            drop.update();
            drop.draw();
        });
        requestAnimationFrame(animateRain);
    };

    animateRain();
}

    // --- 11. Contact Form submission to WhatsApp ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const projectTypeSelect = document.getElementById('form-project');
            const projectType = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;
            const msg = document.getElementById('form-msg').value;

            let waFormMsg = `¡Hola WebSis Digital Ai! Te envío mis datos de contacto desde la web:\n\n`;
            waFormMsg += `*Nombre:* ${name}\n`;
            waFormMsg += `*WhatsApp:* ${phone}\n`;
            waFormMsg += `*Proyecto de Interés:* ${projectType}\n`;
            waFormMsg += `*Detalle de la idea:* ${msg}`;

            const formWaUrl = `https://wa.me/51900000000?text=${encodeURIComponent(waFormMsg)}`;
            window.open(formWaUrl, '_blank');
            
            contactForm.reset();
        });
    }
});