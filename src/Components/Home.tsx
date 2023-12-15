import { projects } from "../constants";
import LinkBadge from "./LinkBadge";

export interface Badge {
  title: string;
  url: string;
}

export interface ProjectProps {
  title: string;
  url: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  detail: string;
  badges: Badge[];
  imagePadding?: string;
}

export default function Home() {

  function Project({ project }: { project: ProjectProps }) {
    return (
      <div className="pb-6  ">
        {project.badges.map((badge: Badge) => (
          <LinkBadge key={badge.title} title={badge.title} url={badge.url} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="pb-12 sm:pb-4">
        <div className="relative isolate lg:px-8">
          <div className="mx-auto max-w-3xl py-8 sm:py-16">
            <div className="rounded-sm  font-normal border bg-theme-gray border-theme-yellow p-4  sm:p-8">
              <div className="mb-4 border-b pb-8 border-theme-yellow">
                <img
                  className="block mb-3 sm:mb-0 sm:inline-flex h-16 sm:translate-y-2.5 w-auto justify-start rounded-sm border border-theme-yellow navy    sm:h-16"
                  src={'./tortuga.png'}
                  alt=""
                />
                <div className="inline-flex sm:ml-8 text-theme-yellow text-left">
                  <div className="">
                    <span className="text-lg font-bold">Tortuga Onchain</span>
                    <p className="  text-md  ">
                      Actionable crypto-native content for speculators.
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="text-left text-lg font-bold text-theme-yellow pb-4">Links</h1>
              {projects.map((project: any) => (
                <Project key={project.title} project={project} />
              ))}

  
            </div>
          </div>
        </div>
      </div>
    </>
  )
}