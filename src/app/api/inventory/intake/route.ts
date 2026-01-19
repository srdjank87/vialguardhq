import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { VialStatus, AuditAction, ActorType } from "@prisma/client";

const vialEntrySchema = z.object({
  productId: z.string().min(1, "Product is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  locationId: z.string().optional(),
});

const intakeSchema = z.object({
  vials: z.array(vialEntrySchema).min(1, "At least one vial is required"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vials } = intakeSchema.parse(body);

    // Verify all products belong to this account
    const productIds = [...new Set(vials.map((v) => v.productId))];
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        accountId: session.user.accountId,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Invalid product selected" },
        { status: 400 }
      );
    }

    // Verify all locations belong to this account (if provided)
    const locationIds = [...new Set(vials.map((v) => v.locationId).filter(Boolean))] as string[];
    if (locationIds.length > 0) {
      const locations = await prisma.location.findMany({
        where: {
          id: { in: locationIds },
          accountId: session.user.accountId,
        },
      });

      if (locations.length !== locationIds.length) {
        return NextResponse.json(
          { error: "Invalid location selected" },
          { status: 400 }
        );
      }
    }

    // Create product map for units lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Create vials in transaction
    const createdVials = await prisma.$transaction(async (tx) => {
      const newVials = [];

      for (const entry of vials) {
        const product = productMap.get(entry.productId)!;

        // Create multiple vials if quantity > 1
        for (let i = 0; i < entry.quantity; i++) {
          const vial = await tx.vial.create({
            data: {
              accountId: session.user.accountId,
              productId: entry.productId,
              lotNumber: entry.lotNumber,
              expirationDate: new Date(entry.expirationDate),
              locationId: entry.locationId || null,
              initialQuantity: product.unitsPerVial,
              remainingQuantity: product.unitsPerVial,
              status: VialStatus.ACTIVE,
            },
          });
          newVials.push(vial);
        }
      }

      // Create audit log for the intake
      await tx.auditLog.create({
        data: {
          accountId: session.user.accountId,
          userId: session.user.id,
          action: AuditAction.VIAL_RECEIVED,
          actorType: ActorType.USER,
          entityType: "VIAL",
          entityId: newVials[0]?.id || null,
          description: `Received ${newVials.length} vial(s)`,
          metadata: {
            vialsCreated: newVials.length,
            entries: vials.map((v) => ({
              productId: v.productId,
              lotNumber: v.lotNumber,
              quantity: v.quantity,
            })),
          },
        },
      });

      return newVials;
    });

    return NextResponse.json(
      {
        success: true,
        vialsCreated: createdVials.length,
        vials: createdVials,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating vials:", error);
    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 500 }
    );
  }
}
