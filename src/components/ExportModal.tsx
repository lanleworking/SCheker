import React, { useState } from 'react';
import { X, Download, Database, AlertCircle } from 'lucide-react';
import type { ExportModalProps, FileType } from '../types/ExportModal';
import { useModalScrollLock, useFilePathSelection, useDatabaseSave } from '../hooks/useExportModal';
import ActionSelector from './ActionSelector';
import FileExportForm from './FileExportForm';
import DatabaseForm from './DatabaseForm';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, systemInfo }) => {
    // File export state
    const [filename, setFilename] = useState('device-info');
    const [fileType, setFileType] = useState<FileType>('excel');
    const [savePath, setSavePath] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    // Action checkboxes
    const [exportToFile, setExportToFile] = useState(true);
    const [saveToDatabase, setSaveToDatabase] = useState(false);

    // Database fields
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // Custom hooks
    useModalScrollLock(isOpen);
    const { isSelectingPath, handleSelectPath } = useFilePathSelection();
    const { isSaving, saveToDatabase: saveToDb } = useDatabaseSave();

    const handleSelectPathWrapper = async () => {
        const result = await handleSelectPath();
        if (result) {
            setSavePath(result);
        }
    };

    const handleExport = async () => {
        // Validation - at least one action must be selected
        if (!exportToFile && !saveToDatabase) {
            alert('Vui lòng chọn ít nhất một hành động: **Xuất file** hoặc **Lưu thông tin máy**');
            return;
        }

        // Validate export fields if export is selected
        if (exportToFile && (!filename.trim() || !savePath.trim())) {
            alert('Vui lòng điền đầy đủ các trường cần thiết (Tên file và Đường dẫn lưu) để xuất file');
            return;
        }

        // Validate database fields if save is selected
        if (saveToDatabase && (!username.trim() || !userId.trim() || !password.trim())) {
            alert('Vui lòng điền đầy đủ các trường cần thiết để lưu thông tin máy');
            return;
        }

        try {
            // Handle save to database
            if (saveToDatabase && systemInfo) {
                const success = await saveToDb(systemInfo, username, userId, password);
                if (!success) return;
            }

            // Handle export to file
            if (exportToFile) {
                setIsExporting(true);
                onExport(filename.trim(), fileType, savePath);
            }

            onClose();
        } catch (error) {
            // Error handling is done in the hooks
        } finally {
            setIsExporting(false);
        }
    };

    const getButtonContent = () => {
        if (isSaving || isExporting) {
            return (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isSaving && isExporting ? 'Processing...' : isSaving ? 'Saving...' : 'Exporting...'}</span>
                </>
            );
        }

        if (exportToFile && saveToDatabase) {
            return (
                <>
                    <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <Database className="w-4 h-4" />
                    </div>
                    <span>Export & Lưu</span>
                </>
            );
        }

        if (exportToFile) {
            return (
                <>
                    <Download className="w-4 h-4" />
                    <span>Export File</span>
                </>
            );
        }

        if (saveToDatabase) {
            return (
                <>
                    <Database className="w-4 h-4" />
                    <span>Lưu</span>
                </>
            );
        }

        return (
            <>
                <AlertCircle className="w-4 h-4" />
                <span>Chọn hành động</span>
            </>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                style={{
                    maxHeight: '96vh',
                    overflowY: 'auto',
                }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Download className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Thông tin thiết bị</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <ActionSelector
                        exportToFile={exportToFile}
                        setExportToFile={setExportToFile}
                        saveToDatabase={saveToDatabase}
                        setSaveToDatabase={setSaveToDatabase}
                    />

                    {/* File Export Fields - Conditional on exportToFile checkbox */}
                    {exportToFile && (
                        <FileExportForm
                            filename={filename}
                            setFilename={setFilename}
                            fileType={fileType}
                            setFileType={setFileType}
                            savePath={savePath}
                            setSavePath={setSavePath}
                            isSelectingPath={isSelectingPath}
                            onSelectPath={handleSelectPathWrapper}
                        />
                    )}

                    {/* Database Fields - Conditional on saveToDatabase checkbox */}
                    {saveToDatabase && (
                        <DatabaseForm
                            username={username}
                            setUsername={setUsername}
                            userId={userId}
                            setUserId={setUserId}
                            password={password}
                            setPassword={setPassword}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={
                            // Must select at least one action
                            (!exportToFile && !saveToDatabase) ||
                            // If exporting to file: need filename and save path
                            (exportToFile && (!filename.trim() || !savePath.trim())) ||
                            // If saving to database: need credentials
                            (saveToDatabase && (!username.trim() || !userId.trim() || !password.trim())) ||
                            // If currently processing
                            isSaving ||
                            isExporting
                        }
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {getButtonContent()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
