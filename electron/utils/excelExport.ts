import ExcelJS from 'exceljs';

/**
 * Export data to Excel format with multiple worksheets
 */
export async function exportToExcel(data: any, filePath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    // System Overview Sheet
    const overviewSheet = workbook.addWorksheet('System Overview');

    // Add headers with styling
    const titleRow = overviewSheet.addRow(['Device Information Report']);
    titleRow.font = { bold: true, size: 16 };
    overviewSheet.addRow(['Generated on:', new Date().toLocaleString()]);
    overviewSheet.addRow([]);

    // System Info
    if (data.system) {
        const systemHeader = overviewSheet.addRow(['System Information']);
        systemHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Manufacturer', data.system.manufacturer || 'N/A']);
        overviewSheet.addRow(['Model', data.system.model || 'N/A']);
        overviewSheet.addRow(['Version', data.system.version || 'N/A']);
        overviewSheet.addRow(['Serial Number', data.system.serial || 'N/A']);
        overviewSheet.addRow(['UUID', data.system.uuid || 'N/A']);
        overviewSheet.addRow(['SKU', data.system.sku || 'N/A']);
        overviewSheet.addRow(['Virtual', data.system.virtual ? 'Yes' : 'No']);
        if (data.system.virtualHost) {
            overviewSheet.addRow(['Virtual Host', data.system.virtualHost]);
        }
        overviewSheet.addRow([]);
    }

    // CPU Info - Enhanced with all manufacturer details
    if (data.cpu) {
        const cpuHeader = overviewSheet.addRow(['CPU Information']);
        cpuHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Manufacturer', data.cpu.manufacturer || 'N/A']);
        overviewSheet.addRow(['Brand', data.cpu.brand || 'N/A']);
        overviewSheet.addRow(['Family', data.cpu.family || 'N/A']);
        overviewSheet.addRow(['Model', data.cpu.model || 'N/A']);
        overviewSheet.addRow(['Stepping', data.cpu.stepping || 'N/A']);
        overviewSheet.addRow(['Revision', data.cpu.revision || 'N/A']);
        overviewSheet.addRow(['Socket', data.cpu.socket || 'N/A']);
        overviewSheet.addRow(['Cores', data.cpu.cores || 'N/A']);
        overviewSheet.addRow(['Physical Cores', data.cpu.physicalCores || 'N/A']);
        overviewSheet.addRow(['Processors', data.cpu.processors || 'N/A']);
        overviewSheet.addRow(['Speed (GHz)', data.cpu.speed || 'N/A']);
        overviewSheet.addRow(['Speed Min (GHz)', data.cpu.speedMin || 'N/A']);
        overviewSheet.addRow(['Speed Max (GHz)', data.cpu.speedMax || 'N/A']);
        overviewSheet.addRow(['Flags', data.cpu.flags || 'N/A']);
        overviewSheet.addRow(['Virtualization', data.cpu.virtualization ? 'Yes' : 'No']);
        if (data.cpu.cache) {
            overviewSheet.addRow(['L1D Cache', data.cpu.cache.l1d ? `${data.cpu.cache.l1d} KB` : 'N/A']);
            overviewSheet.addRow(['L1I Cache', data.cpu.cache.l1i ? `${data.cpu.cache.l1i} KB` : 'N/A']);
            overviewSheet.addRow(['L2 Cache', data.cpu.cache.l2 ? `${data.cpu.cache.l2} KB` : 'N/A']);
            overviewSheet.addRow(['L3 Cache', data.cpu.cache.l3 ? `${data.cpu.cache.l3} KB` : 'N/A']);
        }
        overviewSheet.addRow(['Usage (%)', data.cpu.usage || 'N/A']);
        if (data.cpu.temperature) {
            overviewSheet.addRow(['Temperature (°C)', data.cpu.temperature]);
        }
        overviewSheet.addRow([]);
    }

    // Memory Info - Enhanced
    if (data.memory) {
        const memoryHeader = overviewSheet.addRow(['Memory Information']);
        memoryHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Total (GB)', (data.memory.total / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow(['Used (GB)', (data.memory.used / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow(['Free (GB)', (data.memory.free / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow(['Available (GB)', (data.memory.available / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow(['Usage (%)', data.memory.usage || 'N/A']);
        overviewSheet.addRow(['Swap Total (GB)', (data.memory.swapTotal / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow(['Swap Used (GB)', (data.memory.swapUsed / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow(['Swap Free (GB)', (data.memory.swapFree / 1024 ** 3).toFixed(2)]);
        overviewSheet.addRow([]);
    }

    // BIOS Information - New detailed section
    if (data.bios) {
        const biosHeader = overviewSheet.addRow(['BIOS Information']);
        biosHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Vendor', data.bios.vendor || 'N/A']);
        overviewSheet.addRow(['Version', data.bios.version || 'N/A']);
        overviewSheet.addRow(['Release Date', data.bios.releaseDate || 'N/A']);
        overviewSheet.addRow(['Revision', data.bios.revision || 'N/A']);
        if (data.bios.language) {
            overviewSheet.addRow(['Language', data.bios.language]);
        }
        overviewSheet.addRow([]);
    }

    // Baseboard/Motherboard Information - New detailed section
    if (data.baseboard) {
        const baseboardHeader = overviewSheet.addRow(['Motherboard Information']);
        baseboardHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Manufacturer', data.baseboard.manufacturer || 'N/A']);
        overviewSheet.addRow(['Model', data.baseboard.model || 'N/A']);
        overviewSheet.addRow(['Version', data.baseboard.version || 'N/A']);
        overviewSheet.addRow(['Serial Number', data.baseboard.serial || 'N/A']);
        overviewSheet.addRow(['Asset Tag', data.baseboard.assetTag || 'N/A']);
        if (data.baseboard.memMax) {
            overviewSheet.addRow(['Max Memory (GB)', (data.baseboard.memMax / 1024 ** 3).toFixed(2)]);
        }
        if (data.baseboard.memSlots) {
            overviewSheet.addRow(['Memory Slots', data.baseboard.memSlots]);
        }
        overviewSheet.addRow([]);
    }

    // Chassis Information - New detailed section
    if (data.chassis) {
        const chassisHeader = overviewSheet.addRow(['Chassis Information']);
        chassisHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Manufacturer', data.chassis.manufacturer || 'N/A']);
        overviewSheet.addRow(['Model', data.chassis.model || 'N/A']);
        overviewSheet.addRow(['Type', data.chassis.type || 'N/A']);
        overviewSheet.addRow(['Version', data.chassis.version || 'N/A']);
        overviewSheet.addRow(['Serial Number', data.chassis.serial || 'N/A']);
        overviewSheet.addRow(['Asset Tag', data.chassis.assetTag || 'N/A']);
        overviewSheet.addRow(['SKU', data.chassis.sku || 'N/A']);
        overviewSheet.addRow([]);
    }

    // Operating System Information - New detailed section
    if (data.os) {
        const osHeader = overviewSheet.addRow(['Operating System']);
        osHeader.font = { bold: true, size: 14 };
        overviewSheet.addRow(['Platform', data.os.platform || 'N/A']);
        overviewSheet.addRow(['Distribution', data.os.distro || 'N/A']);
        overviewSheet.addRow(['Release', data.os.release || 'N/A']);
        overviewSheet.addRow(['Codename', data.os.codename || 'N/A']);
        overviewSheet.addRow(['Kernel', data.os.kernel || 'N/A']);
        overviewSheet.addRow(['Architecture', data.os.arch || 'N/A']);
        overviewSheet.addRow(['Hostname', data.os.hostname || 'N/A']);
        overviewSheet.addRow(['FQDN', data.os.fqdn || 'N/A']);
        overviewSheet.addRow(['Uptime (hours)', data.os.uptime ? (data.os.uptime / 3600).toFixed(2) : 'N/A']);
        if (data.os.serial) {
            overviewSheet.addRow(['Serial', data.os.serial]);
        }
        if (data.os.build) {
            overviewSheet.addRow(['Build', data.os.build]);
        }
        overviewSheet.addRow([]);
    }

    // Combined Storage Details Sheet - Includes both logical drives and physical devices
    if ((data.storage && Array.isArray(data.storage)) || (data.storageDevices && Array.isArray(data.storageDevices))) {
        const storageSheet = workbook.addWorksheet('Storage & Devices');
        const storageHeader = storageSheet.addRow(['Complete Storage Information']);
        storageHeader.font = { bold: true, size: 16 };
        storageSheet.addRow([]);

        // Section 1: Logical Storage Drives
        if (data.storage && Array.isArray(data.storage)) {
            const logicalHeader = storageSheet.addRow(['Logical Storage Drives']);
            logicalHeader.font = { bold: true, size: 14 };
            storageSheet.addRow([]);

            const logicalHeaderRow = storageSheet.addRow([
                'Device',
                'Manufacturer',
                'Vendor',
                'Type',
                'Name',
                'Size (GB)',
                'Used (GB)',
                'Available (GB)',
                'Usage (%)',
                'Filesystem',
                'Mount Point',
                'Protocol',
                'Serial Number',
                'Firmware',
                'Interface',
            ]);
            logicalHeaderRow.font = { bold: true };

            data.storage.forEach((drive: any) => {
                storageSheet.addRow([
                    drive.device || 'N/A',
                    drive.manufacturer || 'N/A',
                    drive.vendor || 'N/A',
                    drive.type || 'N/A',
                    drive.name || 'N/A',
                    drive.size ? (drive.size / 1024 ** 3).toFixed(2) : 'N/A',
                    drive.used ? (drive.used / 1024 ** 3).toFixed(2) : 'N/A',
                    drive.available ? (drive.available / 1024 ** 3).toFixed(2) : 'N/A',
                    drive.usage || 'N/A',
                    drive.filesystem || 'N/A',
                    drive.mount || 'N/A',
                    drive.protocol || 'N/A',
                    drive.serialNum || 'N/A',
                    drive.firmwareRevision || 'N/A',
                    drive.interfaceType || 'N/A',
                ]);
            });

            storageSheet.addRow([]); // Empty row for separation
        }

        // Section 2: Physical Storage Devices
        if (data.storageDevices && Array.isArray(data.storageDevices)) {
            const physicalHeader = storageSheet.addRow(['Physical Storage Devices']);
            physicalHeader.font = { bold: true, size: 14 };
            storageSheet.addRow([]);

            const physicalHeaderRow = storageSheet.addRow([
                'Device Name',
                'Manufacturer',
                'Model',
                'Serial Number',
                'Size (GB)',
                'Type',
                'Interface Type',
                'Firmware Version',
                'Smart Status',
                'Temperature (°C)',
                'Removable',
                'Physical',
                'Vendor',
                'Protocol',
                'Smart Data Available',
            ]);
            physicalHeaderRow.font = { bold: true };

            data.storageDevices.forEach((device: any) => {
                storageSheet.addRow([
                    device.name || 'N/A',
                    device.manufacturer || 'N/A',
                    device.model || 'N/A',
                    device.serialNum || 'N/A',
                    device.size ? (device.size / 1024 ** 3).toFixed(2) : 'N/A',
                    device.type || 'N/A',
                    device.interfaceType || 'N/A',
                    device.firmwareRevision || 'N/A',
                    device.smartStatus || 'N/A',
                    device.temperature || 'N/A',
                    device.removable ? 'Yes' : 'No',
                    device.physical ? 'Yes' : 'No',
                    device.vendor || 'N/A',
                    device.protocol || 'N/A',
                    device.smartData ? 'Yes' : 'No',
                ]);
            });
        }

        // Auto-fit columns
        storageSheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Enhanced GPU Details Sheet
    if (data.gpu && Array.isArray(data.gpu)) {
        const gpuSheet = workbook.addWorksheet('GPU Details');
        const gpuHeader = gpuSheet.addRow(['GPU Information']);
        gpuHeader.font = { bold: true, size: 16 };
        gpuSheet.addRow([]);

        const headerRow = gpuSheet.addRow([
            'Manufacturer',
            'Vendor',
            'Model',
            'VRAM (MB)',
            'VRAM Dynamic',
            'Bus',
            'Driver Version',
            'Driver Date',
            'Clock Core (MHz)',
            'Clock Memory (MHz)',
            'Temperature (°C)',
            'GPU Usage (%)',
            'Memory Usage (%)',
        ]);
        headerRow.font = { bold: true };

        data.gpu.forEach((gpu: any) => {
            gpuSheet.addRow([
                gpu.manufacturer || 'N/A',
                gpu.vendor || 'N/A',
                gpu.model || 'N/A',
                gpu.vram || 'N/A',
                gpu.vramDynamic ? 'Yes' : 'No',
                gpu.bus || 'N/A',
                gpu.driverVersion || 'N/A',
                gpu.driverDate || 'N/A',
                gpu.clockCore || 'N/A',
                gpu.clockMemory || 'N/A',
                gpu.temperatureGpu || 'N/A',
                gpu.utilizationGpu || 'N/A',
                gpu.utilizationMemory || 'N/A',
            ]);
        });

        // Auto-fit columns
        gpuSheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Enhanced Display Details Sheet
    if (data.displays && Array.isArray(data.displays)) {
        const displaySheet = workbook.addWorksheet('Display Details');
        const displayHeader = displaySheet.addRow(['Display Information']);
        displayHeader.font = { bold: true, size: 16 };
        displaySheet.addRow([]);

        const headerRow = displaySheet.addRow([
            'Display #',
            'Vendor',
            'Model',
            'Device Name',
            'Connection',
            'Primary',
            'Built-in',
            'Current Resolution',
            'Native Resolution',
            'Refresh Rate (Hz)',
            'Position X',
            'Position Y',
            'Color Depth',
            'Physical Size',
            'Size (cm)',
        ]);
        headerRow.font = { bold: true };

        data.displays.forEach((display: any, index: number) => {
            const currentRes = `${display.currentResX || 0} × ${display.currentResY || 0}`;
            const nativeRes = `${display.resolutionX || 0} × ${display.resolutionY || 0}`;
            const physicalSize =
                display.sizeX && display.sizeY
                    ? `${(Math.sqrt(display.sizeX * display.sizeX + display.sizeY * display.sizeY) / 2.54).toFixed(1)}"`
                    : 'N/A';
            const sizeInCm = display.sizeX && display.sizeY ? `${display.sizeX} × ${display.sizeY} cm` : 'N/A';

            displaySheet.addRow([
                index + 1,
                display.vendor || 'Unknown',
                display.model || 'Generic Monitor',
                display.deviceName || 'N/A',
                display.connection || 'Unknown',
                display.main ? 'Yes' : 'No',
                display.builtin ? 'Yes' : 'No',
                currentRes,
                nativeRes,
                display.currentRefreshRate || 'N/A',
                display.positionX || 0,
                display.positionY || 0,
                `${display.pixelDepth || 32}-bit`,
                physicalSize,
                sizeInCm,
            ]);
        });

        // Auto-fit columns
        displaySheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Memory Layout Details Sheet - New detailed section
    if (data.memory && data.memory.layout && Array.isArray(data.memory.layout)) {
        const memLayoutSheet = workbook.addWorksheet('Memory Layout');
        const memLayoutHeader = memLayoutSheet.addRow(['Memory Module Details']);
        memLayoutHeader.font = { bold: true, size: 16 };
        memLayoutSheet.addRow([]);

        const headerRow = memLayoutSheet.addRow([
            'Bank',
            'Manufacturer',
            'Part Number',
            'Serial Number',
            'Size (GB)',
            'Type',
            'Clock Speed (MHz)',
            'Form Factor',
            'ECC',
            'Voltage Configured',
            'Voltage Min',
            'Voltage Max',
        ]);
        headerRow.font = { bold: true };

        data.memory.layout.forEach((module: any) => {
            memLayoutSheet.addRow([
                module.bank || 'N/A',
                module.manufacturer || 'N/A',
                module.partNum || 'N/A',
                module.serialNum || 'N/A',
                module.size ? (module.size / 1024 ** 3).toFixed(2) : 'N/A',
                module.type || 'N/A',
                module.clockSpeed || 'N/A',
                module.formFactor || 'N/A',
                module.ecc ? 'Yes' : 'No',
                module.voltageConfigured || 'N/A',
                module.voltageMin || 'N/A',
                module.voltageMax || 'N/A',
            ]);
        });

        // Auto-fit columns
        memLayoutSheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Network Details Sheet - Enhanced with manufacturer info
    if (data.network && Array.isArray(data.network)) {
        const networkSheet = workbook.addWorksheet('Network Details');
        const networkHeader = networkSheet.addRow(['Network Information']);
        networkHeader.font = { bold: true, size: 16 };
        networkSheet.addRow([]);

        const headerRow = networkSheet.addRow([
            'Interface',
            'Name',
            'Type',
            'MAC Address',
            'IPv4',
            'IPv6',
            'Speed (Mbps)',
            'Duplex',
            'MTU',
            'DHCP',
            'RX Bytes',
            'TX Bytes',
        ]);
        headerRow.font = { bold: true };

        data.network.forEach((iface: any) => {
            networkSheet.addRow([
                iface.iface || 'N/A',
                iface.ifaceName || 'N/A',
                iface.type || 'N/A',
                iface.mac || 'N/A',
                iface.ip4 || 'N/A',
                iface.ip6 || 'N/A',
                iface.speed || 'N/A',
                iface.duplex || 'N/A',
                iface.mtu || 'N/A',
                iface.dhcp ? 'Yes' : 'No',
                iface.rx_bytes || 'N/A',
                iface.tx_bytes || 'N/A',
            ]);
        });

        // Auto-fit columns
        networkSheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Audio Devices Sheet - New detailed section
    if (data.audio && Array.isArray(data.audio)) {
        const audioSheet = workbook.addWorksheet('Audio Devices');
        const audioHeader = audioSheet.addRow(['Audio Device Information']);
        audioHeader.font = { bold: true, size: 16 };
        audioSheet.addRow([]);

        const headerRow = audioSheet.addRow([
            'ID',
            'Name',
            'Manufacturer',
            'Revision',
            'Driver',
            'Default',
            'Channel',
            'Type',
            'Input',
            'Output',
            'Status',
        ]);
        headerRow.font = { bold: true };

        data.audio.forEach((device: any) => {
            audioSheet.addRow([
                device.id || 'N/A',
                device.name || 'N/A',
                device.manufacturer || 'N/A',
                device.revision || 'N/A',
                device.driver || 'N/A',
                device.default ? 'Yes' : 'No',
                device.channel || 'N/A',
                device.type || 'N/A',
                device.in ? 'Yes' : 'No',
                device.out ? 'Yes' : 'No',
                device.status || 'N/A',
            ]);
        });

        // Auto-fit columns
        audioSheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // USB Devices Sheet - New detailed section
    if (data.usb && Array.isArray(data.usb)) {
        const usbSheet = workbook.addWorksheet('USB Devices');
        const usbHeader = usbSheet.addRow(['USB Device Information']);
        usbHeader.font = { bold: true, size: 16 };
        usbSheet.addRow([]);

        const headerRow = usbSheet.addRow([
            'ID',
            'Bus',
            'Device ID',
            'Name',
            'Type',
            'Manufacturer',
            'Vendor',
            'Serial Number',
            'Max Power',
            'Removable',
        ]);
        headerRow.font = { bold: true };

        data.usb.forEach((device: any) => {
            usbSheet.addRow([
                device.id || 'N/A',
                device.bus || 'N/A',
                device.deviceId || 'N/A',
                device.name || 'N/A',
                device.type || 'N/A',
                device.manufacturer || 'N/A',
                device.vendor || 'N/A',
                device.serialNumber || 'N/A',
                device.maxPower || 'N/A',
                device.removable ? 'Yes' : 'No',
            ]);
        });

        // Auto-fit columns
        usbSheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Battery Information Sheet - New detailed section
    if (data.battery && Array.isArray(data.battery) && data.battery.length > 0) {
        const batterySheet = workbook.addWorksheet('Battery Details');
        const batteryHeader = batterySheet.addRow(['Battery Information']);
        batteryHeader.font = { bold: true, size: 16 };
        batterySheet.addRow([]);

        const headerRow = batterySheet.addRow([
            'Manufacturer',
            'Model',
            'Type',
            'Serial Number',
            'Has Battery',
            'Cycle Count',
            'Is Charging',
            'AC Connected',
            'Designed Capacity',
            'Max Capacity',
            'Current Capacity',
            'Percent',
            'Voltage',
            'Time Remaining',
        ]);
        headerRow.font = { bold: true };

        data.battery.forEach((bat: any) => {
            batterySheet.addRow([
                bat.manufacturer || 'N/A',
                bat.model || 'N/A',
                bat.type || 'N/A',
                bat.serial || 'N/A',
                bat.hasBattery ? 'Yes' : 'No',
                bat.cycleCount || 'N/A',
                bat.isCharging ? 'Yes' : 'No',
                bat.acConnected ? 'Yes' : 'No',
                bat.designedCapacity || 'N/A',
                bat.maxCapacity || 'N/A',
                bat.currentCapacity || 'N/A',
                bat.percent ? `${bat.percent}%` : 'N/A',
                bat.voltage || 'N/A',
                bat.timeRemaining || 'N/A',
            ]);
        });

        // Auto-fit columns
        batterySheet.columns.forEach((column) => {
            column.width = 15;
        });
    }

    // Style the main overview worksheet
    overviewSheet.getColumn(1).width = 25;
    overviewSheet.getColumn(2).width = 40;

    // Save the file
    await workbook.xlsx.writeFile(filePath);
}
