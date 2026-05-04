import admin from "firebase-admin";

// ================= 🔐 Firebase =================
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ================= 👥 شخصيات بشرية واقعية =================
const characters = [
  {
    name: "أحمد الجوهري",
    role: "مستشار استثمار",
    gender: "male",
    mindset: "بيفكر بالأرقام والعائد قبل أي حاجة",
    tone: "هادئ - مختصر - عقلاني",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "shark",
  },
  {
    name: "سامي الحديدي",
    role: "رجل صناعة",
    gender: "male",
    mindset: "بيفكر في الإنتاج والتشغيل",
    tone: "عملي ومباشر",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    type: "shark",
  },
  {
    name: "هالة منصور",
    role: "خبيرة براندنج",
    gender: "female",
    mindset: "بتفكر في الشكل والهوية",
    tone: "هادية ومنظمة",
    photo: "https://randomuser.me/api/portraits/women/24.jpg",
    type: "shark",
  },
  {
    name: "محمد علي",
    role: "مطور تطبيقات",
    gender: "male",
    mindset: "بيحل المشاكل بالتكنولوجيا",
    tone: "تحليلي بسيط",
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
    type: "builder",
  },
  {
    name: "سارة مصطفى",
    role: "مصممة جرافيك",
    gender: "female",
    mindset: "بتحكي تجارب وبتتعلم من السوق",
    tone: "قصصي طبيعي",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    type: "builder",
  },
  {
    name: "كريم أحمد",
    role: "صاحب مشروع صغير",
    gender: "male",
    mindset: "بيعافر في السوق",
    tone: "عفوي وبسيط",
    photo: "https://randomuser.me/api/portraits/men/6.jpg",
    type: "builder",
  },
];

// ================= 🧠 مواضيع =================
const topics = [
  "هل الذكاء الاصطناعي هيغير البيزنس في مصر؟",
  "إزاي تجيب أول عميل؟",
  "هل أسيب شغلي وأبدأ مشروع؟",
  "مشكلة التسعير في السوق",
  "هل الشراكة فكرة كويسة؟",
];

// ================= 🔁 اختيار موضوع =================
async function getTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

// ================= 🤖 توليد بوست طبيعي =================
async function generatePost(user) {
  const topic = await getTopic();

  const prompt = `
أنت شخص حقيقي في مصر.

الاسم: ${user.name}
الوظيفة: ${user.role}
طريقة التفكير: ${user.mindset}
أسلوبك: ${user.tone}

الموضوع: ${topic}

اكتب بوست قصير طبيعي جدًا كإنك بتتكلم على فيسبوك.

قواعد:
- لهجة مصرية بسيطة جدًا
- بدون مبالغة
- بدون أي كلمات AI أو فلسفة زيادة
- لازم سؤال في النهاية
`;

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
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
            content:
              "أنت كاتب مصري طبيعي جدًا بيكتب بوستات سوشيال ميديا واقعية.",
          },
          { role: "user", content: prompt },
        ],
        temperature: user.type === "shark" ? 0.5 : 0.8,
      }),
    }
  );

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

// ================= 🛑 fallback طبيعي =================
function fallback(user) {
  const posts = [
    "التجربة أهم من الكلام في البيزنس",
    "مش كل فكرة تنفع تتنفذ بسهولة",
    "السوق محتاج صبر أكتر من الفلوس",
    "ابدأ صغير وطور مع الوقت",
  ];
  return posts[Math.floor(Math.random() * posts.length)];
}

// ================= 🚀 التشغيل =================
async function run() {
  try {
    const user = characters[Math.floor(Math.random() * characters.length)];

    console.log("🧠 بيكتب:", user.name);

    let content;

    try {
      content = await generatePost(user);
    } catch (e) {
      console.log("⚠️ fallback شغال");
      content = fallback(user);
    }

    await db.collection("posts").add({
      content: content.trim(),
      authorName: user.name,
      authorRole: user.role,
      authorPhoto: user.photo,
      mindset: user.mindset,
      type: user.type,
      ai: true,
      supportCount: 0,
      opposeCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ تم نشر بوست طبيعي:", user.name);
  } catch (err) {
    console.error("💥 Error:", err.message);
  }
}

run();
