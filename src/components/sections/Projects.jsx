import { useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import projects from "../../data/projects";
import useMediaQuery, {
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";

/**
 * Scroll cost of moving from one project to the next, in vh. The section is
 * (count - 1) * this + 100vh tall, so it's the single knob for how fast the
 * arcs play against the wheel. At 200 with five projects the section runs
 * 900vh — lower this first if the page ever feels too long.
 */
const VH_PER_PROJECT = 200;

/**
 * How many points each half of the arc is sampled at. sampleAt interpolates
 * linearly between keyframes, so a three-point "arc" is really two straight
 * segments meeting at a corner. Sampling the curve densely is what actually
 * makes the path round.
 */
const ARC_STEPS = 24;

/**
 * The card itself — identical in the scroll-driven and reduced-motion paths.
 * `flipped` alternates which column the text sits in, `compact` shrinks the
 * image so a stacked mobile card still fits one viewport.
 */
function ProjectCard({ project, flipped, compact }) {
  // Mobile clamps the description to keep the card inside one viewport. The
  // toggle is what stops that from silently hiding content — before this,
  // phone visitors could not read the full text of any project.
  const [expanded, setExpanded] = useState(false);
  // `compact` is the pinned layout on a phone, where the card has to survive a
  // single viewport alongside the heading. Descriptions run to 13 lines on the
  // longest project, so they get clamped rather than clipped — the static
  // fallback passes compact={false} and shows them in full.
  const imageClass = `h-auto w-full object-cover ${
    compact ? "max-h-[120px]" : "max-h-[320px]"
  }`;

  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-2 md:gap-16">
      {/* Text side */}
      <div className={`relative ${flipped ? "md:order-2" : "md:order-1"}`}>
        <div className="relative">
          {/* Accent rule above the title. The index that used to sit here is
              gone with the rest of the numbering — the rail already shows
              which project you're on. */}
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[#f97316] via-[#f97316]/40 to-transparent md:mb-3" />

          <h3 className="mb-2 bg-gradient-to-r from-white via-white to-[#f97316] bg-clip-text text-xl font-bold text-transparent md:text-3xl">
            {project.name}
          </h3>
          <p className="mb-2 font-mono text-xs tracking-wider text-[#9ca3af] md:mb-4">
            {project.date}
          </p>
          {/* Expanded text scrolls inside the card rather than growing it.
              The card is pinned to one viewport on mobile, so letting it grow
              pushed ~30px off both the top and the bottom. */}
          <p
            className={`mb-2 text-sm leading-relaxed text-[#e5e5e5]/75 md:mb-6 md:text-base ${
              compact
                ? expanded
                  ? "max-h-[20vh] overflow-y-auto pr-1"
                  : "line-clamp-5"
                : ""
            }`}
          >
            {project.description}
          </p>
          {compact && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mb-3 text-xs font-medium text-[#f97316] underline underline-offset-2"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}

          {/* The résumé page already renders these bullets; the main page only
              ever showed the one-line description, so the more detailed
              version lived on the page fewer people visit. */}
          {!compact && project.bullets?.length > 0 && (
            <ul className="mb-6 hidden space-y-1.5 lg:block">
              {project.bullets.slice(0, 3).map((b) => (
                <li
                  key={b}
                  className="flex gap-2 text-sm leading-relaxed text-[#e5e5e5]/60"
                >
                  <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-[#f97316]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tech stack pills */}
          <div className="mb-3 flex flex-wrap gap-2 md:mb-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#f97316]/30 bg-[#f97316]/[0.07] px-3 py-1 text-xs text-[#f97316] backdrop-blur-sm transition-colors duration-300 hover:border-[#f97316]/60 hover:bg-[#f97316]/[0.14]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2 text-sm text-[#e5e5e5]/70 transition-colors duration-300 hover:text-[#f97316]"
                aria-label={`View source code for ${project.name}`}
              >
                <FaGithub />
                <span>Source</span>
                <FiArrowUpRight className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            )}
            {project.deployed && (
              <a
                href={project.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2 text-sm text-[#f97316] transition-colors duration-300 hover:text-[#fb923c]"
                aria-label={`Open ${project.name} live site`}
              >
                <span>Live</span>
                <FiArrowUpRight className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Image side — a hairline gradient frame lifts it off the 3D backdrop. */}
      <div className={flipped ? "md:order-1" : "md:order-2"}>
        <div className="rounded-2xl bg-gradient-to-br from-[#f97316]/50 via-[#2a2a2a] to-[#f97316]/15 p-px shadow-[0_25px_70px_-25px_rgba(249,115,22,0.45)]">
          {project.deployed ? (
            <a
              href={project.deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl bg-[#0a0a0a]"
              aria-label={`Go to ${project.name} live project`}
            >
              <img
                src={project.image}
                alt={project.name}
                className={`${imageClass} transition-transform duration-500 group-hover:scale-105`}
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-2 text-lg font-semibold text-white">
                  Go to Project <FiExternalLink />
                </span>
              </div>
            </a>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-[#0a0a0a]">
              <img
                src={project.image}
                alt={project.name}
                className={imageClass}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Piecewise-linear interpolation, clamped outside the range.
 *
 * Every panel value goes through this as a single-argument transform rather
 * than useTransform's (range, outputs) form, and that is deliberate: the
 * keyframe form lets framer-motion hand the property to a native
 * ScrollTimeline, which measures a different range than useScroll's
 * target/offset reports in JS. Only some properties get accelerated — the four
 * transform values compose into one string and stay in JS — so the two paths
 * drift apart and opacity ends up describing a different card than the one it
 * is painting. A function transform can't be compiled to keyframes, so
 * everything stays on one clock.
 *
 * Keeping it in JS also means the range is free to run outside [0,1], which
 * the Web Animations API rejects outright and which the first card's entry and
 * the last card's exit both need.
 */
function sampleAt(range, outputs, t) {
  const last = range.length - 1;
  if (t <= range[0]) return outputs[0];
  if (t >= range[last]) return outputs[last];

  for (let i = 0; i < last; i++) {
    const a = range[i];
    const b = range[i + 1];
    if (t >= a && t <= b) {
      const f = b === a ? 0 : (t - a) / (b - a);
      return outputs[i] + (outputs[i + 1] - outputs[i]) * f;
    }
  }
  return outputs[last];
}

/**
 * Samples one project's full journey as a real curve.
 *
 * The path is a half-ellipse, swept by angle rather than picked by hand:
 *
 *     x = side * reach * sin(theta)
 *     y =  dir * lift  * (1 - cos(theta)) / 2
 *
 * which satisfies (x/reach)^2 + ((y -+ lift/2)/(lift/2))^2 = 1 — so as theta
 * runs 0 -> PI the card leaves centre, bulges all the way out to `reach` at
 * half height, and curves back over the top. A genuine arc, not a bent line.
 *
 * Everything else is driven off the same angle so the whole card agrees with
 * itself: it banks into the turn at peak swing, shrinks and blurs as it climbs
 * away, and fades on a cosine so it stays legible through the interesting part
 * of the curve instead of vanishing immediately.
 */
function buildArc(w, opts) {
  const { side, reach, lift, maxRot, shrink, maxBlur } = opts;
  const range = [];
  const x = [];
  const y = [];
  const rot = [];
  const scale = [];
  const op = [];
  const blur = [];

  const push = (p, theta, dir) => {
    const s = Math.sin(theta);
    const c = Math.cos(theta);
    const climb = (1 - c) / 2; // 0 at centre, 1 at the far end of the arc
    range.push(p);
    x.push(side * reach * s);
    y.push(dir * lift * climb);
    rot.push(side * maxRot * s);
    scale.push(1 - shrink * climb);
    op.push((1 + c) / 2);
    blur.push(maxBlur * climb);
  };

  // Rising into place: theta PI -> 0, from below.
  for (let i = 0; i <= ARC_STEPS; i++) {
    const u = i / ARC_STEPS;
    push(w.inStart + u * (w.settleIn - w.inStart), Math.PI * (1 - u), 1);
  }
  // Held still while the project is being read.
  push(w.settleOut, 0, 1);
  // Thrown back out: theta 0 -> PI, upward.
  for (let i = 1; i <= ARC_STEPS; i++) {
    const u = i / ARC_STEPS;
    push(w.settleOut + u * (w.outEnd - w.settleOut), Math.PI * u, -1);
  }

  return { range, x, y, rot, scale, op, blur };
}

/** Progress breakpoints for one project's slot on the track. */
function windowFor(index, count) {
  const gap = count > 1 ? 1 / (count - 1) : 1;
  const rest = index * gap;
  const hold = gap * 0.15; // half-width of the settled plateau
  const travel = gap * 0.75; // scroll span of a single arc

  return {
    rest,
    inStart: rest - travel,
    settleIn: rest - hold,
    settleOut: rest + hold,
    outEnd: rest + travel,
  };
}

/**
 * One project in the pinned stack. Every pixel of motion is a pure function of
 * `progress`, which is why scrolling back up replays the arc in reverse with
 * no state to keep in sync.
 */
function ProjectPanel({ project, index, count, progress, compact }) {
  // The card arcs toward the side its own text column sits on, so the motion
  // reads as an extension of the alternating layout rather than a separate rule.
  const flipped = index % 2 === 1;

  // Sampling the curve is pure maths over ~50 points, so it only needs redoing
  // when the slot or the breakpoint changes — not on every scroll frame.
  const { w, kf } = useMemo(() => {
    const win = windowFor(index, count);
    return {
      w: win,
      kf: buildArc(win, {
        side: index % 2 === 1 ? 1 : -1,
        // Reach is the widest point of the swing, lift the total climb. Both
        // are generous now: a timid arc just looks like a wobble.
        reach: compact ? 130 : 300,
        lift: compact ? 340 : 560,
        maxRot: compact ? 6 : 10,
        shrink: 0.22,
        // A full-card blur repainting every frame is the most expensive thing
        // here and buys the least on a small screen.
        maxBlur: compact ? 0 : 6,
      }),
    };
  }, [index, count, compact]);

  // Ranges running outside [0,1] are intentional: the first card starts already
  // settled and the last one never arcs away, because their entry and exit
  // keyframes fall off the ends of the track and clamp.
  const x = useTransform(progress, (v) => sampleAt(kf.range, kf.x, v));
  const y = useTransform(progress, (v) => sampleAt(kf.range, kf.y, v));
  const rotate = useTransform(progress, (v) => sampleAt(kf.range, kf.rot, v));
  const scale = useTransform(progress, (v) => sampleAt(kf.range, kf.scale, v));
  const opacity = useTransform(progress, (v) => sampleAt(kf.range, kf.op, v));
  const filter = useTransform(
    progress,
    (v) => `blur(${sampleAt(kf.range, kf.blur, v).toFixed(2)}px)`,
  );

  // The panels are stacked on top of each other, so faded-out cards would
  // otherwise swallow clicks and hold tab stops. `visibility: hidden` also
  // drops them out of the accessibility tree.
  //
  // Both read `progress` directly rather than chaining off `opacity`: a
  // string-valued transform can't be handed to the native scroll timeline, and
  // subscribing one to `opacity` desynced opacity's own DOM updates from the
  // transforms.
  const pointerEvents = useTransform(progress, (v) =>
    v >= w.settleIn && v <= w.settleOut ? "auto" : "none",
  );
  const visibility = useTransform(progress, (v) =>
    v > w.inStart && v < w.outEnd ? "visible" : "hidden",
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        pointerEvents,
        visibility,
      }}
      className="absolute inset-0 flex items-center will-change-transform"
    >
      {/* The padding lives here, not on the parent: these panels are inset-0
          absolute, so they resolve against the padding box and a pl on the
          container would not move them off the rail. */}
      <div className="w-full pl-7 md:pl-0">
        <ProjectCard
          project={project}
          flipped={flipped}
          compact={compact}
        />
      </div>
    </motion.div>
  );
}

/**
 * A station on the rail. Sits at its project's resting position, so the
 * traveller lands exactly on it at the moment that project settles.
 */
function Station({ index, count, name, active, passed, onJump }) {
  const top = count > 1 ? (index / (count - 1)) * 100 : 50;

  return (
    <button
      type="button"
      onClick={() => onJump(index)}
      style={{ top: `${top}%` }}
      className="group pointer-events-auto absolute left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      aria-label={`Go to project ${index + 1}: ${name}`}
      aria-current={active ? "true" : undefined}
    >
      {/* Halo, only while this project holds the screen. */}
      {active && (
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-[#f97316]/40" />
      )}
      <span
        className={`absolute rounded-full transition-all duration-500 ${
          active
            ? "h-3.5 w-3.5 bg-[#f97316] shadow-[0_0_18px_5px_rgba(249,115,22,0.55)]"
            : passed
              ? "h-2 w-2 bg-[#f97316]/70"
              : "h-2 w-2 bg-[#0a0a0a] ring-1 ring-[#2a2a2a] group-hover:ring-[#f97316]/70"
        }`}
      />
    </button>
  );
}

/**
 * The rail the projects travel along: a dim track that fills with light as you
 * descend, stations at each project, and a glowing traveller that rides the
 * fill. On phones it moves to the left edge so it never crosses the copy.
 */
function Rail({ progress, count, active, onJump }) {
  // scaleY on a full-height bar rather than an animated height, so the fill
  // stays on the compositor instead of relayouting every frame.
  const fill = useTransform(progress, (v) => v);
  const travellerTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 z-0 w-px md:left-1/2">
      {/* Dim track, faded at both ends so it reads as infinite rather than cut. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2a2a2a] to-transparent" />

      {/* Travelled portion, plus a blurred copy underneath for the glow. */}
      <motion.div
        style={{ scaleY: fill }}
        className="absolute inset-0 origin-top bg-gradient-to-b from-[#f97316]/0 via-[#f97316] to-[#fb923c]"
      />
      <motion.div
        style={{ scaleY: fill }}
        className="absolute inset-0 origin-top bg-[#f97316] opacity-60 blur-[4px]"
      />

      {projects.map((project, i) => (
        <Station
          key={project.id}
          index={i}
          count={count}
          name={project.name}
          active={i === active}
          passed={i < active}
          onJump={onJump}
        />
      ))}

      {/* The traveller — reaches each station exactly as its project settles. */}
      <motion.div
        style={{ top: travellerTop }}
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_8px_rgba(249,115,22,0.6)]"
      />
    </div>
  );
}

const heading = (
  <>
    <p className="mb-3 font-mono text-[0.65rem] tracking-[0.4em] text-[#f97316]/80">
      SELECTED WORK
    </p>
    <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
      Featured <span className="text-[#f97316]">Projects</span>
    </h2>
    <p className="text-[#9ca3af]">Things I've built and worked on</p>
  </>
);

/**
 * Falls back to a plain scrollable stack when the visitor has asked the OS to
 * reduce motion — no pinning, no transforms, every project in normal flow.
 */
function StaticProjects() {
  return (
    <section id="projects" className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">{heading}</div>
        {/* The rail becomes a plain divider here: no scroll-linked fill to ride. */}
        <div className="relative space-y-24 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-px md:before:bg-gradient-to-b md:before:from-transparent md:before:via-[#2a2a2a] md:before:to-transparent">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              flipped={i % 2 === 1}
              compact={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Projects() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const compact = !useMediaQuery("(min-width: 768px)");

  // "start start" -> "end end" spans exactly the window where the inner panel
  // is pinned, so the card is physically stationary the whole time and nothing
  // doubles up with natural document flow.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const count = projects.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.round(v * (count - 1)));
  });

  // Each station is one VH_PER_PROJECT step down the track from the section top.
  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const top =
      track.getBoundingClientRect().top +
      window.scrollY +
      (i * VH_PER_PROJECT * window.innerHeight) / 100;
    window.scrollTo({ top });
  };

  if (reducedMotion) return <StaticProjects />;

  return (
    <section
      id="projects"
      ref={trackRef}
      className="relative z-10"
      style={{ height: `${(count - 1) * VH_PER_PROJECT + 100}vh` }}
    >
      {/* overflow-x-clip contains the sideways arc without making this a
          scroll container, which would break its own stickiness. */}
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-x-clip px-6 py-6 md:py-16">
        <div className="mb-4 shrink-0 text-center md:mb-10">{heading}</div>

        <div className="relative mx-auto w-full max-w-7xl flex-1">
          <Rail
            progress={scrollYProgress}
            count={count}
            active={active}
            onJump={goTo}
          />
          {projects.map((project, i) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={i}
              count={count}
              progress={scrollYProgress}
              compact={compact}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
