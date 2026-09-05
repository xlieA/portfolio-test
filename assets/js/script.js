


// global scroll handler
let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
  lastScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}

function updateOnScroll() {
  // parallax effect
  //updateParallax(lastScrollY);

  // active section highlight
  //updateSectionHighlight();

  // timeline progress animation
  smoothScrollingTimeline(lastScrollY);
  fnOnScroll();

  // image animation
  //scrollImage();

  ticking = false; // allow next scroll update
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', fnOnResize);


// timeline animation
var agTimeline = $('.js-timeline'),
    agTimelineLine = $('.js-timeline_line'),
    agTimelineLineProgress = $('.js-timeline_line-progress'),
    agTimelinePoint = $('.js-timeline-card_point-box'),
    agTimelineItem = $('.js-timeline_item'),
    
    agOuterHeight = $(window).outerHeight(),
    agHeight = $(window).height(),
    f = -1,
    agFlag = false;

function fnOnScroll() {
  agPosY = $(window).scrollTop();

  fnUpdateFrame();
}

function fnOnResize() {
  agPosY = $(window).scrollTop();
  agHeight = $(window).height();

  fnUpdateFrame();
}

function fnUpdateWindow() {
  agFlag = false;
  agTimelineLine.css({
    top: agTimelineItem.first().find(agTimelinePoint).offset().top - agTimelineItem.first().offset().top,
    bottom: agTimeline.offset().top + agTimeline.outerHeight() - agTimelineItem.last().find(agTimelinePoint).offset().top
  });

  f !== agPosY && (f = agPosY, agHeight, fnUpdateProgress());
}

function fnUpdateProgress() {
  var agTop = agTimelineItem.last().find(agTimelinePoint).offset().top;
      i = agTop + agPosY - $(window).scrollTop();
      a = agTimelineLineProgress.offset().top + agPosY - $(window).scrollTop();
      n = agPosY - a + agOuterHeight / 2;
      i <= agPosY + agOuterHeight / 2 && (n = i - a);

  agTimelineLineProgress.css({height: n + 'px'});

  agTimelineItem.each(function () {
  var agTop = $(this).find(agTimelinePoint).offset().top;
  
  (agTop + agPosY - $(window).scrollTop()) < agPosY + .5 * agOuterHeight ? $(this).addClass('js-ag-active') : $(this).removeClass('js-ag-active');
  })
}

function fnUpdateFrame() {
  agFlag || requestAnimationFrame(fnUpdateWindow);
  agFlag = true;
}

function smoothScrollingTimeline(lastScrollY) {
  const scrollingDown = window.scrollY > lastScrollY;
  lastScrollY = window.scrollY;
   document.documentElement.dataset.scrollDirection = scrollingDown ? 'down' : 'up';
}

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.js-timeline_item');

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -10% 0px'
  };

  const observerScrolling = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const scrollingDown = document.documentElement.dataset.scrollDirection === 'down';
      if (entry.isIntersecting && scrollingDown) {
        entry.target.classList.add('js-ag-active');
      } else if (!entry.isIntersecting && !scrollingDown) {
        entry.target.classList.remove('js-ag-active');
      }
    });
  }, observerOptions);

  items.forEach(item => observerScrolling.observe(item));
});
