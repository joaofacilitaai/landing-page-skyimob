import { useState } from "react";
import { properties, Property } from "@/data/properties";
import { PropertyCard } from "./PropertyCard";
import { PropertyFilters } from "./PropertyFilters";
import { LeadForm } from "./LeadForm";
import { PropertyDetails } from "./PropertyDetails";

export const PropertyGallery = () => {
  const [selectedType, setSelectedType] = useState("Todos");
  const [priceRange, setPriceRange] = useState<[number, number]>([200000, 2500000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [minArea, setMinArea] = useState(0);
  const [transactionType, setTransactionType] = useState("Todos");
  const [isGatedCommunity, setIsGatedCommunity] = useState("Todos");
  const [neighborhood, setNeighborhood] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const availableNeighborhoods = Array.from(new Set(properties.map(p => p.neighborhood))).sort();

  const filteredProperties = properties.filter((property) => {
    const typeMatch = selectedType === "Todos" || property.type === selectedType;
    const priceMatch = property.price >= priceRange[0] && property.price <= priceRange[1];
    const bedroomsMatch = bedrooms === 0 || property.bedrooms >= bedrooms;
    const bathroomsMatch = bathrooms === 0 || property.bathrooms >= bathrooms;
    const areaMatch = minArea === 0 || property.area >= minArea;
    const transactionMatch = transactionType === "Todos" || property.transactionType === transactionType;
    const gatedMatch = isGatedCommunity === "Todos" || 
      (isGatedCommunity === "Sim" && property.isGatedCommunity) ||
      (isGatedCommunity === "Não" && !property.isGatedCommunity);
    const neighborhoodMatch = !neighborhood || property.neighborhood === neighborhood;
    return typeMatch && priceMatch && bedroomsMatch && bathroomsMatch && areaMatch && transactionMatch && gatedMatch && neighborhoodMatch;
  });

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const handleInterest = (property: Property) => {
    setSelectedProperty(property);
    setIsFormOpen(true);
  };

  return (
    <section id="gallery-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Explore as 50 Oportunidades
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use os filtros para encontrar o imóvel perfeito para você
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-12">
          <PropertyFilters
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            minArea={minArea}
            setMinArea={setMinArea}
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            isGatedCommunity={isGatedCommunity}
            setIsGatedCommunity={setIsGatedCommunity}
            neighborhood={neighborhood}
            setNeighborhood={setNeighborhood}
            availableNeighborhoods={availableNeighborhoods}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{filteredProperties.length}</span> de 50 imóveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onInterest={handleViewDetails}
            />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
              <p className="text-muted-foreground mt-2">
                Tente ajustar os filtros para ver mais opções.
              </p>
            </div>
          )}
        </div>
      </div>

      <PropertyDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        property={selectedProperty}
        onInterest={handleInterest}
      />

      <LeadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        property={selectedProperty}
      />
    </section>
  );
};
