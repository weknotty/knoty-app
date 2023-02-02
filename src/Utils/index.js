export const changeViewState = (value) => {
  const ev = new CustomEvent("changeState", { detail: value });
  document.dispatchEvent(ev);
  return
};
