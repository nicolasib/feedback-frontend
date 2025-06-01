import { signOut } from "firebase/auth";

export const logout = async (auth) => {
    await signOut(auth);
    localStorage.removeItem("user");
}