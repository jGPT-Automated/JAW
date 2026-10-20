(() => {
  const byId = id => document.getElementById(id);
  const filter = byId('filter');
  const threads = [...document.querySelectorAll('.thread')];
  const applyFilter = () => {
    const value = filter.value.trim().toLowerCase();
    let count = 0;
    for (const thread of threads) {
      thread.hidden = Boolean(value) && !thread.dataset.search.includes(value);
      if (!thread.hidden) count++;
    }
    byId('filter-status').textContent = value ? `${count} matching ${count === 1 ? 'thread' : 'threads'}.` : '';
    const url = new URL(location.href);
    if (value) url.searchParams.set('thread', filter.value); else url.searchParams.delete('thread');
    history.replaceState(null, '', url);
  };
  filter.value = new URL(location.href).searchParams.get('thread') || '';
  applyFilter();
  filter.addEventListener('input', applyFilter);
  byId('thread-filter').addEventListener('submit', event => event.preventDefault());
  byId('thread-filter').addEventListener('reset', () => { filter.value = ''; applyFilter(); });
  document.querySelectorAll('aside a[href^="#thread-"]').forEach(anchor => anchor.addEventListener('click', () => {
    filter.value = ''; applyFilter();
  }));

  const form = byId('reply-form');
  const key = 'localcheck-thread-log-draft-v1';
  const fields = ['reply-thread','reply-type','reply-question','reply-body'];
  let unsaved = false;
  const draft = () => ({thread:byId('reply-thread').value,type:byId('reply-type').value,entry:byId('reply-question').value.trim(),body:byId('reply-body').value,recorded_at:new Date().toISOString(),source:location.origin+'/localcheck/threads.html#thread-'+byId('reply-thread').value});
  const saveDraft = () => {
    const hasText = Boolean(byId('reply-body').value.trim());
    try {
      localStorage.setItem(key, JSON.stringify(draft()));
      unsaved = false;
      byId('draft-status').textContent = hasText ? 'Draft saved on this device. Publish on GitHub to add it to the shared record.' : 'No answer entered.';
    } catch {
      unsaved = hasText;
      byId('draft-status').textContent = 'This browser could not save the draft. Use Download draft before leaving.';
    }
  };
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved) {
      const values = [saved.thread,saved.type,saved.entry,saved.body];
      fields.forEach((id,i) => { if (typeof values[i] === 'string') byId(id).value = values[i]; });
      if (saved.body?.trim()) byId('draft-status').textContent = 'Restored your device draft. It is not a published reply yet.';
    }
  } catch { byId('draft-status').textContent = 'No recoverable device draft. You can still publish or download your answer.'; }
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    saveDraft();
    const d = draft();
    const title = `[LocalCheck log] ${d.type} · ${d.thread}`;
    const body = `Thread: ${byId('reply-thread').selectedOptions[0].textContent}\nThread ID: ${d.thread}\nRecord type: ${d.type}\nQuestion / entry: ${d.entry || 'General thread reply'}\nDrafted: ${d.recorded_at}\nSource log: ${d.source}\n\n${d.body}`;
    const url = new URL('https://github.com/jGPT-Automated/JAW/issues/new');
    url.searchParams.set('title', title); url.searchParams.set('body', body);
    const opened = window.open(url.toString(), '_blank', 'noopener');
    byId('draft-status').textContent = 'Draft retained. Finish GitHub’s Submit new issue step to publish; then Refresh published replies here.';
    if (!opened) {
      const a = document.createElement('a'); a.href=url; a.target='_blank'; a.rel='noopener'; a.textContent='Open the GitHub publishing page';
      byId('draft-status').append(' ', a);
    }
  });
  byId('download-reply').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(draft(), null, 2)], {type:'application/json'}));
    a.download = 'localcheck-log-reply.json'; a.click(); URL.revokeObjectURL(a.href);
  });
  addEventListener('beforeunload', event => { if (unsaved) { event.preventDefault(); event.returnValue=''; } });

  byId('refresh-replies').addEventListener('click', async () => {
    const button = byId('refresh-replies'); button.disabled = true;
    byId('reply-status').textContent = 'Loading published replies…';
    const query = 'repo:jGPT-Automated/JAW is:issue "[LocalCheck log]" in:title';
    try {
      const response = await fetch('https://api.github.com/search/issues?q='+encodeURIComponent(query)+'&sort=created&order=asc&per_page=100', {headers:{Accept:'application/vnd.github+json'}});
      if (!response.ok) throw new Error(response.status === 403 || response.status === 429 ? 'GitHub’s read limit was reached. Open All published replies on GitHub, or try later.' : 'GitHub replies are unavailable right now. Open All published replies on GitHub.');
      const result = await response.json();
      byId('shared-replies').replaceChildren();
      for (const issue of result.items) {
        const article=document.createElement('article'); article.className='response';
        const a=document.createElement('a'); a.href=issue.html_url; a.textContent=issue.title;
        const h=document.createElement('h3'); h.append(a);
        const meta=document.createElement('p'); meta.className='muted'; meta.textContent=`Published by ${issue.user.login} · ${new Date(issue.created_at).toLocaleString('en-US',{timeZone:'America/Chicago'})} America/Chicago`;
        const p=document.createElement('p'); p.textContent=issue.body || 'Open the published reply to read its discussion.';
        article.append(h,meta,p); byId('shared-replies').append(article);
      }
      byId('reply-status').textContent = result.total_count ? `${result.items.length} published replies shown in creation order. GitHub preserves the author and discussion.` : 'No published replies yet. Device drafts are not included here.';
    } catch (error) { byId('reply-status').textContent = error.message; }
    finally { button.disabled=false; }
  });
})();
