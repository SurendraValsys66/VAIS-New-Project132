import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  DollarSign,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IntentSignalModal from "./IntentSignalModal";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface IntentSignalData {
  compositeScore: number;
  deltaScore: number;
  matchedTopics: number;
  intentSignal: string;
  companyName: string;
  vais: number;
  revenue: string;
  city: string;
  relatedTopics: string[];
}

interface IntentSignalPopoverProps {
  data: IntentSignalData;
  children: React.ReactNode;
}

const chartConfig = {
  compositeScore: {
    label: "Composite Score",
    color: "#EF4444", // Red/Orange color
  },
  deltaScore: {
    label: "Delta Score",
    color: "#6366F1", // Indigo/Blue color
  },
};

const generateChartData = (intentData: IntentSignalData) => {
  const baseData = [];
  const compositeBase = intentData.compositeScore;
  const deltaBase = intentData.deltaScore;

  // Generate 7 weeks of data
  for (let i = 0; i < 7; i++) {
    const variation = (i / 6) * 0.6; // Progressive increase from week 1 to week 7
    baseData.push({
      week: `week${i + 1}`,
      compositeScore: Math.max(0, Math.round(compositeBase * (0.2 + variation))),
      deltaScore: Math.max(0, Math.round(deltaBase * (0.2 + variation))),
    });
  }
  return baseData;
};

const getIntentSignalColor = (signal: string) => {
  switch (signal) {
    case "Super Strong":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Very Strong":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Strong":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Medium":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    case "Weak":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default function IntentSignalPopover({
  data,
  children,
}: IntentSignalPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartData = generateChartData(data);

  const handleChartClick = () => {
    setIsPopoverOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start" side="right">
          <div className="space-y-4">
            {/* Company Header */}
            <div className="border-b pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-valasys-orange" />
                  <h4 className="text-sm font-bold text-gray-900">
                    {data.companyName}
                  </h4>
                </div>
                <Badge
                  className={cn(
                    "text-xs",
                    getIntentSignalColor(data.intentSignal),
                  )}
                >
                  {data.intentSignal}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-valasys-orange" />
                  <span>
                    VAIS:{" "}
                    <span className="font-semibold text-valasys-orange">
                      {data.vais}%
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  <span>{data.revenue}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{data.city}</span>
                </div>
              </div>
            </div>

            {/* Intent Signal Breakdown Chart */}
            <div>
              <h5 className="text-sm font-semibold mb-3">Intent Signal Breakdown</h5>
              <div
                className="h-48 border rounded-lg p-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleChartClick}
              >
                <ChartContainer config={chartConfig}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-20"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="week"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#666" }}
                    />
                    <YAxis
                      hide={false}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#999" }}
                      width={25}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="compositeScore"
                      stroke={chartConfig.compositeScore.color}
                      strokeWidth={2}
                      dot={{
                        fill: chartConfig.compositeScore.color,
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                      isAnimationActive={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="deltaScore"
                      stroke={chartConfig.deltaScore.color}
                      strokeWidth={2}
                      dot={{
                        fill: chartConfig.deltaScore.color,
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>

            {/* Topics Section */}
            <div>
              <h5 className="text-sm font-semibold mb-3">Topics</h5>
              <div className="space-y-2">
                {data.relatedTopics.slice(0, 2).map((topic, index) => {
                  const scores = [65, 63, 58];
                  const score = scores[index] || Math.floor(Math.random() * 40 + 60);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-xs"
                    >
                      <span className="text-gray-700 font-medium">{topic}</span>
                      <div className="w-1.5 h-1.5 bg-valasys-orange rounded-full"></div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Showing all topics
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Full Modal - shown when user clicks on chart */}
      <IntentSignalModal
        data={data}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
