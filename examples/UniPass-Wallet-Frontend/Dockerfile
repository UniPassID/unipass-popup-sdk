# yarn install && yarn run build:qa 无需放入dockerfile中，本地打包有缓存较为方便
FROM nginx:1.23-alpine

WORKDIR /opt/UniPass-Wallet-Frontend

# 复制nginx配置, 复制项目到工作目录
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /opt/UniPass-Wallet-Frontend

# 默认就是80 ，如果你的应该不是, 记得修改nginx.conf 中的监听端口
EXPOSE 80

# stop docker 时, 先关闭docker容器中的进程
STOPSIGNAL SIGQUIT
