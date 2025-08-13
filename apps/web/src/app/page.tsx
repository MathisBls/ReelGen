"use client";

import { useEffect, useMemo, useState } from "react";

type Integration = {
  id: "YouTube" | "TikTok" | "Instagram" | "FFmpeg" | "FastAPI" | "Postgres";
  status: "Stable" | "Beta" | "Stack";
  desc: string;
  note?: string;
};

const INTEGRATIONS: Integration[] = [
  {
    id: "YouTube",
    status: "Stable",
    desc: "Upload + planification via OAuth 2.0.",
    note: "Brouillons, public/privé, scheduling.",
  },
  {
    id: "TikTok",
    status: "Beta",
    desc: "Publication via compte connecté (OpenAPI).",
    note: "Aucune création de compte automatique.",
  },
  {
    id: "Instagram",
    status: "Beta",
    desc: "Publication via Meta Graph. Compte pro requis.",
    note: "Limites selon Meta.",
  },
  { id: "FFmpeg", status: "Stack", desc: "Rendu & encodage vidéo." },
  { id: "FastAPI", status: "Stack", desc: "API & Auth." },
  { id: "Postgres", status: "Stack", desc: "Stockage des données." },
];

function Icon({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    className: `${className} inline-block shrink-0`,
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "bolt":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
        </svg>
      );
    case "wand":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 20l8-8M14 6l4-4M16 10l2-2M10 4l2-2" />
        </svg>
      );
    case "subtitles":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 11h5M7 15h3M14 15h3" />
        </svg>
      );
    case "schedule":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M8 2v4M16 2v4M3 10h18M12 12v5l3 1" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
        </svg>
      );
    case "play":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <polygon points="8,5 19,12 8,19" fill="currentColor" stroke="none" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3 3v18h18" />
          <rect x="7" y="10" width="3" height="7" />
          <rect x="12" y="6" width="3" height="11" />
          <rect x="17" y="12" width="3" height="5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    default:
      return null;
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400/80 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-300" />
      </span>
      {children}
    </span>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-xl bg-white/10 p-2 text-fuchsia-300 shadow-inner">
          <Icon name={icon} className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold text-white/95">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-white/70">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-400 font-semibold text-slate-900">
          {n}
        </div>
        <h4 className="font-semibold text-white/95">{title}</h4>
      </div>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  );
}

function Tier({
  name,
  price,
  period = "/mois",
  bullets,
  cta,
  highlight = false,
}: {
  name: string;
  price: string;
  period?: string;
  bullets: string[];
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        highlight
          ? "border-fuchsia-400/40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_0_0_1px_rgba(250,184,255,0.3)]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 right-4 rounded-full bg-fuchsia-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-900">
          Populaire
        </div>
      )}
      <h3 className="text-lg font-semibold text-white/95">{name}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{price}</span>
        {price !== "Sur devis" && (
          <span className="text-sm text-white/60">{period}</span>
        )}
      </div>
      <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <Icon name="check" className="mt-0.5 h-4 w-4 text-fuchsia-300" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <button
        className={`mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${
          highlight
            ? "bg-fuchsia-400 text-slate-900 hover:brightness-95"
            : "bg-white/10 text-white hover:bg-white/15"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

function GlowOrbs({ className = "" }: { className?: string }) {
  return (
    <>
      <div
        className={`absolute left-10 top-8 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl animate-pulse motion-reduce:animate-none ${className}`}
      />
      <div
        className={`absolute right-16 top-24 h-48 w-48 rounded-full bg-indigo-500/25 blur-3xl animate-pulse motion-reduce:animate-none ${className}`}
      />
      <div
        className={`absolute left-1/3 bottom-8 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl ${className}`}
      />
    </>
  );
}

export default function ReelgenLanding() {
  const [minutes, setMinutes] = useState<number>(60);
  const range = useMemo(() => {
    const min = Math.max(1, Math.round((minutes / 60) * 5));
    const max = Math.max(min + 1, Math.round((minutes / 60) * 15));
    return { min, max };
  }, [minutes]);

  const [activeIntegration, setActiveIntegration] =
    useState<Integration["id"]>("YouTube");
  const sel = useMemo(
    () => INTEGRATIONS.find((i) => i.id === activeIntegration)!,
    [activeIntegration]
  );

  const slides = useMemo(
    () => [
      { caption: "Clip 1", tags: "#ai #podcast #marketing" },
      { caption: "Clip 2", tags: "#growth #tiktok" },
      { caption: "Clip 3", tags: "#brand #reel" },
    ],
    []
  );
  const [slide, setSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      2500
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const trackWidth = `${slides.length * 100}%`;
  const trackShift = `${(slide * 100) / slides.length}%`;
  const itemWidth = `${100 / slides.length}%`;

  return (
    <main className="min-h-screen bg-slate-950 text-white antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <GlowOrbs className="opacity-60" />
      </div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 top-[-10%] h-[40rem] w-[40rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -right-40 bottom-[-20%] h-[40rem] w-[40rem] rounded-full bg-indigo-500/20 blur-3xl" />
          <GlowOrbs />
        </div>

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900">
              <Icon name="spark" className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Reelgen</span>
            <Badge>Beta privée ouverte</Badge>
          </div>
          <nav className="hidden items-center gap-6 md:flex text-sm text-white/80">
            <a href="#features" className="hover:text-white">
              Fonctionnalités
            </a>
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-white">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
            <a
              href="#cta"
              className="rounded-xl bg-white/10 px-3 py-1.5 hover:bg-white/15"
            >
              Se connecter
            </a>
          </nav>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-2 md:pb-24 md:pt-10">
          <div>
            <Badge>Long-form → Shorts, en quelques minutes</Badge>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Transformez podcasts & webinars en{" "}
              <span className="bg-gradient-to-r from-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                shorts prêts à publier
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-white/75 md:text-lg">
              Reelgen détecte automatiquement les meilleurs moments, génère des
              sous-titres stylés et publie sur YouTube, TikTok et Instagram.
              Gagnez des heures, gardez le contrôle éditorial.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="rounded-xl bg-fuchsia-400 px-5 py-3 font-semibold text-slate-900 hover:brightness-95"
              >
                Essayer gratuitement
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
              >
                <Icon name="play" /> Voir une démo
              </a>
              <span className="text-xs text-white/60">
                ⚡️ 1h de vidéo → {range.min}–{range.max} shorts
              </span>
            </div>

            <div className="mt-6 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <label
                htmlFor="minutes"
                className="block text-xs font-medium text-white/70"
              >
                Calculeur rapide
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="minutes"
                  type="number"
                  value={minutes}
                  min={5}
                  max={240}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    const safe = Number.isFinite(n)
                      ? Math.min(240, Math.max(5, n))
                      : 60;
                    setMinutes(safe);
                  }}
                  className="w-28 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-0 focus:border-fuchsia-400/50"
                />
                <span className="text-sm text-white/80">
                  min → ≈ {range.min}–{range.max} shorts
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-fuchsia-400/20 to-indigo-400/20 blur-2xl" />
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="flex h-full w-full items-center justify-center text-center">
                  <div className="max-w-sm px-6">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                      <Icon name="subtitles" /> Sous-titres synchronisés
                    </div>
                    <h3 className="text-2xl font-semibold">Prévisualisation</h3>
                    <p className="mt-2 text-sm text-white/70">
                      Habillage 9:16, couleurs de marque, emojis, waveforms…
                      Tout est automatisé, mais vous gardez la main.
                    </p>
                    <div className="mt-4 flex justify-center gap-2 text-xs text-white/60">
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        9:16
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        1:1
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        16:9
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="md:w-1/2">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                  Se connecte à vos réseaux
                </div>
                <div className="flex flex-wrap gap-3">
                  {INTEGRATIONS.filter((i) =>
                    ["YouTube", "TikTok", "Instagram"].includes(i.id)
                  ).map((i) => (
                    <button
                      key={i.id}
                      onClick={() => setActiveIntegration(i.id)}
                      aria-pressed={activeIntegration === i.id}
                      className={`group relative inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition active:scale-95 ${
                        activeIntegration === i.id
                          ? "border-fuchsia-400/60 bg-white/[0.06] ring-1 ring-fuchsia-400/40"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          i.status === "Stable"
                            ? "bg-emerald-400"
                            : "bg-amber-300"
                        }`}
                      />
                      <span className="font-medium">{i.id}</span>
                      {activeIntegration === i.id && (
                        <span className="pointer-events-none absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-fuchsia-400/20 to-indigo-400/20 blur-lg" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-white/60 md:hidden">
                  {INTEGRATIONS.filter((i) =>
                    ["FFmpeg", "FastAPI", "Postgres"].includes(i.id)
                  ).map((i) => (
                    <div
                      key={i.id}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1 text-center"
                    >
                      {i.id}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative md:w-1/2">
                <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-fuchsia-400/10 to-indigo-400/10 blur-2xl" />
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          sel.status === "Stable"
                            ? "bg-emerald-400"
                            : "bg-amber-300"
                        }`}
                      />
                      <div className="text-sm font-semibold">{sel.id}</div>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/60">
                        {sel.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/80">{sel.desc}</p>
                    {sel.note && (
                      <p className="mt-2 text-xs text-white/60">{sel.note}</p>
                    )}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => alert(`Connexion à ${sel.id} (mock)`)}
                        className="rounded-xl bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:brightness-95"
                      >
                        Connecter {sel.id}
                      </button>
                      <button
                        onClick={() => alert("Docs à venir")}
                        className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                      >
                        Voir la doc
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 hidden grid-cols-3 gap-3 md:grid">
              {INTEGRATIONS.filter((i) =>
                ["FFmpeg", "FastAPI", "Postgres"].includes(i.id)
              ).map((i) => (
                <div
                  key={i.id}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    {i.id}
                  </div>
                  <div className="text-sm text-white/70">{i.desc}</div>
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-white/0 to-white/5 opacity-0 transition group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Pensé pour la vitesse, conçu pour la qualité
          </h2>
          <p className="mt-3 text-white/70">
            Détection auto des moments forts, habillage cohérent avec votre
            marque, publication 1‑clic et mesures intégrées.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon="bolt"
            title="Détection intelligente"
            desc="Segments scorés selon pauses, emphases et rythme. Générez des candidats en quelques minutes."
          />
          <Feature
            icon="subtitles"
            title="Sous-titres stylés"
            desc="Typos, couleurs, emojis, surlignage mot-à-mot. Templates enregistrés par marque."
          />
          <Feature
            icon="schedule"
            title="Publication & planning"
            desc="Publiez en brouillon/public/privé, planifiez et recyclez automatiquement sur vos comptes connectés."
          />
          <Feature
            icon="wand"
            title="Rendus optimisés"
            desc="Exports 9:16, 1:1, 16:9 en H.264/H.265. Encodages économes pour des temps de rendu courts."
          />
          <Feature
            icon="shield"
            title="Sécurité & conformité"
            desc="OAuth officiel, scopes minimaux, tokens chiffrés, journaux d’audit, effacement à la demande."
          />
          <Feature
            icon="chart"
            title="Mesure intégrée"
            desc="Suivez CTR, vues, watch time (selon API). Tableau de bord par clip, média et plateforme."
          />
        </div>
      </section>

      <section
        id="workflow"
        className="relative border-y border-white/10 bg-white/[0.02] py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Un workflow simple, de l’upload à la publication
            </h2>
            <p className="mt-3 text-white/70">
              Automatisez 80% du travail et gardez le contrôle sur l’éditorial.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Step
              n={1}
              title="Upload & Ingest"
              desc="Glissez-déposez votre vidéo (ou URL présignée). Transcription + timecodes, extraction pistes/frames."
            />
            <Step
              n={2}
              title="Sélection & Édits"
              desc="Validez/rejetez les clips candidats, ajustez titres, hashtags et templates."
            />
            <Step
              n={3}
              title="Rendu & Publication"
              desc="Sous-titres stylés, export MP4, publication et planification sur YouTube/TikTok/Instagram."
            />
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Voyez la différence en 60 secondes
            </h2>
            <p className="mt-3 text-white/70">
              Avant/Après, templates de marque, et publication 1‑clic. Demandez
              une démo guidée ou testez la beta gratuite.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#cta"
                className="rounded-xl bg-fuchsia-400 px-5 py-3 font-semibold text-slate-900 hover:brightness-95"
              >
                Rejoindre la beta
              </a>
              <a
                href="#pricing"
                className="rounded-xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
              >
                Voir les tarifs
              </a>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-fuchsia-300" /> Pas
                de carte requise (beta)
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-fuchsia-300" />{" "}
                Annulation en 1 clic
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-fuchsia-300" /> RGPD,
                effacement sur demande
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-fuchsia-400/20 to-indigo-400/20 blur-2xl" />
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur">
              <div className="aspect-[9/16] w-[260px] sm:w-[280px] md:w-[320px] mx-auto overflow-hidden rounded-[1.5rem] bg-slate-900">
                <div
                  className="relative h-full w-full"
                  onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchStart !== null) {
                      const dx = e.changedTouches[0].clientX - touchStart;
                      if (Math.abs(dx) > 40)
                        setSlide(
                          (s) =>
                            (s + (dx < 0 ? 1 : -1) + slides.length) %
                            slides.length
                        );
                      setTouchStart(null);
                    }
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="flex h-full transition-transform duration-500"
                      style={{
                        width: trackWidth,
                        transform: `translateX(-${trackShift})`,
                      }}
                    >
                      {slides.map((s, i) => (
                        <div
                          key={i}
                          className="relative h-full shrink-0"
                          style={{ width: itemWidth }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="text-xs text-white/70">
                              {s.caption} • 00:3{i} — {s.tags}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlide(i)}
                          className={`h-1.5 w-4 rounded-full ${
                            slide === i ? "bg-white" : "bg-white/30"
                          }`}
                          aria-label={`Aller au slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative border-y border-white/10 bg-white/[0.02] py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Tarification simple, qui scale avec vous
            </h2>
            <p className="mt-3 text-white/70">
              Des minutes incluses, des templates avancés et la planification
              multi‑plateformes. Ajoutez des packs de minutes à la demande.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Tier
              name="Beta / Gratuit"
              price="0€"
              bullets={[
                "Minutes de rendu limitées",
                "Templates de base",
                "Export 9:16, 1:1, 16:9",
                "Essai sans carte",
              ]}
              cta="Commencer"
            />
            <Tier
              name="Pro"
              price="39€"
              bullets={[
                "+ minutes / mois",
                "Templates avancés & presets",
                "Publication & planification",
                "Support standard",
              ]}
              cta="Choisir Pro"
              highlight
            />
            <Tier
              name="Agency"
              price="Sur devis"
              bullets={[
                "Multi‑marques & équipes",
                "Webhooks, SSO, SLAs",
                "Quotas personnalisés",
                "Onboarding dédié",
              ]}
              cta="Parler à l’équipe"
            />
          </div>
          <p className="mt-6 text-center text-xs text-white/50">
            Les prix sont indicatifs pour la beta et peuvent évoluer à la
            sortie.
          </p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-3 text-white/70">
            Si vous ne trouvez pas votre réponse, écrivez‑nous :
            hello@reelgen.app
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white/95">
              Comment se passe la publication ?
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Nous utilisons les APIs officielles (OAuth). Pas de création de
              compte automatique. Vous connectez vos comptes et choisissez
              brouillon/public/privé + planification.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white/95">
              Qui possède mes données ?
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Vous. Tokens chiffrés, accès S3 signés, suppression sur demande
              (right to be forgotten). Journaux d’audit disponibles.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white/95">
              Quels formats de rendu ?
            </h3>
            <p className="mt-2 text-sm text-white/70">
              MP4 H.264/H.265 avec exports 9:16, 1:1, 16:9. Sous‑titres stylés
              intégrés au rendu.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white/95">
              Puis‑je garder la main sur les clips ?
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Oui. Les clips auto sont des brouillons que vous pouvez valider,
              éditer, ou rejeter avant rendu/publication.
            </p>
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-transparent to-fuchsia-950/10 py-16 md:py-24"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <GlowOrbs />
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Automatisez 80% du travail. Gardez 100% du contrôle.
          </h2>
          <p className="mt-3 text-white/70">
            Rejoignez la beta privée : minutes offertes, templates de base et
            publication 1‑clic.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Merci ! Nous vous écrirons très vite.");
            }}
          >
            <input
              type="email"
              required
              placeholder="votre@email.com"
              className="w-full flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none ring-0 placeholder:text-white/40 focus:border-fuchsia-400/50"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-fuchsia-400 px-5 py-3 font-semibold text-slate-900 hover:brightness-95 sm:w-auto"
            >
              Obtenir un accès
            </button>
          </form>
          <p className="mt-2 text-xs text-white/50">
            Pas de spam. Annulation en un clic.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-10 text-sm text-white/60">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900">
                <Icon name="spark" className="h-4 w-4" />
              </div>
              <span className="font-semibold">Reelgen</span>
            </div>
            <p className="mt-3 max-w-xs text-white/60">
              Le SaaS qui convertit vos vidéos longues en shorts prêts à
              publier, avec votre branding.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white/90">Produit</div>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#features" className="hover:text-white">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white">
                  Workflow
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white/90">Ressources</div>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="hover:text-white" href="#">
                  Docs API (bientôt)
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#">
                  Roadmap
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#">
                  Sécurité
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white/90">Entreprise</div>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="hover:text-white" href="#">
                  À propos
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#">
                  Contact
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#">
                  Statut
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs">
            © {new Date().getFullYear()} Reelgen. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hover:text-white">
              Confidentialité
            </a>
            <a href="#" className="hover:text-white">
              Conditions
            </a>
            <a href="#" className="hover:text-white">
              RGPD
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
