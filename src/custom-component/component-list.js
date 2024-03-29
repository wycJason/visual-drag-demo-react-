
// 公共属性
export const commonAttr = {
    groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
    isLock: false, // 是否锁定组件
    collapseName: 'style', // 编辑组件时记录当前使用的是哪个折叠面板，再次回来时恢复上次打开的折叠面板，优化用户体验
}

// style公共样式
export const commonStyle = {
    rotate: 0,// 旋转角度
    opacity: 1,// 不透明度
    top:0,//位置 上边距
    left:0,//位置 左边距
}

// propValue公共属性
export const commonProp = {
    caption: "名称"
}



// 编辑器左侧组件列表
const list = [
    {
        component: 'VText',
        label: '文字',
        propValue: {

        },
        icon: 'wenben',
        style: {
            width: 200,
            height: 28,
            fontSize: '',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: '',
            color: '',
        },
    },
    {
        component: 'VButton',
        label: '按钮',
        propValue: {

        },
        icon: 'button',
        style: {
            width: 100,
            height: 34,
            borderWidth: 1,
            borderColor: '',
            borderRadius: '',
            fontSize: '',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: '',
            color: '',
            backgroundColor: '',
        },
    },
    {
        component: 'Picture',
        label: '图片',
        icon: 'tupian',
        propValue: {
            url: require('../assets/title.jpg'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            width: 300,
            height: 200,
            borderRadius: '',
        },
    },
    // {
    //     component: 'RectShape',
    //     label: '矩形',
    //     propValue: '&nbsp;',
    //     icon: 'juxing',
    //     style: {
    //         width: 200,
    //         height: 200,
    //         fontSize: '',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'center',
    //         color: '',
    //         borderColor: '#000',
    //         borderWidth: 1,
    //         backgroundColor: '',
    //         borderStyle: 'solid',
    //         borderRadius: '',
    //         verticalAlign: 'middle',
    //     },
    // },
    // {
    //     component: 'LineShape',
    //     label: '直线',
    //     propValue: '',
    //     icon: 'zhixian',
    //     style: {
    //         width: 200,
    //         height: 2,
    //         backgroundColor: '#000',
    //     },
    // },
    // {
    //     component: 'CircleShape',
    //     label: '圆形',
    //     propValue: '&nbsp;',
    //     icon: '24gl-circle',
    //     style: {
    //         width: 200,
    //         height: 200,
    //         fontSize: '',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'center',
    //         color: '',
    //         borderColor: '#000',
    //         borderWidth: 1,
    //         backgroundColor: '',
    //         borderStyle: 'solid',
    //         borderRadius: '',
    //         verticalAlign: 'middle',
    //     },
    // },
    // {
    //     component: 'SVGStar',
    //     label: '星形',
    //     icon: 'kongwujiaoxing',
    //     propValue: '',
    //     style: {
    //         width: 80,
    //         height: 80,
    //         fontSize: '',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'center',
    //         color: '',
    //         borderColor: '#000',
    //         backgroundColor: 'rgba(255, 255, 255, 1)',
    //     },
    // },
    // {
    //     component: 'SVGTriangle',
    //     label: '三角形',
    //     icon: 'xingzhuang-sanjiaoxing',
    //     propValue: '',
    //     style: {
    //         width: 80,
    //         height: 80,
    //         fontSize: '',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'center',
    //         color: '',
    //         borderColor: '#000',
    //         backgroundColor: 'rgba(255, 255, 255, 1)',
    //     },
    // },
    // {
    //     component: 'VTable',
    //     label: '表格',
    //     icon: 'biaoge',
    //     propValue: {
    //         data: [
    //             ['表头1', '表头2', '表头3'],
    //             ['内容1', '内容2', '内容3'],
    //         ],
    //         stripe: true,
    //         thBold: true,
    //     },
    //     request: {
    //         method: 'GET',
    //         data: [],
    //         url: '',
    //         series: false,
    //         time: 1000,
    //         paramType: '', // string object array
    //         requestCount: 0, // 请求次数限制，0 为无限
    //     },
    //     style: {
    //         width: 600,
    //         height: 200,
    //         fontSize: '',
    //         fontWeight: 400,
    //         textAlign: 'center',
    //         color: '',
    //         backgroundColor: 'rgba(255, 255, 255, 1)',
    //     },
    // },
    {
        component: 'VChart',
        label: '图表',
        icon: 'dx-icon-chart',
        propValue: {
            option: {
                title: {
                    text: '柱状图',
                    show: true,
                },
                legend: {
                    show: true,
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                },
                xAxis: {
                    show: true,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
                yAxis: {
                    show: true,
                },
                series: {
                    type: 'bar',
                    name: '销量',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                },
            },
        },
        style: {
            width: 400,
            height: 300,
        },
    },
]

for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]

    // 公共样式与组件样式合并
    item.style = { ...commonStyle, ...item.style }

    // 公共属性值与组件属性值合并
    item.propValue = { ...commonProp, ...item.propValue }

    // 公共属性与组件属合并
    list[i] = { ...commonAttr, ...item }
}

export default list
