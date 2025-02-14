"use client"
import { useState } from 'react';

export const useGetUser = () => {

  const getUser = async (customerId) => {

    try {
        const response = await fetch('/api/admin/auth/get-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: customerId }),
        });

        const data = await response.json();

        return data;
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return { getUser };
};
