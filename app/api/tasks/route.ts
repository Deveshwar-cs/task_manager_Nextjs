import {prisma} from "@/app/lib/prisma";
import {NextResponse} from "next/server";
import {createTaskSchema} from "@/app/lib/validations/task";
// Fetch all tasks from PosgreSQL
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({success: true, data: tasks}, {status: 200});
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch tasks:", error.message);
    } else {
      console.error("Failed to fetch tasks:", error);
    }

    return NextResponse.json({message: "Failed to fetch tasks"}, {status: 500});
  }
}

// POST: Create a new task in postgreSQL

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const result = createTaskSchema.safeParse(body);
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

    const task = await prisma.task.create({
      data: {
        title: result.data.title,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully created!",
        data: task,
      },
      {status: 201},
    );
  } catch (error: unknown) {
    console.error("Failed to create task:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while creating the task",
      },
      {status: 500},
    );
  }
}

// ========== Code for task manager without database =======
// import {NextResponse} from "next/server";
// import type {Task} from "../../type/task";
// import {tasks} from "@/app/lib/tasks";

// export async function GET() {
//   return NextResponse.json({
//     success: true,
//     message: "Tasks fetched successfully",
//     data: tasks,
//   });
// }
// export async function POST(request: Request) {
//   const body: unknown = await request.json();

//   if (
//     typeof body !== "object" ||
//     body === null ||
//     !("title" in body) ||
//     typeof body.title !== "string" ||
//     !body.title.trim
//   ) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "A valid title is required",
//       },
//       {
//         status: 400,
//       },
//     );
//   }

//   const newTask: Task = {
//     id: Date.now(),
//     title: body.title.trim(),
//     completed: false,
//   };

//   tasks.push(newTask);

//   return NextResponse.json(
//     {
//       message: "Task created successfully",
//       data: newTask,
//       success: true,
//     },
//     {status: 201},
//   );
// }
