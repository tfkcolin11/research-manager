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
- Zotero integration

### Future AI-Powered Features (Experimental)

We're exploring AI/LLM integration to enhance research capabilities. These experimental features may be refined based on technical feasibility:

#### 🔍 Research Analysis
- **Intelligent Literature Synthesis**: Automatically generate literature reviews structured around research questions  
- **Concept Relationship Mapping**: Identify connections between papers and visualize citation networks  
- **Semantic Search Engine**: Natural language search across paper content using embeddings  

#### ✍️ Writing Assistance
- **Dissertation Outlining**: Generate dissertation structure based on research questions  
- **Automated Citation Generation**: Suggest relevant citations for specific arguments  
- **Literature Gap Identification**: Highlight under-explored research areas  

#### 📊 Knowledge Extraction
- **Research Q&A System**: Answer complex research questions across papers  
- **Automated Summarization**: Generate paper abstracts and section summaries  
- **Claim Validation**: Cross-reference claims to identify consensus  
- **Methodology Comparison**: Analyze research methods across papers  

*Note: These features are in exploratory phase. Implementation feasibility will be evaluated during development.*

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
