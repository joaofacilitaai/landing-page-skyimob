import { Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
  onInterest: (property: Property) => void;
}

export const PropertyCard = ({ property, onInterest }: PropertyCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = property.images || [property.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-premium transition-all duration-300 border border-border/50 cursor-pointer"
      onClick={() => navigate(`/imovel/${property.id}`)}
    >
      {/* Image */}
      <div className="relative h-52 sm:h-60 md:h-64 overflow-hidden group">
        {!imageError ? (
          <img
            src={images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground font-medium">{property.type}</p>
          </div>
        )}
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-lg"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-lg"
              aria-label="Próxima foto"
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${idx === currentImageIndex ? 'bg-gold' : 'bg-background/50'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 right-3 bg-gradient-gold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-gold">
          <div className="flex flex-col items-end">
            <span className="text-xs sm:text-xs text-secondary-foreground/80 line-through">{property.oldPriceLabel}</span>
            <span className="font-bold text-base sm:text-lg text-secondary-foreground">{property.priceLabel}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div>
          <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 text-foreground line-clamp-2 leading-tight">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground gap-1">
            <MapPin size={15} className="flex-shrink-0 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm line-clamp-1">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 text-muted-foreground text-sm">
          <div className="flex items-center gap-1.5">
            <Bed size={18} className="sm:w-[18px] sm:h-[18px]" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={18} className="sm:w-[18px] sm:h-[18px]" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize size={18} className="sm:w-[18px] sm:h-[18px]" />
            <span>{property.area}m²</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="gold"
          className="w-full text-sm sm:text-base py-5 sm:py-6 font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onInterest(property);
          }}
        >
          Tenho Interesse
        </Button>
      </div>
    </div>
  );
};
