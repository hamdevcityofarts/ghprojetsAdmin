import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roomService from '../../services/roomService';

// Thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roomService.getAllRooms();
      return response.data.chambres;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des chambres'
      );
    }
  }
);

export const fetchRoomById = createAsyncThunk(
  'rooms/fetchRoomById',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await roomService.getRoomById(roomId);
      return response.data.chambre;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de la chambre'
      );
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await roomService.createRoom(roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création de la chambre'
      );
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, roomData }, { rejectWithValue }) => {
    try {
      const response = await roomService.updateRoom(id, roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour de la chambre'
      );
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      await roomService.deleteRoom(roomId);
      return roomId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la suppression de la chambre'
      );
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    currentRoom: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    // ✅ FORMATER LE PRIX D'UNE CHAMBRE
    formatRoomPrice: (state, action) => {
      const roomId = action.payload;
      const room = state.rooms.find(r => r._id === roomId);
      if (room) {
        room.formattedPrice = roomService.formatPrice(room.price);
      }
    },
    // ✅ FORMATER TOUS LES PRIX
    formatAllPrices: (state) => {
      state.rooms.forEach(room => {
        room.formattedPrice = roomService.formatPrice(room.price);
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchRooms
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
        // ✅ FORMATER AUTOMATIQUEMENT LES PRIX
        state.rooms.forEach(room => {
          room.formattedPrice = roomService.formatPrice(room.price);
        });
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchRoomById
      .addCase(fetchRoomById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload;
        // ✅ FORMATER LE PRIX DE LA CHAMBRE COURANTE
        if (state.currentRoom) {
          state.currentRoom.formattedPrice = roomService.formatPrice(state.currentRoom.price);
        }
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createRoom
      .addCase(createRoom.fulfilled, (state, action) => {
        const newRoom = action.payload.chambre;
        // ✅ FORMATER LE PRIX DE LA NOUVELLE CHAMBRE
        newRoom.formattedPrice = roomService.formatPrice(newRoom.price);
        state.rooms.push(newRoom);
      })
      // updateRoom
      .addCase(updateRoom.fulfilled, (state, action) => {
        const updatedRoom = action.payload.chambre;
        // ✅ FORMATER LE PRIX MIS À JOUR
        updatedRoom.formattedPrice = roomService.formatPrice(updatedRoom.price);
        const index = state.rooms.findIndex(room => room._id === updatedRoom._id);
        if (index !== -1) {
          state.rooms[index] = updatedRoom;
        }
        if (state.currentRoom && state.currentRoom._id === updatedRoom._id) {
          state.currentRoom = updatedRoom;
        }
      })
      // deleteRoom
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(room => room._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentRoom, formatRoomPrice, formatAllPrices } = roomsSlice.actions;
export default roomsSlice.reducer;