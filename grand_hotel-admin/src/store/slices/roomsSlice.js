import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roomService from '../../services/roomService';

// Thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roomService.getAllRooms();
      
      // ✅ VALIDER ET CORRIGER LES PRIX POUR SUPPRIMER LES RÉDUCTIONS
      const validatedRooms = response.data.chambres.map(room => 
        roomService.validatePrice(room)
      );
      
      return validatedRooms;
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
      
      // ✅ VALIDER ET CORRIGER LE PRIX POUR SUPPRIMER LES RÉDUCTIONS
      const validatedRoom = roomService.validatePrice(response.data.chambre);
      
      return validatedRoom;
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
      
      // ✅ VALIDER ET CORRIGER LE PRIX POUR SUPPRIMER LES RÉDUCTIONS
      const validatedRoom = roomService.validatePrice(response.data.chambre);
      
      return { chambre: validatedRoom };
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
      
      // ✅ VALIDER ET CORRIGER LE PRIX POUR SUPPRIMER LES RÉDUCTIONS
      const validatedRoom = roomService.validatePrice(response.data.chambre);
      
      return { chambre: validatedRoom };
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
    // ✅ CORRECTION MANUELLE DU PRIX (SI NÉCESSAIRE)
    correctRoomPrice: (state, action) => {
      const { roomId, correctPrice } = action.payload;
      const room = state.rooms.find(r => r._id === roomId);
      if (room) {
        room.price = correctPrice;
        room.formattedPrice = roomService.formatPrice(correctPrice);
        // Supprimer toute réduction
        if (room.discountedPrice) {
          room.discountedPrice = correctPrice;
        }
        if (room.discountPercentage) {
          room.discountPercentage = 0;
        }
        if (room.hasDiscount) {
          room.hasDiscount = false;
        }
      }
    },
    // ✅ SUPPRIMER TOUTES LES RÉDUCTIONS AUTOMATIQUES
    removeAllDiscounts: (state) => {
      state.rooms.forEach(room => {
        if (room.discountedPrice && room.discountedPrice !== room.price) {
          room.price = room.discountedPrice;
          room.formattedPrice = roomService.formatPrice(room.discountedPrice);
          room.discountPercentage = 0;
          room.hasDiscount = false;
        }
      });
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
        console.log('✅ Chambres chargées - Prix validés sans réduction');
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
        console.log('✅ Chambre chargée - Prix validé sans réduction');
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
        console.log('✅ Nouvelle chambre créée - Prix exact appliqué');
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
        console.log('✅ Chambre modifiée - Prix exact conservé');
      })
      // deleteRoom
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(room => room._id !== action.payload);
      });
  },
});

export const { 
  clearError, 
  clearCurrentRoom, 
  correctRoomPrice, 
  removeAllDiscounts,
  formatRoomPrice, 
  formatAllPrices 
} = roomsSlice.actions;
export default roomsSlice.reducer;