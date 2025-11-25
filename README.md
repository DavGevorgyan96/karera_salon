# Karera Beauty Salon

Полноценный проект онлайн-салона красоты «КарЕра».
Стек: Next.js (Frontend) + NestJS (Backend) + PostgreSQL (Prisma).

## Структура

- `backend/` - API на NestJS.
- `frontend/` - Клиентская часть и Админ-панель на Next.js.

## Предварительные требования

- Node.js (v18+)
- PostgreSQL (запущенный локально или в Docker)

## Установка и запуск

### 1. Настройка Backend

1. Перейдите в папку backend:
   ```bash
   cd backend
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Создайте файл `.env` на основе `.env.example` и укажите данные от вашей БД:
   ```bash
   cp .env.example .env
   # Отредактируйте DATABASE_URL в .env
   ```
4. Запустите миграции и сиды (заполнение тестовыми данными):
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
   *Примечание: При запуске seed будет создан админ `admin@karera.ru` / `admin123`.*

5. Запустите сервер разработки:
   ```bash
   npm run start:dev
   ```
   Backend будет доступен по адресу: `http://localhost:3001`

### 2. Настройка Frontend

1. Откройте новый терминал и перейдите в папку frontend:
   ```bash
   cd frontend
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Создайте файл `.env.local` (или `.env`):
   ```bash
   cp .env.example .env.local
   ```
4. Запустите сервер разработки:
   ```bash
   npm run dev
   ```
   Frontend будет доступен по адресу: `http://localhost:3000`

## Функционал

### Публичная часть (http://localhost:3000)
- Главная страница
- Каталог услуг
- Список мастеров
- Онлайн-запись
- Отзывы
- Контакты

### Админ-панель (http://localhost:3000/admin)
- Логин: `admin@karera.ru` / `admin123` (после запуска seed)
- Dashboard (обзор)
- Управление записями
- Управление услугами
- Управление мастерами
- Модерация отзывов
- Настройки салона

## Разработка

- **Prisma Studio**: Для просмотра БД можно запустить `npx prisma studio` в папке backend.
- **Swagger**: (Опционально) можно подключить Swagger в NestJS для документации API.
