window.addEventListener("DOMContentLoaded", () => {
  const options = {
    circles: {
      outer: {
        color: "7869cf", // must be HEX! Validate string length 6, characters 0-9A-F
        size: 75,
      },
      inner: {
        color: "69cfb6",
        size: 75,
      },
    },
    animations: {
      mainRotation: {
        speed: 500,
      },
      partnerLights: {
        asynchronous: false,
        speed: 50, //10 = 1s, //do some math and time it with the own logo animation
      },
      ownLight: {
        delay: 20,
        speed: 50,
      },
    },
  };

  // TODO: Rename to orbiting planets/sun
  // math about the sizes so that its responsive in any container
  // what can be variable, and what must be predefined?

  class LogoMath {
    static RadiansToDegrees = (radians) => (radians * 180) / Math.PI;
    static EquallySpacedCircleAngle = (divider) => (Math.PI * 2) / divider;
    static convertSpeedToTime = (speed) => speed / 10;
  }

  class HTML {
    static outerCircles = () => `<div class="outerCircles"></div>`;
    static logoAnimationWrapper = () => `<div class="logoAnimationWrapper"></div>`;
    static partnerLogosContainer = () => `<div class="partnerLogosContainer"></div>`;
    static partnerLogos = (logoSrc) => `<div class="partnerLogoContainer">
                                          <div class="partnerLogo">
                                            <img src="${logoSrc}" />
                                            </div>
                                            <div class="partnerLogoLine"></div>
                                          <div class="partnerLogoLight"></div>
                                        </div>`;
    static ownLogo = (logoSrc) => `<div class="ownLogoContainer">
                                    <div class="ownLogo">
                                      <img src="${logoSrc}" />
                                      <div class="ownLogoLight"></div>
                                    </div>
                                  </div>`;
  }

  class CSS {
    static fullSize = { width: `100%`, height: `100%` };
    static flexMiddle = { display: `flex`, alignItems: `center`, justifyContent: `center` };
    static maxSize = (size) => ({ maxWidth: size, maxHeight: size });
    static squareSize = (size) => ({ width: size, height: size });
    static absoluteCenter = (offset) => ({ position: `absolute`, left: offset, top: offset });

    static mainWrapper = () => ({ ...CSS.fullSize, position: `relative` });
    static outerCircles = () => ({
      ...CSS.squareSize(`530px`),
      ...CSS.absoluteCenter(`35px`),
      borderRadius: `50%`,
      boxShadow: `0 0 0 ${options.circles.inner.size}px #${options.circles.inner.color} inset, 
                  0 0 0 ${options.circles.outer.size}px #${options.circles.outer.color}`,
    });
    static ownLogoContainer = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`90px`),
      ...CSS.absoluteCenter(`calc(50% - 45px)`),
      zIndex: `10`,
    });
    static ownLogo = () => ({
      ...CSS.fullSize,
      position: `relative`,
    });
    static ownLogoLight = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`1px`),
      ...CSS.absoluteCenter(`45px`),
      borderRadius: `50%`,
      animation: `ownLogoAnimation ${LogoMath.convertSpeedToTime(options.animations.ownLight.speed)}s infinite`,
      animationDelay: `${LogoMath.convertSpeedToTime(options.animations.ownLight.delay)}s`,
      opacity: `0`,
      zIndex: `-1`,
    });
    static ownLogoImage = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`90px`),
    });
    static partnerLogoContainer = () => ({
      ...CSS.flexMiddle,
      position: `absolute`,
      top: `calc(50% - 32.5px)`,
      width: `300px`,
      height: `65px`,
      transformOrigin: `center right`,
    });
    static partnerLogo = () => ({
      ...CSS.fullSize,
      ...CSS.flexMiddle,
      ...CSS.maxSize(`70px`),
      borderRadius: `50%`,
      border: `1px solid black`,
    });
    static partnerLogoImg = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`70px`),
    });
    static partnerLogoLine = () => ({
      width: `100%`,
      height: `0px`,
      border: `0.5px solid black`,
      zIndex: `-1`,
    });
    static partnerLogosContainer = () => ({
      ...CSS.fullSize,
      animation: `mainRotation ${LogoMath.convertSpeedToTime(options.animations.mainRotation.speed)}s infinite linear`,
      transformOrigin: `center`,
    });
    static partnerLogoLight = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`1px`),
      backgroundColor: `blue`,
      borderRadius: `50%`,
      position: `absolute`,
      left: `35px`,
      animation: `partnerLightAnimation ${LogoMath.convertSpeedToTime(
        options.animations.partnerLights.speed
      )}s ease-in infinite`,
    });
    static lightGlow = ({ color = "#FFFFFF", size = "20px" }) => ({ boxShadow: `0 0 20px ${size} ${color}` });
    static rotate = (deg) => ({ transform: `rotate(${deg}deg)` });
    static counterRotatingAnimation = (initialAngle) => ``;

    static keyframes = {
      mainRotation: `
      @keyframes mainRotation {
        0% {
          transform: rotate(0deg);
        }
      
        100% {
          transform: rotate(360deg);
        }
      }`,
      partnerLight: `
      @keyframes partnerLightAnimation {
        0% {
          left: 35px;
          opacity: 1;
        }
      
        40% {
          left: 100%;
        }
      
        100% {
          left: 100%;
          opacity: 0;
        }
      }`,
      ownLight: `
      @keyframes ownLogoAnimation {
        0% {
          opacity: 0;
        }
      
        40% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }`,
    };
  }

  class Selectors {
    static mainWrapper = () => mainContainer.getElementsByClassName(`logoAnimationWrapper`)[0];
    static outerCircles = () => mainContainer.getElementsByClassName(`outerCircles`)[0];
    static ownLogoContainer = () => mainContainer.getElementsByClassName(`ownLogoContainer`)[0];
    // static ownLogo = () => mainContainer.getElementsByClassName(`ownLogo`)[0];
    static ownLogoLight = () => mainContainer.getElementsByClassName(`ownLogoLight`)[0];
    static partnerLogosContainer = () => mainContainer.getElementsByClassName(`partnerLogosContainer`)[0];
    static ownLogoContainer = () => mainContainer.getElementsByClassName(`ownLogo`)[0];
    static ownLogoImage = () => this.ownLogoContainer().querySelector(`img`);
    static ownLogoLight = () => mainContainer.getElementsByClassName(`ownLogoLight`)[0];

    static arrays = {
      partnerLogo: () => mainContainer.querySelectorAll(`.partnerLogo`),
      partnerLogoLight: () => mainContainer.getElementsByClassName(`partnerLogoLight`),
      partnerLogoContainer: () => mainContainer.getElementsByClassName(`partnerLogoContainer`),
      partnerLogoImg: () => mainContainer.querySelectorAll(`.partnerLogo > img `),
      partnerLogoLine: () => mainContainer.querySelectorAll(`.partnerLogoLine`),
    };
  }

  const ownLogo = {
    src: "img/pancake.png",
    lightColor: "#00FF00",
  };

  const logos = [
    {
      src: "img/binance.png",
      lightColor: "#ffcc00",
    },
    {
      src: "img/kucoin.png",
      lightColor: "#6699ff",
    },
    {
      src: "img/hit.png",
      lightColor: "#cc3399",
    },
    {
      src: "img/huobi.png",
      lightColor: "#0066cc",
    },
    {
      src: "img/kraken.png",
      lightColor: "#00ff99",
    },
    {
      src: "img/pancake.png",
      lightColor: "#9900ff",
    },
    {
      src: "img/binance.png",
      lightColor: "#ffcc00",
    },
    {
      src: "img/kucoin.png",
      lightColor: "#6699ff",
    },
    {
      src: "img/hit.png",
      lightColor: "#cc3399",
    },
    {
      src: "img/huobi.png",
      lightColor: "#0066cc",
    },
    {
      src: "img/kraken.png",
      lightColor: "#00ff99",
    },
    {
      src: "img/pancake.png",
      lightColor: "#9900ff",
    },
    {
      src: "img/binance.png",
      lightColor: "#ffcc00",
    },
    {
      src: "img/kucoin.png",
      lightColor: "#6699ff",
    },
    {
      src: "img/hit.png",
      lightColor: "#cc3399",
    },
    {
      src: "img/huobi.png",
      lightColor: "#0066cc",
    },
    {
      src: "img/kraken.png",
      lightColor: "#00ff99",
    },
    {
      src: "img/pancake.png",
      lightColor: "#9900ff",
    },
    {
      src: "img/binance.png",
      lightColor: "#ffcc00",
    },
    {
      src: "img/kucoin.png",
      lightColor: "#6699ff",
    },
    {
      src: "img/hit.png",
      lightColor: "#cc3399",
    },
    {
      src: "img/huobi.png",
      lightColor: "#0066cc",
    },
    {
      src: "img/kraken.png",
      lightColor: "#00ff99",
    },
    {
      src: "img/pancake.png",
      lightColor: "#9900ff",
    },
    {
      src: "img/binance.png",
      lightColor: "#ffcc00",
    },
    {
      src: "img/kucoin.png",
      lightColor: "#6699ff",
    },
    {
      src: "img/hit.png",
      lightColor: "#cc3399",
    },
    {
      src: "img/huobi.png",
      lightColor: "#0066cc",
    },
    {
      src: "img/kraken.png",
      lightColor: "#00ff99",
    },
    {
      src: "img/pancake.png",
      lightColor: "#9900ff",
    },
  ];

  // HTML
  const mainContainerId = "logoAnimationContainer";
  const mainContainer = document.querySelector(`#${mainContainerId}`);

  mainContainer.innerHTML += `<style>
                                ${Object.keys(CSS.keyframes)
                                  .map((key) => CSS.keyframes[key])
                                  .join(" ")}
                              </style>`;

  mainContainer.innerHTML += HTML.outerCircles();
  mainContainer.innerHTML += HTML.logoAnimationWrapper();

  Selectors.mainWrapper().innerHTML += HTML.ownLogo(ownLogo.src);
  Selectors.mainWrapper().innerHTML += HTML.partnerLogosContainer();

  for (let i = 0; i < logos.length; i++) {
    Selectors.partnerLogosContainer().innerHTML += HTML.partnerLogos(logos[i].src);
  }

  // CSS
  Object.keys(Selectors).forEach(
    (selector) => selector !== "arrays" && Object.assign(Selectors[selector]().style, CSS[selector]())
  );

  Object.keys(Selectors.arrays).forEach((arraySelector) => {
    for (let i = 0; i < Selectors.arrays[arraySelector]().length; i++) {
      Object.assign(Selectors.arrays[arraySelector]()[i].style, CSS[arraySelector]());
    }
  });

  Object.assign(Selectors.ownLogoLight().style, {
    ...CSS.lightGlow({ color: ownLogo.lightColor, size: "50px" }),
  });

  for (let i = 0; i < logos.length; i++) {
    let initialAngle = LogoMath.RadiansToDegrees(LogoMath.EquallySpacedCircleAngle(logos.length) * i);
    Selectors.arrays.partnerLogoContainer()[i].style.transform = CSS.rotate(initialAngle).transform;

    Object.assign(Selectors.arrays.partnerLogoLight()[i].style, {
      ...CSS.lightGlow({ color: logos[i].lightColor }),
    });
  }
});

//   const convertXYtoLeftTop = ({ x, y, totalWidth, totalHeight }) => {
//     const originX = totalWidth / 2;
//     const originY = totalHeight / 2;

//     console.log(originX);

//     const left = `${originX + x - 32.5}px`;
//     const top = `${originY - y - 32.5}px`;

//     return { left, top };
//   };
//   const setWidthAndHeightOfContainer = ({ container }) => ({
//     totalWidth: container.clientWidth <= container.clientHeight ? container.clientWidth : container.clientHeight,
//     totalHeight: container.clientWidth <= container.clientHeight ? container.clientWidth : container.clientHeight,
//   });
//   const pointOnCircleCoordinates = ({ radius, angle }) => ({
//     x: radius * Math.cos(angle),
//     y: radius * Math.sin(angle),
//   });

//   const mainContainer = document.querySelector("#logoAnimationContainer");
//   const partnerLogoContainers = document.querySelectorAll(".partnerLogoContainer");

//   const { totalWidth, totalHeight } = setWidthAndHeightOfContainer({ container: mainContainer });
//   // Take the smallest of the two sides in case the container is not a square
//   const radius = totalWidth / 2 - 32.5;
//   const angle = (Math.PI * 2) / partnerLogoContainers.length;

//   for (let i = 0; i < partnerLogoContainers.length; i++) {
//     const { x, y } = pointOnCircleCoordinates({ radius, angle: angle * i });
//     console.log({ x, y });
//     const { left, top } = convertXYtoLeftTop({ x, y, totalWidth, totalHeight });

//     partnerLogoContainers[i].style.left = left;
//     partnerLogoContainers[i].style.top = top;
//   }
