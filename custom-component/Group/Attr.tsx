import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';
import { useProxy } from 'valtio/utils';
import { useImmer } from 'use-immer';

import CommonAttr from '../common/CommonAttr/CommonAttr'


export default () => {
    return (
        <div className="attr-list">
            <CommonAttr />
        </div>
    )
}