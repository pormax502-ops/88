// ==UserScript==
// @name         视频嗅探助手
// @namespace    video-detector
// @version      3.0
// @description  极简悬浮图标，一键复制视频地址
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  if (window.__miniVideoCopy) return;
  window.__miniVideoCopy = true;

  const svg = (check = false) => `
    <svg viewBox="0 0 24 24" width="16" height="16"
      fill="none" stroke="white" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
      ${check
        ? '<path d="m5 12 4 4L19 6"/>'
        : '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'}
    </svg>`;

  const button = document.createElement('button');
  button.innerHTML = svg();
  button.title = 'Copy video URL';
  button.style.cssText = `
    position:fixed;
    right:12px;
    bottom:115px;
    width:30px;
    height:30px;
    padding:0;
    border:0;
    border-radius:50%;
    background:rgba(25,25,25,.55);
    display:flex;
    align-items:center;
    justify-content:center;
    opacity:.65;
    z-index:2147483647;
    -webkit-tap-highlight-color:transparent;
  `;

  (document.body || document.documentElement).appendChild(button);

  function getVideoURL() {
    const videos = [...document.querySelectorAll('video')];

    const active = videos.find(v =>
      !v.paused && v.currentSrc
    );

    const video = active ||
      videos.find(v => v.currentSrc) ||
      videos.find(v => v.src);

    const url = video?.currentSrc || video?.src || '';

    return /^https?:\/\//i.test(url) ? url : '';
  }

  button.addEventListener('click', () => {
    const url = getVideoURL();
    if (!url) return;

    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(url);
        button.innerHTML = svg(true);
        setTimeout(() => {
          if (button.isConnected) button.innerHTML = svg();
        }, 900);
      } else {
        navigator.clipboard.writeText(url).then(() => {
          button.innerHTML = svg(true);
          setTimeout(() => {
            if (button.isConnected) button.innerHTML = svg();
          }, 900);
        });
      }
    } catch (e) {
      console.error('Copy failed:', e);
    }
  });
})();
