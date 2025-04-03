"use client";

import { useState, useEffect } from "react";
import { getFcmToken, requestNotificationPermission } from "@/utils/pushNotification";
import { supabase } from "@/lib/supabaseClientConfig";

export default function HomeContainer() {
  ////////////////////////////// State //////////////////////////////
  // 브라우저 지원 여부
  const [isSupported, setIsSupported] = useState(true);
  // 알림 권한 상태
  const [notificationStatus, setNotificationStatus] = useState("확인 중...");
  // FCM 토큰
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  // 이메일
  const [email, setEmail] = useState("");
  // 비밀번호
  const [password, setPassword] = useState("");
  // uid
  const [uid, setUid] = useState("");
  // 푸시 알림 내용
  const [notificationBody, setNotificationBody] = useState("");

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

  // 알림 권한 요청 및 FCM 토큰 발급
  function handleRequestPermissionAndGetFcmToken() {
    handleRequestPermission();
    handleGetFcmToken();
  }

  // 로그인
  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert("로그인 오류");
      return;
    } else {
      alert("로그인 성공");
      setUid(data.user?.id);
    }
  }

  // 회원가입
  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      alert("회원가입 오류");
      return;
    } else {
      alert("회원가입 성공");
    }
  }

  // FCM 토큰 저장
  async function insertFcmToken(token: string) {
    // 로그인 후 토큰 저장 가능
    const { error: loginError } = await supabase.auth.getUser();
    if (loginError) {
      alert("로그인 후 토큰 저장 가능");
      return;
    }

    // FCM 토큰 저장
    const { error: insertError } = await supabase.from("profiles").insert({
      id: uid,
      fcm_token: token,
    });
    if (insertError) {
      alert("FCM 토큰 저장 오류");
    } else {
      alert("FCM 토큰 저장 성공");
    }
  }

  // 푸시 알림 테스트
  async function handleSendNotification() {
    const insertData = {
      user_id: uid,
      body: notificationBody,
    };

    const { error } = await supabase.from("notifications").insert(insertData);

    if (error) {
      alert("푸시 알림 테스트 오류");
    }
  }

  return (
    <main>
      {/* 헤더 */}
      <header>
        <h1>Firebase Cloud Messaging 테스트</h1>
        <div>웹 푸시 알림 기능을 테스트하는 페이지입니다.</div>
      </header>

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

      {/* 로그인 */}
      <section>
        <h2>1. 로그인</h2>
        <p>유저 아이디(uid): {uid}</p>

        <div>
          <label>이메일 : </label>
          <input type="text" placeholder="m3088787@gmail.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>비밀번호 : </label>
          <input type="text" placeholder="qwer1234" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <br />
        <button onClick={handleSignUp}>회원가입</button>
        <button onClick={handleLogin}>로그인</button>
      </section>

      <br />

      {/* FCM 토큰 발급 */}
      <section>
        <h2>2. FCM 토큰 발급</h2>
        <button
          onClick={handleRequestPermissionAndGetFcmToken}
          disabled={!isSupported || notificationStatus === "denied"}
        >
          FCM 토큰 발급
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

        <br />
        <br />

        {/* FCM 토큰 */}
        {fcmToken && <div>FCM 토큰 : {fcmToken}</div>}
      </section>

      <br />

      {/* FCM 토큰 저장 */}
      <section>
        <h2>3. FCM 토큰 저장</h2>
        <button onClick={() => insertFcmToken(fcmToken as string)}>FCM 토큰 저장</button>
      </section>

      <br />

      {/* 푸시 알림 테스트 */}
      <section>
        <h2>4. 푸시 알림 테스트</h2>
        <input type="text" placeholder="푸시 알림 내용" onChange={(e) => setNotificationBody(e.target.value)} />
        <br />
        <button onClick={handleSendNotification}>푸시 알림 테스트</button>
      </section>

      <br />

      {/* 푸터 */}
      <footer>
        <p>Next.js + Firebase Cloud Messaging 테스트 애플리케이션</p>
        <p>© 2025 푸시 알림 테스트</p>
      </footer>
    </main>
  );
}
