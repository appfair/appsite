// Component names are daysite's public API. All paths are relative to this file.
export default {
  apiVersion: 1,
  components: {
    Header: './src/components/Header.astro',
    Footer: './src/components/Footer.astro',
  },
  customCss: ['./src/theme.css'],
  srcDir: './src',
};
