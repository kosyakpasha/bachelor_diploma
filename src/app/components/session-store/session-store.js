class SessionStore {  
  getResult() {
    if (sessionStorage.getItem('firstVisit') === null) {
      sessionStorage.setItem('firstVisit', 'false');
      return true;
    } else {
      return false;
    }
  }
}

const sessionStore = new SessionStore();

export {sessionStore};
