require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

async function seed(){
  await connectDB();
  const exists = await User.findOne({ email: 'admin@school.com' });
  if (exists) { console.log('Admin already exists'); process.exit(); }
  const pass = await bcrypt.hash('admin123', 10);
  const admin = new User({ name:'Admin', email:'admin@school.com', password:pass, role:'admin' });
  await admin.save();
  console.log('Seeded admin: admin@school.com / admin123');
  process.exit();
}
seed();
