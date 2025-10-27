USE real_estate_portal;

-- Insert roles
INSERT INTO roles (name) VALUES
('ADMIN'),
('AGENT'),
('BUYER');

-- Insert users
INSERT INTO users (name, email, password, role_id) VALUES
('Alice Johnson', 'alice@example.com', '$2a$12$AK0s.pwCP4d5sIu7aoSjie5d/cHrL2u7Xnb5QF3OleD6GczTC05Py', 1),
('Bob Smith', 'bob@example.com', '$2a$12$AK0s.pwCP4d5sIu7aoSjie5d/cHrL2u7Xnb5QF3OleD6GczTC05Py', 2),
('Carol Lee', 'carol@example.com', '$2a$12$AK0s.pwCP4d5sIu7aoSjie5d/cHrL2u7Xnb5QF3OleD6GczTC05Py', 2),
('David Brown', 'david@example.com', '$2a$12$AK0s.pwCP4d5sIu7aoSjie5d/cHrL2u7Xnb5QF3OleD6GczTC05Py', 3),
('Eva Green', 'eva@example.com', '$2a$12$AK0s.pwCP4d5sIu7aoSjie5d/cHrL2u7Xnb5QF3OleD6GczTC05Py', 3);

-- Insert initial properties
INSERT INTO properties (title, description, price, area, address, latitude, longitude, agent_id) VALUES
('Modern Apartment in City Center', 'A beautiful modern apartment with 2 bedrooms and a balcony.', 75000.00, '1200 sqft', '123 Main St, Cityville', 40.712776, -74.005974, 2),
('Cozy Cottage Near Lake', 'A cozy 3-bedroom cottage with scenic lake views.', 95000.00, '1500 sqft', '456 Lakeview Rd, Townsville', 41.203323, -77.194527, 3),
('Luxury Villa with Pool', 'Spacious villa with private pool and garden.', 250000.00, '3500 sqft', '789 Palm Dr, Beach City', 34.052235, -118.243683, 2);

-- Insert property images for initial properties
INSERT INTO property_images (property_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1572120360610-d971b9b63927?auto=format&fit=crop&w=600&q=80'),
(1, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'),
(2, 'https://images.unsplash.com/photo-1505691723518-36a6b9cdb1b6?auto=format&fit=crop&w=600&q=80'),
(3, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80'),
(3, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80');

-- Insert favorites
INSERT INTO favorites (buyer_id, property_id) VALUES
(4, 1),
(4, 3),
(5, 2);

-- Insert inquiries
INSERT INTO inquiries (buyer_id, property_id, message, name, email, status) VALUES
(4, 1, 'Hi, I am interested in this apartment. Can I schedule a visit?', 'David Brown', 'david@example.com', 'PENDING'),
(4, 3, 'Is the villa still available? What is the best time to see it?', 'David Brown', 'david@example.com', 'PENDING'),
(5, 2, 'I would like more details about the cottage near the lake.', 'Eva Green', 'eva@example.com', 'PENDING');

-- Delete old images for new properties if existing
DELETE FROM property_images WHERE property_id IN (14, 15, 16, 17, 18);

-- Delete related favorites and inquiries for these properties
DELETE FROM favorites WHERE property_id IN (14, 15, 16, 17, 18);
DELETE FROM inquiries WHERE property_id IN (14, 15, 16, 17, 18);

-- Delete previous entries for these properties (if any)
DELETE FROM properties WHERE id IN (14, 15, 16, 17, 18);

-- Insert new properties with specific IDs
INSERT INTO properties (id, title, description, price, area, address, latitude, longitude, agent_id) VALUES
(14, 'Charming Bungalow with Garden', 'A cozy bungalow with a beautiful garden and 3 bedrooms.', 85000.00, '1400 sqft', '321 Garden St, Greenfield', 37.774929, -122.419418, 3),
(15, 'Stylish Loft in Downtown', 'Modern loft apartment with open floor plan and city views.', 105000.00, '1100 sqft', '654 Market Ave, Metropolis', 34.052235, -118.243683, 2),
(16, 'Beachside Family Home', 'Spacious family home located just steps from the beach.', 180000.00, '2800 sqft', '987 Ocean Drive, Seaside', 36.778259, -119.417931, 2),
(17, 'Rustic Cabin in the Woods', 'Quiet rustic cabin surrounded by forest, perfect getaway.', 65000.00, '900 sqft', '123 Forest Lane, Timberville', 45.512230, -122.658722, 3),
(18, 'Luxury Penthouse Suite', 'Exclusive penthouse suite with panoramic city skyline views.', 300000.00, '2000 sqft', '789 Skyline Blvd, Uptown', 40.712776, -74.005974, 2);

-- Insert property images with verified working URLs and multiple images where applicable
INSERT INTO property_images (property_id, image_url) VALUES
-- Charming Bungalow (14)
(14, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'),
(14, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'),
(14, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'),
(14, 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80'),

-- Stylish Loft (15)
(15, 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?auto=format&fit=crop&w=600&q=80'),
(15, 'https://images.unsplash.com/photo-1501183638714-1526e69ecb41?auto=format&fit=crop&w=600&q=80'),
(15, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80'),
(15, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'),

-- Beachside Family Home (16)
(16, 'https://images.unsplash.com/photo-1460045789730-4b66e1b24e6b?auto=format&fit=crop&w=600&q=80'),
(16, 'https://images.unsplash.com/photo-1465414829459-fac0b1b9cdb1b6?auto=format&fit=crop&w=600&q=80'),
(16, 'https://images.unsplash.com/photo-1501183638714-1a4775b190b7?auto=format&fit=crop&w=600&q=80'),
(16, 'https://images.unsplash.com/photo-1490791564451-6a6043d2f199?auto=format&fit=crop&w=600&q=80'),

-- Rustic Cabin (17)
(17, 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80'),
(17, 'https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=600&q=80'),

-- Luxury Penthouse Suite (18)
(18, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'),
(18, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80');

