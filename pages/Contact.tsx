import { Button } from "@/components/ui/button";
import { trackEvent } from "@/components/GoogleAnalytics";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { MapView } from "@/components/Map";
import SEO from "@/components/SEO";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: ""
  });

  const formatPhone = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");
    
    // Limit to 11 digits
    const truncated = numbers.slice(0, 11);
    
    // Apply mask (XX) XXXXX-XXXX
    if (truncated.length <= 2) return truncated;
    if (truncated.length <= 7) return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === "whatsapp") {
      setFormData(prev => ({ ...prev, [id]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format message for WhatsApp
    const text = `*Novo Contato via Site*\n\n*Nome:* ${formData.name}\n*E-mail:* ${formData.email}\n*WhatsApp:* ${formData.whatsapp}\n*Assunto:* ${formData.subject}\n\n*Mensagem:*\n${formData.message}`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5519992130156&text=${encodedText}`;

    // Track the event
    trackEvent('form_submit', { 
      form_name: 'contact_form',
      method: 'whatsapp'
    });

    // Open WhatsApp in a new tab (or trigger app)
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Redirecionando para o WhatsApp...");
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        subject: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="w-full bg-background text-foreground">
      <SEO 
        title="Contato" 
        description="Entre em contato com o escritório Djair Rota Advogados em Mococa-SP. Agende sua consulta via WhatsApp, telefone ou e-mail."
        canonical="/contato"
      />
      <section className="pt-32 pb-16 container">
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-8">Contato</h1>
        <div className="h-px w-full bg-border mb-16" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Info Column */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Mococa</h3>
              <div className="w-full h-64 bg-muted mb-6 border border-border">
                <MapView 
                  className="w-full h-full"
                  onMapReady={(map) => {
                    const position = { lat: -21.4690056, lng: -47.0001567 };
                    map.setCenter(position);
                    map.setZoom(16);
                    new google.maps.Marker({
                      position: position,
                      map: map,
                      title: "Djair Rota Advogados"
                    });
                  }}
                />
              </div>
              <p className="text-xl font-serif text-primary leading-relaxed">
                Rua Coronel Diogo, 525<br />
                Mococa - SP<br />
                Brasil
              </p>
              <p className="mt-6 text-lg">
                <a href="https://wa.me/551936564903" target="_blank" rel="noopener noreferrer" className="hover:underline block" onClick={() => trackEvent('whatsapp_click', { location: 'contact_page_phone' })}>19 3656-4903</a>
                <a href="mailto:djair@djairrotta.com.br" className="hover:underline block mt-2">djair@djairrotta.com.br</a>
                <a href="https://instagram.com/djair.rotta" target="_blank" rel="noopener noreferrer" className="hover:underline block mt-2">@djair.rotta</a>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Trabalhe Conosco</h3>
              <p className="text-lg">
                <a href="mailto:djair@djairrotta.com.br" className="hover:underline">djair@djairrotta.com.br</a>
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-8">
            <div className="bg-muted/20 p-8 md:p-12">
              <h2 className="text-3xl font-serif text-primary mb-8">Envie uma mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nome</label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      className="bg-background border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">E-mail</label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      className="bg-background border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</label>
                    <Input 
                      id="whatsapp" 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required 
                      className="bg-background border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Assunto</label>
                    <Input 
                      id="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      className="bg-background border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mensagem</label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    className="min-h-[150px] bg-background border-0 border-b border-border rounded-none px-0 resize-none focus-visible:ring-0 focus-visible:border-primary transition-colors" 
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-sm font-bold uppercase tracking-widest rounded-none w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar via WhatsApp"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
