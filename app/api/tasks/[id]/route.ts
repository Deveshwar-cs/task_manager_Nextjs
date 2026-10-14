import {prisma} from "@/app/lib/prisma";
import {NextResponse} from "next/server";
import {updateTaskSchema} from "@/app/lib/validations/task";

type RouteContext = {
  params: Promise<{id: string}>;
};

export async function PATCH(request: Request, {params}: RouteContext) {
  try {
    const {id} = await params;

    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return NextResponse.json({message: "Invalid task ID"}, {status: 400});
    }

    const body = await request.json();

    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid task data",
          errors: result.error.flatten(),
        },
        {status: 400},
      );
    }

    const updateData =
      "status" in result.data
        ? {
            status: result.data.status,
            completed: result.data.status === "DONE",
          }
        : {
            completed: result.data.completed,
            status: result.data.completed ? "DONE" : "TODO",
          };

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({message: "Task not found"}, {status: 404});
    }

    console.error("Failed to update task:", error);

    return NextResponse.json({message: "Failed to update task"}, {status: 500});
  }
}

export async function DELETE(request: Request, {params}: RouteContext) {
  try {
    const {id} = await params;

    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return NextResponse.json({message: "Invalid task ID"}, {status: 400});
    }

    const task = await prisma.task.delete({where: {id: taskId}});

    return NextResponse.json({
      message: "Task deleted successfully",
      data: task,
      success: true,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({message: "Task not found"}, {status: 404});
    }

    console.error("Failed to delete task:", error);

    return NextResponse.json({message: "Failed to delete task"}, {status: 500});
  }
}

// ======= Code for task manager without using database =====
// import {NextResponse} from "next/server";

// // import type {Task} from "../../../type/task";

// import {tasks} from "@/app/lib/tasks";

// type RouteContext = {
//   params: Promise<{id: string}>;
// };

// //Temporary demo data shared with the collection route
// // const tasks: Task[] = [];

// export async function PATCH(request: Request, {params}: RouteContext) {
//   const {id} = await params;
//   const taskId = Number(id);

//   if (!Number.isInteger(taskId) || taskId <= 0) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Invalid task ID",
//       },
//       {status: 400},
//     );
//   }
//   let body: unknown;

//   try {
//     body = await request.json();
//   } catch {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Invalid JSON body",
//       },
//       {status: 400},
//     );
//   }

//   if (
//     typeof body !== "object" ||
//     body === null ||
//     !("completed" in body) ||
//     typeof body.completed !== "boolean"
//   ) {
//     return NextResponse.json(
//       {success: false, message: "A boolean completed value is required."},
//       {status: 400},
//     );
//   }
//   console.log(tasks);
//   const task = tasks.find((item) => item.id === taskId);

//   if (!task) {
//     return NextResponse.json(
//       {success: false, message: "Task not found!"},
//       {status: 404},
//     );
//   }

//   task.completed = body.completed;
//   return NextResponse.json({
//     success: true,
//     data: task,
//   });
// }
