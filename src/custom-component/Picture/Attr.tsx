import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import store from "../../store/index"
import CommonAttr from '../common/CommonAttr/CommonAttr'
import { CheckBox } from 'devextreme-react/check-box'
import { TextArea } from 'devextreme-react/text-area';
import { TextBox } from 'devextreme-react/text-box';

export default () => {
    const stateConsumer = useProxy(store.state);

    return (
        <div className='attr-list'>
            <CommonAttr />

            <div style={{ display: 'grid', grid: "auto/1fr", gridGap: "10px 0" }}>
                <CheckBox
                    text='水平翻转'
                    value={stateConsumer.curComponent.propValue.flip.horizontal}
                    onValueChanged={e => {
                        stateConsumer.curComponent.propValue.flip.horizontal = e.value
                    }}
                />
                <CheckBox
                    text='垂直翻转'
                    value={stateConsumer.curComponent.propValue.flip.vertical}
                    onValueChanged={e => {
                        stateConsumer.curComponent.propValue.flip.vertical = e.value
                    }}
                />
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