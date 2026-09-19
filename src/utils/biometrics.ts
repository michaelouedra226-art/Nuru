/**
 * Authentification biométrique native (WebAuthn / Passkeys)
 * Supporte le capteur d'empreinte digitale Android et la reconnaissance faciale
 * Fonctionne 100% hors-ligne via l'authentificateur de plateforme locale
 */

const CREDENTIAL_ID_KEY = 'nuru_biometric_cred_id';

export async function isBiometricsAvailable(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return false;
  }
  try {
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return Boolean(isAvailable);
  } catch {
    return false;
  }
}

export function hasRegisteredBiometrics(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(CREDENTIAL_ID_KEY));
}

export async function registerBiometrics(userName: string): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Nuru Sanctuaire',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: userName || 'utilisatrice_nuru',
          displayName: userName || 'Utilisatrice Nuru',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;

    if (credential && credential.id) {
      localStorage.setItem(CREDENTIAL_ID_KEY, credential.id);
      return true;
    }
    return false;
  } catch {
    // Si annulé ou refusé par l'utilisateur
    return false;
  }
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;

  try {
    const storedCredId = localStorage.getItem(CREDENTIAL_ID_KEY);
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const getOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
        ...(storedCredId
          ? {
              allowCredentials: [
                {
                  type: 'public-key',
                  id: Uint8Array.from(atob(storedCredId), (c) => c.charCodeAt(0)),
                },
              ],
            }
          : {}),
      },
    };

    const assertion = await navigator.credentials.get(getOptions);
    return Boolean(assertion);
  } catch {
    return false;
  }
}

export function clearBiometricsRegistration(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CREDENTIAL_ID_KEY);
  }
}
