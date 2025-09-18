import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface UpdateStatus {
    event: string;
    data?: any;
}

const UpdateNotification: React.FC = () => {
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        // Listen for update status events
        const handleUpdateStatus = (_event: any, status: UpdateStatus) => {
            console.log('Update status:', status);
            setUpdateStatus(status);
            setIsVisible(true);

            if (status.event === 'download-progress' && status.data?.percent) {
                setDownloadProgress(status.data.percent);
            }

            // Auto-hide some notifications after 5 seconds
            if (status.event === 'update-not-available' || status.event === 'update-error') {
                setTimeout(() => {
                    setIsVisible(false);
                }, 5000);
            }
        };

        // Register listener
        if (window.electronAPI?.onUpdateStatus) {
            window.electronAPI.onUpdateStatus(handleUpdateStatus);
        }

        // Cleanup listener on unmount
        return () => {
            if (window.electronAPI?.removeUpdateStatusListener) {
                window.electronAPI.removeUpdateStatusListener(handleUpdateStatus);
            }
        };
    }, []);

    const handleInstallUpdate = async () => {
        try {
            await window.electronAPI?.installUpdate();
        } catch (error) {
            console.error('Failed to install update:', error);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        setUpdateStatus(null);
    };

    if (!isVisible || !updateStatus) {
        return null;
    }

    const getNotificationContent = () => {
        switch (updateStatus.event) {
            case 'update-available':
                return {
                    icon: <Download className="w-5 h-5 text-blue-600" />,
                    title: 'Update Available',
                    message: `Version ${updateStatus.data?.version} is available for download.`,
                    bgColor: 'bg-blue-50 border-blue-200',
                    textColor: 'text-blue-800',
                    showAction: false,
                };

            case 'download-progress':
                return {
                    icon: <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />,
                    title: 'Downloading Update',
                    message: `Progress: ${downloadProgress}%`,
                    bgColor: 'bg-blue-50 border-blue-200',
                    textColor: 'text-blue-800',
                    showAction: false,
                    showProgress: true,
                };

            case 'update-downloaded':
                return {
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                    title: 'Update Ready',
                    message: `Version ${updateStatus.data?.version} is ready to install.`,
                    bgColor: 'bg-green-50 border-green-200',
                    textColor: 'text-green-800',
                    showAction: true,
                    actionText: 'Restart & Install',
                    action: handleInstallUpdate,
                };

            case 'update-not-available':
                return {
                    icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
                    title: 'No Updates',
                    message: 'You are running the latest version.',
                    bgColor: 'bg-gray-50 border-gray-200',
                    textColor: 'text-gray-800',
                    showAction: false,
                };

            case 'update-error':
                return {
                    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
                    title: 'Update Error',
                    message: updateStatus.data?.error || 'Failed to check for updates.',
                    bgColor: 'bg-red-50 border-red-200',
                    textColor: 'text-red-800',
                    showAction: false,
                };

            default:
                return null;
        }
    };

    const content = getNotificationContent();
    if (!content) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className={`${content.bgColor} border rounded-lg shadow-lg p-4 ${content.textColor}`}>
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">{content.icon}</div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium">{content.title}</h4>
                        <p className="text-sm opacity-90 mt-1">{content.message}</p>

                        {content.showProgress && (
                            <div className="mt-2">
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${downloadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {content.showAction && content.action && (
                            <button
                                onClick={content.action}
                                className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                {content.actionText}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotification;
