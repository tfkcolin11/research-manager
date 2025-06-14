-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "publicationYear" INTEGER,
    "link" TEXT,
    "notes" TEXT,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Paper_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BigQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "BigQuestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResearchQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "bigQuestionId" TEXT,
    "parentId" TEXT,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "ResearchQuestion_bigQuestionId_fkey" FOREIGN KEY ("bigQuestionId") REFERENCES "BigQuestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ResearchQuestion_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ResearchQuestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ResearchQuestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "location" TEXT,
    "paperId" TEXT NOT NULL,
    "researchQuestionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Answer_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Answer_researchQuestionId_fkey" FOREIGN KEY ("researchQuestionId") REFERENCES "ResearchQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Answer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaperRelationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperAId" TEXT NOT NULL,
    "paperBId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "PaperRelationship_paperAId_fkey" FOREIGN KEY ("paperAId") REFERENCES "Paper" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaperRelationship_paperBId_fkey" FOREIGN KEY ("paperBId") REFERENCES "Paper" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaperRelationship_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PaperRelationship_paperAId_paperBId_type_key" ON "PaperRelationship"("paperAId", "paperBId", "type");
