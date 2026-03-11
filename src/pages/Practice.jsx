import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Bookmark, Eye, EyeOff, Shuffle, ListOrdered } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import ProgressBar from '../components/ProgressBar'
import questionsData from '../data/questions.json'

function Practice() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isRandom, setIsRandom] = useState(false)
  const [originalQuestions, setOriginalQuestions] = useState([])

  const {
    completedQuestions,
    bookmarkedQuestions,
    currentProgress,
    markComplete,
    unmarkComplete,
    toggleBookmark,
    updateProgress,
  } = useProgressStore()

  // 加载题目
  useEffect(() => {
    let allQuestions = []

    if (categoryId) {
      const category = questionsData.categories.find(c => c.id === categoryId)
      if (category) {
        allQuestions = category.questions.map(q => ({ ...q, categoryName: category.name }))
      }
    } else {
      allQuestions = questionsData.categories.flatMap(cat =>
        cat.questions.map(q => ({ ...q, categoryName: cat.name }))
      )
    }

    setOriginalQuestions(allQuestions)
    setQuestions(allQuestions)

    // 恢复进度
    if (categoryId && currentProgress[categoryId]) {
      setCurrentIndex(Math.min(currentProgress[categoryId], allQuestions.length - 1))
    }
  }, [categoryId, currentProgress])

  // 保存进度
  useEffect(() => {
    if (categoryId) {
      updateProgress(categoryId, currentIndex)
    }
  }, [currentIndex, categoryId, updateProgress])

  const currentQuestion = questions[currentIndex]
  const isCompleted = currentQuestion && completedQuestions.includes(currentQuestion.id)
  const isBookmarked = currentQuestion && bookmarkedQuestions.includes(currentQuestion.id)

  // 随机打乱
  const handleShuffle = () => {
    if (isRandom) {
      setQuestions([...originalQuestions])
    } else {
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
    }
    setIsRandom(!isRandom)
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  // 上一题
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  // 切换完成状态
  const handleToggleComplete = () => {
    if (isCompleted) {
      unmarkComplete(currentQuestion.id)
    } else {
      markComplete(currentQuestion.id)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">暂无题目</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-600 hover:text-primary-600"
        >
          <ChevronLeft className="w-5 h-5" />
          返回
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              isRandom
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300'
            }`}
            title={isRandom ? '恢复顺序' : '随机打乱'}
          >
            {isRandom ? <ListOrdered className="w-5 h-5" /> : <Shuffle className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        className="mb-6"
      />

      {/* Question Card */}
      <div className="card mb-4">
        {/* Question Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-block px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded mb-2">
                {currentQuestion.categoryName}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {currentIndex + 1}. {currentQuestion.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQuestion.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="p-4 md:p-6">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex flex-col items-center gap-2"
            >
              <Eye className="w-8 h-8" />
              <span>点击查看答案</span>
            </button>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-primary-600" />
                  参考答案
                </h3>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  隐藏答案
                </button>
              </div>
              <div
                className="question-content prose prose-blue max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: currentQuestion.answer }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              上一题
            </button>

            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              <Check className={`w-5 h-5 ${isCompleted ? 'stroke-[3]' : ''}`} />
              {isCompleted ? '已完成' : '标记完成'}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">题目导航</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const isCompleted = completedQuestions.includes(q.id)
            const isCurrent = index === currentIndex

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(index)
                  setShowAnswer(false)
                }}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary-600 text-white'
                    : isCompleted
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Practice