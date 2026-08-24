// The cheap CSS stand-in for BrainFieldScene, used on reduced-motion and
// low-power/small-touch devices (see BrainField). Same restraint, just
// static geometry instead of a shader: one soft low-contrast flow layer.
// No bright shapes, no rings, no stars — atmosphere, not content, sitting
// behind the wall (z-index 0, pointer-events none).
export default function AmbientBackground() {
  return (
    <div className="brain-ambient" aria-hidden="true">
      <div className="ambient-flow" />
    </div>
  );
}
