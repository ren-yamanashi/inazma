import { FileSystemInterface } from '../../interfaces/fileSystem.interface';

export class FileSystemMock implements FileSystemInterface {
  public writeFileSync() {
    return;
  }
  public readFileSync(): string | Buffer {
    return '';
  }
}
