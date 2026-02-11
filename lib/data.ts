export const categories = [
  { id: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1449247704656-13621df9da70?q=80&w=1000&auto=format&fit=crop' },
  { id: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop' },
  { id: 'kids', name: 'Kids', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop' },
  { id: 'formal', name: 'Formal', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop' },
  { id: 'sports', name: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop' },
];

export const products = [
  {
    id: '1',
    name: 'Aura Speed Runner',
    description: 'High-performance running shoes designed for ultimate comfort and speed. Featuring breathable mesh and responsive cushioning.',
    price: 8500,
    rating: 4.8,
    reviews: 124,
    category: 'sports',
    images: [
      '/shoe-hero.png',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Gray', hex: '#808080' }
    ],
    stock: 15,
    isNew: true,
    isFeatured: true,
    isTopInCategory: true,
  },
  {
    id: '2',
    name: 'Classic Oxford Formal',
    description: 'Elegant leather oxfords for the modern professional. Handcrafted with premium calfskin leather and a durable sole.',
    price: 12000,
    rating: 4.9,
    reviews: 85,
    category: 'formal',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449247704656-13621df9da70?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b33e?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['6', '7', '8', '9', '10'],
    colors: [
      { name: 'Brown', hex: '#5D4037' },
      { name: 'Black', hex: '#000000' }
    ],
    stock: 8,
    isNew: false,
    isFeatured: true,
    isTopInCategory: true,
  },
  {
    id: '3',
    name: 'Casual Street Low',
    description: 'Versatile low-top sneakers for everyday wear. Simple, clean design that pairs perfectly with denim or chinos.',
    price: 4500,
    rating: 4.5,
    reviews: 210,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['8', '9', '10', '11', '12'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#000080' }
    ],
    stock: 25,
    isNew: true,
    isFeatured: false,
    isTopInCategory: false,
  },
  {
    id: '4',
    name: 'Urban Explorer Boots',
    description: 'Rugged yet stylish boots for your next adventure. Waterproof leather and enhanced traction for any terrain.',
    price: 15500,
    rating: 4.7,
    reviews: 56,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1520639889457-79519080e7ce?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542838615-ca99b009e5b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549419053-bc274bf7c569?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Dark Brown', hex: '#3E2723' }
    ],
    stock: 12,
    isNew: false,
    isFeatured: true,
    isTopInCategory: true,
  }
];
