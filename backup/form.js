/**
 * Form Engine, Config & Webhook Dispatcher
 */
window.FORM_CONFIG = {
    whatsappNumber: '201011236167',
    webhook: 'https://n8n.emlenotes.com/webhook/emle-leads-webhook',
    sheetAppUrl: 'https://script.google.com/macros/s/AKfycbzl13aFzV2rc3APmZUTJhIxxb4uEIjL6rX-bms_M3ElcjnWoyYaiC7tzkcUNH1H3Dv-Rw/exec'
};

window.FormManager = {
    standardizePhone: function(phone) {
        let clean = (phone || '').trim();
        if (clean.startsWith('0')) {
            clean = '20' + clean.substring(1);
        }
        return clean;
    },

    getPlanValue: function(plan) {
        if (typeof plan === 'number') return plan;
        if (!plan) return 0;
        if (typeof plan === 'string') {
            if (plan.includes('السنوي') || plan.includes('yearly')) return 5000;
            if (plan.includes('الشهري') || plan.includes('monthly')) return 500;
        }
        return 0;
    },

    buildPayload: function(data, status = 'partial') {
        const utmSource = localStorage.getItem('utm_source') || 'Direct';
        const utmCampaign = localStorage.getItem('utm_campaign') || 'None';
        const buttonSource = data.sourceTag || 'unknown';
        const combinedSource = `${utmSource} | زر: ${buttonSource}`;
        const eventId = data.eventId || (window.Tracking ? window.Tracking.generateEventId() : 'evt_' + Date.now());

        return {
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            plan_name: data.planName || (status === 'partial' ? 'تعبئة جزئية (لم يكتمل)' : '12 Therapy School'),
            plan_value: data.planValue || 0,
            utm_source: combinedSource,
            utm_campaign: utmCampaign,
            eventID: eventId,
            status: status,
            isLiveSync: status === 'partial'
        };
    },

    sendSync: async function(data) {
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test((data.phone || '').trim())) return;

        const payload = this.buildPayload(data, 'partial');
        try {
            // Live Sync goes ONLY to Google Sheet, not n8n
            if (window.FORM_CONFIG.sheetAppUrl) {
                fetch(window.FORM_CONFIG.sheetAppUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    keepalive: true,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(e => console.error('Silent sync error:', e));
            }
        } catch (e) {
            console.error('Silent sync error:', e);
        }
    }
};

document.addEventListener('alpine:init', () => {
    Alpine.data('leadForm', (config = {}) => ({
        name: '',
        phone: '',
        email: '',
        isSubmitting: false,
        phoneError: false,
        isDuplicate: false,
        duplicateWaUrl: '',
        liveSyncTimeout: null,
        stableEventId: null,     // Links all live updates & final submission to the exact same row in Google Sheet

        init() {
            // Restore stored user info if present
            this.name = localStorage.getItem('user_name') || '';
            this.phone = localStorage.getItem('user_phone_raw') || '';
            this.email = localStorage.getItem('user_email') || '';
        },

        validatePhone() {
            const rawPhone = this.phone.trim();
            const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
            this.phoneError = !phoneRegex.test(rawPhone);
            return !this.phoneError;
        },

        handleInput() {
            if (this.phone.trim().length === 11) {
                this.validatePhone();
            }
            this.triggerLiveSync();
        },

        triggerLiveSync() {
            clearTimeout(this.liveSyncTimeout);
            this.liveSyncTimeout = setTimeout(() => {
                const appStore = Alpine.store('app');
                
                // Generate and save a stable ID if we don't have one yet for this session
                if (!this.stableEventId) {
                    this.stableEventId = (appStore && appStore.currentEventId) ? appStore.currentEventId : 'evt_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                }

                window.FormManager.sendSync({
                    name: this.name.trim(),
                    phone: this.phone.trim(),
                    email: this.email.trim(),
                    planName: '12 Therapy School',
                    planValue: appStore ? appStore.planValue : 0,
                    sourceTag: appStore ? appStore.sourceTag : config.source || 'default',
                    eventId: this.stableEventId
                });
            }, 800);
        },

        async submit() {
            // 1. ADD THIS LINE: If already submitting, ignore extra clicks
            if (this.isSubmitting) return;

            if (!this.validatePhone()) {
                return;
            }

            // 2. Lock the form
            this.isSubmitting = true;
            this.isDuplicate = false;

            // ... the rest of your code stays exactly the same

            const appStore = Alpine.store('app');
            const planName = '12 Therapy School';
            const planValue = appStore ? appStore.planValue : 500;
            const sourceTag = appStore ? appStore.sourceTag : (config.source || 'form');
            
            // Ensure we use the exact same ID as the Live Sync so n8n connects them
            if (!this.stableEventId) {
                this.stableEventId = (appStore && appStore.currentEventId) ? appStore.currentEventId : (window.Tracking ? window.Tracking.generateEventId() : 'evt_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
            }
            const eventId = this.stableEventId;

            const cleanPhone = window.FormManager.standardizePhone(this.phone);
            localStorage.setItem('user_phone_raw', this.phone.trim());

            const payload = window.FormManager.buildPayload({
                name: this.name.trim(),
                phone: this.phone.trim(),
                email: this.email.trim(),
                planName: planName,
                planValue: planValue,
                sourceTag: sourceTag,
                eventId: eventId
            }, 'new');

            let duplicateFound = false;

            try {
                // 1. Send to n8n webhook in background with keepalive
                if (window.FORM_CONFIG.webhook) {
                    fetch(window.FORM_CONFIG.webhook, {
                        method: 'POST',
                        keepalive: true,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }).catch(err => console.error('Error sending to n8n:', err));
                }

                // 2. Send to Google Sheet script in background with keepalive (no-cors for speed)
                if (window.FORM_CONFIG.sheetAppUrl) {
                    fetch(window.FORM_CONFIG.sheetAppUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        keepalive: true,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }).catch(sheetErr => console.error('Error sending to Google Sheet:', sheetErr));
                }

                localStorage.setItem('user_name', this.name.trim());
                localStorage.setItem('user_phone', cleanPhone);
                if (this.email.trim()) localStorage.setItem('user_email', this.email.trim());

                if (window.fbq) {
                    window.fbq('init', window.TRACKING_CONFIG.metaPixelId, {
                        em: this.email.trim().toLowerCase(),
                        ph: cleanPhone,
                        fn: this.name.trim()
                    });
                }

                if (window.ttq) {
                    const ttqUser = { phone_number: cleanPhone };
                    if (this.email.trim()) ttqUser.email = this.email.trim().toLowerCase();
                    window.ttq.identify(ttqUser);
                }

                if (window.Tracking) {
                    window.Tracking.fire('InitiateCheckout', {
                        content_name: planName,
                        content_category: 'Psychotherapy Course Plans',
                        value: planValue,
                        currency: 'EGP',
                        num_items: 1
                    }, eventId);

                    window.Tracking.fire('Lead', {
                        content_name: planName,
                        content_category: 'Therapy School Form',
                        value: planValue,
                        currency: 'EGP'
                    }, eventId);

                    window.Tracking.fire('Contact', {
                        content_category: 'WhatsApp Redirect',
                        content_name: 'Start Counseling Conversation'
                    });
                }
            } catch (err) {
                console.error('Error submitting form:', err);
            }

            let msg = '';
            if (planValue > 0) {
                msg = `السلام عليكم، أنا ${this.name.trim()} وكنت حابب أعرف تفاصيل أكتر عن كورس ١٢ مدرسة علاجية، وإزاي ممكن أستفيد منه وهل مناسب ليا في المرحلة دي؟`;
            } else {
                msg = `السلام عليكم، أنا د. ${this.name.trim()}. ياريت أعرف تفاصيل أكتر عن نظام المذاكرة وإزاي أقدر أنضم ليكم الفترة دي `;
            }

            const encodedMsg = encodeURIComponent(msg);
            const whatsappURL = `https://wa.me/${window.FORM_CONFIG.whatsappNumber}?text=${encodedMsg}`;

            if (appStore) {
                appStore.closeLeadModal();
            }

            this.isSubmitting = false;
            window.location.href = whatsappURL;
        }
    }));
});
