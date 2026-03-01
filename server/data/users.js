const bcrypt = require('bcryptjs');

// Password: '123456'
const PASSWORD = '123456';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: PASSWORD,
        role: 'admin',
    },
    // --- Customers ---
    { name: 'Customer 1', email: 'customer1@example.com', password: PASSWORD, role: 'user' },
    { name: 'Customer 2', email: 'customer2@example.com', password: PASSWORD, role: 'user' },
    { name: 'Customer 3', email: 'customer3@example.com', password: PASSWORD, role: 'user' },
    { name: 'Customer 4', email: 'customer4@example.com', password: PASSWORD, role: 'user' },
    { name: 'Customer 5', email: 'customer5@example.com', password: PASSWORD, role: 'user' },
    { name: 'Customer 6', email: 'customer6@example.com', password: PASSWORD, role: 'user' },

    // --- Shopkeepers ---
    { name: 'Shopkeeper 1', email: 'shop1@example.com', password: PASSWORD, role: 'shopkeeper', shopName: 'Shop One', gst: 'GST001' },
    { name: 'Shopkeeper 2', email: 'shop2@example.com', password: PASSWORD, role: 'shopkeeper', shopName: 'Shop Two', gst: 'GST002' },
    { name: 'Shopkeeper 3', email: 'shop3@example.com', password: PASSWORD, role: 'shopkeeper', shopName: 'Shop Three', gst: 'GST003' },
    { name: 'Shopkeeper 4', email: 'shop4@example.com', password: PASSWORD, role: 'shopkeeper', shopName: 'Shop Four', gst: 'GST004' },
    { name: 'Shopkeeper 5', email: 'shop5@example.com', password: PASSWORD, role: 'shopkeeper', shopName: 'Shop Five', gst: 'GST005' },
    { name: 'Shopkeeper 6', email: 'shop6@example.com', password: PASSWORD, role: 'shopkeeper', shopName: 'Shop Six', gst: 'GST006' },

    // --- Servicemen ---
    { name: 'Serviceman 1', email: 'serviceman1@example.com', password: PASSWORD, role: 'serviceman', serviceType: 'Plumber', experience: 5, isVerified: true },
    { name: 'Serviceman 2', email: 'serviceman2@example.com', password: PASSWORD, role: 'serviceman', serviceType: 'Electrician', experience: 3, isVerified: true },
    { name: 'Serviceman 3', email: 'serviceman3@example.com', password: PASSWORD, role: 'serviceman', serviceType: 'Carpenter', experience: 8, isVerified: true },
    { name: 'Serviceman 4', email: 'serviceman4@example.com', password: PASSWORD, role: 'serviceman', serviceType: 'Painter', experience: 4, isVerified: true },
    { name: 'Serviceman 5', email: 'serviceman5@example.com', password: PASSWORD, role: 'serviceman', serviceType: 'Maid', experience: 2, isVerified: false },
    { name: 'Serviceman 6', email: 'serviceman6@example.com', password: PASSWORD, role: 'serviceman', serviceType: 'Mechanic', experience: 10, isVerified: true },
];

module.exports = users;
