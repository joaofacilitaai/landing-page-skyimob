import { useParams, useNavigate } from "react-router-dom";
import { properties } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, CheckCircle2, ArrowLeft, Phone, Building2 } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageLightbox } from "@/components/ImageLightbox";

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const property = properties.find(p => p.id.toString() === id);

  // Scroll to top when page loads or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4 text-foreground">Imóvel não encontrado</h1>
          <Button variant="gold" onClick={() => navigate("/")}>
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  const handleInterest = () => {
    setIsFormOpen(true);
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const propertyImages = property?.images || [property?.image || ""];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Voltar</span>
            </Button>
            <h1 className="font-display text-base sm:text-xl md:text-2xl text-foreground">SkyImob</h1>
            <Button 
              variant="gold" 
              onClick={handleInterest} 
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <Phone size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Interesse</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {propertyImages.map((img, index) => (
              <CarouselItem key={index}>
                <div 
                  className="relative h-[400px] sm:h-[500px] md:h-[600px] cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={img}
                    alt={`${property.title} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20">
                    <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-medium text-foreground">Clique para ampliar</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {propertyImages.length > 1 && (
            <>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </>
          )}
        </Carousel>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 pointer-events-none">
          <div className="container mx-auto">
            <div className="inline-block bg-gradient-gold px-3 py-2 sm:px-6 sm:py-3 rounded-full shadow-gold mb-2 sm:mb-4">
              <div className="flex flex-col items-start">
                <span className="text-xs sm:text-sm text-secondary-foreground/80 line-through">{property.oldPriceLabel}</span>
                <span className="font-bold text-lg sm:text-2xl text-secondary-foreground">{property.priceLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title & Location */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              {property.title}
            </h1>
            <div className="flex items-center text-muted-foreground gap-2 text-base sm:text-lg">
              <MapPin size={20} className="text-gold flex-shrink-0 sm:w-6 sm:h-6" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 p-4 sm:p-6 bg-card rounded-lg border border-border shadow-elegant">
            <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
              <Bed size={24} className="text-gold sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <div>
                <p className="font-bold text-lg sm:text-xl md:text-2xl text-foreground">{property.bedrooms}</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">Quartos</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
              <Bath size={24} className="text-gold sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <div>
                <p className="font-bold text-lg sm:text-xl md:text-2xl text-foreground">{property.bathrooms}</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">Banheiros</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
              <Maximize size={24} className="text-gold sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <div>
                <p className="font-bold text-lg sm:text-xl md:text-2xl text-foreground">{property.area}m²</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">Área Total</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">Sobre o Imóvel</h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">Características do Imóvel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-lg border border-border">
                  <CheckCircle2 size={20} className="text-gold mt-0.5 sm:mt-1 flex-shrink-0 sm:w-6 sm:h-6" />
                  <span className="text-muted-foreground text-sm sm:text-base md:text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Condo Features & Fee */}
          {property.isGatedCommunity && property.condoFeatures && property.condoFeatures.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Building2 size={28} className="text-gold" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Características do Condomínio</h2>
              </div>
              
              {property.condoFee && (
                <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-gold rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-secondary-foreground/80 font-medium">Valor do Condomínio</span>
                    <span className="text-xl sm:text-2xl font-bold text-secondary-foreground">
                      R$ {property.condoFee.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {property.condoFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-lg border border-border">
                    <CheckCircle2 size={20} className="text-gold mt-0.5 sm:mt-1 flex-shrink-0 sm:w-6 sm:h-6" />
                    <span className="text-muted-foreground text-sm sm:text-base md:text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          {property.coordinates && (
            <div className="mb-8 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">Localização</h2>
              <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <MapPin size={20} className="text-primary flex-shrink-0 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  <p className="text-sm sm:text-base md:text-lg text-foreground font-medium">{property.location}</p>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.coordinates.lat},${property.coordinates.lng}&zoom=15`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-gold p-6 sm:p-8 rounded-2xl shadow-gold text-center">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-secondary-foreground">
              Interessado neste imóvel?
            </h3>
            <p className="text-secondary-foreground/90 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
              Entre em contato com um consultor exclusivo do Festival de Imóveis Sky
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleInterest}
              className="text-sm sm:text-base md:text-lg bg-background hover:bg-background/90 text-foreground border-background w-full sm:w-auto"
            >
              Quero Saber Mais Sobre Este Imóvel
            </Button>
          </div>
        </div>
      </div>

      <LeadForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        property={property} 
      />

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={propertyImages}
        initialIndex={lightboxIndex}
        propertyTitle={property.title}
      />
    </div>
  );
}
