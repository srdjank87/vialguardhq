import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { Plan, SubscriptionStatus, UserRole, LocationType, AuditAction, ActorType } from "@prisma/client";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(validatedData.password, 12);

    // Create account and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create account with 14-day trial
      const account = await tx.account.create({
        data: {
          clinicName: validatedData.clinicName,
          plan: Plan.TRIAL,
          subscriptionStatus: SubscriptionStatus.TRIAL,
          trialEndsAt: addDays(new Date(), 14),
        },
      });

      // Create user as owner
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          name: validatedData.name,
          role: UserRole.OWNER,
          accountId: account.id,
        },
      });

      // Create default location
      await tx.location.create({
        data: {
          name: "Main Storage",
          type: LocationType.STORAGE,
          accountId: account.id,
        },
      });

      // Log the signup
      await tx.auditLog.create({
        data: {
          action: AuditAction.USER_CREATED,
          entityType: "User",
          entityId: user.id,
          actorType: ActorType.USER,
          userId: user.id,
          description: `Account created for ${validatedData.clinicName}`,
          accountId: account.id,
        },
      });

      return { account, user };
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Account created successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
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

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
