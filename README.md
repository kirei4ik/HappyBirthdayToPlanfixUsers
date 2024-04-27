**Описание проекта:**

Этот GoogleScript позволяет оптимизировать процесс поздравления с днем рождения в системе Planfix.
Скрипт получает пользователей, у которых день рождение в следующем месяце
Создает задачу и добавляет остальных сотрудников в качестве исполнителей


**Для того, чтобы скрипт заработал:**
1) Создайте проект и скопируйте в него код из файла https://github.com/kirei4ik/HappyBirthdayToPlanfixUsers/blob/main/HappyBirthdayToPlanfixUsers.gs
2) Получите необходимые данные для работы с API Planfix и не забудьте выдать нужные разрешения для токена (task_add, user_readonly)
документация https://planfix.com/ru/help/REST_API
3) Добавьте свойства в проект:
- AUTH_TOKEN (значение в формате: Bearer YOURTOKEN)
- PLANFIX_API_URL (значение в формате: https://ACCOUNTNAME.planfix.ru/rest)
4) После отладки кода разкомментируйте строчки 94-96 - они отвечают за назначение исполнителей задачи.
Раскомментируйте их после того как полностью отладите работу скрипта, чтобы не побеспокоить своих пользователей.
5) Настройте тригер для выполнения кода в нужный вам день. Для выполнения выбирайте функцию ExecuteSteps

**Пример результата:**

![image](https://github.com/kirei4ik/HappyBirthdayToPlanfixUsers/assets/69305399/63f28ebb-1cdc-4c26-835d-3fda7d85aad3)


