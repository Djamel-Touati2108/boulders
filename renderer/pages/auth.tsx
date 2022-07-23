import Head from "next/head";
import { useEffect, useState } from "react";
import Loader, { PageLoader } from "../components/Loader";
import Firebase from "../util/firebase";
import { ipcRenderer } from "electron";
import Alert from "../components/Alert";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";

export default function Auth() {
  const router = useRouter();
  const { authLoading, authenticated } = useAuth();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!authenticated) return;
    router.push("/");
  }, [authLoading, authenticated]);

  useEffect(() => {
    ipcRenderer.on("signInResult", onResult);

    return () => {
      ipcRenderer.off("signInResult", onResult);
    };
  }, []);

  function onResult(_, data: any) {
    setLoading(false);

    if (data.error) return setError(data.error);

    Firebase.authenticate(data)
      .then(() => setLoading(false))
      .catch(() => {
        setError("Something went wrong");
        setLoading(false);
      });
  }

  function signIn() {
    // setError(undefined);
    // setLoading(true);
    // ipcRenderer.send("signIn");

    setError(undefined);
    setLoading(true);
    Firebase.signInAnonymously()
      .then(() => setLoading(false))
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  if (authLoading) return <PageLoader />;
  return (
    <>
      <Head>
        <title>Boulders | Sign In</title>
      </Head>
      <div className="w-screen h-screen flex flex-col justify-between items-center p-8">
        <img src="/images/trinity.png" alt="tivity labs Logo" />
        <div className="w-full flex flex-col items-start space-y-3">
          <h1 className="text-2xl text-white font-bold">boulders.</h1>
          <p className="text-gray-400">
            a (very)
            <br />
            minimalist approach
            <br />
            to issue tracking.
          </p>
        </div>
        <div className="w-full flex flex-col space-y-4">
          <Alert text={error} type="ERROR" />
          <button onClick={signIn} className="w-full btn-primary h-12 py-0">
            {loading ? <Loader white small /> : "continue with twitter"}
          </button>
        </div>
      </div>
    </>
  );
}
