const computePercents = (dem: number, rep: number, ind: number, vac: number = 0) => {
	const total = Math.max(1, dem + rep + ind + vac || 0); // avoid divide-by-zero
	const d = (dem / total) * 100;
	const r = (rep / total) * 100;
	const i = (ind / total) * 100;
	const v = (vac / total) * 100;
	return [d, r, i, v];
};

export const Dial = ({
	dem,
	rep,
	ind,
	vac = 0,
}: {
	dem: number;
	rep: number;
	ind: number;
	vac: number;
}) => {
	const [dPerc, rPerc, iPerc, vPerc] = computePercents(dem, rep, ind, vac);
	// Convert percent-of-360 to stroke-dasharray values where circumference is 100
	// We'll draw arcs with strokeDasharray = "<portion> 100"
	// To stack arcs we use strokeDashoffset to shift start points.
	const offsetDem = 0;
	const offsetRep = dPerc;
	const offsetInd = dPerc + rPerc;
	const offsetVac = dPerc + rPerc + vPerc;

	const totalSeats = dem + rep + ind + vac;

	return (
		<div className="relative w-[140px] h-[140px] flex items-center justify-center" aria-hidden>
			<svg
				viewBox="0 0 36 36"
				className="w-full h-full"
				role="img"
				aria-label="Seat distribution dial"
			>
				{/* Background track */}
				<circle cx="18" cy="18" r="15.9" strokeWidth="3" fill="none" className="stroke-gray-200" />

				{/* Democrats */}
				<circle
					cx="18"
					cy="18"
					r="15.9"
					strokeWidth="3"
					fill="none"
					strokeDasharray={`${dPerc} ${100 - dPerc}`}
					strokeDashoffset={100 - offsetDem}
					className="stroke-blue-600 transition-all duration-700 ease-out stroke-linecap-round"
					transform="rotate(-90 18 18)"
				/>

				{/* Republicans */}
				{rPerc > 0 && (
					<circle
						cx="18"
						cy="18"
						r="15.9"
						strokeWidth="3"
						fill="none"
						strokeDasharray={`${rPerc} ${100 - rPerc}`}
						strokeDashoffset={100 - offsetRep}
						className="stroke-red-500 transition-all duration-700 ease-out stroke-linecap-round"
						transform="rotate(-90 18 18)"
					/>
				)}

				{/* Independents */}
				{iPerc > 0 && (
					<circle
						cx="18"
						cy="18"
						r="15.9"
						strokeWidth="3"
						fill="none"
						strokeDasharray={`${iPerc} ${100 - iPerc}`}
						strokeDashoffset={100 - offsetInd}
						className="stroke-gray-500 transition-all duration-700 ease-out stroke-linecap-round"
						transform="rotate(-90 18 18)"
					/>
				)}

				{/* Vacancies */}
				{vPerc > 0 && (
					<circle
						cx="18"
						cy="18"
						r="15.9"
						strokeWidth="3"
						fill="none"
						strokeDasharray={`${vPerc} ${100 - vPerc}`}
						strokeDashoffset={100 - offsetVac}
						className="stroke-amber-500 transition-all duration-700 ease-out stroke-linecap-round"
						transform="rotate(-90 18 18)"
					/>
				)}
			</svg>

			{/* Center Count */}
			<div className="absolute flex flex-col items-center pointer-events-none text-center">
				<div className="text-lg font-bold text-slate-900">{totalSeats}</div>
				<div className="text-xs text-gray-500">Seats</div>
			</div>
		</div>
	);
};
