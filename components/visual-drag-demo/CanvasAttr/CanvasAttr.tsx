import React, { useState, useEffect, useMemo, Fragment } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';
import './CanvasAttr.scss'

import { ColorBox } from 'devextreme-react/color-box';
import { NumberBox } from "devextreme-react/number-box";


import store from "../../../store/index"

const options: Record<string, string> = {
    color: '颜色',
    opacity: '不透明度',
    backgroundColor: '背景色',
    fontSize: '字体大小',
}

export default () => {
    const stateConsumer = useProxy(store.state);

    const isIncludesColor = (str: string) => {
        return str.toLowerCase().includes('color')
    }


    return (
        <div className='attr-container'>
            <p className="title">画布属性</p>
            {
                Object.keys(options).map((key, index) => (
                    <Fragment key={index}>
                        {
                            isIncludesColor(key) ?
                                <ColorBox showClearButton={true} label={options[key]} applyButtonText='确定' cancelButtonText='取消' value={stateConsumer.canvasStyleData[key]} editAlphaChannel={false} onValueChange={(value: any) => {
                                    stateConsumer.canvasStyleData[key] = value
                                }} /> :
                                <NumberBox showClearButton={false} label={options[key]} valueChangeEvent='keyup' value={Number(stateConsumer.canvasStyleData[key])} onValueChange={(value: any) => {
                                    stateConsumer.canvasStyleData[key] = Number(value)
                                }} />
                        }
                    </Fragment>
                ))
            }
        </div>
    )
}