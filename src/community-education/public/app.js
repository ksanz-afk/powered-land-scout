(() => {
  'use strict';

  const root = document.getElementById('ce-brief');
  if (!root) return;

  const find = selector => root.querySelector(selector);
  const evidence = window.communityEducationEvidence || [];
  const dialog = find('#evidence-dialog');
  const contactDialog = find('#contact-dialog');
  let evidenceOpener = null;

  const emit = detail => root.dispatchEvent(new CustomEvent('education:change', {
    bubbles: true,
    detail
  }));

  function element(tag, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // Emphasis uses text nodes so source text is never interpreted as HTML.
  function appendEmphasis(node, text, phrases, tag, className = '') {
    let cursor = 0;
    for (const phrase of phrases) {
      const start = text.indexOf(phrase, cursor);
      if (start < 0) continue;
      node.append(
        document.createTextNode(text.slice(cursor, start)),
        element(tag, className, phrase)
      );
      cursor = start + phrase.length;
    }
    node.append(document.createTextNode(text.slice(cursor)));
  }

  function selectSource(id) {
    const source = evidence.find(item => item.id === id);
    if (!source) return;

    find('#source-nav').querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.sourceId === id));
    });

    const detail = find('#source-detail');
    detail.replaceChildren();

    const preview = element('div', 'document-preview');
    const thumbnail = element('button', 'document-thumb');
    thumbnail.type = 'button';
    thumbnail.setAttribute('aria-label', `See supporting passage from ${source.publisher}`);
    thumbnail.setAttribute('aria-controls', 'supporting-passage');
    thumbnail.setAttribute('aria-expanded', 'false');
    const image = element('img');
    image.src = source.preview;
    image.alt = source.previewAlt;
    image.decoding = 'async';
    thumbnail.append(image, element('span', 'preview-invitation', 'See the cited passage ↗'));
    preview.append(thumbnail, element('p', 'preview-caption', source.previewLabel));

    const metadata = element('div', 'source-meta');
    metadata.append(
      element('span', 'source-tag', source.status || source.category),
      element('span', '', source.scope)
    );
    const citation = element('div', 'source-citation');
    citation.append(element('strong', '', source.publisher), element('span', '', source.date));
    const finding = element('p', 'source-finding');
    appendEmphasis(finding, source.finding, source.findingHighlights || [], 'strong', 'finding-emphasis');
    const reading = element('div', 'evidence-reading');
    reading.append(
      metadata,
      element('h3', 'evidence-question', source.question),
      element('p', 'reading-label', 'OUR READING'),
      finding,
      citation
    );
    const feature = element('div', 'evidence-feature');
    feature.append(preview, reading);

    const passage = element('details', 'passage-disclosure');
    passage.id = 'supporting-passage';
    const summary = element('summary');
    summary.append(
      element('span', '', 'See the supporting passage'),
      element('span', 'passage-page', `PDF page ${source.excerptPage}`)
    );
    const quote = element('blockquote');
    quote.append(document.createTextNode('“'));
    appendEmphasis(quote, source.excerpt, [source.highlight], 'mark');
    quote.append(document.createTextNode('”'));
    const passageBody = element('div', 'passage-body');
    passageBody.append(
      element('p', 'reading-label', 'SOURCE WORDS · HIGHLIGHT ADDED'),
      quote,
      element('p', 'passage-location', source.location)
    );
    if (source.passageNote) {
      passageBody.append(element('p', 'passage-location', source.passageNote));
    }
    passage.append(summary, passageBody);
    passage.addEventListener('toggle', () => {
      thumbnail.setAttribute('aria-expanded', String(passage.open));
    });
    thumbnail.addEventListener('click', () => {
      passage.open = true;
      summary.focus({ preventScroll: true });
      passage.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });

    const original = element('a', 'original-link', 'Open original source ↗');
    original.href = source.url;
    original.target = '_blank';
    original.rel = 'noopener noreferrer';
    const provenance = element('details', 'document-details');
    provenance.append(
      element('summary', '', 'About this document'),
      element('h4', '', source.title),
      element('p', '', `${source.publisher}${source.authors ? ` · ${source.authors}` : ''}`),
      element('p', '', source.limitation),
      element('p', '', source.provenance),
      element('p', '', `Supplied document: ${source.sourceFile}`),
      element('p', '', 'Example scope: a US company commitment and separate Virginia policy example, reviewed November 19, 2026. No individual site assessed. The grid illustration is conceptual and shows no measured flows or costs.')
    );
    const footer = element('div', 'document-footer');
    footer.append(provenance, original);
    detail.append(feature, passage, footer);
    if (dialog.open) dialog.scrollTop = 0;
    emit({ view: 'brief', source: id });
  }

  for (const id of ['government', 'regulator', 'company', 'research']) {
    const source = evidence.find(item => item.id === id);
    if (!source) continue;
    const button = element('button', 'source-option');
    button.type = 'button';
    button.dataset.sourceId = id;
    button.setAttribute('aria-pressed', 'false');
    button.append(element('strong', '', source.category), element('span', '', source.publisher));
    button.addEventListener('click', () => selectSource(id));
    find('#source-nav').append(button);
  }

  function openEvidence(id, trigger) {
    evidenceOpener = trigger;
    selectSource(id);
    dialog.showModal();
    dialog.scrollTop = 0;
    find('#close-evidence').focus();
  }

  root.querySelectorAll('[data-source]').forEach(button => {
    button.addEventListener('click', () => openEvidence(button.dataset.source, button));
  });
  find('#view-evidence').addEventListener('click', event => {
    openEvidence('government', event.currentTarget);
  });
  find('#close-evidence').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    evidenceOpener?.focus();
    emit({ view: 'brief', source: null });
  });

  find('#open-contact').addEventListener('click', () => {
    contactDialog.showModal();
    contactDialog.scrollTop = 0;
    find('#close-contact').focus();
    emit({ view: 'contact', source: null });
  });
  find('#close-contact').addEventListener('click', () => contactDialog.close());
  contactDialog.addEventListener('close', () => {
    find('#open-contact').focus();
    emit({ view: 'brief', source: null });
  });
})();
