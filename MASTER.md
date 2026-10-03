# DeadZone - Product Overview

DeadZone is a campus micro-spot discovery mobile application helping college students find suitable spots around campus for studying, taking calls, gaming, group work, or relaxing during gaps between classes.

## Core Principle
Answer the question "Where should I go right now?" based on real-time and simulated metrics (Wi-Fi quality, noise level, charging availability, crowd level, AC availability, seating availability) rather than acting as a static directory.

## Tech Stack
- Frontend: React Native + Expo + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (Supabase ready)

## Architecture Separation
Frontend and backend must remain strictly decoupled. Frontend speaks to backend exclusively through HTTP APIs. Screens must never access the database directly.

## Simulated Metrics Notice
Wi-Fi speed tests, noise levels in dB, and crowd capacity are simulated/demo metrics in Phases 1 & 2. Do not treat simulated data as real sensor input.

## Development Phases
- Phase 1: Frontend Prototype (Screens, Navigation, Mock Data)
- Phase 2: Frontend Logic (Search, Filters, Match Algorithm, Saved Spots, Animations)
- Phase 3: Backend (Node, Express, TypeScript, PostgreSQL, API routes)
- Phase 4: Integration (Replace mock data with API service calls)
- Phase 5: Authentication (Login/Register, User state)
- Phase 6: Crowdsourcing (Live student reports for noise, crowd, Wi-Fi)
- Phase 7: Polish (Performance, animations, accessibility, final UI)
