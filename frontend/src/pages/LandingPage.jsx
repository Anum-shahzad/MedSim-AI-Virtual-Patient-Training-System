import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


/* ─── HAMZA SVG CHARACTER ─── */
function HamzaCharacter({ style = {} }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 355.38 681.7" style={{ width: '100%', height: '100%', display: 'block', ...style }}>
      <defs>
        <style>{`
          .hc1{stroke:#231f20;fill:none;stroke-miterlimit:10}
          .hc2{fill:none;stroke:#303231;stroke-miterlimit:10}
          .hc3{fill:#d18865;stroke:#603913;stroke-miterlimit:10}
          .hc4{fill:#a85d41;stroke-width:0}
          .hc5{fill:#e9e6e6;stroke-width:0}
          .hc6{fill:#171716;stroke-width:0}
          .hc7{fill:#f9f8f6;stroke-width:0}
          .hc8{fill:#969692;stroke-width:0}
          .hc9{fill:#999390;stroke-width:0}
          .hc10{fill:#2c446c;stroke-width:0}
          .hc11{fill:#2f2e2c;stroke-width:0}
          .hc12{fill:#2d436c;stroke-width:0}
          .hc13{fill:#797978;stroke-width:0}
          .hc14{fill:#4b4c4a;stroke-width:0}
          .hc15{fill:#686868;stroke-width:0}
          .hc16{fill:#133352;stroke-width:0}
          .hc17{fill:#3b3a3b;stroke-width:0}
          .hc18{fill:#a9aaa6;stroke-width:0}
          .hc19{fill:#fff;stroke-width:0}
          .hc20{fill:#7f7e7a;stroke-width:0}
          .hc21{fill:#9e5c42;stroke-width:0}
          .hc22{fill:#231f20;stroke-width:0}
          .hc23{fill:#999891;stroke-width:0}
          .hc24{fill:#d48a65;stroke-width:0}
          .hc25{fill:#403e3f;stroke-width:0}
          .hc26{fill:#b6b4ac;stroke-width:0}
          .hc27{fill:#3a3a3a;stroke-width:0}
          .hc28{fill:#e9e9e6;stroke-width:0}
          .hc29{fill:#303231;stroke-width:0}
          .hc30{fill:#1f3c5c;stroke-width:0}
          .hc31{fill:#898b84;stroke-width:0}
          .hcs{stroke:#33130d;stroke-miterlimit:10}
          .hcw2{stroke-width:2px}
          .hcw3{stroke-width:3px}
          .hcd{stroke:#260e0e;stroke-miterlimit:10}
          .hce{stroke:#3f3e3c;stroke-miterlimit:10}
          .hcf{fill:#f9fcf7;stroke:#353633;stroke-width:.5px;stroke-miterlimit:10}
        `}</style>
      </defs>
      {/* Shadow */}
      <ellipse className="hc26" cx="177.69" cy="646.37" rx="177.69" ry="35.33"/>
      {/* Chair */}
      <path className="hc23" d="M52.3,408.24v-160.88s6.23-35.08,41.56-33.13h160.03s18.7,18.58,18.7,39.36v154.65H52.3Z"/>
      <path className="hc31" d="M51.23,397.14l-16.63,26.31s-14.55,20.63,16.63,28.95,236.92,0,236.92,0c0,0,12.47-16.23,0-25.78-12.47-9.55-14.55-23.95-14.55-23.95l-222.37-5.52Z"/>
      <path className="hc10" d="M234.16,444.61l18.7,152.17s14.55,17.15,14.55,0-16.63-152.17-16.63-152.17h-16.63Z"/>
      <path className="hc10" d="M85.02,444.61l-15.48,164.93s-12.04,18.58-12.04,0c0-18.58,13.76-164.93,13.76-164.93h13.76Z"/>
      <path className="hc10" d="M42.66,444.77l-8.53,196.04s11.55,12.51,10.73,0c-.83-12.51,21.65-196.04,21.65-196.04h-23.85Z"/>
      <path className="hc10" d="M282.24,444.77l8.53,196.04s-11.55,12.51-10.73,0c.83-12.51-21.65-196.04-21.65-196.04h23.85Z"/>
      <path className="hc28" d="M51.23,393.08l-16.63,18.18s-14.55,14.26,16.63,20,236.92,0,236.92,0c0,0,12.47-11.22,0-17.82-12.47-6.6-14.55-16.55-14.55-16.55l-222.37-3.82Z"/>
      {/* Feet */}
      <rect className="hc13" x="190.26" y="619.06" width="44.34" height="26.32" transform="translate(424.86 1264.44) rotate(-180)"/>
      <path className="hc11" d="M267.39,670.78s2.31-8.77,0-13.85c-2.31-5.08-33.71-24.94-33.71-24.94,0,0-17.55-6.93-24.94,6l-18.94-1.85s-6.93,16.63,0,24.94c0,0,12.47,1.85,16.63,3.23l-1.39-3.69s15.24,14.78,62.35,10.16Z"/>
      <path className="hc1" d="M268.4,663.39s-45.97.43-81.68-12.49"/>
      <rect className="hc13" x="104.15" y="619.04" width="44.34" height="26.32"/>
      <path className="hc11" d="M71.36,670.77s-2.31-8.77,0-13.85c2.31-5.08,33.71-24.94,33.71-24.94,0,0,17.55-6.93,24.94,6l18.94-1.85s6.93,16.63,0,24.94c0,0-12.47,1.85-16.63,3.23l1.39-3.69s-15.24,14.78-62.35,10.16Z"/>
      <path className="hc1" d="M70.35,663.38s45.97.43,81.68-12.49"/>
      {/* Legs */}
      <path className="hc15" d="M84.8,437.9l.81-5.01,1.71-4.94s11.16-17.32,29.35-20.53c31.4-5.54,97.91,0,97.91,0,0,0,33.71.46,36.95,25.4,3.23,24.94-8.31,188.89-8.31,188.89,0,0-40.18,7.85-61.42-3.23l9.24-175.96-45.26-1.39,9.24,176.88s-49.42,13.85-61.42,3.69c0,0-13.39-169.95-8.77-183.81Z"/>
      <path className="hc14" d="M113.87,408.03c8.23-1.5,68.97-11.88,111.08.7.16.05.15.29-.02.32-4.96.92-33.41,11.3-34.29,40.13,0,.13-.13.22-.24.15-1.33-.84-8.1-4.5-25.67-4.5-19.86,0-18.43,6.53-18.43,6.53,0,0,1.15-29.71-32.4-43.02-.17-.07-.2-.28-.03-.31Z"/>
      {/* Torso */}
      <path className="hc10" d="M124.06,209.76c-7.69,1.49-32.89,3.41-33.32,13.09-1.02,23.03.95,46.61.76,69.73-.31,37.78-.11,76.91-7.32,114.14-.89,4.58-1.89,9.2-3.46,13.6-.69,1.93-.08,12.18,4.88,12.57,6.29.5,1.3-4.66,1.72-4.94,7.51-4.98,5.65-7.94,14.24-11.96,3.9-1.82,9.74-5.11,14.18-5.23,0,0,51.26-1.39,51.26-1.39,0,0,60.04.92,60.04.92,12.1,5.29,15.98,12.2,24.47,22.52.39.47,8.95-9.28,8.78-10.05-7.07-32.5-13.11-65.24-16.91-98.29-3.95-34.41-8.11-72.82,4.37-105.95,1.02-2.66-31.83-10.82-36.08-9.47l10.04,28.06-17.67,10.04,13.51,12.12-48.9,79.15-48.77-80.08,12.47-10.5-16.97-10.74s8.66-27.36,8.66-27.36Z"/>
      <line style={{stroke:'#133352',strokeMiterlimit:10}} x1="168.68" y1="338.44" x2="168.62" y2="409.4"/>
      <circle style={{fill:'#133352'}} cx="178.53" cy="353.35" r="5.46"/>
      <circle style={{fill:'#133352'}} cx="179.22" cy="379.52" r="5.46"/>
      {/* Right Hand */}
      <path className="hc3" d="M127.86,366.67s32.56,6.93,35.56,9.01,23.09,18.01,24.94,24.94c1.85,6.93-3.46,11.08-3.46,11.08,0,0,.46,9.47-7.62,6,0,0,.23,9.01-8.78,5.54,0,0-3.3,6-10.2,2.77l-14.05-12.01s-18.7-4.62-24.71-10.39-7.16-8.31-7.16-8.31c0,0,.46-15.93,15.47-28.63Z"/>
      <path className="hc3" d="M162.49,387.45s14.78,9.7,22.4,24.25"/>
      <path className="hc3" d="M156.03,395.07s18.47,17.78,21.24,22.63"/>
      <path className="hc3" d="M148.41,403.39s11.08,5.54,20.09,19.86"/>
      {/* Left Hand */}
      <path className="hc3" d="M203.1,362.44s-38.11,11.15-41.12,13.23-23.09,18.01-24.94,24.94,3.46,11.08,3.46,11.08c0,0-.46,9.47,7.62,6,0,0-.23,9.01,8.78,5.54,0,0,3.3,6,10.2,2.77l14.05-12.01s18.7-4.62,24.71-10.39c6-5.77,15.88-10.63,15.88-10.63,0,0-3.63-17.85-18.64-30.55Z"/>
      <path className="hc3" d="M162.91,387.45s-14.78,9.7-22.4,24.25"/>
      <path className="hc3" d="M169.38,395.07s-18.47,17.78-21.24,22.63"/>
      <path className="hc3" d="M177,403.39s-11.08,5.54-20.09,19.86"/>
      {/* Arm Right Lower */}
      <path className="hc12" d="M19.41,332.17c-6.13,12.62-.83,27.96,11.79,34.09l68.15,33.37c.88-3.62,1.77-7.24,2.65-10.86.97-3.95,1.24-8.08,2.61-11.94,1.22-3.43,3.67-5.89,5.96-8.64.81-.98,10.21-13.16,10.72-12.9,0,0-67.78-34.92-67.78-34.92-12.62-6.13-27.96-.83-34.09,11.79Z"/>
      <path className="hc17" d="M107,404.95l-10.29-5.94c-2.36-1.36-3.17-4.38-1.81-6.74l20.7-35.85c1.36-2.36,4.38-3.17,6.74-1.81,1.78,1.03,3.85,2.22,5.67,3.27,2.37,1.37,3.18,4.41,1.79,6.77-6.54,11.08-22.02,40.75-22.8,40.3Z"/>
      {/* Arm Right Upper */}
      <rect className="hc12" x="41.52" y="207.54" width="49.36" height="162.24" rx="18.19" ry="18.19" transform="translate(132.86 .1) rotate(25.92)"/>
      {/* Arm Left Upper */}
      <rect className="hc12" x="242.73" y="207.54" width="49.36" height="162.24" rx="18.19" ry="18.19" transform="translate(634.11 431.36) rotate(154.08)"/>
      {/* Arm Left Lower */}
      <path className="hc12" d="M305.49,332.17c6.13,12.62.83,27.96-11.79,34.09l-68.15,33.37c-.88-3.62-1.77-7.24-2.65-10.86-.97-3.95-1.24-8.08-2.61-11.94-1.22-3.43-3.67-5.89-5.96-8.64-.81-.98-10.21-13.16-10.72-12.9,0,0,67.78-34.92,67.78-34.92,12.62-6.13,27.96-.83,34.09,11.79Z"/>
      <path className="hc17" d="M224.06,399.56l10.29-5.94c2.36-1.36,3.17-4.38,1.81-6.74l-20.7-35.85c-1.36-2.36-4.38-3.17-6.74-1.81-1.78,1.03-3.85,2.22-5.67,3.27-2.37,1.37-3.18,4.41-1.79,6.77,6.54,11.08,22.02,40.75,22.8,40.3Z"/>
      {/* Blazer */}
      <path className="hc19" d="M143.09,198.57c-.29.4-4.2,2.25-4.44,2.8-.48,1.09-.96,2.19-1.44,3.28-.2.45-.4.91-.6,1.36-.03.06-.06.13-.06.19,0,.06.01.11.02.16.69,2.7,1.37,5.4,2.05,8.11,1.76,6.95,3.51,13.9,5.27,20.85,2.31,9.15,4.63,18.3,6.94,27.45s4.73,18.72,7.1,28.08c1.92,7.58,3.83,15.16,5.75,22.74.63,2.5,1.26,5,1.9,7.5.29,1.16.52,1.8,1.12,4,0,0,.99-3.26,1.06-3.5.68-2.38,1.36-4.76,2.04-7.15,2.11-7.38,4.21-14.76,6.32-22.13,2.64-9.24,5.27-18.47,7.91-27.71,2.61-9.14,5.22-18.28,7.83-27.43,2.03-7.1,4.05-14.19,6.08-21.29.33-.67.45-1.56.65-2.28.23-.81.46-1.61.69-2.42.23-.8.46-1.6.69-2.4.12-.41.24-.82.35-1.23.09-.31.32-.79.24-1.1-.09-.33-.49-.73-.68-1.01l-.72-1.08c-.47-.7-3.16-3.98-5.92-6.74-.23-.23-.11,2.83-.53,3.32-1.23,1.39-2.46,2.78-3.68,4.17-1.56,1.77-3.12,3.53-4.68,5.3-1.7,1.92-3.39,3.84-5.09,5.76s-3.27,3.7-4.9,5.55c-1.37,1.56-2.75,3.11-4.12,4.67-.92,1.04-1.83,2.08-2.75,3.11-.27.31-.55.62-.82.93-.35-.42-.7-.84-1.05-1.26-.92-1.11-1.85-2.23-2.77-3.34-1.32-1.59-2.64-3.18-3.96-4.77-1.54-1.85-12.81-22.51-15.8-22.49Z"/>
      <path className="hc5" d="M144.75,199.16c-.47-.39-1.27-1.35-1.88-1.27-4.05.52-7.09,5.11-7.1,7.5-.01,2.99,1.07,4.44,1.76,7.19.88,3.49,1.77,7.23,2.68,10.71,1.84,6.96,5.66,18.39,5.77,20.29-.13-.52,3.32-4.27,3.61-4.71,1.35-2.04,2.85-3.79,4.2-5.83,2.6-3.92,4.6-5.72,7.2-9.64-6.36-7.5-9.25-18.39-16.25-24.25Z"/>
      <path className="hc5" d="M193.01,196.88c2.38,2.4,6.9,6.27,8.02,9.18.37.97-.51,2.44-.81,3.2-1.82,4.72-3.37,10.01-4.65,14.92-1.16,4.46-2.51,8.88-3.67,13.34-.5,1.92-1.31,4.36-1.88,6.23-2.63-2.74-5.31-7.49-7.41-10.65-2.59-3.91-5.19-7.82-7.78-11.73-.55-.84,16.09-22.98,18.16-24.49Z"/>
      <line style={{stroke:'#231f20',strokeMiterlimit:10}} x1="166.67" y1="230.44" x2="166.8" y2="324.78"/>
      <polygon className="hc11" points="135.84 204.91 124.06 209.76 115.4 237.12 132.37 247.86 119.91 258.36 165.63 338.61 167.36 340.69 217.58 259.29 204.07 247.17 221.74 237.12 211.69 209.06 199.92 204.91 166.8 316.7 135.84 204.91"/>
      {/* Watch */}
      <rect className="hc8" x="202.76" y="378.39" width="11.08" height="21.48" transform="translate(-175.68 171.49) rotate(-32.3)"/>
      <ellipse className="hc16" cx="199.02" cy="376.04" rx="14.03" ry="13.42" transform="translate(-170.13 164.5) rotate(-32.3)"/>
      <ellipse className="hc7" cx="199.02" cy="376.04" rx="12.31" ry="11.78" transform="translate(-170.13 164.5) rotate(-32.3)"/>
      <line className="hc2" x1="194.53" y1="368.94" x2="199.52" y2="376.85"/>
      <line className="hc2" x1="205.85" y1="372.01" x2="199.16" y2="377.46"/>
      {/* Hair */}
      <path className="hc27" d="M130.29,46.62c-.41.02-.81.06-1.19.15-5.08,1.08-12.39,5.44-14.26,10.59-.46,1.27-.62,2.63-.67,3.97-.25,6.45.26,12.91-1.77,19.27-.89,2.79-.87,6.05-1.5,9.01-.5,2.34-.96,8.4-2.97,9.82-1.46,1.04-6.99.42-9.18.42l-4.16-38.79s-1.73-24.59,24.59-31.52c0,0,5.2-31.52,51.26-29.44,6.43.29,12.66.68,18.99,2.1,13.19,2.96,25.84,9.05,35.32,18.84,4.27,4.41,7.82,9.49,10.56,14.98,2.72,5.45,5.3,11.27,5.92,17.39.4,3.98-.27,8.17-.55,12.15-.58,8.42-1.32,16.79-1.9,25.22-.03.5-.36,9.07-.46,9.07h-9.01c-.87,0-4.81-10.91-5.32-12.04-.34-.77-.17-1.53-.3-2.36-.09-.56-.4-6.53-.38-7.1.21-7.69.19-10,.44-17.68.02-.51.03-1.04-.14-1.53-.15-.42-.43-.79-.7-1.14-3.03-3.93-6.32-7.58-10.99-9.59-5.69-2.44-10.91-1.14-16.22,1.51-16.97,10.09-39.14,3.17-39.14,3.17-4.86-1.62-10.07-2.55-15.03-3.81-3.26-.83-7.74-2.83-11.27-2.67Z"/>
      <path className="hcd" style={{fill:'none'}} d="M227.84,98.72c.16.28.28.76.54.94.27.17.76.46,1.08.46,1.63,0,6.84-.14,8.9-.26.49-.03.23-4.18.23-4.75,0-.82.07-1.57.1-2.31.17-3.6.59-6.44.87-10.43.24-3.44.82-7.51.68-10.95-1.11-.15-3.06.76-4.16,1.05l-5.88,1.5c-.64.16-7.02.76-6.81,1.69v5.05s.47,6.72.47,6.72"/>
      <path className="hc9" d="M95.67,71.17c1.11-.11,2.77.81,3.86,1.15l6.21,1.91c2.78.86,4.81,1.75,7.59,2.61-.36,3.12-1.33,6.33-1.65,9.36-.29,2.77-.88,4.36-1.45,7.49-.32,1.8-1.04,6.5-4.01,6.36-.27-.01-.53.07-.8.07-1.04,0-.39,0-6.68-.26-.61-.02-1.86-16.72-2.02-18.9-.08-1.05-1.14-8.74-1.05-9.79Z"/>
      {/* Head */}
      <path className="hc24" d="M114.02,55.46c.22-.67.66-1.24,1.11-1.78,3.82-4.53,9.19-8.3,15.09-9.37,0,0,27.25,9,38.1,7.96,13.07-1.26,27.27-1.61,39.3-7.45.59-.29,1.2-.59,1.86-.58.46.01.9.18,1.32.37,4.21,1.88,11.06,7.14,12.71,11.62.45,1.23.29,2.57.36,3.88.36,6.67.08,10.1-.21,17.58-.27,6.93,1.9,14.76,6.04,20.48.21.3.45.6.78.75.31.15.67.15,1.02.14,2.42-.03,4.83-.06,7.25-.09.88-.01,1.77-.02,2.62.22.65.18,1.25.5,1.83.86,5.19,3.2,7.91,8.93,8.02,14.91.23,12.24-11.08,14.32-11.08,14.32,0,0-9.24,0-9.24,0v19.29c0,4.08-.09,8.17,0,12.24.13,5.94-2.68,11.74-6.08,16.55-6.45,9.13-15.05,9.05-25.02,9.23-9.96.18-19.92.13-29.88.06-14.31-.1-28.62-.29-42.93-.56,0,0-14.78-3-22.4-20.09-.77-1.73-.39-4.35-.37-6.17.03-3.68.21-7.37.36-11.05.16-3.74.34-7.48.43-11.22.07-2.88,1.07-6.84-2.36-7.49-5.8-1.1-11.83-3.36-15.12-8.25-3.45-5.13-2.9-12.48.95-17.32,2.2-2.76,5.26-4.51,8.67-5.32,2.13-.51,8.93.49,10.17-.89,2.19-2.42,3.56-7.82,4.11-11,1.02-5.86.43-2.32,1.3-8.56,1.05-7.51,1.27-14.31,1.12-21.51-.01-.55-.02-1.11.12-1.64.01-.04.02-.09.04-.13Z"/>
      {/* Neck */}
      <polygon className="hc24" points="142.67 186.72 142.67 201.96 167.15 232.67 193.25 202.42 193.25 186.72 142.67 186.72"/>
      <path className="hc4" d="M142.67,186.37v13.29h33.02s16.86-3.93,17.55-12.93l-50.57-.36Z"/>
      {/* Mouth */}
      <path className="hc1" d="M147.28,139.47s22.63-6.93,38.33,3.69"/>
      {/* Nose */}
      <path className="hc21" d="M167.14,101.12s-17.48,25.39,0,28.73c0,0,14.36-.22,0-28.73Z"/>
      {/* Eyes */}
      <path className="hc19" d="M172.47,95.44h33.62v7.49c0,2.44-1.98,4.43-4.43,4.43h-22.82c-3.52,0-6.38-2.86-6.38-6.38v-5.53h0Z"/>
      <path className="hc6" d="M178.87,95.44h13.03v2.79c0,2.7-2.19,4.89-4.89,4.89h-3.07c-2.79,0-5.06-2.27-5.06-5.06v-2.62h0Z"/>
      <path className="hc19" d="M125.86,95.16h33.62v7.49c0,2.44-1.98,4.43-4.43,4.43h-22.82c-3.52,0-6.38-2.86-6.38-6.38v-5.53h0Z"/>
      <path className="hc6" d="M140.85,94.99h13.03v2.79c0,2.7-2.19,4.89-4.89,4.89h-3.07c-2.79,0-5.06-2.27-5.06-5.06v-2.62h0Z"/>
      {/* Eyebrows */}
      <rect className="hc25" x="172.47" y="77.98" width="33.62" height="7.79" rx="2.98" ry="2.98" transform="translate(-8.47 23.34) rotate(-6.9)"/>
      <rect className="hc25" x="126.82" y="79.91" width="33.62" height="7.79" rx="2.98" ry="2.98" transform="translate(8.72 -13.42) rotate(5.52)"/>
    </svg>
  );
}

/* ─── ANUM SVG CHARACTER ─── */
function AnumCharacter({ style = {} }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 946.07 1644.28" style={{ width: '100%', height: '100%', display: 'block', ...style }}>
      <defs>
        <style>{`
          .ac1{fill:#70706b;stroke-width:0}
          .ac2{fill:#140a0b;stroke-width:0}
          .ac3{fill:#2c1a1f;stroke-width:0}
          .ac4{fill:#fcfbfb;stroke-width:0}
          .ac5{fill:#494946;stroke-width:0}
          .ac6{fill:#1d1316;stroke-width:0}
          .ac7,.ac22{fill:#d89c84}
          .ac8{fill:#925345;stroke-width:0}
          .ac9{fill:#120300;stroke-width:0}
          .ac10{fill:#21211e;stroke-width:0}
          .ac11{fill:#b5b3ab;stroke-width:0}
          .ac12{fill:#f6f6f4;stroke-width:0}
          .ac13{fill:#888a83;stroke-width:0}
          .ac14{fill:#7f7e7a;stroke-width:0}
          .ac15{fill:#989790;stroke-width:0}
          .ac16{fill:#9a5239;stroke-width:0}
          .ac17{fill:#1f1f1f;stroke-width:0}
          .ac18{fill:#a45034;stroke-width:0}
          .ac19{fill:#a8a9a5;stroke-width:0}
          .ac20{fill:#201f20;stroke-width:0}
          .ac21{fill:#210406;stroke-width:0}
          .ac23,.ac24,.ac25,.ac26{fill:none}
          .ac23,.ac24,.ac25,.ac22{stroke-miterlimit:10}
          .ac23,.ac26{stroke:#000;stroke-width:3px}
          .ac24{stroke:#91452b;stroke-width:5px;stroke-linecap:round}
          .ac25,.ac22{stroke:#a67c52}
          .ac26{stroke-linecap:round;stroke-linejoin:round}
          .ac7{stroke-width:0}
          .ac22{stroke-width:1px}
        `}</style>
      </defs>
      <g id="a-Shadow"><ellipse className="ac11" cx="473.03" cy="1534.08" rx="473.03" ry="110.2"/></g>
      <g id="a-Chair">
        <path className="ac15" d="M132.47,958.39v-428.29s16.6-93.38,110.65-88.18h426.01s49.79,49.46,49.79,104.78v411.69H132.47Z"/>
        <path className="ac13" d="M129.61,928.83l-44.26,70.04s-38.73,54.93,44.26,77.06c82.99,22.13,630.71,0,630.71,0,0,0,33.2-43.21,0-68.63-33.2-25.42-38.73-63.76-38.73-63.76l-591.98-14.71Z"/>
        <path className="ac14" d="M616.59,1055.21l49.79,405.1s38.73,45.65,38.73,0-44.26-405.1-44.26-405.1h-44.26Z"/>
        <path className="ac14" d="M219.58,1055.21l-41.21,439.06s-32.05,49.47-32.05,0c0-49.47,36.63-439.06,36.63-439.06h36.63Z"/>
        <path className="ac14" d="M106.81,1055.64l-22.7,521.88s30.75,33.31,28.55,0c-2.2-33.31,57.64-521.88,57.64-521.88h-63.49Z"/>
        <path className="ac14" d="M744.58,1055.64l22.7,521.88s-30.75,33.31-28.55,0c2.2-33.31-57.64-521.88-57.64-521.88h63.49Z"/>
        <path className="ac19" d="M129.61,918.03l-44.26,48.4s-38.73,37.96,44.26,53.25c82.99,15.29,630.71,0,630.71,0,0,0,33.2-29.86,0-47.43-33.2-17.57-38.73-44.06-38.73-44.06l-591.98-10.16Z"/>
      </g>
      <g id="a-Feets">
        <path className="ac10" d="M478.1,1312.66l-21.45,86.81s-1.67,3.4-3.74,8.5c-4.08,10.07-9.7,26.77-6.99,36.95l32.17,22.47s15.32-9.7,18.38,16.34c0,0,41.36,38.3,103.15,29.62,0,0,35.74-5.11,20.43-37.79,0,0,.21-30.64-24.15-39.32,0,0-40.7-33.19-35.08-70.47l6.13-33.19s-72-3.06-88.85-19.91Z"/>
        <path className="ac23" d="M455.87,1401.13c2.03,3.99,9.69,9,13.01,11.88,4.53,3.94,8.86,8.11,13.1,12.35,8.51,8.51,16.65,17.4,25.41,25.67,29.94,28.25,73.18,43.02,112.67,24.52"/>
        <path className="ac23" d="M451.98,1410.32c2.03,3.99,11.51,9.9,14.83,12.78,4.53,3.94,8.86,8.11,13.1,12.35,8.51,8.51,16.65,17.4,25.41,25.67,29.94,28.25,78.21,41.13,117.69,22.64"/>
        <path className="ac23" d="M466.77,1358.53s19.84,27.34,9.59,61.33"/>
        <path className="ac23" d="M488.85,1432.37s9.68-25.49,39.55,1.06c0,0,25.79-8.68,14.3-23.11-11.49-14.43-16.49-58.61-10.67-80.95"/>
        <polygon className="ac26" points="566.95 1332.58 531.08 1333.72 564.65 1345.02 528.14 1350.19 562.4 1357.24 530.73 1371.67 562.32 1387.41 536.31 1402.28 566.95 1401.13 544.75 1413.64 575.3 1413.64 540.95 1407.81 564.85 1394.9 532.8 1384.55 560.35 1370.66 529.7 1358.53 563.27 1352.52 529.97 1342.52 566.95 1332.58"/>
        <path className="ac10" d="M343.8,1315.98l-21.45,86.81s-1.67,3.4-3.74,8.5c-4.08,10.07-9.7,26.77-6.99,36.95l32.17,22.47s15.32-9.7,18.38,16.34c0,0,41.36,38.3,103.15,29.62,0,0,35.74-5.11,20.43-37.79,0,0,.21-30.64-24.15-39.32,0,0-40.7-33.19-35.08-70.47l6.13-33.19s-72-3.06-88.85-19.91Z"/>
        <path className="ac23" d="M321.57,1404.45c2.03,3.99,9.69,9,13.01,11.88,4.53,3.94,8.86,8.11,13.1,12.35,8.51,8.51,16.65,17.4,25.41,25.67,29.94,28.25,73.18,43.02,112.67,24.52"/>
        <path className="ac23" d="M317.69,1413.64c2.03,3.99,11.51,9.9,14.83,12.78,4.53,3.94,8.86,8.11,13.1,12.35,8.51,8.51,16.65,17.4,25.41,25.67,29.94,28.25,78.21,41.13,117.69,22.64"/>
        <path className="ac23" d="M332.47,1361.85s19.84,27.34,9.59,61.33"/>
        <path className="ac23" d="M354.55,1435.69s9.68-25.49,39.55,1.06c0,0,25.79-8.68,14.3-23.11-11.49-14.43-16.49-58.61-10.67-80.95"/>
        <polygon className="ac26" points="432.65 1335.9 396.78 1337.04 430.35 1348.34 393.84 1353.51 428.1 1360.56 396.43 1374.99 428.02 1390.73 402.01 1405.6 432.65 1404.45 410.46 1416.96 441 1416.96 406.65 1411.13 430.56 1398.22 398.5 1387.87 426.05 1373.98 395.4 1361.85 428.97 1355.84 395.67 1345.84 432.65 1335.9"/>
      </g>
      <g id="a-Legs">
        <path className="ac17" d="M449.03,822.46l-77.75-5.3-89.22,29.81s-85.79,111.83,0,174.64l64.43,38.3-69.02,245.11s67.4,70.47,179.23,41.36v-13.79s99.57,32.17,145.53,13.79l58.21-324.77s1.91-73.33-80.82-125.42l-32.39-19.74-98.2-53.99Z"/>
        <path className="ac23" d="M297.37,903.65s49.79-28.34,88.85-6.89"/>
        <path className="ac23" d="M430.5,955.74s30.02,16.09,36.15,46.72"/>
        <line className="ac23" x1="366.3" y1="1017.02" x2="351.75" y2="1053.78"/>
        <line className="ac23" x1="458.99" y1="1066.04" x2="400.01" y2="1322.63"/>
        <path className="ac23" d="M452.5,925.1s83.08,42.13,55.51,140.94l-49.02,261.19"/>
        <path className="ac23" d="M554.73,903.65s71.23,65.87,56.68,113.36"/>
        <line className="ac23" x1="607.58" y1="1072.16" x2="554.73" y2="1331.06"/>
      </g>
      <g id="a-Hairs">
        <path className="ac3" d="M408.4.79s-181.79-9.19-209.36,198.13c0,0-21.45,62.3,0,247.14,4.8,41.34,4.06,83.99-4.42,124.75-11.01,52.94-31.18,104.73-30.52,159.51.45,37.48,9.22,83.5,37.99,110.08,31.42,29.02,82.53,37.74,123.14,43.48,52.1,7.36,105.48,10.11,157.11-.07,51.63-10.18,101.67-34.17,136.41-73.69,55.65-63.29,47.25-146.32,26.59-222.09-9.61-49.66-22.12-99.88-26.56-150.23-6.72-76.13,11.72-152.65-.49-228.55-8.61-53.52-33.39-104.05-69.24-144.59C509.38,19.82,469.13-4.84,408.4.79Z"/>
        <path className="ac2" d="M407.02,83.52c1.21,8.36-13.22,24.23-18.18,29.91-12.33,14.13-28.34,25.5-45.34,33.29-6.76,3.1-13.79,5.68-20.19,9.48-41.64,24.76-58.74,89.68-49.06,134.63,0,0,17.36,80.68,16.34,120.51-.59,22.87-6.5,45.87-12.03,67.95-2.73,10.89-5.67,21.73-8.75,32.52-2.37,8.31-9.73,21.95-6.3,30.06,1.87,4.42,5.47,7.84,9.04,11.06,38.64,34.87,85.21,60.7,138.65,58.42,31.17-1.33,61.26-11.53,88.53-26.31,17.95-9.73,34.77-21.46,50.61-34.31,10.32-8.37,15.24-9.23,10.23-21.52-7.91-19.4-20.82-37.33-26.95-57.45-10.24-33.61-12.28-69.73-5.66-104.25,10.78-56.18,44.43-126.16-10.61-171.34-20.89-17.15-48.79-23.01-69.28-40.67s-37.04-44.42-41.04-71.99Z"/>
      </g>
      <g id="a-Torso">
        <path className="ac1" d="M329.85,480.99s-72,18.38-76.6,36.77l26.04,82.21s-12.6,47.63,8.7,102.45c2.17,5.58,7.27,11.9,8.39,17.7,0,0,11.06,75.23-9.94,109.64s-11.66,33.42-11.66,33.42l144.78-42.19,126.48,59.97-22.16-61.42s-5.62-54.13,3.57-93.45,18.38-57.7,18.38-57.7c0,0,7.66-41.87-3.06-56.17l29.11-93.45s-54.43-30.1-84.87-42.4c0,0-65.53,44.94-76.77,88.17,0,0-49.34-93.06-80.4-83.55Z"/>
        <path className="ac20" d="M342.21,470.53s-51.86,23.05-51.86,23.05c-1.24.58.49,21.32.45,22.98-.44,17.97-1.6,35.95-3.74,53.8-4.36,36.37-22.36,74.52-8.72,110.98,3.03,8.09,7.49,15.58,10.73,23.59,10.8,26.77,11.81,64.19.88,91.08-1.49,3.67-14.17,68.5-18.04,66.21,0,0,58.82,23.87,147.67-41.23,0,0,52.3,71.12,128.9,59.63,0,0-26.25-85.66-19.37-119.37,2.77-13.58,1.48-28.48,3.68-42.3,3.81-23.85,18.3-47.92,19.33-71.51.56-12.78-2.49-26.16-4.1-38.81-1.44-11.28-9.09-25.92-8.96-36.58,0,0,.7-71.87.7-71.87l-50.16-23.03s-.1,0-.12.05c-1.18,3.89-40.59,132.87-76.05,164.55,0,0-78.89-104.24-71.23-171.23Z"/>
        <rect className="ac23" x="300.84" y="770.22" width="67.4" height="10.36" transform="translate(117.81 -40.81) rotate(8.47)"/>
        <rect className="ac23" x="465.06" y="767.94" width="63.22" height="16.75" transform="translate(-56.07 38.87) rotate(-4.24)"/>
        <polyline className="ac23" points="413.44 641.76 425.69 660.9 419.57 817.16"/>
        <circle className="ac23" cx="406.38" cy="675.12" r="8.68"/>
        <circle className="ac23" cx="406.38" cy="731.77" r="8.68"/>
        <circle className="ac23" cx="405.37" cy="785.94" r="8.68"/>
        <path className="ac5" d="M362.07,445.23s-5.1,18.26,3.86,37.55c10.87,23.39,43.29,74.27,43.29,74.27l3.35-3.75,1.47-2.6,40.99-72.39.78-30.88s25.41,21.28,35.62,34.56v68.77l-39.15-33.36-42.89,49.7-46.3-48.68-36.09,32.68,2.04-69.45s22.47-34.38,33.02-36.43Z"/>
      </g>
      <g id="a-ArmRL"><path className="ac1" d="M272.18,779.01l-83.74,4.09s-17.36,52.59,93.96,98.81l74.55,28.91s-5.11-43.97,28.6-57.24c0,0-99.06-65.36-113.36-74.55Z"/><circle className="ac1" cx="232.57" cy="776.31" r="45.11"/></g>
      <g id="a-ArmRU"><path className="ac1" d="M256.45,513.86c-25.1,22.52-37.61,60.48-46.28,91.92-8.35,30.28-13.79,61.31-17.07,92.53-1.6,15.26-2.68,30.57-3.32,45.9-.55,13.06-4.25,33.33.4,45.2,24.26-5.06,50.61-13.87,73.02-24.5,16.76-7.94,17.38-33.32,19-49.01,3.43-33.3,4.77-66.35,4.17-99.82-.16-8.74-.37-17.51-1.81-26.12-4.48-26.74-20.43-50.13-28.04-76.15-.02.02-.04.04-.06.05Z"/><circle className="ac1" cx="234.24" cy="777.59" r="46.39"/></g>
      <g id="a-ArmLL"><path className="ac1" d="M551.55,781.01l83.74,4.09s17.36,52.59-93.96,98.81l-74.55,28.91s5.11-43.97-28.6-57.24c0,0,99.06-65.36,113.36-74.55Z"/><circle className="ac1" cx="591.16" cy="778.31" r="45.11"/></g>
      <g id="a-ArmLU"><path className="ac1" d="M571.08,518.27c25.1,22.52,33.8,58.07,42.48,89.5,8.35,30.28,13.79,61.31,17.07,92.53,1.6,15.26,2.68,30.57,3.32,45.9.55,13.06,4.25,33.33-.4,45.2-24.26-5.06-50.61-13.87-73.02-24.5-16.76-7.94-17.38-33.32-19-49.01-3.43-33.3-4.77-66.35-4.17-99.82.16-8.74.37-17.51,1.81-26.12,4.48-26.74,20.43-50.13,28.04-76.15.02.02,3.84,2.45,3.86,2.47Z"/><circle className="ac1" cx="589.49" cy="779.59" r="46.39"/></g>
      <g id="a-HandR">
        <path className="ac22" d="M371.9,853.71s92.57-4.91,108.53,54.86c0,0,5.02,4.5-7.75,3.28,0,0,5.47,24.56-10.03,12.28,0,0,.91,19.65-18.7,6.14,0,0-1.31,14.4-17.3,4.74l-24.2-17.84s-33.74-.62-51.07-21.19c0,0-4.56-31.62,20.52-42.27Z"/>
        <path className="ac25" d="M438.47,882.78s25.08,7.78,34.2,29.07"/>
        <path className="ac25" d="M429.21,889.33c12.75,11.6,25.49,23.2,38.24,34.8"/>
        <path className="ac25" d="M408.83,903.25s34.2,16.38,35.11,27.02"/>
      </g>
      <g id="a-HandL">
        <path className="ac22" d="M461.54,856.09s-80.47-6.2-95.68,55.12c0,0-4.78,4.62,7.39,3.36,0,0-5.22,25.2,9.56,12.6,0,0-.87,20.16,17.82,6.3,0,0,1.25,14.77,16.49,4.86l23.07-18.3s29.05-.1,45.57-21.2c0,0,7.06-35.15-24.23-42.74Z"/>
        <path className="ac25" d="M404.47,884.75s-23.1,7.98-31.5,29.82"/>
        <path className="ac25" d="M416.23,891.47c-11.34,11.9-22.68,23.8-34.02,35.7"/>
        <path className="ac25" d="M431.76,905.75s-31.5,16.8-32.34,27.72"/>
      </g>
      <g id="a-HeadBase">
        <path className="ac7" d="M405.23,83.52s-20.43,48.51-68.43,64.34c0,0-66.89,36.77-64.34,106.21,1.27,34.64-.01,72.87,19.65,103.25,11.15,17.23,28.33,30.05,44.36,42.46s34.66,24.18,55.51,27.31c64.39,9.65,127.83-47.55,144.66-106.3,6.36-22.2,8.04-45.41,9.33-68.36,1.1-19.53-12.43-34.55-25.29-48.11-16.61-17.53-36.96-31.58-59.81-39.6,0,0-45.96-22.98-55.66-81.19Z"/>
        <path className="ac7" d="M363.69,417.6l-3.99,59.79,49.52,81.83,48-84.77-2.02-57.98s-49.34,24.5-91.51,1.14Z"/>
        <path className="ac8" d="M363.69,417.6l-.72,16.58s47.9,36.02,92.84-.23l-.61-17.49s-43.97,25.01-91.51,1.14Z"/>
      </g>
      <g id="a-Ear">
        <path className="ac7" d="M585.8,277.23c0,22.56-14.86,40.85-33.19,40.85-4.75,0-11.29-1.27-15.38-3.49,1.09-2.67,2.65-6.32,3.35-10.46,2.66-15.72,4.16-39.58,3.96-54.06-.1-7.23-.29-12.09-.3-12.36l-.5.35c2.67-.85,5.98-1.67,8.87-1.67,18.33,0,33.19,18.29,33.19,40.85Z"/>
        <path className="ac16" d="M566.32,277.23c0,15.01-9.89,27.18-22.08,27.18-.78,0-5.34.15-3.95,0,2.66-15.72,4.45-39.87,4.25-54.35,12.05.19,21.78,12.28,21.78,27.17Z"/>
        <ellipse className="ac4" cx="553.28" cy="318.08" rx="9.25" ry="10.67"/>
      </g>
      <g id="a-Nose"><path className="ac18" d="M399.3,327.31c1.45.4,2.95.62,4.45.64,8.31.11,7.9-3.83,2.35-8.35,0,0-18.88-7.14-1.02-47.48-.41.93-2.96,2.27-3.74,2.96-3.53,3.16-6.5,6.99-8.92,11.05-5.81,9.72-10.76,23.35-3.73,33.71,2.46,3.62,6.35,6.31,10.61,7.48Z"/></g>
      <g id="a-Mouth"><path className="ac24" d="M360.67,345.81s40.85,32,82.38-5.79"/></g>
      <g id="a-EyeRW">
        <path className="ac9" d="M275.24,235.22s30.5,49.36,58.04,49.36c27.54,0,37.62-14.98,37.62-14.98,0,0-12.96-45.11-40.17-40.85-28.26,4.43-55.49,6.47-55.49,6.47Z"/>
        <path className="ac12" d="M290.49,251.68c2.47,11.06,23.58,34.89,47.75,32.9s32.66-14.92,32.66-14.92c0,0-13.31-34.15-36.06-34.15s-46.75,5.44-44.35,16.17Z"/>
      </g>
      <g id="a-EyeRI"><circle className="ac6" cx="337.24" cy="258.23" r="22.72"/></g>
      <g id="a-EyeRP"><circle className="ac12" cx="347.81" cy="249.09" r="7.55"/></g>
      <g id="a-EyeLW">
        <path className="ac9" d="M524.77,237.27s-30.5,49.36-58.04,49.36-37.62-14.98-37.62-14.98c0,0,12.96-45.11,40.17-40.85,28.26,4.43,55.49,6.47,55.49,6.47Z"/>
        <path className="ac12" d="M509.52,253.73c-2.47,11.06-23.58,34.89-47.75,32.9s-32.66-14.92-32.66-14.92c0,0,13.31-34.15,36.06-34.15s46.75,5.44,44.35,16.17Z"/>
      </g>
      <g id="a-EyeLI"><circle className="ac6" cx="462.77" cy="260.28" r="22.72"/></g>
      <g id="a-EyeLP"><circle className="ac12" cx="452.2" cy="251.13" r="7.55"/></g>
      <g id="a-EyebrowR"><path className="ac21" d="M360.03,211.46c.42.13.84.24,1.27.34,6.29,1.45,13.23-2.27,9.47-9.17-5.55-10.19-26.3-10.99-36.64-11.5-15.6-.77-32.46,2.04-44.11,13.28-3.03,2.93-7.65,9.99-7.65,9.99,0,0,18.51-6.1,27.98-7.77,8.26-1.46,16.71-2.24,25.09-1.71,4.38.28,8.68.95,12.93,2.03s7.66,3.31,11.65,4.51Z"/></g>
      <g id="a-EyebrowL"><path className="ac21" d="M437.84,211.46c-.42.13-.84.24-1.27.34-6.29,1.45-13.23-2.27-9.47-9.17,5.55-10.19,26.3-10.99,36.64-11.5,15.6-.77,32.46,2.04,44.11,13.28,3.03,2.93,7.65,9.99,7.65,9.99,0,0-18.51-6.1-27.98-7.77-8.26-1.46-16.71-2.24-25.09-1.71-4.38.28-8.68.95-12.93,2.03s-7.66,3.31-11.65,4.51Z"/></g>
    </svg>
  );
}

/* ─── MEDSIM LOGO ─── */
function MedSimLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#6C5CE7"/>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(7,8)"/>
    </svg>
  );
}

/* ─── REVEAL HOOK ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

/* ─── LANDING PAGE ─── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tabs = ['Live Consultation', 'Dashboard', 'Case History'];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#18171F', background: '#fff', overflowX: 'hidden', lineHeight: 1.6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        :root {
          --purple: #6C5CE7; --purple-dark: #5649c0; --purple-light: #8B7FF0;
          --purple-soft: #EDE9FF; --purple-bg: #F5F3FF;
          --gray-50: #F8F8FA; --gray-100: #F0EFF5; --gray-200: #E4E2EE;
          --gray-400: #9896A8; --gray-600: #5C5A6E; --gray-900: #18171F;
          --green: #00B894; --amber: #F59E0B;
          --shadow-sm: 0 2px 8px rgba(108,92,231,0.08);
          --shadow: 0 8px 32px rgba(108,92,231,0.12);
          --shadow-lg: 0 24px 64px rgba(108,92,231,0.18);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        h1,h2,h3,h4,h5 { font-family: 'Sora', sans-serif; line-height: 1.2; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideLeft { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .btn-ghost { padding:8px 20px;border-radius:10px;border:1.5px solid #E4E2EE;background:transparent;color:#5C5A6E;font-family:'Sora',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all .2s; }
        .btn-ghost:hover { border-color:var(--purple);color:var(--purple);background:var(--purple-soft); }
        .btn-primary-nav { padding:9px 22px;border-radius:10px;background:var(--purple);color:white;font-family:'Sora',sans-serif;font-size:.88rem;font-weight:600;border:none;cursor:pointer;text-decoration:none;transition:all .2s;box-shadow:0 4px 14px rgba(108,92,231,.3); }
        .btn-primary-nav:hover { background:var(--purple-dark);transform:translateY(-1px);box-shadow:0 6px 20px rgba(108,92,231,.4); }
        .hero-badge-dot { width:6px;height:6px;border-radius:50%;background:var(--purple);animation:pulse-dot 2s infinite; }
        .float-card { position:absolute;background:white;border-radius:12px;box-shadow:var(--shadow);padding:12px 16px;border:1px solid #E4E2EE;animation:float 4s ease-in-out infinite;display:flex;align-items:center;gap:10px;white-space:nowrap; }
        .step-card { background:white;border-radius:24px;padding:36px 32px;border:1px solid #E4E2EE;transition:all .3s;position:relative;overflow:hidden; }
        .step-card::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--purple);transform:scaleX(0);transform-origin:left;transition:transform .3s; }
        .step-card:hover { transform:translateY(-6px);box-shadow:var(--shadow); }
        .step-card:hover::before { transform:scaleX(1); }
        .dept-card { background:white;border-radius:16px;padding:24px 20px;border:1px solid #E4E2EE;text-align:center;cursor:pointer;transition:all .25s; }
        .dept-card:hover { border-color:var(--purple);transform:translateY(-4px);box-shadow:var(--shadow); }
        .review-card { background:#F8F8FA;border-radius:16px;padding:28px 24px;border:1px solid #E4E2EE;transition:all .3s; }
        .review-card:hover { transform:translateY(-4px);box-shadow:var(--shadow);background:white; }
        .tool-chip { padding:4px 10px;border-radius:6px;border:1px solid #E4E2EE;background:white;font-size:.7rem;font-weight:500;color:#5C5A6E;cursor:pointer;transition:all .15s; }
        .tool-chip:hover { border-color:var(--purple);color:var(--purple);background:var(--purple-soft); }
        .tool-chip.active { border-color:#00B894;color:#00B894;background:rgba(0,184,148,.08); }
        .sc-tool-btn { padding:7px 12px;border-radius:8px;border:1px solid #E4E2EE;background:white;font-size:.75rem;font-weight:500;color:#5C5A6E;cursor:pointer;text-align:left;transition:all .15s;width:100%; }
        .sc-tool-btn:hover { border-color:var(--purple);color:var(--purple); }
        .sc-tool-btn.checked { border-color:#00B894;color:#00B894;background:rgba(0,184,148,.05); }
        .showcase-tab { padding:8px 20px;border-radius:10px;font-family:'Sora',sans-serif;font-size:.85rem;font-weight:600;border:1.5px solid #E4E2EE;background:white;color:#5C5A6E;cursor:pointer;transition:all .2s; }
        .showcase-tab.active, .showcase-tab:hover { background:var(--purple);color:white;border-color:var(--purple); }
        .footer-link { color:rgba(255,255,255,.5);text-decoration:none;font-size:.85rem;transition:color .2s;display:block;margin-bottom:10px; }
        .footer-link:hover { color:white; }
        .feature-pill { padding:6px 14px;border-radius:8px;background:var(--purple-soft);color:var(--purple);font-size:.8rem;font-weight:600;display:inline-block;margin:4px 4px 0 0; }
        @media (max-width:1024px){
          .hero-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .dept-grid { grid-template-columns: repeat(2,1fr) !important; }
          .reviews-grid { grid-template-columns: 1fr 1fr !important; }
          .feature-row { grid-template-columns: 1fr !important; direction: ltr !important; }
          .showcase-sidebar-l, .showcase-sidebar-r { display:none !important; }
          .showcase-body { grid-template-columns: 1fr !important; }
          .footer-top { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width:640px){
          .nav-links { display:none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .dept-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hero-stats { flex-wrap:wrap; }
          .footer-top { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: 64,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E4E2EE',
        boxShadow: scrolled ? '0 2px 8px rgba(108,92,231,0.08)' : 'none',
        transition: 'box-shadow 0.3s'
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#18171F' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#6C5CE7' }}>MedSim</span>
        </a>

        <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32, listStyle: 'none' }}>
          {[['#features','Features'],['#showcase','Product'],['#departments','Departments'],['#reviews','Testimonials']].map(([href,label]) => (
            <li key={href}><a href={href} style={{ textDecoration: 'none', color: '#5C5A6E', fontSize: '.9rem', fontWeight: 500 }}>{label}</a></li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="btn-ghost">Sign In</Link>
          <Link to="/signup" className="btn-primary-nav">Get Started</Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 5% 80px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* BG */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(108,92,231,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 70%, rgba(108,92,231,0.05) 0%, transparent 70%)' }}/>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: .35, backgroundImage: 'linear-gradient(rgba(108,92,231,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(108,92,231,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)' }}/>

        <div className="hero-grid" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {/* Left Content */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: '#EDE9FF', border: '1px solid rgba(108,92,231,0.2)', fontSize: '.82rem', fontWeight: 600, color: '#6C5CE7', marginBottom: 24, animation: 'fadeSlideUp 0.6s ease both' }}>
              <span className="hero-badge-dot"/>
              AI-Powered Medical Training
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.1, color: '#18171F', animation: 'fadeSlideUp 0.7s ease 0.1s both' }}>
              Train like a<br/><span style={{ color: '#6C5CE7' }}>real doctor.</span><br/>Learn without limits.
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#5C5A6E', marginTop: 20, maxWidth: 420, fontWeight: 400, lineHeight: 1.7, animation: 'fadeSlideUp 0.7s ease 0.2s both' }}>
              Practice clinical consultations with AI patients across every department. Get evaluated, improve your technique, and graduate with confidence.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36, animation: 'fadeSlideUp 0.7s ease 0.3s both' }}>
              <Link to="/signup" style={{ padding: '14px 30px', borderRadius: 12, background: '#6C5CE7', color: 'white', fontFamily: "'Sora',sans-serif", fontSize: '.95rem', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 24px rgba(108,92,231,0.35)', transition: 'all .25s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start Free Today
              </Link>
              <Link to="/login" style={{ padding: '14px 30px', borderRadius: 12, background: 'white', color: '#6C5CE7', fontFamily: "'Sora',sans-serif", fontSize: '.95rem', fontWeight: 700, border: '2px solid #E4E2EE', cursor: 'pointer', textDecoration: 'none', transition: 'all .25s' }}>
                I already have an account
              </Link>
            </div>
            <div className="hero-stats" style={{ display: 'flex', gap: 32, marginTop: 44, animation: 'fadeSlideUp 0.7s ease 0.4s both' }}>
              {[['12+','Departments'],['50+','Patient Cases'],['100%','AI-Evaluated']].map(([num,label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#18171F' }}>{num}</div>
                  <div style={{ fontSize: '.82rem', color: '#9896A8', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — UI Card */}
          <div style={{ position: 'relative', animation: 'fadeSlideLeft 0.8s ease 0.2s both' }}>
            <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 24px 64px rgba(108,92,231,0.18)', overflow: 'hidden', border: '1px solid #E4E2EE' }}>
              {/* Topbar */}
              <div style={{ background: '#6C5CE7', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'white', fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.9rem' }}>Cardiology · Case #51</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  13:08
                </span>
              </div>
              {/* Body */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 320 }}>
                {/* Sidebar — character */}
                <div style={{ background: '#F8F8FA', padding: 20, borderRight: '1px solid #E4E2EE', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* CHARACTER — Anum in hero */}
                  <div style={{
                    width: '100%',
                    height: 180,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #EDE9FF, #F5F3FF)',
                    border: '2px solid #E4E2EE',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '0 8px'
                  }}>
                    <div style={{ width: '100%', height: '340px', marginTop: -40 }}>
                      <AnumCharacter />
                    </div>
                  </div>
                  <div style={{ fontSize: '.78rem' }}>
                    <div style={{ color: '#9896A8', fontSize: '.72rem' }}>Name</div>
                    <div style={{ color: '#18171F', fontWeight: 600 }}>Anum Shahzad</div>
                  </div>
                  <div style={{ fontSize: '.78rem' }}>
                    <div style={{ color: '#9896A8', fontSize: '.72rem' }}>Age Group</div>
                    <div style={{ color: '#18171F', fontWeight: 600 }}>Adult</div>
                  </div>
                  <div style={{ fontSize: '.78rem' }}>
                    <div style={{ color: '#9896A8', fontSize: '.72rem' }}>Department</div>
                    <div style={{ color: '#18171F', fontWeight: 600 }}>Cardiology</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 100, background: 'rgba(0,184,148,0.1)', color: '#00B894', fontSize: '.67rem', fontWeight: 700 }}>Active</span>
                    <span style={{ padding: '3px 8px', borderRadius: 100, background: 'rgba(108,92,231,0.1)', color: '#6C5CE7', fontSize: '.67rem', fontWeight: 700 }}>In Session</span>
                  </div>
                </div>
                {/* Chat */}
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: '#FAFAFA' }}>
                  <div>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9896A8', marginBottom: 3 }}>Patient</div>
                    <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 12, fontSize: '.78rem', lineHeight: 1.5, background: 'white', border: '1px solid #E4E2EE', borderBottomLeftRadius: 4 }}>The palpitations happen 2–3 times a week. Sometimes during exercise, sometimes at rest. It's hard to predict…</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 12, fontSize: '.78rem', lineHeight: 1.5, background: '#6C5CE7', color: 'white', borderBottomRightRadius: 4, boxShadow: '0 3px 10px rgba(108,92,231,.3)' }}>How often are you getting these palpitations — daily, a few times a week, or less?</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9896A8', marginBottom: 3 }}>Patient</div>
                    <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 12, fontSize: '.78rem', lineHeight: 1.5, background: 'white', border: '1px solid #E4E2EE', borderBottomLeftRadius: 4 }}>Not daily, no. About 2–3 times a week on average.</div>
                  </div>
                  {/* Tools row */}
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #E4E2EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="tool-chip active">ECG ✓</button>
                      <button className="tool-chip">Echo</button>
                      <button className="tool-chip">Stress Test</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, fontSize: '.72rem' }}>
                      <span style={{ fontWeight: 700, color: '#6C5CE7' }}>Session Progress</span>
                      <div style={{ width: 80, height: 5, background: '#E4E2EE', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#6C5CE7', borderRadius: 10, width: '60%' }}/>
                      </div>
                      <span style={{ color: '#9896A8' }}>60%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Float cards */}
            <div className="float-card" style={{ top: -24, right: -20, animationDelay: '0s' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,184,148,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontSize: '.78rem' }}>
                <strong style={{ display: 'block', fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.82rem' }}>ECG Ordered</strong>
                <span style={{ color: '#9896A8' }}>Good clinical instinct!</span>
              </div>
            </div>
            <div className="float-card" style={{ bottom: -20, left: -16, animationDelay: '1.5s' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EDE9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div style={{ fontSize: '.78rem' }}>
                <strong style={{ display: 'block', fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.82rem' }}>Score: 87%</strong>
                <span style={{ color: '#9896A8' }}>Case passed — great work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: '#F8F8FA', padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: '#18171F' }}>From classroom to clinic — in three steps</h2>
            <p style={{ fontSize: '1.05rem', color: '#5C5A6E', marginTop: 14, maxWidth: 520, margin: '14px auto 0', lineHeight: 1.7 }}>A structured learning path designed to build real clinical competence, not just exam scores.</p>
          </Reveal>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginTop: 56 }}>
            {[
              { icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>, num: '01', title: 'Choose Your Patient', desc: 'Select a department, pick an age group, and meet your AI patient. Each case is unique, dynamically generated, and clinically grounded.' },
              { icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, num: '02', title: 'Run the Consultation', desc: 'Ask history questions, order relevant tests, perform physical exams, and arrive at a diagnosis — exactly like a real clinical encounter.' },
              { icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>, num: '03', title: 'Get Evaluated', desc: 'Receive a detailed clinical assessment with scores, feedback, and areas to improve. Track your growth across cases and departments.' },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div className="step-card">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: '#EDE9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{step.icon}<circle cx="9" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '3rem', fontWeight: 800, color: '#EDE9FF', lineHeight: 1, marginBottom: 16 }}>{step.num}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{step.title}</div>
                  <p style={{ fontSize: '.9rem', color: '#5C5A6E', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ background: 'white', padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>Features</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: '#18171F' }}>Everything a future doctor needs</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 96, marginTop: 72 }}>

            {/* Feature 1 */}
            <Reveal>
              <div className="feature-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(108,92,231,0.18)', border: '1px solid #E4E2EE' }}>
                  <div style={{ background: '#6C5CE7', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontFamily: "'Sora',sans-serif", fontSize: '.82rem', fontWeight: 600 }}>
                    <span>Gynecology · Case #32</span><span style={{ opacity: .7, fontSize: '.78rem' }}>Session: 01:32</span>
                  </div>
                  <div style={{ padding: 20, background: '#F8F8FA', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { role: 'patient', text: "I've been experiencing some irregular periods and spotting in between. It's been going on for a few months now, and I'm getting a bit worried..." },
                      { role: 'doctor', text: 'Can you describe the spotting — is it light or heavy? And when in your cycle does it tend to happen?' },
                      { role: 'patient', text: "It's usually light, and it happens randomly — mid-cycle mostly. The cramps are worse during my actual period though." },
                    ].map((msg, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'doctor' ? 'flex-end' : 'flex-start' }}>
                        {msg.role === 'patient' && <div style={{ fontSize: '.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9896A8', marginBottom: 3 }}>Patient</div>}
                        <div style={{ maxWidth: '80%', padding: '9px 13px', borderRadius: 10, fontSize: '.77rem', lineHeight: 1.5, background: msg.role === 'doctor' ? '#6C5CE7' : 'white', color: msg.role === 'doctor' ? 'white' : '#444', border: msg.role === 'patient' ? '1px solid #E4E2EE' : 'none', borderBottomLeftRadius: msg.role === 'patient' ? 3 : 10, borderBottomRightRadius: msg.role === 'doctor' ? 3 : 10 }}>{msg.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.76rem', fontWeight: 700, marginBottom: 16 }}>AI Virtual Patients</span>
                  <h3 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, marginBottom: 16 }}>Patients that respond like real people</h3>
                  <p style={{ fontSize: '.97rem', color: '#5C5A6E', lineHeight: 1.7, marginBottom: 28 }}>Our AI-powered patients engage in natural conversation, show realistic emotional states, and respond contextually to your clinical approach — so every session feels like the real thing.</p>
                  <div>
                    {['Dynamic Dialogue','Emotional Realism','7 Patient Types'].map(p => <span key={p} className="feature-pill">{p}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal>
              <div className="feature-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', direction: 'rtl' }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(108,92,231,0.18)', border: '1px solid #E4E2EE', direction: 'ltr' }}>
                  <div style={{ padding: 24, background: '#F8F8FA' }}>
                    <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#6C5CE7', marginBottom: 16 }}>Clinical Tools Panel</div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#5C5A6E', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Physical Examination</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        <button className="tool-chip">JVP Assessment</button>
                        <button className="tool-chip">Oedema Check</button>
                        <button className="tool-chip active">Chest Exam ✓</button>
                        <button className="tool-chip">Clubbing</button>
                        <button className="tool-chip">Neck Veins</button>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#5C5A6E', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Order Tests</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {['ECG — View Result','Echo','Stress Test','Troponin','Lipid Panel'].map((t,i) => (
                          <button key={t} className={`sc-tool-btn${i===0?' checked':''}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ direction: 'ltr' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.76rem', fontWeight: 700, marginBottom: 16 }}>Clinical Tools</span>
                  <h3 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, marginBottom: 16 }}>Real clinical workflow, simulated perfectly</h3>
                  <p style={{ fontSize: '.97rem', color: '#5C5A6E', lineHeight: 1.7, marginBottom: 28 }}>Order tests, run physical examinations, and review results — all within a realistic clinical interface. Each action affects the patient's responses and your final evaluation score.</p>
                  <div>
                    {['Physical Exams','Lab Tests','Imaging Results'].map(p => <span key={p} className="feature-pill">{p}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal>
              <div className="feature-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(108,92,231,0.18)', border: '1px solid #E4E2EE' }}>
                  <div style={{ padding: 24, background: '#F8F8FA' }}>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Case Evaluation Report</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6C5CE7,#8B7FF0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: '1.4rem', flexShrink: 0 }}>87</div>
                      <div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '1rem' }}>Strong Performance</div>
                        <div style={{ fontSize: '.78rem', color: '#9896A8', marginTop: 2 }}>Cardiology · Hamza Noor</div>
                      </div>
                    </div>
                    {[
                      { label: 'History Taking', score: 90, color: '#00B894' },
                      { label: 'Diagnosis', score: 85, color: '#6C5CE7' },
                      { label: 'Test Selection', score: 80, color: '#6C5CE7' },
                      { label: 'Prescription', score: 75, color: '#F59E0B' },
                      { label: 'Counselling', score: 95, color: '#00B894' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: '.8rem', color: '#5C5A6E', width: 120, flexShrink: 0 }}>{item.label}</span>
                        <div style={{ flex: 1, height: 7, background: '#E4E2EE', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 10, background: item.color, width: `${item.score}%`, transition: 'width 1s ease' }}/>
                        </div>
                        <span style={{ fontSize: '.8rem', fontWeight: 700, width: 36, textAlign: 'right', color: item.color }}>{item.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.76rem', fontWeight: 700, marginBottom: 16 }}>AI Evaluation</span>
                  <h3 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, marginBottom: 16 }}>Feedback that actually makes you better</h3>
                  <p style={{ fontSize: '.97rem', color: '#5C5A6E', lineHeight: 1.7, marginBottom: 28 }}>Every session ends with a detailed clinical report — scores on history-taking, diagnosis, test ordering, and communication. No vague ratings, just precise, actionable feedback.</p>
                  <div>
                    {['Detailed Feedback','Progress Tracking'].map(p => <span key={p} className="feature-pill">{p}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section id="showcase" style={{ background: '#F8F8FA', padding: '96px 5%', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>Product</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: '#18171F' }}>Built for the way doctors actually learn</h2>
            <p style={{ fontSize: '1.05rem', color: '#5C5A6E', marginTop: 14, lineHeight: 1.7 }}>A complete clinical learning environment — from first consultation to final evaluation.</p>
          </Reveal>
          <div style={{ display: 'flex', gap: 8, margin: '40px 0 32px' }}>
            {tabs.map((tab, i) => (
              <button key={tab} className={`showcase-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
            ))}
          </div>
          <Reveal>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(108,92,231,0.18)', border: '1px solid #E4E2EE', background: 'white' }}>
              <div style={{ background: '#6C5CE7', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', fontFamily: "'Sora',sans-serif" }}>
                <span style={{ fontWeight: 700, fontSize: '.9rem' }}>Cardiology · Case #51</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[.7,.3,.3].map((op,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: `rgba(255,255,255,${op})` }}/>)}
                </div>
                <span style={{ fontSize: '.8rem', opacity: .75 }}>Session Time: 13:08</span>
              </div>
              <div className="showcase-body" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 240px', minHeight: 400 }}>
                {/* Left sidebar */}
                <div className="showcase-sidebar-l" style={{ borderRight: '1px solid #E4E2EE', padding: 20, background: 'white', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: '#F8F8FA', borderRadius: 12, padding: 16, border: '1px solid #E4E2EE', textAlign: 'center' }}>
                    {/* Character in showcase — properly sized */}
                    <div style={{ width: 80, height: 120, borderRadius: 10, background: 'linear-gradient(135deg,#e8e4ff,#c8bfff)', margin: '0 auto 10px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{ width: '100%', height: 130 }}>
                        <HamzaCharacter />
                      </div>
                    </div>
                    {[['Name','Hamza Noor'],['Age Group','Senior'],['Department','Cardiology']].map(([l,v]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '.72rem', color: '#9896A8' }}>{l}</span>
                        <span style={{ fontSize: '.72rem', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: '.67rem', fontWeight: 700, background: 'rgba(0,184,148,0.1)', color: '#00B894', marginTop: 6 }}>Active</span>
                  </div>
                </div>
                {/* Chat */}
                <div style={{ padding: 20, background: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { role: 'p', text: 'I have been having chest tightness for the past three days. It comes and goes, usually when I climb stairs or walk fast.' },
                    { role: 'd', text: 'Does the tightness radiate anywhere — to your arm, jaw, or back?' },
                    { role: 'p', text: 'Sometimes I feel it in my left arm. My wife told me to come in right away.' },
                    { role: 'd', text: 'I\'d like to order an ECG and troponin levels right away. Have you had any similar episodes before?' },
                  ].map((msg, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'd' ? 'flex-end' : 'flex-start' }}>
                      {msg.role === 'p' && <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9896A8', marginBottom: 3 }}>Patient</div>}
                      <div style={{ maxWidth: '82%', padding: '10px 14px', borderRadius: 12, fontSize: '.78rem', lineHeight: 1.5, background: msg.role === 'd' ? '#6C5CE7' : 'white', color: msg.role === 'd' ? 'white' : '#18171F', border: msg.role === 'p' ? '1px solid #E4E2EE' : 'none', borderBottomLeftRadius: msg.role === 'p' ? 3 : 12, borderBottomRightRadius: msg.role === 'd' ? 3 : 12 }}>{msg.text}</div>
                    </div>
                  ))}
                </div>
                {/* Right sidebar */}
                <div className="showcase-sidebar-r" style={{ borderLeft: '1px solid #E4E2EE', padding: 20, background: 'white', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#18171F' }}>Diagnostic Tools</div>
                    <div style={{ fontSize: '.68rem', color: '#9896A8', marginTop: 2 }}>Select to order</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['ECG — View Result','Echo','Stress Test','Troponin','Lipid Panel','Chest X-Ray'].map((t,i) => (
                      <button key={t} className={`sc-tool-btn${i===0?' checked':''}`}>{t}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', fontWeight: 600, marginBottom: 6, color: '#6C5CE7' }}>
                      <span>Session Progress</span><span>60%</span>
                    </div>
                    <div style={{ height: 6, background: '#E4E2EE', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#6C5CE7', borderRadius: 10, width: '60%' }}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── DEPARTMENTS ─── */}
      <section id="departments" style={{ background: '#F8F8FA', padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>Departments</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: '#18171F' }}>Train across every specialty</h2>
            <p style={{ fontSize: '1.05rem', color: '#5C5A6E', marginTop: 14 }}>12+ departments with new cases added regularly.</p>
          </Reveal>
          <div className="dept-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 48 }}>
            {[
              { name:'Cardiology', cases:14, icon:<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> },
              { name:'Gynecology', cases:10, icon:<circle cx="12" cy="12" r="10"/> },
              { name:'Neurology', cases:8, icon:<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/> },
              { name:'Orthopedics', cases:6, icon:<line x1="12" y1="2" x2="12" y2="22"/> },
              { name:'Dentistry', cases:9, icon:<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></> },
              { name:'Pediatrics', cases:11, icon:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
              { name:'Dermatology', cases:7, icon:<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/> },
              { name:'More Coming', cases:null, icon:<circle cx="11" cy="11" r="8"/> },
            ].map((dept, i) => (
              <Reveal key={dept.name} delay={(i % 4) * 0.1}>
                <div className="dept-card">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: '#EDE9FF', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{dept.icon}</svg>
                  </div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.9rem', marginBottom: 4 }}>{dept.name}</div>
                  <div style={{ fontSize: '.78rem', color: '#9896A8' }}>{dept.cases ? `${dept.cases} cases available` : 'Coming soon'}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews" style={{ background: 'white', padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 100, background: '#EDE9FF', color: '#6C5CE7', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>Student Voices</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: '#18171F' }}>Trusted by medical students everywhere</h2>
          </Reveal>
          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 56 }}>
            {[
              { initials:'SA', color:'#6C5CE7', name:'Sara Akhtar', meta:'Year 3 · CMHS Islamabad', stars:5, text:'The consultation feels incredibly real. The patient actually responds the way a real patient would — confused, anxious, sometimes vague. It\'s genuinely good practice.' },
              { initials:'MK', color:'#00B894', name:'Muhammad Kamran', meta:'Year 4 · Aga Khan University', stars:5, text:'The evaluation breakdown is what makes MedSim stand out. It tells you exactly what you got wrong and why — not just a score, but actual clinical reasoning feedback.' },
              { initials:'AH', color:'#E17055', name:'Ayesha Hussain', meta:'Year 5 · Dow Medical College', stars:4, text:'I use this before every OSCE. Running 5–6 cases the night before has genuinely helped me approach patients calmly and systematically. It builds real confidence.' },
            ].map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1}>
                <div className="review-card">
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {Array(5).fill(0).map((_,j) => <span key={j} style={{ color: j < r.stars ? '#F59E0B' : '#E4E2EE', fontSize: '.9rem' }}>★</span>)}
                  </div>
                  <p style={{ fontSize: '.92rem', color: '#5C5A6E', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{r.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.9rem', color: 'white' }}>{r.initials}</div>
                    <div>
                      <div style={{ fontSize: '.88rem', fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: '.76rem', color: '#9896A8' }}>{r.meta}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: '#6C5CE7', padding: '96px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 80% 30%, rgba(0,0,0,0.1) 0%, transparent 60%)' }}/>
        <Reveal style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Your first patient is waiting</h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', marginTop: 16, lineHeight: 1.7 }}>Start your free consultation today. No textbook can prepare you like a real encounter can.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ padding: '14px 32px', borderRadius: 12, background: 'white', color: '#6C5CE7', fontFamily: "'Sora',sans-serif", fontSize: '.95rem', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>Start First Consultation</Link>
            <Link to="/login" style={{ padding: '14px 32px', borderRadius: 12, background: 'transparent', color: 'white', fontFamily: "'Sora',sans-serif", fontSize: '.95rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.4)', cursor: 'pointer', textDecoration: 'none' }}>Sign In to My Account</Link>
          </div>
          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {['Free to start','No setup required','Instant access'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.65)', fontSize: '.82rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#18171F', color: 'rgba(255,255,255,0.6)', padding: '64px 5% 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white' }}>MedSim</span>
              </a>
              <p style={{ fontSize: '.88rem', lineHeight: 1.7, marginTop: 12, maxWidth: 260 }}>Train like a real doctor. AI-powered clinical simulations for medical students who want to learn without limits.</p>
            </div>
            {[
              { title:'Product', links:['Features','Departments','Leaderboard','Case History'] },
              { title:'Company', links:['About','Blog','Careers','Contact'] },
              { title:'Help', links:['Getting Started','FAQ','Support','Community'] },
              { title:'Legal', links:['Privacy Policy','Terms of Service','Cookie Policy'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.85rem', color: 'white', marginBottom: 16 }}>{col.title}</div>
                {col.links.map(link => <a key={link} href="#" className="footer-link">{link}</a>)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, fontSize: '.82rem', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>© 2026 MedSim. All rights reserved.</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '.78rem' }}>Built for the next generation of doctors.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
