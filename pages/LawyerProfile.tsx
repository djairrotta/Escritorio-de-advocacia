import { useParams, Link } from "wouter";
import { lawyers } from "@/data/lawyers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin, Award, BookOpen, Globe } from "lucide-react";
import { useEffect } from "react";
import SEO from "@/components/SEO";

export default function LawyerProfile() {
  const { id } = useParams();
  const lawyer = lawyers.find((l) => l.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!lawyer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-4xl font-serif text-primary mb-4">Advogado não encontrado</h1>
        <Link href="/equipe">
          <Button variant="outline">Voltar para Equipe</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <SEO 
        title={`${lawyer.name} - ${lawyer.role}`} 
        description={`Perfil profissional de ${lawyer.name}, ${lawyer.role} no escritório Djair Rota Advogados. Especialista em ${lawyer.specialties.join(", ")}.`}
        canonical={`/equipe/${lawyer.id}`}
        image={lawyer.image}
      />
      <div className="container">
        <Link href="/equipe" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Equipe
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar / Photo */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden mb-6 shadow-lg">
                <img 
                  src={lawyer.image} 
                  alt={lawyer.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <a 
                  href={`mailto:${lawyer.email}`} 
                  className="flex items-center justify-center w-full p-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm font-bold"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Entrar em Contato
                </a>
                
                {lawyer.linkedin && (
                  <a 
                    href={lawyer.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full p-3 border border-primary text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest text-sm font-bold"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-2">{lawyer.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{lawyer.role}</p>
              <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-sm">
                {lawyer.oab}
              </span>
            </div>

            <div className="prose prose-lg text-muted-foreground max-w-none">
              <h3 className="text-2xl font-serif text-primary mb-4">Biografia</h3>
              <p className="leading-relaxed">{lawyer.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center text-xl font-serif text-primary mb-4 border-b border-border pb-2">
                  <Award className="mr-2 h-5 w-5" />
                  Áreas de Atuação
                </h3>
                <ul className="space-y-2">
                  {lawyer.specialties.map((spec, i) => (
                    <li key={i} className="flex items-start text-muted-foreground">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center text-xl font-serif text-primary mb-4 border-b border-border pb-2">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Formação Acadêmica
                </h3>
                <ul className="space-y-2">
                  {lawyer.education.map((edu, i) => (
                    <li key={i} className="flex items-start text-muted-foreground">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="flex items-center text-xl font-serif text-primary mb-4 border-b border-border pb-2">
                <Globe className="mr-2 h-5 w-5" />
                Idiomas
              </h3>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-muted/50 text-muted-foreground text-sm rounded-full border border-border">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
