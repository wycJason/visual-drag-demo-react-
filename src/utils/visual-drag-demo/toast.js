import notify from 'devextreme/ui/notify';

// The message's type: "info", "warning", "error" or "success".
export default function toast(message = '', type = 'warning', duration = 1500) {
    notify({
        message,
        type,
        duration,
    })
}