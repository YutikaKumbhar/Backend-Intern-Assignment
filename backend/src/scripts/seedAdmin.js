require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { mongodbUri } = require('../config/env');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'System Admin';

async function seed() {
  await mongoose.connect(mongodbUri);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Updated ${ADMIN_EMAIL} to admin role`);
    } else {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    }
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Created admin: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
