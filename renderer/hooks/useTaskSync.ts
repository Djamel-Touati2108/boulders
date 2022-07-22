import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ITask, tasksAtom } from "../util/task";
import Firebase from "../util/firebase";

export default function useTaskSync({
  authLoading,
  authenticated,
}: {
  authLoading: boolean;
  authenticated: boolean;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [_, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    setLoading(authLoading || dataLoading);
  }, [authLoading, dataLoading]);

  useEffect(() => {
    if (authLoading) return;
    if (!authenticated) {
      router.push("/auth");
      return;
    }

    load();
  }, [authLoading, authenticated]);

  async function load() {
    const tasks = await Firebase.fetch();
    setTasks(tasks.map((task) => ({ ...(task.data() as ITask), id: task.id })));
    setDataLoading(false);
  }

  return { loading };
}
