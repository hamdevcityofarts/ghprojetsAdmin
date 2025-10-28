import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clientService from '../../services/clientService';

// Thunk pour récupérer tous les clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.getAllClients();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des clients'
      );
    }
  }
);

// Thunk pour supprimer un client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(clientId);
      return clientId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la suppression du client'
      );
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
        state.error = null;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // deleteClient
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = state.clients.filter(client => client._id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = clientsSlice.actions;
export default clientsSlice.reducer;