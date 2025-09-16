import fs from 'node:fs';

/**
 * Export data to JSON format
 */
export async function exportToJSON(data: any, filePath: string): Promise<void> {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(filePath, jsonData, 'utf-8');
}
