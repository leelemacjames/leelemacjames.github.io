import { useState, useEffect, useCallback } from "react";

const BG = "#0c0d10";
const GOLD = "#c8a96e";
const HL_RED = "#c0392b";
const SURFACE = "#13141a";
const BORDER = "#1e2028";
const TEXT = "#d4d0c8";
const MUTED = "#6b6860";
const WHITE = "#f0ede6";

// ── data ─────────────────────────────────────────────────────────────────────
const TERMS = [
  // A
  { term: "Absolute Magnitude", symbol: "M", unit: "dimensionless", hl: false,
    keywords: ["intrinsic brightness", "parsec standard", "stellar luminosity"],
    synonyms: ["intrinsic magnitude"], antonyms: ["Apparent Magnitude"],
    context: "A star's absolute magnitude M tells you how bright it would appear at exactly 10 parsecs — stripping away distance to reveal true luminosity.",
    full: "The apparent magnitude a celestial object would have if placed at 10 parsecs from Earth. Because it removes distance as a variable, it is a true measure of intrinsic brightness. Linked to luminosity via the distance modulus m − M = 5 log(d/10)." },

  { term: "Absolute Zero", symbol: "0 K", unit: "K", hl: false,
    keywords: ["−273.15 °C", "zero pressure", "minimum thermal energy"],
    synonyms: ["0 K"], antonyms: ["high temperature limit"],
    context: "At absolute zero a gas would exert no pressure — molecules have ceased all translational motion, reaching the lowest possible internal energy.",
    full: "The temperature at which an ideal gas would exert zero pressure and molecules possess minimum possible energy. Defined as 0 K (−273.15 °C). Unattainable in practice (third law of thermodynamics), but approached asymptotically in cryogenic experiments." },

  { term: "Absorbed Dose", symbol: "D", unit: "Gy (J kg⁻¹)", hl: true,
    keywords: ["ionising radiation", "energy per mass", "gray"],
    synonyms: ["radiation dose"], antonyms: ["dose equivalent (which weights by quality factor)"],
    context: "A radiographer reports an absorbed dose of 2 mGy to tissue — 2 millijoules of radiation energy deposited per kilogram of that tissue.",
    full: "Total energy deposited by ionising radiation per unit mass of tissue. D = E/m, measured in gray (Gy = J kg⁻¹). Does not account for biological effectiveness — that requires multiplication by the quality factor to give dose equivalent (Sv). HL only." },

  { term: "Acceleration", symbol: "a", unit: "m s⁻²", hl: false,
    keywords: ["rate of velocity change", "vector", "Newton's 2nd law"],
    synonyms: ["rate of change of velocity"], antonyms: ["deceleration (negative acceleration)", "uniform velocity"],
    context: "A car accelerates at 3 m s⁻² — its velocity increases by 3 metres per second every second in the direction of the net force.",
    full: "The rate of change of velocity with respect to time: a = Δv/Δt. A vector quantity — direction matters. Newton's second law connects it to force: F = ma. Includes any change in speed or direction, so circular motion involves centripetal acceleration even at constant speed." },

  { term: "Accuracy", symbol: "—", unit: "—", hl: false,
    keywords: ["closeness to true value", "systematic error", "correctness"],
    synonyms: ["correctness", "trueness"], antonyms: ["precision (repeatability, not closeness to truth)", "inaccuracy"],
    context: "A balance that always reads 0.5 g too high is precise but not accurate — its readings cluster tightly but miss the true value.",
    full: "An indication of how close a measurement is to the accepted (true) value. Distinct from precision (agreement among repeated measurements). Accuracy is degraded by systematic errors; precision by random uncertainties. Improving accuracy requires finding and removing systematic bias." },

  { term: "Acoustic Impedance", symbol: "Z", unit: "kg m⁻² s⁻¹", hl: true,
    keywords: ["density × speed of sound", "ultrasound reflection", "impedance matching"],
    synonyms: ["specific acoustic impedance"], antonyms: ["acoustic transparency (matched impedance)"],
    context: "Ultrasound gel is used in medical scanning to match acoustic impedance between the transducer and skin — without it, nearly all sound reflects at the interface.",
    full: "Z = ρv, the product of a medium's density ρ and the speed of sound v in it. Governs what fraction of a sound wave is reflected at a boundary: large impedance mismatch → strong reflection. Critical in medical ultrasound (gel minimises mismatch) and materials testing. HL only." },

  { term: "Activity", symbol: "A", unit: "Bq (s⁻¹)", hl: false,
    keywords: ["decay rate", "becquerel", "disintegrations per second"],
    synonyms: ["decay rate", "disintegration rate"], antonyms: ["stability (zero activity)"],
    context: "A sample with activity 1000 Bq undergoes 1000 nuclear disintegrations every second — each one releasing a particle or gamma ray.",
    full: "The number of radioactive disintegrations per unit time: A = λN, where λ is the decay constant and N the number of undecayed nuclei. Measured in becquerel (1 Bq = 1 decay s⁻¹). Activity decays exponentially: A = A₀e^(−λt). Halves every half-life T½." },

  { term: "Albedo", symbol: "α", unit: "dimensionless (0–1)", hl: false,
    keywords: ["reflectivity", "fraction reflected", "climate"],
    synonyms: ["reflectance", "reflectivity"], antonyms: ["absorptivity (1 − albedo for a black body)"],
    context: "Fresh snow has albedo ≈ 0.9 — it reflects 90% of incoming solar radiation; the ocean's albedo is only ~0.06, absorbing most sunlight.",
    full: "Fraction of total incoming solar radiation reflected by a planetary body. α = P_reflected / P_received. Earth's global mean ≈ 0.30. High albedo (ice, cloud) cools climate; low albedo (ocean, dark soil) warms it. Central to energy-balance climate models." },

  { term: "Alpha Particle", symbol: "α", unit: "—", hl: false,
    keywords: ["helium nucleus", "2 protons 2 neutrons", "ionising"],
    synonyms: ["helium-4 nucleus"], antonyms: ["beta particle", "gamma photon"],
    context: "An alpha particle fired at gold foil in Geiger–Marsden's experiment occasionally bounced straight back — revealing the existence of a tiny, dense nucleus.",
    full: "A helium-4 nucleus: 2 protons + 2 neutrons, charge +2e, mass ≈ 4 u. Highly ionising but stopped by a few centimetres of air or a sheet of paper. Emitted in alpha decay: ²³⁸U → ²³⁴Th + α. Kinetic energy typically 4–9 MeV." },

  { term: "Amplitude", symbol: "A", unit: "m", hl: false,
    keywords: ["maximum displacement", "peak", "wave height"],
    synonyms: ["peak displacement"], antonyms: ["node (zero displacement in standing wave)"],
    context: "Doubling a wave's amplitude quadruples its intensity — a concert hall speaker driven at twice the amplitude delivers four times the sound power per unit area.",
    full: "Maximum displacement of a particle from its equilibrium position. For a wave, intensity ∝ A². In SHM, amplitude determines total mechanical energy: E = ½mω²A². Measured in metres for mechanical waves; in volts for EM waves (electric field amplitude)." },

  { term: "Angular Acceleration", symbol: "α", unit: "rad s⁻²", hl: true,
    keywords: ["rate of angular velocity change", "rotational analogue of acceleration", "torque"],
    synonyms: ["rotational acceleration"], antonyms: ["constant angular velocity (zero α)"],
    context: "When a figure skater pulls in their arms, a torque-free conservation of angular momentum causes angular speed to increase — internal forces produce no net α yet ω grows.",
    full: "Rate of change of angular velocity: α = dω/dt. Rotational analogue of linear acceleration. Related to torque by τ = Iα (Newton's 2nd law for rotation). Units rad s⁻². HL only." },

  { term: "Angular Momentum", symbol: "L", unit: "kg m² s⁻¹", hl: true,
    keywords: ["L = Iω", "rotational momentum", "conserved quantity"],
    synonyms: ["rotational momentum"], antonyms: ["linear momentum (translational)"],
    context: "A spinning neutron star conserves angular momentum as its core collapses — shrinking radius drives up rotational speed to hundreds of revolutions per second.",
    full: "L = Iω for a rigid body, or L = r × p for a particle. Conserved when net external torque is zero. Explains why spinning tops resist toppling, why planetary orbits are stable, and why collapsing stars become pulsars. HL only." },

  { term: "Angular Speed", symbol: "ω", unit: "rad s⁻¹", hl: false,
    keywords: ["radians per second", "ω = 2πf", "rotational speed"],
    synonyms: ["angular velocity (when direction specified)", "angular frequency"], antonyms: ["linear speed (tangential)"],
    context: "Earth's angular speed is 2π/86400 ≈ 7.3 × 10⁻⁵ rad s⁻¹ — the same for every point on its surface, though tangential speed varies with latitude.",
    full: "Rate of change of angular displacement: ω = dθ/dt = 2πf = 2π/T. Every point on a rotating rigid body shares the same ω; tangential speed v = rω differs with radius. Connects to SHM: the 'ω' in x = A sin(ωt) is this angular frequency." },

  // B
  { term: "Binding Energy", symbol: "BE", unit: "J or MeV", hl: false,
    keywords: ["mass defect", "nuclear stability", "energy to separate nucleus"],
    synonyms: ["nuclear binding energy"], antonyms: ["mass defect energy (same concept, dual framing)"],
    context: "Iron-56 sits at the peak of the binding-energy-per-nucleon curve — neither fission nor fusion releases energy from it, making it the 'dead end' of stellar nucleosynthesis.",
    full: "Energy released when a nucleus is assembled from its constituent nucleons, equivalently the energy required to completely separate it. BE = Δmc² where Δm is the mass defect. Binding energy per nucleon peaks near Fe-56 (~8.8 MeV); fission and fusion both move nuclei toward this peak." },

  // C
  { term: "Centripetal Acceleration", symbol: "ac", unit: "m s⁻²", hl: false,
    keywords: ["centre-seeking", "a = v²/r", "circular motion"],
    synonyms: ["radial acceleration", "centre-seeking acceleration"], antonyms: ["tangential acceleration (along the path)"],
    context: "The Moon's centripetal acceleration (~2.7 × 10⁻³ m s⁻²) is provided entirely by Earth's gravity — no tangential acceleration, so orbital speed stays constant.",
    full: "Acceleration directed toward the centre of a circular path: ac = v²/r = ω²r. Always perpendicular to velocity, so it changes direction but not speed. The net centripetal force is F = mac = mv²/r. For satellites, gravity provides this force." },

  { term: "Conservation of Angular Momentum", symbol: "L = const", unit: "kg m² s⁻¹", hl: true,
    keywords: ["no external torque", "Iω constant", "stellar collapse"],
    synonyms: ["rotational momentum conservation"], antonyms: ["torque acting (angular momentum changes)"],
    context: "A diver tucking into a ball reduces moment of inertia and spins faster — angular momentum is conserved because the water exerts negligible torque during the dive.",
    full: "If the net external torque on a system is zero, total angular momentum L = Iω remains constant. Explains planetary orbital stability, gyroscope behaviour, figure-skating spins, and pulsar formation. HL only." },

  { term: "Constructive Interference", symbol: "—", unit: "—", hl: false,
    keywords: ["in phase", "amplitude addition", "path difference nλ"],
    synonyms: ["reinforcement"], antonyms: ["destructive interference", "cancellation"],
    context: "Two speakers producing the same frequency create loud spots where path difference = nλ — constructive interference builds amplitude to twice that of a single source.",
    full: "Occurs when two waves meet in phase (path difference = nλ, n = 0, 1, 2…). Resultant amplitude equals the sum of individual amplitudes; intensity increases. Exploited in noise-cancelling headphones (in reverse), diffraction gratings, and interferometers." },

  // D
  { term: "Decay Constant", symbol: "λ", unit: "s⁻¹", hl: false,
    keywords: ["probability of decay", "activity = λN", "exponential decay"],
    synonyms: ["disintegration constant"], antonyms: ["half-life (inverse relationship: T½ = ln2/λ)"],
    context: "Carbon-14 has λ ≈ 3.8 × 10⁻¹² s⁻¹ — extraordinarily small, meaning any given nucleus is very unlikely to decay in a human lifetime, enabling radiocarbon dating over millennia.",
    full: "The probability per unit time that a given nucleus will decay: A = λN. Constant for a given nuclide, independent of external conditions. Related to half-life by T½ = ln2/λ ≈ 0.693/λ. Governs the exponential law N = N₀e^(−λt)." },

  { term: "de Broglie Hypothesis", symbol: "λ = h/p", unit: "m", hl: true,
    keywords: ["matter waves", "wave-particle duality", "momentum wavelength"],
    synonyms: ["matter wave hypothesis"], antonyms: ["purely classical particle (no wave nature)"],
    context: "Electrons fired at a crystal diffract just like X-rays — their de Broglie wavelength λ = h/mv matches the lattice spacing, producing interference fringes in the Davisson–Germer experiment.",
    full: "All particles have an associated wave with wavelength λ = h/p = h/(mv), where h is Planck's constant and p is momentum. Faster or more massive particles have shorter wavelengths. The hypothesis unifies wave and particle descriptions and underlies quantum mechanics. Confirmed by electron diffraction. HL only." },

  { term: "Destructive Interference", symbol: "—", unit: "—", hl: false,
    keywords: ["out of phase", "amplitude cancellation", "path difference (n+½)λ"],
    synonyms: ["cancellation", "annulment"], antonyms: ["constructive interference", "reinforcement"],
    context: "Noise-cancelling headphones generate a sound wave exactly out of phase with ambient noise — destructive interference reduces the net amplitude reaching your ear.",
    full: "Occurs when two waves meet exactly out of phase (path difference = (n+½)λ). Resultant amplitude equals the difference of individual amplitudes; complete cancellation occurs when amplitudes are equal. Exploited in anti-noise technology, thin-film anti-reflection coatings, and interferometry." },

  { term: "Diffraction", symbol: "—", unit: "—", hl: false,
    keywords: ["wave bending", "gap comparable to λ", "spreading"],
    synonyms: ["wave spreading", "wave bending"], antonyms: ["straight-line propagation (ray optics limit)"],
    context: "Radio waves diffract around hills; light barely diffracts through a doorway — because the gap must be comparable to λ, and visible light's wavelength (~500 nm) is tiny compared to everyday openings.",
    full: "The spreading of a wave as it passes through an opening or around an obstacle. Most pronounced when gap ≈ λ. Single-slit pattern has central maximum width ∝ λ/a. Diffraction gratings produce sharp maxima at d sinθ = nλ. Sets the resolution limit of optical instruments (Rayleigh criterion)." },

  { term: "Doppler Effect", symbol: "—", unit: "—", hl: false,
    keywords: ["frequency shift", "source motion", "redshift/blueshift"],
    synonyms: ["Doppler shift"], antonyms: ["stationary source (no shift)"],
    context: "A police siren drops in pitch as the car passes — approaching, sound waves bunch up (higher frequency); receding, they stretch out (lower frequency). The same effect in light gives redshift from receding galaxies.",
    full: "Change in observed frequency when source or observer moves relative to the medium. For sound: f′ = f(v±v_o)/(v∓v_s). For light (relativistic): redshift z = Δλ/λ = v/c for v ≪ c. Used in radar speed guns, medical Doppler ultrasound, and cosmological distance measurement." },

  { term: "Dose Equivalent", symbol: "H", unit: "Sv (sievert)", hl: true,
    keywords: ["quality factor", "biological effectiveness", "sievert"],
    synonyms: ["effective dose (related concept)"], antonyms: ["absorbed dose (no biological weighting)"],
    context: "Neutrons have a quality factor of ~10 — 1 Gy of neutron radiation does ten times more biological damage than 1 Gy of X-rays, so the dose equivalent is 10 Sv.",
    full: "H = Q × D, where Q is the radiation quality factor and D is absorbed dose. Measured in sievert (Sv). Accounts for the fact that different radiation types cause different amounts of biological damage per joule deposited. Used in radiation protection and medical physics. HL only." },

  // E
  { term: "Electric Field Strength", symbol: "E", unit: "N C⁻¹ or V m⁻¹", hl: false,
    keywords: ["force per unit charge", "E = F/q", "vector field"],
    synonyms: ["electric field intensity"], antonyms: ["zero-field region (inside conductor in equilibrium)"],
    context: "Placing a 1 μC test charge in a field where it feels 5 μN of force tells you E = 5 N C⁻¹ at that point — the field exists independently of whether the test charge is there.",
    full: "Electric force per unit positive test charge: E = F/q. Vector quantity, pointing away from positive charges, toward negative. For a point charge: E = kQ/r². For a uniform field between plates: E = V/d. Related to potential by E = −dV/dr." },

  { term: "Electromotive Force", symbol: "ε", unit: "V", hl: false,
    keywords: ["energy per unit charge", "battery", "open-circuit voltage"],
    synonyms: ["emf", "source voltage"], antonyms: ["terminal voltage (reduced by internal resistance when current flows)"],
    context: "A battery labelled 9 V has emf 9 V — but under load the terminal voltage drops to 8.5 V, the 0.5 V lost to internal resistance, so ε = V_terminal + Ir.",
    full: "Total energy supplied per unit charge by a source: ε = W/q. Measured in volts. Differs from terminal voltage when current flows: V_terminal = ε − Ir, where r is internal resistance. Not strictly a 'force' — a historical misnomer; it is an energy-per-charge quantity." },

  { term: "Energy", symbol: "E", unit: "J", hl: false,
    keywords: ["capacity to do work", "joule", "conserved quantity"],
    synonyms: ["stored work", "capacity for work"], antonyms: ["entropy (energy unavailable for work)"],
    context: "A 100 W bulb converts 100 J of electrical energy to light and heat every second — energy changes form but is never created or destroyed.",
    full: "The capacity to do work, measured in joules. Appears in many forms: kinetic, potential, thermal, electromagnetic, nuclear, chemical. Conserved in isolated systems (First Law of thermodynamics). Mass is a form of energy: E = mc². The most fundamental conserved quantity in physics." },

  { term: "Entropy", symbol: "S", unit: "J K⁻¹", hl: false,
    keywords: ["disorder", "second law", "irreversibility"],
    synonyms: ["disorder", "unavailable energy per kelvin"], antonyms: ["order", "negentropy (information)"],
    context: "Ice melting in warm water increases entropy — the structured crystal becomes disordered liquid, and this process never spontaneously reverses, illustrating the Second Law.",
    full: "A state function measuring the degree of disorder or the number of accessible microstates: S = k_B ln Ω. Increases in all spontaneous irreversible processes (Second Law). Change in entropy: ΔS = Q/T for a reversible process. Governs the direction of natural processes and the efficiency of heat engines." },

  // F
  { term: "Faraday's Law", symbol: "ε = −NΔΦ/Δt", unit: "V", hl: false,
    keywords: ["changing flux", "induced emf", "electromagnetic induction"],
    synonyms: ["law of electromagnetic induction"], antonyms: ["static field (no induction)"],
    context: "A generator works because rotating a coil in a magnetic field continuously changes the flux through it — Faraday's law says this changing flux induces the emf that drives current.",
    full: "The induced emf is proportional to the rate of change of magnetic flux linkage: ε = −NΔΦ/Δt. The negative sign (Lenz's law) means the induced current opposes the change causing it. Basis of generators, transformers, and induction motors. Flux Φ = BAcosθ." },

  { term: "First Law of Thermodynamics", symbol: "ΔU = Q − W", unit: "J", hl: false,
    keywords: ["energy conservation", "heat and work", "internal energy"],
    synonyms: ["conservation of energy (thermodynamic form)"], antonyms: ["Second Law (deals with entropy, not energy quantity)"],
    context: "A gas heated by 500 J while doing 200 J of work on a piston increases its internal energy by 300 J — the First Law is simply energy conservation applied to thermal systems.",
    full: "Thermal energy added to a system equals work done by the system plus increase in internal energy: Q = ΔU + W, or ΔU = Q − W. An application of energy conservation. Adiabatic: Q = 0, so ΔU = −W. Isothermal (ideal gas): ΔU = 0, so Q = W." },

  { term: "Force", symbol: "F", unit: "N", hl: false,
    keywords: ["push or pull", "vector", "Newton second law"],
    synonyms: ["interaction", "push", "pull"], antonyms: ["equilibrium (balanced forces)", "zero net force"],
    context: "A 10 N force on a 2 kg trolley produces 5 m s⁻² acceleration — doubling the force doubles the acceleration; doubling the mass halves it.",
    full: "A vector quantity that causes or tends to cause a change in motion. F = ma (Newton's 2nd Law). Measured in newtons (1 N = 1 kg m s⁻²). Four fundamental forces: gravitational, electromagnetic, strong nuclear, weak nuclear. Contact forces arise from electromagnetic interactions at the atomic level." },

  { term: "Frequency", symbol: "f", unit: "Hz (s⁻¹)", hl: false,
    keywords: ["oscillations per second", "f = 1/T", "hertz"],
    synonyms: ["repetition rate"], antonyms: ["period (reciprocal of frequency)"],
    context: "Middle C is 262 Hz — the string vibrates 262 times per second; halving the string length doubles the frequency to 524 Hz (C one octave higher).",
    full: "Number of complete oscillations per unit time: f = 1/T. Measured in hertz (Hz = s⁻¹). Angular frequency ω = 2πf. For waves: v = fλ. The frequency of a wave is determined by its source and unchanged when it passes into a different medium (unlike wavelength and speed)." },

  // G
  { term: "Gravitational Field Strength", symbol: "g", unit: "N kg⁻¹ or m s⁻²", hl: false,
    keywords: ["force per unit mass", "g = 9.81 on Earth", "field strength"],
    synonyms: ["gravitational acceleration", "free-fall acceleration"], antonyms: ["zero gravity (deep space far from masses)"],
    context: "On the Moon, g ≈ 1.6 N kg⁻¹ — an astronaut weighing 700 N on Earth weighs only ~115 N on the Moon, though their mass (70 kg) is unchanged.",
    full: "Gravitational force per unit mass at a point in a gravitational field: g = F/m = GM/r². On Earth's surface ≈ 9.81 N kg⁻¹ (m s⁻²). Numerically equal to free-fall acceleration. Field lines point toward the attracting mass; strength decreases with r² (inverse-square law)." },

  { term: "Gravitational Red Shift", symbol: "—", unit: "—", hl: true,
    keywords: ["clocks slow in gravity", "photon loses energy climbing", "general relativity"],
    synonyms: ["gravitational time dilation (closely related)"], antonyms: ["gravitational blueshift (photon falling into potential well)"],
    context: "GPS satellites run their clocks slightly fast to compensate — without this correction, gravitational redshift would cause navigation errors of ~10 km per day.",
    full: "Prediction of general relativity: photons lose energy climbing out of a gravitational potential well, shifting to longer wavelength (red). Clocks deeper in a gravitational field run slower. Confirmed by the Pound–Rebka experiment (1959) and the Hafele–Keating atomic clock experiment. HL only." },

  { term: "Greenhouse Effect", symbol: "—", unit: "—", hl: false,
    keywords: ["IR absorption", "CO₂ CH₄ H₂O", "atmospheric warming"],
    synonyms: ["atmospheric blanketing"], antonyms: ["albedo effect (cooling by reflection)"],
    context: "Venus, despite being further from the Sun than Mercury, is hotter — its dense CO₂ atmosphere creates an extreme greenhouse effect, trapping infrared radiation.",
    full: "Short-wavelength solar radiation passes through the atmosphere and warms Earth's surface, which re-radiates longer-wavelength infrared. Greenhouse gases (CO₂, CH₄, H₂O, N₂O) absorb and re-emit this IR in all directions, warming the lower atmosphere. The enhanced anthropogenic greenhouse effect drives climate change." },

  // H
  { term: "Heisenberg Uncertainty Principle", symbol: "ΔxΔp ≥ ℏ/2", unit: "—", hl: true,
    keywords: ["conjugate quantities", "position-momentum", "quantum limit"],
    synonyms: ["indeterminacy principle"], antonyms: ["classical determinism (exact simultaneous knowability)"],
    context: "Confining an electron to a tiny atom (small Δx) forces a large uncertainty in momentum Δp — this is why electrons cannot simply spiral into the nucleus as classical theory predicted.",
    full: "Conjugate pairs of quantities (position–momentum; energy–time) cannot simultaneously be known with arbitrary precision: ΔxΔp ≥ ℏ/2. Not a measurement limitation — a fundamental feature of quantum mechanics. Arises because the wavefunction carries both position and momentum information and these are Fourier conjugates. HL only." },

  { term: "Hertzsprung–Russell Diagram", symbol: "H–R", unit: "—", hl: true,
    keywords: ["luminosity vs temperature", "main sequence", "stellar evolution"],
    synonyms: ["H–R diagram", "colour–magnitude diagram"], antonyms: ["no direct antonym"],
    context: "Our Sun sits on the main sequence at ~5800 K — a star's position on the H–R diagram tells you its evolutionary stage, mass, and remaining lifetime at a glance.",
    full: "Scatter plot of stellar luminosity (or absolute magnitude) vs surface temperature (or spectral class). Reveals stellar evolution tracks: main sequence (hydrogen burning), red giant branch, horizontal branch, white dwarf region. Stars spend most of their lives on the main sequence. HL only." },

  // I
  { term: "Impulse", symbol: "J", unit: "N s", hl: false,
    keywords: ["change in momentum", "J = FΔt", "area under F–t graph"],
    synonyms: ["change in momentum"], antonyms: ["constant momentum (no impulse)"],
    context: "A cricket bat applies a large force for a short time — the impulse J = FΔt equals the change in ball momentum, so a more powerful stroke (larger FΔt) gives the ball more speed.",
    full: "Impulse equals the change in linear momentum: J = Δp = FΔt. Vector quantity in the direction of force. Area under a force–time graph. When force varies: J = ∫F dt. Conservation of momentum is equivalent to saying the total impulse on an isolated system is zero." },

  { term: "Intensity", symbol: "I", unit: "W m⁻²", hl: false,
    keywords: ["power per area", "I ∝ A²", "inverse-square law"],
    synonyms: ["irradiance", "power flux density"], antonyms: ["low amplitude (low intensity)"],
    context: "Doubling your distance from a point source of sound reduces intensity by a factor of four — the same power spreads over four times the area as distance doubles.",
    full: "Power incident per unit area perpendicular to the direction of propagation: I = P/A. For a point source in free space: I = P/(4πr²) — inverse-square law. For a wave: I ∝ A² (amplitude squared). The ear perceives intensity logarithmically; sound intensity level in dB = 10 log(I/I₀)." },

  // K
  { term: "Kinetic Energy", symbol: "EK", unit: "J", hl: false,
    keywords: ["½mv²", "motion energy", "scalar"],
    synonyms: ["translational kinetic energy", "energy of motion"], antonyms: ["potential energy (stored, not kinetic)", "rest energy"],
    context: "A 1000 kg car at 30 m s⁻¹ (≈108 km/h) has EK = ½ × 1000 × 30² = 450 kJ — that energy must be dissipated as heat in the brakes when it stops.",
    full: "Energy possessed by an object due to its motion: EK = ½mv². Scalar. Work–energy theorem: net work = ΔEK. In relativistic mechanics: EK = (γ−1)m₀c². For a rotating body: EK = ½Iω². In SHM: EK is maximum at equilibrium, zero at maximum displacement." },

  // L
  { term: "Length Contraction", symbol: "L = L₀/γ", unit: "m", hl: true,
    keywords: ["Lorentz contraction", "proper length", "relativistic shortening"],
    synonyms: ["Lorentz contraction", "Fitzgerald–Lorentz contraction"], antonyms: ["proper length (maximum, measured at rest)"],
    context: "A muon travelling at 0.998c towards Earth sees the atmosphere contracted to ~1% of its rest thickness — this is why experimentally more muons reach sea level than classical physics predicts.",
    full: "An object moving relative to an observer appears shortened in the direction of motion: L = L₀/γ, where L₀ is the proper length (measured at rest) and γ = 1/√(1−v²/c²) is the Lorentz factor. Purely kinematic — not a physical compression. Perpendicular dimensions are unchanged. HL only." },

  { term: "Lenz's Law", symbol: "ε = −NΔΦ/Δt", unit: "—", hl: false,
    keywords: ["opposes change", "induced current direction", "conservation of energy"],
    synonyms: ["law of electromagnetic opposition"], antonyms: ["positive feedback (Lenz's law is always negative feedback)"],
    context: "Dropping a magnet through a copper tube: Lenz's law demands the induced current create a field opposing the magnet's motion — the magnet falls slowly, like through treacle.",
    full: "The induced emf and resulting current have a direction that opposes the change in flux producing them. The negative sign in Faraday's law: ε = −NΔΦ/Δt. A consequence of energy conservation — work must be done against the opposing force to sustain induction. Determines current direction in generators and eddy current braking." },

  { term: "Linear Momentum", symbol: "p", unit: "kg m s⁻¹", hl: false,
    keywords: ["p = mv", "vector", "conserved in collisions"],
    synonyms: ["momentum", "translational momentum"], antonyms: ["angular momentum (rotational equivalent)", "zero momentum (at rest)"],
    context: "In a head-on collision between equal masses at equal speeds, total momentum is zero — after collision they must move with zero net momentum, stopping each other (perfectly inelastic) or bouncing symmetrically (elastic).",
    full: "Product of mass and velocity: p = mv. Vector in the direction of velocity. Conserved in isolated systems (no external forces): Σp_before = Σp_after. Newton's 2nd Law in terms of momentum: F = dp/dt. Relativistic momentum: p = γm₀v." },

  { term: "Lorentz Factor", symbol: "γ", unit: "dimensionless", hl: true,
    keywords: ["γ = 1/√(1−v²/c²)", "relativistic scaling", "approaches infinity at c"],
    synonyms: ["Lorentz–FitzGerald factor"], antonyms: ["γ = 1 at rest (no relativistic effects)"],
    context: "At v = 0.866c, γ = 2 exactly — a moving clock runs at half the rate, lengths halve, and relativistic momentum doubles relative to the classical value.",
    full: "γ = 1/√(1−v²/c²). Dimensionless factor that scales relativistic effects. γ = 1 at v = 0; γ → ∞ as v → c. Appears in time dilation (Δt = γΔt₀), length contraction (L = L₀/γ), relativistic momentum (p = γm₀v), and total energy (E = γm₀c²). HL only." },

  // M
  { term: "Magnetic Flux", symbol: "Φ", unit: "Wb (T m²)", hl: false,
    keywords: ["Φ = BAcosθ", "field through area", "weber"],
    synonyms: ["flux linkage (when multiplied by N)"], antonyms: ["zero flux (field parallel to surface)"],
    context: "Tilting a coil so its plane is parallel to a magnetic field gives zero flux — no flux is 'threading' the coil, and hence Faraday's law predicts no induced emf at that instant.",
    full: "Measure of the total magnetic field passing through a surface: Φ = BAcosθ, where θ is the angle between B and the area normal. Measured in webers (1 Wb = 1 T m²). Faraday's law: ε = −NdΦ/dt. Flux linkage = NΦ for an N-turn coil." },

  { term: "Mass Defect", symbol: "Δm", unit: "kg or u", hl: false,
    keywords: ["binding energy", "missing mass", "E = Δmc²"],
    synonyms: ["nuclear mass defect"], antonyms: ["mass excess (in some nuclear databases, but conventionally mass defect is positive)"],
    context: "The mass of a helium-4 nucleus is 0.03 u less than the sum of 2 protons + 2 neutrons — this Δm = 0.03 u converts to 28 MeV of binding energy via E = Δmc².",
    full: "Δm = Σm(nucleons) − m(nucleus). The 'missing' mass is the binding energy divided by c²: BE = Δmc². Every stable nucleus is lighter than the sum of its free constituents. The larger the mass defect per nucleon, the more stable the nucleus." },

  { term: "Matter Waves", symbol: "λ = h/p", unit: "m", hl: true,
    keywords: ["de Broglie", "electron diffraction", "wave nature of particles"],
    synonyms: ["de Broglie waves", "pilot waves (Bohm interpretation)"], antonyms: ["classical point particles (no wave character)"],
    context: "Electron microscopes exploit matter waves — electrons at 100 keV have λ ≈ 0.004 nm, far smaller than visible light's ~500 nm, giving atomic-scale resolution impossible with optical microscopes.",
    full: "All moving particles have an associated wave with λ = h/p. First proposed by de Broglie (1924), confirmed experimentally by Davisson and Germer (1927). The amplitude of the matter wave gives the probability of finding the particle. Foundation of quantum mechanics and the Schrödinger equation. HL only." },

  // N
  { term: "Newton's First Law", symbol: "—", unit: "—", hl: false,
    keywords: ["inertia", "uniform motion", "no net force"],
    synonyms: ["law of inertia"], antonyms: ["Newton's Second Law (describes what happens when force acts)"],
    context: "A puck on frictionless ice glides in a straight line at constant speed indefinitely — no net force means no acceleration, illustrating the first law in near-ideal conditions.",
    full: "An object remains at rest or in uniform motion in a straight line unless acted upon by a net external force. Defines inertial frames of reference. Establishes that force is required not to maintain motion, but to change it. Equivalent to the statement that momentum is conserved in isolated systems." },

  { term: "Newton's Second Law", symbol: "F = ma", unit: "N", hl: false,
    keywords: ["F = dp/dt", "acceleration proportional to force", "net force"],
    synonyms: ["law of acceleration"], antonyms: ["Newton's First Law (zero net force, no change in motion)"],
    context: "Doubling the net force on an object doubles its acceleration; doubling its mass halves the acceleration — F = ma captures both dependencies in one equation.",
    full: "Net force equals rate of change of momentum: F = dp/dt = ma (for constant mass). The acceleration produced is proportional to force and inversely proportional to mass, in the direction of the net force. More generally: F = d(mv)/dt, which accommodates variable-mass problems (e.g., rockets)." },

  { term: "Newton's Third Law", symbol: "FAB = −FBA", unit: "N", hl: false,
    keywords: ["action-reaction", "equal and opposite", "same type same magnitude"],
    synonyms: ["law of action and reaction"], antonyms: ["no reaction (impossible — forces always come in pairs)"],
    context: "A rocket engine pushes exhaust gas backward — the gas pushes the rocket forward with equal force. The third law pair acts on different objects, so they don't cancel.",
    full: "When body A exerts a force on body B, body B exerts an equal and opposite force on body A. Forces always occur in pairs, act on different objects, are the same type, and have equal magnitudes. Explains rocket propulsion, walking (foot pushes ground; ground pushes foot), and swimming." },

  // P
  { term: "Photoelectric Effect", symbol: "—", unit: "—", hl: false,
    keywords: ["photon ejects electron", "threshold frequency", "work function"],
    synonyms: ["photoemission"], antonyms: ["thermal emission (heat, not light, ejects electrons)"],
    context: "Shining UV on zinc makes a charged electroscope discharge — the photons have enough energy (hf > Φ) to eject electrons; switching to red light (lower f) has no effect regardless of intensity.",
    full: "Emission of electrons from a metal when light of sufficient frequency falls on its surface. Einstein's explanation (1905): each photon carries energy E = hf; if hf ≥ Φ (work function), an electron is emitted with max KE = hf − Φ. The threshold frequency f₀ = Φ/h. Intensity increases electron current, not their energy." },

  { term: "Principle of Equivalence", symbol: "—", unit: "—", hl: true,
    keywords: ["gravity indistinguishable from acceleration", "equivalence principle", "general relativity"],
    synonyms: ["Einstein's equivalence principle"], antonyms: ["distinguishability of gravity and inertia (Newtonian view)"],
    context: "Einstein's thought experiment: inside a sealed lift accelerating upward at g, you cannot tell whether you're in a gravitational field or accelerating through empty space — this equivalence is the cornerstone of general relativity.",
    full: "A gravitational field is locally indistinguishable from an accelerating frame of reference. An observer in free fall is locally inertial. This equivalence motivated general relativity, predicting gravitational lensing, time dilation, and black holes. HL only." },

  { term: "Proper Length", symbol: "L₀", unit: "m", hl: true,
    keywords: ["rest frame measurement", "maximum length", "Lorentz contraction reference"],
    synonyms: ["rest length"], antonyms: ["contracted length (what moving observers measure)"],
    context: "The proper length of a spaceship is measured in the spaceship's own rest frame — any other observer moving relative to it will measure a shorter length due to Lorentz contraction.",
    full: "The length of an object measured in the reference frame in which it is at rest. This is the maximum possible measured length for that object. Moving observers measure L = L₀/γ < L₀. HL only." },

  { term: "Proper Time Interval", symbol: "Δt₀", unit: "s", hl: true,
    keywords: ["rest frame time", "minimum interval", "wristwatch time"],
    synonyms: ["eigentime", "wristwatch time"], antonyms: ["dilated time (what moving observers measure)"],
    context: "A muon's proper lifetime is ~2.2 μs — measured on a clock travelling with the muon. Ground-based observers measure a longer lifetime (dilated time) because the muon is moving relative to them.",
    full: "Time interval between two events as measured in the frame where both events occur at the same location. This is the minimum time any observer could record for those events. Moving observers measure Δt = γΔt₀ > Δt₀. HL only." },

  // R
  { term: "Radioactive Half-life", symbol: "T½", unit: "s", hl: false,
    keywords: ["T½ = ln2/λ", "time to halve", "exponential decay"],
    synonyms: ["half-life", "physical half-life"], antonyms: ["decay constant (inverse relationship)", "infinite stability"],
    context: "Carbon-14 has T½ ≈ 5730 years — after 5730 years half remains, after 11460 years a quarter remains, allowing archaeologists to date organic material up to ~50,000 years old.",
    full: "Time for the number of radioactive nuclei (or activity) to halve: T½ = ln2/λ ≈ 0.693/λ. Constant for a given nuclide, independent of temperature, pressure, or chemical state. After n half-lives: N = N₀(½)ⁿ. Used in radiometric dating, nuclear medicine dosing, and reactor fuel management." },

  { term: "Resistance", symbol: "R", unit: "Ω", hl: false,
    keywords: ["V/I ratio", "ohm", "opposition to current"],
    synonyms: ["electrical resistance", "impedance (AC)"], antonyms: ["conductance (G = 1/R)", "superconductivity (zero resistance)"],
    context: "A 100 Ω resistor with 5 V across it carries 50 mA — R = V/I is the slope of the V–I graph; for an ohmic device this slope is constant regardless of voltage.",
    full: "Ratio of potential difference to current: R = V/I. Measured in ohms (1 Ω = 1 V A⁻¹). Ohm's Law: R is constant for ohmic conductors at constant temperature. Resistivity: R = ρL/A. In series: R_total = ΣRi; in parallel: 1/R_total = Σ1/Ri. Power dissipated: P = I²R = V²/R." },

  // S
  { term: "Simple Harmonic Motion", symbol: "a = −ω²x", unit: "—", hl: false,
    keywords: ["acceleration proportional to displacement", "restoring force", "sinusoidal"],
    synonyms: ["SHM", "harmonic oscillation"], antonyms: ["damped oscillation", "forced oscillation at non-resonant frequency"],
    context: "A mass on a spring released from 10 cm displacement oscillates sinusoidally — maximum speed at centre (x = 0), maximum acceleration and restoring force at ±10 cm.",
    full: "Motion where acceleration is proportional to displacement from equilibrium and directed toward it: a = −ω²x. Solutions: x = A cos(ωt + φ). Energy oscillates between kinetic (½mω²(A²−x²)) and potential (½mω²x²), total = ½mω²A² = constant. Period T = 2π/ω, independent of amplitude." },

  { term: "Special Theory of Relativity", symbol: "—", unit: "—", hl: true,
    keywords: ["constant speed of light", "inertial frames", "Lorentz transformations"],
    synonyms: ["special relativity", "restricted theory of relativity"], antonyms: ["Galilean (classical) relativity", "general relativity (includes gravity)"],
    context: "Einstein's 1905 postulate that c is constant for all observers — regardless of source or observer motion — forced the abandonment of absolute time and space, and led directly to E = mc².",
    full: "Built on two postulates: (1) the laws of physics are identical in all inertial frames; (2) the speed of light in a vacuum is c for all observers. Consequences: time dilation, length contraction, mass–energy equivalence (E = mc²), relativistic momentum, and the relativity of simultaneity. HL only." },

  { term: "Stefan–Boltzmann Law", symbol: "P = εσAT⁴", unit: "W", hl: false,
    keywords: ["T to the fourth", "black body power", "Stefan constant"],
    synonyms: ["Stefan's law"], antonyms: ["Wien's law (deals with peak wavelength, not total power)"],
    context: "Doubling a star's surface temperature increases its total radiated power by 2⁴ = 16 — a small temperature increase has a dramatic effect on luminosity, explaining the vast brightness range of stars.",
    full: "Total power radiated per unit area by a black body: P/A = σT⁴. For a real body: P = εσAT⁴, where ε is emissivity (0–1). σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴. Used to calculate stellar luminosities, planetary equilibrium temperatures, and the Earth's energy balance." },

  // T
  { term: "Time Dilation", symbol: "Δt = γΔt₀", unit: "s", hl: true,
    keywords: ["moving clocks run slow", "proper time", "Lorentz factor"],
    synonyms: ["relativistic time dilation"], antonyms: ["proper time (minimum, measured at rest)"],
    context: "Muons created in the upper atmosphere (T½ ≈ 2.2 μs) survive to reach sea level — from Earth's frame their lifetime is time-dilated by γ ≈ 10 at v ≈ 0.995c, multiplying their apparent lifetime tenfold.",
    full: "A clock moving relative to an observer ticks more slowly: Δt = γΔt₀, where Δt₀ is the proper time (measured by the moving clock) and γ ≥ 1. Confirmed by Hafele–Keating experiment, muon decay experiments, and GPS satellite corrections. Reciprocal effect from each frame's perspective until acceleration breaks symmetry (twin paradox). HL only." },

  { term: "Torque", symbol: "τ", unit: "N m", hl: true,
    keywords: ["turning effect", "τ = Fr sinθ", "rotational force"],
    synonyms: ["moment", "turning moment", "couple (special case)"], antonyms: ["zero torque (rotational equilibrium)"],
    context: "A longer spanner gives more torque for the same force — τ = Fr, so doubling the wrench length doubles the turning effect on the bolt without changing the applied force.",
    full: "The rotational effect of a force: τ = r × F (magnitude τ = Fr sinθ). Measured in N m. Newton's 2nd law for rotation: τ_net = Iα. For rotational equilibrium: Στ = 0. A couple consists of two equal, opposite, non-collinear forces producing pure rotation with zero net force. HL only." },

  // W
  { term: "Wave–Particle Duality", symbol: "—", unit: "—", hl: true,
    keywords: ["photon and wave", "electron diffraction", "complementarity"],
    synonyms: ["complementarity principle"], antonyms: ["purely classical particle OR purely classical wave (both incomplete)"],
    context: "A single electron passing through a double slit lands at a definite point (particle) but builds up an interference pattern over many electrons (wave) — it is neither purely one nor the other.",
    full: "Both matter and radiation exhibit wave and particle properties, depending on the experiment. Light shows interference (wave) and photoelectric effect (particle). Electrons show particle tracks in cloud chambers and diffraction patterns in crystals. Described by quantum mechanics: |ψ|² gives probability density. HL only." },

  { term: "Work", symbol: "W", unit: "J", hl: false,
    keywords: ["force × displacement", "energy transfer", "scalar"],
    synonyms: ["energy transferred by a force"], antonyms: ["no work done (force perpendicular to displacement, or no displacement)"],
    context: "Carrying a heavy box horizontally at constant velocity does zero work against gravity — the gravitational force is vertical, displacement is horizontal, so W = Fs cosθ = 0.",
    full: "Work done by a force on an object: W = Fs cosθ, where θ is the angle between force and displacement. Scalar. Positive work: force component in direction of motion. Negative work: force opposes motion (e.g., friction). Work–energy theorem: W_net = ΔEK. For varying force: W = ∫F · ds." },

  { term: "Work Function", symbol: "Φ", unit: "J or eV", hl: false,
    keywords: ["minimum energy to eject electron", "threshold", "photoelectric"],
    synonyms: ["electron affinity (related)", "extraction energy"], antonyms: ["kinetic energy given to emitted electron (the excess above Φ)"],
    context: "Sodium has a work function of ~2.3 eV — green light (≈2.4 eV per photon) just ejects electrons; red light (≈1.8 eV) cannot, regardless of beam intensity.",
    full: "The minimum energy required to remove an electron from the surface of a metal: Φ = hf₀, where f₀ is the threshold frequency. Max KE of emitted electron: EK = hf − Φ. Values range from ~2 eV (caesium) to ~5 eV (platinum). Lower work function → easier emission → suitable for photocells." },
];

const LEVEL_LABELS = ["Keywords · Synonyms · Antonyms", "Context sentence", "Full explanation"];
const LEVEL_COLORS = [GOLD, "#7ec8e3", "#a8d5a2"];

export default function App() {
  const [filter, setFilter] = useState("all"); // all | sl | hl
  const [search, setSearch] = useState("");
  const [idx, setIdx] = useState(0);
  const [level, setLevel] = useState(0); // 0,1,2
  const [flipped, setFlipped] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const filtered = TERMS.filter(t => {
    const matchFilter = filter === "all" || (filter === "hl" ? t.hl : !t.hl);
    const s = search.toLowerCase();
    const matchSearch = !s || t.term.toLowerCase().includes(s) || t.keywords.join(" ").toLowerCase().includes(s);
    return matchFilter && matchSearch;
  });

  const card = filtered[idx] || null;

  const go = useCallback((dir) => {
    if (transitioning || filtered.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setIdx(i => {
        const next = (i + dir + filtered.length) % filtered.length;
        return next;
      });
      setLevel(0);
      setFlipped(false);
      setTransitioning(false);
    }, 180);
  }, [transitioning, filtered.length]);

  const nextLevel = () => {
    if (level < 2) setLevel(l => l + 1);
  };
  const prevLevel = () => {
    if (level > 0) setLevel(l => l - 1);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowDown") nextLevel();
      if (e.key === "ArrowUp") prevLevel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, level]);

  // reset idx on filter/search change
  useEffect(() => { setIdx(0); setLevel(0); setFlipped(false); }, [filter, search]);

  const LevelContent = () => {
    if (!card) return null;
    if (level === 0) return (
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:16}}>
          {card.keywords.map((k,i) => (
            <span key={i} style={{background:"#1a1c24", border:`1px solid ${GOLD}44`, color:GOLD,
              padding:"4px 12px", borderRadius:20, fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.78rem", letterSpacing:"0.04em"}}>
              {k}
            </span>
          ))}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:480, margin:"0 auto"}}>
          <div style={{background:"#12141a", border:`1px solid #2a2e3a`, borderRadius:8, padding:"10px 14px"}}>
            <div style={{color:MUTED, fontSize:"0.68rem", letterSpacing:"0.08em", marginBottom:4, textTransform:"uppercase", fontFamily:"'IBM Plex Mono', monospace"}}>Synonyms</div>
            {card.synonyms.map((s,i) => <div key={i} style={{color:TEXT, fontSize:"0.82rem", fontFamily:"'IBM Plex Sans', sans-serif"}}>{s}</div>)}
          </div>
          <div style={{background:"#12141a", border:`1px solid #2a2e3a`, borderRadius:8, padding:"10px 14px"}}>
            <div style={{color:MUTED, fontSize:"0.68rem", letterSpacing:"0.08em", marginBottom:4, textTransform:"uppercase", fontFamily:"'IBM Plex Mono', monospace"}}>Antonyms / Contrasts</div>
            {card.antonyms.map((a,i) => <div key={i} style={{color:TEXT, fontSize:"0.82rem", fontFamily:"'IBM Plex Sans', sans-serif"}}>{a}</div>)}
          </div>
        </div>
      </div>
    );
    if (level === 1) return (
      <div style={{fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:"1.25rem", lineHeight:1.75,
        color:WHITE, textAlign:"center", fontStyle:"italic", maxWidth:560, margin:"0 auto"}}>
        "{card.context}"
      </div>
    );
    return (
      <div style={{fontFamily:"'IBM Plex Sans', sans-serif", fontSize:"0.9rem", lineHeight:1.8,
        color:TEXT, maxWidth:560, margin:"0 auto", textAlign:"left"}}>
        {card.full}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"flex-start", padding:"24px 16px", fontFamily:"'IBM Plex Sans', sans-serif"}}>

      {/* Header */}
      <div style={{textAlign:"center", marginBottom:20}}>
        <div style={{fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:"1.6rem",
          color:GOLD, letterSpacing:"0.06em", marginBottom:2}}>IB Physics Glossary</div>
        <div style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.65rem",
          color:MUTED, letterSpacing:"0.1em", textTransform:"uppercase"}}>Three-Level Flashcards · {filtered.length} terms</div>
      </div>

      {/* Controls */}
      <div style={{display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", justifyContent:"center"}}>
        {["all","sl","hl"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? (f === "hl" ? HL_RED : GOLD) : SURFACE,
            color: filter === f ? BG : MUTED,
            border: `1px solid ${filter === f ? "transparent" : BORDER}`,
            borderRadius:20, padding:"5px 16px", cursor:"pointer",
            fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.72rem", letterSpacing:"0.06em",
            textTransform:"uppercase", transition:"all 0.2s"
          }}>
            {f === "all" ? "All Terms" : f === "sl" ? "SL Only" : "HL Only"}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{background:SURFACE, border:`1px solid ${BORDER}`, color:TEXT, borderRadius:20,
            padding:"5px 14px", fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.72rem",
            outline:"none", width:140}} />
      </div>

      {/* Card */}
      {card ? (
        <div style={{width:"100%", maxWidth:640, opacity: transitioning ? 0 : 1,
          transition:"opacity 0.18s", display:"flex", flexDirection:"column", gap:0}}>

          {/* Card shell */}
          <div style={{background:SURFACE, border:`1px solid ${card.hl ? HL_RED+"66" : BORDER}`,
            borderRadius:16, overflow:"hidden", boxShadow: card.hl ? `0 0 0 1px ${HL_RED}33` : "none"}}>

            {/* Card header */}
            <div style={{background: card.hl ? `${HL_RED}18` : "#0f1016",
              borderBottom:`1px solid ${card.hl ? HL_RED+"44" : BORDER}`,
              padding:"20px 24px", textAlign:"center"}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:10, flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Cormorant Garamond', Georgia, serif",
                  fontSize:"1.9rem", color:WHITE, fontWeight:600}}>{card.term}</span>
                {card.symbol && <span style={{fontFamily:"'IBM Plex Mono', monospace",
                  fontSize:"1rem", color:GOLD, fontStyle:"italic"}}>· {card.symbol}</span>}
                {card.hl && <span style={{background:HL_RED, color:"#fff",
                  fontSize:"0.6rem", fontFamily:"'IBM Plex Mono', monospace",
                  padding:"2px 7px", borderRadius:4, letterSpacing:"0.08em"}}>HL</span>}
              </div>
              {card.unit && <div style={{color:MUTED, fontFamily:"'IBM Plex Mono', monospace",
                fontSize:"0.7rem", marginTop:4, letterSpacing:"0.06em"}}>[{card.unit}]</div>}
            </div>

            {/* Level tabs */}
            <div style={{display:"flex", borderBottom:`1px solid ${BORDER}`}}>
              {LEVEL_LABELS.map((l,i) => (
                <button key={i} onClick={() => setLevel(i)} style={{
                  flex:1, padding:"10px 4px", background: level === i ? `${LEVEL_COLORS[i]}18` : "transparent",
                  border:"none", borderBottom: level === i ? `2px solid ${LEVEL_COLORS[i]}` : "2px solid transparent",
                  color: level === i ? LEVEL_COLORS[i] : MUTED,
                  fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.6rem", letterSpacing:"0.05em",
                  textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s"
                }}>
                  {i === 0 ? "Keywords" : i === 1 ? "Context" : "Explanation"}
                </button>
              ))}
            </div>

            {/* Level content */}
            <div style={{padding:"24px 20px", minHeight:180, display:"flex",
              alignItems:"center", justifyContent:"center"}}>
              <LevelContent />
            </div>

            {/* Reveal next level */}
            <div style={{borderTop:`1px solid ${BORDER}`, padding:"12px 20px",
              display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <button onClick={prevLevel} disabled={level === 0} style={{
                background:"transparent", border:`1px solid ${level === 0 ? BORDER : GOLD+"66"}`,
                color: level === 0 ? MUTED : GOLD, borderRadius:8,
                padding:"6px 14px", cursor: level === 0 ? "default" : "pointer",
                fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.68rem"}}>
                ▲ Less
              </button>
              <span style={{color:MUTED, fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.65rem"}}>
                Level {level+1} / 3 · ↑↓ keys
              </span>
              <button onClick={nextLevel} disabled={level === 2} style={{
                background: level < 2 ? `${GOLD}18` : "transparent",
                border:`1px solid ${level === 2 ? BORDER : GOLD}`,
                color: level === 2 ? MUTED : GOLD, borderRadius:8,
                padding:"6px 14px", cursor: level === 2 ? "default" : "pointer",
                fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.68rem"}}>
                ▼ More
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between",
            marginTop:14, padding:"0 4px"}}>
            <button onClick={() => go(-1)} style={{
              background:SURFACE, border:`1px solid ${BORDER}`, color:MUTED,
              borderRadius:10, padding:"10px 20px", cursor:"pointer",
              fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.72rem",
              transition:"all 0.2s"}}>
              ← Prev
            </button>
            <div style={{textAlign:"center"}}>
              <div style={{color:GOLD, fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.8rem"}}>
                {idx+1} / {filtered.length}
              </div>
              <div style={{color:MUTED, fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.58rem", marginTop:2}}>
                ← → arrow keys
              </div>
            </div>
            <button onClick={() => go(1)} style={{
              background:SURFACE, border:`1px solid ${BORDER}`, color:MUTED,
              borderRadius:10, padding:"10px 20px", cursor:"pointer",
              fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.72rem",
              transition:"all 0.2s"}}>
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div style={{color:MUTED, fontFamily:"'IBM Plex Mono', monospace", fontSize:"0.8rem",
          marginTop:60}}>No terms match your search.</div>
      )}

      {/* Footer */}
      <div style={{marginTop:32, color:MUTED, fontFamily:"'IBM Plex Mono', monospace",
        fontSize:"0.58rem", letterSpacing:"0.08em", textAlign:"center"}}>
        Constructed by Silicon · Anthropic Claude — Architect Carbon · LeeMcCullochJames
      </div>
    </div>
  );
}
