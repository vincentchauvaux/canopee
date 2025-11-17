-- Script SQL pour créer les tables News et Comment
-- À exécuter directement dans Supabase SQL Editor

-- Table News
CREATE TABLE IF NOT EXISTS "news" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "coverImage" TEXT,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- Table Comment
CREATE TABLE IF NOT EXISTS "comments" (
  "id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "newsId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS "news_authorId_idx" ON "news"("authorId");
CREATE INDEX IF NOT EXISTS "news_createdAt_idx" ON "news"("createdAt");
CREATE INDEX IF NOT EXISTS "comments_newsId_idx" ON "comments"("newsId");
CREATE INDEX IF NOT EXISTS "comments_authorId_idx" ON "comments"("authorId");

