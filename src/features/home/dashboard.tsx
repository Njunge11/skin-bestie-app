"use client";

import { useState } from "react";
import { Bell, User, ChevronLeft, ChevronRight } from "lucide-react";
import { ProgressTracker } from "./components/progress-tracker";
import { BookingCard } from "./components/booking-card";
import { SkinTestCard } from "./components/skin-test-card";
import { RoutineCard } from "./components/routine-card";
import { QuickActions } from "./components/quick-actions";
import { TipOfDay } from "./components/tip-of-day";

const journeySteps = ["Profile", "Skin Test", "Consultation", "Routine"];
const morningRoutineSteps = [
  { name: "Gentle cleanser", completed: true },
  { name: "Hydrating toner", completed: true },
  { name: "Vitamin C serum", completed: false },
  { name: "Moisturizer", completed: false },
  { name: "SPF 50 sunscreen", completed: false },
];
const eveningRoutineSteps = [
  { name: "Oil cleanser", completed: false },
  { name: "Foam cleanser", completed: false },
  { name: "Exfoliating toner", completed: false },
  { name: "Retinol serum", completed: false },
  { name: "Night cream", completed: false },
];

export function Dashboard() {
  const [userName] = useState("Esther");
  const [currentWeek, setCurrentWeek] = useState(0);
  const currentStep = 1; // User is at "Skin Test" step

  const weekDates = [
    { start: "Dec 2", end: "Dec 8" },
    { start: "Dec 9", end: "Dec 15" },
    { start: "Dec 16", end: "Dec 22" },
  ];

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => Math.min(weekDates.length - 1, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Good morning,</p>
            <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Journey Progress */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Your skincare journey
          </h2>
          <ProgressTracker currentStep={currentStep} steps={journeySteps} />
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevWeek}
            disabled={currentWeek === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-gray-900">
            {weekDates[currentWeek].start} - {weekDates[currentWeek].end}
          </span>
          <button
            onClick={handleNextWeek}
            disabled={currentWeek === weekDates.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Upcoming Booking */}
        <BookingCard
          title="Initial Consultation"
          date="Tuesday, Dec 10"
          time="2:00 PM EST"
          duration="45 min"
        />

        {/* Skin Test CTA */}
        <SkinTestCard />

        {/* Tip of the Day */}
        <TipOfDay />

        {/* Quick Actions */}
        <QuickActions />

        {/* Daily Routines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RoutineCard title="Morning routine" steps={morningRoutineSteps} />
          <RoutineCard title="Evening routine" steps={eveningRoutineSteps} />
        </div>
      </main>
    </div>
  );
}
