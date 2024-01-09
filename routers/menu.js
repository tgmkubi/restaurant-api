const express = require('express');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const { createMenu, createMenuItem, addMenuItemToMenu, addMenuItemsToMenu, deleteMenuItemFromMenu } = require('../controllers/menu');
const { checkMenuExist, checkMenuItemExist } = require('../middlewares/database/databaseErrorHelpers'); // TODO

const router = express.Router();

router.use([getAccessToRoute, getAdminAccess]);
router.post('/', createMenu);
router.post('/createmenuitem', createMenuItem);
// TODO: router.delete('/deletemenuitem/:id', checkMenuItemExist, deleteMenuItem);
router.put('/:menuId/addmenuitemtomenu/:menuItemId', [checkMenuExist, checkMenuItemExist], addMenuItemToMenu);
router.put('/:menuId/addmenuitemstomenu', checkMenuExist, addMenuItemsToMenu);
router.put('/:menuId/deletemenuitemfrommenu/:menuItemId', [checkMenuExist, checkMenuItemExist], deleteMenuItemFromMenu);

module.exports = router;