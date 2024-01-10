@echo off
cd /d %~dp0/../docs/
title "Webserver %cd%"
start "Webserver for TSLib" /min file_server -p 80 -v
explorer microsoft-edge:http://localhost/demos/1/host.htm
