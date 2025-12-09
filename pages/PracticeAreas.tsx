import { ArrowRight, Scale, Shield, Building2, Users, Landmark, Gavel, Briefcase, HardHat, Sprout } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function PracticeAreas() {
  const areas = [
    {
      icon: Scale,
      title: "Administrativo",
      desc: "Atuação em processos administrativos, licitações, contratos públicos e defesa de servidores. Focamos na garantia da legalidade e na defesa dos interesses de nossos clientes perante a administração pública."
    },
    {
      icon: Shield,
      title: "Segurança Pública",
      desc: "Assessoria jurídica especializada para agentes de segurança pública, atuando em processos disciplinares, promoções e defesa de direitos funcionais."
    },
    {
      icon: Building2,
      title: "Imobiliário",
      desc: "Assessoria completa em transações imobiliárias, regularização de imóveis, incorporações, locações e condomínios. Garantimos segurança jurídica em negócios imobiliários."
    },
    {
      icon: Users,
      title: "Consumidor",
      desc: "Defesa dos direitos nas relações de consumo, atuando tanto para consumidores quanto para fornecedores em ações de responsabilidade civil, revisão contratual e práticas abusivas."
    },
    {
      icon: Landmark,
      title: "Bancário",
      desc: "Revisão de contratos bancários, defesa em ações de busca e apreensão, negociação de dívidas e atuação contra juros abusivos e fraudes bancárias."
    },
    {
      icon: Gavel,
      title: "Cível",
      desc: "Ampla atuação em responsabilidade civil, contratos, obrigações, indenizações e resolução de conflitos de natureza civil em geral."
    },
    {
      icon: Briefcase,
      title: "Empresarial",
      desc: "Consultoria jurídica para empresas, abrangendo constituição societária, contratos mercantis, recuperação de crédito e planejamento estratégico jurídico."
    },
    {
      icon: HardHat,
      title: "Trabalhista Patronal",
      desc: "Defesa dos interesses de empresas em reclamações trabalhistas, consultoria preventiva, auditoria trabalhista e negociações sindicais."
    },
    {
      icon: Sprout,
      title: "Agro",
      desc: "Assessoria jurídica para o agronegócio, incluindo contratos agrários, regularização fundiária, crédito rural e questões ambientais ligadas ao setor."
    }
  ];

  return (
    <div className="w-full bg-background text-foreground">
      <SEO 
        title="Áreas de Atuação" 
        description="Especialistas em Direito Administrativo, Imobiliário, Consumidor, Bancário, Cível, Empresarial, Trabalhista e Agro. Soluções jurídicas completas em Mococa."
        canonical="/atuacao"
      />
      <section className="pt-32 pb-16 container">
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-8">Áreas de Atuação</h1>
        <div className="h-px w-full bg-border mb-16" />
        {/* Success Cases Banner */}
        <div className="relative w-full bg-primary text-primary-foreground p-12 md:p-16 overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
             <img src="/images/hero-bg.jpg" className="w-full h-full object-cover" alt="Background" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif mb-10 border-l-4 border-white/30 pl-6">Casos de Sucesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="space-y-3">
                 <div className="text-4xl font-light opacity-30">01</div>
                 <h3 className="text-xl font-bold">Limitação de Descontos</h3>
                 <p className="opacity-80 leading-relaxed">Garantia da dignidade humana para servidores públicos, obrigando prefeituras e estados a limitar descontos em folha de empréstimos e seguros.</p>
               </div>
               <div className="space-y-3">
                 <div className="text-4xl font-light opacity-30">02</div>
                 <h3 className="text-xl font-bold">Revisional Bancária</h3>
                 <p className="opacity-80 leading-relaxed">Redução expressiva de parcelas: até 40% em financiamentos de veículos e até 20% em prestações habitacionais através de revisão contratual.</p>
               </div>
               <div className="space-y-3">
                 <div className="text-4xl font-light opacity-30">03</div>
                 <h3 className="text-xl font-bold">Prorrogação de Crédito Rural</h3>
                 <p className="opacity-80 leading-relaxed">Conquista estratégica para o produtor rural: prorrogação da dívida por mais 365 dias mediante pagamento de apenas 1% do valor devido.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {areas.map((area, i) => (
            <div key={i} className="group cursor-default border-t border-border pt-6 hover:border-primary transition-colors duration-300">
              <div className="mb-4 text-primary/80 group-hover:text-primary transition-colors">
                <area.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-serif text-primary mb-3 group-hover:text-primary/80 transition-colors">
                {area.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {area.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-muted/30 p-12 text-center">
          <h3 className="text-2xl font-serif text-primary mb-4">Precisa de uma análise específica?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nossa equipe multidisciplinar está pronta para entender o seu caso e propor a melhor estratégia jurídica.
          </p>
          <Link href="/contato" className="inline-block bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
            Agendar Consulta
          </Link>
        </div>
      </section>
    </div>
  );
}
