import admin from "firebase-admin";

// ================= 🔐 Firebase =================
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// ================= 👥 الشخصيات =================
const characters = [
  // 🦈 Sharks (مستشارين)
  {
    name: "أحمد الجوهري",
    role: "مستشار أعمال",
    bio: "بيفكر بمنطق الأرقام والاستثمار طويل المدى",
    type: "shark"
  },
  {
    name: "سامي الحديدي",
    role: "رجل صناعة",
    bio: "خبير مصانع وتوسعات إنتاج",
    type: "shark"
  },
  {
    name: "هالة منصور",
    role: "خبيرة براندنج",
    bio: "بتحب المشاريع المنظمة والبراند القوي",
    type: "shark"
  },
  {
    name: "عادل فوزي",
    role: "محلل مالي",
    bio: "كل قراراته مبنية على أرقام وتحليل",
    type: "shark"
  },

  // 💼 Entrepreneurs
  {
    name: "كريم أحمد",
    role: "صاحب مشروع أكل",
    bio: "بيحاول يكبر مشروعه في السوق",
    type: "contestant"
  },
  {
    name: "سارة مصطفى",
    role: "مصممة جرافيك",
    bio: "فريلانس وبتتعامل مع عملاء صعبين",
    type: "contestant"
  },
  {
    name: "محمد علي",
    role: "مطور تطبيقات",
    bio: "بيعمل مشاريع تقنية وبيحاول ينجح",
    type: "contestant"
  },
  {
    name: "مريم خالد",
    role: "صاحبة متجر أونلاين",
    bio: "عندها مشاكل شحن ومنافسة",
    type: "contestant"
  },
  {
    name: "يوسف سامي",
    role: "متداول كريبتو",
    bio: "بيتكلم عن المخاطرة والاستثمار",
    type: "contestant"
  },
  {
    name: "دنيا إبراهيم",
    role: "مسوقة رقمية",
    bio: "بتفهم في السوشيال ميديا والترندات",
    type: "contestant"
  }
];

// ================= 🧠 مواضيع =================
const topics = [
  "خسرت أول مشروع ليا",
  "هل الاستثمار في العقارات مفيد؟",
  "مشكلة الشحن والتوصيل",
  "إزاي أجيب أول عميل؟",
  "هل أسيب شغلي وأبدأ بيزنس؟",
  "تسعير المنتجات",
  "الذكاء الاصطناعي في البيزنس",
  "المنافسة في السوق",
  "الشراكة في المشاريع",
  "إدارة الفلوس"
];

// ================= 🔁 منع التكرار =================
const metaRef = db.collection("meta").doc("topics");

async function getTopic() {
  const snap = await metaRef.get();
  let used = snap.exists ? snap.data().used || [] : [];

  const available = topics.filter(t => !used.includes(t));
  const topic =
    available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : topics[Math.floor(Math.random() * topics.length)];

  await metaRef.set({
    used: [...used.slice(-15), topic]
  });

  return topic;
}

// ================= 🤖 AI =================
async function generatePost(user) {
  const topic = await getTopic();

  const prompt = `
أنت شخص مصري اسمه ${user.name}.
وظيفتك: ${user.role}
خلفيتك: ${user.bio}

اكتب بوست عن: ${topic}

القواعد:
- لهجة مصرية طبيعية 100%
- ممنوع الفصحى
- خليك واقعي
- شارك أو مستثمر: كلامك تقيل ومختصر
- عادي: احكي موقف أو مشكلة
- لازم سؤال في النهاية
- استخدم تعبيرات زي: لبست في الحيط، الزتونة، عك، سوق
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "مصري بيكتب بوستات بيزنس طبيعية جدًا." },
        { role: "user", content: prompt }
      ],
      temperature: user.type === "shark" ? 0.6 : 0.95
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

// ================= 🛡️ fallback =================
function fallback(user) {
  const posts = [
    "حد جرب يخسر في مشروع ويرجع يقف تاني؟",
    "أنا لبست في الحيط قبل كده في بيزنس 😅",
    "أهم حاجة تبدأ حتى لو مش جاهز",
    "السوق صعب بس فيه فرص حقيقية"
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
      authorPhoto: `https://i.pravatar.cc/150?u=${encodeURIComponent(user.name)}`,
      isShark: user.type === "shark",
      ai: true,
      supportCount: 0,
      opposeCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ تم نشر بوست:", user.name);

  } catch (err) {
    console.error("💥 خطأ:", err.message);
  }
}

run();
