# 🛒 Ecommerce Backend (Laravel + Docker)

A **Laravel backend project** for managing products, users, and other ecommerce functionality. This setup uses **Docker** with MySQL and PhpMyAdmin for consistent environments across your team.

---

## 📝 Prerequisites

- PHP ≥ 8.2  
- Composer  
- MySQL  
- Node.js & npm (optional for frontend assets)  
- Docker & Docker Compose  

---

## 🚀 Installation (Docker)

1. **Clone the repository**
git clone <your-repo-url>
cd ecommerce-backend

2. **Build and start containers**
docker-compose up -d --build

📦 **Containers**:

| Service | Container Name | Ports |
|---------|----------------|-------|
| Laravel App | `ecommerce-backend` | 8000 → 80 |
| MySQL | `ecommerce-db` | 3306 → 3306 |
| PhpMyAdmin | `ecommerce-pma` | 8080 → 80 |

3. **Set up the environment file**
cp src/.env.example src/.env

Edit `src/.env` to match the Docker environment:
APP_NAME=EcommerceBackend
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

4. **Generate the application key**
- docker exec -it ecommerce-backend bash
- composer install
- php artisan key:generate

6. **Run migrations and seeders**
php artisan migrate:fresh --seed

---

## 🌐 Access

- **Laravel App**: http://localhost:8000  
- **PhpMyAdmin**: http://localhost:8080  
  - User: `laravel`  
  - Password: `secret`  

---

## ⚡ Usage

- **API Routes**: src/routes/api.php  
- **Products CRUD endpoints**: via ProductController  

Example JSON request to create a product:
POST /api/products
{
  "name": "Eco Tote Bag",
  "description": "Reusable tote bag",
  "price": 299.99,
  "stock": 50
}

---

## 👥 Notes for the Team

- Use the **same `.env`** values to avoid conflicts  
- All PHP commands (`artisan`, `composer`) should be run **inside the `ecommerce-backend` container**  
- Database is persistent via Docker volume `db_data`  

---

## 📁 Git Ignore

Make sure `.gitignore` includes:

/vendor
/node_modules
/src/.env
/src/storage
/public/storage


