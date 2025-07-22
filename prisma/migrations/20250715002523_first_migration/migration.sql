-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDENTE', 'PROCESSANDO_ANALISE', 'ANALISE_CONCLUIDA', 'GERANDO_ESTRATEGIAS', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('HEADLINE_FACEBOOK', 'ROTEIRO_REELS', 'TEXTO_GOOGLE_ADS', 'COPY_EMAIL', 'POST_INSTAGRAM', 'STORY_INSTAGRAM', 'TITULO_YOUTUBE', 'DESCRICAO_YOUTUBE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hash_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credits" BIGINT NOT NULL DEFAULT 50
);

-- CreateTable
CREATE TABLE "ProjectCampaign" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "user_input" TEXT NOT NULL,
    "url_video" TEXT,
    "gemini_result" JSONB,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SalesAngle" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "strategic_description" TEXT NOT NULL,
    "selected_by_user" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "TextAsset" (
    "id" TEXT NOT NULL,
    "angle_id" TEXT NOT NULL,
    "asset_type" "AssetType" NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "result" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCampaign_id_key" ON "ProjectCampaign"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesAngle_id_key" ON "SalesAngle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TextAsset_id_key" ON "TextAsset"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Job_id_key" ON "Job"("id");

-- AddForeignKey
ALTER TABLE "ProjectCampaign" ADD CONSTRAINT "ProjectCampaign_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesAngle" ADD CONSTRAINT "SalesAngle_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextAsset" ADD CONSTRAINT "TextAsset_angle_id_fkey" FOREIGN KEY ("angle_id") REFERENCES "SalesAngle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
