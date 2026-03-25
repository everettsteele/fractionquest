import { useState, useEffect, useRef } from 'react'

const COLORS = {
  a: '#2563EB',
  aLight: '#DBEAFE',
  b: '#EA580C',
  bLight: '#FFEDD5',
  axis: '#C4C1E8',
  tick: '#8B88B0',
  label: '#4A4580',
}

/**
 * NumberLine — SVG-based fraction comparison visualization.
 *
 * Props:
 *   fractionA  { numerator, denominator } | null
 *   fractionB  { numerator, denominator } | null
 *   showBoth   boolean — show both fractions at once
 *   animate    boolean — animate markers into position
 *   labelA     string — custom label for fraction A (default: 'A')
 *   labelB     string — custom label for fraction B (default: 'B')
 *   width      number — override SVG width
 *   showHalf   boolean — highlight 1/2 on the number line
 *   markers    array of { fraction, color, label } for additional points
 */
export default function NumberLine({
  fractionA = null,
  fractionB = null,
  showBoth = true,
  animate = true,
  labelA = null,
  labelB = null,
  width = null,
  showHalf = false,
  markers = [],
}) {
  const svgRef = useRef(null)
  const [animatedA, setAnimatedA] = useState(false)
  const [animatedB, setAnimatedB] = useState(false)
  const [svgWidth, setSvgWidth] = useState(width || 680)

  useEffect(() => {
    const updateWidth = () => {
      if (svgRef.current) {
        setSvgWidth(svgRef.current.parentElement?.clientWidth || 680)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    if (!animate) {
      setAnimatedA(true)
      setAnimatedB(true)
      return
    }
    setAnimatedA(false)
    setAnimatedB(false)
    const t1 = setTimeout(() => setAnimatedA(true), 200)
    const t2 = setTimeout(() => setAnimatedB(true), showBoth ? 600 : 200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [fractionA, fractionB, animate, showBoth])

  const height = 120
  const padL = 44
  const padR = 44
  const axisY = height / 2 + 10
  const lineWidth = svgWidth - padL - padR

  function xForValue(val) {
    return padL + val * lineWidth
  }

  // Determine which tick intervals to show based on fractions
  function getTickIntervals() {
    const denoms = []
    if (fractionA) denoms.push(fractionA.denominator)
    if (fractionB) denoms.push(fractionB.denominator)
    markers.forEach(m => denoms.push(m.fraction.denominator))

    // Always show halves; add specific denominators
    const intervals = new Set([2])
    denoms.forEach(d => {
      if (d <= 12) intervals.add(d)
    })

    return [...intervals]
  }

  function renderTicks() {
    const intervals = getTickIntervals()
    const allTicks = new Set()

    intervals.forEach(d => {
      for (let n = 0; n <= d; n++) {
        allTicks.add(n / d)
      }
    })

    return [...allTicks]
      .sort((a, b) => a - b)
      .map((val, i) => {
        const x = xForValue(val)
        const isEndpoint = val === 0 || val === 1
        const isHalf = Math.abs(val - 0.5) < 0.001
        const tickH = isEndpoint ? 14 : isHalf ? 11 : 7

        return (
          <g key={`tick-${i}`}>
            <line
              x1={x} y1={axisY - tickH}
              x2={x} y2={axisY + tickH}
              stroke={isHalf && showHalf ? '#4F46E5' : COLORS.tick}
              strokeWidth={isEndpoint ? 2.5 : isHalf ? 2 : 1}
              opacity={isEndpoint ? 1 : 0.55}
            />
            {(isEndpoint || isHalf) && (
              <text
                x={x}
                y={axisY + tickH + 16}
                textAnchor="middle"
                fontSize="13"
                fill={isHalf && showHalf ? '#4F46E5' : COLORS.label}
                fontFamily="'Nunito', sans-serif"
                fontWeight={isHalf && showHalf ? '800' : '600'}
              >
                {isEndpoint ? val : '½'}
              </text>
            )}
          </g>
        )
      })
  }

  function renderFractionMarker(fraction, color, colorLight, visible, label) {
    if (!fraction || !visible) return null
    const val = fraction.numerator / fraction.denominator
    const x = xForValue(val)
    const fStr = `${fraction.numerator}/${fraction.denominator}`
    const displayLabel = label || fStr
    const isCircle = color === COLORS.a

    return (
      <g
        style={{
          transition: visible ? 'opacity 0.4s ease, transform 0.4s ease' : 'none',
          opacity: visible ? 1 : 0,
          transformOrigin: `${x}px ${axisY}px`,
          transform: visible ? 'scale(1)' : 'scale(0.5)',
        }}
        role="graphics-symbol"
        aria-label={`Fraction ${fStr} at position ${val.toFixed(2)} on the number line`}
      >
        {/* Drop line from marker to axis */}
        <line
          x1={x} y1={axisY - 28}
          x2={x} y2={axisY - 2}
          stroke={color}
          strokeWidth="2"
          strokeDasharray="3,3"
          opacity="0.5"
        />
        {/* Marker shape: circle for A, diamond for B (colorblind safe) */}
        {isCircle ? (
          <circle
            cx={x} cy={axisY - 36}
            r="18"
            fill={color}
            stroke="white"
            strokeWidth="2.5"
          />
        ) : (
          <polygon
            points={`${x},${axisY - 54} ${x + 18},${axisY - 36} ${x},${axisY - 18} ${x - 18},${axisY - 36}`}
            fill={color}
            stroke="white"
            strokeWidth="2.5"
          />
        )}
        {/* Fraction label inside marker */}
        <text
          x={x}
          y={axisY - (isCircle ? 32 : 33)}
          textAnchor="middle"
          fontSize="11"
          fill="white"
          fontFamily="'Nunito', sans-serif"
          fontWeight="900"
          letterSpacing="-0.3"
        >
          {fStr}
        </text>
        {/* A/B badge label below */}
        <text
          x={x}
          y={axisY + 28}
          textAnchor="middle"
          fontSize="13"
          fill={color}
          fontFamily="'Nunito', sans-serif"
          fontWeight="800"
        >
          {displayLabel}
        </text>
        {/* Axis dot */}
        <circle cx={x} cy={axisY} r="4" fill={color} />
      </g>
    )
  }

  function renderHalfLine() {
    if (!showHalf) return null
    const x = xForValue(0.5)
    return (
      <line
        x1={x} y1={axisY - 55}
        x2={x} y2={axisY + 4}
        stroke="#4F46E5"
        strokeWidth="1.5"
        strokeDasharray="4,3"
        opacity="0.4"
      />
    )
  }

  const aLabel = labelA || (fractionA ? `${fractionA.numerator}/${fractionA.denominator}` : null)
  const bLabel = labelB || (fractionB ? `${fractionB.numerator}/${fractionB.denominator}` : null)

  return (
    <div style={{ width: '100%' }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${svgWidth} ${height}`}
        aria-label={[
          'Number line from 0 to 1.',
          fractionA && animatedA ? `Fraction ${fractionA.numerator}/${fractionA.denominator} is marked at approximately ${(fractionA.numerator/fractionA.denominator).toFixed(2)}.` : '',
          fractionB && animatedB ? `Fraction ${fractionB.numerator}/${fractionB.denominator} is marked at approximately ${(fractionB.numerator/fractionB.denominator).toFixed(2)}.` : '',
        ].join(' ')}
        role="img"
        style={{ overflow: 'visible', display: 'block' }}
      >
        {/* Axis line */}
        <line
          x1={padL} y1={axisY}
          x2={padL + lineWidth} y2={axisY}
          stroke={COLORS.axis}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Arrow caps */}
        <polygon
          points={`${padL + lineWidth},${axisY} ${padL + lineWidth - 10},${axisY - 5} ${padL + lineWidth - 10},${axisY + 5}`}
          fill={COLORS.axis}
        />

        {/* 1/2 reference line */}
        {renderHalfLine()}

        {/* Ticks */}
        {renderTicks()}

        {/* Fraction markers */}
        {renderFractionMarker(fractionA, COLORS.a, COLORS.aLight, animatedA, aLabel)}
        {showBoth && renderFractionMarker(fractionB, COLORS.b, COLORS.bLight, animatedB, bLabel)}

        {/* Additional custom markers */}
        {markers.map((m, i) => {
          const color = m.color || '#7C3AED'
          const val = m.fraction.numerator / m.fraction.denominator
          const x = xForValue(val)
          return (
            <g key={`marker-extra-${i}`}>
              <circle cx={x} cy={axisY} r="5" fill={color} />
              {m.label && (
                <text
                  x={x} y={axisY - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fill={color}
                  fontFamily="'Nunito', sans-serif"
                  fontWeight="700"
                >
                  {m.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
