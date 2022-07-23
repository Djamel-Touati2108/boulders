import Task from "../Task";
import { useAtom } from "jotai";
import { tasksAtom, emptyTask } from "../../util/task";
import { useEffect } from "react";

interface IAddProps {
  next: () => void;
}

export default function Add({ next }: IAddProps) {
  const [tasks, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    if (tasks.length) return;
    setTasks([emptyTask()]);
  }, [tasks]);

  function onClick(e: any) {
    if (e.target !== e.currentTarget) return;
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
        {tasks.map((task, index) => (
          <Task {...task} key={task.id} input={true} />
        ))}
      </div>
      <button onClick={next} className="btn-text">
        <p>done</p>
      </button>
    </div>
  );
}
