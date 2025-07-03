# JStack - Open Source Notion Alternative

JStack is a powerful open-source alternative to Notion with our own unique features and improvements, built on a modern tech stack for high performance and affordability.

## Overview

JStack provides a collaborative workspace similar to Notion but with enhanced performance, customizability, and affordability. Our platform combines document editing, knowledge management, and team collaboration in a seamless experience.

### Key Features

- **Block-Based Editor** - Create rich, interactive content with our flexible block system
- **Workspaces & Folders** - Organize your content hierarchically with intuitive navigation
- **Collaborative Editing** - Real-time collaboration with team members
- **Database Views** - Create and customize views for your structured data
- **High Performance** - Built on Next.js 15+ for optimal speed and responsiveness
- **Self-Hosted Option** - Full control over your data with self-hosting capability
- **Modern Tech Stack**:
  - Next.js 15+ for frontend and API routes
  - Drizzle ORM for type-safe database operations
  - Hono for ultra-fast API endpoints
  - Tailwind CSS for beautiful, responsive UI
  - TypeScript for full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (or Neon serverless Postgres)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/jstack.git
   cd jstack
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/jstack
   ```

4. Initialize the database
   ```bash
   npm run db:push
   # or
   yarn db:push
   # or
   pnpm db:push
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   └── server/           # Server-side code
│       ├── db/           # Database schemas and utilities
│       ├── jstack.ts     # JStack initialization
│       └── routers/      # API route handlers
├── public/               # Static assets
├── drizzle/              # Drizzle migrations
└── auth-schema.ts        # Authentication schema
```

## Database Schema

Our comprehensive database schema includes:

- User authentication and profiles
- Workspaces and workspace members
- Hierarchical folder structure
- Notes with block-based content (similar to Notion)
- Tags and categorization
- Collaboration features
- File attachments
- Database views and relations

## What Makes Us Different from Notion

- **Performance**: Built with performance as a priority using the latest Next.js and edge computing
- **Affordability**: Self-host for free or use our cloud option at a fraction of Notion's cost
- **Customizability**: Open-source means you can modify and extend to fit your exact needs
- **Data Ownership**: Full control over your data with self-hosting options
- **Developer-Friendly**: Built with modern tools that developers love

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Database commands
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:reset     # Reset database
npm run db:studio    # Open Drizzle Studio
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
