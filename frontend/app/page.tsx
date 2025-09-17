"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Lock, Zap, ArrowRight } from "lucide-react";

// Import your custom Lottie component
import LottieKeepLast from "@/components/landing page/LottieKeepLast";

// Import your animation files (ensure you've downloaded them to /public/lottie/)
import heroAnimation from "@/public/lottie/hero-animation.json";
import aiAnimation from "@/public/lottie/ai-animation.json";
import analyticsAnimation from "@/public/lottie/analytics-animation.json";

const Header = () => (
  <header className="sticky top-0 z-50 w-full bg-slate-950/50 backdrop-blur-lg">
    <div className="container mx-auto px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 7L12 12L22 7"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 12V22"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold text-white">GripInvest</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  </header>
);

// The features array uses the LottieKeepLast component with the correct prop
const features = [
  {
    icon: Zap,
    title: "AI-Powered Recommendations",
    description:
      "Our intelligent algorithms analyze market data and your personal risk profile to provide investment suggestions tailored just for you. Stop guessing, start growing.",
    graphic: <LottieKeepLast animationData={aiAnimation} />,
  },
  {
    icon: BarChart,
    title: "Advanced Portfolio Analytics",
    description:
      "Go beyond the numbers. Visualize your growth, understand your diversification, and track your performance against market benchmarks with our intuitive analytics dashboard.",
    graphic: <LottieKeepLast animationData={analyticsAnimation} />,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-slate-950 text-white">
      <Header />
      <main>
        {/* Asymmetrical Hero Section */}
        <section className="container mx-auto px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-300 text-transparent bg-clip-text">
              The Future of Investing is Here.
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              GripInvest combines cutting-edge AI with a user-friendly platform
              to help you build and manage a smarter portfolio.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-transform hover:scale-105"
            >
              Start Investing Now <ArrowRight size={20} />
            </Link>
          </motion.div>

          <motion.div
            className="w-full h-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <LottieKeepLast animationData={heroAnimation} />
          </motion.div>
        </section>

        {/* Alternating Feature Showcase */}
        <section className="bg-slate-900 py-24 sm:py-32">
          <div className="container mx-auto px-6 lg:px-8 space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="grid lg:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className={`lg:order-${index % 2 === 0 ? "1" : "2"}`}>
                  <div className="inline-flex items-center gap-3 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full mb-4">
                    <feature.icon className="text-blue-400" size={16} />
                    <h3 className="text-sm font-medium text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-lg">{feature.description}</p>
                </div>
                <div
                  className={`lg:order-${index % 2 === 0 ? "2" : "1"} h-80 w-80 mx-auto`}
                >
                  {feature.graphic}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Minimalist Final CTA Section */}
        <section className="container mx-auto px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Take Control of Your Financial Future.
            </h2>
            <p className="max-w-xl mx-auto text-gray-400 mb-8">
              Sign up in minutes. Start investing for a lifetime.
            </p>
            <Link
              href="/auth"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Up For Free
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
