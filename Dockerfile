# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (produce node_modules)
RUN npm install --production && npm cache clean --force

# Stage 2: Production
FROM node:18-alpine

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar dependencias desde builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar el código fuente
COPY --chown=nodejs:nodejs . .

# 🔥 IMPORTANTE: copiar archivo .env (si existe)
COPY --chown=nodejs:nodejs .env .env

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3001

# ❗ No forzar NODE_ENV aquí, dejar que lo maneje docker-compose
# ENV NODE_ENV=production \
#     PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "server.js"]
