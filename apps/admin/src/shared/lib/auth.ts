import { apiRequest, API_V1 } from './client';

const AUTH_PREFIX = `${API_V1}/auth`;

export interface Token {
  access_token: string;
  token_type: 'bearer';
}

export async function login(email: string, password: string): Promise<Token> {
  const response = await apiRequest<{
    accessToken: string;
    tokenType: 'bearer';
  }>(`${AUTH_PREFIX}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      captchaToken: '',
    }),
  });

  return { access_token: response.accessToken, token_type: response.tokenType };
}

