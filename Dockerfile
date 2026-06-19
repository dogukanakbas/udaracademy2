# Aşama 1: Projeyi derlemek (build) için Node.js kullanıyoruz
FROM node:22-alpine AS builder

WORKDIR /app

# Paket bağımlılıklarını kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala ve projeyi derle
COPY . .
RUN npm run build

# Aşama 2: Derlenen statik dosyaları sunmak için Nginx kullanıyoruz
FROM nginx:alpine

# Vite'in derlediği dosyaları (dist) Nginx'in sunucu dizinine kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Varsayılan 80 portunu dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
