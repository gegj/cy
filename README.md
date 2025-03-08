# 手机H5分享邀请平台

这是一个使用HTML和Tailwind CSS构建的手机H5前台演示界面，主要功能是用户分享邀请统计等功能。

## 项目结构

```
├── index.html              # 首页
├── pages/                  # 页面文件夹
│   ├── invite.html         # 邀请页面
│   └── profile.html        # 个人中心页面
├── css/                    # CSS样式文件夹
│   └── style.css           # 自定义样式
├── js/                     # JavaScript文件夹
│   └── main.js             # 主要脚本文件
└── images/                 # 图片资源文件夹
```

## 功能特点

- **响应式设计**：适配各种移动设备屏幕尺寸
- **现代化UI**：使用Tailwind CSS构建美观的界面
- **底部导航**：包含首页、邀请、我的三个主要页面
- **用户数据统计**：展示邀请数量、收益等数据
- **邀请功能**：生成邀请码、分享链接、生成海报等
- **个人中心**：用户信息管理、钱包功能、设置等

## 技术栈

- HTML5
- Tailwind CSS
- JavaScript (原生)

## 页面说明

### 首页 (index.html)

首页展示用户的基本数据统计、活动图片、快速操作按钮和最新动态。

### 邀请页面 (pages/invite.html)

邀请页面包含邀请卡片、邀请统计、新增用户列表、邀请规则和邀请记录等功能。

### 个人中心 (pages/profile.html)

个人中心页面包含用户信息、钱包信息、常用功能和设置菜单等。

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 通过底部导航栏切换不同页面
3. 点击各功能按钮体验不同功能

## 注意事项

- 本项目使用CDN引入Tailwind CSS，需要联网才能正常显示样式
- 项目中的数据为静态演示数据，实际应用中需要对接后端API
- 部分功能（如分享、复制等）可能需要在实际的移动设备或特定环境中才能正常使用

## 预览

在移动设备或使用浏览器的移动设备模拟模式查看效果最佳。 