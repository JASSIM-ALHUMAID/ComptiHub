import { ArrowLeft } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { routes } from '../../lib/constants/routes'

export default function AuthLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === routes.login

  if (isLoginPage) {
    return (
      <main className="landing-theme min-h-screen px-5 py-8 sm:px-8 lg:px-12 flex flex-col">
        <div className="w-full flex items-center justify-center">
          <Link
            to={routes.landing}
            className="landing-link-accent landing-wordmark inline-flex items-center gap-2 text-xl text-(--landing-gold) sm:text-2xl"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            COMPTIHUB
          </Link>
        </div>
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
          <section className="w-full max-w-6xl">
            <Outlet />
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="landing-theme min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center justify-center gap-8">
        <section className="w-full max-w-6xl text-(--landing-text) flex items-center justify-center mb-8">
          <Link
            to={routes.landing}
            className="landing-link-accent landing-wordmark inline-flex items-center gap-2 text-xl text-(--landing-gold) sm:text-2xl"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            COMPTIHUB
          </Link>
        </section>

        <section className="w-full max-w-6xl">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
