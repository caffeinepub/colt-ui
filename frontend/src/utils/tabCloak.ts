export type TabCloakPreset = 'default' | 'google' | 'clever' | 'googleClassroom' | 'youtube';

export const CLOAK_PRESETS: Record<TabCloakPreset, { title: string; faviconUrl: string; label: string }> = {
  default: {
    title: 'COLT UI',
    faviconUrl: '/favicon.ico',
    label: 'Default / Colt UI',
  },
  google: {
    title: 'Google',
    faviconUrl: 'https://www.google.com/favicon.ico',
    label: 'Google',
  },
  clever: {
    title: 'Clever',
    faviconUrl: 'https://clever.com/favicon.ico',
    label: 'Clever.com',
  },
  googleClassroom: {
    title: 'Google Classroom',
    faviconUrl: 'https://ssl.gstatic.com/classroom/favicon.png',
    label: 'Google Classroom',
  },
  youtube: {
    title: 'YouTube',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    label: 'YouTube',
  },
};

export function setTabCloak(preset: TabCloakPreset): void {
  const config = CLOAK_PRESETS[preset] || CLOAK_PRESETS.default;
  document.title = config.title;

  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = config.faviconUrl;
}
