import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useProxy } from 'valtio/utils';

import store from '../../store/index'

import { TextArea } from 'devextreme-react/text-area';
import { TextBox } from 'devextreme-react/text-box';
import { CheckBox } from 'devextreme-react/cjs/check-box';
import CommonAttr from '../common/CommonAttr/CommonAttr'
import { proxy } from 'valtio';
import { SelectBox } from 'devextreme-react/cjs/select-box';

const localStore = proxy({
    charts: [
        {
            value: 'bar',
            label: '柱状图',
        },
        {
            value: 'line',
            label: '折线图',
        },
        {
            value: 'scatter',
            label: '散点图',
        },
    ]
})
export default () => {
    const stateConsumer = useProxy(store.state);
    const localState = useProxy(localStore);

    const handleVChartChange = ({ component, prop, value }: { component: string, prop: string, value: any }) => {
        stateConsumer.curComponent.propValue.option[component][prop] = value
    }

    const option = useMemo(() => {
        return stateConsumer.curComponent.propValue.option
    }, [stateConsumer.curComponent.propValue.option])


    return (
        <div className='attr-list'>
            <CommonAttr />

            <div style={{ display: 'grid', grid: "auto/1fr", gridGap: "10px 0" }}>
                <CheckBox
                    text='标题'
                    value={option.title.show}
                    onValueChange={v => handleVChartChange({ component: 'title', prop: 'show', value: v })}
                />
                <CheckBox
                    text='工具提示'
                    value={option.tooltip.show}
                    onValueChange={v => handleVChartChange({ component: 'tooltip', prop: 'show', value: v })}
                />
                <CheckBox
                    text='图例'
                    value={option.legend.show}
                    onValueChange={v => handleVChartChange({ component: 'legend', prop: 'show', value: v })}
                />
                <CheckBox
                    text='横坐标'
                    value={option.xAxis.show}
                    onValueChange={v => handleVChartChange({ component: 'xAxis', prop: 'show', value: v })}
                />
                <CheckBox
                    text='纵坐标'
                    value={option.yAxis.show}
                    onValueChange={v => handleVChartChange({ component: 'yAxis', prop: 'show', value: v })}
                />
                <SelectBox
                    showClearButton={false}
                    placeholder=''
                    label="图表类型"
                    searchEnabled={true}
                    dataSource={localState.charts}
                    valueExpr="value"
                    displayExpr="label"
                    value={option.series.type}
                    onValueChange={(value: any) => handleVChartChange({ component: 'series', prop: 'type', value: value })} />
                <TextBox
                    label='名称'
                    valueChangeEvent="input"
                    value={stateConsumer.curComponent.propValue.caption}
                    onValueChange={v => stateConsumer.curComponent.propValue.caption = v}
                />
                <TextBox
                    label='标题文本'
                    valueChangeEvent="input"
                    value={option.title.text}
                    onValueChange={v => handleVChartChange({ component: 'title', prop: 'text', value: v })}
                />
            </div>
        </div>
    )
}