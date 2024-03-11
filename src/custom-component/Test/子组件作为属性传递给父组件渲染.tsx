import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSnapshot } from 'valtio';
import { useImmer } from 'use-immer';

// 子组件
const ChildComponent = () => {
    return <div>我是子组件</div>;
};

// 父组件
const ParentComponent = (props: any) => {
    // 使用props.childProp作为子组件
    return (
        <div>
            <div>这是父组件</div>
            {props.childProp}
        </div>
    );
};

// 在App组件中使用ParentComponent，并传递ChildComponent作为属性
const App = () => {
    return (
        <ParentComponent childProp={<ChildComponent />} />
    );
};

export default App;