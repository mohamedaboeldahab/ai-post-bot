import admin from "firebase-admin";

// 1. إعدادات Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 2. إعدادات Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash"; // الموديل المطلوب

// 3. قاعدة بيانات الشخصيات
const characters = [
    { name: "أحمد حسن", photo: "https://i.pravatar.cc/150?img=12", role: "خبير استثمار عقاري وبورصة", bio: "عملي، هادئ، يركز على الأرقام والفرص طويلة المدى." },
    { name: "سارة محمد", photo: "https://i.pravatar.cc/150?img=5", role: "رائدة أعمال ولايف كوتش", bio: "حماسية، ملهمة، تركز على تطوير الذات وعقلية النجاح." },
    { name: "كريم علي", photo: "https://i.pravatar.cc/150?img=8", role: "مطور مشاريع وتكنولوجيا", bio: "ذكي، سريع، يعطي خطوات تنفيذية في التسويق والستارت اب." },
    { name: "منى خالد", photo: "https://i.pravatar.cc/150?img=20", role: "مستشارة إدارة أموال", bio: "ودودة، ناصحة، تهتم بالادخار والذكاء المالي الشخصي." }
];

// 4. دالة توليد المحتوى باستخدام Fetch مباشرة (لتجنب أخطاء المكتبة)
async function generateAIPost(character) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    const prompt = `أنت الآن ${character.name}، وظيفتك ${character.role}. ${character.bio} 
    اكتب منشور (Post) دسم ومؤثر بالعامية المصرية لتطبيق Sharkup. 
    يجب أن يتضمن المنشور نصيحة حقيقية وسؤال تفاعلي في النهاية. 
    لا تذكر أنك ذكاء اصطناعي. الطول من 70 لـ 150 كلمة.`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("❌ تفاصيل خطأ API:", data);
        throw new Error(`خطأ من جوجل API: ${data.error?.message || response.statusText}`);
    }

    return data.candidates[0].content.parts[0].text;
}

// 5. الدالة الأساسية
async function run() {
    console.log("🚀 بدء تشغيل بوت Sharkup AI (Direct API Mode)...");
    try {
        const character = characters[Math.floor(Math.random() * characters.length)];
        console.log(`👤 الشخصية المختارة: ${character.name}`);

        console.log("⏳ جاري طلب المحتوى من Gemini API...");
        const aiContent = await generateAIPost(character);
        console.log("✅ تم توليد النص بنجاح.");

        console.log("📡 جاري الرفع إلى Firestore...");
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

        console.log("🎉 تم النشر بنجاح على Sharkup!");
    } catch (error) {
        console.error("💥 حدث خطأ أثناء التنفيذ:", error.message);
        process.exit(1);
    }
}

run().then(() => process.exit(0));
