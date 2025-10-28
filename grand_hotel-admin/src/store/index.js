// src/store/index.js (Admin Dashboard)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import clientsReducer from './slices/clientsSlice';
import roomsReducer from './slices/roomsSlice';
import reservationsReducer from './slices/reservationsSlice'; // ✅ CRÉÉ
import paymentsReducer from './slices/paymentSlice'; // ✅ CRÉÉ

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    clients: clientsReducer,
    rooms: roomsReducer,
    reservations: reservationsReducer, // ✅ Gestion réservations
    payments: paymentsReducer, // ✅ Gestion paiements
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer ces actions pour les dates
        ignoredActions: [
          'payments/fetchAll/fulfilled',
          'payments/fetchById/fulfilled',
          'payments/process/fulfilled',
          'reservations/fetchAll/fulfilled',
          'reservations/fetchById/fulfilled',
          'reservations/create/fulfilled'
        ],
        ignoredPaths: [
          'payments.currentPayment.createdAt',
          'payments.currentPayment.updatedAt',
          'reservations.currentReservation.checkIn',
          'reservations.currentReservation.checkOut',
          'reservations.currentReservation.createdAt'
        ]
      }
    })
});

export default store;