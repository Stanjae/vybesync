

```md
# 🎵 VybeSync

VybeSync is a vibrant and modern short-form video-sharing application inspired by TikTok. It’s designed for creators and users who love to express themselves through video. Built with cutting-edge technologies like **Next.js 14 App Router**, **Sanity**, and **Framer Motion**, VybeSync offers smooth scrolling, interactive animations, dynamic user profiles, and a clean, responsive design optimized for both web and mobile.

---

## 🌐 Live Demo

Coming soon...

---

## 📸 Features

- 🎥 Vertical short video feed
- ⏩ Smooth, animated button-based scrolling with **Framer Motion**
- 🔐 User authentication with **Auth.js**
- 📁 Upload video content via **Sanity Studio**
- 🧑‍🎤 Dynamic creator profile pages
- ❤️ Like, comment, and share features
- 🔍 Search for users or hashtags
- 🌙 Dark mode for better nighttime viewing
- 🧩 Modular, reusable React components
- 📦 Typed APIs and models using **TypeScript**
- 🔁 (WIP) Real-time updates via WebSockets/Firebase

---

## ⚙️ Tech Stack

| Technology        | Purpose                                 |
|-------------------|-----------------------------------------|
| **Next.js 14**     | React-based frontend framework          |
| **App Router**     | File-based routing system               |
| **TypeScript**     | Type-safe development                   |
| **Tailwind CSS**   | Utility-first CSS framework             |
| **Framer Motion**  | Animations and UI transitions           |
| **Sanity.io**      | Headless CMS (videos, users, comments) |
| **Auth.js**        | Authentication and session management   |
| **Vercel**         | Deployment and hosting                  |
| **Uploadcare**     | (Optional) Video hosting & optimization |
| **Zustand**        | Lightweight state management            |

---

## 📁 Folder Structure

```
vybesync/
│
├── app/                        # App Router pages & layouts
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Video feed homepage
│   ├── upload/page.tsx         # Video upload page
│   ├── user/[username]/        # Dynamic user profile routes
│   └── api/                    # API routes (likes, comments, auth)
│
├── components/                 # Reusable UI components
│   ├── VideoCard.tsx
│   ├── ScrollButtons.tsx
│   ├── CreatorProfile.tsx
│   ├── LikeButton.tsx
│   ├── CommentSection.tsx
│   ├── Navbar.tsx
│   └── ThemeToggle.tsx
│
├── lib/                        # Utility functions and clients
│   ├── sanity.ts               # Sanity client setup
│   ├── auth.ts                 # Auth.js config
│   ├── uploadcare.ts           # Uploadcare utilities
│   └── api.ts                  # Custom fetch helpers
│
├── sanity/                     # Sanity Studio setup
│   ├── schemas/                # Schema definitions
│   │   ├── video.ts
│   │   ├── user.ts
│   │   ├── comment.ts
│   │   └── like.ts
│   └── config.ts               # Sanity Studio config
│
├── public/                     # Static files
│
├── styles/                     # Global styles
│   └── globals.css
│
├── types/                      # Global TypeScript types
│   └── index.ts
│
├── utils/                      # Formatting and helpers
│   ├── formatDate.ts
│   └── isAuthenticated.ts
│
├── .env.local                  # Environment variables
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.js              # Next.js config
├── tsconfig.json               # TypeScript config
└── README.md                   # You're here!
```

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vybesync.git
cd vybesync
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and include:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_sanity_token

AUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000

UPLOADCARE_PUBLIC_KEY=your_uploadcare_key (optional)
```

### 4. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

App should now be running at: [http://localhost:3000](http://localhost:3000)

---

## 🧠 Sanity Schemas Overview

| Schema     | Fields                                      |
|------------|---------------------------------------------|
| `user`     | username, bio, avatar, email                |
| `video`    | title, videoFile, thumbnail, postedBy, tags |
| `comment`  | text, author, videoRef, createdAt           |
| `like`     | userRef, videoRef                           |

Sanity is also used to create and manage users and videos programmatically through API routes.

---

## 🧳 Upcoming Features

- 🔁 Real-time comments with Firebase/WebSocket
- 🎨 Video filters and effects
- 📲 PWA support
- 🧠 AI-generated captions & auto hashtags
- 🔔 In-app notifications
- 🗂️ Video categorization by genre

---

## 🤝 Contributing

Want to improve VybeSync? PRs are welcome!

1. Fork the project
2. Create a feature branch
3. Commit changes and push
4. Open a pull request!

---

## 📜 License

MIT License © 2025 Stanley Ajaero (Stanjae)

---

## 🙋‍♂️ Contact

Made with love by **Stanjae**

- Email: stanykhay29@gmail.com  
- Twitter: [@stanjae](https://twitter.com/stanjae)  
- Website: https://stanjhae.vercel.app

```

---
