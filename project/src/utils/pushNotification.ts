"use client";
import { getToken, isSupported, onMessage } from "firebase/messaging";
import { messaging } from "../lib/firebaseConfig";

// 푸시 알림 권한 요청
export async function requestNotificationPermission() {

  const supported = await isSupported();
  if (!supported) {
    alert("이 브라우저는 FCM을 지원하지 않습니다.");
  }
  
  // 알림 권한 요청
  const permission = await Notification.requestPermission();

  // 알림 권한 허용 안됨
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return;
  }

  // 알림 권한이 허용됨
  console.log("알림 권한이 허용됨");

  // FCM 토큰 발급
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });

  if (token) {
    // 토큰 발급 성공
    alert("token: " + token);
  } else {
    // 토큰 발급 실패
    alert("Can not get Token");
  }

  // 포그라운드 환경에서 메시지 수신 시 실행
  onMessage(messaging, (payload) => {
    alert("메시지가 도착했습니다." + payload);
    // ...
  });
}
