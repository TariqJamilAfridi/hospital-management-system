# Contributing to CarePlus Hospital Management System

Thank you for considering contributing to our project! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Check if the issue has already been reported
- Include detailed information:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots if applicable
  - Environment details (OS, browser, Node version)

### Suggesting Enhancements

- Use the GitHub issue tracker
- Provide a clear description of the enhancement
- Explain why it would be useful
- Include mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (see commit message guidelines below)
6. Push to your fork
7. Open a Pull Request

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/hospital-management-system.git
   cd hospital-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both root and backend directories
   - Update the values as needed

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   npm start
   ```

## Coding Guidelines

### JavaScript/React

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use PropTypes or TypeScript for type checking

### File Structure

- Place components in `/src/components`
- Place pages in `/src/pages`
- Place utilities in `/src/utils`
- Place API calls in `/src/services`
- Place custom hooks in `/src/hooks`

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in objects and arrays
- Use arrow functions for callbacks
- Use destructuring when appropriate

### Example Component

```javascript
import { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';

const ExampleComponent = ({ data, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Component logic
  }, [data]);

  const handleClick = () => {
    // Event handler logic
  };

  return (
    <div className="example-component">
      {/* Component JSX */}
    </div>
  );
};

export default ExampleComponent;
```

## Commit Messages

Follow the conventional commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(appointments): add appointment cancellation feature

Add ability for users to cancel their appointments
with a confirmation dialog and status update.

Closes #123
```

```
fix(payment): resolve Safepay integration timeout issue

Increase timeout for payment gateway requests
and add retry logic for failed transactions.
```

## Pull Request Process

1. **Update documentation** - Update README.md if you change functionality
2. **Add tests** - Include tests for new features
3. **Update CHANGELOG** - Add entry in CHANGELOG.md
4. **Follow code style** - Ensure your code passes linting
5. **Write clear PR description** - Explain what and why
6. **Link issues** - Reference related issues
7. **Request review** - Tag maintainers for review
8. **Address feedback** - Respond to review comments

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How the changes were tested

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
```

## Questions?

Feel free to reach out:
- Open an issue for general questions
- Email: info@careplushospital.com

Thank you for contributing! 🎉
