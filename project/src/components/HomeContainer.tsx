"use client";
import { requestNotificationPermission } from '@/utils/pushNotification';
import { useEffect } from 'react';

const HomeContainer = () => {

    useEffect(() => {
        async function init() {
            await requestNotificationPermission();
        }
        init();
    }, []);

    return (
        <div>
           Hello World
        </div>
    );
};

export default HomeContainer;