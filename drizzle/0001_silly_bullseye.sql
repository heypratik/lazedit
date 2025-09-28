-- ================================
-- Legacy Tables (Sequelize)
-- ================================

-- Organizations
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" serial PRIMARY KEY,
    "name" text NOT NULL,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL
);

-- Legacy Users
CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY,
    "organization_id" integer REFERENCES "organizations"("id") ON DELETE SET NULL,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "stripeCustomerId" text,
    "stripePlanEndsAt" timestamp,
    "onboarded" boolean DEFAULT false,
    "creditsAvailable" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL
);

-- Projects
CREATE TABLE IF NOT EXISTS "projects" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "organization_id" integer NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "json" json,
    "height" integer,
    "width" integer,
    "thumbnail_url" text,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL
);

-- Images
CREATE TABLE IF NOT EXISTS "images" (
    "id" serial PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "organization_id" integer NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "filename" text NOT NULL,
    "media_object_key" text NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL
);

-- Verification (legacy)
CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY NOT NULL,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- ================================
-- BetterAuth Tables
-- ================================

-- Auth User
CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "email_verified" boolean DEFAULT false NOT NULL,
    "image" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Auth Account
CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY NOT NULL,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "access_token" text,
    "refresh_token" text,
    "id_token" text,
    "access_token_expires_at" timestamp,
    "refresh_token_expires_at" timestamp,
    "scope" text,
    "password" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Auth Session
CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "token" text NOT NULL UNIQUE,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "ip_address" text,
    "user_agent" text
);

-- Auth Verification Token
CREATE TABLE IF NOT EXISTS "verificationToken" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    PRIMARY KEY ("identifier", "token")
);
