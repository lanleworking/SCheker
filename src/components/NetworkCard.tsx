import { Wifi } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';

interface NetworkCardProps {
    network: SystemInfo['network'];
}

export default function NetworkCard({ network }: NetworkCardProps) {
    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <Wifi className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-bold">Network</h3>
            </div>

            {network.length > 0 ? (
                <div className="space-y-4">
                    {network.map((iface, index) => (
                        <div key={index} className="space-y-3">
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="font-semibold text-white">{iface.iface}</p>
                                    <p className="text-sm text-gray-400 capitalize">{iface.type}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">IPv4</p>
                                    <p className="text-sm text-gray-400 capitalize">{iface.ip4}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">IPv6</p>
                                    <p className="text-sm text-gray-400 capitalize">{iface.ip6}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">MAC Address</p>
                                    <p className="text-sm text-gray-400 capitalize">{iface.mac}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400">No network information available</p>
                </div>
            )}
        </div>
    );
}
