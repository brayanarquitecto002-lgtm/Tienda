-- ===========================================
-- SCHEMA PARA SUPABASE (POSTGRESQL)
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- URL: https://mycpsbwinlooxjdjqmgb.supabase.co
-- ===========================================

-- Tabla para contenido del sitio
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    hero_title VARCHAR(255) NOT NULL,
    hero_description TEXT,
    about_us TEXT,
    mission TEXT,
    vision TEXT,
    logo TEXT,
    hero_image TEXT,
    facebook VARCHAR(500),
    instagram VARCHAR(500),
    gmail VARCHAR(500),
    youtube VARCHAR(500),
    tiktok VARCHAR(500),
    whatsapp VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(50),
    image TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para características de productos
CREATE TABLE IF NOT EXISTS product_features (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar contenido por defecto
INSERT INTO site_content (hero_title, hero_description, about_us, mission, vision, logo, hero_image, whatsapp)
VALUES (
    'Arquitectura Pro',
    'Diseños arquitectónicos innovadores y sostenibles para transformar tus espacios.',
    'Somos un equipo de arquitectos apasionados por crear espacios funcionales, estéticos y sostenibles. Con años de experiencia, hemos diseñado proyectos residenciales, comerciales e institucionales.',
    'Nuestra misión es proporcionar soluciones arquitectónicas de alta calidad que mejoren la calidad de vida de nuestros clientes, integrando innovación, sostenibilidad y funcionalidad en cada proyecto.',
    'Ser líderes en el diseño arquitectónico, reconocidos por nuestra excelencia, creatividad y compromiso con el desarrollo urbano sostenible.',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=80&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop&crop=center',
    '+571234567890'
) ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, image, details) VALUES
(
    'Plano Arquitectónico Residencial',
    'Diseño completo de vivienda unifamiliar con planos detallados.',
    '$500.000',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center',
    'Planos completos incluyendo fachadas, cortes y detalles constructivos.'
),
(
    'Proyecto Arquitectónico Comercial',
    'Diseño de local comercial con énfasis en funcionalidad y estética.',
    '$750.000',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=center',
    'Proyecto integral para espacios comerciales con diseño moderno.'
),
(
    'Remodelación de Espacios',
    'Servicio de remodelación para optimizar espacios existentes.',
    '$300.000',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
    'Transformación completa de espacios para mejorar funcionalidad.'
) ON CONFLICT DO NOTHING;

-- Insertar características de productos
INSERT INTO product_features (product_id, feature) VALUES
(1, 'Planos 2D y 3D'),
(1, 'Cálculos estructurales'),
(1, 'Memoria descriptiva'),
(2, 'Diseño de interiores'),
(2, 'Iluminación especializada'),
(2, 'Accesibilidad universal'),
(3, 'Análisis de espacio'),
(3, 'Diseño personalizado'),
(3, 'Supervisión de obra') ON CONFLICT DO NOTHING;