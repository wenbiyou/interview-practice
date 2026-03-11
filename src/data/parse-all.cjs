#!/usr/bin/env node
/**
 * 解析 READMD.md 文件，提取所有面试题并生成 JSON
 */

const fs = require('fs');
const path = require('path');

// 分类映射
const CATEGORIES = {
  '一、HTML/CSS基础': { id: 'html-css', name: 'HTML/CSS基础', icon: '🎨', tags: ['HTML', 'CSS'] },
  '二、JavaScript 基础': { id: 'javascript', name: 'JavaScript基础', icon: '💛', tags: ['JavaScript', 'ES6'] },
  '三、前端框架（React/Vue，20题）': { id: 'framework', name: '前端框架', icon: '⚛️', tags: ['React', 'Vue'] },
  'React 相关（10题）': { id: 'react', name: 'React框架', icon: '⚛️', tags: ['React', 'Hooks'] },
  'Vue 相关（10题）': { id: 'vue', name: 'Vue框架', icon: '💚', tags: ['Vue', 'Vue3'] },
  '四、前端工程化（15题）': { id: 'engineering', name: '前端工程化', icon: '🛠️', tags: ['Webpack', 'Vite', 'CI/CD'] },
  '五、前端性能优化（15题）': { id: 'performance', name: '性能优化', icon: '🚀', tags: ['性能', '缓存', '优化'] },
  '六、前端安全（10题）': { id: 'security', name: '前端安全', icon: '🔒', tags: ['安全', 'XSS', 'CSRF'] },
  '七、跨端开发（8题）': { id: 'cross-platform', name: '跨端开发', icon: '📱', tags: ['跨端', '小程序', 'PWA'] },
  '八、综合能力与项目经验（7题）': { id: 'general', name: '综合能力', icon: '💼', tags: ['项目经验', '架构'] },
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function mdToHtml(text) {
  let html = escapeHtml(text);

  // 转换 Markdown 为 HTML
  // 粗体 **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 斜体 *text* (但不是代码块中的)
  html = html.replace(/(?<!`)\*(?!\*)(.+?)\*(?!`)/g, '<em>$1</em>');
  // 行内代码 `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 处理表格 (简单处理)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
    return `<tr>${cells}</tr>`;
  });

  // 处理列表
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // 处理代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

  // 处理标题
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // 处理段落 (简单包裹)
  const lines = html.split('\n');
  const result = [];
  let inList = false;
  let listItems = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('<li>')) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(trimmed);
    } else {
      if (inList) {
        result.push('<ul>' + listItems.join('') + '</ul>');
        inList = false;
        listItems = [];
      }

      if (trimmed && !trimmed.startsWith('<')) {
        result.push('<p>' + trimmed + '</p>');
      } else if (trimmed) {
        result.push(trimmed);
      }
    }
  }

  if (inList) {
    result.push('<ul>' + listItems.join('') + '</ul>');
  }

  return result.join('\n');
}

function parseQuestions(content) {
  const lines = content.split('\n');
  const questions = [];

  let currentCategory = null;
  let currentQuestion = null;
  let currentAnswer = [];
  let inAnswer = false;
  let questionId = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 检查是否是分类标题
    for (const [catTitle, catInfo] of Object.entries(CATEGORIES)) {
      if (trimmed.startsWith(catTitle)) {
        // 保存上一个题目的答案
        if (currentQuestion && currentAnswer.length > 0 && currentCategory) {
          questionId++;
          const answerText = currentAnswer.join('\n').trim();
          const answerHtml = mdToHtml(answerText);

          questions.push({
            id: questionId,
            category: currentCategory,
            title: currentQuestion,
            answer: answerHtml
          });
        }

        currentCategory = catInfo;
        currentQuestion = null;
        currentAnswer = [];
        inAnswer = false;
        break;
      }
    }

    // 检查是否是题目（以数字开头，如 "1. "）
    const questionMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (questionMatch && currentCategory) {
      // 跳过子分类行（如 "React 相关（10题）"）
      const qText = questionMatch[2];
      const isSubCategory = Object.keys(CATEGORIES).some(cat =>
        qText.includes(cat.replace(/[（(].*?[)）]/g, '').trim())
      );

      if (!isSubCategory && !qText.includes('题）')) {
        // 保存上一个题目
        if (currentQuestion && currentAnswer.length > 0) {
          questionId++;
          const answerText = currentAnswer.join('\n').trim();
          const answerHtml = mdToHtml(answerText);

          questions.push({
            id: questionId,
            category: currentCategory,
            title: currentQuestion,
            answer: answerHtml
          });
        }

        currentQuestion = qText;
        currentAnswer = [];
        inAnswer = false;
      }
    }

    // 检查是否是 "**回答：**" 行
    if (trimmed === '**回答：**' && currentQuestion) {
      inAnswer = true;
      continue;
    }

    // 收集答案内容
    if (inAnswer && currentQuestion) {
      // 检查是否是下一个题目
      if (/^\d+\.\s+/.test(trimmed) && !trimmed.includes('题）')) {
        // 可能是下一个题目，先保存当前答案
        questionId++;
        const answerText = currentAnswer.join('\n').trim();
        const answerHtml = mdToHtml(answerText);

        questions.push({
          id: questionId,
          category: currentCategory,
          title: currentQuestion,
          answer: answerHtml
        });

        // 开始新题目
        const questionMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (questionMatch) {
          currentQuestion = questionMatch[2];
          currentAnswer = [];
        }
      } else {
        currentAnswer.push(line);
      }
    }
  }

  // 保存最后一个题目
  if (currentQuestion && currentAnswer.length > 0 && currentCategory) {
    questionId++;
    const answerText = currentAnswer.join('\n').trim();
    const answerHtml = mdToHtml(answerText);

    questions.push({
      id: questionId,
      category: currentCategory,
      title: currentQuestion,
      answer: answerHtml
    });
  }

  return questions;
}

function organizeByCategory(questions) {
  const categoriesDict = {};

  for (const q of questions) {
    const catId = q.category.id;
    if (!categoriesDict[catId]) {
      categoriesDict[catId] = {
        id: catId,
        name: q.category.name,
        icon: q.category.icon,
        tags: q.category.tags,
        questions: []
      };
    }

    categoriesDict[catId].questions.push({
      id: q.id,
      title: q.title,
      answer: q.answer
    });
  }

  return Object.values(categoriesDict);
}

function main() {
  const inputPath = '/Users/ngz/Desktop/Ai-Project/前端面试100问/READMD.md';
  const outputPath = '/Users/ngz/Desktop/Ai-Project/前端面试100问/interview-practice/src/data/questions.json';

  console.log('📖 读取源文件...');
  const content = fs.readFileSync(inputPath, 'utf-8');
  console.log(`   文件大小: ${(content.length / 1024).toFixed(2)} KB`);

  console.log('🔍 提取题目...');
  const questions = parseQuestions(content);
  console.log(`   提取到 ${questions.length} 道题目`);

  console.log('📂 按分类组织...');
  const categories = organizeByCategory(questions);
  console.log(`   组织到 ${categories.length} 个分类`);

  const output = { categories };

  console.log('💾 写入 JSON 文件...');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`   已保存: ${outputPath}`);

  // 验证 JSON
  console.log('✅ 验证 JSON...');
  const data = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  const total = data.categories.reduce((sum, c) => sum + c.questions.length, 0);
  console.log(`\n📊 统计结果:`);
  console.log(`   总题数: ${total}`);
  for (const cat of data.categories) {
    console.log(`   - ${cat.name}: ${cat.questions.length} 题`);
  }

  if (total === 100) {
    console.log('\n🎉 成功提取全部 100 道题目！');
  } else {
    console.log(`\n⚠️  警告: 预期 100 题，实际提取 ${total} 题`);
  }
}

main();
