
import { Clock, AlertCircle, CheckCircle, AlertTriangle, Trash2, BellOff } from "lucide-react";


export const colors = {
  // Foundations
  mainWhite: 'hsl(258, 44%, 93%)',
  whiteBlple: 'hsl(221, 32%, 77%)',
  purpluish: 'hsl(225, 25%, 65%)',
  bluis: 'hsl(220, 74%, 62%)',
  mainBlue: 'hsl(225, 46%, 44%)',
  gainsbro: 'hsl(0, 0%, 96%)',
  blueWhite: 'hsl(195, 44%, 86%)',
  darkBlue: 'hsl(225, 15%, 25%)',

  accGreena: 'hsl(84, 39%, 37%)',
  accGreenb: 'hsl(82, 56%, 47%)',
  accDarka: 'hsl(165, 9%, 15%)',
  accDarkb: 'hsl(180, 3%, 29%)',
  accDarkc: 'hsl(180, 2%, 43%)',

  pal2Whitea: 'hsl(60, 7%, 91%)',
  pal2Whiteb: 'hsl(60, 7%, 91%)',
  pal2Greena: 'hsl(82, 30%, 62%)',
  pal2Greenb: 'hsl(120, 100%, 20%)',

  metalDark1: 'hsl(0, 2%, 14%)',
  metalDark2: 'hsl(0, 1%, 25%)',
  metalDark3: 'hsl(0, 0%, 13%)',
  metalDark4: 'hsl(240, 2%, 53%)',
  metalDark5: 'hsl(0, 0%, 7%)',

  gray1: 'hsl(0, 0%, 50%)',
  colorJkDark: 'hsl(204, 19%, 15%)',
  colorJkDgray: 'hsl(210, 100%, 99%)',

  darkVariant: 'hsl(220, 7%, 19%)',
  darkVariantb: 'hsl(0, 0%, 21%)',
  colorDarkBlue: 'hsl(210, 29%, 15%)',

  dangerA: 'hsl(355, 100%, 70%)',
  dangerB: 'hsl(355, 70%, 80%)',
  dangerC: 'hsl(353, 40%, 90%)',
  warning: 'hsl(35, 80%, 70%)',
  successA: 'hsl(125, 85%, 60%)',
  successB: 'hsl(160, 60%, 70%)',
  successC: 'hsl(150, 80%, 80%)',

  shadAlpha: 'rgba(53,53,53,0.5)',
  shadAlphaB: 'rgba(53,53,53,0.4)',
  shadAlphaC: 'rgba(53,53,53,0.3)',
  shadAlphaD: 'rgba(53,53,53,0.2)',
  shadAlphaE: 'rgba(53,53,53,0.1)',
  shadDark: 'rgb(0,0,0)',
  shadDarkB: 'rgba(0,0,0,0.7)',
  shadDarkC: 'rgba(0,0,0,0.6)',
  shadDarkD: 'rgba(0,0,0,0.5)',
  shadDarkE: 'rgba(0,0,0,0.4)',
  shadDarkF: 'rgba(0,0,0,0.3)',
  shadDarkG: 'rgba(0,0,0,0.2)',
  shadDarkH: 'rgba(0,0,0,0.1)',

  fnsDefaultDown06: '0.618rem',
  fnsDown1: '0.8rem',
  fnsDefault1: '1rem',
  fnsUp2: '1.3rem',
  fnsDefaultUp16: '1.618rem',
  fnsUp4: '2.1rem',
  fnsDefaultUp26: '2.617rem',
  fnsDefaultUp42: '4.23rem',
  fnsDefaultUp68: '6.84rem'
};

export const setRoleColor = {
  ownerColor: colors.dangerB,
  adminColor: colors.warning,
  viewerColor: colors.accDarkc,
};




export const getStageColor = (stage, isDark = false) => {
  const colors = {
    'Sprout':           { bg: isDark ? '#1a2e25' : 'hsl(152, 20%, 92%)', text: isDark ? '#79a490' : 'hsl(152, 20%, 28%)', border: isDark ? '#2e4a3a' : 'hsl(152, 20%, 72%)', dot: isDark ? '#79a490' : 'hsl(152, 25%, 40%)' },
    'Seedling':         { bg: isDark ? '#0d2b1a' : 'hsl(135, 50%, 92%)', text: isDark ? '#92e6a7' : 'hsl(135, 50%, 22%)', border: isDark ? '#1a4d2e' : 'hsl(135, 50%, 72%)', dot: isDark ? '#92e6a7' : 'hsl(135, 55%, 35%)' },
    'Vegetative':       { bg: isDark ? '#1a3d28' : 'hsl(130, 45%, 90%)', text: isDark ? '#6ede8a' : 'hsl(130, 45%, 22%)', border: isDark ? '#2d6040' : 'hsl(130, 45%, 68%)', dot: isDark ? '#6ede8a' : 'hsl(130, 50%, 32%)' },
    'Budding':          { bg: isDark ? '#0d3320' : 'hsl(145, 55%, 88%)', text: isDark ? '#2dc653' : 'hsl(145, 55%, 20%)', border: isDark ? '#1a5c38' : 'hsl(145, 55%, 65%)', dot: isDark ? '#2dc653' : 'hsl(145, 60%, 30%)' },
    'Flowering':        { bg: isDark ? '#0a2e1e' : 'hsl(150, 50%, 86%)', text: isDark ? '#25a244' : 'hsl(150, 50%, 18%)', border: isDark ? '#145c30' : 'hsl(150, 50%, 62%)', dot: isDark ? '#25a244' : 'hsl(150, 55%, 28%)' },
    'Fruiting':         { bg: isDark ? '#082818' : 'hsl(155, 55%, 84%)', text: isDark ? '#208b3a' : 'hsl(155, 55%, 16%)', border: isDark ? '#0f4a28' : 'hsl(155, 55%, 58%)', dot: isDark ? '#208b3a' : 'hsl(155, 60%, 26%)' },
    'Ready To Harvest': { bg: isDark ? '#1a7431' : 'hsl(160, 60%, 82%)', text: isDark ? '#4ade80' : 'hsl(160, 60%, 14%)', border: isDark ? '#25a244' : 'hsl(160, 60%, 55%)', dot: isDark ? '#4ade80' : 'hsl(160, 65%, 24%)' },
    'All':              { bg: isDark ? '#5A8F73' : 'hsl(152, 20%, 92%)', text: isDark ? '#a7d7b8' : 'hsl(152, 20%, 28%)', border: isDark ? '#2d6a4f' : 'hsl(152, 20%, 72%)', dot: isDark ? '#a7d7b8' : 'hsl(152, 25%, 40%)' },
  };
  return colors[stage] || colors['Sprout'];
};

export const getHarvestStatusColor = (stage, isDark = false) => {
  const colors = {
    'Not Ready':        {  text: isDark ? '#fff'  : 'hsl(210, 15%, 22%)',dot: isDark ? '#fff'  : 'hsl(210, 20%, 42%)' },
    'Past Due':         {  text: isDark ? '#fca5a5'  : 'hsl(353, 70%, 60%)',dot: isDark ? '#fca5a5'  : 'hsl(35, 70%, 60%)' },
    'Due Tomorrow':     {  text: isDark ? '#fbbf24'  : 'hsl(35, 100%, 50%)', dot: isDark ? '#fbbf24'  :'hsl(35, 100%, 50%)' },
    'Due Now':          {  text: isDark ? '#60a5fa'  : 'hsl(220, 74%, 62%)',dot: isDark ? '#60a5fa'  : 'hsl(220, 74%, 62%)' },
    'Ready To Harvest': {  text: isDark ? '#4ade80'  : 'hsl(135, 50%, 22%)',dot: isDark ? '#4ade80'  : 'hsl(135, 55%, 35%)' },
    'Harvested':        {  text: isDark ? '#6ee7b7'  : 'hsl(152, 40%, 22%)',dot: isDark ? '#6ee7b7'  : 'hsl(152, 55%, 32%)' },
    'All':              {  text: isDark ? '#a7d7b8'  : 'hsl(210, 15%, 22%)',dot: isDark ? '#a7d7b8'  : 'hsl(210, 20%, 42%)' },
  };
  return colors[stage] || colors['Not Ready'];
};


export const getTrayStatusColor = (status, isDark = false) => {
  const colors = {
    'Available': {
      text: isDark ? 'hsl(99, 65%, 74%)' : 'hsl(170, 97%, 25%)',
      bg: isDark ? 'hsl(152, 30%, 20%)' : 'hsl(152, 60%, 92%)',
      border: isDark ? 'hsl(99, 65%, 74%)' : 'hsl(170, 97%, 25%)',
    },
    'Occupied': {
      text: isDark ? '#60a5fa' : 'hsl(220, 74%, 62%)',
      dot: isDark ? '#60a5fa' : 'hsl(220, 74%, 62%)',
      bg: isDark ? 'hsl(220, 35%, 20%)' : 'hsl(220, 80%, 93%)',
      border: isDark ? 'hsl(220, 35%, 30%)' : 'hsl(220, 60%, 85%)',
    },
    'Maintenance': {
      text: isDark ? '#fbbf24' : 'hsl(35, 100%, 50%)',
      bg: isDark ? 'hsl(35, 30%, 20%)' : 'hsl(35, 80%, 93%)',
      border: isDark ? 'hsl(35, 30%, 30%)' : 'hsl(35, 70%, 78%)',
    }
  };
  
  return colors[status] || colors['Available'];
};




export function getSensorStatus(sensor, rawValue, isActive, group, isDark = false) {
   const palette = {
    inactive: {
      bg:   isDark ? 'hsl(220, 7%, 22%)'   : 'hsl(0, 0%, 94%)',
      text: isDark ? 'hsl(0, 0%, 55%)'     : 'hsl(0, 0%, 55%)',
    },
    dry: {
      bg:   isDark ? 'var(--color-danger-b)'  : 'hsl(355, 100%, 95%)',  
      text: isDark ? 'hsl(355, 100%, 72%)' : 'hsl(355, 100%, 45%)',
    },
    wet: {
      bg:   isDark ? 'hsl(35, 30%, 20%)'   : 'hsl(35, 100%, 94%)',   
      text: isDark ? 'hsl(35, 90%, 65%)'   : 'hsl(35, 80%, 40%)',
    },
    optimal: {
      bg:   isDark ? 'hsl(125, 60%, 55%)'  : 'hsl(125, 60%, 94%)', 
      text: isDark ? 'hsl(125, 60%, 55%)'  : 'hsl(125, 60%, 28%)',
    },
    active: {
      bg:   isDark ? 'hsl(220, 35%, 20%)'  : 'hsl(220, 80%, 95%)',    
      text: isDark ? 'hsl(220, 80%, 70%)'  : 'hsl(220, 80%, 48%)',
    },
  };

  if (!isActive) return {
    label: "Inactive",
    bgStyle:   { backgroundColor: palette.inactive.bg },
    textStyle: { color: palette.inactive.text },
    iconStyle: { color: palette.inactive.text },
  };

  if (rawValue === null) return {
    label: "No Reading",
    bgStyle:   { backgroundColor: palette.inactive.bg },
    textStyle: { color: palette.inactive.text },
    iconStyle: { color: palette.inactive.text },
  };

  if (sensor.sensor_type === "moisture") {
    if (rawValue < group.min_moisture) return {
      label: "Dry", 
      bgStyle:   { backgroundColor: palette.dry.bg },
      textStyle: { color: palette.dry.text },
      iconStyle: { color: palette.dry.text },
    };
    if (rawValue > group.max_moisture) return {
      label: "Wet", 
      bgStyle:   { backgroundColor: palette.wet.bg },
      textStyle: { color: palette.wet.text },
      iconStyle: { color: palette.wet.text },
    };
    return {
      label: "Optimal",
      bgStyle:   { backgroundColor: palette.optimal.bg },
      textStyle: { color: palette.optimal.text },
      iconStyle: { color: palette.optimal.text },
    };
  }

  return {
    label: "Active", emoji: "✅",
    bgStyle:   { backgroundColor: palette.active.bg },
    textStyle: { color: palette.active.text },
    iconStyle: { color: palette.active.text },
  };
}





export const getColorByStatus = (status, type, isDark = false) => {
  const lightColors = {
    high: {
      bg: "hsl(353, 40%, 93%)",
      border: "hsl(353, 60%, 80%)",
      iconColor: "hsl(353, 70%, 45%)",
      iconBg: "hsl(353, 60%, 87%)",
      text: "hsl(353, 50%, 28%)",
      badge: { bg: "#E24B4A", text: "#FCEBEB", label: "HIGH" },
    },
    medium: {
      bg: "hsl(35, 80%, 93%)",
      border: "hsl(35, 70%, 78%)",
      iconColor: "hsl(35, 80%, 38%)",
      iconBg: "hsl(35, 75%, 87%)",
      text: "hsl(35, 40%, 22%)",
      badge: { bg: "#BA7517", text: "#FAEEDA", label: "MEDIUM" },
    },
    low: {
      success: {
        bg: "hsl(152, 40%, 93%)",
        border: "hsl(152, 45%, 78%)",
        iconColor: "hsl(152, 55%, 32%)",
        iconBg: "hsl(152, 45%, 87%)",
        text: "hsl(152, 40%, 22%)",
        badge: { bg: "#1D9E75", text: "#E1F5EE", label: "LOW" },
      },
      info: {
        bg: "hsl(258, 44%, 95%)",
        border: "hsl(258, 40%, 82%)",
        iconColor: "hsl(258, 55%, 48%)",
        iconBg: "hsl(258, 44%, 88%)",
        text: "hsl(258, 30%, 25%)",
        badge: { bg: "#378ADD", text: "#E6F1FB", label: "LOW" },
      },
      default: {
        bg: "hsl(210, 15%, 95%)",
        border: "hsl(210, 15%, 82%)",
        iconColor: "hsl(210, 20%, 42%)",
        iconBg: "hsl(210, 15%, 88%)",
        text: "hsl(210, 15%, 22%)",
        badge: { bg: "#888780", text: "#F1EFE8", label: "LOW" },
      },
    },
  };

  const darkColors = {
    high: {
      bg: "hsl(353, 40%, 15%)",
      border: "hsl(353, 60%, 25%)",
      iconColor: "hsl(353, 70%, 60%)",
      iconBg: "hsl(353, 60%, 20%)",
      text: "hsl(353, 50%, 85%)",
      badge: { bg: "#E24B4A", text: "#FCEBEB", label: "HIGH" },
    },
    medium: {
      bg: "hsl(35, 80%, 15%)",
      border: "hsl(35, 70%, 25%)",
      iconColor: "hsl(35, 80%, 65%)",
      iconBg: "hsl(35, 75%, 20%)",
      text: "hsl(35, 40%, 85%)",
      badge: { bg: "#BA7517", text: "#FAEEDA", label: "MEDIUM" },
    },
    low: {
      success: {
        bg: "hsl(152, 40%, 15%)",
        border: "hsl(152, 45%, 25%)",
        iconColor: "hsl(152, 55%, 65%)",
        iconBg: "hsl(152, 45%, 20%)",
        text: "hsl(152, 40%, 85%)",
        badge: { bg: "#1D9E75", text: "#E1F5EE", label: "LOW" },
      },
      info: {
        bg: "hsl(258, 44%, 15%)",
        border: "hsl(258, 40%, 25%)",
        iconColor: "hsl(258, 55%, 70%)",
        iconBg: "hsl(258, 44%, 20%)",
        text: "hsl(258, 30%, 85%)",
        badge: { bg: "#378ADD", text: "#E6F1FB", label: "LOW" },
      },
      default: {
        bg: "hsl(210, 15%, 15%)",
        border: "hsl(210, 15%, 25%)",
        iconColor: "hsl(210, 20%, 70%)",
        iconBg: "hsl(210, 15%, 20%)",
        text: "hsl(210, 15%, 85%)",
        badge: { bg: "#888780", text: "#F1EFE8", label: "LOW" },
      },
    },
  };

  const colors = isDark ? darkColors : lightColors;

  switch (status?.toLowerCase()) {
    case "high":
      return colors.high;
    case "medium":
      return colors.medium;
    case "low":
    default:
      switch (type?.toLowerCase()) {
        case "success":
        case "optimal":
          return colors.low.success;
        case "info":
          return colors.low.info;
        default:
          return colors.low.default;
      }
  }
};


export const getIconByType = (type) => {
  switch (type?.toLowerCase()) {
    case "critical":
    case "danger":
    case "alert":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "success":
    case "optimal":
      return CheckCircle;
    case "info":
    case "normal":
    default:
      return Clock;
  }
};
