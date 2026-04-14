import { FileText, Home, Trophy, User, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { routes } from "../../lib/constants/routes";

const navItems = [
  { label: "Home", ariaLabel: "Dashboard", to: routes.dashboard, icon: Home },
  {
    label: "Comps",
    ariaLabel: "Competitions",
    to: routes.competitions,
    icon: Trophy,
  },
  { label: "Teams", to: routes.teams, icon: Users },
  {
    label: "Apps",
    ariaLabel: "Applications",
    to: routes.applications,
    icon: FileText,
  },
  { label: "Profile", to: routes.profile, icon: User },
];

export default function MobileNav() {
  return (
    <nav
      className="admin-mobile-nav lg:hidden"
      style={{ "--ui-mobile-nav-columns": navItems.length }}
    >
      <div className="contents">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              aria-label={item.ariaLabel ?? item.label}
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)",
                  isActive
                    ? "bg-[rgba(250,204,21,0.98)] text-black! shadow-[0_16px_30px_rgba(250,204,21,0.16)]"
                    : "text-[rgba(209,198,171,0.78)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--admin-gold-soft)]",
                ].join(" ")
              }
            >
              <Icon aria-hidden="true" size={20} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
