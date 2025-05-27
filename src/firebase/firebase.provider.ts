import { Provider } from '@nestjs/common';
import admin from 'firebase-admin';
import { firebaseConfig } from 'src/common/types/firebase-credentials-config';

export const FIREBASE = 'FIREBASE';

export const createFirebaseProvider = (options: firebaseConfig): Provider => {
  return {
    provide: FIREBASE,
    useFactory: () => {
      if (admin.apps.length > 0) {
        return admin.apps[0] as admin.app.App;
      } else {
        return admin.initializeApp({
          credential: admin.credential.cert({
            privateKey: options.privateKey,
            clientEmail: options.clientEmail,
            projectId: options.projectId,
          }),
          storageBucket: options.storageBucket,
        });
      }
    },
  };
};
