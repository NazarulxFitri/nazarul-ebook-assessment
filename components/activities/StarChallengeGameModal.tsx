"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import { STAR_CHALLENGE_TILES, BoardTile } from "../../data/starChallengeData";
import { soundManager } from "../../lib/soundEffects";

interface StarChallengeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StarChallengeGameModal({ isOpen, onClose }: StarChallengeGameModalProps) {
  const [playerPosition, setPlayerPosition] = useState(1); // Tile 1 is START
  const [stars, setStars] = useState(0);
  const [score, setScore] = useState(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [currentQuestionTile, setCurrentQuestionTile] = useState<BoardTile | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [hasWon, setHasWon] = useState(false);

  const handleRollDice = () => {
    if (isRolling || isMoving || currentQuestionTile || hasWon) return;

    soundManager.playDiceRoll();
    setIsRolling(true);
    setDiceRoll(null);

    let rollCount = 0;
    const interval = setInterval(() => {
      rollCount++;
      setDiceRoll(Math.floor(Math.random() * 6) + 1);
      if (rollCount > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceRoll(finalRoll);
        setIsRolling(false);

        // Start step-by-step animation
        movePlayerStepByStep(finalRoll);
      }
    }, 80);
  };

  const movePlayerStepByStep = (steps: number) => {
    setIsMoving(true);
    let stepsLeft = steps;
    let currentPos = playerPosition;

    const stepInterval = setInterval(() => {
      if (stepsLeft > 0 && currentPos < 24) {
        currentPos += 1;
        stepsLeft -= 1;
        setPlayerPosition(currentPos);
        soundManager.playClick();
      } else {
        clearInterval(stepInterval);
        setIsMoving(false);

        const targetTile = STAR_CHALLENGE_TILES.find((t) => t.id === currentPos);
        if (targetTile && currentPos > 1) {
          if (currentPos === 24) {
            setHasWon(true);
            soundManager.playStarUnlock();
          } else {
            setCurrentQuestionTile(targetTile);
            setSelectedAnswer(null);
            setQuestionFeedback(null);
          }
        }
      }
    }, 300); // 300ms per step
  };

  const handleAnswerSubmit = (option: string) => {
    if (!currentQuestionTile || selectedAnswer !== null) return;

    setSelectedAnswer(option);
    const isCorrect = option === currentQuestionTile.correctAnswer;

    if (isCorrect) {
      soundManager.playCorrect();
      setScore((prev) => prev + 10);
      if (currentQuestionTile.starBonus) {
        soundManager.playStarUnlock();
        setStars((prev) => prev + 1);
      }
      setQuestionFeedback({
        isCorrect: true,
        text: `✨ Correct! ${currentQuestionTile.explanation}`,
      });
    } else {
      soundManager.playWrong();
      setQuestionFeedback({
        isCorrect: false,
        text: `❌ Incorrect. The correct answer was "${currentQuestionTile.correctAnswer}". ${currentQuestionTile.explanation}`,
      });
    }
  };

  const handleCloseQuestion = () => {
    soundManager.playClick();
    setCurrentQuestionTile(null);
    setSelectedAnswer(null);
    setQuestionFeedback(null);
  };

  const handleRestart = () => {
    soundManager.playClick();
    setPlayerPosition(1);
    setStars(0);
    setScore(0);
    setDiceRoll(null);
    setCurrentQuestionTile(null);
    setHasWon(false);
    setIsMoving(false);
    setIsRolling(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pages 136-137: Gamified Digital Star Challenge Board Game"
      badgeText="Interactive Game"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Game Stats & Control Header */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-slate-500 font-medium">Stars Collected</p>
                <p className="text-lg font-black text-amber-600">{stars}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Score</p>
                <p className="text-lg font-black text-emerald-700">{score} pts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-xs text-slate-500 font-medium">Current Tile</p>
                <p className="text-sm font-bold text-indigo-700">Tile {playerPosition} of 24</p>
              </div>
            </div>
          </div>

          {/* Dice & Roll Button */}
          <div className="flex items-center gap-4">
            {diceRoll !== null && (
              <div className="w-12 h-12 bg-white text-indigo-950 font-black text-2xl rounded-xl shadow-md flex items-center justify-center border-2 border-indigo-500 animate-bounce">
                {diceRoll}
              </div>
            )}

            <button
              onClick={handleRollDice}
              disabled={isRolling || isMoving || !!currentQuestionTile || hasWon}
              className={`px-6 py-3 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                isRolling || isMoving || currentQuestionTile || hasWon
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white active:scale-95 shadow-indigo-500/20"
              }`}
            >
              <span>🎲 {isRolling ? "Rolling..." : isMoving ? "Moving..." : "Roll Dice"}</span>
            </button>

            <button
              onClick={handleRestart}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              Restart
            </button>
          </div>
        </div>

        {/* Victory Screen Banner */}
        {hasWon && (
          <div className="p-8 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 border-2 border-emerald-400 rounded-2xl text-center space-y-4 shadow-xl animate-fadeIn text-white">
            <span className="text-6xl animate-bounce inline-block">👑 ⭐ 🏆</span>
            <h2 className="text-3xl font-black text-white">CONGRATULATIONS! YOU WON THE STAR CHALLENGE!</h2>
            <p className="text-emerald-100 text-sm">
              You accumulated <strong className="text-amber-200">{stars} Stars</strong> and <strong className="text-emerald-100">{score} Points</strong>!
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-white hover:bg-amber-100 text-emerald-950 font-black rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Board Tiles Grid (24 Squares Layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {STAR_CHALLENGE_TILES.map((tile) => {
            const isPlayerHere = playerPosition === tile.id;
            const isStar = tile.starBonus;

            return (
              <div
                key={tile.id}
                onClick={() => {
                  if (tile.id === playerPosition && !currentQuestionTile && !isMoving && !isRolling) {
                    setCurrentQuestionTile(tile);
                  }
                }}
                className={`relative min-h-[90px] p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-xs ${
                  isPlayerHere
                    ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 shadow-md scale-105"
                    : isStar
                    ? "bg-amber-50/80 border-amber-300 hover:border-amber-400"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Tile Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>#{tile.id}</span>
                  {isStar && <span className="text-xs">⭐</span>}
                </div>

                {/* Tile Title */}
                <p className="text-xs font-bold text-slate-800 line-clamp-2">{tile.label}</p>

                {/* Player Pawn Indicator */}
                {isPlayerHere && (
                  <div className="mt-1 self-end px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full shadow-xs animate-bounce flex items-center gap-1 transition-all duration-200">
                    <span>♟️</span>
                    <span>YOU</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Question Modal Popup Overlay */}
        {currentQuestionTile && !isMoving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-white border-2 border-indigo-500 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-scaleIn transform transition-all max-h-[90vh] overflow-y-auto">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-black rounded-lg">
                    Tile {currentQuestionTile.id}
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                    {currentQuestionTile.label}
                  </span>
                </div>
                {currentQuestionTile.starBonus && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold rounded-full flex items-center gap-1 shadow-2xs">
                    <span>⭐</span>
                    <span>Star Challenge</span>
                  </span>
                )}
              </div>

              {/* Question Body */}
              <div className="py-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
                  Challenge Question:
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestionTile.question}
                </h3>
              </div>

              {/* Answer Options */}
              {currentQuestionTile.options && (
                <div className="space-y-2.5 pt-1">
                  {currentQuestionTile.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSubmit(opt)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-3.5 text-left text-xs sm:text-sm font-semibold rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedAnswer === opt
                          ? opt === currentQuestionTile.correctAnswer
                            ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400"
                            : "bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-400"
                          : "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/70 text-slate-800 hover:scale-[1.01]"
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer === opt && (
                        <span>{opt === currentQuestionTile.correctAnswer ? "✅" : "❌"}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Feedback & Continue */}
              {questionFeedback && (
                <div className="space-y-3 pt-3 border-t border-slate-200 animate-fadeIn">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold border ${
                      questionFeedback.isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-rose-50 border-rose-300 text-rose-900"
                    }`}
                  >
                    {questionFeedback.text}
                  </div>

                  <button
                    onClick={handleCloseQuestion}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Continue Game 🚀
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
