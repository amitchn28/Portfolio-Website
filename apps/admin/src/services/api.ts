const API_BASE = import.meta.env.VITE_ADMIN_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token Management
export const getStoredToken = (): string | null => {
  return localStorage.getItem('amit_admin_token');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem('amit_admin_token', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('amit_admin_token');
};

async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json.data !== undefined ? json.data : json;
}

export const adminApi = {
  // Authentication
  async login(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Authentication failed');
    }
    if (json.data?.token) {
      setStoredToken(json.data.token);
    }
    return json.data;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  async getMe() {
    return apiRequest('/auth/me');
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to request reset');
    return json;
  },

  async resetPassword(payload: { token: string; newPassword: string }) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reset password');
    return json;
  },

  async getSessions() {
    return apiRequest('/auth/sessions');
  },

  async revokeSession(sessionId: string) {
    return apiRequest(`/auth/sessions/${sessionId}`, { method: 'DELETE' });
  },

  // Dashboard Overview
  async getDashboardOverview() {
    return apiRequest('/analytics/dashboard');
  },

  // Profile
  async getProfile() {
    return apiRequest('/profile');
  },

  async updateProfile(data: any) {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // About Section
  async getAbout() {
    return apiRequest('/about');
  },

  async updateAbout(data: any) {
    return apiRequest('/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Education
  async getEducation() {
    return apiRequest('/education');
  },

  async createEducation(data: any) {
    return apiRequest('/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEducation(id: string, data: any) {
    return apiRequest(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEducation(id: string) {
    return apiRequest(`/education/${id}`, { method: 'DELETE' });
  },

  // Skills
  async getSkills() {
    return apiRequest('/skills');
  },

  async getSkillCategories() {
    return apiRequest('/skills/categories');
  },

  async createSkill(data: any) {
    return apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSkill(id: string, data: any) {
    return apiRequest(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSkill(id: string) {
    return apiRequest(`/skills/${id}`, { method: 'DELETE' });
  },

  // Projects
  async getProjects(params?: { includeUnpublished?: boolean }) {
    const q = params?.includeUnpublished ? '?includeUnpublished=true' : '';
    return apiRequest(`/projects${q}`);
  },

  async createProject(data: any) {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: string, data: any) {
    return apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string) {
    return apiRequest(`/projects/${id}`, { method: 'DELETE' });
  },

  // Experience
  async getExperience() {
    return apiRequest('/experience');
  },

  async createExperience(data: any) {
    return apiRequest('/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateExperience(id: string, data: any) {
    return apiRequest(`/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteExperience(id: string) {
    return apiRequest(`/experience/${id}`, { method: 'DELETE' });
  },

  // Certifications
  async getCertifications() {
    return apiRequest('/certifications');
  },

  async createCertification(data: any) {
    return apiRequest('/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCertification(id: string, data: any) {
    return apiRequest(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCertification(id: string) {
    return apiRequest(`/certifications/${id}`, { method: 'DELETE' });
  },

  // Achievements
  async getAchievements() {
    return apiRequest('/achievements');
  },

  async createAchievement(data: any) {
    return apiRequest('/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAchievement(id: string, data: any) {
    return apiRequest(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAchievement(id: string) {
    return apiRequest(`/achievements/${id}`, { method: 'DELETE' });
  },

  // Resume
  async getAllResumes() {
    return apiRequest('/resume/all');
  },

  async createResume(data: any) {
    return apiRequest('/resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteResume(id: string) {
    return apiRequest(`/resume/${id}`, { method: 'DELETE' });
  },

  // Social Links
  async getSocialLinks() {
    return apiRequest('/social-links?all=true');
  },

  async createSocialLink(data: any) {
    return apiRequest('/social-links', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSocialLink(id: string, data: any) {
    return apiRequest(`/social-links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSocialLink(id: string) {
    return apiRequest(`/social-links/${id}`, { method: 'DELETE' });
  },

  // Blog
  async getBlogPosts(params?: { includeUnpublished?: boolean }) {
    const q = params?.includeUnpublished ? '?includeUnpublished=true' : '';
    return apiRequest(`/blog${q}`);
  },

  async createBlogPost(data: any) {
    return apiRequest('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBlogPost(id: string, data: any) {
    return apiRequest(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteBlogPost(id: string) {
    return apiRequest(`/blog/${id}`, { method: 'DELETE' });
  },

  // Website & SEO Settings
  async getAdminSettings() {
    return apiRequest('/settings/admin');
  },

  async updateWebsiteSettings(data: any) {
    return apiRequest('/settings/website', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateSeoSettings(data: any) {
    return apiRequest('/settings/seo', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Analytics
  async getAnalyticsOverview() {
    return apiRequest('/analytics/overview');
  },

  // Contact Messages
  async getContactMessages(params?: { status?: string }) {
    const q = params?.status ? `?status=${params.status}` : '';
    return apiRequest(`/contact${q}`);
  },

  async updateContactStatus(id: string, status: string) {
    return apiRequest(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async replyContactMessage(id: string, payload: { replyMessage: string; replySubject?: string }) {
    return apiRequest(`/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteContactMessage(id: string) {
    return apiRequest(`/contact/${id}`, { method: 'DELETE' });
  },

  // Uploads
  async uploadFile(file: File, folder: string = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = getStoredToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const endpoint = folder === 'profile' ? '/uploads/profile' : folder === 'projects' ? '/uploads/project' : folder === 'resume' ? '/uploads/resume' : '/uploads';
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'File upload failed');
    }
    return json.data;
  },
};

