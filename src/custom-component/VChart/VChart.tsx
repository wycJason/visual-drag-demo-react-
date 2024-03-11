import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { proxy, useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import './VChart.scss'
import store from '../../store/index';
import ReactECharts from 'echarts-for-react';
import { IProps } from '../DynamicComponent';


export default ({ propValue, id, style, className }: IProps) => {
    return (
        <div id={id} className={classNames(className)} style={style}>
            <ReactECharts option={propValue.option}  className='r-chart'/>
        </div>
    )
}