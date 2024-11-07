import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { authLoadingState, currentUserState, isEmailUserState, isGoogleUserState, userLoggedInState } from "../../atoms/authState";

export function AuthProvider({ children }) {
    const setCurrentUser = useSetRecoilState(currentUserState);
    const setUserLoggedIn = useSetRecoilState(userLoggedInState);
    const setIsEmailUser = useSetRecoilState(isEmailUserState);
    const setIsGoogleUser = useSetRecoilState(isGoogleUserState);
    const setLoading = useSetRecoilState(authLoadingState);

    const loading = useRecoilValue(authLoadingState); // Retrieve the loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {
            setCurrentUser({ ...user });

            // Check if provider is email and password login
            const isEmail = user.providerData.some(
                (provider) => provider.providerId === "password"
            );
            setIsEmailUser(isEmail);

            // Uncomment and add GoogleAuthProvider if needed
            // const isGoogle = user.providerData.some(
            //     (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
            // );
            // setIsGoogleUser(isGoogle);

            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }

        setLoading(false);
    }

    return <>{!loading && children}</>;
}