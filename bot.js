import admin from "firebase-admin";

// ================= 🔐 Firebase =================
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ================= 👥 شخصيات مصرية واقعية (قروش البورصة) =================
const characters = [
  {
    name: "أحمد الجوهري",
    role: "مستشار استثمار",
    gender: "male",
    mindset: "بيفكر بالأرقام والعائد قبل أي حاجة، ومتابع البورصة لحظة بلحظة",
    tone: "هادئ - مختصر - عقلاني",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "shark",
    dialect: "مصري راقي",
  },
  {
    name: "سامي الحديدي",
    role: "رجل صناعة",
    gender: "male",
    mindset: "بيفكر في الإنتاج والتشغيل، وعنده نظرة على السوق الصناعي",
    tone: "عملي ومباشر",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    type: "shark",
    dialect: "مصري شعبي شوية",
  },
  {
    name: "هالة منصور",
    role: "خبيرة براندنج",
    gender: "female",
    mindset: "بتفهم في التسويق والبراندنج، وعندها حس تحليلي للسوق والشركات الجديدة",
    tone: "هادية ومنظمة",
    photo: "https://randomuser.me/api/portraits/women/24.jpg",
    type: "shark",
    dialect: "مصري ناعم ومؤدب",
  },
  {
    name: "محمد علي",
    role: "مطور تطبيقات",
    gender: "male",
    mindset: "بيحل المشاكل بالتكنولوجيا، متحمس للاستثمار في التكنولوجيا",
    tone: "تحليلي بسيط",
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
    type: "builder",
    dialect: "مصري بسيط",
  },
  {
    name: "سارة مصطفى",
    role: "مصممة جرافيك",
    gender: "female",
    mindset: "بتحكي تجارب وبتتعلم من السوق، بتحب تسمع آراء الناس",
    tone: "قصصي طبيعي",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    type: "builder",
    dialect: "مصري بناتي عفوي",
  },
  {
    name: "كريم أحمد",
    role: "صاحب مشروع صغير",
    gender: "male",
    mindset: "بيعافر في السوق، مهتم بالاستثمار عشان يكبر مشروعه",
    tone: "عفوي وبسيط",
    photo: "https://randomuser.me/api/portraits/men/6.jpg",
    type: "builder",
    dialect: "مصري شعبي",
  },
];

// ================= 🧠 مواضيع الاستثمار والبورصة =================
const topics = [
  "إزاي تبدأ تستثمر في البورصة المصرية",
  "أهمية متابعة أخبار الطروحات الجديدة",
  "هل الصناديق الاستثمارية ولا الأسهم الفردية؟",
  "إزاي تقرأ تحليل مؤشرات البورصة (EGX30/EGX70)",
  "أهمية السيولة وحجم التداول في اختيار السهم",
  "الاستثمار طويل المدى ولا المضاربة السريعة؟",
  "دور المستثمرين الأجانب في تحريك السوق",
  "هل تستثمر في شركات حكومية بعد الطرح؟",
  "تأثير القرارات الاقتصادية على البورصة المصرية",
  "كيفية بناء محفظة أسهم متنوعة بمبلغ صغير",
];

// ================= 🔁 اختيار موضوع =================
function getTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

// ================= 🤖 توليد بوست احترافي (قروش البورصة) =================
async function generatePostContent(user) {
  const topic = getTopic();
  const isFemale = user.gender === 'female';

  const prompt = `أنت ${user.name}، ${user.role}. ${user.mindset}. أسلوبك: ${user.tone}. نبرتك: ${user.dialect}.

الموضوع: "${topic}"

**تعليمات صارمة لكتابة البوست:**
1.  **اكتب مباشرة، لا تبدأ باسمك أو "فلان:" أبداً.**
2.  اكتب من ٥ إلى ٨ أسطر بالعامية المصرية الأصيلة، كأنك بتتكلم مع أصحابك.
3.  ممنوع أي كلمة إنجليزية أو صينية. الكلمات الأجنبية المتداولة تكتب بالعربي (زي "بورصة" بدل "Stock Market").
4.  في النهاية اسأل سؤال بسيط للتفاعل.
5.  **مهم جداً**: خاطب الجمهور بصيغة المؤنث ("أنتِ"، "جربتي"، "شايفة") لو كنتِ ست، وبصيغة المذكر ("أنت"، "جربت"، "شايف") لو كنت راجل.`;

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
            content: `أنت خبير استثمار مصري حقيقي على فيسبوك. بتكتب بوستات بالعامية المصرية عن البورصة والاستثمار. لا تبدأ باسمك أبداً. ${isFemale ? 'أنتِ امرأة وتخاطبين النساء بشكل طبيعي.' : 'أنت رجل وتخاطب الجمهور بشكل طبيعي.'}`
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 300
      }),
    }
  );

  const data = await res.json();
  let content = data.choices?.[0]?.message?.content || "";

  // --- تنظيف متقدم ---
  content = content.replace(/^[\p{L}\s]+?\s*:\s*/u, '');
  content = content.replace(/[a-zA-Z]+/g, (match) => {
    const translations = {
      'IPO': 'طرح عام', 'Stock': 'سهم', 'Market': 'سوق', 'Index': 'مؤشر',
      'Trading': 'تداول', 'Investment': 'استثمار', 'Portfolio': 'محفظة',
    };
    return translations[match] || '';
  });
  content = content.replace(/[\u4e00-\u9fff\u3400-\u4dbf]+/g, '');
  content = content.replace(/\s+/g, ' ').trim();

  return content;
}

// ================= 🛑 fallback طبيعي =================
function fallback(user) {
  const topic = getTopic();
  const templates = [
    `طول النهاردة بفكر في موضوع "${topic}"، بصراحة الموضوع ده شاغل بال ناس كتير في البورصة. اللي يشوف السوق دلوقتي يلاقي إن فيه فرص كتير بس برضه فيه تحديات. إيه رأيكم؟`,

    `حابب أتكلم عن "${topic}"، ده موضوع مهم لأي حد بيفكر يدخل البورصة. أنا شايف إن الأهم هو إن الواحد يبدأ حتى لو بإمكانيات بسيطة ويتعلم. إنتو إيه رأيكم؟`,

    `النهاردة جاي أشارككم رأيي في "${topic}"، والنبي يا جماعة حد جرب يستثمر في الموضوع ده؟ أنا محتار بصراحة.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ================= 🚀 التشغيل =================
async function run() {
  try {
    const user = characters[Math.floor(Math.random() * characters.length)];
    console.log(`🧠 بيولد بوست لـ ${user.name}...`);

    let content;
    try {
      content = await generatePostContent(user);
      if (content.length < 30) throw new Error("Short content");
    } catch (e) {
      console.log("⚠️ AI فشل، سيتم استخدام النص الاحتياطي");
      content = fallback(user);
    }

    await db.collection("posts").add({
      content: content.trim(),
      authorName: user.name,
      authorRole: user.role,
      authorPhoto: user.photo,
      gender: user.gender,
      type: user.type,
      ai: true,
      supportCount: 0,
      opposeCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ تم نشر بوست لـ ${user.name}`);
  } catch (err) {
    console.error("💥 فشل التشغيل:", err.message);
    setTimeout(() => run(), 5000);
  }
}

run();
