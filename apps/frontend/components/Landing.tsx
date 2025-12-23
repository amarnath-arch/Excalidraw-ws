import Link from "next/link";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between py-6 px-30">
        <div className="flex items-center gap-2">
          <SketchIcon />
          <span className="text-xl font-bold text-foreground">Sketchboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href={"/login"}>
            <button className=" px-5 py-2.5 text-white bg-blue-500 cursor-pointer  font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-soft">
              SignIn
            </button>
          </Link>

          <Link href={"/login"}>
            <button className=" px-5 py-2.5 text-white bg-blue-500 cursor-pointer  font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-soft">
              SignUp
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className=" pt-16 pb-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Draw ideas together,
            <br />
            <span className="text-gradient">beautifully simple</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            A virtual whiteboard for sketching hand-drawn like diagrams.
            Collaborative, free, and open-source.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="bg-blue-500 text-white cursor-pointer px-8 py-3.5  text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-glow text-lg">
              Open Canvas
            </button>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="mt-16 max-w-4xl mx-auto animate-fade-in-up delay-200">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
            </div>
            <div className="aspect-video bg-background rounded-xl flex items-center justify-center relative">
              <CanvasPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className=" py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon={<PencilIcon />}
            title="Hand-drawn Feel"
            description="Natural, sketchy lines that make diagrams feel human and approachable."
          />
          <FeatureCard
            icon={<UsersIcon />}
            title="Real-time Collab"
            description="Work together with your team on the same canvas, instantly."
          />
          <FeatureCard
            icon={<ZapIcon />}
            title="Lightning Fast"
            description="No loading screens. Just open and start creating immediately."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className=" py-8 border-t border-border">
        <p className="text-center text-muted-foreground text-sm">
          Built with ♥ — Open source and free forever
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow">
    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 text-primary">
      {icon}
    </div>
    <h3 className="font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const SketchIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    className="text-primary"
  >
    <rect
      x="4"
      y="4"
      width="24"
      height="24"
      rx="4"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M10 22L14 14L18 18L22 10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PencilIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const CanvasPreview = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 600 300"
    className="animate-float"
  >
    <rect
      x="80"
      y="60"
      width="120"
      height="80"
      rx="8"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeDasharray="4 2"
    />
    <text
      x="140"
      y="105"
      textAnchor="middle"
      fill="hsl(var(--foreground))"
      fontSize="14"
      fontFamily="Nunito"
    >
      Idea
    </text>
    <path
      d="M200 100 Q 260 80 300 100"
      fill="none"
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
    />
    <polygon
      points="295,95 305,100 295,105"
      fill="hsl(var(--muted-foreground))"
    />
    <ellipse
      cx="400"
      cy="100"
      rx="80"
      ry="50"
      fill="none"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeDasharray="4 2"
    />
    <text
      x="400"
      y="105"
      textAnchor="middle"
      fill="hsl(var(--foreground))"
      fontSize="14"
      fontFamily="Nunito"
    >
      Design
    </text>
    <rect
      x="240"
      y="180"
      width="120"
      height="70"
      rx="8"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
    />
    <text
      x="300"
      y="220"
      textAnchor="middle"
      fill="hsl(var(--foreground))"
      fontSize="14"
      fontFamily="Nunito"
    >
      Ship ✨
    </text>
    <path
      d="M140 140 Q 180 200 240 215"
      fill="none"
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
    />
    <path
      d="M400 150 Q 380 200 360 215"
      fill="none"
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
    />
  </svg>
);

export default Landing;
