import { useState, useEffect } from "react";
import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  thumbnail_url?: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // NOTE: In a real production environment, you would fetch this token from your backend
  // to avoid exposing it, or use a public scraping method (not recommended).
  // For this demo, we'll simulate the API call and fallback to static data if it fails.
  const INSTAGRAM_TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN;

  useEffect(() => {
    async function fetchInstagramPosts() {
      if (!INSTAGRAM_TOKEN) {
        console.log("No Instagram token found, using fallback data.");
        setLoading(false);
        setError(true);
        return;
      }

      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${INSTAGRAM_TOKEN}&limit=4`
        );

        if (!response.ok) throw new Error("Failed to fetch Instagram posts");

        const data = await response.json();
        setPosts(data.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching Instagram posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchInstagramPosts();
  }, [INSTAGRAM_TOKEN]);

  // Fallback data (simulating recent posts)
  const fallbackPosts = [
    { id: "1", type: "image", label: "Reconhecimento Chambers 2025" },
    { id: "2", type: "image", label: "Artigo: Reforma Tributária" },
    { id: "3", type: "image", label: "Evento: Direito do Agronegócio" },
    { id: "4", type: "image", label: "Nova Sede em Mococa" }
  ];

  return (
    <section className="py-24 bg-muted/10 border-t border-border">
      <div className="container text-center">
        <div className="flex flex-col items-center mb-12">
          <Instagram className="h-10 w-10 text-primary mb-4" />
          <h2 className="text-4xl font-serif text-primary mb-4">@djair.rotta</h2>
          <p className="text-muted-foreground max-w-2xl">
            Acompanhe nosso dia a dia, atualizações jurídicas e novidades do escritório em nosso perfil oficial no Instagram.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))
          ) : error ? (
            // Fallback Static Grid
            fallbackPosts.map((post) => (
              <a 
                key={post.id} 
                href="https://instagram.com/djair.rotta" 
                target="_blank" 
                rel="noopener noreferrer"
                className="aspect-square bg-muted relative group overflow-hidden block border border-border"
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center z-10">
                  <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                </div>
                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-muted-foreground p-4">
                  <Instagram className="h-8 w-8 mb-2 opacity-20" />
                  <span className="text-xs font-bold uppercase tracking-wider opacity-50">{post.label}</span>
                </div>
              </a>
            ))
          ) : (
            // Live API Data
            posts.map((post) => (
              <a 
                key={post.id} 
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="aspect-square bg-black relative group overflow-hidden block"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center z-10">
                  <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6" />
                </div>
                <img 
                  src={post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url} 
                  alt={post.caption || "Instagram Post"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </a>
            ))
          )}
        </div>
        
        <a 
          href="https://instagram.com/djair.rotta" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
            Seguir no Instagram
          </Button>
        </a>
      </div>
    </section>
  );
}
