async function includeHtml(targetId, file) {
  const el = document.getElementById(targetId);
  if (!el) throw new Error(`Target #${targetId} nicht gefunden`);

  const res = await fetch(file, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Fehler beim Laden: ${file} (${res.status})`);

  const html = await res.text();
  el.innerHTML = html;

  return el;
}

window.includeHtml = includeHtml;