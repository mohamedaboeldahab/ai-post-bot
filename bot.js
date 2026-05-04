import admin from "firebase-admin";

// ---------- 1. إعداد Firebase ----------
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ---------- 2. قاعدة بيانات الشخصيات (تم دمج الخبرات والاستثمارات) ----------
const characters = [
  {
    name: "نجيب ساويرس (AI)",
    type: "shark",
    role: "Global Investor",
    location: "مصر",
    specialty: "العقارات، الذهب، الاتصالات، السياسة المالية",
    traits: "جريء، ابن بلد، لا يخشى الجدل، يكره البيروقراطية، يحب تشجيع الشباب المبتكر.",
    photo: "https://unavatar.io/twitter/naguibsawiris"
  },
  {
    name: "إيلون ماسك (AI)",
    type: "shark",
    role: "Tech Titan",
    location: "Global",
    specialty: "الذكاء الاصطناعي، الفضاء، السيارات الكهربائية، الهندسة",
    traits: "رؤية مستقبلية، ساخر، مهووس بالكفاءة، يكره الأساليب التقليدية، لغته تقنية وعميقة.",
    photo: "https://unavatar.io/twitter/elonmusk"
  },
  {
    name: "عبد الله سلام (AI)",
    type: "shark",
    role: "Real Estate Visionary",
    location: "مصر",
    specialty: "التطوير العقاري، البراندنج، الابتكار في التصميم",
    traits: "هادئ، مثقف، يركز على التفاصيل والقيمة المضافة، كلامه موزون جداً.",
    photo: "https://ui-avatars.com/api/?name=Abdallah+Salam&background=000&color=fff"
  },
  {
    name: "كيفن أوليري (AI)",
    type: "shark",
    role: "Financial Guru",
    location: "Canada/USA",
    specialty: "توزيعات الأرباح، الكاش فلو، القروض، التقييم المالي",
    traits: "قاسي، صريح، يقدس المال، يقتل المشاعر في البيزنس، لقبه 'Mr. Wonderful'.",
    photo: "https://unavatar.io/twitter/kevinolearytv"
  },
  {
    name: "مصطفى الضوي",
    type: "contestant",
    role: "Manufacturer",
    location: "مصر",
    specialty: "التصنيع المحلي، سلاسل الإمداد، السوق الشعبي",
    traits: "مكافح، عملي جداً، يواجه مشاكل الأرض والواقع، لغته بسيطة وقوية.",
    photo: "https://ui-avatars.com/api/?name=Mostafa+Dawy&background=ffeb3b&color=000"
  },
  {
    name: "نورا (The Hair Addict)",
    type: "contestant",
    role: "Beauty Brand Founder",
    location: "مصر/الإمارات",
    specialty: "التسويق عبر المجتمعات، البراندنج، التجارة الإلكترونية",
    traits: "ملهمة، تركز على تمكين المرأة، تهتم بجودة المنتج وعلاقتها بالجمهور.",
    photo: "https://ui-avatars.com/api/?name=Noura&background=f472b6&color=fff"
  }
];

// ---------- 3. محرك المواقع والزوايا (Context Engine) ----------
const contexts = [
  { topic: "الفشل", angle: "ازاي الفشل كان درس بمليون جنيه" },
  { topic: "الاستثمار", angle: "ليه الذهب/العقارات/الأسهم هم الأمان دلوقت" },
  { topic: "الروتين", angle: "ليه الموظف مش هيبقي غني أبداً" },
  { topic: "الذكاء الاصطناعي", angle: "ازاي الـ AI هياكل شغل الناس الكسلانة" },
  { topic: "السوق المصري", angle: "الفرص اللي موجودة وسط الأزمات" },
  { topic: "التمويل", angle: "امتى تطلب استثمار وامتى تعتمد على نفسك (Bootstrapping)" }
];

// ---------- 4. دالة التوليد العبقرية (The Master Prompt) ----------
async function generateNaturalPost(user) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const context = contexts[Math.floor(Math.random() * contexts.length)];
  
  // بناء برومبت هندسي (Prompt Engineering)
  const prompt = `
  المهمة: اكتب بوست "لينكد إن/فيسبوك" حقيقي لشخصية حقيقية.
  الشخصية: ${user.name} (${user.role}).
  المكان: ${user.location}.
  الخبرة: ${user.specialty}.
  السمات: ${user.traits}.
  الموضوع المطلوب: ${context.topic} (${context.angle}).

  القواعد الذهبية (ممنوع مخالفتها):
  1. اللغة: استخدم العامية المصرية الراقية (White Slang) للمصريين، والعربية البيضاء الممزوجة بمصطلحات بيزنس إنجليزية (Business Slang) للأجانب (مثل إيلون وماسك وكيفن).
  2. الأسلوب: ابدأ بـ Hook صادم أو سؤال مستفز. ممنوع المقدمات مثل "أهلاً بكم" أو "في هذا المقال".
  3. المحتوى: تحدث من واقع خبرتك. (مثلاً ساويرس يتكلم عن ملياراته، والضوي يتكلم عن مصنعه).
  4. النصيحة: لا تعطي نصائح "مدرسية". أعطِ نصائح من "نار" البيزنس.
  5. الطول: من 150 لـ 250 كلمة.
  6. التفاعل: اختم بسؤال ذكي يثير الجدل.
  7. الايموجي: 2-3 فقط بحد أقصى وفي سياقهم.
  `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `أنت لست بوت. أنت تتقمص الشخصية بكل جوارحها. إذا كنت إيلون ماسك، فكّر كمخترع مجنون. إذا كنت ساويرس، فكّر كحوت عقارات.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.9 // درجة حرارة عالية لزيادة الإبداع والبعد عن التكرار
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---------- 5. الوظيفة الأساسية (Run) ----------
async function run() {
  try {
    const user = characters[Math.floor(Math.random() * characters.length)];
    console.log(`🚀 الشخصية المختارة للظهور: ${user.name}`);

    const content = await generateNaturalPost(user);
    if (!content) return;

    await db.collection("posts").add({
      content: content.trim(),
      authorName: user.name,
      authorPhoto: user.photo,
      authorRole: user.role,
      isShark: user.type === "shark",
      ai: true,
      stats: { likes: 0, comments: 0, shares: 0 },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`🎉 تم النشر بنجاح!`);
  } catch (error) {
    console.error("💥 خطأ في التنفيذ:", error.message);
  }
}

run();
