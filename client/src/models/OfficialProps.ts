import type { Feature, Point } from 'geojson';

interface Term {
	chamber?: string;
	start_year?: number;
	end_year?: number;
}

export interface Official {
	name: string;
	party?: string;
	state?: string;
	stateUSPS?: string;
	district?: string;
	title?: string;
	depiction_url?: string;
	bio_id?: string;
	terms?: Term[];
	metadata?: unknown;
}

interface FeatureOfficial {
	feature: Feature;
	official: Official;
}

export interface AddressOfficials {
	point: Point;
	senate: FeatureOfficial;
	house: FeatureOfficial;
	congressional: FeatureOfficial;
	senators: [Official, Official];
}

export interface OfficialFECSummary {
	name: string;
	prefix: string;
	suffix: string;
	candidate_id: string;
	party: string;
	address_street: string;
	address_city: string;
	address_state: string;
	address_zip: string;
	office: string;
	district: number;
	cycles: number[];
	election_districts: string[];
	election_years: string[];
}

export interface CampaignSummary {
	total_raised: number;
	total_spent: number;
	cash_on_hand: number;
	total_debt: number;
	individual_contributions: number;
	pac_contributions: number;
	party_contributions: number;
	self_funded: number;
	individual_percent: number;
	pac_percent: number;
	small_donor_amount: number;
	large_donor_amount: number;
	small_donor_percent: number;
	burn_rate: number;
	financial_health_score: number;
	pac_dependency_level: string;
}
