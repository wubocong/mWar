/* super inefficient right now, could be improved */
(function() {
    var c = document.getElementById('c'),
        ctx = c.getContext('2d'),
        cw = c.width = document.body.offsetWidth,
        ch = c.height = 300,
        rand = function(a, b) {
            return ~~((Math.random() * (b - a + 1)) + a);
        },
        dToR = function(degrees) {
            return degrees * (Math.PI / 180);
        },
        circle = {
            x: (cw / 2),
            y: (ch / 2) + 22,
            radius: 90,
            speed: 2,
            rotation: 0,
            angleStart: 270,
            angleEnd: 90,
            hue: 220,
            thickness: 18,
            blur: 25
        },
        particles = [],
        particleMax = 100,
        updateCircle = function() {
            if (circle.rotation < 360) {
                circle.rotation += circle.speed;
            } else {
                circle.rotation = 0;
            }
        },
        renderCircle = function() {
            ctx.save();
            ctx.translate(circle.x, circle.y);
            ctx.rotate(dToR(circle.rotation));
            ctx.beginPath();
            ctx.arc(0, 0, circle.radius, dToR(circle.angleStart), dToR(circle.angleEnd), true);
            ctx.lineWidth = circle.thickness;
            ctx.strokeStyle = gradient1;
            ctx.stroke();
            ctx.restore();
        },
        renderCircleBorder = function() {
            ctx.save();
            ctx.translate(circle.x, circle.y);
            ctx.rotate(dToR(circle.rotation));
            ctx.beginPath();
            ctx.arc(0, 0, circle.radius + (circle.thickness / 2), dToR(circle.angleStart), dToR(circle.angleEnd), true);
            ctx.lineWidth = 2;
            ctx.strokeStyle = gradient2;
            ctx.stroke();
            ctx.restore();
        },
        renderCircleFlare = function() {
            ctx.save();
            ctx.translate(circle.x, circle.y);
            ctx.rotate(dToR(circle.rotation + 185));
            ctx.scale(1, 1);
            ctx.beginPath();
            ctx.arc(0, circle.radius, 30, 0, Math.PI * 2, false);
            ctx.closePath();
            var gradient3 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 30);
            gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
            gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
            ctx.fillStyle = gradient3;
            ctx.fill();
            ctx.restore();
        },
        renderCircleFlare2 = function() {
            ctx.save();
            ctx.translate(circle.x, circle.y);
            ctx.rotate(dToR(circle.rotation + 165));
            ctx.scale(1.5, 1);
            ctx.beginPath();
            ctx.arc(0, circle.radius, 25, 0, Math.PI * 2, false);
            ctx.closePath();
            var gradient4 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 25);
            gradient4.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
            gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
            ctx.fillStyle = gradient4;
            ctx.fill();
            ctx.restore();
        },
        createParticles = function() {
            if (particles.length < particleMax) {
                particles.push({
                    x: (circle.x + circle.radius * Math.cos(dToR(circle.rotation - 85))) + (rand(0, circle.thickness * 2) - circle.thickness),
                    y: (circle.y + circle.radius * Math.sin(dToR(circle.rotation - 85))) + (rand(0, circle.thickness * 2) - circle.thickness),
                    vx: (rand(0, 100) - 50) / 1000,
                    vy: (rand(0, 100) - 50) / 1000,
                    radius: rand(1, 6) / 2,
                    alpha: rand(10, 20) / 100
                });
            }
        },
        updateParticles = function() {
            var i = particles.length;
            while (i--) {
                var p = particles[i];
                p.vx += (rand(0, 100) - 50) / 750;
                p.vy += (rand(0, 100) - 50) / 750;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= .01;
                if (p.alpha < .02) {
                    particles.splice(i, 1)
                }
            }
        },
        renderParticles = function() {
            var i = particles.length;
            while (i--) {
                var p = particles[i];
                ctx.beginPath();
                ctx.fillRect(p.x, p.y, p.radius, p.radius);
                ctx.closePath();
                ctx.fillStyle = 'hsla(0, 0%, 100%, ' + p.alpha + ')';
            }
        },
        clear = function() {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, .1)';
            ctx.fillRect(0, 0, cw, ch);
            ctx.globalCompositeOperation = 'lighter';
        },
        loop = function() {
            clear();
            updateCircle();
            createParticles();
            updateParticles();
            renderCircle();
            renderCircleBorder();
            renderCircleFlare();
            renderCircleFlare2();
            renderParticles();
            rafID = requestAnimationFrame(loop);
        };
    /* Set Constant Properties */
    ctx.shadowBlur = circle.blur;
    ctx.shadowColor = 'hsla(' + circle.hue + ', 80%, 60%, 1)';
    ctx.lineCap = 'round'
    var gradient1 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
    gradient1.addColorStop(0, 'hsla(' + circle.hue + ', 60%, 50%, .25)');
    gradient1.addColorStop(1, 'hsla(' + circle.hue + ', 60%, 50%, 0)');
    var gradient2 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
    gradient2.addColorStop(0, 'hsla(' + circle.hue + ', 100%, 50%, 0)');
    gradient2.addColorStop(.1, 'hsla(' + circle.hue + ', 100%, 100%, .7)');
    gradient2.addColorStop(1, 'hsla(' + circle.hue + ', 100%, 50%, 0)');
    /* Loop It, Loop It Good */
    loop();
}());

function animation() {
    var img;
    clearInterval(cycle);
    setTimeout(function() {
        cancelAnimationFrame(rafID);
    }, 5000);
    setTimeout(function() {
        $('#c').fadeOut(3000, function() {
            img = $('img');
            chain(img.length - 1);
        });
    }, 3000);

    function chain(i) {
        var el = img.eq(i);
        var l = (el.width() - $(window).width()) / 2;
        el.css({
            'left': -l,
            'opacity': 1
        });
        if (i > 0) {
            setTimeout(function() {
                chain(i - 1);
            }, 1500);
            setTimeout(function() {
                el.css('top', '100%');
            }, 5000);
        }
        if (i == 0) {
            setTimeout(function() {
                slide();
            }, 3000);
        }
    }

    function slide() {
        $('.link').show();
        img.addClass('slide');
        var xs, ys, xm, ym, xe, ye;
        var tooltip = $('.tooltip');
        var cur = 0;
        var text = ['江山倦夜眠孤客，<br>红堕沾衣冷血痕。<br>八极乘龙巡碧落，<br>一襟风雪载昆仑。', '人都是很固执的……尤其在选择要走哪条路时，更是半点不能强求。所以我也无法告诉你，偃术究竟有何用途……我只能说，你最想要什么，就去做什么，那就是你自己的道。', '我曾被诅咒众叛亲离、一世畸零。而我也曾经真的以为，我的一生，就将如此度过……但是，我有师尊，有能托付生死的朋友，有想保护的人……我能想到的、最好的东西，我都已经得到了。', '生命至为灿烂，至为珍贵，而又永不重来，身为偃师，万望敬之……畏之……珍之……重之…… 此生未尝虚掷一日，余心已足，无复怨怼。所愧疚者……余力绵薄，终究难以回报故人之挚情，恩师之错爱。', '人生天地间，独生独死，独去独来，苦乐自当，无有代者。'];
        var color = ['#3D6086', '#3D6086', '#444444', '#617c5b', '#eeeeee'];
        var l, block = true,
            sign = true;
        var w = $(window).width(),
            h = $(window).height();
        var direction;
        var scale = 0.8;
        $(window).on('touchstart', function(event) {
            if (block) {
                event.preventDefault();
                xs = event.originalEvent.changedTouches[0].clientX;
                ys = event.originalEvent.changedTouches[0].clientY;
                l = img.eq(cur).css('left');
                img.eq(cur).removeClass('slide');
                img.eq(cur + 1).removeClass('slide');
                img.eq(cur - 1).removeClass('slide');
                block = false;
            }
        });
        $(window).on('touchmove', function(event) {
            event.preventDefault();
            xm = event.originalEvent.changedTouches[0].clientX;
            ym = event.originalEvent.changedTouches[0].clientY;
            xchange = xs - xm;
            ychange = ys - ym;
            xabs = Math.abs(xchange);
            yabs = Math.abs(ychange);
            if (sign) {
                if (xabs > yabs) {
                    direction = false;
                } else {
                    direction = true;
                }
                sign = false;
            }
            if ((xchange >= 0.7 * w && !direction) || (ychange >= 0.5 * h) && direction) {
                if (cur <= 3) {
                    img.eq(cur).css({
                        'height': (1 - scale) * h,
                        'left': -w * scale,
                        'top': h / 2 * scale
                    });
                    img.eq(cur + 1).css({
                        'top': (1 - scale) * h
                    });
                }
            } else if (((-xchange) >= 0.7 * w && !direction) || ((-ychange) >= 0.5 * h) && direction) {
                if (cur > 0) {
                    img.eq(cur).css('top', h * scale);
                    var iw = img[cur - 1].naturalWidth,
                        ih = img[cur - 1].naturalHeight;
                    img.eq(cur - 1).css({
                        'height': h * scale,
                        'left': (w - iw * h / ih * scale) / 2,
                        'top': (1 - scale) * h
                    });
                } else if (cur == 0) {
                    img.eq(cur).css('top', h * scale);
                }
            } else {
                var percent = direction ? (yabs * 2 / h) : (xabs * 10 / (w * 7));
                percent *= scale;
                if ((xchange > 0 && !direction) || (ychange > 0 && direction)) {
                    if (cur <= 3) {
                        img.eq(cur).css({
                            'height': (1 - percent) * h,
                            'left': -w * percent,
                            'top': h / 2 * percent
                        });
                        img.eq(cur + 1).css({
                            'top': (1 - percent) * h
                        });
                    }
                } else if ((xchange < 0 && !direction) || (ychange < 0 && direction)) {
                    if (cur > 0) {
                        img.eq(cur).css('top', h * percent);
                        var iw = img[cur - 1].naturalWidth,
                            ih = img[cur - 1].naturalHeight;
                        img.eq(cur - 1).css({
                            'height': h * percent,
                            'left': (w - iw * h / ih) * percent / 2,
                            'top': (1 - percent) * h
                        });
                    } else if (cur == 0) {
                        img.eq(cur).css('top', h * percent);
                    }
                }
            }
        });
        $(window).on('touchend', function(event) {
            sign = true;
            event.preventDefault();
            img.eq(cur).addClass('slide');
            img.eq(cur + 1).addClass('slide');
            img.eq(cur - 1).addClass('slide');
            xe = event.originalEvent.changedTouches[0].clientX;
            ye = event.originalEvent.changedTouches[0].clientY;
            if (((xs - xe) >= 0.3 * w && !direction) || ((ys - ye) >= 0.2 * h && direction)) {
                if (cur <= 3) {
                    img.eq(cur).css({
                        'height': 0,
                        'left': -w,
                        'top': h / 2
                    });
                    img.eq(++cur).css({
                        'top': 0
                    });
                    tooltip.html(text[cur]);
                    tooltip.css('color', color[cur]);
                    $('.link').hide();
                }
            } else if (((xe - xs) >= 0.3 * w && !direction) || ((ye - ys) >= 0.2 * h && direction)) {
                if (cur > 0) {
                    img.eq(cur).css('top', '100%');
                    var iw = img[cur - 1].naturalWidth,
                        ih = img[cur - 1].naturalHeight;
                    img.eq(--cur).css({
                        'height': '100%',
                        'left': (w - iw * h / ih) / 2,
                        'top': 0
                    });
                    tooltip.html(text[cur]);
                    tooltip.css('color', color[cur]);
                    if (cur == 0) {
                        $('.link').show();
                    }
                } else if (cur == 0) {
                    window.open('./wordpress/', '_self');
                }
            } else {
                img.eq(cur).css({
                    'height': '100%',
                    'left': l,
                    'top': 0
                });
                if (cur <= 3) {
                    img.eq(cur + 1).css({
                        'top': '100%'
                    });
                }
                if (cur > 0) {
                    img.eq(cur - 1).css({
                        'height': 0,
                        'top': h / 2,
                        'left': -w
                    });
                }
                if (Math.abs(xe - xs) <= 0.1 * w && Math.abs(ye - ys) <= 0.1 * h) {
                    if (tooltip.hasClass('vis')) {
                        tooltip.removeClass('vis');
                    } else {
                        tooltip.addClass('vis');
                    }
                }
            }
            setTimeout(function() {
                block = true;
            }, 1000);
        });
    }
    $(window).resize(function() {
        //等图片加载完后才能获取到img,也只有这样有意义
        img.each(function(index, el) {
            var l = (el.width() - $(window).width()) / 2;
            el.css({
                'left': -l,
                'opacity': 1
            });
        })
    });
}