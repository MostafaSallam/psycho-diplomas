/**
 * Site Engine & Reactive Stores
 * Schema Therapy & DBT Independent Tracks
 */

document.addEventListener('alpine:init', () => {
    // 1. Central Data Store
    Alpine.store('siteData', {
        data: window.SITE_DATA || {}
    });

    // 2. Global Application Store
    Alpine.store('app', {
        // Track Controller State ('schema' or 'dbt')
        activeTrack: 'schema',

        // Modal States
        leadModalOpen: false,
        selectedDiploma: 'Schema Therapy (علاج المخططات)',
        selectedPaymentPlan: 'كاش - دفع فوري بخصم (6,000 جنيه بدل 8,000)',
        planValue: 6000,
        sourceTag: 'default',
        currentEventId: null,

        // Sticky Bar State
        stickyVisible: false,

        // FOMO Toast State
        fomoVisible: false,
        fomoTitle: '',
        fomoDesc: '',

        // Countdown Timer State
        timer: {
            days: '03',
            hours: '14',
            minutes: '28',
            seconds: '45'
        },

        switchTrack(trackId) {
            this.activeTrack = trackId;
            if (trackId === 'schema') {
                this.selectedDiploma = 'Schema Therapy (علاج المخططات)';
            } else if (trackId === 'dbt') {
                this.selectedDiploma = 'DBT (العلاج الجدلي السلوكي)';
            }

            if (window.Tracking) {
                window.Tracking.fire('SwitchTrack', {
                    track_id: trackId,
                    track_name: this.selectedDiploma
                });
            }

            // Smooth scroll into track detail section
            const targetEl = document.getElementById('track-detail-section');
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        openLeadModal(planType = 'cash', source = 'button', diplomaName = null) {
            if (diplomaName) {
                this.selectedDiploma = diplomaName;
            } else {
                if (this.activeTrack === 'schema') {
                    this.selectedDiploma = 'Schema Therapy (علاج المخططات)';
                } else {
                    this.selectedDiploma = 'DBT (العلاج الجدلي السلوكي)';
                }
            }

            if (planType === 'cash') {
                this.selectedPaymentPlan = 'كاش - دفع فوري بخصم (6,000 جنيه بدل 8,000)';
                this.planValue = 6000;
            } else if (planType === 'installments') {
                this.selectedPaymentPlan = 'تقسيط على 4 دفعات - الدفعة الأولى (1,500 جنيه)';
                this.planValue = 1500;
            } else {
                this.selectedPaymentPlan = 'كاش - دفع فوري بخصم (6,000 جنيه بدل 8,000)';
                this.planValue = 6000;
            }

            this.sourceTag = source;
            this.currentEventId = window.Tracking ? window.Tracking.generateEventId() : 'evt_' + Date.now();

            if (window.Tracking) {
                window.Tracking.fire('OpenForm', {
                    content_name: `${this.selectedDiploma} - ${this.selectedPaymentPlan}`,
                    click_source: source
                }, this.currentEventId);
            }

            this.leadModalOpen = true;
        },

        closeLeadModal() {
            this.leadModalOpen = false;
        },

        updateTimer() {
            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (4 - now.getDay() + 7) % 7 || 7, 23, 59, 59);
            const diff = target - now;

            if (diff <= 0) {
                this.timer = { days: '01', hours: '12', minutes: '30', seconds: '00' };
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
            const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
            const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

            this.timer = { days: d, hours: h, minutes: m, seconds: s };
        }
    });

    // 3. Carousel Component Definition
    Alpine.data('carouselComponent', (carouselId, delay = 3000) => ({
        isHovered: false,
        intervalId: null,

        init() {
            this.startAutoScroll();
        },

        startAutoScroll() {
            const carousel = this.$el;
            if (!carousel) return;

            this.intervalId = setInterval(() => {
                if (this.isHovered) return;

                const card = carousel.firstElementChild;
                if (!card) return;

                const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
                const step = card.offsetWidth + gap;
                const startScroll = carousel.scrollLeft;

                carousel.scrollBy({ left: -step, behavior: 'smooth' });

                setTimeout(() => {
                    if (Math.abs(carousel.scrollLeft - startScroll) <= 1) {
                        carousel.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                }, 800);
            }, delay);
        },

        pause() { this.isHovered = true; },
        resume() { 
            setTimeout(() => { this.isHovered = false; }, 1500); 
        }
    }));

    // 4. FOMO Notifier Component
    Alpine.data('fomoNotifier', () => ({
        init() {
            setTimeout(() => {
                this.showNotification();
                setInterval(() => this.showNotification(), 18000);
            }, 8000);
        },

        showNotification() {
            const fomoData = window.SITE_DATA ? window.SITE_DATA.fomo : null;
            if (!fomoData || !fomoData.names || !fomoData.plans) return;

            const name = fomoData.names[Math.floor(Math.random() * fomoData.names.length)];
            const planObj = fomoData.plans[Math.floor(Math.random() * fomoData.plans.length)];

            const appStore = Alpine.store('app');
            if (appStore) {
                appStore.fomoTitle = `${name} قام/ت بالحجز الآن!`;
                appStore.fomoDesc = `سجّل في ${planObj.plan} ${planObj.value}`;
                appStore.fomoVisible = true;

                setTimeout(() => {
                    appStore.fomoVisible = false;
                }, 6000);
            }
        },

        dismiss() {
            const appStore = Alpine.store('app');
            if (appStore) appStore.fomoVisible = false;
        }
    }));
});

// 5. Scroll Engine & Tracking Listeners
(function() {
    let scrollMilestones = { '25': false, '50': false, '75': false, '90': false };
    let timeSpentMilestones = { '10': false, '30': false, '60': false, '120': false, '180': false, '300': false, '600': false };
    const pageLoadTime = Date.now();

    function handleScroll() {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        const percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;

        // Scroll Depth Tracking
        [25, 50, 75, 90].forEach(m => {
            if (percent >= m && !scrollMilestones[m]) {
                if (window.Tracking) {
                    window.Tracking.fire('ScrollDepth_' + m, { depth: m });
                }
                scrollMilestones[m] = true;
            }
        });

        // Sticky Footer Visibility
        const appStore = window.Alpine ? Alpine.store('app') : null;
        if (appStore) {
            const feesSection = document.getElementById('fees');
            const scrolledEnough = window.scrollY > 450;
            let reachedFees = false;

            if (feesSection) {
                const rect = feesSection.getBoundingClientRect();
                reachedFees = rect.top < window.innerHeight && rect.bottom >= 0;
            }

            appStore.stickyVisible = scrolledEnough && !reachedFees;
        }
    }

    function trackTimeSpent() {
        const timeElapsed = Math.floor((Date.now() - pageLoadTime) / 1000);
        Object.keys(timeSpentMilestones).forEach(milestone => {
            const sec = parseInt(milestone);
            if (timeElapsed >= sec && !timeSpentMilestones[milestone]) {
                if (window.Tracking) {
                    window.Tracking.fire('TimeSpent', { time_in_seconds: sec });
                }
                timeSpentMilestones[milestone] = true;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        setInterval(trackTimeSpent, 5000);

        // Timer Loop
        setInterval(() => {
            if (window.Alpine && Alpine.store('app')) {
                Alpine.store('app').updateTimer();
            }
        }, 1000);
    });
})();

// 6. YouTube IFrame API Integration
let youtubeVideoTracked = { 'start': false, '25': false, '50': false, '75': false, 'complete': false };
let ytPlayer;
let videoInterval;

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('player', {
        videoId: 'N8R2mj-jg0o',
        playerVars: { 'rel': 0, 'modestbranding': 1, 'playsinline': 1 },
        events: { 'onStateChange': onPlayerStateChange }
    });
};

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        if (!youtubeVideoTracked['start']) {
            if (window.Tracking) {
                window.Tracking.fire('VideoPlayStart', {
                    video_title: 'عينة الشرح للدبلومة',
                    category: 'Engagement'
                });
            }
            youtubeVideoTracked['start'] = true;
        }

        videoInterval = setInterval(() => {
            if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
            const currentTime = ytPlayer.getCurrentTime();
            const duration = ytPlayer.getDuration();
            const percent = Math.floor((currentTime / duration) * 100);

            if (percent >= 25 && !youtubeVideoTracked['25']) {
                if (window.Tracking) window.Tracking.fire('VideoWatch25', { percent: 25 });
                youtubeVideoTracked['25'] = true;
            }
            if (percent >= 50 && !youtubeVideoTracked['50']) {
                if (window.Tracking) window.Tracking.fire('VideoWatch50', { percent: 50 });
                youtubeVideoTracked['50'] = true;
            }
            if (percent >= 75 && !youtubeVideoTracked['75']) {
                if (window.Tracking) window.Tracking.fire('VideoWatch75', { percent: 75 });
                youtubeVideoTracked['75'] = true;
            }
        }, 1000);
    } else {
        clearInterval(videoInterval);
        if (event.data === YT.PlayerState.ENDED && !youtubeVideoTracked['complete']) {
            if (window.Tracking) window.Tracking.fire('VideoWatch100', { percent: 100 });
            youtubeVideoTracked['complete'] = true;
        }
    }
}

// Dynamically load YouTube API script
(function() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_player?enablejsapi=1";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
})();
