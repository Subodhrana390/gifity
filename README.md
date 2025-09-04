# gifity

A modern Next.js application built with React 19, TypeScript, and TailwindCSS. This project serves as a starting point for building fast, scalable web applications with Next.js.

## Features

- **Next.js 15**: Latest version of Next.js with App Router
- **React 19**: Modern React with concurrent features
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **MongoDB Integration**: User authentication and data storage
- **GitHub OAuth**: Connect GitHub accounts to access repositories
- **JWT Authentication**: Secure token-based authentication
- **Repository Management**: View and select GitHub repositories
- **Dark Mode Support**: Automatic dark/light theme switching
- **ESLint**: Code linting and formatting
- **Responsive Design**: Mobile-first approach

## Project Structure

```
gifity/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── github/
│   │   │   │   └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   └── github/
│   │       └── repositories/
│   │           └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── repositories/
│       └── page.tsx
├── lib/
│   └── mongodb.ts
├── models/
│   └── User.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Tech Stack

- **Framework**: Next.js 15.5.2
- **Frontend**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **API**: Axios for HTTP requests
- **OAuth**: GitHub OAuth integration
- **Linting**: ESLint 9
- **Build Tool**: Next.js (built-in)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd gifity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## GitHub OAuth Setup

To enable GitHub integration, you need to create a GitHub OAuth App:

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Your app name (e.g., "gifity")
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**
6. Update your `.env.local` file:
   ```env
   GITHUB_CLIENT_ID=your-client-id-here
   GITHUB_CLIENT_SECRET=your-client-secret-here
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your-client-id-here
   ```

## Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in `.env.local` if needed
3. Start MongoDB server:
   ```bash
   # For local MongoDB
   mongod
   ```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

Start the production server:

```bash
npm start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Testing

No tests are currently configured for this project. To add testing:

1. Install testing dependencies:

   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. Add test scripts to `package.json`
3. Create test files in `__tests__/` directory

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

No license specified.

## Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js applications.

For Vercel deployment:

1. Connect your repository to Vercel
2. Vercel will automatically detect Next.js and configure the build settings
3. Deploy with a single click

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework for production
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Vercel](https://vercel.com/) - Platform for frontend frameworks and static sites
