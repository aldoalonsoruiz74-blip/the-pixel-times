const AppState = (function() {
  let state = {
    news: [],               // todas las noticias (fusionadas con admin)
    originalNews: [],       // copia pura del JSON para reset
    currentCategory: 'todas',
    searchTerm: '',
    currentArticleId: null,
    isAdmin: false,
    isEditing: false,       // para formulario admin
    editingNewsId: null,
    hasUnsavedChanges: false
  };

  const listeners = [];

  function getState() { return { ...state }; }
  function setState(newState) {
    state = { ...state, ...newState };
    listeners.forEach(fn => fn(state));
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => { // unsubscribe
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  return { getState, setState, subscribe };
})();