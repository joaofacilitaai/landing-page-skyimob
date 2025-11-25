import { HeroSection } from "@/components/HeroSection";
import { ConceptSection } from "@/components/ConceptSection";
import { PropertyGallery } from "@/components/PropertyGallery";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ConceptSection />
      <PropertyGallery />
    </div>
  );
};

export default Index;
