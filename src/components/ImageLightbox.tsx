import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  propertyTitle: string;
}

export const ImageLightbox = ({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex, 
  propertyTitle 
}: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-background/95 backdrop-blur-md border-0"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background text-foreground rounded-full"
            onClick={onClose}
          >
            <X size={24} />
          </Button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-foreground">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 bg-background/80 hover:bg-background text-foreground rounded-full h-12 w-12"
              onClick={handlePrevious}
            >
              <ChevronLeft size={32} />
            </Button>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
            <div className="relative w-full max-w-[550px] aspect-[50/89] max-h-[90vh]">
              <img
                src={images[currentIndex]}
                alt={`${propertyTitle} - Imagem ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 bg-background/80 hover:bg-background text-foreground rounded-full h-12 w-12"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </Button>
          )}

          {/* Property title */}
          <div className="absolute bottom-4 left-4 right-4 z-50 bg-background/80 backdrop-blur-sm px-4 py-3 rounded-lg max-w-3xl mx-auto">
            <p className="text-sm text-center text-foreground font-medium line-clamp-2">
              {propertyTitle}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
