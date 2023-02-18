# AstroBot

## Запуск
1. Установка зависимостей:
```bash
$ npm ci
```
2. Установка и генерация prisma-клиента:
```bash
$ cd src
$ npx prisma generate
```
3. Применение миграций:
```bash
$ cd src
$ npx prisma migrate deploy
```
4. Компиляция и наполнение базы данных:
```bash
$ tsc
$ node ./dist/prisma/seed.js
```
5. Запуск бота:
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

## Команды бота
`/start` - начало работы с ботом
`/leave` - выход из сцены с категориями