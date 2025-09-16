import React from 'react';
import type { DatabaseFormProps } from '../types/ExportModal';

const DatabaseForm: React.FC<DatabaseFormProps> = ({
    username,
    setUsername,
    userId,
    setUserId,
    password,
    setPassword,
}) => {
    return (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
            <h4 className="text-sm font-medium text-purple-900">Database Credentials</h4>

            {/* Username Input */}
            <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">Tên nhân viên *</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black text-sm"
                    placeholder="Tên nhân viên"
                    required
                />
            </div>

            {/* User ID Input */}
            <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">Mã nhân viên *</label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black text-sm"
                    placeholder="Mã nhân viên"
                    required
                />
            </div>

            {/* Password Input */}
            <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">Mã xác thực *</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black text-sm"
                    placeholder="Mã xác thực"
                    required
                />
            </div>
        </div>
    );
};

export default DatabaseForm;
