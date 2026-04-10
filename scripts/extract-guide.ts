/**
 * Extract emotion guide HTML files into clean markdown files.
 * Run with: npx tsx scripts/extract-guide.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const GUIDE_DIR = join(__dirname, '..', 'documents', 'redpsy', 'redpsy', 'www.redpsy.com', 'guide');
const OUTPUT_DIR = join(__dirname, '..', 'documents', 'redpsy', 'guide-md');

// Files that are index/category pages, not individual emotion fiches
const SKIP_FILES = new Set([
  'index.html', 'index-2.html', '008000.html', '$URL-TYPE.html',
  'simple.html', 'mixte.html', 'repoussee.html', 'pseudo.html'
]);

function decodeLatinEntities(text: string): string {
  return text
    // Windows-1252 special characters (read as latin1)
    .replace(/\x92/g, "'")  // right single quote → apostrophe
    .replace(/\x91/g, "'")  // left single quote
    .replace(/\x93/g, '"')  // left double quote
    .replace(/\x94/g, '"')  // right double quote
    .replace(/\x96/g, '–')  // en dash
    .replace(/\x97/g, '—')  // em dash
    .replace(/\x85/g, '…')  // ellipsis
    .replace(/\x9c/g, 'œ')  // oe ligature
    // HTML entities
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&acirc;/g, 'â')
    .replace(/&icirc;/g, 'î')
    .replace(/&ucirc;/g, 'û')
    .replace(/&euml;/g, 'ë')
    .replace(/&iuml;/g, 'ï')
    .replace(/&uuml;/g, 'ü')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&copy;/g, '©')
    // Common mojibake patterns from Latin-1 interpreted as Windows-1252
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã´/g, 'ô')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã®/g, 'î')
    .replace(/Ã»/g, 'û')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã€/g, 'À')
    .replace(/Ã"/g, 'Ô')
    .replace(/Ãˆ/g, 'È');
}

function stripHtml(html: string): string {
  return html
    .replace(/<BR\s*\/?>/gi, '\n')
    .replace(/<\/?(P|DIV)[^>]*>/gi, '\n')
    .replace(/<LI>/gi, '\n- ')
    .replace(/<\/LI>/gi, '')
    .replace(/<\/?(OL|UL)>/gi, '\n')
    .replace(/<STRONG>/gi, '**')
    .replace(/<\/STRONG>/gi, '**')
    .replace(/<B>/gi, '**')
    .replace(/<\/B>/gi, '**')
    .replace(/<I>/gi, '_')
    .replace(/<\/I>/gi, '_')
    .replace(/<A\s+HREF="([^"]*)"[^>]*>([^<]*)<\/A>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractType(html: string): string {
  const typeMatch = html.match(/<A\s+HREF=["']?(simple|mixte|repoussee|pseudo)\.html["']?[^>]*>[^<]*<\/A>/i);
  if (typeMatch) {
    const typeMap: Record<string, string> = {
      'simple': 'simple',
      'mixte': 'mixte',
      'repoussee': 'repoussée',
      'pseudo': 'pseudo-émotion'
    };
    return typeMap[typeMatch[1].toLowerCase()] || typeMatch[1];
  }
  return 'inconnu';
}

function extractTitle(html: string): string {
  // Try the main title in the colored header (handle attribute order variants)
  const titleMatch = html.match(/<FONT\s+SIZE\s*=\s*["']?\+2["']?\s+COLOR\s*=\s*["']?#990066["']?>\s*([^<]+)\s*<\/FONT>/i)
    || html.match(/<FONT\s+COLOR\s*=\s*["']?#990066["']?\s+SIZE\s*=\s*["']?\+2["']?>\s*([^<]+)\s*<\/FONT>/i)
    || html.match(/<TITLE>\s*([^<]+)\s*<\/TITLE>/i);
  if (titleMatch) {
    return decodeLatinEntities(stripHtml(titleMatch[1].trim()));
  }
  return 'Sans titre';
}

function extractSection(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  if (!match) return null;

  // Get text after the section header until the next section or end marker
  const startIdx = match.index! + match[0].length;
  const remaining = html.substring(startIdx);

  // Find next section header or end markers
  // Handle all FONT tag attribute orderings: SIZE then COLOR, COLOR then SIZE, with/without quotes
  const endPatterns = [
    /<FONT\s+(?=[^>]*SIZE\s*=\s*["']?\+?1["']?)(?=[^>]*COLOR\s*=\s*["']?#990066["']?)[^>]*>/i,
    /<FONT\s+(?=[^>]*COLOR\s*=\s*["']?#990066["']?)(?=[^>]*SIZE\s*=\s*["']?\+?1["']?)[^>]*>/i,
    /<FONT\s+COLOR\s*=\s*["']?#990066["']?>\s*<B>/i,
    /<CENTER>.*?Pour en savoir plus/i,
    /<CENTER>.*?Pour explorer d'autres/i,
    /<!--\s*Nouveau module/i,
    /<table\s+width=70%\s+border=1/i,
  ];

  let endIdx = remaining.length;
  for (const ep of endPatterns) {
    const m = remaining.match(ep);
    if (m && m.index !== undefined && m.index < endIdx) {
      endIdx = m.index;
    }
  }

  const sectionHtml = remaining.substring(0, endIdx);
  const text = decodeLatinEntities(stripHtml(sectionHtml)).trim();
  return text || null;
}

function extractExamples(html: string): string | null {
  return extractSection(html, /(?:Des exemples|Un exemple|Exemples?)\s*\n?\s*<\/FONT>/i);
}

function extractDefinition(html: string): string | null {
  return extractSection(html, /Qu.est-ce que (?:c.est|la |le |l.|les )[^<]*\??\s*\n?\s*<\/FONT>/i)
    || extractSection(html, /Qu.est-ce que c.est\s*\??\s*\n?\s*<\/FONT>/i);
}

function extractPurpose(html: string): string | null {
  // Match both "À quoi ça sert" and "À quoi sert la/le/l'/les [emotion]"
  return extractSection(html, /[àaÀA\xc0] quoi (?:ça|&ccedil;a|ca|elle|il) sert\s*\??\s*\n?\s*<\/FONT>/i)
    || extractSection(html, /[àaÀA\xc0] quoi sert (?:la |le |l.|les )[^<]*\??\s*\n?\s*<\/FONT>/i);
}

function extractSynonyms(html: string): string | null {
  return extractSection(html, /(?:Des synonymes|Exp.riences? connexes?|Exp.rience connexe)\s*\n?\s*<\/FONT>/i);
}

function isRedirectPage(html: string): boolean {
  return /meta\s+http-equiv\s*=\s*["']?refresh/i.test(html);
}

function processFile(filename: string): void {
  const filepath = join(GUIDE_DIR, filename);
  const slug = basename(filename, '.html');

  // Read as latin1 first, then convert
  const rawBuffer = readFileSync(filepath);
  let html: string;

  // Try latin1 decoding
  html = rawBuffer.toString('latin1');

  // Skip redirect pages (e.g. confus-creatrice → confusion)
  if (isRedirectPage(html)) {
    console.log(`⊘ ${slug}.html (redirect, skipped)`);
    return;
  }

  const title = extractTitle(html);
  const type = extractType(html);
  const synonyms = extractSynonyms(html);
  const examples = extractExamples(html);
  const definition = extractDefinition(html);
  const purpose = extractPurpose(html);

  // Build markdown
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`**Type :** ${type}`);
  lines.push('');

  if (synonyms) {
    lines.push('## Synonymes / Expériences connexes');
    lines.push('');
    lines.push(synonyms);
    lines.push('');
  }

  if (examples) {
    lines.push('## Exemples');
    lines.push('');
    lines.push(examples);
    lines.push('');
  }

  if (definition) {
    lines.push('## Qu\'est-ce que c\'est ?');
    lines.push('');
    lines.push(definition);
    lines.push('');
  }

  if (purpose) {
    lines.push('## À quoi ça sert ?');
    lines.push('');
    lines.push(purpose);
    lines.push('');
  }

  lines.push('---');
  lines.push('_Source : Guide des émotions, Michelle Larivey, Ressources en Développement_');

  const md = lines.join('\n');
  writeFileSync(join(OUTPUT_DIR, `${slug}.md`), md, 'utf-8');

  const sections = [synonyms, examples, definition, purpose].filter(Boolean).length;
  console.log(`✓ ${slug}.md (${sections}/4 sections)`);
}

// Main
const files = readdirSync(GUIDE_DIR)
  .filter(f => f.endsWith('.html') && !SKIP_FILES.has(f));

console.log(`Extraction de ${files.length} fiches...\n`);

let total = 0;
for (const file of files.sort()) {
  try {
    processFile(file);
    total++;
  } catch (err) {
    console.error(`✗ ${file}: ${(err as Error).message}`);
  }
}

console.log(`\n${total} fiches extraites dans documents/redpsy/guide-md/`);
