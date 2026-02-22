import { SignupCreditsService } from '../../src/billing/signup-credits.service';

describe('SignupCreditsService', () => {
  function createService() {
    const prisma = {
      client: {
        user: {
          updateMany: jest.fn(),
        },
      },
    } as any;

    const lago = {
      createCustomer: jest.fn(),
      getWallet: jest.fn(),
      topUpWallet: jest.fn(),
      createWallet: jest.fn(),
    } as any;

    const billingConfig = {
      lagoEnabled: true,
    } as any;

    const service = new SignupCreditsService(prisma, lago, billingConfig);
    return { service, prisma, lago, billingConfig };
  }

  it('skips when Lago is disabled', async () => {
    const { service, billingConfig, prisma, lago } = createService();
    billingConfig.lagoEnabled = false;

    await service.grantSignupBonusIfEligible('user_1');

    expect(prisma.client.user.updateMany).not.toHaveBeenCalled();
    expect(lago.createCustomer).not.toHaveBeenCalled();
  });

  it('skips when user is not eligible', async () => {
    const { service, prisma, lago } = createService();
    prisma.client.user.updateMany.mockResolvedValue({ count: 0 });

    await service.grantSignupBonusIfEligible('user_1');

    expect(prisma.client.user.updateMany).toHaveBeenCalledTimes(1);
    expect(lago.createCustomer).not.toHaveBeenCalled();
  });

  it('tops up existing wallet for eligible user', async () => {
    const { service, prisma, lago } = createService();
    prisma.client.user.updateMany.mockResolvedValue({ count: 1 });
    lago.getWallet.mockResolvedValue({ lago_id: 'wallet_1' });

    await service.grantSignupBonusIfEligible('user_1');

    expect(lago.createCustomer).toHaveBeenCalledWith('user_1');
    expect(lago.topUpWallet).toHaveBeenCalledWith('wallet_1', 200);
    expect(lago.createWallet).not.toHaveBeenCalled();
  });

  it('creates wallet when user has no wallet', async () => {
    const { service, prisma, lago } = createService();
    prisma.client.user.updateMany.mockResolvedValue({ count: 1 });
    lago.getWallet.mockResolvedValue(null);

    await service.grantSignupBonusIfEligible('user_1');

    expect(lago.createWallet).toHaveBeenCalledWith('user_1', 200);
    expect(lago.topUpWallet).not.toHaveBeenCalled();
  });

  it('rolls claim marker back on wallet grant failure', async () => {
    const { service, prisma, lago } = createService();
    prisma.client.user.updateMany.mockResolvedValue({ count: 1 });
    lago.getWallet.mockResolvedValue({ lago_id: 'wallet_1' });
    lago.topUpWallet.mockRejectedValue(new Error('lago unavailable'));

    await expect(service.grantSignupBonusIfEligible('user_1')).rejects.toThrow('lago unavailable');

    expect(prisma.client.user.updateMany).toHaveBeenCalledTimes(2);
    const claimCall = prisma.client.user.updateMany.mock.calls[0][0];
    const rollbackCall = prisma.client.user.updateMany.mock.calls[1][0];

    expect(claimCall.where).toMatchObject({
      id: 'user_1',
      isEmailVerified: true,
      signupBonusGrantedAt: null,
    });
    expect(rollbackCall.where.id).toBe('user_1');
    expect(rollbackCall.where.signupBonusGrantedAt).toBe(claimCall.data.signupBonusGrantedAt);
    expect(rollbackCall.data.signupBonusGrantedAt).toBeNull();
  });
});
