import { MemoryStick } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface MemoryCardProps {
    memory: SystemInfo['memory'];
}

export default function MemoryCard({ memory }: MemoryCardProps) {
    const formatBytes = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024);
        return gb.toFixed(1) + ' GB';
    };

    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <MemoryStick className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold">Memory (RAM)</h3>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="text-lg font-bold text-white">{formatBytes(memory.total)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Used</p>
                        <p className="text-lg font-bold text-white">{formatBytes(memory.used)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Free</p>
                        <p className="text-lg font-bold text-white">{formatBytes(memory.free)}</p>
                    </div>
                </div>
            </div>
            {memory.layout.map((ram, index) => (
                <div key={index} className="stat-card my-4 px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-400">Manufacture</p>
                            <p className="font-semibold text-white">{ram.manufacturer}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Serial Number</p>
                            <p className="font-semibold text-white">{ram.serialNum}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Type</p>
                            <p className="font-semibold text-white">{ram.type}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Size</p>
                            <p className="font-semibold text-white">{formatBytes(ram.size)}</p>
                        </div>
                    </div>
                    <hr className="text-gray-500 my-4" />
                    <div className="grid grid-cols-2  gap-4">
                        <div>
                            <p className="text-gray-400">Type</p>
                            <p className="font-semibold text-white">{ram.type}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Bank</p>
                            <p className="font-semibold text-white">{ram.bank}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
