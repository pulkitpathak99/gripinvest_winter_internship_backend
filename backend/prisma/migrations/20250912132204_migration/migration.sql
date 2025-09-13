/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `isAdmin`,
    ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
    ADD COLUMN `passwordResetToken` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `transaction_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `http_method` ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL,
    `status_code` INTEGER NOT NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_passwordResetToken_key` ON `users`(`passwordResetToken`);

-- AddForeignKey
ALTER TABLE `transaction_logs` ADD CONSTRAINT `transaction_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
