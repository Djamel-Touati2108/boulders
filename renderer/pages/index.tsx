import Head from "next/head";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { bindKeyboard } from "react-swipeable-views-utils";
import { PageLoader } from "../components/Loader";
import Add from "../components/pages/Add";
import Current from "../components/pages/Current";
import Done from "../components/pages/Done";
import useAuth from "../hooks/useAuth";
import useTaskSync from "../hooks/useTaskSync";

const Swipeable = bindKeyboard(SwipeableViews);

export default function Home() {
  const auth = useAuth();
  const { loading } = useTaskSync(auth);

  const [index, setIndex] = useState(0);

  if (loading) return <PageLoader />;
  return (
    <>
      <Head>
        <title>Boulders</title>
      </Head>
      <div className="relative w-screen h-screen flex flex-col justify-between items-center">
        <Swipeable
          index={index}
          onChangeIndex={setIndex}
          enableMouseEvents
          className="w-screen"
        >
          <Add next={() => setIndex(1)} />
          <Current back={() => setIndex(0)} name={auth.user?.displayName} />
          <Done />
        </Swipeable>
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
          <Dot active={index == 0} onClick={() => setIndex(0)} />
          <Dot active={index == 1} onClick={() => setIndex(1)} />
          <Dot active={index == 2} onClick={() => setIndex(2)} />
        </div>
      </div>
    </>
  );
}

function Dot({ active, onClick }) {
  return (
    <button
      style={{
        width: `${active ? 1.5 : 0.75}rem`,
        background: `rgb(255, 255, 255, ${active ? 0.5 : 0.2})`,
      }}
      className="transition-all w-3 h-3 rounded-full cursor-pointer"
      onClick={onClick}
    ></button>
  );
}
