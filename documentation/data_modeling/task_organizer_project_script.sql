CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "name" varchar(150) NOT NULL,
  "username" varchar(150) UNIQUE NOT NULL,
  "password" varchar(255) NOT NULL
);

CREATE TABLE "categories" (
  "id" integer PRIMARY KEY,
  "name" varchar(150) NOT NULL
  "user_id" integer NOT NULL,
);

CREATE TABLE "tasks" (
  "id" integer PRIMARY KEY,
  "title" varchar(150) NOT NULL,
  "description" text NOT NULL,
  "creation_date" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "due_date" datetime NOT NULL,
  "update_date" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed" boolean NOT NULL DEFAULT 0,
  "user_id" integer NOT NULL,
  "category_id" integer,
  
  -- Chaves estrangeiras declaradas inline (compatível com SQLite e Postgres)
  CONSTRAINT "user_tasks" FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE,
  CONSTRAINT "user_categories" FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE,
  CONSTRAINT "task_category" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") DEFERRABLE INITIALLY IMMEDIATE
);