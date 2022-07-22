import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Firebase from "../util/firebase";

export default function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(Firebase.isAuthenticated);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!Firebase.firebase) Firebase.init();
    else setLoading(false);

    Firebase.on("AUTH:CHANGE", onAuthChange);
    return () => {
      Firebase.off("AUTH:CHANGE", onAuthChange);
    };
  }, [router]);

  function onAuthChange() {
    setAuthenticated(Firebase.isAuthenticated);
    setUser(Firebase.user);
    setLoading(false);
  }

  return { authenticated, loading, authLoading: loading, user };
}
