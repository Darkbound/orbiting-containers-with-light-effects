/**
 * @param {Object} options options controlling the animation
 * @param {string} options.mainContainerId the ID of the container in which the animation HTML will be inserted
 * @param {number} options.partnerLogosSize the size of the orbiting logos, the number is treated as pixels size
 * @param {Object} options.circles the object containing options of the background outer circles
 * @param {Object} options.circles.outer the object containing options of the outer background circle
 * @param {string} options.circles.outer.color the color of the outer circle
 * @param {string} options.circles.outer.size the size of the outer circle
 * @param {Object} options.circles.inner the object containing options of the inner background circle
 * @param {string} options.circles.inner.color the color of the outer circle
 * @param {string} options.circles.inner.size the size of the outer circle
 * @param {Object} options.animations the object containing options for each animation
 * @param {Object} options.animations.mainRotation the object containing options for the main rotation animation
 * @param {number} options.animations.mainRotation.speed the speed of the rotation 10 units = 1s
 * @param {Object} options.animations.partnerLights the object containing options for the orbiting logos lights animation
 * @param {number} options.animations.partnerLights.speed the travel speed of the orbiting lights 10 units = 1s
 * @param {boolean} options.animations.partnerLights.asynchronous the orbiting lights will travel to the center asynchronously
 * @param {Object} options.animations.ownLight the object containing options for the central logo light animation
 * @param {number} options.animations.ownLight.delay the delay of the light animation of the central logo
 * @param {number} options.animations.ownLight.speed the duration of the central light 10 units = 1s
 * @param {number} options.animations.ownLight.size the size of the central light, treated as px
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
