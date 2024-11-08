// authState.js
import { atom } from "recoil";

export const currentUserState = atom({
    key: "currentUserState",
    default: null,
});

export const userLoggedInState = atom({
    key: "userLoggedInState",
    default: false,
});

export const isEmailUserState = atom({
    key: "isEmailUserState",
    default: false,
});

export const isGoogleUserState = atom({
    key: "isGoogleUserState",
    default: false,
});

export const authLoadingState = atom({
    key: "authLoadingState",
    default: true,
});
