import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useThemeStore } from "./stores/themeStore";
import Header from "./components/Header";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Review from "./pages/Review";
import "./App.css";

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice/:categoryId?" element={<Practice />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>前端面试刷题 © 2024 | 祝你拿到心仪Offer 🎉</p>
      </footer>
    </div>
  );
}

export default App;
