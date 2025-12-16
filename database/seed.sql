INSERT INTO categories (name, description, icon) VALUES
('Music', 'Konser musik dan pertunjukan live', '🎵'),
('Technology', 'Konferensi tech dan workshop coding', '💻'),
('Business', 'Seminar bisnis dan networking', '💼'),
('Art & Culture', 'Pameran seni dan festival budaya', '🎨'),
('Sports', 'Kompetisi olahraga dan maraton', '⚽'),
('Education', 'Workshop dan seminar pendidikan', '📚'),
('Food & Drink', 'Festival kuliner dan wine tasting', '🍕'),
('Health & Wellness', 'Yoga retreat dan seminar kesehatan', '🧘'),
('Charity', 'Acara amal dan penggalangan dana', '❤️'),
('Entertainment', 'Stand-up comedy dan pertunjukan', '🎭');

INSERT INTO events (
    creator_id, category_id, title, description, image_path, venue,
    event_date, event_end_date, max_attendees, price, available_tickets,
    is_published, created_at, updated_at
) VALUES
-- 1. Jakarta Music Fest 2026
(1, 1, 'Jakarta Music Fest 2026', 'Festival musik internasional dengan line-up dari berbagai genre.', 'https://github.com/Bahrul-Rozak/Dummy-EventHub/blob/main/01-jakarta-music-festival.png?raw=true', 'Jakarta Convention Center (JCC)',
 '2026-03-15', '2026-03-16', 5000, 750000, 5000,
 1, '2025-12-17 12:00:00', '2025-12-17 12:00:00'),

-- 2. Konferensi Teknologi Masa Depan
(1, 2, 'Konferensi Teknologi Masa Depan', 'Forum dan pameran teknologi terbaru, fokus pada AI dan big data.', 'https://github.com/Bahrul-Rozak/Dummy-EventHub/blob/main/002%20Konferensi%20Teknologi%20Masa%20Depan.png?raw=true', 'Grand City Convex',
 '2026-04-22', '2026-04-22', 800, 350000, 800,
 1, '2025-12-17 12:00:00', '2025-12-17 12:00:00'),

-- 3. Pameran Seni Kontemporer Bandung
(1, 3, 'Pameran Seni Kontemporer Bandung', 'Menampilkan karya-karya terbaik seniman muda Indonesia dan Asia Tenggara.', 'https://github.com/Bahrul-Rozak/Dummy-EventHub/blob/main/003%20Pameran%20Seni%20Kontemporer%20Bandung.png?raw=true', 'Selasar Sunaryo Art Space',
 '2026-05-10', '2026-06-10', 2000, 85000, 2000,
 1, '2025-12-17 12:00:00', '2025-12-17 12:00:00'),

-- 4. Marathon Pesisir Semarang 10K
(1, 4, 'Marathon Pesisir Semarang 10K', 'Lomba lari 10K melintasi jalur pesisir kota Semarang yang ikonik.', 'https://github.com/Bahrul-Rozak/Dummy-EventHub/blob/main/004%20Marathon%20Pesisir%20Semarang%2010K.png?raw=true', 'Kawasan Kota Lama Semarang',
 '2026-07-06', '2026-07-06', 3000, 150000, 3000,
 1, '2025-12-17 12:00:00', '2025-12-17 12:00:00'),

-- 5. Kuliner Nusantara Expo
(1, 5, 'Kuliner Nusantara Expo', 'Pameran makanan dan minuman tradisional dari Sabang sampai Merauke, ada cooking class.', 'https://github.com/Bahrul-Rozak/Dummy-EventHub/blob/main/005%20Kuliner%20Nusantara%20Expo.png?raw=true', 'Jogja Expo Center (JEC)',
 '2026-09-12', '2026-09-14', 4000, 50000, 4000,
 1, '2025-12-17 12:00:00', '2025-12-17 12:00:00'),

