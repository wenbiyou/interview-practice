import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import ProgressBar from './ProgressBar'

function CategoryCard({ category }) {
  const { completedQuestions } = useProgressStore()

  const completedCount = category.questions.filter(q =>
    completedQuestions.includes(q.id)
  ).length

  return (
    <Link
      to={`/practice/${category.id}`}
      className="card p-5 hover:shadow-lg transition-shadow group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.questions.length} 道题目
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
      </div>

      <ProgressBar
        current={completedCount}
        total={category.questions.length}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {category.tags?.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default CategoryCard
