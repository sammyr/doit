"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ArrowRight, CheckCircle, Clock, Users, Star } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Organisiere dein Leben,{" "}
            <span className="text-primary">erreiche deine Ziele</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            JustDoIt ist deine All-in-One Lösung für effektives Aufgabenmanagement.
            Plane, organisiere und erreiche mehr - jeden Tag.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Features entdecken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Alles was du brauchst
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Tracking</h3>
              <p className="text-gray-600">
                Behalte den Überblick über alle deine Aufgaben mit unserem
                intelligenten Tracking-System.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Zeitmanagement</h3>
              <p className="text-gray-600">
                Setze Deadlines und Prioritäten für optimale Zeiteinteilung und
                Produktivität.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Arbeite nahtlos mit deinem Team zusammen und teile Aufgaben
                effizient.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Wähle deinen Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Basic</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€0</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unbegrenzte Todos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic Prioritäten</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>1 Benutzer</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Kostenlos starten
              </Button>
            </Card>
            <Card className="p-6 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  Beliebt
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Pro</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€9</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Alles aus Basic</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Team Funktionen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Bis zu 5 Benutzer</span>
                </li>
              </ul>
              <Button className="w-full">Jetzt upgraden</Button>
            </Card>
            <Card className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€29</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Alles aus Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unbegrenzte Benutzer</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Premium Support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Kontaktiere uns
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Was unsere Nutzer sagen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "JustDoIt hat meine Art zu arbeiten komplett verändert. Ich bin
                  jetzt viel produktiver und organisierter."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="ml-3">
                    <p className="font-semibold">Max Mustermann</p>
                    <p className="text-sm text-gray-600">Freiberufler</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Bereit durchzustarten?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Melde dich jetzt an und steigere deine Produktivität noch heute.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
            >
              Kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
