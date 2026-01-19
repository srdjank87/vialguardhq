import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ProductCategory, UnitType, AuditAction, ActorType } from "@prisma/client";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.nativeEnum(ProductCategory),
  unitType: z.nativeEnum(UnitType),
  unitsPerVial: z.number().min(1, "Units per vial must be at least 1"),
  costPerVial: z.number().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: {
        accountId: session.user.accountId,
        active: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        brand: validatedData.brand,
        category: validatedData.category,
        unitType: validatedData.unitType,
        unitsPerVial: validatedData.unitsPerVial,
        costPerVial: validatedData.costPerVial,
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
        entityType: "PRODUCT",
        entityId: product.id,
        description: `Created product: ${product.name} (${product.brand})`,
        metadata: { productName: product.name, brand: product.brand },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
