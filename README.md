# forma

> **shape your product** — An interactive 3D product customization studio built with React Three Fiber, Next.js, and Zustand.

forma gives users a real-time 3D studio experience to inspect, customize, and configure mechanical and luxury products. Explore exploded component views, cinematic camera framing, dynamic part labeling, and materials in real-time.

---

## Features

- **High-Fidelity 3D Rendering**: Physically-based rendering (PBR) powered by Three.js and React Three Fiber, featuring soft contact shadows, HDR environment lighting, and ground reflections.
- **Multiple Configurable Models**:
  - **Apple Watch Ultra 2**: Multi-component smartwatch with titanium chassis, digital crown, display face, alpine band, and biometric sensor backplate.
  - **Santa Cruz V10**: Downhill mountain bike with frame, Fox suspension, chainwheel, pedals, and disc brakes.
  - **Fender Stratocaster 1954**: Classic electric guitar with wood body, maple neck, pickups, pickguard, and hardware.
  - **Mechanical Keyboard**: Custom keyboard assembly with keycaps, switches, knobs, and chassis.
- **Cinematic Part-Focused Views**: Smooth camera lerping and framing transitions focused on specific component categories (Case, Band, Crown, Display, Back) with clamped OrbitControls.
- **Exploded View & 3D Labels**: Smooth spatial disassembly along configured axes with billboarding HTML markers anchored to 3D mesh coordinates.
- **User Garage & Presets**: Authenticated user garage to save custom builds using Clerk and Neon Serverless Postgres.
- **Adaptive Design & A11y**: Full light/dark mode support, semantic HTML landmarks, WCAG-compliant contrast, and keyboard navigation.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + React 19
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **3D Utilities**: [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & ORM**: [Neon Serverless Postgres](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)
- **Icons & UI**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js 20+ installed
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bbs220/project_product_configurator.git
   cd project_product_configurator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Database (Neon Serverless Postgres)
   DATABASE_URL=your_postgres_connection_string
   ```

4. Push the database schema (optional, for saved configurations):
   ```bash
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── public/
│   ├── hdris/                 # Studio HDR environment maps
│   ├── models/                # 3D assets (.glb formats)
│   ├── appIcon.png            # Application logo
│   ├── thumbnail_1200x630.png # Open Graph social preview
│   ├── llms.txt               # LLM/agent index
│   └── robots.txt             # Search crawler directives
├── src/
│   ├── app/                   # Next.js App Router pages and layouts
│   ├── components/
│   │   ├── configurator/      # Sidebar inspector and model panels
│   │   ├── gltfjsx/           # React Three Fiber model components
│   │   ├── layout/            # Navbar, footer, and theme controls
│   │   └── scene/             # PrimaryCanvas, CameraRig, Floor, lighting
│   ├── db/                    # Drizzle schema and Neon database client
│   ├── hooks/                 # Custom React and Tweakpane hooks
│   ├── lib/                   # Utilities and 3D label components
│   ├── stores/                # Zustand stores (useConfiguratorStore, etc.)
│   └── types/                 # TypeScript GLTF type definitions
└── next.config.ts             # Security headers and Next.js settings
```

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack
- `npm run build`: Creates an optimized production build
- `npm run start`: Runs the built production application
- `npm run lint`: Runs ESLint checks
- `npm run db:push`: Pushes Drizzle schema changes to the Neon database
- `npm run db:studio`: Opens Drizzle Studio to inspect and manage database records

---

## License

This project is licensed under the MIT License.

```text
├── public/
│   ├── hdris/                 # Studio HDR environment maps
│   ├── models/                # 3D assets (.glb formats)
│   ├── appIcon.png            # Application logo
│   ├── thumbnail_1200x630.png # Open Graph social preview
│   ├── llms.txt               # LLM/agent index
│   └── robots.txt             # Search crawler directives
├── src/
│   ├── app/                   # Next.js App Router pages and layouts
│   ├── components/
│   │   ├── configurator/      # Sidebar inspector and model panels
│   │   ├── gltfjsx/           # React Three Fiber model components
│   │   ├── layout/            # Navbar, footer, and theme controls
│   │   └── scene/             # PrimaryCanvas, CameraRig, Floor, lighting
│   ├── db/                    # Drizzle schema and Neon database client
│   ├── hooks/                 # Custom React and Tweakpane hooks
│   ├── lib/                   # Utilities and 3D label components
│   ├── stores/                # Zustand stores (useConfiguratorStore, etc.)
│   └── types/                 # TypeScript GLTF type definitions
└── next.config.ts             # Security headers and Next.js settings
```

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack
- `npm run build`: Creates an optimized production build
- `npm run start`: Runs the built production application
- `npm run lint`: Runs ESLint checks
- `npm run db:push`: Pushes Drizzle schema changes to the Neon database
- `npm run db:studio`: Opens Drizzle Studio to inspect and manage database records

---

## License

This project is licensed under the MIT License.

