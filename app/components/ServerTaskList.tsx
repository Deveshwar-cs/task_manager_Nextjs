import {prisma} from "@/app/lib/prisma";

export default async function ServerTaskList() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <h2>Tasks from PostgreSQL</h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} - {task.completed ? "completed" : "pending"}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
