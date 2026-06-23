import siteJson from '../../site.json';

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  locale: string;
  city: string;
  ageRange: string;
  primaryCta: {
    label: string;
    modalTitle: string;
    modalSteps: string[];
  };
  og: { image: string; type: string };
  wechatQr: string;
}

export interface SectionFrontmatter {
  id: string;
  title: string;
  order: number;
  [key: string]: unknown;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  frontmatter: SectionFrontmatter;
  body: string;
  Content: AstroComponentFactory;
}

type AstroComponentFactory = (props?: Record<string, unknown>) => any;

const sectionModules = import.meta.glob<{ frontmatter: SectionFrontmatter; Content: AstroComponentFactory; compiledContent: () => Promise<string> }>(
  '../../content/sections/*.md',
  { eager: true }
);

const REQUIRED_IDS = ['hero', 'pain', 'solution', 'roadmap', 'service', 'trust', 'cta'];

export function getSiteConfig(): SiteConfig {
  return siteJson as SiteConfig;
}

export async function getSections(): Promise<Section[]> {
  const sections: Section[] = [];

  for (const [path, mod] of Object.entries(sectionModules)) {
    const fm = mod.frontmatter;
    if (!fm?.id) {
      throw new Error(`Missing frontmatter.id in ${path}`);
    }
    const body = await mod.compiledContent();
    sections.push({
      id: fm.id,
      title: fm.title,
      order: fm.order,
      frontmatter: fm,
      body: body.trim(),
      Content: mod.Content,
    });
  }

  sections.sort((a, b) => a.order - b.order);

  const ids = sections.map((s) => s.id);
  for (const required of REQUIRED_IDS) {
    if (!ids.includes(required)) {
      throw new Error(`Missing required section: ${required}.md`);
    }
  }

  return sections;
}

export function getSectionById(sections: Section[], id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}
