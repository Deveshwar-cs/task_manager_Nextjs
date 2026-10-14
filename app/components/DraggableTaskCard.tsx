"use client";

import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import type {Task} from "../type/task";

type DraggableTaskCardProps = {
  task: Task;
};

export default function DraggableTaskCard({task}: DraggableTaskCardProps) {
  const {attributes, listeners, setNodeRef, transform, isDragging} =
    useDraggable({
      id: task.id,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
      }}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <p className="font-medium text-slate-800">{task.title}</p>

      <p className="mt-3 text-xs text-slate-400">#{task.id} · Drag to move</p>
    </div>
  );
}
