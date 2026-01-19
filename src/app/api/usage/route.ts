import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { VialStatus, AuditAction, ActorType } from "@prisma/client";
import { Decimal } from "decimal.js";

const usageSchema = z.object({
  vialId: z.string().min(1, "Vial is required"),
  providerId: z.string().nullable().optional(),
  quantityUsed: z.number().min(0.1, "Quantity must be greater than 0"),
  patientRef: z.string().nullable().optional(),
  treatmentArea: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vialId = searchParams.get("vialId");
    const providerId = searchParams.get("providerId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {
      accountId: session.user.accountId,
    };

    if (vialId) {
      where.vialId = vialId;
    }

    if (providerId) {
      where.providerId = providerId;
    }

    const usageLogs = await prisma.usageLog.findMany({
      where,
      include: {
        vial: {
          include: { product: true },
        },
        provider: true,
        loggedBy: {
          select: { name: true },
        },
      },
      orderBy: { usedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ usageLogs });
  } catch (error) {
    console.error("Error fetching usage logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage logs" },
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
    const validatedData = usageSchema.parse(body);

    // Get the vial and verify ownership
    const vial = await prisma.vial.findFirst({
      where: {
        id: validatedData.vialId,
        accountId: session.user.accountId,
      },
      include: { product: true },
    });

    if (!vial) {
      return NextResponse.json(
        { error: "Vial not found" },
        { status: 404 }
      );
    }

    if (vial.status !== VialStatus.ACTIVE) {
      return NextResponse.json(
        { error: "Vial is not active" },
        { status: 400 }
      );
    }

    // Check if enough units remain
    const remainingQuantity = Number(vial.remainingQuantity);
    if (validatedData.quantityUsed > remainingQuantity) {
      return NextResponse.json(
        { error: `Only ${remainingQuantity} ${vial.product.unitType.toLowerCase()} remaining` },
        { status: 400 }
      );
    }

    // Verify provider if provided
    if (validatedData.providerId) {
      const provider = await prisma.provider.findFirst({
        where: {
          id: validatedData.providerId,
          accountId: session.user.accountId,
        },
      });

      if (!provider) {
        return NextResponse.json(
          { error: "Provider not found" },
          { status: 404 }
        );
      }
    }

    // Create usage log and update vial in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create usage log
      const usageLog = await tx.usageLog.create({
        data: {
          accountId: session.user.accountId,
          vialId: validatedData.vialId,
          loggedById: session.user.id,
          providerId: validatedData.providerId || null,
          quantityUsed: new Decimal(validatedData.quantityUsed),
          patientReference: validatedData.patientRef || null,
          treatmentArea: validatedData.treatmentArea || null,
          notes: validatedData.notes || null,
        },
        include: {
          vial: { include: { product: true } },
          provider: true,
        },
      });

      // Calculate new remaining units
      const newRemaining = remainingQuantity - validatedData.quantityUsed;
      const newStatus = newRemaining <= 0 ? VialStatus.DEPLETED : VialStatus.ACTIVE;

      // Update vial
      await tx.vial.update({
        where: { id: validatedData.vialId },
        data: {
          remainingQuantity: new Decimal(Math.max(0, newRemaining)),
          status: newStatus,
          depletedDate: newRemaining <= 0 ? new Date() : undefined,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          accountId: session.user.accountId,
          userId: session.user.id,
          action: AuditAction.USAGE_LOGGED,
          actorType: ActorType.USER,
          entityType: "VIAL",
          entityId: validatedData.vialId,
          description: `Logged ${validatedData.quantityUsed} ${vial.product.unitType.toLowerCase()} usage from ${vial.product.name} (Lot: ${vial.lotNumber})`,
          metadata: {
            productName: vial.product.name,
            lotNumber: vial.lotNumber,
            quantityUsed: validatedData.quantityUsed,
            remainingQuantity: newRemaining,
            providerId: validatedData.providerId,
            patientRef: validatedData.patientRef,
          },
        },
      });

      return usageLog;
    });

    return NextResponse.json({ usageLog: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error logging usage:", error);
    return NextResponse.json(
      { error: "Failed to log usage" },
      { status: 500 }
    );
  }
}
