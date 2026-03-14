

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

  // Accueil1
  accGreena: 'hsl(84, 39%, 37%)',
  accGreenb: 'hsl(82, 56%, 47%)',
  accDarka: 'hsl(165, 9%, 15%)',
  accDarkb: 'hsl(180, 3%, 29%)',
  accDarkc: 'hsl(180, 2%, 43%)',

  // Palette Green
  pal2Whitea: 'hsl(60, 7%, 91%)',
  pal2Whiteb: 'hsl(60, 7%, 91%)',
  pal2Greena: 'hsl(82, 30%, 62%)',
  pal2Greenb: 'hsl(120, 100%, 20%)',

  // Dark Mode Palette
  metalDark1: 'hsl(0, 2%, 14%)',
  metalDark2: 'hsl(0, 1%, 25%)',
  metalDark3: 'hsl(0, 0%, 13%)',
  metalDark4: 'hsl(240, 2%, 53%)',
  metalDark5: 'hsl(0, 0%, 7%)',

  // Grays
  gray1: 'hsl(0, 0%, 50%)',
  colorJkDark: 'hsl(204, 19%, 15%)',
  colorJkDgray: 'hsl(210, 100%, 99%)',

  // Dark variants
  darkVariant: 'hsl(220, 7%, 19%)',
  darkVariantb: 'hsl(0, 0%, 21%)',
  colorDarkBlue: 'hsl(210, 29%, 15%)',

  // Signs
  dangerA: 'hsl(355, 100%, 70%)',
  dangerB: 'hsl(355, 70%, 80%)',
  dangerC: 'hsl(353, 40%, 90%)',
  warning: 'hsl(35, 80%, 70%)',
  successA: 'hsl(125, 85%, 60%)',
  successB: 'hsl(160, 60%, 70%)',
  successC: 'hsl(150, 80%, 80%)',

  // Shadows
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

  // Font/spacing scales (optional for icons)
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

}


export const getStageColor = (stage, isDark = false) => {
  const lightColors = {
    'Sprout': '#79a490',        // SAGE LIGHT
    'Seedling': '#92e6a7',      // ptl-greenb
    'Vegetative': '#6ede8a',    // ptl-greenc
    'Budding': '#2dc653',       // ptl-greend
    'Flowering': '#25a244',     // ptl-greene
    'Fruiting': '#208b3a',      // ptl-greenf
    'Ready To Harvest': '#1a7431', // ptl-greeng
    'All': '#7BA591'             // sage base
  };

  // Dark theme colors
  const darkColors = {
    'Sprout': '#79a490',        // SAGE LIGHT
    'Seedling': '#10451d',      // ptl-greenj
    'Vegetative': '#5A8F73',    // sage-dark
    'Budding': '#027c68',       // sancgb
    'Flowering': '#003333',     // sancga
    'Fruiting': '#009983',      // sancgd
    'Ready To Harvest': '#1a6b38', // adjusted darker green
    'All': '#5A8F73'            // fallback sage-dark
    };

  return isDark ? darkColors[stage] || '#5A8F73' : lightColors[stage] || '#5A8F73';
};




export  const getHarvestStatusColor = (stage, isDark = false) => {
  const lightColors = {
    'Not Ready': 'var(--metal-dark4)',       
    'Due Now': '#92e6a7',     
    'Harvested': '#208b3a',    
    'Ready To Harvest': '#1a7431', 
    'All': '#7BA591'          
  };
  // Dark theme colors
  const darkColors = {    
    'Not Ready': '#10451d',      
    'Due Now': '#5A8F73',   
    'Harvested': '#027c68',      
    'Ready To Harvest': '#1a6b38',
    'All': '#5A8F73'          
    };
  return isDark ? darkColors[stage] || '#5A8F73' : lightColors[stage] || '#5A8F73';
};



