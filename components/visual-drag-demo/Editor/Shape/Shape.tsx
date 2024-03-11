import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';
import { useImmer } from 'use-immer';
import './Shape.scss'

import store from '../../../../store/index';
import PubSub from '../../../../utils/visual-drag-demo/eventBus'
import runAnimation from '../../../../utils/visual-drag-demo/runAnimation'
import calculateComponentPositonAndSize from '../../../../utils/visual-drag-demo/calculateComponentPositonAndSize'
import { mod360 } from '../../../../utils/visual-drag-demo/translate'
import { isPreventDrop, $ } from '../../../../utils/visual-drag-demo/utils'
import { getShapeStyle } from '../../../../utils/visual-drag-demo/style'


interface IProps {
    active: boolean
    element: Record<string, any>
    defaultStyle: Record<string, any>
    index: number | string
    style: Record<string, any>
    className: string
    [key: string]: any
}


export default ({ active, element, defaultStyle, index, children, style, className }: IProps) => {
    const stateRender = useSnapshot(store.state)
    const $el = useRef(null)


    // console.log("element", element)
    // console.log("curComponent", stateRender?.curComponent)


    const [pointList, setPointList] = useImmer<string[]>(['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']) // 八个方向
    const [pointList2, setPointList2] = useImmer<string[]>(['r', 'l']) // 左右两个方向
    const [initialAngle, setInitialAngle] = useImmer<Record<string, any>>({ // 每个点对应的初始角度
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315,
    })
    const [angleToCursor, setAngleToCursor] = useImmer<Record<string, any>[]>([ // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' },
    ])
    const [cursors, setCursors] = useImmer<Record<string, any>>({})

    useEffect(() => {
        // 类似 componentDidMount 和 componentDidUpdate
        // 用于 Group 组件
        if (store.state.curComponent) {
            // 根据旋转角度获取光标位置
            setCursors(draft => {
                return getCursor()
            })
        }
        PubSub.subscribe('runAnimation', function (msg: any, data: any) {
            if (element == store.state.curComponent) {
                runAnimation($el.current, store.state.curComponent.animations)
            }
        });

        PubSub.subscribe('stopAnimation', function (msg: any, data: any) {
            ($el.current as any)?.classList.remove('animated', 'infinite')
        });


        return () => {
            // 返回一个函数用来做清理工作，类似于 componentWillUnmount
        };
    }, []); // 空依赖数组意味着仅在挂载时运行一次


    const getPointList = () => {
        return element.component === 'line-shape' ? pointList2 : pointList
    }

    const isActive = () => {
        return active && !element.isLock
    }

    // 处理旋转
    const handleRotate = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;

        store.setClickComponentStatus(store.state, true)
        syntheticEvent.preventDefault()
        syntheticEvent.stopPropagation()

        // 初始坐标和初始角度
        const pos: any = { ...defaultStyle }
        const startY = e.clientY
        const startX = e.clientX
        const startRotate = pos.rotate

        // 获取元素中心点位置
        const rect = ($el.current as any).getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // 旋转前的角度
        const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

        // 如果元素没有移动，则不保存快照
        let hasMove = false
        const move = (moveEvent: any) => {
            hasMove = true
            const curX = moveEvent.clientX
            const curY = moveEvent.clientY
            // 旋转后的角度
            const rotateDegreeAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)
            // 获取旋转的角度值
            pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore
            // 修改当前组件样式
            store.setShapeStyle(store.state, pos)

        }

        const up = () => {
            hasMove && store.recordSnapshot(store.state)
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)
            setCursors(draft => {
                return getCursor()
            }) // 根据旋转角度获取光标位置
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
    }

    const getCursor = () => {
        const rotate = mod360(store.state.curComponent?.style.rotate) // 取余 360
        const result: Record<string, any> = {}
        let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

        pointList.forEach(point => {
            const angle = mod360(initialAngle[point] + rotate)
            const len = angleToCursor.length
            // eslint-disable-next-line no-constant-condition
            while (true) {
                lastMatchIndex = (lastMatchIndex + 1) % len
                const angleLimit = angleToCursor[lastMatchIndex]
                if (angle < 23 || angle >= 338) {
                    result[point] = 'nw-resize'

                    return
                }

                if (angleLimit.start <= angle && angle < angleLimit.end) {
                    result[point] = angleLimit.cursor + '-resize'

                    return
                }
            }
        })

        return result
    }

    const getPointStyle = (point: any) => {
        const { width, height } = defaultStyle
        const hasT = /t/.test(point)
        const hasB = /b/.test(point)
        const hasL = /l/.test(point)
        const hasR = /r/.test(point)
        let newLeft = 0
        let newTop = 0

        // 四个角的点
        if (point.length === 2) {
            newLeft = hasL ? 0 : width
            newTop = hasT ? 0 : height
        } else {
            // 上下两点的点，宽度居中
            if (hasT || hasB) {
                newLeft = width / 2
                newTop = hasT ? 0 : height
            }

            // 左右两边的点，高度居中
            if (hasL || hasR) {
                newLeft = hasL ? 0 : width
                newTop = Math.floor(height / 2)
            }
        }

        const style = {
            marginLeft: '-4px',
            marginTop: '-4px',
            left: `${newLeft}px`,
            top: `${newTop}px`,
            cursor: cursors[point],
        }

        return style
    }


    const handleMouseDownOnShape = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        syntheticEvent.stopPropagation()

        // 将当前点击组件的事件传播出去，目前的消费是 VText 组件 https://github.com/woai3c/visual-drag-demo/issues/90
        setTimeout(() => {
            PubSub.publish('componentClick')
        })

        store.setInEditorStatus(store.state, true)
        store.setClickComponentStatus(store.state, true)

        if (isPreventDrop(element.component)) {
            syntheticEvent.preventDefault()
        }

        // 选中当前组件
        store.setCurComponent(store.state, { component: element, index: index })

        if (element.isLock) return

        setCursors(draft => {
            return getCursor()
        }) // 根据旋转角度获取光标位置

        const pos: any = { ...defaultStyle }
        const startY = e.clientY
        const startX = e.clientX
        // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
        const startTop = Number(pos.top)
        const startLeft = Number(pos.left)

        // 如果元素没有移动，则不保存快照
        let hasMove = false
        const move = (moveEvent: any) => {
            console.log('move-Shape')

            hasMove = true
            const curX = moveEvent.clientX
            const curY = moveEvent.clientY
            pos.top = curY - startY + startTop
            pos.left = curX - startX + startLeft

            // 修改当前组件样式
            store.setShapeStyle(store.state, pos)

            // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
            // 如果不使用 $nextTick，吸附后将无法移动
            setTimeout(() => {
                // 触发元素移动事件，用于显示标线、吸附功能
                // 后面两个参数代表鼠标移动方向
                // curY - startY > 0 true 表示向下移动 false 表示向上移动
                // curX - startX > 0 true 表示向右移动 false 表示向左移动
                PubSub.publish('move', { isDownward: curY - startY > 0, isRightward: curX - startX > 0 })
            })

        }

        const up = () => {
            console.log('up-Shape')

            hasMove && store.recordSnapshot(store.state)
            // 触发元素停止移动事件，用于隐藏标线
            PubSub.publish('unmove')
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
    }

    const selectCurComponent = (syntheticEvent: any) => {
        // 阻止向父组件冒泡
        syntheticEvent.stopPropagation()
        syntheticEvent.preventDefault()

        store.hideContextMenu(store.state)
        // 打开右侧组件列表
        if (!store.state.rightList) {
            store.isShowRightList(store.state)
        }
    }


    const handleMouseDownOnPoint = (point: any, syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        store.setInEditorStatus(store.state, true)
        store.setClickComponentStatus(store.state, true)

        syntheticEvent.stopPropagation()
        syntheticEvent.preventDefault()

        const style: any = { ...defaultStyle }

        // 组件宽高比
        const proportion = style.width / style.height

        // 组件中心点
        const center = {
            x: style.left + style.width / 2,
            y: style.top + style.height / 2,
        }

        // 获取画布位移信息
        const editorRectInfo = $(store.state.editor)?.getBoundingClientRect()

        // 获取 point 与实际拖动基准点的差值 @justJokee
        // fix https://github.com/woai3c/visual-drag-demo/issues/26#issue-937686285 
        const pointRect = e.target.getBoundingClientRect()
        // 当前点击圆点相对于画布的中心坐标
        const curPoint = {
            x: Math.round(pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2),
            y: Math.round(pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2),
        }

        // 获取对称点的坐标
        const symmetricPoint = {
            x: center.x - (curPoint.x - center.x),
            y: center.y - (curPoint.y - center.y),
        }

        // 是否需要保存快照
        let needSave = false
        let isFirst = true

        const needLockProportion = isNeedLockProportion()

        // 拖动组件移动
        const move = (moveEvent: any) => {
            // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
            // 因此第一次点击时不触发 move 事件
            if (isFirst) {
                isFirst = false
                return
            }

            needSave = true
            const curPositon = {
                x: moveEvent.clientX - Math.round(editorRectInfo.left),
                y: moveEvent.clientY - Math.round(editorRectInfo.top),
            }

            calculateComponentPositonAndSize(point, style, curPositon, proportion, needLockProportion, {
                center,
                curPoint,
                symmetricPoint,
            })

            // 设置拖动元素的位置 
            store.setShapeStyle(store.state, style)
        }

        const up = () => {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)
            needSave && store.recordSnapshot(store.state)
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
    }

    const isNeedLockProportion = () => {
        if (element.component != 'Group') return false
        const ratates = [0, 90, 180, 360]
        for (const component of element.propValue) {
            if (!ratates.includes(mod360(parseInt(component.style.rotate)))) {
                return true
            }
        }

        return false
    }


    return (
        <div ref={$el} className={classNames('shape', className, { active })} style={style} onClick={selectCurComponent} onMouseDown={handleMouseDownOnShape}>
            <span style={{ display: isActive() ? 'block' : 'none' }} className='iconfont icon-xiangyouxuanzhuan' onMouseDown={handleRotate}></span>
            <span style={{ display: element.isLock ? 'block' : 'none' }} className='iconfont icon-suo'></span>
            {
                (isActive() ? getPointList() : []).map((item: any) => (
                    <div key={item} className='shape-point' style={getPointStyle(item)} onMouseDown={e => handleMouseDownOnPoint(item, e)}></div>
                ))
            }
            {children}
        </div>
    )
}