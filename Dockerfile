# --- Étape 1: Build/Construction de l'application React ---
FROM node:lts-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Lancer la commande de construction (crée le dossier 'dist' ou 'build')
# Assurez-vous que votre script 'build' est défini dans package.json
RUN npm run build 


# --- Étape 2: Production/Service des fichiers statiques avec NGINX ---
# NGINX est léger et optimisé pour servir des fichiers statiques
FROM nginx:alpine

# Copier les fichiers de construction (les assets statiques) depuis l'étape 'build'
# Le dossier de sortie est généralement 'dist' pour Vite ou 'build' pour CRA
COPY --from=build /app/dist /usr/share/nginx/html

# Optionnel: Copier un fichier de configuration NGINX personnalisé
# Si votre application a des routes côté client (ex: React Router), vous aurez besoin
# d'une configuration NGINX pour rediriger toutes les requêtes vers index.html.
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port par défaut de NGINX (80)
EXPOSE 80

# La commande par défaut de l'image NGINX démarre le serveur
CMD ["nginx", "-g", "daemon off;"]