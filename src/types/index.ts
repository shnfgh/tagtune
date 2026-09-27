// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
export namespace Farghar {
  export interface AudioTag {
    title: string;
    artist: string;
    album: string;
    albumArtist: string;
    trackNumber: string;
    discNumber: string;
    genre: string;
    year: string;
    composer: string;
    lyricist: string;
    arranger: string;
    producer: string;
    copyright: string;
    publisher: string;
    comment: string;
    lyrics: string;
    isrc: string;
    bpm: string;
    key: string;
  }

  export const EMPTY_TAG: AudioTag = {
    title: '', artist: '', album: '', albumArtist: '', trackNumber: '', discNumber: '',
    genre: '', year: '', composer: '', lyricist: '', arranger: '', producer: '',
    copyright: '', publisher: '', comment: '', lyrics: '', isrc: '', bpm: '', key: '',
  };

  export interface CoverArt {
    pictureData: Uint8Array | null;
    mimeType: string;
    description: string;
    type: number;
  }

  export interface AudioFile {
    id: string;
    file: File;
    name: string;
    size: number;
    format: string;
    tags: AudioTag;
    cover: CoverArt | null;
    duration: number;
    status: 'loading' | 'ready' | 'editing' | 'done' | 'error';
    modified: boolean;
  }

  export interface ProcessingState {
    isProcessing: boolean;
    progress: number;
    currentFile: string;
    totalFiles: number;
    processedFiles: number;
  }

  export type SupportedFormat = 'mp3' | 'mp4' | 'm4a' | 'wav' | 'flac' | 'ogg' | 'mkv' | 'mov' | 'flv';
  export const SUPPORTED_FORMATS: SupportedFormat[] = ['mp3', 'mp4', 'm4a', 'wav', 'flac', 'ogg', 'mkv', 'mov', 'flv'];

  export const GENRES = [
    'Blues', 'Classic Rock', 'Country', 'Dance', 'Disco', 'Funk', 'Grunge', 'Hip-Hop', 'Jazz', 'Metal',
    'New Age', 'Oldies', 'Other', 'Pop', 'R&B', 'Rap', 'Reggae', 'Rock', 'Techno', 'Industrial',
    'Alternative', 'Ska', 'Death Metal', 'Pranks', 'Soundtrack', 'Euro-Techno', 'Ambient', 'Trip-Hop',
    'Vocal', 'Jazz+Funk', 'Fusion', 'Trance', 'Classical', 'Instrumental', 'Acid', 'House', 'Game',
    'Sound Clip', 'Gospel', 'Noise', 'AlternRock', 'Bass', 'Soul', 'Punk', 'Space', 'Meditative',
    'Instrumental Pop', 'Instrumental Rock', 'Ethnic', 'Gothic', 'Darkwave', 'Techno-Industrial',
    'Electronic', 'Pop-Folk', 'Eurodance', 'Dream', 'Southern Rock', 'Comedy', 'Cult', 'Gangsta',
    'Top 40', 'Christian Rap', 'Pop/Funk', 'Jungle', 'Native American', 'Cabaret', 'New Wave',
    'Psychedelic', 'Rave', 'Showtunes', 'Trailer', 'Lo-Fi', 'Tribal', 'Acid Punk', 'Acid Jazz',
    'Polka', 'Retro', 'Musical', 'Rock & Roll', 'Hard Rock',
  ];

  export const MUSICAL_KEYS = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
    'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gbm', 'Gm', 'G#m', 'Abm', 'Am', 'A#m', 'Bbm', 'Bm',
  ];
}
