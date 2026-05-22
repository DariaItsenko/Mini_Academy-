import type { Achievement, Exercise, ExerciseFull, ShopItem, SubjectCurriculum, Subtopic, User } from './types';

const API = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('auth_token') || '';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new Error(
      'Cannot reach the server. Run npm run dev from the project folder and keep the terminal open.'
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ||
        (res.status === 404 ? 'API not found — start the server (npm run dev).' : `Request failed (${res.status})`)
    );
  }
  return data;
}

async function uploadVideo(
  subject: string,
  topicId: string,
  subtopicId: string,
  file: File,
  meta: { videoTitle?: string; videoDescription?: string }
) {
  const token = getToken();
  const form = new FormData();
  form.append('video', file);
  if (meta.videoTitle) form.append('videoTitle', meta.videoTitle);
  if (meta.videoDescription) form.append('videoDescription', meta.videoDescription);
  const res = await fetch(`${API}/admin/curriculum/${subject}/${topicId}/${subtopicId}/video`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export const api = {
  register: (body: Record<string, unknown>) =>
    request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  adminLogin: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request<{ user: User }>('/auth/me'),
  updateAvatar: (avatar: Record<string, string>, characterGender?: string) =>
    request<{ user: User }>('/user/avatar', { method: 'PATCH', body: JSON.stringify({ avatar, characterGender }) }),
  getCurriculum: () => request<{ curriculum: Record<string, SubjectCurriculum> }>('/curriculum'),
  getSubtopic: (subject: string, topicId: string, subtopicId: string) =>
    request<{ subject: SubjectCurriculum; topic: { id: string; title: string }; subtopic: Subtopic }>(
      `/curriculum/${subject}/${topicId}/${subtopicId}`
    ),
  getExercises: () => request<{ exercises: Exercise[] }>('/exercises'),
  getExercise: (id: string) => request<{ exercise: ExerciseFull }>(`/exercises/${id}`),
  completeExercise: (id: string) =>
    request<{ user: User; pointsEarned?: number; alreadyCompleted?: boolean }>(`/exercises/${id}/complete`, {
      method: 'POST',
    }),
  getShopItems: () => request<{ items: ShopItem[] }>('/shop/items'),
  buyItem: (itemId: string) => request<{ user: User }>('/shop/buy', { method: 'POST', body: JSON.stringify({ itemId }) }),
  getAchievements: () => request<{ achievements: Achievement[] }>('/achievements'),
  adminGetExercises: () => request<{ exercises: ExerciseFull[] }>('/admin/exercises'),
  adminCreateExercise: (exercise: ExerciseFull) =>
    request<{ exercise: ExerciseFull }>('/admin/exercises', { method: 'POST', body: JSON.stringify(exercise) }),
  adminUpdateExercise: (id: string, exercise: ExerciseFull) =>
    request<{ exercise: ExerciseFull }>(`/admin/exercises/${id}`, { method: 'PUT', body: JSON.stringify(exercise) }),
  adminDeleteExercise: (id: string) => request(`/admin/exercises/${id}`, { method: 'DELETE' }),
  adminSaveCurriculum: (curriculum: Record<string, SubjectCurriculum>) =>
    request<{ curriculum: Record<string, SubjectCurriculum> }>('/admin/curriculum', {
      method: 'PUT',
      body: JSON.stringify({ curriculum }),
    }),
  adminCreateSubject: (body: {
    id?: string;
    label: string;
    icon?: string;
    theme?: string;
  }) =>
    request<{ curriculum: Record<string, SubjectCurriculum>; subject: SubjectCurriculum }>(
      '/admin/curriculum/subjects',
      { method: 'POST', body: JSON.stringify(body) }
    ),
  adminCreateTopic: (
    subject: string,
    body: { title: string; description?: string; icon?: string }
  ) =>
    request<{ curriculum: Record<string, SubjectCurriculum>; topic: { id: string; title: string } }>(
      `/admin/curriculum/${subject}/topics`,
      { method: 'POST', body: JSON.stringify(body) }
    ),
  adminUpdateSubtopic: (
    subject: string,
    topicId: string,
    subtopicId: string,
    body: { content?: Record<string, unknown>; name?: string; description?: string; icon?: string }
  ) =>
    request(`/admin/curriculum/${subject}/${topicId}/${subtopicId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  uploadVideo,
};

