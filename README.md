# Hugo-High-Material-Theme

## 开始使用

1. 使用```git_submodule```或直接下载集成在```themes```目录下
2. 安装```Node.js```
3. 如果对主题有修改需要重新运行命令
```bash
npm i
npm run build
```
4. 使用```hugo```发布网站


## 使用配置

部分在```FrontMatter```中或在```config.yaml```中可自定义的配置
```yaml
params:
  # 页面的meta keyword，FrontMatter中可覆盖
  keywords: ["kw1", "kw2", "kw3"]
  # 页面的meta description，FrontMatter中可覆盖
  description: "研究互联网产品和技术，提供原创中文精品教程"
  # 页面的meta author，FrontMatter中可覆盖
  author: "Your Name"

  # 主页或者部分页面图标链接配置，icon必须是在fontawesome中支持的
  links:
    - { icon: "github", href: "https://github.com" }

  # 主页上方显示的第一级入口链接
  navlinks:
    - { title: "开发", url: "/categories/dev" }
    - { title: "生活", url: "/life"  }
    - { title: "学习", url: "/tags/study" }
    - { title: "归档", url: "/archives" }
```


#### 自定义主页

在```content```目录下直接创建一个```_index.md```，填写的内容将被适合的显示在主页中


#### 标签颜色

在主题目录中的```data/tag-colors.json```文件控制所有标签的颜色，与```tone```相反即为文字颜色