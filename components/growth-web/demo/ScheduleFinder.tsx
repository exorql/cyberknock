"use client"

import {
  type CampusFilterId,
  DEMO_CLASSES,
  type DemoClassSlot,
  type GradeFilterId,
} from "@/lib/growth-web/demo-school"
import {
  type DemoClassFilters,
  DEMO_CLASS_VISUALS,
  DEMO_DAY_FILTERS,
  DEMO_DISPLAY_TEXT,
  DEMO_GRADE_TILES,
  DEMO_IMAGE_BASE,
  DEMO_PLACE_OPTIONS,
  type DemoDayId,
  splitTimeRange,
} from "@/lib/growth-web/demo-content"

function countForGrade(grade: Exclude<GradeFilterId, "all">): number {
  return DEMO_CLASSES.filter((slot) => slot.grades.includes(grade)).length
}

interface ClassFinderProps {
  filters: DemoClassFilters
  resultCount: number
  onChange: (next: DemoClassFilters, changed: "grade" | "day" | "campus" | "reset") => void
}

/** The search panel: three separate, clearly labelled conditions. Nothing is preselected. */
export function ClassFinder({ filters, resultCount, onChange }: ClassFinderProps) {
  const hasCondition = filters.grade !== "all" || filters.days.length > 0 || filters.campus !== "all"
  return (
    <div className="gwd-finder-wrap" id="schedule">
      <div className="gwd-wrap">
        <section className="gwd-finder gwd-dark" aria-labelledby="finder-title" data-gwd-pin="3" data-testid="class-finder">
          <div className="gwd-fhead">
            <h2 id="finder-title">{DEMO_DISPLAY_TEXT.finderTitle}</h2>
            <p>お子さまの学年をえらぶと、通えるクラスだけが下に並びます。</p>
          </div>
          <form className="gwd-fgrid" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend>
                <span className="gwd-n" aria-hidden="true">1</span>お子さまの学年<em>（4月時点）</em>
              </legend>
              <div className="gwd-tiles">
                {DEMO_GRADE_TILES.map((tile) => (
                  <label className="gwd-opt gwd-tile" key={tile.id}>
                    <input
                      type="radio"
                      name="demo-grade"
                      value={tile.id}
                      checked={filters.grade === tile.id}
                      onChange={() => onChange({ ...filters, grade: tile.id }, "grade")}
                      data-testid={`grade-${tile.id}`}
                    />
                    <span>
                      <b>{tile.label}</b>
                      <small>{countForGrade(tile.id)}クラス</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>
                <span className="gwd-n" aria-hidden="true">2</span>通える曜日<em>任意・複数OK</em>
              </legend>
              <div className="gwd-days">
                {DEMO_DAY_FILTERS.map((day) => {
                  const on = filters.days.includes(day.id)
                  return (
                    <label className="gwd-opt gwd-day" key={day.id}>
                      <input
                        type="checkbox"
                        name="demo-day"
                        value={day.id}
                        aria-label={day.name}
                        checked={on}
                        onChange={() =>
                          onChange(
                            {
                              ...filters,
                              days: on ? filters.days.filter((d) => d !== day.id) : [...filters.days, day.id],
                            },
                            "day"
                          )
                        }
                        data-testid={`day-${day.id}`}
                      />
                      <span aria-hidden="true">{day.label}</span>
                    </label>
                  )
                })}
              </div>
              <p className="gwd-fnote">えらばなければ、全曜日を表示します</p>
            </fieldset>
            <fieldset>
              <legend>
                <span className="gwd-n" aria-hidden="true">3</span>通いやすい場所<em>任意</em>
              </legend>
              <div className="gwd-places">
                {DEMO_PLACE_OPTIONS.map((place) => (
                  <label className="gwd-opt gwd-place" key={place.id}>
                    <input
                      type="radio"
                      name="demo-place"
                      value={place.id}
                      checked={filters.campus === place.id}
                      onChange={() => onChange({ ...filters, campus: place.id }, "campus")}
                      data-testid={`campus-${place.id}`}
                    />
                    <span>
                      {place.label}
                      {place.note && <small>{place.note}</small>}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="gwd-fres">
              <p aria-live="polite" aria-atomic="true">
                <b>
                  <span className="gwd-num" data-testid="schedule-result-count">{resultCount}</span>
                  <small>クラス</small>
                </b>
                {hasCondition ? "条件に合うクラス" : "すべてのクラス"}
              </p>
              <a className="gwd-btn gwd-btn-sun" href="#classes">
                クラスを見る
              </a>
              {hasCondition && (
                <button
                  type="button"
                  className="gwd-reset"
                  onClick={() => onChange({ grade: "all", days: [], campus: "all" }, "reset")}
                >
                  条件をクリア
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

interface ClassListProps {
  filters: DemoClassFilters
  classes: DemoClassSlot[]
  selectedClassId: string
  onSelectClassForTrial: (slot: DemoClassSlot) => void
  onReset: () => void
}

export function ClassList({ filters, classes, selectedClassId, onSelectClassForTrial, onReset }: ClassListProps) {
  const gradeLabel = DEMO_GRADE_TILES.find((g) => g.id === filters.grade)?.label ?? "すべて"
  const dayLabel = filters.days.length
    ? DEMO_DAY_FILTERS.filter((d) => filters.days.includes(d.id)).map((d) => d.label).join("・")
    : "指定なし"
  const placeLabel = DEMO_PLACE_OPTIONS.find((p) => p.id === filters.campus)?.label ?? "どちらでも"

  return (
    <section className="gwd-sec" id="classes" aria-labelledby="classes-title">
      <div className="gwd-wrap">
        <div className="gwd-sec-h">
          <div>
            <p className="gwd-eyebrow">CLASSES &amp; TIMETABLE</p>
            <h2 className="gwd-h2" id="classes-title">{DEMO_DISPLAY_TEXT.classesTitle}</h2>
          </div>
          <p>体験は、そのクラスのいつもの練習に参加します。時間はクラスによって60〜80分です。</p>
        </div>
        <p className="gwd-state">
          <span className="gwd-chip"><i>学年</i>{gradeLabel}</span>
          <span className="gwd-chip"><i>曜日</i>{dayLabel}</span>
          <span className="gwd-chip"><i>場所</i>{placeLabel}</span>
          <a href="#schedule">条件を変える</a>
        </p>
        <ul className="gwd-slots" data-gwd-pin="4" aria-label="クラス一覧">
          {classes.length === 0 && (
            <li className="gwd-empty">
              <p>この条件に合うクラスはありません。曜日や場所の条件をゆるめてみてください。</p>
              <button type="button" className="gwd-btn gwd-btn-line" onClick={onReset}>
                条件をクリアする
              </button>
            </li>
          )}
          {classes.map((slot) => {
            const visual = DEMO_CLASS_VISUALS[slot.id]
            const day = DEMO_DAY_FILTERS.find((d) => d.id === visual?.day)
            const { time, minutes } = splitTimeRange(slot.timeRange)
            const selected = selectedClassId === slot.id
            return (
              <li
                key={slot.id}
                className={`gwd-slot${selected ? " is-selected" : ""}`}
                data-testid={`class-card-${slot.id}`}
              >
                <div className="gwd-slot-ph">
                  {visual && (
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`${DEMO_IMAGE_BASE}/${visual.image}-320.avif 320w, ${DEMO_IMAGE_BASE}/${visual.image}-480.avif 480w`}
                        sizes="(max-width: 767px) 96px, 184px"
                      />
                      <img
                        src={`${DEMO_IMAGE_BASE}/${visual.image}-320.webp`}
                        srcSet={`${DEMO_IMAGE_BASE}/${visual.image}-320.webp 320w, ${DEMO_IMAGE_BASE}/${visual.image}-480.webp 480w`}
                        sizes="(max-width: 767px) 96px, 184px"
                        width={320}
                        height={240}
                        alt={visual.imageAlt}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  )}
                </div>
                <div className="gwd-when">
                  <b>
                    {day?.label}
                    <span className="gwd-num">{day?.en}</span>
                  </b>
                  <span className="gwd-num">{time}</span>
                  {minutes && <small>{minutes}</small>}
                </div>
                <div className="gwd-what">
                  <h3>{slot.name}</h3>
                  <span className="g">{slot.gradeLabel}</span>
                  <p>{slot.focusSummary}</p>
                </div>
                <div className="gwd-where">
                  <b>{visual?.campusShort}</b>
                  <span>{visual?.accessShort}</span>
                </div>
                <div className="gwd-seat">
                  <span className={`gwd-tag${slot.trialStatus === "few_left" ? " few" : ""}`}>
                    {slot.trialStatus === "few_left" ? "体験枠 残りわずか" : "体験受付中"}
                  </span>
                  <br />
                  定員{slot.capacity}名・{slot.coachRatio}
                </div>
                <div className="gwd-buy">
                  <span className="p">
                    <span className="gwd-num">{slot.monthlyFeeJpy.toLocaleString("ja-JP")}</span>
                    <small>円/月</small>
                  </span>
                  <span className="tx">税込・週1回</span>
                  <button
                    type="button"
                    className="gwd-btn gwd-btn-sun"
                    onClick={() => onSelectClassForTrial(slot)}
                    data-testid={`select-class-${slot.id}`}
                    aria-describedby={`slot-name-${slot.id}`}
                  >
                    このクラスで体験
                  </button>
                  <span id={`slot-name-${slot.id}`} className="gwd-sr">
                    {slot.name}（{slot.dayOfWeek} {slot.timeRange}）
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
        <p className="gwd-note">※空き状況はデモ表示です。写真はすべてイメージで、このスクールの活動写真ではありません。</p>
      </div>
    </section>
  )
}
