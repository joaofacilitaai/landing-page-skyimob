import { Property } from "@/data/properties";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, CheckCircle2, Building2 } from "lucide-react";

interface PropertyDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onInterest: (property: Property) => void;
}

export const PropertyDetails = ({ isOpen, onClose, property, onInterest }: PropertyDetailsProps) => {
  if (!property) return null;

  const handleInterest = () => {
    onInterest(property);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-80 rounded-lg overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-gradient-gold px-4 py-2 rounded-full shadow-elegant">
              <div className="flex flex-col items-end">
                <span className="text-xs text-secondary-foreground/80 line-through">{property.oldPriceLabel}</span>
                <span className="font-bold text-lg text-secondary-foreground">{property.priceLabel}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-muted-foreground gap-2">
            <MapPin size={20} />
            <span className="text-lg">{property.location}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-6 text-foreground">
            <div className="flex items-center gap-2">
              <Bed size={22} className="text-gold" />
              <span className="font-medium">{property.bedrooms} Quartos</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={22} className="text-gold" />
              <span className="font-medium">{property.bathrooms} Banheiros</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize size={22} className="text-gold" />
              <span className="font-medium">{property.area}m²</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-display text-xl mb-2">Sobre o Imóvel</h3>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-display text-xl mb-3">Características do Imóvel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-gold mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Condo Features & Fee */}
          {property.isGatedCommunity && property.condoFeatures && property.condoFeatures.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={24} className="text-gold" />
                <h3 className="font-display text-xl">Características do Condomínio</h3>
              </div>
              
              {property.condoFee && (
                <div className="mb-3 p-4 bg-gradient-gold rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-foreground/80 font-medium">Valor do Condomínio</span>
                    <span className="text-lg font-bold text-secondary-foreground">
                      R$ {property.condoFee.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {property.condoFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-gold mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            variant="gold"
            size="lg"
            className="w-full text-lg"
            onClick={handleInterest}
          >
            Quero Saber Mais Sobre Este Imóvel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
