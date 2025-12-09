import React from 'react';
import ReactMarkdown from 'react-markdown';
import SEO from "@/components/SEO";

interface LegalPageProps {
  content: string;
}

export default function LegalPage({ content }: LegalPageProps) {
  // Extract title from markdown content (first line usually)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Documento Legal";
  
  return (
    <div className="w-full bg-background text-foreground">
      <SEO 
        title={title} 
        description={`Documento legal: ${title} - Djair Rota Advogados.`}
        canonical={window.location.pathname}
      />
      <section className="pt-32 pb-16 container max-w-4xl mx-auto">
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif">
          <ReactMarkdown
            components={{
              h1: (props) => <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8 border-b border-primary/20 pb-4" {...props} />,
              h2: (props) => <h2 className="text-2xl md:text-3xl font-serif text-primary mt-12 mb-6" {...props} />,
              p: (props) => <p className="text-lg leading-relaxed text-muted-foreground mb-6 font-sans" {...props} />,
              ul: (props) => <ul className="list-disc pl-6 mb-6 space-y-2 font-sans text-muted-foreground" {...props} />,
              li: (props) => <li className="pl-2" {...props} />,
              strong: (props) => <strong className="font-bold text-primary" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </section>
    </div>
  );
}
