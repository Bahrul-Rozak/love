const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const port = 3000;


// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Koneksi ke database BERHASIL!");
  })
  .catch((err) => {
    console.log("Gagal terhubung ke database:", err.message);
    // process.exit(1);
  });

//   Models
// ==================== MODELS ====================

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20) },
    role: { type: DataTypes.STRING(10), defaultValue: 'user' },
    avatar: { type: DataTypes.STRING(255) }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT },
    icon: { type: DataTypes.STRING(50) }
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    image_path: { type: DataTypes.STRING(255) },
    venue: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    event_date: { type: DataTypes.DATE, allowNull: false },
    event_end_date: { type: DataTypes.DATE },
    max_attendees: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    available_tickets: { type: DataTypes.INTEGER, allowNull: false },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
    xendit_invoice_id: { type: DataTypes.STRING(255) },
    xendit_payment_url: { type: DataTypes.TEXT },
    xendit_expiry_date: { type: DataTypes.DATE },
    external_id: { type: DataTypes.STRING(255) }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ticket_code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    barcode_data: { type: DataTypes.TEXT, allowNull: false },
    attendee_name: { type: DataTypes.STRING(255), allowNull: false },
    attendee_email: { type: DataTypes.STRING(255), allowNull: false },
    attendee_phone: { type: DataTypes.STRING(20) },
    is_attended: { type: DataTypes.BOOLEAN, defaultValue: false },
    attended_at: { type: DataTypes.DATE }
}, {
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

const EventAttachment = sequelize.define('EventAttachment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    file_path: { type: DataTypes.STRING(255), allowNull: false },
    file_type: { type: DataTypes.STRING(10), defaultValue: 'image' }
}, {
    tableName: 'event_attachments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// End Models

// Relasi atau association
User.hasMany(Event, { 
    foreignKey: 'creator_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Event.belongsTo(User, { 
    foreignKey: 'creator_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Category.hasMany(Event, { 
    foreignKey: 'category_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Event.belongsTo(Category, { 
    foreignKey: 'category_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

User.hasMany(Order, { 
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Order.belongsTo(User, { 
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Event.hasMany(Order, { 
    foreignKey: 'event_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Order.belongsTo(Event, { 
    foreignKey: 'event_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Order.hasMany(Ticket, { 
    foreignKey: 'order_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Ticket.belongsTo(Order, { 
    foreignKey: 'order_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Event.hasMany(Ticket, { 
    foreignKey: 'event_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Ticket.belongsTo(Event, { 
    foreignKey: 'event_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Event.hasMany(EventAttachment, { 
    foreignKey: 'event_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
EventAttachment.belongsTo(Event, { 
    foreignKey: 'event_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
// End Relasi