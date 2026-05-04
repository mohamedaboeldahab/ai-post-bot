import admin from "firebase-admin";

// 1. إعدادات Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 2. إعدادات Groq API
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL_NAME = "llama-3.3-70b-versatile"; // موديل جبار في فهم اللهجات

// 3. شخصيات "Sharkup" الجديدة (أسماء مصرية واقعية)
const characters = [
    { 
        name: "مروان الشافعي", 
        photo: "https://i.pravatar.cc/150?img=11", 
        role: "Angel Investor & Tech Mentor", 
        bio: "مستثمر في شركات ناشئة، بيحب الخلاصة، كلامه قليل بس بيجيب من الآخر، وبيكره التنظير والمصطلحات المعقدة." 
    },
    { 
        name: "سلمى الديب", 
        photo: "https://i.pravatar.cc/150?img=26", 
        role: "Business Development Expert", 
        bio: "شاطرة في البيع وبناء العلاقات، بتهتم جداً بالجانب الإنساني في الشغل وازاي تعمل Personal Brand لنفسك." 
    },
    { 
        name: "ياسين 'الشرك' جلال", 
        photo: "https://i.pravatar.cc/150?img=33", 
        role: "E-commerce Strategist", 
        bio: "خبير في التجارة الإلكترونية، كلامه سريع وبلهجة السوق، دايماً بيحكي مواقف حصلت معاه شخصياً في الشغل." 
    },
    { 
        name: "نورا حسن", 
        photo: "https://i.pravatar.cc/150?img=41", 
        role: "Financial Consultant", 
        bio: "بتحب لغة الفلوس والادخار، أسلوبها زي صديقة بتنصحك في خروجة، كلامها بسيط وبعيد عن تعقيدات البنوك." 
    }
];

// 4. دالة توليد المحتوى بأسلوب "سوشيال ميديا" واقعي
async function generateAIPost(character) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    
    const prompt = `
    أنت الآن الشخصية التالية على سوشيال ميديا (LinkedIn/Facebook):
    الاسم: ${character.name}
    التخصص: ${character.role}
    الخلفية: ${character.bio}

    المهمة: اكتب بوست "حراقة" ومفيد لتطبيق Sharkup.
    
    القواعد الذهبية (عشان متبانش بوت):
    1. اكتب بالعامية المصرية "المودرن" (لغة القعدة مع الصحاب).
    2. ابدأ بـ "Hook" (جملة تخطف العين أو سؤال مستفز).
    3. احكي موقف صغير أو فكرة سريعة.. ابعد عن النصايح المعلبة.
    4. ممنوع نهائياً تقول: "في الختام"، "إليك النصيحة"، "عزيزي المتابع".
    5. استخدم إيموجيز بذكاء في وسط الكلام مش في آخره بس.
    6. الخاتمة لازم تكون سؤال صايع يخلي الناس تكتب كومنتات.
    7. اتمرد على أسلوب الذكاء الاصطناعي التقليدي.. خليك بشري وبتقول رأيك بجرأة.
    `;

    const payload = {
        model: MODEL_NAME,
        messages: [
            { 
                role: "system", 
                content: "أنت صانع محتوى مصري محترف، بوستاتك دايماً بتجيب تفاعل عالي لأنها واقعية ومش بتبان إنها مكتوبة بذكاء اصطناعي." 
            },
            { role: "user", content: prompt }
        ],
        temperature: 0.85 // لزيادة الإبداع وتقليل التكرار
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

    if (!response.ok) {
        throw new Error(`Groq API Error: ${data.error?.message || response.statusText}`);
    }

    return data.choices[0].message.content;
}

// 5. الدالة الأساسية
async function run() {
    console.log("🚀 بدء تشغيل بوت Sharkup AI (Human Mode)...");
    try {
        const character = characters[Math.floor(Math.random() * characters.length)];
        console.log(`👤 الشخصية المختارة: ${character.name}`);

        console.log("⏳ جاري توليد البوست بأسلوب بشري...");
        const aiContent = await generateAIPost(character);
        
        console.log("📡 جاري النشر في Firestore...");
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

        console.log(`🎉 تم النشر بنجاح بواسطة: ${character.name}`);
    } catch (error) {
        console.error("💥 حدث خطأ أثناء التنفيذ:", error.message);
        process.exit(1);
    }
}

run().then(() => process.exit(0));
