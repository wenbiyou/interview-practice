import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(__dirname, "../题目和答案.md");
const jsonPath = path.join(__dirname, "../src/data/questions.json");

const mdContent = fs.readFileSync(mdPath, "utf-8");

function parseMarkdownQuestions(content) {
  const questions = [];
  const lines = content.split("\n");

  let currentQuestion = null;
  let answerBuffer = [];
  let inAnswer = false;
  let questionCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 匹配题目行：数字. 题目内容
    const questionMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);

    if (questionMatch && !trimmedLine.includes("**回答：**")) {
      // 关键判断：真正的题目后面必须跟着"**回答：**"（可能中间有空行）
      let foundAnswer = false;
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].trim() === "**回答：**") {
          foundAnswer = true;
          break;
        }
        // 如果遇到非空行且不是"**回答：**"，则不是题目
        if (lines[j].trim() !== "" && lines[j].trim() !== "**回答：**") {
          break;
        }
      }

      if (foundAnswer) {
        // 保存上一题的答案
        if (currentQuestion && answerBuffer.length > 0) {
          currentQuestion.answer = answerBuffer.join("\n").trim();
          questions.push(currentQuestion);
        }

        // 开始新题目
        questionCounter++;
        currentQuestion = {
          id: questionCounter,
          originalId: parseInt(questionMatch[1]),
          title: questionMatch[2].trim(),
          answer: "",
        };
        answerBuffer = [];
        inAnswer = false;
        continue;
      }
    }

    // 检测答案开始标记
    if (trimmedLine === "**回答：**") {
      inAnswer = true;
      continue;
    }

    // 收集答案内容
    if (inAnswer && currentQuestion) {
      answerBuffer.push(line);
    }
  }

  // 保存最后一题
  if (currentQuestion && answerBuffer.length > 0) {
    currentQuestion.answer = answerBuffer.join("\n").trim();
    questions.push(currentQuestion);
  }

  return questions;
}

const mdQuestions = parseMarkdownQuestions(mdContent);

console.log(`从 Markdown 解析出 ${mdQuestions.length} 道题目`);

// 打印前10题信息
mdQuestions.slice(0, 10).forEach((q) => {
  console.log(
    `题目 ${q.id}(原${q.originalId}): "${q.title.substring(0, 35)}..." - 答案: ${q.answer.length} 字符`,
  );
});

const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// 收集所有 JSON 题目
const allJsonQuestions = [];
jsonData.categories.forEach((category) => {
  category.questions.forEach((q) => {
    allJsonQuestions.push(q);
  });
});

console.log(`\nJSON 中共有 ${allJsonQuestions.length} 道题目`);

let updatedCount = 0;

// 按顺序匹配题目
mdQuestions.forEach((mdQ, index) => {
  const jsonQ = allJsonQuestions[index];
  if (jsonQ && mdQ.answer.length > 0) {
    // 总是更新，确保答案完整
    if (mdQ.answer.length !== jsonQ.answer.length) {
      jsonQ.answer = mdQ.answer;
      updatedCount++;
      console.log(
        `更新题目 ${index + 1}: ${jsonQ.title.substring(0, 30)}... (${mdQ.answer.length}字符)`,
      );
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");

console.log(`\n已更新 ${updatedCount} 道题目的答案`);
console.log("转换完成！");
