# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

### layout的 scroll 
pages/layout相当于是index页面。页面里面添加了input，button等form表单元素
并且可以实现，跳转到的页面，携带了input框的输入值。
### router
路由在`router`文件夹下面的index.tsx文件中

### 命令
```js
  运行项目 npm run dev
  运行storybook npm run storybook
  生成storybook-static文件夹 npm build storybook-static
```

### github pages
settings=>pages=> `https://liyahuan.github.io/react-be-demo/storybook-static/` 可以访问到storybook-static的内容
github使用`github action`部署任务。

###  styled-components
添加了css-in-js的插件，`styled-components`

####
若import的文件，所在文件夹中，有同名的js || tsx文件，就必须写全引用的后缀。不然，会有歧义的。
