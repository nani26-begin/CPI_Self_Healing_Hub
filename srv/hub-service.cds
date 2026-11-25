using { b2b.hub as db } from '../db/schema';

service HubService @(path: '/odata/v4/hub') {
  entity Customers as projection on db.Customers;
  entity Orders    as projection on db.Orders;

  action autoHealOrder(ID : UUID) returns Orders;
  action autoHealAll() returns String;
}
