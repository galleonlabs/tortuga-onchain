import { useEffect, useState } from "react";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../main";

interface HeldAsset {
  name: string;
  ticker: string;
  coinGeckoUrl: string;
  liquid: string;
  link: string
  logo: string;
}

interface DisclosuresProps {
  config: DocumentData | null;
}

const Disclosures = ({ config }: DisclosuresProps) => {
  const [uniqueAssets, setUniqueAssets] = useState<HeldAsset[]>([]);

  useEffect(() => {
 
    console.log('config:', config);

    const fetchDisclosures = async () => {
      const querySnapshot = await getDocs(collection(db, "disclosures"));

      const assets = querySnapshot.docs.map(doc => {
        return doc.data() as HeldAsset;
      });

      setUniqueAssets(assets);
    };

    fetchDisclosures();
  }, []);

  return (
    <div >
      {uniqueAssets.length > 0 ? (
        <div className="mx-auto bg-theme-gray border-2 border-theme-yellow rounded-sm max-w-4xl py-4 tracking-wider">
          <h1 className="text-lg font-bold text-theme-yellow  text-center ">Disclosures</h1>
          <p className='text-md text-center pb-4'>Long-term assets currently held in the treasury</p>
          <h2 className="my-1 px-8 mx-4 rounded-sm pb-2 pt-2  ">Liquid Investments</h2>
          <div className={`my-1 px-8 mx-8 rounded-sm pb-3 pt-3  mb-4   bg-theme-yellow/10   flex flex-wrap`}>
            {uniqueAssets.filter(x => x.liquid).map((asset, idx) => (
              <a key={idx} href={asset.coinGeckoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center mx-4 my-2">
                <img src={asset.logo} alt={asset.name} className="w-8 h-8 mr-2  rounded-full border-2 border-theme-yellow  bg-white" />
                <span className="text-md ">
                  {asset.ticker}
                </span>
              </a>
            ))}
          </div>

          <h2 className="my-1 px-8 mx-4 rounded-sm pb-2 pt-2  ">Angel Investments (via <a href="https://twitter.com/andrew_eth" target="_blank" className="">@andrew_eth</a>)</h2>
          <div className={`my-1 px-8 mx-8 rounded-sm pb-3 pt-3  mb-4   bg-theme-yellow/10   flex flex-wrap`}>
            {uniqueAssets.filter(x => !x.liquid).map((asset, idx) => (
              <a key={idx} href={asset.link} target="_blank" rel="noopener noreferrer" className="flex items-center mx-4 my-2">
                <img src={asset.logo} alt={asset.name} className="w-8 h-8 mr-2  rounded-full border-2 border-theme-yellow  bg-white" />
                <span className="text-md ">
                  {asset.name}
                </span>
              </a>
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
