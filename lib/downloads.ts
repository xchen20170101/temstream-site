export type DownloadKind = 'client' | 'server';

export type DownloadItem = {
  id: string;
  kind: DownloadKind;
  label: { zh: string; en: string };
  platform: string;
  arch: string;
  version: string;
  sizeLabel: { zh: string; en: string };
  /** Primary download link served to zh visitors (typically the gitee mirror). */
  urlZh: string;
  /** Backup mirror served to zh visitors, and primary link for en visitors (typically GitHub). */
  urlEn: string;
  /** Optional "view all releases" link in the zh-mirror domain. */
  releasesUrlZh?: string;
  /** Optional "view all releases" link in the en-mirror domain. */
  releasesUrlEn?: string;
};

/**
 * temstream_release mirrors. Both URLs ship the same v0.4 build.
 * zh visitors land on gitee by default (faster in mainland China);
 * en visitors land on github by default; either side can switch via
 * the per-card "mirror" button.
 */
const GITHUB_RELEASES = 'https://github.com/xchen20170101/temstream_release/releases';
const GITEE_RELEASES = 'https://gitee.com/davidchen01/temstream_release/releases';

/** LAN-specific release tag. */
const LAN_TAG = 'lan_v0.4';

export const downloads: DownloadItem[] = [
  {
    id: 'moonlight-windows-x64',
    kind: 'client',
    label: {
      zh: 'Moonlight Windows 客户端',
      en: 'Moonlight Windows client',
    },
    platform: 'Windows',
    arch: 'AMD64 (zip)',
    version: 'v0.4',
    sizeLabel: { zh: '压缩包，含完整客户端', en: 'Zip archive, full client' },
    urlZh: `${GITEE_RELEASES}/download/v0.4/moonlight-windows-amd64.zip`,
    urlEn: `${GITHUB_RELEASES}/download/v0.4/moonlight-windows-amd64.zip`,
    releasesUrlZh: GITEE_RELEASES,
    releasesUrlEn: GITHUB_RELEASES,
  },
  {
    id: 'moonlight-android-apk',
    kind: 'client',
    label: {
      zh: 'Moonlight Android 客户端',
      en: 'Moonlight Android client',
    },
    platform: 'Android',
    arch: 'universal APK',
    version: 'v0.4',
    sizeLabel: { zh: '通用 APK（含 ARM64 / x86_64）', en: 'Universal APK (ARM64 / x86_64)' },
    urlZh: `${GITEE_RELEASES}/download/v0.4/temstream.apk`,
    urlEn: `${GITHUB_RELEASES}/download/v0.4/temstream.apk`,
    releasesUrlZh: GITEE_RELEASES,
    releasesUrlEn: GITHUB_RELEASES,
  },
  {
    id: 'sunshine-windows-installer',
    kind: 'server',
    label: {
      zh: 'Sunshine Windows 服务端',
      en: 'Sunshine Windows host',
    },
    platform: 'Windows',
    arch: 'AMD64 (installer)',
    version: 'v0.4',
    sizeLabel: { zh: 'Windows 安装版（含 ViGEmBus 等驱动）', en: 'Windows installer (includes ViGEmBus, etc.)' },
    urlZh: `${GITEE_RELEASES}/download/v0.4/Sunshine-Windows-AMD64-installer.exe`,
    urlEn: `${GITHUB_RELEASES}/download/v0.4/Sunshine-Windows-AMD64-installer.exe`,
    releasesUrlZh: GITEE_RELEASES,
    releasesUrlEn: GITHUB_RELEASES,
  },
];

/**
 * LAN-only downloads.  Same files as the WAN downloads but tagged
 * lan_v0.4 so that they can be updated / rotated independently of the
 * WAN releases.
 */
export const downloadsLan: DownloadItem[] = [
  {
    id: 'moonlight-windows-x64',
    kind: 'client',
    label: {
      zh: 'Moonlight Windows 客户端',
      en: 'Moonlight Windows client',
    },
    platform: 'Windows',
    arch: 'AMD64 (zip)',
    version: 'v0.4',
    sizeLabel: { zh: '压缩包，含完整客户端', en: 'Zip archive, full client' },
    urlZh: `${GITEE_RELEASES}/download/${LAN_TAG}/moonlight-windows-amd64.zip`,
    urlEn: `${GITHUB_RELEASES}/download/${LAN_TAG}/moonlight-windows-amd64.zip`,
    releasesUrlZh: GITEE_RELEASES,
    releasesUrlEn: GITHUB_RELEASES,
  },
  {
    id: 'moonlight-android-apk',
    kind: 'client',
    label: {
      zh: 'Moonlight Android 客户端',
      en: 'Moonlight Android client',
    },
    platform: 'Android',
    arch: 'universal APK',
    version: 'v0.4',
    sizeLabel: { zh: '通用 APK（含 ARM64 / x86_64）', en: 'Universal APK (ARM64 / x86_64)' },
    urlZh: `${GITEE_RELEASES}/download/${LAN_TAG}/temstream.apk`,
    urlEn: `${GITHUB_RELEASES}/download/${LAN_TAG}/temstream.apk`,
    releasesUrlZh: GITEE_RELEASES,
    releasesUrlEn: GITHUB_RELEASES,
  },
  {
    id: 'sunshine-windows-installer',
    kind: 'server',
    label: {
      zh: 'Sunshine Windows 服务端',
      en: 'Sunshine Windows host',
    },
    platform: 'Windows',
    arch: 'AMD64 (installer)',
    version: 'v0.4',
    sizeLabel: { zh: 'Windows 安装版（含 ViGEmBus 等驱动）', en: 'Windows installer (includes ViGEmBus, etc.)' },
    urlZh: `${GITEE_RELEASES}/download/${LAN_TAG}/Sunshine-Windows-AMD64-installer.exe`,
    urlEn: `${GITHUB_RELEASES}/download/${LAN_TAG}/Sunshine-Windows-AMD64-installer.exe`,
    releasesUrlZh: GITEE_RELEASES,
    releasesUrlEn: GITHUB_RELEASES,
  },
];

export function getDownload(id: string): DownloadItem | undefined {
  return downloads.find((d) => d.id === id);
}

/** Pick the primary download URL based on the active locale. */
export function primaryUrl(item: DownloadItem, locale: string): string {
  return locale === 'zh' ? item.urlZh : item.urlEn;
}

/** Pick the mirror (backup) URL based on the active locale. */
export function mirrorUrl(item: DownloadItem, locale: string): string {
  return locale === 'zh' ? item.urlEn : item.urlZh;
}

/** Pick the "view all releases" URL based on the active locale. */
export function releasesUrlFor(item: DownloadItem, locale: string): string | undefined {
  return locale === 'zh' ? item.releasesUrlZh : item.releasesUrlEn;
}