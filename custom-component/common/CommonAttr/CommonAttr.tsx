import React, { useState, useEffect, useMemo, Fragment } from 'react';
import classNames from 'classnames';
import { useProxy } from 'valtio/utils';

import { Accordion } from 'devextreme-react/accordion';
import { ColorBox } from 'devextreme-react/color-box';
import { TextBox } from 'devextreme-react/text-box';
import { NumberBox } from "devextreme-react/number-box";
import { SelectBox } from 'devextreme-react/select-box';


import './CommonAttr.scss'


import { styleData, textAlignOptions, borderStyleOptions, verticalAlignOptions, selectKey, optionMap } from '../../../utils/visual-drag-demo/attr'
import store from '../../../store/index'

// 有几项,就有几个折叠面板
const accordionItems = [{
    title: "通用样式",
    name: "style"
},
    // {
    //     title: "其它属性",
    //     name: "props"
    // }
]

// 标题
function CustomTitle(item: any) {
    return (
        <>{item.title}</>
    );
}

// 内容
function CustomItem(item: any) {
    const stateConsumer = useProxy(store.state)

    const isIncludesColor = (str: any) => {
        return str.toLowerCase().includes('color')
    }

    const styleKeys = useMemo(() => {
        if (stateConsumer.curComponent) {
            const curComponentStyleKeys = Object.keys(stateConsumer.curComponent?.style)
            return styleData.filter(item => curComponentStyleKeys.includes(item.key))
        }
        return []

    }, [stateConsumer.curComponent])



    let renderContent = null;

    switch (item.name) {
        case "style":
            renderContent = <>
                {
                    styleKeys.map(({ key, label }, index) => (
                        <div key={index}>
                            {
                                isIncludesColor(key) ?
                                    <ColorBox showClearButton={true} label={label} applyButtonText='确定' cancelButtonText='取消' value={stateConsumer.curComponent?.style[key]} editAlphaChannel={false} onValueChange={(value: any) => {
                                        stateConsumer.curComponent.style[key] = value
                                    }} /> :
                                    selectKey.includes(key) ? <SelectBox showClearButton={false} placeholder='' label={label} searchEnabled={true} dataSource={optionMap[key as "textAlign" | "borderStyle" | "verticalAlign"]} valueExpr="value" displayExpr="label" value={stateConsumer.curComponent.style[key]} onValueChange={(value: any) => {
                                        stateConsumer.curComponent.style[key] = value
                                    }} /> :
                                        <NumberBox showClearButton={false} label={label} valueChangeEvent='keyup' value={Number(stateConsumer.curComponent?.style[key])} onValueChange={(value: any) => {
                                            stateConsumer.curComponent.style[key] = Number(value)
                                        }} />
                            }

                        </div>
                    ))
                }
            </>
            break;
        default:
            renderContent = <>{item.title}</>
            break;
    }




    return renderContent
}


export default () => {
    const [selectedItems, setSelectedItems] = useState([accordionItems[0]]);

    const selectionChanged = (e: any) => {
        let newItems: any = [...selectedItems];
        e.removedItems.forEach((item: any) => {
            const index = newItems.indexOf(item);
            if (index >= 0) {
                newItems.splice(index, 1);
            }
        });
        if (e.addedItems.length) {
            newItems = [...newItems, ...e.addedItems];
        }
        setSelectedItems(newItems);
    };

    return (
        <div className='v-common-attr'>
            <Accordion
                dataSource={accordionItems}
                collapsible={true}
                multiple={true}
                selectedItems={selectedItems}
                onSelectionChanged={selectionChanged}
                itemTitleRender={CustomTitle}
                itemRender={CustomItem}
            />
        </div>
    )
}