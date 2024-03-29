import { useEffect, useState } from "react";
import { DocumentData, collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../main";

interface Article {
  name: string;
  subtitle: string;
  link: string;
  issue: number
}

interface ArticlesProps {
  config: DocumentData | null;
  dbCollection: string
}

const Articles = ({ config, dbCollection }: ArticlesProps) => {

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {

    console.log('config: ', config)
    const fetchActiveFarms = async (fetchCount: number = 5) => {
      const articleQuery = query(collection(db, dbCollection), limit(fetchCount));
      const querySnapshot = await getDocs(articleQuery);
      const fetchedArticles: Article[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        fetchedArticles.push(doc.data() as Article);
      });
      setArticles(fetchedArticles);
    };

    const fetchData = async () => {
      fetchActiveFarms(5);
    };

    fetchData();
  }, [dbCollection]);

  return (
    <div className="border-2 border-theme-yellow">
      <div className="mx-auto bg-theme-gray   rounded-sm max-w-4xl y-8  ">
        {dbCollection === 'articles' ?
          <>
            <h1 className="text-lg font-bold text-theme-pan-navy  text-center pt-4">The Trade Winds</h1>
            <p className='text-md text-center pb-1'>Actionable crypto-native content for speculators.</p>
          </> :
          <>
            <h1 className="text-lg font-bold text-theme-pan-navy  text-center pt-4">Portfolios</h1>
            <p className='text-md text-center pb-1'>Novel experiments in portfolio management.</p>
          </>}

      </div>

      <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1 mx-8 pt-4 pb-12">
        {articles.sort((a, b) => b.issue - a.issue).map((article: Article, index: number) => (
          <li key={index} className="col-span-1 divide divide-theme-yellow rounded-sm bg-theme-gray   ">
            <a href={article.link} target={'blank'} className="flex w-full items-center justify-between space-x-6 p-4 rounded-sm bg-theme-yellow/10 hover:bg-theme-yellow/20">
              <div className="flex-1">
                <h3 className="text-lg font-semibold sm:whitespace-nowrap whitespace-normal   text-theme-yellow pb-1 mb-2 border-b border-theme-yellow">{article.name}</h3>
                <p className="py-0.5 ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-2  text-md text-theme-yellow">
                  {article.subtitle}
                </p>

              </div>
            </a>

          </li>
        ))}

      </ul>
      <iframe className="mx-auto -mt-8 min-w-full" src="https://tortugaonchain.substack.com/embed" ></iframe>
    </div>
  );
};

export default Articles;
