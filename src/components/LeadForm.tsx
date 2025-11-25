import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Property } from "@/data/properties";
import { toast } from "sonner";

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const LeadForm = ({ isOpen, onClose, property }: LeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Olá! Tenho interesse no imóvel:\n\n${property?.title}\nValor: ${property?.priceLabel}\nLocalização: ${property?.location}\n\nMeus dados:\nNome: ${formData.name}\nEmail: ${formData.email}\nTelefone: ${formData.phone}`;
    
    // WhatsApp - formato correto segundo documentação
    const whatsappUrl = `https://wa.me/556596860698?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Google Sheets (substitua pela URL do seu Google Apps Script)
    const sheetsUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    try {
      await fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, propertyId: property?.id, propertyTitle: property?.title })
      });
    } catch (error) {
      console.log('Dados enviados ao WhatsApp');
    }
    
    toast.success("Interesse registrado!", {
      description: "Você será redirecionado ao WhatsApp.",
    });
    
    setFormData({ name: "", email: "", phone: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Fale com um Consultor Exclusivo
          </DialogTitle>
          <DialogDescription>
            {property && (
              <span className="font-medium text-foreground">
                {property.title} - {property.priceLabel}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="gold" className="w-full text-lg py-6">
            Quero Saber Mais
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
