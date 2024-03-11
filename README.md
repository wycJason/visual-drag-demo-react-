## 说明
本项目应用框架模板是react版本的[devextreme](https://js.devexpress.com/React/)，是对基于vue2的[visual-drag-demo](https://github.com/woai3c/visual-drag-demo)的翻译，是react版本，免费供大家参考学习。如有对作者woai3c的僭越之处还请联系我，可随时删除。本人懂vue，在学习react中，看到作者说这个项目是教学项目，刚好作者没有做react版本，我就拿来练手。react版本对vue版本只做了技术上的翻译，思想没做任何改动。唯一的改动，就是添加了缩放的适配，可根据浏览器自动调整大小而不出现滚动条。

## 设计界面
![image](https://github.com/wycJason/visual-drag-demo-react-/assets/24973464/02baa194-174a-4b7a-aac9-37ce4c227510)

## 预览界面（可根据屏幕大小自适应调整）
### 1920*1080
![image](https://github.com/wycJason/visual-drag-demo-react-/assets/24973464/d6521de2-8b7d-4879-81d7-5d036ffe680b)

### 其它任意尺寸
![image](https://github.com/wycJason/visual-drag-demo-react-/assets/24973464/9349090c-bd2b-4ed1-8616-d53dad9c1947)


## 安装

`npm i`

## 运行

`npm start`


## 打包
`npm run build`


## [在项目中添加视图至应用程序](https://js.devexpress.com/React/Documentation/Guide/React_Components/Application_Template/#Add_a_New_View)

`devextreme add view view-name [--icon]`

运行以上命令后，您可以在“src\pages”文件夹下找到添加的视图。这个命令还在' src\app-navigation.js '文件中为添加的视图创建一个导航菜单项。这个功能方便你开发项目时遇到问题，做demo自我排查，是很好的一个生成命令行工具
