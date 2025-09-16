import { Monitor } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface DisplayCardProps {
    displays: SystemInfo['displays'];
}

export default function DisplayCard({ displays }: DisplayCardProps) {
    const formatResolution = (resX: number, resY: number) => {
        return `${resX} × ${resY}`;
    };

    const getDisplaySize = (sizeX?: number, sizeY?: number) => {
        if (!sizeX || !sizeY) return 'Unknown';
        const diagonal = Math.sqrt(sizeX * sizeX + sizeY * sizeY) / 2.54; // Convert cm to inches
        return `${diagonal.toFixed(1)}"`;
    };

    const getDisplayType = (connection: string, builtin: boolean) => {
        if (builtin) return 'Built-in';
        return connection.toUpperCase();
    };

    return (
        <div className="card mb-6">
            <div className="flex items-center gap-3 mb-6">
                <Monitor className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold">Display Information</h2>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    {displays.length} Display{displays.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-4">
                {displays.map((display, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">
                                    Display {index + 1}
                                    {display.main && (
                                        <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                            Primary
                                        </span>
                                    )}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span
                                    className={`w-2 h-2 rounded-full ${display.main ? 'bg-green-400' : 'bg-gray-400'}`}
                                ></span>
                                {getDisplayType(display.connection, display.builtin)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Monitor</p>
                                <p className="font-semibold">{display.vendor || 'Unknown'}</p>
                                <p className="text-sm text-gray-300">{display.model || 'Generic Monitor'}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Resolution</p>
                                <p className="font-semibold text-purple-300">
                                    {formatResolution(display.currentResX, display.currentResY)}
                                </p>
                                <p className="text-sm text-gray-300">{display.currentRefreshRate}Hz</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Position</p>
                                <p className="font-semibold">
                                    X: {display.positionX}, Y: {display.positionY}
                                </p>
                                <p className="text-sm text-gray-300">Color Depth: {display.pixelDepth}-bit</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Size</p>
                                <p className="font-semibold">{getDisplaySize(display.sizeX, display.sizeY)}</p>
                                <p className="text-sm text-gray-300">
                                    {display.sizeX && display.sizeY
                                        ? `${display.sizeX}×${display.sizeY} cm`
                                        : 'Unknown dimensions'}
                                </p>
                            </div>
                        </div>

                        {display.resolutionX !== display.currentResX || display.resolutionY !== display.currentResY ? (
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-sm text-blue-300">
                                    <strong>Native Resolution:</strong>{' '}
                                    {formatResolution(display.resolutionX, display.resolutionY)}
                                    <span className="text-gray-400 ml-2">
                                        (Windows Scaling:{' '}
                                        {Math.round((display.resolutionX / display.currentResX) * 100)}%)
                                    </span>
                                </p>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
