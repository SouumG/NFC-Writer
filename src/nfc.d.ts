interface Window {
  NDEFReader?: any;
}

interface NDEFRecordInit {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: any;
}

interface NDEFMessageInit {
  records: NDEFRecordInit[];
}

interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

interface NDEFScanOptions {
  signal?: AbortSignal;
}

interface NDEFMakeReadOnlyOptions {
  signal?: AbortSignal;
}

declare class NDEFReader {
  constructor();
  scan(options?: NDEFScanOptions): Promise<void>;
  write(
    message: NDEFMessageInit | string | BufferSource,
    options?: NDEFWriteOptions
  ): Promise<void>;
  makeReadOnly(options?: NDEFMakeReadOnlyOptions): Promise<void>;
  onreading: (this: NDEFReader, ev: NDEFReadingEvent) => any;
  onreadingerror: (this: NDEFReader, ev: Event) => any;
}

interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFRecord {
  readonly recordType: string;
  readonly mediaType: string | null;
  readonly id: string | null;
  readonly data: DataView | null;
  toRecords?: () => NDEFRecord[];
}
