const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const disclosureData = [
  {
    name: "Ethereum",
    ticker: "ETH",
    coinGeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
  },
  {
    name: "Bitcoin",
    ticker: "BTC",
    coinGeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png",
  },
  {
    name: "Ribbon Finance",
    ticker: "RBN",
    coinGeckoUrl: "https://www.coingecko.com/en/coins/ribbon-finance",
    logo: "https://assets.coingecko.com/coins/images/15823/standard/RBN_64x64.png",
  },
  {
    name: "Conic",
    ticker: "CNC",
    coinGeckoUrl: "https://www.coingecko.com/en/coins/conic",
    logo: "https://assets.coingecko.com/coins/images/24747/standard/cnc.png",
  },
  {
    name: "Gearbox",
    ticker: "GEAR",
    coinGeckoUrl: "https://www.coingecko.com/en/coins/gearbox",
    logo: "https://assets.coingecko.com/coins/images/21630/standard/gear.png",
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
