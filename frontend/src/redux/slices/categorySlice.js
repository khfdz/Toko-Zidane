import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../api/categoryApiService';

// Async thunk untuk mengambil semua kategori
export const fetchAllCategories = createAsyncThunk('categories/fetchAll', async () => {
    const response = await getAllCategories();
    return response;
});

// Async thunk untuk mengambil kategori berdasarkan ID
export const fetchCategoryById = createAsyncThunk('categories/fetchById', async (id) => {
    const response = await getCategoryById(id);
    return response;
});

// Async thunk untuk membuat kategori baru
export const createNewCategory = createAsyncThunk('categories/create', async (category) => {
    const response = await createCategory(category);
    return response;
}); 

// Async thunk untuk memperbarui kategori berdasarkan ID
export const updateCategoryById = createAsyncThunk('categories/updateById', async ({ id, category }) => {
    const response = await updateCategory(id, category);
    return response;
});

// Async thunk untuk menghapus kategori berdasarkan ID
export const deleteCategoryById = createAsyncThunk('categories/deleteById', async (id) => {
    await deleteCategory(id);
    return id;
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        selectedCategory: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Menghandle fetchAllCategories
            .addCase(fetchAllCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Menghandle fetchCategoryById
            .addCase(fetchCategoryById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedCategory = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Menghandle createNewCategory
            .addCase(createNewCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories.push(action.payload);
            })
            .addCase(createNewCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Menghandle updateCategoryById
            .addCase(updateCategoryById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCategoryById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.categories.findIndex((category) => category._id === action.payload._id); // Gunakan _id dari MongoDB
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategoryById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Menghandle deleteCategoryById
            .addCase(deleteCategoryById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCategoryById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = state.categories.filter((category) => category._id !== action.payload); // Gunakan _id dari MongoDB
            })
            .addCase(deleteCategoryById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default categorySlice.reducer;