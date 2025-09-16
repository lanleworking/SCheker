import { Cpu } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface CPUCardProps {
    cpu: SystemInfo['cpu'];
}

export default function CPUCard({ cpu }: CPUCardProps) {
    return (
        <div className="stat-card">
            <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold">CPU</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Processor</p>
                    <p className="font-semibold text-white">{cpu.brand}</p>
                    <p className="text-sm text-gray-300">{cpu.manufacturer}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-400">Cores</p>
                        <p className="text-xl font-bold text-white">{cpu.cores}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Physical Cores</p>
                        <p className="text-xl font-bold text-white">{cpu.physicalCores}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Speed</p>
                        <p className="text-xl font-bold text-white">{cpu.speed} GHz</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
