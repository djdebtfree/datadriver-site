# Data Driver Pro -- GHL Snapshot Product Spec

**Date:** 2026-04-02
**Status:** Research Complete / Ready for Build
**Product:** Data Driver Pro SaaS Snapshot for GoHighLevel

---

## Executive Summary

The Data Driver Pro snapshot is a one-click installable GHL sub-account template that gives a user a fully operational sales automation system. The user does THREE things:

1. **Install the snapshot** (one click from marketplace or share link)
2. **Connect their calendar + phone number** (mandatory -- GHL cannot snapshot these)
3. **Buy leads** (via trydatadriver.com or in-app Data Driver form)

Everything else is pre-built and auto-activated inside the snapshot.

---

## Part 1: What the Snapshot Contains (Pre-Built, Zero Config)

### Pipelines (All Pre-Built)

| Pipeline | Stages | Purpose |
|----------|--------|---------|
| **Lead Acquisition** | New Lead > Enriched > Qualified > Contacted | Inbound lead flow from Data Driver API |
| **Appointment Pipeline** | Booked > Confirmed > Showed > No-Show > Closed | Sales meeting flow |
| **Nurture Pipeline** | Cold > Warming > Hot > Re-engage > Dead | Long-term drip nurture |
| **Onboarding Pipeline** | Purchased > Setup Call > Active > Retained | Post-sale customer success |

### Workflows (All Pre-Built, Auto-Publish on Load)

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **New Lead Intake** | Webhook (Data Driver API) | Create contact, tag, assign to Lead Acquisition pipeline, trigger Sandy SMS |
| **Sandy SMS Sequence** | Pipeline stage change to "Contacted" | Send initial SMS via Sandy AI, wait 2min, send follow-up, If/Else on reply |
| **Appointment Booked** | Calendar event created | Move to Appointment Pipeline, send confirmation email + SMS, create Fathom calendar hold |
| **Appointment Reminder** | Time-based (24hr + 1hr before) | Send reminder SMS + email with meeting link |
| **No-Show Recovery** | Appointment status = no-show | Trigger re-engagement SMS via Sandy, move to Nurture |
| **Lead Scoring Engine** | Contact field update | Math operation on custom field `dd_lead_score`, If/Else routing based on score thresholds |
| **Post-Call Follow-Up** | Webhook (Fathom/VAPI call ended) | Update contact notes, send follow-up email with summary, move pipeline stage |
| **VAPI Inbound Call** | Phone call received | Route to VAPI voice agent, log call, update contact, trigger Post-Call workflow |
| **VAPI Outbound Dial** | Pipeline stage change OR manual trigger | Initiate VAPI outbound call, play Sandy script, log outcome |
| **Win Notification** | Pipeline stage = Closed Won | Internal notification, update custom fields, trigger Onboarding Pipeline |
| **Dead Lead Recycle** | 30-day inactivity timer | Move to Nurture Pipeline "Re-engage" stage, trigger re-engagement sequence |
| **Data Driver Webhook Receiver** | Inbound webhook | Parse CSV/JSON lead data from Data Driver API, batch-create contacts |

### Custom Fields (All Pre-Created)

| Field Name | Type | Location | Purpose |
|------------|------|----------|---------|
| `dd_lead_score` | Number | Contact | Calculated lead score (0-100) |
| `dd_source_segment` | Text | Contact | AudienceLab segment name |
| `dd_purchase_id` | Text | Contact | Data Driver purchase ID |
| `dd_enrichment_status` | Dropdown | Contact | raw / enriched / verified |
| `dd_linkedin_url` | URL | Contact | LinkedIn profile link |
| `dd_company_name` | Text | Contact | Business name from Data Driver |
| `dd_job_title` | Text | Contact | Job title from Data Driver |
| `dd_net_worth` | Dropdown | Contact | Net worth bracket |
| `dd_income_range` | Dropdown | Contact | Household income bracket |
| `dd_credit_rating` | Dropdown | Contact | Credit rating bracket |
| `dd_homeowner` | Dropdown | Contact | Yes / No / Unknown |
| `dd_children` | Dropdown | Contact | Has children Y/N |
| `dd_last_contacted` | Date | Contact | Last outreach timestamp |
| `dd_call_recording_url` | URL | Contact | Fathom/VAPI recording link |
| `dd_call_summary` | Long Text | Contact | AI-generated call summary |
| `dd_api_webhook_url` | Text | Custom Value | Data Driver API callback URL |
| `dd_vapi_assistant_id` | Text | Custom Value | VAPI assistant identifier |
| `dd_fathom_api_key` | Text | Custom Value | Fathom API key (user fills post-install) |

### Custom Values (System-Wide Placeholders)

| Value Name | Default | Purpose |
|------------|---------|---------|
| `{{custom_values.dd_api_endpoint}}` | `https://datadriverapi.fixmyonline.com/api/v1` | Data Driver API base URL |
| `{{custom_values.dd_webhook_secret}}` | `(generated per install)` | Webhook verification token |
| `{{custom_values.company_name}}` | `Your Company` | User's business name |
| `{{custom_values.sender_name}}` | `Your Name` | Default SMS/email sender |
| `{{custom_values.booking_link}}` | `(calendar link)` | Calendar booking URL |

### Email Templates (Pre-Written)

| Template | Trigger Point |
|----------|---------------|
| Appointment Confirmation | Calendar booking |
| Appointment Reminder (24h) | Time-based |
| Appointment Reminder (1h) | Time-based |
| No-Show Follow-Up | No-show detected |
| Post-Call Summary | After VAPI/Fathom call |
| Welcome / Onboarding | New customer pipeline entry |
| Re-Engagement | 30-day inactivity |
| Lead Delivery Receipt | After Data Driver CSV delivery |

### SMS Templates (Pre-Written, Sandy AI Powered)

| Template | Personality |
|----------|-------------|
| Initial Outreach | Sandy warm intro |
| Follow-Up (no reply) | Sandy persistent but friendly |
| Appointment Booking CTA | Sandy direct ask |
| Appointment Confirmation | Professional confirmation |
| Appointment Reminder | Friendly reminder |
| No-Show Re-Engage | Sandy empathetic re-engage |
| Post-Call Thank You | Sandy recap + next steps |

### Calendars (Pre-Configured)

| Calendar | Type | Duration | Buffer |
|----------|------|----------|--------|
| Discovery Call | Service Calendar | 30 min | 15 min |
| Strategy Session | Service Calendar | 60 min | 15 min |
| Quick Check-In | Service Calendar | 15 min | 5 min |

**Note:** Calendar structures transfer. User must connect their actual Google/Outlook calendar and set availability after install.

### Tags (Pre-Created)

`dd-lead`, `dd-enriched`, `dd-qualified`, `dd-contacted`, `dd-booked`, `dd-showed`, `dd-no-show`, `dd-closed-won`, `dd-closed-lost`, `dd-nurture`, `dd-re-engage`, `dd-vip`, `dd-high-score`, `dd-low-score`, `sandy-engaged`, `vapi-called`, `fathom-recorded`

### Forms & Surveys

| Asset | Purpose |
|-------|---------|
| Lead Intake Form | Manual lead entry (embedded in funnel) |
| Post-Call Survey | Quick feedback form after appointments |
| Onboarding Checklist | New customer setup questions |

---

## Part 2: What CANNOT Be in the Snapshot (GHL Platform Limitations)

These items NEVER transfer in any GHL snapshot. They are per-account and require post-install configuration.

| Item | Why | User Action Required |
|------|-----|---------------------|
| **Phone Numbers** | Tied to Twilio/LC Phone per account | User buys/ports a number in GHL |
| **Calendar Connections** | OAuth per user (Google/Outlook) | User connects their calendar |
| **Third-Party OAuth Tokens** | Security -- tokens are per-account | User authorizes VAPI, Fathom, etc. |
| **Contacts / Conversations** | Data isolation -- never transfers | N/A (starts fresh) |
| **Users / Team Members** | Account-specific | User creates their team |
| **Tracking Codes** | Per-domain | User adds to their site |
| **Reputation / Reviews** | Per-business | N/A |
| **Billing / Stripe Connection** | Per-agency | Already handled by SaaS mode |
| **Domain / SSL** | Per-account | User connects domain if using funnels |
| **Reporting Data** | Historical -- never transfers | Starts collecting on day 1 |
| **Integration Connections** | OAuth tokens per account | See Setup Wizard below |

---

## Part 3: The 3-Step User Experience

### Step 1: Install Snapshot (ONE CLICK)

**Distribution Method:** GHL Marketplace listing OR SaaS Mode auto-install

- **Marketplace Path:** User clicks "Install" on the Data Driver Pro marketplace listing. Snapshot loads into their sub-account automatically. IP-protected so they cannot resell.
- **SaaS Mode Path:** When user purchases Data Driver Pro subscription (Stripe -> SaaS Configurator), GHL auto-creates a sub-account with the snapshot pre-loaded. Zero manual import.

**API-Driven Path (for trydatadriver.com):**
```
POST /locations/
{
  "name": "{{user_business_name}}",
  "email": "{{user_email}}",
  "snapshotId": "{{dd_pro_snapshot_id}}",
  "snapshotType": "own"
}
```
This programmatically creates the sub-account with the full snapshot. Requires Agency Pro plan ($497/mo).

**What Happens on Install:**
- All pipelines created
- All workflows loaded (in published state if source was published)
- All custom fields created
- All email/SMS templates loaded
- All calendars created (empty, awaiting connection)
- All tags created
- All forms/surveys created
- Custom values populated with defaults

### Step 2: Connect Calendar + Phone (2 MINUTES)

The snapshot includes a **post-install welcome workflow** that guides the user:

1. **Connect Calendar:** Settings > Calendars > Connections > "+ Add New" > Select Google or Outlook > OAuth flow (30 seconds)
2. **Set Availability:** Click the pre-built "Discovery Call" calendar > Set available hours (1 minute)
3. **Assign Phone Number:** Settings > Phone Numbers > Buy New or Port Existing > Assign to VAPI inbound workflow (30 seconds)

That is it. The user's calendar and phone are now wired into all pre-built workflows.

### Step 3: Buy Leads (WHEN READY)

User goes to `trydatadriver.com` or uses the embedded Data Driver form (if funnel is included in snapshot):

1. Select target market
2. Apply filters (state, age, income, etc.)
3. Choose record count
4. Pay via Stripe ($0.25/record standard, $0.20/record volume 5000+)
5. Leads auto-delivered via webhook into GHL contact list
6. Workflows auto-trigger: scoring, Sandy SMS outreach, pipeline assignment

---

## Part 4: Integration Auto-Connection Strategy

### Tier 1: Zero Config (Works Immediately)

| Integration | How | Notes |
|-------------|-----|-------|
| **Data Driver API** | Webhook URL baked into workflow | Inbound webhook trigger has static URL per sub-account; DD API posts leads directly |
| **Sandy SMS** | GHL-native workflow actions | SMS templates + workflow actions are snapshot-native. Sandy's personality is in the prompt templates |
| **Lead Scoring** | GHL-native math operations | Custom fields + workflow math = zero external dependency |
| **Email Sequences** | GHL-native email actions | Templates + workflows = fully native |
| **Pipeline Automation** | GHL-native pipeline actions | All stage changes trigger workflows natively |

### Tier 2: One-Time OAuth (Setup Wizard Handles)

| Integration | OAuth Flow | Time |
|-------------|-----------|------|
| **VAPI Voice** | GHL has native VAPI integration (marketplace app). User installs VAPI app > authorizes > done. Workflow actions auto-connect. | 60 seconds |
| **Google/Outlook Calendar** | Settings > Calendars > Connect. Standard OAuth. | 30 seconds |
| **Fathom AI** | Fathom has Zapier/Make integration. User enters Fathom API key into custom value `dd_fathom_api_key`. Webhook workflow handles the rest. | 60 seconds |

### Tier 3: Make.com Scenarios (Pre-Built, Clone Per User)

| Scenario | Trigger | Action | Clone Strategy |
|----------|---------|--------|----------------|
| **Fathom -> GHL Notes** | Fathom webhook (call ended) | Update GHL contact with call summary + recording URL | Make.com template. User clones via share link, enters their Fathom API key + GHL API key |
| **Data Driver CSV -> GHL Bulk Import** | Scheduled (daily) or webhook | Parse CSV from Supabase storage, batch-create GHL contacts | Make.com template. Pre-built, user enters GHL location ID |
| **VAPI Call Log -> GHL** | VAPI webhook (call completed) | Create/update GHL contact, add call recording URL, update pipeline | Make.com template OR use GHL native VAPI workflow actions (preferred) |

**Make.com Clone Strategy:**
- Pre-build each scenario in a master Make.com organization
- Generate shareable template links via Make API (`POST /templates`)
- User clicks link > clones scenario into their Make.com org
- User enters their API keys (GHL PIT, Fathom, VAPI) into the cloned scenario connections
- Activate. Done.

**Make.com API for Programmatic Cloning:**
```
POST /api/v2/scenarios/{scenarioId}/clone
Headers: Authorization: Token {make_api_key}
Body: { "teamId": "{user_team_id}" }
```

---

## Part 5: Post-Install Setup Wizard (Automated Guidance)

### Implementation: GHL Workflow + Custom Menu Link

A dedicated **"Setup Wizard"** workflow triggers on first login (or via a custom menu link in the sub-account sidebar):

**Step 1 (Automatic):** Welcome email sent with setup instructions
**Step 2 (In-App Prompt):** "Connect your calendar" -- direct link to Settings > Calendars
**Step 3 (In-App Prompt):** "Add a phone number" -- direct link to Settings > Phone Numbers
**Step 4 (In-App Prompt):** "Connect VAPI" -- direct link to Marketplace > VAPI app install
**Step 5 (Optional):** "Connect Fathom" -- paste API key into custom value field
**Step 6 (Optional):** "Set up Make.com scenarios" -- links to pre-built template clone URLs
**Step 7 (Done):** "Buy your first leads!" -- link to trydatadriver.com

The wizard uses custom fields to track completion:
- `dd_setup_calendar` (checkbox)
- `dd_setup_phone` (checkbox)
- `dd_setup_vapi` (checkbox)
- `dd_setup_complete` (checkbox -- auto-set when required steps done)

---

## Part 6: Technical Architecture

### Data Flow

```
[trydatadriver.com]
    |-- User purchases leads
    |-- Stripe payment confirmed
    |-- Data Driver API queries AudienceLab segments
    |-- CSV generated from Supabase (smfgkhlwoszldfsxkvib)
    |
    v
[Webhook POST to GHL Sub-Account]
    |-- Inbound Webhook Trigger in workflow
    |-- Contact created with all DD custom fields populated
    |-- Lead score calculated via Math Operation
    |-- Assigned to Lead Acquisition pipeline
    |-- Sandy SMS sequence triggered
    |
    v
[Sandy SMS Agent] (GHL-native workflow)
    |-- Sends personalized outreach SMS
    |-- Monitors for replies
    |-- Books appointments on reply
    |
    v
[VAPI Voice Agent] (GHL marketplace integration)
    |-- Handles inbound calls
    |-- Makes outbound qualification calls
    |-- Logs transcripts to contact record
    |
    v
[Fathom AI] (webhook via Make.com OR direct API)
    |-- Records video meetings
    |-- Pushes notes + action items to GHL contact
    |-- Updates dd_call_summary custom field
```

### Webhook Architecture

Each GHL sub-account has a unique inbound webhook URL generated when the workflow is created. The Data Driver API must know this URL to push leads.

**Solution:** After snapshot install, the "Data Driver Webhook Receiver" workflow generates an inbound webhook URL. This URL is:
1. Displayed in the Setup Wizard
2. Stored in custom value `{{custom_values.dd_api_webhook_url}}`
3. User pastes it into their trydatadriver.com account settings (or it is auto-registered via API if we build that)

**Future Enhancement:** Build a Data Driver GHL Marketplace App that auto-registers the webhook URL on install using OAuth. This eliminates the manual step entirely.

### Snapshot Versioning

GHL now supports snapshot version management:
- Track changes across snapshot updates
- Compare versions
- Rollback to previous versions
- Push updates to existing sub-accounts

This means we can iterate on the snapshot (add workflows, update templates) and push updates to all installed sub-accounts without requiring re-installation.

---

## Part 7: Distribution Strategy

### Option A: GHL App Marketplace (Recommended for Scale)

- **Listing Type:** White-Label (broader reach)
- **Pricing:** Free snapshot + paid lead credits via trydatadriver.com
- **IP Protection:** Automatic (marketplace enforced)
- **Auto-Install:** Yes (marketplace handles snapshot loading)
- **Review Period:** 7-10 days for initial approval
- **Revenue:** Lead sales, not snapshot sales

### Option B: SaaS Mode (Recommended for Control)

- **Product:** Data Driver Pro subscription ($497 one-time or monthly)
- **Snapshot:** Auto-loaded on subscription activation
- **Billing:** Stripe via SaaS Configurator
- **Onboarding:** Fully automated (account creation + snapshot + welcome email)
- **Revenue:** Subscription + lead sales

### Option C: Share Link (Quick Distribution)

- **Link Type:** Permanent or one-time share links
- **API Generation:** `POST /snapshots/share/link` for programmatic distribution
- **Use Case:** Direct sales, partnerships, demos

**Recommended:** Start with **Option B (SaaS Mode)** for controlled launch, then add **Option A (Marketplace)** for scale.

---

## Part 8: Minimum User Actions Summary

| # | Action | Time | Required? |
|---|--------|------|-----------|
| 1 | Install snapshot (click link or auto via SaaS) | 10 sec | YES |
| 2 | Connect Google/Outlook calendar | 30 sec | YES |
| 3 | Set calendar availability hours | 60 sec | YES |
| 4 | Buy/assign phone number | 30 sec | YES (for voice) |
| 5 | Install VAPI marketplace app | 60 sec | YES (for voice AI) |
| 6 | Paste Fathom API key | 30 sec | NO (optional) |
| 7 | Clone Make.com scenarios | 2 min | NO (optional) |
| 8 | Buy leads on trydatadriver.com | 2 min | When ready |

**Mandatory steps: 4 actions, under 3 minutes total.**
**With optional integrations: 7 actions, under 7 minutes total.**

---

## Part 9: What to Build Next

### Priority 1 (Snapshot Build)
- [ ] Create master sub-account with all pipelines, workflows, custom fields, templates
- [ ] Build and test all 12 workflows end-to-end
- [ ] Write all email and SMS templates with Sandy's voice
- [ ] Create snapshot from master sub-account
- [ ] Test snapshot import into clean sub-account
- [ ] Verify all workflows activate correctly post-import
- [ ] Test webhook data flow from Data Driver API

### Priority 2 (Distribution)
- [ ] Set up SaaS Mode in agency account
- [ ] Configure SaaS plan with snapshot auto-load
- [ ] Create Stripe product/price for subscription
- [ ] Build post-install setup wizard workflow
- [ ] Submit to GHL App Marketplace (7-10 day review)

### Priority 3 (Make.com Templates)
- [ ] Build Fathom -> GHL scenario template
- [ ] Build Data Driver CSV -> GHL bulk import scenario template
- [ ] Generate shareable template links
- [ ] Test clone flow for new users

### Priority 4 (Full Automation)
- [ ] Build Data Driver GHL Marketplace App (OAuth)
- [ ] Auto-register webhook URL on app install
- [ ] Auto-connect Data Driver API to sub-account
- [ ] Eliminate all manual webhook configuration

---

## Appendix: GHL Snapshot Transfer Matrix

| Asset Type | Transfers in Snapshot? | Notes |
|-----------|----------------------|-------|
| Pipelines | YES | All stages, custom fields |
| Workflows | YES | Includes all actions, triggers, conditions |
| Custom Fields | YES | Contact, Opportunity, Custom Object |
| Custom Values | YES | System-wide key/value pairs |
| Tags | YES | All tags |
| Email Templates | YES | Full HTML + merge fields |
| SMS Templates | YES | Full text + merge fields |
| Calendars | YES | Structure only -- no connections |
| Forms | YES | All fields + styling |
| Surveys | YES | All questions + logic |
| Funnels/Websites | YES | All pages + styling |
| Trigger Links | YES | URL-based automation triggers |
| Membership Products | YES | Courses, offers |
| Voice AI Agents | YES | Agents, prompts, configs (NOT phone numbers) |
| Voice AI Workflows | YES | VAPI actions and triggers |
| Custom Reports | YES | Templates only -- no data, no schedules |
| Folders | YES | Organization structure |
| Teams | YES | Team structure (no users) |
| Phone Numbers | NO | Must be purchased/assigned per account |
| Calendar Connections | NO | OAuth per user |
| Integration Tokens | NO | OAuth per account |
| Contacts | NO | Data isolation |
| Conversations | NO | Data isolation |
| Users | NO | Per-account |
| Tracking Codes | NO | Per-domain |
| Reputation/Reviews | NO | Per-business |
| Reporting Data | NO | Historical data stays in source |
| Billing Config | NO | Per-agency |
