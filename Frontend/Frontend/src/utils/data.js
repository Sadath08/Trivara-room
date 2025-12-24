// Mock data for the luxury room rental app

export const featuredProperties = [
  {
    id: 1,
    title: "Serene Mountain Retreat",
    location: "Aspen, Colorado",
    price: 450,
    rating: 4.9,
    reviews: 127,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Mountain View", "Fireplace", "Hot Tub"],
    description: "A luxurious mountain home with breathtaking views, perfect for a peaceful retreat.",
    host: "Sarah & Michael",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    beds: 4,
    baths: 3,
    guests: 8
  },
  {
    id: 2,
    title: "Oceanfront Modern Villa",
    location: "Malibu, California",
    price: 1200,
    rating: 4.95,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607688969-a5fcd52667ce?w=1200&h=800&fit=crop"
    ],
    amenities: ["Ocean View", "Pool", "Beach Access", "WiFi", "Kitchen"],
    description: "Stunning oceanfront villa with infinity pool and direct beach access.",
    host: "David Chen",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    beds: 5,
    baths: 4,
    guests: 10
  },
  {
    id: 3,
    title: "Downtown Loft Apartment",
    location: "Brooklyn, New York",
    price: 280,
    rating: 4.8,
    reviews: 203,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "City View", "Gym Access", "Parking"],
    description: "Stylish loft in the heart of Brooklyn with modern amenities and city views.",
    host: "Emma Williams",
    hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    beds: 2,
    baths: 1,
    guests: 4
  }
];


export const allProperties = [
  ...featuredProperties,
  {
    id: 7,
    title: "Alpine Chalet",
    location: "Swiss Alps, Switzerland",
    price: 550,
    rating: 4.93,
    reviews: 67,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop"
    ],
    amenities: ["Mountain View", "Fireplace", "Ski Access", "WiFi", "Kitchen"],
    description: "Traditional alpine chalet with modern comforts and ski-in access.",
    host: "Hans Mueller",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    beds: 5,
    baths: 3,
    guests: 10
  },
  {
    id: 8,
    title: "Seaside Cottage",
    location: "Portland, Maine",
    price: 220,
    rating: 4.85,
    reviews: 145,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop"
    ],
    amenities: ["Ocean View", "Beach Access", "WiFi", "Kitchen", "Fireplace"],
    description: "Charming seaside cottage with ocean views and cozy interior.",
    host: "Mary Johnson",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    beds: 3,
    baths: 2,
    guests: 6
  }
];

export const amenitiesList = [
  { icon: "Wifi", label: "WiFi" },
  { icon: "UtensilsCrossed", label: "Kitchen" },
  { icon: "Car", label: "Parking" },
  { icon: "Snowflake", label: "Air Conditioning" },
  { icon: "Tv", label: "TV" },
  { icon: "WashingMachine", label: "Washer" },
  { icon: "Wind", label: "Heating" },
  { icon: "Shower", label: "Hot Water" },
  { icon: "Waves", label: "Pool" },
  { icon: "Flame", label: "Fireplace" },
  { icon: "Trees", label: "Garden" },
  { icon: "Mountain", label: "Mountain View" }
];

export const reviews = [
  {
    id: 1,
    user: "James Mitchell",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    date: "2024-01-15",
    comment: "Absolutely stunning property. The views are breathtaking and the host was incredibly welcoming. Perfect for a peaceful getaway."
  },
  {
    id: 2,
    user: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "2024-01-10",
    comment: "Luxury at its finest. Every detail was carefully thought out. The amenities were top-notch and the location was perfect."
  },
  {
    id: 3,
    user: "Robert Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4,
    date: "2024-01-05",
    comment: "Beautiful place with great attention to detail. Highly recommend for anyone looking for a premium experience."
  }
];

export const getPropertyById = (id) => {
  return allProperties.find(property => property.id === parseInt(id));
};

