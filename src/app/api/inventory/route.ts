import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VialStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as VialStatus | null;
    const productId = searchParams.get("productId");
    const locationId = searchParams.get("locationId");
    const search = searchParams.get("search");
    const expiring = searchParams.get("expiring"); // "7", "14", "30" for days

    // Build where clause
    const where: Record<string, unknown> = {
      accountId: session.user.accountId,
    };

    if (status) {
      where.status = status;
    }

    if (productId) {
      where.productId = productId;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (search) {
      where.lotNumber = { contains: search, mode: "insensitive" };
    }

    if (expiring) {
      const days = parseInt(expiring);
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      where.expirationDate = { lte: futureDate, gt: now };
      where.status = VialStatus.ACTIVE;
    }

    const vials = await prisma.vial.findMany({
      where,
      include: {
        product: true,
        location: true,
      },
      orderBy: [
        { expirationDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Get summary by product
    const productSummary = await prisma.vial.groupBy({
      by: ["productId"],
      where: {
        accountId: session.user.accountId,
        status: VialStatus.ACTIVE,
      },
      _count: { id: true },
      _sum: { remainingQuantity: true },
    });

    // Get products for the summary
    const products = await prisma.product.findMany({
      where: {
        accountId: session.user.accountId,
        active: true,
      },
    });

    const summary = products.map((product) => {
      const stats = productSummary.find((s) => s.productId === product.id);
      return {
        product,
        activeVials: stats?._count?.id || 0,
        totalUnits: stats?._sum?.remainingQuantity || 0,
      };
    });

    return NextResponse.json({ vials, summary });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}
