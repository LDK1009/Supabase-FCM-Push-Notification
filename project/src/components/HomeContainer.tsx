"use client";

import { useState, useEffect } from "react";
import { getFcmToken, requestNotificationPermission } from "@/utils/pushNotification";

export default function HomeContainer() {
  ////////////////////////////// State //////////////////////////////
  // 브라우저 지원 여부
  const [isSupported, setIsSupported] = useState(true);
  // 알림 권한 상태
  const [notificationStatus, setNotificationStatus] = useState("확인 중...");
  // FCM 토큰
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  ////////////////////////////// Effect //////////////////////////////
  // 마운트 시 실행
  useEffect(() => {
    // 브라우저 지원 여부 확인
    checkSupport();
  }, []);

  ////////////////////////////// Function //////////////////////////////
  // 브라우저 지원 여부 확인
  function checkSupport() {
    const supported = "serviceWorker" in navigator && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setNotificationStatus(Notification.permission);
    } else {
      setNotificationStatus("지원되지 않음");
    }
  }

  // 알림 권한 요청
  async function handleRequestPermission() {
    const { data, error } = await requestNotificationPermission();
    if (error) {
      alert(error);
    } else {
      alert(data);
    }
  }

  // FCM 토큰 발급
  async function handleGetFcmToken() {
    const { data, error } = await getFcmToken();

    // 토큰 발급 실패
    if (error) {
      alert(error);
      return;
    }

    // 토큰 발급 성공
    setFcmToken(data);
  }

  // 푸시 알림 테스트 버튼 클릭 시 실행
  function handlePushButton() {
    handleRequestPermission();
    handleGetFcmToken();
  }

  return (
    <main>
      {/* 헤더 */}
      <header>
        <h1>Firebase Cloud Messaging 테스트</h1>
        <p>웹 푸시 알림 기능을 테스트하는 페이지입니다.</p>
      </header>

      <br />
      <br />

      {/* 브라우저 지원 상태 */}
      <section>
        <h2>브라우저 지원 상태</h2>
        <p>
          <strong>푸시 알림 지원:</strong> {isSupported ? "지원됨" : "지원되지 않음"}
        </p>
        <p>
          <strong>알림 권한 상태:</strong> {notificationStatus}
        </p>
      </section>

      <br />
      <br />

      {/* 푸시 알림 테스트 */}
      <section>
        <h2>푸시 알림 테스트</h2>
        <button onClick={handlePushButton} disabled={!isSupported || notificationStatus === "denied"}>
          푸시 알림 권한 요청
        </button>

        {notificationStatus === "denied" && (
          <div>
            <p>
              <strong>알림 권한이 거부되었습니다.</strong> 브라우저 설정에서 권한을 변경해주세요.
            </p>
            <details>
              <summary>권한 변경 방법</summary>
              <ul>
                <li>Chrome: 주소창 왼쪽의 자물쇠/i 아이콘 &gt; 사이트 설정 &gt; 알림</li>
                <li>Safari: 환경설정 &gt; 웹사이트 &gt; 알림</li>
                <li>Firefox: 주소창 왼쪽의 i 아이콘 &gt; 권한 &gt; 알림</li>
              </ul>
            </details>
          </div>
        )}
      </section>

      <br />
      <br />

      {/* FCM 토큰 */}
      {fcmToken && (
        <section>
          <h2>FCM 토큰</h2>
          <p>
            <strong>발급된 토큰:</strong>
          </p>
          <div>
            <p style={{ wordBreak: "break-all" }}>{fcmToken}</p>
          </div>
        </section>
      )}

      <br />
      <br />

      {/* 푸터 */}
      <footer>
        <p>Next.js + Firebase Cloud Messaging 테스트 애플리케이션</p>
        <p>© 2025 푸시 알림 테스트</p>
      </footer>
    </main>
  );
}
