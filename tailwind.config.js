module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/components/*.{vue,js,ts,jsx,tsx}',
  ],
  prefix: 'ui-',
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Inter', 'serif'],
    },
    fontSize: {
      sm: ['12px', '120%'],
      base: ['14px', '140%'],
      h1: ['28px', '120%'],
      h2: ['20px', '120%'],
      h3: ['20px', '120%'],
      'p16-semibold': ['16px', '140%'],
      p16: ['16px', '140%'],
      'p14-medium': ['14px', '140%'],
      'p14-semibold': ['14px', '140%'],
      p14: ['14px', '140%'],
      'p12-semibold': ['12px', '120%'],
      p12: ['12px', '140%'],
      'p12-medium': ['12px', '160%'],
    },
    borderRadius: {
      large: '16px',
      base: '12px',
      sm: '6px',
    },
    extend: {
      boxShadow: {
        popup: '0px 0px 14px -4px rgba(0, 0, 0, 0.05), 0px 32px 48px -8px rgba(0, 0, 0, 0.1)',
        'menu-shadow': '0px -13px 24px -7px rgba(26, 29, 31, 0.05), 0px 24px 40px -11px rgba(26, 29, 31, 0.1)',
        'window-shadow': '0px 14px 40px 10px rgba(21, 28, 48, 0.06)',
        'search-shadow': '0px -24px 32px -11px rgba(26, 29, 31, 0.05)',
        'widget-shadow': '0px 30px 50px rgba(232, 232, 232, 0.35)',
        'quote-shadow':'0px 16px 40px rgba(26, 29, 31, 0.1)',
      },
      colors: {
        primary: {
          100: 'rgba(102, 139, 251, 0.1)',
          500: 'rgba(102, 139, 251, 0.5)',
          900: '#668BFB',
        },
        orange: {
          100: '#FFEBA5',
          500: '#FFC979',
          900: '#F9AC75',
        },
        black: {
          50: '#EDEDED',
          100: 'rgba(111, 118, 126, 0.4)',
          200: 'rgba(111, 118, 126, 0.2)',
          500: '#9A9FA5',
          900: '#1A1D1F',
        },
        purple: {
          500: '#C5B7FF',
          900: '#9876F8',
        },
        azure: {
          500: '#A4E2FD',
          900: '#83D6E8',
        },
        white: {
          900: '#FCFCFC',
        },
        'background-color': {
          500: 'rgba(244, 244, 244, 0.5)',
          900: '#F4F4F4',
        },
        green: {
          100: '#83BF6E1A',
          500: '#8FDBB1',
          900: '#83BF6E',
        },
        red: {
          100: '#FFA295',
          500: '#F97685',
          900: '#FF6A55',
        },
      },
      screens: {
        mobile: { max: '575px' },
        table: '575px',
        'max-768px': { max: '768px' },
        laptop: '1198px',
        desktop: '1902px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
