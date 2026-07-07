// 사이트 전체 공통 플로팅 "문의하기" 버튼.
// 각 페이지 </body> 직전에 이 스크립트를 포함하면 자동으로 버튼이 삽입된다.
// (다른 페이지 스크립트가 lightbox/theater 모달을 열고 닫는 로직은 건드리지
// 않고, 해당 요소의 style 변화를 관찰만 해서 모달이 열려 있는 동안 숨긴다.)
(() => {
  // TODO: 실제 구글폼 URL로 교체하세요.
  const QUOTE_FORM_URL = 'https://forms.gle/REPLACE_WITH_REAL_FORM_URL';

  // 모바일에서 버튼이 콘텐츠(특히 갤러리 하단)를 가리지 않도록 페이지
  // 하단에 여백을 확보 (버튼 자체 높이 + 여백만큼)
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 767px) {
      body { padding-bottom: 76px; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('a');
  btn.id = 'floatingQuoteBtn';
  btn.href = QUOTE_FORM_URL;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', '문의하기');
  btn.className = [
    'fixed z-[9999] bottom-4 right-4 md:bottom-6 md:right-6',
    'inline-flex items-center gap-1.5 md:gap-2',
    'bg-[#8C7A6B] text-white',
    'text-xs md:text-sm font-semibold',
    'pl-3.5 pr-4 py-2.5 md:pl-5 md:pr-6 md:py-3.5',
    'rounded-full shadow-lg',
    'hover:scale-105 hover:shadow-2xl',
    'transition-all duration-300',
  ].join(' ');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 md:w-[18px] md:h-[18px]">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
    </svg>
    <span>문의하기</span>
  `;

  // position:fixed는 조상 요소에 transform/filter/perspective/will-change가
  // 있으면 뷰포트가 아닌 그 조상 기준으로 고정되어 스크롤을 따라오지 않는
  // 것처럼 보일 수 있다. 이를 원천 차단하기 위해 항상 <body> 바로 아래
  // 직속 자식으로 붙이고, 핵심 위치 속성은 인라인 스타일로도 강제한다
  // (Tailwind 클래스가 어떤 이유로 씹히더라도 항상 우선 적용됨).
  document.body.appendChild(btn);
  btn.style.position = 'fixed';
  btn.style.zIndex = '9999';

  function applyResponsiveOffset() {
    const isMobile = window.innerWidth < 768;
    btn.style.bottom = isMobile ? '16px' : '24px';
    btn.style.right = isMobile ? '16px' : '24px';
  }
  applyResponsiveOffset();
  window.addEventListener('resize', applyResponsiveOffset);

  function isModalOpen(el) {
    return !!el && getComputedStyle(el).display !== 'none';
  }

  function updateVisibility() {
    const open = isModalOpen(document.getElementById('lightbox')) || isModalOpen(document.getElementById('theater'));
    btn.style.display = open ? 'none' : '';
  }

  ['lightbox', 'theater'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      new MutationObserver(updateVisibility).observe(el, { attributes: true, attributeFilter: ['style'] });
    }
  });

  updateVisibility();
})();
