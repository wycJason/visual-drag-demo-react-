import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useProxy } from 'valtio/utils';

import store from '../../store/index'

import { TextArea } from 'devextreme-react/text-area';
import { TextBox } from 'devextreme-react/text-box';

import CommonAttr from '../common/CommonAttr/CommonAttr'


export default () => {
    const stateConsumer = useProxy(store.state);

    return (
        <div className='attr-list'>
            <CommonAttr />
            
            <div style={{ display: 'grid', grid: "auto/1fr", gridGap: "10px 0" }}>
            <TextBox
                    label='内容'
                    valueChangeEvent="input"
                    value={stateConsumer.curComponent.propValue.caption}
                    onValueChange={v => stateConsumer.curComponent.propValue.caption = v}
                />
            </div>
        </div>
    )
}