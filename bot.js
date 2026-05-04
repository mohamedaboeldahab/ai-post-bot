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
async function getTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

// ================= 🤖 توليد بوست طبيعي (مصري خالص) =================
async function generatePost(user) {
  const topic = await getTopic();

  const prompt = `أنت شخص حقيقي في مصر، بتتكلم بالعامية المصرية الطبيعية جداً اللي بنستخدمها في الشارع والبيت والشغل.

اسمك: ${user.name}
شغلك: ${user.role}
طريقة تفكيرك: ${user.mindset}
أسلوبك في الكلام: ${user.tone}
النبرة المطلوبة: ${user.dialect}

الموضوع اللي هتكلم فيه النهاردة: "${topic}"

عايزين بوست قصير (6-10 أسطر) كأنك بتكتب على فيسبوك.

قواعد مهمة جداً:
- **بالعامية المصرية بس**. ممنوع أي كلمة إنجليزية أو صينية أو أي لغة تانية.
- **ممنوع استخدام أي رموز أو حروف أجنبية خالص**. حتى لو كلمة متداولة زي "Branding" أو "Marketing" اكتبها بالعربي "براندنج" أو "تسويق".
- خلي كلامك طبيعي جداً، زي ما بتتكلم مع صاحبك في القهوة أو مع زميلتك في الشغل.
- ${user.gender === 'male' ? 'أنت راجل، كلامك فيه جدية وخبرة.' : 'أنت ست، كلامك فيه حنية وذوق.'}
- في الآخر اسأل سؤال بسيط عشان الناس تتفاعل معاك.
- متنساش تكتب اسمك الحقيقي "${user.name.split(' ')[0]}" في أول البوست لو حابب.`;

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
            content: "أنت مواطن مصري حقيقي، بتتكلم بالعامية المصرية الأصيلة اللي ملهاش علاقة بالإنجليزي ولا الصيني ولا أي لغة تانية. اكتب بوستات فيسبوك واقعية جداً. ممنوع استخدام أي كلمة مش عربية."
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6, // أقل لتجنب الهلوسة
        max_tokens: 300
      }),
    }
  );

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

// ================= 🛑 fallback طبيعي (مصري) =================
function fallback(user) {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const intro = user.gender === 'male' ? "أنا" : "أنا";
  const name = user.name.split(" ")[0];

  const templates = [
    `${intro} ${name}، ${user.role}. 
 طول النهاردة بفكر في موضوع "${topic}"، بصراحة الموضوع ده شاغل بال ناس كتير. 
 اللي يشوف السوق دلوقتي يلاقي إن فيه فرص كتير بس برضه فيه تحديات. 
 إيه رأيكم؟ حد عنده تجربة في الموضوع ده؟`,
    
    `${intro} ${name} من مصر، بشتغل ${user.role}. 
 حابب أتكلم عن "${topic}"، ده موضوع مهم لأي حد بيفكر يبدأ مشروع. 
 أنا شايف إن الأهم هو إن الواحد يبدأ حتى لو بإمكانيات بسيطة. 
 إنتو إيه رأيكم؟`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ================= 🚀 التشغيل =================
async function run() {
  try {
    const user = characters[Math.floor(Math.random() * characters.length)];

    console.log("🧠 بيكتب:", user.name);

    let content;

    try {
      content = await generatePost(user);
      // تنظيف أي كلمات إنجليزية متبقية
      content = content.replace(/[a-zA-Z]+/g, (match) => {
        // لو الكلمة معروفة نترجمها، لو لأ نشيلها
        const translations = {
          'Branding': 'براندنج',
          'Marketing': 'تسويق',
          'Startup': 'شركة ناشئة',
          'Business': 'بيزنس',
          'CEO': 'مدير',
          'AI': 'ذكاء اصطناعي',
        };
        return translations[match] || '';
      });
      // إزالة أي رموز صينية أو غريبة
      content = content.replace(/[\u4e00-\u9fff\u3400-\u4dbf]+/g, '');
      // إزالة المسافات الزيادة
      content = content.replace(/\s+/g, ' ').trim();
      
      if (content.length < 30) throw new Error("Short content");
    } catch (e) {
      console.log("⚠️ fallback شغال");
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

    console.log("✅ تم نشر بوست مصري:", user.name);
  } catch (err) {
    console.error("💥 Error:", err.message);
    // إعادة المحاولة مرة واحدة
    setTimeout(() => run(), 5000);
  }
}

run();
