import type { MetadataRoute } from 'next';
import { allLessons } from '@/lessons/lessonRegistry';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://way2vim.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/lessons', '/playground', '/cheatsheet'];
  const priorities = [1, 0.9, 0.7, 0.8];

  const staticPages: MetadataRoute.Sitemap = staticRoutes.flatMap((route, idx) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: priorities[idx],
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}${route}`])
        ),
      },
    }))
  );

  const lessonPages: MetadataRoute.Sitemap = allLessons.flatMap((lesson) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/lessons/${lesson.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}/lessons/${lesson.id}`])
        ),
      },
    }))
  );

  return [...staticPages, ...lessonPages];
}
