import { useAtom } from "jotai";
import { currentTaskAtom } from "../../util/task";
import Task from "../Task";

interface ICurrentProps {
  name?: string;
  back: () => void;
}

export default function Current({ back, name }: ICurrentProps) {
  const [current] = useAtom(currentTaskAtom);

  return (
    <div className="layout">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-[1.35rem] font-bold text-white">
          good morning, {name ? name.toLowerCase() : "user"} ☀️
        </h1>
      </div>
      {current ? (
        <Task {...current} index={0} single />
      ) : (
        <div className="w-full flex flex-col items-center space-y-3">
          <h1 className="text-3xl text-white font-bold">all done.</h1>
          <p className="text-gray-400">you have no open tasks left.</p>
        </div>
      )}
      <button onClick={back} className="btn-text">
        <p>+ add new boulder</p>
      </button>
    </div>
  );
}
