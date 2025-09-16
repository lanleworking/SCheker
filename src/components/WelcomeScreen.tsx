import { Monitor, Play, AlertTriangle } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
}

function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Main Welcome Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-500/20 p-4 rounded-full">
                            <Monitor className="w-12 h-12 text-blue-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        SChecker
                    </h1>
                    <p className="text-gray-400 mb-8">Kiểm tra Thông tin thiết bị</p>

                    {/* Performance Notice */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-medium">Mẹo Performance</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Vui lòng đóng các ứng dụng khác để chương trình chạy mượt mà hơn
                        </p>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Play className="w-5 h-5" />
                        Bắt đầu
                    </button>

                    {/* Additional Info */}
                    <p className="text-gray-500 text-xs mt-4">
                        Quy trình này sẽ phân tích phần cứng và hiệu suất hệ thống của bạn
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;
