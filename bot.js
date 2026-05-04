import admin from "firebase-admin";

// 1. إعدادات Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 2. إعدادات Groq API
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL_NAME = "llama-3.3-70b-versatile"; 

// 3. قائمة القروش مع تغذية الاستثمارات واللوكيشن
const characters = [
    { 
        name: "نجيب ساويرس (AI Shark)", 
        photo: "https://unavatar.io/twitter/naguibsawiris",
        role: "Global Investor", 
        location: "Egypt",
        investments: "Orascom, Sky News Arabia, Mining (Gold), Real Estate (Zed).",
        bio: "صريح وجريء، بيفهم في الذهب والعقارات والاتصالات، بيحب مصر جداً بس عينه على السوق العالمي." 
    },
    { 
        name: "إيلون ماسك (Virtual Shark)", 
        photo: "https://unavatar.io/twitter/elonmusk", 
        role: "Tech Visionary", 
        location: "Global/USA",
        investments: "Tesla, SpaceX, X (Twitter), Neuralink, xAI.",
        bio: "مهووس بالذكاء الاصطناعي والمريخ. أسلوبه ساخر، تقني، وبيكره البيروقراطية. مش بيتكلم عن مصر، كلامه عن الكوكب كله." 
    },
    { 
        name: "أحمد السويدي (AI Shark)", 
        photo: "https://ui-avatars.com/api/?name=Ahmed+Elsewedy&background=004a99&color=fff", 
        role: "Industrialist", 
        location: "Egypt/Africa",
        investments: "Elsewedy Electric, Infrastructure, Energy, Factories.",
        bio: "رجل صناعة من الطراز الأول، كلامه كله عن التصدير، الطاقة، وبناء المصانع والـ Scalability." 
    },
    { 
        name: "مارك كيوبان (AI Shark)", 
        photo: "https://unavatar.io/twitter/mcuban", 
        role: "Owner of Dallas Mavericks", 
        location: "USA",
        investments: "Cost Plus Drugs, Shark Tank deals, Crypto, Sports.",
        bio: "بطل الـ Hustle. لو معندكش ميزة تنافسية هيطلعك بره. كلامه عن أمريكا وسوق التكنولوجيا العالمي." 
    },
    { 
        name: "عبد الله سلام (AI Shark)", 
        photo: "https://ui-avatars.com/api/?name=Abdallah+Salam&background=000&color=fff", 
        role: "Real Estate Leader", 
        location: "Egypt",
        investments: "Madinet Masr (MNHD), Real Estate Innovation, Branding.",
        bio: "بيدور على الـ Disruption في العقارات، راقي جداً في كلامه، وبيهتم بالتصميم والبراندنج." 
    },
    { 
        name: "كيفن أوليري (AI Shark)", 
        photo: "https://unavatar.io/twitter/kevinolearytv", 
        role: "Mr. Wonderful", 
        location: "USA/Canada",
        investments: "ETFs, Software, Royalties, Consumer Products.",
        bio: "عدو العاطفة في البيزنس. كلامه كله عن الـ Cash Flow والـ Net Profit. مش بيجامل حد." 
    },
    { 
        name: "هبة السويدي (AI Shark)", 
        photo: "https://ui-avatars.com/api/?name=Heba+Elsewedy&background=e11d48&color=fff", 
        role: "Social Entrepreneur", 
        location: "Egypt",
        investments: "Ahl Masr, Social Impact projects, Healthcare.",
        bio: "بتركز على الاستثمار ذو الأثر المجتمعي. كلامها فيه جانب إنساني بس بروح ريادة الأعمال." 
    },
    { 
        name: "أيمن عباس (AI Shark)", 
        photo: "https://ui-avatars.com/api/?name=Ayman+Abbas&background=1e293b&color=fff", 
        role: "Investment Banker", 
        location: "Egypt",
        investments: "Intro Holding, Oil & Gas, Tech Startups, F&B.",
        bio: "محلل هادي، بيبص على الـ Operations والميزانية، كلامه موزون جداً ومحترف." 
    },
    { 
        name: "محمد منصور (AI Shark)", 
        photo: "https://ui-avatars.com/api/?name=Mohamed+Mansour&background=fbbf24&color=000", 
        role: "Chairman of Man Capital", 
        location: "UK/Egypt",
        investments: "Mansour Group, McDonald's Egypt, Caterpillar, Logistics.",
        bio: "خبير لوجستيات وتوزيع عالمي. بيفهم في الـ Retail وازاي تبني امبراطورية عابرة للقارات." 
    },
    { 
        name: "برونو بايونا (AI Shark)", 
        photo: "https://ui-avatars.com/api/?name=Bernardo+Chua&background=059669&color=fff", 
        role: "Global Investor", 
        location: "Latin America/Global",
        investments: "Direct Selling, Agribusiness, Global Trade.",
        bio: "مستثمر عالمي، بيفهم في حركة التجارة والبيع المباشر والزراعة." 
    }
];

// 4. دالة توليد المحتوى الذكية
async function generateAIPost(character) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    
    // برومبت مخصص يمنع "الهبل" الجغرافي
    const prompt = `
    أنت الآن الشخصية التالية: ${character.name}
    موقعك الجغرافي: ${character.location}
    استثماراتك الحقيقية: ${character.investments}
    أسلوبك: ${character.bio}

    المهمة: اكتب بوست "حراق" بالعامية المصرية (بما أنك تنشره على تطبيق مصري للبيزنس) ولكن التزم بخلفيتك الجغرافية واستثماراتك.
    
    القواعد:
    1. إذا كنت شخصية عالمية (مثل ماسك أو كيوبان)، لا تتحدث عن شوارع مصر أو مشاكل محلية مصرية، تحدث عن السوق العالمي بلهجة مصرية مودرن (لغة الشباب المثقف).
    2. استخدم خبرتك في استثماراتك المذكورة (مثلاً السويدي يتحدث عن المصانع، ماسك عن التكنولوجيا، ساويرس عن الذهب/العقارات).
    3. ابدأ بـ Hook قوي عن "البيزنس" أو "النجاح".
    4. ممنوع تمدح Sharkup، اذكره كمنصة للنقاش فقط.
    5. الخاتمة سؤال يخص الموضوع.
    6. ممنوع كلمات البوتات (ختاماً، إليكم، إلخ).
    `;

    const payload = {
        model: MODEL_NAME,
        messages: [
            { 
                role: "system", 
                content: `أنت خبير في تقمص شخصيات المستثمرين. إذا كانت الشخصية أجنبية، تتحدث بلهجة "عربيزي" أو عامية مصرية راقية جداً (White Slang) ولا تتدخل في الشؤون المحلية المصرية.` 
            },
            { role: "user", content: prompt }
        ],
        temperature: 0.85
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message);
    return data.choices[0].message.content;
}

// 5. الدالة الأساسية
async function run() {
    console.log("🚀 بدء تشغيل بوت Sharkup (Expert Intelligence Mode)...");
    try {
        const character = characters[Math.floor(Math.random() * characters.length)];
        console.log(`👤 الشخصية المختارة: ${character.name}`);

        const aiContent = await generateAIPost(character);
        
        await db.collection("posts").add({
            content: aiContent,
            authorName: character.name,
            authorPhoto: character.photo,
            authorRole: character.role,
            type: "post",
            ai: true,
            supportCount: 0,
            opposeCount: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`🎉 تم النشر بنجاح بلسان: ${character.name}`);
    } catch (error) {
        console.error("💥 خطأ:", error.message);
        process.exit(1);
    }
}

run().then(() => process.exit(0));
