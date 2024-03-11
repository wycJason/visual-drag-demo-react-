import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';


import './ContextMenu.scss'
import store from '../../../../store/index';

const lock = () => {
    store.lock(store.state)
}

const unlock = () => {
    store.unlock(store.state)
}

// 点击菜单时不取消当前组件的选中状态
const handleMouseUp = () => {
    store.setClickComponentStatus(store.state, true)
}

const cut = () => {
    store.cut(store.state)
}

const copy = () => {
    store.copy(store.state)
}

const paste = () => {
    store.paste(store.state, true)
    store.recordSnapshot(store.state)
}

const deleteComponent = () => {
    store.deleteComponent(store.state)
    store.recordSnapshot(store.state)
}

const upComponent = () => {
    store.upComponent(store.state)
    store.recordSnapshot(store.state)
}

const downComponent = () => {
    store.downComponent(store.state)
    store.recordSnapshot(store.state)
}

const topComponent = () => {
    store.topComponent(store.state)
    store.recordSnapshot(store.state)
}

const bottomComponent = () => {
    store.bottomComponent(store.state)
    store.recordSnapshot(store.state)
}




export default () => {
    const [copyData, setCopyData] = useState(null)
    const stateRender = useSnapshot(store.state)


    
    return (
        <div className="contextmenu" style={{ display: stateRender.menuShow ? 'block' : 'none', top: stateRender.menuTop + 'px', left: stateRender.menuLeft + 'px' }}>
            <ul onMouseUp={handleMouseUp}>
                {
                    stateRender.curComponent ? (
                        !stateRender.curComponent.isLock ? (
                            <>
                                <li onClick={copy}>复制</li>
                                <li onClick={paste}>粘贴</li>
                                <li onClick={cut}>剪切</li>
                                <li onClick={deleteComponent}>删除</li>
                                <li onClick={lock}>锁定</li>
                                <li onClick={topComponent}>置顶</li>
                                <li onClick={bottomComponent}>置底</li>
                                <li onClick={upComponent}>上移</li>
                                <li onClick={downComponent}>下移</li>
                            </>
                        ) : <li onClick={unlock}>解锁</li>
                    ) : <li onClick={paste}>粘贴</li>
                }
            </ul>
        </div>
    )
}