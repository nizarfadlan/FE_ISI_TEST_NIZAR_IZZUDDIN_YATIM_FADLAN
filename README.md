# TODO List

## Introduction

This is a simple TODO list application that allows users to add, edit, and delete tasks. The application is built using Next.js, Tailwind CSS, PostgreSQL, and Drizzle.

## Installation

1. Clone the repository

```bash
git clone
```

2. Install the dependencies

```bash
pnpm install
```

3. Copy the `.env.example` file to `.env` and update the environment variables

```bash
cp .env.example .env
```

## Running the application

### Docker Compose

1. Start the application

```bash
docker-compose up --build
```

2. Open the application in your browser

```
http://localhost:3000
```

### Development

1. Start the PostgreSQL database or use the existing one

```bash
docker-compose up -d fe-isi-test-nizar-izzuddin-yatim-fadlan-db
```

2. Start the application

```bash
pnpm dev
```

3. Open the application in your browser

```
http://localhost:3000
```
