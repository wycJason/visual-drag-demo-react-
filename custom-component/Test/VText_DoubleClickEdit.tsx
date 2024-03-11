import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import './VText.scss'
import { keycodes } from '../../utils/visual-drag-demo/shortcutKey';
import PubSub from '../../utils/visual-drag-demo/eventBus';

import { IProps } from '../DynamicComponent'
import store from '../../store/index'


// 本地存储
const localStore = proxy({
    canEdit: false,
    ctrlKey: 17,
    isCtrlDown: false,
    cancelRequest: null,
})

export default ({ element, propValue, id, style, className, onInput }: IProps) => {
    const localState = useProxy(localStore)
    const stateConsumer = useProxy(store.state)
    const textRef = useRef<any>(null)

    const onComponentClick = () => {
        // 如果当前点击的组件 id 和 VText 不是同一个，需要设为不允许编辑 https://github.com/woai3c/visual-drag-demo/issues/90
        if (stateConsumer.curComponent.id !== element!.id) {
            localState.canEdit = false
        }
    }

    const handleInput = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        onInput(element, e.target.innerHTML)
    }

    const handleKeydown = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        // 阻止冒泡，防止触发复制、粘贴组件操作
        localState.canEdit && syntheticEvent.stopPropagation()
        
        if (e.keyCode == localState.ctrlKey) {
            localState.isCtrlDown = true
        } else if (localState.isCtrlDown && localState.canEdit && keycodes.includes(e.keyCode)) {
            syntheticEvent.stopPropagation()
        } else if (e.keyCode == 46) { // deleteKey
            syntheticEvent.stopPropagation()
        }
    }

    const handleKeyup = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        // 阻止冒泡，防止触发复制、粘贴组件操作
        localState.canEdit && syntheticEvent.stopPropagation()

        if (e.keyCode == localState.ctrlKey) {
            localState.isCtrlDown = false
        }
    }

    const handleMousedown = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        if (localState.canEdit) {
            syntheticEvent.stopPropagation()
        }
    }

    const clearStyle = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        syntheticEvent.preventDefault()
        const clp = e.clipboardData
        const text = clp.getData('text/plain') || ''
        if (text !== '') {
            document.execCommand('insertText', false, text)
        }

        onInput(element, e.target.innerHTML)
    }

    const handleBlur = (syntheticEvent: any) => {
        const e = syntheticEvent.nativeEvent;
        if( !stateConsumer.curComponent) return

        stateConsumer.curComponent.propValue = e.target.innerHTML || '&nbsp;'
        const html = e.target.innerHTML
        if (html !== '') {
            stateConsumer.curComponent.propValue = e.target.innerHTML
        } else {
            stateConsumer.curComponent.propValue = ''
            setTimeout(() => {
                stateConsumer.curComponent.propValue = '&nbsp;'
            })

        }
        localState.canEdit = false
    }


    const setEdit = () => {
        if (element?.isLock) return

        localState.canEdit = true
        // 全选
        selectText(textRef.current)
    }

    const selectText = (element: any) => {
        const selection: any = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(element)
        selection.removeAllRanges()
        selection.addRange(range)
    }



    useEffect(() => {
        const token = PubSub.subscribe('componentClick', onComponentClick)
        return () => {
            PubSub.unsubscribe(token);
        };
    }, []);



    return (
        <>
            {
                stateConsumer.editMode == 'edit' ? <div className={classNames('v-text', className)} style={style} id={id} onKeyDown={handleKeydown} onKeyUp={handleKeyup}>
                    {/* tabindex >= 0 使得双击时聚焦该元素 */}
                    <div
                        ref={textRef}
                        contentEditable={localState.canEdit}
                        className={classNames({ canEdit: localState.canEdit })}
                        style={{ verticalAlign: element!.style.verticalAlign }}
                        onDoubleClick={setEdit}
                        onPaste={clearStyle}
                        onMouseDown={handleMousedown}
                        onBlur={handleBlur}
                        onInput={handleInput}
                        dangerouslySetInnerHTML={{ __html: element!.propValue }}
                    ></div>
                </div> : <div className={classNames('v-text','preview', className)} style={style} id={id}>
                    <div style={{ verticalAlign: element!.style.verticalAlign }} dangerouslySetInnerHTML={{ __html: element!.propValue }}></div>
                </div>
            }
        </>
    )
}