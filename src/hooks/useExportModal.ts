import { useState, useEffect } from 'react';
import axios from 'axios';
import type { SystemInfo } from '../utils/systemInfo';
import type { DeviceSubmission } from '../types/Device';
import { convertSystemInfoToDevice } from '../utils/exportUtils';

const INSERT_API = import.meta.env.VITE_INSERT_API;
// Hook for managing modal scroll lock
export const useModalScrollLock = (isOpen: boolean) => {
    useEffect(() => {
        if (isOpen) {
            // Save the current scroll position
            const scrollY = window.scrollY;

            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';

            return () => {
                // Restore scrolling and position when modal closes
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);
};

// Hook for managing file path selection
export const useFilePathSelection = () => {
    const [isSelectingPath, setIsSelectingPath] = useState(false);

    const handleSelectPath = async () => {
        setIsSelectingPath(true);
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.selectSavePath();
                return result || '';
            }
            return '';
        } catch (error) {
            console.error('Error selecting path:', error);
            return '';
        } finally {
            setIsSelectingPath(false);
        }
    };

    return {
        isSelectingPath,
        handleSelectPath,
    };
};

// Hook for managing database save functionality
export const useDatabaseSave = () => {
    const [isSaving, setIsSaving] = useState(false);

    const saveToDatabase = async (
        systemInfo: SystemInfo,
        username: string,
        userId: string,
        password: string,
    ): Promise<boolean> => {
        if (!username.trim() || !userId.trim() || !password.trim()) {
            alert('Please fill in all required fields (Username, User ID, and Password)');
            return false;
        }

        if (!systemInfo) {
            alert('No system information available to save');
            return false;
        }

        setIsSaving(true);
        try {
            const deviceData = convertSystemInfoToDevice(systemInfo);
            const submission: DeviceSubmission = {
                deviceData,
                userId: userId.trim(),
                username: username.trim().toLowerCase(),
                pass: password.trim(),
            };

            const response = await axios.post(INSERT_API, submission, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 second timeout
            });

            if (response.status === 200 || response.status === 201) {
                alert('Device information saved successfully!');
                return true;
            } else {
                alert('Failed to save device information. Please try again.');
                return false;
            }
        } catch (error: any) {
            console.error('Error saving device information:', error);
            if (error.code === 'ECONNREFUSED') {
                alert('Unable to connect to the server. Please make sure the API server is running on localhost:5080');
            } else if (error.response) {
                alert(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                alert('Network error: Unable to reach the server');
            } else {
                alert('Error saving device information. Please try again.');
            }
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isSaving,
        saveToDatabase,
    };
};
