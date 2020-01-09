import Vue from 'vue';

import './plugin/registerServiceWorker';
import App from './App.vue';
import router from './plugin/router';
import store from './plugin/store';

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
