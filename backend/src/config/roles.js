const allRoles = {
  user: ['createTicket', 'seeHistory', 'createReview', 'printTicket', 'discardTicket', 'payTicket'],

  bus_operator: [
    'bookingList',
    'busList',
    'cloneBus',
    'deleteTicket',
    'updateTicket',
    'bookingList',
    'bookingGet',
    'bookingUpdate',
  ],

  admin: [
    'getBOByID',
    'viewBO',
    'cloneBus',
    'createBO',
    'updateBO',
    'deteleBO',
    'bookingGet',
    'bookingUpdate',
    'getBus',
    'createBus',
    'deleteBus',
    'updateBus',
  ],
};

allRoles.bus_operator = [...allRoles.bus_operator, ...allRoles.user];
allRoles.admin = [...allRoles.admin, ...allRoles.bus_operator];

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
