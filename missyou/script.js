// Polyfill window.requestAnimationFrame.
window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        return function (callback, element) {
            var lastTime = element.__lastTime;
            if (lastTime === undefined) {
                lastTime = 0;
            }
            var currTime = Date.now();
            var timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
        };
    })();
// Test for mobile.
var mobileTest = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
window.isDevice = (mobileTest.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));
var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;
    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * innerWidth;
    var height = canvas.height = koef * innerHeight;
    var rand = Math.random;
    var fill = "rgba(5,5,5,0.1)";
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);
  
    var floor = function(x) { return ~~(x); }

    // Translates radian to x,y position for heart.
    var heartPosition = function (rad) {
        // return [Math.sin(rad), Math.cos(rad)];
        var x = Math.pow(Math.sin(rad), 3);
        var y = -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad));
        return [x, y];
    };
  
    // Scales pos (which is [x,y]) by (sx, sy) and translates by (dx, dy).
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    // Handle resizes.
    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

    // How many points.
    var traceCount = mobile ? 20 : 30;
    // Starting points.
    var pointsOrigin = [];
  
    // Set up heart points.
    var heartSubdivisions = mobile ? 0.3 : 0.1;
  
    // Set up points for 3 different sized hearts, nested in one another.
    var scales = [[210, 13], [150, 9], [90, 5]];
    for (var scale of scales) {
      for (i = 0; i < Math.PI * 2; i += heartSubdivisions)
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), scale[0], scale[1], 0, 0));
    }
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
  
    // For growing/shrinking the heart size.
    var pulse = function (kx, ky) {
        for (var i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    var particles = [];

    function color() {
        return [
            "#40A798",
            "#F5E1DA",
            "#F1F1F1",
            "#476268"
        ][Math.round(rand() * 3)];
    }

    for (var i = 0; i < heartPointsCount; i++) {
        var x = rand() * width;
        var y = rand() * height;
        var hue = 0;
        var saturation = (40 * rand() + 60) + "%";
        var lightness = (60 * rand() + 20) + "%";
        var alpha = ".3";
        particles[i] = {
            velocityX: 0,
            velocityY: 0,
            speed: rand() + 5,
            targetPointIndex: floor(rand() * heartPointsCount),
            direction: 2 * (i % 2) - 1, // Alternates between -1 and +1.
            force: 0.2 * rand() + 0.7,
            color: color(),//"hsla(" + hue + "," + saturation + "," + lightness + "," + alpha + ")",
            trace: []
        };
      
        // Fill in traces for this point.
        for (var k = 0; k < traceCount; k++) {
          particles[i].trace[k] = { x: x, y: y };
        }
    }

    var config = {
        tracePull: .9,
        timeDelta: 0.01
    };

    var time = 0;
    var loop = function () {
        // n goes back and forth from -1 to +1.
        var n = -Math.cos(time);
        // Pulse is called with values from 0 to +1.
        pulse((1 + n) * .5, (1 + n) * .5);
        // Control speed based on which animation we're in.
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
      
        // Clear background (fill is slightly transparent tho, so it leaves a shadow).
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, width, height);
      
        // 
        for (var i = particles.length; i--;) {
            var particle = particles[i];
            var targetPoint = targetPoints[particle.targetPointIndex];
            var dx = particle.trace[0].x - targetPoint[0];
            var dy = particle.trace[0].y - targetPoint[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                // Small chance to pick a random point on the heart.
                if (0.95 < rand()) {
                    particle.targetPointIndex = floor(rand() * heartPointsCount);
                }
                else {
                    // Small chance to flip direction.
                    if (rand() > 0.99) {
                        particle.direction *= -1;
                    }
                  
                    // Get the next point on the heart, going around in [directon].
                    particle.targetPointIndex += particle.direction;
                    particle.targetPointIndex %= heartPointsCount;
                    if (particle.targetPointIndex < 0) {
                        particle.targetPointIndex += heartPointsCount;
                    }
                }
            }
            particle.velocityX += -dx / length * particle.speed;
            particle.velocityY += -dy / length * particle.speed;
            particle.trace[0].x += particle.velocityX;
            particle.trace[0].y += particle.velocityY;
            particle.velocityX *= particle.force;
            particle.velocityY *= particle.force;
          
            // Pull traces along towards the point, one at a time.
            for (k = 0; k < particle.trace.length - 1;) {
                var trace = particle.trace[k];
                var nextTrace = particle.trace[++k];
                nextTrace.x -= config.tracePull * (nextTrace.x - trace.x);
                nextTrace.y -= config.tracePull * (nextTrace.y - trace.y);
            }
          
            // Color in each trace.
            ctx.fillStyle = particle.color;
            for (k = 0; k < particle.trace.length; k++) {
                ctx.beginPath();
                ctx.arc(particle.trace[k].x, particle.trace[k].y, 0.1, 0, 2 * Math.PI);
                ctx.fill();
                // ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }
        // ctx.fillStyle = "rgba(255,255,255,1)";
        // for (i = u.trace.length; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);

        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var state = document.readyState;
if (state === 'complete' || state === 'loaded' || state === 'interactive') {
  init();
}
else {
  document.addEventListener('DOMContentLoaded', init, false);
}