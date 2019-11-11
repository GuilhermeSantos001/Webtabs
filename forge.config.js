const path = require('path');

module.exports = {
    "packagerConfig": {},
    "electronPackagerConfig": {
        "icon": path.resolve(__dirname, 'src/img/win/icon.ico')
    },
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "webtabs"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ],
    "plugins": [
        [
            "@electron-forge/plugin-webpack",
            {
                "mainConfig": "./webpack.main.config.js",
                "renderer": {
                    "config": "./webpack.renderer.config.js",
                    "entryPoints": [
                        {
                            "name": "main_window",
                            "html": "./src/index.html",
                            "js": "./src/renderer.js"
                        },
                        {
                            "name": "editor_window",
                            "html": "./src/editor/index.html",
                            "js": "./src/editor/index.js"
                        }
                    ]
                }
            }
        ]
    ]
}