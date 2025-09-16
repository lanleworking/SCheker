import type { SystemInfo } from '../utils/systemInfo';

export type FileType = 'excel' | 'pdf' | 'json' | 'word';

export interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (filename: string, fileType: FileType, savePath: string) => void;
    systemInfo?: SystemInfo;
}

export interface FileExportFormProps {
    filename: string;
    setFilename: (filename: string) => void;
    fileType: FileType;
    setFileType: (fileType: FileType) => void;
    savePath: string;
    setSavePath: (savePath: string) => void;
    isSelectingPath: boolean;
    onSelectPath: () => void;
}

export interface DatabaseFormProps {
    username: string;
    setUsername: (username: string) => void;
    userId: string;
    setUserId: (userId: string) => void;
    password: string;
    setPassword: (password: string) => void;
}

export interface ActionSelectorProps {
    exportToFile: boolean;
    setExportToFile: (value: boolean) => void;
    saveToDatabase: boolean;
    setSaveToDatabase: (value: boolean) => void;
}

export interface ExportState {
    filename: string;
    fileType: FileType;
    savePath: string;
    isSelectingPath: boolean;
    exportToFile: boolean;
    saveToDatabase: boolean;
    username: string;
    userId: string;
    password: string;
    isSaving: boolean;
    isExporting: boolean;
}
