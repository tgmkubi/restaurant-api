const asyncErrorWrapper = require('express-async-handler');
const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const CustomError = require('../helpers/error/CustomError');
const { checkMenuItemsExist } = require('../helpers/database/databaseErrorHelpers');

const createMenu = asyncErrorWrapper(async (req, res, next) => {

    const { name, description } = req.body;

    const menu = await Menu.create({
        name,
        description
    });

    if (!menu) {
        return next(new CustomError("Please check your inputs", 400));
    }

    return res.status(200).json({
        success: true,
        data: menu
    })
});

const createMenuItem = asyncErrorWrapper(async (req, res, next) => {

    const { name, category, size, price, description } = req.body;

    const menuItem = await MenuItem.create({
        name,
        category,
        size,
        price,
        description
    });

    if (!menuItem) {
        return next(new CustomError("Please check your inputs", 400));
    }

    return res.status(200).json({
        success: true,
        data: menuItem
    })
});

const addMenuItemToMenu = asyncErrorWrapper(async (req, res, next) => {

    const menu = req.menu;
    const menuItem = req.menuItem;

    menu.price += menuItem.price;
    menu.items.push(menuItem._id);
    const updatedMenu = await menu.save();

    if (!updatedMenu) {
        return next(new CustomError("MenuItem could not be save to Menu. Please try again later.", 500));
    }

    return res.status(200).json({
        success: true,
        data: updatedMenu
    })
});

const addMenuItemsToMenu = asyncErrorWrapper(async (req, res, next) => {
    const menu = req.menu;
    const menuItemIds = req.body.menuItemIds;

    // MenuItemId'leri kullanarak ilgili MenuItem'leri bulma
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    const notFoundItemIds = checkMenuItemsExist(menuItems, menuItemIds);
    if (notFoundItemIds) {
        return next(new CustomError(`The following MenuItem(s) not found: ${notFoundItemIds.join(', ')}`, 400));
    };

    // Her MenuItem'i menüye ekleme ve menü fiyatını güncelleme
    menuItems.forEach((menuItem) => {
        menu.items.push(menuItem._id);
        menu.price += menuItem.price;
    });

    // Menüyü kaydetme ve güncellenmiş menüyü elde etme
    const updatedMenu = await menu.save();

    if (!updatedMenu) {
        return next(new CustomError("MenuItems could not be saved to Menu. Please try again later.", 500));
    }

    return res.status(200).json({
        success: true,
        data: updatedMenu,
    });
});

const deleteMenuItemFromMenu = asyncErrorWrapper(async (req, res, next) => {
    const menu = req.menu;
    const menuItemId = req.params.menuItemId;

    // MenuItemId'yi menu.items dizisinden çıkarma
    const indexToRemove = menu.items.indexOf(menuItemId);

    if (indexToRemove === -1) {
        // Eğer MenuItemId, menu.items dizisinde bulunamazsa
        return next(new CustomError("MenuItem not found in the menu.", 404));
    }

    // MenuItem'ı menu.items dizisinden çıkartma
    menu.items.splice(indexToRemove, 1);

    // MenuItem'ın fiyatını alarak menu.price'ı azaltma
    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
        return next(new CustomError("MenuItem not found in the database.", 404));
    }

    menu.price -= menuItem.price;

    // Menüyü kaydetme ve güncellenmiş menüyü elde etme
    const updatedMenu = await menu.save();

    if (!updatedMenu) {
        return next(new CustomError("Menu could not be updated. Please try again later.", 500));
    }

    return res.status(200).json({
        success: true,
        data: updatedMenu,
    });
});


module.exports = { createMenu, createMenuItem, addMenuItemToMenu, addMenuItemsToMenu, deleteMenuItemFromMenu };