// Helper functions to generate images and coordinates for properties

export const imageSets = [
  ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop"],
  ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1565402170291-8491f14678db?w=800&h=600&fit=crop"],
];

export const neighborhoodCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Centro": { lat: -23.5505, lng: -46.6333 },
  "Bela Vista": { lat: -23.5547, lng: -46.6394 },
  "Jardim Europa": { lat: -23.5847, lng: -46.6735 },
  "Vila Madalena": { lat: -23.5449, lng: -46.6889 },
  "Perdizes": { lat: -23.5372, lng: -46.6726 },
  "Jardins": { lat: -23.5698, lng: -46.6615 },
  "Pinheiros": { lat: -23.5614, lng: -46.6821 },
  "Moema": { lat: -23.6005, lng: -46.6653 },
  "Itaim Bibi": { lat: -23.5859, lng: -46.6849 },
  "Brooklin": { lat: -23.6080, lng: -46.6965 },
  "Vila Olímpia": { lat: -23.5959, lng: -46.6868 },
  "Riviera": { lat: -23.7781, lng: -45.8534 },
  "Higienópolis": { lat: -23.5435, lng: -46.6535 },
  "Morumbi": { lat: -23.6134, lng: -46.7037 },
  "Campo Belo": { lat: -23.6193, lng: -46.6718 },
  "Ipiranga": { lat: -23.5865, lng: -46.6103 },
  "Tatuapé": { lat: -23.5401, lng: -46.5738 },
  "Penha": { lat: -23.5279, lng: -46.5411 },
  "Saúde": { lat: -23.6164, lng: -46.6387 },
  "Vila Prudente": { lat: -23.5916, lng: -46.5811 },
  "Alto da Lapa": { lat: -23.5186, lng: -46.7046 },
  "Butantã": { lat: -23.5708, lng: -46.7201 },
  "Granja Viana": { lat: -23.6033, lng: -46.8484 },
  "Santana": { lat: -23.5018, lng: -46.6291 },
  "Vila Carrão": { lat: -23.5563, lng: -46.5469 },
  "Alphaville": { lat: -23.4942, lng: -46.8518 },
  "Panamby": { lat: -23.6298, lng: -46.7098 },
  "Tamboré": { lat: -23.4736, lng: -46.8326 },
  "Cidade Jardim": { lat: -23.5892, lng: -46.6976 },
  "Aldeia da Serra": { lat: -23.5132, lng: -46.6043 },
  "Liberdade": { lat: -23.5594, lng: -46.6329 },
  "Berrini": { lat: -23.6126, lng: -46.6991 },
  "Vila Nova Conceição": { lat: -23.5935, lng: -46.6753 },
  "Centro Histórico": { lat: -23.5489, lng: -46.6388 },
  "São Miguel": { lat: -23.4978, lng: -46.4436 },
  "Interlagos": { lat: -23.6799, lng: -46.6745 },
  "Aricanduva": { lat: -23.5686, lng: -46.5172 },
  "Jabaquara": { lat: -23.6444, lng: -46.6458 },
  "Vila Mariana": { lat: -23.5880, lng: -46.6390 },
  "Osasco": { lat: -23.5324, lng: -46.7916 },
  "Guarulhos": { lat: -23.4629, lng: -46.5339 },
  "Santo André": { lat: -23.6636, lng: -46.5339 },
  "São Bernardo": { lat: -23.6914, lng: -46.5650 },
  "Diadema": { lat: -23.6860, lng: -46.6226 },
  "Mauá": { lat: -23.6678, lng: -46.4613 },
  "Carapicuíba": { lat: -23.5222, lng: -46.8356 },
  "Cotia": { lat: -23.6039, lng: -46.9189 },
  "Avenida Paulista": { lat: -23.5618, lng: -46.6564 },
};

export function getImagesForProperty(id: number, currentImage: string): string[] {
  const imageSetIndex = (id - 1) % imageSets.length;
  const images = imageSets[imageSetIndex];
  return [currentImage, ...images.filter(img => img !== currentImage)].slice(0, 3);
}

export function getCoordinatesForNeighborhood(neighborhood: string): { lat: number; lng: number } {
  return neighborhoodCoordinates[neighborhood] || { lat: -23.5505, lng: -46.6333 };
}
