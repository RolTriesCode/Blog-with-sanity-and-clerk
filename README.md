# Premium AI-Powered Blog with Next.js, Sanity, and Clerk

A modern, high-performance blogging platform featuring AI-assisted content generation, seamless authentication, and a robust headless CMS architecture.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **🔐 Secure Authentication**: Integrated with Clerk for seamless user login, registration, and profile management.
- **🤖 AI Content Generation**: Leverage OpenAI's GPT-4o-mini to generate professional blog content automatically based on categories and topics.
- **📦 Headless CMS**: Powered by Sanity.io for flexible content modeling and real-time updates.
- **🎨 Modern UI/UX**: Premium design built with Tailwind CSS 4, Radix UI, and smooth animations using Framer Motion.
- **📝 Full CRUD Operations**: Authenticated users can create, edit, and delete their own posts.
- **🔍 Advanced Search & Filtering**: Dynamic category-based filtering and search functionality.
- **🖼️ Image Management**: Integrated Sanity image pipeline for optimized asset handling.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **AI**: [OpenAI API](https://openai.com/api/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Project Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Sanity Configuration
# Note: Project ID and Dataset are currently hardcoded in src/sanity/client.ts
SANITY_API_WRITE_TOKEN=your_sanity_write_token

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### 4. Sanity Setup

Ensure you have a Sanity project configured with the appropriate schema (post, author, category). The current Project ID is `sxgnyuor`.

## 💻 Running Locally

To start the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and server actions.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and shared logic.
- `src/sanity`: Sanity client configuration.

## 📄 License

This project is licensed under the MIT License.
