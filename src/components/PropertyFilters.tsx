import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PropertyFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  bedrooms: number;
  setBedrooms: (bedrooms: number) => void;
  bathrooms: number;
  setBathrooms: (bathrooms: number) => void;
  minArea: number;
  setMinArea: (area: number) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
  isGatedCommunity: string;
  setIsGatedCommunity: (value: string) => void;
  neighborhood: string;
  setNeighborhood: (value: string) => void;
  availableNeighborhoods: string[];
}

export const PropertyFilters = ({
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  minArea,
  setMinArea,
  transactionType,
  setTransactionType,
  isGatedCommunity,
  setIsGatedCommunity,
  neighborhood,
  setNeighborhood,
  availableNeighborhoods,
}: PropertyFiltersProps) => {
  const types = ["Todos", "Casa", "Apartamento"];
  const transactionTypes = ["Todos", "Venda", "Aluguel"];
  const gatedOptions = ["Todos", "Sim", "Não"];

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-card space-y-6 border border-border">
      <div>
        <h3 className="font-semibold mb-4 text-foreground">Comprar ou Alugar</h3>
        <div className="flex flex-wrap gap-3">
          {transactionTypes.map((type) => (
            <Button
              key={type}
              variant={transactionType === type ? "default" : "outline"}
              onClick={() => setTransactionType(type)}
              className="transition-all"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Tipo de Imóvel</h3>
        <div className="flex flex-wrap gap-3">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className="transition-all"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Condomínio Fechado</h3>
        <div className="flex flex-wrap gap-3">
          {gatedOptions.map((option) => (
            <Button
              key={option}
              variant={isGatedCommunity === option ? "default" : "outline"}
              onClick={() => setIsGatedCommunity(option)}
              className="transition-all"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Bairro</h3>
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos os Bairros</option>
          {availableNeighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Faixa de Valor</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={200000}
            max={2500000}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Quartos (mínimo)</h3>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              variant={bedrooms === num ? "default" : "outline"}
              onClick={() => setBedrooms(num)}
              size="sm"
              className="flex-1"
            >
              {num === 0 ? "Todos" : num === 5 ? "5+" : num}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Banheiros (mínimo)</h3>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((num) => (
            <Button
              key={num}
              variant={bathrooms === num ? "default" : "outline"}
              onClick={() => setBathrooms(num)}
              size="sm"
              className="flex-1"
            >
              {num === 0 ? "Todos" : num === 4 ? "4+" : num}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">Área Mínima (m²)</h3>
        <div className="flex gap-2 flex-wrap">
          {[0, 50, 100, 150, 200, 300].map((area) => (
            <Button
              key={area}
              variant={minArea === area ? "default" : "outline"}
              onClick={() => setMinArea(area)}
              size="sm"
            >
              {area === 0 ? "Todos" : `${area}m²+`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
