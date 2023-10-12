const mobile = 480;
const tablet = 768;
const desktop = 1024;
const largeDesktop = 1440;

export const mobileMQ = (styles) => `
  @media (max-width: ${mobile}px) {
    ${styles}
  }
`;

export const tabletMQ = (styles) => `
  @media (max-width: ${tablet}px) {
    ${styles}
  }
`;

export const desktopMQ = (styles) => `
  @media (max-width: ${desktop}px) {
    ${styles}
  }
`;

export const largeDesktopMQ = (styles) => `
  @media (max-width: ${largeDesktop}px) {
    ${styles}
  }
`;
