import React from 'react';
import { FolderOpen } from 'lucide-react';
import type { FileExportFormProps } from '../types/ExportModal';
import { getFileIcon, getFileExtension, fileTypeOptions } from '../utils/exportUtils';

const FileExportForm: React.FC<FileExportFormProps> = ({
    filename,
    setFilename,
    fileType,
    setFileType,
    savePath,
    setSavePath,
    isSelectingPath,
    onSelectPath,
}) => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            <h4 className="text-sm font-medium text-blue-900">Cài đặt xuất file</h4>

            {/* File Type Selection */}
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-2">Định dạng xuất</label>
                <div className="grid grid-cols-2 gap-2">
                    {fileTypeOptions.map((option) => (
                        <button
                            key={option.type}
                            onClick={() => setFileType(option.type)}
                            className={`p-2 rounded-lg border-2 transition-all ${
                                fileType === option.type
                                    ? 'border-blue-500 bg-blue-100'
                                    : 'border-gray-300 hover:border-blue-300'
                            }`}
                        >
                            <div className="flex flex-col items-center space-y-1">
                                {getFileIcon(option.type)}
                                <div className="text-center">
                                    <div className="text-xs font-medium text-gray-900">{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.desc}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filename Input */}
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">Tên File</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Enter filename"
                    />
                    <span className="text-xs text-gray-500">{getFileExtension(fileType)}</span>
                </div>
            </div>

            {/* Save Path Selection */}
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">Đường dẫn lưu</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={savePath}
                        onChange={(e) => setSavePath(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Select save location"
                        readOnly
                    />
                    <button
                        onClick={onSelectPath}
                        disabled={isSelectingPath}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                        <FolderOpen className="w-4 h-4" />
                        <span>Chọn</span>
                    </button>
                </div>
                {!savePath && <p className="text-xs text-blue-600 mt-1">Vui lòng chọn đường dẫn lưu</p>}
            </div>
        </div>
    );
};

export default FileExportForm;
