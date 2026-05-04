import admin from "firebase-admin";

// ================= 🔐 Firebase =================
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ================= 📊 أخبار البورصة والطروحات (تحدث يدوياً أو بـ API) =================
const dailyMarketNews = [
  "أداء قوي للأسهم القيادية في البورصة المصرية النهاردة ومؤشر EGX30 بيكسر مستويات تاريخية.",
  "كلام كتير عن طروحات حكومية جديدة قادمة في قطاع البنوك والطاقة (بنك القاهرة، صافي).",
  "زيادة إقبال المستثمرين العرب على أسهم العقارات المصرية بسبب صفقات رأس الحكمة وتطوير الساحل.",
  "توقعات بارتفاع أسهم قطاع الأسمدة والبتروكيماويات بسبب الطلب العالمي."
];

// ================= 👥 الشخصيات المحدثة (خبراء ومستثمرين) =================
const characters = [
  {
    name: "أحمد الجوهري",
    role: "محلل مالي وبورصة",
    mindset: "بيحلل الأسهم بالورقة والقلم وبيدور على الـ Undervalued stocks",
    tone: "محترف - تقني - بيحب لغة الأرقام",
    type: "shark",
    dialect: "مصري مودرن (لغة مستثمرين)"
  },
  {
    name: "سامي الحديدي",
    role: "مستثمر صناعي",
    mindset: "بيحب الاستثمار في الأصول الملموسة والمصانع والأسهم الصناعية",
    tone: "عملي - بيكره المخاطرة العالية",
    type: "shark",
    dialect: "مصري بيزنس تقيل"
  },
  {
    name: "ليلى فريد",
    role: "مخططة مالية للأفراد",
    mindset: "بتعلم الشباب إزاي يبدأوا استثمار بـ 1000 جنيه في صناديق الاستثمار",
    tone: "تعليمي - مشجع - بسيط",
    type: "builder",
    dialect: "عامية مصرية راقية"
  },
  {
    name: "كريم يحيى",
    role: "متداول يومي (Day Trader)",
    mindset: "بيجري ورا التريندات في البورصة وبيدور على الربح السريع",
    tone: "متحمس - بيحب المخاطرة",
    type: "builder",
    dialect: "لغة شباب البورصة"
  }
];

// ================= 🧠 مواضيع الاستثمار والتعليم =================
const investmentTopics = [
  "أسهل طريقة تبدأ بيها استثمار في البورصة المصرية من الموبايل.",
  "إزاي تبني محفظة استثمارية متنوعة (ذهب، أسهم، عقار).",
  "يعني إيه 'طروحات أولية' وإزاي نكسب منها؟",
  "تحليل لسهم معين في قطاع العقارات بعد أخبار النهاردة.",
  "إزاي تستثمر في الأسهم اللي بتوزع أرباح (Dividends) عشان تعمل دخل سلبي.",
  "الفرق بين الادخار والاستثمار.. ليه شايل فلوسك في البنك؟"
];

// ================= 🤖 توليد البوست الذكي =================
async function generateInvestmentPost(user) {
  const news = dailyMarketNews[Math.floor(Math.random() * dailyMarketNews.length)];
  const topic = investmentTopics[Math.floor(Math.random() * investmentTopics.length)];

  const prompt = `أنت ${user.name}، ${user.role}. ${user.mindset}. أسلوبك: ${user.tone}. نبرتك: ${user.dialect}.

المهمة: اكتب بوست لتطبيق Sharkup.
السياق العام: فيه أخبار النهاردة بتقول: "${news}".
الموضوع الأساسي للبوست: "${topic}".

تعليمات الكتابة:
1. ادمج خبر البورصة النهاردة مع موضوع الاستثمار اللي اخترناه بشكل طبيعي.
2. اتكلم عن "الأسهم المصرية" أو "الطروحات الجديدة" كأنك متابع السوق لحظة بلحظة.
3. لو أنت شارك (Shark): انصح الشباب بالاستثمار طويل الأجل أو علق على الطروحات الحكومية.
4. لو أنت باني (Builder): احكي إنك بدأت تستثمر أو بتسأل عن سهم معين.
5. اللغة: عامية مصرية (Business Slang). ممنوع الإنجليزي (إلا لو مصطلحات زي Stocks، Portfolio تتكتب بالعربي).
6. النهاية: لازم سؤال تفاعلي (مثلاً: "ناويين تدخلوا في الطروحات الجديدة؟" أو "إيه أحسن سهم في محفظتكم؟").`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "أنت خبير استثمار مصري. بتكتب بوستات تفاعلية عن البورصة المصرية والبيزنس لجمهور تطبيق Sharkup." 
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  let content = data.choices?.[0]?.message?.content || "";
  
  // تنظيف النص من أي زوائد (اسم الشخصية، علامات ترقيم زيادة)
  return content.replace(/^[\p{L}\s]+?\s*:\s*/u, '').trim();
}

// ================= 🚀 التشغيل =================
async function run() {
  try {
    const user = characters[Math.floor(Math.random() * characters.length)];
    const postContent = await generateInvestmentPost(user);

    await db.collection("posts").add({
      content: postContent,
      authorName: user.name,
      authorRole: user.role,
      authorPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      type: user.type,
      category: "Investment", // تصنيف جديد للفلترة في التطبيق
      ai: true,
      supportCount: 0,
      opposeCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ ${user.name} نشر تحليل عن البورصة والاستثمار.`);
  } catch (err) {
    console.error("💥 فشل:", err.message);
  }
}

run();
