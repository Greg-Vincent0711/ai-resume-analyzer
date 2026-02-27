import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "../../public/lib/puter";
import Summary from "~/components/Summary";

export const meta = () => (
    [
        {title: "Kamixo | Resume Review"},
        {name: "description", content: "Analysis of your resume."},
    ]
)

const Resume = () => {
    const { id } = useParams();
    const { auth, isLoading, fs, kv} = usePuterStore();
    const [imageURL, setImageURL] = useState("");
    const [resumeURL, setResumeURL] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();
    const [status, setStatus] = useState("");

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated){
            navigate(`/auth?next=/resume/${id}`)
        }
        // when these two states change
        // check if the user can go to that page
    }, [isLoading])

    useEffect(() => {
        /**
         * dummy resume data
         * Full stack development with react, C# and AWS. Good understanding of UI/UX design, Swagger and OpenAPI specification design and implementation. Familiarity with agile processes, ability to wear multiple hats.
         * **/
        const loadResume = async () => {
            // trouble shoot the resume portion - might be wifi
            const resume = await kv.get(`resume/${id}`);
            if(!resume) return setStatus("Failed to retrieve resume. Either puter is down or it doesn't exist.")

            const data = JSON.parse(resume);
            // files from puter cloud storage are returned as blob data
            const resumeBlob = await fs.read(data.resumePath)
            if(!resumeBlob) return setStatus("Could not read data from resume.")
            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeURL = URL.createObjectURL(pdfBlob);
            console.log(resumeURL);
            setResumeURL(resumeURL);

            const imageBlob = await fs.read(data.imagePath)
            if(!imageBlob) return;
            const imageURL = URL.createObjectURL(imageBlob);
            setImageURL(imageURL);
            setFeedback(data.feedback)
        }
        loadResume();
    }, [id])

    return (
        <main className={"pt-0!"}>
            <nav className={"resume-nav"}>
                <Link to={"/homepage"} className={"back-button"}>
                    <img src={"/icons/back.svg"} alt={"logo"} className={"w-2.5 h-2.5"} />
                    <span className={"text-grey-800 text-sm font-semibold"}>Back to Homepage</span>
                </Link>
            </nav>
            <div className={"flex flex-row w-full max-lg:flex-col-reverse"}>
                <section className={"feedback-section bg-[url'/images/bg-small.svg) bg-cover h-screen sticky top-0 items-center justify-center"}>
                    {status}
                    {imageURL && resumeURL && (
                        <div className={"animate-in fade-in duration-1000 gradient-border max-sm:m-0 h[90%] max-wxl:h-fit w-fit"}>
                            <a href={resumeURL} target={"_blank"}>
                                <img src={imageURL}
                                     className={"w-full h-full object-contain rounded-2xl"}
                                     title={"resume"}/>
                            </a>
                        </div>
                    )}
                </section>
                <section className={"feedback-section"}>
                    <h2 className={"text-4xl text-black font-bold"}>
                        Resume Review
                    </h2>
                    {feedback ? (
                        <div className={"flex flex-col gap-8 animate-in fade-in duration-1000"}>
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ats.score || 0} suggestions={feedback.ATS.tips || []}
                            <Details feedback={feedback}/>
                        </div>
                    ) : (
                        <img className="w-full" src={"/images/resume-scan-2.gif"}/>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
