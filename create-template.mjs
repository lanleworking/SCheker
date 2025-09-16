import fs from 'fs';
import path from 'path';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    Header,
    ImageRun,
    AlignmentType,
} from 'docx';

const fontSize = (size) => size * 2; // Convert to half-points
const lineSpacing = (spacing) => spacing * 240; // Convert to twips (1/20 of a point)
const beforeAfterSize = (size) => size * 20; // Convert inches to points
const defaultFont = 'GlyphaVO'; // Define the global font

// Define sections data structure
const sectionsData = [
    {
        title: 'Computer Information',
        rows: [
            { property: 'System Manufacturer', value: '{manufacturer}' },
            { property: 'Model', value: '{model}' },
            { property: 'System Serial Number', value: '{serialNumber}' },
            { property: 'UUID', value: '{uuid}' },
            { property: 'Mainboard Manufacturer', value: '{baseboardManufacturer}' },
            { property: 'Mainboard Model', value: '{baseboardModel}' },
            { property: 'Mainboard Version', value: '{baseboardVersion}' },
            { property: 'Mainboard Serial Number', value: '{baseboardSerial}' },
            { property: 'Maximum RAM Capacity', value: '{baseboardMemMax}' },
            { property: 'Number of RAM Slots', value: '{baseboardMemSlots}' },
        ],
    },
    {
        title: 'CPU Information',
        rows: [
            { property: 'CPU Brand', value: '{cpuBrand}' },
            { property: 'CPU Model', value: '{cpuModel}' },
            { property: 'Number of Cores', value: '{cpuCores}' },
            { property: 'Number of Threads', value: '{physicalCores}' },
            { property: 'Speed', value: '{cpuSpeed}' },
        ],
    },
    {
        title: 'Memory Information',
        rows: [
            { property: 'RAM Total', value: '{totalMemory}' },
            { property: 'RAM Type', value: '{memoryType}' },
        ],
    },
    {
        title: 'Memory Layout ({layoutLength})',
        isArray: true,
        arrayKey: 'memoryLayout',
        rows: [
            { property: 'Memory Slot', value: '{bank}' },
            { property: 'Manufacturer', value: '{manufacturer}' },
            { property: 'Part Number', value: '{partNum}' },
            { property: 'Serial Number', value: '{serialNum}' },
            { property: 'Size', value: '{size}' },
            { property: 'Type', value: '{type}' },
            { property: 'Clock Speed', value: '{clockSpeed}' },
            { property: 'Form Factor', value: '{formFactor}' },
            { property: 'ECC', value: '{ecc}' },
        ],
    },
    {
        title: 'Operating System',
        rows: [
            { property: 'OS Name', value: '{osName}' },
            { property: 'OS Platform', value: '{osPlatform}' },
            { property: 'OS Architecture', value: '{osArch}' },
            { property: 'OS Distribution', value: '{osDistro}' },
            { property: 'OS Code Name', value: '{osCodeName}' },
            { property: 'OS Serial', value: '{osSerial}' },
        ],
    },
    {
        title: 'GPU Information',
        isArray: true,
        arrayKey: 'gpus',
        rows: [
            { property: 'GPU Model', value: '{gpuModel}' },
            { property: 'GPU Vendor', value: '{gpuVendor}' },
            { property: 'VRAM', value: '{gpuVram}' },
            { property: 'Bus', value: '{gpuBus}' },
        ],
    },
    {
        title: 'Display Information',
        isArray: true,
        arrayKey: 'displays',
        rows: [
            { property: 'Display', value: '{displayNumber}' },
            { property: 'Vendor', value: '{displayVendor}' },
            { property: 'Model', value: '{displayModel}' },
            { property: 'Current Resolution', value: '{displayResolution}' },
            { property: 'Native Resolution', value: '{displayNativeResolution}' },
            { property: 'Refresh Rate', value: '{displayRefreshRate}' },
            { property: 'Connection', value: '{displayConnection}' },
            { property: 'Size', value: '{displaySize}' },
            { property: 'Built-in', value: '{displayBuiltin}' },
        ],
    },
    {
        title: 'Storage Information',
        isArray: true,
        arrayKey: 'storageDevices',
        rows: [
            { property: 'Storage Name', value: '{storageName}' },
            { property: 'Total Capacity', value: '{storageSize}' },
            { property: 'Type', value: '{storageType}' },
            { property: 'Manufacturer', value: '{storageManufacturer}' },
            { property: 'Model', value: '{storageModel}' },
            { property: 'Serial Number', value: '{storageSerial}' },
            { property: 'Interface', value: '{storageInterfaceType}' },
        ],
    },
    {
        title: 'Network Information',
        isArray: true,
        arrayKey: 'networkInterfaces',
        rows: [
            { property: 'Network Interface', value: '{networkIface}' },
            { property: 'Type', value: '{networkType}' },
            { property: 'IP Address (IPv4)', value: '{networkIp4}' },
            { property: 'IP Address (IPv6)', value: '{networkIp6}' },
            { property: 'MAC Address', value: '{networkMac}' },
        ],
    },
];

// Helper function to create header with logo
const createHeaderWithLogo = () => {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    try {
        if (fs.existsSync(logoPath)) {
            console.log('Logo found, adding to header...');
            const imageBuffer = fs.readFileSync(logoPath);

            return new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: {
                            after: 200,
                        },
                        children: [
                            new ImageRun({
                                data: imageBuffer,
                                transformation: {
                                    width: 100,
                                    height: 50,
                                },
                            }),
                        ],
                    }),
                ],
            });
        } else {
            console.log('Logo not found, using text header...');
            return new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: {
                            after: 200,
                        },
                        children: [
                            new TextRun({
                                text: 'VasPort Logo',
                                size: fontSize(10),
                                italics: true,
                                font: defaultFont,
                            }),
                        ],
                    }),
                ],
            });
        }
    } catch (error) {
        console.warn('Error loading logo, using text fallback:', error.message);
        return new Header({
            children: [
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: {
                        after: 200,
                    },
                    children: [
                        new TextRun({
                            text: 'VasPort Logo',
                            size: fontSize(10),
                            italics: true,
                            font: defaultFont,
                        }),
                    ],
                }),
            ],
        });
    }
};

// Helper function to create a table for a section
const createSectionTable = (section, defaultFont) => {
    return new Table({
        margins: {
            top: 100,
            bottom: 100,
            left: 100,
        },
        width: {
            size: '100%',
        },
        rows: [
            // Header row
            new TableRow({
                // tableHeader: true,
                children: [
                    new TableCell({
                        shading: {
                            fill: 'EA7F23',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'Property',
                                        bold: true,
                                        size: fontSize(12),
                                        font: defaultFont,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        shading: {
                            fill: 'EA7F23',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'Value',
                                        size: fontSize(12),
                                        bold: true,
                                        font: defaultFont,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            // Data rows
            ...section.rows.map(
                (row) =>
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [new TextRun({ text: row.property, font: defaultFont })],
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [new TextRun({ text: row.value, font: defaultFont })],
                                    }),
                                ],
                            }),
                        ],
                    }),
            ),
        ].filter(Boolean),
    });
};

// Helper function to create a section title
const createSectionTitle = (title, defaultFont) => {
    return new Paragraph({
        spacing: {
            before: beforeAfterSize(8),
            after: beforeAfterSize(12),
        },
        children: [
            new TextRun({
                text: title,
                bold: true,
                size: fontSize(14),
                font: defaultFont,
            }),
        ],
    });
};

// Create a simple Word document template with placeholders
function createWordTemplate() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: defaultFont,
                    },
                    paragraph: {
                        spacing: {
                            line: 240, // 1.3 line spacing
                            lineRule: 'multiple',
                        },
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch in twips
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                headers: {
                    default: createHeaderWithLogo(),
                },
                children: [
                    // Title
                    new Paragraph({
                        heading: HeadingLevel.TITLE,
                        alignment: 'center',
                        children: [
                            new TextRun({
                                text: 'DEVICE INFORMATION REPORT',
                                bold: true,
                                size: fontSize(18),
                                font: 'Cambria',
                            }),
                        ],
                    }),

                    // Report Date
                    new Paragraph({
                        spacing: {
                            before: beforeAfterSize(12),
                        },
                        children: [
                            new TextRun({
                                text: 'Report Date: {reportDate} at {reportTime}',
                                size: fontSize(12),
                                font: defaultFont,
                            }),
                        ],
                    }),

                    new Paragraph({ text: '' }), // Empty line

                    // Map all sections dynamically, with special handling for array sections
                    ...sectionsData.flatMap((section) => {
                        if (section.isArray) {
                            // For array sections, create a loop structure
                            return [
                                createSectionTitle(section.title, defaultFont),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `{#${section.arrayKey}}`,
                                            font: defaultFont,
                                            size: fontSize(1), // Very small size to make it nearly invisible
                                        }),
                                    ],
                                }),
                                createSectionTable(section, defaultFont),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `{/${section.arrayKey}}`,
                                            font: defaultFont,
                                            size: fontSize(1), // Very small size to make it nearly invisible
                                        }),
                                    ],
                                }),
                                new Paragraph({ text: '' }), // Empty line after each section
                            ];
                        } else {
                            // Regular sections
                            return [
                                createSectionTitle(section.title, defaultFont),
                                createSectionTable(section, defaultFont),
                                new Paragraph({ text: '' }), // Empty line after each section
                            ];
                        }
                    }),

                    // Additional spacing before signature
                    new Paragraph({ text: '' }),
                    new Paragraph({ text: '' }),

                    // Replace the signature paragraph with a table
                    new Table({
                        borders: {
                            top: { style: 'none' },
                            bottom: { style: 'none' },
                            left: { style: 'none' },
                            right: { style: 'none' },
                            insideHorizontal: { style: 'none' },
                            insideVertical: { style: 'none' },
                        },
                        width: {
                            size: '100%',
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: '33%' },
                                        // borders: {
                                        //     top: { style: 'none' },
                                        //     bottom: { style: 'none' },
                                        //     left: { style: 'none' },
                                        //     right: { style: 'none' },
                                        // },
                                        children: [
                                            new Paragraph({
                                                alignment: 'center',
                                                children: [
                                                    new TextRun({
                                                        text: 'Người được bàn giao',
                                                        font: defaultFont,
                                                        bold: true,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: 'center',
                                                children: [
                                                    new TextRun({
                                                        text: '(Ký và ghi rõ họ tên)',
                                                        font: defaultFont,
                                                        italics: true,
                                                        size: fontSize(10),
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: '33%' },
                                        // borders: {
                                        //     top: { style: 'none' },
                                        //     bottom: { style: 'none' },
                                        //     left: { style: 'none' },
                                        //     right: { style: 'none' },
                                        // },
                                        children: [
                                            new Paragraph({
                                                alignment: 'center',
                                                children: [
                                                    new TextRun({
                                                        text: 'Người kiểm tra',
                                                        font: defaultFont,
                                                        bold: true,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: 'center',
                                                children: [
                                                    new TextRun({
                                                        text: '(Ký và ghi rõ họ tên)',
                                                        font: defaultFont,
                                                        italics: true,
                                                        size: fontSize(10),
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: '33%' },
                                        // borders: {
                                        //     top: { style: 'none' },
                                        //     bottom: { style: 'none' },
                                        //     left: { style: 'none' },
                                        //     right: { style: 'none' },
                                        // },
                                        children: [
                                            new Paragraph({
                                                alignment: 'center',
                                                children: [
                                                    new TextRun({
                                                        text: 'Trưởng đơn vị',
                                                        font: defaultFont,
                                                        bold: true,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: 'center',
                                                children: [
                                                    new TextRun({
                                                        text: '(Ký và ghi rõ họ tên)',
                                                        font: defaultFont,
                                                        italics: true,
                                                        size: fontSize(10),
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    return doc;
}

// Generate the template
async function generateTemplate() {
    try {
        console.log('Creating Word template with header logo...');
        const doc = createWordTemplate();
        const buffer = await Packer.toBuffer(doc);

        const publicDir = path.join(process.cwd(), 'public');
        const templatePath = path.join(publicDir, 'DeviceTemplate.docx');

        await fs.promises.writeFile(templatePath, buffer);
        console.log('Template created successfully at:', templatePath);
        console.log('Header logo configuration applied.');
    } catch (error) {
        console.error('Error creating template:', error);
    }
}

generateTemplate();
