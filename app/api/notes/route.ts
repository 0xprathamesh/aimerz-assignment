import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { CreateNoteData } from "@/types/note";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const isPinned = searchParams.get("isPinned");
    const tags = searchParams.get("tags");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { userId: session.user.id };

    if (category) {
      query.category = category;
    }

    if (priority) {
      query.priority = priority;
    }

    if (isPinned !== null) {
      query.isPinned = isPinned === "true";
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateNoteData = await request.json();
    const { title, content, category, priority, isPinned, todoId, tags } = body;

    if (!title || !content || !category || !priority) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const note = new Note({
      title,
      content,
      category,
      priority,
      isPinned: isPinned || false,
      todoId: todoId || null,
      tags: tags || [],
      userId: session.user.id,
    });

    await note.save();

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
