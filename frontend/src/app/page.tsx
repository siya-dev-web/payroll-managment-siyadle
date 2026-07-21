"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { APP_NAME, HERO_IMAGE } from "@/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAuthStore } from "@/store/authStore";

const features = [
  {
    icon: "calculate",
    title: "Automated Calculations",
    description:
      "Eliminate manual errors with real-time automated tax and benefit deductions for every employee.",
  },
  {
    icon: "person",
    title: "Employee Self-Service",
    description:
      "Empower your team to access pay stubs, tax forms, and update personal info through a secure portal.",
  },
  {
    icon: "gavel",
    title: "Tax Compliance",
    description:
      "Stay ahead of ever-changing local and federal tax laws with our automated compliance engine.",
  },
  {
    icon: "analytics",
    title: "Detailed Reporting",
    description:
      "Generate comprehensive financial reports and export data seamlessly for your accounting software.",
  },
];

const testimonials = [
  {
    quote:
      "PayRoll Pro has reduced our administrative workload by 60%. The automation is flawless and the reporting is exactly what our finance team needed.",
    name: "Sarah Jenkins",
    role: "HR Director, TechFlow",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMqMob6vdNInANn-fTzGDdPK83y16VNO9lF-tpDYhaT2_LfQ8TR-mM2cisOwOa4MeBhkUnw2sFky-6mkEDgOGVI7ebnbXBhATNLmsCLvXiGCB6uXWnPLPWSNqBd0x2vcsi-CRzLTyX2OpUBMdbQYcGkSy0B7jOJH4gGLCg_42bsKeRwOGpzujFAzyhqhjYKLgMICpfxVxL0nVLRSvGeyga0b5HUTeswdkG2YPAPeC6_KoRzRz5ZcFjonpKRRws707hrKseHwaGuC0",
  },
  {
    quote:
      "Finally, a payroll system that doesn't feel like it was built in the 90s. The UI is intuitive and the self-service portal is a hit with our employees.",
    name: "David Chen",
    role: "CEO, Nexus Media",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4zDvZ4ayDcI557IjPe2WyBW0Db5zo6CkcGbR5EfbP7vGdLDhGBZo43do7yfP7Z85HsWjxsPr1MvX6o_zzCiLC9jnbIsTgpArGjqLL-vsO9Pm_SBEK5Yl9htCC02w6KgKf2_luhF23SKaPcyE0VTg7ufWtvIRXgfuz8-nH5v4QnhR_51zrj-FVxIZYgCYPk1037FUnj3K9YDhr4vlEPfyMPj3YNly_E_H4Ji61uHi-01k2besoosm7i3l9UeRORcTm11bjoGj9gMc",
  },
  {
    quote:
      "The tax compliance engine is a lifesaver. We operate in multiple states and PayRoll Pro handles all the complexity without any extra effort.",
    name: "Marcus Miller",
    role: "COO, Global Logistics",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdObxCpNsKYGHQc0UW4hMZahfpkRvV1QTk2wyPjatXLgfQ6yJNOnENAPxXabUdHZYZ4Hwgt9Yu7LSOdOoQCpLRhLKPkUUh1oSl6rNdra-1bqyfrLFkwd1pzJcREGf_v-dBKn4m3wuvAU9yWGd9sh7rR_GoxMZRFPFO-tdulLVKEfsBUvBYNPt2DErvX-QfGSTqclhnDpKdilplcClLOOrrGIWuKLGe7U0CzH_l-iH0CyTz6Njkdzp6h2A6yqgWM60sy2FekUESm0w",
  },
];

export default function LandingPage() {
  const [navShadow, setNavShadow] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const handleScroll = () => setNavShadow(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-x-hidden">
      <nav className={`landing-navbar sticky top-0 z-50 ${navShadow ? "shadow-sm" : ""}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-[#2563eb]">
            {APP_NAME}
          </Link>
          <div className="hidden md:flex items-center gap-2 mx-auto">
            {["#features", "#stats", "#testimonials"].map((href) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className="px-3 py-2 font-medium text-[#1e293b] hover:text-[#2563eb] transition-colors"
              >
                {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
              </a>
            ))}
          </div>

          {/* Navbar buttons — change based on login state */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="hidden md:block text-sm font-medium text-[#64748b] mr-1">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-[#2563eb] rounded-[10px] hover:bg-[#1d4ed8] hover:-translate-y-px transition-all shadow-md"
                >
                  <MaterialIcon icon="dashboard" className="text-[18px]" />
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3 font-semibold text-[#1e293b] bg-white border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 font-semibold text-white bg-[#2563eb] rounded-[10px] hover:bg-[#1d4ed8] hover:-translate-y-px transition-all shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
                Streamline Your <span className="text-[#2563eb]">Payroll</span> Management
              </h1>
              <p className="text-lg text-[#64748b] mb-10 max-w-lg">
                The enterprise-grade solution for modern HR teams. Automate tax compliance, manage
                employee payments, and gain actionable financial insights in one unified dashboard.
              </p>
              <div className="flex gap-3">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-8 py-4 font-semibold text-white bg-[#2563eb] rounded-[10px] hover:bg-[#1d4ed8] transition-all"
                  >
                    <MaterialIcon icon="dashboard" className="text-[18px]" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="px-8 py-4 font-semibold text-white bg-[#2563eb] rounded-[10px] hover:bg-[#1d4ed8] transition-all"
                  >
                    Get Started Now
                  </Link>
                )}
                <button className="px-8 py-4 font-semibold text-[#1e293b] bg-white border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-all">
                  View Demo
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 text-center">
              <div className="rounded-2xl overflow-hidden shadow-lg border bg-white">
                <Image
                  src={HERO_IMAGE}
                  alt="Payroll management dashboard visualization"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-[#e2e8f0]" id="stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10k+", label: "Companies" },
              { number: "99.9%", label: "Accuracy" },
              { number: "24/7", label: "Support" },
              { number: "$1B+", label: "Processed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8">
                <span className="text-4xl font-extrabold text-[#2563eb] block">{stat.number}</span>
                <span className="text-[#64748b] font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Growth</h2>
            <p className="text-[#64748b] max-w-xl mx-auto">
              Everything you need to handle complex payroll operations without the manual overhead
              or compliance risks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center mb-6">
                  <MaterialIcon icon={f.icon} />
                </div>
                <h4 className="text-lg font-semibold mb-2">{f.title}</h4>
                <p className="text-[#64748b] text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by HR Leaders</h2>
            <p className="text-[#64748b] max-w-xl mx-auto">
              Join thousands of specialists who have transformed their administrative workflows with{" "}
              {APP_NAME}.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-[#e2e8f0] rounded-xl p-8">
                <p className="mb-6 font-medium">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover mr-4"
                  />
                  <div>
                    <h6 className="font-semibold">{t.name}</h6>
                    <small className="text-[#64748b]">{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="landing-cta-dark">
            <h2 className="text-4xl font-bold mb-6">Ready to simplify your payroll?</h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Start your 30-day free trial today. No credit card required. Cancel anytime.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-10 py-4 font-semibold text-white bg-[#2563eb] rounded-[10px] hover:bg-[#1d4ed8] transition-all"
                >
                  <MaterialIcon icon="dashboard" className="text-[18px]" />
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="px-10 py-4 font-semibold text-white bg-[#2563eb] rounded-[10px] hover:bg-[#1d4ed8] transition-all"
                >
                  Start Free Trial
                </Link>
              )}
              <button className="px-10 py-4 font-semibold text-white border border-white/30 rounded-[10px] hover:bg-white/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#e2e8f0] py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-extrabold text-[#2563eb] block mb-4">
                {APP_NAME}
              </Link>
              <p className="text-[#64748b] pr-8">
                Empowering enterprises with intelligent payroll automation and human-centric HR
                tools since 2018.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Security", "Integrations", "Enterprise"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
              {
                title: "Resources",
                links: ["Help Center", "Documentation", "Community", "Status"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h6 className="font-bold mb-4">{col.title}</h6>
                {col.links.map((link) => (
                  <a key={link} href="#" className="landing-footer-link">
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t pt-6 text-center">
            <p className="text-[#64748b] text-sm">
              © 2024 {APP_NAME}. All rights reserved. Precision in every payment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
