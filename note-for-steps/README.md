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

9. Create prisma module :

```cmd
nest g mo prisma
```

10. Create service prisma :

```cmd
nest g s prisma
```

11. Use Prisma Client in NestJS service (prisma.service.ts) :

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

12. To access the Prisma Service secara globally, add PrismaService on exports, and add the Modul globally :

```typescript
@Global()
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
```

### Create CRUD user :

#### Read :

1. Create prisma module, controller, service for user:

```cmd
nest g mo user
nest g co user
nest g s user
```

2. In user.service.ts add :

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private dbService: PrismaService) {}

  async findAll() {
    return await this.dbService.user.findMany();
  }
}
```

3. In user.controller.ts add :

```typescript
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async users() {
    return await this.userService.findAll();
  }
}
```

4. Testing in Postman :

<img src="images/read_postman.png" width="60%">

#### Create

1. In user.service.ts add :

```typescript
async createUser(user: any) {
	return await this.dbService.user.create({
		data: user,
	});
}
```

2. In user.controller.ts add :

```typescript
@Post()
async createUser(@Body() body) {
	return await this.userService.createUser(body);
}
```

3. Testing in Postman :

   <img src="images/create_potman.png" width="60%">

#### Update

1. In user.service.ts add :

````ts
async updateData(id: number, data: any) {
	return await this.dbService.user.update({
		data,
		where: {
			id,
		},
	});
}```
2. In user.controller.ts add :
```ts
@UsePipes(ValidationPipe)
@Patch('/:id')
async updateUser(@Param('id', ParseIntPipe) id, @Body() body) {
	return await this.userService.updateData(id, body);
}
````

@UserPipes(ValidationPipe) is used to Parse an Integer from a String 3. Install class validator, and class transformer

```cmd
yarn add class-validator class-transformer
```

4. Testing in Postman :

   <img src="images/update_postman.png" width="60%">

#### Delete

1. In user.service.ts add :

```ts
async deleteUser(id: number) {
	return await this.dbService.user.delete({
		where: {
		id,
		},
	});
}
```

2. in user.controller.ts add :

```ts
@Delete('/:id')
async deteleUser(@Param('id', ParseIntPipe) id) {
	return await this.userService.deleteUser(id);
}
```

3. Testing in Postman :

<img src="images/delete_postman.png" width="60%">

### Validator :

1. Create a dto Folder in the User Folder and create a file name create-user.dto.ts inside the dto Folder. Add code in the create-user.dto.ts file :

```ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
```

2. Add the code program to the createUser function in the user.controller.ts file :

```ts
@UsePipes(ValidationPipe)
@Post()
async createUser(@Body() body: CreateUserDto) {
	return await this.userService.createUser(body);
}
```

3. Change the data type from any to CreateUserDto in the createUser function in the user.service.ts file :

```ts
async createUser(data: CreateUserDto) {
	return await this.dbService.user.create({
		data,
	});
}
```

4.  Testing in Postman :

    If the email is empty :

    <img src="images/email_empty_postman.png" width="60%">

    If the name is empty :

    <img src="images/name_empty_postman.png" width="60%">
