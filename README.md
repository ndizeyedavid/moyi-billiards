# Moyi Billiards

A modern web application for managing a billiards business, built with Next.js, Prisma, and PostgreSQL.

## Features

- Product Management (Billiards Equipment & Accessories)
- Blog System for News and Updates
- Team Member Management
- Contact Form with Reply System
- User Authentication for Admin Access
- Modern UI with Responsive Design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Custom Auth System
- **Email**: EmailJS
- **File Upload**: Cloudinary
- **Deployment**: Vercel

## Screenshots

<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/684c1d73-627d-4cd1-aaa2-c2dde64ed6e0" />

<img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/3f246633-d502-4c6a-a5d3-f053cc4dac3c" />

<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/59c68679-1686-49e0-80bb-8c17f4fafe67" />

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/moyi-billiards.git
cd moyi-billiards
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Database Management

The project uses PostgreSQL with Prisma as the ORM. The schema is defined in `prisma/schema.prisma`.

To update the database schema:

1. Modify `prisma/schema.prisma`
2. Run `npx prisma generate`
3. Run `npx prisma db push`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
