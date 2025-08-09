"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Building2,
  Users,
  UserCheck,
  // TrendingUp,
  MessageSquare,
  FileCheck,
  // Shield,
  // Zap,
  BarChart3,
  ChevronDown,
  Sparkles,
  // Heart,
  Star,
  ArrowRight,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does Collaber work?",
      answer:
        "Collaber connects brands, influencers, and managers in one platform. Brands can discover creators, influencers can showcase their reach, and managers can handle multiple profiles. Everything from messaging to contracts happens in one place.",
    },
    {
      question: "Is it really free to get started?",
      answer:
        "Yes! Creating an account and basic features are completely free. We offer premium plans with advanced features like detailed analytics, priority support, and enhanced discovery tools.",
    },
    {
      question: "How do payments work?",
      answer:
        "We use secure smart contracts to handle payments. Funds are held safely until campaign milestones are met, protecting both brands and creators. Payments are processed automatically when terms are fulfilled.",
    },
    {
      question: "Can managers handle multiple influencers?",
      answer:
        "Managers can create and manage multiple influencer profiles, negotiate deals on their behalf, and keep everything organized in one dashboard.",
    },
    {
      question: "What kind of campaigns can I run?",
      answer:
        "From one-off sponsored posts to long-term brand ambassador programs, Collaber supports all types of collaborations. You can create custom contracts for any campaign type.",
    },
    {
      question: "How do you ensure quality collaborations?",
      answer:
        "We have a rating system, verified metrics, and smart matching algorithms. Plus, our community guidelines and dispute resolution system help maintain high standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 ">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex justify-between items-center ">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Collaber</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link href="/signup/role">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started ✨
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-400/30">
            🚀 The future of collaborations is here
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Collab made{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              simple
            </span>
            .
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-300 mb-4">
            For brands, influencers & managers. 💜
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            One place to find, connect, and grow together. No more endless
            emails or confusing spreadsheets!
          </p>
          <Link href="/signup/role">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg group"
            >
              Get Started{" "}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works - 3 Roles */}
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works ⚡
            </h2>
            <p className="text-xl text-gray-300">
              Three roles, one amazing platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Brands */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Brands 🏢
                </h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Discover the right creators
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Track campaign performance
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Build long-term partnerships
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Influencers */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-800/50 border-purple-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Influencers ⭐
                </h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Get sponsorships you love
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Showcase your reach & stats
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Manage deals easily</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Managers */}
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-800/50 border-green-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Managers 🎯
                </h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Handle influencer profiles
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Negotiate on their behalf
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Stay organized & updated
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section className="py-20 bg-black/20">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features 🔥
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to collaborate successfully
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30 group-hover:scale-110 transition-transform">
                <FileCheck className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Contracts
              </h3>
              <p className="text-gray-300 text-sm">
                Automated, secure contracts with built-in payment protection
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-400/30 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Analytics
              </h3>
              <p className="text-gray-300 text-sm">
                Real-time performance tracking and ROI measurement
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/30 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                DM System
              </h3>
              <p className="text-gray-300 text-sm">
                Professional messaging with file sharing and notifications
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-400/30 group-hover:scale-110 transition-transform">
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Rating System
              </h3>
              <p className="text-gray-300 text-sm">
                Build trust with verified reviews and reputation scores
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Creators & Brands */}
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Creators & Brands 🌟
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands who are already collaborating smarter
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                10K+
              </div>
              <p className="text-gray-300">Active Influencers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">2K+</div>
              <p className="text-gray-300">Partner Brands</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$2M+</div>
              <p className="text-gray-300">Paid to Creators</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <Quote className="h-8 w-8 text-purple-400 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 mb-4 italic">
                      &quot;Collaber transformed how I work with brands. The
                      contract system is so professional, and I&apos;ve tripled
                      my collaboration income!&quot;
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">SC</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Sarah Chen</p>
                        <p className="text-gray-400 text-sm">
                          Fashion Influencer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <Quote className="h-8 w-8 text-blue-400 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 mb-4 italic">
                      &quot;Finding the right influencers used to take weeks.
                      Now I can discover, connect, and launch campaigns in days.
                      Game changer!&quot;
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">MR</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          Mike Rodriguez
                        </p>
                        <p className="text-gray-400 text-sm">Brand Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Ready to Collab Smarter CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-screen-2xl mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Collab Smarter? 🎉
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join the platform that&apos;s revolutionizing brand-influencer
              partnerships. Start your journey today — it&apos;s free to get
              started!
            </p>

            {/* Three Role Options */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <Link href="/signup/role" className="group">
                <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Join as a Brand
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Find creators and launch campaigns
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/signup/role" className="group">
                <Card className="bg-gradient-to-br from-purple-900/50 to-pink-800/50 border-purple-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Join as an Influencer
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Get sponsored and grow your income
                    </p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/signup/role" className="group">
                <Card className="bg-gradient-to-br from-green-900/50 to-emerald-800/50 border-green-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                      <UserCheck className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Become a Manager
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Manage creators and partnerships
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <p className="text-gray-400 text-sm">
              No credit card required. Get started in under 2 minutes. ⏱️
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Got Questions? 🤷‍♀️
            </h2>
            <p className="text-xl text-gray-300">Frequently Asked Questions</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Collapsible
                key={index}
                open={openFaq === index}
                onOpenChange={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              >
                <CollapsibleTrigger asChild>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white text-left">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            openFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-2">
                    <CardContent className="p-6 pt-0">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Collaber</span>
              </div>
              <p className="text-gray-400">
                Making collaborations simple for brands, influencers, and
                managers. Built with 💜 for creators.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Collaber. All rights reserved. Made with lots of ☕
              and 💜
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
