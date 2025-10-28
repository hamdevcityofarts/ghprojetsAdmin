// Ajouter cette fonction au seeder
const generateRoomImages = (roomType, roomName) => {
  const baseUrl = 'https://images.unsplash.com/photo-';
  
  const imageCollections = {
    standard: [
      '1566664482983-ccf19b83f6c0',
      '1586023493607-b0a0e59cb41e', 
      '1590490363607-169912429829',
      '1567495968663-23d9395d3df2'
    ],
    superior: [
      '1564078516393-c71ca5295b6c',
      '1586105251260-482500eaae4e',
      '1595576508466-86e0a1cba5e9',
      '1560185891073-45e57464a44f'
    ],
    deluxe: [
      '1590490396147-69e04c41c09d',
      '1568495248632-6f6c5a3b9d60',
      '1595526051237-14e1eed6a535',
      '1568612273767-34757e8e6c8c'
    ],
    family: [
      '1578683010233-3961fc51e0a6',
      '1590490363607-169912429829',
      '1566664482983-ccf19b83f6c0',
      '1586105251260-482500eaae4e'
    ],
    suite: [
      '1595576508833-50ded48d3426',
      '1568495248636-6c5a3b9d6b0c',
      '1590490396236-69e04c41c09e',
      '1586105251261-482500eaae4f'
    ],
    executive: [
      '1595576508833-50ded48d3426',
      '1568495248636-6c5a3b9d6b0c',
      '1590490396236-69e04c41c09e',
      '1586105251261-482500eaae4f'
    ],
    presidential: [
      '1595576508834-50ded48d3427',
      '1568495248637-6c5a3b9d6b0d',
      '1590490396237-69e04c41c09f',
      '1586105251262-482500eaae50'
    ]
  };

  const collection = imageCollections[roomType] || imageCollections.standard;
  
  return collection.map((photoId, index) => ({
    url: `${baseUrl}${photoId}?w=800&h=600&fit=crop&auto=format`,
    alt: `${roomName} - Image ${index + 1}`,
    isPrimary: index === 0,
    order: index
  }));
};

// Modifier la fonction generateRoomData pour inclure les images
const generateRoomData = (type, index) => {
  const roomConfig = roomTypes[type];
  const categories = roomCategories[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const bedTypes = bedTypesByCategory[category];
  const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
  
  const nameOptions = roomNames[type];
  const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
  
  const price = generatePrice(roomConfig.priceRange[0], roomConfig.priceRange[1]);
  const capacity = Array.isArray(roomConfig.capacity) 
    ? generatePrice(roomConfig.capacity[0], roomConfig.capacity[1])
    : roomConfig.capacity;
  
  // Générer les images pour cette chambre
  const images = generateRoomImages(type, name);

  return {
    number: generateRoomNumber(type, index),
    name: name,
    type: type,
    category: category,
    capacity: capacity,
    price: price,
    size: roomConfig.size,
    bedType: bedType,
    status: 'disponible',
    description: generateDescription(type, category),
    amenities: generateAmenities(type),
    images: images // ← AJOUT: Images générées
  };
};