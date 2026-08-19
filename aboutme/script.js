Particles.init({
  selector: ".background",
  color: ["#00FFFF", "#FF0099"],
  maxParticles: 70,
  sizeVariations: 3,
  speed: 0.4,
  connectParticles: false,
  responsive: [
    {
      breakpoint: 640,
      options: {
        maxParticles: 40,
      },
    },
  ],
});
