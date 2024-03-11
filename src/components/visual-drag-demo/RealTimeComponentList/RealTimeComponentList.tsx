import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';

import './RealTimeComponentList.scss'
import store from '../../../store/index';

const getComponent = (index: number) => {
    return store.state.componentData[store.state.componentData.length - 1 - index]
}

const transformIndex = (index: number) => {
    return store.state.componentData.length - 1 - index
}

const onClick = (index: number) => {
    if (!store.state.rightList) {
        store.isShowRightList(store.state)
    }
    setCurComponent(index)
}

const deleteComponent = (index: number) => {
    setTimeout(() => {
        store.deleteComponent(store.state)
        store.recordSnapshot(store.state)
    })
}

const upComponent = (index: number) => {
    setTimeout(() => {
        store.upComponent(store.state)
        store.recordSnapshot(store.state)
    })
}

const downComponent = (index: number) => {
    setTimeout(() => {
        store.downComponent(store.state)
        store.recordSnapshot(store.state)
    })
}


const setCurComponent = (index: number) => {
    store.setCurComponent(store.state, { component: store.state.componentData[index], index })
}


export default () => {
    const stateRender = useSnapshot(store.state)

    return (
        <div className="real-time-component-list">
            {
                stateRender.componentData.map((item: any, index: number) => (
                    <div key={index} className={classNames('list', { actived: transformIndex(index) === stateRender.curComponentIndex })} onClick={() => onClick(transformIndex(index))}>
                        {getComponent(index).icon.substr(0, 2) === 'dx' ? <span className={classNames("icon",getComponent(index).icon)}></span> :  <span className={classNames('iconfont', 'icon-' + getComponent(index).icon)}></span>}
                        <span>{getComponent(index).label}</span>
                        <div className="icon-container">
                            <span className='iconfont icon-shangyi' onClick={() => upComponent(transformIndex(index))}></span>
                            <span className='iconfont icon-xiayi' onClick={() => downComponent(transformIndex(index))}></span>
                            <span className='iconfont icon-shanchu' onClick={() => deleteComponent(transformIndex(index))}></span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}