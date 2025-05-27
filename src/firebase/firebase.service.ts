// src/firebase/firebase.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { App as FirebaseApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { FIREBASE } from './firebase.provider';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(@Inject(FIREBASE) private readonly firebaseApp: FirebaseApp) {}

  uploadFile(bucketName: string, filePath: string, file: Buffer) {
    return getStorage(this.firebaseApp)
      .bucket(bucketName)
      .file(filePath)
      .save(file);
  }
  // async getFileBuffer
}
