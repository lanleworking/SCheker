import fs from 'node:fs';
import path from 'node:path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { formatBytes } from '../../src/utils/format';

/**
 * Export data to Word document using template
 */
export async function exportToWordWithDeviceInfo(data: any, filePath: string): Promise<boolean> {
    try {
        const templatePath = path.join(process.env.VITE_PUBLIC || '', 'DeviceTemplate.docx');

        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            throw new Error('DeviceTemplate.docx not found in public folder');
        }

        // Read the template
        const templateContent = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(templateContent);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Prepare device information for the template
        const deviceInfo = {
            // Computer Information
            manufacturer: data.system?.manufacturer || '',
            model: data.system?.model || '',
            serialNumber: data.system?.serial || '',
            uuid: data.system?.uuid || '',
            baseboardManufacturer: data.baseboard?.manufacturer || '',
            baseboardModel: data.baseboard?.model || '',
            baseboardVersion: data.baseboard?.version || '',
            baseboardSerial: data.baseboard?.serial || '',
            baseboardMemMax: data.baseboard?.memMax ? formatBytes(data.baseboard.memMax) : '',
            baseboardMemSlots: data.baseboard?.memSlots || '',

            // CPU Information
            cpuBrand: data.cpu?.manufacturer || '',
            cpuModel: data.cpu?.brand || '',
            cpuCores: data.cpu?.cores || '',
            cpuSpeed: data.cpu?.speed ? `${data.cpu.speed} GHz` : '',
            physicalCores: data.cpu?.physicalCores || '',

            // Memory Information
            totalMemory: data.memory?.total ? formatBytes(data.memory.total) : '',
            memoryType: data.memory?.layout?.[0]?.type || '',

            // Memory Layout Information (All modules)
            memoryLayout: data.memory?.layout
                ? data.memory.layout.map((module: any) => ({
                      bank: module.bank || '',
                      manufacturer: module.manufacturer || '',
                      partNum: module.partNum || '',
                      serialNum: module.serialNum || '',
                      size: module.size ? formatBytes(module.size) : '',
                      type: module.type || '',
                      clockSpeed: module.clockSpeed ? `${module.clockSpeed} MHz` : '',
                      formFactor: module.formFactor || '',
                      ecc: module.ecc ? 'Yes' : 'No',
                  }))
                : [],
            layoutLength: data.memory?.layout
                ? `${data.memory.layout.length} module${data.memory.layout.length > 1 ? 's' : ''}`
                : '0 modules',
            // Storage Information
            storageDevices:
                data.storageDevices?.map((drive: any) => ({
                    storageName: drive.name || '',
                    storageType: drive.type || '',
                    storageSize: drive.size ? drive.size : '',
                    storageManufacturer: drive.manufacturer ? drive.manufacturer : '',
                    storageModel: drive.model ? drive.model : '',
                    storageSerial: drive.serialNumber || '',
                    storageInterfaceType: drive.interfaceType || '',
                })) || [],

            // OS Information
            osName: data.os?.hostname || '',
            osDistro: data.os?.distro || '',
            osPlatform: data.os?.platform || '',
            osArch: data.os?.arch || '',
            osCodeName: data.os?.codename || '',
            osSerial: data.os?.serial || '',

            // GPU Information
            gpus:
                data.gpu?.map((gpu: any) => ({
                    gpuModel: gpu.model || '',
                    gpuVendor: gpu.vendor || gpu.manufacturer || '',
                    gpuVram: gpu.vram ? `${gpu.vram} MB` : '',
                    gpuBus: gpu.bus || '',
                })) || [],
            gpuCount: data.gpu ? `${data.gpu.length} GPU's` : "0 GPU's",

            // Display Information
            displays:
                data.displays?.map((display: any, index: number) => {
                    const currentRes = `${display.currentResX || 0} × ${display.currentResY || 0}`;
                    const nativeRes = `${display.resolutionX || 0} × ${display.resolutionY || 0}`;
                    const physicalSize =
                        display.sizeX && display.sizeY
                            ? `${(
                                  Math.sqrt(display.sizeX * display.sizeX + display.sizeY * display.sizeY) / 2.54
                              ).toFixed(1)}"`
                            : 'Unknown';

                    return {
                        displayNumber: `Display ${index + 1}${display.main ? ' (Primary)' : ''}`,
                        displayVendor: display.vendor || 'Unknown',
                        displayModel: display.model || 'Generic Monitor',
                        displayResolution: currentRes,
                        displayNativeResolution: nativeRes,
                        displayRefreshRate: `${display.currentRefreshRate || 60} Hz`,
                        displayConnection: display.connection || 'Unknown',
                        displaySize: `${physicalSize}`,
                        displayBuiltin: display.builtin ? 'Yes' : 'No',
                    };
                }) || [],
            displayCount: data.displays
                ? `${data.displays.length} Display${data.displays.length !== 1 ? 's' : ''}`
                : '0 Displays',

            // BIOS Information
            biosVendor: data.bios?.vendor || '',
            biosVersion: data.bios?.version || '',
            biosDate: data.bios?.releaseDate || '',

            // Motherboard Information
            motherboardManufacturer: data.baseboard?.manufacturer || '',
            motherboardModel: data.baseboard?.model || '',
            motherboardSerial: data.baseboard?.serial || '',

            // Network Information
            networkInterfaces:
                data.network?.map((iface: any) => ({
                    networkIface: iface.iface || '',
                    networkType: iface.type || '',
                    networkIp4: iface.ip4 || '',
                    networkIp6: iface.ip6 || '',
                    networkMac: iface.mac || '',
                })) || [],

            // Date and Time
            reportDate: new Date().toLocaleDateString(),
            reportTime: new Date().toLocaleTimeString(),
        };

        // Set the template data using the new API
        doc.render(deviceInfo);

        // Get the rendered document
        const output = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        // Save the document
        await fs.promises.writeFile(filePath, output);

        return true;
    } catch (error) {
        console.error('Error exporting to Word:', error);
        throw error;
    }
}
