#!/bin/bash

# 安装依赖
pip3 install -r src-backend/requirements.txt

# 设置环境变量
export PORT=3050

# 进入后端目录
cd src-backend

# 使用uvicorn启动后端服务，在3050端口
uvicorn app:app --host 0.0.0.0 --port 3050 &

echo "AIaW后端服务已在3050端口启动"
