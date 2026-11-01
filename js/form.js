/**
 * Form Engine, Config & Webhook Dispatcher
 * Schema Therapy & DBT Independent Diplomas
 */
window.FORM_CONFIG = {
    // 1. رقم الواتساب الذي يتم توجيه المشترك إليه بعد الحجز (بصيغة دولية بدون +)
    whatsappNumber: '201011236167',

    // 2. رابط Webhook الخاص بـ n8n (اختياري)
    webhook: 'https://n8n.emlenotes.com/webhook/emle-leads-webhook',

    // 3. رابط Google Apps Script Web App الخاص بشيت تسجيل الدبلومات الجديدة
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
            if (plan.includes('كاش') || plan.includes('cash')) return 6000;
            if (plan.includes('تقسيط') || plan.includes('installment')) return 1500;
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
            diploma: data.diploma || 'Schema Therapy',
            payment_plan: data.paymentPlan || 'كاش (6,000 ج)',
            plan_name: `${data.diploma || 'دبلومة'} - ${data.paymentPlan || 'حجز'}`,
            plan_value: data.planValue || 0,
            academic_background: data.academicBackground || '',
            utm_source: combinedSource,
            utm_campaign: utmCampaign,
            eventID: eventId,
            status: status,
            isLiveSync: status === 'partial',
            timestamp: new Date().toISOString()
        };
    },

    sendSync: async function(data) {
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test((data.phone || '').trim())) return;

        const payload = this.buildPayload(data, 'partial');
        try {
            // Live Sync goes to Google Sheet
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
        diploma: 'Schema Therapy (علاج المخططات)',
        paymentPlan: 'كاش - دفع فوري بخصم (6,000 جنيه بدل 8,000)',
        academicBackground: 'طبيب بشري',
        isSubmitting: false,
        phoneError: false,
        isDuplicate: false,
        duplicateWaUrl: '',
        liveSyncTimeout: null,
        stableEventId: null,

        init() {
            // Restore stored user info if present
            this.name = localStorage.getItem('user_name') || '';
            this.phone = localStorage.getItem('user_phone_raw') || '';
            this.email = localStorage.getItem('user_email') || '';
            
            const appStore = Alpine.store('app');
            if (appStore && appStore.selectedDiploma) {
                this.diploma = appStore.selectedDiploma;
            }
            if (appStore && appStore.selectedPaymentPlan) {
                this.paymentPlan = appStore.selectedPaymentPlan;
            }
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
                
                if (!this.stableEventId) {
                    this.stableEventId = (appStore && appStore.currentEventId) ? appStore.currentEventId : 'evt_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                }

                const value = this.paymentPlan.includes('تقسيط') ? 1500 : 6000;

                window.FormManager.sendSync({
                    name: this.name.trim(),
                    phone: this.phone.trim(),
                    email: this.email.trim(),
                    diploma: this.diploma,
                    paymentPlan: this.paymentPlan,
                    academicBackground: this.academicBackground,
                    planName: `${this.diploma} - ${this.paymentPlan}`,
                    planValue: value,
                    sourceTag: appStore ? appStore.sourceTag : (config.source || 'default'),
                    eventId: this.stableEventId
                });
            }, 800);
        },

        async submit() {
            if (this.isSubmitting) return;

            if (!this.validatePhone()) {
                return;
            }

            this.isSubmitting = true;
            this.isDuplicate = false;

            const appStore = Alpine.store('app');
            const value = this.paymentPlan.includes('تقسيط') ? 1500 : 6000;
            const sourceTag = appStore ? appStore.sourceTag : (config.source || 'form');
            
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
                diploma: this.diploma,
                paymentPlan: this.paymentPlan,
                academicBackground: this.academicBackground,
                planValue: value,
                sourceTag: sourceTag,
                eventId: eventId
            }, 'new');

            try {
                // 1. Send to n8n webhook
                if (window.FORM_CONFIG.webhook) {
                    fetch(window.FORM_CONFIG.webhook, {
                        method: 'POST',
                        keepalive: true,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }).catch(err => console.error('Error sending to n8n:', err));
                }

                // 2. Send to Google Sheet script
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
                        content_name: `${this.diploma} - ${this.paymentPlan}`,
                        content_category: 'Psychotherapy Diplomas',
                        value: value,
                        currency: 'EGP',
                        num_items: 1
                    }, eventId);

                    window.Tracking.fire('Lead', {
                        content_name: `${this.diploma} - ${this.paymentPlan}`,
                        content_category: 'Psychotherapy Diplomas Form',
                        value: value,
                        currency: 'EGP'
                    }, eventId);

                    window.Tracking.fire('Contact', {
                        content_category: 'WhatsApp Redirect',
                        content_name: 'Start Enrollment Conversation'
                    });
                }
            } catch (err) {
                console.error('Error submitting form:', err);
            }

            // WhatsApp message with specific diploma and payment plan
            const msg = `السلام عليكم د. أحمد السيسي، أنا د/ ${this.name.trim()} (${this.academicBackground}).
كنت حابب أأكد حجز مقعدي في الدبلومة:
📌 الدبلومة المختارة: ${this.diploma}
💰 نظام السداد المفضل: ${this.paymentPlan}
رقم هاتفي المسجل: ${this.phone.trim()}
ياريت توضحولي الخطوات القادمة لتأكيد الحجز وتثبيت الخصم. شكراً جزيلاً!`;

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
