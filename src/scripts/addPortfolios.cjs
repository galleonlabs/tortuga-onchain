const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const farmData = [
  {
    name: "Portfolios #1 - 2024 Timelock, Altcoin Index vs Memes vs Majors.",
    subtitle: "With 2024 looking optimistic for the crypto markets, what will ultimately outperform?",
    link: "https://tortugaonchain.substack.com/p/portfolios-1-2024-timelock-altcoin",
    issue: 1,
  },
];

const batch = db.batch();

farmData.forEach((farm) => {
  const farmRef = db.collection("portfolios").doc();
  batch.set(farmRef, farm);
});

batch
  .commit()
  .then(() => {
    console.log("Successfully added farms to Firestore.");
  })
  .catch((error) => {
    console.error("Error adding farms to Firestore: ", error);
  });
