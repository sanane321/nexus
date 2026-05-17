# NEXUS IoT Security Spec

## Data Invariants
- A device must have a valid ownerId matching the authenticated user.
- Telemetry cannot be updated once written (immutable historical record).
- Alerts can only be resolved by the device owner.
- Assets are private to the creator.

## Dirty Dozen Payloads
- Try to update ownerId of a device to someone else.
- Try to write telemetry for a device you don't own.
- Try to delete an alert you don't own.
- Try to update an immutable field (e.g., createdAt).
- Try to inject deep objects into metadata to exceed size limits.
- etc.

## Rules Draft
I will implement strict `isValid[Entity]` checks for all collections.
