const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ── 유저 타입 ──

export interface UserInfo {
  userId: string;
  email: string;
  nickname: string;
  profileImage: string;
  isNewUser: boolean;
}

// ── 토큰 관리 ──

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function setAccessToken(token: string): void {
  localStorage.setItem('accessToken', token);
}

export function removeAccessToken(): void {
  localStorage.removeItem('accessToken');
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

// ── 소셜 로그인 리다이렉트 ──

export function redirectToKakaoLogin(): void {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
}

export function redirectToNaverLogin(): void {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`;
}

// ── 로그아웃 ──

export async function logout(): Promise<void> {
  try {
    await fetchWithAuth('/api/auth/logout', { method: 'POST' });
  } catch {
    // 로그아웃 API 실패해도 로컬 토큰은 삭제
  }
  removeAccessToken();
}

// ── 토큰 갱신 ──

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // HttpOnly 쿠키 자동 전송
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.success && data.data) {
      setAccessToken(data.data);
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

// ── 유저 정보 조회 ──

export async function fetchUserMe(): Promise<UserInfo | null> {
  try {
    const res = await fetchWithAuth('/api/user/me');
    if (!res.ok) return null;

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as UserInfo;
    }
    return null;
  } catch {
    return null;
  }
}

// ── 인증 포함 API 호출 ──

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;

  const headers = new Headers(options.headers);
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // 401이면 토큰 갱신 후 재시도
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }

  return res;
}
