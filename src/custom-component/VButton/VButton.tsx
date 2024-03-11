import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';

import { Button } from 'devextreme-react/button';
import './VButton.scss'
import { IProps } from '../DynamicComponent'


export default ({ element, propValue, id, style, className }: IProps) => {
    return (
        <Button className={classNames('v-button', className)} id={id} style={style} text={propValue.caption} />
    )
}