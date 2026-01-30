-- CreateTable
CREATE TABLE "Calendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calendarId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Holiday_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Holiday_calendarId_idx" ON "Holiday"("calendarId");

-- CreateIndex
CREATE INDEX "Holiday_date_idx" ON "Holiday"("date");
