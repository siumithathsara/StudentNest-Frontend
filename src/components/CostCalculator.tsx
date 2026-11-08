import { useState } from "react"
import type { NearbyCampus } from "../types"
import { formatRent } from "../util/format"
import { inputClass, labelClass } from "../util/styles"

type Props = {
  rent: number
  mealsIncluded: boolean
  campuses: NearbyCampus[] 
}

const ROAD_FACTOR = 1.3 
const num = (v: string) => Math.max(0, Number(v) || 0)

const CostCalculator = ({ rent, mealsIncluded, campuses }: Props) => {
  const first = campuses[0]
  const [campusIdx, setCampusIdx] = useState(0)
  const [distance, setDistance] = useState(String(first?.distanceKm ?? 1))
  const [walk, setWalk] = useState((first?.distanceKm ?? 1) <= 1.5)
  const [utilities, setUtilities] = useState("3000")
  const [food, setFood] = useState(mealsIncluded ? "0" : "15000")
  const [days, setDays] = useState("22")
  const [perKm, setPerKm] = useState("30")

  const chooseCampus = (idx: number) => {
    setCampusIdx(idx)
    const c = campuses[idx]
    if (c) {
      setDistance(String(c.distanceKm))
      setWalk(c.distanceKm <= 1.5)
    }
  }

  const roadKm = num(distance) * ROAD_FACTOR
  const transport = walk ? 0 : Math.round(num(days) * 2 * roadKm * num(perKm))
  const total = rent + num(utilities) + num(food) + transport

  const smallInput = `${inputClass} py-2`

  return (
    <section className="rounded-2xl bg-nest-800 p-5" aria-label="Monthly cost estimate">
      <h2 className="text-lg font-bold text-sand-100">Monthly cost estimate</h2>
      <p className="mt-1 text-sm text-nest-300">Change the numbers to match your life. These are rough estimates, not real prices.</p>

      {campuses.length > 0 && (
        <div className="mt-4">
          <label htmlFor="calc-campus" className={labelClass}>Travelling to</label>
          <select id="calc-campus" className={smallInput} value={campusIdx} onChange={(e) => chooseCampus(Number(e.target.value))}>
            {campuses.map((c, i) => (
              <option key={c.id} value={i}>
                {c.name} ({c.city}) · {c.distanceKm} km
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="calc-distance" className={labelClass}>Distance to campus (km)</label>
          <input id="calc-distance" type="number" min={0} step="0.1" className={smallInput} value={distance} onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div>
          <label htmlFor="calc-utilities" className={labelClass}>Electricity and water (Rs.)</label>
          <input id="calc-utilities" type="number" min={0} className={smallInput} value={utilities} onChange={(e) => setUtilities(e.target.value)} />
        </div>
        <div>
          <label htmlFor="calc-food" className={labelClass}>Food (Rs.){mealsIncluded ? " · meals are included" : ""}</label>
          <input id="calc-food" type="number" min={0} className={smallInput} value={food} onChange={(e) => setFood(e.target.value)} />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 pb-3 text-sm text-nest-100">
            <input type="checkbox" checked={walk} onChange={(e) => setWalk(e.target.checked)} className="h-4 w-4 accent-sand-400" />
            I will walk (no transport cost)
          </label>
        </div>
        {!walk && (
          <>
            <div>
              <label htmlFor="calc-days" className={labelClass}>Travel days per month</label>
              <input id="calc-days" type="number" min={0} max={31} className={smallInput} value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
            <div>
              <label htmlFor="calc-perkm" className={labelClass}>Cost per km (Rs.)</label>
              <input id="calc-perkm" type="number" min={0} className={smallInput} value={perKm} onChange={(e) => setPerKm(e.target.value)} />
            </div>
          </>
        )}
      </div>

      <dl className="mt-5 space-y-2 border-t border-nest-600 pt-4 text-sm text-nest-100">
        <div className="flex justify-between">
          <dt>Rent</dt>
          <dd>{formatRent(rent)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Electricity and water</dt>
          <dd>{formatRent(num(utilities))}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Food</dt>
          <dd>{formatRent(num(food))}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Transport</dt>
          <dd>{formatRent(transport)}</dd>
        </div>
        <div className="flex justify-between border-t border-nest-600 pt-3 text-lg font-bold text-sand-100" aria-live="polite">
          <dt>Total per month</dt>
          <dd>{formatRent(total)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default CostCalculator