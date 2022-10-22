# AstroBot

## Запуск
1. Установка зависимостей: 
```bash
$ npm ci
```
2. Установка и генерация prisma-клиента:
```bash
$ npx prisma generate
```
3. Применение миграций и наполнение базы данных:
```bash
$ npx prisma migrate deploy
$ node ./prisma/seed.js
```
4. Запуск бота:
```bash
$ npm start
```

## Структура `.env`-файла
```
TOKEN=telegram_token
DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public"
```

TOKEN:
- `telegram_token` - токен телеграм-бота.

DATABASE_URL:
- `username` - имя пользователя базы данных (БД);
- `password` - пароль пользователя БД;
- `host` - хост БД;
- `port` - порт БД;
- `database_name` - наименование базы в БД.