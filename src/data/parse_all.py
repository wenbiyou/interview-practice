#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析 READMD.md 文件，提取所有面试题并生成 JSON
"""

import json
import re

# 分类映射
CATEGORIES = {
    "一、HTML/CSS基础": {"id": "html-css", "name": "HTML/CSS基础", "icon": "🎨", "tags": ["HTML", "CSS"]},
    "二、JavaScript 基础": {"id": "javascript", "name": "JavaScript基础", "icon": "💛", "tags": ["JavaScript", "ES6"]},
    "三、前端框架（React/Vue，20题）": {"id": "framework", "name": "前端框架", "icon": "⚛️", "tags": ["React", "Vue"]},
    "React 相关（10题）": {"id": "react", "name": "React框架", "icon": "⚛️", "tags": ["React"]},
    "Vue 相关（10题）": {"id": "vue", "name": "Vue框架", "icon": "💚", "tags": ["Vue"]},
    "四、前端工程化（15题）": {"id": "engineering", "name": "前端工程化", "icon": "🛠️", "tags": ["Webpack", "Vite"]},
    "五、前端性能优化（15题）": {"id": "performance", "name": "性能优化", "icon": "🚀", "tags": ["性能", "缓存"]},
    "六、前端安全（10题）": {"id": "security", "name": "前端安全", "icon": "🔒", "tags": ["安全", "XSS", "CSRF"]},
    "七、跨端开发（8题）": {"id": "cross-platform", "name": "跨端开发", "icon": "📱", "tags": ["跨端", "小程序"]},
    "八、综合能力与项目经验（7题）": {"id": "general", "name": "综合能力", "icon": "💼", "tags": ["项目经验"]},
}

def escape_html(text):
    """转义 HTML 特殊字符"""
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    return text

def escape_json_string(text):
    """转义 JSON 字符串中的特殊字符"""
    # 先处理反斜杠
    text = text.replace('\\', '\\\\')
    # 处理双引号
    text = text.replace('"', '\\"')
    # 处理换行
    text = text.replace('\n', '\\n')
    # 处理回车
    text = text.replace('\r', '\\r')
    # 处理制表符
    text = text.replace('\t', '\\t')
    return text

def parse_markdown_to_html(text):
    """将 Markdown 转换为安全的 HTML"""
    # 转义 HTML 标签
    text = escape_html(text)

    # 转换 Markdown 为 HTML
    # 粗体 **text**
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    # 斜体 *text*
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    # 行内代码 `code`
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)

    return text

def extract_questions(content):
    """提取所有题目"""
    questions_data = []
    current_category = None
    current_question = None
    current_answer = []
    question_id = 0

    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]

        # 检查是否是分类标题
        for cat_title, cat_info in CATEGORIES.items():
            if line.strip().startswith(cat_title):
                current_category = cat_info
                break

        # 检查是否是题目（以数字开头，如 "1. " 或 "1. "）
        question_match = re.match(r'^(\d+)\.\s+(.+)$', line.strip())
        if question_match and current_category:
            # 保存上一个题目
            if current_question and current_answer:
                question_id += 1
                answer_text = '\n'.join(current_answer).strip()
                # 移除 "**回答：**" 前缀
                answer_text = re.sub(r'^\*\*回答：\*\*\s*', '', answer_text)
                answer_html = parse_markdown_to_html(answer_text)

                questions_data.append({
                    "id": question_id,
                    "category": current_category,
                    "title": current_question,
                    "answer": answer_html
                })

            current_question = question_match.group(2).strip()
            current_answer = []

        # 检查是否是 "**回答：**" 行
        elif line.strip() == '**回答：**' and current_question:
            pass  # 跳过这行，不加入答案

        # 收集答案内容（只有在遇到下一个题目之前）
        elif current_question and not re.match(r'^(\d+)\.\s+', line.strip()):
            # 跳过纯分类行
            if not any(line.strip().startswith(cat) for cat in CATEGORIES.keys()):
                current_answer.append(line)

        i += 1

    # 保存最后一个题目
    if current_question and current_answer and current_category:
        question_id += 1
        answer_text = '\n'.join(current_answer).strip()
        answer_text = re.sub(r'^\*\*回答：\*\*\s*', '', answer_text)
        answer_html = parse_markdown_to_html(answer_text)

        questions_data.append({
            "id": question_id,
            "category": current_category,
            "title": current_question,
            "answer": answer_html
        })

    return questions_data

def organize_by_category(questions):
    """按分类组织题目"""
    categories_dict = {}

    for q in questions:
        cat_id = q['category']['id']
        if cat_id not in categories_dict:
            categories_dict[cat_id] = {
                "id": cat_id,
                "name": q['category']['name'],
                "icon": q['category']['icon'],
                "tags": q['category']['tags'],
                "questions": []
            }

        categories_dict[cat_id]['questions'].append({
            "id": q['id'],
            "title": q['title'],
            "answer": q['answer']
        })

    return list(categories_dict.values())

def main():
    # 读取源文件
    with open('/Users/ngz/Desktop/Ai-Project/前端面试100问/READMD.md', 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"源文件长度: {len(content)} 字符")

    # 提取题目
    questions = extract_questions(content)
    print(f"提取到 {len(questions)} 道题目")

    # 按分类组织
    categories = organize_by_category(questions)
    print(f"组织到 {len(categories)} 个分类")

    # 生成 JSON
    output = {
        "categories": categories
    }

    # 验证 JSON
    json_str = json.dumps(output, ensure_ascii=False, indent=2)

    # 写入文件
    output_path = '/Users/ngz/Desktop/Ai-Project/前端面试100问/interview-practice/src/data/questions.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(json_str)

    print(f"✅ JSON 文件已保存到: {output_path}")

    # 验证 JSON 是否可解析
    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        total = sum(len(c['questions']) for c in data['categories'])
        print(f"✅ JSON 验证成功！共 {total} 道题目")

        # 打印分类统计
        for cat in data['categories']:
            print(f"  - {cat['name']}: {len(cat['questions'])} 题")
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析错误: {e}")

if __name__ == '__main__':
    main()
