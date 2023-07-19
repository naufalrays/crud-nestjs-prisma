## How to create RestAPI with Nest JS, Prisma ORM, and MySql.

Installation :

1. Install new NestJs :

```cmd
nest new crud-prisma
```

2. Install Prisma on NestJs :

```cmd
yarn add prisma --dev
```

3. Create initial prisma setup using init :

```cmd
yarn prisma init
```

Output folder :

<img src="images/after_init.png" width="200">

4. In schema.prisma change provider from "postgresql" to "mysql" :

```prisma
datasource db {
	provider = "mysql"
	url = env("DATABASE_URL")
}
```

5. Change .env configuration database://username:password@localhost:3306/crud-prisma

```
DATABASE_URL="mysql://root:@localhost:3306/crud-prisma"
```

6. Add two database tables to Mysql

```prisma
model User {
	id Int @id @default(autoincrement())
	email String @unique
	name String?
	posts Post[]
}

model Post {
	id Int @id @default(autoincrement())
	title String
	content String?
	published Boolean? @default(false)
	author User? @relation(fields: [authorId], references: [id])
	authorId Int?
}
```

7. Push with command using yarn :

```cmd
yarn prisma db push
```

8. Installing an intermediary between NestJs and the database.

```cmd
yarn add @prisma/client
```
