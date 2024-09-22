import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllOrders,
  getTotalDebtByCustomerId,
  createOrder,
  deleteOrder,
  editOrder,
  payDebt,
  getLatestOrderByCustomerId
} from '../api/orderApiService'; // Pastikan path import sesuai

// Async thunk untuk mengambil semua order
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  const response = await getAllOrders();
  return response;
});

// Async thunk untuk mengambil total debt berdasarkan ID customer
export const fetchTotalDebtByCustomerId = createAsyncThunk('orders/fetchTotalDebtByCustomerId', async (customerId) => {
  const response = await getTotalDebtByCustomerId(customerId);
  return response;
});

// Async thunk untuk membuat order baru
export const createNewOrder = createAsyncThunk('orders/create', async (order) => {
  const response = await createOrder(order);
  return response;
});

// Async thunk untuk memperbarui order berdasarkan ID
export const updateOrderById = createAsyncThunk('orders/updateById', async ({ id, order }) => {
  const response = await editOrder(id, order);
  return response;
});

// Async thunk untuk menghapus order berdasarkan ID
export const deleteOrderById = createAsyncThunk('orders/deleteById', async (id) => {
  await deleteOrder(id);
  return id;
});

// Async thunk untuk membayar utang
export const payDebtByCustomerId = createAsyncThunk('orders/payDebtByCustomerId', async ({ customerId, paymentAmount }) => {
  const response = await payDebt({ customerId, paymentAmount });
  return response;
});

// Async thunk untuk mengambil order terbaru berdasarkan ID customer
export const fetchLatestOrderByCustomerId = createAsyncThunk('orders/fetchLatestOrderByCustomerId', async (customerId) => {
  const response = await getLatestOrderByCustomerId(customerId);
  return response;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    selectedOrder: null,
    totalDebt: 0,
    latestOrder: null,  // Properti baru untuk menyimpan order terbaru
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Menghandle fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle fetchTotalDebtByCustomerId
      .addCase(fetchTotalDebtByCustomerId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalDebtByCustomerId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalDebt = action.payload.totalDebt;
      })
      .addCase(fetchTotalDebtByCustomerId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle createNewOrder
      .addCase(createNewOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle updateOrderById
      .addCase(updateOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.orders.findIndex((order) => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle payDebtByCustomerId
      .addCase(payDebtByCustomerId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(payDebtByCustomerId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalDebt = action.payload.totalDebt;
      })
      .addCase(payDebtByCustomerId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle deleteOrderById
      .addCase(deleteOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle fetchLatestOrderByCustomerId
      .addCase(fetchLatestOrderByCustomerId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLatestOrderByCustomerId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.latestOrder = action.payload;
      })
      .addCase(fetchLatestOrderByCustomerId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
