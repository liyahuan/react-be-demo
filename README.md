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
  运行项目>> npm run dev
  运行storybook>> npm run build storybook
  生成storybook-static文件夹>> npm build storybook-static
```

### github pages
settings=>pages=> `https://liyahuan.github.io/react-be-demo/storybook-static/` 可以访问到storybook-static的内容
github使用`github action`部署任务。
大概是storybook的缓存，限制了storybook-static文件的生成，因为本地访问storybook-static，发现它还是个旧的文件夹。

###  styled-components
添加了css-in-js的插件，`styled-components`

####
若import的文件，所在文件夹中，有同名的js || tsx文件，就必须写全引用的后缀。不然，会有歧义的。

#### 
已经安装了tailwindcss。2025/03/17将其升级到v4版本  npx @tailwindcss/upgrade
不好直接运行。需要删除原来的依赖[rmdir /s /q node_modules]，然后重新npm install。顺带，改变package.json里面的各种版本号["typescript": "~4.9.5", "tailwindcss": "^4.0",]。
 	
##### prefix 加上前缀的写法
tw:[&>li]:text-4xl

##### input.css文件的命令 去除掉对input以及img的默认写法后的命令：
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme) prefix(tw);
/*@import "tailwindcss/preflight.css" layer(base);*/
@import "tailwindcss/utilities.css" layer(utilities);


#### tailwindcss的运行命令
npx @tailwindcss/cli -i ./src/input.css -o ./src/index.css --watch