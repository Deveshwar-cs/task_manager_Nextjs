"use client";

import {useCallback, useEffect, useState} from "react";
import {DndContext, closestCorners, useDroppable} from "@dnd-kit/core";
import type {DragEndEvent} from "@dnd-kit/core";

import DraggableTaskCard from "@/app/components/DraggableTaskCard";
import type {KanbanStatus, Task} from "../type/task";
import {handleApiResponse} from "../lib/api";
import {ApiDataResponse} from "../type/task";

const columns: {
  status: KanbanStatus;
  title: string;
  color: string;
  dot: string;
}[] = [
  {
    status: "TODO",
    title: "To Do",
    color: "bg-blue-50",
    dot: "bg-blue-500",
  },
  {
    status: "IN_PROGRESS",
    title: "In Progress",
    color: "bg-amber-50",
    dot: "bg-amber-500",
  },
  {
    status: "DONE",
    title: "Done",
    color: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
];

type TaskColumnProps = {
  status: KanbanStatus;
  title: string;
  color: string;
  dot: string;
  tasks: Task[];
};

function TaskColumn({status, title, color, dot, tasks}: TaskColumnProps) {
  const {setNodeRef, isOver} = useDroppable({id: status});

  return (
    <section
      ref={setNodeRef}
      className={`min-h-80 rounded-2xl border p-4 transition-colors ${
        isOver
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          <h2 className="font-semibold text-slate-800">{title}</h2>
        </div>

        <span className="rounded-lg bg-white px-2.5 py-1 text-sm text-slate-500">
          {tasks.length}
        </span>
      </div>

      <div className={`min-h-60 space-y-3 rounded-xl p-1 ${color}`}>
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    const response = await fetch("/api/tasks");

    const result = await handleApiResponse<ApiDataResponse<Task[]>>(response);
    if (!response.ok) {
      throw new Error("Could not load tasks");
    }
    setTasks(result.data);
  }, []);

  useEffect(() => {
    loadTasks().catch(() => {
      setError("Could not load your tasks.");
    });
  }, [loadTasks]);

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Enter a task title first.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({title}),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not create task");
      }

      setTitle("");
      await loadTasks();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    // The user dropped the card outside a column.
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id) as KanbanStatus;
    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === newStatus) return;

    setError("");
    setMovingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status: newStatus}),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not move task");
      }

      await loadTasks();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not move task");
    } finally {
      setMovingTaskId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Your workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          TaskFlow Board
        </h1>

        <p className="mt-2 text-slate-500">
          Drag and drop tasks to track your progress.
        </p>
      </div>

      <form
        onSubmit={handleCreateTask}
        className="mb-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          aria-label="New task title"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Adding..." : "+ Add task"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-5 text-sm text-red-600">
          {error}
        </p>
      )}

      {movingTaskId !== null && (
        <p role="status" className="mb-4 text-sm text-slate-500">
          Saving task movement…
        </p>
      )}

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              {...column}
              tasks={tasks.filter((task) => task.status === column.status)}
            />
          ))}
        </div>
      </DndContext>
    </main>
  );
}
