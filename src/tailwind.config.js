module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        cyanBlue: '#202833',
        yellow: '#d3c19d',
        darkYellow: '#A8843B',

        grey: 'rgba(0,0,0,.1)',
        darkerGrey: 'rgba(0,0,0,.75)'
      },
      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '768px',
          lg: '992px',
          xl: '1200px'
        }
      }
    },
  },
  variants: {},
  plugins: []
}
