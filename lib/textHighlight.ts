/**
 * Extrai trechos de texto contendo a palavra-chave com contexto
 */
export function extractTextSnippets(
  text: string, 
  keyword: string, 
  maxSnippets: number = 3,
  contextLength: number = 60
): string[] {
  if (!text || !keyword) return [];
  
  const normalizedText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const normalizedKeyword = keyword.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const snippets: string[] = [];
  let lastIndex = 0;
  
  // Encontrar todas as ocorrências
  while (snippets.length < maxSnippets) {
    const index = normalizedText.indexOf(normalizedKeyword, lastIndex);
    
    if (index === -1) break;
    
    // Calcular início e fim do trecho
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + normalizedKeyword.length + contextLength);
    
    // Extrair trecho
    let snippet = text.substring(start, end);
    
    // Adicionar reticências se não for o início/fim
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    snippets.push(snippet.trim());
    lastIndex = index + normalizedKeyword.length;
  }
  
  return snippets;
}

/**
 * Destaca palavras-chave em um texto com HTML
 */
export function highlightKeyword(text: string, keyword: string): string {
  if (!text || !keyword) return text;
  
  // Normalizar para busca
  const normalizedText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const normalizedKeyword = keyword.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Encontrar todas as posições da palavra-chave
  const positions: Array<{start: number, end: number}> = [];
  let index = 0;
  
  while (index < normalizedText.length) {
    const foundIndex = normalizedText.indexOf(normalizedKeyword, index);
    if (foundIndex === -1) break;
    
    positions.push({
      start: foundIndex,
      end: foundIndex + normalizedKeyword.length
    });
    
    index = foundIndex + normalizedKeyword.length;
  }
  
  // Se não encontrou, retorna texto original
  if (positions.length === 0) return text;
  
  // Construir texto com highlights
  let result = '';
  let lastEnd = 0;
  
  positions.forEach(pos => {
    // Adicionar texto antes do highlight
    result += escapeHtml(text.substring(lastEnd, pos.start));
    
    // Adicionar texto destacado
    result += `<mark class="bg-yellow-300 text-slate-900 px-0.5 rounded">${escapeHtml(text.substring(pos.start, pos.end))}</mark>`;
    
    lastEnd = pos.end;
  });
  
  // Adicionar texto restante
  result += escapeHtml(text.substring(lastEnd));
  
  return result;
}

/**
 * Escapa caracteres HTML
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Conta ocorrências de uma palavra-chave no texto
 */
export function countOccurrences(text: string, keyword: string): number {
  if (!text || !keyword) return 0;
  
  const normalizedText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const normalizedKeyword = keyword.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  let count = 0;
  let index = 0;
  
  while (index < normalizedText.length) {
    const foundIndex = normalizedText.indexOf(normalizedKeyword, index);
    if (foundIndex === -1) break;
    
    count++;
    index = foundIndex + normalizedKeyword.length;
  }
  
  return count;
}
