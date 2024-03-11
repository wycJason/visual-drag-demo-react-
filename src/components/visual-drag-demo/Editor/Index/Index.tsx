import React, { useState, useEffect, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { useSnapshot, subscribe, proxy } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import './Index.scss'
import store from '../../../../store/index';

import Shape from '../Shape/Shape'
import { getStyle, getComponentRotatedStyle, getShapeStyle, getSVGStyle, getCanvasStyle } from '../../../../utils/visual-drag-demo/style'
import { $, isPreventDrop } from '../../../../utils/visual-drag-demo/utils'
import ContextMenu from '../ContextMenu/ContextMenu'
import MarkLine from '../MarkLine/MarkLine'
import Area from '../Area/Area'
import PubSub from '../../../../utils/visual-drag-demo/eventBus'
import Grid from '../Grid/Grid'
import { changeStyleWithScale } from '../../../../utils/visual-drag-demo/translate'

import DynamicComponent from '../../../../custom-component/DynamicComponent';

// 本地变量
const localStore = proxy({
    editorX: 0,
    editorY: 0,
    start: {
        x: 0,
        y: 0
    },
    width: 0,
    height: 0,
    isShowArea: false,
    svgFilterAttrs: ['width', 'height', 'top', 'left', 'rotate']
})

export default ({ isEdit = true }: any) => {
    const stateRender = useSnapshot(store.state)
    const localData = useProxy(localStore)

    const hideArea = () => {
        localData.isShowArea = true;
        localData.width = 0;
        localData.height = 0;

        store.setAreaData(store.state, {
            style: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            },
            components: [],
        })
    }

    const getSelectArea = () => {

        const result: any[] = []
        // 区域起点坐标
        const { x, y } = localData.start
        // 计算所有的组件数据，判断是否在选中区域内
        store.state.componentData.forEach((component: any) => {
            if (component.isLock) return

            const { left, top, width, height } = getComponentRotatedStyle(component.style)
            if (x <= left && y <= top && (left + width <= x + localData.width) && (top + height <= y + localData.height)) {
                result.push(component)
            }
        })

        // 返回在选中区域内的所有组件
        return result
    }




    const createGroup = () => {
        // 获取选中区域的组件数据
        const areaData = getSelectArea()
        console.log('areaData', { ...areaData });

        if (areaData.length <= 1) {
            hideArea()
            return
        }

        // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
        // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
        let top = Infinity, left = Infinity
        let right = -Infinity, bottom = -Infinity
        areaData.forEach((component: any) => {
            let style: Record<string, any> = {}
            if (component.component == 'Group') {
                component.propValue.forEach((item: any) => {
                    const rectInfo = $(`#component${item.id}`).getBoundingClientRect()
                    style.left = rectInfo.left - localData.editorX
                    style.top = rectInfo.top - localData.editorY
                    style.right = rectInfo.right - localData.editorX
                    style.bottom = rectInfo.bottom - localData.editorY

                    if (style.left < left) left = style.left
                    if (style.top < top) top = style.top
                    if (style.right > right) right = style.right
                    if (style.bottom > bottom) bottom = style.bottom
                })
            } else {
                style = getComponentRotatedStyle(component.style)
            }

            if (style.left < left) left = style.left
            if (style.top < top) top = style.top
            if (style.right > right) right = style.right
            if (style.bottom > bottom) bottom = style.bottom
        })

        localData.start.x = left
        localData.start.y = top
        localData.width = right - left
        localData.height = bottom - top

        // 设置选中区域位移大小信息和区域内的组件数据
        store.setAreaData(store.state, {
            style: {
                left,
                top,
                width: localData.width,
                height: localData.height,
            },
            components: areaData,
        })
    }


    const handleMouseDown = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;

        // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
        if (!store.state.curComponent || (isPreventDrop(store.state.curComponent.component))) {
            syntheticEvent.preventDefault()
        }

        hideArea()

        // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
        const rectInfo = $(store.state.editor).getBoundingClientRect()
        // console.log('rectInfo',rectInfo);

        localData.editorX = rectInfo.x
        localData.editorY = rectInfo.y

        const startX = e.clientX
        const startY = e.clientY

        localData.start.x = startX - rectInfo.x
        localData.start.y = startY - rectInfo.y

        // 展示选中区域
        localData.isShowArea = true

        const move = (moveEvent: any) => {
            console.log("move-Editor");

            localData.width = Math.abs(moveEvent.clientX - startX)
            localData.height = Math.abs(moveEvent.clientY - startY)

            if (moveEvent.clientX < startX) {
                localData.start.x = moveEvent.clientX - rectInfo.x
            }

            if (moveEvent.clientY < startY) {
                localData.start.y = moveEvent.clientY - rectInfo.y
            }
        }

        const up = (e: any) => {
            console.log("up-Editor");
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)

            if (e.clientX == startX && e.clientY == startY) {
                hideArea()
                return
            }

            createGroup()
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
    }


    const handleContextMenu = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        syntheticEvent.stopPropagation()
        syntheticEvent.preventDefault()

        // 计算菜单相对于编辑器的位移
        let target = e.target
        let top = e.offsetY
        let left = e.offsetX
        while (target instanceof SVGElement) {
            target = target.parentNode
        }

        while (!target.className.includes('editor')) {
            left += target.offsetLeft
            top += target.offsetTop
            target = target.parentNode
        }

        store.showContextMenu(store.state, { top, left })
    }


    const getComponentStyle = (style: any) => {
        return getStyle(style, localData.svgFilterAttrs)
    }

    const getSVGStyleData = (style: any) => {
        return getSVGStyle(style, localData.svgFilterAttrs)
    }

    const handleInput = (element: any, value: any) => {
        // 根据文本组件高度调整 shape 高度
        store.setShapeStyle(store.state, {
            height: getTextareaHeight(element, value),
            width: undefined,
            top: undefined,
            left: undefined,
            rotate: undefined,
        })
    }

    const getTextareaHeight = (element: any, text: any) => {
        let { lineHeight, fontSize, height } = element.style
        if (lineHeight === '') {
            lineHeight = 1.5
        }

        const newHeight = (text.split('<br>').length - 1) * lineHeight * (fontSize || store.state.canvasStyleData.fontSize)
        return height > newHeight ? height : newHeight
    }



    useEffect(() => {
        // 类似 componentDidMount 和 componentDidUpdate
        store.getEditor(store.state)
        PubSub.subscribe('hideArea', function (msg: any, data: any) {
            hideArea()
        });

        return () => {
            // 返回一个函数用来做清理工作，类似于 componentWillUnmount
        };
    }, []); // 空依赖数组意味着仅在挂载时运行一次


    // useEffect(() => {
    //     const unsubscribe = subscribe(store.state, () =>
    //         console.log('state has changed to', store.state),
    //     )

    //     return () => {
    //         unsubscribe()
    //     };
    // }, []); // 空依赖数组意味着仅在挂载时运行一次


    // console.log("stateRender", stateRender?.canvasStyleData)

    return (
        <div id='editor' className={classNames('editor', { edit: isEdit })} style={{
            ...getCanvasStyle(stateRender?.canvasStyleData),
            width: changeStyleWithScale(stateRender?.canvasStyleData.width) + 'px',
            height: changeStyleWithScale(stateRender?.canvasStyleData.height) + 'px',
        }} onContextMenu={handleContextMenu} onMouseDown={handleMouseDown}>

            {/* 网格线 */}
            <Grid isDarkMode={stateRender.isDarkMode} />

            {/* 页面组件列表展示 */}
            {
                stateRender?.componentData?.map((item: any, index: number) => (
                    <Fragment key={item.id}>
                        <Shape
                            defaultStyle={item.style}
                            active={item.id === stateRender?.curComponent?.id}
                            element={item}
                            index={index}
                            style={getShapeStyle(item.style)}
                            className={classNames({ lock: item.isLock })}
                        >
                            {item.component.startsWith('SVG') ? <DynamicComponent
                                is={item.component}
                                id={'component' + item.id}
                                style={getSVGStyleData(item.style)}
                                className="component"
                                propValue={item.propValue}
                                element={item}
                            /> : item.component != 'VText' ? <DynamicComponent
                                is={item.component}
                                id={'component' + item.id}
                                style={getComponentStyle(item.style)}
                                className="component"
                                propValue={item.propValue}
                                element={item}
                            /> : <DynamicComponent
                                is={item.component}
                                id={'component' + item.id}
                                style={getComponentStyle(item.style)}
                                className="component"
                                propValue={item.propValue}
                                element={item}
                                onInput={handleInput}
                            />
                            }
                        </Shape>
                    </Fragment>
                ))
            }


            {/* 右击菜单 */}
            <ContextMenu />

            {/* 标线 */}
            <MarkLine />

            {/* 选中区域 */}
            {<Area
                show={localData.isShowArea}
                start={localData.start}
                width={localData.width}
                height={localData.height}
            />
            }

        </div>
    )
}