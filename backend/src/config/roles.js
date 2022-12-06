const allRoles = {
  user: ['createTicket', 'seeHistory', 'createReview', 'printTicket'],

  bus_operator: ['cloneBus', 'deleteTicket', 'updateTicket', 'bookingList', 'bookingGet', 'bookingUpdate'],

  admin: [
    'viewBO',
    'cloneBus',
    'deleteTicket',
    'updateTicket',
    'createBO',
    'updateBO',
    'deteleBO',
    'bookingList',
    'bookingGet',
    'bookingUpdate',
    'busList',
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
