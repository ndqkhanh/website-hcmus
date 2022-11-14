const allRoles = {
  user: ['createTicket','seeHistory', 'createReview', 'printTicket'],

  bus_operator: [],

  admin: ['viewBO','cloneBus', 'deleteTicket', 'updateTicket'],
};

allRoles.bus_operator = [...allRoles.bus_operator, ...allRoles.user];
allRoles.admin = [...allRoles.admin, ...allRoles.bus_operator];

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
