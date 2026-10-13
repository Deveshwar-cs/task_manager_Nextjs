import Header from "./components/Header";
import TaskList from "./components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>

          <p className="mt-2 text-gray-500">
            Keep track of what you need to get done.
          </p>
        </div>

        <TaskList />
      </section>
    </main>
  );
}
