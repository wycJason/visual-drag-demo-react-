import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import store from '../../../../store/index';
import './MarkLine.scss'
import PubSub from '../../../../utils/visual-drag-demo/eventBus'
import { getComponentRotatedStyle } from '../../../../utils/visual-drag-demo/style'


export default () => {
    const stateConsumer = useProxy(store.state)

    const [lines, setLines] = useImmer(['xt', 'xc', 'xb', 'yl', 'yc', 'yr'])// 分别对应三条横线和三条竖线
    const [diff, setDiff] = useState(3) // 相距 dff 像素将自动吸附
    const [lineStatus, setLineStatus] = useImmer<Record<string, boolean>>({
        xt: false,
        xc: false,
        xb: false,
        yl: false,
        yc: false,
        yr: false,
    })

    const xt = useRef(null)
    const xc = useRef(null)
    const xb = useRef(null)
    const yl = useRef(null)
    const yc = useRef(null)
    const yr = useRef(null)

    const linePosition: Record<string, any> = {
        xt,
        xc,
        xb,
        yl,
        yc,
        yr,
    }


    const hideLine = () => {
        Object.keys(lineStatus).forEach(line => {
            setLineStatus((draft: any) => {
                draft[line] = false
            })
        })
    }

    const isNearly = (dragValue: any, targetValue: any) => {
        return Math.abs(dragValue - targetValue) <= diff
    }


    const showLine = (isDownward: any, isRightward: any) => {
        const components = stateConsumer.componentData
        const curComponentStyle = getComponentRotatedStyle(stateConsumer.curComponent?.style)
        const curComponentHalfwidth = curComponentStyle.width / 2
        const curComponentHalfHeight = curComponentStyle.height / 2

        hideLine()
        components.forEach((component: any) => {
            if (component == stateConsumer.curComponent) return
            const componentStyle = getComponentRotatedStyle(component?.style)
            const { top, left, bottom, right } = componentStyle
            const componentHalfwidth = componentStyle.width / 2
            const componentHalfHeight = componentStyle.height / 2

            const conditions: Record<string, any> = {
                top: [
                    {
                        isNearly: isNearly(curComponentStyle.top, top),
                        lineNode: linePosition.xt.current, // xt
                        line: 'xt',
                        dragShift: top,
                        lineShift: top,
                    },
                    {
                        isNearly: isNearly(curComponentStyle.bottom, top),
                        lineNode: linePosition.xt.current, // xt
                        line: 'xt',
                        dragShift: top - curComponentStyle.height,
                        lineShift: top,
                    },
                    {
                        // 组件与拖拽节点的中间是否对齐
                        isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
                        lineNode: linePosition.xc.current, // xc
                        line: 'xc',
                        dragShift: top + componentHalfHeight - curComponentHalfHeight,
                        lineShift: top + componentHalfHeight,
                    },
                    {
                        isNearly: isNearly(curComponentStyle.top, bottom),
                        lineNode: linePosition.xb.current, // xb
                        line: 'xb',
                        dragShift: bottom,
                        lineShift: bottom,
                    },
                    {
                        isNearly: isNearly(curComponentStyle.bottom, bottom),
                        lineNode: linePosition.xb.current, // xb
                        line: 'xb',
                        dragShift: bottom - curComponentStyle.height,
                        lineShift: bottom,
                    },
                ],
                left: [
                    {
                        isNearly: isNearly(curComponentStyle.left, left),
                        lineNode: linePosition.yl.current, // yl
                        line: 'yl',
                        dragShift: left,
                        lineShift: left,
                    },
                    {
                        isNearly: isNearly(curComponentStyle.right, left),
                        lineNode: linePosition.yl.current, // yl
                        line: 'yl',
                        dragShift: left - curComponentStyle.width,
                        lineShift: left,
                    },
                    {
                        // 组件与拖拽节点的中间是否对齐
                        isNearly: isNearly(curComponentStyle.left + curComponentHalfwidth, left + componentHalfwidth),
                        lineNode: linePosition.yc.current, // yc
                        line: 'yc',
                        dragShift: left + componentHalfwidth - curComponentHalfwidth,
                        lineShift: left + componentHalfwidth,
                    },
                    {
                        isNearly: isNearly(curComponentStyle.left, right),
                        lineNode: linePosition.yr.current, // yr
                        line: 'yr',
                        dragShift: right,
                        lineShift: right,
                    },
                    {
                        isNearly: isNearly(curComponentStyle.right, right),
                        lineNode: linePosition.yr.current, // yr
                        line: 'yr',
                        dragShift: right - curComponentStyle.width,
                        lineShift: right,
                    },
                ],
            }

            const needToShow: any[] = []
            const { rotate } = stateConsumer.curComponent?.style
            Object.keys(conditions).forEach(key => {
                // 遍历符合的条件并处理
                conditions[key].forEach((condition: any) => {
                    if (!condition.isNearly) return
                    // 修改当前组件位移
                    store.setShapeSingleStyle(stateConsumer, {
                        key,
                        value: rotate != 0 ? translatecurComponentShift(key, condition, curComponentStyle) : condition.dragShift,
                    })


                    condition.lineNode && (condition.lineNode.style[key] = `${condition.lineShift}px`)
                    needToShow.push(condition.line)
                })
            })

            // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
            // 同一方向上的线只显示一条，例如多条横条只显示一条横线
            if (needToShow.length) {
                chooseTheTureLine(needToShow, isDownward, isRightward)
            }
        })
    }

    const translatecurComponentShift = (key: any, condition: any, curComponentStyle: any) => {
        const { width, height } = stateConsumer.curComponent?.style
        if (key == 'top') {
            return Math.round(condition.dragShift - (height - curComponentStyle.height) / 2)
        }

        return Math.round(condition.dragShift - (width - curComponentStyle.width) / 2)
    }


    const chooseTheTureLine = (needToShow: any, isDownward: any, isRightward: any) => {
        // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
        // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
        if (isRightward) {
            if (needToShow.includes('yr')) {
                setLineStatus((draft: any) => {
                    draft.yc = true
                })
            } else if (needToShow.includes('yc')) {
                setLineStatus((draft: any) => {
                    draft.yc = true
                })
            } else if (needToShow.includes('yl')) {
                setLineStatus((draft: any) => {
                    draft.yl = true
                })
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (needToShow.includes('yl')) {
                setLineStatus((draft: any) => {
                    draft.yl = true
                })
            } else if (needToShow.includes('yc')) {
                setLineStatus((draft: any) => {
                    draft.yc = true
                })
            } else if (needToShow.includes('yr')) {
                setLineStatus((draft: any) => {
                    draft.yr = true
                })
            }
        }

        if (isDownward) {
            if (needToShow.includes('xb')) {
                setLineStatus((draft: any) => {
                    draft.xb = true
                })
            } else if (needToShow.includes('xc')) {
                setLineStatus((draft: any) => {
                    draft.xc = true
                })
            } else if (needToShow.includes('xt')) {
                setLineStatus((draft: any) => {
                    draft.xt = true
                })
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (needToShow.includes('xt')) {
                setLineStatus((draft: any) => {
                    draft.xt = true
                })
            } else if (needToShow.includes('xc')) {
                setLineStatus((draft: any) => {
                    draft.xc = true
                })
            } else if (needToShow.includes('xb')) {
                setLineStatus((draft: any) => {
                    draft.xb = true
                })
            }
        }
    }



    useEffect(() => {
        // 监听元素移动和不移动的事件
        PubSub.subscribe('move', function (msg: any, { isDownward, isRightward }: any) {
            showLine(isDownward, isRightward)
        });

        PubSub.subscribe('unmove', function (msg: any, data: any) {
            hideLine()
        });

        return () => {
            // 返回一个函数用来做清理工作，类似于 componentWillUnmount
        };
    }, []); // 空依赖数组意味着仅在挂载时运行一次

    return (
        <div className='mark-line'>
            {
                lines.map((line) => (
                    <div
                        style={{ display: lineStatus[line] || false ? 'block' : 'none' }}
                        key={line}
                        ref={linePosition[line]}
                        className={classNames('line', line.includes('x') ? 'xline' : 'yline')}
                    >
                    </div>
                ))
            }
        </div>
    )
}