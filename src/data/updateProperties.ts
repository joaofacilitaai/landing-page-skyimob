// Script para atualizar propriedades com novos campos
export const neighborhoodMapping: { [key: string]: string } = {
  "Centro, São Paulo": "Centro",
  "Bela Vista": "Bela Vista",
  "Jardim Europa": "Jardim Europa",
  "Vila Madalena": "Vila Madalena",
  "Perdizes": "Perdizes",
  "Jardins": "Jardins",
  "Pinheiros": "Pinheiros",
  "Moema": "Moema",
  "Itaim Bibi": "Itaim Bibi",
  "Brooklin": "Brooklin",
  "Vila Olímpia": "Vila Olímpia",
  "Riviera": "Riviera",
  "Higienópolis": "Higienópolis",
  "Morumbi": "Morumbi",
  "Campo Belo": "Campo Belo",
  "Ipiranga": "Ipiranga",
  "Tatuapé": "Tatuapé",
  "Penha": "Penha",
  "Saúde": "Saúde",
  "Vila Prudente": "Vila Prudente",
  "Alto da Lapa": "Alto da Lapa",
  "Butantã": "Butantã",
  "Granja Viana": "Granja Viana",
  "Santana": "Santana",
  "Vila Carrão": "Vila Carrão",
  "Alphaville": "Alphaville",
  "Panamby": "Panamby",
  "Tamboré": "Tamboré",
  "Cidade Jardim": "Cidade Jardim",
  "Aldeia da Serra": "Aldeia da Serra",
  "Liberdade": "Liberdade",
  "Berrini": "Berrini",
  "Vila Nova Conceição": "Vila Nova Conceição",
  "Centro Histórico": "Centro Histórico",
  "São Miguel": "São Miguel",
  "Interlagos": "Interlagos",
  "Aricanduva": "Aricanduva",
  "Jabaquara": "Jabaquara",
  "Vila Mariana": "Vila Mariana",
  "Osasco": "Osasco",
  "Guarulhos": "Guarulhos",
  "Santo André": "Santo André",
  "São Bernardo": "São Bernardo",
  "Diadema": "Diadema",
  "Mauá": "Mauá",
  "Carapicuíba": "Carapicuíba",
  "Cotia": "Cotia",
  "Avenida Paulista": "Avenida Paulista"
};

export function extractNeighborhood(location: string): string {
  const parts = location.split(',');
  return parts[0].trim();
}

export function getTransactionType(id: number): "Venda" | "Aluguel" {
  // 80% vendas, 20% aluguéis
  return id % 5 === 0 ? "Aluguel" : "Venda";
}

export function isGatedCommunity(title: string, id: number): boolean {
  const gatedKeywords = ["condomínio fechado", "condomínio", "alphaville", "granja viana", "tamboré"];
  const titleLower = title.toLowerCase();
  return gatedKeywords.some(keyword => titleLower.includes(keyword)) || (id > 15 && id % 4 === 0);
}

export function getCondoFeatures(id: number): string[] | undefined {
  const featureSets = [
    ["Portaria 24h", "Área de lazer completa", "Piscina", "Academia"],
    ["Segurança 24h", "Salão de festas", "Playground", "Quadra poliesportiva"],
    ["Portaria 24h", "Academia", "Churrasqueira", "Salão de jogos"],
    ["Segurança", "Piscina aquecida", "Spa", "Espaço gourmet"],
    ["Vigilância 24h", "Campo de futebol", "Piscina", "Salão de festas", "Academia"],
  ];
  return featureSets[id % featureSets.length];
}

export function getCondoFee(price: number, id: number): number | undefined {
  // Taxa de condomínio varia entre 0.1% e 0.3% do valor do imóvel
  const baseRate = 0.002;
  const variation = (id % 5) * 0.0002;
  return Math.round(price * (baseRate + variation));
}
