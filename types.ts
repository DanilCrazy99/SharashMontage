import { CommandContext, Context, SessionFlavor } from 'grammy';

/**
 * Типы пользователей
 * @param guest гость
 * @param user обычный пользователь
 * @param admin администратор
 * @param dev разработчик
 */
export type UserRoles = 'guest' | 'user' | 'admin' | 'dev';

/**
 * Состояния во время добавления объектов(адреса, информация)
 * @param name добавляет имя объекта
 * @param description добавляет описание объекта
 * @param volume добавляет объём объекта
 * @param people добавляет необходимое количество человек
 * @param money добавляет общую сумму денег за заказ
 *
 */
type AddObjectStates =
  | 'obj_name'
  | 'obj_description'
  | 'obj_volume'
  | 'obj_people'
  | 'obj_money';

/**
 * Состояния во время пользования бота
 * @param AddObjectStates{@link AddObjectStates} Состояния во время добавления объектов
 * @param idle Пользователь зашёл в бота и ничего не нажал
 */
export type UserButtonState = AddObjectStates | 'idle';

/**
 * Словарь для использования функций связанных с конкретным типом пользователей
 */
export type Dictionary = {
  [K in UserButtonState]: () => void;
};

/**
 * Данные которые бот получает от пользователя когда вызвано меню obj-menu
 */
type AddObjectData = {
  name?: string; // название объекта
  description?: string; // описание объекта
  volume?: number; // объём работ
  /* требуемое количество человек (либо) указываются 
  люди самостоятельно при помощи отдельного меню */
  countPeople?: number;
  polling?: boolean; // голосование
  tempMsg?: number[];
};

/**
 * Данные для сессии
 *
 * Сессия это данные связанные с одним конкретным пользователем
 *
 * Может хранить временные данные в переменной data
 */
export interface SessionData {
  state: UserButtonState;
  data?: AddObjectData;
}

/**
 * Используется для конфигурации контекста в боте
 *
 * Добавляет роли пользователей
 */
interface BotUsers {
  role: UserRoles;
}

export type MyContext = Context & {
  config: BotUsers;
} & SessionFlavor<SessionData>;
