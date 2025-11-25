import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import festivalLogo from "@/assets/festival-logo.png";

export const HeroSection = () => {
  const scrollToGallery = () => {
    const gallerySection = document.getElementById("gallery-section");
    gallerySection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Festival Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={festivalLogo} 
              alt="Festival SkyImob 2.0" 
              className="w-64 md:w-96 h-auto drop-shadow-2xl animate-fade-in"
            />
          </div>
          
          <p className="text-2xl md:text-4xl font-bold text-primary-foreground uppercase tracking-wider">
            50 Oportunidades Únicas
          </p>
          <p className="text-xl md:text-2xl text-gold font-semibold">
            Para Você Encontrar Seu Lar
          </p>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Uma seleção premium de imóveis escolhidos a dedo. A sua chance de fazer um negócio extraordinário.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="gold" 
              size="lg"
              onClick={scrollToGallery}
              className="text-lg px-8 py-6 h-auto font-bold uppercase tracking-wide shadow-gold"
            >
              Ver as Oportunidades
              <ArrowDown className="ml-2 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-primary-foreground/60 animate-pulse">
          <span className="text-sm font-medium">Role para descobrir</span>
          <ArrowDown size={24} />
        </div>
      </div>
    </section>
  );
};
