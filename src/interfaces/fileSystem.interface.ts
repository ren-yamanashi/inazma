type PathLike = string | Buffer | URL;

type PathOrFileDescriptor = PathLike | number;

export interface FileSystemInterface {
  writeFileSync(filePath: PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView): void;
  readFileSync(
    path: PathOrFileDescriptor,
    options?: {
      encoding?: BufferEncoding;
      flag?: string | undefined;
    } | null,
  ): string | Buffer;
}
