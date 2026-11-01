/**
 * Central Content Model for Psychotherapy Study System Landing Page
 * Defines window.SITE_DATA holding 100% of the landing page UI content.
 */
window.SITE_DATA = {
    meta: {
        title: "نظام مذاكرة المعالجين النفسيين",
        font: "Tajawal",
        primaryColor: "#0f766e",
        secondaryColor: "#1e293b",
        accentColor: "#f59e0b"
    },

    hero: {
        badge: "🔥 نظام مذاكرة المعالجين النفسيين الأكثر مبيعاً",
        title: "من معالج نفسي يفكر بمدرسة واحدة..<br class=\"hidden md:block\">\nإلى خبير يمتلك أدوات <span class=\"text-[#2dd4bf]\">12 مدرسة علاجية</span>",
        subtitle: "اتعلم أساس المدارس النفسية بشكل مبسط وتطبيقي، عشان تقرأ الحالة من <br class=\"hidden md:block\"> زوايا مختلفة بدقة وتختار أنسب طريقة للتعامل معها.",
        oldPriceText: "بدل ما تدفع 10,000+ جنيه لكل مدرسة",
        newPriceText: "هتاخد كل المدارس بااشتراك شهري رمزي!",
        ctaText: "انضم للدفعة الحالية وابدأ رحلتك",
        seatsNote: "متبقي 9 مقاعد فقط للتسجيل بالسعر المبدئي"
    },

    videoSample: {
        badge: "عينة من الشرح",
        title: "كل المدارس مشروحة بنفس الأسلوب ده",
        description: "محتوى المدارس العلاجية كله مبني ومتبسط بنفس الطريقة دي، علشان تبني أساس نظري قوي وتفهم الحالة صح، بدون حشو أو تعقيد.",
        youtubeId: "N8R2mj-jg0o",
        videoTitle: "عينة شرح المدارس العلاجية"
    },

    features: {
        title: "هتحصل على إيه بمجرد اشتراكك؟",
        items: [
            {
                icon: "fas fa-book-open",
                title: "مدرسة علاجية كاملة كل شهر",
                description: "بمتوسط دراسة \"كتاب أساسي\" لمدرسة علاجية شهرياً، وبنستخدم أدوات الذكاء الاصطناعي لتبسيط المحتوى وتقديمه بأوضح صورة مع ضمان المطابقة العلمية 100%."
            },
            {
                icon: "fas fa-video",
                title: "5 فيديوهات أسبوعية مركزة",
                description: "بنشرح كل شابتر في فيديو مدته من 15 لـ 20 دقيقة بس. بمعدل 5 فيديوهات في الأسبوع عشان تلتزم بالمذاكرة يومياً بدون ما تحس بأي ضغط."
            },
            {
                icon: "fas fa-users",
                title: "نقاش أسبوعي تطبيقي",
                description: "جلسة حية كل أسبوع لربط النظري بالعملي ومناقشة الحالات مع المجتمع الداعم عشان تتأكد إنك بتطبق اللي بتدرسه صح."
            },
            {
                icon: "fas fa-laptop-house",
                title: "بيئة دراسية متاحة 24/7",
                description: "مكان أونلاين مخصص للمذاكرة الفردية والجماعية، متوفر 24 ساعة، تقدر تدخل وتتفاعل وتذاكر في أي وقت ومن أي مكان يناسب جدولك."
            }
        ],
        noticeTitle: "واقع مهم:",
        noticeDescription: "النظام ليس بديلاً عن الإشراف (Supervision)، لكنه أساس نظري قوي جداً يساعدك على فهم الحالات بعمق."
    },

    schools: {
        title: "12 مدرسة علاجية هتتعرض لها",
        subtitle: "هتتعرف على أهم المدارس الحديثة من مصادرها الأساسية وبمعدل <span class=\"text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-1 md:px-3 md:py-1.5 rounded-lg inline-block mt-2 md:mt-0\">مدرسة علاجية كل شهر.</span>",
        scrollNote: "اسحب يميناً ويساراً للمزيد",
        items: [
            { name: "العلاج المعرفي السلوكي (CBT)", author: "Judith Beck", image: "images/book-cbt.jpg" },
            { name: "العلاج الجدلي السلوكي (DBT)", author: "Marsha Linehan", image: "images/book-dbt.jpg" },
            { name: "السيكودراما (Psychodrama)", author: "Marcia Karp", image: "images/book-psychodrama.jpg" },
            { name: "علاج الصدمة (EMDR)", author: "Francine Shapiro", image: "images/book-emdr.jpg" },
            { name: "أنظمة العائلة الداخلية (IFS)", author: "Richard Schwartz", image: "images/book-ifs.jpg" },
            { name: "العلاج باللعب (Play Therapy)", author: "Landreth", image: "images/book-play-therapy.jpg" },
            { name: "علاج القبول والالتزام (ACT)", author: "Steven C. Hayes", image: "images/book-act.jpg" },
            { name: "العلاج المتمركز حول المشاعر (EFT)", author: "Leslie Greenberg", image: "images/book-eft.jpg" },
            { name: "العلاج الوجودي (Existential)", author: "Irvin D. Yalom", image: "images/book-existential.jpg" },
            { name: "العلاج الجمعي (Group Therapy)", author: "Irvin D. Yalom", image: "images/book-group-therapy.jpg" },
            { name: "العلاج القائم على التعقيل (MBT)", author: "Anthony Bateman", image: "images/book-mbt.jpg" },
            { name: "علاج المخططات (Schema Therapy)", author: "Jeffrey E. Young", image: "images/book-schema.jpg" }
        ],
        callout: {
            title: "بعد 3 شهور فقط!",
            description: "هتبدأ تلاحظ إنك بتفكر في الحالة بأكتر من منظور، مش بس بتدور على تكنيك جاهز. هتسأل نفسك:",
            quote: "\"أنا شايف الحالة بإيه؟ وهل ده مناسب؟\""
        }
    },

    reviews: {
        title: "بشهادة زملائك.. النظام بيفرق فعلاً",
        subtitle: "دي رسايل حقيقية من معالجين أخدوا الخطوة، وبدأوا يشوفوا تأثير النظام العملي على شغلهم وعلى فهمهم للحالات.",
        scrollNote: "اسحب يميناً ويساراً للمزيد",
        items: [
            { image: "images/review-1.jpg", alt: "رأي معالج 1" },
            { image: "images/review-2.jpg", alt: "رأي معالج 2" },
            { image: "images/review-3.jpg", alt: "رأي معالج 3" },
            { image: "images/review-4.jpg", alt: "رأي معالج 4" },
            { image: "images/review-5.jpg", alt: "رأي معالج 5" }
        ]
    },

    pricing: {
        alertTitle: "تنبيه هام! السعر يرتفع قريباً",
        alertSubtitle: "السعر الحالي هو سعر مبدئي مبكر للدفعة الحالية. <strong class=\"text-teal-700\">السعر يزداد تدريجياً مع إضافة مدرسة علاجية جديدة بداية كل شهر</strong>.",
        lockTitle: "ميزة تثبيت السعر:",
        lockDesc: "اشتراكك الآن يضمن تجديد السعر الحالي المخفض <strong class=\"text-amber-600\">مدى الحياة</strong> طالما لا يوجد انقطاع.",
        lockNotice: "الزيادة تطبق للمشتركين الجدد فقط!",
        plans: [
            {
                id: "monthly",
                title: "الاشتراك الشهري",
                badge: "خصم 23%",
                originalPrice: 650,
                price: 500,
                period: "جنيه / شهرياً",
                features: [
                    { icon: "fa-solid fa-check text-teal-600", text: "محتوى المدرسة الحالية والمناقشات", highlighted: false },
                    { icon: "fa-solid fa-check text-teal-600", text: "الوصول لجميع المدارس (12 مدرسة)", highlighted: true },
                    { icon: "fa-solid fa-lock text-amber-500", text: "تجديد السعر الحالي مدي الحياة (اذا لم يتم الانقطاع)", isBox: true }
                ],
                ctaText: "اشترك شهرياً وتثبت السعر 🚀",
                subNote: "تأكيد فوري عبر الواتساب • تفعيل خلال دقائق",
                isPopular: false
            },
            {
                id: "yearly",
                title: "الاشتراك السنوي",
                badge: "وفر 1500 ج",
                popularBadge: "العرض الأكثر مبيعاً وتوفيراً 🔥",
                originalPrice: 6500,
                price: 5000,
                period: "جنيه / سنوياً",
                features: [
                    { icon: "fa-solid fa-check text-teal-400", text: "كل مميزات الاشتراك الشهري بالكامل", highlighted: false },
                    { icon: "fa-solid fa-gift text-teal-400", text: "توفير ضخم جداً (> 1500 ج مقارنة بالشهري)", highlighted: true },
                    { icon: "fa-solid fa-lock text-[#FBBF24]", text: "تجديد السعر الحالي مدي الحياة (اذا لم يتم الانقطاع)", isBox: true }
                ],
                ctaText: "اشترك سنوياً ووفر 1500 ج 🎁",
                subNote: "متبقي مقعدين فقط لخصم التوفير السنوي",
                isPopular: true
            }
        ],
        paymentMethodsTitle: "متاح الدفع الفوري الآمن بالكامل عبر:",
        paymentMethods: [
            { name: "فودافون كاش", icon: "fas fa-wallet text-red-600" },
            { name: "إنستا باي", icon: "fas fa-bolt text-green-600" },
            { name: "تحويل بنكي", icon: "fas fa-university text-blue-600" },
            { name: "فيزا/ماستر", icon: "fas fa-credit-card text-slate-800" }
        ],
        guarantee: {
            title: "ضمان استرداد بالكامل لمدة 3 أيام",
            description: "جرب النظام بنفسك، وإذا لم يناسبك، استرد مبلغك بالكامل خلال 3 أيام <strong class=\"text-green-700 bg-green-100 px-2 py-1 rounded\">بدون أسئلة</strong>."
        }
    },

    faq: {
        title: "أسئلة ممكن تكون في دماغك",
        items: [
            {
                question: "معنديش وقت كافي؟",
                answer: "الفيديو حوالي 15 دقيقة بس! والنظام معمول عشان تمشي حتى في الأيام المضغوطة بدون ما تحس بحمل كبير."
            },
            {
                question: "خايف أسيب المذاكرة زي أي حاجة تانية؟",
                answer: "عشان كده في مراجعة أسبوعية، وفي مجتمع وناس ماشية معاك بنفس الإيقاع بيشجعوك، وأنا موجود كمدير مجتمع بنظبط المسار ونساعد بعض نكمل."
            },
            {
                question: "هل ده عملي ولا نظري؟",
                answer: "ده مش تدريب عملي، ومش بديل عن الإشراف (Supervision). لكن هيديك أساس نظري منظم جداً، يساعد تفهم الحالات بشكل أعمق، وتستخدم أي تدريب عملي تاخده بشكل أحسن بكتير."
            },
            {
                question: "هل سعر الاشتراك ممكن يزيد عليّا؟",
                answer: "لا. سعر الاشتراك يظل ثابت مدى الحياة على نفس الخطة التي بدأت بها، طالما لا يوجد انقطاع في الاشتراك."
            }
        ]
    },

    instructor: {
        badge: "عن صاحب المبادرة",
        name: "د. أحمد محمود السيسي",
        image: "images/dr-ahmed.jpg",
        credentials: [
            { icon: "fas fa-id-card", text: "عضو مجلس إدارة نقابة أطباء الشرقية." },
            { icon: "fas fa-user-md", text: "طبيب مقيم زمالة الطب النفسي بمستشفيات جامعة الزقازيق." },
            { icon: "fas fa-microphone-alt", text: "Speaker في المدرسة الشتوية 2026." }
        ]
    },

    footer: {
        title: "هل أنت مستعد لبناء عقليتك العلاجية؟",
        description: "اضغط بالأسفل وسيتم التواصل معك مباشرة لتفعيل حسابك وتأكيد الخصم المتاح لدفعتك.",
        ctaText: "راسلنا لتفعيل حسابك أو لأي استفسار",
        subNote: "للتفعيل أو الاستفسار المباشر"
    },

    stickyBar: {
        title: "نظام مذاكرة المعالجين",
        subtitle: "السعر يرتفع قريباً، احجز مقعدك الآن",
        ctaText: "انضم لزملائك وابدأ المذاكرة"
    },

    fomo: {
        names: [
            "د. سارة المنشاوي", "د. محمد علي", "د. ياسمين الشريف", "د. خالد عبد الرحمن", 
            "د. رانيا يوسف", "د. أحمد ممدوح", "د. منى المهدي", "د. طارق العريان",
            "د. هبة الله كامل", "د. مصطفى الشاذلي", "د. مي عبد العال", "د. كريم جلال"
        ],
        plans: [
            { plan: "الاشتراك السنوي", value: "ووفرت 1500 جنيه 🎁" },
            { plan: "الاشتراك السنوي", value: "ووفرت 1500 جنيه 🎁" }, 
            { plan: "الاشتراك الشهري", value: "وثبتت السعر مدى الحياة 🚀" },
            { plan: "الاشتراك السنوي", value: "ووفرت 1500 جنيه 🎁" },
            { plan: "الاشتراك الشهري", value: "وثبتت السعر مدى الحياة 🚀" }
        ]
    },

    whatsapp: {
        defaultNumber: "201011236167"
    }
};
