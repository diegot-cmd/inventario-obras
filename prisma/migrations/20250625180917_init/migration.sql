/*
  Warnings:

  - You are about to drop the `material` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `material`;

-- CreateTable
CREATE TABLE `entradasmaterial` (
    `id_entrada` INTEGER NOT NULL AUTO_INCREMENT,
    `id_material` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `id_proveedor` INTEGER NULL,
    `fecha_entrada` DATE NULL,

    INDEX `id_material`(`id_material`),
    INDEX `id_proveedor`(`id_proveedor`),
    PRIMARY KEY (`id_entrada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiales` (
    `id_material` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `unidad_medida` VARCHAR(50) NOT NULL,
    `precio_unitario` DECIMAL(10, 2) NOT NULL,
    `stock_actual` INTEGER NOT NULL DEFAULT 0,
    `fecha_registro` DATE NULL,

    PRIMARY KEY (`id_material`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id_proveedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_empresa` VARCHAR(150) NOT NULL,
    `contacto` VARCHAR(100) NULL,
    `telefono` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `direccion` TEXT NULL,

    PRIMARY KEY (`id_proveedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salidasmaterial` (
    `id_salida` INTEGER NOT NULL AUTO_INCREMENT,
    `id_material` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `destino` VARCHAR(150) NULL,
    `fecha_salida` DATE NULL,

    INDEX `id_material`(`id_material`),
    PRIMARY KEY (`id_salida`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entradasmaterial` ADD CONSTRAINT `entradasmaterial_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `materiales`(`id_material`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `entradasmaterial` ADD CONSTRAINT `entradasmaterial_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores`(`id_proveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `salidasmaterial` ADD CONSTRAINT `salidasmaterial_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `materiales`(`id_material`) ON DELETE NO ACTION ON UPDATE NO ACTION;
