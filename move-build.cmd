@echo off
rmdir /s /q nginx\build
xcopy build nginx\build /s /e /y
