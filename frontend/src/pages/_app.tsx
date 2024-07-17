import Navbar from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import queryClient from "@/components/libs/react-quries";
import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import useAuth from "@/components/auth/useAuth";

const publicRoutes = ["/login", "/register"];
const privateRoutes = ["/dashboard"];

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const { user, loading: authLoading }: { user: any; loading: any } = useAuth();

  useEffect(() => {
    if (user && publicRoutes.includes(pathname)) {
      // redirect to dashbaord page
      router.push("/dashboard");
      // redirect to dashboard page if already logged in
    }

    if (!user && privateRoutes.includes(pathname)) {
      router.push("/login");
      // redirect to login page
    }
  }, [user, router, pathname]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar isLoggedIn={isLoggedIn} /> {/* Include the Navbar component */}
        <div className="max-w-6xl my-5 mx-auto">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </>
  );
}
