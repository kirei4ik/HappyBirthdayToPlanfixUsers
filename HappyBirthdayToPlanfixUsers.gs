function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd-MM-yyyy');
}

function formatDateWithoutYear(dateString) {
  var date = new Date(dateString);
  var day = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd');
  var month = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM');
  return `${day}-${month}`;
}

function getMonthName(monthIndex) {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[monthIndex];
}

var currentDate = new Date();
var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
var lastDayNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
var dateFrom = formatDate(nextMonth);
var dateTo = formatDate(lastDayNextMonth);
var AUTH_TOKEN = PropertiesService.getScriptProperties().getProperty('AUTH_TOKEN');
var PLANFIX_API_URL = PropertiesService.getScriptProperties().getProperty('PLANFIX_API_URL');

function getUsersWithBirthdaysNextMonth() {
  var response = UrlFetchApp.fetch(`${PLANFIX_API_URL}/user/list`, {
    method: 'post',
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      offset: 0,
      pageSize: 100,
      fields: 'id,name,midname,lastname,birthDate,status',
      filters: [
        {
          type: 9120,
          operator: 'equal',
          value: {
            dateType: 'otherRange',
            dateFrom: dateFrom,
            dateTo: dateTo
          }
        }
      ]
    }),
    muteHttpExceptions: true
  });
  var data = JSON.parse(response.getContentText());
  return data.users.filter(user => user.status === 'Active');
}

function getActiveUsersForAssignees() {
  var response = UrlFetchApp.fetch(`${PLANFIX_API_URL}/user/list`, {
    method: 'post',
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      offset: 0,
      pageSize: 100,
      fields: 'id,name,midname,lastname,status',
    }),
    muteHttpExceptions: true
  });
  var data = JSON.parse(response.getContentText());
  return data.users.filter(user => user.status === 'Active');
}

function createTaskWithBirthdays(birthdays, assignees) {
  var monthName = getMonthName(nextMonth.getMonth());
  
  // Сортировка именинников по дате рождения
  birthdays.sort((a, b) => new Date(a.birthDate.datetime) - new Date(b.birthDate.datetime));

  var description = `<strong>Поздравляем именинников:</strong><br/><ul>` +
    birthdays.map(user => `<li>${formatDateWithoutYear(user.birthDate.datetime)} - ${user.lastname} ${user.name}</li>`).join('') + '</ul>';

  var response = UrlFetchApp.fetch(`${PLANFIX_API_URL}/task/`, {
    method: 'post',
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      name: `Дни рождения в ${monthName} ${nextMonth.getFullYear()}`,
      description: description,
      template: { id: 1 },
      /* assignees: {
        users: assignees.map(user => ({ id: `user:${user.id}` }))
      } */
    }),
    muteHttpExceptions: true
  });
  return JSON.parse(response.getContentText());
}

function executeSteps() {
  var usersWithBirthdays = getUsersWithBirthdaysNextMonth();
  var allActiveUsers = getActiveUsersForAssignees();
  var usersToAssignTask = allActiveUsers.filter(user => !usersWithBirthdays.some(birthdayUser => birthdayUser.id === user.id));

  var taskResult = createTaskWithBirthdays(usersWithBirthdays, usersToAssignTask);
  Logger.log("Task creation result: " + JSON.stringify(taskResult));
}

executeSteps();
