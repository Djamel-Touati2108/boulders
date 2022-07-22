import ReactTextareaAutosize from "react-textarea-autosize";
import { CheckIcon } from "@heroicons/react/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ITask, tasksAtom, update } from "../util/task";
import { useAtom } from "jotai";
import Firebase from "../util/firebase";

interface ITaskProps {
  id: string;
  index: number;
  text: string;
  completed: boolean;
  single?: boolean;
}

export default function Task({
  id,
  index,
  completed,
  text: parentText,
  single,
}: ITaskProps) {
  const ref = useRef<HTMLTextAreaElement>();
  const timeout = useRef<NodeJS.Timeout>();
  const [text, setText] = useState(parentText);
  const [_, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    if (parentText) return;
    ref.current.focus();
  }, []);

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
  }

  return (
    <div className="w-full flex space-x-4">
      <button
        onClick={() => update(id, { completed: !completed })}
        className="relative pt-[0.1rem]"
      >
        <img
          style={{
            transform: `rotate(${(index / 4) * 360}deg)`,
          }}
          src={`/images/task_${completed ? "complete" : "incomplete"}.png`}
          alt={`Task`}
          className="w-8 select-none"
          draggable={false}
        />
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ scale: 0, translateY: "-50%", translateX: "-50%" }}
              animate={{ scale: 1, translateY: "-50%", translateX: "-50%" }}
              exit={{ scale: 0, translateY: "-50%", translateX: "-50%" }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-1/2 mt-[0.2rem]"
            >
              <CheckIcon className="text-white w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <ReactTextareaAutosize
        ref={ref}
        placeholder="add new task"
        value={text}
        onChange={onChange}
        className={`w-full text-white bg-transparent outline-none resize-none ${
          single ? "" : "border-b border-white/20 focus:border-white/20"
        } py-2 rounded-none`}
      />
    </div>
  );
}
