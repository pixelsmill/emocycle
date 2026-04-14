/**
 * Prépare les données des émotions :
 * 1. Nettoie les fichiers markdown (supprime les liens HTML)
 * 2. Génère public/data/emotions.json
 * 3. Copie les fichiers nettoyés vers public/content/
 *
 * Run : npx tsx scripts/prepare-content.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const SOURCE_DIR = join(ROOT, 'documents', 'redpsy', 'guide-md');
const CONTENT_DIR = join(ROOT, 'public', 'content');
const DATA_DIR = join(ROOT, 'public', 'data');

// ─── Mapping curated : famille, valence, genre grammatical ───────────────────

type EmotionFamily = 'joie' | 'amour' | 'desir' | 'tristesse' | 'colere' | 'peur';
type Valence = 'positive' | 'negative';
type EmotionType = 'simple' | 'mixte' | 'repoussee' | 'pseudo' | 'inconnu';
type Gender = 'm' | 'f';

interface EmotionMeta {
  name: string;
  family: EmotionFamily;
  valence: Valence;
  gender: Gender;
}

const EMOTION_META: Record<string, EmotionMeta> = {
  abandon:        { name: "L'abandon",             family: 'tristesse', valence: 'negative', gender: 'm' },
  admiration:     { name: "L'admiration",           family: 'amour',     valence: 'positive', gender: 'f' },
  agitation:      { name: "L'agitation",            family: 'peur',      valence: 'negative', gender: 'f' },
  ambivalence:    { name: "L'ambivalence",          family: 'tristesse', valence: 'negative', gender: 'f' },
  amertume:       { name: "L'amertume",             family: 'tristesse', valence: 'negative', gender: 'f' },
  amour:          { name: "L'amour",                family: 'amour',     valence: 'positive', gender: 'm' },
  angoisse:       { name: "L'angoisse",             family: 'peur',      valence: 'negative', gender: 'f' },
  anxiete:        { name: "L'anxiété",              family: 'peur',      valence: 'negative', gender: 'f' },
  attendrissement:{ name: "L'attendrissement",      family: 'amour',     valence: 'positive', gender: 'm' },
  begaiement:     { name: "Le bégaiement",          family: 'peur',      valence: 'negative', gender: 'm' },
  blesse:         { name: "Se sentir blessé",       family: 'tristesse', valence: 'negative', gender: 'm' },
  boule:          { name: "La boule dans la gorge", family: 'peur',      valence: 'negative', gender: 'f' },
  cephalee:       { name: "La céphalée",            family: 'tristesse', valence: 'negative', gender: 'f' },
  colere:         { name: "La colère",              family: 'colere',    valence: 'negative', gender: 'f' },
  compassion:     { name: "La compassion",          family: 'amour',     valence: 'positive', gender: 'f' },
  confusion:      { name: "La confusion",           family: 'peur',      valence: 'negative', gender: 'f' },
  contentement:   { name: "Le contentement",        family: 'joie',      valence: 'positive', gender: 'm' },
  culpabilite:    { name: "La culpabilité",         family: 'tristesse', valence: 'negative', gender: 'f' },
  deception:      { name: "La déception",           family: 'tristesse', valence: 'negative', gender: 'f' },
  decouragement:  { name: "Le découragement",       family: 'tristesse', valence: 'negative', gender: 'm' },
  degout:         { name: "Le dégoût",              family: 'colere',    valence: 'negative', gender: 'm' },
  deprime:        { name: "Se sentir déprimé",      family: 'tristesse', valence: 'negative', gender: 'm' },
  desespoir:      { name: "Le désespoir",           family: 'tristesse', valence: 'negative', gender: 'm' },
  desir:          { name: "Le désir",               family: 'desir',     valence: 'positive', gender: 'm' },
  distant:        { name: "Se sentir distant",      family: 'tristesse', valence: 'negative', gender: 'm' },
  ecoeurement:    { name: "L'écœurement",           family: 'colere',    valence: 'negative', gender: 'm' },
  embarras:       { name: "L'embarras",             family: 'peur',      valence: 'negative', gender: 'm' },
  emprisonne:     { name: "Se sentir emprisonné",   family: 'tristesse', valence: 'negative', gender: 'm' },
  ennui:          { name: "L'ennui",                family: 'tristesse', valence: 'negative', gender: 'm' },
  envie:          { name: "L'envie",                family: 'desir',     valence: 'positive', gender: 'f' },
  estime:         { name: "L'estime",               family: 'joie',      valence: 'positive', gender: 'f' },
  evanouissement: { name: "L'évanouissement",       family: 'peur',      valence: 'negative', gender: 'm' },
  fatigue:        { name: "La fatigue",             family: 'tristesse', valence: 'negative', gender: 'f' },
  febrilite:      { name: "La fébrilité",           family: 'desir',     valence: 'positive', gender: 'f' },
  fierte:         { name: "La fierté",              family: 'joie',      valence: 'positive', gender: 'f' },
  fige:           { name: "Se sentir figé",         family: 'peur',      valence: 'negative', gender: 'm' },
  frustration:    { name: "La frustration",         family: 'colere',    valence: 'negative', gender: 'f' },
  gene:           { name: "La gêne",                family: 'peur',      valence: 'negative', gender: 'f' },
  haine:          { name: "La haine",               family: 'colere',    valence: 'negative', gender: 'f' },
  honte:          { name: "La honte",               family: 'tristesse', valence: 'negative', gender: 'f' },
  hostilite:      { name: "L'hostilité",            family: 'colere',    valence: 'negative', gender: 'f' },
  humiliation:    { name: "L'humiliation",          family: 'tristesse', valence: 'negative', gender: 'f' },
  impatience:     { name: "L'impatience",           family: 'desir',     valence: 'negative', gender: 'f' },
  impuissance:    { name: "L'impuissance",          family: 'tristesse', valence: 'negative', gender: 'f' },
  indifference:   { name: "L'indifférence",         family: 'tristesse', valence: 'negative', gender: 'f' },
  inquietude:     { name: "L'inquiétude",           family: 'peur',      valence: 'negative', gender: 'f' },
  'jalousie-amour': { name: "La jalousie amoureuse", family: 'amour',   valence: 'negative', gender: 'f' },
  jalousie:       { name: "La jalousie",            family: 'colere',    valence: 'negative', gender: 'f' },
  malaise:        { name: "Le malaise",             family: 'peur',      valence: 'negative', gender: 'm' },
  mepris:         { name: "Le mépris",              family: 'colere',    valence: 'negative', gender: 'm' },
  migraine:       { name: "La migraine",            family: 'tristesse', valence: 'negative', gender: 'f' },
  nausee:         { name: "La nausée",              family: 'peur',      valence: 'negative', gender: 'f' },
  nervosite:      { name: "La nervosité",           family: 'peur',      valence: 'negative', gender: 'f' },
  nostalgie:      { name: "La nostalgie",           family: 'tristesse', valence: 'negative', gender: 'f' },
  panique:        { name: "La panique",             family: 'peur',      valence: 'negative', gender: 'f' },
  paresse:        { name: "La paresse",             family: 'tristesse', valence: 'negative', gender: 'f' },
  peur:           { name: "La peur",                family: 'peur',      valence: 'negative', gender: 'f' },
  pitie:          { name: "La pitié",               family: 'amour',     valence: 'positive', gender: 'f' },
  plaisir:        { name: "Le plaisir",             family: 'joie',      valence: 'positive', gender: 'm' },
  rage:           { name: "La rage",                family: 'colere',    valence: 'negative', gender: 'f' },
  rancune:        { name: "La rancune",             family: 'colere',    valence: 'negative', gender: 'f' },
  reconnaissance: { name: "La reconnaissance",      family: 'joie',      valence: 'positive', gender: 'f' },
  regret:         { name: "Le regret",              family: 'tristesse', valence: 'negative', gender: 'm' },
  rejet:          { name: "Le rejet",               family: 'tristesse', valence: 'negative', gender: 'm' },
  ressentiment:   { name: "Le ressentiment",        family: 'colere',    valence: 'negative', gender: 'm' },
  revolte:        { name: "La révolte",             family: 'colere',    valence: 'negative', gender: 'f' },
  rougissement:   { name: "Le rougissement",        family: 'peur',      valence: 'negative', gender: 'm' },
  solitude:       { name: "La solitude",            family: 'tristesse', valence: 'negative', gender: 'f' },
  stress:         { name: "Le stress",              family: 'peur',      valence: 'negative', gender: 'm' },
  tension:        { name: "La tension",             family: 'peur',      valence: 'negative', gender: 'f' },
  tics:           { name: "Les tics",               family: 'peur',      valence: 'negative', gender: 'm' },
  timide:         { name: "La timidité",            family: 'peur',      valence: 'negative', gender: 'f' },
  trahison:       { name: "La trahison",            family: 'tristesse', valence: 'negative', gender: 'f' },
  transpiration:  { name: "La transpiration",       family: 'peur',      valence: 'negative', gender: 'f' },
  tremblement:    { name: "Le tremblement",         family: 'peur',      valence: 'negative', gender: 'm' },
  tristesse:      { name: "La tristesse",           family: 'tristesse', valence: 'negative', gender: 'f' },
  vide:           { name: "Le sentiment de vide",   family: 'tristesse', valence: 'negative', gender: 'm' },
  violence:       { name: "La violence",            family: 'colere',    valence: 'negative', gender: 'f' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractType(content: string): EmotionType {
  const match = content.match(/^\*\*Type\s*:\*\*\s*(.+)$/m);
  if (!match) return 'inconnu';
  const raw = match[1].trim().toLowerCase();
  if (raw === 'simple') return 'simple';
  if (raw === 'mixte') return 'mixte';
  if (raw.startsWith('repouss')) return 'repoussee';
  if (raw.startsWith('pseudo')) return 'pseudo';
  return 'inconnu';
}

/**
 * Supprime les liens markdown qui pointent vers des fichiers .html locaux
 * et les liens vers des ancres locales. Garde le texte du lien.
 * Ex: [texte](../infopsy/fichier.html) → texte
 *     [Pour en savoir plus!](index-2.html#types) → supprimé
 */
function cleanContent(content: string): string {
  return content
    // Supprime les liens "Pour en savoir plus" et "Pour explorer"
    .replace(/\[Pour (?:en savoir plus|explorer)[^\]]*\]\([^)]*\)\s*\n?/gi, '')
    // Supprime les liens "Ceux qui désirent en savoir plus"
    .replace(/\*\*Ceux qui désirent en savoir plus[^*]*\*\*\s*\n?/gi, '')
    // Remplace les liens markdown locaux (.html) par leur texte
    .replace(/\[([^\]]+)\]\([^)]*\.html[^)]*\)/g, '$1')
    // Remplace les liens markdown relatifs (..) par leur texte
    .replace(/\[([^\]]+)\]\(\.\.[^)]*\)/g, '$1')
    // Supprime les lignes de navigation résiduelles (post-extraction de liens)
    .replace(/^Pour (?:en savoir plus|explorer) .+$/gm, '')
    // Supprime les lignes "voir aussi" avec guillemets (résidus de liens)
    .replace(/^"[^"]{3,60}"\.\s*$/gm, '')
    // Supprime les lignes vides multiples résiduelles (max 2)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(CONTENT_DIR)) mkdirSync(CONTENT_DIR, { recursive: true });
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

interface EmotionEntry {
  id: string;
  name: string;
  family: EmotionFamily;
  valence: Valence;
  type: EmotionType;
  gender: Gender;
  contentFile: string;
}

const emotions: EmotionEntry[] = [];

const ids = Object.keys(EMOTION_META).sort();

for (const id of ids) {
  const sourceFile = join(SOURCE_DIR, `${id}.md`);
  if (!existsSync(sourceFile)) {
    console.warn(`⚠  ${id}.md introuvable, ignoré`);
    continue;
  }

  const raw = readFileSync(sourceFile, 'utf-8');
  const type = extractType(raw);
  const cleaned = cleanContent(raw);
  const meta = EMOTION_META[id];

  // Écriture du fichier nettoyé dans public/content/
  writeFileSync(join(CONTENT_DIR, `${id}.md`), cleaned, 'utf-8');

  emotions.push({
    id,
    name: meta.name,
    family: meta.family,
    valence: meta.valence,
    type,
    gender: meta.gender,
    contentFile: `${id}.md`,
  });
}

// Trier par famille puis par nom
emotions.sort((a, b) => {
  if (a.family !== b.family) return a.family.localeCompare(b.family);
  return a.name.localeCompare(b.name, 'fr');
});

writeFileSync(
  join(DATA_DIR, 'emotions.json'),
  JSON.stringify(emotions, null, 2),
  'utf-8',
);

const simpleCount = emotions.filter((e) => e.type === 'simple').length;
console.log(`✅  ${emotions.length} émotions écrites dans public/data/emotions.json`);
console.log(`   dont ${simpleCount} de type "simple" (affichées en liste MVP)`);
console.log(`✅  ${emotions.length} fichiers nettoyés dans public/content/`);
