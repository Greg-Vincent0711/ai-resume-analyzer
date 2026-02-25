import React, {useEffect} from 'react'
import {usePuterStore} from "../../public/lib/puter";
import {useLocation, useNavigate} from "react-router";
// sets the title for the auth page
export const meta = () => (
    [
        {title: "Kamixo | Auth"},
        {name: "description", content: "Log in"},
    ]
)
const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    // current location of the user, from react router
    const location = useLocation();
    // next location they'd like to go to
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    // redirection
    useEffect(() => {
        if(auth.isAuthenticated){
            navigate(next)
        }
        // when these two states change
        // check if the user can go to that page
    }, [auth.isAuthenticated, next])
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className={"gradient-border shadow-lg"}>
                <section className={"flex flex-col gap-8 bg-white rounded-2xl p-10"}>
                    <div className={"flex flex-col items-center gap-2 text-center"}>
                        <h1> Welcome </h1>
                        <h2> Login to continue your Job Journey </h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className={"auth-button animate-pulse"}>
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className={"auth-button"} onClick={auth.signOut}>
                                        <p>Logout</p>
                                    </button>
                                ) : (
                                    <button className={"auth-button"} onClick={auth.signIn}>
                                        <p>Login</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Auth
