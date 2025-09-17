export type NotificationType = 'success' | 'error';

export const showNotification = (title: string, message: string, type: NotificationType = 'success') => {
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: type === 'success' ? '/src/assets/icon/success.png' : '/src/assets/icon/error.png',
                    tag: 'schecker-update',
                });
            }
        });
    }
};
