# SAP BTP + Cloud Integration (CPI) - AI Self-Healing B2B Order Hub

Enterprise B2B integration and exception-management hub built on **SAP Integration Suite (Cloud Integration / CPI)** and **SAP Cloud Application Programming Model (CAP / Node.js)** deployed on **SAP BTP Cloud Foundry**.

## Live Cloud Links
- **Live Self-Healing Cockpit UI:** https://sap-btp-cpi-self-healing-hub-ajit.cfapps.ap21.hana.ondemand.com
- **Live OData V4 Metadata:** https://sap-btp-cpi-self-healing-hub-ajit.cfapps.ap21.hana.ondemand.com/odata/v4/hub/$metadata
- **Live SAP CPI Ingestion Endpoint:** https://44f4b665trial.it-cpitrial03-rt.cfapps.ap21.hana.ondemand.com/http/b2b/orders

## Architecture
`B2B Partners (XML/JSON)` -> `SAP Integration Suite CPI (HTTPS OAuth2 + Streaming Groovy Normalizer)` -> `SAP BTP CAP Node.js (AI Triage & Self-Healing Engine + Real-Time Executive UI)`

## Key Capabilities
1. **Multi-Format B2B Ingestion (SAP CPI + Streaming Groovy):** Ingests raw XML and JSON partner payloads over OAuth2-secured HTTPS, normalizes schemas via memory-safe `java.io.Reader` Groovy scripting, and routes standardized JSON payloads to SAP BTP.
2. **Automated AI Exception Triage:** Evaluates incoming orders against Customer Master Data to detect missing Tax IDs, un-onboarded partners, and credit-limit breaches.
3. **1-Click & Bulk Self-Healing Actions:** Custom OData V4 actions (`autoHealOrder`, `autoHealAll`) enrich missing master data and reprocess failed orders automatically.
