#!/bin/bash
[ "$UID" -eq 0 ] || exec sudo bash "$0" "$@"
echo "Installing into /opt/webtabs-linux-ia32"
cp -r webtabs-linux-ia32 /opt/webtabs-linux-ia32

echo "Creating desktop shortcuts"
mv /opt/webtabs-linux-ia32/resources/kongdash.desktop /usr/local/share/applications/

echo "Done."

exit

