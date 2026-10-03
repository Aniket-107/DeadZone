export const COLORS = {
  // Surfaces
  bgCanvas: '#F6F5FB', 
  bgSurface: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgInput: '#F6F5FB',

  // Borders
  borderSubtle: '#E7E5F0',
  borderFocus: '#E7E5F0',
  borderActive: '#5B4BFF',

  // Text
  textPrimary: '#14121F',
  textSecondary: '#6B6880',
  textMuted: '#A09FB1', 

  // Accents
  accentBlue: '#5B4BFF',
  accentBlueSoft: '#ECEAFF',
  accentCyan: '#5B4BFF',
  accentCyanSoft: '#ECEAFF',

  // Status colors
  statusOptimal: '#18A957',
  statusOptimalSoft: '#E6F6EC',
  statusOptimalBorder: '#18A957',
  statusModerate: '#F0A020',
  statusModerateSoft: '#FFF6E5',
  statusModerateBorder: '#F0A020',
  statusDeadzone: '#E5484D',
  statusDeadzoneSoft: '#FDECEC',
  statusDeadzoneBorder: '#E5484D',
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  hero: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

/**
 * Returns themed colors for a given status.
 * @param status One of 'optimal', 'moderate', or 'deadzone'.
 */
export const getStatusTheme = (status: 'optimal' | 'moderate' | 'deadzone') => {
  switch (status) {
    case 'optimal':
      return {
        text: COLORS.statusOptimal,
        bg: COLORS.statusOptimalSoft,
        border: COLORS.statusOptimalBorder,
        label: 'Optimal',
      };
    case 'moderate':
      return {
        text: COLORS.statusModerate,
        bg: COLORS.statusModerateSoft,
        border: COLORS.statusModerateBorder,
        label: 'Moderate',
      };
    case 'deadzone':
      return {
        text: COLORS.statusDeadzone,
        bg: COLORS.statusDeadzoneSoft,
        border: COLORS.statusDeadzoneBorder,
        label: 'Deadzone',
      };
    default:
      return {
        text: COLORS.textMuted,
        bg: COLORS.bgSurface,
        border: COLORS.borderSubtle,
        label: '',
      };
  }
};
export const getStatusColor = (status: 'good' | 'moderate' | 'busy') => {
  switch (status) {
    case 'good':
      return COLORS.statusOptimal;
    case 'moderate':
      return COLORS.statusModerate;
    case 'busy':
      return COLORS.statusDeadzone;
    default:
      return COLORS.textMuted;
  }
};

export const getNoiseColor = (db: number) => {
  if (db < 35) return COLORS.statusOptimal;
  if (db <= 55) return COLORS.statusModerate;
  return COLORS.statusDeadzone;
};

export const getWifiColor = (mbps: number) => {
  if (mbps >= 50) return COLORS.statusOptimal;
  if (mbps >= 25) return COLORS.statusModerate;
  return COLORS.statusDeadzone;
};
