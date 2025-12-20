require("dotenv").config();
const express = require("express");
const session = require('express-session');
const path = require('path')
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3000;
const { Sequelize, DataTypes, Op } = require("sequelize");
const bcrypt = require('bcryptjs');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const requireCreator = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'creator') {
        return res.redirect('/');
    }
    next();
};

// end middleware

// semua routesnya disini ya yang...
// Home Controller
app.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        
        let cities = [];
        try {
            const citiesData = await Event.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city']],
                where: { is_published: true },
                order: [['city', 'ASC']]
            });
            cities = citiesData.map(c => c.city).filter(city => city);
        } catch (error) {
            console.error('Error fetching cities:', error);
            cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'];
        }

        const latestEvents = await Event.findAll({
            where: { is_published: true },
            include: [Category, User],
            order: [['created_at', 'DESC']],
            limit: 6
        });
        
        const upcomingEvents = await Event.findAll({
            where: { 
                is_published: true,
                event_date: { [Op.gte]: new Date() }
            },
            include: [Category, User],
            order: [['event_date', 'ASC']],
            limit: 6
        });

        res.render('home', {
            user: req.session.user,
            categories,
            cities: cities,
            latestEvents,
            upcomingEvents
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// home end

// Event Controllers
app.get('/events', async (req, res) => {
    try {
        const { category, search, city } = req.query;
        const where = { is_published: true };
        
        if (category) where.category_id = category;
        if (search) where.title = { [Op.like]: `%${search}%` };
        if (city) where.city = city;

        const events = await Event.findAll({
            where,
            include: [Category, User],
            order: [['event_date', 'ASC']]
        });

        const categories = await Category.findAll();

        let cities = [];
        try {
            const citiesData = await Event.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city']],
                where: { is_published: true },
                order: [['city', 'ASC']]
            });
            cities = citiesData.map(c => c.city).filter(city => city);
        } catch (error) {
            console.error('Error fetching cities:', error);
            cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'];
        }

        res.render('events/index', {
            user: req.session.user,
            events,
            categories,
            cities: cities,
            selectedCategory: category,
            searchQuery: search,
            selectedCity: city
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// end events

// halaman event detail
app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [Category, User, EventAttachment]
        });

        if (!event) {
            return res.status(404).send('Event tidak ditemukan');
        }

        res.render('events/detail', {
            user: req.session.user,
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// end halaman event detail

// static page privacy
app.get('/privacy', (req, res) => {
    res.render('privacy', {
        user: req.session.user,
        title: 'Privacy Policy - EventHub'
    });
});
// end static page privacy

// static page terms
app.get('/terms', (req, res) => {
    res.render('terms', {
        user: req.session.user,
        title: 'Terms of Service - EventHub'
    });
});
// end static page terms

// register page 

app.get('/register', (req, res) => {
    res.render('auth/register', { user: req.session.user, errors: [] });
});

// end register page

// register logic
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('auth/register', {
                user: req.session.user,
                errors: ['Email sudah terdaftar'],
                formData: req.body
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user'
        });

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('auth/register', {
            user: req.session.user,
            errors: ['Terjadi kesalahan saat registrasi'],
            formData: req.body
        });
    }
});
// end register logic


// logout logic
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
// end logout logic

// login page
app.get('/login', (req, res) => {
    res.render('auth/login', { user: req.session.user, errors: [] });
});
// end login page

// login logic
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('auth/login', {
                user: req.session.user,
                errors: ['Email atau password salah'],
                formData: req.body
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render('auth/login', {
                user: req.session.user,
                errors: ['Email atau password salah'],
                formData: req.body
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('auth/login', {
            user: req.session.user,
            errors: ['Terjadi kesalahan saat login'],
            formData: req.body
        });
    }
});
// end login logic

// checkout page
app.get('/events/:id/checkout', requireAuth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        
        if (!event) {
            return res.status(404).send('Event tidak ditemukan');
        }

        res.render('orders/checkout', {
            user: req.session.user,
            event,
            errors: []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// end checkout page

// Profile Page
app.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.session.user.id);
        const userOrders = await Order.count({ where: { user_id: req.session.user.id } });
        const userEvents = await Event.count({ where: { creator_id: req.session.user.id } });

        res.render('users/profile', {
            user: req.session.user,
            userData: user,
            stats: {
                orders: userOrders,
                events: userEvents
            },
            errors: []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// End Profile Page 

// Profile Page Logic
app.post('/profile', requireAuth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        await User.update(
            { name, phone },
            { where: { id: req.session.user.id } }
        );

        // Update session
        req.session.user.name = name;
        
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        const user = await User.findByPk(req.session.user.id);
        const userOrders = await Order.count({ where: { user_id: req.session.user.id } });
        const userEvents = await Event.count({ where: { creator_id: req.session.user.id } });
        
        res.render('users/profile', {
            user: req.session.user,
            userData: user,
            stats: {
                orders: userOrders,
                events: userEvents
            },
            errors: ['Terjadi kesalahan saat update profile']
        });
    }
});
// End Profile Page Logic

// My Orders Page
app.get('/my-orders', requireAuth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.session.user.id },
            include: [Event],
            order: [['created_at', 'DESC']]
        });

        res.render('orders/my-orders', {
            user: req.session.user,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// End My Orders Page


// end routes

// Helper function untuk gambar kota
app.locals.getCityImage = (city) => {
    const cityImages = {
        'Jakarta': 'https://images.unsplash.com/photo-1590930754517-64d5fffa06ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'Bandung': 'https://images.unsplash.com/photo-1564901236182-daaec707fbf3?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'Surabaya': 'https://images.unsplash.com/photo-1588666309990-5d90b421f449?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Yogyakarta': 'https://images.unsplash.com/photo-1593584785033-9c7604d0863d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Bali': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Medan': 'https://images.unsplash.com/photo-1588666309990-5d90b421f449?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Semarang': 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Malang': 'https://images.unsplash.com/photo-1588666309999-ef3b59d9362d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };
    return cityImages[city] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
};

// sync semua tablenya disini ya
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('All tables synced successfully');
        
    } catch (error) {
        console.error('Database sync error:', error);
    }
}
// end sync

// main server

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        
        // Sync database
        await syncDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();