document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Custom Cursor Logic
    const cursorDot = document.getElementById('customCursorDot');
    const cursorOutline = document.getElementById('customCursorOutline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    const speed = 0.15; // Speed multiplier for the cursor outline lag

    // Check if device supports touch
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly position the center dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Frame update loop for trailing effect
        const updateCursor = () => {
            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            
            outlineX += dx * speed;
            outlineY += dy * speed;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(updateCursor);
        };
        requestAnimationFrame(updateCursor);

        // Add hover triggers on interactive components
        const hoverables = document.querySelectorAll('a, button, .project-card, input, select, textarea, .color-btn, .custom-slider');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('custom-cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('custom-cursor-hover');
            });
        });
    }

    // 3. Header Sticky Styling on Scroll
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu Navigation Toggle
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggleBtn && navLinks) {
        mobileToggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            header.classList.toggle('mobile-menu-open');
        });

        // Close menu on clicking link
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                header.classList.remove('mobile-menu-open');
            });
        });
    }

    // 5. Project Filters Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });

    // 6. Light / Dark Theme Toggle Button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // 7. Dynamic Local Time Clock
    const timeText = document.getElementById('localTimeText');
    if (timeText) {
        const updateLocalTime = () => {
            // Using Indian Standard Time format (since the current local time context is UTC+5:30)
            const options = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            const timeString = new Date().toLocaleTimeString('en-US', options);
            timeText.textContent = `India Time: ${timeString}`;
        };
        updateLocalTime();
        setInterval(updateLocalTime, 1000);
    }

    // 8. Contact Form Validator
    const contactForm = document.getElementById('contactForm');
    const successCard = document.getElementById('formSuccessCard');
    const resetFormBtn = document.getElementById('formResetBtn');

    if (contactForm && successCard) {
        const validateForm = () => {
            let isValid = true;
            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const messageInput = document.getElementById('formMessage');

            // Name verification
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('has-error');
            }

            // Email verification
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('has-error');
            }

            // Message verification
            if (messageInput.value.trim() === '') {
                messageInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('has-error');
            }

            return isValid;
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                // Show loading state on button
                const submitBtn = document.getElementById('formSubmitBtn');
                const originalBtnHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending... <i data-lucide="loader-2" class="animate-spin"></i>';
                submitBtn.disabled = true;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Build Form Data payload
                const formData = new FormData(contactForm);
                
                // Note: Get your FREE Access Key from https://web3forms.com
                // Paste your key below where it says 'YOUR_ACCESS_KEY_HERE'
                formData.append("access_key", "d40f3c01-c6d4-4900-bfbe-52e887e35b80");

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(async (response) => {
                    let resJson = await response.json();
                    if (response.status === 200) {
                        // Success state transition
                        successCard.classList.add('active');
                        contactForm.style.opacity = '0';
                        contactForm.reset();
                    } else {
                        console.error(resJson);
                        alert("Submission Error: " + resJson.message);
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert("Submission failed. Please check your internet connection.");
                })
                .finally(() => {
                    // Restore button
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                });
            }
        });


        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                successCard.classList.remove('active');
                contactForm.style.opacity = '1';
            });
        }
    }

    // 9. Case Studies Dynamic Data & Modal
    const caseStudies = {
        brownway: {
            title: "Brownway — Logistic Solutions & Route Tracker",
            subtitle: "Distilling driver tracking and terminal operations into a unified mobile tool",
            tags: ["Mobile UX/UI", "Logistics Tech", "Product Design"],
            image: "assets/Brownway Project Case Study.png",
            client: "Brownway Logistics Group",
            role: "Lead UI/UX Designer",
            timeline: "5 Months (2025)",
            challenge: "Drivers and dispatchers had to coordinate across multiple messaging groups, printed route sheets, and distinct terminal logging portals, leading to delivery delays and high operational overhead.",
            research: "We mapped the day-to-day operations of 12 long-haul transit drivers. We found that data-logging while driving was unsafe, and communication with dispatchers was fragmented. Users needed a single tap route updater with offline support.",
            solution: "I designed a high-contrast dark UI optimized for in-vehicle dashboards. Large typography, clear primary actions, and single-tap status logging (like 'Arrived', 'Unloading') streamlined drivers' tasks. It integrates live map routing and automated delay reports.",
            outcomes: [
                {
                    title: "Reduced Transit Delays",
                    desc: "Interactive navigation and dispatch updates reduced average transit delay metrics by 25%."
                },
                {
                    title: "High Driver Adoption Rate",
                    desc: "Minimal learning curve and simplified inputs resulted in a 100% adoption rate among transit workers."
                },
                {
                    title: "Simplified Reporting",
                    desc: "Auto-logging and offline support eliminated manual paperwork errors completely."
                }
            ]
        },
        wallet: {
            title: "Fintech Wallet — Expense Tracker & Payment Hub",
            subtitle: "A modern approach to multi-asset banking, billing, and expenses tracking",
            tags: ["Fintech App", "iOS UI Design", "Micro-interactions"],
            image: "assets/Final_Wallet Case Study.png",
            clientLabel: "Company",
            client: "In-house Product",
            role: "Senior Product Designer",
            timeline: "4 Months (2025)",
            challenge: "Traditional mobile banking apps suffer from cluttered layouts, confusing charge descriptions, and separate card management screens, causing friction for daily transaction tracking.",
            research: "Conducted usability testing with 20 college students and young professionals. Identified that split billing and instant category-based budget visualizers were the most desired but worst implemented features.",
            solution: "Designed a clean mobile wallet utilizing high-end frosted-glass card views, drag-and-drop peer transfers, and interactive graphical budget summaries. Used micro-interactions to make transfers feel responsive and instant.",
            outcomes: [
                {
                    title: "High App Store Rating",
                    desc: "Launch achieved a 4.8 user rating on the iOS App Store within the first two weeks of release."
                },
                {
                    title: "Increased Peer Transactions",
                    desc: "Frictionless drag-and-drop mechanics drove a 35% increase in split-bill utility transactions."
                },
                {
                    title: "Design System Optimization",
                    desc: "Mapped all typography and button states to standard design system tokens for rapid scaling."
                }
            ]
        },
        edusmart: {
            title: "Edu Smart — Student Progress & Course Center",
            subtitle: "Simplifying online learning tracker, calendars, and assignments systems",
            tags: ["Web Dashboard", "EdTech Portal", "SaaS UI"],
            image: "assets/Edu Smart Case study.png",
            client: "EduSmart Academy Ltd.",
            role: "Product Designer",
            timeline: "3 Months (2026)",
            challenge: "Students felt overwhelmed by fragmented assignment deadlines, separate video links, and disjointed progress charts across different courses.",
            research: "Interviews with teachers and students revealed that progress bars and clear deadline priorities directly correlated with course completion rates. Clear checklist systems reduced stress.",
            solution: "Created an integrated student workspace with dynamic progress cards, upcoming class alerts, calendar widgets, and quick-access course folders. Kept colors vibrant yet clean.",
            outcomes: [
                {
                    title: "Higher Course Completions",
                    desc: "Visually prioritising upcoming due dates increased course completion rates by 50%."
                },
                {
                    title: "High User Satisfaction",
                    desc: "Post-release surveys showed 92% positive usability feedback from active students."
                },
                {
                    title: "Fewer Support Queries",
                    desc: "Self-explanatory course onboarding guides reduced student dashboard support tickets by 40%."
                }
            ]
        },
        sstech: {
            title: "SSTech System Solutions — Website Redesign",
            subtitle: "Redesigning the official corporate website for modern B2B SaaS aesthetics and lead conversion",
            tags: ["Web Redesign", "B2B Enterprise Portal", "UX Design System"],
            image: "assets/SSTech_Casestudy.jpg",
            client: "SSTech System Solutions",
            role: "Lead Product Designer",
            timeline: "10 Months (2025 - 2026)",
            challenge: "The official SSTech corporate website suffered from outdated visual aesthetics, inconsistent layout styling, and unstructured service page layouts, resulting in low B2B engagement and slow developer handoff times.",
            research: "Through user research and competitor analysis, we mapped out that corporate leads sought clear technology stack indices, organized service offerings, and streamlined contact paths. Maintaining 100% design-to-code alignment was critical.",
            solution: "Designed fully responsive, high-fidelity dark glassmorphic layouts, customized tech stack visuals, and built a comprehensive Figma auto-layout library mapped directly to developer styles to ensure rapid dev cycles.",
            outcomes: [
                {
                    title: "Increased User Engagement",
                    desc: "Interactive visual flows and restructured journeys contributed to a 5x increase in target user session duration."
                },
                {
                    title: "Optimized Developer Cycles",
                    desc: "Scalable design systems and component-driven Figma handoffs cut down UI dev coding time by 40%."
                },
                {
                    title: "Improved Lead Inquiries",
                    desc: "Re-architected service categories and CTA placements transformed the website into a high-converting B2B tool."
                }
            ]
        }
    };

    const caseStudyModal = document.getElementById('caseStudyModal');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    if (caseStudyModal && modalBody && modalCloseBtn) {
        // Function to render and open modal
        const openCaseStudy = (projectId) => {
            const data = caseStudies[projectId];
            if (!data) return;

            // Generate content HTML
            let contentHtml = `
                <div class="cs-hero">
                    <div class="cs-tags">
                        ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <h1 class="cs-title">${data.title}</h1>
                    <p class="hero-subtitle">${data.subtitle}</p>
                    
                    <div class="cs-meta">
                        <div class="cs-meta-item">
                            <span>${data.clientLabel || 'Client'}</span>
                            <p>${data.client}</p>
                        </div>
                        <div class="cs-meta-item">
                            <span>My Role</span>
                            <p>${data.role}</p>
                        </div>
                        <div class="cs-meta-item">
                            <span>Timeline</span>
                            <p>${data.timeline}</p>
                        </div>
                    </div>
                </div>
            `;

            // If image exists, render it
            if (data.image) {
                contentHtml += `
                    <img src="${data.image}" alt="${data.title} Presentation Mockup" class="cs-main-img">
                `;
            } else {
                contentHtml += `
                    <div class="cs-main-img" style="aspect-ratio: 16/9; background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); display:flex; align-items:center; justify-content:center;">
                        <i data-lucide="layers" style="width: 80px; height: 80px; color: var(--theme-accent); opacity: 0.8;"></i>
                    </div>
                `;
            }

            contentHtml += `
                <div class="cs-section">
                    <div class="cs-grid">
                        <h3>The Challenge</h3>
                        <div>
                            <p>${data.challenge}</p>
                        </div>
                    </div>
                    
                    <div class="cs-grid">
                        <h3>Research & UX Discovery</h3>
                        <div>
                            <p>${data.research}</p>
                        </div>
                    </div>

                    <div class="cs-grid">
                        <h3>High-Fi Solution</h3>
                        <div>
                            <p>${data.solution}</p>
                        </div>
                    </div>

                    <div class="cs-grid">
                        <h3>Outcomes & Metrics</h3>
                        <div>
                            <ul class="cs-insight-list">
                                ${data.outcomes.map(o => `
                                    <li>
                                        <i data-lucide="trending-up"></i>
                                        <div>
                                            <h5>${o.title}</h5>
                                            <p>${o.desc}</p>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            modalBody.innerHTML = contentHtml;
            caseStudyModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Reinitialize Lucide Icons inside modal
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        };

        // Bind clicks to cards
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                if (projectId && (projectId.startsWith('http://') || projectId.startsWith('https://'))) {
                    window.open(projectId, '_blank', 'noopener,noreferrer');
                    return;
                }
                openCaseStudy(projectId);
            });
        });

        // Close functions
        const closeModal = () => {
            caseStudyModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modalCloseBtn.addEventListener('click', closeModal);
        caseStudyModal.addEventListener('click', (e) => {
            if (e.target === caseStudyModal) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && caseStudyModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 10. Background drift based on cursor movement
    const glowBlob1 = document.getElementById('glowBlob1');
    const glowBlob2 = document.getElementById('glowBlob2');
    const glowBlob3 = document.getElementById('glowBlob3');

    if (!isTouchDevice && glowBlob1 && glowBlob2 && glowBlob3) {
        document.addEventListener('mousemove', (e) => {
            const xOffset = (e.clientX - window.innerWidth / 2) * 0.03;
            const yOffset = (e.clientY - window.innerHeight / 2) * 0.03;

            glowBlob1.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            glowBlob2.style.transform = `translate(${-xOffset}px, ${-yOffset}px)`;
            glowBlob3.style.transform = `translate(${xOffset * 0.5}px, ${-yOffset * 0.5}px)`;
        });
    }

    // 11. Interactive Figma Mockup: Design/Dev Mode, Hotspots, and Multiplayer Cursor
    const btnDesignMode = document.getElementById('btnDesignMode');
    const btnDevMode = document.getElementById('btnDevMode');
    const figmaWorkspace = document.getElementById('figmaWorkspace');
    const figmaCanvas = document.getElementById('figmaCanvas');
    const figmaCursor = document.getElementById('figmaCursor');
    const hotspotDetailsCard = document.getElementById('hotspotDetailsCard');
    const hotspotTitle = document.getElementById('hotspotTitle');
    const hotspotDesc = document.getElementById('hotspotDesc');
    const hotspotCloseBtn = document.getElementById('hotspotCloseBtn');
    const hotspots = document.querySelectorAll('.canvas-hotspot');

    if (btnDesignMode && btnDevMode && figmaWorkspace) {
        // Toggle to Design Mode
        btnDesignMode.addEventListener('click', () => {
            btnDesignMode.classList.add('active');
            btnDevMode.classList.remove('active');
            figmaWorkspace.classList.remove('dev-mode-active');
            if (hotspotDetailsCard) hotspotDetailsCard.classList.remove('active');
        });

        // Toggle to Dev Mode
        btnDevMode.addEventListener('click', () => {
            btnDevMode.classList.add('active');
            btnDesignMode.classList.remove('active');
            figmaWorkspace.classList.add('dev-mode-active');
            if (hotspotDetailsCard) hotspotDetailsCard.classList.remove('active');
        });
    }

    // Hotspot Data
    const hotspotData = {
        "1": {
            title: "Instant Send Onboarding",
            desc: "<strong>Challenge:</strong> High user drop-off on transfer confirmations.<br><strong>UX Resolution:</strong> Implemented swift gesture-based swipe and success micro-feedback.<br><strong>Metric:</strong> Increased completed transactions by 22%."
        },
        "2": {
            title: "Dynamic Payment Hub",
            desc: "<strong>Challenge:</strong> Cluttered banking expense layouts.<br><strong>UX Resolution:</strong> Designed auto-categorizing graphical budget summary cards.<br><strong>Metric:</strong> Boosted app engagement by 18%."
        },
        "3": {
            title: "Smart Animate Flow",
            desc: "<strong>Challenge:</strong> High page-transition user friction.<br><strong>UX Resolution:</strong> Structured animation bezier tokens to map 1:1 with standard native iOS spring curves.<br><strong>Metric:</strong> Reduced perceived loading delay by 30%."
        }
    };

    if (hotspots && hotspotDetailsCard && hotspotTitle && hotspotDesc) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering any canvas clicks
                const id = hotspot.getAttribute('data-hotspot');
                const data = hotspotData[id];
                if (data) {
                    hotspotTitle.innerHTML = data.title;
                    hotspotDesc.innerHTML = data.desc;
                    hotspotDetailsCard.classList.add('active');
                }
            });
        });

        if (hotspotCloseBtn) {
            hotspotCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hotspotDetailsCard.classList.remove('active');
            });
        }

        // Close details if user clicks anywhere else on the canvas
        if (figmaCanvas) {
            figmaCanvas.addEventListener('click', (e) => {
                if (!e.target.closest('.canvas-hotspot') && !e.target.closest('#hotspotDetailsCard')) {
                    hotspotDetailsCard.classList.remove('active');
                }
            });
        }
    }

    // Multiplayer Cursor Tracking
    if (!isTouchDevice && figmaCanvas && figmaCursor) {
        figmaCanvas.addEventListener('mousemove', (e) => {
            figmaCanvas.classList.add('mouse-active');
            const rect = figmaCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Constrain coordinates within canvas
            const posX = Math.max(0, Math.min(x, rect.width));
            const posY = Math.max(0, Math.min(y, rect.height));

            figmaCursor.style.left = `${posX}px`;
            figmaCursor.style.top = `${posY}px`;
        });

        figmaCanvas.addEventListener('mouseleave', () => {
            figmaCanvas.classList.remove('mouse-active');
            // Reset to default styling (which allows CSS animation to take back control)
            figmaCursor.style.left = '';
            figmaCursor.style.top = '';
        });
    }

    // 12. Project Gallery Marquee Scroll Controls (Autoplay + Arrow Navigation)
    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeTrack = document.querySelector('.marquee-track');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');

    if (marqueeContainer && marqueeTrack) {
        const marqueeList = marqueeTrack.querySelector('.marquee-list');
        let listWidth = marqueeList.getBoundingClientRect().width;
        let scrollSpeed = 0.8; // px per frame
        let isPaused = false;
        let scrollPos = 0;
        let resumeTimeout = null;

        // Recalculate list width on resize and window load
        const updateListWidth = () => {
            listWidth = marqueeList.getBoundingClientRect().width;
        };
        window.addEventListener('resize', updateListWidth);
        window.addEventListener('load', updateListWidth);

        const step = () => {
            if (listWidth === 0) {
                listWidth = marqueeList.getBoundingClientRect().width;
            }
            if (!isPaused) {
                scrollPos += scrollSpeed;
                if (listWidth > 0 && scrollPos >= listWidth) {
                    scrollPos = 0;
                }
                marqueeContainer.scrollLeft = scrollPos;
            } else {
                // Keep scrollPos updated with manual scrolls
                scrollPos = marqueeContainer.scrollLeft;
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);

        // Pause on mouse hover, resume on leave
        marqueeContainer.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        marqueeContainer.addEventListener('mouseleave', () => {
            if (!resumeTimeout) {
                isPaused = false;
            }
        });

        // Touch support for mobile: pause autoplay on scroll
        marqueeContainer.addEventListener('touchstart', () => {
            isPaused = true;
        });
        marqueeContainer.addEventListener('touchend', () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isPaused = false;
                resumeTimeout = null;
            }, 3000);
        });

        // Manual button controls
        const slideDistance = 350; // Scroll amount on click

        const handleManualScroll = (direction) => {
            isPaused = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);

            if (listWidth === 0) {
                listWidth = marqueeList.getBoundingClientRect().width;
            }

            const currentScroll = marqueeContainer.scrollLeft;
            // Right button (next) moves projects to the right (-), Left button (prev) moves projects to the left (+)
            let targetScroll = direction === 'next' ? currentScroll - slideDistance : currentScroll + slideDistance;

            if (listWidth > 0) {
                // Handle boundary wrapping for manual scrolling
                if (targetScroll >= listWidth * 2 - marqueeContainer.clientWidth) {
                    targetScroll = targetScroll - listWidth;
                    marqueeContainer.scrollLeft = marqueeContainer.scrollLeft - listWidth;
                } else if (targetScroll < 0) {
                    targetScroll = targetScroll + listWidth;
                    marqueeContainer.scrollLeft = marqueeContainer.scrollLeft + listWidth;
                }
            }

            marqueeContainer.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });

            // Resume autoplay after 4 seconds of inactivity
            resumeTimeout = setTimeout(() => {
                isPaused = false;
                resumeTimeout = null;
            }, 4000);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => handleManualScroll('next'));
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => handleManualScroll('prev'));
        }
    }

    // Protect entire document from right-click for image/content protection
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    // Prevent image dragging
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
    // Disable common developer keys to prevent Inspect Element
    document.addEventListener('keydown', function(e) {
        // Disable F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element selection)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
        }
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
        }
    });

});
