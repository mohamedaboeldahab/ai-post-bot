import admin from "firebase-admin";

// 🔐 Firebase config من GitHub Secrets
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 👤 شخصيات (بصور حقيقية)
const characters = [
  {
    name: "أحمد حسن",
    photo: "https://i.pravatar.cc/150?img=12",
    style: "استثمار"
  },
  {
    name: "سارة محمد",
    photo: "https://i.pravatar.cc/150?img=5",
    style: "تحفيز"
  },
  {
    name: "كريم علي",
    photo: "https://i.pravatar.cc/150?img=8",
    style: "مشاريع"
  },
  {
    name: "منى خالد",
    photo: "https://i.pravatar.cc/150?img=20",
    style: "مال"
  }
];

// 💬 توليد بوست حسب الأسلوب
function generatePost(character) {
  let posts = [];

  if (character.style === "استثمار") {
    posts = [
      "استثمر فلوسك بدل ما تسيبها واقفة 📈",
      "العائد الصغير المستمر أفضل من الكبير المؤقت",
      "الوقت أهم عنصر في الاستثمار ⏳"
    ];
  }

  else if (character.style === "تحفيز") {
    posts = [
      "ابدأ دلوقتي… متستناش الظروف 💪",
      "الفشل خطوة في طريق النجاح 🚀",
      "كل مشروع كبير بدأ بفكرة صغيرة"
    ];
  }

  else if (character.style === "مشاريع") {
    posts = [
      "اختار فكرة بسيطة وسوقها صح 💡",
      "أهم حاجة في المشروع هي التنفيذ مش الفكرة",
      "اسأل السوق قبل ما تبدأ أي مشروع"
    ];
  }

  else if (character.style === "مال") {
    posts = [
      "وفر جزء من دخلك كل شهر 💰",
      "المصاريف الصغيرة هي اللي بتكسر الميزانية",
      "اعرف فلوسك بتروح فين الأول"
    ];
  }

  const text = posts[Math.floor(Math.random() * posts.length)];

  return {
    content: text,
    authorName: character.name,
    authorPhoto: character.photo
  };
}

async function run() {
  try {
    const character = characters[Math.floor(Math.random() * characters.length)];
    const post = generatePost(character);

    await db.collection("posts").add({
      content: post.content,
      authorName: post.authorName,
      authorPhoto: post.authorPhoto,
      type: "post",
      ai: true,
      supportCount: 0,
      opposeCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ تم نشر بوست من:", post.authorName);

  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

// 🔥 مهم جداً
run();
