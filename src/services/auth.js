import { http } from './http';

export function signup({ email, password, role }) {
  return http('/api/auth/signup', { method: 'POST', body: { email, password, role } });
}

export function login({ email, password }) {
  return http('/api/auth/login', { method: 'POST', body: { email, password } });
}

export function me(token) {
  return http('/api/auth/me', { token });
}

