export interface TagConfig {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Tags predefinidas com cores
export const predefinedTags: TagConfig[] = [
  {
    name: "Urgente",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-300"
  },
  {
    name: "Contrato",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300"
  },
  {
    name: "Procuração",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300"
  },
  {
    name: "Sentença",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300"
  },
  {
    name: "Petição",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300"
  },
  {
    name: "Comprovante",
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-300"
  },
  {
    name: "Identidade",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300"
  },
  {
    name: "Certidão",
    color: "text-pink-700",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-300"
  },
  {
    name: "Recurso",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300"
  },
  {
    name: "Acordo",
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-300"
  }
];

// Obter configuração de cor para uma tag
export function getTagConfig(tagName: string): TagConfig {
  const predefined = predefinedTags.find(
    t => t.name.toLowerCase() === tagName.toLowerCase()
  );
  
  if (predefined) {
    return predefined;
  }
  
  // Tag customizada - cor padrão cinza
  return {
    name: tagName,
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300"
  };
}

// Gerar classes CSS para uma tag
export function getTagClasses(tagName: string): string {
  const config = getTagConfig(tagName);
  return `${config.color} ${config.bgColor} ${config.borderColor}`;
}
