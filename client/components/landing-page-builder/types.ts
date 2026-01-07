export interface LandingPageBlock {
  id: string;
  type:
    | "header"
    | "hero"
    | "features"
    | "testimonials"
    | "about"
    | "contact-form"
    | "footer"
    | "section-spacer";
  properties: Record<string, any>;
  children?: LandingPageBlock[];
}

export interface LandingPage {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  blocks: LandingPageBlock[];
}
