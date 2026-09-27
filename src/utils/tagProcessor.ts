// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import { Farghar } from '../types';
import * as mm from 'music-metadata-browser';

// Dynamic import for browser-id3-writer to avoid type issues
let ID3WriterClass: any = null;

// Cache object URLs to prevent memory leaks (keyed by Uint8Array reference)
const coverUrlCache = new Map<Uint8Array, string>();

async function getID3Writer(): Promise<any> {
  if (!ID3WriterClass) {
    const mod = await import('browser-id3-writer');
    ID3WriterClass = mod.ID3Writer;
  }
  return ID3WriterClass;
}

// Map ID3 picture type to our CoverType
function mapId3TypeToCoverType(id3Type: number): Farghar.CoverType {
  switch (id3Type) {
    case 3: return 'front';
    case 4: return 'back';
    case 5: return 'booklet';
    case 6: return 'artist';
    default: return 'other';
  }
}

export namespace FargharTagProcessor {
  export async function readTags(file: File): Promise<{ tags: Farghar.AudioTag; covers: Farghar.CoverArt[]; duration: number }> {
    try {
      const metadata = await mm.parseBlob(file);
      const common = metadata.common;
      const format = metadata.format;

      const tags: Farghar.AudioTag = {
        title: common.title || '',
        artist: common.artist || '',
        album: common.album || '',
        albumArtist: common.albumartist || '',
        trackNumber: common.track && common.track.no ? String(common.track.no) : '',
        discNumber: common.disk && common.disk.no ? String(common.disk.no) : '',
        genre: common.genre ? (Array.isArray(common.genre) ? common.genre[0] : common.genre) : '',
        year: common.year ? String(common.year) : '',
        composer: common.composer ? (Array.isArray(common.composer) ? common.composer[0] : common.composer) : '',
        lyricist: common.lyricist ? (Array.isArray(common.lyricist) ? common.lyricist[0] : common.lyricist) : '',
        arranger: (common as any).arranger || '',
        producer: (common as any).producer || '',
        copyright: common.copyright || '',
        publisher: (common as any).publisher || '',
        comment: common.comment ? (Array.isArray(common.comment) ? common.comment[0] : common.comment) : '',
        lyrics: common.lyrics ? (Array.isArray(common.lyrics) ? common.lyrics[0] : common.lyrics) : '',
        isrc: (common as any).isrc ? (Array.isArray((common as any).isrc) ? (common as any).isrc[0] : (common as any).isrc) : '',
        bpm: common.bpm ? String(common.bpm) : '',
        key: (common as any).key || '',
      };

      const covers: Farghar.CoverArt[] = [];
      if (common.picture && common.picture.length > 0) {
        common.picture.forEach((pic, index) => {
          const id3Type = (pic as any).type || (index === 0 ? 3 : 0);
          covers.push({
            pictureData: pic.data,
            mimeType: pic.format || 'image/jpeg',
            description: (pic as any).description || `Cover ${index + 1}`,
            type: id3Type,
            coverType: mapId3TypeToCoverType(id3Type),
          });
        });
      }

      return { tags, covers, duration: format.duration || 0 };
    } catch (error) {
      console.error('Error reading tags:', error);
      return { tags: { ...Farghar.EMPTY_TAG }, covers: [], duration: 0 };
    }
  }

  export async function writeTags(file: File, tags: Farghar.AudioTag, covers: Farghar.CoverArt[]): Promise<Blob> {
    if (!file) {
      throw new Error('File object is required for writing tags');
    }
    const arrayBuffer = await file.arrayBuffer();
    const WriterClass = await getID3Writer();
    const writer = new WriterClass(arrayBuffer);

    if (tags.title) writer.setFrame('TIT2', tags.title);
    if (tags.artist) writer.setFrame('TPE1', [tags.artist]);
    if (tags.album) writer.setFrame('TALB', tags.album);
    if (tags.albumArtist) writer.setFrame('TPE2', [tags.albumArtist]);
    if (tags.year) writer.setFrame('TYER', tags.year);
    if (tags.genre) writer.setFrame('TCON', [tags.genre]);
    if (tags.trackNumber) writer.setFrame('TRCK', tags.trackNumber);
    if (tags.discNumber) writer.setFrame('TPOS', tags.discNumber);
    if (tags.composer) writer.setFrame('TCOM', [tags.composer]);
    if (tags.lyricist) writer.setFrame('TEXT', [tags.lyricist]);
    if (tags.arranger) writer.setFrame('TPE4', [tags.arranger]);
    if (tags.producer) writer.setFrame('TPE3', [tags.producer]);
    if (tags.copyright) writer.setFrame('TCOP', tags.copyright);
    if (tags.publisher) writer.setFrame('TPUB', tags.publisher);
    if (tags.comment) writer.setFrame('COMM', { description: '', text: tags.comment });
    if (tags.lyrics) writer.setFrame('USLT', { description: '', lyrics: tags.lyrics });
    if (tags.isrc) writer.setFrame('TSRC', tags.isrc);
    if (tags.bpm) writer.setFrame('TBPM', tags.bpm);
    if (tags.key) writer.setFrame('TKEY', tags.key);

    // Write all covers
    if (covers && covers.length > 0) {
      covers.forEach(cover => {
        if (cover.pictureData) {
          writer.setFrame('APIC', {
            type: cover.type || 3,
            data: cover.pictureData,
            description: cover.description || 'Cover',
          });
        }
      });
    }

    writer.addTag();
    const taggedBuffer = writer.arrayBuffer;
    return new Blob([taggedBuffer], { type: 'audio/mpeg' });
  }

  export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  export function getFormat(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext;
  }

  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  export function formatDuration(seconds: number): string {
    if (!seconds || seconds === 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  export function isSupportedFormat(fileName: string): boolean {
    const ext = getFormat(fileName);
    return Farghar.SUPPORTED_FORMATS.includes(ext as Farghar.SupportedFormat);
  }

  // Return cached object URL for a cover (creates one if not cached)
  export function coverToDataUrl(cover: Farghar.CoverArt | null): string {
    if (!cover || !cover.pictureData) return '';
    const data = cover.pictureData as Uint8Array;
    const cached = coverUrlCache.get(data);
    if (cached) return cached;
    const blob = new Blob([data as any], { type: cover.mimeType });
    const url = URL.createObjectURL(blob);
    coverUrlCache.set(data, url);
    return url;
  }

  // Revoke a single cover URL by data reference
  export function revokeCoverUrl(data: Uint8Array | null): void {
    if (!data) return;
    const url = coverUrlCache.get(data);
    if (url) {
      URL.revokeObjectURL(url);
      coverUrlCache.delete(data);
    }
  }

  // Revoke all cached cover URLs (call on clear all)
  export function revokeAllCoverUrls(): void {
    coverUrlCache.forEach(url => URL.revokeObjectURL(url));
    coverUrlCache.clear();
  }

  export function coversToDataUrls(covers: Farghar.CoverArt[]): string[] {
    return covers.map(cover => coverToDataUrl(cover));
  }
}
