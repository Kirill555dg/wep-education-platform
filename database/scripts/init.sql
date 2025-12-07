-- Initialization script for Web Education Platform Database
-- Runs automatically when PostgreSQL container is created

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- для полнотекстового поиска

-- Set timezone
SET timezone = 'UTC';

-- Create additional schemas (опционально)
-- CREATE SCHEMA IF NOT EXISTS auth;
-- CREATE SCHEMA IF NOT EXISTS education;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Web Education Platform database initialized successfully';
END $$;

