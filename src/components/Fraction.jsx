// Fraction — renders a fraction vertically with a colored bar
export default function Fraction({ numerator, denominator, variant = 'a', size = 'md' }) {
  const sizeMap = {
    sm: { num: '1.3rem', denom: '1.3rem', bar: '24px', gap: '2px' },
    md: { num: '1.8rem', denom: '1.8rem', bar: '32px', gap: '3px' },
    lg: { num: '2.4rem', denom: '2.4rem', bar: '42px', gap: '4px' },
    xl: { num: '3rem', denom: '3rem', bar: '54px', gap: '5px' },
  }

  const s = sizeMap[size] || sizeMap.md
  const barColor = variant === 'a' ? 'var(--color-fraction-a)' : 'var(--color-fraction-b)'
  const textColor = variant === 'a' ? 'var(--color-fraction-a)' : 'var(--color-fraction-b)'

  return (
    <span
      className="fraction"
      style={{ gap: s.gap, color: textColor }}
      aria-label={`${numerator} over ${denominator}`}
    >
      <span style={{ fontSize: s.num, fontFamily: 'var(--font-display)', fontWeight: 900 }}>
        {numerator}
      </span>
      <span
        className="fraction-bar"
        style={{
          background: barColor,
          minWidth: s.bar,
          height: '3px',
        }}
      />
      <span style={{ fontSize: s.denom, fontFamily: 'var(--font-display)', fontWeight: 900 }}>
        {denominator}
      </span>
    </span>
  )
}
