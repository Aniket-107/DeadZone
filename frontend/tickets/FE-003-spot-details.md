Status: DONE
Priority: HIGH
Type: FRONTEND

## Objective
Build `SpotDetailsScreen` with live telemetry.

## Requirements
- Header with availability and % Match.
- Wi-Fi Speed/Ping widget with interactive animated `"Test Signal"` gauge.
- Noise dB meter card.
- Outlets/Crowd progress bars.
- `Save Spot` and `Directions` action buttons.
- 3-tap Crowdsource Report Modal (`"Report Live Status"`).

## Files to Create/Modify
- `frontend/src/screens/SpotDetailsScreen.tsx`
- `frontend/src/components/TelemetryCards.tsx`
- `frontend/src/components/ReportModal.tsx`

## Acceptance Criteria
- Live telemetry is styled correctly using tabular-nums.
- Animated signal check functions smoothly.
