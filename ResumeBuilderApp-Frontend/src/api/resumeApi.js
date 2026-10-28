import apiClient from './apiClient';

export const resumeApi = {
  async getAllResumes() {
    return apiClient.get('/api/resumes');
  },

  async getResumeById(id) {
    return apiClient.get(`/api/resumes/${id}`);
  },

  async createResume(data) {
    return apiClient.post('/api/resumes', data);
  },

  async updateResume(id, data) {
    return apiClient.put(`/api/resumes/${id}`, data);
  },

  async updateSection(id, sectionName, data) {
    return apiClient.patch(`/api/resumes/${id}/section`, {
      section: sectionName,
      data: data,
    });
  },

  async deleteResume(id) {
    return apiClient.delete(`/api/resumes/${id}`);
  },

  async duplicateResume(id) {
    return apiClient.post(`/api/resumes/${id}/duplicate`, {});
  },

  async downloadPdf(id) {
    return apiClient.get(`/api/resumes/${id}/pdf`);
  },
};

export default resumeApi;
