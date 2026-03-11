import { Play, Pause, RotateCcw, SkipForward, Clock } from "lucide-react";

function CountdownTimer({
  seconds,
  totalSeconds,
  progress,
  isRunning,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onSkip,
  formatTime,
}) {
  const getProgressColor = () => {
    if (progress > 50) return "bg-green-500";
    if (progress > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressColorDark = () => {
    if (progress > 50) return "bg-green-400";
    if (progress > 20) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getTimeColor = () => {
    if (progress > 50) return "text-green-600 dark:text-green-400";
    if (progress > 20) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${getTimeColor()}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            阅读倒计时
          </span>
        </div>
        <div className={`text-2xl font-bold ${getTimeColor()} font-mono`}>
          {formatTime(seconds)}
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${getProgressColorDark()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={isRunning ? onPause : onStart}
          className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title={isRunning ? "暂停" : "继续"}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span className="text-sm">暂停</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="text-sm">继续</span>
            </>
          )}
        </button>

        <button
          onClick={() => onReset(totalSeconds)}
          className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title="重置"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">重置</span>
        </button>

        <button
          onClick={onSkip}
          className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          title="跳过"
        >
          <SkipForward className="w-4 h-4" />
          <span className="text-sm">跳过</span>
        </button>
      </div>

      {isCompleted && (
        <div className="mt-3 text-center text-sm text-red-600 dark:text-red-400 font-medium animate-pulse">
          ⏰ 时间到！可以进入下一题了
        </div>
      )}
    </div>
  );
}

export default CountdownTimer;
