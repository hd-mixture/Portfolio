require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');
const connectDB = require('./config/db');

const certificatesList = [
    { name: 'LinkedIn Learning', img: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', count: 1 },
    { name: 'Forage', img: 'https://cdn.prod.website-files.com/639c5cce6e1e4e02b0b2fae0/64a51bb4cba4950b254fcd69_Navy%20Wide%20Logo%402x%20(1)-p-500.png', count: 2 },
    { name: 'OPSWAT Academy', img: 'https://www.netpoleons.com/uploads/1/0/7/8/107892225/logo-black_orig.png', count: 1 },
    { name: 'Alison', img: 'https://alison.com/favicon.ico', count: 1 },
    { name: 'AWS Academy', img: '/aws-logo.svg', count: 1 },
    { name: 'FICCI', img: 'https://ficci.in/public/frontend/images/footer_logo-new.png', count: 1 },
    { name: 'United Latino Students Association', img: 'https://lsbacsudh.org/wp-content/uploads/2024/10/ULSA-Logo-2019-2020-e1727912288983-300x293.png', count: 2 }
];

async function seed() {
    try {
        await connectDB();
        
        // Only seed if empty
        const count = await Achievement.countDocuments({ category: 'Certificate' });
        
        if (count === 0) {
            console.log('Seeding certificates...');
            for (const cert of certificatesList) {
                // creating entry per count or just one entry representing the issuer?
                // The frontend groups them by count. So we create `count` number of entries or one entry with a description indicating count.
                // It's better to create 1 entry per 'count' to truly reflect 9 certificates.
                
                for(let i=0; i < cert.count; i++) {
                    await Achievement.create({
                        category: 'Certificate',
                        title: cert.name + (cert.count > 1 ? ` Certificate ${i+1}` : ' Certificate'),
                        organization: cert.name,
                        date: '2023 - 2024',
                        description: `Earned from ${cert.name}`,
                        image: cert.img,
                        link: ''
                    });
                }
            }
            console.log('Certificates seeded successfully!');
        } else {
            console.log('Certificates already exist in the database. Skipping seed.');
        }
        
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
