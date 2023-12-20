const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const farmData = [
  {
    name: "The Trade Winds #3 - The ETH Trade",
    subtitle: "Strengthening confluences around ETHBTC and its ecosystem heading into 2024.",
    link: "https://tortugaonchain.substack.com/p/the-trade-winds-3-the-eth-trade",
    issue: 4,
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
