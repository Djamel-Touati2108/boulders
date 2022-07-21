import Head from "next/head";
import { useState } from "react";
import Loader from "../components/Loader";
import Firebase from "../util/firebase";

export default function Auth() {
  const [loading, setLoading] = useState(false);

  function signIn() {
    setLoading(true);
    Firebase.signIn()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }

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
        <button onClick={signIn} className="w-full btn-primary h-12 py-0">
          {loading ? <Loader white small /> : "continue with twitter"}
        </button>
      </div>
    </>
  );
}
