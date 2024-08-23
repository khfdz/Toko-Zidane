import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  login as loginService, 
  register as registerService, 
  getUserById, 
  getUserProfile, 
  updateUserById as updateUserByIdService, 
  deleteUserById as deleteUserByIdService 
} from '../api/authApiService';

// Thunk untuk login
export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await loginService(email, password);
  return response; // Asumsikan server mengirim data user dan token
});

// Thunk untuk register
export const register = createAsyncThunk('auth/register', async ({ email, phone, password }) => {
  const response = await registerService(email, phone, password);
  return response; // Asumsikan server mengirim data user dan token
});

// Thunk untuk mendapatkan user by ID
export const fetchUserById = createAsyncThunk('auth/fetchUserById', async (userId) => {
  const response = await getUserById(userId);
  return response; // Asumsikan server mengirim data user
});

// Thunk untuk mendapatkan user profile
export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async () => {
  const response = await getUserProfile();
  return response; // Asumsikan server mengirim data user
});

// Thunk untuk update user by ID
export const updateUserById = createAsyncThunk('auth/updateUserById', async ({ id, userData }) => {
  const response = await updateUserByIdService(id, userData);
  return response; // Asumsikan server mengirim data user
});

// Thunk untuk delete user by ID
export const deleteUserById = createAsyncThunk('auth/deleteUserById', async (id) => {
  const response = await deleteUserByIdService(id);
  return response; // Asumsikan server mengirim status penghapusan
});

// Initial state
const initialState = {
  user: null, // Data user dari login
  userDetails: null, // Detail user dari fetchUserById
  profile: null, // Profile user dari fetchUserProfile
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

// Buat slice untuk auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userDetails = null;
      state.profile = null; // Reset profile saat logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;  // Set user dari response login
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;  // Set user dari response register
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch user by ID cases
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload; // Set userDetails dari response getUserById
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload; // Set profile dari response getUserProfile
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update user by ID cases
      .addCase(updateUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload; // Set userDetails dari response updateUserById
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete user by ID cases
      .addCase(deleteUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserById.fulfilled, (state) => {
        state.status = 'succeeded';
        state.userDetails = null; // Clear userDetails setelah penghapusan
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions; // Export logout action
export default authSlice.reducer;
