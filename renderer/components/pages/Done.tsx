import { useAtom } from "jotai";
import { doneTasksAtom } from "../../util/task";
import Task from "../Task";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

interface IDoneProps {
  back: () => void;
}

export default function Done({ back }: IDoneProps) {
  const [done] = useAtom(doneTasksAtom);

  return (
    <div className="layout">
      <h1 className="text-[1.35rem] font-semibold text-white">
        you moved {done.length} boulders this week 🎉
      </h1>
      <div className="w-full h-[100%] overflow-y-auto flex flex-col py-4">
        <Droppable droppableId={"id_done"}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <AnimatePresence>
                {done.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ scale: 1 }}
                    exit={{ scale: 0, height: "0%" }}
                    transition={{
                      duration: 0.2,
                      height: { delay: 0.2 },
                      marginBottom: { delay: 0.2 },
                    }}
                  >
                    <Task {...task} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      <button onClick={back} className="btn-text">
        <p>done</p>
      </button>
    </div>
  );
}
