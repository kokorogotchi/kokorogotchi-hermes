/**
 * Yokai SVG sprites for each evolution stage.
 * Art sourced from examples/kokoro-yokai-gallery-v2.html
 */

export const SPRITES = {
  egg: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="eg1" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#dde8f0"/>
        <stop offset="55%" stop-color="#9ab8c8"/>
        <stop offset="100%" stop-color="#4a6878"/>
      </radialGradient>
      <radialGradient id="eg2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#4a6878" stop-opacity="0"/>
        <stop offset="100%" stop-color="#1a2830" stop-opacity="0.6"/>
      </radialGradient>
      <filter id="egShadow"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#8ba8b8" flood-opacity="0.3"/></filter>
    </defs>
    <ellipse cx="70" cy="90" rx="42" ry="54" fill="url(#eg1)" filter="url(#egShadow)"/>
    <ellipse cx="70" cy="90" rx="42" ry="54" fill="url(#eg2)"/>
    <text x="70" y="98" text-anchor="middle" font-family="Noto Serif JP, serif" font-size="22" fill="#4a6878" opacity="0.5" letter-spacing="2">霊</text>
    <path d="M62 52 L58 63 L65 68 L60 78" stroke="#6a8898" stroke-width="0.8" fill="none" opacity="0.7"/>
    <path d="M78 48 L82 57 L76 62" stroke="#6a8898" stroke-width="0.6" fill="none" opacity="0.5"/>
    <path d="M62 52 L58 63 L65 68 L60 78" stroke="#c8e0f0" stroke-width="1.5" fill="none" opacity="0.25"/>
    <ellipse cx="52" cy="62" rx="10" ry="6" fill="white" opacity="0.18" transform="rotate(-30 52 62)"/>
    <ellipse cx="56" cy="58" rx="4" ry="2.5" fill="white" opacity="0.35" transform="rotate(-30 56 58)"/>
    <path d="M48 110 Q70 105 92 110" stroke="#6a8898" stroke-width="0.6" fill="none" opacity="0.4"/>
    <path d="M52 116 Q70 112 88 116" stroke="#6a8898" stroke-width="0.4" fill="none" opacity="0.3"/>
  </svg>`,

  hatchling: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="ko1" cx="40%" cy="35%">
        <stop offset="0%" stop-color="#e8f8d0"/>
        <stop offset="100%" stop-color="#6a9848"/>
      </radialGradient>
      <filter id="koGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    </defs>
    <path d="M42 105 L35 90 L55 85 L48 105 Z" fill="#c8d8b0" opacity="0.5"/>
    <path d="M98 108 L105 92 L85 88 L92 108 Z" fill="#c8d8b0" opacity="0.5"/>
    <path d="M55 118 L50 108 L70 102 Z" fill="#c8d8b0" opacity="0.4"/>
    <circle cx="70" cy="72" r="36" fill="url(#ko1)"/>
    <ellipse cx="70" cy="72" rx="28" ry="30" fill="#f0fce8" opacity="0.5"/>
    <circle cx="58" cy="68" r="5" fill="#1a2a10"/>
    <circle cx="82" cy="68" r="5" fill="#1a2a10"/>
    <ellipse cx="58" cy="68" rx="2.5" ry="4" fill="#0a1408"/>
    <ellipse cx="82" cy="68" rx="2.5" ry="4" fill="#0a1408"/>
    <path d="M70 36 Q65 20 58 16 Q68 18 70 28 Q72 18 82 16 Q75 20 70 36 Z" fill="#4a8828"/>
    <line x1="70" y1="36" x2="70" y2="20" stroke="#2a5810" stroke-width="1.2"/>
    <circle cx="30" cy="50" r="5" fill="#d0f0a0" opacity="0.4" filter="url(#koGlow)"/>
    <circle cx="110" cy="45" r="4" fill="#d0f0a0" opacity="0.35" filter="url(#koGlow)"/>
    <circle cx="25" cy="80" r="3" fill="#d0f0a0" opacity="0.3"/>
    <text x="70" y="110" text-anchor="middle" font-family="Noto Serif JP, serif" font-size="9" fill="#4a8828" opacity="0.5" letter-spacing="3">コダマ</text>
  </svg>`,

  pup: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="tan1" cx="40%" cy="35%">
        <stop offset="0%" stop-color="#e8c888"/>
        <stop offset="100%" stop-color="#8a5828"/>
      </radialGradient>
      <radialGradient id="tan2" cx="50%" cy="50%">
        <stop offset="0%" stop-color="#d8a060"/>
        <stop offset="100%" stop-color="#6a3818"/>
      </radialGradient>
    </defs>
    <ellipse cx="70" cy="95" rx="30" ry="24" fill="#e8d8a0" opacity="0.7"/>
    <circle cx="70" cy="78" r="38" fill="url(#tan1)"/>
    <ellipse cx="40" cy="44" rx="14" ry="16" fill="#6a3818"/>
    <ellipse cx="40" cy="44" rx="9" ry="11" fill="#c07840"/>
    <ellipse cx="100" cy="42" rx="14" ry="16" fill="#6a3818"/>
    <ellipse cx="100" cy="42" rx="9" ry="11" fill="#c07840"/>
    <ellipse cx="56" cy="72" rx="12" ry="9" fill="#2a1808" opacity="0.6"/>
    <ellipse cx="84" cy="72" rx="12" ry="9" fill="#2a1808" opacity="0.6"/>
    <circle cx="56" cy="72" r="5" fill="#f8e8a0"/>
    <circle cx="84" cy="72" r="5" fill="#f8e8a0"/>
    <circle cx="56" cy="72" r="3" fill="#1a0a04"/>
    <circle cx="84" cy="72" r="3" fill="#1a0a04"/>
    <circle cx="57" cy="71" r="1.2" fill="white"/>
    <circle cx="85" cy="71" r="1.2" fill="white"/>
    <ellipse cx="70" cy="82" rx="10" ry="7" fill="#c07840"/>
    <ellipse cx="70" cy="80" rx="5" ry="3.5" fill="#2a1808"/>
    <ellipse cx="70" cy="42" rx="38" ry="8" fill="#8a6830" opacity="0.9"/>
    <ellipse cx="70" cy="38" rx="22" ry="18" fill="#6a4818"/>
    <path d="M48 38 Q70 28 92 38" stroke="#4a2808" stroke-width="1.5" fill="none"/>
    <ellipse cx="108" cy="105" rx="8" ry="12" fill="#4a3020" opacity="0.6"/>
    <rect x="104" y="97" width="8" height="4" rx="2" fill="#3a2010" opacity="0.6"/>
  </svg>`,

  fledgling: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <linearGradient id="ten1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e84820"/>
        <stop offset="100%" stop-color="#a82808"/>
      </linearGradient>
      <linearGradient id="ten2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1a1008"/>
        <stop offset="100%" stop-color="#0a0804"/>
      </linearGradient>
    </defs>
    <path d="M35 80 Q10 55 8 30 Q20 45 28 55 Q15 35 20 15 Q32 38 35 58 Q22 30 30 10 Q45 40 40 65 Z" fill="url(#ten2)"/>
    <path d="M105 80 Q130 55 132 30 Q120 45 112 55 Q125 35 120 15 Q108 38 105 58 Q118 30 110 10 Q95 40 100 65 Z" fill="url(#ten2)"/>
    <ellipse cx="70" cy="95" rx="28" ry="32" fill="#a82808"/>
    <path d="M42 110 Q70 100 98 110 L92 140 Q70 148 48 140 Z" fill="#8a1e04"/>
    <path d="M55 78 Q70 72 85 78 L80 100 Q70 96 60 100 Z" fill="#f0e8d8" opacity="0.8"/>
    <circle cx="70" cy="65" r="28" fill="#c82808"/>
    <path d="M70 64 Q90 60 104 55 Q94 68 70 72 Z" fill="#b82000"/>
    <path d="M70 64 Q92 60 104 55" stroke="#8a1400" stroke-width="1" fill="none"/>
    <path d="M48 54 Q58 50 65 55" stroke="#1a0800" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M75 55 Q82 50 92 54" stroke="#1a0800" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="60" r="5" fill="#f8d800" opacity="0.9"/>
    <circle cx="84" cy="60" r="5" fill="#f8d800" opacity="0.9"/>
    <circle cx="56" cy="60" r="2.5" fill="#0a0400"/>
    <circle cx="84" cy="60" r="2.5" fill="#0a0400"/>
    <path d="M55 40 L70 20 L85 40 Z" fill="#1a0800"/>
    <rect x="52" y="38" width="36" height="6" rx="3" fill="#1a0800"/>
    <path d="M30 50 Q25 40 22 28" stroke="#3a3020" stroke-width="0.8" fill="none"/>
    <path d="M33 42 Q30 32 28 20" stroke="#3a3020" stroke-width="0.8" fill="none"/>
  </svg>`,

  familiar: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="kits1" cx="38%" cy="32%">
        <stop offset="0%" stop-color="#f0c890"/>
        <stop offset="100%" stop-color="#c86830"/>
      </radialGradient>
      <linearGradient id="kits2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8e8d0"/>
        <stop offset="100%" stop-color="#d89060"/>
      </linearGradient>
    </defs>
    <path d="M70 115 Q55 95 30 88 Q42 102 40 118 Q55 108 68 118" fill="#d88040" opacity="0.5"/>
    <path d="M70 115 Q50 90 22 78 Q36 96 32 115 Q50 105 68 118" fill="#c87030" opacity="0.45"/>
    <path d="M70 115 Q58 88 38 72 Q46 90 40 108 Q56 100 68 116" fill="#e89050" opacity="0.4"/>
    <path d="M70 115 Q82 92 110 82 Q98 98 102 116 Q85 106 72 118" fill="#d88040" opacity="0.5"/>
    <path d="M70 115 Q86 90 114 76 Q102 94 108 113 Q90 103 72 116" fill="#c87030" opacity="0.45"/>
    <path d="M70 115 Q90 85 120 68 Q106 88 114 108 Q94 98 72 114" fill="#e89050" opacity="0.4"/>
    <path d="M70 115 Q70 90 70 78 Q62 95 58 118" fill="#f0b060" opacity="0.7"/>
    <path d="M58 118 Q64 100 70 82 Q72 100 74 120 Q71 115 70 115 Q69 115 66 118 Z" fill="#f8e8d0" opacity="0.6"/>
    <ellipse cx="70" cy="98" rx="26" ry="28" fill="url(#kits1)"/>
    <path d="M44 78 Q70 58 96 78 Q96 105 70 115 Q44 105 44 78 Z" fill="url(#kits1)"/>
    <path d="M44 78 L32 45 L58 68 Z" fill="#c86830"/>
    <path d="M44 78 L35 48 L56 68 Z" fill="#f0c0a0"/>
    <path d="M96 78 L108 45 L82 68 Z" fill="#c86830"/>
    <path d="M96 78 L105 48 L84 68 Z" fill="#f0c0a0"/>
    <path d="M50 72 Q56 68 62 70" stroke="#8a3010" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M78 70 Q84 68 90 72" stroke="#8a3010" stroke-width="1.5" fill="none" opacity="0.5"/>
    <ellipse cx="58" cy="80" rx="7" ry="6" fill="#d4a030"/>
    <ellipse cx="82" cy="80" rx="7" ry="6" fill="#d4a030"/>
    <ellipse cx="58" cy="80" rx="2" ry="5.5" fill="#1a0800"/>
    <ellipse cx="82" cy="80" rx="2" ry="5.5" fill="#1a0800"/>
    <circle cx="59.5" cy="78" r="1.5" fill="white" opacity="0.7"/>
    <circle cx="83.5" cy="78" r="1.5" fill="white" opacity="0.7"/>
    <ellipse cx="70" cy="90" rx="3.5" ry="2.5" fill="#8a3010"/>
    <path d="M62 96 Q70 102 78 96" stroke="#8a3010" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M68 65 Q70 60 72 62 Q74 64 72 68 Q70 70 68 68 Q66 66 68 65 Z" fill="#c86830" opacity="0.7"/>
  </svg>`,

  ethereal: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="rai1" cx="50%" cy="50%">
        <stop offset="0%" stop-color="#f0e8ff" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="#9060e0" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#3020a0" stop-opacity="0"/>
      </radialGradient>
      <filter id="raiGlow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="raiGlow2"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <circle cx="70" cy="80" r="58" fill="none" stroke="#6040b0" stroke-width="0.5" opacity="0.3" stroke-dasharray="4 8"/>
    <circle cx="70" cy="80" r="48" fill="none" stroke="#8060d0" stroke-width="0.5" opacity="0.4" stroke-dasharray="2 5"/>
    <path d="M70 25 L65 42 L72 42 L62 62" stroke="#e0d0ff" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M112 45 L98 55 L104 58 L88 72" stroke="#e0d0ff" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M28 45 L42 55 L36 58 L52 72" stroke="#e0d0ff" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M70 135 L75 118 L68 118 L78 98" stroke="#e0d0ff" stroke-width="1" fill="none" opacity="0.4"/>
    <circle cx="70" cy="78" r="30" fill="#9060e0" opacity="0.15" filter="url(#raiGlow2)"/>
    <ellipse cx="70" cy="80" rx="30" ry="36" fill="url(#rai1)"/>
    <polygon points="70,52 73,65 87,65 76,74 80,87 70,79 60,87 64,74 53,65 67,65" fill="#f0e8ff" opacity="0.6" filter="url(#raiGlow)"/>
    <circle cx="58" cy="76" r="6" fill="white" opacity="0.9"/>
    <circle cx="82" cy="76" r="6" fill="white" opacity="0.9"/>
    <circle cx="58" cy="76" r="3.5" fill="#6040b0"/>
    <circle cx="82" cy="76" r="3.5" fill="#6040b0"/>
    <circle cx="58" cy="76" r="1.5" fill="white"/>
    <circle cx="82" cy="76" r="1.5" fill="white"/>
    <circle cx="32" cy="68" r="8" fill="none" stroke="#c0a0f0" stroke-width="1.5" opacity="0.5"/>
    <circle cx="108" cy="68" r="8" fill="none" stroke="#c0a0f0" stroke-width="1.5" opacity="0.5"/>
    <circle cx="32" cy="68" r="5" fill="#2010a0" opacity="0.4"/>
    <circle cx="108" cy="68" r="5" fill="#2010a0" opacity="0.4"/>
    <path d="M22 52 Q24 46 28 48 Q32 50 30 56 Q28 60 22 58 Q18 56 22 52 Z" fill="#c0a0f0" opacity="0.5"/>
    <path d="M118 52 Q116 46 112 48 Q108 50 110 56 Q112 60 118 58 Q122 56 118 52 Z" fill="#c0a0f0" opacity="0.5"/>
    <path d="M38 120 Q40 114 44 116 Q48 118 46 124 Q44 128 38 126 Q34 124 38 120 Z" fill="#c0a0f0" opacity="0.4"/>
    <path d="M102 120 Q100 114 96 116 Q92 118 94 124 Q96 128 102 126 Q106 124 102 120 Z" fill="#c0a0f0" opacity="0.4"/>
  </svg>`,

  stray: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <linearGradient id="noz1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8a9898"/>
        <stop offset="100%" stop-color="#384848"/>
      </linearGradient>
    </defs>
    <line x1="20" y1="10" x2="16" y2="28" stroke="#6080a0" stroke-width="0.8" opacity="0.35"/>
    <line x1="38" y1="5" x2="34" y2="23" stroke="#6080a0" stroke-width="0.8" opacity="0.3"/>
    <line x1="55" y1="8" x2="51" y2="26" stroke="#6080a0" stroke-width="0.8" opacity="0.35"/>
    <line x1="80" y1="4" x2="76" y2="22" stroke="#6080a0" stroke-width="0.8" opacity="0.3"/>
    <line x1="100" y1="10" x2="96" y2="28" stroke="#6080a0" stroke-width="0.8" opacity="0.35"/>
    <line x1="118" y1="6" x2="114" y2="24" stroke="#6080a0" stroke-width="0.8" opacity="0.3"/>
    <line x1="28" y1="20" x2="24" y2="38" stroke="#6080a0" stroke-width="0.6" opacity="0.25"/>
    <line x1="88" y1="15" x2="84" y2="33" stroke="#6080a0" stroke-width="0.6" opacity="0.25"/>
    <path d="M35 120 Q38 90 45 75 Q52 58 70 52 Q88 46 95 60 Q105 75 102 105 Q98 125 70 132 Q42 130 35 120 Z" fill="url(#noz1)"/>
    <path d="M100 108 Q122 120 125 140" stroke="#506060" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M100 108 Q122 120 125 140" stroke="#384848" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M45 75 L32 48 L52 65 Z" fill="#506060"/>
    <path d="M95 60 L112 40 L96 52 L104 35 L90 50 Z" fill="#506060"/>
    <path d="M48 85 Q55 80 62 83" stroke="#283838" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M50 94 Q58 89 66 92" stroke="#283838" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M78 82 Q86 78 93 80" stroke="#283838" stroke-width="1" fill="none" opacity="0.5"/>
    <circle cx="55" cy="72" r="6" fill="#203030"/>
    <circle cx="85" cy="70" r="6" fill="#203030"/>
    <circle cx="55" cy="72" r="3" fill="#384848"/>
    <circle cx="85" cy="70" r="3" fill="#384848"/>
    <path d="M55 78 Q53 86 54 92" stroke="#6090b0" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M58 90 Q70 86 82 90" stroke="#283838" stroke-width="1.5" fill="none"/>
    <path d="M72 95 L78 108" stroke="#283838" stroke-width="1.2" opacity="0.4"/>
    <path d="M74 95 L80 108" stroke="#283838" stroke-width="0.8" opacity="0.3"/>
  </svg>`,

  feral: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="oni1" cx="40%" cy="35%">
        <stop offset="0%" stop-color="#c82818"/>
        <stop offset="100%" stop-color="#580808"/>
      </radialGradient>
      <filter id="oniGlow"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <circle cx="70" cy="75" r="55" fill="#800808" opacity="0.08" filter="url(#oniGlow)"/>
    <path d="M70 12 L74 30 L82 18 L80 34 L90 24 L85 38 L98 32 L88 44 L104 44 L90 54 L108 60 L90 64 L108 78 L88 76 L100 92 L82 86 L88 108 L72 96 L75 122 L70 108 L65 122 L68 96 L52 108 L58 86 L40 92 L52 76 L32 78 L50 64 L32 60 L50 54 L36 44 L52 44 L42 32 L55 38 L50 24 L60 34 L58 18 L66 30 Z" fill="#800808" opacity="0.3"/>
    <ellipse cx="70" cy="85" rx="34" ry="40" fill="url(#oni1)"/>
    <path d="M50 80 Q55 70 60 80" stroke="#3a0808" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M80 80 Q85 70 90 80" stroke="#3a0808" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M52 45 L40 15 L58 38" fill="#1a0808"/>
    <path d="M52 45 L44 18 L57 40" fill="#3a1010"/>
    <path d="M88 45 L100 15 L82 38" fill="#1a0808"/>
    <path d="M88 45 L96 18 L83 40" fill="#3a1010"/>
    <ellipse cx="70" cy="68" rx="30" ry="28" fill="#b82010"/>
    <ellipse cx="56" cy="62" rx="9" ry="7" fill="#f8d800"/>
    <ellipse cx="84" cy="62" rx="9" ry="7" fill="#f8d800"/>
    <circle cx="56" cy="62" r="5" fill="#800000" opacity="0.8" filter="url(#oniGlow)"/>
    <circle cx="84" cy="62" r="5" fill="#800000" opacity="0.8" filter="url(#oniGlow)"/>
    <ellipse cx="56" cy="62" rx="3" ry="6" fill="#1a0000"/>
    <ellipse cx="84" cy="62" rx="3" ry="6" fill="#1a0000"/>
    <path d="M44 54 L58 60" stroke="#1a0808" stroke-width="3" stroke-linecap="round"/>
    <path d="M96 54 L82 60" stroke="#1a0808" stroke-width="3" stroke-linecap="round"/>
    <path d="M46 78 Q58 72 70 75 Q82 72 94 78" stroke="#1a0808" stroke-width="1.5" fill="#1a0808"/>
    <path d="M50 78 L52 88" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M60 75 L61 87" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M80 75 L79 87" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M90 78 L88 88" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <rect x="100" y="80" width="10" height="50" rx="3" fill="#4a3020" transform="rotate(20 100 80)"/>
    <circle cx="112" cy="82" r="3" fill="#8a7060"/>
    <circle cx="116" cy="90" r="3" fill="#8a7060"/>
    <circle cx="119" cy="99" r="3" fill="#8a7060"/>
    <circle cx="120" cy="109" r="3" fill="#8a7060"/>
  </svg>`,

  phantom: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <linearGradient id="gas1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#d0c0f0" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#8070b8" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#3020a0" stop-opacity="0"/>
      </linearGradient>
      <filter id="gasBlur"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    <path d="M42 120 Q50 140 60 155 Q65 145 58 130 Q65 148 70 160 Q75 148 72 132 Q78 146 82 158 Q88 145 80 128 Q88 142 98 152" fill="none" stroke="url(#gas1)" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
    <ellipse cx="70" cy="68" rx="35" ry="40" fill="url(#gas1)"/>
    <ellipse cx="54" cy="62" rx="13" ry="14" fill="#0a0820" opacity="0.9"/>
    <ellipse cx="86" cy="62" rx="13" ry="14" fill="#0a0820" opacity="0.9"/>
    <circle cx="54" cy="62" r="5" fill="#6050a0" opacity="0.25" filter="url(#gasBlur)"/>
    <circle cx="86" cy="62" r="5" fill="#6050a0" opacity="0.25" filter="url(#gasBlur)"/>
    <path d="M66 78 L70 85 L74 78 Z" fill="#0a0820" opacity="0.5"/>
    <path d="M48 92 Q70 88 92 92" stroke="#c0b0e0" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M52 92 L52 100" stroke="#c0b0e0" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    <path d="M60 90 L60 99" stroke="#c0b0e0" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    <path d="M70 89 L70 99" stroke="#c0b0e0" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    <path d="M80 90 L80 99" stroke="#c0b0e0" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    <path d="M88 92 L88 100" stroke="#c0b0e0" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    <path d="M60 30 L56 48 L62 52" stroke="#8070b0" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M80 32 L84 46 L78 50" stroke="#8070b0" stroke-width="0.8" fill="none" opacity="0.4"/>
    <rect x="18" y="52" width="12" height="4" rx="2" fill="#c0b0e0" opacity="0.2" transform="rotate(-20 18 52)"/>
    <rect x="110" y="58" width="10" height="3" rx="1.5" fill="#c0b0e0" opacity="0.2" transform="rotate(15 110 58)"/>
    <circle cx="22" cy="80" r="3" fill="#b0a0d8" opacity="0.25" filter="url(#gasBlur)"/>
    <circle cx="118" cy="75" r="3" fill="#b0a0d8" opacity="0.25" filter="url(#gasBlur)"/>
    <circle cx="28" cy="110" r="2" fill="#b0a0d8" opacity="0.2" filter="url(#gasBlur)"/>
  </svg>`,

  void: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="mu1" cx="50%" cy="50%">
        <stop offset="0%" stop-color="#0a0808"/>
        <stop offset="100%" stop-color="#000000"/>
      </radialGradient>
      <filter id="muGlow"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <circle cx="70" cy="80" r="58" fill="none" stroke="#181410" stroke-width="1" opacity="0.8"/>
    <circle cx="70" cy="80" r="50" fill="none" stroke="#201c18" stroke-width="1" opacity="0.7"/>
    <circle cx="70" cy="80" r="42" fill="none" stroke="#282018" stroke-width="1.5" opacity="0.6"/>
    <circle cx="70" cy="80" r="34" fill="none" stroke="#302820" stroke-width="1.5" opacity="0.5"/>
    <circle cx="70" cy="80" r="26" fill="none" stroke="#382e24" stroke-width="2" opacity="0.5"/>
    <circle cx="70" cy="80" r="18" fill="url(#mu1)"/>
    <text x="70" y="88" text-anchor="middle" font-family="Noto Serif JP, serif" font-size="26" fill="#181410" opacity="0.6">無</text>
    <path d="M70 54 Q88 56 90 74 Q88 92 70 94 Q52 92 50 74 Q52 56 70 54" fill="none" stroke="#302820" stroke-width="0.8" opacity="0.5"/>
    <path d="M70 60 Q84 62 86 76 Q84 90 70 92 Q56 90 54 76 Q56 62 70 60" fill="none" stroke="#282018" stroke-width="0.6" opacity="0.4"/>
    <circle cx="25" cy="30" r="1.5" fill="#302820" opacity="0.5"/>
    <circle cx="112" cy="28" r="1" fill="#302820" opacity="0.4"/>
    <circle cx="18" cy="80" r="1" fill="#302820" opacity="0.3"/>
    <circle cx="122" cy="75" r="1.5" fill="#302820" opacity="0.4"/>
    <circle cx="30" cy="130" r="1" fill="#302820" opacity="0.3"/>
    <circle cx="110" cy="128" r="1.5" fill="#302820" opacity="0.4"/>
  </svg>`,

  scarred: `<svg width="140" height="160" viewBox="0 0 140 160">
    <defs>
      <radialGradient id="ok1" cx="38%" cy="32%">
        <stop offset="0%" stop-color="#d0a050"/>
        <stop offset="100%" stop-color="#6a3808"/>
      </radialGradient>
      <linearGradient id="ok2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8c878"/>
        <stop offset="100%" stop-color="#a06020"/>
      </linearGradient>
    </defs>
    <ellipse cx="68" cy="90" rx="30" ry="36" fill="url(#ok1)"/>
    <ellipse cx="68" cy="58" rx="28" ry="26" fill="url(#ok2)"/>
    <path d="M46 42 L36 18 L58 38 Z" fill="#8a5010"/>
    <path d="M48 42 L40 22 L56 38 Z" fill="#c08030"/>
    <path d="M90 40 L104 16 L82 36 Z" fill="#8a5010"/>
    <path d="M88 40 L100 20 L84 36 Z" fill="#c08030"/>
    <path d="M46 50 L52 58 L50 64" stroke="#4a2808" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M47 50 L53 58 L51 64" stroke="#c07838" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M82 62 L90 58" stroke="#4a2808" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M55 88 L65 102" stroke="#4a2808" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M57 88 L67 102" stroke="#4a2808" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M46 50 L52 58 L50 64" stroke="#d4a820" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M55 88 L65 102" stroke="#d4a820" stroke-width="1" fill="none" opacity="0.4"/>
    <ellipse cx="54" cy="58" rx="8" ry="7" fill="#3a1808"/>
    <ellipse cx="82" cy="58" rx="8" ry="7" fill="#3a1808"/>
    <ellipse cx="54" cy="58" rx="4" ry="6" fill="#d4a820"/>
    <ellipse cx="82" cy="58" rx="4" ry="6" fill="#d4a820"/>
    <ellipse cx="54" cy="58" rx="1.5" ry="5.5" fill="#0a0400"/>
    <ellipse cx="82" cy="58" rx="1.5" ry="5.5" fill="#0a0400"/>
    <circle cx="55.5" cy="56" r="1.5" fill="white" opacity="0.6"/>
    <circle cx="83.5" cy="56" r="1.5" fill="white" opacity="0.6"/>
    <ellipse cx="68" cy="70" rx="14" ry="10" fill="#b07030"/>
    <ellipse cx="68" cy="67" rx="6" ry="4" fill="#3a1808"/>
    <path d="M60 78 Q68 83 76 78" stroke="#3a1808" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <rect x="38" y="112" width="16" height="24" rx="2" fill="#f5f0d8" opacity="0.7" transform="rotate(-10 38 112)"/>
    <line x1="40" y1="116" x2="52" y2="114" stroke="#c02010" stroke-width="0.8" opacity="0.6"/>
    <line x1="39" y1="120" x2="51" y2="118" stroke="#c02010" stroke-width="0.8" opacity="0.6"/>
    <line x1="38" y1="124" x2="50" y2="122" stroke="#c02010" stroke-width="0.8" opacity="0.6"/>
  </svg>`,
}
