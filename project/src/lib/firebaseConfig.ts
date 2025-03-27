"use client";

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// 프로젝트 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 프로젝트 초기화
const app = initializeApp(firebaseConfig);

let messaging;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { messaging };
