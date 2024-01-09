const checkMenuItemsExist = (menuItems, menuItemIds) => {
    if (menuItems.length !== menuItemIds.length) {
        const notFoundItemIds = menuItemIds.filter(id => !menuItems.some(item => item._id.equals(id)));

        return notFoundItemIds;
    } else {
        return null;
    }
};

module.exports = { checkMenuItemsExist }
