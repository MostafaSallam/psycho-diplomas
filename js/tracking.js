/**
 * Analytics Engine & Tracking Module
 */
window.TRACKING_CONFIG = {
    metaPixelId: '915096184617116',
    metaPixelActive: true,
    clarityId: 'wiflqp9rnv'
};

(function() {
    // 1. Session Manager
    function getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('LEAD_SESSION_ID');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
            sessionStorage.setItem('LEAD_SESSION_ID', sessionId);
        }
        return sessionId;
    }

    // 2. URL & Cookie Capture
    function captureUTMAndCookies() {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsToCapture = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
        
        paramsToCapture.forEach(param => {
            const val = urlParams.get(param);
            if (val) {
                localStorage.setItem(param, val);
            }
        });

        // Capture FB Cookies if present
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const fbp = getCookie('_fbp');
        const fbc = getCookie('_fbc');
        if (fbp) localStorage.setItem('_fbp', fbp);
        if (fbc) localStorage.setItem('_fbc', fbc);
    }

    // Initialize Meta Pixel Script
    function initMetaPixel() {
        if (!window.TRACKING_CONFIG.metaPixelActive || !window.TRACKING_CONFIG.metaPixelId) return;

        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq) f._fbq=n;
            n.push=n; n.loaded=!0; n.version='2.0'; n.queue=[];
            t=b.createElement(e); t.async=!0; t.src=v;
            s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', window.TRACKING_CONFIG.metaPixelId);
        window.fbq('track', 'PageView');
    }

    // Initialize Microsoft Clarity Script
    function initClarity() {
        if (!window.TRACKING_CONFIG.clarityId) return;
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", window.TRACKING_CONFIG.clarityId);
    }

    // Initialize Data Layer for GTM
    window.dataLayer = window.dataLayer || [];

    // 3. Event Dispatcher Object
    const Tracking = {
        sessionId: getOrCreateSessionId(),
        
        generateEventId: function() {
            return 'evt_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
        },

        fire: function(eventName, eventData = {}, customEventId = null) {
            const eventId = customEventId || this.generateEventId();
            const payload = {
                event: eventName,
                event_id: eventId,
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                ...eventData
            };

            // Push to DataLayer
            window.dataLayer.push(payload);

            // Push to Meta Pixel
            if (window.fbq && window.TRACKING_CONFIG.metaPixelActive) {
                const isStandard = ['PageView', 'Lead', 'InitiateCheckout', 'Contact', 'CompleteRegistration', 'AddToCart', 'Purchase'].includes(eventName);
                if (isStandard) {
                    window.fbq('track', eventName, eventData, { eventID: eventId });
                } else {
                    window.fbq('trackCustom', eventName, eventData, { eventID: eventId });
                }
            }

            // Push to TikTok Pixel
            if (window.ttq) {
                window.ttq.track(eventName, eventData, { event_id: eventId });
            }

            return eventId;
        }
    };

    // Execute Initializations
    captureUTMAndCookies();
    initMetaPixel();
    initClarity();

    // Export to global scope
    window.Tracking = Tracking;
    window.fireTrackingEvent = function(name, data, eventId) {
        return window.Tracking.fire(name, data, eventId);
    };
})();
