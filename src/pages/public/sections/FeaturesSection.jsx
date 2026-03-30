import {
  Award,
  ClipboardList,
  Compass,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Users,
} from "lucide-react";
import Card from "../../../components/ui/Card";

const features = [
  {
    title: "Centralized listings",
    copy: "Browse verified competition details, deadlines, organizers, and formats from one public directory.",
    Icon: Search,
  },
  {
    title: "Skill-matched teams",
    copy: "Discover teams and recruiting needs based on the disciplines students actually bring to the table.",
    Icon: Users,
    highlighted: true,
  },
  {
    title: "Digital profiles",
    copy: "Keep portfolios, interests, and role-ready student details in one reusable account profile.",
    Icon: Award,
  },
  {
    title: "Search tools",
    copy: "Filter competitions and teams by mode, discipline, requirements, and status before you commit.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Request tracking",
    copy: "Competitors track applications while team leaders review incoming requests in the same platform.",
    Icon: ClipboardList,
  },
  {
    title: "Role switching",
    copy: "Choose a starting role during auth, then switch between competitor and team leader without logging out.",
    Icon: RefreshCw,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-24 lg:py-40 xl:py-48"
    >
      <div className="landing-grid-overlay pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-[1920px]">
        <header className="mb-16 text-center sm:mb-20 lg:mb-24 xl:mb-32">
          <h2 className="landing-display text-[clamp(3rem,11vw,7rem)] font-black uppercase text-(--landing-text)">
            KEY <span className="text-(--landing-gold)">FEATURES</span>
          </h2>
          <div className="mx-auto mt-6 h-1.5 w-20 bg-(--landing-gold) sm:mt-8 sm:h-2 sm:w-28" />
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {features.map(({ title, copy, Icon }) => (
            <Card
              key={title}
              className={[
                "group rounded-[22px] border bg-[#23262d] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all duration-300 sm:p-6 xl:p-7",
                "border-[rgba(77,70,50,0.38)] hover:border-(--landing-gold)",
              ].join(" ")}
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(250,204,21,0.12)] transition-colors duration-300 sm:h-12 sm:w-12">
                <Icon
                  className="h-5 w-5 text-(--landing-gold) sm:h-6 sm:w-6"
                  aria-hidden="true"
                  strokeWidth={2.1}
                />
              </div>
              <h3 className="max-w-54 text-[1.46rem] leading-[1.02] font-extrabold tracking-[-0.04em] text-(--landing-text) sm:text-[1.68rem]">
                {title}
              </h3>
              <p className="mt-4 max-w-70 text-[0.98rem] leading-7 tracking-[-0.01em] text-(--landing-text) sm:text-[1rem] sm:leading-8">
                {copy}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
