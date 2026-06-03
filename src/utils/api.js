import axios from 'axios';

const API = axios.create({
  baseURL: 'https://smarthome-backend-6jwy.onrender.com'
});

// Automatically add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const register        = (data) => API.post('/auth/register', data);
export const login           = (data) => API.post('/auth/login', data);
export const getMe           = ()     => API.get('/auth/me');
export const updatePreferences = (data) => API.put('/auth/preferences', data);

// Groceries
export const getGroceries    = ()       => API.get('/groceries');
export const addGrocery      = (data)   => API.post('/groceries', data);
export const updateGrocery   = (id, data) => API.put(`/groceries/${id}`, data);
export const deleteGrocery   = (id)     => API.delete(`/groceries/${id}`);
export const restockAll      = ()       => API.get('/groceries/restock');

// Expenses
export const getExpenses     = ()       => API.get('/expenses');
export const addExpense      = (data)   => API.post('/expenses', data);
export const deleteExpense   = (id)     => API.delete(`/expenses/${id}`);
export const getExpenseSummary = ()     => API.get('/expenses/summary');

// Tasks
export const getTasks        = ()       => API.get('/tasks');
export const addTask         = (data)   => API.post('/tasks', data);
export const updateTask      = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask      = (id)     => API.delete(`/tasks/${id}`);

// Household
export const getHousehold    = ()       => API.get('/household');
export const updateBudget    = (data)   => API.put('/household/budget', data);
export const joinHousehold   = (data)   => API.post('/household/join', data);
export const getMembers      = ()       => API.get('/household/members');
export const addGuest        = (data)   => API.post('/household/add-guest', data);
export const removeGuest     = (id)     => API.delete(`/household/remove-guest/${id}`);

// Notifications
export const getNotifications  = ()     => API.get('/notifications');
export const markAsRead        = (id)   => API.put(`/notifications/${id}`);
export const markAllAsRead     = ()     => API.put('/notifications/read/all');
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// Bills
export const getBills        = ()       => API.get('/bills');
export const addBill         = (data)   => API.post('/bills', data);
export const updateBill      = (id, data) => API.put(`/bills/${id}`, data);
export const deleteBill      = (id)     => API.delete(`/bills/${id}`);
export const markBillAsPaid  = (id)     => API.put(`/bills/${id}/paid`);

// Recipes
export const getAllRecipes    = ()       => API.get('/recipes');
export const searchRecipe    = (name)   => API.get(`/recipes/search?name=${name}`);
export const getRecipesByCategory = (cat) => API.get(`/recipes/category/${cat}`);
export const addCustomRecipe = (data)   => API.post('/recipes/custom', data);
export const deleteCustomRecipe = (id) => API.delete(`/recipes/custom/${id}`);

// Suggestions
export const getSeasonalSuggestions = () => API.get('/suggestions/seasonal');

// Location
export const saveLocation    = (data)   => API.post('/location/save', data);
export const getNearbyStores = (data)   => API.post('/location/nearby', data);

// Emergency
export const getEmergencies    = ()       => API.get('/emergency');
export const triggerEmergency  = (data)   => API.post('/emergency/trigger', data);
export const resolveEmergency  = (id)     => API.put(`/emergency/${id}/resolve`);

// Chat
export const getMessages       = ()       => API.get('/chat');
export const sendMessage       = (data)   => API.post('/chat', data);
export const deleteMessage     = (id)     => API.delete(`/chat/${id}`);

export default API;