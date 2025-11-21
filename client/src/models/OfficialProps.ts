interface Term {
	chamber?: string;
	start_year?: number;
	end_year?: number;
}

export interface Official {
	name: string;
	party?: string;
	state?: string;
	district?: string;
	title?: string;
	depiction_url?: string;
	bio_id?: string;
	terms?: Term[];
	metadata?: unknown;
}
