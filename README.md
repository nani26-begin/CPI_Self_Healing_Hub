# SAP BTP + Cloud Integration (CPI) — AI Self-Healing B2B Order Hub

An enterprise-grade, cloud-native B2B integration and exception-management hub built on **SAP Integration Suite (Cloud Integration / CPI)** and **SAP Cloud Application Programming Model (CAP / Node.js)** deployed on **SAP BTP Cloud Foundry**.

## Live Cloud Links
- **Live Self-Healing Cockpit UI:** https://sap-btp-cpi-self-healing-hub-ajit.cfapps.ap21.hana.ondemand.com
- **Live OData V4 Metadata Endpoint:** https://sap-btp-cpi-self-healing-hub-ajit.cfapps.ap21.hana.ondemand.com/odata/v4/hub/$metadata
- **Live SAP CPI Ingestion Endpoint:** https://44f4b665trial.it-cpitrial03-rt.cfapps.ap21.hana.ondemand.com/http/b2b/orders

## Architecture Overview

    [B2B Partners (XML / JSON)]
               |  HTTPS (OAuth2 Client Credentials)
               v
    +------------------------------------------+
    |   SAP Integration Suite (Cloud CPI)      |
    |  * HTTPS Sender (/http/b2b/orders)       |
    |  * Streaming Groovy Schema Normalizer    |
    |  * HTTP Receiver -> SAP BTP OData V4     |
    +------------------------------------------+
               |  REST / OData V4 POST
               v
    +------------------------------------------+
    |   SAP BTP Cloud Foundry (CAP Node.js)    |
    |  * Automated Schema & Credit Validation  |
    |  * AI Root-Cause Triage & Fix Engine     |
    |  * 1-Click & Bulk Self-Healing Actions   |
    |  * Real-Time Executive Operations UI     |
    +------------------------------------------+

## Key Capabilities
1. **Multi-Format B2B Ingestion (SAP CPI + Streaming Groovy):** Ingests raw **XML** and **JSON** partner payloads over OAuth2-secured HTTPS, normalizes schemas via memory-safe `java.io.Reader` Groovy scripting, and routes standardized JSON payloads to SAP BTP.
2. **Automated AI Exception Triage:** Evaluates incoming orders against SAP BTP Customer Master Data (`Customers`) to detect missing Tax IDs, un-onboarded partners, and credit-limit breaches—generating actionable root causes and recommended fixes.
3. **1-Click & Bulk Self-Healing Actions:** Exposed via custom OData V4 bound/unbound actions (`autoHealOrder`, `autoHealAll`) that enrich missing master data attributes and reprocess failed orders without manual payload re-entry.
4. **Zero-Local-Footprint Cloud Deployment:** 100% developed in SAP Business Application Studio (BAS) and hosted on SAP BTP Cloud Foundry (`cflinuxfs4`, Node.js runtime).
