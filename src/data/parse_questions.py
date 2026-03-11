#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re

def escape_json_string(s):
    """转义 JSON 字符串中的特殊字符"""
    # 替换 HTML 标签
    s = s.replace('<', '&lt;')
    s = s.replace('>', '&gt;')
    return s

def parse_markdown():
    """解析 Markdown 文件并提取面试题"""

    # 定义所有分类
    categories = [
        {
            "id": "html-css",
            "name": "HTML/CSS基础",
            "icon": "🎨",
            "tags": ["HTML", "CSS"],
            "questions": [
                {
                    "id": 1,
                    "title": "HTML5 的新特性有哪些？",
                    "answer": """HTML5 引入了许多新特性，主要包括以下几个方面：

**1. 语义化标签**
- &lt;header&gt;：页面或区块的头部
- &lt;nav&gt;：导航链接区域
- &lt;article&gt;：独立的内容块
- &lt;section&gt;：文档中的节或区块
- &lt;aside&gt;：侧边栏内容
- &lt;footer&gt;：页面或区块的底部
- &lt;main&gt;：文档主要内容

**2. 多媒体支持**
- &lt;video&gt;：视频播放
- &lt;audio&gt;：音频播放
- &lt;canvas&gt;：画布，用于绘制图形
- &lt;svg&gt;：矢量图形

**3. 表单增强**
- 新的输入类型：type="email"、type="url"、type="date"、type="number"、type="range"、type="color" 等
- 新的表单属性：placeholder、required、pattern、autofocus、autocomplete 等
- 新的表单元素：&lt;datalist&gt;、&lt;output&gt;、&lt;progress&gt;、&lt;meter&gt;

**4. 存储功能**
- localStorage：持久化本地存储
- sessionStorage：会话级存储
- IndexedDB：客户端数据库

**5. 其他重要特性**
- WebSocket：全双工通信
- Geolocation API：地理位置
- Web Workers：后台脚本
- History API：历史记录操作
- Drag and Drop：拖放 API
- File API：文件操作"""
                },
                {
                    "id": 2,
                    "title": "CSS3 的新特性有哪些？",
                    "answer": """CSS3 带来了大量强大的新特性：

**1. 选择器增强**
- 属性选择器：[attr^=value]、[attr$=value]、[attr*=value]
- 伪类选择器：:nth-child()、:nth-of-type()、:last-child、:first-of-type、:not()、:target
- 伪元素：::before、::after、::first-letter、::first-line、::selection

**2. 盒模型与布局**
- box-sizing：控制盒模型计算方式
- border-radius：圆角边框
- box-shadow：盒子阴影
- text-shadow：文字阴影
- Flexbox 弹性布局
- Grid 网格布局
- 多列布局：column-count、column-gap

**3. 背景与边框**
- background-size：背景尺寸控制
- background-origin：背景定位区域
- background-clip：背景裁剪区域
- 多重背景
- border-image：边框图片
- 渐变背景：linear-gradient()、radial-gradient()

**4. 变形与动画**
- transform：2D/3D 变形（translate、rotate、scale、skew）
- transition：过渡动画
- @keyframes 和 animation：关键帧动画
- perspective：透视效果

**5. 其他特性**
- @media 媒体查询，实现响应式设计
- @font-face 自定义字体
- opacity 透明度
- rgba() 和 hsla() 颜色模式
- calc() 计算函数
- CSS 变量（自定义属性）：--variable 和 var()
- object-fit 和 object-position
- filter 滤镜效果"""
                },
                {
                    "id": 3,
                    "title": "什么是盒模型？标准盒模型和 IE 盒模型的区别是什么？",
                    "answer": """**盒模型（Box Model）**是 CSS 中描述元素占用空间的基础概念。每个 HTML 元素都可以看作一个盒子，由内容区、内边距、边框和外边距组成。

**盒模型的组成部分：**

```
┌─────────────────────────────┐
│          Margin（外边距）     │
│   ┌─────────────────────┐   │
│   │    Border（边框）    │   │
│   │   ┌─────────────┐   │   │
│   │   │  Padding    │   │   │
│   │   │ （内边距）   │   │   │
│   │   │   ┌─────┐   │   │   │
│   │   │   │Content│   │   │   │
│   │   │   │（内容）│   │   │   │
│   │   │   └─────┘   │   │   │
│   │   └─────────────┘   │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

**两种盒模型的区别：**

| 特性 | 标准盒模型（W3C） | IE 盒模型（怪异模式） |
|------|------------------|---------------------|
| width/height 计算 | 仅包含 content | 包含 content + padding + border |
| 总宽度计算 | width + padding + border + margin | width + margin |
| 设置方式 | box-sizing: content-box | box-sizing: border-box |

**代码示例：**

```css
/* 标准盒模型（默认） */
.standard {
  box-sizing: content-box;
  width: 300px;
  padding: 20px;
  border: 10px solid black;
  /* 实际占用宽度：300 + 20*2 + 10*2 = 360px */
  /* content 宽度：300px */
}

/* IE 盒模型（推荐） */
.ie-box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 10px solid black;
  /* 实际占用宽度：300px */
  /* content 宽度：300 - 20*2 - 10*2 = 240px */
}
```

**最佳实践：**

通常在项目根元素统一设置 box-sizing: border-box：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```"""
                },
                {
                    "id": 4,
                    "title": "如何实现水平垂直居中？",
                    "answer": """水平垂直居中是最常见的 CSS 布局需求，有多种实现方式：

**1. Flexbox 布局（推荐）**

```css
/* 父元素设置 */
.parent {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
}
```

**2. Grid 布局**

```css
.parent {
  display: grid;
  place-items: center;  /* 水平和垂直居中 */
}
```

**3. 绝对定位 + Transform（适用于已知或未知宽高）**

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**4. 绝对定位 + Margin Auto**

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}
```

**5. 绝对定位 + 负 Margin（需要知道子元素宽高）**

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 100px;
  margin-top: -50px;
  margin-left: -100px;
}
```

**选择建议：**
- 现代浏览器优先使用 **Flexbox** 或 **Grid**
- 需要兼容旧浏览器使用 **绝对定位 + Transform**
- 单行文本使用 **line-height**"""
                },
                {
                    "id": 5,
                    "title": "Flex 布局的核心概念是什么？常用属性有哪些？",
                    "answer": """Flexbox（弹性盒子布局）是一种一维布局模型，用于在容器内分配空间和对齐项目。

**核心概念：**

- **主轴（Main Axis）**：Flex 项目的排列方向，默认为水平方向
- **交叉轴（Cross Axis）**：垂直于主轴的方向

**容器属性（设置在父元素）：**

| 属性 | 说明 | 常用值 |
|------|------|--------|
| display | 开启 Flex 布局 | flex、inline-flex |
| flex-direction | 主轴方向 | row（默认）、row-reverse、column、column-reverse |
| flex-wrap | 是否换行 | nowrap（默认）、wrap、wrap-reverse |
| justify-content | 主轴对齐方式 | flex-start、center、flex-end、space-between、space-around、space-evenly |
| align-items | 交叉轴对齐方式 | stretch（默认）、flex-start、center、flex-end、baseline |
| gap | 项目之间的间距 | 10px、1rem |

**项目属性（设置在子元素）：**

| 属性 | 说明 | 常用值 |
|------|------|--------|
| order | 排列顺序 | 整数，默认 0 |
| flex-grow | 放大比例 | 数字，默认 0（不放大） |
| flex-shrink | 缩小比例 | 数字，默认 1（可缩小） |
| flex-basis | 基础大小 | auto、200px、30% |
| flex | grow + shrink + basis 简写 | 0 1 auto（默认）、1、0 0 200px |
| align-self | 单独对齐方式 | auto、flex-start、center、flex-end、stretch |

**常用布局示例：**

```css
/* 水平垂直居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 两端对齐 */
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 等分布局 */
.equal {
  display: flex;
}
.equal > * {
  flex: 1;
}

/* 左侧固定，右侧自适应 */
.layout {
  display: flex;
}
.layout .sidebar {
  width: 200px;
  flex-shrink: 0;
}
.layout .main {
  flex: 1;
}
```"""
                },
                {
                    "id": 6,
                    "title": "Grid 布局的核心概念是什么？和 Flex 布局的区别是什么？",
                    "answer": """CSS Grid 布局是一个二维布局系统，可以同时处理行和列，适合复杂的页面布局。

**核心概念：**

- Grid Container（容器）
- Grid Line（网格线）
- Grid Track（轨道 - 行/列）
- Grid Cell（单元格）
- Grid Area（区域）
- Grid Item（项目）

**容器属性：**

| 属性 | 说明 | 示例 |
|------|------|------|
| display | 开启 Grid | grid、inline-grid |
| grid-template-columns | 定义列 | 200px 1fr 2fr、repeat(3, 1fr) |
| grid-template-rows | 定义行 | 100px auto 100px |
| grid-template-areas | 定义区域 | "header header" "sidebar main" |
| gap | 间距 | 20px、1rem |
| justify-items | 单元格内水平对齐 | stretch、start、center、end |
| align-items | 单元格内垂直对齐 | stretch、start、center、end |

**项目属性：**

| 属性 | 说明 | 示例 |
|------|------|------|
| grid-column-start/end | 跨列 | grid-column: 1 / 3 |
| grid-row-start/end | 跨行 | grid-row: 1 / span 2 |
| grid-area | 区域名或位置 | header、1 / 1 / 2 / 3 |

**经典布局示例：**

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header header header"
    "sidebar main ads"
    "footer footer footer";
  gap: 20px;
  min-height: 100vh;
}
```

**Grid vs Flex 对比：**

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维（行或列） | 二维（行和列同时） |
| 适用场景 | 组件内部布局、导航栏 | 整体页面布局、复杂网格 |
| 内容驱动 | 是（基于内容大小） | 否（基于网格轨道） |

**使用建议：**
- **Flexbox**：用于组件内部的一维布局
- **Grid**：用于页面的二维整体布局
- **两者结合**：Grid 做整体框架，Flexbox 做内部细节"""
                },
                {
                    "id": 7,
                    "title": "BFC（块级格式化上下文）是什么？如何创建 BFC？有什么作用？",
                    "answer": """**BFC（Block Formatting Context，块级格式化上下文）**是 Web 页面中一块独立的渲染区域，内部元素的布局不会影响外部元素，反之亦然。

**创建 BFC 的方式：**

| 属性/值 | 说明 |
|---------|------|
| float: left/right | 浮动元素 |
| position: absolute/fixed | 绝对定位元素 |
| display: inline-block | 行内块元素 |
| overflow: hidden/auto/scroll | 非 visible 的 overflow（最常用） |
| display: flow-root | 现代推荐方式 |

**BFC 的作用：**

**1. 清除浮动（最常用）**

```css
/* 父元素创建 BFC，包含浮动子元素 */
.parent {
  overflow: hidden;  /* 创建 BFC */
}

.child {
  float: left;
}
```

**2. 防止外边距重叠**

```css
/* 正常情况下，两个相邻块级元素的外边距会重叠 */
.box1 { margin-bottom: 20px; }
.box2 { margin-top: 30px; }
/* 实际间距是 30px，不是 50px */

/* 将其中一个放入 BFC，防止重叠 */
.bfc-container {
  overflow: hidden;
}
```

**3. 阻止元素被浮动元素覆盖**

```css
.float {
  float: left;
}

.bfc {
  overflow: hidden;  /* 创建 BFC，不会环绕浮动元素 */
}
```

**现代替代方案：**

现在更多使用 display: flow-root 来创建 BFC，语义更清晰：

```css
.container {
  display: flow-root;  /* 创建 BFC，无副作用 */
}
```"""
                },
                {
                    "id": 8,
                    "title": "响应式设计的实现方式有哪些？",
                    "answer": """响应式设计是指网页能够自适应不同设备屏幕尺寸的布局方式。

**1. 媒体查询（Media Queries）**

```css
/* 移动优先 */
.container {
  width: 100%;
  padding: 0 15px;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
```

**常用断点：**

| 设备 | 断点 |
|------|------|
| 手机 | < 576px |
| 大屏手机/小平板 | >= 576px |
| 平板 | >= 768px |
| 桌面 | >= 992px |
| 大屏桌面 | >= 1200px |

**2. 相对单位**

```css
/* 百分比 */
.container {
  width: 100%;
  max-width: 1200px;
}

/* rem - 相对于根元素字体大小 */
html { font-size: 16px; }
.element { width: 10rem; }  /* 160px */

/* vw/vh - 视口百分比 */
.hero {
  width: 100vw;
  height: 100vh;
}
```

**3. Flexbox 弹性布局**

```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.flex-item {
  flex: 1 1 300px;
}
```

**4. Grid 网格布局**

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

**5. 视口设置**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**属性说明：**
- width=device-width：宽度等于设备宽度
- initial-scale=1.0：初始缩放比例"""
                },
                {
                    "id": 9,
                    "title": "CSS 选择器的优先级是如何计算的？",
                    "answer": """CSS 选择器优先级（Specificity）决定了当多个规则应用于同一元素时，哪个规则生效。

**优先级计算规则：**

优先级由四个部分组成：a-b-c-d

| 类型 | 权重 | 说明 |
|------|------|------|
| a（行内样式） | 1000 | style="..." 属性 |
| b（ID 选择器） | 100 | #id |
| c（类/属性/伪类） | 10 | .class、[attr]、:hover |
| d（元素/伪元素） | 1 | div、::before |

**示例计算：**

| 选择器 | 计算 | 优先级 |
|--------|------|--------|
| * { } | 0-0-0-0 | 0 |
| div { } | 0-0-0-1 | 1 |
| .class { } | 0-0-1-0 | 10 |
| #id { } | 0-1-0-0 | 100 |
| div.class { } | 0-0-1-1 | 11 |
| #id .class { } | 0-1-1-0 | 110 |
| style="color: red" | 1-0-0-0 | 1000 |

**重要规则：**

**1. !important**

```css
.element {
  color: red !important;  /* 最高优先级，慎用 */
}
```

**2. 相同优先级时，后写的生效**

```css
.box { color: red; }
.box { color: blue; }  /* 蓝色生效 */
```

**3. 继承的样式优先级最低**

**最佳实践：**

1. **避免使用 !important**
2. **避免过度嵌套**（如 .a .b .c .d）
3. **使用合理的类名**，而非依赖元素选择器
4. **优先使用类选择器**，而非 ID 选择器"""
                },
                {
                    "id": 10,
                    "title": "CSS 中隐藏元素的方式有哪些？区别是什么？",
                    "answer": """CSS 中隐藏元素有多种方式，每种方式的隐藏效果和性能影响不同：

| 方式 | 是否占位 | 是否可交互 | 是否可聚焦 | 适用场景 |
|------|---------|-----------|-----------|---------|
| display: none | 否 | 否 | 否 | 完全移除 |
| visibility: hidden | 是 | 否 | 否 | 占位隐藏 |
| opacity: 0 | 是 | 是（可点击） | 是 | 透明/动画 |
| position: absolute; left: -9999px | 否 | 否 | 否 | 屏幕外 |

**1. display: none**

```css
.element {
  display: none;
}
```

- 元素完全从文档流中移除
- 不占用空间
- 无法交互、无法聚焦
- 触发重排（Reflow），性能开销较大

**2. visibility: hidden**

```css
.element {
  visibility: hidden;
}
```

- 元素不可见，但保留占位
- 无法交互、无法聚焦
- 只触发重绘（Repaint），性能较好
- 子元素可以单独设置为 visible

**3. opacity: 0**

```css
.element {
  opacity: 0;
}
```

- 元素完全透明
- 保留占位
- 仍然可以交互（点击、聚焦）
- 可以配合 pointer-events: none 禁用交互
- 适合用于淡入淡出动画

**可访问性考虑：**

```css
/* 视觉隐藏但保留屏幕阅读器访问 */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```"""
                }
            ]
        },
        {
            "id": "javascript",
            "name": "JavaScript基础",
            "icon": "⚡",
            "tags": ["JavaScript", "ES6+"],
            "questions": [
                {
                    "id": 11,
                    "title": "JavaScript 的数据类型有哪些？如何判断数据类型？",
                    "answer": """**JavaScript 有 8 种数据类型：**

**基本数据类型（7 种）：**

| 类型 | 说明 | 示例 |
|------|------|------|
| string | 字符串 | 'hello'、"world" |
| number | 数字（整数和浮点数） | 42、3.14 |
| bigint | 大整数（ES2020） | 9007199254740991n |
| boolean | 布尔值 | true、false |
| undefined | 未定义 | undefined |
| null | 空值 | null |
| symbol | 唯一标识符（ES6） | Symbol('desc') |

**引用数据类型（1 种）：**

| 类型 | 说明 | 示例 |
|------|------|------|
| object | 对象（包括数组、函数、日期等） | {}、[]、function(){} |

**判断数据类型的方法：**

**1. typeof 运算符**

```javascript
typeof 'hello';      // "string"
typeof 42;           // "number"
typeof true;         // "boolean"
typeof undefined;    // "undefined"
typeof Symbol();     // "symbol"
typeof 123n;         // "bigint"
typeof {};           // "object"
typeof [];           // "object"（数组也是对象）
typeof function(){}; // "function"
typeof null;         // "object"（历史遗留 bug）
```

**2. instanceof 运算符**

```javascript
[] instanceof Array;           // true
{} instanceof Object;          // true
new Date() instanceof Date;    // true
```

**3. Object.prototype.toString.call()（最准确）**

```javascript
Object.prototype.toString.call('hello');     // "[object String]"
Object.prototype.toString.call([]);          // "[object Array]"
Object.prototype.toString.call(null);        // "[object Null]"

// 封装成工具函数
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
```

**4. Array.isArray() 判断数组**

```javascript
Array.isArray([]);     // true
Array.isArray({});     // false
```

**类型判断总结：**

| 场景 | 推荐方法 |
|------|---------|
| 判断基本类型 | typeof |
| 判断数组 | Array.isArray() |
| 判断对象类型 | instanceof |
| 精确判断所有类型 | Object.prototype.toString.call() |"""
                },
                {
                    "id": 12,
                    "title": "`==` 和 `===` 的区别是什么？",
                    "answer": """`==` 和 `===` 都是用于比较两个值的运算符，但它们在比较时的行为有本质区别。

**核心区别：**

| 运算符 | 名称 | 比较方式 | 类型不同时 |
|--------|------|---------|-----------|
| == | 相等运算符 | 宽松相等 | 先类型转换，再比较值 |
| === | 严格相等运算符 | 严格相等 | 直接返回 false |

**== 的类型转换规则：**

1. **null 和 undefined**
   ```javascript
   null == undefined;  // true（特殊情况）
   ```

2. **数字和字符串**
   ```javascript
   42 == '42';         // true（字符串转数字）
   ```

3. **布尔值和其他类型**
   ```javascript
   true == 1;          // true（布尔转数字：true→1, false→0）
   false == 0;         // true
   ```

**常见 == 的"坑"：**

```javascript
0 == '0';           // true
0 == '';            // true
0 == false;         // true
'' == false;        // true

NaN == NaN;         // false（NaN 不等于任何值，包括自己）
[] == false;        // true（[] 转数字为 0）
```

**=== 的比较规则：**

```javascript
42 === '42';        // false（类型不同）
42 === 42;          // true
{} === {};          // false（不同引用）
NaN === NaN;        // false
```

**最佳实践：**

**始终使用 === 和 !==**，避免隐式类型转换带来的意外行为：

```javascript
// 推荐
if (count === 0) { }
if (name !== '') { }
if (obj === null) { }
```

**例外情况：**

```javascript
// 判断 null 或 undefined 时，可以用 ==
if (value == null) {
  // 等价于 value === null || value === undefined
}
```"""
                },
                {
                    "id": 13,
                    "title": "什么是闭包？闭包的作用和优缺点是什么？",
                    "answer": """**闭包（Closure）**是指有权访问另一个函数作用域中变量的函数。简单来说，当一个函数返回另一个函数，并且返回的函数使用了外部函数的变量时，就形成了闭包。

**闭包的形成条件：**

1. 函数嵌套
2. 内部函数引用了外部函数的变量
3. 外部函数被调用（执行环境创建）

**代码示例：**

```javascript
function outer() {
  let count = 0;  // 外部函数的变量

  function inner() {
    count++;      // 内部函数引用外部变量
    console.log(count);
  }

  return inner;   // 返回内部函数
}

const counter = outer();
counter();  // 1
counter();  // 2
counter();  // 3
```

**闭包的作用：**

**1. 数据封装和私有变量**

```javascript
function createPerson(name) {
  let age = 0;  // 私有变量

  return {
    getName: () => name,
    getAge: () => age,
    grow: () => { age++; }
  };
}

const person = createPerson('Tom');
console.log(person.getAge());   // 0
person.grow();
console.log(person.getAge());   // 1
// 无法直接访问 age
```

**2. 函数工厂/柯里化**

```javascript
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2);
console.log(double(5));  // 10
```

**3. 防抖和节流**

```javascript
function debounce(fn, delay) {
  let timer = null;  // 闭包保存 timer

  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**闭包的优点：**

1. **数据封装**：创建私有变量和方法
2. **状态保持**：函数执行后保持状态
3. **模块化**：实现模块化编程
4. **函数式编程**：支持柯里化、偏函数等

**闭包的缺点：**

**1. 内存泄漏风险**

```javascript
function heavyClosure() {
  const largeData = new Array(1000000).fill('x');

  return function() {
    console.log(largeData[0]);
  };
}

const leak = heavyClosure();
// largeData 会一直占用内存，直到 leak 被释放
```

**2. 性能影响**
- 闭包会占用更多内存
- 访问闭包变量比访问局部变量稍慢

**最佳实践：**

```javascript
// 1. 不需要时释放引用
let counter = createCounter();
counter();
counter = null;  // 释放闭包

// 2. 避免在闭包中保存大量数据
```"""
                },
                {
                    "id": 14,
                    "title": "JavaScript 原型和原型链是什么？",
                    "answer": """**原型（Prototype）**是 JavaScript 实现继承的核心机制。每个函数（除了箭头函数）都有一个 prototype 属性，每个对象都有一个 __proto__ 属性（或 Object.getPrototypeOf() 访问）。

**核心概念：**

```
构造函数                    原型对象
Person ─────prototype────> Person.prototype
   │                           │
   │                           │ constructor
   │                           ↓
实例对象                    原型链向上
person ─────__proto__────→ Person.prototype ─────__proto__────→ Object.prototype ─────__proto__────→ null
```

**代码示例：**

```javascript
// 构造函数
function Person(name) {
  this.name = name;
}

// 原型方法
Person.prototype.sayHello = function() {
  console.log('Hello, ' + this.name);
};

// 创建实例
const person = new Person('Tom');

// 关系验证
console.log(person.__proto__ === Person.prototype);        // true
console.log(Person.prototype.constructor === Person);      // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__);                   // null
```

**原型链查找机制：**

```javascript
person.sayHello();  // 查找过程：
// 1. person 对象自身 → 没有 sayHello
// 2. person.__proto__ (Person.prototype) → 找到 sayHello
// 3. 如果还没找到，继续 Person.prototype.__proto__ (Object.prototype)
// 4. 直到 null，返回 undefined
```

**new 关键字执行过程：**

```javascript
function myNew(Constructor, ...args) {
  // 1. 创建空对象
  const obj = {};

  // 2. 设置原型
  obj.__proto__ = Constructor.prototype;

  // 3. 执行构造函数
  const result = Constructor.apply(obj, args);

  // 4. 返回对象
  return result instanceof Object ? result : obj;
}
```

**ES6 Class 的本质：**

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log('Hello, ' + this.name);
  }
}

// 本质上是语法糖，等同于上面的构造函数写法
```

**原型链继承：**

```javascript
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(this.name + ' is eating');
};

// 子类
function Dog(name, breed) {
  Animal.call(this, name);  // 借用构造函数
  this.breed = breed;
}

// 建立原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const dog = new Dog('Buddy', 'Golden Retriever');
dog.eat();   // 继承自 Animal
```

**现代继承方式（推荐）：**

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(this.name + ' is eating');
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    console.log('Woof!');
  }
}
```"""
                },
                {
                    "id": 15,
                    "title": "什么是事件循环（Event Loop）？宏任务和微任务的区别是什么？",
                    "answer": """**事件循环（Event Loop）**是 JavaScript 实现异步编程的机制。由于 JavaScript 是单线程语言，事件循环负责协调同步代码和异步代码的执行。

**JavaScript 执行模型：**

```
┌─────────────────────────────────────────┐
│              调用栈（Call Stack）         │
│              - 执行同步代码               │
│              - 后进先出（LIFO）            │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              Web APIs                   │
│   - setTimeout、DOM、AJAX、fetch 等      │
│   - 异步操作在这里执行                   │
└─────────────────────────────────────────┘
                    │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   宏任务队列   │      │   微任务队列   │
│  (Task Queue)│      │(Microtask Queue)│
│              │      │              │
│ - setTimeout │      │ - Promise.then│
│ - setInterval│      │ - Promise.catch│
│ - I/O 操作    │      │ - queueMicrotask│
│ - UI 渲染    │       │ - MutationObserver│
└──────────────┘      └──────────────┘
```

**事件循环执行顺序：**

1. 执行同步代码（调用栈中的代码）
2. 执行所有微任务（Microtasks）
3. 执行一个宏任务（Macrotask）
4. 重复步骤 2-3

**代码示例：**

```javascript
console.log('1');  // 同步

setTimeout(() => {
  console.log('2');  // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3');  // 微任务
});

console.log('4');  // 同步

// 输出顺序：1 → 4 → 3 → 2
```

**复杂示例：**

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => {
    console.log('5');
  }, 0);
});

console.log('6');

// 输出顺序：1 → 6 → 4 → 2 → 3 → 5
```

**async/await 的执行：**

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');
setTimeout(() => {
  console.log('setTimeout');
}, 0);
async1();
Promise.resolve().then(() => {
  console.log('promise1');
});
console.log('script end');

// 输出：
// script start
// async1 start
// async2
// script end
// async1 end
// promise1
// setTimeout
```

**宏任务 vs 微任务：**

| 特性 | 宏任务（Macrotask） | 微任务（Microtask） |
|------|-------------------|-------------------|
| 优先级 | 低 | 高 |
| 执行时机 | 每个循环执行一次 | 当前循环清空所有微任务 |
| 包含 | setTimeout、setInterval、I/O、UI渲染 | Promise、queueMicrotask、MutationObserver |
| 用途 | 延迟执行、定时任务 | 需要立即执行的异步操作 |

**关键点：**
- await 后面的代码会进入微任务队列
- async 函数本身会立即执行（同步部分）"""
                }
            ]
        }
    ]

    return {"categories": categories}

if __name__ == "__main__":
    result = parse_markdown()
    output_path = "/Users/ngz/Desktop/Ai-Project/前端面试100问/interview-practice/src/data/questions.json"

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"JSON 文件已生成：{output_path}")
    print(f"共 {len(result['categories'])} 个分类")
    for cat in result['categories']:
        print(f"  - {cat['name']}: {len(cat['questions'])} 题")
