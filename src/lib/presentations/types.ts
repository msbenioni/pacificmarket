export type DeckStatus = "live" | "draft";
export type DeckTheme = "pdn-investor";

export type DeckMeta = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  status: DeckStatus;
  theme: DeckTheme;
  createdAt: string;
  updatedAt: string;
};

export type StatItem = {
  label: string;
  value: string;
  hint?: string;
};

export type ColumnBlock = {
  title: string;
  items: string[];
};

export type SectionBlock = {
  title: string;
  items: string[];
};

export type TableData = {
  headers: string[];
  rows: string[][];
};

export type TierData = {
  name: string;
  price: string;
  features: string[];
};

export type AllocationData = {
  category: string;
  percentage: number;
  amount: string;
  items: string[];
};

export type ContactInfo = {
  name: string;
  title: string;
  email: string;
  website: string;
};

export type CoverSlide = {
  id: string;
  type: "cover";
  title: string;
  subtitle: string;
  tagline?: string;
  statusBadge?: string;
  contact?: string;
  footer?: string;
};

export type StatsSlide = {
  id: string;
  type: "stats";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  stats?: StatItem[];
  bullets?: string[];
  closingLine?: string;
};

export type BulletsSlide = {
  id: string;
  type: "bullets";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  sections?: SectionBlock[];
  techStack?: string;
  credibilityNote?: string;
  closingLine?: string;
};

export type ThreeColumnSlide = {
  id: string;
  type: "three-column";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  columns: ColumnBlock[];
  closingLine?: string;
};

export type TableSlide = {
  id: string;
  type: "table";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  table: TableData;
  bullets?: string[];
  closingLine?: string;
};

export type TiersSlide = {
  id: string;
  type: "tiers";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tiers: TierData[];
  futureRevenue?: string[];
  closingLine?: string;
};

export type FinancialTableSlide = {
  id: string;
  type: "financial-table";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  table: TableData;
  sideStats: StatItem[];
  closingLine?: string;
};

export type AllocationSlide = {
  id: string;
  type: "allocation";
  eyebrow?: string;
  title: string;
  ask: string;
  allocations: AllocationData[];
  closingLine?: string;
};

export type AskSlide = {
  id: string;
  type: "ask";
  eyebrow?: string;
  title: string;
  mainPoints: string[];
  investorRationale: string[];
  closingLine?: string;
};

export type ClosingSlide = {
  id: string;
  type: "closing";
  title: string;
  subtitle?: string;
  cta?: string;
  contact: ContactInfo;
  finalLine?: string;
};

export type PresentationSlide =
  | CoverSlide
  | StatsSlide
  | BulletsSlide
  | ThreeColumnSlide
  | TableSlide
  | TiersSlide
  | FinancialTableSlide
  | AllocationSlide
  | AskSlide
  | ClosingSlide;

export type PresentationDeck = DeckMeta & {
  slides: PresentationSlide[];
};
