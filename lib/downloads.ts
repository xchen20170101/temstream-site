export type DownloadKind = 'client' | 'server';

export type DownloadItem = {
  id: string;
  kind: DownloadKind;
  label: { zh: string; en: string };
  platform: string;
  arch: string;
  version: string;
  sizeLabel: { zh: string; en: string };
  /** Direct outbound link to GitHub release asset / store page. */
  url: string;
  /** Optional "view all releases" link for the same project. */
  releasesUrl?: string;
};

export const downloads: DownloadItem[] = [
  {
    id: 'moonlight-windows-x64',
    kind: 'client',
    label: {
      zh: 'Moonlight Windows 客户端',
      en: 'Moonlight Windows client',
    },
    platform: 'Windows',
    arch: 'x64',
    version: 'v6.1.0',
    sizeLabel: { zh: '约 25 MB', en: '~25 MB' },
    url: 'https://github.com/moonlight-stream/moonlight-qt/releases/download/v6.1.0/MoonlightSetup-6.1.0.exe',
    releasesUrl: 'https://github.com/moonlight-stream/moonlight-qt/releases',
  },
  {
    id: 'moonlight-android-apk',
    kind: 'client',
    label: {
      zh: 'Moonlight Android (APK 直链)',
      en: 'Moonlight Android (APK)',
    },
    platform: 'Android',
    arch: 'universal APK',
    version: 'v12.1',
    sizeLabel: { zh: '约 6.5 MB', en: '~6.5 MB' },
    url: 'https://github.com/moonlight-stream/moonlight-android/releases/download/v12.1/app-nonRoot-release.apk',
    releasesUrl: 'https://github.com/moonlight-stream/moonlight-android/releases',
  },
  {
    id: 'moonlight-android-play',
    kind: 'client',
    label: {
      zh: 'Moonlight Android (Google Play)',
      en: 'Moonlight Android (Google Play)',
    },
    platform: 'Android',
    arch: 'Google Play',
    version: 'v12.1',
    sizeLabel: { zh: '由 Google Play 分发', en: 'via Google Play' },
    url: 'https://play.google.com/store/apps/details?id=com.limelight',
    releasesUrl: 'https://github.com/moonlight-stream/moonlight-android/releases',
  },
  {
    id: 'sunshine-windows-installer',
    kind: 'server',
    label: {
      zh: 'Sunshine Windows 安装版',
      en: 'Sunshine Windows installer',
    },
    platform: 'Windows',
    arch: 'AMD64',
    version: 'Latest',
    sizeLabel: { zh: '约 24 MB', en: '~24 MB' },
    url: 'https://github.com/LizardByte/Sunshine/releases/latest',
    releasesUrl: 'https://github.com/LizardByte/Sunshine/releases',
  },
  {
    id: 'sunshine-windows-portable',
    kind: 'server',
    label: {
      zh: 'Sunshine Windows 便携版',
      en: 'Sunshine Windows portable',
    },
    platform: 'Windows',
    arch: 'AMD64',
    version: 'Latest',
    sizeLabel: { zh: '约 24 MB', en: '~24 MB' },
    url: 'https://github.com/LizardByte/Sunshine/releases/latest',
    releasesUrl: 'https://github.com/LizardByte/Sunshine/releases',
  },
];

export function getDownload(id: string): DownloadItem | undefined {
  return downloads.find((d) => d.id === id);
}