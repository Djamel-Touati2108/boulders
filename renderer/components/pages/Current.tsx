import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { currentTaskAtom, ITask } from "../../util/task";
import Task from "../Task";
import { motion } from "framer-motion";

interface ICurrentProps {
  name?: string;
  back: () => void;
  active: boolean;
}

export default function Current({ back, name, active }: ICurrentProps) {
  const latest = useRef<ITask>();
  const initial = useRef(true);

  const [current] = useAtom(currentTaskAtom);
  const [shown, setShown] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initial.current || !active) {
      initial.current = false;

      latest.current = current;
      setShown(true);
      setCompleted(false);

      return;
    }

    if (current == latest.current) return;

    setCompleted(true);
    setTimeout(() => {
      setShown(false);

      setTimeout(() => {
        latest.current = current;
        setShown(true);
        setCompleted(false);
      }, 500);
    }, 500);
  }, [current, active]);

  return (
    <div className="layout">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-[1.35rem] font-semibold text-white">
          good morning{name ? name.toLowerCase() : ""} ☀️
        </h1>
      </div>
      <AnimatePresence>
        {shown && (
          <motion.div
            initial={{ translateY: "-15vh", opacity: 0 }}
            animate={{ translateY: "0vh", opacity: 1 }}
            exit={{
              translateY: "15vh",
              opacity: 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {latest.current ? (
              <Task
                {...latest.current}
                completed={completed}

                single
              />
            ) : (
              <div className="w-full flex flex-col items-center space-y-3">
                <h1 className="text-3xl text-white font-bold">all done.</h1>
                <p className="text-gray-400">you have no open tasks left.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={back} className="btn-text">
        <p>+ add new boulder</p>
      </button>
    </div>
  );
}
