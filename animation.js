/**
 *
 * @param {{ mainContainerId: string,
 *           partnerLogosSize: number,
 *           partnerLogos: [{ src: string, lightColor: string }],
 *           ownLogo: { src: string, lightColor: string, size: number },
 *           circles: {
 *             outer: {
 *               color: string
 *               size: number
 *             },
 *             inner: {
 *               color: string
 *               size: number
 *             }
 *           },
 *           animations: {
 *             mainRotation: {
 *               speed: number
 *             },
 *             partnerLights: {
 *               speed: number,
 *               asynchronous: boolean
 *             },
 *             ownLight: {
 *               delay: number,
 *               speed: number,
 *               size: number
 *             }
 *           }
 * }} options animation options
 * @param options.mainContainerId the id of the main container in which the animation HTML will be inserted
 */
function OrbitingLogosAnimation(options) {
  const { mainContainerId, circles, partnerLogosSize, partnerLogos, ownLogo, animations } = options;
  const mainContainer = document.querySelector(`#${mainContainerId}`);
  const getMainContainerSmallestSize = () =>
    mainContainer.clientWidth <= mainContainer.clientHeight ? mainContainer.clientWidth : mainContainer.clientHeight;
  const mainContainerSize = getMainContainerSmallestSize();

  // TODO: Rename to orbiting planets/sun

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
    static flexMiddle = {
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
    };
    static maxSize = (size) => ({ maxWidth: size, maxHeight: size });
    static squareSize = (size) => ({ width: size, height: size });
    static absoluteCenter = (offset) => ({
      position: `absolute`,
      left: offset,
      top: offset,
    });

    static mainWrapper = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`${mainContainerSize}px`),
      position: `relative`,
    });
    static outerCircles = () => ({
      ...CSS.squareSize(`${mainContainerSize - partnerLogosSize}px`),
      ...CSS.absoluteCenter(`${partnerLogosSize / 2}px`),
      borderRadius: `50%`,
      boxShadow: `0 0 0 ${circles.inner.size}px #${circles.inner.color} inset, 
                  0 0 0 ${circles.outer.size}px #${circles.outer.color}`,
    });
    static ownLogoContainer = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`${ownLogo.size}px`),
      ...CSS.absoluteCenter(`calc(50% - ${ownLogo.size / 2}px)`),
      zIndex: `10`,
    });
    static ownLogo = () => ({
      ...CSS.fullSize,
      position: `relative`,
    });
    static ownLogoLight = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`1px`),
      ...CSS.absoluteCenter(`${ownLogo.size / 2}px`),
      borderRadius: `50%`,
      animation: `ownLogoAnimation ${LogoMath.convertSpeedToTime(animations.ownLight.speed)}s infinite`,
      animationDelay: `${LogoMath.convertSpeedToTime(animations.ownLight.delay)}s`,
      opacity: `0`,
      zIndex: `-1`,
    });
    static ownLogoImage = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`${ownLogo.size}px`),
    });
    static partnerLogoContainer = () => ({
      ...CSS.flexMiddle,
      position: `absolute`,
      top: `calc(50% - ${partnerLogosSize / 2}px)`,
      width: `${mainContainerSize / 2}px`,
      height: `${partnerLogosSize}px`,
      transformOrigin: `center right`,
    });
    static partnerLogo = () => ({
      ...CSS.fullSize,
      ...CSS.flexMiddle,
      ...CSS.maxSize(`${partnerLogosSize}px`),
      borderRadius: `50%`,
      border: `1px solid black`,
    });
    static partnerLogoImg = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`${partnerLogosSize}px`),
    });
    static partnerLogoLine = () => ({
      width: `100%`,
      height: `0px`,
      border: `0.5px solid black`,
      zIndex: `-1`,
    });
    static partnerLogosContainer = () => ({
      ...CSS.fullSize,
      animation: `mainRotation ${LogoMath.convertSpeedToTime(animations.mainRotation.speed)}s infinite linear`,
      transformOrigin: `center`,
    });
    static partnerLogoLight = () => ({
      ...CSS.fullSize,
      ...CSS.maxSize(`1px`),
      backgroundColor: `blue`,
      borderRadius: `50%`,
      position: `absolute`,
      left: `${partnerLogosSize / 2}px`,
      animation: `partnerLightAnimation ${LogoMath.convertSpeedToTime(
        animations.partnerLights.speed
      )}s ease-in infinite`,
    });
    static lightGlow = ({ color = "#FFFFFF", size = "20px" }) => ({
      boxShadow: `0 0 20px ${size} ${color}`,
    });
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
          opacity: 0;
          left: 35px;   
        }
        40% {
          left: 35px;   
          opacity: 1;
        }
      
        80% {
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
      
        70% {
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

  // HTML
  const insertHTML = () => {
    mainContainer.innerHTML += `<style>
                                ${Object.keys(CSS.keyframes)
                                  .map((key) => CSS.keyframes[key])
                                  .join(" ")}
                              </style>`;

    mainContainer.innerHTML += HTML.logoAnimationWrapper();

    Selectors.mainWrapper().innerHTML += HTML.outerCircles();
    Selectors.mainWrapper().innerHTML += HTML.ownLogo(ownLogo.src);
    Selectors.mainWrapper().innerHTML += HTML.partnerLogosContainer();

    for (let i = 0; i < partnerLogos.length; i++) {
      Selectors.partnerLogosContainer().innerHTML += HTML.partnerLogos(partnerLogos[i].src);
    }
  };

  // CSS
  const applyCSS = () => {
    Object.keys(Selectors).forEach(
      (selector) => selector !== "arrays" && Object.assign(Selectors[selector]().style, CSS[selector]())
    );

    Object.keys(Selectors.arrays).forEach((arraySelector) => {
      for (let i = 0; i < Selectors.arrays[arraySelector]().length; i++) {
        Object.assign(Selectors.arrays[arraySelector]()[i].style, CSS[arraySelector]());
      }
    });

    Object.assign(Selectors.ownLogoLight().style, {
      ...CSS.lightGlow({
        color: ownLogo.lightColor,
        size: `${animations.ownLight.size}px`,
      }),
    });

    for (let i = 0; i < partnerLogos.length; i++) {
      let initialAngle = LogoMath.RadiansToDegrees(LogoMath.EquallySpacedCircleAngle(partnerLogos.length) * i);
      Selectors.arrays.partnerLogoContainer()[i].style.transform = CSS.rotate(initialAngle).transform;

      Object.assign(Selectors.arrays.partnerLogoLight()[i].style, {
        ...CSS.lightGlow({ color: partnerLogos[i].lightColor }),
      });
    }
  };

  insertHTML();
  applyCSS();
}
