# Research Manager

## Overview
Research Manager is a web application for organizing and managing academic research papers. It allows researchers to:
- Create projects to organize papers by topic
- Add and categorize research papers
- Track paper metadata (title, authors, publication details)
- View papers in a dashboard interface

**Note: This application is currently in active development.** Some features may be unstable or incomplete. We appreciate your understanding as we work to improve the application.

## Current Development Status
🚧 **Active Development Warning** 🚧  
This application is under active development. Features may change without notice, and some functionality may be unstable. We recommend against using this in production environments at this time.

### Implemented Features
- Project creation and management
- Basic paper management (add/edit/view)
- Dashboard interface
- API endpoints for projects and papers

### Planned Features
- User authentication
- PDF upload and processing
- Search functionality
- Citation management
- Collaboration features

## Technology Stack
- **Frontend**: Next.js 14 (React)
- **Backend**: Next.js API routes
- **Database**: Prisma ORM with SQLite (dev)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/research-manager.git
   cd research-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to: http://localhost:3000

## Known Limitations
- Database schema may change during development
- No user authentication system yet
- Limited error handling in some features
- UI may be inconsistent in some areas
- Performance optimizations still in progress

## Contributing
Contributions are welcome! Please see CONTRIBUTING.md for guidelines (coming soon).

## License
This project is licensed under the MIT License.
