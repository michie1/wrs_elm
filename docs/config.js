const config = {
  apiKey: "AIzaSyCCzStZqMSpKAnBaSNK1MNlaleBTR9b-dA",
  authDomain: "cycling-results.firebaseapp.com",
  databaseURL: "https://cycling-results.firebaseio.com",
  projectId: "cycling-results",
  storageBucket: "cycling-results.appspot.com",
  messagingSenderId: "939143658590",
  wtosLoginUrl: "https://wtos.nl/wrslogin.php"
};

const testConfig = {
  apiKey: "AIzaSyDmOKJe4i-p6k8wNJTt-rn364Xe76zXrmg",
  authDomain: "cycling-results-dev.firebaseapp.com",
  databaseURL: "https://cycling-results-dev.firebaseio.com",
  projectId: "cycling-results-dev",
  storageBucket: "",
  messagingSenderId: "863333663162",
  wtosLoginUrl: "https://wtos.nl/wrslogin.php"
};

function hasParam(name) {
  var regex = new RegExp('[\\?&]' + name );
  var results = regex.exec(location.search);
  return results !== null;
};
