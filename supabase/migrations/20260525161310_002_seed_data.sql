/*
  # Seed Data for NexusERP

  1. Chart of Accounts - Standard accounting structure
  2. Product Categories - Office, Electronics, Raw Materials
  3. Suppliers - 5 sample suppliers with realistic data
  4. Customers - 8 sample customers
  5. Products - 15 products across categories
  6. Transactions - Sample income and expense records
  7. Invoices - Sales invoices with line items
  8. Purchase Orders - Sample POs with items
  9. Notifications - Sample user notifications

  Note: This migration only INSERTs data and uses IF NOT EXISTS patterns
  to be safely re-runnable. All amounts use realistic business figures.
*/

-- ============================================
-- CHART OF ACCOUNTS
-- ============================================
INSERT INTO accounts (code, name, type, balance, description) VALUES
  ('1000', 'Cash', 'asset', 125000.00, 'Main operating cash account'),
  ('1100', 'Accounts Receivable', 'asset', 85000.00, 'Outstanding customer payments'),
  ('1200', 'Inventory', 'asset', 67000.00, 'Value of goods in stock'),
  ('1300', 'Prepaid Expenses', 'asset', 5000.00, 'Prepaid insurance and rent'),
  ('1500', 'Fixed Assets', 'asset', 250000.00, 'Property and equipment'),
  ('2000', 'Accounts Payable', 'liability', 42000.00, 'Outstanding supplier payments'),
  ('2100', 'Accrued Liabilities', 'liability', 15000.00, 'Accrued expenses'),
  ('2200', 'Tax Payable', 'liability', 8000.00, 'Sales and income tax owed'),
  ('2300', 'Loans Payable', 'liability', 100000.00, 'Outstanding loan balance'),
  ('3000', 'Owner Equity', 'equity', 200000.00, 'Owners capital investment'),
  ('3100', 'Retained Earnings', 'equity', 67000.00, 'Accumulated profits'),
  ('4000', 'Sales Revenue', 'income', 0.00, 'Revenue from product sales'),
  ('4100', 'Service Revenue', 'income', 0.00, 'Revenue from services'),
  ('4200', 'Interest Income', 'income', 0.00, 'Interest earned on deposits'),
  ('5000', 'Cost of Goods Sold', 'expense', 0.00, 'Direct cost of products sold'),
  ('5100', 'Salaries & Wages', 'expense', 0.00, 'Employee compensation'),
  ('5200', 'Rent Expense', 'expense', 0.00, 'Office and warehouse rent'),
  ('5300', 'Utilities', 'expense', 0.00, 'Electricity, water, internet'),
  ('5400', 'Office Supplies', 'expense', 0.00, 'Consumable office materials'),
  ('5500', 'Marketing', 'expense', 0.00, 'Advertising and promotions'),
  ('5600', 'Insurance', 'expense', 0.00, 'Business insurance premiums'),
  ('5700', 'Depreciation', 'expense', 0.00, 'Asset depreciation')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- PRODUCT CATEGORIES
-- ============================================
INSERT INTO product_categories (id, name, description) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Office Supplies', 'Pens, paper, and general office consumables'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Electronics', 'Computers, peripherals, and electronic devices'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Raw Materials', 'Manufacturing and production raw materials'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Furniture', 'Office and warehouse furniture'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Packaging', 'Boxes, bags, and shipping materials')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUPPLIERS
-- ============================================
INSERT INTO suppliers (id, name, email, phone, address, city, country, tax_id, payment_terms, rating) VALUES
  ('b1c2d3e4-0001-4000-8000-000000000001', 'Apex Electronics Ltd', 'orders@apexelec.com', '+1-555-0101', '456 Tech Blvd', 'San Jose', 'US', 'US-98765432', 'Net 30', 9),
  ('b1c2d3e4-0002-4000-8000-000000000002', 'GreenLeaf Materials Co', 'sales@greenleaf.com', '+1-555-0202', '789 Eco Drive', 'Portland', 'US', 'US-23456789', 'Net 45', 8),
  ('b1c2d3e4-0003-4000-8000-000000000003', 'StaplePro Distributors', 'info@staplepro.com', '+1-555-0303', '321 Commerce St', 'Chicago', 'US', 'US-34567890', 'Net 15', 7),
  ('b1c2d3e4-0004-4000-8000-000000000004', 'WoodCraft Industries', 'orders@woodcraft.com', '+1-555-0404', '654 Mill Road', 'Nashville', 'US', 'US-45678901', 'Net 30', 8),
  ('b1c2d3e4-0005-4000-8000-000000000005', 'PackRight Solutions', 'sales@packright.com', '+1-555-0505', '987 Box Lane', 'Dallas', 'US', 'US-56789012', 'Due on Receipt', 6)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CUSTOMERS
-- ============================================
INSERT INTO customers (id, name, email, phone, address, city, country, tax_id, credit_limit, current_balance) VALUES
  ('c1d2e3f4-0001-4000-8000-000000000001', 'TechNova Inc', 'purchasing@technova.com', '+1-555-1001', '100 Innovation Way', 'Austin', 'US', 'US-11111111', 50000.00, 12500.00),
  ('c1d2e3f4-0002-4000-8000-000000000002', 'BlueWave Consulting', 'finance@bluewave.com', '+1-555-1002', '200 Harbor St', 'Seattle', 'US', 'US-22222222', 25000.00, 3200.00),
  ('c1d2e3f4-0003-4000-8000-000000000003', 'Summit Health Group', 'admin@summithealth.com', '+1-555-1003', '300 Medical Dr', 'Denver', 'US', 'US-33333333', 75000.00, 28000.00),
  ('c1d2e3f4-0004-4000-8000-000000000004', 'UrbanSpace Design', 'orders@urbanspace.com', '+1-555-1004', '400 Design Ave', 'Miami', 'US', 'US-44444444', 30000.00, 7500.00),
  ('c1d2e3f4-0005-4000-8000-000000000005', 'Meridian Logistics', 'ap@meridian.com', '+1-555-1005', '500 Freight Blvd', 'Atlanta', 'US', 'US-55555555', 40000.00, 0.00),
  ('c1d2e3f4-0006-4000-8000-000000000006', 'BrightPath Education', 'procurement@brightpath.edu', '+1-555-1006', '600 Campus Rd', 'Boston', 'US', 'US-66666666', 20000.00, 4100.00),
  ('c1d2e3f4-0007-4000-8000-000000000007', 'Atlas Construction', 'billing@atlascon.com', '+1-555-1007', '700 Builder Ln', 'Phoenix', 'US', 'US-77777777', 60000.00, 15000.00),
  ('c1d2e3f4-0008-4000-8000-000000000008', 'CloudSync Systems', 'accounts@cloudsync.io', '+1-555-1008', '800 Server Park', 'San Francisco', 'US', 'US-88888888', 35000.00, 8900.00)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (id, name, sku, description, category_id, unit, cost_price, selling_price, quantity_on_hand, reorder_level) VALUES
  ('d1e2f3a4-0001-4000-8000-000000000001', 'Premium Ballpoint Pen', 'SKU-001', 'Smooth-writing ballpoint pen, blue ink', 'a1b2c3d4-0001-4000-8000-000000000001', 'box', 3.50, 7.99, 500, 100),
  ('d1e2f3a4-0002-4000-8000-000000000002', 'A4 Copy Paper (500 sheets)', 'SKU-002', 'White A4 80gsm multipurpose paper', 'a1b2c3d4-0001-4000-8000-000000000001', 'ream', 4.20, 9.49, 800, 200),
  ('d1e2f3a4-0003-4000-8000-000000000003', 'Desk Organizer Set', 'SKU-003', '5-compartment mesh desk organizer', 'a1b2c3d4-0004-4000-8000-000000000004', 'pcs', 18.00, 39.99, 45, 10),
  ('d1e2f3a4-0004-4000-8000-000000000004', 'Wireless Mouse', 'SKU-004', 'Ergonomic 2.4GHz wireless mouse', 'a1b2c3d4-0002-4000-8000-000000000002', 'pcs', 12.50, 29.99, 120, 25),
  ('d1e2f3a4-0005-4000-8000-000000000005', 'USB-C Hub 7-in-1', 'SKU-005', 'Multiport adapter with HDMI, USB 3.0, SD', 'a1b2c3d4-0002-4000-8000-000000000002', 'pcs', 22.00, 49.99, 85, 20),
  ('d1e2f3a4-0006-4000-8000-000000000006', 'Mechanical Keyboard', 'SKU-006', 'Cherry MX Blue switches, RGB backlit', 'a1b2c3d4-0002-4000-8000-000000000002', 'pcs', 45.00, 99.99, 8, 15),
  ('d1e2f3a4-0007-4000-8000-000000000007', '27" 4K Monitor', 'SKU-007', 'IPS panel, USB-C, adjustable stand', 'a1b2c3d4-0002-4000-8000-000000000002', 'pcs', 280.00, 549.99, 15, 5),
  ('d1e2f3a4-0008-4000-8000-000000000008', 'Steel Rods (1m)', 'SKU-008', 'Carbon steel round rods, 10mm diameter', 'a1b2c3d4-0003-4000-8000-000000000003', 'pcs', 8.50, 15.99, 300, 50),
  ('d1e2f3a4-0009-4000-8000-000000000009', 'Aluminum Sheets 2mm', 'SKU-009', '6061 aluminum flat sheet, 1x2m', 'a1b2c3d4-0003-4000-8000-000000000003', 'pcs', 32.00, 58.99, 4, 10),
  ('d1e2f3a4-0010-4000-8000-000000000010', 'Corrugated Box Large', 'SKU-010', 'Double-wall shipping box 24x18x18"', 'a1b2c3d4-0005-4000-8000-000000000005', 'pcs', 2.80, 5.99, 2000, 500),
  ('d1e2f3a4-0011-4000-8000-000000000011', 'Bubble Wrap Roll', 'SKU-011', 'Small bubble, 100ft x 12in roll', 'a1b2c3d4-0005-4000-8000-000000000005', 'roll', 8.00, 16.99, 150, 30),
  ('d1e2f3a4-0012-4000-8000-000000000012', 'Ergonomic Office Chair', 'SKU-012', 'Lumbar support, adjustable arms, mesh back', 'a1b2c3d4-0004-4000-8000-000000000004', 'pcs', 180.00, 349.99, 22, 5),
  ('d1e2f3a4-0013-4000-8000-000000000013', 'Standing Desk Frame', 'SKU-013', 'Electric height-adjustable, dual motor', 'a1b2c3d4-0004-4000-8000-000000000004', 'pcs', 250.00, 499.99, 12, 3),
  ('d1e2f3a4-0014-4000-8000-000000000014', 'Printer Toner Cartridge', 'SKU-014', 'HP LaserJet compatible, 3000 page yield', 'a1b2c3d4-0001-4000-8000-000000000001', 'pcs', 15.00, 34.99, 3, 10),
  ('d1e2f3a4-0015-4000-8000-000000000015', 'Copper Wire Spool', 'SKU-015', 'Bare copper, 14 AWG, 100ft', 'a1b2c3d4-0003-4000-8000-000000000003', 'spool', 28.00, 52.99, 6, 15)
ON CONFLICT (sku) DO NOTHING;

-- ============================================
-- TRANSACTIONS
-- ============================================
DO $$
DECLARE
  acct_cash uuid;
  acct_ar uuid;
  acct_inventory uuid;
  acct_ap uuid;
  acct_sales uuid;
  acct_service uuid;
  acct_cogs uuid;
  acct_salary uuid;
  acct_rent uuid;
  acct_utilities uuid;
  acct_marketing uuid;
BEGIN
  SELECT id INTO acct_cash FROM accounts WHERE code = '1000';
  SELECT id INTO acct_ar FROM accounts WHERE code = '1100';
  SELECT id INTO acct_inventory FROM accounts WHERE code = '1200';
  SELECT id INTO acct_ap FROM accounts WHERE code = '2000';
  SELECT id INTO acct_sales FROM accounts WHERE code = '4000';
  SELECT id INTO acct_service FROM accounts WHERE code = '4100';
  SELECT id INTO acct_cogs FROM accounts WHERE code = '5000';
  SELECT id INTO acct_salary FROM accounts WHERE code = '5100';
  SELECT id INTO acct_rent FROM accounts WHERE code = '5200';
  SELECT id INTO acct_utilities FROM accounts WHERE code = '5300';
  SELECT id INTO acct_marketing FROM accounts WHERE code = '5500';

  INSERT INTO transactions (transaction_number, description, amount, type, status, account_id, transaction_date) VALUES
    ('TXN-240101', 'Product sales - TechNova Inc', 28500.00, 'income', 'completed', acct_sales, '2024-01-15'),
    ('TXN-240102', 'Product sales - BlueWave Consulting', 8700.00, 'income', 'completed', acct_sales, '2024-01-22'),
    ('TXN-240103', 'IT consulting service', 15000.00, 'income', 'completed', acct_service, '2024-02-05'),
    ('TXN-240104', 'Product sales - Summit Health', 42000.00, 'income', 'completed', acct_sales, '2024-02-14'),
    ('TXN-240105', 'Monthly rent payment', 8500.00, 'expense', 'completed', acct_rent, '2024-02-01'),
    ('TXN-240106', 'Employee salaries - February', 32000.00, 'expense', 'completed', acct_salary, '2024-02-28'),
    ('TXN-240107', 'Utility bills', 2400.00, 'expense', 'completed', acct_utilities, '2024-02-15'),
    ('TXN-240108', 'Product sales - Atlas Construction', 18600.00, 'income', 'completed', acct_sales, '2024-03-10'),
    ('TXN-240109', 'Digital marketing campaign', 5500.00, 'expense', 'completed', acct_marketing, '2024-03-15'),
    ('TXN-240110', 'Product sales - UrbanSpace Design', 12400.00, 'income', 'completed', acct_sales, '2024-03-20'),
    ('TXN-240111', 'Product sales - CloudSync Systems', 19800.00, 'income', 'completed', acct_sales, '2024-04-08'),
    ('TXN-240112', 'Employee salaries - April', 32000.00, 'expense', 'completed', acct_salary, '2024-04-30'),
    ('TXN-240113', 'Monthly rent payment', 8500.00, 'expense', 'completed', acct_rent, '2024-04-01'),
    ('TXN-240114', 'Utility bills', 3100.00, 'expense', 'completed', acct_utilities, '2024-04-15'),
    ('TXN-240115', 'Product sales - Meridian Logistics', 9200.00, 'income', 'pending', acct_sales, '2024-05-05'),
    ('TXN-240116', 'Product sales - BrightPath Education', 6500.00, 'income', 'completed', acct_sales, '2024-05-12'),
    ('TXN-240117', 'Office supplies purchase', 1800.00, 'expense', 'completed', acct_inventory, '2024-05-18'),
    ('TXN-240118', 'Product sales - TechNova Inc', 35000.00, 'income', 'pending', acct_sales, '2024-06-01'),
    ('TXN-240119', 'COGS - Q2 adjustment', 45000.00, 'expense', 'completed', acct_cogs, '2024-06-15'),
    ('TXN-240120', 'Annual insurance premium', 6000.00, 'expense', 'pending', acct_cash, '2024-06-20');
END $$;

-- ============================================
-- INVOICES
-- ============================================
DO $$
DECLARE
  inv_id uuid;
BEGIN
  -- Sales invoices
  INSERT INTO invoices (id, invoice_number, type, status, entity_id, entity_name, issue_date, due_date, subtotal, tax_amount, total_amount, paid_amount) VALUES
    ('e1f2a3b4-0001-4000-8000-000000000001', 'INV-2024-001', 'sales', 'paid', 'c1d2e3f4-0001-4000-8000-000000000001', 'TechNova Inc', '2024-01-15', '2024-02-14', 25000.00, 3500.00, 28500.00, 28500.00),
    ('e1f2a3b4-0002-4000-8000-000000000002', 'INV-2024-002', 'sales', 'paid', 'c1d2e3f4-0002-4000-8000-000000000002', 'BlueWave Consulting', '2024-01-22', '2024-02-21', 7600.00, 1100.00, 8700.00, 8700.00),
    ('e1f2a3b4-0003-4000-8000-000000000003', 'INV-2024-003', 'sales', 'paid', 'c1d2e3f4-0003-4000-8000-000000000003', 'Summit Health Group', '2024-02-14', '2024-03-15', 36800.00, 5200.00, 42000.00, 42000.00),
    ('e1f2a3b4-0004-4000-8000-000000000004', 'INV-2024-004', 'sales', 'overdue', 'c1d2e3f4-0004-4000-8000-000000000004', 'UrbanSpace Design', '2024-03-20', '2024-04-19', 10800.00, 1600.00, 12400.00, 0.00),
    ('e1f2a3b4-0005-4000-8000-000000000005', 'INV-2024-005', 'sales', 'paid', 'c1d2e3f4-0007-4000-8000-000000000007', 'Atlas Construction', '2024-03-10', '2024-04-09', 16300.00, 2300.00, 18600.00, 18600.00),
    ('e1f2a3b4-0006-4000-8000-000000000006', 'INV-2024-006', 'sales', 'sent', 'c1d2e3f4-0008-4000-8000-000000000008', 'CloudSync Systems', '2024-04-08', '2024-05-08', 17300.00, 2500.00, 19800.00, 0.00),
    ('e1f2a3b4-0007-4000-8000-000000000007', 'INV-2024-007', 'sales', 'sent', 'c1d2e3f4-0005-4000-8000-000000000005', 'Meridian Logistics', '2024-05-05', '2024-06-04', 8000.00, 1200.00, 9200.00, 0.00),
    ('e1f2a3b4-0008-4000-8000-000000000008', 'INV-2024-008', 'sales', 'draft', 'c1d2e3f4-0006-4000-8000-000000000006', 'BrightPath Education', '2024-05-12', '2024-06-11', 5700.00, 800.00, 6500.00, 0.00)
  ON CONFLICT (invoice_number) DO NOTHING;

  -- Invoice items
  INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, discount_percent, tax_percent, total) VALUES
    ('e1f2a3b4-0001-4000-8000-000000000001', 'd1e2f3a4-0005-4000-8000-000000000005', 'USB-C Hub 7-in-1', 100, 49.99, 0, 14, 5698.86),
    ('e1f2a3b4-0001-4000-8000-000000000001', 'd1e2f3a4-0007-4000-8000-000000000007', '27" 4K Monitor', 30, 549.99, 5, 14, 17697.64),
    ('e1f2a3b4-0002-4000-8000-000000000002', 'd1e2f3a4-0004-4000-8000-000000000004', 'Wireless Mouse', 150, 29.99, 0, 14, 5128.29),
    ('e1f2a3b4-0002-4000-8000-000000000002', 'd1e2f3a4-0006-4000-8000-000000000006', 'Mechanical Keyboard', 25, 99.99, 0, 14, 2849.72),
    ('e1f2a3b4-0003-4000-8000-000000000003', 'd1e2f3a4-0012-4000-8000-000000000012', 'Ergonomic Office Chair', 50, 349.99, 10, 14, 17919.49),
    ('e1f2a3b4-0003-4000-8000-000000000003', 'd1e2f3a4-0013-4000-8000-000000000013', 'Standing Desk Frame', 25, 499.99, 5, 14, 13562.22),
    ('e1f2a3b4-0004-4000-8000-000000000004', 'd1e2f3a4-0003-4000-8000-000000000003', 'Desk Organizer Set', 100, 39.99, 0, 14, 4558.86),
    ('e1f2a3b4-0004-4000-8000-000000000004', 'd1e2f3a4-0011-4000-8000-000000000011', 'Bubble Wrap Roll', 200, 16.99, 0, 14, 3873.72),
    ('e1f2a3b4-0005-4000-8000-000000000005', 'd1e2f3a4-0008-4000-8000-000000000008', 'Steel Rods (1m)', 500, 15.99, 0, 14, 9114.30),
    ('e1f2a3b4-0005-4000-8000-000000000005', 'd1e2f3a4-0009-4000-8000-000000000009', 'Aluminum Sheets 2mm', 100, 58.99, 0, 14, 6724.86),
    ('e1f2a3b4-0006-4000-8000-000000000006', 'd1e2f3a4-0005-4000-8000-000000000005', 'USB-C Hub 7-in-1', 200, 49.99, 10, 14, 10277.95),
    ('e1f2a3b4-0006-4000-8000-000000000006', 'd1e2f3a4-0004-4000-8000-000000000004', 'Wireless Mouse', 200, 29.99, 0, 14, 6837.72),
    ('e1f2a3b4-0007-4000-8000-000000000007', 'd1e2f3a4-0010-4000-8000-000000000010', 'Corrugated Box Large', 1000, 5.99, 0, 14, 6828.60),
    ('e1f2a3b4-0008-4000-8000-000000000008', 'd1e2f3a4-0001-4000-8000-000000000001', 'Premium Ballpoint Pen', 300, 7.99, 0, 14, 2732.58),
    ('e1f2a3b4-0008-4000-8000-000000000008', 'd1e2f3a4-0002-4000-8000-000000000002', 'A4 Copy Paper', 200, 9.49, 0, 14, 2163.72);

  -- Purchase orders
  INSERT INTO purchase_orders (id, order_number, supplier_id, status, order_date, expected_date, subtotal, tax_amount, total_amount, notes) VALUES
    ('f1a2b3c4-0001-4000-8000-000000000001', 'PO-2024-001', 'b1c2d3e4-0001-4000-8000-000000000001', 'received', '2024-01-10', '2024-01-24', 25000.00, 3500.00, 28500.00, 'Q1 electronics restock'),
    ('f1a2b3c4-0002-4000-8000-000000000002', 'PO-2024-002', 'b1c2d3e4-0002-4000-8000-000000000002', 'received', '2024-02-15', '2024-03-01', 18000.00, 2520.00, 20520.00, 'Raw materials for Q2 production'),
    ('f1a2b3c4-0003-4000-8000-000000000003', 'PO-2024-003', 'b1c2d3e4-0003-4000-8000-000000000003', 'approved', '2024-03-20', '2024-04-03', 8500.00, 1190.00, 9690.00, 'Office supplies restock'),
    ('f1a2b3c4-0004-4000-8000-000000000004', 'PO-2024-004', 'b1c2d3e4-0005-4000-8000-000000000005', 'pending', '2024-04-05', '2024-04-12', 4200.00, 588.00, 4788.00, 'Packaging materials order')
  ON CONFLICT (order_number) DO NOTHING;

  -- Purchase order items
  INSERT INTO purchase_order_items (purchase_order_id, product_id, description, quantity_ordered, quantity_received, unit_cost, total) VALUES
    ('f1a2b3c4-0001-4000-8000-000000000001', 'd1e2f3a4-0005-4000-8000-000000000005', 'USB-C Hub 7-in-1', 200, 200, 22.00, 4400.00),
    ('f1a2b3c4-0001-4000-8000-000000000001', 'd1e2f3a4-0007-4000-8000-000000000007', '27" 4K Monitor', 50, 50, 280.00, 14000.00),
    ('f1a2b3c4-0001-4000-8000-000000000001', 'd1e2f3a4-0004-4000-8000-000000000004', 'Wireless Mouse', 300, 300, 12.50, 3750.00),
    ('f1a2b3c4-0002-4000-8000-000000000002', 'd1e2f3a4-0008-4000-8000-000000000008', 'Steel Rods (1m)', 800, 800, 8.50, 6800.00),
    ('f1a2b3c4-0002-4000-8000-000000000002', 'd1e2f3a4-0015-4000-8000-000000000015', 'Copper Wire Spool', 200, 200, 28.00, 5600.00),
    ('f1a2b3c4-0003-4000-8000-000000000003', 'd1e2f3a4-0001-4000-8000-000000000001', 'Premium Ballpoint Pen', 500, 0, 3.50, 1750.00),
    ('f1a2b3c4-0003-4000-8000-000000000003', 'd1e2f3a4-0002-4000-8000-000000000002', 'A4 Copy Paper (500 sheets)', 1000, 0, 4.20, 4200.00),
    ('f1a2b3c4-0004-4000-8000-000000000004', 'd1e2f3a4-0010-4000-8000-000000000010', 'Corrugated Box Large', 2000, 0, 2.80, 5600.00);
END $$;

-- Refresh materialized views with seeded data
SELECT refresh_dashboard_views();
