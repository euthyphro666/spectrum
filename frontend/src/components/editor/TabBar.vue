<template>
	<div class="tab-bar">
		<div class="tabs">
			<Tab
				v-for="tab in tabs"
				:key="tab.name"
				:name="tab.name"
				:active="tab.active"
				:image="tab.image"
				@clicked="onClick(tab)"
			/>
		</div>
		<div class="content" :class="{ hidden: !tabActive }">
			<component :is="currentTab"></component>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import Tab from './Tab.vue';
	import ITab from '../../ts/interfaces/ui/ITab';
	import FileBar from './FileBar.vue';
	import TileBar from './TileBar.vue';
	import AssetBar from './AssetBar.vue';
	import CharacterBar from './CharacterBar.vue';
	import SessionBar from './SessionBar.vue';
	import IStore from '../../ts/interfaces/IStore';

	@Component({
		components: {
			Tab
		}
	})
	export default class TabBar extends Vue {
		private tabs: ITab[] = [];
		private currentTab: any = null;
		private tabActive: boolean = false;

		mounted(): void {
			this.tabs = [
				{
					name: 'File',
					active: false,
					image: 'F',
					component: FileBar
				},
				{
					name: 'Tiles',
					active: false,
					image: 'T',
					component: TileBar
				},
				{
					name: 'Assets',
					active: false,
					image: 'A',
					component: AssetBar
				},
				{
					name: 'Characters',
					active: false,
					image: 'C',
					component: CharacterBar
				},
				{
					name: 'Sessions',
					active: false,
					image: 'S',
					component: SessionBar
				}
			];
		}

		onClick(tab: ITab): void {
			this.tabs.forEach((t) => {
				if (tab.name !== t.name) t.active = false;
			});
			if (tab.active) {
				tab.active = false;
				this.currentTab = null;
				this.tabActive = false;
			} else {
				tab.active = true;
				this.currentTab = tab.component;
				this.tabActive = true;
			}

			const store: IStore = this.$store.state;
			store.editingTiles = this.tabs[1].active; // TileBar is active
			store.editingAssets = this.tabs[2].active; // AssetBar is active
			store.editingCharacters = this.tabs[3].active; // AssetBar is active
		}
	}
</script>

<style scoped>
	.tab-bar {
		width: auto;
		background-color: #3d3d3d;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		height: 100%;
	}
	.tabs {
		background-color: #333333;
		width: 46px;
		height: 100%;
	}
	.content {
		background-color: #252526;
		width: 196px;
		height: 100%;
	}
	.hidden {
		visibility: hidden;
		width: 0px;
	}
</style>
