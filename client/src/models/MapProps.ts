import type { FeatureCollection } from 'geojson';
import type { Official } from './OfficialProps';

export type MapType = 'county' | 'sldl' | 'sldu' | 'cd' | 'place' | 'cousub';

export interface State {
	NAME: string;
	STATEFP: string; //previously id
	USPS: string; //previously code
	bounds: [[number, number], [number, number]];
}

export interface District {
	TYPE: string;
	NAME: string;
	ID: string;
	bounds: [[number, number], [number, number]];
}

export interface Chamber {
	seats: number;
	democrat: number;
	republican: number;
	independent: number;
	other: number;
	vacant: number;
	non_voting?: number;
}

export interface FederalSummary {
	executive: Official[];
	legislative: {
		house: Chamber;
		senate: Chamber;
	};
	judicial: Official[]; //may need to create new judge type once implemented
}

export interface StateSummary extends FederalSummary {
	federal: {
		senators: Official[];
		house: Chamber;
	};
}

export interface FederalResponse {
	summary: FederalSummary;
	map: FeatureCollection;
}

export interface StateResponse {
	summary: StateSummary;
	map: FeatureCollection;
}

export interface BackdropMap {
	cities?: FeatureCollection;
	roads: FeatureCollection;
	water?: FeatureCollection;
}
