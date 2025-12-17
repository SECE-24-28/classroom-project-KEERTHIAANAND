require('dotenv').config();
const mongoose = require('mongoose');

console.log('=== MongoDB Connection Test ===');
console.log('URI exists:', !!process.env.MONGODB_URI);
console.log('URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined');
console.log('');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ CONNECTED SUCCESSFULLY!');
        console.log('Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ CONNECTION FAILED');
        console.log('Error:', err.message);
        console.log('');
        console.log('Possible fixes:');
        console.log('1. Check if IP 0.0.0.0/0 is whitelisted in MongoDB Atlas');
        console.log('2. Verify your username/password in the connection string');
        console.log('3. Check if the cluster name is correct');
        process.exit(1);
    });
