export const scrollTo = (elementId: string, modifier?: number): void => {
  const content = document.getElementById(elementId)!;
  const position = content?.getBoundingClientRect();
  window.scrollTo({
    behavior: 'smooth',
    top: position?.height - (modifier ?? 0),
  });
};
