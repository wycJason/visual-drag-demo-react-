import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';
import './Area.scss'

interface IProps {
    start: Record<string, any>
    width: number
    height: number
    show:boolean
    [key: string]: any
}

export default ({ start, width, height,show }: IProps) => {
    return (
        <div style={{
            display: show ? 'block' : 'none',
            left: start.x + 'px',
            top: start.y + 'px',
            width: width + 'px',
            height: height + 'px',
        }} className='area'>

        </div>
    )
}