import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO";

export default function About() {
  return (
    <div className="w-full bg-background text-foreground">
      <SEO 
        title="Sobre o Escritório" 
        description="Conheça a história e os valores do escritório Djair Rota Advogados. Excelência técnica, integridade e compromisso com resultados em Mococa-SP."
        canonical="/sobre"
      />
      {/* Header Section - Minimalist Text Only */}
      <section className="pt-32 pb-16 container">
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-8">O Escritório</h1>
        <div className="h-px w-full bg-border mb-16" />
        <p className="text-2xl md:text-3xl font-light leading-relaxed text-foreground/80 max-w-4xl">
          Uma trajetória marcada pela excelência técnica, visão estratégica e compromisso inabalável com os resultados de nossos clientes.
        </p>
      </section>

      {/* Content Grid */}
      <section className="pb-24 container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Column - Image */}
          <div className="md:col-span-5">
            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
              <img 
                src="/images/meeting-room.jpg" 
                alt="Escritório Djair Rota" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Right Column - Text */}
          <div className="md:col-span-7 space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-primary mb-6">Nossa História</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Fundado com o propósito de oferecer uma advocacia de alto nível, o escritório <strong>Djair Rota Advogados</strong> consolidou-se como referência em soluções jurídicas complexas. Nossa atuação é pautada pela compreensão profunda dos negócios de nossos clientes e pela antecipação de cenários.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ao longo dos anos, expandimos nossa atuação para diversas áreas do direito, mantendo sempre a essência de um atendimento personalizado e a busca incessante pela excelência técnica que nos define desde o primeiro dia.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-serif text-primary mb-6">Valores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Excelência</h3>
                  <p className="text-muted-foreground">Rigor técnico e precisão em cada detalhe de nossa atuação.</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Integridade</h3>
                  <p className="text-muted-foreground">Ética e transparência como pilares inegociáveis de nossa conduta.</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Inovação</h3>
                  <p className="text-muted-foreground">Criatividade jurídica para resolver os desafios mais complexos.</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Compromisso</h3>
                  <p className="text-muted-foreground">Dedicação total aos objetivos e necessidades de nossos clientes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
