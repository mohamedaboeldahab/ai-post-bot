import admin from "firebase-admin";

// Firebase config هيوصل من GitHub Secrets
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// شخصيات AI
const characters = [
  {
    name: "أحمد حسن",
    photo: "https://i.pravatar.cc/150?img=12",
    style: "هادئ وبيتكلم عن الاستثمار طويل المدى"
  },
  {
    name: "سارة محمد",
    photo: "https://i.pravatar.cc/150?img=5",
    style: "تحفيزية وبتحب ريادة الأعمال"
  },
  {
    name: "كريم علي",
    photo: "https://i.pravatar.cc/150?img=8",
    style: "عملي وبيتكلم عن التجارة والمشاريع"
  },
  {
    name: "منى خالد",
    photo: "https://i.pravatar.cc/150?img=20",
    style: "بتدي نصائح مالية بسيطة"
  }
];
// بوستات جاهزة (ممكن تطورها AI بعدين)
const posts = [
  "الفرص مش بتستنى حد 🚀",
  "ابدأ صغير لكن ابدأ 💡",
  "النجاح محتاج جرأة مش خوف 🦈",
  "الفلوس بتروح للي بيشوف قبل غيره"
];

function generatePost(name) {
  const text = posts[Math.floor(Math.random() * posts.length)];
  return `${name}: ${text}`;
}

async function run() {
  const character = characters[Math.floor(Math.random() * characters.length)];
  const content = generatePost(character);

  await db.collection("posts").add({
    content,
    authorName: character,
    type: "post",
    ai: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log("Posted:", content);
}

run();
