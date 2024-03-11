import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import './Group.scss'
import { IProps } from '../DynamicComponent'

import DynamicComponent from '../DynamicComponent';

export default ({ id, propValue, element, style, className }: IProps) => {
    return (
        <div id={id} className={classNames('group', className)} style={style}>
            <div>
                {
                    propValue?.map((item: any) => (
                        <Fragment key={item.id}>
                            <DynamicComponent
                                is={item.component}
                                id={'component' + item.id}
                                className="component"
                                style={item.groupStyle}
                                propValue={item.propValue}
                                element={item}
                            />
                        </Fragment>
                    ))
                }
            </div>
        </div>
    )
}