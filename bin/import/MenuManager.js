function MenuManager() {
    throw new Error('This is a static class');
}

MenuManager._menu = null;

MenuManager.clear = function () {
    MenuManager._menu = null;
};

MenuManager.setMenu = function (menu) {
    MenuManager._menu = menu;
};

MenuManager.menu = function () {
    return MenuManager._menu;
};

MenuManager.isMenu = function (menu) {
    return MenuManager._menu === menu;
};

MenuManager.isClear = function () {
    return MenuManager._menu === null;
};

module.exports = MenuManager;