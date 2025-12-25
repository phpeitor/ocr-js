(function() {
      const svg = document.querySelector("#bg-animation");
      svg.setAttribute("viewBox", "0 0 300 300");
      svg.setAttribute("width", "300");
      svg.setAttribute("height", "300");

      const settings = {
        animation: {
          duration: 7.5,
          circleCount: 10,
          heartCount: 8
        },
        circle: {
          x: 150,
          y: 150,
          r: 150
        },
      }
      let layers = [];

      draw();
      animate();

      function draw() {
        for (let i = 0; i <= settings.animation.circleCount; i++) {
          let layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
          let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

          circle.setAttribute("cx", settings.circle.x);
          circle.setAttribute("cy", settings.circle.y);
          circle.setAttribute("r", settings.circle.r);

          svg.append(layer);
          layer.append(circle);

          const length = circle.getTotalLength();
          const lengthDelta = circle.getTotalLength() / settings.animation.heartCount;
          let logos = [];
          let offset = lengthDelta * (i % 2) / 2;

          for (let j = 0; j < settings.animation.heartCount; j++) {
            let point = circle.getPointAtLength(offset + lengthDelta * j);
            let logo = document.createElementNS("http://www.w3.org/2000/svg", "image");

            logo.setAttribute("x", point.x - 30); 
            logo.setAttribute("y", point.y - 30); 
            logo.setAttribute("width", "100"); 
            logo.setAttribute("height", "100"); 
            logo.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './resources/logo.png');
            logos.push(logo);
            layer.append(logo);
          }

          layers.push({
            group: layer,
            circle: circle,
            logos: logos
          });
        }
      }

      function animate() {
        let tl = gsap.timeline();

        layers.forEach((layer, i) => {
          let direction = i % 2 ? 1 : -1;

          gsap.set([layer.group, ...layer.logos], {
            transformOrigin: "50% 50%",
            scale: 0,
          });

          gsap.set(layer.circle, {
            strokeWidth: 0,
            stroke: "#40407a",
            fill: "none"
          });

          tl.to(layer.group, {
            duration: settings.animation.duration,
            scale: Math.SQRT2,
            delay: -settings.animation.duration / settings.animation.circleCount,
            repeat: -1,
            ease: "Power3.easeIn",
          }, "<");

          tl.to(layer.circle, {
            duration: settings.animation.duration,
            strokeWidth: 30,
            repeat: -1,
            ease: "Power3.easeOut",
          }, "<");

          tl.to([...layer.logos], {
            keyframes: [
              {
                scale: 1,
                rotation: 360 * direction,
                duration: settings.animation.duration / 2,
              },
              {
                scale: 0,
                rotation: 720 * direction,
                duration: settings.animation.duration / 2,
              }
            ],
            ease: "linear",
            delay: 0,
            repeat: -1
          }, "<");
        });
      }
}());