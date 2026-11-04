# forma

> **shape your product** — An interactive 3D product customization studio built with React Three Fiber, Next.js, and Zustand.

forma gives users a real-time 3D studio experience to inspect, customize, and configure mechanical and luxury products. Explore exploded component views, cinematic camera framing, dynamic part labeling, and materials in real-time.

---

## Features

- **High-Fidelity 3D Rendering**: Physically-based rendering (PBR) powered by Three.js and React Three Fiber, featuring soft contact shadows, HDR environment lighting, ACESFilmic tone mapping, and ground reflections.
- **Multiple Configurable Models**:
  - **Apple Watch Ultra 2**: Multi-component smartwatch with case, alpine loop band, digital crown, display face, and ceramic backplate.
  - **Santa Cruz V10**: Downhill mountain bike with carbon chassis frame, wheel rims, Fox suspension, and drivetrain pedals/gears.
  - **Fender Stratocaster 1954**: Classic electric guitar with contoured alder body, maple neck, single-ply pickguard, and chrome bridge hardware.
  - **Knob1 Mechanical Keyboard**: Custom keyboard assembly with aluminum chassis base, keycaps, switch plate, rotary encoder knob, and interactive OLED matrix display.
- **Cinematic Part-Focused Views**: Smooth camera lerping and framing transitions focused on active component categories, featuring full focus-lock security (orbit rotation, panning, scroll zooming, and explode mode safely locked to preserve precision framing).
- **Exploded View & 3D Labels**: Smooth spatial disassembly along configured axes with billboarding HTML markers anchored to 3D mesh coordinates.
- **Client-Side Binary GLB Export**: In-browser 3D model serialization powered by Three.js `GLTFExporter`, embedding real-time PBR roughness, metalness, hex albedos, canvas textures, and component hierarchies into standalone `.glb` files.
- **User Garage & Build Locker**: Cloud persistence for up to 20 custom variations per user powered by Neon Serverless Postgres and Drizzle ORM. Features URL deep linking (`?id=`), public design forking, edit lock protection, and automated WebP canvas thumbnails.
- **Downloadable Specification PDF**: Automated client-side engineering spec sheet export featuring dual high-resolution captures (imploded overview and exploded view with 3D labels), interactive digital designer signature pad, verified Clerk authorization badges, and material telemetry tables.
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
- **3D & PDF Serialization**: [Three.js GLTFExporter](https://threejs.org/docs/#examples/en/exporters/GLTFExporter) & [jsPDF](https://github.com/parallax/jsPDF)
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
   NEON_DB_SECRET_KEY=your_postgres_connection_string
   ```

4. Push the database schema:
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
│   ├── .well-known/           # Security.txt disclosure policy
│   ├── hdris/                 # Studio HDR environment maps
│   ├── models/                # 3D assets (.glb formats)
│   ├── appIcon.png            # Application logo
│   ├── thumbnail_1200x630.png # Open Graph social preview
│   ├── llms.txt               # LLM/agent index
│   ├── llms-full.txt          # Complete LLM/agent context corpus
│   └── robots.txt             # Search crawler directives
├── src/
│   ├── actions/               # Server Actions (garage CRUD, permissions, quota)
│   ├── app/                   # Next.js App Router pages, metadata, and layouts
│   ├── components/
│   │   ├── configurator/      # Sidebar inspector, export modals, and model panels
│   │   ├── garage/            # Garage cards and action menus
│   │   ├── gltfjsx/           # React Three Fiber model components
│   │   ├── landing/           # Hero, showcase, and FeatureGrid components
│   │   ├── layout/            # Navbar, footer, and theme controls
│   │   └── scene/             # PrimaryCanvas, CameraRig, Floor, lighting
│   ├── constants/             # Focus targets, camera positions, and zoom parameters
│   ├── db/                    # Drizzle schema and Neon database client
│   ├── hooks/                 # Custom React and Tweakpane hooks
│   ├── lib/                   # GLB exporter, PDF compositor, and 3D labels
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
