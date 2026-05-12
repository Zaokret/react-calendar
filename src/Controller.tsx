import { useState } from 'react';
import { DOW } from './time';

type Orientation = 'horizontal' | 'vertical';

export type HeatmapConfig = {
  start: Date;
  end: Date;
  color: string;
  orientation: Orientation;
  dowOffset: number;
  size: number;
  radius: number;
  dowSelected: boolean[];
}

function toInputDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function HeatmapControls({ config, onChange }: { config: HeatmapConfig, onChange?: (config: HeatmapConfig) => void; }) {
  const [start, setStart] = useState(toInputDate(config.start));
  const [end, setEnd] = useState(toInputDate(config.end));
  const [color, setColor] = useState(config.color);
  const [size, setSize] = useState(config.size)
  const [radius, setRadius] = useState(config.radius)
  const [orientation, setOrientation] =
    useState<Orientation>(config.orientation);
  const [dowOffset, setDowOffset] =
    useState<number>(config.dowOffset);

  const [dowSelected, setDowSelected] = useState<boolean[]>([true,true,true,true,true,true, true])

  function emit(next?: Partial<HeatmapConfig>) {
    const state = {
      dowSelected,
      size,
      start,
      end,
      color,
      orientation,
      dowOffset,
      radius,
      ...next,
    };

    onChange?.({
      start: new Date(state.start),
      end: new Date(state.end),
      color: state.color,
      orientation: state.orientation,
      dowOffset: state.dowOffset,
      size: state.size,
      radius: state.radius,
      dowSelected: state.dowSelected
    });
  }

  return (
    <div style={styles.wrapper}>
      {/* DATE RANGE */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Time Range</legend>

        <label style={styles.label}>
          <span>Start</span>

          <input
            type="date"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              emit({ start: new Date(e.target.value) });
            }}
          />
        </label>

        <label style={styles.label}>
          <span>End</span>

          <input
            type="date"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              emit({ end: new Date(e.target.value) });
            }}
          />
        </label>
      </fieldset>

      {/* COLOR */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Color</legend>

        <label style={styles.label}>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              emit({ color: e.target.value });
            }}
          />

          <span>{color}</span>
        </label>
      </fieldset>

      {/* RADIUS */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Border radius</legend>

        <label style={styles.label}>
          <input
            type="number"
            min="0"
            max="20"
            value={radius}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setRadius(val);
              emit({ radius: val });
            }}
          />

        </label>
      </fieldset>

      {/* SIZE */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Size</legend>

        <label style={styles.label}>
          <input
            type="number"
            min="5"
            max="100"
            value={size}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setSize(val);
              emit({ size: val });
            }}
          />

        </label>
      </fieldset>

      {/* ORIENTATION */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Orientation</legend>

        <label style={styles.inlineLabel}>
          <input
            type="radio"
            name="orientation"
            checked={orientation === 'horizontal'}
            onChange={() => {
              setOrientation('horizontal');
              emit({ orientation: 'horizontal' });
            }}
          />

          Horizontal
        </label>

        <label style={styles.inlineLabel}>
          <input
            type="radio"
            name="orientation"
            checked={orientation === 'vertical'}
            onChange={() => {
              setOrientation('vertical');
              emit({ orientation: 'vertical' });
            }}
          />

          Vertical
        </label>
      </fieldset>

      {/* DOW OFFSET */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>
          Day Of Week Offset
        </legend>

        <label style={styles.label}>
          <span>Offset</span>

          <input
            type="number"
            step={1}
            value={dowOffset}
            onChange={(e) => {
              const next = Number(e.target.value);

              setDowOffset(next);
              emit({ dowOffset: next });
            }}
          />
        </label>
      </fieldset>

      {/* Day of week */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>
          Day Of Week
        </legend>

        { new DOW(dowOffset).list.map((d, i) => {
          return (<label key={i} style={styles.inlineLabel}>
            <span style={{width: '3rem'}}>{d}</span>

            <input
              type="checkbox"
              checked={dowSelected[i]}
              onChange={(e) => {
                const checked = Boolean(e.target.checked);
                const nextArr = dowSelected.map((_, ii) => ii === i ? checked : _)
                setDowSelected(nextArr)
                emit({ dowSelected: nextArr })
              }}
            />
          </label>
          )
        }) }

      </fieldset>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    height: '20rem',
    display: 'grid',
    gap: '1rem',
    padding: '1rem',
    width: 'max-content',
    fontFamily: 'system-ui',
  },

  fieldset: {
    display: 'grid',
    gap: '0.75rem',
    padding: '1rem',
    border: '1px solid #d0d0d0',
    borderRadius: '0.75rem',
  },

  legend: {
    padding: '0 0.5rem',
    fontWeight: 600,
  },

  label: {
    display: 'grid',
    gap: '0.4rem',
  },

  inlineLabel: {
    display: 'flex',
    alignItems: 'normal',
    gap: '0.5rem',
  },
};