-- ============================================================
-- Magasin seed data
-- 100 deterministic stores
-- ============================================================

-- ============================================================
-- Stores
-- ============================================================

INSERT INTO stores (
    id,
    name,
    location,
    timezone,
    created_at,
    updated_at
)
VALUES
    -- Bogotá: stores 001-040
    ('00000000-0000-0000-0000-000000000001', 'Bogotá Store 001', ST_SetSRID(ST_MakePoint(-74.0721, 4.7110), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'Bogotá Store 002', ST_SetSRID(ST_MakePoint(-74.0820, 4.7160), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'Bogotá Store 003', ST_SetSRID(ST_MakePoint(-74.0600, 4.7200), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000004', 'Bogotá Store 004', ST_SetSRID(ST_MakePoint(-74.0950, 4.7000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000005', 'Bogotá Store 005', ST_SetSRID(ST_MakePoint(-74.0500, 4.7350), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000006', 'Bogotá Store 006', ST_SetSRID(ST_MakePoint(-74.1200, 4.7500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000007', 'Bogotá Store 007', ST_SetSRID(ST_MakePoint(-74.1500, 4.7600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000008', 'Bogotá Store 008', ST_SetSRID(ST_MakePoint(-74.2000, 4.7800), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000009', 'Bogotá Store 009', ST_SetSRID(ST_MakePoint(-74.2500, 4.8000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000010', 'Bogotá Store 010', ST_SetSRID(ST_MakePoint(-74.3000, 4.8200), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    ('00000000-0000-0000-0000-000000000011', 'Bogotá Store 011', ST_SetSRID(ST_MakePoint(-74.0650, 4.6900), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000012', 'Bogotá Store 012', ST_SetSRID(ST_MakePoint(-74.0800, 4.6800), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000013', 'Bogotá Store 013', ST_SetSRID(ST_MakePoint(-74.1000, 4.6750), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000014', 'Bogotá Store 014', ST_SetSRID(ST_MakePoint(-74.1150, 4.7200), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000015', 'Bogotá Store 015', ST_SetSRID(ST_MakePoint(-74.0400, 4.7000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000016', 'Bogotá Store 016', ST_SetSRID(ST_MakePoint(-74.0550, 4.7050), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000017', 'Bogotá Store 017', ST_SetSRID(ST_MakePoint(-74.0450, 4.7150), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000018', 'Bogotá Store 018', ST_SetSRID(ST_MakePoint(-74.0850, 4.7350), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000019', 'Bogotá Store 019', ST_SetSRID(ST_MakePoint(-74.1100, 4.7400), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000020', 'Bogotá Store 020', ST_SetSRID(ST_MakePoint(-74.0300, 4.7250), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    ('00000000-0000-0000-0000-000000000021', 'Bogotá Store 021', ST_SetSRID(ST_MakePoint(-74.0700, 4.7550), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000022', 'Bogotá Store 022', ST_SetSRID(ST_MakePoint(-74.0900, 4.7650), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000023', 'Bogotá Store 023', ST_SetSRID(ST_MakePoint(-74.1300, 4.7100), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000024', 'Bogotá Store 024', ST_SetSRID(ST_MakePoint(-74.1400, 4.6900), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000025', 'Bogotá Store 025', ST_SetSRID(ST_MakePoint(-74.0350, 4.7500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000026', 'Bogotá Store 026', ST_SetSRID(ST_MakePoint(-74.0150, 4.7000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000027', 'Bogotá Store 027', ST_SetSRID(ST_MakePoint(-74.1000, 4.6500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000028', 'Bogotá Store 028', ST_SetSRID(ST_MakePoint(-74.1250, 4.6700), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000029', 'Bogotá Store 029', ST_SetSRID(ST_MakePoint(-74.0250, 4.6800), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000030', 'Bogotá Store 030', ST_SetSRID(ST_MakePoint(-74.1150, 4.7800), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    ('00000000-0000-0000-0000-000000000031', 'Bogotá Store 031', ST_SetSRID(ST_MakePoint(-74.1600, 4.7000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000032', 'Bogotá Store 032', ST_SetSRID(ST_MakePoint(-74.1800, 4.7300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000033', 'Bogotá Store 033', ST_SetSRID(ST_MakePoint(-74.2200, 4.7400), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000034', 'Bogotá Store 034', ST_SetSRID(ST_MakePoint(-74.2600, 4.7600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000035', 'Bogotá Store 035', ST_SetSRID(ST_MakePoint(-74.2800, 4.7000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000036', 'Bogotá Store 036', ST_SetSRID(ST_MakePoint(-74.0100, 4.7300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000037', 'Bogotá Store 037', ST_SetSRID(ST_MakePoint(-74.0200, 4.7600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000038', 'Bogotá Store 038', ST_SetSRID(ST_MakePoint(-74.0400, 4.6650), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000039', 'Bogotá Store 039', ST_SetSRID(ST_MakePoint(-74.0700, 4.6500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000040', 'Bogotá Store 040', ST_SetSRID(ST_MakePoint(-74.1450, 4.6550), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    -- Medellín: stores 041-060
    ('00000000-0000-0000-0000-000000000041', 'Medellín Store 041', ST_SetSRID(ST_MakePoint(-75.5812, 6.2442), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000042', 'Medellín Store 042', ST_SetSRID(ST_MakePoint(-75.5700, 6.2500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000043', 'Medellín Store 043', ST_SetSRID(ST_MakePoint(-75.5900, 6.2350), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000044', 'Medellín Store 044', ST_SetSRID(ST_MakePoint(-75.5600, 6.2650), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000045', 'Medellín Store 045', ST_SetSRID(ST_MakePoint(-75.6100, 6.2200), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000046', 'Medellín Store 046', ST_SetSRID(ST_MakePoint(-75.5750, 6.2300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000047', 'Medellín Store 047', ST_SetSRID(ST_MakePoint(-75.6000, 6.2500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000048', 'Medellín Store 048', ST_SetSRID(ST_MakePoint(-75.5500, 6.2400), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000049', 'Medellín Store 049', ST_SetSRID(ST_MakePoint(-75.6200, 6.2600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000050', 'Medellín Store 050', ST_SetSRID(ST_MakePoint(-75.5400, 6.2200), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000051', 'Medellín Store 051', ST_SetSRID(ST_MakePoint(-75.5650, 6.2800), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000052', 'Medellín Store 052', ST_SetSRID(ST_MakePoint(-75.5850, 6.2900), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000053', 'Medellín Store 053', ST_SetSRID(ST_MakePoint(-75.5300, 6.2500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000054', 'Medellín Store 054', ST_SetSRID(ST_MakePoint(-75.6300, 6.2300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000055', 'Medellín Store 055', ST_SetSRID(ST_MakePoint(-75.5200, 6.2100), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000056', 'Medellín Store 056', ST_SetSRID(ST_MakePoint(-75.6100, 6.2900), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000057', 'Medellín Store 057', ST_SetSRID(ST_MakePoint(-75.5450, 6.2750), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000058', 'Medellín Store 058', ST_SetSRID(ST_MakePoint(-75.6050, 6.2050), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000059', 'Medellín Store 059', ST_SetSRID(ST_MakePoint(-75.5150, 6.2700), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000060', 'Medellín Store 060', ST_SetSRID(ST_MakePoint(-75.6500, 6.2500), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    -- Cali: stores 061-075
    ('00000000-0000-0000-0000-000000000061', 'Cali Store 061', ST_SetSRID(ST_MakePoint(-76.5320, 3.4516), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000062', 'Cali Store 062', ST_SetSRID(ST_MakePoint(-76.5200, 3.4600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000063', 'Cali Store 063', ST_SetSRID(ST_MakePoint(-76.5450, 3.4400), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000064', 'Cali Store 064', ST_SetSRID(ST_MakePoint(-76.5100, 3.4350), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000065', 'Cali Store 065', ST_SetSRID(ST_MakePoint(-76.5550, 3.4650), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000066', 'Cali Store 066', ST_SetSRID(ST_MakePoint(-76.5000, 3.4700), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000067', 'Cali Store 067', ST_SetSRID(ST_MakePoint(-76.5700, 3.4550), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000068', 'Cali Store 068', ST_SetSRID(ST_MakePoint(-76.4800, 3.4500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000069', 'Cali Store 069', ST_SetSRID(ST_MakePoint(-76.5350, 3.4200), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000070', 'Cali Store 070', ST_SetSRID(ST_MakePoint(-76.5500, 3.4900), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000071', 'Cali Store 071', ST_SetSRID(ST_MakePoint(-76.4900, 3.4300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000072', 'Cali Store 072', ST_SetSRID(ST_MakePoint(-76.5750, 3.4800), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000073', 'Cali Store 073', ST_SetSRID(ST_MakePoint(-76.5050, 3.4150), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000074', 'Cali Store 074', ST_SetSRID(ST_MakePoint(-76.5900, 3.4300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000075', 'Cali Store 075', ST_SetSRID(ST_MakePoint(-76.4750, 3.4750), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    -- Barranquilla: stores 076-085
    ('00000000-0000-0000-0000-000000000076', 'Barranquilla Store 076', ST_SetSRID(ST_MakePoint(-74.7813, 10.9685), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000077', 'Barranquilla Store 077', ST_SetSRID(ST_MakePoint(-74.7700, 10.9750), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000078', 'Barranquilla Store 078', ST_SetSRID(ST_MakePoint(-74.7900, 10.9600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000079', 'Barranquilla Store 079', ST_SetSRID(ST_MakePoint(-74.7600, 10.9500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000080', 'Barranquilla Store 080', ST_SetSRID(ST_MakePoint(-74.8000, 10.9800), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000081', 'Barranquilla Store 081', ST_SetSRID(ST_MakePoint(-74.7500, 10.9700), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000082', 'Barranquilla Store 082', ST_SetSRID(ST_MakePoint(-74.8200, 10.9400), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000083', 'Barranquilla Store 083', ST_SetSRID(ST_MakePoint(-74.7300, 10.9900), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000084', 'Barranquilla Store 084', ST_SetSRID(ST_MakePoint(-74.8100, 11.0000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000085', 'Barranquilla Store 085', ST_SetSRID(ST_MakePoint(-74.7400, 10.9400), 4326)::geography, 'America/Bogota', NOW(), NOW()),

    -- Bucaramanga: stores 086-100
    ('00000000-0000-0000-0000-000000000086', 'Bucaramanga Store 086', ST_SetSRID(ST_MakePoint(-73.1198, 7.1254), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000087', 'Bucaramanga Store 087', ST_SetSRID(ST_MakePoint(-73.1100, 7.1300), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000088', 'Bucaramanga Store 088', ST_SetSRID(ST_MakePoint(-73.1300, 7.1150), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000089', 'Bucaramanga Store 089', ST_SetSRID(ST_MakePoint(-73.1000, 7.1400), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000090', 'Bucaramanga Store 090', ST_SetSRID(ST_MakePoint(-73.1400, 7.1200), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000091', 'Bucaramanga Store 091', ST_SetSRID(ST_MakePoint(-73.0900, 7.1100), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000092', 'Bucaramanga Store 092', ST_SetSRID(ST_MakePoint(-73.1500, 7.1350), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000093', 'Bucaramanga Store 093', ST_SetSRID(ST_MakePoint(-73.0800, 7.1250), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000094', 'Bucaramanga Store 094', ST_SetSRID(ST_MakePoint(-73.1250, 7.1500), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000095', 'Bucaramanga Store 095', ST_SetSRID(ST_MakePoint(-73.1050, 7.1000), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000096', 'Bucaramanga Store 096', ST_SetSRID(ST_MakePoint(-73.1600, 7.1100), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000097', 'Bucaramanga Store 097', ST_SetSRID(ST_MakePoint(-73.0700, 7.1450), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000098', 'Bucaramanga Store 098', ST_SetSRID(ST_MakePoint(-73.1450, 7.1550), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000099', 'Bucaramanga Store 099', ST_SetSRID(ST_MakePoint(-73.0950, 7.1600), 4326)::geography, 'America/Bogota', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000100', 'Bucaramanga Store 100', ST_SetSRID(ST_MakePoint(-73.1700, 7.1250), 4326)::geography, 'America/Bogota', NOW(), NOW());


-- ============================================================
-- Default schedules
--
-- Monday-Friday: 08:00-20:00
-- Saturday:      09:00-18:00
-- Sunday:        10:00-16:00
-- ============================================================

INSERT INTO store_schedules (
    id,
    store_id,
    day_of_week,
    start_time,
    end_time,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    s.id,
    schedule.day_of_week,
    schedule.start_time,
    schedule.end_time,
    NOW(),
    NOW()
FROM stores s
CROSS JOIN (
    VALUES
        (1, TIME '08:00', TIME '20:00'),
        (2, TIME '08:00', TIME '20:00'),
        (3, TIME '08:00', TIME '20:00'),
        (4, TIME '08:00', TIME '20:00'),
        (5, TIME '08:00', TIME '20:00'),
        (6, TIME '09:00', TIME '18:00'),
        (7, TIME '10:00', TIME '16:00')
) AS schedule(day_of_week, start_time, end_time);


-- ============================================================
-- Special schedules
-- ============================================================

-- Stores 001-005: 24/7
INSERT INTO store_schedules (
    id,
    store_id,
    day_of_week,
    start_time,
    end_time,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    s.id,
    schedule.day_of_week,
    TIME '00:00',
    TIME '24:00:00',
    NOW(),
    NOW()
FROM stores s
CROSS JOIN (
    VALUES (1), (2), (3), (4), (5), (6), (7)
) AS schedule(day_of_week)
WHERE s.id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
);


-- Stores 006-010: closed on Sunday
-- Remove the default Sunday schedule.
DELETE FROM store_schedules
WHERE day_of_week = 7
AND store_id IN (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010'
);


-- Stores 011-015: weekdays only
DELETE FROM store_schedules
WHERE day_of_week IN (6, 7)
AND store_id IN (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000015'
);


-- Stores 016-020: split schedule
DELETE FROM store_schedules
WHERE store_id IN (
    '00000000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020'
);

INSERT INTO store_schedules (
    id,
    store_id,
    day_of_week,
    start_time,
    end_time,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    s.id,
    schedule.day_of_week,
    schedule.start_time,
    schedule.end_time,
    NOW(),
    NOW()
FROM stores s
CROSS JOIN (
    VALUES
        (1, TIME '08:00', TIME '12:00'),
        (2, TIME '08:00', TIME '12:00'),
        (3, TIME '08:00', TIME '12:00'),
        (4, TIME '08:00', TIME '12:00'),
        (5, TIME '08:00', TIME '12:00'),
        (6, TIME '08:00', TIME '12:00'),
        (1, TIME '14:00', TIME '20:00'),
        (2, TIME '14:00', TIME '20:00'),
        (3, TIME '14:00', TIME '20:00'),
        (4, TIME '14:00', TIME '20:00'),
        (5, TIME '14:00', TIME '20:00'),
        (6, TIME '14:00', TIME '20:00')
) AS schedule(day_of_week, start_time, end_time)
WHERE s.id IN (
    '00000000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020'
);


-- Stores 021-025: evening stores
DELETE FROM store_schedules
WHERE store_id IN (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000025'
);

INSERT INTO store_schedules (
    id,
    store_id,
    day_of_week,
    start_time,
    end_time,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    s.id,
    schedule.day_of_week,
    TIME '18:00',
    TIME '24:00:00',
    NOW(),
    NOW()
FROM stores s
CROSS JOIN (
    VALUES (1), (2), (3), (4), (5), (6), (7)
) AS schedule(day_of_week)
WHERE s.id IN (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000025'
);


-- Stores 026-030: short opening window
DELETE FROM store_schedules
WHERE store_id IN (
    '00000000-0000-0000-0000-000000000026',
    '00000000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000028',
    '00000000-0000-0000-0000-000000000029',
    '00000000-0000-0000-0000-000000000030'
);

INSERT INTO store_schedules (
    id,
    store_id,
    day_of_week,
    start_time,
    end_time,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    s.id,
    schedule.day_of_week,
    TIME '10:00',
    TIME '12:00',
    NOW(),
    NOW()
FROM stores s
CROSS JOIN (
    VALUES (1), (2), (3), (4), (5), (6), (7)
) AS schedule(day_of_week)
WHERE s.id IN (
    '00000000-0000-0000-0000-000000000026',
    '00000000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000028',
    '00000000-0000-0000-0000-000000000029',
    '00000000-0000-0000-0000-000000000030'
);


-- Stores 031-035 intentionally have no schedules.


-- Stores 036-040: two intervals per day
DELETE FROM store_schedules
WHERE store_id IN (
    '00000000-0000-0000-0000-000000000036',
    '00000000-0000-0000-0000-000000000037',
    '00000000-0000-0000-0000-000000000038',
    '00000000-0000-0000-0000-000000000039',
    '00000000-0000-0000-0000-000000000040'
);

INSERT INTO store_schedules (
    id,
    store_id,
    day_of_week,
    start_time,
    end_time,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    s.id,
    schedule.day_of_week,
    schedule.start_time,
    schedule.end_time,
    NOW(),
    NOW()
FROM stores s
CROSS JOIN (
    VALUES
        (1, TIME '00:00', TIME '12:00'),
        (1, TIME '12:00', TIME '24:00:00'),
        (2, TIME '00:00', TIME '12:00'),
        (2, TIME '12:00', TIME '24:00:00'),
        (3, TIME '00:00', TIME '12:00'),
        (3, TIME '12:00', TIME '24:00:00'),
        (4, TIME '00:00', TIME '12:00'),
        (4, TIME '12:00', TIME '24:00:00'),
        (5, TIME '00:00', TIME '12:00'),
        (5, TIME '12:00', TIME '24:00:00'),
        (6, TIME '00:00', TIME '12:00'),
        (6, TIME '12:00', TIME '24:00:00'),
        (7, TIME '00:00', TIME '12:00'),
        (7, TIME '12:00', TIME '24:00:00')
) AS schedule(day_of_week, start_time, end_time)
WHERE s.id IN (
    '00000000-0000-0000-0000-000000000036',
    '00000000-0000-0000-0000-000000000037',
    '00000000-0000-0000-0000-000000000038',
    '00000000-0000-0000-0000-000000000039',
    '00000000-0000-0000-0000-000000000040'
);
