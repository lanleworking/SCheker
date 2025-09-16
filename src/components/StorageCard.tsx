import { HardDrive } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface StorageCardProps {
    storage: SystemInfo['storage'];
    storageDevices: SystemInfo['storageDevices'];
}

export default function StorageCard({ storageDevices }: StorageCardProps) {
    return (
        <div className="card">
            <div className="flex items-center gap-3">
                <HardDrive className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold">Storage</h3>
            </div>

            <div className="mt-4">
                {storageDevices.map((drive, index) => (
                    <div key={index} className="stat-card">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-white">{drive.name}</p>
                                <p className="text-sm text-gray-400">{drive.type}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-400">Total</p>
                                    <p className="font-semibold text-white">{drive.size}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Manufacturer</p>
                                    <p className="font-semibold text-white">{drive.manufacturer}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Type</p>
                                    <p className="text-sm font-bold text-white">{drive.interfaceType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Model</p>
                                    <p className="text-sm font-bold text-white">{drive.model}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-400">Serial Number</p>
                                    <p className="font-semibold text-white">{drive.serialNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
