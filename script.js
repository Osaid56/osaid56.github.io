/* ==========================================================================
   OSAID SHAHID - PORTFOLIO INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. AMBIENT CANVAS PARTICLE MESH */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 22), 60);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1
            });
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function animateCanvas() {
            if (document.hidden) {
                requestAnimationFrame(animateCanvas);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const nodeColor = isDark ? 'rgba(218, 107, 70, 0.4)' : 'rgba(200, 90, 54, 0.3)';
            const lineColor = isDark ? 'rgba(218, 107, 70, 0.08)' : 'rgba(200, 90, 54, 0.06)';

            const maxDistSq = 14400; // 120 * 120

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.fill();

                // Fast squared distance calculation (no Math.hypot overhead)
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDistSq) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    /* 2. DYNAMIC SMART AUTO-HIDING NAVBAR ON SCROLL */
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 20) {
            // At top of page
            navbar.classList.remove('nav-hidden');
            navbar.classList.remove('nav-scrolled');
        } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
            // Scrolling DOWN -> Hide Navbar smoothly out of view
            navbar.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY) {
            // Scrolling UP -> Reveal Navbar smoothly with glass glow
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-scrolled');
        }

        lastScrollY = currentScrollY;
    });

    /* 3. THEME TOGGLE */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('osaid_theme', newTheme);
        });

        const savedTheme = localStorage.getItem('osaid_theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }



    /* 3. TERMINAL CLI ENGINE */
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    const termCommands = {
        help: () => `Available commands:<br>
          <span class="hl-cyan">whoami</span>       - Summary of Osaid Shahid<br>
          <span class="hl-cyan">skills</span>       - List top technical skills<br>
          <span class="hl-cyan">exp</span>          - View career history & companies<br>
          <span class="hl-cyan">certs</span>        - List Google & technical certifications<br>
          <span class="hl-cyan">de</span>           - Switch portfolio to German mode<br>
          <span class="hl-cyan">clear</span>        - Clear terminal screen<br>
          <span class="hl-cyan">contact</span>      - Show direct email and phone`,

        whoami: () => `Osaid Shahid | App & Cloud Technical Support Analyst @ Accenture<br>
          Experience: 4+ Years Enterprise IT & Support<br>
          Focus: Azure AD / Entra ID, ServiceNow ITIL, German Client Communication (C1)`,

        skills: () => `TOP SKILLS MATRIX:<br>
          [IAM] Microsoft Entra ID (Azure AD), Active Directory, RBAC Governance<br>
          [Cloud] Azure, Intune, M365 Admin Center, VPN / DHCP<br>
          [ITSM] ServiceNow, Confluence, Bomgar, ITIL Framework<br>
          [Accessibility] WCAG 2.1, NVDA, BeMyEyes, Accessibility Insights`,

        exp: () => `CAREER HIGHLIGHTS:<br>
          1. <span class="hl-gold">Accenture</span> (11/2024–Present): App/Cloud Support Analyst (Gurugram)<br>
          2. <span class="hl-gold">ITC Infotech</span> (04/2024–11/2024): Senior Systems Admin (Bengaluru)<br>
          3. <span class="hl-gold">Wipro Limited</span> (12/2021–09/2023): Senior Associate German Support (Hyderabad)`,

        certs: () => `CERTIFICATIONS:<br>
          - Google IT Support Professional Certification<br>
          - Technical Support Fundamentals (Google)<br>
          - Bits and Bytes of Computer Networking (Google)<br>
          - Testing for Web Accessibility (Accessibility Insights)`,

        de: () => {
            toggleLanguage('DE');
            return `<span class="hl-green">Erfolgreich auf Deutsch umgestellt! (C1 Modus aktiviert)</span>`;
        },

        contact: () => `DIRECT CONTACT:<br>
          Email: <span class="hl-cyan">osaidtheshahid@gmail.com</span><br>
          Phone: <span class="hl-gold">+91 8448527162</span><br>
          Location: Gurugram / Mau, India`,

        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        }
    };

    window.executeTermCmd = function(cmdStr) {
        if (!terminalOutput) return;
        const cmd = cmdStr.trim().toLowerCase();
        
        // Append input line
        const inputLine = document.createElement('div');
        inputLine.className = 'term-line prompt-line';
        inputLine.innerHTML = `<span class="prompt">osaid@cloud-sys:~$</span> <span class="cmd">${cmdStr}</span>`;
        terminalOutput.appendChild(inputLine);

        if (termCommands[cmd]) {
            const res = termCommands[cmd]();
            if (res) {
                const outLine = document.createElement('div');
                outLine.className = 'term-line output';
                outLine.innerHTML = res;
                terminalOutput.appendChild(outLine);
            }
        } else {
            const errLine = document.createElement('div');
            errLine.className = 'term-line output hl-red';
            errLine.innerHTML = `Command not recognized: '${cmd}'. Type <span class="hl-cyan">'help'</span> for list of commands.`;
            terminalOutput.appendChild(errLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && terminalInput.value.trim() !== '') {
                const val = terminalInput.value;
                terminalInput.value = '';
                executeTermCmd(val);
            }
        });
    }

    /* 4. SKILLS FILTERING */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.getAttribute('data-filter');
            skillCards.forEach(card => {
                if (cat === 'all' || card.getAttribute('data-category') === cat || card.getAttribute('data-category') === 'all') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* 6. SCROLL OBSERVER FOR ANIMATIONS & NAVBAR ACTIVE STATES */
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-right, .reveal-left');
    revealElements.forEach(el => {
        revealObserver.observe(el);
        // Activate immediately if within initial viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('active');
        }
    });

    // Performant Active Nav Link Tracking using IntersectionObserver (No scroll lag)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Smooth scroll for nav anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* 7. MODALS & TOAST NOTIFICATIONS */
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeModal');
    const closeResumeBtn = document.getElementById('closeResumeModal');
    const closeResumeBtn2 = document.getElementById('closeResumeModalBtn');

    if (openResumeBtn && resumeModal) {
        openResumeBtn.addEventListener('click', () => resumeModal.classList.add('active'));
    }
    if (closeResumeBtn) closeResumeBtn.addEventListener('click', () => resumeModal.classList.remove('active'));
    if (closeResumeBtn2) closeResumeBtn2.addEventListener('click', () => resumeModal.classList.remove('active'));

    // Mobile menu drawer
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(l => {
            l.addEventListener('click', () => mobileDrawer.classList.remove('active'));
        });
    }

    // Contact Profile Button
    const profileContactBtn = document.getElementById('profileContactBtn');
    if (profileContactBtn) {
        profileContactBtn.addEventListener('click', () => {
            const contactSec = document.getElementById('contact');
            if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Contact Form Submit Handler & Discord Notification
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name') ? document.getElementById('name').value : 'Anonymous';
            const email = document.getElementById('email') ? document.getElementById('email').value : 'No email';
            const subject = document.getElementById('subject') ? document.getElementById('subject').value : 'General Inquiry';
            const message = document.getElementById('message') ? document.getElementById('message').value : '';

            sendDiscordContactNotification({ name, email, subject, message });
            showToast('Message sent! Osaid Shahid will get back to you shortly.');
            contactForm.reset();
        });
    }

    // Clipboard Copy Helper
    window.copyToClipboard = function(text, successMsg) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg || 'Copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy');
        });
    };

    // Toast Container Function
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="check-circle"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    /* 8. DISCORD WEBHOOK INTEGRATION */
    window.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1530309470486528034/ns1ellxTTwCESUG4oehozVIH7oBPLCQRAFScbHUsuUQhTMvtFwzL7_ajPoaR00WbHTtw';

    async function sendDiscordVisitorNotification() {
        if (!window.DISCORD_WEBHOOK_URL) return;

        try {
            let geo = {
                ip: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                country_name: 'Unknown',
                postal: 'Unknown',
                org: 'Unknown',
                timezone: 'Unknown',
                latitude: '',
                longitude: ''
            };

            try {
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    geo = { ...geo, ...data };
                }
            } catch (e) {
                try {
                    const res2 = await fetch('https://api.ipify.org?format=json');
                    if (res2.ok) {
                        const d2 = await res2.json();
                        geo.ip = d2.ip;
                    }
                } catch (e2) {}
            }

            // Browser & Device Telemetry
            const userAgent = navigator.userAgent;
            const platform = navigator.platform || 'Unknown';
            const language = navigator.language || (navigator.languages ? navigator.languages[0] : 'Unknown');
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || geo.timezone || 'Unknown';
            const localTime = new Date().toLocaleString('en-US', { timeZone: timeZone !== 'Unknown' ? timeZone : undefined });
            
            const screenRes = `${window.screen.width} x ${window.screen.height}`;
            const viewportSize = `${window.innerWidth} x ${window.innerHeight}`;
            const colorDepth = `${window.screen.colorDepth}-bit`;
            const pixelRatio = `${window.devicePixelRatio || 1}x`;
            const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Unknown';
            const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : 'Unknown';
            const touchPoints = navigator.maxTouchPoints ? `${navigator.maxTouchPoints} Touch Points` : 'No Touch';
            
            // Connection Info
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const netType = conn ? (conn.effectiveType || conn.type || 'Unknown').toUpperCase() : 'Unknown';
            const netDownlink = conn && conn.downlink ? `${conn.downlink} Mbps` : 'N/A';
            const netLatency = conn && conn.rtt ? `${conn.rtt} ms` : 'N/A';

            const embedPayload = {
                username: "Portfolio Visitor Intelligence Bot",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/919/919827.png",
                embeds: [
                    {
                        title: "🎯 Comprehensive Visitor Telemetry Alert",
                        description: `A new visitor has opened **[${document.title}](${window.location.href})**`,
                        color: 13653038,
                        fields: [
                            { name: "📍 Location & City", value: `${geo.city}, ${geo.region}, ${geo.country_name} (${geo.postal})`, inline: true },
                            { name: "🌐 IP Address", value: `\`${geo.ip}\``, inline: true },
                            { name: "🏢 ISP / Network", value: geo.org, inline: true },
                            
                            { name: "💻 Device / OS Platform", value: `${platform} • ${touchPoints}`, inline: true },
                            { name: "⚙️ CPU & Memory", value: `${cpuCores} • ${deviceMemory}`, inline: true },
                            { name: "🌐 Browser Agent", value: userAgent.substring(0, 120), inline: true },
                            
                            { name: "🖥️ Screen Resolution", value: `${screenRes} (Color: ${colorDepth})`, inline: true },
                            { name: "📐 Viewport Size", value: `${viewportSize} (DPR: ${pixelRatio})`, inline: true },
                            { name: "📡 Network Speed", value: `Type: ${netType} • Down: ${netDownlink} • Ping: ${netLatency}`, inline: true },
                            
                            { name: "🕒 Visitor Local Time", value: `${localTime} (${timeZone})`, inline: true },
                            { name: "🗣️ Preferred Language", value: language, inline: true },
                            { name: "↩️ Traffic Source", value: document.referrer ? `[Referrer](${document.referrer})` : 'Direct Entry / Bookmark', inline: true }
                        ],
                        footer: { text: "Osaid Shahid Executive Portfolio Telemetry" },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            await fetch(window.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedPayload)
            });
        } catch (err) {
            console.log('Discord webhook notice error:', err);
        }
    }

    async function sendDiscordContactNotification(data) {
        if (!window.DISCORD_WEBHOOK_URL) return;

        try {
            const embedPayload = {
                username: "Portfolio Inquiry Bot",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/919/919827.png",
                embeds: [{
                    title: "📩 New Contact Form Message Received!",
                    color: 1104257,
                    fields: [
                        { name: "👤 Sender Name", value: data.name, inline: true },
                        { name: "✉️ Email", value: data.email, inline: true },
                        { name: "📌 Subject", value: data.subject, inline: true },
                        { name: "💬 Message Content", value: data.message }
                    ],
                    footer: { text: "Osaid Shahid Portfolio • Direct Message Alert" },
                    timestamp: new Date().toISOString()
                }]
            };

            await fetch(window.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedPayload)
            });
        } catch (err) {
            console.log('Discord contact webhook error:', err);
        }
    }

    // Trigger visitor alert on load
    sendDiscordVisitorNotification();

});
