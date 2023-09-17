type KeyObject = {
  pem: string | Buffer;
  passphrase?: string | undefined;
};

type SecureVersion = 'TLSv1.3' | 'TLSv1.2' | 'TLSv1.1' | 'TLSv1';

type PxfObject = {
  buf: string | Buffer;
  passphrase?: string | undefined;
};

export type SecureContextOptions = {
  ca?: string | Buffer | Array<string | Buffer> | undefined;
  cert?: string | Buffer | Array<string | Buffer> | undefined;
  sigalgs?: string | undefined;
  ciphers?: string | undefined;
  clientCertEngine?: string | undefined;
  crl?: string | Buffer | Array<string | Buffer> | undefined;
  dhparam?: string | Buffer | undefined;
  ecdhCurve?: string | undefined;
  honorCipherOrder?: boolean | undefined;
  key?: string | Buffer | Array<string | Buffer | KeyObject> | undefined;
  privateKeyEngine?: string | undefined;
  maxVersion?: SecureVersion | undefined;
  minVersion?: SecureVersion | undefined;
  passphrase?: string | undefined;
  pfx?: string | Buffer | Array<string | Buffer | PxfObject> | undefined;
  secureOptions?: number | undefined;
  secureProtocol?: string | undefined;
  sessionIdContext?: string | undefined;
  ticketKeys?: Buffer | undefined;
  sessionTimeout?: number | undefined;
};
