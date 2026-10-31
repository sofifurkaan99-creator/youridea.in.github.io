INSERT INTO projects (title, client, status, value, progress, date) VALUES
('Luxury Retail Experience', 'Northstar Studio', 'Live', '₹85,000', 92, '2026-10-10'),
('Hospitality Brand Launch', 'Luma Stay', 'In Progress', '₹1,20,000', 76, '2026-10-17'),
('Startup Growth Funnel', 'PeakWorks', 'Proposal', '₹65,000', 42, '2026-10-25');

INSERT INTO enquiries (name, email, company, message, status) VALUES
('Aarav Mehta', 'aarav@northstar.com', 'Northstar Studio', 'Need a premium brand site with stronger digital positioning.', 'New'),
('Sana Qureshi', 'sana@studiolane.co', 'Studio Lane', 'Looking for a modern landing page and brand redesign.', 'Contacted');

INSERT INTO services (name, description, price) VALUES
('Brand Strategy', 'Positioning and voice for premium business growth.', '₹25,000'),
('Website Design', 'Responsive, premium digital experiences for business websites.', '₹45,000'),
('Growth Funnel', 'Lead capture and conversion-focused landing pages.', '₹60,000');

INSERT INTO pricing_plans (tier, price, description) VALUES
('Starter', '₹3,999', 'Business website essentials'),
('Growth', '₹7,999', 'Premium brand and landing pages'),
('Premium', '₹14,999', 'Advanced custom digital platform');
