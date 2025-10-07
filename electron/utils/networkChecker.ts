import { net } from 'electron';
import log from 'electron-log';

export class NetworkChecker {
    private static instance: NetworkChecker;

    public static getInstance(): NetworkChecker {
        if (!NetworkChecker.instance) {
            NetworkChecker.instance = new NetworkChecker();
        }
        return NetworkChecker.instance;
    }

    /**
     * Check if the application has internet connectivity
     * @returns Promise<boolean> - true if connected, false if no connection
     */
    public async checkInternetConnection(): Promise<boolean> {
        try {
            // Check if we can reach multiple reliable endpoints
            const endpoints = ['https://www.google.com', 'https://www.cloudflare.com', 'https://www.github.com'];

            // Try to reach at least one endpoint
            for (const endpoint of endpoints) {
                try {
                    const request = net.request(endpoint);

                    const result = await new Promise<boolean>((resolve) => {
                        const timeout = setTimeout(() => {
                            request.abort();
                            resolve(false);
                        }, 5000); // 5 second timeout

                        request.on('response', (response) => {
                            clearTimeout(timeout);
                            resolve(response.statusCode >= 200 && response.statusCode < 400);
                        });

                        request.on('error', () => {
                            clearTimeout(timeout);
                            resolve(false);
                        });

                        request.end();
                    });

                    if (result) {
                        log.info('Internet connection available');
                        return true;
                    }
                } catch (error) {
                    log.warn(`Failed to reach ${endpoint}:`, error);
                    continue;
                }
            }

            log.warn('No internet connection detected');
            return false;
        } catch (error) {
            log.error('Error checking internet connection:', error);
            return false;
        }
    }

    /**
     * Check if the system has a network interface that appears to be connected
     * @returns boolean - true if network interface is available
     */
    public isNetworkAvailable(): boolean {
        try {
            return net.isOnline();
        } catch (error) {
            log.error('Error checking network availability:', error);
            return false;
        }
    }
}
