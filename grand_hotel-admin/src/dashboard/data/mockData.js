export const statsData = {
  totalRevenue: 125430,
  occupancyRate: 78,
  totalBookings: 342,
  availableRooms: 12
}

export const revenueData = [
  { month: 'Jan', revenue: 40000 },
  { month: 'Fév', revenue: 45000 },
  { month: 'Mar', revenue: 52000 },
  { month: 'Avr', revenue: 48000 },
  { month: 'Mai', revenue: 55000 },
  { month: 'Jun', revenue: 60000 },
]

export const occupancyData = [
  { day: 'Lun', occupancy: 65 },
  { day: 'Mar', occupancy: 72 },
  { day: 'Mer', occupancy: 80 },
  { day: 'Jeu', occupancy: 85 },
  { day: 'Ven', occupancy: 90 },
  { day: 'Sam', occupancy: 78 },
  { day: 'Dim', occupancy: 70 },
]

export const recentBookings = [
  {
    id: 1,
    client: 'Pierre Martin',
    room: 'Suite Présidentielle',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    status: 'confirmée',
    amount: 1200,
    specialRequests: 'Fleurs dans la chambre pour anniversaire'
  },
  {
    id: 2,
    client: 'Marie Dubois',
    room: 'Chambre Deluxe',
    checkIn: '2024-01-16',
    checkOut: '2024-01-17',
    status: 'en attente',
    amount: 450
  },
  {
    id: 3,
    client: 'Jean Lambert',
    room: 'Suite Exécutive',
    checkIn: '2024-01-14',
    checkOut: '2024-01-20',
    status: 'confirmée',
    amount: 1800,
    specialRequests: 'Régime végétarien'
  }
]

export const roomsData = [
  {
    id: 1,
    name: 'Suite Présidentielle',
    type: 'suite',
    capacity: 4,
    price: 600,
    status: 'occupée',
    amenities: ['TV écran plat', 'Mini-bar', 'Jacuzzi', 'Vue mer', 'Room service', 'Parking'],
    description: 'Notre suite la plus luxueuse avec vue panoramique sur la mer et jacuzzi privatif.'
  },
  {
    id: 2,
    name: 'Suite Exécutive',
    type: 'suite',
    capacity: 2,
    price: 350,
    status: 'disponible',
    amenities: ['Bureau', 'Vue mer', 'Room service', 'WiFi', 'Climatisation'],
    description: 'Suite spacieuse parfaite pour les voyages d affaires avec bureau ergonomique.'
  },
  {
    id: 3,
    name: 'Chambre Deluxe',
    type: 'chambre',
    capacity: 2,
    price: 220,
    status: 'nettoyage',
    amenities: ['WiFi', 'Climatisation', 'Salle de bain privée', 'TV écran plat'],
    description: 'Chambre confortable avec tout le confort nécessaire pour un séjour agréable.'
  }
]

export const clientsData = [
  {
    id: 1,
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Avenue des Champs, 75008 Paris',
    totalBookings: 5,
    lastVisit: '2024-01-10',
    preferences: ['Chambre calme', 'Vue mer', 'Petit-déjeuner continental']
  },
  {
    id: 2,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 1 34 56 78 90',
    address: '456 Rue de la Paix, 69002 Lyon',
    totalBookings: 3,
    lastVisit: '2024-01-08',
    preferences: ['Lit king size', 'Salle de bain avec baignoire']
  }
]

export const paymentsData = [
  {
    id: 1,
    client: 'Pierre Martin',
    amount: 1200,
    date: '2024-01-10',
    status: 'complet',
    reference: 'CS-001234'
  },
  {
    id: 2,
    client: 'Marie Dubois',
    amount: 450,
    date: '2024-01-09',
    status: 'acompte',
    reference: 'CS-001235'
  }
]