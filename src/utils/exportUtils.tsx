import { File, FileSpreadsheet, FileText, Database } from 'lucide-react';
import type { SystemInfo } from '../utils/systemInfo';
import type { Device } from '../types/Device';
import type { FileType } from '../types/ExportModal';

export const getFileIcon = (type: string) => {
    switch (type) {
        case 'excel':
            return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
        case 'pdf':
            return <FileText className="w-5 h-5 text-red-600" />;
        case 'json':
            return <File className="w-5 h-5 text-blue-600" />;
        case 'word':
            return <FileText className="w-5 h-5 text-blue-800" />;
        case 'save':
            return <Database className="w-5 h-5 text-purple-600" />;
        default:
            return <File className="w-5 h-5" />;
    }
};

export const getFileExtension = (type: FileType): string => {
    switch (type) {
        case 'excel':
            return '.xlsx';
        case 'pdf':
            return '.pdf';
        case 'json':
            return '.json';
        case 'word':
            return '.docx';
        default:
            return '';
    }
};

export const convertSystemInfoToDevice = (systemInfo: SystemInfo): Partial<Device> => {
    // Get primary network interface
    const primaryNetwork = systemInfo.network.find((n) => n.ip4 && n.ip4 !== '127.0.0.1') || systemInfo.network[0];

    return {
        SystemManufacturer: systemInfo.system.manufacturer,
        SystemModel: systemInfo.system.model,
        SystemSerialNumber: systemInfo.system.serial,
        SystemUUID: systemInfo.system.uuid,
        BaseBoardSerialNumber: systemInfo.baseboard.serial,
        OSName: systemInfo.os.distro,
        IPv4: primaryNetwork?.ip4,
        MACAddress: primaryNetwork?.mac,
        IPv6: primaryNetwork?.ip6,
    };
};

export const fileTypeOptions = [
    { type: 'excel' as FileType, label: 'Excel', desc: 'Spreadsheet format' },
    // { type: 'pdf' as FileType, label: 'PDF', desc: 'Document format' },
    { type: 'json' as FileType, label: 'JSON', desc: 'Data format' },
    { type: 'word' as FileType, label: 'Word', desc: 'Template with device info' },
];
