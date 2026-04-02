# Data Driver Pro -- Complete GHL Agency Subaccount Integration Blueprint

**Date:** 2026-04-02
**Author:** Research compilation for Keith
**Status:** Actionable reference document

---

## TABLE OF CONTENTS

1. [GHL API v2 -- Complete Endpoint Reference](#1-ghl-api-v2----complete-endpoint-reference)
2. [Authentication Methods](#2-authentication-methods)
3. [Rate Limits](#3-rate-limits)
4. [GHL Webhooks -- All Events](#4-ghl-webhooks----all-events)
5. [GHL Marketplace App Integration](#5-ghl-marketplace-app-integration)
6. [GHL Snapshots](#6-ghl-snapshots)
7. [Make.com Module Inventory](#7-makecom-module-inventory)
8. [Full Stack Integration Blueprint](#8-full-stack-integration-blueprint)
9. [Custom Fields Schema](#9-custom-fields-schema)
10. [Technical Implementation Plan](#10-technical-implementation-plan)

---

## 1. GHL API v2 -- Complete Endpoint Reference

**Base URL:** `https://services.leadconnectorhq.com`

**Documentation:** https://marketplace.gohighlevel.com/docs/

**Total:** 413 API operations across 95 categories.

### Contacts API
| Method | Path | Description |
|--------|------|-------------|
| POST | `/contacts/` | Create contact (with custom fields, tags) |
| PUT | `/contacts/{contactId}` | Update contact |
| GET | `/contacts/{contactId}` | Get single contact |
| GET | `/contacts/` | List contacts (deprecated -- use search) |
| POST | `/contacts/search` | Search contacts (preferred) |
| POST | `/contacts/upsert` | Create or update (dedup by email/phone) |
| DELETE | `/contacts/{contactId}` | Delete contact |
| GET | `/contacts/{contactId}/tasks` | Get all tasks for contact |
| POST | `/contacts/{contactId}/tasks` | Create task for contact |
| PUT | `/contacts/{contactId}/tasks/{taskId}` | Update task |
| DELETE | `/contacts/{contactId}/tasks/{taskId}` | Delete task |
| GET | `/contacts/{contactId}/notes` | Get all notes for contact |
| POST | `/contacts/{contactId}/notes` | Create note for contact |
| PUT | `/contacts/{contactId}/notes/{noteId}` | Update note |
| DELETE | `/contacts/{contactId}/notes/{noteId}` | Delete note |
| POST | `/contacts/{contactId}/tags` | Add tags to contact |
| DELETE | `/contacts/{contactId}/tags` | Remove tags from contact |
| POST | `/contacts/{contactId}/campaigns/{campaignId}` | Add to campaign |
| DELETE | `/contacts/{contactId}/campaigns/{campaignId}` | Remove from campaign |
| POST | `/contacts/{contactId}/workflow/{workflowId}` | Add to workflow |
| DELETE | `/contacts/{contactId}/workflow/{workflowId}` | Remove from workflow |
| GET | `/contacts/{contactId}/appointments` | Get appointments |
| GET | `/contacts/business/{businessId}` | Get by business ID |
| POST | `/contacts/bulk/business` | Bulk business operations |

### Conversations API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/conversations/search` | Search conversations (with filters) |
| GET | `/conversations/{conversationId}` | Get conversation |
| PUT | `/conversations/{conversationId}` | Update conversation |
| GET | `/conversations/{conversationId}/messages` | Get messages in conversation |
| POST | `/conversations/messages` | **Send a new message (SMS/Email/WhatsApp/IG/FB/Custom/Live_Chat)** |
| POST | `/conversations/messages/inbound` | Create inbound message |
| POST | `/conversations/messages/upload` | Upload message attachment |
| PUT | `/conversations/messages/{messageId}/status` | Update message status |
| GET | `/conversations/messages/{messageId}/recording` | Get call recording |
| DELETE | `/conversations/messages/email/{emailMessageId}/schedule` | Cancel scheduled email |

#### Send Message Request Body (POST /conversations/messages)
```json
{
  "type": "SMS",           // SMS | Email | WhatsApp | IG | FB | Custom | Live_Chat
  "contactId": "abc123",
  "message": "Hello!",     // For SMS/WhatsApp/etc
  "subject": "Subject",    // For Email
  "html": "<p>HTML</p>",   // For Email
  "emailFrom": "from@x.com",
  "emailTo": "to@x.com",
  "emailCc": ["cc@x.com"],
  "emailBcc": ["bcc@x.com"],
  "attachments": ["https://..."],
  "templateId": "tpl123",
  "scheduledTimestamp": 1669287863,
  "replyMessageId": "msg123",
  "threadId": "thread123",
  "conversationProviderId": "prov123"
}
```

### Opportunities API
| Method | Path | Description |
|--------|------|-------------|
| POST | `/opportunities/` | Create opportunity |
| GET | `/opportunities/{id}` | Get opportunity |
| PUT | `/opportunities/{id}` | Update opportunity |
| DELETE | `/opportunities/{id}` | Delete opportunity |
| GET | `/opportunities/search` | Search opportunities (filters: pipeline, stage, status, contact, date) |
| POST | `/opportunities/upsert` | Upsert opportunity |
| GET | `/opportunities/pipelines` | **Get all pipelines (with stages)** |
| POST | `/opportunities/{id}/status` | Update opportunity status |

#### Create Opportunity Request Body
```json
{
  "pipelineId": "pipe123",
  "pipelineStageId": "stage123",
  "name": "John Doe - DD Pro Lead",
  "contactId": "contact123",
  "status": "open",
  "monetaryValue": 997,
  "assignedTo": "user123",
  "customFields": [
    { "id": "field_abc", "field_value": "Hot" }
  ],
  "source": "Data Driver Pro"
}
```

### Calendars API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/calendars/` | List calendars |
| POST | `/calendars/` | Create calendar |
| GET | `/calendars/{calendarId}` | Get calendar |
| PUT | `/calendars/{calendarId}` | Update calendar |
| DELETE | `/calendars/{calendarId}` | Delete calendar |
| GET | `/calendars/{calendarId}/free-slots` | **Get available time slots** |
| GET | `/calendars/events` | Get events in date range |
| POST | `/calendars/events/appointments` | **Create appointment** |
| GET | `/calendars/events/appointments/{eventId}` | Get appointment |
| PUT | `/calendars/events/appointments/{eventId}` | Update appointment |
| DELETE | `/calendars/events/appointments/{eventId}` | Delete appointment |
| GET | `/calendars/events/appointments/{appointmentId}/notes` | Get appointment notes |
| POST | `/calendars/events/appointments/{appointmentId}/notes` | Create appointment note |
| GET | `/calendars/groups` | List calendar groups |
| POST | `/calendars/groups` | Create calendar group |

#### Create Appointment Request Body
```json
{
  "calendarId": "cal123",
  "locationId": "loc123",
  "contactId": "contact123",
  "startTime": "2026-04-03T14:00:00Z",
  "endTime": "2026-04-03T15:00:00Z",
  "title": "Sales Call with Sandy",
  "appointmentStatus": "confirmed",
  "assignedUserId": "user123",
  "address": "Zoom link",
  "notes": "Qualified lead from Data Driver"
}
```

### Locations (Sub-Account) API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/locations/{locationId}` | Get location details |
| PUT | `/locations/{locationId}` | Update location |
| GET | `/locations/search` | Search locations |
| GET | `/locations/{locationId}/customFields` | **Get all custom fields** |
| POST | `/locations/{locationId}/customFields` | **Create custom field** |
| PUT | `/locations/{locationId}/customFields/{id}` | Update custom field |
| DELETE | `/locations/{locationId}/customFields/{id}` | Delete custom field |
| GET | `/locations/{locationId}/customValues` | Get custom values |
| POST | `/locations/{locationId}/customValues` | Create custom value |
| PUT | `/locations/{locationId}/customValues/{id}` | Update custom value |
| GET | `/locations/{locationId}/tags` | Get all tags |
| POST | `/locations/{locationId}/tags` | Create tag |
| PUT | `/locations/{locationId}/tags/{tagId}` | Update tag |
| DELETE | `/locations/{locationId}/tags/{tagId}` | Delete tag |
| GET | `/locations/{locationId}/templates` | Get templates |
| GET | `/locations/{locationId}/tasks/search` | Search tasks |

### Custom Fields V2 API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/custom-fields/` | List custom fields (contact or opportunity) |
| POST | `/custom-fields/` | Create custom field |
| GET | `/custom-fields/{id}` | Get custom field |
| PUT | `/custom-fields/{id}` | Update custom field |
| DELETE | `/custom-fields/{id}` | Delete custom field |

Supported field types: `TEXT`, `LARGE_TEXT`, `NUMERICAL`, `PHONE`, `MONETORY`, `CHECKBOX`, `SINGLE_OPTIONS`, `MULTIPLE_OPTIONS`, `FLOAT`, `DATE`, `SIGNATURE`, `TIME`, `FILE_UPLOAD`, `TEXT_BOX_LIST`

### Workflows API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/workflows/` | List workflows |
| POST | `/contacts/{contactId}/workflow/{workflowId}` | Add contact to workflow |
| DELETE | `/contacts/{contactId}/workflow/{workflowId}` | Remove from workflow |

**Note:** You cannot create/edit workflows via API. Workflows must be built in the GHL UI. You CAN trigger them via:
1. Adding a contact to a workflow
2. Inbound Webhook trigger (POST data to a workflow's webhook URL)
3. Marketplace Custom Triggers (programmatic)

### Payments API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/payments/orders/{orderId}` | Get order by ID |
| GET | `/payments/transactions` | List transactions |
| GET | `/payments/subscriptions` | List subscriptions |
| POST | `/payments/integration-provider` | Create integration provider |
| GET | `/payments/integration-provider` | List integration providers |
| GET | `/payments/coupons` | List coupons |
| POST | `/payments/coupons` | Create coupon |

### Emails API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/emails/builder` | Fetch email templates |
| POST | `/emails/builder` | Create email template |

### Social Media API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/social-media-posting/{locationId}/accounts` | Get connected accounts |
| POST | `/social-media-posting/{locationId}/posts` | Create post |
| GET | `/social-media-posting/{locationId}/posts/list` | List posts |
| PUT | `/social-media-posting/{locationId}/posts/{id}` | Update post |
| GET | `/social-media-posting/statistics` | Get analytics |

### Blogs API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/blogs/site/all` | List blogs |
| POST | `/blogs/posts` | Create blog post |
| PUT | `/blogs/posts/{postId}` | Update blog post |
| GET | `/blogs/posts/all` | Get blog posts |
| GET | `/blogs/authors` | Get blog authors |
| GET | `/blogs/categories` | Get categories |

### Additional Endpoint Categories
- **Forms** -- `/forms/` (submissions, uploads)
- **Surveys** -- `/surveys/`
- **Courses** -- `/courses/`
- **Invoices** -- `/invoices/` (CRUD, schedule, templates, estimates)
- **Products** -- `/products/` (catalog, prices, collections)
- **Users** -- `/users/` (CRUD)
- **Companies** -- `/companies/`
- **Associations** -- `/associations/`
- **Documents/Contracts** -- `/documents-contracts/`
- **Snapshots** -- `/snapshots/`
- **SaaS** -- `/saas/` (subscription management)
- **Funnels** -- `/funnels/` (redirects, pages)
- **Media** -- `/medias/` (file management)
- **OAuth** -- `/oauth/` (token management)
- **Custom Objects** -- `/objects/` (schema, records)
- **Voice AI** -- `/voice-ai/` (agents, goals, dashboard)

---

## 2. Authentication Methods

### Option A: Private Integration Token (PIT) -- RECOMMENDED FOR KEITH
Best for: Internal tools, single-account access, no marketplace distribution needed.

**Setup:**
1. Go to **Agency Settings > Private Integrations** in GHL
2. Click "Create New Integration"
3. Name it: "Data Driver Pro Integration"
4. Select scopes (see scope list below)
5. Copy the generated token IMMEDIATELY (cannot be retrieved later)
6. Use as Bearer token: `Authorization: Bearer pit_XXXXXX`

**Limitations:**
- Access 1 sub-account at a time
- No webhooks (use Inbound Webhook workflow trigger instead)
- No custom UI pages in GHL
- Rotate every 90 days

**Required Scopes for Data Driver Pro:**
```
contacts.readonly
contacts.write
conversations.readonly
conversations.write
conversations/message.readonly
conversations/message.write
opportunities.readonly
opportunities.write
calendars.readonly
calendars.write
calendars/events.readonly
calendars/events.write
locations.readonly
locations/customFields.readonly
locations/customFields.write
locations/customValues.readonly
locations/customValues.write
locations/tags.readonly
locations/tags.write
workflows.readonly
campaigns.readonly
users.readonly
forms.readonly
payments/orders.readonly
payments/transactions.readonly
```

### Option B: OAuth 2.0 -- FOR MARKETPLACE APP
Best for: Multi-tenant, marketplace distribution, webhook events.

**Flow:**
1. Register app at https://marketplace.gohighlevel.com
2. User clicks Install URL -> Authorization screen
3. GHL redirects to your callback with `code`
4. Exchange code for tokens:

```
POST https://services.leadconnectorhq.com/oauth/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&grant_type=authorization_code
&code=AUTH_CODE
&user_type=Location
&redirect_uri=https://your-app.com/callback
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "rf_...",
  "locationId": "loc_abc",
  "userId": "usr_abc"
}
```

- Access tokens expire in **24 hours**
- Refresh tokens valid for **1 year** (single-use, generates new refresh token)
- Refresh endpoint: same URL with `grant_type=refresh_token`
- Location token from agency token: `POST /oauth/locationToken`

### Option C: API Key (V1 -- DEPRECATED)
Do NOT use. V1 is end-of-support.

---

## 3. Rate Limits

| Limit Type | Value | Scope |
|-----------|-------|-------|
| **Burst** | 100 requests per 10 seconds | Per app per location/company |
| **Daily** | 200,000 requests per day | Per app per location/company |

**Response Headers to Monitor:**
- `X-RateLimit-Limit-Daily` -- Daily limit
- `X-RateLimit-Daily-Remaining` -- Remaining daily requests
- `X-RateLimit-Interval-Milliseconds` -- Burst window (10000ms)
- `X-RateLimit-Max` -- Max per burst window (100)
- `X-RateLimit-Remaining` -- Remaining in current burst window

**Strategy:** Batch contact pushes in groups of 50, 1-second delay between batches. 200k/day is ~2.3 contacts/second sustained.

---

## 4. GHL Webhooks -- All Events

### Webhook Registration (OAuth Apps Only)
Webhooks are configured in your marketplace app settings. Go to your app in the marketplace dashboard -> Advanced Settings -> Webhook URL. Select which events to receive.

**For PIT users:** Use the **Inbound Webhook** workflow trigger instead. Each workflow gets a unique webhook URL you POST data to.

### Webhook Security
| Header | Algorithm | Status |
|--------|-----------|--------|
| `X-GHL-Signature` | Ed25519 | Current (use this) |
| `X-WH-Signature` | RSA-SHA256 | Deprecated July 1, 2026 |

### Webhook Payload Format
```json
{
  "type": "ContactCreate",
  "timestamp": "2026-04-02T14:35:00.000Z",
  "webhookId": "wh-123",
  "locationId": "loc_abc",
  "companyId": "comp_abc",
  "data": {
    "id": "contact_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+15551234567",
    "tags": ["data-driver-lead"],
    "customFields": [...]
  }
}
```

### All Available Webhook Events

**Contact Events:**
- `ContactCreate` -- New contact created
- `ContactUpdate` -- Contact updated
- `ContactDelete` -- Contact deleted
- `ContactDndUpdate` -- DND status changed
- `ContactTagUpdate` -- Tag added/removed
- `NoteCreate` -- Note added to contact
- `NoteUpdate` -- Note updated
- `NoteDelete` -- Note deleted
- `TaskCreate` -- Task created for contact
- `TaskComplete` -- Task completed

**Opportunity Events:**
- `OpportunityCreate` -- New opportunity
- `OpportunityUpdate` -- Opportunity updated
- `OpportunityDelete` -- Opportunity deleted
- `OpportunityStageUpdate` -- Pipeline stage changed
- `OpportunityStatusUpdate` -- Status changed (open/won/lost/abandoned)
- `OpportunityMonetaryValueUpdate` -- Value changed
- `OpportunityAssignedToUpdate` -- Assignee changed

**Appointment Events:**
- `AppointmentCreate` -- Appointment booked
- `AppointmentUpdate` -- Appointment updated (reschedule, etc.)
- `AppointmentDelete` -- Appointment cancelled

**Conversation Events:**
- `ConversationUnreadUpdate` -- Unread count changed
- `ConversationProviderOutgoing` -- Outbound message sent
- `InboundMessage` -- Inbound message received (SMS/email/etc.)
- `OutboundMessage` -- Outbound message sent

**Payment Events:**
- `InvoiceCreate` -- Invoice created
- `InvoiceUpdate` -- Invoice updated
- `InvoiceDelete` -- Invoice deleted
- `InvoiceSent` -- Invoice sent
- `InvoiceVoided` -- Invoice voided
- `InvoicePartialPayment` -- Partial payment
- `InvoicePaid` -- Full payment received
- `OrderCreate` -- Order created
- `OrderStatusUpdate` -- Order status changed

**Location Events:**
- `LocationCreate` -- Sub-account created
- `LocationUpdate` -- Sub-account updated

**User Events:**
- `UserCreate` -- User created
- `UserUpdate` -- User updated
- `UserDelete` -- User deleted

**App Events:**
- `AppInstall` -- App installed (auto-subscribed)
- `AppUninstall` -- App uninstalled

**Retry Policy:** Up to 6 retries on HTTP 429, spaced over ~70 minutes with jitter. Always return 200 OK.

---

## 5. GHL Marketplace App Integration

### Keith's Existing Data Driver App
Keith already has Data Driver listed in the marketplace. Extending it:

1. **Go to:** https://marketplace.gohighlevel.com -> My Apps -> Data Driver
2. **Add scopes** for contacts, conversations, opportunities, calendars, custom fields, workflows
3. **Set webhook URL** to receive events
4. **Add custom workflow actions** (e.g., "Push DD Leads to Pipeline")
5. **Add custom workflow triggers** (e.g., "New DD Purchase Completed")

### Custom Workflow Actions
Marketplace apps can add custom actions that appear in the workflow builder:
- Pay-per-execution model (LC Premium Triggers & Actions)
- Sub-account must have the app installed
- Requires `workflows.readonly` scope

### Custom Workflow Triggers
You can create triggers that push data INTO workflows from external systems:
- Define a trigger with name, key, icon, sample JSON payload
- GHL gives you a `targetUrl` when the trigger is used in a workflow
- POST your data to that `targetUrl` to fire the workflow
- Can run contactless (no contact required)

### App Distribution Types
- **Private:** Up to 5 agency installs (no marketplace approval)
- **Public:** Available to all GHL users (requires review)
- **Agency:** Accessible to all accounts within your agency
- **Sub-Account:** Limited to specific sub-accounts

### Key: No commission on developer revenue until December 31, 2026.

---

## 6. GHL Snapshots

### What Snapshots Include
- Workflows (automation logic, triggers)
- Funnels & funnel steps
- Websites & pages
- Calendars & appointment settings
- Pipelines & opportunity stages
- Custom fields & custom field definitions
- Custom values (keys only, NOT values)
- Tags
- Forms & surveys
- Email templates & SMS templates
- Products (for Stripe)
- Membership products
- Trigger links
- Custom reports (new 2025)

### What Snapshots EXCLUDE
- Contacts, appointments, conversations
- Reputation data / reviews
- **Stripe connections / payment integrations** (must reconnect)
- **API connections** (Facebook, Google, Stripe -- must reconnect)
- **Tracking codes**
- Products created inside funnels
- Teams (inactive by default, need manual activation)
- Facebook audience actions in workflows
- Google Analytics/AdWords actions in workflows

### How to Create a Snapshot
1. Build and test a complete subaccount setup
2. Switch to agency dashboard
3. Select the subaccount -> Actions -> "Create Snapshot"
4. Name it, add description, select components
5. Save under Agency Settings -> Snapshots

### How to Distribute
1. **Share link:** Generate a public link for partners/clients
2. **SaaS mode:** Auto-apply to new sign-ups
3. **Marketplace:** Sell templated systems

### Version Management (2025)
Track, compare, and restore previous versions. Safe experimentation.

### Data Driver Pro Snapshot Contents
Build a "DD Pro Ultimate" snapshot containing:
- 2 pipelines (Lead Acquisition, Recruiting)
- 7+ custom fields (Net Worth, Income, Credit Rating, Intent Keywords, DD Source, Lead Score, License Status)
- 3 calendars (Sales Call, Strategy Session, Coaching)
- 5+ workflows (Lead Intake, Sandy Follow-up, Call Analysis, Appointment Reminder, Recruiting Pipeline)
- Email templates (lead follow-up, appointment confirmation, coaching nudge)
- Tags (dd-lead, sandy-qualified, vapi-called, fathom-analyzed, hot-lead, cold-lead)
- Forms (Lead Intake, Coaching Feedback)

---

## 7. Make.com Module Inventory

### GoHighLevel (HighLevel) Modules

**Triggers:**
| Module | Type | Description |
|--------|------|-------------|
| Watch Contact Updated | Trigger | Fires when contact updated (deprecated) |
| Watch Events | Instant Trigger | Fires on entity create/update events |

**Actions:**
| Module | Description |
|--------|-------------|
| Create a Contact | Creates new contact in GHL |
| Update a Contact | Modifies existing contact |
| Get a Contact | Retrieves contact by ID |
| Delete a Contact | Removes contact |
| Search Contacts | Search by query parameter |
| Create an Opportunity | Creates pipeline opportunity |
| Update an Opportunity | Modifies opportunity |
| Get an Opportunity | Retrieves by ID |
| Delete an Opportunity | Removes opportunity |
| Search Opportunities | Search/filter opportunities |
| Create a Task | Creates contact task |
| Update a Task | Modifies task |
| Get a Task | Retrieves task |
| Delete a Task | Removes task |
| List Tasks | Lists contact tasks |
| Add a Note to Contact | Appends note to contact |
| Add Contact to Campaign | Enrolls in campaign |
| Remove Contact from Campaign | Removes from campaign |
| Add an Account | Creates new sub-account |
| **Make an API Call** | **Custom API call (any endpoint)** |

**Key: "Make an API Call" is the escape hatch.** Anything the native modules don't cover, you can hit any GHL API endpoint directly.

### Supabase Modules

**Triggers:**
| Module | Description |
|--------|-------------|
| Watch Rows | Fires on row create/update |
| Watch New Users | Fires on auth user creation |

**Actions:**
| Module | Description |
|--------|-------------|
| Create a Row | Insert into table |
| Update Row(s) | Update single/multiple rows |
| Delete Row(s) | Delete single/multiple rows |
| Search Rows | Query with filters |
| Get Row Count | Count rows in table |
| Create Multiple Rows | Batch insert |
| Create Storage Bucket | Create storage bucket |
| Upload Object | Upload to storage |
| Download Object | Download from storage |
| List Buckets | List storage buckets |
| Create User | Create auth user |
| List Users | List auth users |

### Stripe Modules

**Triggers:**
| Module | Description |
|--------|-------------|
| Watch Events | Fires on any Stripe event (payment_intent.succeeded, checkout.session.completed, etc.) |

**Actions (key ones):**
| Module | Description |
|--------|-------------|
| Create a Customer | New Stripe customer |
| List/Search Customers | Find customers |
| Create a Payment Intent | Initiate payment |
| Confirm Payment Intent | Confirm payment |
| Create an Invoice | Generate invoice |
| List Invoices | Search invoices |
| Create a Refund | Issue refund |
| Make an API Call | Custom Stripe API call |

### Fathom Modules

**Triggers:**
| Module | Description |
|--------|-------------|
| Watch Meetings (Instant) | Fires when meeting content is ready |

**Actions:**
| Module | Description |
|--------|-------------|
| Get Meeting Summary | Fetch AI summary by meeting ID |
| Get Meeting Transcript | Fetch full transcript |
| List Meetings | List all recordings with pagination |

### VAPI Modules

**Triggers:**
| Module | Description |
|--------|-------------|
| Watch End of Call Report | Fires on call completion with full report |
| Watch Tool Call Request | Fires on function call during live call |

**Actions:**
| Module | Description |
|--------|-------------|
| Create Call | Initiate a call |
| Create Outbound Phone Call | Call a Twilio/Vonage number |
| Respond to Tool Call | Return data to VAPI during live call |
| Make an API Call | Custom VAPI API call |

---

## 8. Full Stack Integration Blueprint

### A. Lead Acquisition Flow

```
User visits trydatadriver.com
  -> Selects segment, filters, count
  -> Stripe Checkout ($0.25/contact)
  -> Stripe webhook fires (checkout.session.completed)
  -> Vercel /api/webhook updates purchase status
  -> /api/generate-csv queries Data Driver Supabase
  -> CSV generated + stored in Supabase Storage
  -> SIMULTANEOUSLY: Push contacts to GHL subaccount
```

**Implementation -- GHL Contact Push (post-payment):**

```javascript
// After CSV generation, push each contact to GHL
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_TOKEN = process.env.GHL_PIT_TOKEN; // or OAuth access token
const LOCATION_ID = process.env.GHL_LOCATION_ID;

async function pushContactToGHL(record, purchaseId) {
  const body = {
    locationId: LOCATION_ID,
    firstName: record.First_Name,
    lastName: record.Last_Name,
    email: record.Personal_Email,
    phone: record.Phone,
    address1: record.Address,
    city: record.City,
    state: record.State,
    postalCode: record.Zip_Code,
    companyName: record.Company_Name,
    source: 'Data Driver Pro',
    tags: ['dd-lead', `purchase-${purchaseId}`],
    customFields: [
      { id: 'CF_NET_WORTH', field_value: record.Net_Worth },
      { id: 'CF_INCOME_RANGE', field_value: record.Income_Range },
      { id: 'CF_CREDIT_RATING', field_value: record.Credit_Rating },
      { id: 'CF_AGE', field_value: String(record.Age) },
      { id: 'CF_GENDER', field_value: record.Gender },
      { id: 'CF_JOB_TITLE', field_value: record.Job_Title },
      { id: 'CF_LINKEDIN', field_value: record.LinkedIn_URL },
      { id: 'CF_DD_SOURCE', field_value: 'Data Driver Pro' },
      { id: 'CF_LEAD_TIME', field_value: record.Lead_Time },
    ],
  };

  const resp = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GHL_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify(body),
  });

  return resp.json();
}

// Batch push with rate limiting
async function pushAllContacts(records, purchaseId) {
  const BATCH_SIZE = 50;
  const DELAY_MS = 1000;
  const results = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const promises = batch.map(r => pushContactToGHL(r, purchaseId));
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);

    if (i + BATCH_SIZE < records.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  return results;
}
```

**Also create an opportunity for each purchase:**
```javascript
async function createPurchaseOpportunity(contact, purchase) {
  const body = {
    pipelineId: process.env.GHL_LEAD_PIPELINE_ID,
    pipelineStageId: process.env.GHL_STAGE_NEW_LEAD,
    name: `${contact.firstName} ${contact.lastName} - DD Lead`,
    contactId: contact.id,
    status: 'open',
    monetaryValue: purchase.amount_paid,
    source: 'Data Driver Pro',
  };

  return fetch(`${GHL_BASE}/opportunities/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GHL_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify(body),
  });
}
```

### B. Cold/Warm Outreach Flow

**Trigger:** New contact enters GHL with tag `dd-lead`

**GHL Workflow (built in UI):**
```
Trigger: Contact Tag Added = "dd-lead"
  |
  v
Wait 2 minutes
  |
  v
IF custom field "Credit_Rating" = "Excellent" OR "Good"
  -> Tag: "warm-lead"
  -> [Go to Warm Path]
ELSE
  -> Tag: "cold-lead"
  -> [Go to Cold Path]

WARM PATH:
  1. Sandy SMS (via Custom Webhook to Sandy SMS Agent)
     POST https://sandy-sms-agent.vercel.app/api/send
     Body: { contactId, phone, firstName, message }

  2. Wait 30 minutes

  3. IF no reply -> Send email (GHL native)
     Template: "DD Pro Lead Follow-up"

  4. Wait 24 hours

  5. VAPI voice call (via Custom Webhook)
     POST https://your-vapi-webhook.com/outbound
     Body: { phone, firstName, assistantId }

COLD PATH:
  1. Email sequence (3 emails over 7 days via GHL)
  2. After sequence -> IF opened any email -> Upgrade to warm
  3. IF no engagement after 14 days -> Tag "nurture-long-term"
```

### C. Sandy AI Follow-up

**Architecture:**
```
Sandy SMS Agent (Railway/Vercel)
  |
  v
Receives webhook from GHL workflow
  -> Sends SMS via iMessage Relay OR GHL Conversation API
  -> Sandy AI processes response
  -> Updates GHL contact via API:
     - Add notes (conversation summary)
     - Update custom fields (qualification score)
     - Move opportunity stage if qualified
     - Book appointment if ready
```

**Sandy -> GHL Integration Code:**
```javascript
// Sandy qualifies a lead and books appointment
async function sandyQualifyAndBook(contactId, qualificationData) {
  // 1. Update contact custom fields
  await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${GHL_TOKEN}`, 'Content-Type': 'application/json', 'Version': '2021-07-28' },
    body: JSON.stringify({
      customFields: [
        { id: 'CF_LEAD_SCORE', field_value: qualificationData.score },
        { id: 'CF_SANDY_STATUS', field_value: 'Qualified' },
        { id: 'CF_QUALIFICATION_NOTES', field_value: qualificationData.summary },
      ],
      tags: ['sandy-qualified'],
    }),
  });

  // 2. Add conversation note
  await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GHL_TOKEN}`, 'Content-Type': 'application/json', 'Version': '2021-07-28' },
    body: JSON.stringify({
      body: `Sandy AI Qualification:\n${qualificationData.summary}\nScore: ${qualificationData.score}/10\nReady for: ${qualificationData.nextStep}`,
    }),
  });

  // 3. Move opportunity to "Qualified" stage
  const opps = await fetch(`${GHL_BASE}/opportunities/search?location_id=${LOCATION_ID}&contact_id=${contactId}`, {
    headers: { 'Authorization': `Bearer ${GHL_TOKEN}`, 'Version': '2021-07-28' },
  }).then(r => r.json());

  if (opps.opportunities?.[0]) {
    await fetch(`${GHL_BASE}/opportunities/${opps.opportunities[0].id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GHL_TOKEN}`, 'Content-Type': 'application/json', 'Version': '2021-07-28' },
      body: JSON.stringify({
        pipelineStageId: process.env.GHL_STAGE_QUALIFIED,
      }),
    });
  }

  // 4. Book appointment if ready
  if (qualificationData.readyToBook) {
    // Get available slots
    const slots = await fetch(`${GHL_BASE}/calendars/${process.env.GHL_SALES_CALENDAR_ID}/free-slots?startDate=2026-04-03&endDate=2026-04-10`, {
      headers: { 'Authorization': `Bearer ${GHL_TOKEN}`, 'Version': '2021-07-28' },
    }).then(r => r.json());

    if (slots.slots?.[0]) {
      await fetch(`${GHL_BASE}/calendars/events/appointments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GHL_TOKEN}`, 'Content-Type': 'application/json', 'Version': '2021-07-28' },
        body: JSON.stringify({
          calendarId: process.env.GHL_SALES_CALENDAR_ID,
          locationId: LOCATION_ID,
          contactId,
          startTime: slots.slots[0].startTime,
          endTime: slots.slots[0].endTime,
          title: `Sales Call - ${qualificationData.contactName}`,
          appointmentStatus: 'confirmed',
        }),
      });
    }
  }
}
```

### D. Phone Calls (In/Out)

**VAPI -> GHL Integration:**
```
INBOUND CALL arrives at VAPI (732) 335-7638
  -> VAPI AI assistant handles conversation
  -> VAPI checks GHL for existing contact (Get Contact tool)
  -> If new: VAPI creates contact in GHL (Create Contact tool)
  -> VAPI checks calendar availability (Check Availability tool)
  -> If booking: VAPI books appointment (Create Event tool)
  -> Call ends -> End-of-call report fires
  -> Make.com "Watch End of Call Report" trigger
  -> Make.com scenario:
     1. Parse call transcript + summary
     2. Add note to GHL contact (call summary)
     3. Update custom fields (call outcome, sentiment)
     4. Move opportunity stage based on call result
     5. Log to Supabase for analytics

OUTBOUND CALL via GHL workflow:
  -> Workflow hits Custom Webhook action
  -> POST to VAPI Create Call endpoint
  -> VAPI calls lead with specialized assistant
  -> Same post-call flow as above
```

**VAPI GHL Tool Configuration:**
The VAPI dashboard has native GHL integration. Enable these tools:
1. `ghl_contact_get` -- Look up contact by phone/email
2. `ghl_contact_create` -- Create new contact
3. `ghl_check_availability` -- Check calendar slots
4. `ghl_create_event` -- Book appointment

**Critical:** Contact ID is required before booking. Always Get/Create contact first.

### E. Video Conferencing (Sandy Live Avatar)

```
Sandy LiveAvatar Session
  -> HeyGen streams video avatar
  -> Fathom records the session
  -> Session ends -> Fathom webhook fires:
     Event: "new-meeting-content-ready"
     Data: { summary, transcript, action_items }
  -> Webhook hits: datadriver-site.vercel.app/api/fathom-webhook
  -> Handler:
     1. Extract meeting summary + action items
     2. Find GHL contact by email/phone
     3. POST /contacts/{contactId}/notes with:
        - Full transcript summary
        - Action items
        - Sandy's qualification assessment
     4. Update custom fields:
        - CF_VIDEO_SESSION_DATE
        - CF_VIDEO_SESSION_OUTCOME
        - CF_VIDEO_ENGAGEMENT_SCORE
     5. Move opportunity stage if appropriate
```

### F. Coaching & Training (L.I.E.S. Training)

```
GHL Custom Fields for Coaching:
  CF_TRAINING_STAGE = "Pre-License" | "In Training" | "Licensed" | "Active"
  CF_LIES_MODULE = "Listening" | "Investigating" | "Educating" | "Solving"
  CF_NIPR_STATUS = "Not Verified" | "Verified" | "Expired"
  CF_LICENSE_NUMBER = text
  CF_LICENSE_STATE = text
  CF_COACHING_SESSIONS = number
  CF_LAST_COACHING_DATE = date

GHL Workflow:
  Trigger: Custom Field Changed = "CF_TRAINING_STAGE"
  -> IF stage = "In Training":
     -> Send Sandy coaching SMS
     -> Assign to coaching calendar
     -> Add to "Training Pipeline"
  -> IF stage = "Licensed":
     -> Verify via NIPR API
     -> Update CF_NIPR_STATUS
     -> Move to "Active Pipeline"
     -> Send congratulations email
```

### G. Appointment Booking

**Sandy Books via API:**
```javascript
// 1. Check available slots
GET /calendars/{calendarId}/free-slots?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&timezone=America/New_York

// 2. Create appointment
POST /calendars/events/appointments
{
  "calendarId": "cal_123",
  "locationId": "loc_123",
  "contactId": "contact_123",
  "startTime": "2026-04-03T14:00:00-04:00",
  "endTime": "2026-04-03T15:00:00-04:00",
  "title": "Strategy Session with Sandy",
  "appointmentStatus": "confirmed",
  "address": "Zoom: https://zoom.us/j/123456",
  "notes": "Qualified lead. Net worth $500K+. Interested in DD Pro."
}

// 3. GHL Workflow auto-fires:
// Trigger: Customer Booked Appointment
//   -> Send confirmation SMS (GHL native)
//   -> Send confirmation email with Zoom link
//   -> Create reminder: 24hrs before
//   -> Create reminder: 1hr before
//   -> Assign to sales rep
```

### H. Sales Call Analysis

```
Fathom Webhook (new-meeting-content-ready)
  |
  v
Make.com Scenario: "Fathom -> GHL Call Analysis"
  |
  v
Module 1: Fathom - Watch Meetings (instant trigger)
  |
  v
Module 2: Fathom - Get Meeting Summary
  |
  v
Module 3: Fathom - Get Meeting Transcript
  |
  v
Module 4: GHL - Search Contacts (by attendee email)
  |
  v
Module 5: GHL - Add Note to Contact
  Body: "CALL ANALYSIS\n\nSummary: {{summary}}\nAction Items: {{action_items}}\nKey Topics: {{topics}}\nSentiment: {{sentiment}}"
  |
  v
Module 6: GHL - Update Contact (custom fields)
  CF_LAST_CALL_DATE: {{meeting_date}}
  CF_CALL_OUTCOME: {{outcome}}
  CF_CALL_SCORE: {{score}}
  |
  v
Module 7: GHL - Update Opportunity (advance stage)
  IF score >= 8 -> Stage: "Ready to Close"
  IF score >= 5 -> Stage: "Warm Follow-up"
  IF score < 5 -> Stage: "Needs Nurturing"
  |
  v
Module 8: Supabase - Create Row (analytics log)
  Table: call_analytics
  Data: { contact_id, meeting_id, score, outcome, transcript_url }
```

### I. Recruiting Pipeline

**GHL Pipeline: "DD Pro Recruiting"**
```
Stages:
  1. New Candidate (auto from Indeed/LinkedIn form)
  2. Sandy Screening (Sandy AI qualifies)
  3. License Check (NIPR verification)
  4. Interview Scheduled (calendar booking)
  5. Offer Extended
  6. Hired
  7. In Training
  8. Active Agent
```

**Workflow:**
```
Trigger: Form Submitted = "Recruiting Application"
  OR
Trigger: Inbound Webhook (from Indeed/LinkedIn scraper)
  |
  v
Create Contact (firstName, lastName, email, phone, resume link)
  |
  v
Create Opportunity in "Recruiting" pipeline, stage "New Candidate"
  |
  v
Tag: "recruit-new"
  |
  v
Sandy SMS: "Hi {{firstName}}, thanks for applying to Data Driver Pro! I'm Sandy, your AI recruiting assistant. I have a few quick questions..."
  |
  v
Sandy qualifies through conversation:
  - Years of sales experience?
  - Current license status?
  - Available for full-time?
  - Income expectations?
  |
  v
IF qualified:
  -> Move to "Sandy Screening" -> "License Check"
  -> Auto-verify license via NIPR API
  -> IF licensed: Move to "Interview Scheduled"
  -> Book interview on GHL calendar
  -> Notify hiring manager

IF not qualified:
  -> Move to "Not Qualified" (lost)
  -> Send polite decline email
```

---

## 9. Custom Fields Schema

### Contact Custom Fields (Create in GHL)
| Field Key | Label | Type | Values / Notes |
|-----------|-------|------|----------------|
| `cf_net_worth` | Net Worth | SINGLE_OPTIONS | <$50K, $50K-$100K, $100K-$250K, $250K-$500K, $500K-$1M, $1M+ |
| `cf_income_range` | Income Range | SINGLE_OPTIONS | <$25K, $25K-$50K, $50K-$75K, $75K-$100K, $100K-$150K, $150K+ |
| `cf_credit_rating` | Credit Rating | SINGLE_OPTIONS | Excellent, Good, Fair, Poor |
| `cf_age` | Age | NUMERICAL | |
| `cf_gender` | Gender | SINGLE_OPTIONS | Male, Female |
| `cf_job_title` | Job Title | TEXT | |
| `cf_company_name_dd` | Company (DD) | TEXT | |
| `cf_linkedin_url` | LinkedIn URL | TEXT | |
| `cf_dd_source` | DD Source | TEXT | "Data Driver Pro" |
| `cf_lead_time` | Lead Time | TEXT | From DD data |
| `cf_lead_score` | Lead Score | NUMERICAL | 1-10, set by Sandy |
| `cf_sandy_status` | Sandy Status | SINGLE_OPTIONS | Not Contacted, In Conversation, Qualified, Not Qualified, Booked |
| `cf_call_outcome` | Last Call Outcome | SINGLE_OPTIONS | No Answer, Voicemail, Interested, Not Interested, Booked, Follow Up |
| `cf_call_score` | Call Score | NUMERICAL | 1-10, from Fathom analysis |
| `cf_last_call_date` | Last Call Date | DATE | |
| `cf_video_session_date` | Video Session Date | DATE | |
| `cf_video_engagement` | Video Engagement | NUMERICAL | 1-10 |
| `cf_training_stage` | Training Stage | SINGLE_OPTIONS | Pre-License, In Training, Licensed, Active |
| `cf_lies_module` | L.I.E.S. Module | SINGLE_OPTIONS | Listening, Investigating, Educating, Solving |
| `cf_nipr_status` | NIPR Status | SINGLE_OPTIONS | Not Verified, Verified, Expired |
| `cf_license_number` | License Number | TEXT | |
| `cf_license_state` | License State | TEXT | |
| `cf_coaching_sessions` | Coaching Sessions | NUMERICAL | |
| `cf_purchase_id` | DD Purchase ID | TEXT | Links back to Supabase |
| `cf_purchase_amount` | Purchase Amount | MONETORY | |
| `cf_records_purchased` | Records Purchased | NUMERICAL | |
| `cf_qualification_notes` | Qualification Notes | LARGE_TEXT | Sandy's assessment |

### Create Custom Fields via API
```javascript
async function createCustomField(name, fieldKey, dataType, options) {
  const body = {
    name,
    fieldKey,
    dataType, // TEXT, NUMERICAL, SINGLE_OPTIONS, etc.
    model: 'contact', // or 'opportunity'
    placeholder: `Enter ${name}`,
  };

  if (dataType === 'SINGLE_OPTIONS' && options) {
    body.options = options.map(o => ({ label: o, value: o }));
  }

  return fetch(`${GHL_BASE}/locations/${LOCATION_ID}/customFields`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GHL_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify(body),
  });
}

// Example: create all DD custom fields
await createCustomField('Net Worth', 'cf_net_worth', 'SINGLE_OPTIONS',
  ['<$50K', '$50K-$100K', '$100K-$250K', '$250K-$500K', '$500K-$1M', '$1M+']);
await createCustomField('Lead Score', 'cf_lead_score', 'NUMERICAL');
await createCustomField('Sandy Status', 'cf_sandy_status', 'SINGLE_OPTIONS',
  ['Not Contacted', 'In Conversation', 'Qualified', 'Not Qualified', 'Booked']);
```

---

## 10. Technical Implementation Plan

### Phase 1: Foundation (Week 1)
**Goal:** GHL auth + custom fields + contact push working

| Task | API/Tool | Details |
|------|----------|---------|
| Create PIT in GHL | GHL UI | Agency Settings -> Private Integrations. Select all DD-required scopes. |
| Create custom fields | `POST /locations/{id}/customFields` | Run script to create all 25 custom fields |
| Create tags | `POST /locations/{id}/tags` | dd-lead, sandy-qualified, vapi-called, fathom-analyzed, hot-lead, cold-lead, warm-lead, recruit-new |
| Create pipelines | GHL UI (not available via API) | "Lead Acquisition" pipeline with stages: New Lead -> Sandy Contact -> Qualified -> Appointment Set -> Closing -> Won/Lost |
| Create calendars | `POST /calendars/` or GHL UI | Sales Call, Strategy Session, Coaching Session |
| Add GHL push to /api/generate-csv | Vercel endpoint | After CSV generation, loop through records and upsert to GHL |
| Test: buy 10 leads | trydatadriver.com | Verify contacts appear in GHL with all custom fields |

**Env vars to add:**
```
GHL_PIT_TOKEN=pit_XXXXXX
GHL_LOCATION_ID=XXXXXX
GHL_LEAD_PIPELINE_ID=XXXXXX
GHL_STAGE_NEW_LEAD=XXXXXX
GHL_STAGE_QUALIFIED=XXXXXX
GHL_STAGE_APPOINTMENT=XXXXXX
GHL_STAGE_CLOSING=XXXXXX
GHL_SALES_CALENDAR_ID=XXXXXX
GHL_COACHING_CALENDAR_ID=XXXXXX
```

### Phase 2: Sandy Integration (Week 2)
**Goal:** Sandy AI follow-up working through GHL

| Task | API/Tool | Details |
|------|----------|---------|
| Build Sandy -> GHL connector | Sandy SMS Agent (Railway) | Sandy sends qualification data to GHL: update contact, add note, move opportunity |
| Build GHL -> Sandy webhook | GHL Workflow | Custom Webhook action fires to Sandy when new dd-lead tagged |
| Sandy appointment booking | `POST /calendars/events/appointments` | Sandy checks slots + books |
| Sandy conversation sync | `POST /conversations/messages` or iMessage Relay | Sandy messages appear in GHL conversation view |
| Test: Sandy qualifies 5 leads | End-to-end | New lead -> Sandy texts -> qualification -> appointment booked |

### Phase 3: Voice + Video (Week 3)
**Goal:** VAPI calls + Fathom analysis flowing to GHL

| Task | API/Tool | Details |
|------|----------|---------|
| VAPI GHL tools | VAPI Dashboard | Enable ghl_contact_get, ghl_contact_create, ghl_check_availability, ghl_create_event |
| Make.com: VAPI -> GHL | Make.com scenario | Watch End of Call Report -> Add Note -> Update Fields -> Move Opportunity |
| Make.com: Fathom -> GHL | Make.com scenario | Watch Meetings -> Get Summary -> Get Transcript -> Add Note -> Update Fields |
| Fathom webhook handler | Vercel endpoint | datadriver-site.vercel.app/api/fathom-webhook -> Parse + push to GHL |
| Test: make 3 VAPI calls | Phone test | Verify call notes appear in GHL, opportunity stages move |

### Phase 4: Automation Workflows (Week 4)
**Goal:** All GHL workflows built and tested

| Workflow | Trigger | Actions |
|----------|---------|---------|
| Lead Intake | Contact Tag = "dd-lead" | Wait -> Score -> Route warm/cold -> Outreach sequence |
| Sandy Follow-up | Contact Tag = "sandy-qualified" | Book appointment -> Confirmation SMS/email -> Reminders |
| Call Analysis | Inbound Webhook (from Fathom) | Parse summary -> Update fields -> Move stage -> Alert if hot |
| Appointment Reminders | Appointment Status = "confirmed" | 24hr reminder -> 1hr reminder -> Post-meeting follow-up |
| Stale Lead Nurture | Stale Opportunity (7 days) | Re-engage email -> Sandy SMS -> If no response, archive |
| Recruiting Intake | Form Submitted = "Recruiting App" | Create contact/opportunity -> Sandy screen -> License check |

### Phase 5: Snapshot + Scale (Week 5)
**Goal:** Package everything as a reusable snapshot

| Task | Details |
|------|---------|
| Finalize all workflows | Test every path, fix edge cases |
| Create snapshot | Agency Dashboard -> Actions -> Create Snapshot, include all pipelines, workflows, custom fields, calendars, templates, tags |
| Test snapshot install | Create new subaccount, apply snapshot, verify everything populated |
| Document snapshot | What to reconnect manually: Stripe, API keys, Sandy/VAPI endpoints |
| Marketplace app update | Add custom workflow actions to Data Driver marketplace app |

### Make.com Scenarios to Build

| # | Scenario Name | Trigger | Actions | Schedule |
|---|--------------|---------|---------|----------|
| 1 | Stripe -> GHL Contact | Stripe: Watch Events (checkout.session.completed) | GHL: Upsert Contact, Create Opportunity | Instant |
| 2 | VAPI Call -> GHL Notes | VAPI: Watch End of Call Report | GHL: Search Contact, Add Note, Update Contact, Update Opportunity | Instant |
| 3 | Fathom -> GHL Analysis | Fathom: Watch Meetings | Fathom: Get Summary + Transcript, GHL: Search Contact, Add Note, Update Contact | Instant |
| 4 | Supabase Purchase -> GHL | Supabase: Watch Rows (purchases table, status='paid') | GHL: Make API Call (batch upsert contacts) | Every 5 min |
| 5 | GHL Lead -> Sandy | GHL: Watch Events (ContactCreate) | HTTP: POST to Sandy SMS Agent | Instant |
| 6 | iMessage Reply -> GHL | Webhook: iMessage relay | GHL: Make API Call (create inbound message) | Instant |

---

## KEY URLS AND ENDPOINTS REFERENCE

| Service | URL |
|---------|-----|
| GHL API Base | `https://services.leadconnectorhq.com` |
| GHL OAuth Token | `POST https://services.leadconnectorhq.com/oauth/token` |
| GHL Marketplace | `https://marketplace.gohighlevel.com` |
| GHL Developer Portal | `https://developers.gohighlevel.com` |
| GHL API Docs | `https://marketplace.gohighlevel.com/docs/` |
| Data Driver Form | `https://data-driver-form.vercel.app` |
| Data Driver API | `https://datadriverapi.com` |
| Sandy SMS Agent | `https://sandy-sms-agent.vercel.app` |
| LiveAvatar Agent | `https://liveavatar-ghl-agent-production.up.railway.app` |
| Fathom Webhook | `https://datadriver-site.vercel.app/api/fathom-webhook` |
| VAPI Phone | `(732) 335-7638` |
| DD Supabase | `https://smfgkhlwoszldfsxkvib.supabase.co` |
| Clients Supabase | `https://rcmfjfuarajiuynfgyha.supabase.co` |
| Agent Supabase | `https://zymepbxosrpprrtcmmqi.supabase.co` |
| Make.com | `https://www.make.com` |

---

## SOURCES

- [HighLevel API Documentation (Official)](https://marketplace.gohighlevel.com/docs/)
- [HighLevel Developer Portal](https://developers.gohighlevel.com/)
- [HighLevel API GitHub](https://github.com/GoHighLevel/highlevel-api-docs)
- [GHL Marketplace App Template](https://github.com/GoHighLevel/ghl-marketplace-app-template)
- [Webhook Integration Guide](https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/index.html)
- [OAuth 2.0 Documentation](https://marketplace.gohighlevel.com/docs/Authorization/OAuth2.0/index.html)
- [Private Integrations Guide](https://help.gohighlevel.com/support/solutions/articles/155000003054-private-integrations-everything-you-need-to-know)
- [Scopes Reference](https://marketplace.gohighlevel.com/docs/Authorization/Scopes/index.html)
- [Workflow Triggers List](https://help.gohighlevel.com/support/solutions/articles/155000002292-a-list-of-workflow-triggers)
- [Custom Fields V2 API](https://marketplace.gohighlevel.com/docs/ghl/custom-fields/custom-fields-v-2-api/index.html)
- [Create Appointment Endpoint](https://marketplace.gohighlevel.com/docs/ghl/calendars/create-appointment/index.html)
- [Send Message Endpoint](https://marketplace.gohighlevel.com/docs/ghl/conversations/send-a-new-message/index.html)
- [Create Opportunity Endpoint](https://marketplace.gohighlevel.com/docs/ghl/opportunities/create-opportunity/index.html)
- [Marketplace Workflow Actions & Triggers](https://marketplace.gohighlevel.com/docs/marketplace-modules/WorkflowActionsAndTriggers/index.html)
- [Custom Triggers Guide](https://marketplace.gohighlevel.com/docs/marketplace-modules/CustomTriggers/index.html)
- [GHL Snapshots Overview](https://help.gohighlevel.com/support/solutions/articles/48000982511)
- [Snapshots Guide (GHLBuilds)](https://ghlbuilds.com/gohighlevel-snapshots/)
- [Make.com HighLevel Integration](https://www.make.com/en/integrations/highlevel)
- [Make.com HighLevel Modules](https://apps.make.com/highlevel)
- [Make.com Supabase Integration](https://www.make.com/en/integrations/supabase)
- [Make.com Stripe Integration](https://apps.make.com/stripe)
- [Make.com VAPI Integration](https://www.make.com/en/integrations/vapi)
- [Make.com Fathom Integration](https://www.make.com/en/integrations/fathom)
- [VAPI GHL Integration](https://docs.vapi.ai/tools/go-high-level)
- [Fathom Webhooks](https://developers.fathom.ai/webhooks)
- [GHL Rate Limits FAQ](https://marketplace.gohighlevel.com/docs/oauth/Faqs/index.html)
- [Inbound Webhook Trigger](https://help.gohighlevel.com/support/solutions/articles/48001237383-how-to-use-the-inbound-webhook-workflow-premium-trigger)
- [Custom Webhook Workflow Action](https://help.gohighlevel.com/support/solutions/articles/155000003305-workflow-action-custom-webhook)
