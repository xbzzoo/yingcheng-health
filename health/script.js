// 语言切换功能
let currentLang = localStorage.getItem('language') || 'zh';

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    // 更新HTML lang属性
    const langMap = { zh: 'zh-CN', en: 'en', es: 'es' };
    document.documentElement.lang = langMap[lang] || 'zh-CN';

    // 更新所有带有data-zh, data-en, data-es属性的元素
    document.querySelectorAll('[data-zh][data-en]').forEach(element => {
        const zhText = element.getAttribute('data-zh');
        const enText = element.getAttribute('data-en');
        const esText = element.getAttribute('data-es');

        let text;
        if (lang === 'zh') {
            text = zhText;
        } else if (lang === 'es' && esText) {
            text = esText;
        } else {
            text = enText;
        }

        // 检查是否包含HTML标签
        if (text && (text.includes('<br>') || text.includes('<strong>') || text.includes('<em>'))) {
            element.innerHTML = text;
        } else if (text) {
            element.textContent = text;
        }
    });

    // 更新innerHTML包含HTML标签的元素
    document.querySelectorAll('[data-zh-html][data-en-html]').forEach(element => {
        if (lang === 'zh') {
            element.innerHTML = element.getAttribute('data-zh-html');
        } else if (lang === 'es' && element.hasAttribute('data-es-html')) {
            element.innerHTML = element.getAttribute('data-es-html');
        } else {
            element.innerHTML = element.getAttribute('data-en-html');
        }
    });

    // 更新语言切换按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 更新页面标题
    const titles = {
        zh: '境医应承健康 - 24h同性陪诊服务 | 专业医疗陪诊团队',
        en: 'YingCheng Health - 24h Same-Gender Medical Companion | Professional Medical Team',
        es: 'YingCheng Health - Servicio de Acompañamiento Médico 24h | Equipo Médico Profesional'
    };
    document.title = titles[lang] || titles.zh;
}

document.addEventListener('DOMContentLoaded', () => {
    // 初始化语言
    switchLanguage(currentLang);

    // 语言切换按钮事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // 移动端菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // 切换图标
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 点击链接后自动关闭菜单
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滚动时导航栏样式变化
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 表单提交处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');

            // 这里可以添加实际的表单提交逻辑
            // 例如发送到服务器或显示成功消息
            const successMsg = currentLang === 'zh'
                ? `感谢您的咨询，${name}！我们会尽快与您联系。\n\n联系电话：${phone}\n邮箱：${email}`
                : `Thank you for your consultation, ${name}! We will contact you soon.\n\nPhone: ${phone}\nEmail: ${email}`;
            alert(successMsg);

            // 重置表单
            this.reset();
        });
    }

    // 添加滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.service-card, .package-card, .team-member-card, .value-card, .process-step, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 团队风采跑马灯滚动动画
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.team-animate').forEach(el => {
        teamObserver.observe(el);
    });

    // 委托人合影轮播
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentSlide = 0;
        let autoPlayTimer = null;

        function goToSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            startAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            startAutoPlay();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.dataset.index));
                startAutoPlay();
            });
        });

        // 鼠标悬停暂停自动播放
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // 滚动进入视口时启动
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        }, { threshold: 0.15 });

        carouselObserver.observe(carousel);
    }

    // 跨境陪诊卡片堆叠轮播
    const cardStack = document.getElementById('escortCardStack');
    if (cardStack) {
        const stackCards = cardStack.querySelectorAll('.stack-card');
        let activeCard = 0;
        let stackTimer = null;

        function cycleCards() {
            stackCards.forEach((card, i) => {
                card.classList.remove('active');
                // 重置位置
                card.style.zIndex = '';
                card.style.transform = '';
                card.style.top = '';
                card.style.left = '';
                card.style.filter = '';
            });

            activeCard = (activeCard + 1) % stackCards.length;

            // 重新分配卡片位置
            stackCards.forEach((card, i) => {
                const offset = (i - activeCard + stackCards.length) % stackCards.length;
                if (offset === 0) {
                    card.classList.add('active');
                } else if (offset === 1) {
                    card.style.zIndex = '2';
                    card.style.top = '15px';
                    card.style.left = '5%';
                    card.style.transform = 'rotate(2deg) scale(0.96)';
                    card.style.filter = 'brightness(0.92)';
                } else {
                    card.style.zIndex = '1';
                    card.style.top = '30px';
                    card.style.left = '0%';
                    card.style.transform = 'rotate(-4deg) scale(0.92)';
                    card.style.filter = 'brightness(0.85)';
                }
            });
        }

        function startStackAuto() {
            if (stackTimer) clearInterval(stackTimer);
            stackTimer = setInterval(cycleCards, 3000);
        }

        function stopStackAuto() {
            if (stackTimer) clearInterval(stackTimer);
        }

        // 点击卡片切换
        stackCards.forEach((card, i) => {
            card.addEventListener('click', () => {
                activeCard = (i - 1 + stackCards.length) % stackCards.length;
                cycleCards();
                startStackAuto();
            });
        });

        // 鼠标悬停暂停
        cardStack.parentElement.addEventListener('mouseenter', stopStackAuto);
        cardStack.parentElement.addEventListener('mouseleave', startStackAuto);

        // 进入视口时启动
        const stackObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startStackAuto();
                } else {
                    stopStackAuto();
                }
            });
        }, { threshold: 0.2 });

        stackObserver.observe(cardStack);
    }

    // 图片懒加载处理
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    // 观察所有懒加载图片
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
});
