import { getImagesForProperty, getCoordinatesForNeighborhood } from "./propertyHelpers";

export interface Property {
  id: number;
  title: string;
  type: 'Casa' | 'Apartamento';
  price: number;
  priceLabel: string;
  oldPrice: number;
  oldPriceLabel: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  coordinates?: { lat: number; lng: number };
  transactionType: "Venda" | "Aluguel";
  neighborhood: string;
  isGatedCommunity: boolean;
  condoFeatures?: string[];
  condoFee?: number;
}

const getNeighborhood = (location: string) => location.split(',')[0].trim();
const getTransaction = (id: number): "Venda" | "Aluguel" => id % 5 === 0 ? "Aluguel" : "Venda";
const isGated = (title: string, id: number) => {
  const keywords = ["condomínio fechado", "condomínio", "alphaville", "granja", "tamboré"];
  return keywords.some(k => title.toLowerCase().includes(k)) || (id > 20 && id % 3 === 0);
};
const getCondoFee = (price: number, isGated: boolean) => isGated ? Math.round(price * 0.002) + (Math.random() * 500) : undefined;
const condoFeaturesSets = [
  ["Portaria 24h", "Piscina", "Academia", "Salão de festas"],
  ["Segurança 24h", "Quadra poliesportiva", "Playground", "Churrasqueira"],
  ["Portaria", "Spa", "Espaço gourmet", "Piscina aquecida"],
  ["Vigilância 24h", "Campo de futebol", "Salão de jogos", "Academia"],
];

// Mock data - 50 properties
const propertiesRaw: Property[] = [
  // Apartamentos - Até R$ 500k
  {
    id: 1,
    title: "Apartamento com 3 dormitórios à venda, 86 m² - Bosque da Saúde - Cuiabá/MT",
    type: "Apartamento",
    price: 435000,
    priceLabel: "R$ 435.000",
    oldPrice: 440000,
    oldPriceLabel: "R$ 440.000",
    location: "Bosque da Saúde, Cuiabá - MT",
    bedrooms: 3,
    bathrooms: 2,
    area: 86,
    image: "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2Vr8OlJ9hM5u8NCQpCjkAbb1YqIvsiLj12957bRu-aLyP3GDc7h1po8zbXBEg6zj5x8T80MOUxpS-AiRybNeYujP2oI-BSRnl7dSJ8dH3ZY2VoxgApSx1qSbZWq2285-x%2BcBfzItHCcfq73LgVwCvpHR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg",
    images: [
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2Vr8OlJ9hM5u8NCQpCjkAbb1YqIvsiLj12957bRu-aLyP3GDc7h1po8zbXBEg6zj5x8T80MOUxpS-AiRybNeYujP2oI-BSRnl7dSJ8dH3ZY2VoxgApSx1qSbZWq2285-x%2BcBfzItHCcfq73LgVwCvpHR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu01N7us37xI8yccbXKCQvQ%2BC5MC1ovrE8B68vZfWko-V6%2BLYWurZ9Kod26TfHHydjaNGZcMcC2lrWOdidEHAGqiGBk9e-2XSo3eWaINAfVdb4QQtyDV-7n62QbX1-A4XhHH-MdSA8QHdXZ-aHnBlQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2NK8fZRozNgy5USB76luRG92duXyuXJgFSn4s7apK7Y8PTVe8LB5oFk86GtLEC0j5AgftopNlxTS-JjXR-uUIO8ZFZ782LQlleVVKt9XGpy%2BQYeyREBwmT8QraVpmMvxXH0F92BpRWeEpveI0FZLLMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu01Ci89nvjVgo9gaR6Ky4jTdwpfJ4vq9gFSH4cnzooKDhf3GROXkktst8ILzCkOyv-dcXI06D0kkXftWWwLLeaStGSlbj3yvgmv0b-5ZG1QQ8iEvkipZwmm%2BV5uF%2BlwaxxCSK8mGpzaVc-vDUQ13GepHR9o47l9MqBG1U1ByqR9Q9JGypDLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu3pZlelMxkkYq80odYf7pgqg8KLI1few8niN55qTk7-Y5e-9B%2BaAl49v9fWrMRusmbd3G9cbMEoiVu9HfTHnAq6aH10JrxywoE-IV4xUbVJ5mj4yzRBX%2BXiARcCl6g839XCcM%2B-ZoTeuSbG7PH5TQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu31BiMMr7AkhsPY-R6XnoRau1JyW5euw-WeHpIj2oZbF6sDyXdvV8ow9j7TPCVSmuolde4E1MR5FZbUrSRLHRYSnDkENhyOhqFqXYaVGYUZM-w0DtCxvmnSlT6mGpng06yO-EeqA9BeTXofMO3Z4E7lHR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2tg4sNryTAFnugnDKWduROBhK%2BkvvWplhqf9LfriL6e6vTSTZrP05s-0fT2LGm%2BqoVla-I4axBbeM0neSG1UYGSZ2Bo-j6KmkbDRphLbkoE3xlpjSoOwwaLBsCo2WYciw%2B%2BUfPDjgOVY72%2BNlZ1QPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0ti1PZI6QwPyuFDBqGujXOYxI-J2ciXs3%2B8xJHagKjYx5-nfNyb-6oNwYirFQ6FnJR%2BdoUmHm9JauxZXjDgZNzaJXdO-RbS%2BUT3V7p8UXdI-C8ski19xES7AYWFznQ0wS6AF8z8gAqGXYPfL1JNSbMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu11-wdYz1A0TsvgAdq6QlQiLzrmvw%2BC6lRyZ0oztkrjJ6MXNW8HxzNk0j4CuLH%2BrqZ5IdOcebERBW85YQDqwTbe8PXgUk2SG-2v8ZuJlf3Ne4CMggUhTmnanA7GQzEUOyii-DNP5syDUU-7fGVN1QPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu3tK2YpnoxA7mf0-fYjuuhW44KS-9djcsm2J%2BYPt7vbW-OzWRer%2Bx4QN%2B6etKk6no%2Bs9fvYJKk1gR84rbwf4cJusGllepgvdl3nRbpVgHmtV2wJinglgwwG7cbeH-WMoxnv%2BG9KI%2Bh%2ByTY74HxlsLLMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1la94hwxC8Zz-MLWoS%2BjgrCgp3P7fLH8k2v-bHG743i5ZLcROPPkb021a2sKHyUuqR4bNl%2Ba2FgS8xFeUzEb9ekMldXjhjSplzUfYkYGGFp-DwqjwcV9njlbcj83mFh4X2XNcL3hTe2TJ3hUXZ1QPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2I%2B0eBT5i0OosoDB7m1n3Xa-6ie2s%2B8i1%2BR06Pckoney%2BKkUsHhyYUO%2BJb4EXCTr5RKav0kHWIpfu9LQDayboTaPFZQijahmXnLUpBLb2cP-z8puVJvx3SWVoDw0g4a5jqgJP7VkQuOTZzlB1xDQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtuxx8yNxj2kcEksMEeZaOhgW85avP7o2kj2KH5J7xkKHw7fzZUILFzNFv6IrEPHyg67Fga-Z4P2ZzRcJlYh7UYq2fO0RdpDqokXfDQYAWXFV1xSYWsjVN5Hy0Vr223HFghTyeJtjTsxmHQfq7LU5FMLMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu19L9MJL3iAen9cuf7OcoRjXxoKawu%2BkqWLL9rr5o7HFy9-WZ5-ljdti1Z-SN2yD9pE%2Bb84iEG1JObMiQxjVDrfbOVxK%2BGOHoADRHqpeaUEP2CsuswpZ9H%2BHDKmH3kdogh6KD7aAoSWmZaa5B3VgTbMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0Jj0o9U6Q4GseoDfYO5vyTb0qS739eng3uH0rPIuJ-9zPLIc8ib9d4F-IPEAE%2BP4793bP4AM0B5YcJERRzqY96EH1NupTCmhWfgdopif0dShxkulDAV3Va0Zqa17mcUxnD0UfnWoCuQFbi5MQZuCrMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtuxZtyupSwRkuu-AAfqO0hBDCxam-vY%2BbgBms2oL2ka392%2BLVQM3Z16cT35bRCF62ubVmaPktPRgmY%2BN%2BYhjBX7ylJlgJgzuAukLoX%2BR%2BeHJO8hk-zCt2mn69drir9mVgiiyjKvP88muyFYrIJgxDSbMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1Zd9ftUvzcdm9oIAeaXhg2p552GwumC-G2yz53PkO7p%2BPSgAOvX8dsF3bLjCEWK67BOaJkLGV50ZclGGA31BaGAA1do8zbRukXTE7dmfHtv4BxptDdh-12GXaGH6URo%2BHr%2BW%2B6Huy%2ByFvv0JENTIsRHR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg",
      "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu35k4uJA4w8HkukzWq%2BJgAq99K6O9u299m2m4c3yoonx5-r5Tffy854I8YnSE26n7r5pZuV8DlxLTM1VT0fQWImbHyFRhje%2BmGfLeLF-SVJ7g1gDjRlf-0abf5Sc-Fo9%2Bx6CFMjVjR%2BrdvnsH1xDQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg"
    ],
    description: "Apartamento à Venda no Bosque da Saúde – Villagio di Montalcino. 3 dormitórios (1 suíte), sala integrada, sacada, cozinha com planejados, área de serviço e 2 vagas cobertas. Condomínio com lazer completo e segurança 24h.",
    features: [
      "Área de serviço",
      "Armário banheiro",
      "Armário cozinha",
      "Armário quarto",
      "Varanda gourmet",
      "2 vagas de garagem cobertas",
      "Cozinha com planejados",
      "Sala integrada"
    ],
    condoFeatures: [
      "Portaria 24h",
      "Churrasqueira",
      "Piscina",
      "Quadra poliesportiva",
      "Solarium",
      "Brinquedoteca",
      "Playground",
      "Salão de festas",
      "Salão de jogos",
      "Academia"
    ],
    coordinates: { lat: -15.6050, lng: -56.0882 },
    transactionType: "Venda",
    neighborhood: "Bosque da Saúde",
    isGatedCommunity: true,
    condoFee: 1060
  },
  
  {
  "id": 2,
  "title": "Apartamento com 3 dormitórios no Edifício NYC - Jardim Cuiabá - Cuiabá/MT",
  "type": "Apartamento",
  "price": 5000,
  "priceLabel": "R$ 5.000/mês",
  "oldPrice": 6000,
  "oldPriceLabel": "R$ 6.000",
  "location": "Jardim Cuiabá, Cuiabá - MT",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 79,
  "image": "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2hViNFvuSsFj%2B0oYpqAmSmX1aSZ7NSwvWq9183Rlp7E%2Bfn8ZpiA99o-iOvJS1qWvZxpRIQlYkNEWblafBzjdLaRC35U%2BBCXiwD3EoZLXkZQhyh3mQhw%2BV2IbZ6xr2QPxQ%2BKEOnRlhaNR4X%2BGVlODrMNAdIz7EIJ8RC9W0J8p0oF7J6yoS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
  "images": [
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2hViNFvuSsFj%2B0oYpqAmSmX1aSZ7NSwvWq9183Rlp7E%2Bfn8ZpiA99o-iOvJS1qWvZxpRIQlYkNEWblafBzjdLaRC35U%2BBCXiwD3EoZLXkZQhyh3mQhw%2BV2IbZ6xr2QPxQ%2BKEOnRlhaNR4X%2BGVlODrMNAdIz7EIJ8RC9W0J8p0oF7J6yoS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1pZ8t9R9zMVoJoTRJ-khSjZ47KK2O6bh1WIz7TLtLbD2v3nXPvHzoA95p7aAAWprfNIW8M2PHcpYNVVWUWxT43YG10BniGvvn-AT7lUfExf0BErgUhp2mW%2Bf4GeyFgx3X%2B7Der4o3TWV6LjAFFlQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu3Vp84NhzCwDopcHZKOkrSqX9Y%2Btwfq8hWiJyKKJnYTxy8DOX9n65YUb1f-MLnjpjpNmZ-cqPV10OrlTZhO1b6WEAVNhvQm2-EP1EYRPQ0Bp1jYOrzcP%2BHiyQKj19VQ3xi%2BBGq-Eqi2dFqa9HF5lQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
    "https://imgs.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu3hl2owwyRgisPUnbb+TjXaW+93PyvLItGSN9sjG5+3r9M74R8GG479nzqjaEFz04plOHPgqbRlcRdknHQDTWL+uIlpxqmaK+mKWUZEdWnNq0Corzw9w1kO7cqPx9X09-CCgK+z09we0CaPIIFVBGrMNAdIz7EIJ8RC9W0J8p0oF7J6yoS7TO7S-K5+hxzlXFx5k9oa+Squ619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8+5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P+OUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ+ZPMLsZkdM-0XSMXCicycmtd+x7z+LeLsE36IGDY+kVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu3pZlelMxkkYq80odYf7pgqg8KLI1few8niN55qTk7-Y5e-9B+aAl49v9fWrMRusmbd3G9cbMEoiVu9HfTHnAq6aH10JrxywoE-IV4xUbVJ5mj4yzRBX+XiARcCl6g839XCcM+-ZoTeuSbG7PH5TQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5+hxzlXFx5k9oa+Squ619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8+5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P+OUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ+ZPMLsZkdM-0XSMXCicycmtd+x7z+LeLsE36IGDY+kVHVhOSnI5y4GQ6.jpg",
    "https://imgs.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1k-3-lZ+QoQufU6RLK3hA+w7r6d+vq5jkOrx6rxr5fR-8n-U5bf674HzvXvPUCJsbNZT+E1I0NORfdFekf1bdmvMl1BnD6CrGDCSIpAHHtE1F8wniBK7XG-XsKeqGk98gqMFayCmhOhbLz5Gld1QPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5+hxzlXFx5k9oa+Squ619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8+5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P+OUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ+ZPMLsZkdM-0XSMXCicycmtd+x7z+LeLsE36IGDY+kVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0Zf1d9X%2BwsalM0-VYS4rgSeg9qI4ezJjXnNxJbmjpzE6sj-TPzd9Z8296PZNWz0nqtYd9EKaHwoV-dZckPpTaetDV0LsxilunTDbYAbYEBk0iYQqEp-lEmARp6nxwAs8ni%2BVNDRpw%2BVTrm7HmF5JLMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2xYA3uNl3ws8lNEHA42EuHat4aWuuNC69EaPxtb0sKqG9f%2Bna57S2aEllIvUT2y%2BnPRrSeQ6GhpwSut9fQDWVLbRN3VepTS1lG-CQrRoZ3RT9g4cridI31y3BK%2BJxgdh7CL8C8TYkCSnTYy-Dk1bKv9HR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1tsyfZcvT0Qy5pAQY6PrSOa-4Gy19q%2BjkbO5rfOhbqFzpvEeZnHxJwO9a70TVmy75xLQ9MfIlhZet4jdSXrdt3YPltwrRXSgHv1ZYdmbUtM%2BQVruy5fx0Sfb5G88WAi8Tn%2BNMuIuyqMYf7qKl0ACrMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu31Y9etDyksEm9AkAbGHsCuA4rnI5-2Qp2WOx47YhL7n%2BdL-Qd-%2B0Jod9anfTVOBjZJDHtcnC2AkaehfGCTMAIKOLCcIsyLJ-B7EVOJ4Und5wjsFrixf-Ee5Z4Gv1w8T2TmOF9rzjAerVYzDLQxDQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0dQ0%2Blg5wcjm-FJe7blpSOdzKKK-cyA-XmryqvqurbE05zPDfbHkdov7pfOSGC1uv9KdM4MHH1SXfVfGSbbc9euC0dRhB22in38T5VoUlN48gIyoAp84gGTDaas-np11H2UL%2BzXqQ67VaXaB3hFDrMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0RhzekwvQUSnsA1fuWRh3Pb7o6o7NOLnFuf05XJ7pLU6uKmbujl6bc1jp-8AHGAi-dnbP8lLl4ifLJeTzrIe62uJiVprhqCm1XSV5JsHk5E%2Bh1rsQtJzmezAbGyrmQM1w61TtH%2Br3CjVpnXXXxzHrMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0xjyut3-EpgjMdHB4a6uXif5K%2B32tGJhWuE1pnbnJDQ-un6V%2BrM1ocA6oz0CXuytus4W4QKMkRJN8hBej3TX7ypGmhLoje8mWTrcaVEc2lb8ysFuxtv-WK9TIbp02At8QqjJtXAijGLSvHmOwBBCrMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu2lDzolixhoatJcSY5GwsHLf4ISjwPW%2BrEfL-5-ZmYzd9-TkdsaF56QI0o3oPXiJrIVdaOweEWdZIutTFALveoGAYHd6iSmApEzGQLtIcnd7j0RokAhuwla4B7aR7FQt1AapV7b3j3PTEKfmKkZTQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu3xb--5N2xQ-rJQDRpiGvDjW-Jmz2tWagmO9-cz9uo-EjuXSXtrakNgS8qjyFU6hiaxaY-koPH8mRPhYRDLXc4CACygPqgSyuxTIQeAZTjdp4Q4Q1UpZwlKJVLzz%2BmQH5S67C8zHmAG0TpzGNmREFrMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0BQjt1g4jshvI8pWoO5sRij5LSm4dS293Wkw5jXoJfp2pjiZc33160nlKfuEQ-8tJk0VPEKEGtZP8JWZy3NfKeSGHkNqR%2B8txTwQIdNX1pzwVluuTEN-1WzZ6GDyl029CSiENf0lADTcoTRCgdxKupHR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1lM%2Bfh36UoDncMBV43vlge%2B47SJ6fmGtHStyMLT5pWBzNPwXc2C5osmyff4MFO06Z5%2BXtB5Ax9fTLdhWA3QWrmhMidD%2Bxup-GnUFYcDSGN78C48rTBv1nm%2BYL6d63sa9zuMM83brjW%2Bb4XhG1NnMLMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtux9Vj9Np6zY5t8QlUpm17Ruf-biW7POnjhq8oMPvnpTE%2Bt6nbs3k5t4EyvXjM1Twob9iRfMgamBYOPdZYCHbWIaOAmoIvWevo1vuU-5IHjtH1j93iS8K7X6cUbOA6lMr9iH7W9KE8iWMEYW4LmV%2BTbMNAdIz7EIJ8RC9W0J8p0oF7Jq1qTLdaOenJpi9yWxNWAZ8vJq%2BTqjzwtiOK59nSeUyO3cb51URUaJf1-aKA%2B9jrwcLou-TCwSW3hrDkec3f8vtBcFNm6IBkRDBErZJv02-xoLOhqb6PRuBZwc087-O%2BqDkNP37SaukISWEj4sK7JLWO8tXGtvjXzYAAC4mZWBKpQD6vbmF4lLmcXjAtlwSWB3fg9xq7GJ3Pw%3D%3D.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu0hDN-Ol3w0wYsPMjbYCJ4XCsgp%2BIyd3HgUutpb3n4L76iezVQZvyxIMv9qSoCk%2BBo5Z-Hv9-L1xpVrIgZxjaVYbRYWBTrDuB%2BUbvbIZtfUYL9QQsqy5i7luDXJ%2Bg-gMi2B6COvLI%2BzyXXIG7JFlTQPlLCdkx8QdQ8Bi1SUxy8h8d55m-oS7TO7S-K5%2BhxzlXFx5k9oa%2BSqu619jCLJU4Vr0lNm4L5VMZWe0S2-TJT-8%2B5wEDqv3JFhXchgzWgPAoc9j0QdtPnaEFiA3KH7UbuRq7wI3Fh-P%2BOUrSZ1o78umdqqe5P-ejGvz0OUCjkpAZ%2BZPMLsZkdM-0XSMXCicycmtd%2Bx7z%2BLeLsE36IGDY%2BkVHVhOSnI5y4GQ6.jpg",
    "https://img.kenlo.io/VWRCUkQ2Tnp3d1BJRDBJVe1szkhnWr9UfpZS9ftWwjXgr7v5Znen3XVcMHllDVRJJeIbi3YwVYEtu1s-3943yywRuOM0Woa1oRaijrKW4uyroxSzwpnutrTRi%2Byue-yEwtB6iqPyJXmKvYp5QfA9HkMgPLNHFTa7dt3dF2YL-gaN-X7XEb1nGndWzhg9oD5V3QuBbLL87GcNhyS-W%2B-kmH%2Bydp7cO0d2HP5HR9o47l9MqBG1U1ByqR9Q9JG2ozrBZrT0PpW61WIYQklkpNCiTqzwi82OZ5htFvpqLHoC91cXWaoQmvqIQKNz8k8NqufBERmHlELVhPYgYMf%2BHIVXmaQClQncGbtK7UvowoTBjaevOR-QNAdp-L6YqfDjafbxEfjzcT3hqJYR-4fXId5aKbX3SDQVFyQvcXdBsl7ktPyL7AD5bSnYrhALDRPRzsM49G5xclU%3D.jpg"
  ],
  "description": "Apartamento no Edifício NYC - Jardim das Américas para locação. 79 m², mobiliado, com sol intermediário. Possui 3/4, sendo 1 suíte. Dois quartos completos com planejados, cama e ar condicionado. Sala ampla com mesa de jantar e cadeiras, sala de estar com sofá e sacada com churrasqueira. Cozinha completa de planejados, fogão e geladeira. Conta com 2 vagas de garagem cobertas.",
  "features": [
    "Mobiliado",
    "Área útil: 79 m²",
    "Área total: 79 m²",
    "Quartos: 3",
    "Suítes: 1",
    "Banheiros: 2",
    "Vagas de garagem: 1 (coberta)",
    "Sol intermediário",
    "Sacada com churrasqueira",
    "Cozinha com planejados, fogão e geladeira",
    "2 quartos com planejados, cama e ar condicionado",
    "Sala ampla com mesa de jantar e cadeiras",
    "Sala de estar com sofá"
  ],
  "coordinates": { lat: -15.6050, lng: -56.0882 },
  "transactionType": "Aluguel",
  "neighborhood": "Jardim Cuiabá",
  "isGatedCommunity": true,
  "condoFee": 150,
  "iptu": 150,
  "rentalPackage": 5150
  },
  
  { id: 3, title: "Apartamento Compacto Premium", type: "Apartamento", price: 295000, priceLabel: "R$ 295.000", oldPrice: 350000, oldPriceLabel: "R$ 350.000", location: "Jardim Europa", bedrooms: 1, bathrooms: 1, area: 42, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop"], description: "Studio moderno e funcional em um dos bairros mais valorizados de São Paulo.", features: ["Mobiliado", "Vaga de garagem", "Segurança 24h", "Lazer completo"], coordinates: { lat: -23.5847, lng: -46.6735 }, transactionType: "Venda", neighborhood: "Jardim Europa", isGatedCommunity: false },
  
  { id: 4, title: "Duplex Aconchegante", type: "Apartamento", price: 420000, priceLabel: "R$ 420.000", oldPrice: 510000, oldPriceLabel: "R$ 510.000", location: "Vila Madalena", bedrooms: 2, bathrooms: 2, area: 78, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&h=600&fit=crop"], description: "Duplex charmoso em região boêmia, com muito estilo e personalidade.", features: ["Mezanino", "Varanda", "Vaga coberta", "Pet friendly"], coordinates: { lat: -23.5449, lng: -46.6889 }, transactionType: "Venda", neighborhood: "Vila Madalena", isGatedCommunity: false },
  
  { id: 5, title: "Estúdio de Luxo", type: "Apartamento", price: 265000, priceLabel: "R$ 265.000", oldPrice: 320000, oldPriceLabel: "R$ 320.000", location: "Perdizes", bedrooms: 1, bathrooms: 1, area: 38, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop"], description: "Estúdio compacto com design sofisticado, ideal para jovens profissionais.", features: ["Mobiliado", "Ar condicionado", "Internet fibra", "Portaria remota"], coordinates: { lat: -23.5372, lng: -46.6726 }, transactionType: "Aluguel", neighborhood: "Perdizes", isGatedCommunity: false },
  
  // Apartamentos - R$ 500k a R$ 800k
  { id: 6, title: "Apartamento 3 Suítes Alto Padrão", type: "Apartamento", price: 650000, priceLabel: "R$ 650.000", oldPrice: 780000, oldPriceLabel: "R$ 780.000", location: "Jardins", bedrooms: 3, bathrooms: 3, area: 120, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", description: "Apartamento de alto padrão com suítes amplas e acabamento impecável.", features: ["3 suítes", "Varanda gourmet", "3 vagas", "Salão de festas", "Playground"], transactionType: "Venda", neighborhood: "Jardins", isGatedCommunity: true, condoFeatures: ["Portaria 24h", "Piscina", "Academia", "Salão de festas"], condoFee: 1850 },
  
  { id: 7, title: "Loft Industrial Moderno", type: "Apartamento", price: 580000, priceLabel: "R$ 580.000", oldPrice: 690000, oldPriceLabel: "R$ 690.000", location: "Pinheiros", bedrooms: 2, bathrooms: 2, area: 85, image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop", description: "Loft com pé-direito duplo e estilo industrial, perfeito para quem busca modernidade.", features: ["Pé-direito duplo", "Cozinha americana", "2 vagas", "Coworking"], transactionType: "Venda", neighborhood: "Pinheiros", isGatedCommunity: false },
  
  { id: 8, title: "Apartamento Garden Exclusivo", type: "Apartamento", price: 720000, priceLabel: "R$ 720.000", oldPrice: 850000, oldPriceLabel: "R$ 850.000", location: "Moema", bedrooms: 3, bathrooms: 2, area: 110, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", description: "Garden com jardim privativo, raro em apartamentos, ideal para famílias.", features: ["Jardim privativo", "Churrasqueira", "2 vagas", "Depósito", "Bicicletário"], transactionType: "Venda", neighborhood: "Moema", isGatedCommunity: false },
  
  { id: 9, title: "Cobertura Duplex Premium", type: "Apartamento", price: 790000, priceLabel: "R$ 790.000", oldPrice: 950000, oldPriceLabel: "R$ 950.000", location: "Itaim Bibi", bedrooms: 4, bathrooms: 3, area: 145, image: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&h=600&fit=crop", description: "Cobertura duplex em região nobre, com terraço amplo e vista privilegiada.", features: ["Terraço", "Piscina privativa", "4 vagas", "Home office", "Sauna"], transactionType: "Venda", neighborhood: "Itaim Bibi", isGatedCommunity: true, condoFeatures: ["Segurança 24h", "Quadra poliesportiva", "Playground", "Churrasqueira"], condoFee: 2100 },
  
  { id: 10, title: "Apartamento com Varanda Gourmet", type: "Apartamento", price: 610000, priceLabel: "R$ 610.000", oldPrice: 730000, oldPriceLabel: "R$ 730.000", location: "Brooklin", bedrooms: 3, bathrooms: 2, area: 98, image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop", description: "Apartamento com varanda gourmet integrada, perfeito para receber amigos.", features: ["Varanda gourmet", "Ar em todos quartos", "2 vagas", "Salão gourmet", "Piscina"], transactionType: "Aluguel", neighborhood: "Brooklin", isGatedCommunity: false },
  
  // Apartamentos - Acima de R$ 800k
  { id: 11, title: "Penthouses de Luxo", type: "Apartamento", price: 1200000, priceLabel: "R$ 1.200.000", oldPrice: 1450000, oldPriceLabel: "R$ 1.450.000", location: "Vila Olímpia", bedrooms: 4, bathrooms: 4, area: 180, image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop", description: "Penthouse de alto luxo com acabamento premium e localização exclusiva.", features: ["4 suítes", "Piscina privativa", "5 vagas", "Adega climatizada", "Cinema privativo"], transactionType: "Venda", neighborhood: "Vila Olímpia", isGatedCommunity: true, condoFeatures: ["Portaria", "Spa", "Espaço gourmet", "Piscina aquecada"], condoFee: 3200 },
  
  { id: 12, title: "Apartamento Alto Luxo Vista Mar", type: "Apartamento", price: 950000, priceLabel: "R$ 950.000", oldPrice: 1150000, oldPriceLabel: "R$ 1.150.000", location: "Riviera", bedrooms: 3, bathrooms: 3, area: 135, image: "https://images.unsplash.com/photo-1565402170291-8491f14678db?w=800&h=600&fit=crop", description: "Vista mar deslumbrante em condomínio de luxo na Riviera de São Lourenço.", features: ["Vista mar", "Varanda integrada", "3 vagas", "Beach club", "Spa"], transactionType: "Venda", neighborhood: "Riviera", isGatedCommunity: true, condoFeatures: ["Vigilância 24h", "Campo de futebol", "Salão de jogos", "Academia"], condoFee: 2800 },
  
  { id: 13, title: "Cobertura Triplex Exclusiva", type: "Apartamento", price: 1500000, priceLabel: "R$ 1.500.000", oldPrice: 1800000, oldPriceLabel: "R$ 1.800.000", location: "Higienópolis", bedrooms: 5, bathrooms: 4, area: 220, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Cobertura triplex única em prédio histórico de Higienópolis, totalmente renovada.", features: ["Triplex", "Terraço 360°", "6 vagas", "Elevador privativo", "Dependência completa"], transactionType: "Venda", neighborhood: "Higienópolis", isGatedCommunity: false },
  
  { id: 14, title: "Apartamento com Home Theater", type: "Apartamento", price: 880000, priceLabel: "R$ 880.000", oldPrice: 1050000, oldPriceLabel: "R$ 1.050.000", location: "Morumbi", bedrooms: 3, bathrooms: 3, area: 125, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", description: "Apartamento com home theater projetado e automação residencial completa.", features: ["Home theater", "Automação", "3 vagas", "Sala de jogos", "Churrasqueira"], transactionType: "Venda", neighborhood: "Morumbi", isGatedCommunity: false },
  
  { id: 15, title: "Duplex de Alto Padrão", type: "Apartamento", price: 1050000, priceLabel: "R$ 1.050.000", oldPrice: 1250000, oldPriceLabel: "R$ 1.250.000", location: "Campo Belo", bedrooms: 4, bathrooms: 3, area: 165, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop", description: "Duplex sofisticado com espaços amplos e acabamento de primeira linha.", features: ["Duplex", "4 suítes", "4 vagas", "Piscina aquecida", "Espaço gourmet"], transactionType: "Aluguel", neighborhood: "Campo Belo", isGatedCommunity: true, condoFeatures: ["Portaria 24h", "Piscina", "Academia", "Salão de festas"], condoFee: 2950 },
  
  // Casas - Até R$ 500k
  { id: 16, title: "Casa Térrea Aconchegante", type: "Casa", price: 450000, priceLabel: "R$ 450.000", oldPrice: 540000, oldPriceLabel: "R$ 540.000", location: "Ipiranga", bedrooms: 3, bathrooms: 2, area: 150, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop", description: "Casa térrea com quintal espaçoso, ideal para famílias que buscam conforto.", features: ["Quintal amplo", "Churrasqueira", "2 vagas", "Área de serviço", "Despensa"], transactionType: "Venda", neighborhood: "Ipiranga", isGatedCommunity: false },
  
  { id: 17, title: "Sobrado Moderno", type: "Casa", price: 490000, priceLabel: "R$ 490.000", oldPrice: 590000, oldPriceLabel: "R$ 590.000", location: "Tatuapé", bedrooms: 3, bathrooms: 3, area: 180, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop", description: "Sobrado moderno com 3 pavimentos e acabamento contemporâneo.", features: ["3 andares", "Suite master", "2 vagas", "Varanda", "Closet"], transactionType: "Venda", neighborhood: "Tatuapé", isGatedCommunity: false },
  
  { id: 18, title: "Casa com Quintal Amplo", type: "Casa", price: 380000, priceLabel: "R$ 380.000", oldPrice: 460000, oldPriceLabel: "R$ 460.000", location: "Penha", bedrooms: 2, bathrooms: 2, area: 120, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop", description: "Casa térrea com quintal perfeito para crianças e pets.", features: ["Quintal grande", "Garagem coberta", "Edícula", "Jardim", "Pet friendly"], transactionType: "Venda", neighborhood: "Penha", isGatedCommunity: false },
  
  { id: 19, title: "Casa Geminada Reformada", type: "Casa", price: 320000, priceLabel: "R$ 320.000", oldPrice: 390000, oldPriceLabel: "R$ 390.000", location: "Saúde", bedrooms: 2, bathrooms: 1, area: 95, image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&h=600&fit=crop", description: "Casa recém-reformada, pronta para morar, em bairro tranquilo.", features: ["Recém reformada", "1 vaga", "Próximo ao metrô", "Área externa"], transactionType: "Venda", neighborhood: "Saúde", isGatedCommunity: false },
  
  { id: 20, title: "Casa com Piscina", type: "Casa", price: 485000, priceLabel: "R$ 485.000", oldPrice: 580000, oldPriceLabel: "R$ 580.000", location: "Vila Prudente", bedrooms: 3, bathrooms: 2, area: 165, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", description: "Casa com piscina aquecida e área de lazer completa.", features: ["Piscina aquecada", "Churrasqueira", "2 vagas", "Área gourmet", "Quiosque"], transactionType: "Aluguel", neighborhood: "Vila Prudente", isGatedCommunity: false },
  
  // Casas - R$ 500k a R$ 800k
  { id: 21, title: "Sobrado de Alto Padrão em Condomínio Fechado", type: "Casa", price: 680000, priceLabel: "R$ 680.000", oldPrice: 820000, oldPriceLabel: "R$ 820.000", location: "Alto da Lapa", bedrooms: 4, bathrooms: 3, area: 220, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop", description: "Sobrado elegante em condomínio fechado, com segurança e infraestrutura.", features: ["Condomínio fechado", "4 suítes", "4 vagas", "Piscina", "Salão de festas"], transactionType: "Venda", neighborhood: "Alto da Lapa", isGatedCommunity: true, condoFeatures: ["Portaria 24h", "Piscina", "Academia", "Salão de festas", "Quadra"], condoFee: 1800 },
  
  { id: 22, title: "Casa com Design Contemporâneo", type: "Casa", price: 750000, priceLabel: "R$ 750.000", oldPrice: 900000, oldPriceLabel: "R$ 900.000", location: "Butantã", bedrooms: 3, bathrooms: 3, area: 195, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop", description: "Arquitetura contemporânea com linhas modernas e ambientes integrados.", features: ["Design exclusivo", "Pé-direito duplo", "3 vagas", "Jardim vertical", "Automação"], transactionType: "Venda", neighborhood: "Butantã", isGatedCommunity: false },
  
  { id: 23, title: "Casa em Condomínio Fechado Granja Viana", type: "Casa", price: 620000, priceLabel: "R$ 620.000", oldPrice: 750000, oldPriceLabel: "R$ 750.000", location: "Granja Viana", bedrooms: 3, bathrooms: 2, area: 185, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop", description: "Casa em condomínio com total segurança e lazer completo.", features: ["Segurança 24h", "Clube completo", "3 vagas", "Área gourmet", "Campo de futebol"], transactionType: "Venda", neighborhood: "Granja Viana", isGatedCommunity: true, condoFeatures: ["Segurança 24h", "Quadra poliesportiva", "Playground", "Churrasqueira", "Piscina"], condoFee: 1500 },
  
  { id: 24, title: "Sobrado com Suíte Master", type: "Casa", price: 710000, priceLabel: "R$ 710.000", oldPrice: 850000, oldPriceLabel: "R$ 850.000", location: "Santana", bedrooms: 4, bathrooms: 3, area: 205, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", description: "Sobrado com suíte master de 40m² e closet amplo.", features: ["Suíte master ampla", "Closet", "3 vagas", "Terraço", "Lavabo"], transactionType: "Venda", neighborhood: "Santana", isGatedCommunity: true, condoFeatures: ["Portaria", "Spa", "Espaço gourmet", "Piscina aquecada"], condoFee: 1650 },
  
  { id: 25, title: "Casa com Área Gourmet", type: "Casa", price: 590000, priceLabel: "R$ 590.000", oldPrice: 710000, oldPriceLabel: "R$ 710.000", location: "Vila Carrão", bedrooms: 3, bathrooms: 2, area: 175, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop", description: "Casa com área gourmet completa e espaço para eventos.", features: ["Área gourmet", "Forno de pizza", "2 vagas", "Jardim", "Piscina"], transactionType: "Aluguel", neighborhood: "Vila Carrão", isGatedCommunity: false },
  
  // Casas - Acima de R$ 800k
  { id: 26, title: "Mansão Moderna com Piscina em Alphaville", type: "Casa", price: 1350000, priceLabel: "R$ 1.350.000", oldPrice: 1650000, oldPriceLabel: "R$ 1.650.000", location: "Alphaville", bedrooms: 5, bathrooms: 4, area: 380, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop", description: "Mansão de luxo em Alphaville com piscina, sauna e área de lazer completa.", features: ["5 suítes", "Piscina aquecada", "Sauna", "6 vagas", "Cinema", "Adega"], transactionType: "Venda", neighborhood: "Alphaville", isGatedCommunity: true, condoFeatures: ["Vigilância 24h", "Campo de futebol", "Salão de jogos", "Academia", "Spa"], condoFee: 3500 },
  
  { id: 27, title: "Casa de Luxo com Cinema", type: "Casa", price: 980000, priceLabel: "R$ 980.000", oldPrice: 1180000, oldPriceLabel: "R$ 1.180.000", location: "Panamby", bedrooms: 4, bathrooms: 4, area: 295, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", description: "Casa de alto padrão com cinema privativo e acabamento de luxo.", features: ["Cinema privativo", "Home office", "4 vagas", "Piscina", "Spa"], transactionType: "Venda", neighborhood: "Panamby", isGatedCommunity: true, condoFeatures: ["Portaria 24h", "Piscina", "Academia", "Salão de festas"], condoFee: 2600 },
  
  { id: 28, title: "Sobrado Premium em Condomínio Tamboré", type: "Casa", price: 1150000, priceLabel: "R$ 1.150.000", oldPrice: 1380000, oldPriceLabel: "R$ 1.380.000", location: "Tamboré", bedrooms: 4, bathrooms: 3, area: 320, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", description: "Sobrado premium em condomínio de alto padrão com toda infraestrutura.", features: ["Condomínio clube", "4 suítes", "5 vagas", "Piscina privativa", "Espaço zen"], transactionType: "Venda", neighborhood: "Tamboré", isGatedCommunity: true, condoFeatures: ["Segurança 24h", "Quadra poliesportiva", "Playground", "Churrasqueira", "Lago"], condoFee: 3100 },
  
  { id: 29, title: "Casa Arquitetônica Exclusiva", type: "Casa", price: 1650000, priceLabel: "R$ 1.650.000", oldPrice: 2000000, oldPriceLabel: "R$ 2.000.000", location: "Cidade Jardim", bedrooms: 5, bathrooms: 5, area: 420, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop", description: "Projeto arquitetônico assinado em uma das regiões mais nobres de São Paulo.", features: ["Projeto exclusivo", "5 suítes", "8 vagas", "Elevador privativo", "Heliponto"], transactionType: "Venda", neighborhood: "Cidade Jardim", isGatedCommunity: false },
  
  { id: 30, title: "Mansão com Campo de Futebol", type: "Casa", price: 2200000, priceLabel: "R$ 2.200.000", oldPrice: 2650000, oldPriceLabel: "R$ 2.650.000", location: "Aldeia da Serra", bedrooms: 6, bathrooms: 5, area: 550, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop", description: "Mansão espetacular com campo de futebol, piscina olímpica e área de lazer completa.", features: ["Campo de futebol", "Piscina olímpica", "10 vagas", "Casa de hóspedes", "Lago artificial"], transactionType: "Aluguel", neighborhood: "Aldeia da Serra", isGatedCommunity: true, condoFeatures: ["Portaria", "Spa", "Espaço gourmet", "Piscina aquecada", "Heliponto"], condoFee: 5500 },

  // More Apartamentos
  { id: 31, title: "Apartamento Decorado", type: "Apartamento", price: 385000, priceLabel: "R$ 385.000", oldPrice: 460000, oldPriceLabel: "R$ 460.000", location: "Liberdade", bedrooms: 2, bathrooms: 2, area: 68, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop", description: "Apartamento decorado por arquiteto renomado, pronto para morar.", features: ["Mobiliado", "Decoração exclusiva", "Vaga de garagem", "Lazer completo"], transactionType: "Venda", neighborhood: "Liberdade", isGatedCommunity: false },
  
  { id: 32, title: "Flat em Hotel 5 Estrelas", type: "Apartamento", price: 520000, priceLabel: "R$ 520.000", oldPrice: 625000, oldPriceLabel: "R$ 625.000", location: "Berrini", bedrooms: 1, bathrooms: 1, area: 45, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Flat em hotel 5 estrelas com todos os serviços inclusos.", features: ["Serviços de hotel", "Room service", "Vaga", "Piscina", "Academia"], transactionType: "Venda", neighborhood: "Berrini", isGatedCommunity: false },
  
  { id: 33, title: "Apartamento com Lavabo", type: "Apartamento", price: 445000, priceLabel: "R$ 445.000", oldPrice: 535000, oldPriceLabel: "R$ 535.000", location: "Saúde", bedrooms: 2, bathrooms: 2, area: 72, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", description: "Apartamento com lavabo social e acabamento diferenciado.", features: ["Lavabo", "Varanda", "2 vagas", "Salão de festas", "Piscina"], transactionType: "Venda", neighborhood: "Saúde", isGatedCommunity: false },
  
  { id: 34, title: "Cobertura Linear", type: "Apartamento", price: 890000, priceLabel: "R$ 890.000", oldPrice: 1070000, oldPriceLabel: "R$ 1.070.000", location: "Vila Nova Conceição", bedrooms: 3, bathrooms: 3, area: 140, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", description: "Cobertura linear com ambientes amplos e muita luz natural.", features: ["Cobertura linear", "Terraço", "4 vagas", "Spa", "Adega"], transactionType: "Venda", neighborhood: "Vila Nova Conceição", isGatedCommunity: false },
  
  { id: 35, title: "Apartamento em Prédio Histórico", type: "Apartamento", price: 670000, priceLabel: "R$ 670.000", oldPrice: 805000, oldPriceLabel: "R$ 805.000", location: "Centro Histórico", bedrooms: 3, bathrooms: 2, area: 115, image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop", description: "Apartamento em edifício tombado, totalmente restaurado.", features: ["Prédio histórico", "Pé-direito alto", "Vaga", "Portaria 24h"], transactionType: "Aluguel", neighborhood: "Centro Histórico", isGatedCommunity: false },

  // More Casas
  { id: 36, title: "Casa Colonial Reformada", type: "Casa", price: 540000, priceLabel: "R$ 540.000", oldPrice: 650000, oldPriceLabel: "R$ 650.000", location: "São Miguel", bedrooms: 3, bathrooms: 2, area: 160, image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop", description: "Casa colonial completamente reformada, preservando o charme original.", features: ["Estilo colonial", "Jardim", "2 vagas", "Varanda", "Churrasqueira"], transactionType: "Venda", neighborhood: "São Miguel", isGatedCommunity: true, condoFeatures: ["Vigilância 24h", "Campo de futebol", "Salão de jogos", "Academia"], condoFee: 1350 },
  
  { id: 37, title: "Sobrado com Closet", type: "Casa", price: 780000, priceLabel: "R$ 780.000", oldPrice: 940000, oldPriceLabel: "R$ 940.000", location: "Interlagos", bedrooms: 4, bathrooms: 3, area: 215, image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop", description: "Sobrado com closets em todas as suítes e acabamento premium.", features: ["Closets planejados", "4 suítes", "3 vagas", "Piscina", "Área gourmet"], transactionType: "Venda", neighborhood: "Interlagos", isGatedCommunity: false },
  
  { id: 38, title: "Casa com Piscina Coberta", type: "Casa", price: 1120000, priceLabel: "R$ 1.120.000", oldPrice: 1350000, oldPriceLabel: "R$ 1.350.000", location: "Aricanduva", bedrooms: 4, bathrooms: 3, area: 260, image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop", description: "Casa com piscina coberta e área de lazer completa.", features: ["Piscina coberta", "Sauna", "4 vagas", "Jardim de inverno", "Adega"], transactionType: "Venda", neighborhood: "Aricanduva", isGatedCommunity: false },
  
  { id: 39, title: "Casa em Condomínio de Luxo", type: "Casa", price: 920000, priceLabel: "R$ 920.000", oldPrice: 1100000, oldPriceLabel: "R$ 1.100.000", location: "Jabaquara", bedrooms: 3, bathrooms: 3, area: 230, image: "https://images.unsplash.com/photo-1585664811087-47f65abbf138?w=800&h=600&fit=crop", description: "Casa em condomínio de luxo com toda infraestrutura.", features: ["Condomínio de luxo", "Piscina", "3 vagas", "Espaço gourmet", "Sauna"], transactionType: "Venda", neighborhood: "Jabaquara", isGatedCommunity: true, condoFeatures: ["Segurança 24h", "Quadra poliesportiva", "Playground", "Churrasqueira"], condoFee: 2200 },
  
  { id: 40, title: "Casa com Edícula", type: "Casa", price: 760000, priceLabel: "R$ 760.000", oldPrice: 915000, oldPriceLabel: "R$ 915.000", location: "Vila Mariana", bedrooms: 3, bathrooms: 3, area: 200, image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=600&fit=crop", description: "Casa com edícula independente, ideal para renda extra.", features: ["Edícula", "2 vagas", "Churrasqueira", "Jardim", "Quintal"], transactionType: "Aluguel", neighborhood: "Vila Mariana", isGatedCommunity: false },

  // Additional properties to reach 50
  { id: 41, title: "Casa em Osasco", type: "Casa", price: 425000, priceLabel: "R$ 425.000", oldPrice: 510000, oldPriceLabel: "R$ 510.000", location: "Osasco", bedrooms: 3, bathrooms: 2, area: 140, image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop", description: "Casa espaçosa em bairro tranquilo de Osasco.", features: ["Quintal", "Garagem", "Próximo ao metrô", "Área de serviço"], transactionType: "Venda", neighborhood: "Osasco", isGatedCommunity: false },
  
  { id: 42, title: "Apartamento em Guarulhos", type: "Apartamento", price: 315000, priceLabel: "R$ 315.000", oldPrice: 380000, oldPriceLabel: "R$ 380.000", location: "Guarulhos", bedrooms: 2, bathrooms: 1, area: 55, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", description: "Apartamento próximo ao aeroporto de Guarulhos.", features: ["1 vaga", "Próximo ao aeroporto", "Lazer", "Segurança 24h"], transactionType: "Venda", neighborhood: "Guarulhos", isGatedCommunity: false },
  
  { id: 43, title: "Casa em Santo André", type: "Casa", price: 540000, priceLabel: "R$ 540.000", oldPrice: 650000, oldPriceLabel: "R$ 650.000", location: "Santo André", bedrooms: 3, bathrooms: 2, area: 165, image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop", description: "Casa em Santo André com boa localização.", features: ["Garagem para 2 carros", "Quintal", "Churrasqueira", "Área gourmet"], transactionType: "Venda", neighborhood: "Santo André", isGatedCommunity: false },
  
  { id: 44, title: "Apartamento em São Bernardo", type: "Apartamento", price: 395000, priceLabel: "R$ 395.000", oldPrice: 475000, oldPriceLabel: "R$ 475.000", location: "São Bernardo", bedrooms: 2, bathrooms: 2, area: 63, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", description: "Apartamento moderno em São Bernardo do Campo.", features: ["Vaga de garagem", "Piscina", "Academia", "Salão de festas"], transactionType: "Venda", neighborhood: "São Bernardo", isGatedCommunity: false },
  
  { id: 45, title: "Casa em Diadema", type: "Casa", price: 385000, priceLabel: "R$ 385.000", oldPrice: 465000, oldPriceLabel: "R$ 465.000", location: "Diadema", bedrooms: 3, bathrooms: 2, area: 135, image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop", description: "Casa térrea em Diadema, ótima localização.", features: ["Garagem coberta", "Quintal", "Área de serviço", "Próximo ao comércio"], transactionType: "Aluguel", neighborhood: "Diadema", isGatedCommunity: false },
  
  { id: 46, title: "Apartamento em Mauá", type: "Apartamento", price: 285000, priceLabel: "R$ 285.000", oldPrice: 345000, oldPriceLabel: "R$ 345.000", location: "Mauá", bedrooms: 2, bathrooms: 1, area: 52, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", description: "Apartamento compacto em Mauá, próximo ao centro.", features: ["1 vaga", "Portaria 24h", "Lazer", "Próximo ao transporte público"], transactionType: "Venda", neighborhood: "Mauá", isGatedCommunity: false },
  
  { id: 47, title: "Casa em Carapicuíba", type: "Casa", price: 420000, priceLabel: "R$ 420.000", oldPrice: 505000, oldPriceLabel: "R$ 505.000", location: "Carapicuíba", bedrooms: 3, bathrooms: 2, area: 145, image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop", description: "Casa em condomínio fechado em Carapicuíba.", features: ["Condomínio fechado", "Piscina", "Churrasqueira", "Segurança"], transactionType: "Venda", neighborhood: "Carapicuíba", isGatedCommunity: true, condoFeatures: ["Portaria 24h", "Piscina", "Academia", "Salão de festas"], condoFee: 980 },
  
  { id: 48, title: "Casa em Cotia", type: "Casa", price: 685000, priceLabel: "R$ 685.000", oldPrice: 825000, oldPriceLabel: "R$ 825.000", location: "Cotia", bedrooms: 3, bathrooms: 3, area: 190, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop", description: "Casa em condomínio de alto padrão em Cotia.", features: ["Condomínio fechado", "Piscina", "Área gourmet", "Segurança 24h", "Lazer completo"], transactionType: "Venda", neighborhood: "Cotia", isGatedCommunity: true, condoFeatures: ["Segurança 24h", "Quadra poliesportiva", "Playground", "Churrasqueira"], condoFee: 1650 },
  
  { id: 49, title: "Loft Moderno", type: "Apartamento", price: 475000, priceLabel: "R$ 475.000", oldPrice: 570000, oldPriceLabel: "R$ 570.000", location: "Jardim Europa", bedrooms: 1, bathrooms: 1, area: 48, image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop", description: "Loft moderno com design arrojado no Jardim Europa.", features: ["Pé-direito duplo", "Mobiliado", "Vaga", "Segurança 24h"], transactionType: "Venda", neighborhood: "Jardim Europa", isGatedCommunity: false },
  
  { id: 50, title: "Apartamento Avenida Paulista", type: "Apartamento", price: 1100000, priceLabel: "R$ 1.100.000", oldPrice: 1320000, oldPriceLabel: "R$ 1.320.000", location: "Avenida Paulista", bedrooms: 3, bathrooms: 2, area: 115, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", description: "Apartamento na icônica Avenida Paulista com localização privilegiada.", features: ["Vista Paulista", "3 vagas", "Portaria 24h", "Lazer completo"], transactionType: "Aluguel", neighborhood: "Avenida Paulista", isGatedCommunity: true, condoFeatures: ["Vigilância 24h", "Campo de futebol", "Salão de jogos", "Academia"], condoFee: 2900 },
];

// Add images and coordinates to all properties
export const properties: Property[] = propertiesRaw.map(prop => ({
  ...prop,
  images: prop.images || getImagesForProperty(prop.id, prop.image),
  coordinates: prop.coordinates || getCoordinatesForNeighborhood(prop.neighborhood)
}));
