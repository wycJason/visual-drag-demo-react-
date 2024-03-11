export function deepCopy(target) {
    if (typeof target == 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] == 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }

        return result
    }

    return target
}

export function swap(arr, i, j) {
    if (i >= 0 && i < arr.length && j >= 0 && j < arr.length) {
        // 确保索引有效
        const temp = arr[i]; // 将第一个位置的元素保存到临时变量
        arr[i] = arr[j]; // 将第二个位置的元素赋值给第一个位置
        arr[j] = temp; // 将临时变量的值赋给第二个位置
    } else {
        console.error('Invalid array indices provided.');
    }
}

export function $(selector) {
    return document.querySelector(selector)
}

const components = ['VText', 'RectShape', 'CircleShape']
export function isPreventDrop(component) {
    return !components.includes(component) && !component.startsWith('SVG')
}
