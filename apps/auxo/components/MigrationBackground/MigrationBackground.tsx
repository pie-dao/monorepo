const MigrationBackground: React.FC = () => {
  return (
    <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden">
      <svg
        width="955"
        height="844"
        viewBox="0 0 955 844"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative left-[50%] h-[21.1875rem] max-w-none -translate-x-1/2 sm:h-[42.375rem]"
      >
        <g opacity="0.5">
          <g filter="url(#filter0_f_9656_217716)">
            <circle
              cx="478.313"
              cy="422.318"
              r="348.904"
              transform="rotate(180 478.313 422.318)"
              fill="url(#paint0_linear_9656_217716)"
              fillOpacity="0.3"
            />
          </g>
          <g filter="url(#filter1_f_9656_217716)">
            <circle
              cx="208.551"
              cy="548.263"
              r="171.899"
              transform="rotate(180 208.551 548.263)"
              fill="url(#paint1_linear_9656_217716)"
              fillOpacity="0.3"
            />
          </g>
          <g filter="url(#filter2_f_9656_217716)">
            <circle
              cx="827.218"
              cy="235.1"
              r="98.7144"
              transform="rotate(180 827.218 235.1)"
              fill="url(#paint2_linear_9656_217716)"
              fillOpacity="0.3"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_9656_217716"
            x="56.7424"
            y="0.747391"
            width="843.142"
            height="843.142"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              baseFrequency="0.01"
              numOctaves="1"
              seed="0"
              result="noise"
            />
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="36.3333"
              result="effect1_foregroundBlur_9656_217716"
            />
          </filter>
          <filter
            id="filter1_f_9656_217716"
            x="0.318398"
            y="340.03"
            width="416.465"
            height="416.465"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              baseFrequency="0.01"
              numOctaves="1"
              seed="0"
              result="noise"
            />
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="18.1667"
              result="effect1_foregroundBlur_9656_217716"
            />
          </filter>
          <filter
            id="filter2_f_9656_217716"
            x="699.437"
            y="107.319"
            width="255.562"
            height="255.562"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              baseFrequency="0.01"
              numOctaves="1"
              seed="0"
              result="noise"
            />
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="14.5333"
              result="effect1_foregroundBlur_9656_217716"
            />
          </filter>
          <linearGradient
            id="paint0_linear_9656_217716"
            x1="478.313"
            y1="73.414"
            x2="478.313"
            y2="771.222"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#42DDFF" />
            <stop offset="1" stopColor="#1170FF" stopOpacity="0.46" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_9656_217716"
            x1="208.551"
            y1="376.364"
            x2="208.551"
            y2="720.162"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F22FB0" />
            <stop offset="1" stopColor="#F58A25" stopOpacity="0" />
            <stop offset="1" stopColor="#7061A3" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_9656_217716"
            x1="827.218"
            y1="136.385"
            x2="827.218"
            y2="333.814"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7D40FF" />
            <stop offset="1" stopColor="#F58A25" stopOpacity="0" />
            <stop offset="1" stopColor="#7230FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default MigrationBackground;
