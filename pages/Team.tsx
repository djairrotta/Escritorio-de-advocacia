import { Mail, Linkedin } from "lucide-react";
import SEO from "@/components/SEO";

export default function Team() {
  const team = [
    {
      name: "Djair Rota",
      role: "Sócio Fundador",
      areas: "Direito Civil e Empresarial",
      email: "djair@djairrota.com.br",
      image: "/images/lawyer-portrait.jpg"
    },
    {
      name: "Ana Pereira",
      role: "Sócia",
      areas: "Direito de Família e Sucessões",
      email: "ana.pereira@djairrota.com.br",
      image: null
    },
    {
      name: "Roberto Santos",
      role: "Associado Sênior",
      areas: "Direito Trabalhista",
      email: "roberto.santos@djairrota.com.br",
      image: null
    },
    {
      name: "Juliana Costa",
      role: "Associada",
      areas: "Direito Penal",
      email: "juliana.costa@djairrota.com.br",
      image: null
    },
    {
      name: "Marcos Oliveira",
      role: "Associado",
      areas: "Direito Tributário",
      email: "marcos.oliveira@djairrota.com.br",
      image: null
    },
    {
      name: "Fernanda Lima",
      role: "Consultora",
      areas: "Compliance",
      email: "fernanda.lima@djairrota.com.br",
      image: null
    }
  ];

  return (
    <div className="w-full bg-background text-foreground">
      <SEO 
        title="Nossa Equipe" 
        description="Conheça os advogados do escritório Djair Rota. Equipe multidisciplinar liderada pelo Dr. Djair Rota, pronta para oferecer as melhores soluções jurídicas."
        canonical="/equipe"
      />
      <section className="pt-32 pb-16 container">
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-8">Advogados</h1>
        <div className="h-px w-full bg-border mb-16" />
        <p className="text-2xl md:text-3xl font-light leading-relaxed text-foreground/80 max-w-4xl">
          Talentos que constroem nosso negócio. Desenvolvemos profissionais capazes de lidar com os desafios do mundo atual.
        </p>
      </section>

      <section className="pb-24 container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {team.map((member, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] bg-muted mb-6 overflow-hidden relative">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/20">
                    <span className="font-serif text-6xl">{member.name[0]}</span>
                  </div>
                )}
                
                {/* Overlay with actions on hover */}
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                  <a href={`mailto:${member.email}`} className="text-white hover:text-white/70 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm font-medium">Enviar E-mail</span>
                  </a>
                  <a href="#" className="text-white hover:text-white/70 flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif text-primary mb-1 group-hover:underline decoration-1 underline-offset-4">
                {member.name}
              </h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {member.role}
              </p>
              <p className="text-sm text-foreground/70">
                {member.areas}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
