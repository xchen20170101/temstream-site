export type DownloadKind = 'client' | 'server';

export type DownloadItem = {
  id: string;
  kind: DownloadKind;
  label: { zh: string; en: string };
  platform: string;
  arch: string;
  version: string;
  /**
   * Release asset file name. This is the join key used to look up the
   * real byte size from the upstream release metadata — sizes are NOT
   * hardcoded here (see `lib/download-sizes.ts`). If the lookup fails,
   * the card simply omits the size instead of showing a guess.
   */
  fileName: string;
  /**
   * Short human-readable description of the package (used as the
   * card body text — NOT a duplicate of `arch`). E.g. "Zip archive,
   * full client" / "Universal APK (ARM64 / x86_64)".
   */
  packageLabel: { zh: string; en: string };
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
 * the per-card "mirror" link.
 */
const GITHUB_RELEASES = 'https://github.com/xchen20170101/temstream_release/releases';
const GITEE_RELEASES = 'https://gitee.com/davidchen01/temstream_release/releases';

/**
 * WAN release tag. Exported because the real file sizes are resolved
 * per tag at request time (`lib/download-sizes.ts`) — the tag is the
 * authoritative pointer to the asset list, so a new release only needs
 * this constant bumped.
 */
export const WAN_TAG = 'v0.4';

/** LAN-specific release tag (independently rotated from the WAN tag). */
export const LAN_TAG = 'lan_v0.4';

/**
 * Sizes used to be hardcoded per item, and they had drifted badly (the
 * cards claimed 15/8/12 MB while the real v0.4 assets are ~55/47/79 MB).
 * Each item now only declares its asset `fileName`; the real byte count
 * comes from the upstream release metadata at render time, and an
 * unknown size is omitted rather than guessed.
 */
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
    fileName: 'moonlight-windows-amd64.zip',
    packageLabel: {
      zh: '压缩包，含完整客户端',
      en: 'Zip archive, full client',
    },
    urlZh: `${GITEE_RELEASES}/download/${WAN_TAG}/moonlight-windows-amd64.zip`,
    urlEn: `${GITHUB_RELEASES}/download/${WAN_TAG}/moonlight-windows-amd64.zip`,
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
    fileName: 'temstream.apk',
    packageLabel: {
      zh: '通用 APK（含 ARM64 / x86_64）',
      en: 'Universal APK (ARM64 / x86_64)',
    },
    urlZh: `${GITEE_RELEASES}/download/${WAN_TAG}/temstream.apk`,
    urlEn: `${GITHUB_RELEASES}/download/${WAN_TAG}/temstream.apk`,
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
    fileName: 'Sunshine-Windows-AMD64-installer.exe',
    packageLabel: {
      zh: 'Windows 安装版（含 ViGEmBus 等驱动）',
      en: 'Windows installer (includes ViGEmBus, etc.)',
    },
    urlZh: `${GITEE_RELEASES}/download/${WAN_TAG}/Sunshine-Windows-AMD64-installer.exe`,
    urlEn: `${GITHUB_RELEASES}/download/${WAN_TAG}/Sunshine-Windows-AMD64-installer.exe`,
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
    fileName: 'moonlight-windows-amd64.zip',
    packageLabel: {
      zh: '压缩包，含完整客户端',
      en: 'Zip archive, full client',
    },
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
    fileName: 'temstream.apk',
    packageLabel: {
      zh: '通用 APK（含 ARM64 / x86_64）',
      en: 'Universal APK (ARM64 / x86_64)',
    },
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
    fileName: 'Sunshine-Windows-AMD64-installer.exe',
    packageLabel: {
      zh: 'Windows 安装版（含 ViGEmBus 等驱动）',
      en: 'Windows installer (includes ViGEmBus, etc.)',
    },
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

/**
 * Format a real byte count as a human-readable size.
 *
 * Returns `null` when the size is unknown so callers can render nothing
 * at all — we never fall back to "unknown" / "0 B" / a guessed number.
 *
 * Precision: above 1 GB one decimal, above 1 MB one decimal with a
 * trailing `.0` trimmed (46.6 MB stays 46.6 MB, 12.0 MB becomes 12 MB),
 * below 1 MB whole KB.
 */
export function formatSize(bytes: number | null | undefined): string | null {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }
  if (bytes >= 1024 * 1024 * 1024) {
    return `${trimZero(bytes / (1024 * 1024 * 1024))} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${trimZero(bytes / (1024 * 1024))} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

/** 46.60 -> "46.6", 12.00 -> "12". */
function trimZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}
