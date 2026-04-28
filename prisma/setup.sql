-- ============================================================
-- ScarletX Lingerie — Tam Veritabanı Kurulum Scripti
-- Supabase SQL Editor'de çalıştır (tek seferde)
-- ============================================================

-- ─── Extensionlar ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM (
    'PENDING','CONFIRMED','PREPARING','SHIPPED',
    'DELIVERED','CANCELLED','REFUND_REQUESTED','REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','PAID','FAILED','REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "CustomerTier" AS ENUM ('STANDARD','GOLD','PLATINUM','SCARLET_ELITE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE','FIXED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CUSTOMER','ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Auth (NextAuth) ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "users" (
  "id"            TEXT        NOT NULL PRIMARY KEY,
  "email"         TEXT        NOT NULL UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  "name"          TEXT,
  "image"         TEXT,
  "password"      TEXT,
  "role"          "UserRole"  NOT NULL DEFAULT 'CUSTOMER',
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "id"                TEXT NOT NULL PRIMARY KEY,
  "userId"            TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INT,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id"           TEXT        NOT NULL PRIMARY KEY,
  "sessionToken" TEXT        NOT NULL UNIQUE,
  "userId"       TEXT        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT        NOT NULL,
  "token"      TEXT        NOT NULL UNIQUE,
  "expires"    TIMESTAMPTZ NOT NULL,
  UNIQUE ("identifier", "token")
);

-- ─── Customer (CRM) ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "customers" (
  "id"         TEXT          NOT NULL PRIMARY KEY,
  "userId"     TEXT          NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "firstName"  TEXT          NOT NULL,
  "lastName"   TEXT          NOT NULL,
  "phone"      TEXT,
  "tier"       "CustomerTier" NOT NULL DEFAULT 'STANDARD',
  "totalSpent" FLOAT         NOT NULL DEFAULT 0,
  "orderCount" INT           NOT NULL DEFAULT 0,
  "notes"      TEXT,
  "createdAt"  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "addresses" (
  "id"           TEXT        NOT NULL PRIMARY KEY,
  "customerId"   TEXT        NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "label"        TEXT,
  "fullName"     TEXT        NOT NULL,
  "phone"        TEXT        NOT NULL,
  "addressLine1" TEXT        NOT NULL,
  "addressLine2" TEXT,
  "city"         TEXT        NOT NULL,
  "district"     TEXT        NOT NULL,
  "postalCode"   TEXT        NOT NULL,
  "country"      TEXT        NOT NULL DEFAULT 'TR',
  "isDefault"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Catalog ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "categories" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "slug"        TEXT        NOT NULL UNIQUE,
  "name"        TEXT        NOT NULL,
  "description" TEXT,
  "image"       TEXT,
  "parentId"    TEXT        REFERENCES "categories"("id"),
  "order"       INT         NOT NULL DEFAULT 0,
  "isActive"    BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "collections" (
  "id"             TEXT        NOT NULL PRIMARY KEY,
  "slug"           TEXT        NOT NULL UNIQUE,
  "name"           TEXT        NOT NULL,
  "description"    TEXT,
  "image"          TEXT        NOT NULL,
  "seoTitle"       TEXT,
  "seoDescription" TEXT,
  "isActive"       BOOLEAN     NOT NULL DEFAULT TRUE,
  "order"          INT         NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "products" (
  "id"               TEXT        NOT NULL PRIMARY KEY,
  "slug"             TEXT        NOT NULL UNIQUE,
  "name"             TEXT        NOT NULL,
  "description"      TEXT        NOT NULL,
  "categoryId"       TEXT        REFERENCES "categories"("id"),
  "collectionId"     TEXT        REFERENCES "collections"("id"),
  "material"         TEXT,
  "careInstructions" TEXT,
  "modelMeasurements" TEXT,
  "isFeatured"       BOOLEAN     NOT NULL DEFAULT FALSE,
  "isNew"            BOOLEAN     NOT NULL DEFAULT TRUE,
  "isActive"         BOOLEAN     NOT NULL DEFAULT TRUE,
  "tags"             TEXT[]      NOT NULL DEFAULT '{}',
  "seoTitle"         TEXT,
  "seoDescription"   TEXT,
  "ogImage"          TEXT,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "products_slug_idx"        ON "products"("slug");
CREATE INDEX IF NOT EXISTS "products_categoryId_idx"  ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_collectionId_idx" ON "products"("collectionId");
CREATE INDEX IF NOT EXISTS "products_isFeatured_idx"  ON "products"("isFeatured");
CREATE INDEX IF NOT EXISTS "products_isNew_idx"       ON "products"("isNew");

CREATE TABLE IF NOT EXISTS "product_variants" (
  "id"             TEXT        NOT NULL PRIMARY KEY,
  "productId"      TEXT        NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "sku"            TEXT        NOT NULL UNIQUE,
  "size"           TEXT        NOT NULL,
  "color"          TEXT        NOT NULL,
  "colorHex"       TEXT        NOT NULL DEFAULT '#000000',
  "price"          FLOAT       NOT NULL,
  "compareAtPrice" FLOAT,
  "stock"          INT         NOT NULL DEFAULT 0,
  "images"         TEXT[]      NOT NULL DEFAULT '{}',
  "isActive"       BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "product_variants_productId_idx" ON "product_variants"("productId");
CREATE INDEX IF NOT EXISTS "product_variants_sku_idx"       ON "product_variants"("sku");

CREATE TABLE IF NOT EXISTS "wishlist_items" (
  "id"         TEXT        NOT NULL PRIMARY KEY,
  "customerId" TEXT        NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "productId"  TEXT        NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("customerId", "productId")
);

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "coupons" (
  "id"               TEXT           NOT NULL PRIMARY KEY,
  "code"             TEXT           NOT NULL UNIQUE,
  "type"             "CouponType"   NOT NULL,
  "value"            FLOAT          NOT NULL,
  "minOrderAmount"   FLOAT,
  "maxUses"          INT,
  "usedCount"        INT            NOT NULL DEFAULT 0,
  "allowedTiers"     "CustomerTier"[] NOT NULL DEFAULT '{}',
  "isFirstOrderOnly" BOOLEAN        NOT NULL DEFAULT FALSE,
  "expiresAt"        TIMESTAMPTZ,
  "isActive"         BOOLEAN        NOT NULL DEFAULT TRUE,
  "createdAt"        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id"              TEXT           NOT NULL PRIMARY KEY,
  "orderNumber"     TEXT           NOT NULL UNIQUE,
  "customerId"      TEXT           NOT NULL REFERENCES "customers"("id"),
  "status"          "OrderStatus"  NOT NULL DEFAULT 'PENDING',
  "paymentStatus"   "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "paymentMethod"   TEXT,
  "paymentRef"      TEXT,
  "subtotal"        FLOAT          NOT NULL,
  "shippingCost"    FLOAT          NOT NULL DEFAULT 0,
  "discount"        FLOAT          NOT NULL DEFAULT 0,
  "total"           FLOAT          NOT NULL,
  "couponCode"      TEXT,
  "couponId"        TEXT           REFERENCES "coupons"("id"),
  "trackingNumber"  TEXT,
  "shippingCarrier" TEXT,
  "shippingAddress" JSONB          NOT NULL,
  "billingAddress"  JSONB          NOT NULL,
  "giftNote"        TEXT,
  "giftWrapping"    BOOLEAN        NOT NULL DEFAULT FALSE,
  "fbclid"          TEXT,
  "gclid"           TEXT,
  "utmSource"       TEXT,
  "utmMedium"       TEXT,
  "utmCampaign"     TEXT,
  "createdAt"       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "orders_customerId_idx"   ON "orders"("customerId");
CREATE INDEX IF NOT EXISTS "orders_status_idx"       ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_orderNumber_idx"  ON "orders"("orderNumber");

CREATE TABLE IF NOT EXISTS "order_items" (
  "id"        TEXT  NOT NULL PRIMARY KEY,
  "orderId"   TEXT  NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "variantId" TEXT  NOT NULL REFERENCES "product_variants"("id"),
  "name"      TEXT  NOT NULL,
  "size"      TEXT  NOT NULL,
  "color"     TEXT  NOT NULL,
  "image"     TEXT  NOT NULL,
  "price"     FLOAT NOT NULL,
  "quantity"  INT   NOT NULL
);

-- ─── Marketing ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "announcement_bars" (
  "id"        TEXT        NOT NULL PRIMARY KEY,
  "text"      TEXT        NOT NULL,
  "link"      TEXT,
  "bgColor"   TEXT        NOT NULL DEFAULT '#1A1A1A',
  "textColor" TEXT        NOT NULL DEFAULT '#FAF7F2',
  "isActive"  BOOLEAN     NOT NULL DEFAULT FALSE,
  "order"     INT         NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "hero_banners" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "title"       TEXT        NOT NULL,
  "subtitle"    TEXT,
  "ctaText"     TEXT        NOT NULL,
  "ctaLink"     TEXT        NOT NULL,
  "image"       TEXT        NOT NULL,
  "mobileImage" TEXT,
  "isActive"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "order"       INT         NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "popups" (
  "id"          TEXT        NOT NULL PRIMARY KEY,
  "title"       TEXT        NOT NULL,
  "body"        TEXT        NOT NULL,
  "image"       TEXT,
  "ctaText"     TEXT,
  "ctaLink"     TEXT,
  "showAfterMs" INT         NOT NULL DEFAULT 3000,
  "isActive"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "expiresAt"   TIMESTAMPTZ,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Admin Kullanıcı ──────────────────────────────────────────────────────────
-- Şifre: Admin1234!  (bcrypt hash, 12 rounds)
INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@scarletxlingerie.com',
  '$2b$12$pMZAWujZPOPwnWLnAY6QOOIRHLuOK187Uh62qmrw4hwt4LXVtQC8q',
  'Admin',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO UPDATE
  SET "password" = EXCLUDED."password",
      "role"     = 'ADMIN',
      "updatedAt" = NOW();

-- ─── Demo Kuponlar ────────────────────────────────────────────────────────────
INSERT INTO "coupons" ("id","code","type","value","isFirstOrderOnly","isActive","createdAt","updatedAt") VALUES
  (gen_random_uuid()::text, 'SCARLET10',  'PERCENTAGE', 10,  FALSE, TRUE, NOW(), NOW()),
  (gen_random_uuid()::text, 'ILKALIM',    'FIXED',      150, TRUE,  TRUE, NOW(), NOW()),
  (gen_random_uuid()::text, 'HOSGELDIN',  'FIXED',      200, TRUE,  TRUE, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;
