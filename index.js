import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reducer from './app/reducers/reducer';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(
  reducer,
  //window.__REDUX_DEVTOOLS_EXtENSION__ && window.__REDUX_DEVTOOLS_EXtENSION__(),
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>

    {/* <ConfigProvider locale={frFR}> */}
    <App />
    {/* </ConfigProvider> */}
  </Provider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


serviceWorker.unregister();
