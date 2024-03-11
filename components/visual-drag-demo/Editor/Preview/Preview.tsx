import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';
import { getStyle, getCanvasStyle } from '../../../../utils/visual-drag-demo/style'
import './Preview.scss'


import ComponentWrapper from '../ComponentWrapper/ComponentWrapper';
import { Button } from 'devextreme-react/button';


import { changeStyleWithScale } from '../../../../utils/visual-drag-demo/translate'
import { deepCopy } from '../../../../utils/visual-drag-demo/utils'
import { toPng } from 'html-to-image'

import store from '../../../../store/index'
import toast from '../../../../utils/visual-drag-demo/toast';

// 本地变量
const localStore = proxy({
    copyData: [],
    transformStyle: {} as Record<string, any>,
})

export default ({ isScreenshot, onClose }: { isScreenshot: boolean, onClose: () => void }) => {
    const localState = useProxy(localStore)
    const stateConsumer = useProxy(store.state)
    const containerRef = useRef<any>()

    useEffect(() => {
        localState.copyData = deepCopy(stateConsumer.componentData)
    }, []);

    const close = () => {
        onClose()
    }

    const htmlToImage = () => {
        if (containerRef.current) {
            toPng(containerRef.current.querySelector('.preview-scale-canvas'))
                .then(dataUrl => {
                    const a = document.createElement('a')
                    a.setAttribute('download', 'screenshot')
                    a.href = dataUrl
                    a.click()
                })
                .catch(error => {
                    toast(`oops, something went wrong!${error}`, "error")
                })
                .finally(close)
        }
    }

    const setScale = () => {
        // 设计稿的标准宽高
        const designWidth = Number(changeStyleWithScale(stateConsumer.canvasStyleData.width));
        const designHeight = Number(changeStyleWithScale(stateConsumer.canvasStyleData.height));
        
        // 获取浏览器窗口实际宽高
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // 计算水平和垂直方向的缩放比例
        const scaleX = windowWidth / designWidth;
        const scaleY = windowHeight / designHeight;

        // 选择要进行缩放的容器元素,应用缩放变换，并保持中心对齐
        localState.transformStyle.transform = `scale(${Math.min(scaleX, scaleY)})`;
    }

    const exitFullScreen =(e:any)=>{
        if ( e.keyCode == 27) {
            close()
        }
    }
    

    useEffect(() => {
        // 页面加载时初始化一次缩放
        setScale()
        
        // 监听窗口大小变化事件并调用setScale函数更新缩放比例
        window.addEventListener('resize', setScale);
        window.addEventListener('keyup', exitFullScreen);
        
        return () => {
            window.removeEventListener('resize', setScale);
            window.removeEventListener('keyup', exitFullScreen);
        };
    }, []);



    return (
        <div ref={containerRef} className='preview'>
            {/* {!isScreenshot ? <Button text='关闭' className='close' onClick={close} /> : <Button text='确定' className='close' onClick={htmlToImage} />} */}
            {!!isScreenshot &&<Button text='确定' className='close' onClick={htmlToImage} />}
            <div className='preview-scale' style={localState.transformStyle}>
                <div className='preview-scale-canvas' style={{
                    ...getCanvasStyle(stateConsumer.canvasStyleData),
                    width: changeStyleWithScale(stateConsumer.canvasStyleData.width) + 'px',
                    height: changeStyleWithScale(stateConsumer.canvasStyleData.height) + 'px',
                }}>
                    {
                        localState.copyData.map((item, index) => (
                            <Fragment key={index}>
                                <ComponentWrapper config={item} />
                            </Fragment>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}