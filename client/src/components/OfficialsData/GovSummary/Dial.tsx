const computePercents = (dem: number, rep: number, ind: number, vac: number=0) => {
    const total = Math.max(1, dem + rep + ind + vac || 0); // avoid divide-by-zero
    const d = (dem / total) * 100;
    const r = (rep / total) * 100;
    const i = (ind / total) * 100;
    const v = (vac / total) * 100;
    return [d, r, i, v];
};
    
    
export const Dial = ({ dem, rep, ind, vac=0 }: { dem: number; rep: number; ind: number, vac: number }) => {
    const [dPerc, rPerc, iPerc, iVac] = computePercents(dem, rep, ind, vac);
    console.log(dPerc, rPerc);
    // Convert percent-of-360 to stroke-dasharray values where circumference is 100
    // We'll draw arcs with strokeDasharray = "<portion> 100"
    // To stack arcs we use strokeDashoffset to shift start points.
    const offsetDem = 0;
    const offsetRep = dPerc;
    const offsetInd = dPerc + rPerc;
    const offsetiVac = dPerc + rPerc + iVac;

    return (
    <div className="dial-wrapper" aria-hidden>
        <svg viewBox="0 0 36 36" className="dial-svg" role="img" aria-label="Seat distribution dial">
        <circle className="dial-bg" cx="18" cy="18" r="15.9" strokeWidth="3" fill="none" />
        <circle
            className="dial-dem"
            cx="18"
            cy="18"
            r="15.9"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${dPerc} ${100 - dPerc}`}
            strokeDashoffset={100 - offsetDem}
            transform="rotate(-90 18 18)"
        />
        {rPerc && <circle
            className="dial-rep"
            cx="18"
            cy="18"
            r="15.9"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${rPerc} ${100 - rPerc}`}
            strokeDashoffset={100 - offsetRep}
            transform="rotate(-90 18 18)"
        />}
        {iPerc &&
            <circle
                className="dial-ind"
                cx="18"
                cy="18"
                r="15.9"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${iPerc} ${100 - iPerc}`}
                strokeDashoffset={100 - offsetInd}
                transform="rotate(-90 18 18)"
            />
        }
        {iVac &&
            <circle
                className="dial-vac"
                cx="18"
                cy="18"
                r="15.9"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${iVac} ${100 - iVac}`}
                strokeDashoffset={100 - offsetiVac}
                transform="rotate(-90 18 18)"
            />
        }
        </svg>

        <div className="dial-center">
        <div className="dial-count">{dem + rep + ind + vac}</div>
        <div className="dial-label">Seats</div>
        </div>
    </div>
    );
};