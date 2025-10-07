import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the path to the DeviceTemplate.docx file
 * Tries multiple possible locations depending on development vs production
 */
export function resolveTemplatePath(): string {
    const possiblePaths = [
        // Development paths
        path.join(__dirname, '../../public/DeviceTemplate.docx'),
        path.join(__dirname, '../../../public/DeviceTemplate.docx'),
        path.join(process.cwd(), 'public/DeviceTemplate.docx'),

        // Production paths (packaged app)
        path.join(process.resourcesPath, 'public/DeviceTemplate.docx'),
        path.join(process.resourcesPath, 'app.asar.unpacked/public/DeviceTemplate.docx'),
        path.join(app.getAppPath(), 'public/DeviceTemplate.docx'),
        path.join(app.getAppPath(), 'dist/DeviceTemplate.docx'),

        // Alternative production paths
        path.join(path.dirname(app.getPath('exe')), 'resources/public/DeviceTemplate.docx'),
        path.join(path.dirname(app.getPath('exe')), 'public/DeviceTemplate.docx'),
    ];

    for (const possiblePath of possiblePaths) {
        try {
            if (fs.existsSync(possiblePath)) {
                console.log(`Template found at: ${possiblePath}`);
                return possiblePath;
            }
        } catch (error) {
            // Continue to next path
            continue;
        }
    }

    // If no template found, throw detailed error
    const errorMessage = `DeviceTemplate.docx not found. Searched paths:\n${possiblePaths
        .map((p) => `  - ${p}`)
        .join('\n')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

/**
 * Validate that the template file exists and is readable
 */
export function validateTemplate(templatePath: string): boolean {
    try {
        const stats = fs.statSync(templatePath);
        if (!stats.isFile()) {
            throw new Error(`Template path is not a file: ${templatePath}`);
        }

        // Try to read a small portion to verify it's accessible
        const fd = fs.openSync(templatePath, 'r');
        const buffer = Buffer.alloc(4);
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);

        // Check if it looks like a ZIP file (DOCX files are ZIP archives)
        const magicBytes = buffer.toString('hex');
        if (!magicBytes.startsWith('504b')) {
            // PK magic bytes for ZIP
            console.warn(`Template file may not be a valid DOCX file: ${templatePath}`);
        }

        return true;
    } catch (error) {
        console.error(`Template validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}
