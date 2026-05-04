import admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعدادات Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 2. إعدادات الذكاء الاصطناعي (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. تطوير الشخصيات بـ "بروفايل نفسي" (System Instructions)
const characters = [
  {
    name: "أحمد حسن",
    photo: "https://i.pravatar.cc/150?img=12",
    role: "خبير استثمار عقاري وبورصة",
    bio: "بيتكلم بلغة الأرقام، أسلوبه هادي وعملي، بيحب يحلل الفرص السوقية."
  },
  {
    name: "سارة محمد",
    photo: "https://i.pravatar.cc/150?img=5",
    role: "لايف كوتش ورائدة أعمال",
    bio: "أسلوبها حماسي جداً، بتركز على عقلية النجاح (Mindset) وازاي تتغلب على الخوف."
  },
  {
    name: "كريم علي",
    photo: "https://i.pravatar.cc/150?img=8",
    role: "مطور مشاريع ناشئة (Startups)",
    bio: "بيحب الكلام في التكنولوجيا والتسويق، أسلوبه سريع ومباشر وبيدي خطوات عملية."
  },
  {
    name: "منى خالد",
    photo: "https://i.pravatar.cc/150?img=20",
    role: "مستشارة إدارة أموال شخصية",
    bio: "بتركز على الادخار والذكاء المالي، أسلوبها زي الأخت الكبيرة اللي بتخاف على مصلحتك."
  }
];

// 4. دالة توليد المحتوى القوي باستخدام AI
async function generateAIPost(character) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // البرومبت (Prompt) اللي هيخلي الـ AI يكتب بوست طويل
    const prompt = `
        أنت الآن تلعب دور شخصية في تطبيق "Sharkup".
        اسمك: ${character.name}.
        وظيفتك: ${character.role}.
        خلفيتك: ${character.bio}.
        
        المطلوب: اكتب منشور (Post) طويل ومؤثر بالعامية المصرية المثقفة. 
        - المنشور يجب أن يحتوي على: مقدمة تجذب الانتباه، محتوى تعليمي أو تحفيزي دسم، وخاتمة فيها نصيحة أو سؤال للجمهور.
        - استخدم الإيموجي بشكل مناسب.
        - لا تزيد عن 150 كلمة ولا تقل عن 50 كلمة.
        - ركز على تقديم قيمة حقيقية لمستخدمي تطبيق Sharkup.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

async function run() {
  try {
    // اختيار شخصية عشوائية
    const character = characters[Math.floor(Math.random() * characters.length)];
    
    console.log(`⏳ جاري توليد محتوى لـ ${character.name}...`);
    const aiContent = await generateAIPost(character);

    // إضافة البوست لقاعدة البيانات
    await db.collection("posts").add({
      content: aiContent,
      authorName: character.name,
      authorPhoto: character.photo,
      authorRole: character.role, // إضافة تخصص الشخصية لإعطاء مصداقية
      type: "post",
      ai: true,
      supportCount: 0,
      opposeCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ تم نشر المنشور الطويل بنجاح!");

  } catch (error) {
    console.error("❌ خطأ في العملية:", error);
  }
}

run();
