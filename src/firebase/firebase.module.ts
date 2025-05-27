import { FirebaseService } from './firebase.service';

import { createFirebaseProvider } from './firebase.provider';
import { Module } from '@nestjs/common';
import { firebaseConfig } from 'src/common/types/firebase-credentials-config';

@Module({})
export class FirebaseModule {
  static forRoot(options: firebaseConfig) {
    const firebaseProvider = createFirebaseProvider(options);
    return {
      module: FirebaseModule,
      providers: [firebaseProvider, FirebaseService],
      exports: [FirebaseService],
    };
  }
}
