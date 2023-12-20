const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const disclosureData = [
  {
    name: "Set Labs",
    liquid: false,
    logo: "/set.jpg",
    link: "https://twitter.com/setprotocol",
  },
  {
    name: "Debt DAO",
    liquid: false,
    logo: "/debtdao.jpg",
    link: "https://twitter.com/debtdao",
  },
  {
    name: "STFX",
    liquid: false,
    logo: "/stfx.jpg",
    link: "https://twitter.com/STFX_IO",
  },
  {
    name: "Insrt Finance",
    liquid: false,
    logo: "/insrt.jpg",
    link: "https://twitter.com/insrtfinance",
  },
  {
    name: "RareRound",
    liquid: false,
    logo: "/rr.jpg",
    link: "https://twitter.com/rareround",
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
