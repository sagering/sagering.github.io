
function generateRandomParticle(x, y, maxv, c) {
  let vx = (Math.random() - 0.5) * maxv
  let vy = (Math.random() - 0.5) * maxv
  let lifeTime = Math.random() * 3000;
  let common = new Common(new Vector2d(x, y), new Vector2d(vx, vy))
  let particle = new Particle(lifeTime, new ParticleShape_Character(c));
  return new Entity(common, [particle])
}

class ParticleSource {
  constructor(x, y, txt) {
    this.particles = []
    for (let i = 0; i < txt.length; ++i) {
      let p = generateRandomParticle(x, y, 0.5, txt[i])
      this.particles.push(p)
    }
  }

  update(dt) {
    this.particles.forEach((p) => p.update(dt))
  }

  render(ctx) {
    this.particles.forEach((p) => p.render(ctx))
  }
}

class Vector2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Common {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }

  update(dt) {
    this.position.x += dt * this.velocity.x;
    this.position.y += dt * this.velocity.y;
  }
}

class Entity {
  constructor(common, components) {
    this.common = common;
    this.components = components;
    this.components.forEach((c) => c.entity = this);
  }

  update(dt) {
    this.common.update(dt);
    this.components.forEach((c) => c.update(dt))
  }

  render(ctx) {
    this.components.forEach((c) => c.render(ctx))
  }
}

class Particle {
  constructor(lifeTime, shape) {
    this.lifeTime = lifeTime;
    this.lifeTimeLeft = this.lifeTime;
    this.shape = shape;
    this.shape.particle = this;
  }

  update(dt) {
    this.lifeTimeLeft -= dt;
  }

  render(ctx) {
    if (this.lifeTimeLeft <= 0) return;
    this.shape.render(ctx);
  }
}

class ParticleShape_Circle {
  constructor(r) {
    this.r = r;
  }

  render(ctx) {
    let common = this.particle.entity.common;
    let lifeTime = this.particle.lifeTime;
    let lifeTimeLeft = this.particle.lifeTimeLeft;
    ctx.save();
    ctx.globalAlpha = lifeTimeLeft / lifeTime
    ctx.beginPath();
    ctx.arc(common.position.x, common.position.y, this.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore()
  }
}

class ParticleShape_Rect {
  constructor(w, h, angle) {
    this.w = w;
    this.h = h;
    this.angle = angle;
  }

  render(ctx) {
    let common = this.particle.entity.common;
    let lifeTime = this.particle.lifeTime;
    let lifeTimeLeft = this.particle.lifeTimeLeft;
    ctx.save();
    ctx.globalAlpha = lifeTimeLeft / lifeTime
    draw_rect_rotated(ctx, common.position.x, common.position.y, this.w, this.h, this.angle)
    ctx.restore()
  }
}

class ParticleShape_Character {
  constructor(c) {
    this.c = c;
  }

  render(ctx) {
    let common = this.particle.entity.common;
    let lifeTime = this.particle.lifeTime;
    let lifeTimeLeft = this.particle.lifeTimeLeft;
    ctx.save();
    ctx.globalAlpha = lifeTimeLeft / lifeTime
    ctx.font = "30px Courier";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(this.c, common.position.x, common.position.y);
    ctx.restore()
  }
}

function rotate(xy, rad) {
  let c = Math.cos(rad);
  let s = Math.sin(rad);
  return { "x": xy.x * c - xy.y * s, "y": xy.x * s + xy.y * c }
}

function dot(xy1, xy2) {
  return xy1.x * xy2.x + xy1.y * xy2.y;
}

function add(xy1, xy2) {
  return { "x": xy1.x + xy2.x, "y": xy1.y + xy2.y };
}

function sub(xy1, xy2) {
  return { "x": xy1.x - xy2.x, "y": xy1.y - xy2.y };
}

function div(xy1, xy2) {
  return { "x": xy1.x / xy2.x, "y": xy1.y / xy2.y };
}

function mul(xy1, xy2) {
  return { "x": xy1.x * xy2.x, "y": xy1.y * xy2.y };
}

function abs(xy) {
  return { "x": xy.x >= 0 ? xy.x : -xy.x, "y": xy.y >= 0 ? xy.y : -xy.y };
}

function norm(xy) {
  return Math.sqrt(xy.x * xy.x + xy.y * xy.y);
}

function create_effect() { return {} }

function spawn_effect(effect, pos, txt) {
  effect.particles = new ParticleSource(pos.x, pos.y, txt);
}

function update_effect(effect, dt) {
  if (effect.particles != undefined) {
    effect.particles.update(dt);
  }
}

function draw_effect(ctx, effect) {
  if (effect.particles != undefined) {
    effect.particles.render(ctx);
  }
}