import { Computer } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface SystemOverviewProps {
    system: SystemInfo['system'];
    os: SystemInfo['os'];
}

export default function SystemOverview({ system, os }: SystemOverviewProps) {
    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    return (
        <div className="card mb-6">
            <div className="flex items-center gap-3 mb-6">
                <Computer className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold">System Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Computer</p>
                    <p className="font-semibold">{system.manufacturer}</p>
                    <p className="text-sm text-gray-300">
                        {system.model} ({system.version})
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Operating System</p>
                    <p className="font-semibold">{os.distro}</p>
                    <p className="text-sm text-gray-300">{os.arch}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Hostname</p>
                    <p className="font-semibold">{os.hostname}</p>
                    <p className="text-sm text-gray-300">{os.platform}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Uptime</p>
                    <p className="font-semibold">{formatUptime(os.uptime)}</p>
                </div>
            </div>
            <hr className="my-4 text-gray-300" />
            <div className=" grid grid-cols-2  gap-6">
                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Serial</p>
                    <p className="font-semibold">{system.serial}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-400">UUID</p>
                    <p className="font-semibold">{system.uuid}</p>
                </div>
            </div>
        </div>
    );
}
