import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';
import './AceEditor.scss'

import { Button } from 'devextreme-react/button';

// 本地存储

import store from '../../../../store/index';

// Ace是一个用JavaScript编写的代码编辑器。官网：https://ace.c9.io/    csdn:https://blog.csdn.net/u014155085/article/details/124794409?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170979303816800222866534%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=170979303816800222866534&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-124794409-null-null.142^v99^pc_search_result_base1&utm_term=ace-builds%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3&spm=1018.2226.3001.4187
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-one_dark'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/mode-json5'
import 'ace-builds/src-min-noconflict/ext-language_tools'

const localStore = proxy({
    obj: null as any,
})

export default ({ onCloseEditor }: { onCloseEditor: () => void }) => {
    const stateConsumer = useProxy(store.state)
    const localState = useProxy(store.state)

    const editorRef = useRef<any>(null)
    const aceRef = useRef<any>(null)

    const setCode = () => {
        localState.obj = stateConsumer.curComponent || stateConsumer.canvasStyleData
        editorRef.current.setValue(JSON.stringify(localState.obj, null, 4))
    }

    const getCode = () => {
        let str = editorRef.current.getValue()
        if (!stateConsumer.curComponent) {
            store.aceSetCanvasData(store.state, JSON.parse(str))
        } else {
            store.aceSetcurComponent(store.state, JSON.parse(str))
        }
    }

    const updateEditorTheme = (theme: string) => {
        editorRef.current.setTheme(theme)
    }

    const openSearchBox = () => {
        editorRef.current.execCommand('find')
    }

    const closeEditor = () => {
        onCloseEditor()
    }

    useEffect(() => {
        if (aceRef.current) {
            // ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
            editorRef.current = ace.edit(aceRef.current, {
                maxLines: 34,
                minLines: 34,
                fontSize: 14,
                // theme: 'ace/theme/one_dark',
                mode: 'ace/mode/json5',
                tabSize: 4,
                readOnly: false,
                highlightActiveLine: true,
                fadeFoldWidgets: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
            })

            localState.obj = stateConsumer.curComponent || stateConsumer.canvasStyleData
            editorRef.current.setValue(JSON.stringify(localState.obj, null, 4))
        }
    }, []);


    useEffect(() => {
        setCode()
    }, [stateConsumer.curComponent, stateConsumer.canvasStyleData]);



    return (
        <div className='ace'>
            <div className='btn-alignment'>
                <Button text='查找' type='normal' onClick={openSearchBox} className='btn'  icon='find' />
                <Button text='关闭' type='default' onClick={closeEditor} className='btn'  icon='close' />
                <Button text='重置代码' type='danger' className='btn' onClick={setCode}  icon='revert'/>
                <Button text='应用更改' type='success' className='btn' onClick={getCode} icon="save"/>
            </div>
            <div className='ace-editor'>
                <div className='editor' ref={aceRef}></div>
            </div>
        </div>
    )
}