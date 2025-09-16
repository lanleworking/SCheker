export interface Device {
    Id?: number;
    Username?: string;
    UserId?: string;
    SystemManufacturer?: string;
    SystemModel?: string;
    SystemSerialNumber?: string;
    SystemUUID?: string;
    BaseBoardSerialNumber?: string;
    OSName?: string;
    IPv4?: string;
    MACAddress?: string;
    IPv6?: string;
}

export interface DeviceSubmission {
    deviceData: Partial<Device>;
    userId: string;
    username: string;
    pass: string;
}
