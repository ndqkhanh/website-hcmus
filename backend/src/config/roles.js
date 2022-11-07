const allRoles = {
  user: [
    'getProfile',
    'getUser',
    'updateUser',
    'searchQuestion',
    'getLatestFeed',
    'getMyQuestions',
    'getAllAnswersAndVotings',
    'listConfigurations',
  ],

  moderator: ['approveDeclineQuestion', 'getPendingQuestions', 'banUser', 'getMetrics', 'getUsers'],

  admin: ['setConfiguration'],
};

allRoles.moderator = [...allRoles.moderator, ...allRoles.user];
allRoles.admin = [...allRoles.admin, ...allRoles.moderator];

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
