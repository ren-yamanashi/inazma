import * as fs from 'fs';
import { FileSystemInterface } from '../interfaces/fileSystem.interface';

export class FileSystem implements FileSystemInterface {
  public writeFileSync = fs.writeFileSync;
  public readFileSync = fs.readFileSync;
}
