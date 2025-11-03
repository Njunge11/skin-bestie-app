import { auth } from "@/auth";
import { NextResponse } from "next/server";

// API Response interface
interface StatsApiResponse {
  todayProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  currentStreak: {
    days: number;
  };
  weeklyCompliance: {
    percentage: number;
    completed: number;
    total: number;
  };
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    const apiKey = process.env.API_KEY;

    if (!apiBaseUrl || !apiKey) {
      return NextResponse.json(
        { error: "API configuration missing" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${apiBaseUrl}/api/consumer-app/stats?userId=${session.user.id}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid API key" },
          { status: 401 },
        );
      }

      if (response.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (response.status === 400) {
        return NextResponse.json(
          { error: errorData?.error?.message || "Invalid request parameters" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch stats data" },
        { status: 500 },
      );
    }

    const data: StatsApiResponse = await response.json();

    console.log("Stats API Response:", JSON.stringify(data, null, 2));

    // Transform API response to frontend format
    return NextResponse.json({
      completionPercentage: data.todayProgress.percentage,
      completedSteps: data.todayProgress.completed,
      totalSteps: data.todayProgress.total,
      weeklyCompliance: data.weeklyCompliance.percentage,
      weeklyCompleted: data.weeklyCompliance.completed,
      weeklyTotal: data.weeklyCompliance.total,
      currentStreak: data.currentStreak.days,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
