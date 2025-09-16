# Device Checker React - Enhanced Hardware Information Tool

A comprehensive Electron application built with React, TypeScript, and TailwindCSS for monitoring detailed system information on Windows PCs and laptops.

## 🚀 Features

### System Overview Tab

-   **CPU Information**: Real-time processor details including brand, cores, speed, usage, temperature, cache levels, and virtualization support
-   **Memory Information**: RAM usage with detailed memory module information (type, speed, manufacturer, capacity)
-   **Storage Information**: Disk usage, filesystem details, and storage device information
-   **GPU Information**: Graphics card details including VRAM, driver version, and utilization
-   **Network Information**: Network interface details with real-time data transfer statistics
-   **Operating System**: Comprehensive OS information including build, kernel, and uptime

### Detailed Hardware Tab

-   **BIOS Information**: BIOS vendor, version, release date, and revision details
-   **Motherboard Information**: Baseboard manufacturer, model, memory slots, and maximum memory capacity
-   **Chassis Information**: Case manufacturer, model, type, and serial information
-   **Battery Information**: Battery status, charge level, capacity, and cycle count (for laptops)
-   **Audio Devices**: Audio hardware and drivers with input/output capabilities
-   **USB Devices**: Connected USB devices with manufacturer and power information

### Technical Features

-   Real-time monitoring with 5-second auto-refresh
-   Modern glassmorphism UI with smooth animations
-   Secure context isolation and preload script
-   Responsive design that adapts to different screen sizes
-   Color-coded usage indicators and progress bars
-   Manual refresh capability
-   Tabbed interface for organized information display

## 🛠️ Tech Stack

-   **Frontend**: React 19 + TypeScript + TailwindCSS 4
-   **Desktop Framework**: Electron 38 with secure IPC communication
-   **Build Tool**: Vite 7 for fast development and optimized builds
-   **System Information**: systeminformation library for hardware data collection
-   **Icons**: Lucide React for modern iconography
-   **Build Target**: Windows executable (.exe) generation

## � Installation

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd DeviceCheckerReact
```

2. Install dependencies:

```bash
npm install
```

## 🏃‍♂️ Development

### Start Development Server

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:3000`

### Run Electron App in Development

```bash
npm run electron:dev
```

This concurrently runs the Vite dev server and launches the Electron app

### Build for Production

```bash
npm run build
```

Creates optimized production builds for both renderer and main processes

### Create Windows Executable

```bash
npm run dist
```

Generates a distributable Windows executable using electron-builder

## 📁 Project Structure

```
DeviceCheckerReact/
├── electron/
│   ├── main.ts              # Main Electron process
│   └── preload.ts           # Preload script for secure IPC
├── src/
│   ├── components/          # React components
│   │   ├── SystemOverview.tsx
│   │   ├── CPUCard.tsx
│   │   ├── MemoryCard.tsx
│   │   ├── StorageCard.tsx
│   │   ├── GPUCard.tsx
│   │   ├── NetworkCard.tsx
│   │   └── DetailedHardwareInfo.tsx
│   ├── types/
│   │   └── electron.d.ts    # TypeScript definitions
│   ├── utils/
│   │   └── systemInfo.ts    # System information collection
│   ├── App.tsx              # Main application component
│   └── main.tsx             # React entry point
├── dist/                    # Production build output
├── dist-electron/           # Electron build output
└── release/                 # Executable output
```

## � System Information Collected

### Basic Information

-   CPU: Brand, cores, speed, usage, temperature, cache, flags
-   Memory: Total/used/free, swap, individual module details
-   Storage: Devices, usage, filesystem, capacity, health status
-   GPU: Vendor, model, VRAM, utilization, driver information
-   Network: Interfaces, IP addresses, data transfer rates
-   OS: Platform, distribution, kernel, architecture, uptime

### Advanced Hardware Details

-   BIOS: Vendor, version, release date, revision, language
-   Motherboard: Manufacturer, model, memory capabilities
-   Chassis: Case type, manufacturer, serial numbers
-   Battery: Charge status, capacity, health, cycle count
-   Audio: Sound devices, drivers, input/output capabilities
-   USB: Connected devices, power consumption, specifications

## 🎨 UI Features

-   **Glassmorphism Design**: Modern frosted glass effect with backdrop blur
-   **Responsive Grid Layout**: Adapts to different screen sizes
-   **Real-time Updates**: Live data with visual indicators
-   **Progress Bars**: Color-coded usage indicators (green/yellow/red)
-   **Tab Navigation**: Organized information display
-   **Loading States**: Smooth loading animations
-   **Error Handling**: Graceful error display and recovery

## � Security

-   Context isolation enabled for secure renderer process
-   Preload script for controlled IPC communication
-   Node.js integration disabled in renderer for security
-   Secure communication between main and renderer processes

## � Performance

-   Vite for lightning-fast development builds
-   Optimized production bundles with tree shaking
-   Efficient memory usage with React hooks
-   Background system monitoring without blocking UI
-   Minimal resource footprint

## 📋 Available Scripts

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start Vite development server   |
| `npm run electron:dev` | Run Electron app in development |
| `npm run build`        | Build for production            |
| `npm run dist`         | Create Windows executable       |
| `npm run preview`      | Preview production build        |

## 🐛 Troubleshooting

### Common Issues

1. **Cache Permission Errors**: These are Electron warnings on Windows and don't affect functionality
2. **Build Failures**: Ensure Node.js 18+ is installed and dependencies are updated
3. **Executable Won't Start**: Check antivirus software isn't blocking the app

### Development Tips

-   Use `npm run electron:dev` for the best development experience
-   The app includes mock data fallback for browser testing
-   Hot reload is enabled for both renderer and main processes
-   Build artifacts are in `dist/` and `dist-electron/` directories

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔮 Future Enhancements

-   Temperature monitoring for all components
-   Performance benchmarking tools
-   System health alerts and notifications
-   Export functionality for system reports
-   Multi-language support
-   Dark/light theme toggle
-   System optimization recommendations
