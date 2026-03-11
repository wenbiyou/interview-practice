import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Moon, Sun, BarChart3, Bookmark } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useProgressStore } from '../stores/progressStore'

function Header() {
  const location = useLocation()
  const { isDark, toggleTheme } = useThemeStore()
  const { totalBookmarked } = useProgressStore((state) => state.getStats())

  const navItems = [
    { path: '/', label: '首页', icon: BookOpen },
    { path: '/practice', label: '刷题', icon: BookOpen },
    { path: '/review', label: '复习', icon: Bookmark },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <BookOpen className="w-7 h-7" />
            <span className="hidden sm:inline">前端面试刷题</span>
            <span className="sm:hidden">面试刷题</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path))

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.path === '/review' && totalBookmarked > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {totalBookmarked}
                    </span>
                  )}
                </Link>
              )
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换主题"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
