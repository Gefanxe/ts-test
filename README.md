https://github.com/krapnikkk/FairyGUI-createjs

## 環境說明

函式庫:
- CreateJS 1.0.1

工具軟體:
- FairyGUI 2021.3.1 社群版
- Node.js 14.17.3

程式語言:
- TypeScript

## tsconfig.json 配置說明

```json

{
    "compilerOptions": {
        "target": "es6",
        "module": "es6",
        "moduleResolution": "node",
        "sourceMap": true
    },
    "exclude": ["node_modules"],
    "include": [ "./src/**/*.ts","./src/**/*.tsx"]
}

```