export type ObjectiveId =
  | "start-business"
  | "expand-manufacturing"
  | "export-products"
  | "access-funding"
  | "go-green"
  | "adopt-ai"
  | "scale-msme"
  | "women-entrepreneurship"
  | "innovate-patent"
  | "industrial-infrastructure";

export interface ObjectiveCopy {
  title: string;
  description: string;
}

export interface StepCopy {
  title: string;
  description: string;
}

export interface Dictionary {
  nav: {
    objectives: string;
    how: string;
    coverage: string;
    faq: string;
    cta: string;
  };
  banner: {
    /** Shown when the language was auto-detected. `{lang}` is replaced with the native language name. */
    message: string;
    keep: string;
    change: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    selectedLabel: string;
  };
  objectives: Record<ObjectiveId, ObjectiveCopy>;
  how: {
    heading: string;
    subheading: string;
    steps: StepCopy[];
  };
  trust: {
    heading: string;
    subheading: string;
    points: StepCopy[];
  };
  coverage: {
    heading: string;
    subheading: string;
    states: string;
    districts: string;
    opportunities: string;
    languages: string;
  };
  faq: {
    heading: string;
    items: { q: string; a: string }[];
  };
  cta: {
    heading: string;
    subheading: string;
    button: string;
  };
  journey: {
    welcomeTitle: string;
    welcomeMessage: string;
    begin: string;
    back: string;
    next: string;
    yes: string;
    no: string;
    progress: string;
    noticeTitle: string;
    reviewTitle: string;
    reviewSubtitle: string;
    confirm: string;
    contactTitle: string;
    contactSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    consentLabel: string;
    submit: string;
    skipContact: string;
    doneTitle: string;
    doneSubtitle: string;
    downloadProfile: string;
    backHome: string;
    errorRequired: string;
    errorEmail: string;
  };
  footer: {
    tagline: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    rights: string;
  };
}
