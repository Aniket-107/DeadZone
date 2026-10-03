// DeadZone – Expo / React Native (zero extra dependencies)
// Setup:
//   npx create-expo-app deadzone --template blank
//   replace App.js with this file, then: npx expo start
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView,
  StatusBar, TextInput, Platform, Animated, LayoutAnimation, UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ───────────────────────── theme + data ───────────────────────── */
const theme = {
  bg: '#F6F5FB', card: '#FFFFFF', text: '#14121F', sub: '#6B6880', line: '#E7E5F0',
  accent: '#5B4BFF', accentSoft: '#ECEAFF', good: '#18A957', warn: '#F0A020', bad: '#E5484D',
};
const IMG = 'https://screen-etcher-plus.lovable.app/assets/';
const PHOTO = {
  lib: IMG + 'library-zdzWV6HN.jpg', sci: IMG + 'science-bridge-Dem8nIwc.jpg',
  lab: IMG + 'media-lab-CG2wc2ys.jpg', cafe: IMG + 'cafe-BL4YRLJ_.jpg',
};

// walk = minutes from you, seats = free seats, mins = minutes since last verified
const SPOTS0 = [
  { id: 1, name: 'North Wing Nook', building: 'Central Library', floor: 'Level 3', photo: PHOTO.lib, wifi: 120, noise: 'Silent', crowd: 'Low', plugs: 8, seats: 7, ac: true, open: true, mins: 4, walk: 3, x: 22, y: 20 },
  { id: 2, name: 'Science Bridge', building: 'Newton Hall', floor: 'Level 4', photo: PHOTO.sci, wifi: 85, noise: 'Calm', crowd: 'Low', plugs: 6, seats: 9, ac: true, open: true, mins: 6, walk: 6, x: 72, y: 24 },
  { id: 3, name: 'Phone Booth Row', building: 'Student Center', floor: 'Level 1', photo: PHOTO.lab, wifi: 90, noise: 'Calm', crowd: 'Low', plugs: 4, seats: 3, ac: true, open: true, mins: 31, walk: 4, x: 45, y: 54 },
  { id: 4, name: 'Reading Room Alcove', building: 'Central Library', floor: 'Level 1', photo: PHOTO.lib, wifi: 60, noise: 'Calm', crowd: 'Medium', plugs: 2, seats: 5, ac: true, open: true, mins: 22, walk: 5, x: 14, y: 34 },
  { id: 5, name: 'Archive Carrels', building: 'Central Library', floor: 'Basement', photo: PHOTO.lib, wifi: 15, noise: 'Silent', crowd: 'Low', plugs: 1, seats: 2, ac: false, open: false, mins: 120, walk: 6, x: 32, y: 30 },
  { id: 6, name: 'Media Lab Corner', building: 'Student Center', floor: 'Level 2', photo: PHOTO.lab, wifi: 300, noise: 'Chatty', crowd: 'Medium', plugs: 12, seats: 5, ac: true, open: true, mins: 18, walk: 5, x: 55, y: 66 },
  { id: 7, name: 'Innovation Pods', building: 'Tech Commons', floor: 'Level 1', photo: PHOTO.lab, wifi: 200, noise: 'Chatty', crowd: 'Medium', plugs: 10, seats: 12, ac: true, open: true, mins: 8, walk: 8, x: 78, y: 70 },
  { id: 8, name: 'Rooftop Terrace', building: 'Tech Commons', floor: 'Roof', photo: PHOTO.cafe, wifi: 25, noise: 'Calm', crowd: 'Low', plugs: 0, seats: 20, ac: false, open: false, mins: 12, walk: 9, x: 84, y: 54 },
  { id: 9, name: 'Lecture Hall Lobby', building: 'Newton Hall', floor: 'Ground', photo: PHOTO.sci, wifi: 30, noise: 'Chatty', crowd: 'High', plugs: 3, seats: 4, ac: true, open: true, mins: 48, walk: 7, x: 66, y: 38 },
  { id: 10, name: 'Courtyard Café', building: 'Student Center', floor: 'Ground', photo: PHOTO.cafe, wifi: 40, noise: 'Loud', crowd: 'High', plugs: 2, seats: 6, ac: false, open: true, mins: 9, walk: 2, x: 40, y: 82 },
  { id: 11, name: 'Garden Steps', building: 'Arts Quadrangle', floor: 'Ground', photo: PHOTO.cafe, wifi: 20, noise: 'Calm', crowd: 'Low', plugs: 0, seats: 18, ac: false, open: true, mins: 12, walk: 10, x: 12, y: 76 },
];
const BUILDINGS = [
  ['Central Library', 4, 6, 40, 38], ['Newton Hall', 58, 6, 38, 38],
  ['Student Center', 30, 48, 34, 40], ['Tech Commons', 68, 50, 28, 40], ['Arts Quadrangle', 4, 58, 22, 30],
];

const MOODS = ['Study', 'Group', 'Gaming', 'Calls', 'Meet', 'Chill'];
// pref state: 0 off, 1 nice-to-have, 2 must-have
const MOOD_PREFS = {
  Study: { wifi: 1, quiet: 2, crowd: 1, power: 1, ac: 0, open: 1 },
  Group: { wifi: 1, quiet: 0, crowd: 0, power: 1, ac: 1, open: 1 },
  Gaming: { wifi: 2, quiet: 0, crowd: 0, power: 2, ac: 1, open: 1 },
  Calls: { wifi: 1, quiet: 2, crowd: 2, power: 0, ac: 0, open: 1 },
  Meet: { wifi: 0, quiet: 0, crowd: 1, power: 0, ac: 1, open: 1 },
  Chill: { wifi: 0, quiet: 1, crowd: 1, power: 0, ac: 1, open: 0 },
};
const PREFS = [
  { key: 'wifi', label: 'Fast Wi-Fi', test: s => s.wifi >= 60, val: s => s.wifi + ' Mbps' },
  { key: 'quiet', label: 'Quiet', test: s => s.noise === 'Silent' || s.noise === 'Calm', val: s => s.noise },
  { key: 'crowd', label: 'Low Crowd', test: s => s.crowd === 'Low', val: s => s.crowd + ' crowd' },
  { key: 'power', label: 'Power Outlets', test: s => s.plugs >= 3, val: s => s.plugs + ' plugs' },
  { key: 'ac', label: 'AC', test: s => s.ac, val: s => (s.ac ? 'Air-conditioned' : 'No AC') },
  { key: 'open', label: 'Open Now', test: s => s.open, val: s => (s.open ? 'Open' : 'Closed') },
];
const SORTS = [['match', 'Best match'], ['wifi', 'Fastest Wi-Fi'], ['near', 'Nearest first']];
const nextState = v => (v + 1) % 3;

function score(spot, prefs) {
  const active = PREFS.filter(p => prefs[p.key] > 0);
  if (!active.length) return { pct: 0, matched: 0, total: 0, hits: {} };
  let got = 0, max = 0, matched = 0; const hits = {};
  active.forEach(p => {
    const w = prefs[p.key] === 2 ? 2 : 1; const ok = p.test(spot);
    max += w; if (ok) { got += w; matched++; } hits[p.key] = ok;
  });
  let pct = (got / max) * 100;
  if (!spot.open) pct *= 0.6;
  return { pct: Math.round(pct), matched, total: active.length, hits };
}
const ago = m => (m <= 0 ? 'just now' : m >= 60 ? Math.round(m / 60) + ' h ago' : m + ' min ago');
const pctColor = p => (p >= 75 ? theme.good : p >= 40 ? theme.warn : theme.bad);
const freshColor = m => (m < 30 ? theme.good : m < 120 ? theme.warn : theme.sub);
const crowdLabel = s => (s.crowd === 'High' ? 'Packed' : s.crowd === 'Medium' ? 'Filling up' : 'Calm');
const animate = () => LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));

/* ───────────────────────── small animated bits ───────────────────────── */
function FadeIn({ children, delay = 0, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 380, delay, useNativeDriver: true }).start(); }, []);
  return (
    <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

function Ring({ pct, total, size = 60 }) {
  const v = useRef(new Animated.Value(0.7)).current;
  useEffect(() => { v.setValue(0.7); Animated.spring(v, { toValue: 1, friction: 5, useNativeDriver: true }).start(); }, [pct]);
  const c = total ? pctColor(pct) : theme.sub;
  return (
    <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, borderWidth: 5, borderColor: c, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', transform: [{ scale: v }] }]}>
      <Text style={{ color: c, fontWeight: '800', fontSize: size / 4 }}>{total ? pct + '%' : '—'}</Text>
    </Animated.View>
  );
}

function Pulse({ color, size }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(v, { toValue: 1, duration: 1700, useNativeDriver: true }));
    loop.start(); return () => loop.stop();
  }, []);
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }), transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }] }} />
  );
}

/* ───────────────────────── root ───────────────────────── */
export default function App() {
  const [tab, setTab] = useState('Home');
  const [mood, setMood] = useState('Study');
  const [prefs, setPrefs] = useState({ ...MOOD_PREFS.Study });
  const [sort, setSort] = useState('match');
  const [spots, setSpots] = useState(SPOTS0);
  const [saved, setSaved] = useState([1]);
  const [detail, setDetail] = useState(null);
  const [report, setReport] = useState(null); // null | { id }
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState('');

  const ranked = useMemo(() => {
    const list = spots.map(s => ({ ...s, ...score(s, prefs) }));
    if (sort === 'wifi') return list.sort((a, b) => b.wifi - a.wifi);
    if (sort === 'near') return list.sort((a, b) => a.walk - b.walk);
    return list.sort((a, b) => b.pct - a.pct || a.walk - b.walk);
  }, [spots, prefs, sort]);

  const applyMood = m => { animate(); setMood(m); setPrefs({ ...MOOD_PREFS[m] }); };
  const cycle = k => { animate(); setPrefs(p => ({ ...p, [k]: nextState(p[k]) })); };
  const toggleSave = id => { setSaved(s => (s.includes(id) ? s.filter(i => i !== id) : [...s, id])); };
  const flash = t => { setToast(t); setTimeout(() => setToast(''), 2400); };
  const openReport = id => { setDetail(null); setReport({ id: id || null }); };

  const submitReport = r => {
    animate();
    setSpots(ss => ss.map(s => (s.id === r.id ? { ...s, wifi: r.wifi, noise: r.noise, crowd: r.crowd, plugs: r.plugs, seats: r.seats, ac: r.ac, open: r.open, mins: 0 } : s)));
    setReports(rs => [{ ...r, at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...rs]);
    setReport(null); flash('Thanks! +10 points 🎉');
  };

  const shared = { mood, applyMood, prefs, cycle, ranked, saved, toggleSave, setDetail };

  return (
    <SafeAreaView style={st.root}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        {tab === 'Home' && <Home {...shared} sort={sort} setSort={setSort} />}
        {tab === 'Map' && <MapTab {...shared} />}
        {tab === 'Saved' && <Saved {...shared} />}
        {tab === 'Profile' && <Profile {...shared} reports={reports} />}
      </View>
      {tab === 'Home' && (
        <TouchableOpacity style={st.fab} onPress={() => openReport(null)} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>＋ Report conditions</Text>
        </TouchableOpacity>
      )}
      {toast ? <View style={st.toast}><Text style={{ color: '#fff', fontWeight: '600' }}>{toast}</Text></View> : null}
      <View style={st.tabbar}>
        {[['Home', '🏠'], ['Map', '🗺️'], ['Saved', '♡'], ['Profile', '👤']].map(([t, i]) => (
          <TouchableOpacity key={t} style={st.tabItem} onPress={() => setTab(t)}>
            <View style={[st.tabPill, tab === t && { backgroundColor: theme.accentSoft }]}>
              <Text style={{ fontSize: 19, opacity: tab === t ? 1 : 0.45 }}>{i}</Text>
            </View>
            <Text style={[st.tabLabel, tab === t && { color: theme.accent, fontWeight: '700' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Detail spot={detail && ranked.find(s => s.id === detail)} reports={reports} onClose={() => setDetail(null)} saved={saved} toggleSave={toggleSave} prefs={prefs} onReport={openReport} />
      <ReportSheet report={report} spots={spots} onClose={() => setReport(null)} onSubmit={submitReport} />
    </SafeAreaView>
  );
}

/* ───────────────────────── shared filter chips ───────────────────────── */
function Filters({ mood, applyMood, prefs, cycle }) {
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.row}>
        {MOODS.map(m => (
          <TouchableOpacity key={m} onPress={() => applyMood(m)} style={[st.chip, mood === m && st.chipOn]}>
            <Text style={[st.chipTxt, mood === m && { color: '#fff' }]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.row}>
        {PREFS.map(p => {
          const v = prefs[p.key];
          return (
            <TouchableOpacity key={p.key} onPress={() => cycle(p.key)} style={[st.chip, v === 1 && st.chipNice, v === 2 && st.chipMust]}>
              <Text style={[st.chipTxt, v === 2 && { color: '#fff' }, v === 1 && { color: theme.accent }]}>{p.label}{v === 2 ? ' ★' : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={st.hint}>Tap once = nice-to-have · twice = must-have ★ · three times = off</Text>
    </>
  );
}

/* ───────────────────────── Home ───────────────────────── */
function Home({ mood, applyMood, prefs, cycle, ranked, saved, toggleSave, setDetail, sort, setSort }) {
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const list = ranked.filter(s => (s.name + s.building).toLowerCase().includes(q.toLowerCase()));
  const top = list[0];
  const rest = list.slice(1);
  const shown = all ? rest : rest.slice(0, 3);
  const anyPref = PREFS.some(p => prefs[p.key] > 0);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 150 }} keyboardShouldPersistTaps="handled">
      <View style={{ padding: 20, paddingBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={st.logo}><Text style={{ color: '#fff', fontWeight: '800' }}>DZ</Text></View>
            <View style={{ marginLeft: 10 }}>
              <Text style={st.h3}>DeadZone</Text>
              <Text style={[st.sub, { fontSize: 11 }]}>Campus spot finder</Text>
            </View>
          </View>
          <View style={st.avatarSm}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>RS</Text></View>
        </View>
        <Text style={[st.kicker, { marginTop: 22 }]}>{day} · CAMPUS OPEN</Text>
        <Text style={st.h1}>Find your zone.</Text>
        <Text style={st.sub}>A little focus. A quick call. Your kind of spot.</Text>
        <TextInput placeholder="Search spots or buildings" placeholderTextColor={theme.sub} value={q} onChangeText={setQ} style={st.search} />
      </View>

      <Text style={[st.eyebrow, { marginTop: 6 }]}>WHAT ARE YOU UP TO?</Text>
      <Filters {...{ mood, applyMood, prefs, cycle }} />

      {!anyPref && (
        <View style={[st.panel, { marginHorizontal: 20, marginTop: 14, alignItems: 'center' }]}>
          <Text style={{ fontSize: 28 }}>🎯</Text>
          <Text style={[st.name, { marginTop: 6 }]}>Pick a mood or a few must-haves</Text>
          <Text style={[st.sub, { textAlign: 'center', marginTop: 4 }]}>We'll rank every spot by how well it fits you.</Text>
        </View>
      )}

      {top && (
        <FadeIn style={{ marginTop: 16 }}>
          <TouchableOpacity activeOpacity={0.92} onPress={() => setDetail(top.id)} style={st.hero}>
            <Image source={{ uri: top.photo }} style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,8,25,0.5)' }]} />
            <View style={{ flex: 1, justifyContent: 'space-between', padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={st.heroPill}>⭐ TOP PICK FOR YOU</Text>
                <TouchableOpacity onPress={() => toggleSave(top.id)} style={st.heartSm}>
                  <Text style={{ color: saved.includes(top.id) ? theme.bad : theme.text }}>{saved.includes(top.id) ? '♥' : '♡'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{top.name}</Text>
                  <Text style={{ color: '#E8E6F5', marginTop: 2 }}>{top.building} · {top.floor}</Text>
                  <Text style={{ color: '#E8E6F5', fontSize: 12, marginTop: 6 }}>
                    {top.seats} seats free · {top.walk} min walk · {ago(top.mins)}
                  </Text>
                </View>
                <Ring pct={top.pct} total={top.total} size={66} />
              </View>
            </View>
          </TouchableOpacity>
        </FadeIn>
      )}

      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={st.h2}>Best spots right now</Text>
          <Text style={[st.livePill]}>● Live</Text>
        </View>
        <Text style={st.sub}>{list.length} spots ranked for you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {SORTS.map(([k, l]) => (
            <TouchableOpacity key={k} onPress={() => { animate(); setSort(k); }} style={[st.sortChip, sort === k && { backgroundColor: theme.text }]}>
              <Text style={{ color: sort === k ? '#fff' : theme.text, fontWeight: '600', fontSize: 12 }}>{l}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {shown.map((s, i) => (
        <FadeIn key={s.id} delay={Math.min(i, 5) * 60}>
          <SpotCard s={s} rank={list.indexOf(s) + 1} saved={saved.includes(s.id)} onSave={() => toggleSave(s.id)} onPress={() => setDetail(s.id)} prefs={prefs} />
        </FadeIn>
      ))}
      {!list.length && <Text style={[st.sub, { textAlign: 'center', marginTop: 30 }]}>No spots match "{q}".</Text>}
      {rest.length > 3 && (
        <TouchableOpacity style={st.more} onPress={() => { animate(); setAll(a => !a); }}>
          <Text style={{ color: theme.accent, fontWeight: '700' }}>{all ? 'Show fewer' : `Explore ${rest.length - 3} more spots`}</Text>
        </TouchableOpacity>
      )}
      <Text style={st.foot}>Sample campus data · Photos are illustrative</Text>
    </ScrollView>
  );
}

function SpotCard({ s, rank, saved, onSave, onPress, prefs }) {
  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={st.card}>
      <View>
        <Image source={{ uri: s.photo }} style={st.photo} />
        <View style={[st.badge, { backgroundColor: s.open ? '#fff' : '#222' }]}>
          <Text style={{ color: s.open ? theme.good : '#fff', fontSize: 12, fontWeight: '700' }}>{s.open ? '● Open now' : 'Closed'}</Text>
        </View>
        <View style={st.rankBadge}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>#{rank}</Text></View>
        <TouchableOpacity onPress={onSave} style={st.heart}>
          <Text style={{ fontSize: 18, color: saved ? theme.bad : theme.text }}>{saved ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={st.name}>{s.name}</Text>
            <Text style={st.sub}>{s.building} · {s.floor}</Text>
            <Text style={[st.sub, { marginTop: 6, color: theme.text, fontWeight: '600' }]}>
              {s.total ? `Matches ${s.matched} of ${s.total}` : 'Set preferences to see your match'}
            </Text>
          </View>
          <Ring pct={s.pct} total={s.total} />
        </View>
        <View style={[st.row2, { marginTop: 10 }]}>
          {PREFS.filter(p => prefs[p.key] > 0).map(p => (
            <Text key={p.key} style={[st.tag, { color: s.hits[p.key] ? theme.good : theme.bad, backgroundColor: s.hits[p.key] ? '#E6F6EC' : '#FDECEC' }]}>
              {s.hits[p.key] ? '✓' : '✕'} {p.label}
            </Text>
          ))}
        </View>
        <View style={[st.row2, { marginTop: 10 }]}>
          {[`${s.wifi} Mbps`, s.noise, crowdLabel(s), `${s.plugs} plugs`, s.ac ? 'AC' : 'No AC'].map(t => <Text key={t} style={st.stat}>{t}</Text>)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: freshColor(s.mins), marginRight: 6 }} />
          <Text style={[st.sub, { fontSize: 12 }]}>{s.seats} seats free · {s.walk} min walk · verified {ago(s.mins)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ───────────────────────── Map ───────────────────────── */
function MapTab({ ranked, setDetail, ...rest }) {
  const [sel, setSel] = useState(null);
  const [bSel, setBSel] = useState(null);
  const s = sel && ranked.find(x => x.id === sel);
  const hotCount = ranked.filter(p => p.total > 0 && p.pct >= 60).length;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={st.h1}>Campus map</Text>
        <Text style={st.sub}>{hotCount} spots match your preferences</Text>
      </View>
      <Filters {...rest} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.row} style={{ flexGrow: 0 }}>
        <TouchableOpacity onPress={() => setBSel(null)} style={[st.sortChip, !bSel && { backgroundColor: theme.text }]}>
          <Text style={{ color: !bSel ? '#fff' : theme.text, fontWeight: '600', fontSize: 12 }}>All buildings</Text>
        </TouchableOpacity>
        {BUILDINGS.map(([n]) => (
          <TouchableOpacity key={n} onPress={() => setBSel(bSel === n ? null : n)} style={[st.sortChip, bSel === n && { backgroundColor: theme.text }]}>
            <Text style={{ color: bSel === n ? '#fff' : theme.text, fontWeight: '600', fontSize: 12 }}>{n}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={st.map}>
        {BUILDINGS.map(([n, x, y, w, h]) => (
          <TouchableOpacity key={n} activeOpacity={0.8} onPress={() => setBSel(bSel === n ? null : n)}
            style={[st.bldg, { left: x + '%', top: y + '%', width: w + '%', height: h + '%' }, bSel === n && { backgroundColor: '#C9D6EE', borderWidth: 2, borderColor: theme.accent }]}>
            <Text style={st.bldgTxt}>{n}</Text>
          </TouchableOpacity>
        ))}
        {ranked.map(p => {
          const hot = p.total > 0 && p.pct >= 60;
          const dim = bSel && p.building !== bSel;
          const size = hot ? 38 : 14;
          return (
            <TouchableOpacity key={p.id} onPress={() => setSel(p.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ position: 'absolute', left: p.x + '%', top: p.y + '%', marginLeft: -size / 2, marginTop: -size / 2, opacity: dim ? 0.25 : 1, zIndex: hot ? 2 : 1 }}>
              {hot && <Pulse color={pctColor(p.pct)} size={size} />}
              <View style={hot ? [st.pin, { backgroundColor: pctColor(p.pct) }, sel === p.id && { borderColor: theme.text }] : [st.pinOff, sel === p.id && { backgroundColor: theme.text }]}>
                {hot && <Text style={{ color: '#fff', fontWeight: '800', fontSize: 11 }}>{p.pct}%</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[st.row2, { paddingHorizontal: 20, marginTop: 10, alignItems: 'center' }]}>
        {[['Great', theme.good], ['Okay', theme.warn], ['Weak', theme.bad], ['Not a match', '#B9B7C6']].map(([l, c]) => (
          <View key={l} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c, marginRight: 4 }} />
            <Text style={[st.sub, { fontSize: 11 }]}>{l}</Text>
          </View>
        ))}
      </View>
      <Text style={st.hint}>Large pulsing pins match your preferences · grey dots don't</Text>
      {s && (
        <FadeIn style={st.mini}>
          <Image source={{ uri: s.photo }} style={{ width: 56, height: 56, borderRadius: 12 }} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={st.name}>{s.name}</Text>
            <Text style={st.sub}>{s.building} · {s.floor}</Text>
            <Text style={[st.sub, { color: s.total ? pctColor(s.pct) : theme.sub, fontWeight: '700' }]}>{s.total ? s.pct + '% match' : 'No preferences set'} · {s.walk} min walk</Text>
          </View>
          <TouchableOpacity style={st.btnSm} onPress={() => setDetail(s.id)}><Text style={{ color: '#fff', fontWeight: '700' }}>Details</Text></TouchableOpacity>
        </FadeIn>
      )}
    </View>
  );
}

/* ───────────────────────── Saved ───────────────────────── */
function Saved({ ranked, saved, toggleSave, setDetail }) {
  const list = ranked.filter(s => saved.includes(s.id));
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 90 }}>
      <Text style={st.h1}>Saved</Text>
      <Text style={st.sub}>{list.length} spots you like</Text>
      {!list.length && (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ fontSize: 40 }}>♡</Text>
          <Text style={[st.name, { marginTop: 8 }]}>Nothing saved yet</Text>
          <Text style={[st.sub, { marginTop: 4, textAlign: 'center' }]}>Tap ♡ on any spot to keep it here.</Text>
        </View>
      )}
      {list.map(s => (
        <TouchableOpacity key={s.id} style={[st.mini, { position: 'relative', left: 0, right: 0, bottom: 0, marginTop: 14 }]} onPress={() => setDetail(s.id)}>
          <Image source={{ uri: s.photo }} style={{ width: 56, height: 56, borderRadius: 12 }} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={st.name}>{s.name}</Text>
            <Text style={st.sub}>{s.building} · {s.open ? 'Open now' : 'Closed'} · {s.crowd} crowd</Text>
            {s.total > 0 && <Text style={[st.sub, { color: pctColor(s.pct), fontWeight: '700' }]}>{s.pct}% match right now</Text>}
          </View>
          <TouchableOpacity onPress={() => toggleSave(s.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={{ fontSize: 22, color: theme.bad }}>♥</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/* ───────────────────────── Profile ───────────────────────── */
const Stat = ({ n, l }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text }}>{n}</Text>
    <Text style={st.sub}>{l}</Text>
  </View>
);

function Profile({ prefs, cycle, reports, ranked, mood }) {
  const pts = reports.length * 10;
  const level = pts >= 100 ? 'Local Guide' : pts >= 30 ? 'Scout' : 'Newbie';
  const next = pts >= 100 ? 100 : pts >= 30 ? 100 : 30;
  const from = pts >= 100 ? 0 : pts >= 30 ? 30 : 0;
  const progress = pts >= 100 ? 1 : (pts - from) / (next - from);
  const top = ranked.find(s => s.total > 0);
  const badges = [
    ['🌱', 'First Report', reports.length >= 1],
    ['📡', 'Wi-Fi Scout', reports.some(r => r.wifi >= 120)],
    ['🔥', 'Hat-trick', reports.length >= 3],
    ['🧭', 'Local Guide', pts >= 100],
  ];
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 90 }}>
      <View style={{ alignItems: 'center' }}>
        <View style={st.avatar}><Text style={{ color: '#fff', fontSize: 28, fontWeight: '800' }}>RS</Text></View>
        <Text style={st.h2}>Riya S.</Text>
        <Text style={st.sub}>{level} · {pts} pts</Text>
        <View style={st.bar}><View style={[st.barFill, { width: progress * 100 + '%' }]} /></View>
        <Text style={[st.sub, { fontSize: 11, marginTop: 4 }]}>{pts >= 100 ? 'Top level reached 🎉' : `${next - pts} pts to next level`}</Text>
      </View>
      <View style={[st.row2, { justifyContent: 'space-around', marginVertical: 18 }]}>
        <Stat n={reports.length} l="Reports" />
        <Stat n={new Set(reports.map(r => r.id)).size} l="Spots verified" />
        <Stat n={pts} l="Points" />
      </View>

      <View style={st.panel}>
        <Text style={st.h3}>Badges</Text>
        <View style={[st.row2, { marginTop: 10, gap: 10 }]}>
          {badges.map(([i, n, on]) => (
            <View key={n} style={{ alignItems: 'center', width: '22%', opacity: on ? 1 : 0.3 }}>
              <Text style={{ fontSize: 28 }}>{i}</Text>
              <Text style={[st.sub, { fontSize: 10, textAlign: 'center' }]}>{n}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[st.panel, { marginTop: 14 }]}>
        <Text style={st.h3}>My preferences</Text>
        <Text style={st.sub}>These drive your Home dashboard and the Map · mood: {mood}</Text>
        <View style={[st.row2, { marginTop: 12 }]}>
          {PREFS.map(p => {
            const v = prefs[p.key];
            return (
              <TouchableOpacity key={p.key} onPress={() => cycle(p.key)} style={[st.chip, v === 1 && st.chipNice, v === 2 && st.chipMust]}>
                <Text style={[st.chipTxt, v === 2 && { color: '#fff' }, v === 1 && { color: theme.accent }]}>{p.label}{v === 2 ? ' ★' : ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {top && <Text style={[st.sub, { marginTop: 12, color: theme.text }]}>Your top spot right now: <Text style={{ fontWeight: '800' }}>{top.name} ({top.pct}%)</Text></Text>}
      </View>

      <View style={[st.panel, { marginTop: 14 }]}>
        <Text style={st.h3}>My contributions</Text>
        {!reports.length && <Text style={[st.sub, { marginTop: 8 }]}>No reports yet. Tap ＋ Report on Home to add your first and earn 10 pts.</Text>}
        {reports.map((r, i) => (
          <View key={i} style={{ paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderColor: theme.line }}>
            <Text style={st.name}>{r.name}</Text>
            <Text style={st.sub}>{r.at} · {r.wifi} Mbps · {r.noise} · {r.crowd} crowd · {r.plugs} plugs</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* ───────────────────────── Detail ───────────────────────── */
function Detail({ spot, reports, onClose, saved, toggleSave, prefs, onReport }) {
  if (!spot) return null;
  const tiles = [['Wi-Fi', spot.wifi + ' Mbps'], ['Noise', spot.noise], ['Crowd', spot.crowd], ['Seats free', spot.seats], ['Plugs', spot.plugs], ['AC', spot.ac ? 'Yes' : 'No']];
  const active = PREFS.filter(p => prefs[p.key] > 0);
  const feed = reports.filter(r => r.id === spot.id).slice(0, 3);
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={st.root}>
        <ScrollView>
          <View>
            <Image source={{ uri: spot.photo }} style={{ height: 240, width: '100%' }} />
            <TouchableOpacity onPress={onClose} style={[st.heart, { left: 16, right: undefined, top: 16 }]}><Text style={{ fontSize: 18 }}>✕</Text></TouchableOpacity>
          </View>
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={st.h1}>{spot.name}</Text>
                <Text style={st.sub}>{spot.building} · {spot.floor}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: freshColor(spot.mins), marginRight: 6 }} />
                  <Text style={st.sub}>{spot.open ? 'Open now' : 'Closed'} · {spot.walk} min walk · verified {ago(spot.mins)}</Text>
                </View>
              </View>
              <Ring pct={spot.pct} total={spot.total} size={72} />
            </View>

            <View style={[st.row2, { marginTop: 16 }]}>
              {tiles.map(([k, v]) => <View key={k} style={st.tile}><Text style={st.sub}>{k}</Text><Text style={st.name}>{v}</Text></View>)}
            </View>

            {active.length > 0 && (
              <View style={[st.panel, { marginTop: 16 }]}>
                <Text style={st.h3}>Why {spot.pct}% match</Text>
                {active.map(p => (
                  <View key={p.key} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
                    <Text style={{ color: theme.text }}>{spot.hits[p.key] ? '✅' : '❌'} {p.label}{prefs[p.key] === 2 ? ' ★' : ''}</Text>
                    <Text style={st.sub}>{p.val(spot)}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={[st.panel, { marginTop: 14 }]}>
              <Text style={st.h3}>Recent reports</Text>
              {!feed.length && <Text style={[st.sub, { marginTop: 6 }]}>No new reports from you yet. Be the first!</Text>}
              {feed.map((r, i) => (
                <Text key={i} style={[st.sub, { marginTop: 6 }]}>You · {r.at} · {r.wifi} Mbps, {r.noise}, {r.crowd} crowd</Text>
              ))}
            </View>

            <TouchableOpacity style={[st.btn, { marginTop: 20 }]} onPress={() => onReport(spot.id)}><Text style={st.btnTxt}>Report conditions</Text></TouchableOpacity>
            <TouchableOpacity style={[st.btn, { backgroundColor: theme.accentSoft, marginTop: 10 }]} onPress={() => toggleSave(spot.id)}>
              <Text style={[st.btnTxt, { color: theme.accent }]}>{saved.includes(spot.id) ? '♥ Saved' : '♡ Save spot'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

/* ───────────────────────── Report sheet ───────────────────────── */
const DEFAULT_F = { wifi: 60, noise: 'Calm', crowd: 'Low', plugs: 4, seats: 5, ac: true, open: true };

function Opt({ label, options, value, onChange }) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={st.h3}>{label}</Text>
      <View style={[st.row2, { marginTop: 8 }]}>
        {options.map(([t, v]) => (
          <TouchableOpacity key={t} onPress={() => onChange(v)} style={[st.chip, value === v && st.chipOn]}>
            <Text style={[st.chipTxt, value === v && { color: '#fff' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ReportSheet({ report, spots, onClose, onSubmit }) {
  const [id, setId] = useState(null);
  const [f, setF] = useState(DEFAULT_F);
  useEffect(() => { if (report) { setId(report.id || spots[0].id); setF(DEFAULT_F); } }, [report]);
  const spot = spots.find(s => s.id === id) || spots[0];
  return (
    <Modal visible={!!report} animationType="slide" transparent onRequestClose={onClose}>
      <View style={st.backdrop}>
        <View style={st.sheet}>
          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={st.h2}>Report conditions</Text>
                <Text style={st.sub}>Help others · earn 10 pts</Text>
              </View>
              <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20 }}>✕</Text></TouchableOpacity>
            </View>
            <Text style={[st.h3, { marginTop: 12 }]}>Spot</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
              {spots.map(s => (
                <TouchableOpacity key={s.id} onPress={() => setId(s.id)} style={[st.chip, spot.id === s.id && st.chipOn]}>
                  <Text style={[st.chipTxt, spot.id === s.id && { color: '#fff' }]}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Opt label="Wi-Fi" value={f.wifi} onChange={v => setF({ ...f, wifi: v })} options={[['Slow', 15], ['OK', 60], ['Fast', 120]]} />
            <Opt label="Noise" value={f.noise} onChange={v => setF({ ...f, noise: v })} options={[['Silent', 'Silent'], ['Calm', 'Calm'], ['Chatty', 'Chatty'], ['Loud', 'Loud']]} />
            <Opt label="Crowd" value={f.crowd} onChange={v => setF({ ...f, crowd: v })} options={[['Low', 'Low'], ['Medium', 'Medium'], ['High', 'High']]} />
            <Opt label="Free seats" value={f.seats} onChange={v => setF({ ...f, seats: v })} options={[['None', 0], ['Few', 3], ['Plenty', 10]]} />
            <Opt label="Power outlets" value={f.plugs} onChange={v => setF({ ...f, plugs: v })} options={[['None', 0], ['Few', 2], ['Plenty', 8]]} />
            <Opt label="AC" value={f.ac} onChange={v => setF({ ...f, ac: v })} options={[['On', true], ['Off', false]]} />
            <Opt label="Status" value={f.open} onChange={v => setF({ ...f, open: v })} options={[['Open', true], ['Closed', false]]} />
            <TouchableOpacity style={[st.btn, { marginTop: 22 }]} onPress={() => onSubmit({ id: spot.id, name: spot.name, ...f })}>
              <Text style={st.btnTxt}>Submit report</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ───────────────────────── styles ───────────────────────── */
const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 3 },
  default: {},
});
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0 },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: theme.accent, fontWeight: '700' },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, color: theme.sub, fontWeight: '700', paddingHorizontal: 20, marginTop: 8 },
  h1: { fontSize: 32, fontWeight: '800', color: theme.text, marginTop: 4 },
  h2: { fontSize: 20, fontWeight: '800', color: theme.text },
  h3: { fontSize: 14, fontWeight: '700', color: theme.text },
  sub: { color: theme.sub, fontSize: 13 },
  hint: { color: theme.sub, fontSize: 12, paddingHorizontal: 20, marginTop: 2 },
  foot: { textAlign: 'center', color: theme.sub, fontSize: 12, marginTop: 20 },
  logo: { width: 38, height: 38, borderRadius: 12, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' },
  avatarSm: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.text, alignItems: 'center', justifyContent: 'center' },
  search: { backgroundColor: theme.card, borderRadius: 14, padding: 12, marginTop: 14, borderWidth: 1, borderColor: theme.line, color: theme.text },
  row: { paddingHorizontal: 20, paddingVertical: 6 },
  row2: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, marginRight: 8 },
  chipOn: { backgroundColor: theme.accent, borderColor: theme.accent },
  chipNice: { backgroundColor: theme.accentSoft, borderColor: theme.accent },
  chipMust: { backgroundColor: theme.accent, borderColor: theme.accent },
  chipTxt: { color: theme.text, fontWeight: '600', fontSize: 13 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, marginRight: 8 },
  livePill: { color: theme.good, fontWeight: '700', fontSize: 12, backgroundColor: '#E6F6EC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden' },
  hero: { height: 210, borderRadius: 26, marginHorizontal: 20, overflow: 'hidden', backgroundColor: '#222', ...shadow },
  heroPill: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.8, backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: 'hidden' },
  heartSm: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: theme.card, borderRadius: 22, marginHorizontal: 20, marginTop: 16, overflow: 'hidden', ...shadow },
  photo: { height: 170, width: '100%' },
  badge: { position: 'absolute', left: 12, top: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  rankBadge: { position: 'absolute', left: 12, bottom: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(20,18,31,0.75)' },
  heart: { position: 'absolute', right: 12, top: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: theme.text },
  tag: { fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  stat: { fontSize: 12, color: theme.sub, backgroundColor: theme.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  more: { alignSelf: 'center', marginTop: 16, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.accentSoft },
  tabbar: { flexDirection: 'row', backgroundColor: theme.card, borderTopWidth: 1, borderColor: theme.line, paddingBottom: 6, paddingTop: 6 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabPill: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 999 },
  tabLabel: { fontSize: 11, color: theme.sub, marginTop: 2 },
  fab: { position: 'absolute', right: 20, bottom: 84, backgroundColor: theme.accent, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 999, ...shadow },
  map: { height: 320, marginHorizontal: 20, marginTop: 6, borderRadius: 22, backgroundColor: '#E9F3EA', overflow: 'hidden', borderWidth: 1, borderColor: theme.line },
  bldg: { position: 'absolute', backgroundColor: '#D8E2F0', borderRadius: 12, padding: 6 },
  bldgTxt: { fontSize: 10, color: theme.sub, fontWeight: '700' },
  pin: { minWidth: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', ...shadow },
  pinOff: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#B9B7C6' },
  mini: { position: 'absolute', left: 20, right: 20, bottom: 12, backgroundColor: theme.card, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', ...shadow },
  btnSm: { backgroundColor: theme.accent, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  btn: { backgroundColor: theme.accent, padding: 15, borderRadius: 16, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  bar: { width: '70%', height: 8, borderRadius: 4, backgroundColor: theme.line, marginTop: 10, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: theme.accent, borderRadius: 4 },
  panel: { backgroundColor: theme.card, borderRadius: 20, padding: 16, ...shadow },
  tile: { width: '31%', backgroundColor: theme.card, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: theme.line },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, maxHeight: '88%' },
  toast: { position: 'absolute', bottom: 150, alignSelf: 'center', backgroundColor: '#222', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
});
