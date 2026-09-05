
// ============================================================
// GLOBAL SCROLL HANDLER
// ============================================================

let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {

  if (!ticking) {
    window.requestAnimationFrame(updateOnScroll);
    ticking = true;
  }

}

function updateOnScroll() {

  // Determine scroll direction
  smoothScrollingTimeline();

  // Update timeline
  fnOnScroll();

  // Update cards
  updateActiveCard();

  ticking = false;
}


// Scroll
window.addEventListener('scroll', onScroll, { passive: true });

// Resize
window.addEventListener('resize', () => {

  fnOnResize();
  updateActiveCard();

});


// ============================================================
// TIMELINE
// ============================================================

var agTimeline = $('.js-timeline'),
    agTimelineLine = $('.js-timeline_line'),
    agTimelineLineProgress = $('.js-timeline_line-progress'),
    agTimelinePoint = $('.js-timeline-card_point-box'),
    agTimelineItem = $('.js-timeline_item'),

    agOuterHeight = $(window).outerHeight(),
    agHeight = $(window).height(),

    agPosY = $(window).scrollTop(),

    f = -1,
    agFlag = false;


// ============================================================
// SCROLL
// ============================================================

function fnOnScroll() {

  agPosY = $(window).scrollTop();

  fnUpdateFrame();

}


// ============================================================
// RESIZE
// ============================================================

function fnOnResize() {

  agPosY = $(window).scrollTop();

  // Current viewport height
  agHeight = $(window).height();
  agOuterHeight = $(window).outerHeight();

  fnUpdateFrame();

}


// ============================================================
// TIMELINE FRAME
// ============================================================

function fnUpdateWindow() {

  agFlag = false;

  // update timeline-line
  if (
    agTimelineItem.length &&
    agTimelinePoint.length &&
    agTimeline.length
  ) {

    agTimelineLine.css({

      top:
        agTimelineItem
          .first()
          .find(agTimelinePoint)
          .offset().top
        -
        agTimelineItem
          .first()
          .offset().top,

      bottom:
        agTimeline.offset().top
        +
        agTimeline.outerHeight()
        -
        agTimelineItem
          .last()
          .find(agTimelinePoint)
          .offset().top

    });

  }


  // Update timeline
  if (f !== agPosY) {

    f = agPosY;

    fnUpdateProgress();

  }

}


// ============================================================
// TIMELINE PROGRESS
// ============================================================

function fnUpdateProgress() {

  if (
    !agTimelineItem.length ||
    !agTimelineLineProgress.length
  ) {
    return;
  }


  var agTop =
    agTimelineItem
      .last()
      .find(agTimelinePoint)
      .offset().top;


  var i = agTop + agPosY - $(window).scrollTop();
  var a = agTimelineLineProgress.offset().top + agPosY - $(window).scrollTop();
  var n = agPosY - a + agOuterHeight / 2;


  if (i <= agPosY + agOuterHeight / 2) {
    n = i - a;
  }


  agTimelineLineProgress.css({
    height: n + 'px'
  });

}


// ============================================================
// FRAME REQUEST
// ============================================================

function fnUpdateFrame() {

  if (!agFlag) {
    requestAnimationFrame(fnUpdateWindow);
    agFlag = true;

  }

}


// ============================================================
// SCROLL DIRECTION
// ============================================================

function smoothScrollingTimeline() {

  const currentScrollY = window.scrollY;

  const scrollingDown =
    currentScrollY > lastScrollY;


  document.documentElement.dataset.scrollDirection =
    scrollingDown
      ? 'down'
      : 'up';


  lastScrollY = currentScrollY;

}


// ============================================================
// ACTIVE CARD
// ============================================================

function updateActiveCard() {

  const items =
    document.querySelectorAll('.js-timeline_item');


  const viewportHeight =
    window.innerHeight;


  const viewportCenter =
    viewportHeight / 2;


  // Scroll direction
  const direction =
    document.documentElement.dataset.scrollDirection;


  // ==========================================================
  // DOWN
  // ==========================================================

  if (direction === 'down') {

    items.forEach(item => {

      // Already active
      if (item.classList.contains('js-ag-active')) {
        return;
      }


      const card =
        item.querySelector('.ag-timeline-card_item');


      if (!card) {
        return;
      }


      const rect =
        card.getBoundingClientRect();


      // Card reached center of viewport
      if (rect.top <= viewportCenter) {

        item.classList.add('js-ag-active');

      }

    });

  }


  // ==========================================================
  // UP
  // ==========================================================

  if (direction === 'up') {

    const hideOffset = 150;

    // Remove last actived card first
    for (let i = items.length - 1; i >= 0; i--) {

      const item = items[i];


      if (!item.classList.contains('js-ag-active')) {
        continue;
      }


      const card =
        item.querySelector('.ag-timeline-card_item');


      if (!card) {
        continue;
      }


      const rect =
        card.getBoundingClientRect();


      // Card is only removed with offset
      if (rect.top + hideOffset > viewportCenter) {

        item.classList.remove('js-ag-active');

        // Only remove on card at a time
        break;

      }

    }

  }

}


// ============================================================
// INIT
// ============================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    // Init timeline
    fnOnResize();

    // Init cards
    updateActiveCard();

  }
);

