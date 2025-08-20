# Mizai Digital Verse

A modern digital platform built with React and TypeScript, featuring an adaptive UI system and integrated media playback capabilities.

## 🚀 Overview

Mizai is a full-stack web application that provides a rich digital experience with customizable UI, integrated media playback, and real-time data handling. The application features an adaptive interface that responds to user preferences and behaviors, creating a personalized digital verse.

## 🛠️ Technologies

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Radix UI** - Accessible component primitives
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animation library
- **TanStack Query** - Data fetching and state management

### Backend
- **Supabase** - Backend-as-a-Service platform
  - Authentication
  - Database
  - Storage

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Bun** - JavaScript runtime & package manager

## 📋 Prerequisites

- Node.js (v18+) or Bun
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd mizai-digital-verse
   ```

2. Install dependencies
   ```bash
   # Using npm
   npm install
   
   # Using Bun
   bun install
   ```

3. Configure environment variables
   - Create a `.env` file in the root directory based on `.env.example`
   - Add your Supabase credentials

### Development

Run the development server:
```bash
# Using npm
npm run dev

# Using Bun
bun dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
# Using npm
npm run build

# Using Bun
bun run build
```

## 📁 Project Structure

```
mizai-digital-verse/
├── backend/             # Backend services
│   └── services/        # API services
├── frontend/            # Frontend specific files
│   ├── src/             # Frontend source code
│   └── ...
├── public/              # Static assets
├── src/                 # Main source code
│   ├── components/      # UI components
│   │   ├── ContentFeed/ # Content feed components
│   │   ├── Header/      # Header components
│   │   └── MediaPlayers/# Media player components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # External service integrations
│   │   └── supabase/    # Supabase client and utilities
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   ├── services/        # Service layer
│   └── utils/           # Utility functions
├── supabase/            # Supabase configuration
└── ...                  # Configuration files
```

## 🌟 Features

- Adaptive UI system that responds to user preferences
- Integrated media playback for various content types
- Mood-based content recommendations
- Real-time data synchronization with Supabase
- Mobile-responsive design

## 🧪 Testing

```bash
# Run tests
npm run test
```

## 📝 Development Guidelines

- Follow the TypeScript coding standards
- Use functional components with hooks
- Implement responsive designs using Tailwind CSS
- Follow the component structure defined in the project
- Use context API for global state management

## 🔄 CI/CD

This project uses automated CI/CD pipelines for:
- Code quality checks
- Testing
- Deployment to staging/production environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- [Your Name](https://github.com/yourusername) - Project Lead
- [Contributor 1](https://github.com/contributor1) - Frontend Developer
- [Contributor 2](https://github.com/contributor2) - Backend Developer

## 📬 Contact

For any questions or feedback, please reach out to [email@example.com](mailto:email@example.com)
