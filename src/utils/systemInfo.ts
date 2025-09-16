import si from 'systeminformation';
import { formatBytes } from './format';

export interface SystemInfo {
    cpu: {
        manufacturer: string;
        brand: string;
        family: string;
        model: string;
        stepping: string;
        revision: string;
        cores: number;
        physicalCores: number;
        processors: number;
        socket: string;
        speed: number;
        speedMin: number;
        speedMax: number;
        cache: {
            l1d?: number;
            l1i?: number;
            l2?: number;
            l3?: number;
        };
        usage: number;
        temperature?: number;
        flags: string;
        virtualization: boolean;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        available: number;
        usage: number;
        swapTotal: number;
        swapUsed: number;
        swapFree: number;
        layoutLength: number;
        layout: Array<{
            size: number;
            bank: string;
            type: string;
            ecc: boolean;
            clockSpeed: number;
            formFactor: string;
            manufacturer: string;
            partNum: string;
            serialNum: string;
            voltageConfigured: number;
            voltageMin: number;
            voltageMax: number;
        }>;
    };
    storage: Array<{
        device: string;
        type: string;
        name: string;
        vendor: string;
        size: number;
        used: number;
        available: number;
        usage: number;
        filesystem: string;
        mount: string;
        protocol: string;
        temperature?: number;
        smartStatus?: string;
        serialNum?: string;
        firmwareRevision?: string;
        interfaceType?: string;
    }>;
    gpu: Array<{
        vendor: string;
        model: string;
        vram?: number;
        vramDynamic?: boolean;
        bus?: string;
        driverVersion?: string;
        driverDate?: string;
        clockCore?: number;
        clockMemory?: number;
        temperatureGpu?: number;
        utilizationGpu?: number;
        utilizationMemory?: number;
    }>;
    displays: Array<{
        vendor: string;
        model: string;
        deviceName: string;
        main: boolean;
        builtin: boolean;
        connection: string;
        resolutionX: number;
        resolutionY: number;
        sizeX?: number;
        sizeY?: number;
        pixelDepth: string;
        currentResX: number;
        currentResY: number;
        positionX: number;
        positionY: number;
        currentRefreshRate: number;
    }>;
    system: {
        manufacturer: string;
        model: string;
        version: string;
        serial?: string;
        uuid?: string;
        sku?: string;
        virtual: boolean;
        virtualHost?: string;
    };
    bios: {
        vendor: string;
        version: string;
        releaseDate: string;
        revision: string;
        language?: string;
    };
    baseboard: {
        manufacturer: string;
        model: string;
        version: string;
        serial?: string;
        assetTag?: string;
        memMax?: number;
        memSlots?: number;
    };
    chassis: {
        manufacturer: string;
        model: string;
        type: string;
        version: string;
        serial?: string;
        assetTag?: string;
        sku?: string;
    };
    os: {
        platform: string;
        distro: string;
        release: string;
        codename: string;
        kernel: string;
        arch: string;
        hostname: string;
        fqdn: string;
        uptime: number;
        logofile: string;
        serial?: string;
        build?: string;
    };
    network: Array<{
        iface: string;
        ifaceName: string;
        ip4: string;
        ip6: string;
        mac: string;
        type: string;
        duplex: string;
        mtu: number;
        speed: number;
        dhcp: boolean;
        dnsSuffix: string;
        ieee8021xAuth: boolean;
        ieee8021xState: string;
        rx_bytes: number;
        tx_bytes: number;
        rx_sec: number;
        tx_sec: number;
        ms: number;
    }>;
    battery?: Array<{
        hasBattery: boolean;
        cycleCount: number;
        isCharging: boolean;
        designedCapacity: number;
        maxCapacity: number;
        currentCapacity: number;
        voltage: number;
        capacityUnit: string;
        percent: number;
        timeRemaining: number;
        acConnected: boolean;
        type: string;
        model: string;
        manufacturer: string;
        serial: string;
    }>;
    audio: Array<{
        id: string;
        name: string;
        manufacturer: string;
        revision: string;
        driver: string;
        default: boolean;
        channel: string;
        type: string;
        in: boolean;
        out: boolean;
        status: string;
    }>;
    usb: Array<{
        id: string;
        bus: string;
        deviceId: string;
        name: string;
        type: string;
        removable: boolean;
        vendor: string;
        manufacturer: string;
        maxPower: string;
        serialNumber: string;
    }>;
    storageDevices: Array<{
        name: string;
        manufacturer: string;
        model: string;
        type: string;
        interfaceType: string;
        size: string;
        serialNumber: string;
    }>;
}

export class SystemInfoCollector {
    async getCPUInfo(): Promise<SystemInfo['cpu']> {
        try {
            const [cpu, cpuLoad, cpuTemp, cpuCurrentSpeed] = await Promise.all([
                si.cpu(),
                si.currentLoad(),
                si.cpuTemperature().catch(() => ({ main: undefined })),
                si.cpuCurrentSpeed(),
            ]);

            return {
                manufacturer: cpu.manufacturer || 'Unknown',
                brand: cpu.brand || 'Unknown',
                family: cpu.family || 'Unknown',
                model: cpu.model || 'Unknown',
                stepping: cpu.stepping || 'Unknown',
                revision: cpu.revision || 'Unknown',
                cores: cpu.cores || 0,
                physicalCores: cpu.physicalCores || 0,
                processors: cpu.processors || 1,
                socket: cpu.socket || 'Unknown',
                speed: cpuCurrentSpeed.avg || cpu.speed || 0,
                speedMin: cpu.speedMin || 0,
                speedMax: cpu.speedMax || 0,
                cache: {
                    l1d: cpu.cache?.l1d || undefined,
                    l1i: cpu.cache?.l1i || undefined,
                    l2: cpu.cache?.l2 || undefined,
                    l3: cpu.cache?.l3 || undefined,
                },
                usage: Math.round(cpuLoad.currentLoad),
                temperature: cpuTemp.main,
                flags: cpu.flags || '',
                virtualization: cpu.virtualization || false,
            };
        } catch (error) {
            console.error('Error getting CPU info:', error);
            throw error;
        }
    }

    async getMemoryInfo(): Promise<SystemInfo['memory']> {
        try {
            const [mem, memLayout] = await Promise.all([si.mem(), si.memLayout()]);

            return {
                total: mem.total,
                used: mem.used,
                free: mem.free,
                available: mem.available,
                usage: Math.round((mem.used / mem.total) * 100),
                swapTotal: mem.swaptotal,
                swapUsed: mem.swapused,
                swapFree: mem.swapfree,
                layoutLength: memLayout.length,
                layout: memLayout.map((module) => ({
                    size: module.size,
                    bank: module.bank || 'Unknown',
                    type: module.type || 'Unknown',
                    ecc: module.ecc || false,
                    clockSpeed: module.clockSpeed || 0,
                    formFactor: module.formFactor || 'Unknown',
                    manufacturer: module.manufacturer || 'Unknown',
                    partNum: module.partNum || 'Unknown',
                    serialNum: module.serialNum || 'Unknown',
                    voltageConfigured: module.voltageConfigured || 0,
                    voltageMin: module.voltageMin || 0,
                    voltageMax: module.voltageMax || 0,
                })),
            };
        } catch (error) {
            console.error('Error getting memory info:', error);
            throw error;
        }
    }

    async getStorageInfo(): Promise<SystemInfo['storage']> {
        try {
            const [fsSize, blockDevices] = await Promise.all([si.fsSize(), si.blockDevices()]);

            return fsSize.map((fs) => {
                const blockDevice = blockDevices.find((bd) => bd.name === fs.fs.replace('/dev/', ''));
                return {
                    device: fs.fs,
                    type: fs.type,
                    name: blockDevice?.label || fs.fs,
                    vendor: 'Unknown',
                    size: fs.size,
                    used: fs.used,
                    available: fs.available,
                    usage: Math.round((fs.used / fs.size) * 100),
                    filesystem: fs.type,
                    mount: fs.mount,
                    protocol: blockDevice?.protocol || 'Unknown',
                    temperature: undefined,
                    smartStatus: undefined,
                    serialNum: blockDevice?.serial,
                    firmwareRevision: undefined,
                    interfaceType: blockDevice?.type,
                };
            });
        } catch (error) {
            console.error('Error getting storage info:', error);
            throw error;
        }
    }

    async getStorageDevices(): Promise<SystemInfo['storageDevices']> {
        try {
            const diskLayout = await si.diskLayout();
            const storageDevices = diskLayout.map((disk) => ({
                name: disk.name || 'Unknown',
                manufacturer: disk.vendor || 'Unknown',
                model: disk.name || 'Unknown',
                type: disk.type || 'Unknown',
                interfaceType: disk.interfaceType || 'Unknown',
                size: formatBytes(disk.size),
                serialNumber: disk.serialNum || 'Unknown',
            }));
            return storageDevices;
        } catch (error) {
            console.error('Error getting storage devices:', error);
            throw error;
        }
    }

    async getGPUInfo(): Promise<SystemInfo['gpu']> {
        try {
            const graphics = await si.graphics();
            return graphics.controllers.map((gpu) => ({
                vendor: gpu.vendor || 'Unknown',
                model: gpu.model || 'Unknown',
                vram: gpu.vram || undefined,
                vramDynamic: gpu.vramDynamic || false,
                bus: gpu.bus || undefined,
                driverVersion: gpu.driverVersion || undefined,
                driverDate: undefined,
                clockCore: gpu.clockCore || undefined,
                clockMemory: gpu.clockMemory || undefined,
                temperatureGpu: gpu.temperatureGpu || undefined,
                utilizationGpu: gpu.utilizationGpu || undefined,
                utilizationMemory: gpu.utilizationMemory || undefined,
            }));
        } catch (error) {
            console.error('Error getting GPU info:', error);
            throw error;
        }
    }

    async getDisplayInfo(): Promise<SystemInfo['displays']> {
        try {
            const graphics = await si.graphics();
            return graphics.displays.map((display) => {
                // Detect common scaling scenarios for better resolution reporting
                const currentResX = display.currentResX || 0;
                const currentResY = display.currentResY || 0;
                const nativeResX = display.resolutionX || 0;
                const nativeResY = display.resolutionY || 0;

                return {
                    vendor: display.vendor || 'Unknown',
                    model: display.model || 'Unknown',
                    deviceName: display.deviceName || 'Unknown',
                    main: display.main || false,
                    builtin: display.builtin || false,
                    connection: display.connection || 'Unknown',
                    resolutionX: nativeResX,
                    resolutionY: nativeResY,
                    sizeX: display.sizeX || undefined,
                    sizeY: display.sizeY || undefined,
                    pixelDepth: String(display.pixelDepth) || '32',
                    currentResX: currentResX,
                    currentResY: currentResY,
                    positionX: display.positionX || 0,
                    positionY: display.positionY || 0,
                    currentRefreshRate: display.currentRefreshRate || 60,
                };
            });
        } catch (error) {
            console.error('Error getting display info:', error);
            return [];
        }
    }

    async getSystemInfo(): Promise<SystemInfo['system']> {
        try {
            const system = await si.system();
            return {
                manufacturer: system.manufacturer || 'Unknown',
                model: system.model || 'Unknown',
                version: system.version || 'Unknown',
                serial: system.serial === 'XXXXX-XXXXX-XXXXX-XXXXX' ? 'Not Available (Protected)' : system.serial,
                uuid: system.uuid,
                sku: system.sku,
                virtual: system.virtual || false,
                virtualHost: system.virtualHost,
            };
        } catch (error) {
            console.error('Error getting system info:', error);
            throw error;
        }
    }

    async getBIOSInfo(): Promise<SystemInfo['bios']> {
        try {
            const bios = await si.bios();

            return {
                vendor: bios.vendor || 'Unknown',
                version: bios.version || 'Unknown',
                releaseDate: bios.releaseDate || 'Unknown',
                revision: bios.revision || 'Unknown',
                language: bios.language,
            };
        } catch (error) {
            console.error('Error getting BIOS info:', error);
            throw error;
        }
    }

    async getBaseboardInfo(): Promise<SystemInfo['baseboard']> {
        try {
            const baseboard = await si.baseboard();

            return {
                manufacturer: baseboard.manufacturer || 'Unknown',
                model: baseboard.model || 'Unknown',
                version: baseboard.version || 'Unknown',
                serial: baseboard.serial === 'XXXXX-XXXXX-XXXXX-XXXXX' ? 'Not Available (Protected)' : baseboard.serial,
                assetTag: baseboard.assetTag,
                memMax: baseboard.memMax || undefined,
                memSlots: baseboard.memSlots || undefined,
            };
        } catch (error) {
            console.error('Error getting baseboard info:', error);
            throw error;
        }
    }

    async getChassisInfo(): Promise<SystemInfo['chassis']> {
        try {
            const chassis = await si.chassis();

            return {
                manufacturer: chassis.manufacturer || 'Unknown',
                model: chassis.model || 'Unknown',
                type: chassis.type || 'Unknown',
                version: chassis.version || 'Unknown',
                serial: chassis.serial === 'XXXXX-XXXXX-XXXXX-XXXXX' ? 'Not Available (Protected)' : chassis.serial,
                assetTag: chassis.assetTag,
                sku: chassis.sku,
            };
        } catch (error) {
            console.error('Error getting chassis info:', error);
            throw error;
        }
    }

    async getOSInfo(): Promise<SystemInfo['os']> {
        try {
            const [osInfo, time] = await Promise.all([si.osInfo(), si.time()]);

            return {
                platform: osInfo.platform || 'Unknown',
                distro: osInfo.distro || 'Unknown',
                release: osInfo.release || 'Unknown',
                codename: osInfo.codename || 'Unknown',
                kernel: osInfo.kernel || 'Unknown',
                arch: osInfo.arch || 'Unknown',
                hostname: osInfo.hostname || 'Unknown',
                fqdn: osInfo.fqdn || 'Unknown',
                uptime: time.uptime || 0,
                logofile: osInfo.logofile || '',
                serial: osInfo.serial === 'XXXXX-XXXXX-XXXXX-XXXXX' ? 'Not Available (Protected)' : osInfo.serial,
                build: osInfo.build,
            };
        } catch (error) {
            console.error('Error getting OS info:', error);
            throw error;
        }
    }

    async getNetworkInfo(): Promise<SystemInfo['network']> {
        try {
            const [interfaces, stats] = await Promise.all([si.networkInterfaces(), si.networkStats()]);

            return stats.map((stat) => {
                const iface = interfaces.find((i) => i.iface === stat.iface);
                return {
                    iface: stat.iface,
                    ifaceName: iface?.ifaceName || stat.iface,
                    ip4: iface?.ip4 || '',
                    ip6: iface?.ip6 || '',
                    mac: iface?.mac || '',
                    type: iface?.type || 'unknown',
                    duplex: iface?.duplex || 'unknown',
                    mtu: iface?.mtu || 0,
                    speed: iface?.speed || 0,
                    dhcp: iface?.dhcp || false,
                    dnsSuffix: iface?.dnsSuffix || '',
                    ieee8021xAuth: Boolean(iface?.ieee8021xAuth),
                    ieee8021xState: iface?.ieee8021xState || 'unknown',
                    rx_bytes: stat.rx_bytes,
                    tx_bytes: stat.tx_bytes,
                    rx_sec: stat.rx_sec,
                    tx_sec: stat.tx_sec,
                    ms: stat.ms || 0,
                };
            });
        } catch (error) {
            console.error('Error getting network info:', error);
            throw error;
        }
    }

    async getBatteryInfo(): Promise<SystemInfo['battery']> {
        try {
            const battery = await si.battery();

            if (!battery.hasBattery) {
                return undefined;
            }

            return [
                {
                    hasBattery: battery.hasBattery,
                    cycleCount: battery.cycleCount || 0,
                    isCharging: battery.isCharging || false,
                    designedCapacity: battery.designedCapacity || 0,
                    maxCapacity: battery.maxCapacity || 0,
                    currentCapacity: battery.currentCapacity || 0,
                    voltage: battery.voltage || 0,
                    capacityUnit: battery.capacityUnit || '',
                    percent: battery.percent || 0,
                    timeRemaining: battery.timeRemaining || 0,
                    acConnected: battery.acConnected || false,
                    type: battery.type || 'Unknown',
                    model: battery.model || 'Unknown',
                    manufacturer: battery.manufacturer || 'Unknown',
                    serial: battery.serial || 'Unknown',
                },
            ];
        } catch (error) {
            console.error('Error getting battery info:', error);
            return undefined;
        }
    }

    async getAudioInfo(): Promise<SystemInfo['audio']> {
        try {
            const audio = await si.audio();

            return audio.map((device) => ({
                id: String(device.id || 'Unknown'),
                name: device.name || 'Unknown',
                manufacturer: device.manufacturer || 'Unknown',
                revision: device.revision || 'Unknown',
                driver: device.driver || 'Unknown',
                default: device.default || false,
                channel: device.channel || 'Unknown',
                type: device.type || 'Unknown',
                in: device.in || false,
                out: device.out || false,
                status: device.status || 'Unknown',
            }));
        } catch (error) {
            console.error('Error getting audio info:', error);
            return [];
        }
    }

    async getUSBInfo(): Promise<SystemInfo['usb']> {
        try {
            const usb = await si.usb();

            return usb.map((device) => ({
                id: String(device.id || 'Unknown'),
                bus: String(device.bus || 'Unknown'),
                deviceId: String(device.deviceId || 'Unknown'),
                name: device.name || 'Unknown',
                type: device.type || 'Unknown',
                removable: device.removable || false,
                vendor: device.vendor || 'Unknown',
                manufacturer: device.manufacturer || 'Unknown',
                maxPower: device.maxPower || 'Unknown',
                serialNumber: device.serialNumber || 'Unknown',
            }));
        } catch (error) {
            console.error('Error getting USB info:', error);
            return [];
        }
    }

    async getAllSystemInfo(): Promise<SystemInfo> {
        try {
            const [
                cpu,
                memory,
                storage,
                gpu,
                displays,
                system,
                bios,
                baseboard,
                chassis,
                os,
                network,
                battery,
                audio,
                usb,
                storageDevices,
            ] = await Promise.all([
                this.getCPUInfo(),
                this.getMemoryInfo(),
                this.getStorageInfo(),
                this.getGPUInfo(),
                this.getDisplayInfo(),
                this.getSystemInfo(),
                this.getBIOSInfo(),
                this.getBaseboardInfo(),
                this.getChassisInfo(),
                this.getOSInfo(),
                this.getNetworkInfo(),
                this.getBatteryInfo(),
                this.getAudioInfo(),
                this.getUSBInfo(),
                this.getStorageDevices(),
            ]);

            return {
                cpu,
                memory,
                storage,
                gpu,
                displays,
                system,
                bios,
                baseboard,
                chassis,
                os,
                network,
                battery,
                audio,
                usb,
                storageDevices,
            };
        } catch (error) {
            console.error('Error getting all system info:', error);
            throw error;
        }
    }
}

export const systemInfoCollector = new SystemInfoCollector();
