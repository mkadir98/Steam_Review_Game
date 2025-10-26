# Contributing to Steam Review Quiz Game

Thank you for your interest in contributing to the Steam Review Quiz Game! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:
- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details**:
  - OS (Windows/macOS/Linux)
  - Node.js version
  - Browser (for frontend issues)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title** describing the enhancement
- **Provide detailed description** of the proposed functionality
- **Explain why this would be useful** to users
- **Include mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** (see below)
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## Development Process

### 1. Setting Up Development Environment

Follow the [SETUP.md](SETUP.md) guide to set up your local development environment.

### 2. Creating a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `style/` - Code style changes

### 3. Making Changes

#### Backend (Server)

- Follow **Node.js best practices**
- Use **async/await** for asynchronous operations
- Add **error handling** for all API endpoints
- **Validate input** on all endpoints
- Add **comments** for complex logic
- Use **meaningful variable names**

#### Frontend (Client)

- Follow **React best practices**
- Use **TypeScript** properly with types
- Create **reusable components**
- Use **Tailwind CSS** for styling
- Implement **responsive design**
- Add **loading states** and **error handling**
- Follow the **existing component structure**

### 4. Code Style

#### JavaScript/TypeScript

```javascript
// Use const/let, not var
const userId = '123';
let score = 0;

// Use arrow functions
const calculateScore = (points) => {
  return points * 2;
};

// Use template literals
const message = `User ${username} scored ${score} points`;

// Use destructuring
const { username, email } = user;

// Use async/await
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
```

#### React Components

```typescript
// Use TypeScript interfaces
interface ComponentProps {
  title: string;
  onSubmit: (value: string) => void;
}

// Functional components with TypeScript
const MyComponent: React.FC<ComponentProps> = ({ title, onSubmit }) => {
  const [value, setValue] = useState('');
  
  return (
    <div className="container">
      <h2>{title}</h2>
    </div>
  );
};

export default MyComponent;
```

### 5. Testing

Before submitting a pull request:

1. **Test all features** manually
2. **Check both guest and authenticated flows**
3. **Test on different screen sizes**
4. **Verify API endpoints** with test data
5. **Check console** for errors/warnings

### 6. Commit Messages

Write clear, concise commit messages:

```bash
# Good
git commit -m "Add genre hint feature to game board"
git commit -m "Fix leaderboard sorting issue"
git commit -m "Update README with deployment instructions"

# Bad
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "changes"
```

Format:
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 7. Submitting Pull Request

1. **Push your changes** to your fork
```bash
git push origin feature/your-feature-name
```

2. **Open a pull request** from your fork to the main repository

3. **Fill out the PR template** with:
   - Description of changes
   - Related issues
   - Screenshots (if UI changes)
   - Testing done

4. **Wait for review** and address feedback

## Project Structure

```
Steam_Oyun_Bulma/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (Auth, Game)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
│
└── server/                # Express backend
    ├── controllers/       # Business logic
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose schemas
    ├── routes/            # API routes
    └── server.js          # Entry point
```

## Adding New Features

### Adding a New Component

1. Create component file in `client/src/components/`
2. Use TypeScript and proper typing
3. Follow existing component patterns
4. Export default component
5. Import and use in appropriate page

### Adding a New API Endpoint

1. Add controller function in `server/controllers/`
2. Add route in appropriate `server/routes/` file
3. Add authentication/authorization if needed
4. Add input validation
5. Update API documentation in README

### Adding a New Database Model

1. Create model in `server/models/`
2. Define schema with proper types
3. Add indexes for queried fields
4. Add schema methods if needed
5. Export model

## Common Tasks

### Adding a New Review Field

1. Update `Review` model schema
2. Update admin panel form
3. Update review display components
4. Update API validation
5. Migrate existing data if needed

### Adding a New Game Mode

1. Create new page in `client/src/pages/`
2. Add route in `App.tsx`
3. Create API endpoint if needed
4. Add navigation link
5. Update documentation

### Improving Performance

- Use React.memo() for expensive components
- Implement lazy loading for routes
- Optimize database queries with indexes
- Add caching where appropriate
- Minimize bundle size

## Questions?

If you have questions about contributing:
- Open an issue with the `question` label
- Check existing issues for similar questions
- Review the [README.md](README.md) and [SETUP.md](SETUP.md)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for their contributions
- GitHub contributors page

Thank you for contributing! 🎮✨


