export default interface CDOfficialProps {
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