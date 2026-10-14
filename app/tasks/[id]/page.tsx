import {prisma} from "@/app/lib/prisma";
import {notFound} from "next/navigation";

type TaskPageProps = {params: Promise<{id: string}>};

export default async function taskDetailsPage({params}: TaskPageProps) {
  const {id} = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    notFound();
  }

  const task = await prisma.task.findUnique({where: {id: taskId}});

  if (!task) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Task Details</h1>

      <p className="mt-4">
        <strong>Title:</strong> {task.title}
      </p>

      <p className="mt-2">
        <strong>Status:</strong> {task.completed ? "Completed" : "Pending"}
      </p>
    </main>
  );
}
