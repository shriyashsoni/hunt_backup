<div align="center">

# 🎯 Aptos Hunt

### The First Web3 Prediction Market for Content Authenticity

[![Aptos](https://img.shields.io/badge/Aptos-Testnet-00D4AA?style=for-the-badge&logo=aptos&logoColor=white)](https://aptoslabs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-FF6B6B?style=for-the-badge)](https://convex.dev/)
[![Move](https://img.shields.io/badge/Move-Smart_Contracts-4A90E2?style=for-the-badge)](https://aptos.dev/move/move-on-aptos/)

**Hunt Deepfakes. Earn Crypto. Climb Ranks.**

[Live Demo](#) • [Documentation](#features) • [Smart Contract](https://explorer.aptoslabs.com/account/0x155e43ac5e3c045997eae5fc8ccbcf9ddcc8dbd77849e4e54a40aa7d9dfd9ba9/modules/code/market?network=testnet)

</div>

---

## 🌟 Overview

**Aptos Hunt** is a revolutionary Web3 prediction market where users bet APT tokens on whether viral content is **Real** or **AI-Generated**. Powered by the Aptos blockchain, Veritas AI Oracle, and Shelby Protocol for decentralized storage, Aptos Hunt gamifies content authenticity verification while rewarding truth-seekers.

### 🎮 How It Works

1. **🔍 Create Bounty**: Submit suspicious content (images/videos) to create an on-chain prediction market
2. **💰 Place Bets**: Stake APT tokens on whether content is Real or AI-Generated
3. **🤖 AI Verification**: Veritas AI Oracle analyzes content and resolves the market
4. **🏆 Claim Rewards**: Winners split the losing pool proportionally to their stake

---

## ✨ Key Features

### 🔗 Blockchain Integration
- **⛓️ Aptos Testnet**: Lightning-fast, low-cost transactions
- **📜 Smart Contracts**: Custom Move modules for market creation, betting, and reward distribution
- **👛 Petra Wallet**: Seamless wallet connection with network validation
- **🔐 On-Chain Verification**: All bets and resolutions recorded immutably

### 🎨 Frontend Experience
- **🎭 Neo-Brutalist Design**: Bold, high-contrast UI with thick borders and vibrant colors
- **✨ Framer Motion Animations**: Smooth page transitions and interactive elements
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile
- **⚡ Real-Time Updates**: Live bounty status and pool updates via Convex

### 🤖 AI & Verification
- **🧠 Veritas AI Oracle**: Advanced content analysis for authenticity detection
- **📊 Confidence Scoring**: Transparent AI confidence levels (0-100%)
- **📝 Analysis Logs**: Detailed verification process logs for transparency

### 💾 Decentralized Storage
- **☁️ Shelby Protocol**: IPFS-based content archival on Shelbynet
- **🔗 Content Integrity**: Immutable CID (Content Identifier) for each upload
- **🌐 Permanent Storage**: Content remains accessible even if original source is removed

### 🎁 Tokenomics
- **💎 APT (Aptos Token)**: Primary betting currency
- **🪙 PAT (Platform Token)**: Reward token for bounty creators and active users
- **💸 Winner-Takes-All**: Proportional reward distribution to correct predictors

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square) | UI Framework | 19.1.0 |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) | Type Safety | 5.8.3 |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square) | Build Tool | 6.3.5 |
| ![React Router](https://img.shields.io/badge/-React_Router-CA4245?logo=react-router&logoColor=white&style=flat-square) | Routing | 7.6.1 |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white&style=flat-square) | Styling | 4.1.8 |
| ![Shadcn UI](https://img.shields.io/badge/-Shadcn_UI-000000?logo=shadcnui&logoColor=white&style=flat-square) | Component Library | Latest |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white&style=flat-square) | Animations | 12.15.0 |

### **Blockchain**
| Technology | Purpose |
|------------|---------|
| ![Aptos](https://img.shields.io/badge/-Aptos-00D4AA?style=flat-square) | Layer 1 Blockchain (Testnet) |
| ![Move](https://img.shields.io/badge/-Move-4A90E2?style=flat-square) | Smart Contract Language |
| ![Petra Wallet](https://img.shields.io/badge/-Petra_Wallet-FF6B6B?style=flat-square) | Wallet Adapter |
| **Aptos SDK** | Blockchain Interaction (v5.1.5) |

### **Backend & Database**
| Technology | Purpose |
|------------|---------|
| ![Convex](https://img.shields.io/badge/-Convex-FF6B6B?style=flat-square) | Serverless Backend & Real-Time Database |
| **Convex Auth** | Anonymous + Wallet Authentication |

### **Integrations**
| Service | Purpose | API Key |
|---------|---------|---------|
| **Shelby Protocol** | Decentralized Storage (Shelbynet) | `aptoslabs_Lep6hBwxZpV_...` |
| **Veritas AI** | Content Authenticity Oracle | Mock Implementation |

---

## 📦 Project Structure

This project uses the following tech stack:
- Vite
- Typescript
- React Router v7 (all imports from `react-router` instead of `react-router-dom`)
- React 19 (for frontend components)
- Tailwind v4 (for styling)
- Shadcn UI (for UI components library)
- Lucide Icons (for icons)
- Convex (for backend & database)
- Convex Auth (for authentication)
- Framer Motion (for animations)
- Three js (for 3d models)
- Aptos Move (Smart Contracts)

All relevant files live in the 'src' directory.

Use pnpm for the package manager.

## Setup

This project is set up already and running on a cloud environment, as well as a convex development in the sandbox.

## Smart Contract Setup (Web3)

We have included a full Move smart contract for the prediction market logic.
To deploy it to the Aptos Testnet, please follow the instructions in:
`SMART_CONTRACT_SETUP.md`

The contract source code is located in the `move/` directory.

## Environment Variables

The project is set up with project specific CONVEX_DEPLOYMENT and VITE_CONVEX_URL environment variables on the client side.

The convex server has a separate set of environment variables that are accessible by the convex backend.

Currently, these variables include auth-specific keys: JWKS, JWT_PRIVATE_KEY, and SITE_URL.
//


# Using Authentication (Important!)

You must follow these conventions when using authentication.

## Auth is already set up.

All convex authentication functions are already set up. The auth currently uses email OTP and anonymous users, but can support more.

The email OTP configuration is defined in `src/convex/auth/emailOtp.ts`. DO NOT MODIFY THIS FILE.

Also, DO NOT MODIFY THESE AUTH FILES: `src/convex/auth.config.ts` and `src/convex/auth.ts`.

## Using Convex Auth on the backend

On the `src/convex/users.ts` file, you can use the `getCurrentUser` function to get the current user's data.

## Using Convex Auth on the frontend

The `/auth` page is already set up to use auth. Navigate to `/auth` for all log in / sign up sequences.

You MUST use this hook to get user data. Never do this yourself without the hook:
```typescript
import { useAuth } from "@/hooks/use-auth";

const { isLoading, isAuthenticated, user, signIn, signOut } = useAuth();
```

## Protected Routes

When protecting a page, use the auth hooks to check for authentication and redirect to /auth.

## Auth Page

The auth page is defined in `src/pages/Auth.tsx`. Redirect authenticated pages and sign in / sign up to /auth.

## Authorization

You can perform authorization checks on the frontend and backend.

On the frontend, you can use the `useAuth` hook to get the current user's data and authentication state.

You should also be protecting queries, mutations, and actions at the base level, checking for authorization securely.

## Adding a redirect after auth

In `src/main.tsx`, you must add a redirect after auth URL to redirect to the correct dashboard/profile/page that should be created after authentication.

# Frontend Conventions

You will be using the Vite frontend with React 19, Tailwind v4, and Shadcn UI.

Generally, pages should be in the `src/pages` folder, and components should be in the `src/components` folder.

Shadcn primitives are located in the `src/components/ui` folder and should be used by default.

## Page routing

Your page component should go under the `src/pages` folder.

When adding a page, update the react router configuration in `src/main.tsx` to include the new route you just added.

## Shad CN conventions

Follow these conventions when using Shad CN components, which you should use by default.
- Remember to use "cursor-pointer" to make the element clickable
- For title text, use the "tracking-tight font-bold" class to make the text more readable
- Always make apps MOBILE RESPONSIVE. This is important
- AVOID NESTED CARDS. Try and not to nest cards, borders, components, etc. Nested cards add clutter and make the app look messy.
- AVOID SHADOWS. Avoid adding any shadows to components. stick with a thin border without the shadow.
- Avoid skeletons; instead, use the loader2 component to show a spinning loading state when loading data.


## Landing Pages

You must always create good-looking designer-level styles to your application. 
- Make it well animated and fit a certain "theme", ie neo brutalist, retro, neumorphism, glass morphism, etc

Use known images and emojis from online.

If the user is logged in already, show the get started button to say "Dashboard" or "Profile" instead to take them there.

## Responsiveness and formatting

Make sure pages are wrapped in a container to prevent the width stretching out on wide screens. Always make sure they are centered aligned and not off-center.

Always make sure that your designs are mobile responsive. Verify the formatting to ensure it has correct max and min widths as well as mobile responsiveness.

- Always create sidebars for protected dashboard pages and navigate between pages
- Always create navbars for landing pages
- On these bars, the created logo should be clickable and redirect to the index page

## Animating with Framer Motion

You must add animations to components using Framer Motion. It is already installed and configured in the project.

To use it, import the `motion` component from `framer-motion` and use it to wrap the component you want to animate.


### Other Items to animate
- Fade in and Fade Out
- Slide in and Slide Out animations
- Rendering animations
- Button clicks and UI elements

Animate for all components, including on landing page and app pages.

## Three JS Graphics

Your app comes with three js by default. You can use it to create 3D graphics for landing pages, games, etc.


## Colors

You can override colors in: `src/index.css`

This uses the oklch color format for tailwind v4.

Always use these color variable names.

Make sure all ui components are set up to be mobile responsive and compatible with both light and dark mode.

Set theme using `dark` or `light` variables at the parent className.

## Styling and Theming

When changing the theme, always change the underlying theme of the shad cn components app-wide under `src/components/ui` and the colors in the index.css file.

Avoid hardcoding in colors unless necessary for a use case, and properly implement themes through the underlying shad cn ui components.

When styling, ensure buttons and clickable items have pointer-click on them (don't by default).

Always follow a set theme style and ensure it is tuned to the user's liking.

## Toasts

You should always use toasts to display results to the user, such as confirmations, results, errors, etc.

Use the shad cn Sonner component as the toaster. For example:

```
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

Remember to import { toast } from "sonner". Usage: `toast("Event has been created.")`

## Dialogs

Always ensure your larger dialogs have a scroll in its content to ensure that its content fits the screen size. Make sure that the content is not cut off from the screen.

Ideally, instead of using a new page, use a Dialog instead. 

# Using the Convex backend

You will be implementing the convex backend. Follow your knowledge of convex and the documentation to implement the backend.

## The Convex Schema

You must correctly follow the convex schema implementation.

The schema is defined in `src/convex/schema.ts`.

Do not include the `_id` and `_creationTime` fields in your queries (it is included by default for each table).
Do not index `_creationTime` as it is indexed for you. Never have duplicate indexes.


## Convex Actions: Using CRUD operations

When running anything that involves external connections, you must use a convex action with "use node" at the top of the file.

You cannot have queries or mutations in the same file as a "use node" action file. Thus, you must use pre-built queries and mutations in other files.

You can also use the pre-installed internal crud functions for the database:

```ts
// in convex/users.ts
import { crud } from "convex-helpers/server/crud";
import schema from "./schema.ts";

export const { create, read, update, destroy } = crud(schema, "users");

// in some file, in an action:
const user = await ctx.runQuery(internal.users.read, { id: userId });

await ctx.runMutation(internal.users.update, {
  id: userId,
  patch: {
    status: "inactive",
  },
});
```


## Common Convex Mistakes To Avoid

When using convex, make sure:
- Document IDs are referenced as `_id` field, not `id`.
- Document ID types are referenced as `Id<"TableName">`, not `string`.
- Document object types are referenced as `Doc<"TableName">`.
- Keep schemaValidation to false in the schema file.
- You must correctly type your code so that it passes the type checker.
- You must handle null / undefined cases of your convex queries for both frontend and backend, or else it will throw an error that your data could be null or undefined.
- Always use the `@/folder` path, with `@/convex/folder/file.ts` syntax for importing convex files.
- This includes importing generated files like `@/convex/_generated/server`, `@/convex/_generated/api`
- Remember to import functions like useQuery, useMutation, useAction, etc. from `convex/react`
- NEVER have return type validators.

</initial_code>