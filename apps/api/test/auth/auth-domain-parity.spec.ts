import * as fs from 'fs';
import * as path from 'path';

import { OTP_PURPOSES } from '../../../../packages/contracts/src/auth';
import { AUTH_ALLOWED_OTP_PURPOSES } from '../../../../packages/validation/src/schemas/auth.schema';

describe('Auth Domain Parity', () => {
  it('keeps OTP purposes in validation aligned with contracts', () => {
    expect(AUTH_ALLOWED_OTP_PURPOSES).toEqual(OTP_PURPOSES);
  });

  it('prevents duplicated inline OTP purpose arrays in auth/otp DTOs', () => {
    const apiRoot = path.resolve(__dirname, '../..');
    const files = [
      path.join(apiRoot, 'src/otp/dto/send-otp.dto.ts'),
      path.join(apiRoot, 'src/otp/dto/verify-otp.dto.ts'),
      path.join(apiRoot, 'src/otp/dto/resend-otp.dto.ts'),
    ];

    for (const file of files) {
      if (!fs.existsSync(file)) {
        continue;
      }
      const content = fs.readFileSync(file, 'utf8');
      expect(content).not.toContain(
        "['email_verification', 'password_reset', '2fa', 'login_verification']"
      );
    }
  });
});
