import Navbar from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import queryClient from "@/components/libs/react-quries";
import { QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
