import { useState, useMemo } from "react";
import { Bookmark, Check, Trash2, X } from "lucide-react";
import { marked } from "marked";
import { useProgressStore } from "../stores/progressStore";
import questionsData from "../data/questions.json";

marked.setOptions({
  breaks: true,
  gfm: true,
});

function Review() {
  const [activeTab, setActiveTab] = useState("bookmarked"); // 'bookmarked' | 'completed'
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const renderedAnswer = useMemo(() => {
    if (!selectedQuestion?.answer) return "";
    return marked.parse(selectedQuestion.answer);
  }, [selectedQuestion?.answer]);

  const {
    completedQuestions,
    bookmarkedQuestions,
    unmarkComplete,
    toggleBookmark,
    clearAll,
  } = useProgressStore();

  // 获取所有题目
  const allQuestions = useMemo(() => {
    return questionsData.categories.flatMap((cat) =>
      cat.questions.map((q) => ({
        ...q,
        categoryName: cat.name,
        categoryId: cat.id,
      })),
    );
  }, []);

  // 筛选题目
  const filteredQuestions = useMemo(() => {
    const ids =
      activeTab === "bookmarked" ? bookmarkedQuestions : completedQuestions;
    return allQuestions.filter((q) => ids.includes(q.id));
  }, [activeTab, bookmarkedQuestions, completedQuestions, allQuestions]);

  // 清除所有数据
  const handleClearAll = () => {
    if (confirm("确定要清除所有学习记录吗？此操作不可恢复。")) {
      clearAll();
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          复习中心
        </h1>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          清空记录
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("bookmarked")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "bookmarked"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          已收藏 ({bookmarkedQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <Check className="w-4 h-4" />
          已完成 ({completedQuestions.length})
        </button>
      </div>

      {/* Question List */}
      {filteredQuestions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {activeTab === "bookmarked" ? "还没有收藏题目" : "还没有完成题目"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === "bookmarked"
              ? "在刷题时点击收藏按钮，将重要题目添加到这里"
              : "开始刷题，完成后题目会显示在这里"}
          </p>
          <a href="#/practice" className="inline-block mt-4 btn-primary">
            去刷题
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="w-full sm:flex-1">
                  {/* 标题行：分类标签 + 操作按钮（移动端） */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
                      {question.categoryName}
                    </span>
                    {/* 移动端操作按钮 */}
                    <div className="flex items-center gap-1 sm:hidden">
                      <button
                        onClick={() => toggleBookmark(question.id)}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="取消收藏"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      {activeTab === "completed" && (
                        <button
                          onClick={() => unmarkComplete(question.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="取消完成标记"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {question.title}
                  </h3>
                  <button
                    onClick={() =>
                      setSelectedQuestion(
                        selectedQuestion?.id === question.id ? null : question,
                      )
                    }
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {selectedQuestion?.id === question.id
                      ? "收起答案"
                      : "查看答案"}
                  </button>

                  {/* Answer Panel - 移动端占满宽度 */}
                  {selectedQuestion?.id === question.id && (
                    <div
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg question-content prose prose-blue max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: renderedAnswer }}
                    />
                  )}
                </div>

                {/* 桌面端操作按钮 - 移动端隐藏 */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(question.id)}
                    className="p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                    title="取消收藏"
                  >
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>
                  {activeTab === "completed" && (
                    <button
                      onClick={() => unmarkComplete(question.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="取消完成标记"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Review;
