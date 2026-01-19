import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { LocationType, AuditAction, ActorType } from "@prisma/client";

const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(LocationType),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: {
        accountId: session.user.accountId,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = locationSchema.parse(body);

    const location = await prisma.location.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        accountId: session.user.accountId,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        accountId: session.user.accountId,
        userId: session.user.id,
        action: AuditAction.SETTINGS_CHANGED,
        actorType: ActorType.USER,
        entityType: "LOCATION",
        entityId: location.id,
        description: `Created location: ${location.name} (${location.type})`,
        metadata: { locationName: location.name, type: location.type },
      },
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
