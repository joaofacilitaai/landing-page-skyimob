import { Sparkles, Award, Clock } from "lucide-react";

export const ConceptSection = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: "Curadoria Premium",
      description: "50 imóveis selecionados com critérios rigorosos de localização e qualidade",
    },
    {
      icon: Award,
      title: "Condições Exclusivas",
      description: "Oportunidades especiais que você só encontra neste evento",
    },
    {
      icon: Clock,
      title: "Tempo Limitado",
      description: "Oportunidades únicas disponíveis apenas durante o festival",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            O que torna este Festival Imperdível?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Esqueça as promoções comuns. Reunimos uma curadoria de 50 imóveis com localizações, 
            acabamentos ou condições de negociação que você só encontra aqui. 
            São oportunidades reais e por tempo limitado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mb-6 mx-auto">
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-4 text-center text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-center">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
