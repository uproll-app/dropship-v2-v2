# Security Specification & Threat Model

## 1. Data Invariants
- **PII Isolation & Protection**: Customer order details (home address, phone number, PIN code, post office) are PII. Reads of `/orders/{orderId}` must be restricted to the order owner (`resource.data.userId == request.auth.uid`) or authorized administrators. Unauthenticated or foreign users cannot list or query other people's orders.
- **Product & Hero Slide Integrity**: Store catalog items (`/products/{productId}`) and hero slider configurations (`/hero_slides/{slideId}`) can be viewed by all store visitors (`allow read: if true`), but writes (creation, update, deletion) are strictly restricted to authenticated administrators.
- **Master Gate Verification**: Admin privileges are derived from trusted database records at `/admins/{request.auth.uid}` or verified admin token (`uproll.fire.gai@gmail.com` with `email_verified == true`). Client tokens never hold arbitrary custom claims that grant admin rights.
- **Order Placement Safety**: Customers can place cash on delivery orders (`allow create: if isValidOrder(incoming())`). Order payloads must strictly enforce bounded string lengths, valid contact format, positive prices, and non-empty items array to prevent denial-of-wallet resource attacks or injection of ghost fields.
- **Identity Integrity**: Users cannot modify their assigned role or assign themselves to `/admins/`. Modifying another user's profile is strictly prohibited.
- **Anti-Update-Gap**: All updates must pass through `affectedKeys().hasOnly()` or be executed by verified admins.

## 2. The Dirty Dozen Payloads
1. **Ghost Field Poisoning in Product**: Attacker attempts to inject hidden malicious fields (`{ title: "Dress", price: 100, isAdminControlled: true, maliciousPayload: "..." }`) -> Rejected.
2. **Order Price Manipulation**: Attacker attempts to create an order with negative total (`{ total: -500 }`) -> Rejected.
3. **PII Harvesting via Blanket Read**: Unauthenticated attacker executes collection query on `/orders` without owning the records -> Rejected.
4. **ID Poisoning Attack**: Attacker targets document path `/products/12345_junk_` with a 2KB string -> Rejected by `isValidId`.
5. **Admin Self-Escalation**: Regular user writes document to `/admins/{their_uid}` -> Rejected.
6. **Hero Slide Vandalism**: Non-admin user attempts to alter `hero_slides` banner content or images -> Rejected.
7. **Order Status Tampering**: Customer attempts to change their own order status directly to `delivered` or `cash_collected` -> Rejected.
8. **Unbounded String Injection (Denial of Wallet)**: Customer submits order address containing 100KB garbage text -> Rejected by `.size() <= 500`.
9. **Email Spoofing Attack**: Attacker logs in with unverified email matching admin address without verification -> Rejected (`email_verified == true`).
10. **Product Deletion by Customer**: Non-admin sends delete request for a bestseller product -> Rejected.
11. **Orphaned Hero Slide Creation**: Attacker attempts to create a hero slide pointing to a non-string or 10KB product ID -> Rejected.
12. **Customer Phone Format Flooding**: Attacker attempts to submit an order with a 100-character phone number -> Rejected.

## 3. Test Runner Design
A test suite validates all 12 payloads return `PERMISSION_DENIED` under unauthenticated and non-admin security contexts while permitting legitimate admin catalog curation and customer order placement.
