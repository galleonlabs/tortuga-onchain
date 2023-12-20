const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const disclosureData = [
  {
    name: "Blur",
    ticker: "BLUR",
    coinGeckoUrl: "https://www.coingecko.com/en/coins/blur",
    logo: "https://assets.coingecko.com/coins/images/28453/standard/blur.png",
  },
];

const batch = db.batch();

disclosureData.forEach((disclosure) => {
  const ref = db.collection("disclosures").doc();
  batch.set(ref, disclosure);
});

batch
  .commit()
  .then(() => {
    console.log("Successfully added farms to Firestore.");
  })
  .catch((error) => {
    console.error("Error adding farms to Firestore: ", error);
  });
