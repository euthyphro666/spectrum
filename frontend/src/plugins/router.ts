import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Player from '@/views/Player.vue';
import Spectator from '@/views/Spectator.vue';
import Campaign from '@/views/Campaign.vue';
import Selection from '@/views/Selection.vue';
import Session from '@/views/Session.vue';
import Editor from '@/views/Editor.vue';
import Viewer from '@/views/Viewer.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/campaign',
			name: 'campaign',
			component: Campaign
		},
		{
			path: '/selection',
			name: 'selection',
			component: Selection
		},
		{
			path: '/session',
			name: 'session',
			component: Session
		},
		{
			path: '/player',
			name: 'player',
			component: Player
		},
		{
			path: '/spectator',
			name: 'spectator',
			component: Spectator
		},
		{
			path: '/editor',
			name: 'editor',
			component: Editor
		},
		{
			path: '/viewer',
			name: 'viewer',
			component: Viewer
		}
	]
});
