import Task from "../Task";
import { useAtom } from "jotai";
import { emptyTask, hasEmpty, openTasksAtom, tasksAtom } from "../../util/task";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isEmpty } from "@firebase/util";

interface IAddProps {
  next: () => void;
}

export default function Add({ next }: IAddProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [open] = useAtom(openTasksAtom);

  function focus() {
    setFocusIndex((index) => index + 1);
  }

  useEffect(() => {
    if (tasks.length) return;
    setTasks([emptyTask()]);
  }, [tasks]);

  function onClick(e: any) {
    if (e.target !== e.currentTarget) return;
    add();
  }

  function add(force = false) {
    if (!force && hasEmpty(tasks)) return focus();
    setTasks([emptyTask(), ...tasks]);
  }

  return (
    <div onClick={onClick} className="layout">
      <div
        onClick={onClick}
        className="w-full flex flex-col items-start space-y-1"
      >
        <h1 className="text-[1.35rem] font-bold text-white">
          add boulders to queue 🗿
        </h1>
        <p className="text-gray-400 text-[0.85rem]">
          click anywhere to add a new boulder.
        </p>
      </div>
      <div
        onClick={onClick}
        className="h-[100%] overflow-y-auto flex flex-col space-y-2 py-4"
      >
        <AnimatePresence>
          {open.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ scale: 1, marginBottom: "0.5rem" }}
              exit={{ scale: 0, height: "0%", marginBottom: "0rem" }}
              transition={{
                duration: 0.2,
                height: { delay: 0.2 },
                marginBottom: { delay: 0.2 },
              }}
            >
              <Task
                {...task}
                input={true}
                focus={!task.text ? focusIndex : null}
                add={() => add(true)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button onClick={next} className="btn-text">
        <p>done</p>
      </button>
    </div>
  );
}
