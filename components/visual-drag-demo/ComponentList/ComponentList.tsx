import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import './ComponentList.scss'
import list from '../../../custom-component/component-list'

export default () => {
    const [componentList, setComponentList] = useState(list)

    const handleDragStart = (e: any) => {
        e.dataTransfer.setData('index', e.target.dataset.index)
    }

    return (
        <div className='component-list' onDragStart={handleDragStart}>
            {
                componentList.map((item: any, index: any) => (
                    <div key={index} className="list" title={item.label} draggable data-index={index}>
                        {item.icon.substr(0, 2) === 'dx' ? <span className={classNames("icon",item.icon)}></span> : <span className={classNames("iconfont", 'icon-' + item.icon)}></span>}
                        <span>{item.label}</span>
                    </div>
                ))
            }
        </div>
    )
}