# Docker 部署快速指南

## 🐳 快速部署配置

### 1. Dockerfile (多阶段构建)
```dockerfile
# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

# 安装pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. docker-compose.yml
```yaml
version: '3.8'

services:
  ruoyi-element-ai:
    build: .
    ports:
      - '8080:80'
    environment:
      - VITE_API_URL=http://your-backend-api.com
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 3. nginx.conf (优化配置)
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 静态资源缓存
        location / {
            try_files $uri $uri/ /index.html;

            # 缓存控制
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API代理配置
        location /api/ {
            proxy_pass http://your-backend-api.com;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 🚀 快速部署命令

### 构建和运行
```bash
# 构建Docker镜像
docker build -t ruoyi-element-ai .

# 运行容器
docker run -d -p 8080:80 --name ruoyi-ai-app ruoyi-element-ai

# 使用docker-compose
docker-compose up -d
```

### 环境变量配置
创建 `.env` 文件：
```env
# 后端API地址
VITE_API_URL=https://api.your-domain.com

# 应用标题
VITE_WEB_TITLE=Ruoyi AI Chat

# 环境模式
VITE_APP_ENV=production
```

## 📊 部署检查清单

### 部署前检查
- [ ] 确认Node.js版本 >= 16.0.0
- [ ] 检查package.json依赖完整性
- [ ] 验证环境变量配置正确
- [ ] 测试本地构建是否成功

### 部署后验证
- [ ] 访问应用首页检查加载状态
- [ ] 测试API接口连通性
- [ ] 验证静态资源加载
- [ ] 检查控制台错误日志

## 🔧 故障排除

### 常见问题解决
1. **端口冲突**: 修改docker-compose.yml中的端口映射
2. **构建失败**: 检查Dockerfile中的依赖安装步骤
3. **资源加载失败**: 验证nginx配置中的静态资源路径
4. **API连接失败**: 检查环境变量中的API地址配置

### 日志查看
```bash
# 查看容器日志
docker logs ruoyi-ai-app

# 实时查看日志
docker logs -f ruoyi-ai-app

# 进入容器调试
docker exec -it ruoyi-ai-app sh
```

## 🌐 生产环境建议

### 安全配置
- 使用HTTPS证书
- 配置防火墙规则
- 定期更新基础镜像
- 设置资源限制

### 监控配置
- 配置日志收集
- 设置健康检查端点
- 监控容器资源使用
- 配置告警规则

这个快速指南提供了完整的Docker部署方案，可以快速将Ruoyi-Element-AI应用部署到生产环境。
