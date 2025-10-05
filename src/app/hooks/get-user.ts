"use client";

import { useState } from 'react';

// Define types for the API response
interface UserData {
    id: string;
    email?: string;
    name?: string;
    // Add other user properties as needed
}

interface ApiResponse {
    success: boolean;
    data?: UserData;
    error?: string;
}

// Define the hook return type
interface UseGetUserReturn {
    getUser: (customerId: string) => Promise<ApiResponse | undefined>;
}

export const useGetUser = (): UseGetUserReturn => {
    const getUser = async (customerId: string): Promise<ApiResponse | undefined> => {
        try {
            const response = await fetch('/api/admin/auth/get-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: customerId }),
            });

            const data: ApiResponse = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };

    return { getUser };
};
