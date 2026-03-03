import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "../../public/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

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
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if(!resume) return setStatus("Failed to retrieve resume. Either puter is down or it doesn't exist.")

            // grab resume data from cloud
            const data = JSON.parse(resume);
            const resumeBlob = await fs.read(data.resumePath)
            if(!resumeBlob) return setStatus("Could not read data from resume.")
            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeURL = URL.createObjectURL(pdfBlob);
            setResumeURL(resumeURL);

            // grab image data from cloud
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
                <Link to={"/"} className={"back-button"}>
                    <img src={"/icons/back.svg"} alt={"logo"} className={"w-2.5 h-2.5"} />
                    {/* span doesn't take up more width for content than necessary */}
                    <span className={"text-grey-800 text-sm font-semibold"}>Back to Homepage</span>
                </Link>
            </nav>
            <div className={"flex flex-row w-full max-lg:flex-col-reverse"}>
                <section className={"feedback-section bg-[url'/images/bg-small.svg) bg-cover h-screen sticky top-0 items-center justify-center"}>
                    {/* status tracks errors if !imageURL or !resumeURL*/} {status}
                    {imageURL && resumeURL && (
                        <div className={"animate-in fade-in duration-1000 gradient-border max-sm:m-0 h[90%] max-wxl:h-fit w-fit"}>
                            <a href={resumeURL} target={"_blank"}>
                                <img src={imageURL}
                                     alt={"resume img url"}
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
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                            <Details feedback={feedback}/>
                        </div>
                    ) : (
                        <img alt="fallback when no feedback is found"
                             className="w-full"
                             src={"/images/resume-scan-2.gif"}/>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
