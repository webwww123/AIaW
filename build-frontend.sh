#!/bin/bash

# 进入AIaW目录
cd ~/AIaW

# 构建前端PWA版本
pnpm build -m pwa

# 复制前端文件到后端静态目录
mkdir -p src-backend/static
cp -r dist/pwa/* src-backend/static/
