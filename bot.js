import admin from "firebase-admin";

// ================= 🔐 Firebase =================
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ================= 👥 شخصيات مصرية واقعية جداً =================
const characters = [
  {
    name: "أحمد الجوهري",
    role: "مستشار استثمار",
    gender: "male",
    mindset: "بيفكر بالأرقام والعائد قبل أي حاجة",
    tone: "هادئ - مختصر - عقلاني",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "shark",
    dialect: "مصري راقي",
  },
  {
    name: "سامي الحديدي",
    role: "رجل صناعة",
    gender: "male",
    mindset: "بيفكر في الإنتاج والتشغيل",
    tone: "عملي ومباشر",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    type: "shark",
    dialect: "مصري شعبي شوية",
  },
  {
    name: "هالة منصور",
    role: "خبيرة براندنج",
    gender: "female",
    mindset: "بتفكر في الشكل والهوية",
    tone: "هادية ومنظمة",
    photo: "https://randomuser.me/api/portraits/women/24.jpg",
    type: "shark",
    dialect: "مصري ناعم ومؤدب",
  },
  {
    name: "محمد علي",
    role: "مطور تطبيقات",
    gender: "male",
    mindset: "بيحل المشاكل بالتكنولوجيا",
    tone: "تحليلي بسيط",
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
    type: "builder",
    dialect: "مصري بسيط",
  },
  {
    name: "سارة مصطفى",
    role: "مصممة جرافيك",
    gender: "female",
    mindset: "بتحكي تجارب وبتتعلم من السوق",
    tone: "قصصي طبيعي",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    type: "builder",
    dialect: "مصري بناتي عفوي",
  },
  {
    name: "كريم أحمد",
    role: "صاحب مشروع صغير",
    gender: "male",
    mindset: "بيعافر في السوق",
    tone: "عفوي وبسيط",
    photo: "https://randomuser.me/api/portraits/men/6.jpg",
    type: "builder",
    dialect: "مصري شعبي",
  },
];

// ================= 🧠 مواضيع مصرية =================
const topics = [
  "إزاي تجيب أول عميل؟",
  "هل أسيب شغلي وأبدأ مشروع؟",
  "التسعير في السوق المصري",
  "الاستيراد ولا التصنيع المحلي؟",
  "الشراكة: ميزة ولا قنبلة موقوتة؟",
  "التعامل مع الحرفيين والصنايعية",
  "إزاي تسوق للناس اللي مش بتقرأ؟",
];

// ================= 🔁 اختيار موضوع =================
function getTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

// ================= 🤖 توليد بوست طبيعي (مصري خالص) =================
async function generatePostContent(user) {
  const topic = getTopic();
  const isFemale = user.gender === 'female';

  const prompt = `أنت ${user.name}، ${user.role}. ${user.mindset}. أسلوبك: ${user.tone}. نبرتك: ${user.dialect}.

الموضوع: "${topic}"

**تعليمات صارمة لكتابة البوست:**
1.  **اكتب مباشرة، لا تبدأ باسمك أو "فلان:" أبداً.**
2.  اكتب من ٥ إلى ٨ أسطر بالعامية المصرية الأصيلة، كأنك بتتكلم مع أصحابك.
3.  ممنوع أي كلمة إنجليزية أو صينية. الكلمات الأجنبية المتداولة تكتب بالعربي (زي "براندنج").
4.  في النهاية اسأل سؤال بسيط للتفاعل.
5.  **مهم جداً**: خاطب الجمهور بصيغة المؤنث ("أنتِ"، "جربتي"، "شايفة") لو كنتِ ست، وبصيغة المذكر ("أنت"، "جربت"، "شايف") لو كنت راجل. خليك طبيعي في الخطاب ده.`;

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
            content: `أنت شخص مصري حقيقي على فيسبوك. بتكتب بوستات بالعامية المصرية مباشرة بدون ذكر اسمك في البداية. ${isFemale ? 'أنتِ امرأة وتخاطبين النساء بشكل طبيعي.' : 'أنت رجل وتخاطب الجمهور بشكل طبيعي.'}`
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
  // إزالة اسم الشخصية متبوعًا بنقطتين في بداية النص (مثل "سارة مصطفى:")
  content = content.replace(/^[\p{L}\s]+?\s*:\s*/u, '');
  // إزالة أي أحرف إنجليزية
  content = content.replace(/[a-zA-Z]+/g, (match) => {
    const translations = {
      'Branding': 'براندنج', 'Marketing': 'تسويق', 'Startup': 'شركة ناشئة',
      'Business': 'بيزنس', 'CEO': 'مدير', 'AI': 'ذكاء اصطناعي',
    };
    return translations[match] || '';
  });
  // إزالة أي رموز صينية أو غريبة
  content = content.replace(/[\u4e00-\u9fff\u3400-\u4dbf]+/g, '');
  // إزالة المسافات الزيادة
  content = content.replace(/\s+/g, ' ').trim();

  return content;
}

// ================= 🛑 fallback طبيعي =================
function fallback(user) {
  const topic = getTopic();
  const isFemale = user.gender === 'female';
  const pronoun = isFemale ? 'أنتِ' : 'أنت';

  const templates = [
    `طول النهاردة بفكر في موضوع "${topic}"، بصراحة الموضوع ده شاغل بال ناس كتير. اللي يشوف السوق دلوقتي يلاقي إن فيه فرص كتير بس برضه فيه تحديات. إيه رأيكم؟ حد عنده تجربة في الموضوع ده؟`,

    `حابب أتكلم عن "${topic}"، ده موضوع مهم لأي حد بيفكر يبدأ مشروع. أنا شايف إن الأهم هو إن الواحد يبدأ حتى لو بإمكانيات بسيطة. ${pronoun} إيه رأيك؟`,

    `النهاردة جاي أفكر في "${topic}"، والنبي يا جماعة حد يقولي إزاي الواحد ممكن يتعامل مع الموضوع ده؟ أنا محتار بصراحة.`,
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

    console.log(`✅ تم نشر بوست مصري لـ ${user.name}`);
  } catch (err) {
    console.error("💥 فشل التشغيل:", err.message);
    setTimeout(() => run(), 5000);
  }
}

run();
