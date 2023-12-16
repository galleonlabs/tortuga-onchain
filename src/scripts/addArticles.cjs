const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const farmData = [
  {
    name: "What is Tortuga Onchain?",
    subtitle:
      "Zero bloat content to help investors and traders navigate the crypto markets and use on-chain protocols.",
    link: "https://tortugaonchain.substack.com/p/what-is-tortuga-onchain",
    issue: 1,
  },
  {
    name: "The Trade Winds #1 - Upcoming Airdrops",
    subtitle: "A quick rundown on anticipated airdrops coming in 2024 and how to try become eligible.",
    link: "https://tortugaonchain.substack.com/p/trade-winds-1-upcoming-airdrops",
    issue: 2,
  },
  {
    name: "The Trade Winds #2 - BRC-20 Tokens",
    subtitle: "What are BRC-20 tokens and how to get exposure to this new ecosystem with growing momentum.",
    link: "https://tortugaonchain.substack.com/p/the-trade-winds-2-brc-20-tokens",
    issue: 3,
  },
];

const batch = db.batch();

farmData.forEach((farm) => {
  const farmRef = db.collection("articles").doc();
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
