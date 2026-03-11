import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import { useProgressStore } from "../stores/progressStore";
import questionsData from "../data/questions.json";

function Home() {
  const [categories, setCategories] = useState([]);
  const { getStats } = useProgressStore();
  const stats = getStats();

  useEffect(() => {
    setCategories(questionsData.categories);
  }, []);

  const totalQuestions = categories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0,
  );

  return (
    <div className="animate-fade-in -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
          前端面试刷题神器
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
          精心整理的 100+ 道前端面试题，涵盖
          HTML/CSS、JavaScript、React、Vue、工程化、性能优化、安全等核心知识点
        </p>

        {/* Stats - 移动端2列，桌面端4列 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <StatCard icon={BookOpen} label="总题数" value={totalQuestions} />
          <StatCard
            icon={CheckCircle}
            label="已完成"
            value={stats.totalCompleted}
            color="text-green-600"
          />
          <StatCard
            icon={Bookmark}
            label="已收藏"
            value={stats.totalBookmarked}
            color="text-yellow-600"
          />
          <StatCard
            icon={TrendingUp}
            label="完成率"
            value={`${totalQuestions > 0 ? Math.round((stats.totalCompleted / totalQuestions) * 100) : 0}%`}
            color="text-blue-600"
          />
        </div>

        {/* Quick Actions - 移动端垂直排列 */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
          <Link
            to={`/practice`}
            className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg px-6 py-3"
          >
            <BookOpen className="w-5 h-5" />
            开始刷题
          </Link>
          <Link
            to={`/review`}
            className="btn-secondary flex items-center justify-center gap-2 text-base sm:text-lg px-6 py-3"
          >
            <Bookmark className="w-5 h-5" />
            查看收藏
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8 md:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 px-2 sm:px-0">
          题目分类
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-10 sm:mt-16 py-8 sm:py-12 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
          功能特点
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0">
          <FeatureCard
            title="多端适配"
            description="完美适配 PC 和移动端，随时随地刷题学习"
          />
          <FeatureCard
            title="本地存储"
            description="自动保存学习进度，刷新不丢失"
          />
          <FeatureCard
            title="收藏笔记"
            description="收藏重点题目，添加个人笔记"
          />
          <FeatureCard
            title="分类练习"
            description="按知识点分类，针对性突破"
          />
          <FeatureCard
            title="暗黑模式"
            description="支持亮色/暗色主题，保护眼睛"
          />
          <FeatureCard
            title="开源免费"
            description="开源项目，永久免费使用"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-gray-600" }) {
  return (
    <div className="card p-3 sm:p-4 text-center">
      <Icon className={`w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${color}`} />
      <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default Home;
