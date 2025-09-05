-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `investment_products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `investment_type` ENUM('bond', 'fd', 'mf', 'etf', 'other') NOT NULL,
    `tenure_months` INTEGER NOT NULL,
    `annual_yield` DECIMAL(5, 2) NOT NULL,
    `risk_level` ENUM('low', 'moderate', 'high') NOT NULL,
    `min_investment` DECIMAL(12, 2) NOT NULL DEFAULT 1000.00,
    `max_investment` DECIMAL(12, 2) NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investments` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `invested_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('active', 'matured', 'cancelled') NOT NULL DEFAULT 'active',
    `expected_return` DECIMAL(12, 2) NULL,
    `maturity_date` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `investments` ADD CONSTRAINT `investments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investments` ADD CONSTRAINT `investments_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `investment_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
