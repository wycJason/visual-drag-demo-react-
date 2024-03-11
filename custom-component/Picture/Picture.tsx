import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';
import { $ } from '../../utils/visual-drag-demo/utils'


import './Picture.scss'

import { type IProps } from '../DynamicComponent'

export default ({ id, propValue, element, style, className }: Partial<IProps>) => {
    // 本地变量
    const localState = useRef({
        width: 0,
        height: 0,
        img: null as any,
        canvas: null as any,
        ctx: null as any,
        isFirst: true,
    })
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const drawImage = () => {
        const { width, height } = element?.style
        localState.current.canvas.width = width
        localState.current.canvas.height = height
        if (localState.current.isFirst) {
            localState.current.isFirst = false
            localState.current.img = document.createElement('img')
            localState.current.img.src = propValue.url
            localState.current.img.onload = () => {
                localState.current.ctx.drawImage(localState.current.img, 0, 0, width, height)
                mirrorFlip()
            }
        } else {
            mirrorFlip()
        }
    }

    const mirrorFlip = () => {
        const { vertical, horizontal } = propValue.flip
        const { width, height } = element?.style
        const hvalue = horizontal ? -1 : 1
        const vValue = vertical ? -1 : 1

        // 清除图片
        localState.current.ctx.clearRect(0, 0, width, height)
        // 平移图片
        localState.current.ctx.translate(width / 2 - width * hvalue / 2, height / 2 - height * vValue / 2)
        // 对称镜像
        localState.current.ctx.scale(hvalue, vValue)
        localState.current.ctx.drawImage(localState.current.img, 0, 0, width, height)
        // 还原坐标点
        localState.current.ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    const renderImage = () => {
        if (canvasRef.current) {
            localState.current.canvas = canvasRef.current
            if (localState.current.canvas) {
                localState.current.ctx = localState.current.canvas?.getContext('2d')
                drawImage()
            }
        }
    }


    useEffect(() => {
        renderImage()
    }, [element?.style.width, element?.style.height]);

    useEffect(() => {
        mirrorFlip()
    }, [propValue.flip.vertical, propValue.flip.horizontal]);


    useEffect(() => {
        renderImage()
    }, []);

    return (
        <div id={id} className={classNames(className)} style={{
            ...style,
            overflow: "hidden"
        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}