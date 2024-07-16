import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth as customAuth } from "../../firebase";

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      customAuth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const login = async (email: any, password: any) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      customAuth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
