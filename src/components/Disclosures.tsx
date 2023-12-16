import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../main";

interface HeldAsset {
  name: string;
  ticker: string;
  coinGeckoUrl: string;
  logo: string;
}

interface DisclosuresProps {
  config: DocumentData | null;
}

const Disclosures = ({ config }: DisclosuresProps) => {
  const { account } = useEthers();
  const [uniqueAssets, setUniqueAssets] = useState<HeldAsset[]>([]);

  useEffect(() => {
    if (!account) return;
    console.log('config:', config);

    const fetchDisclosures = async () => {
      const querySnapshot = await getDocs(collection(db, "disclosures"));
      const assetMap = new Map<string, HeldAsset>();

      querySnapshot.docs.forEach(doc => {
        const harvestData = doc.data() as { rewardAssets: HeldAsset[] };
        harvestData.rewardAssets.forEach(asset => {
          if (!assetMap.has(asset.ticker)) {
            assetMap.set(asset.ticker, asset);
          }
        });
      });

      setUniqueAssets(Array.from(assetMap.values()));
    };

    fetchDisclosures();
  }, [account]);

  return (
    <div >
      {account ? (
        <div className="mx-auto bg-theme-gray border-2 border-theme-yellow rounded-sm max-w-4xl py-8 tracking-wider">
          <h1 className="text-lg font-bold text-theme-yellow mb-2 text-center pt-4">Disclosures</h1>
          <p className='text-md text-center pb-4'>Assets currently held in the treasury</p>
          <div className={`my-1 px-8 mx-8 rounded-sm pb-3 pt-3 border-2 mb-4  border-theme-yellow bg-theme-gray   flex flex-wrap`}>
            {uniqueAssets.map((asset, idx) => (
              <div key={idx} className="flex items-center mx-4 my-2">
                <img src={asset.logo} alt={asset.name} className="w-12 h-12 mr-2  rounded-full border-2 border-theme-yellow p-0.5 bg-theme-yellow" />
                <a href={asset.coinGeckoUrl} target="_blank" rel="noopener noreferrer" className="text-xl hover:underline ">
                  {asset.ticker}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : <>

      </>
      }
    </div >
  );
};

export default Disclosures;
