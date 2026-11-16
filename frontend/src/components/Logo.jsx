import { useId } from "react";

/**
 * Insignia circular de Cuky: aro, dos cerezas con hojas y monograma "CK".
 * Usa el color del texto (currentColor), así que se tiñe con clases text-*.
 */
export function Insignia({ texto = true, fondo = "#fff7f2", className = "h-14 w-14" }) {
  const uid = useId().replace(/:/g, "");
  const arcoSup = `arco-sup-${uid}`;
  const arcoInf = `arco-inf-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Insignia de Cuky"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <path id={arcoSup} d="M 32 100 A 68 68 0 0 1 168 100" />
        <path id={arcoInf} d="M 21 100 A 79 79 0 0 0 179 100" />
      </defs>

      {/* Aro */}
      <circle cx="100" cy="100" r="90" />

      {/* Texto circular */}
      {texto && (
        <g
          fill="currentColor"
          stroke="none"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="700"
          fontSize="12"
        >
          <text letterSpacing="6">
            <textPath href={`#${arcoSup}`} startOffset="50%" textAnchor="middle">
              CUKY
            </textPath>
          </text>
          <text letterSpacing="3.5">
            <textPath href={`#${arcoInf}`} startOffset="50%" textAnchor="middle">
              PASTELERÍA
            </textPath>
          </text>
        </g>
      )}

      {/* Tallos */}
      <path d="M38 40 C36 62 30 84 22 98" />
      <path d="M38 40 C40 82 42 112 36 131" />

      {/* Hojas */}
      <path d="M38 40 C30 28 20 34 25 44 C31 47 37 45 38 40Z" />
      <path d="M38 40 C48 30 58 34 60 40 C53 47 43 46 38 40Z" />

      {/* Cereza 1 */}
      <circle cx="20" cy="112" r="15" fill={fondo} />
      <path d="M11 118 q6 6 14 2" strokeWidth="2" />
      {/* Cereza 2 */}
      <circle cx="36" cy="146" r="15" fill={fondo} />
      <path d="M27 152 q6 6 14 2" strokeWidth="2" />

      {/* Monograma CK */}
      <text
        x="104"
        y={texto ? 124 : 128}
        textAnchor="middle"
        fontFamily="Pacifico, cursive"
        fontSize={texto ? 54 : 66}
        letterSpacing="-5"
        fill="currentColor"
        stroke="none"
      >
        CK
      </text>

      {/* Corazón */}
      <path
        d="M0 3 C-5 -1 -4 -5 -1.5 -5 C-0.5 -5 0 -4 0 -3.5 C0 -4 0.5 -5 1.5 -5 C4 -5 5 -1 0 3Z"
        fill="currentColor"
        stroke="none"
        transform={texto ? "translate(142 76) scale(2.4)" : "translate(150 68) scale(2.8)"}
      />
    </svg>
  );
}

export default function Logo({ claro = false, completo = false, className = "" }) {
  const color = claro ? "text-pink-300" : "text-[#ec4f8f]";
  const fondo = claro ? "#3b2418" : "#fff7f2";

  // Versión grande: insignia con el texto circular
  if (completo) {
    return (
      <Insignia
        texto
        fondo={fondo}
        className={`${color} ${className || "h-36 w-36"}`}
      />
    );
  }

  // Versión de cabecera: insignia + nombre
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Insignia texto={false} fondo={fondo} className={`h-14 w-14 ${color}`} />
      <span className="leading-none">
        <span
          className={`block font-display text-2xl font-extrabold tracking-[0.16em] ${
            claro ? "text-white" : "text-[#ec4f8f]"
          }`}
        >
          CUKY
        </span>
        <span
          className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.3em] ${
            claro ? "text-white/60" : "text-cacao/55"
          }`}
        >
          Pastelería
        </span>
      </span>
    </span>
  );
}
