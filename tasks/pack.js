module.exports = function (gulp, packageJson) {
    'use strict';
    const _ = require('underscore');
    const electronPackager = require('electron-packager');

    const RELEASE_SETTINGS = {
        dir: '.',
        name: packageJson.name,
        out: 'release',
        'appVersion': packageJson.version,
        'appCopyright': 'Copyright (c) 2016 ' + packageJson.author,
        'version-string': {
            ProductName: packageJson.name,
            CompanyName: packageJson.author,
            FileDescription: packageJson.name,
            OriginalFilename: packageJson.name + '.exe',
            ProductVersion: packageJson.version,
            'file-version': packageJson.version,
            'product-version': packageJson.version,
            LegalCopyright: 'Copyright (c) 2016 ' + packageJson.author
        },
        win32metadata: {
            ProductName: packageJson.name,
            CompanyName: packageJson.author,
            FileDescription: packageJson.name,
            OriginalFilename: packageJson.name + '.exe',
            ProductVersion: packageJson.version,
            'file-version': packageJson.version,
            'product-version': packageJson.version,
            LegalCopyright: 'Copyright (c) 2016 ' + packageJson.author
        },
        ignore: /.idea|release|resources|tasks|.gitignore|.eslintrc.json|gulpfile.js|screenshot.png|README.md|CHANGELOG.md$/,
        appPath: packageJson.main,
        overwrite: true,
        asar: true,
        prune: true
    };

    gulp.task('pack-linux-armv7l', gulp.series(function (next) {
        electronPackager(_.extend(RELEASE_SETTINGS, {
                platform: 'linux',
                arch: 'armv7l'
            })).then(() => {
                console.log('Pack-Linux (Arch: armv7l) - ! SUCCESS !');
            }).catch((err) => {
                console.log('Pack-Linux (Arch: armv7l) - ! FAILED !');
                console.log(err);
            })
            .finally(() => {
                next();
            });
    }));

    gulp.task('pack-linux-x64', gulp.series(function (next) {
        electronPackager(_.extend(RELEASE_SETTINGS, {
                platform: 'linux',
                arch: 'x64'
            })).then(() => {
                console.log('Pack-Linux (Arch: x64) - ! SUCCESS !');
            }).catch((err) => {
                console.log('Pack-Linux (Arch: x64) - ! FAILED !');
                console.log(err);
            })
            .finally(() => {
                next();
            });
    }));

    gulp.task('pack-windows-ia32', gulp.series(function (next) {
        electronPackager(_.extend(RELEASE_SETTINGS, {
                platform: 'win32',
                arch: 'ia32',
                icon: 'resources/icons/kongdash-256x256.ico'
            })).then(() => {
                console.log('Pack-Windows (Arch: ia32) - ! SUCCESS !');
            }).catch((err) => {
                console.log('Pack-Windows (Arch: ia32) - ! FAILED !');
                console.log(err);
            })
            .finally(() => {
                next();
            });
    }));

    gulp.task('pack-windows-x64', gulp.series(function (next) {
        electronPackager(_.extend(RELEASE_SETTINGS, {
                platform: 'win32',
                arch: 'x64',
                icon: 'resources/icons/kongdash-256x256.ico'
            })).then(() => {
                console.log('Pack-Windows (Arch: ia32) - ! SUCCESS !');
            }).catch((err) => {
                console.log('Pack-Windows (Arch: ia32) - ! FAILED !');
                console.log(err);
            })
            .finally(() => {
                next();
            });
    }));

    gulp.task('pack-osx', gulp.series(function (next) {
        electronPackager(_.extend(RELEASE_SETTINGS, {
                appBundleId: 'io.kongdash',
                platform: 'darwin',
                arch: 'all',
                icon: 'resources/icons/kongdash-256x256.icns'
            })).then(() => {
                console.log('Pack-Darwin (Arch: all) - ! SUCCESS !');
            }).catch((err) => {
                console.log('Pack-Darwin (Arch: all) - ! FAILED !');
                console.log(err);
            })
            .finally(() => {
                next();
            });
    }));
};