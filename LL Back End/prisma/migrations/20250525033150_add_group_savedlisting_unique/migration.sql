/*
  Warnings:

  - A unique constraint covering the columns `[groupId,listingId]` on the table `GroupSavedListing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupSavedListing_groupId_listingId_key" ON "GroupSavedListing"("groupId", "listingId");
