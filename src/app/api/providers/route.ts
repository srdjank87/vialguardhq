import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { AuditAction, ActorType } from "@prisma/client";

const providerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initials: z.string().min(1, "Initials are required"),
  email: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providers = await prisma.provider.findMany({
      where: {
        accountId: session.user.accountId,
        active: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
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
    const validatedData = providerSchema.parse(body);

    const provider = await prisma.provider.create({
      data: {
        name: validatedData.name,
        initials: validatedData.initials,
        email: validatedData.email || null,
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
        entityType: "PROVIDER",
        entityId: provider.id,
        description: `Created provider: ${provider.name} (${provider.initials})`,
        metadata: { providerName: provider.name, initials: provider.initials },
      },
    });

    return NextResponse.json({ provider }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}
