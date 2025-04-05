import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const employeeService = {
  list: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  }
};

export const journeyService = {
  list: async () => {
    const response = await api.get('/journeys');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/journeys/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/journeys', data);
    return response.data;
  }
};

export const employeeJourneyService = {
  list: async () => {
    const response = await api.get('/employee-journeys');
    return response.data;
  },

  getByEmployeeId: async (employeeId) => {
    const response = await api.get(`/employee-journeys/employee/${employeeId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/employee-journeys', data);
    return response.data;
  }
};

export default api; 