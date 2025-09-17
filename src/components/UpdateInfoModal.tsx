import { Download, LogOut, AlertTriangle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UpdateStatus } from '../types/electron';
import type { IpcRendererEvent } from 'electron';
import { showNotification } from '../utils/notifications';

interface UpdateInfo {
    currentVersion: string;
    newVersion: string;
    releaseName?: string;
    releaseNotes?: string;
    releaseDate?: string;
}

interface UpdateInfoModalProps {
    updateInfo: UpdateInfo;
}

function UpdateInfoModal({ updateInfo }: UpdateInfoModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [downloadSpeed, setDownloadSpeed] = useState<string>('');
    const [downloadedSize, setDownloadedSize] = useState<string>('');
    const [totalSize, setTotalSize] = useState<string>('');

    useEffect(() => {
        if (window.electronAPI) {
            const handleUpdateStatus = (_event: IpcRendererEvent, status: UpdateStatus) => {
                if (status.event === 'download-progress' && status.data?.percent != null) {
                    setDownloadProgress(status.data.percent);
                    setDownloadSpeed(status.data.speed || '');
                    setDownloadedSize(status.data.downloadedSize || '');
                    setTotalSize(status.data.totalSize || '');

                    if (status.data.percent === 100) {
                        showNotification(
                            'Download Complete',
                            'Update has been downloaded and will be installed',
                            'success',
                        );
                    }
                } else if (status.event === 'update-error' && status.data?.error) {
                    setDownloadError(status.data.error);
                    setIsDownloading(false);
                    showNotification('Download Failed', status.data.error || 'Failed to download update', 'error');
                } else if (status.event === 'download-cancelled') {
                    setIsDownloading(false);
                    setDownloadProgress(0);
                    setDownloadSpeed('');
                    setDownloadedSize('');
                    setTotalSize('');
                    showNotification('Download Cancelled', 'Update download has been cancelled', 'error');
                } else if (status.event === 'update-downloaded') {
                    showNotification('Update Ready', 'The application will be updated and restarted', 'success');
                    window.electronAPI.installUpdate();
                }
            };

            window.electronAPI.onUpdateStatus(handleUpdateStatus);
            return () => {
                window.electronAPI.removeUpdateStatusListener(handleUpdateStatus);
            };
        }
    }, []);

    const handleUpdate = async () => {
        if (window.electronAPI) {
            setIsDownloading(true);
            setDownloadError(null);
            try {
                showNotification('Downloading Update', 'The update download has started', 'success');
                await window.electronAPI.downloadUpdate();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to download update';
                setDownloadError(errorMessage);
                setIsDownloading(false);
                showNotification('Download Failed', errorMessage, 'error');
            }
        }
    };

    const handleQuit = () => {
        if (window.electronAPI) {
            window.electronAPI.quitApp();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl w-full max-w-2xl p-8 m-4">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Đã có phiên bản mới!
                    </h2>
                </div>

                {/* Version Info */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="min-w-[160px] bg-white/5 rounded-lg p-3">
                            <span className="text-gray-400">Phiên bản hiện tại</span>
                            <p className="text-lg font-semibold text-white">{updateInfo.currentVersion}</p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="min-w-[160px] bg-blue-500/10 rounded-lg p-3">
                            <span className="text-blue-400">Phiên bản mới</span>
                            <p className="text-lg font-semibold text-white">{updateInfo.newVersion}</p>
                        </div>
                    </div>

                    {updateInfo.releaseName && (
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold text-white mb-1">{updateInfo.releaseName}</h3>
                            {updateInfo.releaseDate && (
                                <p className="text-sm text-gray-400">
                                    Phát hành vào {new Date(updateInfo.releaseDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Release Notes */}
                    {updateInfo.releaseNotes && (
                        <div className="bg-white/5 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Nội dung cập nhật</h3>
                            <div
                                className="text-gray-300 prose prose-invert max-h-64 overflow-y-auto"
                                dangerouslySetInnerHTML={{ __html: updateInfo.releaseNotes }}
                            />
                        </div>
                    )}
                </div>

                {/* Download Progress or Error */}
                {(isDownloading || downloadError) && (
                    <div className="mb-6">
                        {downloadError ? (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    <h3 className="text-lg font-semibold text-red-400">Tải xuống thất bại</h3>
                                </div>
                                <p className="text-gray-300">{downloadError}</p>
                            </div>
                        ) : (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                                        <span className="text-blue-400">Đang tải bản cập nhật...</span>
                                    </div>
                                    <span className="text-blue-400 font-semibold">{Math.round(downloadProgress)}%</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                                    <div
                                        className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${downloadProgress}%` }}
                                    />
                                </div>

                                {/* Download Info */}
                                <div className="flex items-center justify-between text-sm text-gray-300">
                                    <div className="flex items-center gap-4">
                                        {downloadSpeed && (
                                            <span>
                                                Tốc độ: <span className="text-blue-400">{downloadSpeed}</span>
                                            </span>
                                        )}
                                        {downloadedSize && totalSize && (
                                            <span>
                                                Đã tải: <span className="text-blue-400">{downloadedSize}</span> /
                                                <span className="text-blue-400"> {totalSize}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        onClick={handleQuit}
                        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Thoát
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isDownloading}
                        className={`${
                            isDownloading
                                ? 'bg-gray-600/50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        } text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2`}
                    >
                        <Download className="w-5 h-5" />
                        {isDownloading ? 'Đang tải...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateInfoModal;
