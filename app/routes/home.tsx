import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "../../public/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";

// good to know you can define metadata like this
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kamixo Test App" },
    { name: "description", content: "Smart resume feedback...demo app!" },
  ];
}


export default function Home() {
    const {auth, kv} = usePuterStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState<boolean>(false);
    // next location they'd like to go to
    const navigate = useNavigate();
    // good routing trick with authentication
    useEffect(() => {
        if(!auth.isAuthenticated){
            // navigate to an auth page
            // then to the homepages
            navigate("/auth?next=/")
        }
        // check if the user can go to that page
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            const resumes = (await kv.list('resume:*', true)) as KVItem[]
            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))
            setResumes(parsedResumes || [])
            setLoadingResumes(false)
        }
        loadResumes();
    }, [])


  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar/>
        <section className="main-section">
          <div className="page-heading py-16">
            <h1> Track your Applications and Resume Ratings</h1>
              {!loadingResumes && resumes?.length === 0 ? (
                  <h2>No resumes found. Upload your first resume to get feedback.</h2>
              ) : (
                  <h2>Review your submissions and check AI powered feedback</h2>
              )}
          </div>
            {loadingResumes && (
                <div className={"flex flex-col items-center justify-center"}>
                    <img alt="resume scan image" src={"/images/resume-scan-2.gif"} className={"w-50"}/>
                </div>
            )}

          {!loadingResumes && resumes.length > 0 && (
              <div className="resumes-section">
                  {resumes.map((resume, index) => (
                    <ResumeCard key={resume.id} resume={resume}/>
                ))}
              </div>
            )}
            {!loadingResumes && resumes.length == 0 && (
                <div className={"flex flex-col items-center justify-center mt-10 gap-4"}>
                    <Link to={"/upload"} className={"primary-button w-fit text-xl font-semibold"}>
                        Upload Resume
                    </Link>
                </div>
            )}
        </section>
      </main>
  )
}
