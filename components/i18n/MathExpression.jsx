/**
 * Keep math expressions LTR inside any surrounding direction.
 */
export default function MathExpression({ children, className = "" }) {
  return (
    <span dir="ltr" className={className ? `math-expression ${className}` : "math-expression"}>
      {children}
    </span>
  );
}
