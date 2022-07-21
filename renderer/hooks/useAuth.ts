import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Firebase from "../util/firebase";

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    if (!Firebase.firebase) Firebase.init();

    Firebase.on("AUTH:CHANGE", onAuthChange);
    return () => {
      Firebase.off("AUTH:CHANGE", onAuthChange);
    };
  }, [router]);

  function onAuthChange(user: User) {
    if (!user && router.asPath !== "/auth") return router.push("/auth");
    if (user && router.asPath == "/auth") return router.push("/");
  }
}
