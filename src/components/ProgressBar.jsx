function ProgressBar({ current, total, className = '' }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <span>进度</span>
        <span>{current}/{total} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
