namespace b2b.hub;

entity Customers {
  key ID          : UUID;
      name        : String(100);
      taxId       : String(30);
      tier        : String(20);
      creditLimit : Decimal(15,2);
}

entity Orders {
  key ID             : UUID;
      orderId        : String(30);
      customerName   : String(100);
      sourceFormat   : String(10);
      amount         : Decimal(15,2);
      taxId          : String(30);
      status         : String(30);
      aiRootCause    : String(500);
      aiSuggestedFix : String(500);
      canAutoHeal    : Boolean default false;
      createdAt      : Timestamp @cds.on.insert : $now;
}
