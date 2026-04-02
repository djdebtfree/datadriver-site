# Data Driver Pro — Master Plan
## Sell → Onboard → Connect → Execute

---

## PHASE 1: SELL

### The Offer
**Data Driver Pro — $997/mo** (FREE Month 1 with 2,000 contact purchase)

**What they get:**
- 2,000 verified intent contacts/month ($500 value)
- Sandy AI — texts, calls, qualifies, books appointments 24/7
- 6 AI voice assistants via VAPI (inbound + outbound)
- AI video sales calls via Sandy Live Avatar
- Cold email + warm email sequences (pre-built)
- SMS/iMessage/RCS follow-up (automated)
- Call recording + AI analysis (every call summarized)
- Appointment booking (auto-scheduled on their calendar)
- Recruiting pipeline (if applicable — Sandy coaches + qualifies candidates)
- Custom SEO page + AI blog posts
- Full GHL snapshot — pipelines, workflows, automations pre-built

**What they DO NOT get (and don't need to):**
- Access to any backend systems
- Any technical setup beyond 3 steps
- Any ongoing configuration

### Sales Flow
1. Visitor lands on `datadriverpro.com` or `trydatadriver.com`
2. Popup form captures name/email/phone → Sandy Live Avatar opens
3. Sandy asks about their business, niche, current lead gen
4. Sandy qualifies and recommends DD Pro or à la carte
5. Pricing buttons → Stripe Checkout ($997/mo or $0.25/contact à la carte)
6. GHL Agency owners → separate white-label flow (buy at $0.25, sell at markup)

### Sales Channels
| Channel | Tool | Action |
|---------|------|--------|
| Website | Sandy Live Avatar | Qualify + close on video |
| SMS | Sandy SMS Agent | Follow up unconverted visitors |
| Phone | VAPI Voice | Outbound calls to warm leads |
| Email | GHL email sequences | Drip nurture |
| Retargeting | FB/Google pixels | Re-engage drop-offs |

---

## PHASE 2: ONBOARD

### The 3-Step Plug-In (what the customer does)

**Step 1: Install Snapshot** (60 seconds)
- Customer receives a GHL snapshot link via email after Stripe payment
- One-click install into their subaccount
- Snapshot contains EVERYTHING:
  - 5 pipelines (Leads, Appointments, Sales, Recruiting, Coaching)
  - 12+ workflows (auto-triggered, pre-activated)
  - 30+ custom fields (net worth, income, credit rating, intent keywords, license status, etc.)
  - Email templates (cold sequence, warm sequence, appointment confirmation, follow-up)
  - SMS templates (Sandy intro, qualification, booking, reminder)
  - Calendar configuration
  - Tags (hot lead, qualified, booked, closed, recruiting, licensed, etc.)
  - Custom values/variables

**Step 2: Connect Identity** (2 minutes)
Customer enters in the DD Pro Settings page (inside their GHL subaccount):
- Their name
- Their business name
- Their calendar link (Calendly, GHL calendar, or custom)
- Their phone number (for caller ID on VAPI calls)
- Their email signature
- Their niche (auto-configures Sandy's conversation context)

**Step 3: Buy Leads** (1 minute)
- Opens the filter form (embedded in GHL via iframe)
- Picks target market, geography, demographics, financials
- Pays via Stripe ($0.25/contact, min 100)
- Leads land in their GHL pipeline INSTANTLY — tagged, fielded, pipelined

**That's it. Sandy takes over.**

### Onboarding Automation (what happens behind the scenes)
1. Stripe payment webhook fires → creates client in Supabase
2. GHL snapshot auto-installs (or manual link sent via email)
3. Make.com scenario fires on new client:
   - Creates GHL subaccount (or connects existing)
   - Sets up Sandy AI context for their niche
   - Configures VAPI assistants with their phone/calendar
   - Activates all workflows
   - Sends welcome email with login details
4. First batch of 2,000 contacts queued for delivery
5. Sandy sends first outreach within 60 seconds of lead delivery

---

## PHASE 3: CONNECT

### Architecture — Three Rails

```
┌─────────────────────────────────────────────────────┐
│                GHL SUBACCOUNT                        │
│                                                      │
│  Pipelines │ Workflows │ Calendar │ Conversations    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ AGENT    │  │ WEBHOOKS │  │ MAKE.COM │           │
│  │ STUDIO   │  │ (in/out) │  │ SCENARIOS│           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
└───────┼──────────────┼─────────────┼─────────────────┘
        │              │             │
        ▼              ▼             ▼
   ┌─────────┐  ┌───────────┐  ┌──────────┐
   │ Sandy   │  │ DD API    │  │ Stripe   │
   │ LiveAvtr│  │ VAPI      │  │ Fathom   │
   │ (convo) │  │ Fathom    │  │ Supabase │
   └─────────┘  └───────────┘  └──────────┘
```

### Rail 1: GHL Agent Studio (Sandy's Brain)
Sandy lives as a GHL AI Agent inside Agent Studio.

**Configuration:**
- Name: Sandy Beach
- Voice: ElevenLabs Sandy Beach clone
- Personality: Data Driver Sales Mode context (injected per niche)
- Actions: Book appointment, send SMS, update contact, move pipeline stage
- Triggers: New contact added, inbound message, missed call

**What Agent Studio Handles:**
| Trigger | Sandy Does |
|---------|-----------|
| New contact enters pipeline | Texts within 60s: "Hi {name}, this is Sandy from {business}..." |
| Contact replies to SMS | Continues conversation, qualifies, asks about needs |
| Contact asks about pricing | Explains products, offers to book a call |
| Contact ready to buy | Books appointment on calendar, sends confirmation |
| Contact goes cold (3+ days) | Follow-up: "Still thinking about it, or did something change?" |
| Inbound call | VAPI answers, qualifies, transfers or books |
| Appointment booked | Sends confirmation + reminder sequence |
| Recruiting candidate | Asks qualifying questions, checks license, coaches |

### Rail 2: Webhooks (Event-Driven)

**GHL → Our Systems (outbound webhooks):**
| GHL Event | Fires To | Action |
|-----------|----------|--------|
| Contact Created | `datadriver-site.vercel.app/api/fathom-webhook` | Log new contact |
| Appointment Booked | Sandy SMS Agent | Send prep notes to sales rep |
| Call Completed | Fathom webhook | Record + transcribe + summarize |
| Opportunity Stage Changed | Make.com | Update Supabase, trigger next workflow |
| Form Submitted | Data Driver API | Process lead order |

**Our Systems → GHL (inbound API calls):**
| Source | GHL Endpoint | Action |
|--------|-------------|--------|
| Data Driver API | `POST /contacts` | Push purchased leads with all fields |
| Fathom | `POST /contacts/{id}/notes` | Add call summary to contact |
| VAPI | `POST /contacts/{id}/notes` | Add voice call transcript |
| Sandy LiveAvatar | `POST /conversations/messages` | Sync video chat transcript |
| Stripe | `POST /contacts/{id}/tags` | Tag as "paid", "pro", etc. |

### Rail 3: Make.com Scenarios (The Glue)

**Scenario 1: Lead Delivery**
```
Stripe Payment Webhook
  → Get purchase details from Supabase
  → Query Data Driver API for matching contacts
  → Generate CSV
  → Loop: Push each contact to GHL via API
    → Set custom fields (net worth, income, credit, intent keywords)
    → Add to pipeline stage "New Lead"
    → Add tags (niche, source, date)
  → Trigger GHL workflow "New Lead Arrived"
  → Send delivery confirmation email
```

**Scenario 2: Call Recording → GHL**
```
Fathom Webhook (call.completed)
  → Get transcript + summary from Fathom
  → Match contact by phone/email in GHL
  → Add note to contact: "[AI Summary] {summary}"
  → Add note: "[Full Transcript] {transcript}"
  → Update custom field: last_call_date, call_count
  → If qualified → move pipeline stage to "Appointment Ready"
```

**Scenario 3: Sandy Conversation Sync**
```
Sandy LiveAvatar Session Ended (webhook)
  → Get conversation transcript from Supabase
  → Match contact in GHL by email/phone
  → Add note: "[Sandy Video Call] {transcript}"
  → Extract: qualification status, next steps, objections
  → Update custom fields
  → If appointment requested → create GHL calendar event
  → If not qualified → move to "Nurture" pipeline stage
```

**Scenario 4: VAPI Call → GHL**
```
VAPI Call Completed (webhook)
  → Get call recording + transcript
  → Match contact in GHL
  → Add note with call summary
  → Update pipeline stage based on call outcome
  → If voicemail → trigger SMS follow-up workflow
  → If appointment booked → create calendar event
```

**Scenario 5: Recruiting Pipeline**
```
New recruiting contact enters GHL
  → Sandy texts: "Hi {name}, saw your application..."
  → Sandy qualifies (state, license, experience)
  → Check NIPR for license status
  → Update custom fields (licensed_states, license_type)
  → If qualified → move to "Interview" stage
  → If needs licensing → move to "Coaching" stage
    → Sandy starts L.I.E.S. training sequence
  → If not a fit → move to "Not Qualified", send polite close
```

**Scenario 6: Appointment Prep**
```
GHL Calendar Event Created
  → Pull contact data from GHL (all custom fields)
  → Generate AI prep doc (using contact history, call notes, intent signals)
  → Send prep email to sales rep: "Your 2pm with {name}: {prep_notes}"
  → Send confirmation SMS to contact
  → Schedule reminder: 1 hour before, 15 min before
```

**Scenario 7: Post-Sale Onboarding**
```
GHL Opportunity → "Closed Won"
  → Create customer record in Supabase
  → Generate onboarding email sequence
  → If DD Pro → install snapshot in their subaccount
  → If à la carte → deliver CSV via signed URL
  → Tag contact as "customer"
  → Move to "Customer" pipeline
  → Sandy sends: "Welcome aboard! Here's what happens next..."
```

---

## PHASE 4: EXECUTE

### What Runs Automatically — Day by Day

**Day 0 (Setup):**
- Snapshot installed ✓
- Calendar connected ✓
- First lead batch purchased ✓

**Day 1 (Sandy Activates):**
- Sandy texts all new leads within 60 seconds
- Leads who reply get qualified through conversation
- VAPI calls warm leads (responded to SMS)
- Fathom records every call
- Qualified leads get appointment links

**Day 2-7 (Follow-Up Machine):**
- Non-responders get email sequence (Day 1, 3, 5, 7)
- SMS follow-up on Day 2 and Day 5
- VAPI call attempt on Day 3
- Sandy personalizes based on prior interactions
- Pipeline stages auto-update based on engagement

**Day 7-30 (Nurture + Convert):**
- Weekly email with value content
- Sandy re-engages with context: "Last time you mentioned..."
- Hot leads get priority call from VAPI
- Appointments booked → prep docs generated → sales calls happen
- Call analysis → next steps auto-triggered

**Ongoing (Perpetual):**
- New leads added monthly (2,000 with Pro, or à la carte)
- Sandy never stops following up
- Every call recorded, transcribed, summarized
- Pipeline always flowing
- Recruiting candidates always being coached
- Dashboard shows: contacts, conversations, appointments, conversions, revenue

### Metrics Dashboard (GHL Custom Reporting)
| Metric | Source |
|--------|--------|
| Leads delivered | Data Driver API |
| Contact rate | GHL conversations |
| Response rate | Sandy conversation data |
| Appointments booked | GHL calendar |
| Show rate | GHL appointment status |
| Calls made | VAPI + GHL phone |
| Call duration avg | Fathom data |
| Close rate | GHL opportunity pipeline |
| Revenue generated | Stripe |
| Cost per appointment | Stripe ÷ appointments |
| Sandy conversations | Supabase session data |
| Recruits onboarded | GHL recruiting pipeline |

---

## GHL SNAPSHOT CONTENTS

### Pipelines (5)
1. **Lead Pipeline**: New Lead → Contacted → Qualifying → Appointment Set → Show → Closed Won / Lost
2. **Appointment Pipeline**: Pending → Confirmed → Reminded → Completed → No-Show
3. **Sales Pipeline**: Prospect → Demo → Proposal → Negotiation → Closed Won / Lost
4. **Recruiting Pipeline**: Application → Sandy Qualifying → License Check → Interview → Onboarding → Active Agent
5. **Coaching Pipeline**: Enrolled → Pre-Licensing → Exam Prep → Licensed → Product Training → Field Ready

### Custom Fields (30+)
**Contact Fields:**
- net_worth, household_income, credit_rating, age, gender
- homeowner_status, marital_status, children
- intent_keywords, lead_source, lead_date, target_market
- linkedin_url, verified_email, verified_phone
- sandy_qualification_status, sandy_last_contact
- last_call_date, call_count, call_score
- license_status, licensed_states, license_type
- coaching_stage, training_progress
- fathom_call_id, recording_url

### Workflows (12)
1. **New Lead Auto-Engage** — Sandy texts within 60s
2. **Email Drip (Cold)** — 7-email sequence over 14 days
3. **Email Drip (Warm)** — 5-email sequence for responders
4. **SMS Follow-Up** — Day 2, 5, 10, 20 texts
5. **VAPI Call Trigger** — Auto-dial warm leads on Day 3
6. **Appointment Booked** — Confirmation + reminders
7. **No-Show Recovery** — Sandy re-engages + reschedules
8. **Post-Call Analysis** — Fathom summary → pipeline update
9. **Recruiting Qualification** — Sandy qualifying flow
10. **Coaching Sequence** — L.I.E.S. training drip
11. **License Verification** — NIPR check on qualifying candidates
12. **Re-Engagement (30-day)** — Monthly check-in for cold leads

### Tags (20+)
hot_lead, warm_lead, cold_lead, qualified, not_qualified, appointment_set, showed, no_show, closed_won, closed_lost, pro_customer, a_la_carte, recruiting_candidate, licensed, needs_licensing, coaching_active, coaching_complete, vapi_called, sandy_contacted, fathom_recorded

### Email Templates (10)
1. Welcome / Lead Delivery Confirmation
2. Cold Outreach #1-5
3. Warm Follow-Up #1-3
4. Appointment Confirmation
5. Appointment Reminder (1hr before)
6. No-Show Follow-Up
7. Post-Call Summary
8. Recruiting Welcome
9. Coaching Module Delivery
10. Monthly Re-Engagement

### SMS Templates (8)
1. Sandy Intro: "Hi {name}, this is Sandy from {business}. I pulled some data for you..."
2. Qualification Ask: "Quick question — what niche are you in right now?"
3. Appointment Offer: "Ready to see how this works? I can book you a quick call."
4. Appointment Confirmation: "You're booked for {date} at {time}. Talk soon!"
5. Appointment Reminder: "Hey {name}, just a heads up — your call is in 1 hour."
6. No-Show: "Missed you today! Want to reschedule? No pressure."
7. Follow-Up: "Still thinking about it, or did something change?"
8. Recruiting: "Hi {name}, saw your application. Quick question about your background..."

---

## IMPLEMENTATION ORDER

### Week 1: Core
- [ ] GHL Snapshot built (pipelines, fields, tags, templates)
- [ ] Sandy configured in Agent Studio (Sales Mode)
- [ ] Lead delivery Make.com scenario live
- [ ] Webhook endpoints receiving GHL events

### Week 2: Automation
- [ ] All 12 workflows activated and tested
- [ ] VAPI calling integrated via Make.com
- [ ] Fathom → GHL call summary scenario live
- [ ] Appointment booking flow end-to-end tested

### Week 3: Recruiting + Coaching
- [ ] Recruiting pipeline + Sandy qualifying flow
- [ ] License verification via NIPR
- [ ] Coaching sequence (L.I.E.S. training)
- [ ] Progress tracking in custom fields

### Week 4: Polish + Launch
- [ ] Dashboard/reporting configured
- [ ] End-to-end test: buy leads → Sandy contacts → appointment → sale
- [ ] White-label documentation for agency resellers
- [ ] Launch to first 10 beta users
