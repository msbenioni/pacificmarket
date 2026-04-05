export const pagesConfig = {
  Pages: {
    Home: () => import('@/pages/Home'),
    PacificOwnedBusinesses: () => import('@/pages/PacificOwnedBusinesses'),
    GlobalPacificBusinessDirectory: () => import('@/pages/GlobalPacificBusinessDirectory'),
    SupportPacificBusinesses: () => import('@/pages/SupportPacificBusinesses'),
  },
  mainPage: 'Home',
};
