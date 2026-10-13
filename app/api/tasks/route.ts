import {prisma} from "@/app/lib/prisma";
import {NextResponse} from "next/server";

// Fetch all tasks from PosgreSQL
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({success: true, data: tasks}, {status: 200});
  } catch (error) {
    console.log("Failed to fetch tasks:", error);

    return NextResponse.json({message: "Failed to fetch tasks"}, {status: 500});
  }
}

// POST: Create a new task in postgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        {message: "Task title is required"},
        {status: 400},
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
      },
    });

    return NextResponse.json(
      {data: task, message: "Successfully created!!", success: true},
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to create task:", error);

    return NextResponse.json(
      {
        message: "Failed to create a task",
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
