const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rose: colors.rose,
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      width: {
        '100': '25rem',
        '120': '30rem',
        '-120': '-30rem',        
        '128': '32rem',
        '136': '34rem',
        '152': '38rem',
        '156': '39rem',
        '176': '44rem',
        '232': '58rem',
        '280': '70rem',
      },      
      margin: {
        '100': '25rem',
        '120': '30rem',
        '-120': '-30rem',        
        '128': '32rem',
        '136': '34rem',
        '152': '38rem',
        '156': '39rem',
        '176': '44rem',
        '232': '58rem',
        '280': '70rem',
      },
      height: {
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '152': '38rem',
        '156': '39rem',
        '176': '44rem',
        '192': '48rem',
        '200': '50rem',       
        '232': '58rem',
        '280': '70rem',  
        '300': '75rem',
        '316': '79rem',  
        '352': '88rem', 
        '448': '112rem',                    
      },      
      scale: {
        '50': '.5',
        '67': '.67',
        '25': '.25',
        '-1': '-1',
      },
      keyframes: {
        slideinleft: {
          '0%': { transform: 'translateX(-750px)', opacity: '0' },
          '100%': { transform: 'translateX(0px)', opacity: '100' }
        },
        slideinright: {
          '0%': { transform: 'translateX(1500px)', opacity: '0' },
          '100%': { transform: 'translateX(0px)', opacity: '100' }
        },  
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '100' }
        },              
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      },
      animation: {
        fadein: 'fadein 1s ease-in-out',
        slideinright: 'slideinright 1s ease-in-out',         
        slideinleft: 'slideinleft 1.5s ease-in-out',
        wiggle: 'wiggle 2s ease-in-out infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
