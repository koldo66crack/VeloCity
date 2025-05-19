-- 0) Stub‐in a User table so the shadow DB has something to FK against
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID NOT NULL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE
);

-- 1) Drop the unused table
DROP TABLE IF EXISTS "GroupInvite";

-- 2) Cast GroupMember.userId from text → uuid
ALTER TABLE "GroupMember"
  ALTER COLUMN "userId" TYPE uuid USING ("userId"::uuid);

-- 3) Add the foreign-key
ALTER TABLE "GroupMember"
  ADD CONSTRAINT "GroupMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
