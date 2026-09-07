"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import { MATCHING_PROFILES } from "../../data/matchingGameData";
import { soundManager } from "../../lib/soundEffects";

interface DragDropActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserMatches {
  [countryId: string]: {
    girlName?: string;
    boyName?: string;
    language?: string;
    food?: string;
  };
}

export default function DragDropActivityModal({ isOpen, onClose }: DragDropActivityModalProps) {
  const [matches, setMatches] = useState<UserMatches>({});
  const [selectedItem, setSelectedItem] = useState<{ category: string; value: string } | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ category: string; value: string; fromCountryId?: string } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ countryId: string; category: string } | null>(null);
  const [feedback, setFeedback] = useState<{ [countryId: string]: boolean | null }>({});
  const [score, setScore] = useState<number | null>(null);

  // Available item pools
  const girls = MATCHING_PROFILES.map((p) => p.girlName).sort();
  const boys = MATCHING_PROFILES.map((p) => p.boyName).sort();
  const languages = Array.from(new Set(MATCHING_PROFILES.map((p) => p.language))).sort();
  const foods = MATCHING_PROFILES.map((p) => p.food.join(", ")).sort();

  // Click-to-select fallback
  const handleSelectItem = (category: string, value: string) => {
    soundManager.playClick();
    if (selectedItem?.value === value) {
      setSelectedItem(null);
    } else {
      setSelectedItem({ category, value });
    }
  };

  const handleAssignToSlot = (countryId: string, category: "girlName" | "boyName" | "language" | "food") => {
    if (!selectedItem) return;
    if (selectedItem.category !== category) {
      soundManager.playWrong();
      return;
    }

    soundManager.playClick();
    setMatches((prev) => ({
      ...prev,
      [countryId]: {
        ...prev[countryId],
        [category]: selectedItem.value,
      },
    }));
    setSelectedItem(null);
    setScore(null);
  };

  const handleRemoveSlot = (countryId: string, category: "girlName" | "boyName" | "language" | "food") => {
    soundManager.playClick();
    setMatches((prev) => {
      const updated = { ...prev[countryId] };
      delete updated[category];
      return { ...prev, [countryId]: updated };
    });
    setScore(null);
  };

  // Drag & Drop Handlers
  const handleDragStart = (
    e: React.DragEvent,
    category: string,
    value: string,
    fromCountryId?: string
  ) => {
    const payload = { category, value, fromCountryId };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(payload);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (countryId: string, category: string) => {
    setDragOverTarget({ countryId, category });
  };

  const handleDragLeave = (countryId: string, category: string) => {
    if (dragOverTarget?.countryId === countryId && dragOverTarget?.category === category) {
      setDragOverTarget(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    countryId: string,
    category: "girlName" | "boyName" | "language" | "food"
  ) => {
    e.preventDefault();
    setDragOverTarget(null);

    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;

      const { category: itemCat, value: itemVal, fromCountryId } = JSON.parse(dataStr);

      if (itemCat !== category) {
        soundManager.playWrong();
        return;
      }

      soundManager.playClick();
      setMatches((prev) => {
        const updated = { ...prev };

        // Clear old slot if moving from another country slot
        if (fromCountryId && updated[fromCountryId]) {
          const oldCategoryMatch = { ...updated[fromCountryId] };
          delete oldCategoryMatch[category];
          updated[fromCountryId] = oldCategoryMatch;
        }

        return {
          ...updated,
          [countryId]: {
            ...updated[countryId],
            [category]: itemVal,
          },
        };
      });
      setScore(null);
    } catch (err) {
      console.error("Failed to parse drop data", err);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleCheckAnswers = () => {
    let correctCount = 0;
    const newFeedback: { [countryId: string]: boolean } = {};

    MATCHING_PROFILES.forEach((profile) => {
      const userMatch = matches[profile.id];
      const isGirlCorrect = userMatch?.girlName === profile.girlName;
      const isBoyCorrect = userMatch?.boyName === profile.boyName;
      const isLangCorrect = userMatch?.language === profile.language;
      const isFoodCorrect = userMatch?.food === profile.food.join(", ");

      const isAllCorrect = isGirlCorrect && isBoyCorrect && isLangCorrect && isFoodCorrect;
      newFeedback[profile.id] = isAllCorrect;
      if (isAllCorrect) correctCount++;
    });

    setFeedback(newFeedback);
    setScore(correctCount);

    if (correctCount === MATCHING_PROFILES.length) {
      soundManager.playStarUnlock();
    } else if (correctCount > 0) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setMatches({});
    setSelectedItem(null);
    setDraggedItem(null);
    setDragOverTarget(null);
    setFeedback({});
    setScore(null);
  };

  // Determine active category being dragged or selected
  const activeCategory = draggedItem?.category || selectedItem?.category;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pages 128-129: Friends Around The World Matching Activity"
      badgeText="Interactive Drag & Match"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6 select-none">
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <p className="font-semibold text-indigo-950 flex items-center gap-2">
              <span className="text-base">✋</span> Drag & Drop Instructions:
            </p>
            <p>1. <strong>Drag</strong> any item from the pool below and <strong>drop</strong> it directly into the target slot in the country table.</p>
            <p>2. Or <strong>click/tap</strong> an item to select it, then click the target slot to assign it.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCheckAnswers}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Check Answers</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors border border-slate-300 cursor-pointer active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        {score !== null && (
          <div
            className={`p-4 rounded-xl text-center font-bold text-lg border animate-fadeIn ${
              score === MATCHING_PROFILES.length
                ? "bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm"
                : "bg-amber-100 border-amber-400 text-amber-900 shadow-sm"
            }`}
          >
            {score === MATCHING_PROFILES.length
              ? "🎉 Perfect Score! You matched all 7 countries correctly!"
              : `You scored ${score} out of ${MATCHING_PROFILES.length} profiles correctly. Keep trying!`}
          </div>
        )}

        {/* Item Selection & Drag Pool */}
        <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>⠿</span> Available Draggable Items Pool
            </h3>
            <span className="text-xs text-slate-500 italic">Drag items or tap to select</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Girls */}
            <div className="space-y-2 p-2.5 bg-pink-50/60 rounded-lg border border-pink-200">
              <span className="font-bold text-pink-700 flex items-center gap-1">
                <span>👧</span> Girl&apos;s Names:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {girls.map((name) => (
                  <DraggableBadge
                    key={name}
                    label={`👧 ${name}`}
                    category="girlName"
                    value={name}
                    isSelected={selectedItem?.value === name}
                    isBeingDragged={draggedItem?.value === name && draggedItem?.category === "girlName"}
                    colorClasses="bg-white text-pink-800 border-pink-300 hover:border-pink-500 hover:bg-pink-100/60"
                    selectedClasses="bg-pink-600 text-white border-pink-500 shadow-md ring-2 ring-pink-300"
                    onSelect={() => handleSelectItem("girlName", name)}
                    onDragStart={(e) => handleDragStart(e, "girlName", name)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </div>

            {/* Boys */}
            <div className="space-y-2 p-2.5 bg-sky-50/60 rounded-lg border border-sky-200">
              <span className="font-bold text-sky-700 flex items-center gap-1">
                <span>👦</span> Boy&apos;s Names:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {boys.map((name) => (
                  <DraggableBadge
                    key={name}
                    label={`👦 ${name}`}
                    category="boyName"
                    value={name}
                    isSelected={selectedItem?.value === name}
                    isBeingDragged={draggedItem?.value === name && draggedItem?.category === "boyName"}
                    colorClasses="bg-white text-sky-800 border-sky-300 hover:border-sky-500 hover:bg-sky-100/60"
                    selectedClasses="bg-sky-600 text-white border-sky-500 shadow-md ring-2 ring-sky-300"
                    onSelect={() => handleSelectItem("boyName", name)}
                    onDragStart={(e) => handleDragStart(e, "boyName", name)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2 p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <span>🗣️</span> Languages:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <DraggableBadge
                    key={lang}
                    label={`🗣️ ${lang}`}
                    category="language"
                    value={lang}
                    isSelected={selectedItem?.value === lang}
                    isBeingDragged={draggedItem?.value === lang && draggedItem?.category === "language"}
                    colorClasses="bg-white text-amber-900 border-amber-300 hover:border-amber-500 hover:bg-amber-100/60"
                    selectedClasses="bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-300"
                    onSelect={() => handleSelectItem("language", lang)}
                    onDragStart={(e) => handleDragStart(e, "language", lang)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </div>

            {/* Foods */}
            <div className="space-y-2 p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <span>🍱</span> Traditional Foods:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {foods.map((foodStr) => (
                  <DraggableBadge
                    key={foodStr}
                    label={`🍱 ${foodStr}`}
                    category="food"
                    value={foodStr}
                    isSelected={selectedItem?.value === foodStr}
                    isBeingDragged={draggedItem?.value === foodStr && draggedItem?.category === "food"}
                    colorClasses="bg-white text-emerald-900 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100/60"
                    selectedClasses="bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-300"
                    onSelect={() => handleSelectItem("food", foodStr)}
                    onDragStart={(e) => handleDragStart(e, "food", foodStr)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Target Profiles Grid / Drop Zones */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <span>🎯</span> Country Profiles Matching Table (Drop Targets)
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="text-xs uppercase bg-slate-100 text-slate-600 font-bold">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-200">Country</th>
                  <th className="px-4 py-3 border-b border-slate-200">Girl&apos;s Name</th>
                  <th className="px-4 py-3 border-b border-slate-200">Boy&apos;s Name</th>
                  <th className="px-4 py-3 border-b border-slate-200">Language</th>
                  <th className="px-4 py-3 border-b border-slate-200">Traditional Food</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {MATCHING_PROFILES.map((profile) => {
                  const userMatch = matches[profile.id] || {};
                  const isChecked = score !== null;
                  const isCorrect = feedback[profile.id];

                  return (
                    <tr
                      key={profile.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isChecked
                          ? isCorrect
                            ? "bg-emerald-50/80"
                            : "bg-rose-50/80"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                        <span className="text-2xl">{profile.flagEmoji}</span>
                        <span>{profile.country}</span>
                      </td>

                      {/* Girl Slot */}
                      <td className="px-3 py-3">
                        <SlotButton
                          countryId={profile.id}
                          category="girlName"
                          categoryLabel="Girl's Name"
                          value={userMatch.girlName}
                          colorClass="text-pink-900 border-pink-300 bg-pink-50"
                          onClick={() => handleAssignToSlot(profile.id, "girlName")}
                          onRemove={() => handleRemoveSlot(profile.id, "girlName")}
                          isSelected={selectedItem?.category === "girlName"}
                          isActiveCategory={activeCategory === "girlName"}
                          isDragOver={
                            dragOverTarget?.countryId === profile.id &&
                            dragOverTarget?.category === "girlName"
                          }
                          onDragStart={(e, val) => handleDragStart(e, "girlName", val, profile.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, "girlName")}
                          onDragEnter={() => handleDragEnter(profile.id, "girlName")}
                          onDragLeave={() => handleDragLeave(profile.id, "girlName")}
                          onDrop={(e) => handleDrop(e, profile.id, "girlName")}
                        />
                      </td>

                      {/* Boy Slot */}
                      <td className="px-3 py-3">
                        <SlotButton
                          countryId={profile.id}
                          category="boyName"
                          categoryLabel="Boy's Name"
                          value={userMatch.boyName}
                          colorClass="text-sky-900 border-sky-300 bg-sky-50"
                          onClick={() => handleAssignToSlot(profile.id, "boyName")}
                          onRemove={() => handleRemoveSlot(profile.id, "boyName")}
                          isSelected={selectedItem?.category === "boyName"}
                          isActiveCategory={activeCategory === "boyName"}
                          isDragOver={
                            dragOverTarget?.countryId === profile.id &&
                            dragOverTarget?.category === "boyName"
                          }
                          onDragStart={(e, val) => handleDragStart(e, "boyName", val, profile.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, "boyName")}
                          onDragEnter={() => handleDragEnter(profile.id, "boyName")}
                          onDragLeave={() => handleDragLeave(profile.id, "boyName")}
                          onDrop={(e) => handleDrop(e, profile.id, "boyName")}
                        />
                      </td>

                      {/* Language Slot */}
                      <td className="px-3 py-3">
                        <SlotButton
                          countryId={profile.id}
                          category="language"
                          categoryLabel="Language"
                          value={userMatch.language}
                          colorClass="text-amber-900 border-amber-300 bg-amber-50"
                          onClick={() => handleAssignToSlot(profile.id, "language")}
                          onRemove={() => handleRemoveSlot(profile.id, "language")}
                          isSelected={selectedItem?.category === "language"}
                          isActiveCategory={activeCategory === "language"}
                          isDragOver={
                            dragOverTarget?.countryId === profile.id &&
                            dragOverTarget?.category === "language"
                          }
                          onDragStart={(e, val) => handleDragStart(e, "language", val, profile.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, "language")}
                          onDragEnter={() => handleDragEnter(profile.id, "language")}
                          onDragLeave={() => handleDragLeave(profile.id, "language")}
                          onDrop={(e) => handleDrop(e, profile.id, "language")}
                        />
                      </td>

                      {/* Food Slot */}
                      <td className="px-3 py-3">
                        <SlotButton
                          countryId={profile.id}
                          category="food"
                          categoryLabel="Food"
                          value={userMatch.food}
                          colorClass="text-emerald-900 border-emerald-300 bg-emerald-50"
                          onClick={() => handleAssignToSlot(profile.id, "food")}
                          onRemove={() => handleRemoveSlot(profile.id, "food")}
                          isSelected={selectedItem?.category === "food"}
                          isActiveCategory={activeCategory === "food"}
                          isDragOver={
                            dragOverTarget?.countryId === profile.id &&
                            dragOverTarget?.category === "food"
                          }
                          onDragStart={(e, val) => handleDragStart(e, "food", val, profile.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, "food")}
                          onDragEnter={() => handleDragEnter(profile.id, "food")}
                          onDragLeave={() => handleDragLeave(profile.id, "food")}
                          onDrop={(e) => handleDrop(e, profile.id, "food")}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Draggable item badge in the pool
function DraggableBadge({
  label,
  category,
  value,
  isSelected,
  isBeingDragged,
  colorClasses,
  selectedClasses,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  label: string;
  category: string;
  value: string;
  isSelected: boolean;
  isBeingDragged?: boolean;
  colorClasses: string;
  selectedClasses: string;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`group relative px-2.5 py-1 rounded-md border font-medium cursor-grab active:cursor-grabbing transition-all select-none flex items-center gap-1.5 shadow-xs ${
        isBeingDragged ? "opacity-40 scale-95" : "hover:scale-105"
      } ${isSelected ? selectedClasses : colorClasses}`}
      title="Click or drag into a slot"
    >
      <span className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">⠿</span>
      <span>{label}</span>
    </div>
  );
}

// Target slot button / drop zone in table
function SlotButton({
  countryId,
  category,
  categoryLabel,
  value,
  colorClass,
  onClick,
  onRemove,
  isSelected,
  isActiveCategory,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  countryId: string;
  category: "girlName" | "boyName" | "language" | "food";
  categoryLabel: string;
  value?: string;
  colorClass: string;
  onClick: () => void;
  onRemove: () => void;
  isSelected: boolean;
  isActiveCategory: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, value: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  if (value) {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, value)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-grab active:cursor-grabbing transition-all shadow-xs ${
          isDragOver ? "ring-2 ring-emerald-500 scale-105 bg-emerald-100 border-emerald-400" : colorClass
        }`}
      >
        <span className="flex items-center gap-1">
          <span className="text-[10px] opacity-40">⠿</span>
          <span>{value}</span>
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 text-slate-400 hover:text-rose-600 text-sm font-bold cursor-pointer"
          title="Remove"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`w-full h-9 border-2 border-dashed rounded-lg text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
        isDragOver
          ? "border-emerald-500 bg-emerald-100 text-emerald-900 scale-105 ring-2 ring-emerald-400 shadow-md"
          : isSelected
          ? "border-indigo-500 bg-indigo-100 text-indigo-900 animate-pulse"
          : isActiveCategory
          ? "border-indigo-400 bg-indigo-50 text-indigo-700 animate-pulse"
          : "border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600"
      }`}
    >
      {isDragOver
        ? "📥 Drop Here!"
        : isSelected
        ? `Click to place`
        : isActiveCategory
        ? `Drop ${categoryLabel}`
        : "+ Empty Slot"}
    </div>
  );
}
