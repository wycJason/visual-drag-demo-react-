import animation from './animation'
import compose from './compose'
import contextmenu from './contextmenu'
import copy from './copy'
import event from './event'
import layer from './layer'
import snapshots from './snapshot'
import lock from './lock'


import { proxy, subscribe, snapshot } from 'valtio'


// 状态管理
const state = proxy({
    ...animation.state,
    ...compose.state,
    ...contextmenu.state,
    ...copy.state,
    ...event.state,
    ...layer.state,
    ...snapshots.state,
    ...lock.state,

    editMode: 'edit', // 编辑器模式 edit preview
    canvasStyleData: { // 页面全局数据
        width: 1200,
        height: 740,
        scale: 100,
        color: '#000',
        opacity: 1,
        background: '#fff',
        fontSize: 14,
    },
    isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
    componentData: [], // 画布组件数据
    curComponent: null,
    curComponentIndex: null,
    // 点击画布时是否点中组件，主要用于取消选中组件用。
    // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
    isClickComponent: false,
    rightList: true,
    isDarkMode: false,
})


// 操作状态的方法
const mutations = {
    ...animation.mutations,
    ...compose.mutations,
    ...contextmenu.mutations,
    ...copy.mutations,
    ...event.mutations,
    ...layer.mutations,
    ...snapshots.mutations,
    ...lock.mutations,

    aceSetCanvasData(state, value) {
        state.canvasStyleData = value
    },

    // 通过json设置组件
    aceSetcurComponent(state, value) {
        for (let i = 0; i < state.componentData.length; i++) {
            if (state.componentData[i].id === value.id) {
                state.componentData.splice(i, 1)
            }
        }
        state.componentData.push(value)
        state.curComponent = value
    },

    setClickComponentStatus(state, status) {
        state.isClickComponent = status
    },

    isShowRightList(state) {
        state.rightList = !state.rightList
    },

    toggleDarkMode(state, sateus) {
        state.isDarkMode = sateus
        state.canvasStyleData.background = sateus ? '#817f7f' : '#fff'
        localStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode))
    },

    setEditTheme(state, theme) {
        state.isDarkMode = theme
    },
    setEditMode(state, mode) {
        state.editMode = mode
    },

    setInEditorStatus(state, status) {
        state.isInEdiotr = status
    },

    setCanvasStyle(state, style) {
        state.canvasStyleData = style
    },

    setCurComponent(state, { component, index }) {
        let curComponent = null;

        /* jason:更新componentData组件列表状态:即在设置当前选中组件时,要从componentData组件列表中过滤出来,
        赋值给state.curComponent这样,当state.curComponent改变时,componentData也会改变,触发列表重新渲染
        */

        if (component) {
            curComponent = state.componentData.find((item) => item.id === component.id)
        }

        state.curComponent = curComponent
        state.curComponentIndex = index
    },

    setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
        if (curComponent) {
            if (top !== undefined) curComponent.style.top = Math.round(top)
            if (left !== undefined) curComponent.style.left = Math.round(left)
            if (width) curComponent.style.width = Math.round(width)
            if (height) curComponent.style.height = Math.round(height)
            if (rotate) curComponent.style.rotate = Math.round(rotate)
        }
    },

    setShapeSingleStyle({ curComponent }, { key, value }) {
        curComponent.style[key] = value
    },

    setComponentData(state, componentData = []) {
        state.componentData = componentData
    },

    addComponent(state, { component, index }) {
        if (index !== undefined) {
            state.componentData.splice(index, 0, component)
        } else {
            state.componentData.push(component)
        }
    },

    deleteComponent(state, index) {
        if (index === undefined) {
            index = state.curComponentIndex
        }

        if (index == state.curComponentIndex) {
            state.curComponentIndex = null
            state.curComponent = null
        }

        if (/\d/.test(index)) {
            state.componentData.splice(index, 1)
        }
    },
}


const store = {
    state,
    ...mutations,
}


export default store
