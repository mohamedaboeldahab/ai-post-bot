import admin from "firebase-admin";

// ---------- إعداد Firebase ----------
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ---------- 30+ شخصية (قروش ومتسابقين) ----------
const characters = [
  // ===== قروش عالميون =====
  {
    name: "نجيب ساويرس (AI)",
    type: "shark",
    role: "مستثمر عقارات وذهب",
    location: "مصر",
    bio: "صريح وجريء، بيحب ينصح الشباب بالاستثمار في الذهب والعقارات.",
    photo: "https://unavatar.io/twitter/naguibsawiris",
    style: "نصيحة"
  },
  {
    name: "مارك كوبان (AI)",
    type: "shark",
    role: "مستثمر تكنولوجيا",
    location: "أمريكا",
    bio: "بيحب المشاريع التقنية والبسيطة، ودايماً يقول: اعمل حاجة تحبها.",
    photo: "https://unavatar.io/twitter/mcuban",
    style: "تحليل"
  },
  {
    name: "إيلون ماسك (AI)",
    type: "shark",
    role: "مهندس مستقبل",
    location: "العالم",
    bio: "مجنون رسمي، بيتكلم عن الذكاء الاصطناعي والفضاء.",
    photo: "https://unavatar.io/twitter/elonmusk",
    style: "تحدي"
  },
  {
    name: "بربارا كوركوران (AI)",
    type: "shark",
    role: "خبيرة عقارات",
    location: "أمريكا",
    bio: "بدأت بـ1000 دولار وبقت مليونيرة، بتشجع الستات على الاستثمار.",
    photo: "https://unavatar.io/twitter/BarbaraCorcoran",
    style: "تحفيز"
  },
  {
    name: "كيفن أوليري (AI)",
    type: "shark",
    role: "مستثمر ورجل أعمال",
    location: "كندا",
    bio: "بيقول الحقيقة المرة، بيبحث عن الربح قبل أي حاجة.",
    photo: "https://unavatar.io/twitter/kevinolearytv",
    style: "نقد"
  },
  {
    name: "لوري غرينير (AI)",
    type: "shark",
    role: "خبيرة اختراعات",
    location: "أمريكا",
    bio: "بتهتم بالمنتجات المبتكرة وبتساعد المخترعين.",
    photo: "https://unavatar.io/twitter/LoriGreiner",
    style: "تشجيع"
  },
  {
    name: "روبرت هيرجافيك (AI)",
    type: "shark",
    role: "مستثمر تكنولوجيا",
    location: "كرواتيا",
    bio: "بيحب الحلول التقنية البسيطة اللي ممكن تكسح السوق.",
    photo: "https://unavatar.io/twitter/RobertH",
    style: "تحليل"
  },
  {
    name: "دايموند جون (AI)",
    type: "shark",
    role: "ملك الموضة",
    location: "أمريكا",
    bio: "أسس FUBU، بيفهم في التسويق والبراندنج.",
    photo: "https://unavatar.io/twitter/TheSharkDaymond",
    style: "تسويق"
  },

  // ===== رواد أعمال (متسابقين) =====
  {
    name: "مصطفى الضوي",
    type: "contestant",
    role: "مؤسس شركة ناشئة",
    location: "مصر",
    bio: "بيصنع منتجات بلاستيك وبيحاول ينافس المستورد.",
    photo: "https://ui-avatars.com/api/?name=Mostafa+Dawy&background=ffeb3b&color=000",
    style: "سؤال"
  },
  {
    name: "نورا (The Hair Addict)",
    type: "contestant",
    role: "صاحبة علامة تجارية",
    location: "مصر",
    bio: "بتبني براند في مجال العناية بالشعر، وعندها مجتمع كبير على السوشيال.",
    photo: "https://ui-avatars.com/api/?name=Noura&background=f472b6&color=fff",
    style: "قصة"
  },
  {
    name: "خالد (مبرمج حر)",
    type: "contestant",
    role: "Freelancer",
    location: "الأردن",
    bio: "بيعمل تطبيقات ويب ودخل بالدولار من البيت.",
    photo: "https://ui-avatars.com/api/?name=Khaled&background=0ea5e9&color=fff",
    style: "نصيحة"
  },
  {
    name: "سلمى (متجر إلكتروني)",
    type: "contestant",
    role: "E-commerce Owner",
    location: "السعودية",
    bio: "بدأت بمحل صغير على إنستجرام ودلوقتي بتبيع لكل الخليج.",
    photo: "https://ui-avatars.com/api/?name=Salma&background=f43f5e&color=fff",
    style: "تحليل"
  },
  {
    name: "محمد (مقهى متنقل)",
    type: "contestant",
    role: "صاحب Food Truck",
    location: "الإمارات",
    bio: "حول هوايته في القهوة لمشروع ناجح، وعايز يتوسع.",
    photo: "https://ui-avatars.com/api/?name=Mohamed&background=795548&color=fff",
    style: "قصة"
  },
  {
    name: "فاطمة (خياطة رقمية)",
    type: "contestant",
    role: "مؤسسة منصة تفصيل",
    location: "المغرب",
    bio: "بتوظف خياطات في قريتها وتبيع أونلاين.",
    photo: "https://ui-avatars.com/api/?name=Fatima&background=e91e63&color=fff",
    style: "تحفيز"
  },
  {
    name: "عمر (تطبيق توصيل)",
    type: "contestant",
    role: "تقني",
    location: "الجزائر",
    bio: "طور تطبيق لتوصيل الطلبات في مدينته، وبيدور على تمويل.",
    photo: "https://ui-avatars.com/api/?name=Omar&background=4caf50&color=fff",
    style: "سؤال"
  },
  {
    name: "ليلى (منتجات تجميل طبيعية)",
    type: "contestant",
    role: "صانعة محتوى وبيزنس",
    location: "لبنان",
    bio: "بتمزج بين الطبخ الطبيعي وصناعة مستحضرات التجميل.",
    photo: "https://ui-avatars.com/api/?name=Laila&background=ff9800&color=fff",
    style: "تسويق"
  },
  {
    name: "يوسف (منصة تعليمية)",
    type: "contestant",
    role: "EdTech Founder",
    location: "مصر",
    bio: "بيقدم كورسات برمجة للأطفال، وشغله كله أونلاين.",
    photo: "https://ui-avatars.com/api/?name=Youssef&background=2196f3&color=fff",
    style: "نصيحة"
  },
  {
    name: "مريم (مصممة جرافيك)",
    type: "contestant",
    role: "فريلانسر",
    location: "تونس",
    bio: "بتصمم هويات بصرية للعلامات التجارية، وعايزة تفتح وكالة.",
    photo: "https://ui-avatars.com/api/?name=Maryam&background=9c27b0&color=fff",
    style: "تحليل"
  },
  {
    name: "عادل (مخبز عصري)",
    type: "contestant",
    role: "رائد أعمال",
    location: "الكويت",
    bio: "مخبزه الصغير بقى مقصد للفطور الصحي في المنطقة.",
    photo: "https://ui-avatars.com/api/?name=Adel&background=607d8b&color=fff",
    style: "قصة"
  },
  {
    name: "دعاء (متجر هدايا)",
    type: "contestant",
    role: "Etsy Seller",
    location: "البحرين",
    bio: "بتبيع هدايا يدوية ومشغولات فنية عبر الإنترنت.",
    photo: "https://ui-avatars.com/api/?name=Doaa&background=e91e63&color=fff",
    style: "تحفيز"
  },

  // ===== المزيد من القروش (مستثمرين افتراضيين) =====
  {
    name: "شريف عامر (AI)",
    type: "shark",
    role: "محلل أسواق مالية",
    location: "مصر",
    bio: "بيحلل البورصة بالأرقام، دقيق جداً في توقعاته.",
    photo: "https://ui-avatars.com/api/?name=Sherif+Amer&background=1e293b&color=fff",
    style: "تحليل"
  },
  {
    name: "هدى جلال (AI)",
    type: "shark",
    role: "خبيرة موارد بشرية",
    location: "السعودية",
    bio: "بتعرف تقيم فريق العمل قبل المنتج نفسه.",
    photo: "https://ui-avatars.com/api/?name=Hoda+Galal&background=0369a1&color=fff",
    style: "نقد"
  },
  {
    name: "طارق نور (AI)",
    type: "shark",
    role: "رجل أعمال متسلسل",
    location: "الإمارات",
    bio: "أسس وباع 3 شركات، عارف الخروج الصح.",
    photo: "https://ui-avatars.com/api/?name=Tarek+Nour&background=7c3aed&color=fff",
    style: "نصيحة"
  },
  {
    name: "ريما السبيعي (AI)",
    type: "shark",
    role: "مستثمرة ملاك",
    location: "قطر",
    bio: "بتستثمر في الستارت أب التقني، عينها على السوق كله.",
    photo: "https://ui-avatars.com/api/?name=Reema+Alsubaie&background=db2777&color=fff",
    style: "تشجيع"
  },
  {
    name: "جاسم الخالدي (AI)",
    type: "shark",
    role: "خبير امتياز تجاري",
    location: "الكويت",
    bio: "بيحول العلامات التجارية لسلاسل ناجحة.",
    photo: "https://ui-avatars.com/api/?name=Jassim+Alkhaled&background=0f172a&color=fff",
    style: "تسويق"
  },
  {
    name: "منال القصبي (AI)",
    type: "shark",
    role: "مستثمرة أثرية",
    location: "مصر",
    bio: "بتستثمر في المشاريع اللي ليها تأثير اجتماعي.",
    photo: "https://ui-avatars.com/api/?name=Manal+Elkasby&background=047857&color=fff",
    style: "تحفيز"
  }
];

// ---------- توليد المنشور بالـ AI ----------
async function generateAIPost(user) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const systemRole = user.type === "shark"
    ? "أنت مستثمر خبير وقوي (Shark). تقدم نصائح مالية بطريقة صارمة ومباشرة."
    : "أنت رائد أعمال طموح يحاول بناء مشروعه. تشارك تجاربك وتطلب نصائح من القروش.";

  const prompt = `
  أنت الآن: ${user.name}، ${user.role} من ${user.location}.
  شخصيتك: ${user.bio}

  اكتب منشوراً بالعامية المصرية أو العربية البيضاء (حسب بلدك) لتطبيق Sharkup.
  نوع المنشور: ${user.style || "نصيحة"}

  متطلبات الكتابة:
  - المنشور لا يقل عن 150 كلمة.
  - استخدم لغة بسيطة ومباشرة.
  - أضف سؤالاً تفاعلياً في النهاية (مثال: "إيه رأيكم؟"، "حد جرب؟").
  - أضف هاشتاغين أو ثلاثة في السطر الأخير (مثل #استثمار #ريادة_أعمال #sharkup).
  - لا تستخدم إيموجي أكثر من مرتين.
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
        { role: "system", content: systemRole },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 600
    })
  });

  const data = await response.json();
  if (!data.choices) {
    throw new Error(`Groq API Error: ${JSON.stringify(data)}`);
  }
  return data.choices[0].message.content;
}

// ---------- النشر في Firestore ----------
async function run() {
  try {
    const user = characters[Math.floor(Math.random() * characters.length)];
    console.log(`⏳ جاري إنشاء منشور من ${user.name}...`);
    const content = await generateAIPost(user);

    await db.collection("posts").add({
      content,
      authorName: user.name,
      authorPhoto: user.photo,
      authorRole: user.role,
      isShark: user.type === "shark",
      ai: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ تم النشر بواسطة ${user.name}`);
  } catch (e) {
    console.error("❌ فشل التشغيل:", e);
  }
}

// 🚀 تنفيذ
run();
