import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cheatsheet');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

const sectionKeys = [
  'basicMovement',
  'modeSwitch',
  'editing',
  'copyPaste',
  'undoRedo',
  'searchReplace',
  'commandLine',
  'combinations',
] as const;

const colors = [
  'var(--blue)',
  'var(--green)',
  'var(--red)',
  'var(--purple)',
  'var(--orange)',
  'var(--cyan)',
  'var(--yellow)',
  'var(--orange)',
];

export default async function CheatsheetPage() {
  const t = await getTranslations('cheatsheet');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sectionKeys.map((sectionKey, idx) => {
          const commands = t.raw(`sections.${sectionKey}.commands`) as Record<string, string>;
          const color = colors[idx];

          return (
            <div
              key={sectionKey}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--surface-hover)',
              }}
            >
              <div
                className="px-4 py-2.5 text-sm font-semibold"
                style={{
                  color,
                  borderBottom: '1px solid var(--surface-hover)',
                }}
              >
                {t(`sections.${sectionKey}.title`)}
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--surface-hover)' }}>
                {Object.entries(commands).map(([key, desc]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-2"
                    style={{ borderColor: 'rgba(65, 72, 104, 0.4)' }}
                  >
                    <code
                      className="font-mono text-sm px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--bg)',
                        color,
                      }}
                    >
                      {key}
                    </code>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
