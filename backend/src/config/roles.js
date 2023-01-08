const allRoles = {
  user: ['createTicket', 'seeHistory', 'createReview', 'printTicket', 'discardTicket', 'payTicket'],

  bus_operator: [
    'bookingList',
    'busList',
    'cloneBus',
    'deleteTicket',
    'updateTicket',
    'bookingGet',
    'bookingUpdate',
    'createBus',
    'deleteBus',
    'updateBus',
    'getBus',
  ],

  admin: ['getBOByID', 'viewBO', 'createBO', 'updateBO', 'deteleBO'],
};

allRoles.bus_operator = [...allRoles.bus_operator, ...allRoles.user];
allRoles.admin = [...allRoles.admin, ...allRoles.bus_operator];

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
