// script.js - Beres! Car Wash Jogja
document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTS ===
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const cardOverlays = document.querySelectorAll('.card-click-overlay');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const videoLightbox = document.getElementById('video-lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-nav.prev');
    const lightboxNext = document.querySelector('.lightbox-nav.next');

    // Daftar video untuk navigasi lightbox
    const videos = [];
    for (const thumb of videoThumbnails) {
        videos.push(thumb.dataset.videoSrc);
    }
    let currentVideoIndex = 0;

    // === HAMBURGER MENU ===
    const toggleMenu = () => {
        if (!hamburger || !navMenu) return;
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
        
        // Toggle body scroll
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Tutup menu saat klik link
    for (const link of navLinks) {
        link.addEventListener('click', () => {
            if (navMenu?.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // === MODAL HANDLERS ===
    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openModal = (targetModal) => {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reset tabs di modal ke tab pertama
        resetModalTabs(targetModal);
    };

    for (const overlay of cardOverlays) {
        overlay.addEventListener('click', () => {
            const targetId = overlay.dataset.modalTarget;
            const targetModal = document.querySelector(targetId);
            if (targetModal) {
                openModal(targetModal);
            }
        });
    }

    for (const btn of modalCloses) {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    }

    for (const modal of modals) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }

    // === TAB HANDLERS ===
    // Function to reset modal tabs to first tab
    const resetModalTabs = (modalElement) => {
        // Reset primary tabs
        const primaryTabs = modalElement.querySelectorAll('.modal-tab-button');
        const primaryPanes = modalElement.querySelectorAll('.modal-tab-pane');
        
        if (primaryTabs.length > 0 && primaryPanes.length > 0) {
            // Activate first tab
            for (const tab of primaryTabs) {
                tab.classList.remove('active');
            }
            primaryTabs[0].classList.add('active');
            
            // Show first pane
            for (const pane of primaryPanes) {
                pane.classList.remove('active');
            }
            primaryPanes[0].classList.add('active');
        }
        
        // Reset detailing subtabs if exists
        const detailingSubtabs = modalElement.querySelectorAll('.detailing-subtab-button');
        const detailingPanes = modalElement.querySelectorAll('.detailing-subtab-pane');
        
        if (detailingSubtabs.length > 0 && detailingPanes.length > 0) {
            for (const tab of detailingSubtabs) {
                tab.classList.remove('active');
            }
            detailingSubtabs[0].classList.add('active');
            
            for (const pane of detailingPanes) {
                pane.classList.remove('active');
            }
            detailingPanes[0].classList.add('active');
        }
    };

    // Function to handle tab switching - REFACTORED FOR LOWER COGNITIVE COMPLEXITY
    const switchTab = (button) => {
        const targetId = button.dataset.target;
        if (!targetId) return;

        const targetPane = document.querySelector(targetId);
        if (!targetPane) return;

        // Get tab configuration based on button type
        const tabConfig = getTabConfig(button);
        if (!tabConfig) return;

        // Update tab buttons
        updateActiveTabButton(tabConfig.tabGroup, button);
        
        // Update panes
        updateActivePane(tabConfig.paneContainer, tabConfig.paneSelector, targetPane);
    };

    // Helper function to get tab configuration
    const getTabConfig = (button) => {
        if (button.classList.contains('modal-tab-button')) {
            return {
                tabGroup: button.closest('.modal-tabs'),
                paneContainer: button.closest('.modal-content'),
                paneSelector: '.modal-tab-pane'
            };
        } else if (button.classList.contains('testimonial-tab-button')) {
            return {
                tabGroup: button.closest('.testimonial-tabs'),
                paneContainer: document.querySelector('.testimonial-content'),
                paneSelector: '.testimonial-pane'
            };
        } else if (button.classList.contains('tab-button')) {
            return {
                tabGroup: button.closest('.location-tabs'),
                paneContainer: document.querySelector('.location-content'),
                paneSelector: '.location-pane'
            };
        }
        return null;
    };

    // Helper function to update active tab button
    const updateActiveTabButton = (tabGroup, activeButton) => {
        if (tabGroup) {
            const allButtons = tabGroup.querySelectorAll('button');
            for (const btn of allButtons) {
                btn.classList.remove('active');
            }
        }
        activeButton.classList.add('active');
    };

    // Helper function to update active pane
    const updateActivePane = (container, paneSelector, targetPane) => {
        if (container) {
            const panesToHide = container.querySelectorAll(paneSelector);
            for (const pane of panesToHide) {
                pane.classList.remove('active');
            }
        }
        targetPane.classList.add('active');
    };

    // Function to handle detailing subtab switching
    const switchDetailingSubtab = (button) => {
        const targetId = button.dataset.subtarget;
        if (!targetId) return;

        const targetPane = document.querySelector(targetId);
        if (!targetPane) return;

        // Get the subtab group
        const subtabGroup = button.closest('.detailing-subtabs');
        if (subtabGroup) {
            // Remove active class from all buttons in the same group
            const allButtons = subtabGroup.querySelectorAll('.detailing-subtab-button');
            for (const btn of allButtons) {
                btn.classList.remove('active');
            }
        }

        // Add active class to clicked button
        button.classList.add('active');

        // Get the container for subtab panes
        const container = button.closest('.detailing-subtab-content');
        if (container) {
            // Hide all panes in the container
            const panesToHide = container.querySelectorAll('.detailing-subtab-pane');
            for (const pane of panesToHide) {
                pane.classList.remove('active');
            }
        }

        // Show target pane
        targetPane.classList.add('active');
    };

    // Initialize tabs on page load
    const initializeTabs = () => {
        // Testimonial tabs
        const testimonialTabs = document.querySelectorAll('.testimonial-tab-button');
        if (testimonialTabs.length > 0) {
            // Activate first tab
            for (const tab of testimonialTabs) {
                tab.classList.remove('active');
            }
            testimonialTabs[0].classList.add('active');
            switchTab(testimonialTabs[0]);
        }
        
        // Location tabs
        const locationTabs = document.querySelectorAll('.tab-button');
        if (locationTabs.length > 0) {
            for (const tab of locationTabs) {
                tab.classList.remove('active');
            }
            locationTabs[0].classList.add('active');
            switchTab(locationTabs[0]);
        }

        // Modal tabs (will be reset when modal opens)
    };

    // Add event listeners to all tab buttons
    const tabButtons = document.querySelectorAll('.modal-tab-button, .testimonial-tab-button, .tab-button');
    for (const button of tabButtons) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(button);
        });
    }

    // Add event listeners to detailing subtab buttons
    const detailingSubtabButtons = document.querySelectorAll('.detailing-subtab-button');
    for (const button of detailingSubtabButtons) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchDetailingSubtab(button);
        });
    }

    // === VIDEO LIGHTBOX ===
    // Function to get video orientation
    const getVideoOrientation = (videoSrc, callback) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
            const isPortrait = video.videoHeight > video.videoWidth;
            callback(isPortrait ? 'portrait' : 'landscape');
            // Clean up
            video.src = '';
            video.load();
        };
        
        video.onerror = () => {
            // Default to landscape if we can't determine
            callback('landscape');
        };
        
        video.src = videoSrc;
    };

    const openLightbox = (src, index) => {
        if (!lightboxVideo || !videoLightbox) return;
        
        // Set current video index
        currentVideoIndex = index;
        
        // Get video orientation and apply appropriate class
        getVideoOrientation(src, (orientation) => {
            // Remove any existing orientation classes
            lightboxVideo.classList.remove('portrait', 'landscape');
            
            // Add the correct orientation class
            lightboxVideo.classList.add(orientation);
            
            // Set video source
            lightboxVideo.src = src;
            
            // Show lightbox
            videoLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Play video
            lightboxVideo.play().catch(e => {
                console.log('Autoplay prevented, user will need to click play');
            });
        });
    };

    const closeLightbox = () => {
        if (!videoLightbox || !lightboxVideo) return;
        
        videoLightbox.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.classList.remove('portrait', 'landscape');
        document.body.style.overflow = '';
    };

    const navigateLightbox = (direction) => {
        if (direction === 'prev') {
            currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
        } else if (direction === 'next') {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        }
        
        openLightbox(videos[currentVideoIndex], currentVideoIndex);
    };

    // Event listeners untuk video lightbox
    for (const [index, thumb] of videoThumbnails.entries()) {
        thumb.addEventListener('click', () => {
            openLightbox(videos[index], index);
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    }

    // Close lightbox when clicking outside the video
    videoLightbox.addEventListener('click', (e) => {
        if (e.target === videoLightbox) {
            closeLightbox();
        }
    });

    // === SCROLL HANDLERS ===
    const setActiveLink = () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
                break;
            }
        }

        for (const link of navLinks) {
            link.classList.remove('active-scroll');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-scroll');
            }
        }
    };

    // === KEYBOARD HANDLERS ===
    document.addEventListener('keydown', (e) => {
        // ESC untuk tutup modal/lightbox
        if (e.key === 'Escape') {
            // Close any open modals
            for (const modal of modals) {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            }
            // Close lightbox if open
            if (videoLightbox.classList.contains('active')) {
                closeLightbox();
            }
        }
        
        // Navigasi lightbox dengan panah
        if (videoLightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
            if (e.key === 'ArrowRight') navigateLightbox('next');
        }
    });

    // === TOUCH SWIPE FOR MOBILE ===
    let touchStartX = 0;
    let touchEndX = 0;

    videoLightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    videoLightbox.addEventListener('touchend', (e) => {
        if (!videoLightbox.classList.contains('active')) return;
        
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50; // Minimum swipe distance
        
        if (touchStartX - touchEndX > threshold) {
            // Swipe left - next video
            navigateLightbox('next');
        } else if (touchEndX - touchStartX > threshold) {
            // Swipe right - previous video
            navigateLightbox('prev');
        }
    }, {passive: true});

    // === RESPONSIVE UTILITIES ===
    const checkViewport = () => {
        // Add mobile-specific classes if needed
        if (window.innerWidth <= 768) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.remove('is-mobile');
        }
    };

    // === INITIALIZATION ===
    const init = () => {
        setActiveLink();
        initializeTabs();
        checkViewport();
        
        window.addEventListener('scroll', setActiveLink);
        window.addEventListener('resize', checkViewport);
    };

    // Start the application
    init();
});