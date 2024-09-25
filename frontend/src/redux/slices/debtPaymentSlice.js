import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createDebtPayment,
  getAllDebtPayments,
  getByCustomerId,
  getLatestDebtAndOrderById, // Mengganti nama fungsi
} from '../api/debtPaymentApiService'; // Pastikan path-nya benar

// Async thunk untuk membuat pembayaran hutang
export const createNewDebtPayment = createAsyncThunk('debt/create', async (debtPaymentData, { rejectWithValue }) => {
  try {
    const response = await createDebtPayment(debtPaymentData);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk untuk mengambil semua pembayaran hutang
export const fetchAllDebtPayments = createAsyncThunk('debt/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await getAllDebtPayments();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk untuk mengambil pembayaran hutang berdasarkan customer ID
export const fetchDebtPaymentsByCustomerId = createAsyncThunk('debt/fetchByCustomerId', async (customerId, { rejectWithValue }) => {
  try {
    const response = await getByCustomerId(customerId);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk untuk mengambil pembayaran hutang dan order terbaru berdasarkan customer ID
export const fetchLatestDebtAndOrderByCustomerId = createAsyncThunk('debt/fetchLatestByCustomerId', async (customerId, { rejectWithValue }) => {
  try {
    const response = await getLatestDebtAndOrderById(customerId); // Mengganti nama fungsi
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const debtPaymentSlice = createSlice({
  name: 'debtPayments',
  initialState: {
    payments: [],
    latestOrder: null, // Pisahkan latest order
    latestDebtPayment: null, // Pisahkan latest debt payment
    fetchStatus: 'idle', // Untuk memisahkan status fetching
    createStatus: 'idle', // Status untuk create
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Menghandle createNewDebtPayment
      .addCase(createNewDebtPayment.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createNewDebtPayment.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.payments.push(action.payload);
      })
      .addCase(createNewDebtPayment.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Menghandle fetchAllDebtPayments
      .addCase(fetchAllDebtPayments.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchAllDebtPayments.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.payments = action.payload;
      })
      .addCase(fetchAllDebtPayments.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Menghandle fetchDebtPaymentsByCustomerId
      .addCase(fetchDebtPaymentsByCustomerId.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchDebtPaymentsByCustomerId.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.payments = action.payload;
      })
      .addCase(fetchDebtPaymentsByCustomerId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Menghandle fetchLatestDebtAndOrderByCustomerId
      .addCase(fetchLatestDebtAndOrderByCustomerId.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchLatestDebtAndOrderByCustomerId.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.latestOrder = action.payload.latestOrder; // Simpan latest order
        state.latestDebtPayment = action.payload.latestDebtPayment; // Simpan latest debt payment
      })
      .addCase(fetchLatestDebtAndOrderByCustomerId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default debtPaymentSlice.reducer;
