import { atom } from "jotai";
import { nanoid } from "nanoid";

export const tasksAtom = atom<ITask[]>([]);

export const currentTaskAtom = atom((get) =>
  get(tasksAtom).find((task) => !isEmpty(task) && !task.completed)
);

export const openTasksAtom = atom((get) =>
  get(tasksAtom).filter((task) => !task.completed)
);

export const doneTasksAtom = atom((get) =>
  get(tasksAtom).filter((task) => task.completed)
);

export interface ITask {
  id: string;
  text: string | undefined;
  completed: boolean;
  createdAt: Date;
}

export function emptyTask(): ITask {
  return {
    id: id(),
    text: undefined,
    completed: false,
    createdAt: new Date(),
  };
}

export function hasEmpty(list: ITask[]) {
  return Boolean(list.find(isEmpty));
}

export function isEmpty(task: ITask) {
  return !Boolean(task.text);
}

function id() {
  return nanoid();
}
