export interface CdOfficialProps {
    bioguideId: string,
    depiction: {
        attribution: string,
        imageUrl: string
    },
    district: number,
    name: string,
    partyName: string,
    state: string,
    terms: {
        item: [
            {
                chamber: string,
                startYear: number
            }
        ]
     },
    updateDate: string,
    url: string
}

export interface StateLegislatorsProps {
    birth_date: string,
    created_at: string,
    current_role: {
        district: string,
        division_id: string,
        org_classification: string,
        title: string,
    }
    death_date: string,
    email: string,
    extras: any
    family_name: string,
    gender: string,
    given_name: string,
    id: string,
    image: string,
    jurisdiction: {
        classification: string,
        id: string,
        name: string,
    }
    name: string,
    openstates_url: string,
    party: string,
    updated_at: string,
}

export interface GovSummaryProps {
    executive: StateLegislatorsProps[],
    legislative: {
        house: ChamberProps,
        senate: ChamberProps
    },
    judicial: any[],
    lastUpdated: Date
}

export interface ChamberProps {
    democrats: number,
    independents: number,
    republicans: number,
    non_voting?: CdOfficialProps[],
    vacancies?: number
}