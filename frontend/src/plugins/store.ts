import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import IStore from '@/ts/interfaces/IStore';
import { getDefaultMap } from '@/ts/interfaces/IMap';
import { getDefaultCampaign } from '@/ts/interfaces/ICampaign';
import TileRegistry from '@/ts/util/TileRegistry';
import axios from 'axios';
import Screenshot from '@/ts/util/Screenshot';
import { getDefaultUser } from '@/ts/interfaces/IUser';
import { v1 as uuidV1 } from 'uuid';
import ICharacter from '@/ts/interfaces/ICharacter';
import CharacterRegistry from '@/ts/util/CharacterRegistry';

Vue.use(Vuex);

let characterRegistry = new CharacterRegistry();
let assetRegistry = new TileRegistry();
let entityRegistry = new TileRegistry();
let tileRegistry = new TileRegistry();

(async () => {
	assetRegistry.init('/requestAssets');
	entityRegistry.init('/requestEntities');
	tileRegistry.init('/requestTiles');
	Screenshot.Init();
})();

export default new Store<IStore>({
	state: {
		welcomeMessage: false,
		currentMap: getDefaultMap(),
		currentCampaign: getDefaultCampaign(),
		currentUser: getDefaultUser(),
		characters: characterRegistry,
		entities: entityRegistry,
		assets: assetRegistry,
		tiles: tileRegistry,
		selectedCharacter: '',
		editingCharacters: false,
		selectedTile: 0,
		editingTiles: false,
		selectedAsset: 0,
		editingAssets: false,
		currentSession: undefined,
		sessionRole: 'spectator',
		characterCache: undefined
	},
	mutations: {},
	actions: {
		updateSession(context, characters) {
			let session = context.state.currentSession;
			if (session) {
				axios.post('/updateSession', {
					sessionId: session.id,
					characters
				});
			}
		},
		resizeMap(context, newDims) {
			const store: IStore = context.state;
			const map = store.currentMap;

			// Resize the map and its content
			const ol = map.width * map.height;
			const nl = newDims.width * newDims.height;
			map.width = newDims.width;
			map.height = newDims.height;
			// Pad
			if (nl >= ol) {
				map.tiles = [
					...map.tiles,
					...new Array<number>(nl - ol).fill(1)
				];
				map.assets = [
					...map.assets,
					...new Array<number>(nl - ol).fill(0)
				];
			}
			// Or truncate
			else {
				map.tiles = map.tiles.splice(0, nl);
				map.assets = map.assets.splice(0, nl);
			}

			// Retake the thumbnail
			const tiles = store.tiles;
			const thumbnail = Screenshot.CreateThumbnail(200, 200, map, tiles);

			map.thumbnail = thumbnail;
			map.campaign = store.currentCampaign.id;

			axios.post('/saveMap', {
				map: map
			});
		},
		renameMap(context) {
			const store: IStore = context.state;
			const map = store.currentMap;
			axios.post('/saveMap', {
				map: map
			});
		},
		saveMap(context) {
			const store: IStore = context.state;
			console.log(`[ Store ] Saving map ${store.currentMap.name}.`);

			const map = store.currentMap;
			const tiles = store.tiles;
			const thumbnail = Screenshot.CreateThumbnail(200, 200, map, tiles);

			map.thumbnail = thumbnail;
			map.campaign = store.currentCampaign.id;

			axios.post('/saveMap', {
				map: map
			});
		},
		duplicateMap(context) {
			const store: IStore = context.state;
			console.log(
				`[ Store ] Duplicating current map ${store.currentMap.name}.`
			);
			const map = store.currentMap;
			map.name = `Copy of ${map.name}`;
			map.id = uuidV1();
			map.campaign = store.currentCampaign.id;
		}
	},
	modules: {}
});
