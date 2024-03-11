import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import './VText.scss'
import { IProps } from '../DynamicComponent'

export default ({ element, propValue, id, style, className }: IProps) => {
    return (
        <div className={classNames('v-text',  className)} style={style} id={id}>
            <div style={{ verticalAlign: element!.style.verticalAlign }} dangerouslySetInnerHTML={{ __html: propValue.caption }}></div>
        </div>
    )
}