import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, Shield, Building2, Users, Landmark, Gavel, Briefcase, HardHat, Sprout, HeartPulse, Vote } from "lucide-react";
import { Link } from "wouter";
import InstagramFeed from "@/components/InstagramFeed";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SEO from "@/components/SEO";

export default function Home() {
  const areas = [
    { icon: Scale, title: "Administrativo" },
    { icon: Shield, title: "Segurança Pública" },
    { icon: Building2, title: "Imobiliário" },
    { icon: Users, title: "Consumidor" },
    { icon: Landmark, title: "Bancário" },
    { icon: Gavel, title: "Cível" },
    { icon: Briefcase, title: "Empresarial" },
    { icon: HardHat, title: "Trabalhista Patronal" },
    { icon: Sprout, title: "Agro" },
    { icon: HeartPulse, title: "Previdenciário" },
    { icon: Vote, title: "Eleitoral" }
  ];

  return (
    <div className="flex flex-col w-full bg-background text-foreground">
      <SEO 
        title="Advocacia Especializada em Mococa" 
        description="Escritório de advocacia em Mococa-SP liderado pelo Dr. Djair Rota. Especialistas em Direito Civil, Trabalhista, Empresarial, Família e Previdenciário. Agende sua consulta."
        canonical="/"
      />
      {/* Hero Section - Style of Pinheiro Neto: Dark background, serif text, minimal */}
      <section className="relative min-h-[85vh] w-full flex items-center bg-primary text-primary-foreground overflow-hidden">
        {/* Subtle Background Image/Texture */}
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
           {/* Using the previously generated image but darkening it significantly to match the reference style */}
          <img 
            src="/images/hero-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center min-h-[400px] text-center">
          <img 
            src="/images/logo-transparent.png" 
            alt="Djair Rota Advogados" 
            className="w-64 md:w-80 lg:w-96 h-auto object-contain mb-12 drop-shadow-2xl filter brightness-0 invert"
          />
          
          <a 
            href="https://wa.me/551936564903" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 text-lg font-bold px-8 py-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse hover:animate-none transition-all transform hover:scale-105"
            >
              QUERO UMA CONSULTA
            </Button>
          </a>
        </div>
      </section>

      {/* Practice Areas Section - Cards Grid */}
      <section className="py-24 border-b border-border bg-muted/10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="text-4xl font-serif text-primary">Atuação</h2>
            <p className="text-muted-foreground max-w-xl text-right mt-4 md:mt-0">
              Soluções jurídicas de nível militar disponíveis para todos os seus problemas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area, i) => (
              <div 
                key={i} 
                className="group bg-background p-8 border border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default flex flex-col items-center text-center"
              >
                <div className="mb-6 p-4 bg-primary/5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <area.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif text-primary mb-2">{area.title}</h3>
                <div className="w-8 h-0.5 bg-primary/20 group-hover:w-16 group-hover:bg-primary transition-all duration-300 mt-2" />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/atuacao" className="inline-flex items-center gap-3 text-lg font-medium text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all group">
              Saiba Mais
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-serif text-primary">Nossa Equipe</h2>
            <Link href="/equipe" className="text-sm font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Main Lawyer Highlight */}
            <div className="md:col-span-5 relative">
              <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                {/* Placeholder for Djair Rota's photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img 
                  src="/images/djair-rota.jpg" 
                  alt="Dr. Djair Rota" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                  <h3 className="text-3xl font-serif mb-1">Dr. Djair Rota</h3>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-80">Sócio Fundador</p>
                </div>
              </div>
            </div>

            {/* Team Grid & Description */}
            <div className="md:col-span-7 flex flex-col justify-between h-full">
              <div className="space-y-6 mb-12">
                <h3 className="text-3xl font-serif text-primary leading-tight">
                  Liderança experiente e compromisso inabalável com a justiça.
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Com décadas de experiência jurídica, o Dr. Djair Rota lidera uma equipe de advogados altamente qualificados, dedicados a oferecer soluções jurídicas estratégicas e personalizadas.
                </p>
              </div>

              {/* 6 Lawyers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "Dra. Ana Souza", role: "Cível", id: "ana-souza" },
                  { name: "Dr. Carlos Lima", role: "Trabalhista", id: "carlos-lima" },
                  { name: "Dra. Beatriz Silva", role: "Família", id: "beatriz-silva" },
                  { name: "Dr. Pedro Santos", role: "Criminal", id: "pedro-santos" },
                  { name: "Dra. Fernanda Oliveira", role: "Empresarial", id: "fernanda-oliveira" },
                  { name: "Dr. Lucas Pereira", role: "Tributário", id: "lucas-pereira" }
                ].map((lawyer, i) => (
                  <div key={i} className="group relative aspect-square bg-gray-100 overflow-hidden cursor-pointer">
                    <img 
                      src={`https://images.unsplash.com/photo-${
                        [
                          "1573496359142-b8d87734a5a2", // Ana
                          "1560250097-0b93528c311a", // Carlos
                          "1580489944761-15a19d654956", // Beatriz
                          "1519085360753-af0119f7cbe7", // Pedro
                          "1573497019940-1c28c88b4f3e", // Fernanda
                          "1472099645785-5658abf4ff4e"  // Lucas
                        ][i]
                      }?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                      alt={lawyer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-2 text-center">
                      <span className="font-bold text-sm">{lawyer.name}</span>
                      <span className="text-xs opacity-80">{lawyer.role}</span>
                      <Link href={`/equipe/${lawyer.id}`} className="mt-2 text-[10px] uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white">
                        Saiba mais
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Instagram Section */}
      <InstagramFeed />


    </div>
  );
}
