# DeadZone - Frontend Design System & Architecture

## Visual Style ("Dark Campus-Tech Utility")
- **Reference Inspiration:** **WiFi Map (`io.wifimap.wifimap`)** for spatial node browsing, floating need-based filter chips, speed/signal telemetry gauges, and crowdsourced status updates—combined with a sleek dark mode aesthetic.
- **Color Palette:**
  - `bgCanvas`: `#F8FAFC`
  - `bgSurface`: `#FFFFFF`
  - `bgElevated`: `#F1F5F9`
  - `borderSubtle`: `#E2E8F0`
  - `borderActive`: `#0284C7`
  - `textPrimary`: `#0F172A`
  - `textSecondary`: `#475569`
  - `textMuted`: `#64748B`
  - `accentCyan`: `#0284C7`
  - `accentBlue`: `#2563EB`
  - `statusOptimal`: `#059669`
  - `statusModerate`: `#D97706`
  - `statusDeadzone`: `#DC2626`
- **Typography:** Crisp geometric typography with `tabular-nums` monospace styling for all live telemetry (`87 Mbps`, `31 dB`, `8/12 outlets`, `23/80 seats`, `96% MATCH`).

## Need-Based Filtering System ("Filter According to Needs")
Users must be able to filter spots dynamically in three ways:
1. **Floating Multi-Filter Chip Rail (on `Home` & `Explore`):**
   - Toggable horizontal filter pills: `⚡ Fast Wi-Fi (50+ Mbps)`, `🔇 Quiet (<35 dB)`, `🔌 Power Available`, `❄️ AC Available`, `👥 Low Crowd`
   - Toggling filters spots and recalculates match percentage. Includes a `"Reset (X)"` pill.
2. **One-Tap Quick Mode Presets (on `Home`):**
   - `📚 Study` → `Quiet` + `Power Available` + `AC`
   - `📞 Call` → Call-friendly zones + good network + low/moderate crowd
   - `🎮 Gaming` → `Fast Wi-Fi (80+ Mbps)` + `Low Ping (<25ms)` + `Power Available`
   - `☕ Chill` → Lounges/cafes + `AC` + comfortable group seating
3. **Interactive "Find My Spot" Wizard (`Find` Tab):**
   - Step 1: *"What are you doing right now?"* (`Studying`, `Gaming`, `Taking a call`, `Group work`, `Chilling`)
   - Step 2: *"What matters most?"* (Priority toggles for `Quiet`, `Charging`, `Fast Wi-Fi`, `AC`, `Low crowd`)
   - Step 3: Calculates a weighted match score (`0–100%`) and navigates to `MatchResultsScreen`.

## 5-Tab Bottom Navigation & Screen Specifications
1. **`Home` Tab (`HomeScreen`):**
   - Logo, campus status badge, Profile avatar.
   - Search bar (room, building, tag).
   - 4 Quick Mode cards.
   - Need-Based Filter Chip Rail.
   - Recommended Right Now (Hero Card) with compact metric pills.
   - Nearby / Filtered Spots List.
2. **`Explore` Tab (`ExploreScreen` → `BuildingScreen` → `FloorScreen`):**
   - WiFi Map-Inspired Campus Radar / Map Node View.
   - Building Pins color-coded by live status.
   - Need-Based Filter Chip Rail at the top.
   - `BuildingScreen` showing Floor rows.
   - `FloorScreen` showing visual room cards.
3. **`Find` Tab (`FindMySpotScreen` & `MatchResultsScreen`):**
   - Interactive matcher.
4. **`Saved` Tab (`SavedSpotsScreen`):**
   - Bookmarked spots with live status indicators.
   - Filter toggle (`All Saved` vs `Available Right Now`).
   - Clean empty state CTA.
5. **`Profile` Tab (`ProfileScreen`):**
   - Student Identity Card.
   - My Default Preferences ("My Vibe Defaults").
   - Activity & Impact Stats.
   - Recent Crowdsource Reports.
   - App Settings & Demo Controls (Simulated telemetry toggle, Reset).

## Spot Details & Live Telemetry (`SpotDetailsScreen`)
- Header with Spot Name, Building, Floor, Availability Pill, Match badge.
- Wi-Fi Telemetry Card: Download, Upload, Ping, interactive `"Test Signal"` gauge animation.
- Noise Meter Card: `31 dB` with visual decibel bar.
- Power & Crowd Capacity Cards: Progress bars.
- Primary Actions: `Save Spot`, `Directions / Floor Map`, `"Report Live Status"` (crowdsourcing modal).
