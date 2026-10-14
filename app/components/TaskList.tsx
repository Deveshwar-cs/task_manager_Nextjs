"use client";
import {useEffect, useState} from "react";

import TaskCard from "./TaskCard";

import type {
  Task,
  ApiDataResponse,
  ApiResponse,
  CreateTaskResponse,
  // CreateTaskRequest,
  // UpdateTaskRequest,
  NewTask,
  UpdateTaskData,
} from "../type/task";
// import {statusLabels} from "../type/task";

type TaskFilter = "all" | "pending" | "completed";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const label = statusLabels["pending"];
  // console.log(label);
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("api/tasks");

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const result: ApiDataResponse<Task[]> = await response.json();

        setTasks(result.data);
      } catch {
        setError("Could not load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);
  const totalTasks = tasks.length || 0;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = totalTasks - completedTasks;

  const filterTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;

    return true;
  });

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTaskTitle.trim();

    if (!title) return;

    try {
      setError(null);

      const payload: NewTask = {title};
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: CreateTaskResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Failed to create task");
      }
      setTasks((currentTasks) => [...currentTasks, result.data!]);

      setNewTaskTitle("");
    } catch (error) {
      console.log(error);
      setError("Could not create the task. Please try again");
    }
  }

  async function toggleTask(taskId: number) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) return;

    try {
      setError(null);

      const payload: UpdateTaskData = {
        completed: !task.completed,
      };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse<Task> = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Failed to update task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === taskId ? result.data! : item)),
      );
    } catch {
      setError("Could not update the task. Please try again");
    }
  }

  async function deleteTask(taskId: number) {
    try {
      setError(null);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const result: ApiResponse<Task> = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Failed to update task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((item) => item.id !== taskId),
      );
    } catch {
      setError("Could not delete the task. Please try again");
    }
  }

  if (isLoading) {
    return <p className="p-6 text-gray-500">Loading tasks...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }
  return (
    <div className="space-y-3">
      <form onSubmit={addTask} className="mb-6 flex gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          placeholder="Enter a new task..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Add task
        </button>
      </form>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-blue-600">{pendingTasks}</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "pending", "completed"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={
              filter === option
                ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg bg-white px-4 py-2 text-sm text-gray-600"
            }
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      {filterTasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
          onToggle={() => toggleTask(task.id)}
          onDelete={() => deleteTask(task.id)}
        />
      ))}
    </div>
  );
}
