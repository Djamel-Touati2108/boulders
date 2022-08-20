import ReactTextareaAutosize from "react-textarea-autosize";
import { CheckIcon } from "@heroicons/react/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ITask, tasksAtom } from "../util/task";
import { useAtom } from "jotai";
import Firebase from "../util/firebase";
import { getAnalytics, logEvent } from "firebase/analytics";

interface ITaskProps {
  id: string;
  text: string;
  completed: boolean;
  single?: boolean;
  input?: boolean;
  focus?: null | number;
  add?: () => void;
}

export default function Task({
  id,
  completed,
  text: parentText,
  single,
  input,
  focus,
  add,
}: ITaskProps) {
  const ref = useRef<HTMLTextAreaElement>();
  const timeout = useRef<NodeJS.Timeout>();
  const [text, setText] = useState(parentText);
  const [rotate] = useState(Math.random());
  const [_, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    if (parentText || !ref.current || focus == null) return;
    ref.current.focus();
  }, [focus]);

  useEffect(() => {
    setText(parentText);
  }, [parentText]);

  function onChange(e: any) {
    setText(e.target.value);

    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      update(id, { text: e.target.value });
    }, 500);
  }

  function update(id: string, update: Partial<ITask>) {
    setTasks((tasks: ITask[]) => {
      const index = tasks.findIndex((task) => task.id == id);
      if (index == -1) return tasks;

      tasks[index] = { ...tasks[index], ...update };
      Firebase.update({ ...tasks[index] });
      return [...tasks];
    });
    const analytics = getAnalytics();
    logEvent(analytics,'task_completed');
  }

  function toggle() {
    update(id, { completed: !completed });
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    // @ts-ignore
    if (add && e.key == "Enter" && e.target.value.replace(/\s/g, "").length) {
      add();
    }
  }

  return (
    <div className="w-full flex space-x-4">
      <button onClick={toggle} className="relative pt-[0.1rem]">
        <img
          style={{
            transform: `rotate(${rotate * 360}deg)`,
          }}
          src={`/images/task_${completed ? "complete" : "incomplete"}.png`}
          alt={`Task`}
          className="min-w-[1.7rem] select-none transition-all"
          draggable={false}
        />
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ scale: 0, translateY: "-50%", translateX: "-50%" }}
              animate={{ scale: 1, translateY: "-50%", translateX: "-50%" }}
              exit={{ scale: 0, translateY: "-50%", translateX: "-50%" }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-1/2 mt-[0.15rem]"
            >
              <CheckIcon className="text-white w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      {input ? (
        <ReactTextareaAutosize
          ref={ref}
          placeholder="add new task"
          value={text}
          maxLength={120}
          // @ts-ignore
          onKeyDown={onKeyDown}
          onChange={onChange}
          disabled={input !== true}
          className={`w-full text-white bg-transparent outline-none resize-none ${single ? "" : "border-b border-white/20 focus:border-white/20"
            } py-2 rounded-none`}
        />
      ) : (
        <p
          className={`w-full text-white ${single ? "" : "border-b border-white/20 focus:border-white/20"
            } py-2 cursor-pointer`}
          onClick={toggle}
        >
          {text}
        </p>
      )}
    </div>
  );
}
