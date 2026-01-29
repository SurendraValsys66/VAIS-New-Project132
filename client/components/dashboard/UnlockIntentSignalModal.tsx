import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Info } from "lucide-react";

interface UnlockIntentSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (selectedOptions: string[]) => void;
  currentlyClickedBadgeId?: string;
}

const unlockOptions = [
  {
    id: "current",
    label: "Unlock Current Signal",
    description: "This company's intent signal",
  },
  {
    id: "super_strong",
    label: "Super Strong Signals Only",
    description: "Companies with super strong intent signals",
  },
  {
    id: "very_strong",
    label: "Very Strong Signals Only",
    description: "Companies with very strong intent signals",
  },
  {
    id: "strong",
    label: "Strong Signals Only",
    description: "Companies with strong intent signals",
  },
  {
    id: "all",
    label: "Unlock All Signals",
    description: "All intent signals in this list",
  },
];

export default function UnlockIntentSignalModal({
  open,
  onOpenChange,
  onUnlock,
  currentlyClickedBadgeId,
}: UnlockIntentSignalModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(["current"]),
  );

  const handleCheckboxChange = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const handleUnlock = () => {
    if (selectedOptions.size > 0) {
      onUnlock(Array.from(selectedOptions));
      onOpenChange(false);
      setSelectedOptions(new Set(["current"]));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 border-0 rounded-xl overflow-hidden">
        <div className="bg-white">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-100 px-6 py-5 border-b border-gray-200 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-valasys-orange/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex items-start gap-4 justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon with glow effect */}
                <div className="p-3 bg-gradient-to-br from-valasys-orange via-orange-500 to-red-500 rounded-xl flex-shrink-0 shadow-lg shadow-orange-200/40 ring-1 ring-orange-200/50 transform hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Unlock Intent Signals
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-valasys-orange/10 to-orange-500/10 border border-orange-200 rounded-full">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-valasys-orange to-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-orange-700">Premium</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Powered by <span className="font-semibold text-gray-900">Bombora</span> – Access real-time buying intent insights
                  </p>
                </div>
              </div>

              {/* Decorative stats badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="text-xs font-bold text-valasys-orange">48K+</div>
                  <div className="text-xs text-gray-600">Credits</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8">
            {/* Options */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Choose what to unlock
              </h3>
              <div className="space-y-2">
                {unlockOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-valasys-orange hover:bg-orange-50/30 cursor-pointer transition-all group"
                  >
                    <Checkbox
                      checked={selectedOptions.has(option.id)}
                      onCheckedChange={() => handleCheckboxChange(option.id)}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost Alert */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Each unlock deducts 5 credits</span>
                <br />
                You have <span className="font-semibold">48,256 credits</span> remaining
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  setSelectedOptions(new Set(["current"]));
                }}
                variant="outline"
                className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnlock}
                disabled={selectedOptions.size === 0}
                className="flex-1 h-10 bg-gradient-to-r from-valasys-orange to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 mr-2" />
                Unlock Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
