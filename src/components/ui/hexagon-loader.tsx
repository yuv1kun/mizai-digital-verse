
import React from 'react';

const HexagonLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        {/* Center gel */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 animate-pulse">
          <div className="hex-brick h1" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>

        {/* Ring 1 */}
        {[
          { class: "c1", ml: "-47px", mt: "-15px" },
          { class: "c2", ml: "-31px", mt: "-43px" },
          { class: "c3", ml: "1px", mt: "-43px" },
          { class: "c4", ml: "17px", mt: "-15px" },
          { class: "c5", ml: "-31px", mt: "13px" },
          { class: "c6", ml: "1px", mt: "13px" }
        ].map((gel, index) => (
          <div 
            key={`r1-${index}`}
            className="absolute top-1/2 left-1/2 w-8 h-8 animate-pulse"
            style={{ 
              marginLeft: gel.ml, 
              marginTop: gel.mt,
              animationDelay: '0.2s'
            }}
          >
            <div className="hex-brick h1" />
            <div className="hex-brick h2" />
            <div className="hex-brick h3" />
          </div>
        ))}

        {/* Ring 2 */}
        {[
          { class: "c7", ml: "-63px", mt: "-43px" },
          { class: "c8", ml: "33px", mt: "-43px" },
          { class: "c9", ml: "-15px", mt: "41px" },
          { class: "c10", ml: "-63px", mt: "13px" },
          { class: "c11", ml: "33px", mt: "13px" },
          { class: "c12", ml: "-15px", mt: "-71px" },
          { class: "c13", ml: "-47px", mt: "-71px" },
          { class: "c14", ml: "17px", mt: "-71px" },
          { class: "c15", ml: "-47px", mt: "41px" },
          { class: "c16", ml: "17px", mt: "41px" },
          { class: "c17", ml: "-79px", mt: "-15px" },
          { class: "c18", ml: "49px", mt: "-15px" }
        ].map((gel, index) => (
          <div 
            key={`r2-${index}`}
            className="absolute top-1/2 left-1/2 w-8 h-8 animate-pulse"
            style={{ 
              marginLeft: gel.ml, 
              marginTop: gel.mt,
              animationDelay: '0.4s'
            }}
          >
            <div className="hex-brick h1" />
            <div className="hex-brick h2" />
            <div className="hex-brick h3" />
          </div>
        ))}

        {/* Ring 3 */}
        {[
          { class: "c19", ml: "-63px", mt: "-99px" },
          { class: "c20", ml: "33px", mt: "-99px" },
          { class: "c21", ml: "1px", mt: "-99px" },
          { class: "c22", ml: "-31px", mt: "-99px" },
          { class: "c23", ml: "-63px", mt: "69px" },
          { class: "c24", ml: "33px", mt: "69px" },
          { class: "c25", ml: "1px", mt: "69px" },
          { class: "c26", ml: "-31px", mt: "69px" },
          { class: "c28", ml: "-95px", mt: "-43px" },
          { class: "c29", ml: "-95px", mt: "13px" },
          { class: "c30", ml: "49px", mt: "41px" },
          { class: "c31", ml: "-79px", mt: "-71px" },
          { class: "c32", ml: "-111px", mt: "-15px" },
          { class: "c33", ml: "65px", mt: "-43px" },
          { class: "c34", ml: "65px", mt: "13px" },
          { class: "c35", ml: "-79px", mt: "41px" },
          { class: "c36", ml: "49px", mt: "-71px" },
          { class: "c37", ml: "81px", mt: "-15px" }
        ].map((gel, index) => (
          <div 
            key={`r3-${index}`}
            className="absolute top-1/2 left-1/2 w-8 h-8 animate-pulse"
            style={{ 
              marginLeft: gel.ml, 
              marginTop: gel.mt,
              animationDelay: '0.6s'
            }}
          >
            <div className="hex-brick h1" />
            <div className="hex-brick h2" />
            <div className="hex-brick h3" />
          </div>
        ))}

        {/* Loading text */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8">
          <p className="text-white text-lg font-medium animate-pulse">
            Analyzing your mood...
          </p>
        </div>
      </div>

      <style jsx>{`
        .hex-brick {
          background: linear-gradient(45deg, #333, #000, #555);
          width: 3px;
          height: 60px;
          position: absolute;
          top: 5px;
          border-radius: 1px;
          animation: fade00 2s infinite;
        }

        .h2 {
          transform: rotate(60deg);
        }

        .h3 {
          transform: rotate(-60deg);
        }

        @keyframes fade00 {
          0% {
            background: linear-gradient(45deg, #454545, #222, #666);
            opacity: 0.8;
          }
          50% {
            background: linear-gradient(45deg, #000, #000, #000);
            opacity: 0.3;
          }
          100% {
            background: linear-gradient(45deg, #555, #333, #777);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default HexagonLoader;
