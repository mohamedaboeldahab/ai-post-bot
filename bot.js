import admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعدادات Firebase
// تأكد أن FIREBASE_CONFIG في GitHub Secrets يحتوي على الـ JSON كاملاً
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// 2. إعدادات Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. قاعدة بيانات الشخصيات
const characters = [
    {
        name: "أحمد حسن",
        photo: "https://i.pravatar.cc/150?img=12",
        role: "خبير استثمار عقاري وبورصة",
        bio: "شخصية عملية، يحلل الأرقام، أسلوبه هادئ ومقنع، يركز على الفرص طويلة المدى."
    },
    {
        name: "سارة محمد",
        photo: "https://i.pravatar.cc/150?img=5",
        role: "رائدة أعمال ولايف كوتش",
        bio: "أسلوب حماسي، ملهمة، تركز على تطوير الذات وعقلية النجاح وكسر الخوف."
    },
    {
        name: "كريم علي",
        photo: "https://i.pravatar.cc/150?img=8",
        role: "مطور مشاريع وتكنولوجيا",
        bio: "خبير في التسويق الرقمي والستارت اب، أسلوبه سريع، ذكي، ويعطي خطوات تنفيذية."
    },
    {
        name: "منى خالد",
        photo: "https://i.pravatar.cc/150?img=20",
        role: "مستشارة إدارة أموال",
        bio: "تركز على الادخار الشخصي والذكاء المالي، أسلوبها ودود وناصح، تهتم بالتفاصيل."
    }
];

// 4. دالة توليد المحتوى
async function generateAIPost(character) {
    // استخدمنا "gemini-1.5-flash-latest" بدلاً من الاسم القديم
    // ده بيجبر الـ SDK يروح لأحدث نسخة مستقرة وموجودة فعلاً
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest" 
    });

    const prompt = `اكتب بوست بالعامية المصرية لشخصية اسمها ${character.name} بتشتغل ${character.role}. 
    الموضوع عن: ${character.bio}. 
    لازم البوست يكون دسم ومفيد لجمهور تطبيق Sharkup وفي نهايته سؤال.`;

    try {
        // إضافة إعدادات إضافية لضمان عدم رفض الطلب
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });
        
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("❌ تفاصيل الخطأ كاملة:");
        console.dir(error, { depth: null });
        throw new Error("فشل توليد النص: " + error.message);
    }
}
// 5. الدالة الأساسية للنشر
async function run() {
    console.log("🚀 بدء تشغيل بوت Sharkup AI...");
    
    try {
        // اختيار شخصية عشوائية
        const character = characters[Math.floor(Math.random() * characters.length)];
        console.log(`👤 الشخصية المختارة: ${character.name}`);

        // توليد النص
        console.log("⏳ جاري استشارة Gemini AI لتوليد المحتوى...");
        const aiContent = await generateAIPost(character);
        console.log("📝 النص المولد (أول 50 حرف): " + aiContent.substring(0, 50) + "...");

        // الرفع لـ Firestore
        console.log("📡 جاري الرفع إلى قاعدة بيانات Firestore...");
        const docRef = await db.collection("posts").add({
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

        console.log(`✅ تم النشر بنجاح! معرف المستند: ${docRef.id}`);
        return true;

    } catch (error) {
        console.error("❌ حدث خطأ أثناء تنفيذ المهمة:");
        console.error(error.message);
        throw error; // نمرر الخطأ عشان الدالة تحت تمسكه
    }
}

// 6. تشغيل البوت مع ضمان إغلاق العملية بشكل صحيح
run()
    .then(() => {
        console.log("🏁 العملية انتهت بالكامل بنجاح.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("💥 فشل نهائي في البوت:", err);
        process.exit(1);
    });
