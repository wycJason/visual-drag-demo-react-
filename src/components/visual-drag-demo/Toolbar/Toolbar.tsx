import React, { useState, useEffect, useRef } from 'react';
import { derive, useProxy } from "valtio/utils";
import { proxy, useSnapshot } from 'valtio';

import classNames from 'classnames';

import './Toolbar.scss'

import store from "../../../store/index"

// dev组件
import { Switch } from "devextreme-react/switch";
import { Button } from 'devextreme-react/button';

import generateID from '../../../utils/visual-drag-demo/generateID'
import toast from '../../../utils/visual-drag-demo/toast'
import Preview from '../Editor/Preview/Preview'
import AceEditor from '../Editor/AceEditor/AceEditor'
import { commonStyle, commonAttr } from '../../../custom-component/component-list'
import PubSub from '../../../utils/visual-drag-demo/eventBus'
import { $ } from '../../../utils/visual-drag-demo/utils'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '../../../utils/visual-drag-demo/changeComponentsSizeWithScale'



export default () => {
    const stateConsumer = useProxy(store.state);
    const stateRender = useSnapshot(store.state);

    const [isShowPreview, setIsShowPreview] = useState(false);
    const [isShowAceEditor, setIsShowAceEditor] = useState(false);
    const [isScreenshot, setIsScreenshot] = useState(false);
    const [scale, setScale] = useState(100);
    const [switchValue, setSwitchValue] = useState(false);

    const handleToggleDarkMode = (value: boolean) => {
        if (value !== null) {
            store.toggleDarkMode(store.state, value)
            setSwitchValue(value)
        }
    }



    const handleAceEditorChange = () => {
        setIsShowAceEditor(!isShowAceEditor);
    }

    const closeEditor = () => {
        handleAceEditorChange()
    }

    const lock = () => {
        store.lock(store.state)
    }

    const unlock = () => {
        store.unlock(store.state)
    }

    const compose = () => {
        store.compose(store.state)
        store.recordSnapshot(store.state)
    }

    const decompose = () => {
        store.decompose(store.state)
        store.recordSnapshot(store.state)
    }


    const undo = () => {
        store.undo(store.state)
    }

    const redo = () => {
        store.redo(store.state)
    }

    const handleFileChange = (e: any) => {
        const file = e.target.files[0]
        if (!file.type.includes('image')) {
            toast('只能插入图片')
            return
        }

        const reader = new FileReader()
        reader.onload = (res: any) => {
            const fileResult = res.target.result
            const img = new Image()
            img.onload = () => {
                const component = {
                    ...commonAttr,
                    id: generateID(),
                    component: 'Picture',
                    label: '图片',
                    icon: '',
                    propValue: {
                        url: fileResult,
                        flip: {
                            horizontal: false,
                            vertical: false,
                        },
                    },
                    style: {
                        ...commonStyle,
                        top: 0,
                        left: 0,
                        width: img.width,
                        height: img.height,
                    },
                }
               
                // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
                changeComponentSizeWithScale(component)

                store.addComponent(store.state, { component, index: undefined })
                store.recordSnapshot(store.state)


                // 修复重复上传同一文件，@change 不触发的问题
                $('#input').setAttribute('type', 'text')
                $('#input').setAttribute('type', 'file')
            }
        
            img.src = fileResult
        }

        reader.readAsDataURL(file)
    }

    const preview = (isScreenshot: boolean) => {
        setIsScreenshot(isScreenshot)
        setIsShowPreview(true)
        store.setEditMode(store.state, 'preview')
    }

    const save = () => {
        localStorage.setItem('canvasData', JSON.stringify(store.state.componentData))
        localStorage.setItem('canvasStyle', JSON.stringify(store.state.canvasStyleData))
        toast('保存成功',"success")
    }


    const clearCanvas = () => {
        store.setCurComponent(store.state, { component: null, index: null })
        store.setComponentData(store.state, [])
        store.recordSnapshot(store.state)
    }


    const handlePreviewChange = () => {
        setIsShowPreview(false)
        store.setEditMode(store.state, 'edit')
    }


    const hanndleCanvasScaleChange = (value: any) => {
        setScale(value)
        changeComponentsSizeWithScale(value)
    }

    useEffect(() => {
        // 画布比例设一个最小值，不能为 0
        // eslint-disable-next-line no-bitwise

        setScale(scale || 1)
        changeComponentsSizeWithScale(scale)

        return () => {
            // 返回一个函数用来做清理工作，类似于 componentWillUnmount
        };
    }, [scale]); // 空依赖数组意味着仅在挂载时运行一次


    useEffect(() => {
        // 类似 componentDidMount 和 componentDidUpdate
        PubSub.subscribe('preview', (msg: any, data: any) => {
            preview(data)
        })

        PubSub.subscribe('save', (msg: any, data: any) => {
            save()
        })

        PubSub.subscribe('clearCanvas', (msg: any, data: any) => {
            clearCanvas()
        })

        setScale(store.state.canvasStyleData.scale)

        const savedMode = JSON.parse(localStorage.getItem('isDarkMode')!)
        if (savedMode) {
            handleToggleDarkMode(savedMode)
        }

        return () => {
            // 返回一个函数用来做清理工作，类似于 componentWillUnmount
        };
    }, []); // 空依赖数组意味着仅在挂载时运行一次




    return (
        <div>
            <div className={classNames([stateRender.isDarkMode ? 'dark toolbar' : 'toolbar'])}>
                <Button text='JSON' onClick={handleAceEditorChange} />
                <Button text='保存' onClick={save} />
                <Button text='预览' style={{ marginLeft: '10px' }} onClick={() => preview(false)} />
                <Button text='截图' onClick={() => preview(true)} />   
                <Button text='清空画布' onClick={clearCanvas} />
                <Button text='撤销' onClick={undo} />
                <Button text='重做' onClick={redo} />

                <label htmlFor='input' className="insert">
                    插入图片
                    <input
                        id="input"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </label>

               
                <Button text='组合' disabled={!stateRender.areaData.components.length} onClick={compose} />
                <Button text='拆分' disabled={!stateRender.curComponent || stateRender.curComponent.isLock || stateRender.curComponent.component != 'Group'} onClick={decompose} />
                <Button text='锁定' disabled={!stateRender.curComponent || stateRender.curComponent.isLock} onClick={lock} />
                <Button text='解锁' disabled={!stateRender.curComponent || !stateRender.curComponent.isLock} onClick={unlock} />
               
                <div className="canvas-config">
                    <span>画布大小</span>
                    <input type='text' value={stateConsumer.canvasStyleData.width} onChange={(e: any) => stateConsumer.canvasStyleData.width = e.target.value} />
                    <span>*</span>
                    <input type='text' value={stateConsumer.canvasStyleData.height} onChange={(e: any) => stateConsumer.canvasStyleData.height = e.target.value} />
                </div>

                <div className="canvas-config">
                    <span>画布比例</span>
                    <input value={scale} onChange={(e: any) => hanndleCanvasScaleChange(e.target.value)} /> %
                </div>

                <Switch style={{top:0,left:0}}  switchedOffText='OFF' switchedOnText='On' value={switchValue} onValueChanged={e => {
                    setSwitchValue(e.value)
                    handleToggleDarkMode(e.value)
                }} />
            </div>

            {/* 预览 */}
            {isShowPreview && <Preview isScreenshot={isScreenshot} onClose={handlePreviewChange} />}
            {isShowAceEditor && <AceEditor onCloseEditor={closeEditor} />}
        </div>
    )
}