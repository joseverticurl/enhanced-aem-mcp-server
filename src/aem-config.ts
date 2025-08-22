// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="node" />

export interface AEMConfig {
  contentPaths: {
    sitesRoot: string;
    assetsRoot: string;
    templatesRoot: string;
    experienceFragmentsRoot: string;
  };
  replication: {
    publisherUrls: string[];
    defaultReplicationAgent: string;
  };
  components: {
    allowedTypes: string[];
    defaultProperties: Record<string, any>;
  };
  queries: {
    maxLimit: number;
    defaultLimit: number;
    timeoutMs: number;
  };
  validation: {
    maxDepth: number;
    allowedLocales: string[];
  };
}

export const DEFAULT_AEM_CONFIG: AEMConfig = {
  contentPaths: {
    sitesRoot: process.env.AEM_SITES_ROOT || '/content',
    assetsRoot: process.env.AEM_ASSETS_ROOT || '/content/dam',
    templatesRoot: process.env.AEM_TEMPLATES_ROOT || '/conf',
    experienceFragmentsRoot: process.env.AEM_XF_ROOT || '/content/experience-fragments',
  },
  replication: {
    publisherUrls: process.env.AEM_PUBLISHER_URLS?.split(',') || ['http://localhost:4503'],
    defaultReplicationAgent: process.env.AEM_DEFAULT_AGENT || 'publish',
  },
  components: {
    allowedTypes: process.env.AEM_ALLOWED_COMPONENTS?.split(',') || [
      'text', 'image', 'hero', 'button', 'list', 'teaser', 'carousel'
    ],
    defaultProperties: {
      'jcr:primaryType': 'nt:unstructured',
      'sling:resourceType': 'foundation/components/text'
    },
  },
  queries: {
    maxLimit: parseInt(process.env.AEM_QUERY_MAX_LIMIT || '100'),
    defaultLimit: parseInt(process.env.AEM_QUERY_DEFAULT_LIMIT || '20'),
    timeoutMs: parseInt(process.env.AEM_QUERY_TIMEOUT || '30000'),
  },
  validation: {
    maxDepth: parseInt(process.env.AEM_MAX_DEPTH || '5'),
    allowedLocales: ['en'],
  },
};

export function getAEMConfig(): AEMConfig {
  return DEFAULT_AEM_CONFIG;
}

export function isValidContentPath(path: string, config: AEMConfig = DEFAULT_AEM_CONFIG): boolean {
  const allowedRoots = Object.values(config.contentPaths);
  return allowedRoots.some(root => path.startsWith(root));
}

export function isValidComponentType(componentType: string, config: AEMConfig = DEFAULT_AEM_CONFIG): boolean {
  return config.components.allowedTypes.includes(componentType);
}

export function isValidLocale(locale: string, config: AEMConfig = DEFAULT_AEM_CONFIG): boolean {
  if (!locale) return false;
  const normalized = locale.toLowerCase();
  return config.validation.allowedLocales.some(l => l.toLowerCase() === normalized ||
    (normalized === 'en' && l.toLowerCase().startsWith('en')));
} 