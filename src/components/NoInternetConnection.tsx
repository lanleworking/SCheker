import React from 'react';
import { WifiOff, RotateCcw, X } from 'lucide-react';

interface NoInternetConnectionProps {
    onTryAgain: () => void;
    onExit: () => void;
    isChecking?: boolean;
}

export const NoInternetConnection: React.FC<NoInternetConnectionProps> = ({
    onTryAgain,
    onExit,
    isChecking = false,
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            <div className="relative">
                {/* Background blur effect */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl"></div>

                {/* Content */}
                <div className="relative p-12 text-center max-w-md">
                    {/* Warning Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-150"></div>
                            <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-full p-6">
                                <WifiOff className="w-16 h-16 text-red-400" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-4">No Internet Connection</h1>

                    {/* Description */}
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        SChecker requires an internet connection to check for updates and function properly. Please
                        check your network connection and try again.
                    </p>

                    {/* Status indicator when checking */}
                    {isChecking && (
                        <div className="mb-6 flex items-center justify-center gap-2 text-blue-400">
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Checking connection...</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Try Again Button */}
                        <button
                            onClick={onTryAgain}
                            disabled={isChecking}
                            className={`
                                flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                                bg-blue-600/20 backdrop-blur-sm border border-blue-400/30
                                text-blue-300 font-medium transition-all duration-200
                                ${
                                    isChecking
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-600/30 hover:border-blue-400/50 hover:text-blue-200 hover:scale-105'
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-400/50
                            `}
                        >
                            <RotateCcw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                            Try Again
                        </button>

                        {/* Exit Button */}
                        <button
                            onClick={onExit}
                            disabled={isChecking}
                            className={`
                                flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                                bg-red-600/20 backdrop-blur-sm border border-red-400/30
                                text-red-300 font-medium transition-all duration-200
                                ${
                                    isChecking
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-red-600/30 hover:border-red-400/50 hover:text-red-200 hover:scale-105'
                                }
                                focus:outline-none focus:ring-2 focus:ring-red-400/50
                            `}
                        >
                            <X className="w-4 h-4" />
                            Exit
                        </button>
                    </div>

                    {/* Additional help text */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-400">
                            Make sure your internet connection is working and firewall settings allow SChecker to access
                            the network.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
