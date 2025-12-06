# =======================================
# ETAPA 1: Construcción (Builder)
# =======================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# --- IMPORTANTE: Variables de entorno en tiempo de Build ---
# En React/Vite, las variables se "queman" en el código al hacer build.
# Necesitamos declararlas aquí para que Dokploy pueda inyectarlas.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construye la app (Genera la carpeta /dist)
RUN npm run build

# =======================================
# ETAPA 2: Servidor Producción (Nginx)
# =======================================
FROM nginx:alpine AS runner

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Borramos los archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos SOLO la carpeta 'dist' generada en la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 3000 (coincide con el nginx.conf)
EXPOSE 3000

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]