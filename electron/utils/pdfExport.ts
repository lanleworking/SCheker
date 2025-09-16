import fs from 'node:fs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to PDF format
 */
export async function exportToPDF(data: any, filePath: string): Promise<void> {
    const doc = new jsPDF();
    let currentPage = 1;

    // Title Page
    doc.setFontSize(24);
    doc.text('Device Information Report', 20, 30);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 45);
    doc.text(`Report includes: System, CPU, Memory, Storage, GPU, Display, BIOS, Motherboard, and more`, 20, 55);

    let yPos = 80;

    // Helper function to check if we need a new page
    const checkPageSpace = (requiredSpace: number) => {
        if (yPos + requiredSpace > 270) {
            doc.addPage();
            currentPage++;
            yPos = 20;
            return true;
        }
        return false;
    };

    // Helper function to add page number
    const addPageNumber = () => {
        doc.setFontSize(10);
        doc.text(`Page ${currentPage}`, 190, 285);
    };

    // System Information
    if (data.system) {
        checkPageSpace(80);
        doc.setFontSize(16);
        doc.text('System Information', 20, yPos);
        yPos += 10;

        const systemInfo = [
            ['Manufacturer', data.system.manufacturer || 'N/A'],
            ['Model', data.system.model || 'N/A'],
            ['Version', data.system.version || 'N/A'],
            ['Serial Number', data.system.serial || 'N/A'],
            ['UUID', data.system.uuid || 'N/A'],
            ['SKU', data.system.sku || 'N/A'],
            ['Virtual', data.system.virtual ? 'Yes' : 'No'],
        ];

        if (data.system.virtualHost) {
            systemInfo.push(['Virtual Host', data.system.virtualHost]);
        }

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: systemInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [63, 81, 181] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // BIOS Information
    if (data.bios) {
        checkPageSpace(60);
        doc.setFontSize(16);
        doc.text('BIOS Information', 20, yPos);
        yPos += 10;

        const biosInfo = [
            ['Vendor', data.bios.vendor || 'N/A'],
            ['Version', data.bios.version || 'N/A'],
            ['Release Date', data.bios.releaseDate || 'N/A'],
            ['Revision', data.bios.revision || 'N/A'],
        ];

        if (data.bios.language) {
            biosInfo.push(['Language', data.bios.language]);
        }

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: biosInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [76, 175, 80] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Motherboard Information
    if (data.baseboard) {
        checkPageSpace(70);
        doc.setFontSize(16);
        doc.text('Motherboard Information', 20, yPos);
        yPos += 10;

        const motherboardInfo = [
            ['Manufacturer', data.baseboard.manufacturer || 'N/A'],
            ['Model', data.baseboard.model || 'N/A'],
            ['Version', data.baseboard.version || 'N/A'],
            ['Serial Number', data.baseboard.serial || 'N/A'],
            ['Asset Tag', data.baseboard.assetTag || 'N/A'],
        ];

        if (data.baseboard.memMax) {
            motherboardInfo.push(['Max Memory (GB)', (data.baseboard.memMax / 1024 ** 3).toFixed(2)]);
        }
        if (data.baseboard.memSlots) {
            motherboardInfo.push(['Memory Slots', data.baseboard.memSlots.toString()]);
        }

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: motherboardInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [255, 152, 0] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // CPU Information
    if (data.cpu) {
        checkPageSpace(100);
        doc.setFontSize(16);
        doc.text('CPU Information', 20, yPos);
        yPos += 10;

        const cpuInfo = [
            ['Manufacturer', data.cpu.manufacturer || 'N/A'],
            ['Brand', data.cpu.brand || 'N/A'],
            ['Family', data.cpu.family || 'N/A'],
            ['Model', data.cpu.model || 'N/A'],
            ['Socket', data.cpu.socket || 'N/A'],
            ['Cores', data.cpu.cores?.toString() || 'N/A'],
            ['Physical Cores', data.cpu.physicalCores?.toString() || 'N/A'],
            ['Processors', data.cpu.processors?.toString() || 'N/A'],
            ['Speed (GHz)', data.cpu.speed?.toString() || 'N/A'],
            ['Speed Min (GHz)', data.cpu.speedMin?.toString() || 'N/A'],
            ['Speed Max (GHz)', data.cpu.speedMax?.toString() || 'N/A'],
            ['Virtualization', data.cpu.virtualization ? 'Yes' : 'No'],
            ['Usage (%)', data.cpu.usage?.toString() || 'N/A'],
        ];

        if (data.cpu.temperature) {
            cpuInfo.push(['Temperature (°C)', data.cpu.temperature.toString()]);
        }

        if (data.cpu.cache) {
            if (data.cpu.cache.l1d) cpuInfo.push(['L1D Cache (KB)', data.cpu.cache.l1d.toString()]);
            if (data.cpu.cache.l1i) cpuInfo.push(['L1I Cache (KB)', data.cpu.cache.l1i.toString()]);
            if (data.cpu.cache.l2) cpuInfo.push(['L2 Cache (KB)', data.cpu.cache.l2.toString()]);
            if (data.cpu.cache.l3) cpuInfo.push(['L3 Cache (KB)', data.cpu.cache.l3.toString()]);
        }

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: cpuInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Memory Information
    if (data.memory) {
        checkPageSpace(80);
        doc.setFontSize(16);
        doc.text('Memory Information', 20, yPos);
        yPos += 10;

        const memoryInfo = [
            ['Total (GB)', data.memory.total ? (data.memory.total / 1024 ** 3).toFixed(2) : 'N/A'],
            ['Used (GB)', data.memory.used ? (data.memory.used / 1024 ** 3).toFixed(2) : 'N/A'],
            ['Free (GB)', data.memory.free ? (data.memory.free / 1024 ** 3).toFixed(2) : 'N/A'],
            ['Available (GB)', data.memory.available ? (data.memory.available / 1024 ** 3).toFixed(2) : 'N/A'],
            ['Usage (%)', data.memory.usage?.toString() || 'N/A'],
            ['Swap Total (GB)', data.memory.swapTotal ? (data.memory.swapTotal / 1024 ** 3).toFixed(2) : 'N/A'],
            ['Swap Used (GB)', data.memory.swapUsed ? (data.memory.swapUsed / 1024 ** 3).toFixed(2) : 'N/A'],
            ['Swap Free (GB)', data.memory.swapFree ? (data.memory.swapFree / 1024 ** 3).toFixed(2) : 'N/A'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: memoryInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [156, 39, 176] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Add new page for detailed component information
    doc.addPage();
    currentPage++;
    yPos = 20;

    // Combined Storage Information (Logical Drives + Physical Devices)
    if ((data.storage && Array.isArray(data.storage)) || (data.storageDevices && Array.isArray(data.storageDevices))) {
        doc.setFontSize(16);
        doc.text('Storage & Storage Devices', 20, yPos);
        yPos += 10;

        // Logical Storage Drives
        if (data.storage && Array.isArray(data.storage)) {
            doc.setFontSize(14);
            doc.text('Logical Drives:', 20, yPos);
            yPos += 5;

            const storageData = data.storage.map((drive: any) => [
                drive.device || 'N/A',
                drive.vendor || drive.manufacturer || 'N/A',
                drive.type || 'N/A',
                drive.name || 'N/A',
                drive.size ? (drive.size / 1024 ** 3).toFixed(2) + ' GB' : 'N/A',
                drive.usage?.toString() + '%' || 'N/A',
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Device', 'Manufacturer', 'Type', 'Name', 'Size', 'Usage']],
                body: storageData,
                margin: { left: 20 },
                styles: { fontSize: 8 },
                headStyles: { fillColor: [67, 160, 71] },
            });

            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Physical Storage Devices
        if (data.storageDevices && Array.isArray(data.storageDevices)) {
            checkPageSpace(60);
            doc.setFontSize(14);
            doc.text('Physical Devices:', 20, yPos);
            yPos += 5;

            const deviceData = data.storageDevices
                .slice(0, 3)
                .map((device: any) => [
                    device.name || 'N/A',
                    device.manufacturer || 'N/A',
                    device.model || 'N/A',
                    device.type || 'N/A',
                    device.size ? (device.size / 1024 ** 3).toFixed(2) + ' GB' : 'N/A',
                    device.interfaceType || 'N/A',
                ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Name', 'Manufacturer', 'Model', 'Type', 'Size', 'Interface']],
                body: deviceData,
                margin: { left: 20 },
                styles: { fontSize: 8 },
                headStyles: { fillColor: [76, 175, 80] },
            });

            yPos = (doc as any).lastAutoTable.finalY + 15;
        }
    }

    // GPU Information
    if (data.gpu && Array.isArray(data.gpu) && data.gpu.length > 0) {
        checkPageSpace(80);
        doc.setFontSize(16);
        doc.text('GPU Information', 20, yPos);
        yPos += 10;

        const gpuData = data.gpu.map((gpu: any) => [
            gpu.manufacturer || gpu.vendor || 'N/A',
            gpu.model || 'N/A',
            gpu.vram ? `${gpu.vram} MB` : 'N/A',
            gpu.bus || 'N/A',
            gpu.driverVersion || 'N/A',
            gpu.temperatureGpu ? `${gpu.temperatureGpu}°C` : 'N/A',
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Manufacturer', 'Model', 'VRAM', 'Bus', 'Driver', 'Temp']],
            body: gpuData,
            margin: { left: 20 },
            styles: { fontSize: 8 },
            headStyles: { fillColor: [244, 67, 54] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Display Information
    if (data.displays && Array.isArray(data.displays) && data.displays.length > 0) {
        checkPageSpace(80);
        doc.setFontSize(16);
        doc.text('Display Information', 20, yPos);
        yPos += 10;

        const displayData = data.displays.map((display: any, index: number) => {
            const currentRes = `${display.currentResX || 0}×${display.currentResY || 0}`;
            const nativeRes = `${display.resolutionX || 0}×${display.resolutionY || 0}`;
            const physicalSize =
                display.sizeX && display.sizeY
                    ? `${(Math.sqrt(display.sizeX * display.sizeX + display.sizeY * display.sizeY) / 2.54).toFixed(1)}"`
                    : 'N/A';

            return [
                `Display ${index + 1}${display.main ? ' (Primary)' : ''}`,
                display.vendor || 'Unknown',
                display.model || 'Generic Monitor',
                currentRes,
                `${display.currentRefreshRate || 60}Hz`,
                display.connection || 'Unknown',
                physicalSize,
            ];
        });

        autoTable(doc, {
            startY: yPos,
            head: [['Display', 'Vendor', 'Model', 'Resolution', 'Refresh', 'Connection', 'Size']],
            body: displayData,
            margin: { left: 20 },
            styles: { fontSize: 8 },
            headStyles: { fillColor: [156, 39, 176] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Network Information
    if (data.network && Array.isArray(data.network) && data.network.length > 0) {
        checkPageSpace(80);
        doc.setFontSize(16);
        doc.text('Network Information', 20, yPos);
        yPos += 10;

        const networkData = data.network
            .slice(0, 5)
            .map((iface: any) => [
                iface.iface || 'N/A',
                iface.ifaceName || 'N/A',
                iface.type || 'N/A',
                iface.mac || 'N/A',
                iface.ip4 || 'N/A',
                iface.speed ? `${iface.speed} Mbps` : 'N/A',
            ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Interface', 'Name', 'Type', 'MAC', 'IPv4', 'Speed']],
            body: networkData,
            margin: { left: 20 },
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 150, 136] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Chassis Information
    if (data.chassis) {
        checkPageSpace(60);
        doc.setFontSize(16);
        doc.text('Chassis Information', 20, yPos);
        yPos += 10;

        const chassisInfo = [
            ['Manufacturer', data.chassis.manufacturer || 'N/A'],
            ['Model', data.chassis.model || 'N/A'],
            ['Type', data.chassis.type || 'N/A'],
            ['Version', data.chassis.version || 'N/A'],
            ['Serial Number', data.chassis.serial || 'N/A'],
            ['SKU', data.chassis.sku || 'N/A'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: chassisInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [121, 85, 72] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Operating System Information
    if (data.os) {
        checkPageSpace(80);
        doc.setFontSize(16);
        doc.text('Operating System', 20, yPos);
        yPos += 10;

        const osInfo = [
            ['Platform', data.os.platform || 'N/A'],
            ['Distribution', data.os.distro || 'N/A'],
            ['Release', data.os.release || 'N/A'],
            ['Architecture', data.os.arch || 'N/A'],
            ['Hostname', data.os.hostname || 'N/A'],
            ['Kernel', data.os.kernel || 'N/A'],
            ['Uptime (hours)', data.os.uptime ? (data.os.uptime / 3600).toFixed(2) : 'N/A'],
        ];

        if (data.os.build) {
            osInfo.push(['Build', data.os.build]);
        }

        autoTable(doc, {
            startY: yPos,
            head: [['Property', 'Value']],
            body: osInfo,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [96, 125, 139] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Audio Devices Summary
    if (data.audio && Array.isArray(data.audio) && data.audio.length > 0) {
        checkPageSpace(60);
        doc.setFontSize(16);
        doc.text('Audio Devices', 20, yPos);
        yPos += 10;

        const audioData = data.audio
            .slice(0, 3)
            .map((device: any) => [
                device.name || 'N/A',
                device.manufacturer || 'N/A',
                device.type || 'N/A',
                device.default ? 'Yes' : 'No',
            ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Name', 'Manufacturer', 'Type', 'Default']],
            body: audioData,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [255, 193, 7] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // USB Devices Summary (limited to prevent overflow)
    if (data.usb && Array.isArray(data.usb) && data.usb.length > 0) {
        checkPageSpace(60);
        doc.setFontSize(16);
        doc.text('USB Devices (Sample)', 20, yPos);
        yPos += 10;

        const usbData = data.usb
            .slice(0, 3)
            .map((device: any) => [
                device.name || 'N/A',
                device.manufacturer || device.vendor || 'N/A',
                device.type || 'N/A',
                device.removable ? 'Yes' : 'No',
            ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Name', 'Manufacturer', 'Type', 'Removable']],
            body: usbData,
            margin: { left: 20 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [158, 158, 158] },
        });
    }

    // Add page number to all pages
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${totalPages}`, 170, 285);
    }

    // Summary note
    doc.setPage(totalPages);
    doc.setFontSize(10);
    doc.text('Note: This report contains comprehensive manufacturer and hardware details.', 20, 275);
    doc.text('For complete information, use Excel or JSON export formats.', 20, 280);

    // Save the PDF
    const pdfBuffer = doc.output('arraybuffer');
    await fs.promises.writeFile(filePath, Buffer.from(pdfBuffer));
}
