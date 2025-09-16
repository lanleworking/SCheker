import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, MemoryStick, Battery, Speaker, Usb } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

const DetailedHardwareInfo: React.FC = () => {
    const [biosInfo, setBiosInfo] = useState<SystemInfo['bios'] | null>(null);
    const [baseboardInfo, setBaseboardInfo] = useState<SystemInfo['baseboard'] | null>(null);
    const [chassisInfo, setChassisInfo] = useState<SystemInfo['chassis'] | null>(null);
    const [batteryInfo, setBatteryInfo] = useState<SystemInfo['battery'] | null>(null);
    const [audioInfo, setAudioInfo] = useState<SystemInfo['audio'] | null>(null);
    const [usbInfo, setUsbInfo] = useState<SystemInfo['usb'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetailedInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            if (window.electronAPI) {
                const [bios, baseboard, chassis, battery, audio, usb] = await Promise.all([
                    window.electronAPI.getBIOSInfo(),
                    window.electronAPI.getBaseboardInfo(),
                    window.electronAPI.getChassisInfo(),
                    window.electronAPI.getBatteryInfo(),
                    window.electronAPI.getAudioInfo(),
                    window.electronAPI.getUSBInfo(),
                ]);

                setBiosInfo(bios);
                setBaseboardInfo(baseboard);
                setChassisInfo(chassis);
                setBatteryInfo(battery);
                setAudioInfo(audio);
                setUsbInfo(usb);
            } else {
                // No ElectronAPI available
                setError(
                    'Detailed hardware information not available. Please run this application as an Electron app.',
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch detailed hardware info');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetailedInfo();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Cannot Access Hardware Information</h3>
                <p className="text-red-400 mb-6">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        fetchDetailedInfo();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* BIOS Information */}
            {biosInfo && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Cpu className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-semibold text-white">BIOS Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                            <span className="text-gray-400">Vendor:</span> {biosInfo.vendor}
                        </div>
                        <div>
                            <span className="text-gray-400">Version:</span> {biosInfo.version}
                        </div>
                        <div>
                            <span className="text-gray-400">Release Date:</span> {biosInfo.releaseDate}
                        </div>
                        <div>
                            <span className="text-gray-400">Revision:</span> {biosInfo.revision}
                        </div>
                        {biosInfo.language && (
                            <div>
                                <span className="text-gray-400">Language:</span> {biosInfo.language}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Motherboard Information */}
            {baseboardInfo && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <HardDrive className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">Motherboard Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                            <span className="text-gray-400">Manufacturer:</span> {baseboardInfo.manufacturer}
                        </div>
                        <div>
                            <span className="text-gray-400">Model:</span> {baseboardInfo.model}
                        </div>
                        <div>
                            <span className="text-gray-400">Version:</span> {baseboardInfo.version}
                        </div>
                        {baseboardInfo.serial && (
                            <div>
                                <span className="text-gray-400">Serial:</span> {baseboardInfo.serial}
                            </div>
                        )}
                        {baseboardInfo.memMax && (
                            <div>
                                <span className="text-gray-400">Max Memory:</span>{' '}
                                {(baseboardInfo.memMax / (1024 * 1024 * 1024)).toFixed(0)} GB
                            </div>
                        )}
                        {baseboardInfo.memSlots && (
                            <div>
                                <span className="text-gray-400">Memory Slots:</span> {baseboardInfo.memSlots}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chassis Information */}
            {chassisInfo && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <MemoryStick className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-semibold text-white">Chassis Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                            <span className="text-gray-400">Manufacturer:</span> {chassisInfo.manufacturer}
                        </div>
                        <div>
                            <span className="text-gray-400">Model:</span> {chassisInfo.model}
                        </div>
                        <div>
                            <span className="text-gray-400">Type:</span> {chassisInfo.type}
                        </div>
                        <div>
                            <span className="text-gray-400">Version:</span> {chassisInfo.version}
                        </div>
                        {chassisInfo.serial && (
                            <div>
                                <span className="text-gray-400">Serial:</span> {chassisInfo.serial}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Battery Information */}
            {batteryInfo && batteryInfo.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Battery className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-semibold text-white">Battery Information</h3>
                    </div>
                    {batteryInfo.map((battery, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                            <div>
                                <span className="text-gray-400">Manufacturer:</span> {battery.manufacturer}
                            </div>
                            <div>
                                <span className="text-gray-400">Model:</span> {battery.model}
                            </div>
                            <div>
                                <span className="text-gray-400">Charge:</span> {battery.percent}%
                            </div>
                            <div>
                                <span className="text-gray-400">Status:</span>{' '}
                                {battery.isCharging ? 'Charging' : 'Not Charging'}
                            </div>
                            <div>
                                <span className="text-gray-400">Capacity:</span> {battery.currentCapacity} /{' '}
                                {battery.maxCapacity} {battery.capacityUnit}
                            </div>
                            <div>
                                <span className="text-gray-400">Cycles:</span> {battery.cycleCount}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Audio Devices */}
            {audioInfo && audioInfo.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Speaker className="w-6 h-6 text-pink-400" />
                        <h3 className="text-xl font-semibold text-white">Audio Devices</h3>
                    </div>
                    <div className="space-y-4">
                        {audioInfo.map((device, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                                    <div>
                                        <span className="text-gray-400">Name:</span> {device.name}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Manufacturer:</span> {device.manufacturer}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Type:</span> {device.type}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Status:</span> {device.status}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Default:</span> {device.default ? 'Yes' : 'No'}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">I/O:</span>{' '}
                                        {device.in && device.out ? 'Input/Output' : device.in ? 'Input' : 'Output'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* USB Devices */}
            {usbInfo && usbInfo.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Usb className="w-6 h-6 text-orange-400" />
                        <h3 className="text-xl font-semibold text-white">USB Devices</h3>
                    </div>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {usbInfo.map((device, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                                    <div>
                                        <span className="text-gray-400">Name:</span> {device.name}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Manufacturer:</span> {device.manufacturer}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Type:</span> {device.type}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Bus:</span> {device.bus}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Removable:</span>{' '}
                                        {device.removable ? 'Yes' : 'No'}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Max Power:</span> {device.maxPower}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailedHardwareInfo;
