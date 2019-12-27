const path = require('path');

module.exports = {
    "packagerConfig": {},
    "electronPackagerConfig": {
        "packageManager": 'npm',
        "icon": path.resolve(__dirname, "src/img/logo")
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
    "plugins": []
}