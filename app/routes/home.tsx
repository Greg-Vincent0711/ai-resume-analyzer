import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "../../public/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kamixo Test App" },
    { name: "description", content: "Smart resume feedback...demo app!" },
  ];
}

export default function Home() {
    const {auth} = usePuterStore();
    // current location of the user, from react router
    const location = useLocation();
    // next location they'd like to go to
    const navigate = useNavigate();

    // redirection
    useEffect(() => {
        if(!auth.isAuthenticated){

            navigate("/auth?next=/")
        }
        // when these two states change
        // check if the user can go to that page
    }, [auth.isAuthenticated])

  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar/>
        <section className="main-section">
          <div className="page-heading py-16">
            <h1> Track your Applications and Resume Ratings</h1>
            <h2>Review your submissions and check AI powered feedback</h2>
          </div>

          {resumes.length > 0 && (
              <div className="resumes-section">
                  {resumes.map((resume, index) => (
                    <ResumeCard key={resume.id} resume={resume}/>
                ))}
              </div>
            )}
        </section>
      </main>
  )
}
