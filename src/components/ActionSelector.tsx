import React from 'react';
import { Download, Database } from 'lucide-react';
import type { ActionSelectorProps } from '../types/ExportModal';

const ActionSelector: React.FC<ActionSelectorProps> = ({
    exportToFile,
    setExportToFile,
    saveToDatabase,
    setSaveToDatabase,
}) => {
    return (
        <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-3">Actions</div>

            {/* Export to File Checkbox */}
            <label className="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={exportToFile}
                    onChange={(e) => setExportToFile(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Export file</span>
                </div>
            </label>

            {/* Save to Database Checkbox */}
            <label className="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={saveToDatabase}
                    onChange={(e) => setSaveToDatabase(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Lưu thông tin máy</span>
                </div>
            </label>

            <p className="text-xs text-gray-500 ml-7">Chọn một hoặc cả hai để thực hiện</p>
        </div>
    );
};

export default ActionSelector;
