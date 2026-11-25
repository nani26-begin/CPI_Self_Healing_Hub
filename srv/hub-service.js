import cds from '@sap/cds';

export default cds.service.impl(async function () {
  const { Orders, Customers } = this.entities;

  this.before('CREATE', 'Orders', async (req) => {
    const order = req.data;
    order.sourceFormat = order.sourceFormat || 'JSON';
    const customer = await SELECT.one.from(Customers).where({ name: order.customerName });

    if (!order.taxId || order.taxId.trim() === '' || order.taxId === 'MISSING') {
      order.status = 'FAILED';
      if (customer) {
        order.canAutoHeal = true;
        order.aiRootCause = `CPI Validation Exception: Missing Tax ID in ${order.sourceFormat} payload for ${customer.tier}-tier partner '${customer.name}'.`;
        order.aiSuggestedFix = `Customer Master Match Found: Auto-enrich Tax ID '${customer.taxId}' from SAP BTP Master & re-trigger order.`;
      } else {
        order.canAutoHeal = false;
        order.aiRootCause = `CPI Schema Error: Missing Tax ID and unknown partner '${order.customerName}' not found in Customer Master.`;
        order.aiSuggestedFix = `Manual Onboarding Required: Register partner KYC & Tax ID in Customer Master before reprocessing.`;
      }
      return;
    }

    if (!customer) {
      order.status = 'FAILED';
      order.canAutoHeal = false;
      order.aiRootCause = `Business Rule Exception: Partner '${order.customerName}' is not onboarded in SAP BTP Master Data.`;
      order.aiSuggestedFix = `Create partner master record for '${order.customerName}' and re-submit from CPI.`;
      return;
    }

    if (Number(order.amount) > Number(customer.creditLimit)) {
      order.status = 'FAILED';
      order.canAutoHeal = false;
      order.aiRootCause = `AI Risk Alert: Order value ($${order.amount}) exceeds ${customer.tier} credit limit ($${customer.creditLimit}).`;
      order.aiSuggestedFix = `Escalate to Finance Controller for temporary credit override or split order.`;
      return;
    }

    order.status = 'PROCESSED';
    order.canAutoHeal = false;
    order.aiRootCause = `Passed CPI & AI checks (${customer.tier} Partner). Posted to S/4HANA.`;
    order.aiSuggestedFix = `No action required.`;
  });

  this.on('autoHealOrder', async (req) => {
    const { ID } = req.data;
    const order = await SELECT.one.from(Orders).where({ ID });
    if (!order) return req.error(404, 'Order not found');

    const customer = await SELECT.one.from(Customers).where({ name: order.customerName });
    if (!customer) return req.error(400, 'Cannot auto-heal: Customer not in Master Data');

    await UPDATE(Orders).set({
      taxId: customer.taxId,
      status: 'HEALED_AND_PROCESSED',
      canAutoHeal: false,
      aiRootCause: `Self-Healed: Enriched missing Tax ID (${customer.taxId}) from Customer Master & reprocessed.`,
      aiSuggestedFix: `Completed automatically.`
    }).where({ ID });

    return await SELECT.one.from(Orders).where({ ID });
  });

  this.on('autoHealAll', async () => {
    const healable = await SELECT.from(Orders).where({ status: 'FAILED', canAutoHeal: true });
    let count = 0;
    for (const order of healable) {
      const customer = await SELECT.one.from(Customers).where({ name: order.customerName });
      if (customer) {
        await UPDATE(Orders).set({
          taxId: customer.taxId,
          status: 'HEALED_AND_PROCESSED',
          canAutoHeal: false,
          aiRootCause: `Self-Healed: Enriched missing Tax ID (${customer.taxId}) from Customer Master & reprocessed.`,
          aiSuggestedFix: `Completed automatically.`
        }).where({ ID: order.ID });
        count++;
      }
    }
    return `Auto-healed ${count} failed orders successfully.`;
  });
});
