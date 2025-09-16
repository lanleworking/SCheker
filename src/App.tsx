import { useState } from 'react';
import { Monitor, RefreshCw, HardDrive, Download } from 'lucide-react';
import type { SystemInfo } from './utils/systemInfo';
import SystemOverview from './components/SystemOverview';
import CPUCard from './components/CPUCard';
import MemoryCard from './components/MemoryCard';
import StorageCard from './components/StorageCard';
import NetworkCard from './components/NetworkCard';
import GPUCard from './components/GPUCard';
import DisplayCard from './components/DisplayCard';
import DetailedHardwareInfo from './components/DetailedHardwareInfo';
import ExportModal from './components/ExportModal';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [loading, setLoading] = useState(false); // Changed to false since we start with welcome screen
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [hasStarted, setHasStarted] = useState(false); // New state for welcome screen

    const handleStartDeviceScan = () => {
        setHasStarted(true);
        fetchSystemInfo();
    };

    const handleExport = async (filename: string, fileType: 'excel' | 'pdf' | 'json' | 'word', savePath: string) => {
        try {
            setIsExporting(true);
            if (window.electronAPI && systemInfo) {
                await window.electronAPI.exportData(systemInfo, filename, fileType, savePath);
                const extension = fileType === 'excel' ? 'xlsx' : fileType === 'word' ? 'docx' : fileType;
                alert(`Export file thành công ${savePath}/${filename}.${extension}`);
            } else {
                alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Đã có lỗi xảy ra khi yêu cầu xuất file. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    const fetchSystemInfo = async () => {
        try {
            if (!systemInfo) {
                setLoading(true);
            }
            setError(null);
            if (window.electronAPI) {
                const info = await window.electronAPI.getSystemInfo();
                setSystemInfo(info);
                setLastUpdate(new Date());
            } else {
                // No ElectronAPI available - show error
                console.error('ElectronAPI not available');
                setError('ElectronAPI không khả dụng.');
                setSystemInfo(null);
            }
        } catch (err) {
            console.error('Error fetching system info:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch system information');
            setSystemInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Show welcome screen if user hasn't started yet
    if (!hasStarted) {
        return <WelcomeScreen onStart={handleStartDeviceScan} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Đang tải thông tin máy...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Lỗi</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={fetchSystemInfo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Tải lại
                    </button>
                </div>
            </div>
        );
    }

    if (!systemInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-300">Không có thông tin hệ thống</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-8 h-8 text-blue-400" />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                SChecker
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {lastUpdate && (
                                <p className="text-sm text-gray-400">
                                    Cập nhật lần cuối: {lastUpdate.toLocaleTimeString()}
                                </p>
                            )}
                            <button
                                onClick={() => setIsExportModalOpen(true)}
                                disabled={!systemInfo || isExporting}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                                {isExporting ? 'Exporting...' : 'Export'}
                            </button>
                            <button
                                onClick={fetchSystemInfo}
                                disabled={loading}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-4 mt-6 bg-white/5 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                activeTab === 'overview'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Monitor className="w-4 h-4" />
                            Thông tin chung
                        </button>
                        <button
                            onClick={() => setActiveTab('detailed')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                activeTab === 'detailed'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <HardDrive className="w-4 h-4" />
                            Phần cứng chi tiết
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' ? (
                    <>
                        {/* System Overview */}
                        <SystemOverview system={systemInfo.system} os={systemInfo.os} />

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            <CPUCard cpu={systemInfo.cpu} />
                            <MemoryCard memory={systemInfo.memory} />
                        </div>

                        {/* Storage Section */}
                        <div className="mb-6">
                            <StorageCard storage={systemInfo.storage} storageDevices={systemInfo.storageDevices} />
                        </div>

                        {/* GPU and Network Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            <GPUCard gpu={systemInfo.gpu} />
                            <NetworkCard network={systemInfo.network} />
                        </div>

                        {/* Display Section */}
                        <DisplayCard displays={systemInfo.displays} />
                    </>
                ) : (
                    <DetailedHardwareInfo />
                )}
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExport}
                systemInfo={systemInfo || undefined}
            />
        </div>
    );
}

export default App;
