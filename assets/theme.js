/* ==========================================================================
   순간, 스튜디오 — 공용 라이트 테마 동작 스크립트
   전 페이지가 공유하는 헤더 스크롤 상태, 모바일 메뉴, 스크롤 리빌, 카운트업,
   플로팅 문의 버튼 로직만 담당한다. 페이지별 데이터 렌더링(갤러리/탭 등)은
   각 HTML 파일의 인라인 스크립트에 그대로 둔다.
   ========================================================================== */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 헤더: transparentAtTop이 true면(index 히어로) scrollY>80에서 밝은 상태로 전환.
  // false/미지정이면(서브페이지) 처음부터 밝은 상태로 고정.
  function initHeader({ transparentAtTop = false } = {}) {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    if (!transparentAtTop) {
      header.classList.add('is-scrolled');
      return;
    }
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 80);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  }

  // 이미지에만 우클릭 방지, 일반 텍스트 영역은 우클릭 유지
  function initImageProtection() {
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'IMG' || e.target.classList.contains('img-shield')) {
        e.preventDefault();
      }
    });
  }

  // 스크롤 리빌: 뷰포트 진입 시 1회만 revealed 클래스 부여 (역방향 스크롤 재실행 없음)
  let revealObserver = null;
  function observeReveal(el) {
    if (prefersReducedMotion) {
      el.classList.add('revealed');
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
    }
    revealObserver.observe(el);
  }
  function initReveal() {
    document.querySelectorAll('.reveal').forEach(observeReveal);
  }

  // 숫자 카운트업 (뷰포트 진입 시 1.2초, 1회만)
  function runCountUp(el) {
    const target = parseFloat(el.dataset.count);
    if (prefersReducedMotion || isNaN(target)) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }
  function initCountUp() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCountUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    els.forEach((el) => countObserver.observe(el));
  }

  // 플로팅 문의 버튼: scrollY>400 이후 페이드인
  function initFloatingButton() {
    const btn = document.getElementById('floatingMailBtn');
    if (!btn) return;
    function update() {
      const show = window.scrollY > 400;
      btn.classList.toggle('opacity-0', !show);
      btn.classList.toggle('pointer-events-none', !show);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  window.Theme = {
    initHeader,
    initMobileMenu,
    initImageProtection,
    initReveal,
    observeReveal,
    initCountUp,
    initFloatingButton,
    prefersReducedMotion,
  };
})();
