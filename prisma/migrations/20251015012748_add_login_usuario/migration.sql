-- DropForeignKey
ALTER TABLE `entradasmaterial` DROP FOREIGN KEY `entradasmaterial_ibfk_1`;

-- DropForeignKey
ALTER TABLE `salidasmaterial` DROP FOREIGN KEY `salidasmaterial_ibfk_1`;

-- AddForeignKey
ALTER TABLE `entradasmaterial` ADD CONSTRAINT `entradasmaterial_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `materiales`(`id_material`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salidasmaterial` ADD CONSTRAINT `salidasmaterial_ibfk_1` FOREIGN KEY (`id_material`) REFERENCES `materiales`(`id_material`) ON DELETE NO ACTION ON UPDATE CASCADE;
