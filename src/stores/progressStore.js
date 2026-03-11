import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set, get) => ({
      // 已完成的题目ID列表
      completedQuestions: [],
      // 收藏的题目ID列表
      bookmarkedQuestions: [],
      // 答题笔记
      notes: {},
      // 当前学习进度
      currentProgress: {},

      // 标记完成
      markComplete: (questionId) =>
        set((state) => ({
          completedQuestions: [...new Set([...state.completedQuestions, questionId])],
        })),

      // 取消完成
      unmarkComplete: (questionId) =>
        set((state) => ({
          completedQuestions: state.completedQuestions.filter((id) => id !== questionId),
        })),

      // 切换收藏
      toggleBookmark: (questionId) =>
        set((state) => {
          const isBookmarked = state.bookmarkedQuestions.includes(questionId)
          return {
            bookmarkedQuestions: isBookmarked
              ? state.bookmarkedQuestions.filter((id) => id !== questionId)
              : [...state.bookmarkedQuestions, questionId],
          }
        }),

      // 添加笔记
      addNote: (questionId, note) =>
        set((state) => ({
          notes: { ...state.notes, [questionId]: note },
        })),

      // 删除笔记
      deleteNote: (questionId) =>
        set((state) => {
          const newNotes = { ...state.notes }
          delete newNotes[questionId]
          return { notes: newNotes }
        }),

      // 更新进度
      updateProgress: (categoryId, questionIndex) =>
        set((state) => ({
          currentProgress: {
            ...state.currentProgress,
            [categoryId]: questionIndex,
          },
        })),

      // 获取统计
      getStats: () => {
        const state = get()
        return {
          totalCompleted: state.completedQuestions.length,
          totalBookmarked: state.bookmarkedQuestions.length,
          totalNotes: Object.keys(state.notes).length,
        }
      },

      // 清空所有数据
      clearAll: () =>
        set({
          completedQuestions: [],
          bookmarkedQuestions: [],
          notes: {},
          currentProgress: {},
        }),
    }),
    {
      name: 'interview-progress',
    }
  )
)
