import { Zap } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface GPUCardProps {
    gpu: SystemInfo['gpu'];
}

export default function GPUCard({ gpu }: GPUCardProps) {
    const formatVRAM = (vram?: number) => {
        if (!vram) return 'Unknown';
        if (vram >= 1024) {
            return `${(vram / 1024).toFixed(1)} GB`;
        }
        return `${vram} MB`;
    };

    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold">Graphics (GPU)</h3>
            </div>
            {gpu.length > 0 ? (
                <div className="space-y-4">
                    {gpu.map((graphics, index) => (
                        <div key={index} className="space-y-3">
                            <div>
                                <p className="font-semibold text-white text-lg">{graphics.model}</p>
                                <p className="text-sm text-gray-400">{graphics.vendor}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {graphics.vram && (
                                    <div>
                                        <p className="text-sm text-gray-400">Video Memory</p>
                                        <p className="text-lg font-bold text-white">{formatVRAM(graphics.vram)}</p>
                                    </div>
                                )}
                                {graphics.bus && (
                                    <div>
                                        <p className="text-sm text-gray-400">Bus</p>
                                        <p className="text-lg font-bold text-white">{graphics.bus}</p>
                                    </div>
                                )}
                            </div>

                            {index < gpu.length - 1 && <hr className="border-gray-700" />}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400">No GPU information available</p>
                </div>
            )}
        </div>
    );
}
