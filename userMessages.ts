import { UserRoles } from './types';

export const UserMessage: Record<UserRoles, string> = {
  guest: 'Привет гость. Тебе нужно пройти регистрацию и после этого ',
  user: 'Привет пользователь',
  admin: 'Привет админ',
  dev: 'Привет разработчик',
};

export const HelpMessage: Record<UserRoles, string> = {
  guest: 'Для тебя ничего не доступно',
  admin: '/adduser',
  dev: '/adduser',
  user: 'Для тебя ничего не доступно',
};